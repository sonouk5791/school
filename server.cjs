const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ── .env 파일 로드 ─────────────────────────────────────────────
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [k, ...v] = trimmed.split('=');
      if (k && v.length) process.env[k.trim()] = v.join('=').trim();
    }
  });
}

const scanWelcomeRecordings = require('./scripts/welcome-recordings.cjs');
const PORT = Number(process.env.PORT) || 8085;
const TYPECAST_API_KEY = process.env.TYPECAST_API_KEY || 'tc_681059782dc4759327e3d302';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Typecast-API-Key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0];

  if(reqPath === '/api/tts'){require('./api/tts.js')(req,res);return;}

  // ── 1. 타입캐스트 TTS 프록시 API ────────────────────────────
  if (reqPath === '/api/tts/typecast' && req.method === 'POST') {
    handleTypecastTTS(req, res);
    return;
  }

  if (reqPath === '/character-recordings.json') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(require('./scripts/character-recordings.cjs')(__dirname)));
    return;
  }

  if (reqPath === '/welcome-recordings.json') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(scanWelcomeRecordings(__dirname)));
    return;
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, decodeURIComponent(reqPath));

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (req.headers.range && ['.mp4', '.webm'].includes(ext)) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      const start = match ? Number(match[1]) : -1;
      const end = match && match[2] ? Math.min(Number(match[2]), stats.size - 1) : stats.size - 1;
      if (start < 0 || start >= stats.size || end < start) {
        res.writeHead(416, { 'Content-Range': `bytes */${stats.size}` });
        res.end();
        return;
      }
      res.writeHead(206, {
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Content-Length': end - start + 1
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

/**
 * 타입캐스트 API 호출 및 오디오 스트림 프록시 핸들러
 */
function handleTypecastTTS(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let payload = {};
    try {
      payload = JSON.parse(body || '{}');
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '잘못된 JSON 형식입니다.' }));
      return;
    }

    const text = payload.text || '';
    const actorId = payload.actor_id || '60a761917fba305a2b1660d3'; // 호빈이
    const apiKey = req.headers['x-typecast-api-key'] || TYPECAST_API_KEY;

    if (!text) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'text 필드는 필수입니다.' }));
      return;
    }

    const requestData = JSON.stringify({
      text: text,
      lang: payload.lang || 'ko',
      actor_id: actorId,
      x情感: payload.emotion || 'normal',
      tempo: payload.tempo || 0.85, // 시니어 85% 속도
      pitch: payload.pitch || 0,
      volume: payload.volume || 100,
      model_version: 'latest',
    });

    const apiReq = https.request('https://typecast.ai/api/speak', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
      },
    }, (apiRes) => {
      const contentType = apiRes.headers['content-type'] || '';
      if (contentType.includes('audio') || contentType.includes('octet-stream')) {
        res.writeHead(apiRes.statusCode, {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'no-cache',
        });
        apiRes.pipe(res);
        return;
      }

      let apiBody = '';
      apiRes.on('data', chunk => { apiBody += chunk; });
      apiRes.on('end', () => {
        try {
          const jsonRes = JSON.parse(apiBody);
          if (jsonRes.result && jsonRes.result.audio_download_url) {
            https.get(jsonRes.result.audio_download_url, (streamRes) => {
              res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
              streamRes.pipe(res);
            });
            return;
          }
          res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(apiBody);
        } catch (e) {
          res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(apiBody);
        }
      });
    });

    apiReq.on('error', (err) => {
      console.error('[Typecast] API 요청 오류:', err);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '타입캐스트 서버 통신 실패: ' + err.message }));
    });

    apiReq.write(requestData);
    apiReq.end();
  });
}

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server listening on http://127.0.0.1:${PORT} (Typecast API Key: ✅ Configured)`);
});
