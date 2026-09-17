const assert = require('node:assert/strict');

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: key => (key in storage ? storage[key] : null),
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: key => { delete storage[key]; },
  clear: () => { for (const k in storage) delete storage[k]; }
};
global.window = global;

// Load record-manager.js
require('../js/record-manager.js');

console.log('--- Test 1: RecordManager Initialization ---');
RecordManager.init();
const initialRecords = RecordManager.getAllRecords();
assert.equal(initialRecords.length, 5, 'Initial seeded records should be 5');

const initialStats = RecordManager.getCareStats('all');
assert.equal(initialStats.totalSessions, 5, 'Total sessions should be 5');
assert.equal(initialStats.completedSessions, 5, 'Completed sessions should be 5');
assert.equal(initialStats.positiveRate, 100, 'Positive mood rate should be 100%');
assert.ok(initialStats.activeLearnersCount >= 5, 'Active learners count should be at least 5');

console.log('--- Test 2: Registered Learners ---');
const learners = RecordManager.getRegisteredLearners();
assert.ok(learners.includes('김영자 어르신'));
assert.ok(learners.includes('박순옥 어르신'));
assert.ok(learners.includes('이종수 어르신'));
assert.ok(learners.includes('정태호 어르신'));
assert.ok(learners.includes('최말순 어르신'));

console.log('--- Test 3: Filtering by Learner ---');
const kimStats = RecordManager.getCareStats('김영자 어르신');
assert.equal(kimStats.totalSessions, 2, '김영자 어르신 should have 2 sessions in seed');
assert.equal(kimStats.activeLearnersCount, 1);

console.log('--- Test 4: Save Record & Stats Increment ---');
const newRec = RecordManager.saveRecord({
  learner: '박순옥 어르신',
  lessonTitle: '🎨 AI 그림 만들기',
  lessonIcon: '🎨',
  isCompleted: true,
  mood: '😊 재미있었어요',
  moodEmoji: '😊',
  assistanceNeeded: '스스로 원활히 참여하심',
  durationText: '3분 15초'
});

assert.equal(newRec.learner, '박순옥 어르신');
const afterStats = RecordManager.getCareStats('all');
assert.equal(afterStats.totalSessions, 6, 'Total sessions should increment from 5 to 6');
assert.equal(afterStats.completedSessions, 6);

const parkStats = RecordManager.getCareStats('박순옥 어르신');
assert.equal(parkStats.totalSessions, 2, '박순옥 어르신 sessions should increment to 2');

console.log('--- Test 5: Positive Mood Calculation ---');
RecordManager.saveRecord({
  learner: '최말순 어르신',
  lessonTitle: '🧠 기억 놀이',
  lessonIcon: '🧠',
  isCompleted: true,
  mood: '조금 피곤해요',
  moodEmoji: '😴',
  assistanceNeeded: '천천히 반복 설명 필요',
  durationText: '2분 50초'
});

const latestStats = RecordManager.getCareStats('all');
assert.equal(latestStats.totalSessions, 7);
// 6 positive out of 7 = 86%
assert.equal(latestStats.positiveRate, Math.round((6 / 7) * 100));

console.log('ALL TESTS PASSED: Care Dashboard & RecordManager working perfectly!');
