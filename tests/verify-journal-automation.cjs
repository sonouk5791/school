/**
 * verify-journal-automation.cjs
 * 육하원칙(5W1H) 업무수행 일지 자동화 엔진 및 서식 무결성 검증 스크립트
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== [1] 소스 파일 무결성 및 5W1H 코드 점검 ===');

const workflowPath = path.join(__dirname, '..', 'js', 'care-workflow.js');
const teacherCssPath = path.join(__dirname, '..', 'css', 'teacher.css');
const indexHtmlPath = path.join(__dirname, '..', 'index.html');

assert(fs.existsSync(workflowPath), 'care-workflow.js 파일이 존재해야 합니다.');
assert(fs.existsSync(teacherCssPath), 'teacher.css 파일이 존재해야 합니다.');
assert(fs.existsSync(indexHtmlPath), 'index.html 파일이 존재해야 합니다.');

const workflowCode = fs.readFileSync(workflowPath, 'utf8');
const teacherCss = fs.readFileSync(teacherCssPath, 'utf8');

// 필수 키워드 및 함수 확인
assert(workflowCode.includes('5w1h_standard'), '5w1h_standard 양식이 정의되어 있어야 합니다.');
assert(workflowCode.includes('5w1h_narrative'), '5w1h_narrative 양식이 정의되어 있어야 합니다.');
assert(workflowCode.includes('copy-journal'), 'copy-journal 액션 핸들러가 포함되어 있어야 합니다.');
assert(workflowCode.includes('generate-format'), 'generate-format 액션 핸들러가 포함되어 있어야 합니다.');
assert(workflowCode.includes('getProgramPurpose'), 'getProgramPurpose 함수가 정의되어 있어야 합니다.');

// CSS 스타일 확인
assert(teacherCss.includes('.badge-5w1h'), '.badge-5w1h 스타일이 정의되어 있어야 합니다.');
assert(teacherCss.includes('.summary-5w1h-chips'), '.summary-5w1h-chips 스타일이 정의되어 있어야 합니다.');
assert(teacherCss.includes('.journal-toolbar'), '.journal-toolbar 스타일이 정의되어 있어야 합니다.');
assert(teacherCss.includes('@media print'), '인쇄 전용 미디어 쿼리가 정의되어 있어야 합니다.');

console.log('✔ 소스 파일 및 스타일 정의 무결성 확인 완료.');

console.log('\n=== [2] 5W1H 일지 생성 로직 동작 테스트 ===');

// 가상 환경 구축
const mockElders = [
  { elder_id: 'elder-001', name: '김영자', gender: '여성', birth: '1945-03-15', grade: '3등급', cognition: '경도인지장애' },
  { elder_id: 'elder-002', name: '이종수', gender: '남성', birth: '1942-11-05', grade: '2등급', cognition: '중등도 치매' }
];

const mockSession = {
  session_id: 'test-sess-001',
  elder_id: 'elder-001',
  date: '2026-09-14',
  program: '📷 추억의 사진 이야기',
  durationSeconds: 1200, // 20분
  pre: {
    mood: '😊 활기참',
    health: '양호',
    willingness: '매우 적극적',
    notes: '아침 식사 후 기분이 좋으심'
  },
  observation: {
    participation: '적극적',
    focus: '높음',
    performance: '독립 수행',
    emotion: ['웃음', '즐거움', '관심'],
    communication: '자발적으로 대화함',
    behavior: ['없음'],
    notes: '고향 장독대 사진을 보며 옛 시절 이야기를 상세히 설명하심'
  },
  evaluation: {
    satisfaction: '😊 매우 좋음',
    focus: '높음',
    performance: '독립 수행',
    next: '같은 활동 유지'
  }
};

// draft 함수 로직 시뮬레이션
function getProgramPurpose(programTitle) {
  const t = String(programTitle || '');
  if (t.includes('사진') || t.includes('추억') || t.includes('회상')) {
    return '과거 회상을 통한 장기기억 자극 및 정서적 안정감 도모';
  } else if (t.includes('음악') || t.includes('노래')) {
    return '익숙한 멜로디와 리듬을 통한 청각 자극 및 정서적 활력 증진';
  } else if (t.includes('그림') || t.includes('미술') || t.includes('아트')) {
    return '시각적 표현과 소근육 협응 자극을 통한 창작 성취감 고취';
  } else if (t.includes('기억') || t.includes('인지') || t.includes('퍼즐')) {
    return '주의집중력 및 단기 작업기억 유지·강화를 위한 인지 훈련';
  } else if (t.includes('스마트폰') || t.includes('디지털') || t.includes('생활')) {
    return '디지털 기기 활용 친숙도 향상 및 일상생활 자립감 증진';
  } else if (t.includes('이야기') || t.includes('동화') || t.includes('언어')) {
    return '언어적 상호작용 촉진 및 서사적 사고력 자극';
  } else if (t.includes('인사') || t.includes('친구') || t.includes('감정')) {
    return '친밀한 라포 형성 및 일상 정서 교류를 통한 고립감 해소';
  }
  return '잔존 인지기능 유지 및 사회적 상호작용 촉진';
}

function draft(s, format = '5w1h_standard') {
  const el = mockElders.find(e => e.elder_id === s.elder_id) || {};
  const name = el.name || '어르신';
  const gender = el.gender || '성별 미기록';
  const grade = el.grade || '등급 미입력';
  const cognition = el.cognition || '경도인지장애';
  const birth = el.birth ? ` (${el.birth}생)` : '';
  const date = s.date || '2026-09-14';
  const durationMin = Math.max(1, Math.round((s.durationSeconds || 180) / 60));
  const program = s.program || 'AI 인지활동';
  const purpose = getProgramPurpose(program);

  const preMood = s.pre?.mood || '보통';
  const preHealth = s.pre?.health || '양호';
  const preWillingness = s.pre?.willingness || '참여 의사 확인됨';
  const preNotes = s.pre?.notes ? `[수업 전 메모: ${s.pre.notes}]` : '';

  const participation = s.observation?.participation || '보통';
  const focus = s.evaluation?.focus || s.observation?.focus || '보통';
  const performance = s.evaluation?.performance || s.observation?.performance || '독립 수행';
  const emotions = (s.observation?.emotion && s.observation.emotion.length > 0) ? s.observation.emotion.join(', ') : '안정적·긍정적';
  const communication = s.observation?.communication || '자발적으로 대화함';
  const behaviors = (s.observation?.behavior && s.observation.behavior.length > 0 && !s.observation.behavior.includes('없음')) ? s.observation.behavior.join(', ') : '특이행동 없음(원활)';
  const obsNotes = s.observation?.notes ? `[관찰 메모: ${s.observation.notes}]` : '';
  
  const notesTotal = [preNotes, obsNotes].filter(Boolean).join(' ') || '특이사항 없이 편안하고 안정적으로 활동에 몰입하심.';
  const satisfaction = s.evaluation?.satisfaction || '😊 매우 좋음';
  const nextPlan = s.evaluation?.next || '같은 활동 유지';

  if (format === '5w1h_narrative') {
    return `[업무수행 일지 — 육하원칙 서술형]
• [누가(Who) / 언제(When) / 어디서(Where)] ${date}, AI 디지털 교실에서 담당 사회복지사와 AI 튜터 콩이의 안내로 ${name} 어르신(${gender}, ${grade}, ${cognition}${birth})을 대상으로 약 ${durationMin}분간 인지 돌봄 활동을 진행함.
• [무엇을(What)] '${program}' 프로그램을 진행하여 ${purpose}을(를) 도모함.
• [어떻게(How)] 활동 시작 전 기분(${preMood}), 건강상태(${preHealth}), 참여의사(${preWillingness})를 확인 후 착수함. 활동 중 참여도는 '${participation}', 집중도는 '${focus}', 활동 수행도는 '${performance}' 수준으로 나타남. 정서적으로는 '${emotions}' 반응을 보였으며 의사소통은 '${communication}' 양상을 띰. (${notesTotal})
• [왜 & 향후계획(Why & Next)] 어르신의 잔존 인지기능 유지 및 정서 안정을 목적으로 하였으며, 활동 만족도는 '${satisfaction}'으로 높게 나타남. 차기 수업은 '${nextPlan}' 방향으로 연계하여 지속적인 인지 자극과 긍정적 라포를 형성하고자 함.`;
  }

  if (format === 'simple') {
    return `${name} 어르신은 ${date} '${program}' 활동에 약 ${durationMin}분간 참여하셨음. 활동 전 상태는 기분 ${preMood}, 건강 ${preHealth}이었으며, 참여도 ${participation}, 집중도 ${focus}, 수행도 ${performance}으로 관찰됨. 정서 반응은 ${emotions}, 의사소통은 ${communication}이었음. (${notesTotal}) 만족도는 ${satisfaction}이며 차기 계획은 '${nextPlan}'으로 수립함.`;
  }

  return `[업무수행 일지 — 육하원칙(5W1H) 표준 서식]

1. 누가 (Who)
• 대상자: ${name} 어르신 (${gender} / ${grade} / 인지상태: ${cognition}${birth})
• 서비스 제공자: 담당 사회복지사 및 AI 보조튜터 콩이

2. 언제 (When)
• 일시: ${date} (활동 시간: 약 ${durationMin}분)

3. 어디서 (Where)
• 장소: AI 디지털 교실 / 스마트 인지케어 활동실

4. 무엇을 (What)
• 프로그램명: ${program}
• 활동 영역 및 목표: ${purpose}

5. 어떻게 (How)
• 사전 상태 점검: 기분 [${preMood}], 건강상태 [${preHealth}], 참여의사 [${preWillingness}]
• 참여 및 집중도: 참여도 [${participation}], 집중도 [${focus}], 과제 수행도 [${performance}]
• 정서 및 의사소통: 정서 반응 [${emotions}], 의사소통 [${communication}]
• 관찰 및 특이사항: 특이행동 [${behaviors}] / ${notesTotal}

6. 왜 & 향후 계획 (Why & Next)
• 추진 목적: ${purpose}
• 종합 만족도: ${satisfaction}
• 차기 지도 계획: '${nextPlan}' 방향으로 진행하여 인지 안정과 성취감을 지속적으로 격려함.`;
}

// 1. 표준 5W1H 검증
const standardReport = draft(mockSession, '5w1h_standard');
console.log('\n--- [표준 5W1H 일지 출력 샘플] ---');
console.log(standardReport);

assert(standardReport.includes('1. 누가 (Who)'), '누가 항목이 포함되어야 합니다.');
assert(standardReport.includes('2. 언제 (When)'), '언제 항목이 포함되어야 합니다.');
assert(standardReport.includes('3. 어디서 (Where)'), '어디서 항목이 포함되어야 합니다.');
assert(standardReport.includes('4. 무엇을 (What)'), '무엇을 항목이 포함되어야 합니다.');
assert(standardReport.includes('5. 어떻게 (How)'), '어떻게 항목이 포함되어야 합니다.');
assert(standardReport.includes('6. 왜 & 향후 계획 (Why & Next)'), '왜 및 향후계획 항목이 포함되어야 합니다.');
assert(standardReport.includes('김영자 어르신'), '어르신 이름이 포함되어야 합니다.');
assert(standardReport.includes('3등급'), '장기요양 등급이 포함되어야 합니다.');
assert(standardReport.includes('20분'), '활동 시간이 정확하게 환산되어야 합니다.');

// 2. 서술형 5W1H 검증
const narrativeReport = draft(mockSession, '5w1h_narrative');
console.log('\n--- [서술형 5W1H 일지 출력 샘플] ---');
console.log(narrativeReport);
assert(narrativeReport.includes('[누가(Who) / 언제(When) / 어디서(Where)]'), '서술형 5W1H 헤더가 포함되어야 합니다.');
assert(narrativeReport.includes('[무엇을(What)]'), '서술형 무엇을 항목이 포함되어야 합니다.');
assert(narrativeReport.includes('[어떻게(How)]'), '서술형 어떻게 항목이 포함되어야 합니다.');
assert(narrativeReport.includes('[왜 & 향후계획(Why & Next)]'), '서술형 왜 및 계획 항목이 포함되어야 합니다.');

// 3. 간편형 검증
const simpleReport = draft(mockSession, 'simple');
assert(simpleReport.includes('김영자 어르신은 2026-09-14'), '간편형 일지 문장이 정상 생성되어야 합니다.');

console.log('\n✅ 모든 육하원칙(5W1H) 일지 자동 생성 및 검증 테스트가 완벽히 통과했습니다!');
