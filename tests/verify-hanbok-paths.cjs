const fs = require('fs');
const assert = require('assert');

const hanbok = fs.readFileSync('js/hanbok-character.js', 'utf8');
const anim = fs.readFileSync('js/character-animation.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

// Ensure no absolute leading slash in asset paths
assert.equal(/['"]\/assets\//.test(hanbok), false, 'hanbok-character.js should not contain /assets/');
assert.equal(/['"]\/assets\//.test(anim), false, 'character-animation.js should not contain /assets/');

// Ensure relative paths for all 4 characters exist on disk
for (const id of ['kongi', 'tori', 'nabi', 'bori']) {
  assert(fs.existsSync(`assets/images/chuseok/${id}-hanbok-v2.png`), `assets/images/chuseok/${id}-hanbok-v2.png exists`);
  assert(fs.existsSync(`assets/images/chuseok/${id}-blink-v3.png`), `assets/images/chuseok/${id}-blink-v3.png exists`);
  assert(fs.existsSync(`assets/images/chuseok/${id}-expressions-v3.png`), `assets/images/chuseok/${id}-expressions-v3.png exists`);
  assert(fs.existsSync(`assets/images/friend-${id}.png`), `assets/images/friend-${id}.png exists`);
}

// Check index.html contains proper relative paths and xlink:href
assert(index.includes('xlink:href="assets/images/chuseok/kongi-hanbok-v2.png"'), 'index.html has xlink:href for kongi');
assert(index.includes('onerror="this.setAttribute'), 'index.html has fallback for SVG images');

console.log('PASS: All hanbok asset paths are relative, verified on disk, and fallback safe.');
