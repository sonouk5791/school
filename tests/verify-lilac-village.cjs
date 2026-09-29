const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Starting Lilac Village Illustration Verification ---');

// 1. Check js/home-welcome-flow.js content
const homeFlowCode = fs.readFileSync(path.join(__dirname, '../js/home-welcome-flow.js'), 'utf8');
assert(homeFlowCode.includes('건강체조와 쉬운 운동을 함께해요!'), 'Kongi description must match');
assert(homeFlowCode.includes('신나는 놀이와 재미있는 활동을 해요!'), 'Tori description must match');
assert(homeFlowCode.includes('차분한 생각과 배움을 함께해요!'), 'Nabi description must match');
assert(homeFlowCode.includes('옛 노래와 취미 활동을 즐겨요!'), 'Bori description must match');
assert(homeFlowCode.includes('건강한<br>내일!'), 'Kongi blackboard text must exist');
assert(homeFlowCode.includes('오늘도<br>신나게! ^^'), 'Tori blackboard text must exist');
assert(homeFlowCode.includes('배우는<br>즐거움! ^^'), 'Nabi blackboard text must exist');
assert(homeFlowCode.includes('좋은 노래<br>좋은 추억 ^^'), 'Bori blackboard text must exist');
assert(homeFlowCode.includes('btn-kongi') || homeFlowCode.includes('btn-'), 'Character button classes must exist');

// 2. Check js/village-landscape.js content
const landscapeCode = fs.readFileSync(path.join(__dirname, '../js/village-landscape.js'), 'utf8');
assert(landscapeCode.includes('라일락 마을 쉼터'), 'Shelter sign must state 라일락 마을 쉼터');
assert(landscapeCode.includes('village-header-sign'), 'Village header sign must exist');
assert(landscapeCode.includes('village-motto-board'), 'Village motto board must exist');
assert(landscapeCode.includes('village-garden-sign'), 'Garden sign link must exist');
assert(landscapeCode.includes('village-quote-banner'), 'Poetic quote banner must exist');

// 3. Check css/home-welcome-flow.css content
const cssCode = fs.readFileSync(path.join(__dirname, '../css/home-welcome-flow.css'), 'utf8');
assert(cssCode.includes('.village-rest'), '.village-rest styling must exist');
assert(cssCode.includes('.btn-kongi'), '.btn-kongi styling must exist');
assert(cssCode.includes('.btn-tori'), '.btn-tori styling must exist');
assert(cssCode.includes('.btn-nabi'), '.btn-nabi styling must exist');
assert(cssCode.includes('.btn-bori'), '.btn-bori styling must exist');
assert(cssCode.includes('.house-chalkboard'), '.house-chalkboard styling must exist');
assert(cssCode.includes('.village-header-sign'), '.village-header-sign styling must exist');

console.log('✓ Static Source Code Checks for Reference Illustration PASSED');
