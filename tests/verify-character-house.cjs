const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- 「내가 꾸미는 AI 캐릭터 집」 무결점 검증 테스트 시작 ---');

// 1. HTML 파일 검증
const htmlPath = path.join(__dirname, '../character-house.html');
assert.ok(fs.existsSync(htmlPath), 'character-house.html 존재 확인');
const html = fs.readFileSync(htmlPath, 'utf8');

const requiredIds = [
  'selectScreen', 'charSelectGrid', 'resumeBanner', 'btnResumeWork',
  'studioScreen', 'roomViewport', 'charAvatar', 'itemsLayer',
  'speechMsg', 'optionsGrid', 'itemController',
  'btnBottomHome', 'btnBottomUndo', 'btnBottomReset', 'btnBottomSave', 'btnBottomComplete',
  'resetModal', 'completeView'
];

requiredIds.forEach(id => {
  assert.ok(html.includes(`id="${id}"`), `필수 ID [${id}]가 HTML에 정의되어 있어야 함`);
});
console.log('✅ HTML 주요 UI 요소 및 식별자 검증 완료');

// 2. JS / CSS 파일 검증
const jsPath = path.join(__dirname, '../js/character-house.js');
const cssPath = path.join(__dirname, '../css/character-house.css');
assert.ok(fs.existsSync(jsPath), 'js/character-house.js 존재');
assert.ok(fs.existsSync(cssPath), 'css/character-house.css 존재');

const js = fs.readFileSync(jsPath, 'utf8');
assert.ok(js.includes('CHARACTERS'), 'CHARACTERS 객체 정의 확인');
assert.ok(js.includes('OUTFITS'), 'OUTFITS 객체 정의 확인');
assert.ok(js.includes('ROOM_TYPES'), 'ROOM_TYPES 객체 정의 확인');
assert.ok(js.includes('ITEM_CATALOG'), 'ITEM_CATALOG 객체 정의 확인');
assert.ok(js.includes('saveToStorage'), 'saveToStorage 저장 함수 확인');
assert.ok(js.includes('loadFromStorage'), 'loadFromStorage 불러오기 함수 확인');
console.log('✅ JS 데이터 구조 및 저장/복원 로직 검증 완료');

// 3. 캐릭터 하우스 에셋 이미지 검증
const houseImages = [
  'assets/images/kongi-home-decorating.png',
  'assets/images/tori-home-decorating.png',
  'assets/images/nabi-home-decorating.png',
  'assets/images/bori-home-decorating.png'
];

houseImages.forEach(imgPath => {
  const fullPath = path.join(__dirname, '..', imgPath);
  assert.ok(fs.existsSync(fullPath), `하우스 에셋 이미지 존재: ${imgPath}`);
});
console.log('✅ 4인 캐릭터 집 꾸미기 에셋 이미지 검증 완료');

console.log('🎉 모든 캐릭터 하우스 검증 테스트가 완벽히 통과하였습니다!');
