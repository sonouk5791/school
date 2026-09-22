/**
 * AI 디지털 학교 — 한국인 여성 AI 선생님 자연스러운 음성 합성 엔진 (VoiceManager)
 * 
 * 1. 실제 강의실에서 선생님이 학생에게 편안하게 설명해 주는 따뜻하고 온화한 목소리
 * 2. 한국어 최적 Neural/Natural 음성 자동 탐색 및 우선 선택
 * 3. 쉼표(0.2~0.4s), 마침표(0.5~0.8s), 질문(0.8~1.0s) 자연스러운 호흡 분할 순차 재생
 * 4. 감정(warm, happy, encouraging, calm) 및 발화 속도(normal 0.92, slow 0.82) 맞춤 조절
 * 5. 음성 중복 방지, 다시 듣기(Replay), 25초 무반응 부드러운 격려 안내
 * 6. 캐릭터 아바타 발화 애니메이션 실시간 연동
 */

const VoiceManager = {
  isMuted: false,
  speedMode: 'slow', // 'normal' (0.92) | 'slow' (0.82)
  synth: window.speechSynthesis,
  koreanVoice: null,
  audioCtx: null,
  characterId: 'kongi',
  characterProfiles: {
    kongi: {
      name: '콩이',
      animal: '강아지',
      emoji: '🐶',
      voiceDesc: '밝고 다정한 목소리',
      pitch: 1.02,
      rate: 1.0,
      pauseMultiplier: 1.0,
      voiceIndex: 0,
      chimeNotes: [
        { freq: 523.25, delay: 0.00, dur: 0.14, type: 'sine', gain: 0.08 },
        { freq: 659.25, delay: 0.08, dur: 0.20, type: 'sine', gain: 0.08 }
      ],
      greeting: "안녕하세요, 여러분! 디지털 AI학교에 오신 것을 환영합니다."
    },
    tori: {
      name: '토리',
      animal: '토끼',
      emoji: '🐰',
      voiceDesc: '톡톡 튀는 귀여운 목소리',
      pitch: 1.02,
      rate: 1.0,
      pauseMultiplier: 1.10,
      voiceIndex: 1,
      chimeNotes: [
        { freq: 587.33, delay: 0.00, dur: 0.12, type: 'sine', gain: 0.07 },
        { freq: 783.99, delay: 0.09, dur: 0.18, type: 'sine', gain: 0.08 }
      ],
      greeting: "안녕하세요. 마음 친구 토리예요. 오늘 기분은 어떠세요?"
    },
    bori: {
      name: '곰이',
      animal: '곰',
      emoji: '🐻',
      voiceDesc: '포근하고 듬직한 목소리',
      pitch: 1.0,
      malePitch: 0.92,
      rate: 1.0,
      pauseMultiplier: 1.25,
      voiceIndex: 2,
      chimeNotes: [
        { freq: 329.63, delay: 0.00, dur: 0.18, type: 'sine', gain: 0.08 },
        { freq: 392.00, delay: 0.12, dur: 0.25, type: 'sine', gain: 0.08 }
      ],
      greeting: "안녕하세요. 취미 친구 곰이예요. 좋아하는 노래와 활동을 같이 즐겨봐요!"
    },
    nabi: {
      name: '나비',
      animal: '고양이',
      emoji: '🐱',
      voiceDesc: '나긋나긋 고운 목소리',
      pitch: 1.08,
      rate: 1.0,
      pauseMultiplier: 1.10,
      voiceIndex: 3,
      chimeNotes: [
        { freq: 659.25, delay: 0.00, dur: 0.12, type: 'sine', gain: 0.07 },
        { freq: 783.99, delay: 0.08, dur: 0.12, type: 'sine', gain: 0.07 },
        { freq: 880.00, delay: 0.16, dur: 0.20, type: 'sine', gain: 0.08 }
      ],
      greeting: "안녕하세요. 기억 친구 나비예요. 우리 같이 기억해볼까요?"
    }
  },
  getCharacterVoice() {
    if (!this.synth) return null;
    const voices = (this.synth.getVoices() || []).filter(v => /^ko/i.test(v.lang));
    if (!voices.length) return this.koreanVoice || null;

    const charId = this.characterId || 'kongi';
    const profile = this.characterProfiles[charId] || this.characterProfiles.kongi;

    // 기계음(Heami, Desktop)을 제외한 고품질 자연어 신경망 음성 우선 분류
    const naturalVoices = voices.filter(v => 
      v.name && !v.name.includes('Heami') && !v.name.includes('Desktop')
    );
    const candidatePool = naturalVoices.length > 0 ? naturalVoices : voices;

    // 2. 토리(토끼), 나비(고양이), 콩이(강아지): 맑은 여성 자연어 음성 (SunHi Online Natural, Google 한국의)
    const femaleVoice = candidatePool.find(v => 
      v.name && (v.name.includes('SunHi') || v.name.includes('Google'))
    ) || candidatePool.find(v =>
      v.name && !v.name.includes('InJoon') && !v.name.includes('인준') && !v.name.toLowerCase().includes('male')
    );
    if (femaleVoice) return femaleVoice;

    // 3. 최적의 자연어 한국어 음성 연결
    const best = this.getBestKoreanVoice();
    if (best) return best;

    // 4. 폴백: 순서대로 배정
    const ordered = candidatePool.slice().sort((a,b) => a.name.localeCompare(b.name));
    return ordered[profile.voiceIndex % ordered.length];
  },
  getCharacterGreeting(charId) {
    const id = charId || this.characterId || 'kongi';
    const profile = this.characterProfiles[id] || this.characterProfiles.kongi;
    return profile.greeting;
  },
  getCharacterFeedback(type = 'correct', charId) {
    const id = charId || this.characterId || 'kongi';
    const correctMap = {
      kongi: "멍멍! 맞았어요! 정말 잘하셨어요!",
      tori: "깡총! 대단해요! 완벽하게 맞히셨어요! 신나요!",
      bori: "우엉~ 참 잘하셨어요. 차근차근 해내시니 정말 멋져요.",
      nabi: "야옹~ 참 고우세요. 정답을 쏙 맞히셨네요. 훌륭해요."
    };
    const wrongMap = {
      kongi: "괜찮아요, 멍멍! 우리 한 번만 다시 찾아볼까요?",
      tori: "에구 아쉬워요! 그래도 괜찮아요, 다시 한번 깡총 골라봐요!",
      bori: "우엉~ 서두르지 않아도 돼요. 천천히 다시 골라보아요.",
      nabi: "사뿐히 다시 살펴볼까요? 조용히 생각해보면 금방 찾을 수 있어요."
    };
    return (type === 'correct') ? correctMap[id] : wrongMap[id];
  },

  // 재생 상태 관리
  lastSpokenScript: null,
  currentSpeakingToken: 0,
  isSpeakingNow: false,
  isPaused: false,
  pausedQueue: null,
  queuedTimers: [],

  // 20~30초 무반응 감지 타이머
  inactivityTimer: null,
  hasTriggeredInactivity: false,

  init() {
    // 1. 음성 On/Off 설정 불러오기
    const savedMute = localStorage.getItem('digital_school_muted');
    const savedEnabled = localStorage.getItem('digital_school_voice_enabled');
    
    if (savedEnabled !== null) {
      this.isMuted = savedEnabled === 'false';
    } else if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    } else {
      this.isMuted = false;
    }

    // 2. 음성 속도 설정 불러오기
    const savedSpeed = localStorage.getItem('digital_school_voice_speed');
    if (savedSpeed === 'slow' || savedSpeed === 'normal') {
      this.speedMode = savedSpeed;
    } else {
      this.speedMode = 'slow';
    }

    // 3. 브라우저 음성 목록 로드
    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
      setTimeout(() => this.loadVoices(), 300);
      setTimeout(() => this.loadVoices(), 1200);
    }

    // 4. 전역 무반응 감지 인터랙션 이벤트 바인딩
    this._bindGlobalActivityListeners();
  },

  // 한국어 자연스러운 여성 Neural 음성 최우선 탐색 및 선택 메서드 (Section 1 & 27)
  getBestKoreanVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return this.koreanVoice || null;

    const koreanVoices = voices.filter(v => v.lang && (v.lang.startsWith('ko') || v.lang.includes('KR') || /^ko/i.test(v.lang)));
    if (koreanVoices.length === 0) return null;

    // 1. Edge의 Microsoft 자연어 여성 신경망 보이스 (SunHi Online Natural) 최우선 선택
    const sunHiVoice = koreanVoices.find(v => 
      v.name && (v.name.includes('SunHi') || v.name.includes('선희'))
    );
    if (sunHiVoice) {
      this.koreanVoice = sunHiVoice;
      return sunHiVoice;
    }

    // 2. Chrome의 Google 온라인 신경망 한국어 음성 ('Google 한국의' 또는 'Google 한국어') 선택
    const googleVoice = koreanVoices.find(v => 
      v.name && (v.name.includes('Google 한국의') || v.name.includes('Google 한국어') || (v.name.includes('Google') && v.lang.startsWith('ko')))
    );
    if (googleVoice) {
      this.koreanVoice = googleVoice;
      return googleVoice;
    }

    // 3. Apple Safari/macOS/iOS의 자연어 여성 음성 (Yuna, Sora, Nara 등)
    const appleVoice = koreanVoices.find(v =>
      v.name && (v.name.includes('Yuna') || v.name.includes('Sora') || v.name.includes('Nara') || v.name.includes('유나'))
    );
    if (appleVoice) {
      this.koreanVoice = appleVoice;
      return appleVoice;
    }

    // 4. 기타 남성 및 기계음(Heami, Desktop)을 제외한 여성 자연어 음성 선택
    const nonRoboticVoice = koreanVoices.find(v => 
      v.name && !v.name.includes('InJoon') && !v.name.includes('인준') && !v.name.includes('Heami') && !v.name.includes('Desktop') && !v.name.toLowerCase().includes('male')
    );
    if (nonRoboticVoice) {
      this.koreanVoice = nonRoboticVoice;
      return nonRoboticVoice;
    }

    // 5. 최후의 폴백 (시스템에 단 1개의 음성만 설치되어 있을 때)
    this.koreanVoice = koreanVoices[0];
    return koreanVoices[0];
  },

  loadVoices() {
    this.koreanVoice = this.getBestKoreanVoice();
    if (this.koreanVoice) {
      console.log('[AI 선생님 음성 Voice 연결 완료]:', this.koreanVoice.name);
    }
  },

  // AI 선생님 캐릭터 및 아바타 말하기 애니메이션 동기화
  setTeacherSpeaking(isSpeaking) {
    this.isSpeakingNow = isSpeaking;

    // 1. 히어로 섹션 콩이/선생님 캐릭터
    const kongiHero = document.getElementById('kongiHero');
    if (kongiHero) {
      if (isSpeaking) kongiHero.classList.add('speaking');
      else kongiHero.classList.remove('speaking');
    }

    // 2. 수업 화면 내 아바타, 브랜드 아이콘 및 말풍선 영역
    document.querySelectorAll('.ai-friend-avatar-img, .brand-icon, .avatar-pulse-target').forEach(el => {
      if (isSpeaking) el.classList.add('speaking');
      else el.classList.remove('speaking');
    });

    document.querySelectorAll('.ai-friend-speech-area, .speech-bubble-hero').forEach(el => {
      if (isSpeaking) el.classList.add('speaking');
      else el.classList.remove('speaking');
    });

    // 3. 글로벌 발화 인디케이터 배지 업데이트 (있는 경우)
    document.querySelectorAll('.voice-status-badge').forEach(badge => {
      badge.textContent = isSpeaking ? '선생님 말씀하시는 중...' : '선생님 음성 안내';
    });
  },

  // 텍스트 정리: 이모티콘 및 태그 제거 (자연스러운 한글 음절 유지)
  _cleanSpeechText(rawText) {
    if (!rawText) return '';
    return String(rawText)
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]/gu, '')
      .replace(/<[^>]*>?/gm, '')
      .replace(/[▶◀★☆※●○◆◇■□▶▷→←↓↑]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  /**
   * 긴 문장을 자연스러운 호흡 단위(문장/쉼표)로 분할
   * 사람의 호흡처럼 쉼표에는 0.25~0.35초, 마침표에는 0.5~0.7초, 물음표에는 0.8초의 쉼 부여
   */
  _splitIntoChunks(text) {
    const rawClean = this._cleanSpeechText(text);
    if (!rawClean) return [];

    // 문장 부호 뒤 공백 또는 줄바꿈 기준으로 1차 분할
    const rawSentences = rawClean.split(/(?<=[.?!~])\s+|\n+/);
    const chunks = [];

    rawSentences.forEach(sentence => {
      const s = sentence.trim();
      if (!s) return;

      // 쉼표가 들어간 긴 문장은 쉼표 단위로 추가 분할 (단, 너무 짧은 단어는 합침)
      if (s.includes(',') && s.length > 22) {
        const parts = s.split(/(?<=,)\s*/);
        parts.forEach((p, idx) => {
          const partTrimmed = p.trim();
          if (!partTrimmed) return;
          const isLastPart = (idx === parts.length - 1);
          chunks.push({
            text: partTrimmed,
            pauseAfterMs: isLastPart ? this._getSentencePause(partTrimmed) : 320,
            isQuestion: partTrimmed.endsWith('?')
          });
        });
      } else {
        chunks.push({
          text: s,
          pauseAfterMs: this._getSentencePause(s),
          isQuestion: s.endsWith('?')
        });
      }
    });

    return chunks;
  },

  _getSentencePause(text) {
    const trimmed = text.trim();
    // 사용자가 직접 행동해야 하는 안내 후: 약 1~2초 쉼 (Section 4)
    if (/(적어보세요|눌러보세요|골라보세요|설명해보세요|말해보세요|시작해보세요|해볼까요\?|입력해보세요)[.!?~]?$/.test(trimmed)) {
      return 1300;
    }
    // 질문 후: 약 1초 (Section 4)
    if (trimmed.endsWith('?')) return 950;
    // 반가운 인사/감탄/칭찬 후: 약 0.6초
    if (trimmed.endsWith('~') || trimmed.endsWith('!')) return 650;
    // 일반 마침표 뒤 쉼: 약 0.5~0.8초 (Section 4)
    return 600;
  },

  /**
   * 메인 발화 메서드 (speak)
   * @param {string|object} input - 발화할 텍스트 또는 voiceScript 객체
   * @param {function} onEndCallback - 전체 발화 완료 시 호출할 콜백
   * @param {object} options - emotion, rateOverride 등 추가 옵션
   */
  speak(input, onEndCallback, options = {}) {
    // The home guide yields before another lesson/teacher voice starts.
    window.animatedCharacter?.stop();
    // 이전 진행 중인 발화 및 대기 큐 즉시 취소
    this.stopSpeaking();

    if (this.isMuted || !this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // 객체형 voiceScript 대응
    let textToSpeak = '';
    let emotion = options.emotion || 'warm';
    let speedBonus = 0;

    this.isPaused = false;
    this.pausedQueue = null;
    this._updatePauseUI();

    if (typeof input === 'object' && input !== null) {
      textToSpeak = input.voiceScript || input.text || '';
      if (input.emotion) emotion = input.emotion;
      if (input.speed) speedBonus = input.speed - 0.92;
      this.lastSpokenScript = input;
    } else {
      textToSpeak = String(input || '');
      this.lastSpokenScript = textToSpeak;
    }

    // 긴 문장 청크 분할
    const chunks = this._splitIntoChunks(textToSpeak);
    if (chunks.length === 0) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // 고유 발화 세션 토큰 발행 (중복 및 겹침 차단)
    const token = ++this.currentSpeakingToken;

    // 기본 발화 속도 산출 (normal: 0.98, slow: 0.70)
    let baseRate = this.speedMode === 'slow' ? 0.70 : 0.98;
    baseRate += speedBonus;
    if (emotion === 'happy') baseRate += 0.02;
    if (emotion === 'encouraging') baseRate -= 0.02;

    // 피치 기본값 (온화하고 안정적인 여성 강사 톤: 1.00)
    let basePitch = 1.00;
    if (emotion === 'happy') basePitch = 1.05;
    else if (emotion === 'encouraging') basePitch = 1.02;
    else if (emotion === 'calm') basePitch = 0.98;

    const profile = this.characterProfiles[this.characterId] || this.characterProfiles.kongi;
    const activeVoice = this.getCharacterVoice();
    const isMaleVoice = activeVoice && (activeVoice.name.includes('InJoon') || activeVoice.name.includes('인준') || activeVoice.name.toLowerCase().includes('male'));

    let targetPitch = profile.pitch;
    if (this.characterId === 'bori' && isMaleVoice) {
      targetPitch = profile.malePitch || 0.92;
    }

    baseRate = Math.max(0.65, Math.min(1.25, baseRate * profile.rate));
    basePitch = Math.max(0.60, Math.min(1.22, basePitch * targetPitch));
    // 순차 큐 재생 시작
    this._playChunkQueue(chunks, 0, token, baseRate, basePitch, onEndCallback);
  },

  // 청크 순차 재생 처리
  _playChunkQueue(chunks, index, token, rate, pitch, onEndCallback) {
    // 토큰이 일치하지 않으면 사용자가 취소했거나 새 음성이 시작된 것
    if (token !== this.currentSpeakingToken) {
      return;
    }

    // 모든 청크 재생 완료
    if (index >= chunks.length) {
      this.setTeacherSpeaking(false);
      this.isPaused = false;
      this.pausedQueue = null;
      this._updatePauseUI();
      if (onEndCallback) onEndCallback();
      return;
    }

    if (this.isPaused) return;

    // 현재 재생 중인 큐 상태 보관 (일시정지 시 이어듣기용)
    this.pausedQueue = { chunks, nextIndex: index, token, rate, pitch, onEndCallback };

    const chunk = chunks[index];
    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.lang = 'ko-KR';

    // 질문 문장은 끝을 살짝 올려주는 자연스러운 억양 변화
    utterance.pitch = chunk.isQuestion ? pitch + 0.04 : pitch;
    utterance.rate = rate;
    utterance.volume = 1.0;

    // 실제로 사용되는 TTS의 voice 객체를 자연스러운 한국어 음성으로 반드시 연결
    const activeVoice = this.getCharacterVoice();
    if (activeVoice) {
      utterance.voice = activeVoice;
    }

    utterance.onboundary = event => {
      if(token !== this.currentSpeakingToken || !window.CharacterLipSync)return;
      const id=this.characterId||'kongi',v=CharacterLipSync.vowel(chunk.text[event.charIndex]||' ');
      document.querySelectorAll('.ai-friend-avatar-img,.completion-robot-img').forEach(img=>CharacterLipSync.set(img,id,v));
    };
    utterance.onstart = () => {
      if (token === this.currentSpeakingToken) {
        this.setTeacherSpeaking(true);
      }
    };

    utterance.onend = () => {
      if (token !== this.currentSpeakingToken) return;

      this.setTeacherSpeaking(false);
      // 다음 청크 인덱스로 큐 상태 갱신
      this.pausedQueue = { chunks, nextIndex: index + 1, token, rate, pitch, onEndCallback };

      // 다음 청크 전 캐릭터별 호흡 쉼(Pause) 적용
      if (this.isPaused) return;
      const profile = this.characterProfiles[this.characterId] || this.characterProfiles.kongi;
      const pauseMultiplier = profile.pauseMultiplier || 1.0;
      const pauseTime = Math.round((chunk.pauseAfterMs || 350) * pauseMultiplier);

      const timerId = setTimeout(() => {
        this._playChunkQueue(chunks, index + 1, token, rate, pitch, onEndCallback);
      }, pauseTime);

      this.queuedTimers.push(timerId);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('음성 안내:', e.error);
      }
      if (token === this.currentSpeakingToken) {
        this._playChunkQueue(chunks, index + 1, token, rate, pitch, onEndCallback);
      }
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('음성 재생 오류:', e);
      this.setTeacherSpeaking(false);
      if (onEndCallback) onEndCallback();
    }
  },

  // 재생 중인 모든 음성 및 대기열 즉각 중지
  stopSpeaking(clearPause = true) {
    this.currentSpeakingToken++; // 기존 진행 중인 세션 무효화
    this.queuedTimers.forEach(t => clearTimeout(t));
    this.queuedTimers = [];

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.setTeacherSpeaking(false);

    if (clearPause) {
      this.isPaused = false;
      this.pausedQueue = null;
      this._updatePauseUI();
    }
  },

  // 음성 일시정지 (현재 문장 또는 다음 문장 전 멈춤)
  pauseSpeaking() {
    if (!this.synth) return;
    if (this.isPaused) return;

    this.isPaused = true;
    this.queuedTimers.forEach(t => clearTimeout(t));
    this.queuedTimers = [];

    try {
      this.synth.pause();
    } catch (e) {}

    this.setTeacherSpeaking(false);
    this._updatePauseUI();
  },

  // 음성 이어듣기 (일시정지된 지점부터 계속 재생)
  resumeSpeaking() {
    if (!this.synth) return;
    if (!this.isPaused) return;

    this.isPaused = false;
    this._updatePauseUI();

    // 1. 브라우저 synth가 paused 상태이면 즉시 재개
    if (this.synth.paused && this.synth.speaking) {
      try {
        this.synth.resume();
        this.setTeacherSpeaking(true);
        return;
      } catch (e) {}
    }

    // 2. 브라우저 일시정지 타임아웃 버그 대비: 보관된 큐 위치부터 신규 세션으로 복원 재생
    if (this.pausedQueue && this.pausedQueue.chunks) {
      const { chunks, nextIndex, rate, pitch, onEndCallback } = this.pausedQueue;
      if (nextIndex < chunks.length) {
        try { this.synth.cancel(); } catch (e) {}
        const newToken = ++this.currentSpeakingToken;
        this._playChunkQueue(chunks, nextIndex, newToken, rate, pitch, onEndCallback);
        return;
      }
    }

    if (this.pausedQueue && this.pausedQueue.nextIndex >= this.pausedQueue.chunks.length) {
      const callback=this.pausedQueue.onEndCallback;this.pausedQueue=null;this.setTeacherSpeaking(false);if(callback)callback();return;
    }

    // 3. 큐가 끝난 상태였으면 마지막 스크립트 다시 재생
    if (this.lastSpokenScript) {
      this.speak(this.lastSpokenScript);
    }
  },

  // 일시정지 / 이어듣기 토글
  togglePause() {
    if (this.isPaused) {
      this.resumeSpeaking();
    } else if (this.isSpeakingNow || (this.pausedQueue && this.pausedQueue.nextIndex < this.pausedQueue.chunks.length)) {
      this.pauseSpeaking();
    } else {
      // 재생 중이 아닐 때 누르면: 최근 대사가 있으면 이어듣고, 없으면 다시 듣기
      if (this.lastSpokenScript) {
        this.speak(this.lastSpokenScript);
      }
    }
    return this.isPaused;
  },

  // 일시정지 / 이어듣기 버튼 UI 전역 동기화
  _updatePauseUI() {
    // 1. 메인 헤더 컨트롤 바
    const btnPause = document.getElementById('btnVoicePause');
    const iconPause = document.getElementById('iconVoicePause');
    const textPause = document.getElementById('textVoicePause');

    // 2. 수업 뷰포트 내 상단 도구 모음
    const btnLessonPause = document.getElementById('btnLessonPause');
    const textLessonPause = document.getElementById('textLessonPause');

    if (this.isPaused) {
      if (btnPause) {
        btnPause.classList.add('paused');
        if (btnPause.setAttribute) {
          btnPause.setAttribute('title', '선생님 말씀 이어듣기');
          btnPause.setAttribute('aria-label', '음성 이어듣기');
        }
      }
      if (iconPause) iconPause.textContent = '▶️';
      if (textPause) textPause.textContent = '이어듣기';

      if (btnLessonPause) {
        btnLessonPause.classList.add('paused');
        if (btnLessonPause.setAttribute) {
          btnLessonPause.setAttribute('title', '선생님 말씀 이어듣기');
        }
      }
      if (textLessonPause) textLessonPause.innerHTML = '▶️ 이어듣기';
    } else {
      if (btnPause) {
        btnPause.classList.remove('paused');
        if (btnPause.setAttribute) {
          btnPause.setAttribute('title', '선생님 말씀 잠시 일시정지');
          btnPause.setAttribute('aria-label', '음성 일시정지');
        }
      }
      if (iconPause) iconPause.textContent = '⏸️';
      if (textPause) textPause.textContent = '일시정지';

      if (btnLessonPause) {
        btnLessonPause.classList.remove('paused');
        if (btnLessonPause.setAttribute) {
          btnLessonPause.setAttribute('title', '선생님 말씀 잠시 일시정지');
        }
      }
      if (textLessonPause) textLessonPause.innerHTML = '⏸️ 일시정지';
    }
  },

  // 음성 On/Off 토글
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('digital_school_muted', this.isMuted ? 'true' : 'false');
    localStorage.setItem('digital_school_voice_enabled', this.isMuted ? 'false' : 'true');

    if (this.isMuted) {
      this.stopSpeaking();
    } else {
      this.speak("선생님 음성 안내를 켰어요. 천천히 편안하게 설명해드릴게요.");
    }
    return this.isMuted;
  },

  // 속도 모드 토글 ('normal' ↔ 'slow')
  toggleSpeed() {
    this.speedMode = (this.speedMode === 'normal') ? 'slow' : 'normal';
    localStorage.setItem('digital_school_voice_speed', this.speedMode);

    if (!this.isMuted) {
      const msg = this.speedMode === 'slow'
        ? "말하는 속도를 천천히로 바꿨어요. 한 문장씩 여유롭게 들어보세요."
        : "말하는 속도를 보통으로 바꿨어요.";
      this.speak(msg);
    }
    return this.speedMode;
  },

  // 현재 화면에서 가장 최근에 재생된 안내 음성 처음부터 다시 듣기
  replayLastScript() {
    if (!this.lastSpokenScript) {
      this.speak("다시 들으실 내용을 준비하고 있어요. 화면을 터치해보세요.");
      return;
    }
    this.stopSpeaking();
    setTimeout(() => {
      this.speak(this.lastSpokenScript);
    }, 120);
  },

  // 16. 정답 맞혔을 때 피드백 재생 (Section 16: 5종 랜덤 사용)
  speakRandomCorrect(onEnd) {
    this.playXylophone();
    const item = (window.VoiceScripts && window.VoiceScripts.getRandomCorrect)
      ? window.VoiceScripts.getRandomCorrect()
      : { text: "맞았어요! 정말 잘하셨어요.", emotion: "happy" };
    const textToSpeak = item.text || "맞았어요! 정말 잘하셨어요.";
    setTimeout(() => {
      this.speak(textToSpeak, onEnd, { emotion: 'happy' });
    }, 280);
  },

  // 17. 오답일 때 피드백 재생 (Section 17: '틀렸습니다' 없이 5종 랜덤 격려 사용)
  speakRandomWrong(onEnd) {
    this.playChime('click');
    const item = (window.VoiceScripts && window.VoiceScripts.getRandomWrong)
      ? window.VoiceScripts.getRandomWrong()
      : { text: "괜찮아요. 한 번만 다시 생각해볼까요?", emotion: "encouraging" };
    const textToSpeak = item.text || "괜찮아요. 한 번만 다시 생각해볼까요?";
    setTimeout(() => {
      this.speak(textToSpeak, onEnd, { emotion: 'encouraging' });
    }, 200);
  },

  // 22. 이전 화면으로 이동할 때 (Section 22)
  speakNavPrev(onEnd) {
    const script = (window.VoiceScripts && window.VoiceScripts.navPrev && window.VoiceScripts.navPrev.voiceScript)
      ? window.VoiceScripts.navPrev.voiceScript
      : "괜찮아요. 이전 내용을 다시 보고 싶으시면 천천히 살펴보셔도 됩니다.";
    this.speak(script, onEnd, { emotion: 'warm' });
  },

  // 23. 다음 수업으로 이동할 때 (Section 23)
  speakNavNext(onEnd) {
    const script = (window.VoiceScripts && window.VoiceScripts.navNext && window.VoiceScripts.navNext.voiceScript)
      ? window.VoiceScripts.navNext.voiceScript
      : "좋아요. 그럼 이제 다음 내용을 한번 배워볼까요?";
    this.speak(script, onEnd, { emotion: 'encouraging' });
  },

  // 18. 도움말 버튼 안내 음성
  speakHelp(specificHelp) {
    const intro = (window.VoiceScripts && window.VoiceScripts.help && window.VoiceScripts.help.intro)
      ? window.VoiceScripts.help.intro
      : "어려우신가요? 괜찮아요. 현재 화면에서 무엇을 하면 되는지 제가 다시 설명해드릴게요.";
    const detail = specificHelp
      || (window.VoiceScripts && window.VoiceScripts.help && window.VoiceScripts.help.defaultHelp)
      || "화면에 보이는 글을 천천히 읽어보시고, 마음에 드는 버튼을 살짝 눌러보세요.";
    const combined = intro + " " + detail;
    this.speak(combined, null, { emotion: 'encouraging' });
  },

  // 21. 무반응 25초 감지 타이머
  startInactivityTimer(stepContext) {
    this.clearInactivityTimer();
    this.hasTriggeredInactivity = false;

    this.inactivityTimer = setTimeout(() => {
      if (!this.isMuted && !this.isSpeakingNow && !this.hasTriggeredInactivity) {
        this.hasTriggeredInactivity = true;
        const script = (window.VoiceScripts && window.VoiceScripts.inactivity && window.VoiceScripts.inactivity.voiceScript)
          ? window.VoiceScripts.inactivity.voiceScript
          : "천천히 하셔도 괜찮아요. 준비되셨으면 화면에 있는 버튼을 한번 눌러보세요.";
        this.speak(script, null, { emotion: 'calm' });
      }
    }, 25000); // 25초
  },

  resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    // 사용자가 상호작용한 경우 타이머 리셋
    if (!this.hasTriggeredInactivity) {
      this.startInactivityTimer();
    }
  },

  clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  },

  _bindGlobalActivityListeners() {
    const reset = () => this.resetInactivityTimer();
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('pointerdown', reset, { passive: true });
      window.addEventListener('keydown', reset, { passive: true });
    }
  },

  // 맑고 아름다운 실로폰 '딩-동-댕!' 정답 사운드 엔진
  playXylophone() {
    if (this.isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const notes = [
        { freq: 1046.50, delay: 0.00, dur: 0.45 }, // C6 (도)
        { freq: 1318.51, delay: 0.12, dur: 0.45 }, // E6 (미)
        { freq: 1567.98, delay: 0.24, dur: 0.70 }  // G6 (솔)
      ];

      notes.forEach(({ freq, delay, dur }) => {
        const t = now + delay;
        const oscFund = this.audioCtx.createOscillator();
        const gainFund = this.audioCtx.createGain();
        oscFund.type = 'triangle';
        oscFund.frequency.setValueAtTime(freq, t);

        const oscOvertone = this.audioCtx.createOscillator();
        const gainOvertone = this.audioCtx.createGain();
        oscOvertone.type = 'sine';
        oscOvertone.frequency.setValueAtTime(freq * 3, t);

        gainFund.gain.setValueAtTime(0.001, t);
        gainFund.gain.linearRampToValueAtTime(0.32, t + 0.003);
        gainFund.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        gainOvertone.gain.setValueAtTime(0.001, t);
        gainOvertone.gain.linearRampToValueAtTime(0.10, t + 0.002);
        gainOvertone.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

        oscFund.connect(gainFund);
        oscOvertone.connect(gainOvertone);
        gainFund.connect(this.audioCtx.destination);
        gainOvertone.connect(this.audioCtx.destination);

        oscFund.start(t);
        oscOvertone.start(t);
        oscFund.stop(t + dur);
        oscOvertone.stop(t + dur);
      });
    } catch (e) {}
  },

  // 부드러운 터치 효과음
  playChime(type = 'click') {
    if (this.isMuted) return;
    if (type === 'success' || type === 'xylophone' || type === 'correct') {
      this.playXylophone();
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(783.99, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.20);
        osc.start(now);
        osc.stop(now + 0.20);
      }
    } catch (e) {}
  },

  // 각 친구(콩이, 토리, 보리, 나비)만의 고유 시그니처 멜로디 연주
  playCharacterChime(charId) {
    if (this.isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const id = charId || this.characterId || 'kongi';
      const profile = this.characterProfiles[id] || this.characterProfiles.kongi;
      const notes = profile.chimeNotes || [
        { freq: 523.25, delay: 0.00, dur: 0.14, type: 'sine', gain: 0.08 },
        { freq: 659.25, delay: 0.08, dur: 0.20, type: 'sine', gain: 0.08 }
      ];

      notes.forEach(({ freq, delay = 0, dur = 0.18, type = 'sine', gain = 0.08 }) => {
        const t = now + delay;
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(gain, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(g);
        g.connect(this.audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      });
    } catch (e) {}
  }
};

window.VoiceManager = VoiceManager;
