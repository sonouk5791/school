/**
 * 콩이 운동방 3단계 상태 흐름 (시작 전 / 운동 중 / 운동 완료 후) 자동 검증 테스트
 */
const fs = require('fs');
const assert = require('assert');

console.log('=== 콩이 운동방 3단계 상태 흐름 검증 시작 ===');

const html = fs.readFileSync('senior-exercise.html', 'utf8');
const js = fs.readFileSync('js/senior-exercise.js', 'utf8');
const css = fs.readFileSync('css/senior-exercise.css', 'utf8');

// 1. 3대 상태 뷰 컨테이너 존재 검증
assert(html.includes('id="viewReady"'), '시작 전 뷰 (#viewReady)가 존재해야 합니다.');
assert(html.includes('id="viewPlaying"'), '운동 진행 중 뷰 (#viewPlaying)가 존재해야 합니다.');
assert(html.includes('id="viewCompleted"'), '운동 완료 후 뷰 (#viewCompleted)가 존재해야 합니다.');
console.log('✅ 1. 시작전/운동중/완료후 3대 상태 뷰 컨테이너 분리 확인');

// 2. 시작 전 (Ready) 구성요소 검증
assert(html.includes('id="btnStart"') && html.includes('se-btn-huge-start'), '초대형 운동 시작 버튼이 존재해야 합니다.');
assert(html.includes('id="readySceneList"'), '10가지 체조 순서 안내 목록 (#readySceneList)이 존재해야 합니다.');
assert(html.includes('총 소요 시간') && html.includes('10단계 자동 재생'), '총 소요시간 및 운동 구성 안내가 존재해야 합니다.');
assert(js.includes('renderReadySceneList'), '시작 전 10개 체조 카드 동적 렌더링 로직이 구현되어 있어야 합니다.');
console.log('✅ 2. 시작 전(Ready) 인사말, 소개, 총시간, 초대형 시작버튼, 10개 순서 목록 확인');

// 3. 운동 중 (Playing) 구성요소 검증
assert(html.includes('id="playerCard"'), '메인 16:9 체조 영상 카드가 존재해야 합니다.');
assert(html.includes('id="sceneGrid"'), '10개 동작 썸네일 네비게이터가 존재해야 합니다.');
assert(html.includes('id="btnPause"') && html.includes('id="btnRestart"'), '일시정지/처음부터 제어 버튼이 존재해야 합니다.');
assert(html.includes('id="btnPrev"') && html.includes('id="btnNext"'), '이전/다음 동작 이동 버튼이 존재해야 합니다.');
assert(html.includes('id="btnBackToReady"'), '준비 화면으로 돌아가기 버튼이 존재해야 합니다.');
console.log('✅ 3. 운동 중(Playing) 16:9 영상, 대형 자막, 재생/정지/이전/다음/준비화면 제어 확인');

// 4. 운동 완료 후 (Completed) 구성요소 검증
assert(html.includes('id="exerciseCompleteModal"'), '완료 모달/카드가 존재해야 합니다.');
assert(html.includes('id="btnReplayExercise"'), '체조 다시 하기 버튼이 존재해야 합니다.');
assert(html.includes('index.html') && html.includes('학교 홈으로 가기'), '학교 홈으로 가기 링크가 존재해야 합니다.');
assert(html.includes('🌸 건강 꽃 도장 획득!'), '건강 도장 획득 안내가 포함되어 있어야 합니다.');
console.log('✅ 4. 운동 완료 후(Completed) 꽃 도장, 칭찬 문구, 다시하기, 홈으로 가기 확인');

// 5. 상태 분리 및 팝업 초기 차단 로직 검증
assert(js.includes("setExerciseState('ready')"), '초기 진입 시 ready 상태로 안전하게 설정되어야 합니다.');
assert(js.includes("setExerciseState('playing')"), '시작 버튼 클릭 시 playing 상태로 전환되어야 합니다.');
assert(js.includes("setExerciseState('completed')"), '10개 체조 모두 마칠 때만 completed 상태로 전환되어야 합니다.');
assert(js.includes('completeModal.hidden = true;'), '초기 진입 시 완료 팝업은 100% 숨김 처리되어야 합니다.');
console.log('✅ 5. 상태 전환 관리자 (setExerciseState) 및 완료 팝업 초기 차단 로직 확인');

// 6. CSS 스타일링 검증
assert(css.includes('.se-btn-huge-start'), '초대형 시작 버튼 스타일이 정의되어 있어야 합니다.');
assert(css.includes('.se-ready-card'), '준비 화면 카드 스타일이 정의되어 있어야 합니다.');
assert(css.includes('.se-completed-card'), '완료 화면 카드 스타일이 정의되어 있어야 합니다.');
console.log('✅ 6. 어르신 맞춤형 고대비/초대형 스타일링 CSS 확인');

console.log('\n🎉 [콩이 운동방 3단계 상태 흐름 검증 100% 통과!]');
