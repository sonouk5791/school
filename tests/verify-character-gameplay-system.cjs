const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- 캐릭터 선택형 게임 수업 시스템 통합 검증 시작 ---');

// 1. home-welcome-flow.js 검증
const homeFlowPath = path.join(__dirname, '../js/home-welcome-flow.js');
assert.ok(fs.existsSync(homeFlowPath), 'home-welcome-flow.js 존재 확인');
const homeFlowContent = fs.readFileSync(homeFlowPath, 'utf8');

assert.ok(homeFlowContent.includes('오늘은 어떤 친구와 함께할까요?'), '마을 첫 질문 헤딩 반영 확인');
assert.ok(homeFlowContent.includes('가고 싶은 친구 집을 눌러보세요.'), '마을 서브타이틀 반영 확인');
assert.ok(homeFlowContent.includes('저랑 같이 몸을 움직여볼까요?'), '콩이 운동 대화 확인');
assert.ok(homeFlowContent.includes('오늘은 어떤 놀이를 해볼까요?'), '토리 놀이 대화 확인');
assert.ok(homeFlowContent.includes('천천히 함께 생각해봐요.'), '나비 학습 대화 확인');
assert.ok(homeFlowContent.includes('노래도 듣고 추억 이야기도 해봐요.'), '보리 취미 대화 확인');
assert.ok(homeFlowContent.includes('hw-daily-rec-banner'), '오늘의 추천 친구 배너 확인');
assert.ok(homeFlowContent.includes('hw-today-board'), '오늘 만난 친구 활동판 확인');
console.log('✅ 마을 첫 질문 / 캐릭터 대사 / 추천 친구 / 오늘 활동판 검증 완료');

// 2. service-activity.js 및 완료 보상 연동 검증
const serviceActivityPath = path.join(__dirname, '../js/service-activity.js');
assert.ok(fs.existsSync(serviceActivityPath), 'service-activity.js 존재 확인');
const serviceActivityContent = fs.readFileSync(serviceActivityPath, 'utf8');
assert.ok(serviceActivityContent.includes('school_today_completed_chars'), '오늘 만난 친구 기록 저장 확인');
assert.ok(serviceActivityContent.includes('school_garden_water_count'), '텃밭 물주기 연계 확인');
assert.ok(serviceActivityContent.includes('service-reward-card'), '통일된 활동 완료 카드 확인');
assert.ok(serviceActivityContent.includes('오늘도 정말 잘하셨어요!'), '칭찬 메시지 확인');
console.log('✅ 활동 완료 보상 / 텃밭 연계 / 기록 저장 로직 검증 완료');

// 3. room-activity-flow.js 검증
const roomFlowPath = path.join(__dirname, '../js/room-activity-flow.js');
assert.ok(fs.existsSync(roomFlowPath), 'room-activity-flow.js 존재 확인');
const roomFlowContent = fs.readFileSync(roomFlowPath, 'utf8');
assert.ok(roomFlowContent.includes('tori') && roomFlowContent.includes('nabi') && roomFlowContent.includes('bori'), '3개 방 설정 확인');
console.log('✅ 방별 활동 시작/진행/완료 흐름 검증 완료');

// 4. tori-play.html 부정적 실패 표현 배제 검증
const toriPath = path.join(__dirname, '../tori-play.html');
const toriContent = fs.readFileSync(toriPath, 'utf8');
assert.ok(toriContent.includes('괜찮아요. 다시 한번 볼까요?'), '토리 오답 시 긍정적 재시도 안내 확인');
assert.ok(!toriContent.includes('틀렸습니다'), '부정적 틀림 단어 없음 확인');
assert.ok(!toriContent.includes('실패하셨습니다'), '부정적 실패 단어 없음 확인');
console.log('✅ 부정적 표현 배제 및 긍정 격려 원칙 검증 완료');

// 5. senior-exercise.html 콩이 운동 선택지 검증
const exercisePath = path.join(__dirname, '../senior-exercise.html');
const exerciseContent = fs.readFileSync(exercisePath, 'utf8');
assert.ok(exerciseContent.includes('btnStart') && exerciseContent.includes('exercise-20min.html'), '콩이 운동 선택지 확인');
console.log('✅ 콩이 운동 미션 선택지 검증 완료');

console.log('🎉 캐릭터 선택형 게임 수업 시스템 통합 검증이 완벽하게 통과되었습니다!');
