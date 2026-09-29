/**
 * 디지털 학교 - 고음질 화음 반주 & 정확한 박자 노래방 엔진 (Harmonic Karaoke Engine)
 * 1. AudioContext Timeline 스케줄링으로 1ms의 박자 오차도 없는 완벽한 리듬 구현
 * 2. 멜로디 + 베이스 + 코드(화음) 3단 오케스트레이션으로 풍성하고 따뜻한 피아노/오르골 반주
 * 3. 노래방 가사 글자와 반주음의 100% 싱크
 */

const KaraokeEngine = {
  audioCtx: null,
  isPlaying: false,
  activeNodes: [],
  animFrameId: null,
  songStartTime: 0,
  currentSongIndex: 0,

  // 어르신 애창 트로트 & 정겨운 옛노래 데이터 (계이름, 박자, 가사, 반주 코드)
  SONGS: [
    {
      id: 'age',
      title: '내 나이가 어때서',
      emoji: '🌸',
      themeBadge: '🌸 야야야 내 나이가 어때서 사랑하기 딱 좋은 나인데',
      backgroundImg: 'assets/images/korean_sunflower.jpg',
      tempo: 116,
      notes: [
        ['G4', 0.5, '야', 'C'], ['G4', 0.5, '야', 'C'], ['G4', 1, '야', 'C'],
        ['C5', 1, '내', 'C'], ['C5', 1, '나', 'C'], ['A4', 1, '이', 'F'], ['G4', 1, '가', 'C'], ['E4', 1, '어', 'C'], ['G4', 1, '때', 'C'], ['A4', 2, '서~', 'F'],
        ['G4', 1, '사', 'C'], ['E4', 1, '랑', 'C'], ['D4', 1, '에', 'G'], ['C4', 1, '나', 'C'], ['E4', 1, '이', 'C'], ['G4', 1, '가', 'C'], ['A4', 1, '있', 'F'], ['G4', 3, '나~요~', 'C'],
        ['C5', 1, '마', 'F'], ['C5', 1, '음', 'F'], ['A4', 1, '은', 'F'], ['G4', 1, '하', 'C'], ['E4', 1, '나', 'C'], ['G4', 2, '요', 'C'],
        ['A4', 1, '느', 'F'], ['A4', 1, '낌', 'F'], ['G4', 1, '도', 'C'], ['E4', 1, '하', 'C'], ['D4', 3, '나~요~', 'G'],
        ['C4', 1, '그', 'C'], ['E4', 1, '대', 'C'], ['G4', 1, '만', 'C'], ['A4', 1, '이', 'F'], ['C5', 1, '정', 'F'], ['C5', 1, '말', 'F'], ['A4', 1, '내', 'F'],
        ['G4', 1, '사', 'C'], ['E4', 1, '랑', 'C'], ['G4', 2, '인', 'C'], ['C4', 4, '데~ 💖', 'C']
      ]
    },
    {
      id: 'south_train',
      title: '남행열차',
      emoji: '🌊',
      themeBadge: '🌊 비 내리는 호남선 남행열차에 흔들리는 차창 너머로',
      backgroundImg: 'assets/images/nostalgic_village_sunset.jpg',
      tempo: 118,
      notes: [
        ['A4', 1, '비', 'Am'], ['A4', 1, '내', 'Am'], ['C5', 1, '리', 'Am'], ['B4', 1, '는', 'Am'], ['A4', 1, '호', 'Am'], ['G4', 1, '남', 'C'], ['E4', 2, '선', 'C'],
        ['G4', 1, '남', 'C'], ['G4', 1, '행', 'C'], ['A4', 1, '열', 'F'], ['C5', 1, '차', 'F'], ['A4', 3, '에~', 'Am'],
        ['C5', 1, '흔', 'F'], ['C5', 1, '들', 'F'], ['A4', 1, '리', 'F'], ['G4', 1, '는', 'C'], ['E4', 1, '차', 'C'], ['G4', 1, '창', 'C'], ['A4', 1, '너', 'F'], ['G4', 1, '머', 'C'], ['E4', 3, '로~', 'C'],
        ['A4', 1, '빗', 'Am'], ['A4', 1, '물', 'Am'], ['C5', 1, '이', 'Am'], ['B4', 1, '흐', 'Am'], ['A4', 1, '르', 'Am'], ['G4', 2, '고', 'C'],
        ['E4', 1, '내', 'C'], ['G4', 1, '눈', 'C'], ['A4', 1, '물', 'F'], ['G4', 1, '도', 'C'], ['E4', 1, '흐', 'C'], ['D4', 2, '르', 'G'], ['C4', 4, '고~ 🌧️', 'C']
      ]
    },
    {
      id: 'andong',
      title: '안동역에서',
      emoji: '🚂',
      themeBadge: '🚂 바람에 날려간 갓을 쓰고 첫눈 내리는 안동역에서',
      backgroundImg: 'assets/images/nostalgic_village.jpg',
      tempo: 104,
      notes: [
        ['G4', 1, '바', 'C'], ['G4', 1, '람', 'C'], ['A4', 1, '에', 'F'], ['G4', 1, '날', 'C'], ['E4', 1, '려', 'C'], ['D4', 1, '간', 'G'], ['C4', 2, '갓', 'C'], ['E4', 1, '을', 'C'], ['G4', 1, '쓰', 'C'], ['A4', 3, '고~', 'F'],
        ['C5', 1, '첫', 'F'], ['C5', 1, '눈', 'F'], ['A4', 1, '내', 'F'], ['G4', 1, '리', 'C'], ['E4', 1, '는', 'C'], ['G4', 2, '안', 'C'], ['A4', 1, '동', 'F'], ['G4', 1, '역', 'C'], ['E4', 1, '앞', 'C'], ['D4', 3, '에~서~', 'G'],
        ['C4', 1, '만', 'C'], ['E4', 1, '나', 'C'], ['G4', 1, '자', 'C'], ['A4', 1, '고', 'F'], ['C5', 1, '약', 'F'], ['C5', 1, '속', 'F'], ['A4', 1, '한', 'F'], ['G4', 1, '사', 'C'], ['E4', 2, '람', 'C'],
        ['G4', 1, '오', 'C'], ['E4', 1, '지', 'C'], ['D4', 1, '를', 'G'], ['C4', 4, '않~고~ ❄️', 'C']
      ]
    },
    {
      id: 'jjille',
      title: '찔레꽃',
      emoji: '🌾',
      themeBadge: '🌾 찔레꽃 붉게 피는 남쪽 나라 내 고향',
      backgroundImg: 'assets/images/spring_flowers.jpg',
      tempo: 90,
      notes: [
        ['E4', 1, '찔', 'C'], ['G4', 1, '레', 'C'], ['A4', 1, '꽃', 'F'], ['G4', 1, '붉', 'C'], ['E4', 1, '게', 'C'], ['G4', 2, '피', 'C'], ['A4', 1, '는', 'F'],
        ['C5', 1, '남', 'F'], ['A4', 1, '쪽', 'F'], ['G4', 1, '나', 'C'], ['E4', 1, '라', 'C'], ['G4', 1, '내', 'C'], ['C5', 3, '고~향~', 'F'],
        ['C5', 1, '언', 'F'], ['A4', 1, '덕', 'F'], ['G4', 1, '위', 'C'], ['E4', 1, '에', 'C'], ['G4', 2, '초', 'C'], ['A4', 1, '가', 'F'], ['G4', 1, '삼', 'C'], ['E4', 1, '간', 'C'],
        ['D4', 1, '그', 'G'], ['C4', 1, '립', 'C'], ['D4', 1, '습', 'G'], ['E4', 1, '니', 'C'], ['C4', 4, '다~ 🌸', 'C']
      ]
    },
    {
      id: 'hometown_station',
      title: '고향역',
      emoji: '🍁',
      themeBadge: '🍁 코스모스 피어있는 정든 고향역',
      backgroundImg: 'assets/images/autumn-reading-illustration.png',
      tempo: 110,
      notes: [
        ['G4', 1, '코', 'C'], ['G4', 1, '스', 'C'], ['E4', 1, '모', 'C'], ['D4', 1, '스', 'G'], ['C4', 1, '피', 'C'], ['E4', 1, '어', 'C'], ['G4', 2, '있', 'C'],
        ['A4', 1, '는', 'F'], ['C5', 1, '정', 'F'], ['A4', 1, '든', 'F'], ['G4', 1, '고', 'C'], ['E4', 1, '향', 'C'], ['D4', 3, '역~', 'G'],
        ['C4', 1, '이', 'C'], ['C4', 1, '쁜', 'C'], ['E4', 1, '이', 'C'], ['G4', 1, '곱', 'C'], ['A4', 1, '분', 'F'], ['G4', 2, '이', 'C'],
        ['C5', 1, '모', 'F'], ['A4', 1, '두', 'F'], ['G4', 1, '나', 'C'], ['E4', 1, '와', 'C'], ['D4', 1, '반', 'G'], ['E4', 1, '겨', 'C'], ['D4', 1, '주', 'G'], ['C4', 4, '겠~지~ 🚂', 'C']
      ]
    },
    {
      id: 'hongsi',
      title: '홍시 (울 엄마)',
      emoji: '🍊',
      themeBadge: '🍊 생각이 난다 홍시가 열리면 울 엄마가 생각이 난다',
      backgroundImg: 'assets/images/story_courtyard_sunflower.jpg',
      tempo: 86,
      notes: [
        ['G4', 1, '생', 'C'], ['G4', 1, '각', 'C'], ['E4', 1, '이', 'C'], ['C4', 1, '난', 'C'], ['D4', 2, '다', 'G'],
        ['E4', 1, '홍', 'C'], ['G4', 1, '시', 'C'], ['A4', 1, '가', 'F'], ['G4', 1, '열', 'C'], ['E4', 1, '리', 'C'], ['D4', 3, '면~', 'G'],
        ['C4', 1, '울', 'C'], ['E4', 1, '엄', 'C'], ['G4', 1, '마', 'C'], ['A4', 1, '가', 'F'], ['C5', 1, '생', 'F'], ['A4', 1, '각', 'F'], ['G4', 1, '이', 'C'], ['E4', 1, '난', 'C'], ['C4', 4, '다~ 🧡', 'C']
      ]
    }
  ],

  // 주파수 테이블
  FREQ_MAP: {
    'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00,
    'REST': 0
  },

  // 트로트 & 애창곡 전용 고음질 코드 데이터 (베이스 + 쿵짝 리듬 스트로크 + 스트링 패드)
  CHORD_DATA: {
    'C': {
      root: 65.41,   // C2 (쿵 1)
      fifth: 98.00,  // G2 (쿵 2)
      triad: [261.63, 329.63, 392.00], // C4, E4, G4 (짝)
      pad: [130.81, 196.00, 261.63, 329.63]
    },
    'F': {
      root: 87.31,   // F2 (쿵 1)
      fifth: 130.81, // C3 (쿵 2)
      triad: [261.63, 349.23, 440.00], // C4, F4, A4 (짝)
      pad: [174.61, 261.63, 349.23, 440.00]
    },
    'G': {
      root: 98.00,   // G2 (쿵 1)
      fifth: 146.83, // D3 (쿵 2)
      triad: [246.94, 293.66, 392.00], // B3, D4, G4 (짝)
      pad: [196.00, 246.94, 293.66, 392.00]
    },
    'Am': {
      root: 110.00,  // A2 (쿵 1)
      fifth: 164.81, // E3 (쿵 2)
      triad: [261.63, 329.63, 440.00], // C4, E4, A4 (짝)
      pad: [110.00, 220.00, 261.63, 329.63]
    }
  },

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    if (this.audioCtx && !this.masterBus) {
      // 마스터 버스 및 자연스러운 룸 어쿠스틱 공간계 (Reverb / Room Ambience)
      const master = this.audioCtx.createGain();
      master.gain.setValueAtTime(0.85, this.audioCtx.currentTime);

      const roomDelay = this.audioCtx.createDelay();
      roomDelay.delayTime.value = 0.042; // 42ms 공간 반사음
      const delayGain = this.audioCtx.createGain();
      delayGain.gain.value = 0.22;
      const delayFilter = this.audioCtx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 2400;

      roomDelay.connect(delayFilter);
      delayFilter.connect(delayGain);
      delayGain.connect(master);
      delayGain.connect(roomDelay); // 부드러운 여음

      master.connect(this.audioCtx.destination);
      this.masterBus = master;
      this.roomBus = roomDelay;
    }
  },

  // 1. 자연스러운 메인 멜로디 (어쿠스틱 피아노 & 아코디언 하이브리드 음색 + 비브라토)
  scheduleMelodyNote(noteName, startTime, durationSec) {
    if (!this.audioCtx || window.VoiceManager?.isMuted) return;
    const freq = this.FREQ_MAP[noteName];
    if (!freq || freq === 0) return;

    // 1) 기본음 & 배음 생성
    const oscFund = this.audioCtx.createOscillator();
    const oscHarm = this.audioCtx.createOscillator();
    const oscBright = this.audioCtx.createOscillator();

    const gainFund = this.audioCtx.createGain();
    const gainHarm = this.audioCtx.createGain();
    const gainBright = this.audioCtx.createGain();

    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(freq, startTime);

    oscHarm.type = 'triangle';
    oscHarm.frequency.setValueAtTime(freq * 2, startTime); // 2옥타브 배음

    oscBright.type = 'sine';
    oscBright.frequency.setValueAtTime(freq * 3, startTime); // 3차 배음

    // 자연스러운 비브라토 LFO (0.35초 이상 지속되는 음에 자연스럽게 가미)
    if (durationSec > 0.35) {
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      lfo.frequency.setValueAtTime(5.2, startTime); // 5.2Hz 부드러운 떨림
      lfoGain.gain.setValueAtTime(0, startTime);
      lfoGain.gain.linearRampToValueAtTime(freq * 0.012, startTime + 0.18); // 자연스러운 비브라토 진폭
      lfo.connect(lfoGain);
      lfoGain.connect(oscFund.frequency);
      lfo.start(startTime);
      lfo.stop(startTime + durationSec + 0.3);
      this.activeNodes.push(lfo);
    }

    // 포근한 어쿠스틱 마스터 필터
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, startTime);

    // 자연스러운 여음 (Natural Release)
    const sustainDur = Math.max(0.06, durationSec * 0.82);
    const releaseDur = 0.32;
    const totalDuration = durationSec + releaseDur;

    // 기본음 엔벨로프 (부드러운 타건 어택 -> 서스테인 -> 온화한 릴리즈)
    gainFund.gain.setValueAtTime(0.0001, startTime);
    gainFund.gain.linearRampToValueAtTime(0.22, startTime + 0.015);
    gainFund.gain.setValueAtTime(0.18, startTime + sustainDur);
    gainFund.gain.exponentialRampToValueAtTime(0.0001, startTime + totalDuration);

    // 배음 엔벨로프 (피아노 현의 맑은 울림)
    gainHarm.gain.setValueAtTime(0.0001, startTime);
    gainHarm.gain.linearRampToValueAtTime(0.08, startTime + 0.012);
    gainHarm.gain.setValueAtTime(0.05, startTime + sustainDur * 0.7);
    gainHarm.gain.exponentialRampToValueAtTime(0.0001, startTime + totalDuration * 0.85);

    gainBright.gain.setValueAtTime(0.0001, startTime);
    gainBright.gain.linearRampToValueAtTime(0.035, startTime + 0.008);
    gainBright.gain.exponentialRampToValueAtTime(0.0001, startTime + sustainDur * 0.5);

    oscFund.connect(gainFund);
    oscHarm.connect(gainHarm);
    oscBright.connect(gainBright);

    gainFund.connect(filter);
    gainHarm.connect(filter);
    gainBright.connect(filter);

    const outBus = this.masterBus || this.audioCtx.destination;
    filter.connect(outBus);
    if (this.roomBus) filter.connect(this.roomBus);

    oscFund.start(startTime);
    oscHarm.start(startTime);
    oscBright.start(startTime);

    oscFund.stop(startTime + totalDuration + 0.05);
    oscHarm.stop(startTime + totalDuration + 0.05);
    oscBright.stop(startTime + totalDuration + 0.05);

    this.activeNodes.push(oscFund, oscHarm, oscBright);
  },

  // 2. 어쿠스틱 베이스 ("쿵" - 깊고 둥근 콘트라베이스 사운드)
  scheduleAcousticBass(freq, startTime, durationSec) {
    if (!this.audioCtx || window.VoiceManager?.isMuted) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, startTime);

    const totalDur = Math.max(0.24, durationSec);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.20, startTime + 0.02);
    gain.gain.setValueAtTime(0.14, startTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + totalDur);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.masterBus || this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + totalDur + 0.05);
    this.activeNodes.push(osc);
  },

  // 3. 어쿠스틱 피아노/기타 리듬 스트로크 ("짝" - 경쾌하고 깔끔한 화음 찹)
  scheduleAcousticChop(triadFreqs, startTime, durationSec) {
    if (!this.audioCtx || window.VoiceManager?.isMuted) return;

    triadFreqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(idx === 0 ? 600 : 1200, startTime);

      const chopDur = Math.min(0.18, durationSec * 0.7);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.07, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + chopDur);

      osc.connect(gain);
      gain.connect(filter);
      filter.connect(this.masterBus || this.audioCtx.destination);
      if (this.roomBus) filter.connect(this.roomBus);

      osc.start(startTime);
      osc.stop(startTime + chopDur + 0.04);
      this.activeNodes.push(osc);
    });
  },

  // 4. 따뜻한 스트링/아코디언 패드 (음악의 빈 공간을 포근하게 채워주는 부드러운 배경)
  schedulePadLayer(padFreqs, startTime, durationSec) {
    if (!this.audioCtx || window.VoiceManager?.isMuted) return;

    padFreqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, startTime);

      const padDur = durationSec + 0.25;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.035, startTime + 0.06);
      gain.gain.setValueAtTime(0.028, startTime + durationSec * 0.85);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + padDur);

      osc.connect(gain);
      gain.connect(filter);
      filter.connect(this.masterBus || this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + padDur + 0.05);
      this.activeNodes.push(osc);
    });
  },

  // 노래방 전체 스케줄링 시작 (신나는 트로트 쿵짝 쿵짝 리듬 + 완벽한 시간축 가사 동기화)
  startKaraoke(songIndex = 0) {
    this.initAudio();
    this.stopKaraoke();

    this.currentSongIndex = songIndex;
    const song = this.SONGS[songIndex];
    if (!song || !this.audioCtx) return;

    this.isPlaying = true;
    this.applySongBackground(song);
    this.renderLyricsBox(song);

    const playBtns = document.querySelectorAll('#btnKaraokePlay, #btnKaraokeRoomPlay');
    playBtns.forEach(btn => btn.innerHTML = '⏸️ 잠시 멈추기');

    const dancePuppies = document.querySelectorAll('#karaokeDancePuppy, #karaokeRoomMascot');
    dancePuppies.forEach(p => p.classList.add('dancing'));

    const secPerBeat = 60 / song.tempo;
    const now = this.audioCtx.currentTime + 0.15; // 150ms 후 정박 시작
    this.songStartTime = now;

    // 1) 멜로디 스케줄링 & 타임라인 생성
    let currentTimeOffset = 0;
    const timeline = [];

    song.notes.forEach(([note, beats, syllable, chord], idx) => {
      const noteDuration = beats * secPerBeat;
      const noteStartTime = now + currentTimeOffset;

      // 멜로디 스케줄링
      this.scheduleMelodyNote(note, noteStartTime, noteDuration);

      timeline.push({
        idx: idx,
        startTime: noteStartTime,
        endTime: noteStartTime + noteDuration,
        syllable: syllable,
        chord: chord
      });

      currentTimeOffset += noteDuration;
    });

    const totalSongDuration = currentTimeOffset;

    // 2) 신나는 트로트 "쿵(베이스)-짝(화음)-쿵(베이스)-짝(화음)" 리듬 반주 자동 생성
    // 1박마다 베이스("쿵")와 코드 스트로크("짝")가 번갈아 살아 숨쉬는 라이브 밴드 반주 구현
    let beatTime = 0;
    let currentChord = 'C';

    while (beatTime < totalSongDuration) {
      // 현재 박자에 해당하는 마디 코드 찾기
      const activeItem = timeline.find(item => beatTime >= (item.startTime - now) && beatTime < (item.endTime - now));
      if (activeItem && activeItem.chord) {
        currentChord = activeItem.chord;
      }
      const chordData = this.CHORD_DATA[currentChord] || this.CHORD_DATA['C'];
      const beatStartTime = now + beatTime;
      const beatIndex = Math.round(beatTime / secPerBeat);

      // 4박자 기준:
      // 1박: 쿵 (근음 베이스) + 배경 패드
      // 2박: 짝 (화음 찹)
      // 3박: 쿵 (5도 베이스)
      // 4박: 짝 (화음 찹)
      if (beatIndex % 4 === 0) {
        this.scheduleAcousticBass(chordData.root, beatStartTime, secPerBeat * 0.85);
        this.schedulePadLayer(chordData.pad, beatStartTime, secPerBeat * 2);
      } else if (beatIndex % 4 === 1) {
        this.scheduleAcousticChop(chordData.triad, beatStartTime, secPerBeat * 0.5);
      } else if (beatIndex % 4 === 2) {
        this.scheduleAcousticBass(chordData.fifth, beatStartTime, secPerBeat * 0.85);
        this.schedulePadLayer(chordData.pad, beatStartTime, secPerBeat * 2);
      } else if (beatIndex % 4 === 3) {
        this.scheduleAcousticChop(chordData.triad, beatStartTime, secPerBeat * 0.5);
      }

      beatTime += secPerBeat;
    }

    // requestAnimationFrame을 통한 100% 싱크 가사 하이라이트 트래커
    const updateLyricTracker = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      const currentAudioTime = this.audioCtx.currentTime;

      // 현재 시각에 연주 중인 음절 찾기
      const activeItem = timeline.find(item => currentAudioTime >= item.startTime && currentAudioTime < item.endTime);
      if (activeItem) {
        this.highlightSyllable(activeItem.idx);
      }

      // 완곡 시점 감지
      if (currentAudioTime >= now + totalSongDuration) {
        this.onSongFinish();
        return;
      }

      this.animFrameId = requestAnimationFrame(updateLyricTracker);
    };

    this.animFrameId = requestAnimationFrame(updateLyricTracker);
  },

  // 배경 이미지 동기화
  applySongBackground(song) {
    const stages = document.querySelectorAll('#karaokeStageWrapper, #karaokeDedicatedStage');
    stages.forEach(stage => {
      stage.style.backgroundImage = `linear-gradient(rgba(20, 15, 12, 0.55), rgba(30, 20, 15, 0.72)), url('${song.backgroundImg}')`;
    });
    const badges = document.querySelectorAll('#karaokeThemeBadge, #karaokeRoomThemeBadge');
    badges.forEach(badge => {
      badge.textContent = song.themeBadge;
    });
    const titles = document.querySelectorAll('#karaokeCurrentTitle, #karaokeRoomSongTitle');
    titles.forEach(title => {
      title.textContent = `${song.emoji} <${song.title}> 노래방 반주`;
    });
  },

  stopKaraoke() {
    this.isPlaying = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    // 재생 중인 오디오 노드 즉시 정지
    this.activeNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];

    const playBtns = document.querySelectorAll('#btnKaraokePlay, #btnKaraokeRoomPlay');
    playBtns.forEach(btn => {
      btn.innerHTML = '🎵 반주 시작하기';
    });

    const dancePuppies = document.querySelectorAll('#karaokeDancePuppy, #karaokeRoomMascot');
    dancePuppies.forEach(puppy => {
      puppy.classList.remove('dancing');
    });

    const retroBtn = document.getElementById('btnRetroPlay');
    const retroLp = document.getElementById('retroLpRecord');
    if (retroBtn) retroBtn.innerHTML = '▶ 정겨운 옛 노래 재생하기';
    if (retroLp) retroLp.classList.remove('spinning');
  },

  toggleKaraoke() {
    if (this.isPlaying) {
      this.stopKaraoke();
    } else {
      this.startKaraoke(this.currentSongIndex);
    }
  },

  // 콩이/친구와 함께 노래 부르기 (반주 + AI 친구의 따뜻한 노래 리딩)
  singWithAi(songIndex = this.currentSongIndex) {
    this.startKaraoke(songIndex);
    const song = this.SONGS[songIndex];
    if (!song) return;

    const fullLyricsMap = {
      age: "야 야 야 내 나이가 어때서, 사랑에 나이가 있나요. 마음은 하나요 느낌도 하나요, 그대만이 정말 내 사랑인데~",
      south_train: "비 내리는 호남선 남행열차에 흔들리는 차창 너머로, 빗물이 흐르고 내 눈물도 흐르고~",
      andong: "바람에 날려간 갓을 쓰고 첫눈 내리는 안동역 앞에서, 만나자고 약속한 사람 오지를 않고~",
      jjille: "찔레꽃 붉게 피는 남쪽 나라 내 고향, 언덕 위에 초가삼간 그립습니다~",
      hometown_station: "코스모스 피어있는 정든 고향역, 이쁜이 곱분이 모두 나와 반겨주겠지~",
      hongsi: "생각이 난다 홍시가 열리면, 울 엄마가 생각이 난다~"
    };

    const lyricsText = fullLyricsMap[song.id] || song.notes.map(n => n[2]).filter(s => s.trim().length > 0).join(' ');
    setTimeout(() => {
      window.VoiceManager.speak(lyricsText, null, { emotion: 'happy' });
    }, 200);
  },

  renderLyricsBox(song) {
    const boxes = document.querySelectorAll('#karaokeLyricsTrack, #karaokeRoomLyricsTrack');
    if (!boxes.length) return;

    let html = '';
    song.notes.forEach(([_, __, syllable], idx) => {
      if (syllable) {
        html += `<span class="k-syllable" data-syl-idx="${idx}" id="kSyl_${idx}">${syllable}</span>`;
      }
    });
    boxes.forEach(box => {
      box.innerHTML = html;
    });
  },

  highlightSyllable(idx) {
    const prevs = document.querySelectorAll('.k-syllable.active');
    prevs.forEach(p => p.classList.remove('active'));

    const currents = document.querySelectorAll(`.k-syllable[data-syl-idx="${idx}"], #kSyl_${idx}`);
    currents.forEach(current => {
      current.classList.add('active');
      current.classList.add('sung');
    });
  },

  onSongFinish() {
    this.stopKaraoke();
    window.VoiceManager.playChime('success');
    window.VoiceManager.speak('와아! 노래를 정말 멋지게 부르셨어요! 오늘 최고의 인기 가수세요! 👏');

    const cheerBanners = document.querySelectorAll('#karaokeCheerBanner, #karaokeRoomCheerBanner');
    cheerBanners.forEach(cheerBanner => {
      cheerBanner.innerHTML = `
        <div class="karaoke-perfect-score">
          <span>💯</span>
          <span>백점 만점에 백점! 어르신 목소리가 최고예요! 💖</span>
        </div>
      `;
    });
  },

  clapHands() {
    this.initAudio();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    [0, 0.12, 0.24].forEach((delay) => {
      const bufferSize = this.audioCtx.sampleRate * 0.08;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, now + delay);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(now + delay);
    });

    this.spawnCheerIcon('👏');
  },

  shakeTambourine() {
    this.initAudio();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    [0, 0.08].forEach((delay) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(3200 + Math.random() * 400, now + delay);

      gain.gain.setValueAtTime(0.08, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.12);
    });

    this.spawnCheerIcon('🥁');
  },

  danceShoulders() {
    this.spawnCheerIcon('💃');
    this.spawnCheerIcon('✨');
    window.VoiceManager.playChime('success');
    window.VoiceManager.speak('얼쑤! 덩실덩실 어깨춤이 절로 납니다!');
  },

  spawnCheerIcon(emoji) {
    const stages = document.querySelectorAll('#karaokeStageWrapper, #karaokeDedicatedStage');
    if (!stages.length) return;

    stages.forEach(stage => {
      const floater = document.createElement('div');
      floater.className = 'floating-cheer-emoji';
      floater.textContent = emoji;
      floater.style.left = `${Math.random() * 70 + 15}%`;
      stage.appendChild(floater);

      setTimeout(() => {
        if (floater.parentNode) floater.parentNode.removeChild(floater);
      }, 1800);
    });
  }
};

window.KaraokeEngine = KaraokeEngine;
