const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser window and DOM
global.window = global;
global.document = {
  addEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  createElement: (tag) => ({
    className: '',
    id: '',
    innerHTML: '',
    style: {},
    setAttribute: () => {},
    getAttribute: () => '',
    appendChild: () => {},
    append: () => {},
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  }),
  body: {
    append: () => {}
  }
};
global.MutationObserver = class {
  observe() {}
  disconnect() {}
};

// 1. Verify KaraokeEngine
require('../js/karaoke-synth.js');

const engine = window.KaraokeEngine;
assert(engine, 'KaraokeEngine must exist on window');
assert(Array.isArray(engine.SONGS), 'KaraokeEngine.SONGS must be an array');
assert(engine.SONGS.length >= 6, 'Must have at least 6 Trot/Classic songs in KaraokeEngine');

console.log(`Verified KaraokeEngine with ${engine.SONGS.length} Trot/Classic songs:`);
engine.SONGS.forEach((song, idx) => {
  console.log(`  [${idx + 1}] ${song.emoji} ${song.title} (Tempo: ${song.tempo}, Notes: ${song.notes.length})`);
  assert(song.title, `Song ${idx} must have title`);
  assert(song.emoji, `Song ${idx} must have emoji`);
  assert(song.themeBadge, `Song ${idx} must have themeBadge`);
  assert(song.tempo > 0, `Song ${idx} must have valid tempo`);
  assert(Array.isArray(song.notes) && song.notes.length > 5, `Song ${idx} must have notes`);
  
  // Verify image existence
  const imgPath = path.resolve(__dirname, '..', song.backgroundImg);
  assert(fs.existsSync(imgPath), `Background image must exist on disk: ${song.backgroundImg}`);
});

// Verify Trot titles
const titles = engine.SONGS.map(s => s.title);
assert(titles.includes('내 나이가 어때서'), 'Must include 내 나이가 어때서');
assert(titles.includes('남행열차'), 'Must include 남행열차');
assert(titles.includes('안동역에서'), 'Must include 안동역에서');
assert(titles.includes('찔레꽃'), 'Must include 찔레꽃');
assert(titles.includes('고향역'), 'Must include 고향역');
assert(titles.includes('홍시 (울 엄마)'), 'Must include 홍시 (울 엄마)');

// 2. Verify karaoke-room.js file contents and syntax
const roomJsPath = path.resolve(__dirname, '../js/karaoke-room.js');
assert(fs.existsSync(roomJsPath), 'karaoke-room.js must exist on disk');
const roomJsContent = fs.readFileSync(roomJsPath, 'utf8');
assert(roomJsContent.includes('karaoke-room-entry'), 'karaoke-room.js must define karaoke-room-entry');
assert(roomJsContent.includes('karaokeModalRoom'), 'karaoke-room.js must define karaokeModalRoom');
assert(roomJsContent.includes('btnKaraokeRoomPlay'), 'karaoke-room.js must define btnKaraokeRoomPlay');
assert(roomJsContent.includes('btnKaraokeRoomSingAi'), 'karaoke-room.js must define btnKaraokeRoomSingAi');
assert(roomJsContent.includes('UCZUhx8ClCv6paFW7qi3qljg'), 'karaoke-room.js must link TJ Karaoke channel');

// 3. Verify karaoke-room.css file contents
const roomCssPath = path.resolve(__dirname, '../css/karaoke-room.css');
assert(fs.existsSync(roomCssPath), 'karaoke-room.css must exist on disk');
const roomCssContent = fs.readFileSync(roomCssPath, 'utf8');
assert(roomCssContent.includes('.karaoke-room-entry'), 'karaoke-room.css must style .karaoke-room-entry');
assert(roomCssContent.includes('.karaoke-room'), 'karaoke-room.css must style .karaoke-room');
assert(roomCssContent.includes('.karaoke-dedicated-stage'), 'karaoke-room.css must style .karaoke-dedicated-stage');
assert(roomCssContent.includes('.karaoke-lyrics-flow'), 'karaoke-room.css must style .karaoke-lyrics-flow');

// 4. Verify index.html includes CSS and JS links
const indexPath = path.resolve(__dirname, '../index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');
assert(indexContent.includes('css/karaoke-room.css'), 'index.html must link css/karaoke-room.css');
assert(indexContent.includes('js/karaoke-room.js'), 'index.html must include js/karaoke-room.js');

console.log('\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY! (100% PASS)');
