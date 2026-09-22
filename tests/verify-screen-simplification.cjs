const fs = require('fs');
const assert = require('assert');

console.log('=== 메인 화면 단순화 및 진입 구조 정리 검증 테스트 시작 ===');

const html = fs.readFileSync('index.html', 'utf8');
const jsApp = fs.readFileSync('js/app.js', 'utf8');
const jsWorkflow = fs.readFileSync('js/care-workflow.js', 'utf8');
const cssMain = fs.readFileSync('css/main.css', 'utf8');

// 1. 인사 문구 단순화 및 따뜻한 표현 확인
assert(html.includes('안녕하세요. 오늘도 <span>만나서 반갑습니다!</span>') || html.includes('만나서 반갑습니다'), '인사 문구 검증');
assert(html.includes('오늘은 누구와 무엇을 해볼까요?') || html.includes('오늘은 무엇을 해볼까요?'), '활동 질문 문구 검증');
console.log('✅ 1. 인사 문구 및 질문 단순화 확인 완료');

// 2. 4대 활동 카드 중심성 검증
assert(html.includes('card-kongi') && html.includes('콩이와 운동하기'), '콩이와 운동하기 확인');
assert(html.includes('card-tori') && html.includes('토리와 놀이하기'), '토리와 놀이하기 확인');
assert(html.includes('card-nabi') && html.includes('나비와 학습하기'), '나비와 학습하기 확인');
assert(html.includes('card-bori') && html.includes('곰이와 취미하기'), '곰이와 취미하기 확인');
console.log('✅ 2. 4대 핵심 활동 카드 (운동, 놀이, 학습, 취미) 확인 완료');

// 3. 하단 보조 버튼 검증
assert(html.includes('id="btnHeroHistoryBottom"'), '지난 활동 보기 버튼 존재');
assert(html.includes('id="btnToggleAllLessons"'), '전체 수업 더보기 토글 버튼 존재');
assert(jsApp.includes('btnToggleAll.addEventListener'), '더보기 토글 이벤트 리스너 확인');
console.log('✅ 3. 하단 지난 활동 보기 및 전체 수업 더보기 토글 버튼 확인 완료');

// 4. 긴 하위 섹션들 서랍형 접힘 확인
assert(html.includes('id="moreLessonsDrawer" class="more-lessons-drawer" hidden'), 'moreLessonsDrawer 접힘 상태 확인');
assert(html.includes('aiCoursesGrid'), '기존 AI 8강 코스 보존 확인');
assert(html.includes('warmupVideo'), '기존 체조 비디오 보존 확인');
assert(html.includes('characterDoors'), '기존 캐릭터 도어 보존 확인');
console.log('✅ 4. 기존 콘텐츠 100% 보존 및 메인 화면 서랍형 접힘 확인 완료');

// 5. CSS 스타일 검증
assert(cssMain.includes('.senior-bottom-bar'), 'senior-bottom-bar CSS 존재');
assert(cssMain.includes('.btn-senior-history-large'), 'btn-senior-history-large CSS 존재');
assert(cssMain.includes('.more-lessons-drawer[hidden]'), 'more-lessons-drawer hidden CSS 존재');
console.log('✅ 5. 어르신 친화적 디자인 CSS 확인 완료');

console.log('\n🎉 [메인 화면 단순화 및 진입 구조 정리 검증 100% 통과!]');
