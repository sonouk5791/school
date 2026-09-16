const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ffmpeg = process.env.FFMPEG_PATH || path.resolve('.video-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe');
const inputImg = 'C:/Users/windows/.gemini/antigravity-ide/brain/63d5390d-8682-45a5-b2cb-7e0304fcc83e/.user_uploaded/media_1789458662647.png';

const res = spawnSync(ffmpeg, ['-i', inputImg, '-f', 'rawvideo', '-pix_fmt', 'rgba', 'pipe:1'], { maxBuffer: 50 * 1024 * 1024 });
const buf = Buffer.from(res.stdout);
const W = 1024, H = 682;

function pixel(x, y) {
  if (x < 0 || x >= W || y < 0 || y >= H) return [0, 0, 0, 0];
  const idx = (y * W + x) * 4;
  return [buf[idx], buf[idx+1], buf[idx+2], buf[idx+3]];
}

// 1. Isolate Kong-i
const kongiBuf = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const a = buf[idx + 3];
    if (a < 15) continue;

    let take = false;
    if (x < 280) {
      take = true;
    } else if (x <= 326) {
      // Tori's ear is at y < 220, x > 286
      // Kong-i's brown ear ends at x=286
      if (y < 230) {
        take = false;
      } else if (y >= 230 && y < 350) {
        // Kong-i's cheek/ear: check brown/beige vs pink/white
        const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
        if (x < 304 && (r > g && g > b)) take = true;
      } else if (y >= 350 && y <= 540) {
        // Kong-i's hand (yellow sleeve + paw)
        if (x <= 325) {
          const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
          // Tori's pink tracksuit has r > 200, g < 160, b < 170
          const isPink = r > 180 && g < 155 && b < 170;
          if (!isPink) take = true;
        }
      }
    }

    if (take) {
      kongiBuf[idx] = buf[idx];
      kongiBuf[idx + 1] = buf[idx + 1];
      kongiBuf[idx + 2] = buf[idx + 2];
      kongiBuf[idx + 3] = buf[idx + 3];
    }
  }
}

// 2. Isolate Tori
const toriBuf = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const a = buf[idx + 3];
    if (a < 15) continue;

    let take = false;
    // Tori is between x=288 and x=525
    if (x >= 288 && x <= 525) {
      // Exclude Kong-i on left:
      let isKongi = false;
      if (x <= 325 && y >= 350 && y <= 540) {
        const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
        // Kong-i yellow tracksuit or beige paw: yellow has r > 200, g > 150, b < 100
        if ((r > 190 && g > 145 && b < 110) || (r > 180 && g > 160 && b > 120 && r < 240)) {
          isKongi = true;
        }
      } else if (x < 304 && y >= 230 && y < 350) {
        // Kong-i brown ear
        const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
        if (r > 100 && g < 100 && b < 70) isKongi = true;
      }

      // Exclude Nabi on right (x > 480):
      let isNabi = false;
      if (x >= 485) {
        const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
        // Nabi's purple suit (b > r, b > g) or Nabi's gray/orange face
        const isPurple = (b > r && b > 180) || (b > 150 && g < 150);
        const isGray = (r < 130 && g < 130 && b < 130);
        const isOrange = (r > 180 && g > 100 && b < 100);
        if (isPurple || isGray || isOrange || x > 515) {
          isNabi = true;
        }
      }

      if (!isKongi && !isNabi) take = true;
    }

    if (take) {
      toriBuf[idx] = buf[idx];
      toriBuf[idx + 1] = buf[idx + 1];
      toriBuf[idx + 2] = buf[idx + 2];
      toriBuf[idx + 3] = buf[idx + 3];
    }
  }
}

// 3. Isolate Nabi
const nabiBuf = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const a = buf[idx + 3];
    if (a < 15) continue;

    let take = false;
    // Nabi is between x=485 and x=725
    if (x >= 485 && x <= 725) {
      // Exclude Tori on left:
      let isTori = false;
      if (x < 520) {
        const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
        const isPink = (r > 190 && g < 160 && b < 170);
        if (isPink) isTori = true;
      }

      // Exclude Bori on right (x > 675):
      let isBori = false;
      if (x >= 675) {
        const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
        // Bori is brown bear with blue suit: blue has b > 200, r < 120
        // Brown bear fur has r > 140, g > 80, b < 60
        const isBlue = (b > 190 && r < 120);
        const isBrown = (r > 130 && g > 70 && b < 60);
        if (isBlue || isBrown || x > 715) isBori = true;
      }

      if (!isTori && !isBori) take = true;
    }

    if (take) {
      nabiBuf[idx] = buf[idx];
      nabiBuf[idx + 1] = buf[idx + 1];
      nabiBuf[idx + 2] = buf[idx + 2];
      nabiBuf[idx + 3] = buf[idx + 3];
    }
  }
}

// 4. Isolate Bori
const boriBuf = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const a = buf[idx + 3];
    if (a < 15) continue;

    let take = false;
    // Bori is from x=675 to W-1
    if (x >= 675) {
      let isNabi = false;
      if (x < 725) {
        const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
        // Nabi purple suit or white cat cheek
        const isPurple = (b > 170 && r > 130 && g < 160 && b > g);
        if (isPurple) isNabi = true;
      }
      if (!isNabi) take = true;
    }

    if (take) {
      boriBuf[idx] = buf[idx];
      boriBuf[idx + 1] = buf[idx + 1];
      boriBuf[idx + 2] = buf[idx + 2];
      boriBuf[idx + 3] = buf[idx + 3];
    }
  }
}

function saveCropped(charBuf, filename) {
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const a = charBuf[(y * W + x) * 4 + 3];
      if (a > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  const dim = Math.max(cw, ch) + 48;
  const out = Buffer.alloc(dim * dim * 4);

  const ox = Math.round((dim - cw) / 2);
  const oy = Math.round((dim - ch) / 2);

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const s = ((minY + y) * W + (minX + x)) * 4;
      const d = ((oy + y) * dim + (ox + x)) * 4;
      out[d] = charBuf[s];
      out[d + 1] = charBuf[s + 1];
      out[d + 2] = charBuf[s + 2];
      out[d + 3] = charBuf[s + 3];
    }
  }

  const rawPath = path.resolve('.video-build/' + filename + '.rgba');
  fs.writeFileSync(rawPath, out);
  const pngPath = path.resolve('.video-build/' + filename + '.png');
  spawnSync(ffmpeg, ['-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${dim}x${dim}`, '-i', rawPath, '-c:v', 'png', pngPath]);
  console.log(`Saved ${filename}.png (dim=${dim}x${dim})`);
}

saveCropped(kongiBuf, 'kongi-3d');
saveCropped(toriBuf, 'tori-3d');
saveCropped(nabiBuf, 'nabi-3d');
saveCropped(boriBuf, 'bori-3d');
