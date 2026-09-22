/**
 * 캐릭터 이름 전면 통일 및 4대 캐릭터방 구조 일관성 자동 검증 테스트
 */
const fs = require('fs');
const assert = require('assert');

console.log('--- 캐릭터 이름 전면 통일 및 4대 캐릭터방 구조 일관성 검증 시작 ---');

// 1. 4개 방 파일 존재 확인
const rooms = {
  kongi: { file: 'senior-exercise.html', name: '콩이', room: '운동방', emoji: '🐶' },
  tori:  { file: 'tori-play.html',       name: '토리', room: '놀이방', emoji: '🐰' },
  nabi:  { file: 'nabi-learn.html',      name: '나비', room: '학습방', emoji: '🐱' },
  gomi:  { file: 'bori-hobby.html',      name: '곰이', room: '취미방', emoji: '🐻' }
};

for (const [key, info] of Object.entries(rooms)) {
  assert(fs.existsSync(info.file), `${info.file} 파일이 존재해야 합니다.`);
  const content = fs.readFileSync(info.file, 'utf8');

  // 상단: 캐릭터 이름 + 방 이름, 처음으로 링크
  assert(content.includes('index.html'), `${info.file}에 index.html(처음으로) 링크가 있어야 합니다.`);
  assert(content.includes(info.name), `${info.file}에 캐릭터 이름(${info.name})이 표기되어야 합니다.`);
  assert(content.includes(info.room), `${info.file}에 방 이름(${info.room})이 표기되어야 합니다.`);

  // 음성/설명 버튼
  assert(content.includes('설명'), `${info.file}에 설명 듣기 버튼이 있어야 합니다.`);

  console.log(`✔ [${info.name}의 ${info.room}] 기본 구조 및 명칭 검증 통과`);
}

// 2. 취미방(bori-hobby.html)에서 '보리'가 모두 '곰이'로 바뀌었는지 검증
const hobbyHtml = fs.readFileSync('bori-hobby.html', 'utf8');
assert(!hobbyHtml.includes('보리의 취미방'), 'bori-hobby.html에 "보리의 취미방"이 남아있지 않아야 합니다.');
assert(!hobbyHtml.includes('보리와 함께'), 'bori-hobby.html에 "보리와 함께"가 남아있지 않아야 합니다.');
assert(!hobbyHtml.includes('보리 설명'), 'bori-hobby.html에 "보리 설명"이 남아있지 않아야 합니다.');
assert(!hobbyHtml.includes('보리예요'), 'bori-hobby.html에 "보리예요"가 남아있지 않아야 합니다.');
assert(!hobbyHtml.includes('보리도'), 'bori-hobby.html에 "보리도"가 남아있지 않아야 합니다.');
assert(!hobbyHtml.includes('보리가'), 'bori-hobby.html에 "보리가"가 남아있지 않아야 합니다.');
assert(hobbyHtml.includes('곰이의 취미방'), 'bori-hobby.html에 "곰이의 취미방"이 포함되어야 합니다.');
assert(hobbyHtml.includes('곰이 설명'), 'bori-hobby.html에 "곰이 설명" 버튼이 포함되어야 합니다.');
assert(hobbyHtml.includes('곰이예요'), 'bori-hobby.html에 "곰이예요" TTS 발화가 포함되어야 합니다.');
console.log('✔ 취미방(bori-hobby.html) "곰이" 명칭 통일 검증 통과');

// 3. index.html 검증
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(!indexHtml.includes('콩이, 토리, 나비, 보리'), 'index.html에 "콩이, 토리, 나비, 보리"가 남아있지 않아야 합니다.');
assert(!indexHtml.includes('콩이·토리·나비·보리'), 'index.html에 "콩이·토리·나비·보리"가 남아있지 않아야 합니다.');
assert(indexHtml.includes('콩이·토리·나비·곰이') || indexHtml.includes('콩이, 토리, 나비, 곰이'), 'index.html에 "곰이"로 통일된 명칭이 포함되어야 합니다.');
assert(indexHtml.includes('곰이의 취미방'), 'index.html에 "곰이의 취미방" 카드가 포함되어야 합니다.');
console.log('✔ 메인(index.html) 곰이 명칭 통일 검증 통과');

// 4. 주요 JS 파일 검증
const friendsJs = fs.readFileSync('js/friends-and-play.js', 'utf8');
assert(friendsJs.includes("name:'곰이'") || friendsJs.includes('name: "곰이"'), 'friends-and-play.js에 곰이로 설정되어야 합니다.');

const voiceJs = fs.readFileSync('js/voice.js', 'utf8');
assert(voiceJs.includes("name: '곰이'"), 'voice.js에 곰이로 설정되어야 합니다.');
assert(!voiceJs.includes("음악 친구 보리예요"), 'voice.js에 보리 인사말이 남아있지 않아야 합니다.');

const roomsJs = fs.readFileSync('js/character-rooms.js', 'utf8');
assert(roomsJs.includes("name:'곰이'"), 'character-rooms.js에 곰이로 설정되어야 합니다.');

const manifestJson = JSON.parse(fs.readFileSync('characters/manifest.json', 'utf8'));
assert(manifestJson.bori.name === '곰이', 'characters/manifest.json의 bori.name이 곰이어야 합니다.');

console.log('✔ JS 및 캐릭터 매니페스트 "곰이" 통일 검증 통과');
console.log('\n🎉 [캐릭터 이름 통일 및 4대 캐릭터방 구조 일관성 모든 테스트 100% 통과!]');
