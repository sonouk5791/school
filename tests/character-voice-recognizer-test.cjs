/**
 * ============================================================
 * character-voice-recognizer-test.cjs
 * 캐릭터 음성인식 & 웨이크워드 엔진 단위/통합 테스트
 * ============================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 [테스트 시작] 캐릭터 음성인식 & 웨이크워드 엔진 검증');

// ── 1. DOM 및 브라우저 환경 Mocking ──────────────────────────
class MockSpeechRecognition {
  constructor() {
    this.lang = 'ko-KR';
    this.continuous = true;
    this.interimResults = true;
    this.onstart = null;
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
  }
  start() {
    setTimeout(() => this.onstart && this.onstart(), 5);
  }
  stop() {
    setTimeout(() => this.onend && this.onend(), 5);
  }
}

const elements = new Map();
function createMockElement(id, className = '') {
  return {
    id,
    className,
    dataset: {},
    classList: {
      toggle(cls, val) { this[cls] = val; },
      contains(cls) { return !!this[cls]; }
    },
    style: {},
    offsetParent: {}, // visible
    clickCalled: false,
    click() { this.clickCalled = true; },
    focus() {},
    querySelector(sel) { return null; }
  };
}

const mockDoc = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, createMockElement(id));
    return elements.get(id);
  },
  querySelectorAll(sel) {
    return Array.from(elements.values());
  },
  querySelector(sel) {
    return Array.from(elements.values())[0] || null;
  },
  createElement(tag) {
    return createMockElement('el_' + Math.random().toString(36).substr(2));
  },
  body: {
    appendChild() {},
  },
  addEventListener() {}
};

const context = {
  window: {},
  document: mockDoc,
  SpeechRecognition: MockSpeechRecognition,
  webkitSpeechRecognition: MockSpeechRecognition,
  AudioContext: class {
    createOscillator() { return { type: '', frequency: { setValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
    createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
    currentTime = 0;
    destination = {};
  },
  VoiceManager: {
    speak(text) { context.__lastSpoken = text; }
  },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
};
context.window = context;

// ── 2. 스크립트 실행 및 인스턴스 로드 ─────────────────────────
const scriptCode = fs.readFileSync(path.join(__dirname, '../js/character-voice-recognizer.js'), 'utf8');
vm.createContext(context);
vm.runInContext(scriptCode, context);

const recognizer = context.voiceRecognizer;
assert(recognizer, '❌ CharacterVoiceRecognizer 인스턴스가 전역에 생성되어야 합니다.');
console.log('✅ 1. CharacterVoiceRecognizer 인스턴스 초기화 성공');

// ── 3. 초기 상태 및 기본값 검증 ──────────────────────────────
assert.strictEqual(recognizer.state, 'READY', '초기 상태는 READY(VOICE READY)여야 합니다.');
assert.strictEqual(recognizer.activeCharacter, 'kongi', '기본 활성 캐릭터는 콩이(kongi)여야 합니다.');
console.log('✅ 2. 초기 상태(VOICE READY) 및 기본 캐릭터(콩이) 검증 완료');

// ── 4. 웨이크워드 인식 테스트 ("콩이야", "토리야", "나비야", "보리야") ──
let wakeDetected = null;
recognizer.onWakeWordDetected = (charId, cfg) => {
  wakeDetected = charId;
};

// 4-1. 콩이야 호출
recognizer._handleSpeechResult({ text: '콩이야 안녕', isFinal: true });
assert.strictEqual(recognizer.state, 'LISTEN', '"콩이야" 호출 시 LISTEN 상태로 전환되어야 합니다.');
assert.strictEqual(wakeDetected, 'kongi', '감지된 캐릭터는 kongi여야 합니다.');
console.log('✅ 3-1. 콩이 웨이크워드("콩이야") 인식 및 LISTEN 상태 전환 통과');

// 4-2. 토리 호출
recognizer.setState('READY');
recognizer._handleSpeechResult({ text: '토리야', isFinal: true });
assert.strictEqual(recognizer.state, 'LISTEN', '"토리야" 호출 시 LISTEN 상태로 전환되어야 합니다.');
assert.strictEqual(recognizer.activeCharacter, 'tori', '활성 캐릭터가 토리(tori)로 전환되어야 합니다.');
console.log('✅ 3-2. 토리 웨이크워드("토리야") 인식 및 전환 통과');

// 4-3. 나비 호출
recognizer.setState('READY');
recognizer._handleSpeechResult({ text: '나비야', isFinal: true });
assert.strictEqual(recognizer.state, 'LISTEN');
assert.strictEqual(recognizer.activeCharacter, 'nabi');
console.log('✅ 3-3. 나비 웨이크워드("나비야") 인식 및 전환 통과');

// 4-4. 보리 호출
recognizer.setState('READY');
recognizer._handleSpeechResult({ text: '보리야', isFinal: true });
assert.strictEqual(recognizer.state, 'LISTEN');
assert.strictEqual(recognizer.activeCharacter, 'bori');
console.log('✅ 3-4. 보리 웨이크워드("보리야") 인식 및 전환 통과');

// ── 5. 정해진 단문 명령어 처리 검증 ─────────────────────────
let executedCommand = null;
recognizer.onCommandRecognized = (cmd, text) => {
  executedCommand = cmd;
};

// 5-1. "네" -> POSITIVE
recognizer.setState('LISTEN');
recognizer._handleSpeechResult({ text: '네', isFinal: true });
assert.strictEqual(executedCommand.intent, 'POSITIVE', '"네"는 POSITIVE 명령으로 인식되어야 합니다.');
console.log('✅ 4-1. 긍정 명령어("네") 분기 처리 통과');

// 5-2. "아니오" -> NEGATIVE
recognizer.setState('LISTEN');
recognizer._handleSpeechResult({ text: '아니오', isFinal: true });
assert.strictEqual(executedCommand.intent, 'NEGATIVE', '"아니오"는 NEGATIVE 명령으로 인식되어야 합니다.');
console.log('✅ 4-2. 부정 명령어("아니오") 분기 처리 통과');

// 5-3. "다음" -> NEXT
recognizer.setState('LISTEN');
recognizer._handleSpeechResult({ text: '다음으로', isFinal: true });
assert.strictEqual(executedCommand.intent, 'NEXT', '"다음으로"는 NEXT 명령으로 인식되어야 합니다.');
console.log('✅ 4-3. 다음 명령어("다음으로") 분기 처리 통과');

// 5-4. "다시 할래요" -> RETRY
recognizer.setState('LISTEN');
recognizer._handleSpeechResult({ text: '다시 할래요', isFinal: true });
assert.strictEqual(executedCommand.intent, 'RETRY', '"다시 할래요"는 RETRY 명령으로 인식되어야 합니다.');
console.log('✅ 4-4. 재시도 명령어("다시 할래요") 분기 처리 통과');

// ── 6. 연속 실패 처리 및 3회 시 대체 입력 유도 검증 ─────────
recognizer.setState('LISTEN');
recognizer.consecutiveFailCount = 0;

let failEvents = [];
recognizer.onRecognitionFailed = (info) => {
  failEvents.push(info);
};

// 1회 실패 (알 수 없는 이상한 발화)
recognizer._handleSpeechResult({ text: '뷁뛝뺡', isFinal: true });
assert.strictEqual(recognizer.consecutiveFailCount, 1);
assert.strictEqual(failEvents[0].hasFallbackButton, false);
console.log('✅ 5-1. 1회 실패 시 재시도 안내 유도 통과');

// 2회 실패
recognizer._handleSpeechResult({ text: '어버버', isFinal: true });
assert.strictEqual(recognizer.consecutiveFailCount, 2);
assert.strictEqual(failEvents[1].hasFallbackButton, false);
console.log('✅ 5-2. 2회 실패 시 재시도 안내 유도 통과');

// 3회 실패 -> 대체 입력 버튼 강조 트리거
recognizer._handleSpeechResult({ text: '웅얼웅얼', isFinal: true });
assert.strictEqual(failEvents[2].hasFallbackButton, true, '3회 실패 시 hasFallbackButton이 true여야 합니다.');
assert.strictEqual(recognizer.state, 'READY', '3회 실패 후에는 상태가 READY로 리셋되어야 합니다.');
console.log('✅ 5-3. 3회 연속 실패 시 화면 버튼 강조 및 대체 수단 유도 통과');

console.log('\n🎉 [모든 테스트 통과] 캐릭터 음성인식 & 웨이크워드 엔진이 정상 작동합니다!');
