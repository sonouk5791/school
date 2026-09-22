const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- 치매 어르신 10단계 AI 체조 검증 테스트 시작 ---');

// 1. program.json 검증
const programPath = path.join(__dirname, '../assets/senior-exercise/program.json');
assert.ok(fs.existsSync(programPath), 'program.json 파일이 존재해야 합니다.');
const program = JSON.parse(fs.readFileSync(programPath, 'utf8'));

assert.strictEqual(program.scenes.length, 10, '10개 씬이 모두 정의되어 있어야 합니다.');
console.log('✅ 10개 씬 데이터 구조 확인 완료');

// 2. 10개 씬 이미지 파일 존재 여부 검증
const imagesDir = path.join(__dirname, '../assets/senior-exercise/images');
program.scenes.forEach((scene, index) => {
  assert.strictEqual(scene.index, index + 1, `씬 번호 일치 (${index + 1})`);
  assert.ok(scene.title, `씬 제목 존재 (${scene.title})`);
  assert.ok(scene.character, `캐릭터 배정 존재 (${scene.character})`);
  assert.ok(scene.image, `이미지 파일명 존재 (${scene.image})`);
  
  const imgPath = path.join(imagesDir, scene.image);
  assert.ok(fs.existsSync(imgPath), `이미지 파일 실제 존재: ${scene.image}`);
  const stat = fs.statSync(imgPath);
  assert.ok(stat.size > 50000, `이미지 파일 크기가 충분히 고화질이어야 함: ${stat.size} bytes`);
});
console.log('✅ 10개 씬 고화질 이미지 에셋 검증 완료');

// 3. senior-exercise.html 및 js/css 존재 검증
const htmlPath = path.join(__dirname, '../senior-exercise.html');
const cssPath = path.join(__dirname, '../css/senior-exercise.css');
const jsPath = path.join(__dirname, '../js/senior-exercise.js');

assert.ok(fs.existsSync(htmlPath), 'senior-exercise.html 존재');
assert.ok(fs.existsSync(cssPath), 'css/senior-exercise.css 존재');
assert.ok(fs.existsSync(jsPath), 'js/senior-exercise.js 존재');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
assert.ok(htmlContent.includes('playerCard'), 'playerCard ID가 HTML에 포함되어야 함');
assert.ok(htmlContent.includes('btnStart'), 'btnStart 버튼이 HTML에 포함되어야 함');
assert.ok(htmlContent.includes('sceneGrid'), 'sceneGrid 네비게이터가 포함되어야 함');

// 4. school-release 동기화 검증
const releaseHtml = path.join(__dirname, '../school-release/senior-exercise.html');
const releaseProgram = path.join(__dirname, '../school-release/assets/senior-exercise/program.json');
assert.ok(fs.existsSync(releaseHtml), 'school-release/senior-exercise.html 동기화 확인');
assert.ok(fs.existsSync(releaseProgram), 'school-release program.json 동기화 확인');

console.log('✅ school-release 릴리즈 동기화 검증 완료');
console.log('🎉 모든 테스트가 완벽히 통과하였습니다!');
