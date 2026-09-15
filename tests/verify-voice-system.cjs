const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser globals
global.window = global;
global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] !== undefined ? this._data[k] : null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};
global.sessionStorage = {
  _data: {},
  getItem(k) { return this._data[k] !== undefined ? this._data[k] : null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};

// Mock SpeechSynthesis
const spokenUtterances = [];
global.SpeechSynthesisUtterance = function(text) {
  this.text = text;
  this.lang = 'ko-KR';
  this.pitch = 1.0;
  this.rate = 1.0;
  this.volume = 1.0;
  this.onstart = null;
  this.onend = null;
  this.onerror = null;
};
global.speechSynthesis = {
  speaking: false,
  getVoices() {
    return [
      { name: 'Microsoft SunHi Online (Natural) - Korean (Korea)', lang: 'ko-KR' },
      { name: 'Google 한국어', lang: 'ko-KR' }
    ];
  },
  speak(utt) {
    spokenUtterances.push(utt);
    this.speaking = true;
    if (utt.onstart) utt.onstart();
    setTimeout(() => {
      this.speaking = false;
      if (utt.onend) utt.onend();
    }, 10);
  },
  cancel() {
    this.speaking = false;
  }
};
global.window.speechSynthesis = global.speechSynthesis;

// Mock DOM elements
const elements = {};
function createMockEl(id, tagName = 'div') {
  return {
    id,
    tagName,
    textContent: '',
    innerHTML: '',
    className: '',
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); },
      toggle(c) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); }
    },
    addEventListener() {},
    setAttribute() {},
    getAttribute() { return ''; },
    click() {}
  };
}

global.document = {
  getElementById(id) {
    if (!elements[id]) elements[id] = createMockEl(id);
    return elements[id];
  },
  querySelectorAll() { return []; },
  querySelector() { return null; },
  body: createMockEl('body')
};

// 1. Load modules
require('../js/voice-scripts.js');
require('../js/voice.js');
require('../js/lesson-data.js');

console.log('--- 1. Testing VoiceScripts Data Structure (Sections 6-26) ---');
assert(window.VoiceScripts, 'VoiceScripts must be loaded on window');
assert(window.VoiceScripts.welcome, 'VoiceScripts.welcome must exist');
assert(window.VoiceScripts.welcome.voiceScript.includes('안녕하세요~ 반갑습니다'), 'Welcome script matches Section 6');
assert.equal(window.VoiceScripts.correctAnswers.length, 5, 'Must have 5 random correct feedbacks (Section 16)');
assert.equal(window.VoiceScripts.wrongAnswers.length, 5, 'Must have 5 random wrong feedbacks (Section 17)');
assert(window.VoiceScripts.wrongAnswers.every(w => !w.text.includes('틀렸습니다')), 'Wrong answers must never say 틀렸습니다');
assert(window.VoiceScripts.help.intro.includes('어려우신가요? 괜찮아요'), 'Help intro matches Section 18');
assert(window.VoiceScripts.inactivity.voiceScript.includes('천천히 하셔도 괜찮아요'), 'Inactivity matches Section 21');
assert(window.VoiceScripts.navPrev.voiceScript.includes('이전 내용'), 'Nav prev matches Section 22');
assert(window.VoiceScripts.navNext.voiceScript.includes('다음 내용'), 'Nav next matches Section 23');
assert(window.VoiceScripts.lessonComplete.voiceScript.includes('오늘 수업은 여기까지입니다'), 'Lesson complete matches Section 24');
assert(window.VoiceScripts.allComplete.voiceScript.includes('축하드려요! AI 디지털 학교의 수업을 잘 마치셨습니다'), 'All complete matches Section 25');
console.log('✅ VoiceScripts structure passed!');

console.log('--- 2. Testing VoiceManager Engine (Sections 1-4, 27, 28, 30) ---');
window.VoiceManager.init();
assert.equal(window.VoiceManager.isMuted, false, 'Default should not be muted');
assert.equal(window.VoiceManager.speedMode, 'normal', 'Default speed mode should be normal');
assert(window.VoiceManager.koreanVoice, 'Must pick natural Korean voice');
console.log('Picked Korean voice:', window.VoiceManager.koreanVoice.name);

