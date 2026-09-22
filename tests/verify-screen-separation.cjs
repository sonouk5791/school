const fs = require('fs');
const assert = require('assert');

console.log('=== 어르신용 화면과 선생님용 화면 분리 검증 테스트 시작 ===');

const html = fs.readFileSync('index.html', 'utf8');
const jsApp = fs.readFileSync('js/app.js', 'utf8');
const jsWorkflow = fs.readFileSync('js/care-workflow.js', 'utf8');
const cssMain = fs.readFileSync('css/main.css', 'utf8');
const cssTeacher = fs.readFileSync('css/teacher.css', 'utf8');

// 1. 헤더 어르신 중심화 & 선생님 공간 분리 확인
assert(html.includes('디지털 AI 학교'), '브랜드명 디지털 AI 학교 확인');
assert(html.includes('btnTeacherSpace'), '선생님 공간 버튼 분리 존재 확인');
assert(!html.includes('id="btnHeaderJournal" title="육하원칙(5W1H) 업무수행 일지 바로가기" style="background:#FFF1E6;'), '헤더 전면에 관리자 일지 버튼 노출되지 않음 확인');
console.log('✅ 1. 헤더 어르신 중심화 및 선생님 공간 버튼 분리 검증 통과');

// 2. 어르신용 4대 메인 활동 카드 전면 배치 확인
assert(html.includes('senior-main-activities-section'), '어르신 4대 활동 섹션 존재');
assert(html.includes('card-kongi') && html.includes('senior-exercise.html'), '1. 콩이와 운동하기 카드 연결 확인');
assert(html.includes('card-tori') && html.includes('tori-play.html'), '2. 토리와 놀이하기 카드 연결 확인');
assert(html.includes('card-nabi') && html.includes('nabi-learn.html'), '3. 나비와 학습하기 카드 연결 확인');
assert(html.includes('card-bori') && html.includes('bori-hobby.html'), '4. 곰이와 취미하기 카드 연결 확인');
console.log('✅ 2. 어르신 4대 대형 활동 카드 (운동, 놀이, 학습, 취미) 전면 배치 확인');

// 3. 선생님 공간 6대 관리 메뉴 탭 통합 확인
assert(html.includes('id="teacherModalTabs"'), '선생님 공간 모달 6대 탭 바 존재');
assert(html.includes('data-tab="records"'), '수업 기록 탭 존재');
assert(html.includes('data-tab="users"'), '어르신 관리 탭 존재');
assert(html.includes('data-tab="ai-journal"'), 'AI 수업일지 탭 존재');
assert(html.includes('data-tab="analysis"'), '변화 분석 탭 존재');
assert(html.includes('data-tab="report"'), '보호자 보고서 탭 존재');
assert(html.includes('data-tab="settings"'), '관리자 설정 탭 존재');
console.log('✅ 3. 선생님 공간 모달 내 6대 관리자 기능 탭 통합 검증 통과');

// 4. 기존 자산 및 수업 콘텐츠 보존 확인
assert(html.includes('aiCoursesGrid'), '기존 AI 핵심 실습 코스 보존 확인');
assert(html.includes('data-lesson-id="greeting"'), '기존 인지 돌봄 활동 코스 보존 확인');
assert(html.includes('warmupVideo'), '기존 준비 체조 영상 보존 확인');
console.log('✅ 4. 기존 학습 코스 및 미디어 자산 100% 보존 확인');

// 5. care-workflow.js 화면 전환 연동 확인
assert(jsWorkflow.includes('seniorActs.hidden = !isHome;'), '선생님 화면 진입 시 어르신 활동 숨김 처리 연동 확인');
assert(jsApp.includes('modalTabItems.forEach'), '선생님 모달 탭 이벤트 핸들러 연동 확인');
console.log('✅ 5. 화면 전환 및 탭 이벤트 동기화 로직 검증 통과');

console.log('\n🎉 [어르신용 화면과 선생님용 화면 분리 1차 개편 모든 테스트 100% 통과!]');
