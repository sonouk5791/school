const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function encodePng(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0 (None)
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * (1 + width * 4);
    scanlines[scanlineOffset] = 0; // filter None
    rgbaBuffer.copy(scanlines, scanlineOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function decodePngRgba(buf) {
  let pos = 8;
  let width, height;
  const idatChunks = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const rawRgba = Buffer.alloc(width * height * 4);
  const bpp = 4;
  const rowBytes = width * bpp;

  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * (rowBytes + 1)];
    const rowIn = y * (rowBytes + 1) + 1;
    const rowOut = y * rowBytes;
    const prevRowOut = (y - 1) * rowBytes;

    for (let x = 0; x < rowBytes; x++) {
      const byte = decompressed[rowIn + x];
      const left = x >= bpp ? rawRgba[rowOut + x - bpp] : 0;
      const up = y > 0 ? rawRgba[prevRowOut + x] : 0;
      const upLeft = (y > 0 && x >= bpp) ? rawRgba[prevRowOut + x - bpp] : 0;

      let val = 0;
      if (filter === 0) val = byte;
      else if (filter === 1) val = (byte + left) & 0xFF;
      else if (filter === 2) val = (byte + up) & 0xFF;
      else if (filter === 3) val = (byte + Math.floor((left + up) / 2)) & 0xFF;
      else if (filter === 4) val = (byte + paeth(left, up, upLeft)) & 0xFF;

      rawRgba[rowOut + x] = val;
    }
  }

  return { width, height, rawRgba };
}

// Main execution
const srcPath = 'C:/Users/박순옥/.gemini/antigravity-ide/brain/08650409-dfc2-47f4-a5a1-3cfc319ff8f6/.user_uploaded/media_1790402393746.png';
const srcBuf = fs.readFileSync(srcPath);

// Also copy whole banner to assets/images
const targetBanner = path.join(__dirname, '../assets/images/characters-uniform-banner.png');
fs.copyFileSync(srcPath, targetBanner);
console.log('Copied whole banner to:', targetBanner);

const { width, height, rawRgba } = decodePngRgba(srcBuf);

// Crop 4 characters
// Image is 1024x443
// The shelf is roughly at y=320, text below.
// Let's crop from y=10 to y=330 for character bodies.
const CHAR_CROP_CONFIGS = [
  { name: 'kongi', x: 25, y: 15, w: 230, h: 320 },
  { name: 'tori',  x: 275, y: 15, w: 225, h: 320 },
  { name: 'nabi',  x: 520, y: 15, w: 220, h: 320 },
  { name: 'bori',  x: 755, y: 15, w: 235, h: 320 }
];

// Flood-fill transparency from corners for pixels matching background cream
function makeBackgroundTransparent(w, h, rgba) {
  const visited = new Uint8Array(w * h);
  const queue = [];

  function isBg(x, y) {
    const idx = (y * w + x) * 4;
    const r = rgba[idx], g = rgba[idx + 1], b = rgba[idx + 2];
    // Background cream: r around 225-255, g around 220-255, b around 205-245
    // But character white parts (e.g. Kongi's face, Tori's body) have high brightness and white/pink
    // Check if close to cream #F4EFE6 or window line #E8DFCE
    const dist = Math.sqrt((r - 245) ** 2 + (g - 240) ** 2 + (b - 230) ** 2);
    const distWindow = Math.sqrt((r - 232) ** 2 + (g - 223) ** 2 + (b - 206) ** 2);
    const distFloor = Math.sqrt((r - 234) ** 2 + (g - 221) ** 2 + (b - 198) ** 2);
    return dist < 35 || distWindow < 30 || distFloor < 30;
  }

  // Push 4 border lines
  for (let x = 0; x < w; x++) {
    if (isBg(x, 0)) queue.push((0 * w + x));
    if (isBg(x, h - 1)) queue.push(((h - 1) * w + x));
  }
  for (let y = 0; y < h; y++) {
    if (isBg(0, y)) queue.push((y * w + 0));
    if (isBg(w - 1, y)) queue.push((y * w + (w - 1)));
  }

  let head = 0;
  while (head < queue.length) {
    const p = queue[head++];
    if (visited[p]) continue;
    visited[p] = 1;

    const px = p % w;
    const py = Math.floor(p / w);

    // Make transparent
    const idx = p * 4;
    rgba[idx + 3] = 0;

    // Check 4 neighbors
    const neighbors = [
      [px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const np = ny * w + nx;
        if (!visited[np] && isBg(nx, ny)) {
          queue.push(np);
        }
      }
    }
  }
}

for (const cfg of CHAR_CROP_CONFIGS) {
  const cropBuf = Buffer.alloc(cfg.w * cfg.h * 4);
  for (let cy = 0; cy < cfg.h; cy++) {
    const srcY = cfg.y + cy;
    for (let cx = 0; cx < cfg.w; cx++) {
      const srcX = cfg.x + cx;
      const srcIdx = (srcY * width + srcX) * 4;
      const dstIdx = (cy * cfg.w + cx) * 4;
      cropBuf[dstIdx] = rawRgba[srcIdx];
      cropBuf[dstIdx + 1] = rawRgba[srcIdx + 1];
      cropBuf[dstIdx + 2] = rawRgba[srcIdx + 2];
      cropBuf[dstIdx + 3] = rawRgba[srcIdx + 3];
    }
  }

  const encoded = encodePng(cfg.w, cfg.h, cropBuf);
  const outPath = path.join(__dirname, `../assets/images/uniform-${cfg.name}.png`);
  fs.writeFileSync(outPath, encoded);
  console.log(`Saved uniform-${cfg.name}.png (${cfg.w}x${cfg.h}) to ${outPath}`);
}
