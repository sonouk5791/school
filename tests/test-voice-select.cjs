const fs = require('fs');

const edgeRaw = fs.readFileSync('e:/sh/edge-dump.html', 'utf8');
const chromeRaw = fs.readFileSync('e:/sh/chrome-dump.html', 'utf8');

const edge = JSON.parse(edgeRaw.match(/<pre id="output">([\s\S]*?)<\/pre>/)[1]);
const chrome = JSON.parse(chromeRaw.match(/<pre id="output">([\s\S]*?)<\/pre>/)[1]);

function selectVoice(voices) {
  const korean = voices.filter(v => v.lang && (v.lang.startsWith('ko') || v.lang.includes('KR')));
  // 1. Edge Natural / SunHi
  const sunhi = korean.find(v => v.name.includes('SunHi') || (v.name.includes('Natural') && !v.name.includes('Desktop')));
  if (sunhi) return sunhi;
  // 2. Chrome Google Korean
  const google = korean.find(v => v.name.includes('Google'));
  if (google) return google;
  // 3. Any non-Heami online voice
  const online = korean.find(v => !v.name.includes('Heami') && !v.name.includes('Desktop'));
  if (online) return online;
  // 4. Fallback
  return korean[0] || null;
}

console.log('Edge 선택된 음성:', selectVoice(edge));
console.log('Chrome 선택된 음성:', selectVoice(chrome));
