/**
 * Senior Hobby Room Verification Test
 * Tests for Hobby Room files, markup, sketch templates, writing prompts, hobby finder questions, and gallery integration.
 */
const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');

console.log('=== [1] FILE INTEGRITY CHECKS ===');
const cssPath = 'j:/sh/css/hobby-room.css';
const jsPath = 'j:/sh/js/hobby-room.js';
const indexPath = 'j:/sh/index.html';

assert(fs.existsSync(cssPath), 'css/hobby-room.css must exist');
assert(fs.existsSync(jsPath), 'js/hobby-room.js must exist');
console.log('  ✓ Files exist on disk');

const indexHtml = fs.readFileSync(indexPath, 'utf8');
assert(indexHtml.includes('css/hobby-room.css'), 'index.html must link css/hobby-room.css');
assert(indexHtml.includes('js/hobby-room.js'), 'index.html must include js/hobby-room.js');
console.log('  ✓ index.html references verified');

console.log('\n=== [2] JS SYNTAX & STRUCTURE AUDIT ===');
const jsContent = fs.readFileSync(jsPath, 'utf8');
try {
  new Function(jsContent);
  console.log('  ✓ js/hobby-room.js syntax is valid');
} catch (e) {
  assert.fail('Syntax error in js/hobby-room.js: ' + e.message);
}

console.log('\n=== [3] HOBBY ROOM KEY DATA VERIFICATION ===');
assert(jsContent.includes('SKETCH_TEMPLATES'), 'Must contain SKETCH_TEMPLATES');
assert(jsContent.includes('sunflower'), 'Must have sunflower sketch');
assert(jsContent.includes('dog'), 'Must have dog sketch');
assert(jsContent.includes('house'), 'Must have house sketch');
console.log('  ✓ Sketch templates (sunflower, dog, house) verified');

assert(jsContent.includes('WRITING_PROMPTS'), 'Must contain WRITING_PROMPTS');
assert(jsContent.includes('QUICK_PHRASES'), 'Must contain QUICK_PHRASES');
console.log('  ✓ Writing prompts & quick phrases verified');

assert(jsContent.includes('HOBBY_QUESTIONS'), 'Must contain HOBBY_QUESTIONS');
assert(jsContent.includes('HOBBY_RESULTS'), 'Must contain HOBBY_RESULTS');
console.log('  ✓ Hobby discovery questions & result definitions verified');

assert(jsContent.includes('hobby-gallery-card'), 'Must contain gallery card rendering');
assert(jsContent.includes('btnReadAloudWriting'), 'Must contain AI voice reading integration');
console.log('  ✓ Gallery & Voice reading handlers verified');

console.log('\n🎉 ALL SENIOR HOBBY ROOM VERIFICATION CHECKS PASSED 100%!');
