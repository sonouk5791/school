const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Starting Lilac Village Walk Map Verification ---');

// 1. Check js/home-welcome-flow.js content
const homeFlowCode = fs.readFileSync(path.join(__dirname, '../js/home-welcome-flow.js'), 'utf8');
assert(homeFlowCode.includes('건강체조와 쉬운 운동을 함께해요'), 'Kongi description must match');
assert(homeFlowCode.includes('신나는 놀이와 재미있는 활동을 해요'), 'Tori description must match');
assert(homeFlowCode.includes('차분한 생각과 배움을 함께해요'), 'Nabi description must match');
assert(homeFlowCode.includes('옛 노래와 취미 활동을 즐겨요'), 'Bori description must match');
assert(homeFlowCode.includes('라일락 마을'), 'Lilac village text must be present');
assert(homeFlowCode.includes('라일락 마을 쉼터'), 'Lilac village shelter text must be present');

// 2. Check js/village-landscape.js content
const landscapeCode = fs.readFileSync(path.join(__dirname, '../js/village-landscape.js'), 'utf8');
assert(landscapeCode.includes('라일락 마을 쉼터'), 'Shelter sign must state 라일락 마을 쉼터');
assert(landscapeCode.includes('rest-bench'), 'Bench element must exist');
assert(landscapeCode.includes('rest-lilac-cluster'), 'Lilac cluster element must exist');
assert(landscapeCode.includes('village-paths'), 'Curved paths svg must exist');

// 3. Check css/home-welcome-flow.css content
const cssCode = fs.readFileSync(path.join(__dirname, '../css/home-welcome-flow.css'), 'utf8');
assert(cssCode.includes('.village-rest'), '.village-rest styling must exist');
assert(cssCode.includes('.rest-sign'), '.rest-sign styling must exist');
assert(cssCode.includes('.rest-lilac-cluster'), '.rest-lilac-cluster styling must exist');
assert(cssCode.includes('.rest-bench'), '.rest-bench styling must exist');
assert(cssCode.includes('.prop-primary'), '.prop-primary styling must exist');
assert(cssCode.includes('.prop-secondary'), '.prop-secondary styling must exist');

console.log('✓ Static Source Code Checks PASSED');
console.log('✓ 15 Requirements for Lilac Village Map Satisfied');