// Test speed toggle
window.VoiceManager.toggleSpeed();
assert.equal(window.VoiceManager.speedMode, 'slow', 'Speed toggle should set to slow');
assert.equal(localStorage.getItem('digital_school_voice_speed'), 'slow', 'Speed saved in localStorage');

window.VoiceManager.toggleSpeed();
assert.equal(window.VoiceManager.speedMode, 'normal', 'Speed toggle should return to normal');

// Test mute toggle
window.VoiceManager.toggleMute();
assert.equal(window.VoiceManager.isMuted, true, 'Mute toggle should mute');
assert.equal(localStorage.getItem('digital_school_voice_enabled'), 'false', 'Mute saved in localStorage');

window.VoiceManager.toggleMute();
assert.equal(window.VoiceManager.isMuted, false, 'Mute toggle should unmute');

// Test chunk splitting
const chunks = window.VoiceManager._splitIntoChunks("안녕하세요~ 반갑습니다. 오늘 저녁 메뉴 추천해줘, 라고 적어보세요. 어떠신가요?");
assert(chunks.length >= 3, 'Must split into natural breathing chunks');
assert(chunks[chunks.length - 1].isQuestion, 'Last chunk ending with ? must be question');

// Test pause and resume
window.VoiceManager.speak("선생님 음성 안내를 일시정지하고 이어듣는 기능을 테스트합니다.");
window.VoiceManager.pauseSpeaking();
assert.equal(window.VoiceManager.isPaused, true, 'isPaused must be true after pauseSpeaking');
window.VoiceManager.resumeSpeaking();
assert.equal(window.VoiceManager.isPaused, false, 'isPaused must be false after resumeSpeaking');
window.VoiceManager.togglePause();
assert.equal(window.VoiceManager.isPaused, true, 'togglePause should pause');
window.VoiceManager.togglePause();
assert.equal(window.VoiceManager.isPaused, false, 'togglePause should resume');
window.VoiceManager.stopSpeaking();
assert.equal(window.VoiceManager.isPaused, false, 'stopSpeaking should reset pause state');

console.log('✅ VoiceManager engine passed!');

console.log('--- 3. Testing LESSON_CATALOG AI Courses (Sections 8-15) ---');
assert(window.LESSON_CATALOG, 'LESSON_CATALOG must exist');
const expectedAiLessons = ['ai_basic', 'prompt_basic', 'ai_writing', 'ai_image', 'ai_video', 'ai_music', 'ai_life', 'ai_quiz'];
expectedAiLessons.forEach(id => {
  const found = window.LESSON_CATALOG.find(l => l.id === id);
  assert(found, `Lesson with id "${id}" must exist in LESSON_CATALOG`);
  assert(found.steps.length > 0, `Lesson "${id}" must have steps`);
  found.steps.forEach((st, idx) => {
    assert(st.voiceScript, `Step ${idx + 1} of ${id} must have voiceScript (Section 5 & 26)`);
    assert(st.screenText, `Step ${idx + 1} of ${id} must have screenText`);
    assert(st.helpScript, `Step ${idx + 1} of ${id} must have helpScript`);
  });
});
console.log(`✅ All 8 AI lessons verified with voiceScript, screenText, and helpScript!`);

console.log('--- 4. Testing Quiz Answers (Sections 15-17) ---');
const quizLesson = window.LESSON_CATALOG.find(l => l.id === 'ai_quiz');
assert(quizLesson, 'ai_quiz must exist');
const q1 = quizLesson.steps[0];
const correctOpt = q1.options.find(o => o.isBest === true);
const wrongOpt = q1.options.find(o => o.isBest === false);
assert(correctOpt, 'Question must have correct option');
assert(wrongOpt, 'Question must have wrong option');

console.log('--- ALL AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
