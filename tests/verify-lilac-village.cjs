const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Starting Lilac Village 2.5D Life RPG Verification ---');

// 1. Check js/village-rpg-engine.js
const rpgCode = fs.readFileSync(path.join(__dirname, '../js/village-rpg-engine.js'), 'utf8');
assert(rpgCode.includes('VillageRPG'), 'VillageRPG object must exist');
assert(rpgCode.includes('walkTo'), 'walkTo function must exist');
assert(rpgCode.includes('setupWalkerAvatar'), 'setupWalkerAvatar must exist');
assert(rpgCode.includes('showDestinationDialog'), 'showDestinationDialog must exist');
assert(rpgCode.includes('setupTasksAndRewards'), 'setupTasksAndRewards must exist');
assert(rpgCode.includes('라일락 마을 쉼터'), 'Shelter destination must exist');
assert(rpgCode.includes('우리 텃밭'), 'Garden destination must exist');

// 2. Check index.html script inclusion
const htmlCode = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
assert(htmlCode.includes('js/village-rpg-engine.js'), 'index.html must include village-rpg-engine.js');

// 3. Check css/home-welcome-flow.css
const cssCode = fs.readFileSync(path.join(__dirname, '../css/home-welcome-flow.css'), 'utf8');
assert(cssCode.includes('.village-walker'), 'village-walker styles must exist');
assert(cssCode.includes('.village-rpg-dialog-backdrop'), 'rpg dialog backdrop styles must exist');
assert(cssCode.includes('.village-rpg-quest-container'), 'rpg quest container styles must exist');

console.log('✓ All 2.5D Life RPG Walking Engine & Dialog Modal Checks PASSED');
