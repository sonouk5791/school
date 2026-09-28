/**
 * 디지털 AI 학교 자동 프로그램 편성 시스템 8대 필수 테스트
 * (Requirements 1~39 Verification Suite)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock Browser Environment
class MockStorage {
  constructor() { this.store = {}; }
  getItem(k) { return this.store.hasOwnProperty(k) ? this.store[k] : null; }
  setItem(k, v) { this.store[k] = String(v); }
  removeItem(k) { delete this.store[k]; }
  clear() { this.store = {}; }
}

global.localStorage = new MockStorage();
global.sessionStorage = new MockStorage();
global.window = {
  localStorage: global.localStorage,
  sessionStorage: global.sessionStorage,
  dispatchEvent: () => {}
};
global.CustomEvent = class {
  constructor(name, opts) { this.name = name; this.detail = opts ? opts.detail : null; }
};

// 1. Load ProgramLibrary
const libCode = fs.readFileSync(path.join(__dirname, '../js/program-library.js'), 'utf8');
eval(libCode);
const ProgramLibrary = global.window.ProgramLibrary;

// 2. Load AutoScheduler
const schedulerCode = fs.readFileSync(path.join(__dirname, '../js/auto-scheduler.js'), 'utf8');
eval(schedulerCode);
const AutoScheduler = global.window.AutoScheduler;

// 3. Load RecordManager
const recordCode = fs.readFileSync(path.join(__dirname, '../js/record-manager.js'), 'utf8');
eval(recordCode);
const RecordManager = global.window.RecordManager;

console.log('════════════════════════════════════════════════════════════');
console.log('🤖 디지털 AI 학교 프로그램 자동 편성 시스템 8대 필수 테스트');
console.log('════════════════════════════════════════════════════════════\n');

// ── 테스트 1: 오늘 프로그램 자동 생성 정상 확인 ──
console.log('--- [테스트 1] 오늘 프로그램 자동 생성 정상 생성 여부 확인 ---');
const todayStr = '2026-10-05'; // 월요일
const todaySlot = AutoScheduler.generateDaily(todayStr, { autoConfirm: false });
assert(todaySlot, '오늘 슬롯 생성 완료');
assert.strictEqual(todaySlot.date, todayStr);
assert.strictEqual(todaySlot.dayName, '월요일');
assert(todaySlot.am, '오전 프로그램 슬롯 존재');
assert(todaySlot.pm, '오후 프로그램 슬롯 존재');
assert.strictEqual(todaySlot.am.lead.character, 'kongi', '오전 리드: 콩이 (운동)');
assert.strictEqual(todaySlot.am.partner.character, 'nabi', '오전 파트너: 나비 (인지)');
assert.strictEqual(todaySlot.pm.lead.character, 'tori', '오후 리드: 토리 (놀이)');
assert.strictEqual(todaySlot.pm.partner.character, 'bori', '오후 파트너: 보리 (취미)');
assert.strictEqual(todaySlot.am.totalDuration, 60, '오전 총 60분');
assert.strictEqual(todaySlot.pm.totalDuration, 60, '오후 총 60분');
console.log(`✅ 테스트 1 통과: 2026-10-05 오전 [${todaySlot.am.title}] / 오후 [${todaySlot.pm.title}] 정상 생성`);

// ── 테스트 2: 다음 주 프로그램 생성 (월~토 오전/오후 총 12개 수업 묶음 생성 확인) ──
console.log('\n--- [테스트 2] 다음 주 프로그램 생성 (월~토 12개 수업 묶음) ---');
const nextMonday = '2026-10-12';
const weeklyResult = AutoScheduler.generateWeekly(nextMonday, false);
assert.strictEqual(weeklyResult.days.length, 6, '월~토 총 6일 생성');
let totalSessionsCount = 0;
weeklyResult.days.forEach(d => {
  if (d.am && d.pm) totalSessionsCount += 2;
});
assert.strictEqual(totalSessionsCount, 12, '월~토 오전 6개 + 오후 6개 = 총 12개 수업 묶음 검증');
console.log(`✅ 테스트 2 통과: ${nextMonday} 주간 월~토 6일간 총 ${totalSessionsCount}개 수업 정상 편성 완료`);

// ── 테스트 3: 다음 달 프로그램 생성 (해당 월 모든 운영일 일정 생성 확인) ──
console.log('\n--- [테스트 3] 다음 달 프로그램 생성 (10월 전 일자 생성) ---');
const monthlyResult = AutoScheduler.generateMonthly(2026, 10, false);
assert.strictEqual(monthlyResult.year, 2026);
assert.strictEqual(monthlyResult.month, 10);
assert.strictEqual(monthlyResult.totalDays, 31, '10월 31일 전 일자 생성');
const sampleDay = AutoScheduler.getScheduleForDate('2026-10-21');
assert(sampleDay, '10월 21일 스케줄 존재');
console.log(`✅ 테스트 3 통과: 2026년 10월 1일~31일 (총 ${monthlyResult.totalDays}일) 일정 자동 생성 확인`);

// ── 테스트 4: 같은 프로그램 지나친 중복 방지 (7일 이내 및 이틀 연속 방지) ──
console.log('\n--- [테스트 4] 중복 방지 검증 (7일 이내 반복 방지 & 이틀 연속 방지) ---');
// Examine week from 2026-10-12
const kongiTitlesInWeek = weeklyResult.days.map(d => (d.am && d.am.lead && d.am.lead.title) || '').filter(Boolean);
const kongiUniqueTitles = new Set(kongiTitlesInWeek);
assert.strictEqual(kongiTitlesInWeek.length, kongiUniqueTitles.size, '일주일 내 콩이 운동 타이틀 중복 없음');

// Check consecutive days
for (let i = 0; i < weeklyResult.days.length - 1; i++) {
  const day1 = weeklyResult.days[i];
  const day2 = weeklyResult.days[i + 1];
  const d1Kongi = day1.am && day1.am.lead ? day1.am.lead.id : null;
  const d2Kongi = day2.am && day2.am.lead ? day2.am.lead.id : null;
  const d1Tori = day1.pm && day1.pm.lead ? day1.pm.lead.id : null;
  const d2Tori = day2.pm && day2.pm.lead ? day2.pm.lead.id : null;
  const d1Bori = day1.pm && day1.pm.partner ? day1.pm.partner.id : null;
  const d2Bori = day2.pm && day2.pm.partner ? day2.pm.partner.id : null;

  assert.notStrictEqual(d1Kongi, d2Kongi, '콩이 이틀 연속 동일 프로그램 금지');
  assert.notStrictEqual(d1Tori, d2Tori, '토리 이틀 연속 동일 프로그램 금지');
  assert.notStrictEqual(d1Bori, d2Bori, '보리 이틀 연속 동일 프로그램 금지');
}
console.log(`✅ 테스트 4 통과: 일주일 6일간 콩이 활동 [${kongiTitlesInWeek.join(', ')}] 중복 0건 및 연속 편성 배제 확인`);

// ── 테스트 5: 계절 프로그램이 날짜에 맞게 반영되는지 확인 ──
console.log('\n--- [테스트 5] 계절 및 기념일 테마 반영 확인 ---');
const autumnDt = new Date('2026-10-15');
const autumnSeason = AutoScheduler.detectSeason(autumnDt);
assert.strictEqual(autumnSeason, '가을', '10월은 가을 감지');

const springDt = new Date('2026-04-15');
const springSeason = AutoScheduler.detectSeason(springDt);
assert.strictEqual(springSeason, '봄', '4월은 봄 감지');

const chuseokDt = new Date('2026-09-25');
const chuseokHoliday = AutoScheduler.detectHoliday(chuseokDt);
assert(chuseokHoliday && chuseokHoliday.name === '추석', '9월 하순 추석 명절 감지');
console.log('✅ 테스트 5 통과: 가을(10월), 봄(4월), 추석 명절 테마 자동 인식 확인');

// ── 테스트 6: 기관 행사 날짜에 일반 수업이 잘못 중복 생성되지 않는지 확인 ──
console.log('\n--- [테스트 6] 기관 행사 날짜 일반 수업 중복 방지 ---');
// 2026-10-15 has registered birthday party in events
const eventSlot = AutoScheduler.generateDaily('2026-10-15');
assert(eventSlot.facilityEvent, '기관 행사 등록 감지');
assert(eventSlot.am.title.includes('생신잔치'), '오전에 일반 체조 대신 행사 배치');
assert.strictEqual(eventSlot.am.isEvent, true);
console.log(`✅ 테스트 6 통과: 2026-10-15 기관 행사일 [${eventSlot.am.title}] 배치 및 일반 수업 중복 차단 확인`);

// ── 테스트 7: 휴무일에는 일정이 생성되지 않는지 확인 ──
console.log('\n--- [테스트 7] 휴무일(일요일 및 공휴일) 생성 제외 확인 ---');
const sundaySlot = AutoScheduler.generateDaily('2026-10-11'); // Sunday
assert.strictEqual(sundaySlot.isOffDay, true, '일요일 휴무 플래그 일치');
assert.strictEqual(sundaySlot.amStatus, '휴무');

const holidaySlot = AutoScheduler.generateDaily('2026-10-03'); // 개천절 (offDay list)
assert.strictEqual(holidaySlot.isOffDay, true, '공휴일 휴무 플래그 일치');
console.log('✅ 테스트 7 통과: 일요일 및 공휴일(개천절) 정기 휴무 정상 감지 확인');

// ── 테스트 8: 수업 완료 기록이 다음 추천에 반영되는지 확인 ──
console.log('\n--- [테스트 8] 수업 참여도/기분 피드백의 다음 추천 반영 확인 ---');
// Seed records where '음악' has good mood, and '계산' was difficult
RecordManager.saveRecord({
  lessonTitle: '보리 옛 노래 듣기',
  mood: '😀 너무 재미있었어요',
  participation: '◎ 적극 참여'
});
RecordManager.saveRecord({
  lessonTitle: '나비 숫자·계산 활동',
  mood: '😐 조금 힘들었어요',
  participation: '△ 일부 참여'
});

const stats = AutoScheduler.analyzeRecentCareStats();
assert(stats.preferredDomains.includes('음악') || stats.domainScores['음악'] > 0, '음악 선호 점수 증가');
console.log('분석된 도메인 스코어:', stats.domainScores);
console.log('✅ 테스트 8 통과: 최근 수업 참여도/기분 분석이 스코어링 시스템에 유효하게 반영됨을 확인');

console.log('\n======================================================');
console.log('🎉 자동 프로그램 편성 시스템 8대 필수 테스트 100% 통과!');
console.log('======================================================');
