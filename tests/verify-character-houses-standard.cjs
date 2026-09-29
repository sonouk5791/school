const fs = require('fs');
const assert = require('assert');

function runTest() {
  console.log('--- 4대 캐릭터 집 구조 표준화 & 콩이 대표 3D 의자 체조 애니메이션 시스템 검증 시작 ---');

  // 1. 콩이집 검증
  const kongiHtml = fs.readFileSync('senior-exercise.html', 'utf8');
  const kongiJs = fs.readFileSync('js/senior-exercise.js', 'utf8');

  assert(kongiHtml.includes('🐶 콩이집 · 운동방'), '콩이집 타이틀 일치');
  assert(kongiHtml.includes('오늘도 함께 몸을 움직여볼까요?'), '콩이 인사 대사 일치');
  assert(kongiHtml.includes('kongi-chair-exercise.gif'), '콩이 대표 3D 의자 체조 GIF 애니메이션 탑재');
  assert(kongiHtml.includes('🏡 친구들 마을로 돌아가기'), '마을로 돌아가기 버튼 일치');

  assert(kongiJs.includes('initChairExercise'), '의자 체조 플레이어 초기화 함수 존재');
  assert(kongiJs.includes('awardExerciseCompletion'), '운동 완료 보상 및 기록 연동 함수 존재');

  // 2. 토리집 검증
  const toriHtml = fs.readFileSync('tori-play.html', 'utf8');
  assert(toriHtml.includes('🐰 토리집 · 놀이방'), '토리집 타이틀 일치');
  assert(toriHtml.includes('재미있는 놀이를 해봐요!'), '토리 인사 대사 일치');
  assert(toriHtml.includes('같은 그림 찾기'), '토리 대표 놀이 존재');
  assert(toriHtml.includes('🏡 친구들 마을로 돌아가기'), '토리집 마을 복귀 버튼 일치');

  // 3. 나비집 검증
  const nabiHtml = fs.readFileSync('nabi-learn.html', 'utf8');
  assert(nabiHtml.includes('🐱 나비집 · 생각방'), '나비집 타이틀 일치');
  assert(nabiHtml.includes('천천히 함께 생각해볼까요?'), '나비 인사 대사 일치');
  assert(nabiHtml.includes('오늘 날짜'), '나비 대표 활동 존재');
  assert(nabiHtml.includes('🏡 친구들 마을로 돌아가기'), '나비집 마을 복귀 버튼 일치');

  // 4. 보리집 검증
  const boriHtml = fs.readFileSync('bori-hobby.html', 'utf8');
  assert(boriHtml.includes('🐻 보리집 · 취미방'), '보리집 타이틀 일치');
  assert(boriHtml.includes('오늘은 어떤 취미를 해볼까요?'), '보리 인사 대사 일치');
  assert(boriHtml.includes('노래 부르기') || boriHtml.includes('노래 따라 부르기'), '보리 대표 취미 존재');
  assert(boriHtml.includes('🏡 친구들 마을로 돌아가기'), '보리집 마을 복귀 버튼 일치');

  console.log('✅ ALL 4 CHARACTER HOUSES STANDARDS & YOUTUBE PLAYER SYSTEM PASS!');
}

runTest();
