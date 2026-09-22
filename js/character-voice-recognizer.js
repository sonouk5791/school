/**
 * ============================================================
 * character-voice-recognizer.js  |  캐릭터 음성인식 & 웨이크워드 엔진
 * ============================================================
 *
 * 장기요양 시니어 인지활동 플랫폼을 위한 음성 인식 모듈.
 *
 * ── 주요 기능 ──────────────────────────────────────────────
 *  1) STT 추상화 레이어:
 *     - 기본: Web Speech API (webkitSpeechRecognition)
 *     - 교체 가능 인터페이스 (Return Zero, Naver Clova Speech 등 지원 준비)
 *  2) 웨이크워드(호출어) 감지:
 *     - 콩이("콩이야"), 토리("토리야"), 나비("나비야"), 보리("보리야"/"보리야")
 *  3) 상태 머신 & 기존 UI 상태 표시기 연동:
 *     - VOICE READY (대기/웨이크워드 감시) ↔ LISTEN (명령어 듣기)
 *  4) 정해진 단문 명령어 분기 처리:
 *     - "네", "아니오", "다음", "다시 할래요" 등
 *  5) 인식 실패 & 3회 연속 실패 시 대체 입력 안내:
 *     - "다시 한 번 말씀해주시겠어요?" 유도 및 3회 실패 시 화면 버튼 강조
 *  6) 마이크 권한 및 에러 예외 처리
 * ============================================================
 */

