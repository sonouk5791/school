/**
 * 실제 물리적 음향 물리 모델링 사운드 엔진 (Web Audio API 기반)
 * - 유리구슬 부딪히는 맑은 소리 (Glass Marble Collision)
 * - 종이 딱지 바닥 치는 타격음 (Paper Ttakji Slap)
 * - 얼음판 팽이 치는 소리 및 회전음 (Spinning Top)
 * - 옛날 학교 땡그랑 종소리 (School Bell)
 * - 다듬이돌 방망이 장단 소리 (Ironing Stone Rhythm)
 * - 뻥튀기 기계 "뻥이요" 소리 (Popped Rice)
 * - 책장 넘어가는 사각거리는 종이 소리 (Page Turn)
 * - 발풍금 오르간 정겨운 화음 (Harmonium Organ)
 * - 달고나 바늘 톡톡 소리 (Dalgona Needle Tap)
 * - 시냇물 물소리 (Stream Water)
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  /**
   * 노이즈 버퍼 생성 헬퍼 (종이 소리, 바람, 타격음 합성용)
   */
  private createNoiseBuffer(duration: number = 0.2): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // ─────────────────────────────────────────────────────────────
  // 🔮 [1] 실제 유리구슬끼리 부딪히는 맑고 찰진 소리 ("딱! 따닥!")
  // ─────────────────────────────────────────────────────────────
  public playMarbles() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 유리알 1차 충돌 (메인 충돌음)
      this.triggerGlassHit(now, 2900, 1.0);
      // 유리알 미세 리바운드 2차 충돌 (약 38ms 후 자연스러운 반동음)
      this.triggerGlassHit(now + 0.038, 3150, 0.65);
      // 3차 잔반동 (약 72ms 후 아주 작은 톡)
      this.triggerGlassHit(now + 0.072, 3300, 0.3);
    } catch {
      // Ignore
    }
  }

  private triggerGlassHit(time: number, baseFreq: number, intensity: number) {
    if (!this.ctx) return;

    // 1. 고주파 유리 공명음 (크리스탈 맑은 소리)
    const glassOsc = this.ctx.createOscillator();
    const glassGain = this.ctx.createGain();
    glassOsc.type = 'sine';
    glassOsc.frequency.setValueAtTime(baseFreq, time);
    glassOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.98, time + 0.08);

    glassGain.gain.setValueAtTime(0, time);
    glassGain.gain.linearRampToValueAtTime(0.45 * intensity, time + 0.001); // 1ms sharp attack
    glassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.075);

    glassOsc.connect(glassGain);
    glassGain.connect(this.ctx.destination);

    glassOsc.start(time);
    glassOsc.stop(time + 0.08);

    // 2. 2차 고조파 (오버톤: 단단한 유리 표면감)
    const overtoneOsc = this.ctx.createOscillator();
    const overtoneGain = this.ctx.createGain();
    overtoneOsc.type = 'sine';
    overtoneOsc.frequency.setValueAtTime(baseFreq * 1.85, time);

    overtoneGain.gain.setValueAtTime(0.2 * intensity, time);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    overtoneOsc.connect(overtoneGain);
    overtoneGain.connect(this.ctx.destination);

    overtoneOsc.start(time);
    overtoneOsc.stop(time + 0.045);

    // 3. 묵직한 구슬 코어 임팩트 (단단한 질량감)
    const thudOsc = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thudOsc.type = 'triangle';
    thudOsc.frequency.setValueAtTime(380, time);
    thudOsc.frequency.exponentialRampToValueAtTime(80, time + 0.02);

    thudGain.gain.setValueAtTime(0.35 * intensity, time);
    thudGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);

    thudOsc.connect(thudGain);
    thudGain.connect(this.ctx.destination);

    thudOsc.start(time);
    thudOsc.stop(time + 0.03);
  }

  // ─────────────────────────────────────────────────────────────
  // 📦 [2] 종이 딱지 바닥에 힘차게 내리치는 소리 ("착! 팡!")
  // ─────────────────────────────────────────────────────────────
  public playDdakji() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. 공기 가르는 스냅 & 마찰 노이즈
      const noiseBuffer = this.createNoiseBuffer(0.12);
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(3.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.1);
      }

      // 2. 바닥을 때리는 묵직한 타격음 (저음 쿵)
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thud.type = 'triangle';
      thud.frequency.setValueAtTime(160, now);
      thud.frequency.exponentialRampToValueAtTime(45, now + 0.1);

      thudGain.gain.setValueAtTime(0.6, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      thud.connect(thudGain);
      thudGain.connect(this.ctx.destination);

      thud.start(now);
      thud.stop(now + 0.13);
    } catch {
      // Ignore
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 🌀 [3] 얼음판 팽이 치는 소리 (채찍 소리 + 팽이 쌩쌩 회전음)
  // ─────────────────────────────────────────────────────────────
  public playTopSpin() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 채찍 스냅
      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snap.type = 'sawtooth';
      snap.frequency.setValueAtTime(1200, now);
      snap.frequency.exponentialRampToValueAtTime(300, now + 0.06);

      snapGain.gain.setValueAtTime(0.4, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      snap.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snap.start(now);
      snap.stop(now + 0.07);

      // 팽이 쌩쌩 회전음 (진동음)
      const spin = this.ctx.createOscillator();
      const spinGain = this.ctx.createGain();
      spin.type = 'sine';
      spin.frequency.setValueAtTime(220, now + 0.03);
      spin.frequency.linearRampToValueAtTime(380, now + 0.25);
      spin.frequency.exponentialRampToValueAtTime(200, now + 0.55);

      spinGain.gain.setValueAtTime(0, now + 0.03);
      spinGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
      spinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      spin.connect(spinGain);
      spinGain.connect(this.ctx.destination);
      spin.start(now + 0.03);
      spin.stop(now + 0.56);
    } catch {
      // Ignore
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 📖 [4] 사각사각 책장 / 카드 뒤집는 리얼 종이 소리 (Page Flip)
  // ─────────────────────────────────────────────────────────────
  public playPaperFlip() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const noiseBuffer = this.createNoiseBuffer(0.18);
      if (!noiseBuffer) return;

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, now);
      filter.frequency.exponentialRampToValueAtTime(900, now + 0.16);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.18);
    } catch {
      // Ignore
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 🔔 [5] 추억의 학교 종소리 / 아이스케키 땡그랑 벨소리 (School Bell)
  // ─────────────────────────────────────────────────────────────
  public playSchoolBell() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const harmonics = [1046.5, 1568.0, 2093.0, 3136.0]; // C6, G6, C7, G7

      harmonics.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const decay = 0.8 - idx * 0.12;
        gain.gain.setValueAtTime(0.25 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {
      // Ignore
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 🥢 [6] 다듬이돌과 방망이 정겨운 장단 ("또닥 또닥")
  // ─────────────────────────────────────────────────────────────
  public playIroning() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const knocks = [
        { time: 0, freq: 820 },
        { time: 0.12, freq: 940 },
        { time: 0.22, freq: 820 },
        { time: 0.32, freq: 940 },
      ];

      knocks.forEach((k) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(k.freq, now + k.time);
        osc.frequency.exponentialRampToValueAtTime(200, now + k.time + 0.05);

        gain.gain.setValueAtTime(0.4, now + k.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + k.time + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + k.time);
        osc.stop(now + k.time + 0.06);
      });
    } catch {
      // Ignore
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 💥 [7] 뻥튀기 기계 "뻥이요~" 소리 (Popped Rice Boom)
  // ─────────────────────────────────────────────────────────────
  public playPoppedRice() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 묵직한 뻥 폭발음
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.35);

      subGain.gain.setValueAtTime(0.7, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.4);

      // 튀밥 흩어지는 파열 노이즈
      const noiseBuffer = this.createNoiseBuffer(0.25);
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.22);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.5, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.25);
      }
    } catch {
      // Ignore
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 🎹 [8] 옛날 교실 발풍금 오르간 따뜻한 화음 (Reed Organ Chord)
  // ─────────────────────────────────────────────────────────────
  public playOrgan() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5 (C Major)

      notes.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.9);
      });
    } catch {
      // Ignore
    }
  }

  // ─────────────────────────────────────────────────────────────
  // ⭐ [9] 달고나 바늘 콕콕 소리 (Dalgona Needle Tap)
  // ─────────────────────────────────────────────────────────────
  public playDalgonaTap() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const taps = [0, 0.09, 0.18];

      taps.forEach((t) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3400, now + t);
        osc.frequency.exponentialRampToValueAtTime(1800, now + t + 0.03);

        gain.gain.setValueAtTime(0.3, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + 0.04);
      });
    } catch {
      // Ignore
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 🏊 [10] 개울가 시원한 물소리 (Stream Water Splash)
  // ─────────────────────────────────────────────────────────────
  public playWaterSplash() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const noiseBuffer = this.createNoiseBuffer(0.35);
      if (!noiseBuffer) return;

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.linearRampToValueAtTime(1600, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(700, now + 0.32);
      filter.Q.setValueAtTime(4.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 🎯 추억 퀴즈 주제별 자동 실물 사운드 매핑 재생
  // ─────────────────────────────────────────────────────────────
  public playSoundByTheme(type: string) {
    switch (type) {
      case 'marbles':
        this.playMarbles();
        break;
      case 'ddakji':
        this.playDdakji();
        break;
      case 'spinning-top':
        this.playTopSpin();
        break;
      case 'dalgona':
        this.playDalgonaTap();
        break;
      case 'ice-candy':
        this.playSchoolBell();
        break;
      case 'classroom-stove':
      case 'reed-organ':
        this.playOrgan();
        break;
      case 'ironing-stone':
        this.playIroning();
        break;
      case 'popped-rice':
        this.playPoppedRice();
        break;
      case 'river-play':
        this.playWaterSplash();
        break;
      case 'sports-day':
      case 'fire-can':
        this.playVictory();
        break;
      default:
        this.playMarbles();
        break;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 기본 인터랙션 사운드 (카드 뒤집기, 정답 매치, 재시도, 축하)
  // ─────────────────────────────────────────────────────────────
  public playFlip() {
    this.playPaperFlip();
  }

  public playMatch() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // 맑은 하모닉 차임 (C5, E5, G5)
      const notes = [523.25, 659.25, 783.99];

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.28, now + i * 0.08 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  public playMismatch() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(240, now + 0.16);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  public playVictory() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.11);

        gain.gain.setValueAtTime(0, now + i * 0.11);
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.11 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.11);
        osc.stop(now + i * 0.11 + 0.45);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundManager();
