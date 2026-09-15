const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser window environment
global.window = global;
global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] !== undefined ? this._data[k] : null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};
global.sessionStorage = global.localStorage;

const spokenUtterances = [];
global.SpeechSynthesisUtterance = function(text) {
  this.text = text;
  this.lang = 'ko-KR';
  this.pitch = 1.0;
  this.rate = 1.0;
  this.volume = 1.0;
  this.voice = null;
  this.onstart = null;
  this.onend = null;
  this.onerror = null;
};

// Edge mock voices
const mockVoicesEdge = [
  { name: 'Microsoft Heami - Korean (Korean)', lang: 'ko-KR' },
  { name: 'Microsoft InJoon Online (Natural) - Korean (Korea)', lang: 'ko-KR' },
  { name: 'Microsoft SunHi Online (Natural) - Korean (Korea)', lang: 'ko-KR' }
];

// Chrome mock voices
const mockVoicesChrome = [
  { name: 'Google 한국의', lang: 'ko-KR' },
  { name: 'Microsoft Heami Desktop - Korean', lang: 'ko-KR' }
];

let activeVoiceList = mockVoicesEdge;

global.speechSynthesis = {
  speaking: false,
  getVoices() {
    return activeVoiceList;
  },
  speak(utt) {
    spokenUtterances.push(utt);
    this.speaking = true;
    if (utt.onstart) utt.onstart();
    setTimeout(() => {
      this.speaking = false;
      if (utt.onend) utt.onend();
    }, 5);
  },
  cancel() {
    this.speaking = false;
  }
};
global.window.speechSynthesis = global.speechSynthesis;

// Mock DOM elements
const mockElements = {};
global.document = {
  getElementById(id) {
    if (!mockElements[id]) {
      mockElements[id] = { id, classList: { add(){}, remove(){} }, append(){}, setAttribute(){}, querySelector(){ return null; } };
    }
    return mockElements[id];
  },
  querySelectorAll() { return []; },
  querySelector() { return null; },
  addEventListener() {}
};

// Load voice.js
const voiceJsCode = fs.readFileSync(path.join(__dirname, '../js/voice.js'), 'utf8');
eval(voiceJsCode);

console.log('--- 1. Testing VoiceManager Character Profiles ---');
const profiles = VoiceManager.characterProfiles;
assert(profiles.kongi && profiles.tori && profiles.bori && profiles.nabi, 'All 4 characters must exist');

const pitches = [profiles.kongi.pitch, profiles.tori.pitch, profiles.bori.pitch, profiles.nabi.pitch];
const rates = [profiles.kongi.rate, profiles.tori.rate, profiles.bori.rate, profiles.nabi.rate];

console.log('Pitches:', pitches);
console.log('Rates:', rates);

assert.strictEqual(new Set(pitches).size, 4, 'All 4 characters must have distinct pitches');
assert.strictEqual(new Set(rates).size, 4, 'All 4 characters must have distinct rates');

// Verify tori is cute & high pitch (clear, cheerful, non-distorting sweet spot)
assert(profiles.tori.pitch >= 1.10 && profiles.tori.pitch <= 1.25, 'Tori should have cheerful cute pitch between 1.10 and 1.25');
// Verify bori is deep & calm
assert(profiles.bori.pitch <= 0.75, 'Bori should have deep calm pitch <= 0.75');
// Verify individual pause multipliers
assert(profiles.tori.pauseMultiplier < profiles.kongi.pauseMultiplier, 'Tori pause should be shorter for cheerful pacing');
assert(profiles.bori.pauseMultiplier > profiles.kongi.pauseMultiplier, 'Bori pause should be longer for relaxed pacing');

console.log('✅ Character profiles verified successfully!');

console.log('--- 2. Testing Intelligent Voice Matching (Edge environment) ---');
activeVoiceList = mockVoicesEdge;

// Bori should pick InJoon (male natural voice)
VoiceManager.characterId = 'bori';
const boriVoice = VoiceManager.getCharacterVoice();
console.log('Bori voice in Edge:', boriVoice.name);
assert(boriVoice.name.includes('InJoon'), 'Bori should be matched with InJoon male voice in Edge');

// Tori, Nabi, Kongi should pick SunHi (female natural voice) and avoid Heami
for (const id of ['kongi', 'tori', 'nabi']) {
  VoiceManager.characterId = id;
  const v = VoiceManager.getCharacterVoice();
  console.log(`${id} voice in Edge:`, v.name);
  assert(v.name.includes('SunHi'), `${id} should pick SunHi in Edge`);
  assert(!v.name.includes('Heami'), `${id} must NEVER pick robotic Heami`);
}
console.log('✅ Edge natural voice matching passed!');

console.log('--- 3. Testing Intelligent Voice Matching (Chrome environment) ---');
activeVoiceList = mockVoicesChrome;

// All should pick Google 한국의 and avoid Heami Desktop
for (const id of ['kongi', 'tori', 'bori', 'nabi']) {
  VoiceManager.characterId = id;
  const v = VoiceManager.getCharacterVoice();
  console.log(`${id} voice in Chrome:`, v.name);
  assert(v.name.includes('Google'), `${id} should pick Google in Chrome`);
  assert(!v.name.includes('Desktop'), `${id} must NEVER pick robotic Heami Desktop`);
}
console.log('✅ Chrome voice matching passed!');

console.log('--- 4. Testing Character Greetings and Feedback ---');
for (const id of ['kongi', 'tori', 'bori', 'nabi']) {
  const greeting = VoiceManager.getCharacterGreeting(id);
  const correct = VoiceManager.getCharacterFeedback('correct', id);
  const wrong = VoiceManager.getCharacterFeedback('wrong', id);
  console.log(`[${id}] Greeting:`, greeting);
  console.log(`[${id}] Correct Feedback:`, correct);
  console.log(`[${id}] Wrong Feedback:`, wrong);
  assert(greeting && greeting.length > 5, 'Greeting must be present');
  assert(correct && correct.length > 5, 'Correct feedback must be present');
  assert(wrong && wrong.length > 5, 'Wrong feedback must be present');
}
console.log('✅ Character greetings and feedbacks passed!');

console.log('--- 5. Testing Character Speak Utterances ---');
spokenUtterances.length = 0;
activeVoiceList = mockVoicesEdge;

const testPhrases = {};
for (const id of ['kongi', 'tori', 'bori', 'nabi']) {
  VoiceManager.characterId = id;
  VoiceManager.speak('반갑습니다');
  const lastUtt = spokenUtterances[spokenUtterances.length - 1];
  testPhrases[id] = { pitch: lastUtt.pitch, rate: lastUtt.rate, voice: lastUtt.voice?.name };
}
console.log('Utterance parameters per character:', testPhrases);
const testPitches = Object.values(testPhrases).map(p => p.pitch);
const testRates = Object.values(testPhrases).map(p => p.rate);
assert.strictEqual(new Set(testPitches).size, 4, 'Spoken pitches must all be distinct');
assert.strictEqual(new Set(testRates).size, 4, 'Spoken rates must all be distinct');

console.log('--- ALL CHARACTER VOICE VERIFICATION TESTS PASSED! ---');
