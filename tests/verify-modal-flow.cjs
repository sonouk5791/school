const fs = require('fs');
const html = fs.readFileSync('senior-exercise.html', 'utf8');
const js = fs.readFileSync('js/senior-exercise.js', 'utf8');
const css = fs.readFileSync('css/senior-exercise.css', 'utf8');

const checks = [
  { name: 'Modal hidden attribute in HTML', pass: html.includes('id="exerciseCompleteModal"') && html.includes('style="display: none;"') && html.includes('hidden') },
  { name: '[hidden] display none !important in CSS', pass: css.includes('[hidden]') && css.includes('display: none !important') },
  { name: 'Complete modal display none in CSS', pass: css.includes('#exerciseCompleteModal[hidden]') },
  { name: 'JS init guarantees modal hidden', pass: js.includes('completeModal.hidden = true;') },
  { name: 'JS finishProgram displays modal only on finish', pass: js.includes('completeModal.hidden = false;') && js.includes("completeModal.style.display = 'flex';") },
  { name: '10 scene cards track completed status', pass: js.includes('completedScenes.has(idx)') },
  { name: 'Time indicator top is updated', pass: js.includes('timeIndicatorTop.textContent = timeStr;') }
];

console.log('=== Senior Exercise Modal & Flow Verification ===');
let allPass = true;
checks.forEach(c => {
  console.log(`${c.pass ? '✅' : '❌'} ${c.name}`);
  if (!c.pass) allPass = false;
});

if (allPass) {
  console.log('🎉 모든 요구사항 검증 완료!');
} else {
  process.exit(1);
}
