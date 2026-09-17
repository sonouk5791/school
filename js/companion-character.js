/**
 * ============================================================
 * companion-character.js  |  메인 안내자 AI 친구 콩이 상호작용 시스템
 * ============================================================
 *
 * 역할:
 *  - 우측 하단 상주하며 시니어 어르신을 따뜻하게 동행·안내하는 '친구 같은 가이드'
 *  - 100% 투명 배경 콩이 PNG 이미지 기반 부드러운 미세 모션
 *  - 상황별(첫인사, 수업시작, 활동선택, 격려, 칭찬, 회상, 음악, 체조, 마무리) 음성 및 말풍선
 *  - 어르신 친화적 음성 톤(80~85% 느린 속도, 온화한 억양, 안내→기다림→격려)
 * ============================================================
 */

(function(global) {
  'use strict';

  // ── 1. 상황별 대화 스크립트 모음 ──────────────────────────────
  const DIALOGUES = {
    // 1. 첫 화면 자동 인사
    welcome: [
      {
        text: "안녕하세요~ 반가워요 😊",
        speech: "안녕하세요, 반가워요.",
        motion: "waving",
        pauseAfter: 800
      },
      {
        text: "오늘도 저와 함께…\n재미있는 시간을 보내볼까요? ✨",
        speech: "오늘도 저와 함께, 재미있는 시간을 보내볼까요?",
        motion: "waving"
      }
    ],

    // 2. 수업 시작 안내
    lessonStart: {
      text: "좋아요.\n그럼 천천히 시작해 볼까요? 📖\n\n잘하려고 걱정하지 않으셔도 돼요.\n저와 함께 하나씩 해보면 됩니다.",
      speech: "좋아요. 그럼 천천히 시작해 볼까요? 잘하려고 걱정하지 않으셔도 돼요. 저와 함께 하나씩 해보면 됩니다.",
      motion: "speaking"
    },

    // 3. 활동 선택 화면
    activitySelect: {
      text: "오늘은 어떤 활동을 해볼까요? 🎨\n\n사진도 보고, 노래도 듣고,\n재미있는 이야기도 나눌 수 있어요.",
      speech: "오늘은 어떤 활동을 해볼까요? 사진도 보고, 노래도 듣고, 재미있는 이야기도 나눌 수 있어요.",
      motion: "speaking"
    },

    // 4. 활동을 어려워할 때 (격려)
    difficultyEncourage: [
      {
        text: "괜찮아요. 천천히 생각해 보세요. 🧡\n모르셔도 괜찮습니다. 제가 같이 해드릴게요.",
        speech: "괜찮아요. 천천히 생각해 보세요. 모르셔도 괜찮습니다. 제가 같이 해드릴게요.",
        motion: "speaking"
      },
      {
        text: "조금 쉬었다가 하셔도 돼요.\n편안하게 함께해 봐요 🐾",
        speech: "조금 쉬었다가 하셔도 돼요. 편안하게 함께해 봐요.",
        motion: "speaking"
      }
    ],

    // 5. 정답 또는 활동 성공 (칭찬 3종 교차)
    successPraise: [
      {
        text: "잘하셨어요! 👏\n정말 훌륭하세요!",
        speech: "잘하셨어요! 정말 훌륭하세요.",
        motion: "clapping"
      },
      {
        text: "아주 좋아요! ✨\n차근차근 정말 잘하시네요.",
        speech: "아주 좋아요. 차근차근 정말 잘하시네요.",
        motion: "clapping"
      },
      {
        text: "역시 멋지세요! 🌟\n오늘 기분도 참 좋네요.",
        speech: "역시 멋지세요! 오늘 기분도 참 좋네요.",
        motion: "clapping"
      }
    ],

    // 6. 회상 활동 (사진 / 이야기)
    reminiscence: {
      text: "이 사진을 보니까 어떤 생각이 나세요? 📷\n옛날에 비슷한 곳에 가본 적 있으세요?",
      speech: "이 사진을 보니까 어떤 생각이 나세요? 옛날에 비슷한 곳에 가본 적 있으세요?",
      motion: "speaking"
    },

    // 7. 음악 활동 (흘러가는 옛노래)
    music: {
      text: "이번에는 노래를 한번 들어볼까요? 🎵\n아시는 노래라면 천천히 따라 불러보셔도 좋아요.",
      speech: "이번에는 노래를 한번 들어볼까요? 아시는 노래라면 천천히 따라 불러보셔도 좋아요.",
      motion: "music-sway"
    },

    // 8. 체조 활동 (20분 건강 체조)
    exercise: {
      text: "이번에는 몸을 조금 움직여 볼까요? 🤸\n무리하지 마시고 할 수 있는 만큼만 따라 해주세요.\n아프거나 힘들면 바로 쉬셔도 됩니다.",
      speech: "이번에는 몸을 조금 움직여 볼까요? 무리하지 마시고 할 수 있는 만큼만 따라 해주세요. 아프거나 힘들면 바로 쉬셔도 됩니다.",
      motion: "speaking"
    },

    // 9. 수업 종료 (마무리)
    finish: {
      text: "오늘도 정말 잘하셨어요! 🌟\n저와 함께해 주셔서 감사합니다.\n다음에 또 만나요. 오늘도 좋은 하루 보내세요 👋",
      speech: "오늘도 정말 잘하셨어요. 저와 함께해 주셔서 감사합니다. 다음에 또 만나요. 오늘도 좋은 하루 보내세요.",
      motion: "waving"
    }
  };

  // ── 2. CompanionCharacter 클래스 ──────────────────────────────
  class CompanionCharacter {
    constructor() {
      this.dockEl = null;
      this.avatarEl = null;
      this.bubbleEl = null;
      this.textEl = null;
      this.speakingIndicator = null;
      this.currentSpeechText = '';
      this.lastPraiseIndex = 0;
      this.isSpeaking = false;
      this.synth = global.speechSynthesis || null;
      this.voice = null;
      this.speechQueue = [];
      this.autoGreetingDone = false;
      this.inactivityTimer = null;
    }

    /** UI 생성 및 초기화 */
    init() {
      if (document.getElementById('companionDock')) return;

      this._buildUI();
      this._initVoice();
      this._bindGlobalEvents();

      // 페이지 로드 1.5초 후 자동 첫인사 시퀀스 시작
      setTimeout(() => {
        this.show();
        this.playFirstGreeting();
      }, 1500);

      // 사용자 무반응 감지 타이머 가동 (40초 이상 멈춤 시 따뜻한 격려)
      this._startInactivityDetector();
    }

    /** DOM 마크업 조립 */
    _buildUI() {
      const dock = document.createElement('aside');
      dock.id = 'companionDock';
      dock.className = 'companion-dock hidden-enter';
      dock.setAttribute('role', 'complementary');
      dock.setAttribute('aria-label', 'AI 친구 콩이 안내 캐릭터');

      dock.innerHTML = `
        <!-- 말풍선 오버레이 -->
        <div class="companion-speech-bubble" id="companionBubble" role="status" aria-live="polite">
          <div class="bubble-header">
            <span class="companion-name-badge">🐶 AI 친구 콩이</span>
            <button class="btn-bubble-close" id="btnCompanionClose" title="말풍선 닫기" aria-label="말풍선 닫기">×</button>
          </div>
          <p class="companion-dialogue-text" id="companionText">안녕하세요! 저는 콩이예요.</p>
          <div class="bubble-footer">
            <button class="btn-bubble-replay" id="btnCompanionReplay" title="콩이 말씀 다시 듣기">
              <span>↻</span> 다시 듣기
            </button>
            <span class="speaking-indicator" id="companionSpeakingIndicator">
              <span>🔊</span> 말씀 중…
            </span>
          </div>
        </div>

        <!-- 콩이 아바타 (투명 배경 PNG) -->
        <div class="companion-avatar-container" id="companionAvatar" role="button" tabindex="0" title="클릭해서 콩이와 대화하기" aria-label="AI 친구 콩이와 대화하기">
          <img src="assets/images/friend-kongi-companion.png" alt="안내자 콩이" class="companion-img" id="companionImg">
          <div class="companion-hint-pill">👆 눌러보세요!</div>
        </div>
      `;

      document.body.appendChild(dock);

      this.dockEl = dock;
      this.avatarEl = document.getElementById('companionAvatar');
      this.bubbleEl = document.getElementById('companionBubble');
      this.textEl = document.getElementById('companionText');
      this.speakingIndicator = document.getElementById('companionSpeakingIndicator');

      // 클릭 시 대화/인사 반응
      this.avatarEl.addEventListener('click', () => {
        this._resetInactivity();
        this.triggerInteraction();
      });

      this.avatarEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.triggerInteraction();
        }
      });

      // 말풍선 닫기
      document.getElementById('btnCompanionClose').addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideBubble();
      });

      // 다시 듣기
      document.getElementById('btnCompanionReplay').addEventListener('click', (e) => {
        e.stopPropagation();
        this._resetInactivity();
        if (this.currentSpeechText) {
          this.speak(this.currentSpeechText);
        }
      });
    }

    /** 시니어 친화적 음성 설정 (80~85% 속도, 따뜻하고 친근한 여성/중성 보이스) */
    _initVoice() {
      if (!this.synth) return;

      const pickVoice = () => {
        const voices = this.synth.getVoices();
        // 한국어 보이스 탐색 우선순위 (자연스러운 발음)
        this.voice =
          voices.find(v => v.lang === 'ko-KR' && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Yuna') || v.name.includes('SunHi') || v.name.includes('Heami'))) ||
          voices.find(v => v.lang === 'ko-KR' || v.lang.startsWith('ko')) ||
          null;
      };

      pickVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = pickVoice;
      }
    }

    /** 캐릭터 표시 */
    show() {
      if (this.dockEl) {
        this.dockEl.classList.remove('hidden-enter');
      }
    }

    /** 말풍선 표시 */
    showBubble(text) {
      if (this.textEl && text) {
        this.textEl.textContent = text;
      }
      if (this.bubbleEl) {
        this.bubbleEl.classList.add('visible');
      }
    }

    /** 말풍선 숨김 */
    hideBubble() {
      if (this.bubbleEl) {
        this.bubbleEl.classList.remove('visible');
      }
    }

    /** 모션 클래스 설정 */
    setMotion(motionName) {
      if (!this.avatarEl) return;
      this.avatarEl.classList.remove('waving', 'speaking', 'music-sway', 'clapping');
      if (motionName) {
        this.avatarEl.classList.add(motionName);
        if (motionName === 'waving' || motionName === 'clapping') {
          setTimeout(() => {
            this.avatarEl.classList.remove(motionName);
          }, 1800);
        }
      }
    }

    /**
     * TTS 음성 출력 및 말풍선/모션 동기화 (타입캐스트 AI 보이스 우선)
     * @param {string} text - 음성으로 읽을 텍스트
     * @param {string} [displayText] - 말풍선에 표시할 텍스트
     * @param {string} [motion] - 캐릭터 모션 ('waving', 'speaking', 'clapping', 'music-sway')
     */
    async speak(text, displayText = null, motion = 'speaking') {
      if (!text) return;

      this.currentSpeechText = text;
      this.showBubble(displayText || text);
      this.setMotion(motion);

      // 1. 타입캐스트 AI 보이스 API 호출 시도
      try {
        const typecastRes = await fetch('/api/tts/typecast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Typecast-API-Key': 'tc_681059782dc4759327e3d302'
          },
          body: JSON.stringify({
            text: text,
            actor_id: '60a761917fba305a2b1660d3', // 호빈이 (콩이 보이스)
            lang: 'ko',
            tempo: 0.85,
            pitch: 0,
            volume: 100
          })
        });

        const contentType = typecastRes.headers.get('content-type') || '';
        if (typecastRes.ok && (contentType.includes('audio') || contentType.includes('octet-stream'))) {
          const blob = await typecastRes.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);

          audio.onplay = () => {
            this.isSpeaking = true;
            this.avatarEl?.classList.add('speaking');
            this.speakingIndicator?.classList.add('active');
          };

          audio.onended = () => {
            this.isSpeaking = false;
            this.avatarEl?.classList.remove('speaking');
            this.speakingIndicator?.classList.remove('active');
            if (motion !== 'music-sway') this.setMotion(null);
            URL.revokeObjectURL(audioUrl);
          };

          audio.onerror = () => {
            this._fallbackSpeechSynthesis(text, motion);
          };

          await audio.play();
          return;
        }
      } catch (e) {
        console.warn('[Companion] 타입캐스트 서버 통신 실패, 기본 브라우저 TTS로 전환:', e);
      }

      // 2. Fallback: 브라우저 내장 Web Speech Synthesis
      this._fallbackSpeechSynthesis(text, motion);
    }

    _fallbackSpeechSynthesis(text, motion) {
      if (!this.synth) return;
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.83;
      utterance.pitch = 1.06;
      utterance.volume = 1.0;

      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.avatarEl?.classList.add('speaking');
        this.speakingIndicator?.classList.add('active');
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.avatarEl?.classList.remove('speaking');
        this.speakingIndicator?.classList.remove('active');
        if (motion !== 'music-sway') {
          this.setMotion(null);
        }
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.avatarEl?.classList.remove('speaking');
        this.speakingIndicator?.classList.remove('active');
        this.setMotion(null);
      };

      this.synth.speak(utterance);
    }

    /** 1. 첫 화면 자동 인사 시퀀스 */
    async playFirstGreeting() {
      if (this.autoGreetingDone) return;
      this.autoGreetingDone = true;

      const step1 = DIALOGUES.welcome[0];
      const step2 = DIALOGUES.welcome[1];

      // 1단계 인사
      this.speak(step1.speech, step1.text, step1.motion);

      // 음성 완료 또는 약간의 쉼 후 2단계 인사
      setTimeout(() => {
        this.speak(step2.speech, step2.text, step2.motion);
      }, 3400);
    }

    /** 2. 수업 시작 안내 */
    onLessonStart() {
      this._resetInactivity();
      const d = DIALOGUES.lessonStart;
      this.speak(d.speech, d.text, d.motion);
    }

    /** 3. 활동 선택 안내 */
    onActivitySelect() {
      this._resetInactivity();
      const d = DIALOGUES.activitySelect;
      this.speak(d.speech, d.text, d.motion);
    }

    /** 4. 어려워할 때 격려 */
    onDifficulty() {
      const item = DIALOGUES.difficultyEncourage[Math.floor(Math.random() * DIALOGUES.difficultyEncourage.length)];
      this.speak(item.speech, item.text, item.motion);
    }

    /** 5. 성공/정답 칭찬 (3종 번갈아) */
    onSuccess() {
      this._resetInactivity();
      const item = DIALOGUES.successPraise[this.lastPraiseIndex % DIALOGUES.successPraise.length];
      this.lastPraiseIndex++;
      this.speak(item.speech, item.text, item.motion);
    }

    /** 6. 회상 활동 안내 */
    onReminiscence() {
      this._resetInactivity();
      const d = DIALOGUES.reminiscence;
      this.speak(d.speech, d.text, d.motion);
    }

    /** 7. 음악 활동 안내 */
    onMusic() {
      this._resetInactivity();
      const d = DIALOGUES.music;
      this.speak(d.speech, d.text, d.motion);
    }

    /** 8. 체조 활동 안내 */
    onExercise() {
      this._resetInactivity();
      const d = DIALOGUES.exercise;
      this.speak(d.speech, d.text, d.motion);
    }

    /** 9. 수업 종료 안내 */
    onFinish() {
      this._resetInactivity();
      const d = DIALOGUES.finish;
      this.speak(d.speech, d.text, d.motion);
    }

    /** 캐릭터 직접 클릭 시 다정하게 말걸기 */
    triggerInteraction() {
      const greetings = [
        { text: "네! 저 부르셨어요? 🐶\n어르신과 함께해서 언제나 즐거워요.", speech: "네, 저 부르셨어요? 어르신과 함께해서 언제나 즐거워요.", motion: "waving" },
        { text: "어르신, 오늘도 참 고우세요 ✨\n천천히 하나씩 같이 해봐요.", speech: "어르신, 오늘도 참 고우세요. 천천히 하나씩 같이 해봐요.", motion: "waving" },
        { text: "궁금하신 점이 있거나 힘드시면\n언제든 저를 콕 눌러주세요 🐾", speech: "궁금하신 점이 있거나 힘드시면 언제든 저를 콕 눌러주세요.", motion: "speaking" }
      ];
      const g = greetings[Math.floor(Math.random() * greetings.length)];
      this.speak(g.speech, g.text, g.motion);
    }

    /** 글로벌 버튼 및 학습 이벤트 리스너 자동 연결 */
    _bindGlobalEvents() {
      // 1. 홈 수업 시작 버튼 클릭
      document.getElementById('btnHeroStart')?.addEventListener('click', () => {
        setTimeout(() => this.onLessonStart(), 300);
      });

      // 2. 오늘의 수업 섹션 스크롤/도달
      document.getElementById('btnHeroMeetAi')?.addEventListener('click', () => {
        setTimeout(() => this.onActivitySelect(), 300);
      });

      // 3. 체조 버튼 클릭
      document.getElementById('warmupPlay')?.addEventListener('click', () => {
        setTimeout(() => this.onExercise(), 400);
      });

      // 4. 음악 수업 카드 클릭
      document.querySelector('[data-lesson-id="music"]')?.addEventListener('click', () => {
        setTimeout(() => this.onMusic(), 400);
      });

      // 5. 사진 회상 수업 카드 클릭
      document.querySelector('[data-lesson-id="photo"]')?.addEventListener('click', () => {
        setTimeout(() => this.onReminiscence(), 400);
      });

      // 6. 수업 완료 이벤트 감지
      window.addEventListener('lesson-completed', () => {
        setTimeout(() => this.onSuccess(), 500);
      });

      // 사용자 상호작용 시 타이머 리셋
      ['click', 'touchstart', 'keydown'].forEach(evt => {
        document.addEventListener(evt, () => this._resetInactivity(), { passive: true });
      });
    }

    /** 40초간 조작이 없을 때 친절한 안내 */
    _startInactivityDetector() {
      this._resetInactivity();
    }

    _resetInactivity() {
      if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(() => {
        // 모달이나 수업 중일 때만 부드럽게 격려
        const inLesson = document.getElementById('lessonViewport')?.classList.contains('active');
        if (inLesson) {
          this.onDifficulty();
        }
      }, 45000);
    }
  }

  // ── 3. 전역 인스턴스 등록 및 자동 시작 ────────────────────────
  global.CompanionCharacter = CompanionCharacter;
  global.companionCharacter = new CompanionCharacter();

  document.addEventListener('DOMContentLoaded', () => {
    global.companionCharacter.init();
  });

})(typeof window !== 'undefined' ? window : global);
