const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Starting Lilac Village 16:9 Widescreen Verification ---');

// 1. Check css/home-welcome-flow.css 16:9 aspect-ratio
const cssCode = fs.readFileSync(path.join(__dirname, '../css/home-welcome-flow.css'), 'utf8');
assert(cssCode.includes('aspect-ratio: 16 / 9;'), '16:9 aspect-ratio must be configured');
assert(cssCode.includes('home-friend-kongi'), 'Kongi positioning must exist');
assert(cssCode.includes('home-friend-tori'), 'Tori positioning must exist');
assert(cssCode.includes('home-friend-nabi'), 'Nabi positioning must exist');
assert(cssCode.includes('home-friend-bori'), 'Bori positioning must exist');

// 2. Check js/village-rpg-engine.js
const rpgCode = fs.readFileSync(path.join(__dirname, '../js/village-rpg-engine.js'), 'utf8');
assert(rpgCode.includes('VillageRPG'), 'VillageRPG object must exist');
assert(rpgCode.includes('walkTo'), 'walkTo function must exist');

console.log('✓ 16:9 Widescreen Village Viewport and Pinpoint Overlay Checks PASSED');
