/**
 * 디지털 AI 학교 – 트로트 BGM 엔진 v1
 * Web Audio API로 실시간 합성하는 신나는 뽕짝 트로트 배경음악
 * 
 * 특징:
 * - 뽕짝 리듬 드럼 패턴 (쿵짝쿵짝)
 * - 트로트풍 멜로디 시퀀스 (경쾌한 펜타토닉)
 * - 베이스라인 자동 생성
 * - 챕터별 분위기 변화 (준비→본운동→마무리)
 * - 비트 콜백 (시각 효과 연동)
 * - 어르신에게 친숙한 한국 전통 음계 기반
 */

class TrotBgmEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.drumGain = null;
    this.melodyGain = null;
    this.bassGain = null;
    this.padGain = null;
    
    this.isPlaying = false;
    this.bpm = 120;
    this.beatCount = 0;
    this.nextBeatTime = 0;
    this.timerID = null;
    this.currentChapter = 0;
    this.onBeatCallback = null;  // (beatIndex, isStrong) => void
    
    // 트로트 스케일 (펜타토닉 + 경과음)
    // C4부터 시작하는 한국 전통 음계 느낌
    this.scales = {
      major:  [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
      penta:  [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25],
      trot:   [261.63, 293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46],
      minor:  [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25],
    };
    
    // 챕터별 설정 (8개 챕터)
    this.chapterConfigs = [
      // 0: 인사와 준비운동 (느리고 따뜻한 시작)
      { bpm: 100, scale: 'major', energy: 0.4, melodyStyle: 'gentle', drumIntensity: 0.3 },
      // 1: 목과 어깨 (중간 템포 트로트)
      { bpm: 116, scale: 'trot', energy: 0.7, melodyStyle: 'trot', drumIntensity: 0.7 },
      // 2: 손과 팔 (신나는 뽕짝)
      { bpm: 124, scale: 'trot', energy: 0.85, melodyStyle: 'trot', drumIntensity: 0.9 },
      // 3: 상체 체조 (활기찬)
      { bpm: 120, scale: 'penta', energy: 0.8, melodyStyle: 'cheerful', drumIntensity: 0.8 },
      // 4: 다리와 발목 (안정적 리듬)
      { bpm: 112, scale: 'trot', energy: 0.7, melodyStyle: 'trot', drumIntensity: 0.75 },
      // 5: 박수·리듬·인지 (가장 신남!)
      { bpm: 128, scale: 'trot', energy: 1.0, melodyStyle: 'festival', drumIntensity: 1.0 },
      // 6: 함께하는 복합 체조
      { bpm: 120, scale: 'penta', energy: 0.85, melodyStyle: 'cheerful', drumIntensity: 0.85 },
      // 7: 정리운동과 칭찬 (차분하게)
      { bpm: 96, scale: 'major', energy: 0.3, melodyStyle: 'gentle', drumIntensity: 0.2 },
    ];
    
    // 트로트 멜로디 패턴 (음정 인덱스 시퀀스)
    this.melodyPatterns = {
      gentle: [
        [0,2,4,2, 0,2,4,5],
        [4,5,4,2, 0,-1,0,2],
        [0,2,0,4, 2,4,5,4],
      ],
      trot: [
        [0,2,3,4, 5,4,3,2],
        [0,3,5,3, 0,2,3,5],
        [5,4,3,2, 3,4,5,7],
        [4,5,4,2, 0,3,2,0],
        [0,0,2,3, 5,5,4,3],
      ],
      cheerful: [
        [0,4,5,4, 2,4,5,7],
        [5,7,5,4, 2,0,2,4],
        [0,2,4,5, 7,5,4,2],
      ],
      festival: [
        [0,2,3,5, 7,5,3,2],
        [0,0,2,3, 5,5,7,7],
        [7,5,3,2, 3,5,7,5],
        [0,3,5,7, 5,3,2,0],
        [5,5,3,3, 2,2,0,0],
      ],
    };
    
    // 드럼 패턴 (비트별: K=킥, S=스네어, H=하이햇)
    // 뽕짝 리듬: 쿵(K)짝(S)쿵(K)짝(S)
    this.drumPatterns = {
      basic:    ['K','H','S','H', 'K','H','S','H'],
      trot:     ['K','H','S','H', 'K','K','S','H'],
      energetic:['K','S','K','S', 'K','S','K','S'],
      soft:     ['H','H','H','H', 'H','H','H','H'],
    };
    
    this.melodyNoteIndex = 0;
    this.currentPatternIdx = 0;
  }
  
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.08;
    this.masterGain.connect(this.ctx.destination);
    
    // 리미터 (클리핑 방지)
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 10;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.15;
    compressor.connect(this.masterGain);
    
    this.drumGain = this.ctx.createGain();
    this.drumGain.gain.value = 0.6;
    this.drumGain.connect(compressor);
    
    this.melodyGain = this.ctx.createGain();
    this.melodyGain.gain.value = 0.4;
    this.melodyGain.connect(compressor);
    
    this.bassGain = this.ctx.createGain();
    this.bassGain.gain.value = 0.35;
    this.bassGain.connect(compressor);
    
    this.padGain = this.ctx.createGain();
    this.padGain.gain.value = 0.15;
    this.padGain.connect(compressor);
  }
  
  start(chapter = 0) {
    if (this.isPlaying) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    this.isPlaying = true;
    this.beatCount = 0;
    this.setChapter(chapter);
    this.nextBeatTime = this.ctx.currentTime + 0.1;
    this.schedule();
  }
  
  stop() {
    this.isPlaying = false;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }
  
  setChapter(chIdx) {
    if (chIdx < 0 || chIdx >= this.chapterConfigs.length) return;
    this.currentChapter = chIdx;
    const cfg = this.chapterConfigs[chIdx];
    this.bpm = cfg.bpm;
    this.melodyNoteIndex = 0;
    this.currentPatternIdx = 0;
    
    // 부드러운 볼륨 전환
    if (this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(cfg.energy * 0.08, now + 1.5);
    }
  }
  
  setVolume(v) {
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, v)),
        this.ctx.currentTime + 0.3
      );
    }
  }
  
  schedule() {
    if (!this.isPlaying) return;
    
    const beatDur = 60 / this.bpm;
    const lookAhead = 0.15;
    
    while (this.nextBeatTime < this.ctx.currentTime + lookAhead) {
      const cfg = this.chapterConfigs[this.currentChapter];
      const beatInBar = this.beatCount % 8;
      const isStrong = beatInBar % 4 === 0;
      const isDownbeat = beatInBar === 0;
      
      // 드럼
      this.playDrumBeat(this.nextBeatTime, beatInBar, cfg);
      
      // 멜로디 (매 비트)
      this.playMelodyNote(this.nextBeatTime, beatInBar, cfg);
      
      // 베이스 (매 2비트)
      if (beatInBar % 2 === 0) {
        this.playBassNote(this.nextBeatTime, cfg);
      }
      
      // 패드 코드 (매 마디 시작)
      if (isDownbeat) {
        this.playPadChord(this.nextBeatTime, cfg);
      }
      
      // 비트 콜백
      if (this.onBeatCallback) {
        const beatTime = this.nextBeatTime;
        const beatIdx = this.beatCount;
        setTimeout(() => {
          if (this.isPlaying) this.onBeatCallback(beatIdx, isStrong);
        }, Math.max(0, (beatTime - this.ctx.currentTime) * 1000));
      }
      
      this.beatCount++;
      this.nextBeatTime += beatDur;
    }
    
    this.timerID = setTimeout(() => this.schedule(), 50);
  }
  
  // ── 드럼 합성 ──
  playDrumBeat(time, beatInBar, cfg) {
    if (cfg.drumIntensity < 0.1) return;
    
    let pattern;
    if (cfg.drumIntensity > 0.85) pattern = this.drumPatterns.energetic;
    else if (cfg.drumIntensity > 0.5) pattern = this.drumPatterns.trot;
    else if (cfg.drumIntensity > 0.2) pattern = this.drumPatterns.basic;
    else pattern = this.drumPatterns.soft;
    
    const hit = pattern[beatInBar];
    
    if (hit === 'K') this.playKick(time, cfg.drumIntensity);
    if (hit === 'S') this.playSnare(time, cfg.drumIntensity);
    if (hit === 'H') this.playHihat(time, cfg.drumIntensity);
  }
  
  playKick(time, intensity) {
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160 * intensity, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.08);
    env.gain.setValueAtTime(0.6 * intensity, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    osc.connect(env);
    env.connect(this.drumGain);
    osc.start(time);
    osc.stop(time + 0.3);
  }
  
  playSnare(time, intensity) {
    // 노이즈 (간단한 노이즈 생성)
    const len = Math.floor(this.ctx.sampleRate * 0.15);
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.35 * intensity, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    
    noise.connect(filter);
    filter.connect(env);
    env.connect(this.drumGain);
    noise.start(time);
    noise.stop(time + 0.15);
    
    // 스네어 톤
    const osc = this.ctx.createOscillator();
    const tEnv = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 200;
    tEnv.gain.setValueAtTime(0.25 * intensity, time);
    tEnv.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.connect(tEnv);
    tEnv.connect(this.drumGain);
    osc.start(time);
    osc.stop(time + 0.12);
  }
  
  playHihat(time, intensity) {
    const len = Math.floor(this.ctx.sampleRate * 0.06);
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6000;
    
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.2 * intensity, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    
    noise.connect(filter);
    filter.connect(env);
    env.connect(this.drumGain);
    noise.start(time);
    noise.stop(time + 0.06);
  }
  
  // ── 멜로디 합성 ──
  playMelodyNote(time, beatInBar, cfg) {
    const scale = this.scales[cfg.scale] || this.scales.trot;
    const patterns = this.melodyPatterns[cfg.melodyStyle] || this.melodyPatterns.trot;
    
    // 현재 패턴
    const patIdx = this.currentPatternIdx % patterns.length;
    const pattern = patterns[patIdx];
    
    let noteIdx = pattern[beatInBar];
    // 범위 조정
    while (noteIdx < 0) noteIdx += scale.length;
    noteIdx = noteIdx % scale.length;
    
    const freq = scale[noteIdx];
    const beatDur = 60 / this.bpm;
    const noteDur = beatDur * 0.75;
    
    // 트로트 느낌: 살짝 비브라토가 있는 사각파 + 사인파 레이어
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(freq, time);
    
    // 비브라토
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = freq * 0.012; // 미세한 비브라토
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibrato.start(time);
    vibrato.stop(time + noteDur + 0.1);
    
    // 사인파 레이어 (부드러움 추가)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq;
    
    // 음량 엔벨로프
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(0.15 * cfg.energy, time + 0.02);
    env.gain.setValueAtTime(0.12 * cfg.energy, time + noteDur * 0.5);
    env.gain.linearRampToValueAtTime(0, time + noteDur);
    
    // 필터 (따뜻한 소리)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000 + (cfg.energy * 1500);
    filter.Q.value = 1.5;
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(env);
    env.connect(this.melodyGain);
    
    osc1.start(time);
    osc1.stop(time + noteDur);
    osc2.start(time);
    osc2.stop(time + noteDur);
    
    // 마디 끝에서 패턴 변경
    if (beatInBar === 7) {
      this.currentPatternIdx++;
    }
  }
  
  // ── 베이스 합성 ──
  playBassNote(time, cfg) {
    const scale = this.scales[cfg.scale] || this.scales.trot;
    // 베이스는 루트/5도 반복
    const bassNotes = [0, 4, 0, 3]; // 근음, 5도, 근음, 4도
    const bassIdx = (this.beatCount >> 1) % bassNotes.length;
    const freq = (scale[bassNotes[bassIdx]] || scale[0]) / 2; // 1옥타브 낮게
    
    const beatDur = 60 / this.bpm;
    const noteDur = beatDur * 1.8;
    
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.25 * cfg.energy, time);
    env.gain.linearRampToValueAtTime(0.15 * cfg.energy, time + noteDur * 0.7);
    env.gain.linearRampToValueAtTime(0, time + noteDur);
    
    osc.connect(env);
    env.connect(this.bassGain);
    osc.start(time);
    osc.stop(time + noteDur + 0.05);
  }
  
  // ── 패드 코드 합성 ──
  playPadChord(time, cfg) {
    const scale = this.scales[cfg.scale] || this.scales.trot;
    const chordProgressions = [
      [0, 2, 4],  // I
      [3, 5, 7],  // IV  
      [4, 6, 1],  // V
      [0, 2, 4],  // I
    ];
    
    const chordIdx = (Math.floor(this.beatCount / 8)) % chordProgressions.length;
    const chord = chordProgressions[chordIdx];
    const beatDur = 60 / this.bpm;
    const chordDur = beatDur * 7.5;
    
    chord.forEach((noteIdx, i) => {
      const idx = noteIdx % scale.length;
      const freq = scale[idx] * (noteIdx >= scale.length ? 2 : 1);
      
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * 0.5; // 낮은 옥타브
      
      const env = this.ctx.createGain();
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(0.08 * cfg.energy, time + 0.5);
      env.gain.setValueAtTime(0.06 * cfg.energy, time + chordDur * 0.7);
      env.gain.linearRampToValueAtTime(0, time + chordDur);
      
      osc.connect(env);
      env.connect(this.padGain);
      osc.start(time);
      osc.stop(time + chordDur + 0.1);
    });
  }
  
  destroy() {
    this.stop();
    if (this.ctx) {
      try { this.ctx.close(); } catch (e) {}
      this.ctx = null;
    }
  }
}

// 전역 싱글턴
window.TrotBgmEngine = TrotBgmEngine;