(function(global) {
  'use strict';

  // ── 1. STT 엔진 공급자 (Provider Interface) ──────────────────

  /**
   * 브라우저 내장 Web Speech API 기반 STT 공급자
   */
  class WebSpeechSTTProvider {
    constructor(options = {}) {
      this.lang = options.lang || 'ko-KR';
      this.recognition = null;
      this.isListening = false;
      this.onResult = null;
      this.onError = null;
      this.onStart = null;
      this.onEnd = null;

      const SR = global.SpeechRecognition || global.webkitSpeechRecognition;
      this.isSupported = !!SR;
    }

    start(continuous = true) {
      if (!this.isSupported) {
        this.onError?.({ error: 'not-supported', message: '이 브라우저는 음성 인식을 지원하지 않습니다. Chrome/Edge 권장.' });
        return;
      }

      if (this.isListening) return;

      try {
        const SR = global.SpeechRecognition || global.webkitSpeechRecognition;
        this.recognition = new SR();
        this.recognition.lang = this.lang;
        this.recognition.continuous = continuous;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
          this.isListening = true;
          this.onStart?.();
        };

        this.recognition.onresult = (event) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }

          this.onResult?.({
            text: (final || interim).trim(),
            isFinal: !!final,
            interim: interim.trim(),
            raw: event
          });
        };

        this.recognition.onerror = (event) => {
          this.isListening = false;
          this.onError?.({ error: event.error, message: this._getErrorMessage(event.error) });
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.onEnd?.();
        };

        this.recognition.start();
      } catch (err) {
        this.isListening = false;
        this.onError?.({ error: 'start-failed', message: err.message });
      }
    }

    stop() {
      if (this.recognition && this.isListening) {
        try { this.recognition.stop(); } catch (e) {}
      }
      this.isListening = false;
    }

    _getErrorMessage(errorCode) {
      switch (errorCode) {
        case 'not-allowed':
          return '마이크 권한이 허용되지 않았습니다. 브라우저 주소창 왼쪽 자물쇠 아이콘에서 마이크를 허용해 주세요.';
        case 'no-speech':
          return '음성이 감지되지 않았습니다.';
        case 'audio-capture':
          return '마이크 장치를 찾을 수 없습니다. 마이크 연결을 확인해 주세요.';
        case 'network':
          return '음성 인식 네트워크 통신에 일시적인 지연이 있습니다.';
        default:
          return '음성 인식 처리 중 오류가 발생했습니다.';
      }
    }
  }

  // ── 2. 캐릭터별 웨이크워드 정의 ──────────────────────────────
  const CHARACTER_WAKEWORDS = {
    kongi: {
      name: '콩이',
      wakewords: ['콩이야', '콩이', '콩아', '콩아안녕', '콩이님', '강아지야'],
      greetReply: '네, 어르신! 콩이가 듣고 있어요. 무엇을 도와드릴까요?',
    },
    tori: {
      name: '토리',
      wakewords: ['토리야', '토리', '토끼야', '토리님', '토리아안녕'],
      greetReply: '네, 어르신! 반가워요 토리예요. 말씀해 주세요!',
    },
    nabi: {
      name: '나비',
      wakewords: ['나비야', '나비', '고양이야', '나비님', '나비야안녕'],
      greetReply: '네, 어르신! 나비가 귀 기울여 듣고 있어요.',
    },
    bori: {
      name: '보리',
      wakewords: ['보리야', '보리', '보리님', '보리야안녕', '곰이야', '곰이', '곰이님', '곰이야안녕'],
      greetReply: '네, 어르신! 든든한 보리입니다. 말씀해 보세요!',
    }
  };

  // ── 3. 정해진 단문 명령어 패턴 정의 (우선순위 순서) ───────────
  const COMMAND_PATTERNS = [
    {
      intent: 'RETRY',
      keywords: ['다시할래요', '다시할래', '다시하기', '다시듣기', '한번더', '한 번 더', '다시해줘', '다시', '처음부터'],
      actionName: '다시 하기/다시 듣기'
    },
    {
      intent: 'NEXT',
      keywords: ['다음으로', '다음수업', '다음단계', '다음', '넘어가', '앞으로', '넘겨줘'],
      actionName: '다음 단계/수업으로 이동'
    },
    {
      intent: 'EXERCISE',
      keywords: ['체조시작', '체조할래', '체조', '운동', '몸풀기'],
      actionName: '20분 건강 체조 시작'
    },
    {
      intent: 'SONG',
      keywords: ['노래틀어줘', '옛노래', '노래', '음악'],
      actionName: '흘러가는 옛노래 감상'
    },
    {
      intent: 'NEGATIVE',
      keywords: ['아니오', '아니요', '안할래', '안해', '아니', '싫어', '그만', '취소', '닫기'],
      actionName: '취소 또는 뒤로 가기'
    },
    {
      intent: 'POSITIVE',
      keywords: ['네', '예', '응', '좋아', '좋아요', '시작', '그래', '할래', '맞아', '진행', '좋습니다'],
      actionName: '수업/프로그램 시작 또는 긍정 응답'
    }
  ];

  // ── 4. CharacterVoiceRecognizer 클래스 ─────────────────────────
  class CharacterVoiceRecognizer {
    constructor() {
      /** STT 프로바이더 (추후 교체 가능) */
      this.provider = new WebSpeechSTTProvider({ lang: 'ko-KR' });

      /** 현재 활성 캐릭터 ID ('kongi', 'tori', 'nabi', 'bori') */
      this.activeCharacter = 'kongi';

      /** 상태: 'IDLE', 'READY', 'LISTEN', 'PROCESSING', 'ERROR' */
      this.state = 'READY';

      /** 연속 인식 실패 횟수 */
      this.consecutiveFailCount = 0;
      this.maxFailLimit = 3;

      /** 타임아웃 타이머 */
      this.listenTimeoutTimer = null;
      this.listenTimeoutMs = 7000; // 7초 후 타임아웃

      /** 자동 재시작 여부 (상시 웨이크워드 감시 모드) */
      this.autoRestart = true;
      this.isRunning = false;

      /** 콜백 핸들러 */
      this.onStateChange = null;
      this.onWakeWordDetected = null;
      this.onCommandRecognized = null;
      this.onRecognitionFailed = null;
      this.onError = null;

      this._bindProviderEvents();
    }

    /**
     * 엔진 초기화 및 이벤트 바인딩
     */
    _bindProviderEvents() {
      this.provider.onStart = () => {
        this.isRunning = true;
        this._updateUIState();
      };

      this.provider.onResult = (result) => {
        this._handleSpeechResult(result);
      };

      this.provider.onError = (err) => {
        console.warn('[VoiceRecognizer] STT 오류:', err);
        if (err.error === 'not-allowed') {
          this.autoRestart = false;
          this.setState('ERROR', err.message);
          this.onError?.(err);
          this._showFeedbackToast(err.message, 5000);
        } else if (err.error === 'no-speech') {
          // 음성 없음은 대기 중 자연스러운 현상
        } else {
          this.onError?.(err);
        }
      };

      this.provider.onEnd = () => {
        this.isRunning = false;
        // 상시 웨이크워드 대기 모드인 경우 자동 재시작
        if (this.autoRestart && this.state !== 'ERROR') {
          setTimeout(() => {
            if (this.autoRestart && !this.isRunning) {
              this.provider.start(true);
            }
          }, 300);
        }
      };
    }

    /**
     * 상시 음성인식 감시 시작 (VOICE READY 상태 진입)
     * @param {string} [characterId] - 현재 화면의 캐릭터 ('kongi', 'tori', 'nabi', 'bori')
     */
    start(characterId) {
      if (characterId && CHARACTER_WAKEWORDS[characterId]) {
        this.activeCharacter = characterId;
      }
      this.autoRestart = true;
      this.consecutiveFailCount = 0;
      this.setState('READY');
      this.provider.start(true);
    }

    /** 음성인식 감시 중지 */
    stop() {
      this.autoRestart = false;
      this._clearListenTimeout();
      this.provider.stop();
      this.setState('IDLE');
    }

    /** 현재 활성 캐릭터 변경 */
    setActiveCharacter(characterId) {
      if (CHARACTER_WAKEWORDS[characterId]) {
        this.activeCharacter = characterId;
        console.info(`[VoiceRecognizer] 활성 캐릭터 변경: ${CHARACTER_WAKEWORDS[characterId].name} (${characterId})`);
        this._updateUIState();
      }
    }

    /** 상태 전환 및 UI 동기화 */
    setState(newState, message = '') {
      this.state = newState;
      this._updateUIState(message);
      this.onStateChange?.(newState, message);
    }

    /**
     * 음성인식 결과 처리 (웨이크워드 및 명령어 해석)
     */
    _handleSpeechResult(result) {
      const text = result.text.replace(/\s+/g, '');
      if (!text) return;

      console.info(`[VoiceRecognizer] 수신 텍스트: "${result.text}" (상태: ${this.state})`);

      // ── 1. READY (VOICE READY) 상태: 웨이크워드 감시 ──
      if (this.state === 'READY') {
        const charConfig = CHARACTER_WAKEWORDS[this.activeCharacter] || CHARACTER_WAKEWORDS.kongi;
        const matched = charConfig.wakewords.some(wake => text.includes(wake));

        if (matched) {
          console.info(`[VoiceRecognizer] 🎯 웨이크워드 감지 성공: "${charConfig.name}" 호출됨!`);
          this._handleWakeWordSuccess(charConfig);
          return;
        }

        // 혹시 다른 캐릭터 이름을 불렀을 경우에도 유연하게 자동 전환
        for (const [id, cfg] of Object.entries(CHARACTER_WAKEWORDS)) {
          if (cfg.wakewords.some(wake => text.includes(wake))) {
            this.activeCharacter = id;
            console.info(`[VoiceRecognizer] 🎯 다른 캐릭터 웨이크워드 감지: "${cfg.name}"로 전환`);
            this._handleWakeWordSuccess(cfg);
            return;
          }
        }
      }

      // ── 2. LISTEN 상태: 실제 명령어 수신 ──
      else if (this.state === 'LISTEN') {
        if (!result.isFinal && text.length < 2) return; // 중간 결과 중 너무 짧은 단어는 대기

        this._clearListenTimeout();
        const matchedCommand = this._matchCommand(result.text);

        if (matchedCommand) {
          console.info(`[VoiceRecognizer] ✅ 명령어 매칭 성공: [${matchedCommand.intent}] "${result.text}"`);
          this.consecutiveFailCount = 0;
          this.setState('PROCESSING', `명령어 인식: ${matchedCommand.actionName}`);
          
          this._provideAuralFeedback(1000, 0.15); // 성공 비프
          this._showFeedbackToast(`✨ "${result.text}" 인식 완료!`, 2000);

          // 명령어 실행 콜백
          this.onCommandRecognized?.(matchedCommand, result.text);

          // 명령 실행 후 다시 READY 대기 상태로 복귀
          setTimeout(() => {
            if (this.state !== 'IDLE' && this.state !== 'ERROR') {
              this.setState('READY');
            }
          }, 2500);
        } else if (result.isFinal) {
          // 정해진 명령어가 아닌 경우 인식 실패 처리
          this._handleRecognitionFailure('명령어 미인식');
        }
      }
    }

    /**
     * 웨이크워드 성공 처리 -> LISTEN 상태 전환
     */
    _handleWakeWordSuccess(charConfig) {
      this.setState('LISTEN', `${charConfig.name}가 듣고 있어요!`);
      this._provideAuralFeedback(880, 0.2); // 웨이크 차임벨
      this._showFeedbackToast(`🐶 ${charConfig.name}: "네, 어르신! 말씀해 주세요."`, 3000);

      // 캐릭터 응답 음성 출력 (선택)
      if (global.VoiceManager && typeof global.VoiceManager.speak === 'function') {
        global.VoiceManager.speak(`${charConfig.name}가 듣고 있어요. 말씀해 주세요!`);
      }

      this.onWakeWordDetected?.(this.activeCharacter, charConfig);

      // LISTEN 상태 타임아웃 타이머 설정 (시간 내 응답 없으면 실패 처리)
      this._clearListenTimeout();
      this.listenTimeoutTimer = setTimeout(() => {
        if (this.state === 'LISTEN') {
          console.info('[VoiceRecognizer] ⏱️ LISTEN 상태 타임아웃');
          this._handleRecognitionFailure('시간 초과');
        }
      }, this.listenTimeoutMs);
    }

    /**
     * 명령어 매칭 로직 (정해진 패턴 검사)
     */
    _matchCommand(rawText) {
      const clean = rawText.trim().replace(/[?!.,\s]/g, '');

      for (const pattern of COMMAND_PATTERNS) {
        for (const kw of pattern.keywords) {
          if (clean === kw || clean.includes(kw)) {
            return pattern;
          }
        }
      }
      return null;
    }

    /**
     * 인식 실패 및 재시도 유도 처리
     */
    _handleRecognitionFailure(reason) {
      this.consecutiveFailCount++;
      console.warn(`[VoiceRecognizer] ⚠️ 인식 실패 (${this.consecutiveFailCount}/${this.maxFailLimit}회): ${reason}`);

      const charConfig = CHARACTER_WAKEWORDS[this.activeCharacter] || CHARACTER_WAKEWORDS.kongi;

      if (this.consecutiveFailCount < this.maxFailLimit) {
        // 1~2회 실패 시: 캐릭터가 다시 말하도록 유도
        const retryPrompt = '다시 한 번 말씀해주시겠어요?';
        this._showFeedbackToast(`🐾 ${charConfig.name}: "${retryPrompt}"`, 3500);

        if (global.VoiceManager && typeof global.VoiceManager.speak === 'function') {
          global.VoiceManager.speak(retryPrompt);
        }

        this.onRecognitionFailed?.({
          count: this.consecutiveFailCount,
          max: this.maxFailLimit,
          reason,
          hasFallbackButton: false
        });

        // 1회 더 LISTEN 상태 유지
        this._clearListenTimeout();
        this.listenTimeoutTimer = setTimeout(() => {
          if (this.state === 'LISTEN') {
            this._handleRecognitionFailure('재시도 시간 초과');
          }
        }, this.listenTimeoutMs);
      } else {
        // 3회 이상 연속 실패 시: 대체 입력 수단(화면 버튼 등) 노출 및 안내
        console.info('[VoiceRecognizer] 💡 3회 연속 실패: 대체 버튼 UI 포커스 및 안내 제공');
        const fallbackPrompt = '화면에 보이는 큰 버튼을 꾹 눌러서 진행해보세요!';
        this._showFeedbackToast(`👆 ${fallbackPrompt}`, 5000);

        if (global.VoiceManager && typeof global.VoiceManager.speak === 'function') {
          global.VoiceManager.speak('화면의 버튼을 눌러주셔도 괜찮아요.');
        }

        // 화면 내 주요 버튼(오늘 수업 시작, 환영 시작 등) 자동 하이라이트
        this._highlightFallbackButtons();

        this.onRecognitionFailed?.({
          count: this.consecutiveFailCount,
          max: this.maxFailLimit,
          reason,
          hasFallbackButton: true
        });

        // 상태를 다시 READY로 리셋
        this.consecutiveFailCount = 0;
        this.setState('READY');
      }
    }

    /** 타임아웃 타이머 클리어 */
    _clearListenTimeout() {
      if (this.listenTimeoutTimer) {
        clearTimeout(this.listenTimeoutTimer);
        this.listenTimeoutTimer = null;
      }
    }

    /**
     * 3회 실패 시 화면의 주요 상호작용 버튼 강조 (대체 수단 유도)
     */
    _highlightFallbackButtons() {
      const candidates = document.querySelectorAll(
        '#welcomeStart, #morningStart, #btnHeroStart, .lesson-card.active, .care-btn.primary, #btnHeroMeetAi'
      );
      candidates.forEach(btn => {
        if (btn && btn.offsetParent !== null) { // 보이는 버튼인 경우
          btn.style.transition = 'transform 0.3s, box-shadow 0.3s';
          btn.style.boxShadow = '0 0 0 4px #ff7a38, 0 8px 24px rgba(255, 122, 56, 0.4)';
          btn.style.transform = 'scale(1.05)';
          btn.focus();

          setTimeout(() => {
            btn.style.boxShadow = '';
            btn.style.transform = '';
          }, 6000);
        }
      });
    }

    /**
     * 기존 UI 요소(상태 표시기, VOICE READY / LISTEN 배지) 상태 동기화
     */
    _updateUIState(customMsg = '') {
      const isReady = this.state === 'READY';
      const isListen = this.state === 'LISTEN';
      const isProcessing = this.state === 'PROCESSING';

      // 1. 기존 또는 신규 상태 표시기 요소들 탐색
      const statusEls = document.querySelectorAll('.voice-status-indicator, [data-voice-state], #heroVoiceStatus, .voice-badge');

      statusEls.forEach(el => {
        el.dataset.voiceState = this.state.toLowerCase();
        el.classList.toggle('voice-ready', isReady);
        el.classList.toggle('voice-listen', isListen || isProcessing);
        el.classList.toggle('voice-error', this.state === 'ERROR');

        // 내부 텍스트 업데이트 (존재하는 경우)
        const textNode = el.querySelector('.voice-status-text, #waveformPillText, .ctrl-text');
        if (textNode) {
          if (isListen) textNode.textContent = 'LISTEN';
          else if (isReady) textNode.textContent = 'VOICE READY';
          else if (isProcessing) textNode.textContent = 'PROCESSING...';
        }
      });

      // 2. 3D/2D 히어로 힌트 태그에 현재 인식 상태 피드백 연동
      const heroHint = document.getElementById('hero3DHint');
      if (heroHint) {
        if (isListen) {
          heroHint.textContent = '🎙️ 듣고 있어요! ("네" / "다음")';
          heroHint.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';
          heroHint.style.display = 'block';
          heroHint.style.opacity = '1';
        } else if (isReady) {
          heroHint.textContent = `🐾 "${CHARACTER_WAKEWORDS[this.activeCharacter]?.name || '콩이'}야" 하고 불러보세요!`;
          heroHint.style.background = '';
        }
      }
    }

    /** 간단한 비프 사운드 피드백 (AudioContext) */
    _provideAuralFeedback(freq = 880, duration = 0.15) {
      try {
        const AudioCtx = global.AudioContext || global.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {}
    }

    /** 시니어 친화적 하단 피드백 토스트 알림 */
    _showFeedbackToast(message, duration = 3000) {
      let toast = document.getElementById('voiceFeedbackToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'voiceFeedbackToast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.style.cssText = `
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: rgba(26, 20, 15, 0.94);
          color: #ffffff;
          border: 2px solid #ffd026;
          border-radius: 30px;
          padding: 12px 24px;
          font-size: 17px;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          z-index: 99999;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
          max-width: 90vw;
          text-align: center;
        `;
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';

      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
      }, duration);
    }
  }

  // ── 5. 글로벌 싱글톤 인스턴스 등록 ─────────────────────────────
  global.CharacterVoiceRecognizer = CharacterVoiceRecognizer;
  global.voiceRecognizer = new CharacterVoiceRecognizer();

  // DOM 로드 시 자동 초기화 및 메인 화면/환영 화면 연결
  document.addEventListener('DOMContentLoaded', () => {
    // 음성 인식 자동 시작 (기본: 콩이 대기)
    setTimeout(() => {
      if (global.voiceRecognizer && !global.voiceRecognizer.isRunning) {
        global.voiceRecognizer.start('kongi');
      }
    }, 1200);

    // 명령어 연동 바인딩
    global.voiceRecognizer.onCommandRecognized = (command, text) => {
      console.info(`[VoiceApp] 🚀 명령어 실행 연동: ${command.intent}`);

      switch (command.intent) {
        case 'POSITIVE':
        case 'NEXT': {
          // 1. 환영 모달이 열려 있는 경우
          const welcomeStart = document.getElementById('welcomeStart');
          if (welcomeStart && welcomeStart.offsetParent !== null) {
            welcomeStart.click();
            return;
          }
          // 2. 모닝 프로그램이 활성화된 경우
          const morningNext = document.querySelector('#morningProgram [data-morning="next"]');
          if (morningNext && morningNext.offsetParent !== null) {
            morningNext.click();
            return;
          }
          // 3. 홈 화면 수업 시작 버튼
          const heroStart = document.getElementById('btnHeroStart');
          if (heroStart && heroStart.offsetParent !== null) {
            heroStart.click();
            return;
          }
          break;
        }

        case 'NEGATIVE': {
          // 환영 모달 또는 레슨 뷰포트 닫기
          const welcomeClose = document.querySelector('.welcome-close');
          if (welcomeClose && welcomeClose.offsetParent !== null) {
            welcomeClose.click();
            return;
          }
          const lessonClose = document.getElementById('btnLessonClose');
          if (lessonClose && lessonClose.offsetParent !== null) {
            lessonClose.click();
            return;
          }
          break;
        }

        case 'RETRY': {
          // 다시 듣기
          const replayBtn = document.getElementById('btnVoiceReplay') || document.getElementById('welcomeListen');
          if (replayBtn && replayBtn.offsetParent !== null) {
            replayBtn.click();
          }
          break;
        }

        case 'EXERCISE': {
          const warmupPlay = document.getElementById('warmupPlay');
          if (warmupPlay) warmupPlay.click();
          break;
        }

        case 'SONG': {
          const musicCard = document.querySelector('[data-lesson-id="music"]');
          if (musicCard) musicCard.click();
          break;
        }
      }
    };
  });

})(typeof window !== 'undefined' ? window : global);
