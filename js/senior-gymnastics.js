/**
 * senior-gymnastics.js
 * 디지털 AI 학교 - 치매 및 인지저하 어르신을 위한 「어르신 체조」 콘텐츠 엔진
 * 
 * 주요 기능:
 * 1. 16:9 규격 5단계 고해상도 시각 운동 시퀀스 자동 재생
 * 2. 0.8배속 따뜻하고 또박또박한 한국어 여성 TTS 음성 안내
 * 3. 숫자 카운트 (1 -> 2 -> 3 -> 4) 시각적 팝업 및 타이밍 싱크
 * 4. Web Audio API 기반의 잔잔하고 안정적인 힐링 피아노 배경음악 (BGM)
 * 5. 시작/일시정지/재개/이전/다음/다시보기/음소거/전체화면 지원
 */

(function () {
  'use strict';

  // 시나리오 타임라인 및 자막/음성 데이터 정의
  const GYMNASTICS_SCENES = [
    {
      id: 'intro',
      stageNum: 0,
      badgeText: '시작 인사',
      title: '디지털 AI 학교 어르신 체조',
      subtitle: '천천히 함께 움직여요',
      image: 'assets/images/exercise/gymnastics-intro.jpg',
      animation: 'kenburns-in',
      duration: 10,
      steps: [
        {
          caption: '안녕하세요! 어르신 체조 시간입니다 😊',
          speech: '안녕하세요. 디지털 에이아이 학교와 함께하는 어르신 체조 시간입니다. 오늘도 천천히, 즐겁게 함께 움직여볼게요.',
          delay: 500
        }
      ]
    },
    {
      id: 'step1',
      stageNum: 1,
      badgeText: '운동 1 / 4',
      title: '1. 목과 어깨 풀기',
      subtitle: '천천히 따라해요',
      image: 'assets/images/exercise/gymnastics-step1.jpg',
      animation: 'kenburns-pan',
      duration: 32,
      steps: [
        {
          caption: '1. 목과 어깨 풀기 · 천천히 따라해요',
          speech: '첫 번째 운동입니다. 목과 어깨를 천천히 풀어볼게요.',
          delay: 400
        },
        {
          caption: '고개를 왼쪽으로 천천히 기울여 주세요',
          speech: '고개를 왼쪽으로 천천히 기울여 주세요.',
          delay: 800
        },
        {
          caption: '다시 가운데로 천천히 돌아옵니다',
          speech: '다시 가운데로 천천히 돌아옵니다.',
          delay: 800
        },
        {
          caption: '이번에는 오른쪽으로 천천히 기울여 주세요',
          speech: '이번에는 오른쪽으로 천천히 기울여 주세요.',
          delay: 800
        },
        {
          caption: '어깨를 천천히 위로 으쓱 올렸다가 내려놓습니다',
          speech: '어깨를 천천히 위로 올렸다가 내려놓습니다.',
          delay: 800
        },
        {
          caption: '하나',
          speech: '하나.',
          count: 1,
          delay: 1100
        },
        {
          caption: '둘',
          speech: '둘.',
          count: 2,
          delay: 1100
        },
        {
          caption: '셋',
          speech: '셋.',
          count: 3,
          delay: 1100
        },
        {
          caption: '넷',
          speech: '넷.',
          count: 4,
          delay: 1100
        },
        {
          caption: '참 잘하셨어요! 아주 편안해졌어요 🌸',
          speech: '아주 잘하고 계세요. 참 편안해졌습니다.',
          delay: 800
        }
      ]
    },
    {
      id: 'step2',
      stageNum: 2,
      badgeText: '운동 2 / 4',
      title: '2. 팔 올리기와 박수',
      subtitle: '하나, 둘, 셋, 넷',
      image: 'assets/images/exercise/gymnastics-step2.jpg',
      animation: 'kenburns-out',
      duration: 36,
      steps: [
        {
          caption: '2. 팔 올리기와 박수 · 하나, 둘, 셋, 넷',
          speech: '두 번째 운동입니다. 팔을 천천히 위로 올려볼게요.',
          delay: 400
        },
        {
          caption: '팔을 위로 번쩍! 하나',
          speech: '하나.',
          count: 1,
          delay: 1200
        },
        {
          caption: '둘',
          speech: '둘.',
          count: 2,
          delay: 1200
        },
        {
          caption: '셋',
          speech: '셋.',
          count: 3,
          delay: 1200
        },
        {
          caption: '넷',
          speech: '넷.',
          count: 4,
          delay: 1200
        },
        {
          caption: '이번에는 가볍고 즐겁게 손뼉을 쳐볼게요 👏',
          speech: '이번에는 가볍게 박수를 쳐볼게요.',
          delay: 800
        },
        {
          caption: '짝! 짝! 하나',
          speech: '하나.',
          count: 1,
          delay: 1100
        },
        {
          caption: '둘',
          speech: '둘.',
          count: 2,
          delay: 1100
        },
        {
          caption: '셋',
          speech: '셋.',
          count: 3,
          delay: 1100
        },
        {
          caption: '넷',
          speech: '넷.',
          count: 4,
          delay: 1100
        },
        {
          caption: '좋아요! 무리하지 말고 천천히 따라오세요 ✨',
          speech: '좋아요. 무리하지 말고 천천히 따라오세요.',
          delay: 800
        }
      ]
    },
    {
      id: 'step3',
      stageNum: 3,
      badgeText: '운동 3 / 4',
      title: '3. 무릎 들기와 발목 운동',
      subtitle: '천천히 다리를 움직여요',
      image: 'assets/images/exercise/gymnastics-step3.jpg',
      animation: 'kenburns-pan',
      duration: 35,
      steps: [
        {
          caption: '3. 무릎 들기와 발목 운동 · 천천히 다리를 움직여요',
          speech: '세 번째 운동입니다. 의자에 앉아 무릎을 천천히 들어볼게요.',
          delay: 400
        },
        {
          caption: '오른쪽 다리 천천히 들기 · 하나',
          speech: '오른쪽 다리. 하나.',
          count: 1,
          delay: 1400
        },
        {
          caption: '왼쪽 다리 천천히 들기 · 둘',
          speech: '왼쪽 다리. 둘.',
          count: 2,
          delay: 1400
        },
        {
          caption: '천천히 편안하게 반복해 주세요',
          speech: '천천히 반복해 주세요.',
          delay: 1000
        },
        {
          caption: '이번에는 발목을 부드럽게 둥글게 돌려볼게요',
          speech: '이번에는 발목을 부드럽게 돌려볼게요.',
          delay: 900
        },
        {
          caption: '오른쪽 발목 돌리기',
          speech: '오른쪽.',
          delay: 1200
        },
        {
          caption: '왼쪽 발목 돌리기',
          speech: '왼쪽.',
          delay: 1200
        },
        {
          caption: '천천히 움직여요 · 아주 잘하고 계십니다 👍',
          speech: '천천히 움직입니다. 아주 잘하고 계십니다.',
          delay: 800
        }
      ]
    },
    {
      id: 'step4',
      stageNum: 4,
      badgeText: '운동 4 / 4',
      title: '4. 심호흡과 마무리 인사',
      subtitle: '오늘도 정말 잘하셨어요',
      image: 'assets/images/exercise/gymnastics-step4.jpg',
      animation: 'kenburns-in',
      duration: 32,
      steps: [
        {
          caption: '4. 심호흡과 마무리 인사 · 오늘도 정말 잘하셨어요',
          speech: '마지막 운동입니다.',
          delay: 400
        },
        {
          caption: '코로 천천히 깊게 숨을 들이마시고~ 🌸',
          speech: '코로 천천히 숨을 들이마시고,',
          delay: 1400
        },
        {
          caption: '입으로 후~ 천천히 내쉬어 주세요 🍃',
          speech: '입으로 천천히 내쉬어 주세요.',
          delay: 1500
        },
        {
          caption: '한 번 더! 천천히 숨을 들이마시고~ 🌸',
          speech: '한 번 더 해볼게요. 천천히 숨을 들이마시고,',
          delay: 1500
        },
        {
          caption: '천천히 끝까지 내쉬어 주세요 🍃',
          speech: '천천히 내쉬어 주세요.',
          delay: 1500
        },
        {
          caption: '몸도 마음도 편안해집니다 💛',
          speech: '몸도 마음도 편안해집니다. 오늘도 정말 잘하셨습니다. 다음에 또 함께해요.',
          delay: 1000
        }
      ]
    },
    {
      id: 'ending',
      stageNum: 5,
      badgeText: '체조 완료',
      title: '오늘도 수고하셨습니다',
      subtitle: '다음에 또 함께해요',
      image: 'assets/images/exercise/gymnastics-intro.jpg',
      animation: 'kenburns-out',
      duration: 8,
      steps: [
        {
          caption: '오늘도 수고하셨습니다! 언제나 건강하세요 💖',
          speech: '오늘도 정말 수고하셨습니다. 내일 또 건강하게 만나요!',
          delay: 500
        }
      ]
    }
  ];

  // 클래스 정의
  class SeniorGymnasticsPlayer {
    constructor() {
      this.currentSceneIndex = 0;
      this.currentStepIndex = 0;
      this.isPlaying = false;
      this.isPaused = false;
      this.isMuted = false;
      this.timerId = null;
      this.speechSynth = window.speechSynthesis;
      this.selectedVoice = null;
      this.audioCtx = null;
      this.bgmGainNode = null;
      this.bgmPlaying = false;
      this.bgmTimer = null;

      this.initDOMElements();
      this.initVoice();
      this.bindEvents();
      this.updateUI(0);
    }

    initDOMElements() {
      // 뷰어 및 오버레이 요소
      this.playerCard = document.getElementById('gymnasticsPlayerCard');
      this.viewport = document.getElementById('gymnasticsViewport');
      this.imgElement = document.getElementById('gymnasticsSlideImg');
      this.slideLayer = document.getElementById('gymnasticsSlideLayer');
      this.badgeElement = document.getElementById('gymnasticsStageBadge');
      this.stepIndicator = document.getElementById('gymnasticsStepIndicator');
      this.captionText = document.getElementById('gymnasticsCaptionText');
      this.countOverlay = document.getElementById('gymnasticsCountOverlay');
      this.countBubble = document.getElementById('gymnasticsCountBubble');
      this.pauseOverlay = document.getElementById('gymnasticsPauseBackdrop');

      // 컨트롤 버튼들
      this.heroStartBtn = document.getElementById('btnGymnasticsHeroStart');
      this.playPauseBtn = document.getElementById('btnGymPlayPause');
      this.playPauseIcon = document.getElementById('iconGymPlayPause');
      this.playPauseText = document.getElementById('textGymPlayPause');
      this.replayBtn = document.getElementById('btnGymReplay');
      this.prevBtn = document.getElementById('btnGymPrev');
      this.nextBtn = document.getElementById('btnGymNext');
      this.audioBtn = document.getElementById('btnGymAudio');
      this.audioIcon = document.getElementById('iconGymAudio');
      this.fullscreenBtn = document.getElementById('btnGymFullscreen');
      
      // 하단 씬 탭들
      this.sceneTabs = document.querySelectorAll('.gym-scene-tab');
    }

    initVoice() {
      if (!this.speechSynth) return;

      const pickVoice = () => {
        const voices = this.speechSynth.getVoices();
        if (!voices || voices.length === 0) return;

        // 한국어 여성 음성 우선 탐색
        const krVoices = voices.filter(v => v.lang.startsWith('ko') || v.lang.includes('KR'));
        const femaleKeywords = ['female', 'yuna', 'sunhi', 'heami', 'hyuna', 'jiwon', '여성', '여'];
        
        let best = krVoices.find(v => femaleKeywords.some(kw => v.name.toLowerCase().includes(kw)));
        if (!best && krVoices.length > 0) {
          best = krVoices[0];
        }
        this.selectedVoice = best || null;
      };

      pickVoice();
      if (this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = pickVoice;
      }
    }

    /* Web Audio API 기반 편안하고 따뜻한 피아노 BGM */
    initAudioContext() {
      if (this.audioCtx) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContextClass();
        this.bgmGainNode = this.audioCtx.createGain();
        this.bgmGainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.audioCtx.currentTime);
        this.bgmGainNode.connect(this.audioCtx.destination);
      } catch (e) {
        console.warn('Web Audio API not supported:', e);
      }
    }

    playBgmChord() {
      if (!this.audioCtx || !this.bgmPlaying || this.isPaused) return;

      // 따뜻한 펜타토닉 피아노 멜로디 시퀀스
      const notes = [
        [261.63, 329.63, 392.00, 523.25], // C Major
        [220.00, 261.63, 329.63, 440.00], // A Minor
        [174.61, 220.00, 261.63, 349.23], // F Major
        [196.00, 246.94, 293.66, 392.00]  // G Major
      ];

      const chord = notes[Math.floor(Math.random() * notes.length)];
      const now = this.audioCtx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.25);

        gain.gain.setValueAtTime(0, now + idx * 0.25);
        gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.25 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.25 + 2.8);

        osc.connect(gain);
        gain.connect(this.bgmGainNode);

        osc.start(now + idx * 0.25);
        osc.stop(now + idx * 0.25 + 3.0);
      });

      this.bgmTimer = setTimeout(() => {
        this.playBgmChord();
      }, 3500);
    }

    startBgm() {
      this.initAudioContext();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.bgmPlaying = true;
      if (!this.bgmTimer) {
        this.playBgmChord();
      }
    }

    stopBgm() {
      this.bgmPlaying = false;
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
    }

    bindEvents() {
      // 히어로 대형 버튼
      if (this.heroStartBtn) {
        this.heroStartBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.startOrResume();
          // 플레이어 위치로 부드럽게 스크롤
          if (this.playerCard) {
            this.playerCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }

      // 메인 재생 / 정지 버튼
      if (this.playPauseBtn) {
        this.playPauseBtn.addEventListener('click', () => {
          if (this.isPlaying && !this.isPaused) {
            this.pause();
          } else {
            this.startOrResume();
          }
        });
      }

      // 일시정지 오버레이 클릭 시 재개
      if (this.pauseOverlay) {
        this.pauseOverlay.addEventListener('click', () => {
          this.resume();
        });
      }

      // 뷰포트 클릭 시 일시정지 토글
      if (this.viewport) {
        this.viewport.addEventListener('click', (e) => {
          if (e.target.closest('#gymnasticsPauseBackdrop') || !this.isPlaying) return;
          if (this.isPaused) {
            this.resume();
          } else {
            this.pause();
          }
        });
      }

      // 다시보기
      if (this.replayBtn) {
        this.replayBtn.addEventListener('click', () => {
          this.goToScene(0);
          this.playCurrentScene();
        });
      }

      // 이전 운동
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => {
          this.prevScene();
        });
      }

      // 다음 운동
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          this.nextScene();
        });
      }

      // 소리 켜기 / 끄기
      if (this.audioBtn) {
        this.audioBtn.addEventListener('click', () => {
          this.toggleMute();
        });
      }

      // 전체화면
      if (this.fullscreenBtn) {
        this.fullscreenBtn.addEventListener('click', () => {
          this.toggleFullscreen();
        });
      }

      // 하단 씬 탭 클릭
      this.sceneTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const idx = parseInt(tab.getAttribute('data-scene-idx'), 10);
          if (!isNaN(idx)) {
            this.goToScene(idx);
            this.playCurrentScene();
          }
        });
      });

      // 키보드 단축키 지원 (접근성)
      window.addEventListener('keydown', (e) => {
        // 입력 필드 포커스 시 무시
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

        if (e.code === 'Space') {
          // 화면에 플레이어가 보일 때만 스페이스바 토글
          const rect = this.playerCard.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            e.preventDefault();
            if (this.isPlaying && !this.isPaused) {
              this.pause();
            } else {
              this.startOrResume();
            }
          }
        } else if (e.code === 'ArrowLeft') {
          this.prevScene();
        } else if (e.code === 'ArrowRight') {
          this.nextScene();
        } else if (e.key === 'm' || e.key === 'M') {
          this.toggleMute();
        } else if (e.key === 'f' || e.key === 'F') {
          this.toggleFullscreen();
        }
      });
    }

    startOrResume() {
      if (this.isPaused) {
        this.resume();
      } else {
        this.isPlaying = true;
        this.isPaused = false;
        this.startBgm();
        this.playCurrentScene();
      }
      this.updatePlayPauseUI();
    }

    pause() {
      this.isPaused = true;
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      if (this.speechSynth) {
        this.speechSynth.cancel();
      }
      if (this.pauseOverlay) {
        this.pauseOverlay.classList.add('show');
      }
      this.updatePlayPauseUI();
    }

    resume() {
      if (!this.isPlaying) {
        this.isPlaying = true;
      }
      this.isPaused = false;
      if (this.pauseOverlay) {
        this.pauseOverlay.classList.remove('show');
      }
      this.startBgm();
      this.playStep(this.currentStepIndex);
      this.updatePlayPauseUI();
    }

    updatePlayPauseUI() {
      if (!this.playPauseIcon || !this.playPauseText) return;
      if (this.isPlaying && !this.isPaused) {
        this.playPauseIcon.textContent = '⏸';
        this.playPauseText.textContent = '잠시 멈추기';
        this.playPauseBtn.setAttribute('title', '어르신 체조 잠시 멈추기');
      } else {
        this.playPauseIcon.textContent = '▶';
        this.playPauseText.textContent = '시작하기';
        this.playPauseBtn.setAttribute('title', '어르신 체조 시작하기');
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.bgmGainNode && this.audioCtx) {
        this.bgmGainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.audioCtx.currentTime);
      }
      if (this.speechSynth && this.isMuted) {
        this.speechSynth.cancel();
      }
      if (this.audioIcon) {
        this.audioIcon.textContent = this.isMuted ? '🔇' : '🔊';
      }
      const audioText = document.getElementById('textGymAudio');
      if (audioText) {
        audioText.textContent = this.isMuted ? '소리 켜기' : '소리 끄기';
      }
    }

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        if (this.playerCard.requestFullscreen) {
          this.playerCard.requestFullscreen();
        } else if (this.playerCard.webkitRequestFullscreen) {
          this.playerCard.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    goToScene(index) {
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      if (this.speechSynth) {
        this.speechSynth.cancel();
      }
      this.hideCount();

      this.currentSceneIndex = Math.max(0, Math.min(index, GYMNASTICS_SCENES.length - 1));
      this.currentStepIndex = 0;
      this.updateUI(this.currentSceneIndex);
    }

    prevScene() {
      if (this.currentSceneIndex > 0) {
        this.goToScene(this.currentSceneIndex - 1);
        if (this.isPlaying && !this.isPaused) {
          this.playCurrentScene();
        }
      }
    }

    nextScene() {
      if (this.currentSceneIndex < GYMNASTICS_SCENES.length - 1) {
        this.goToScene(this.currentSceneIndex + 1);
        if (this.isPlaying && !this.isPaused) {
          this.playCurrentScene();
        }
      }
    }

    updateUI(sceneIndex) {
      const scene = GYMNASTICS_SCENES[sceneIndex];
      if (!scene) return;

      // 이미지 변경 및 애니메이션 리셋
      if (this.imgElement) {
        this.imgElement.src = scene.image;
        this.imgElement.alt = scene.title;
        this.imgElement.className = 'gymnastics-slide-img ' + scene.animation;
      }

      if (this.slideLayer) {
        this.slideLayer.classList.remove('active');
        void this.slideLayer.offsetWidth; // 리플로우 강제
        this.slideLayer.classList.add('active');
      }

      // 상단 배지
      if (this.badgeElement) {
        this.badgeElement.innerHTML = `<span>🧘</span> <span>${scene.title}</span>`;
      }
      if (this.stepIndicator) {
        this.stepIndicator.textContent = scene.badgeText;
      }

      // 기본 첫 자막
      if (this.captionText && scene.steps && scene.steps.length > 0) {
        this.captionText.textContent = scene.steps[0].caption;
      }

      // 하단 탭 활성화 상태
      this.sceneTabs.forEach((tab, idx) => {
        // scene 1~4는 1번 탭(idx=1), 2번 탭(idx=2) 등 매핑
        const tabSceneIdx = parseInt(tab.getAttribute('data-scene-idx'), 10);
        if (tabSceneIdx === sceneIndex) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }

    playCurrentScene() {
      this.isPlaying = true;
      this.isPaused = false;
      if (this.pauseOverlay) {
        this.pauseOverlay.classList.remove('show');
      }
      this.updatePlayPauseUI();
      this.currentStepIndex = 0;
      this.playStep(0);
    }

    playStep(stepIdx) {
      if (!this.isPlaying || this.isPaused) return;

      const scene = GYMNASTICS_SCENES[this.currentSceneIndex];
      if (!scene || !scene.steps || stepIdx >= scene.steps.length) {
        // 현재 씬의 모든 스텝 완료 -> 다음 씬으로 자동 전환
        this.onSceneComplete();
        return;
      }

      this.currentStepIndex = stepIdx;
      const step = scene.steps[stepIdx];

      // 자막 갱신
      if (this.captionText) {
        this.captionText.textContent = step.caption;
      }

      // 숫자 카운트 표시 여부
      if (step.count) {
        this.showCount(step.count);
      } else {
        this.hideCount();
      }

      // 음성 TTS 재생
      if (step.speech && !this.isMuted) {
        this.speak(step.speech, () => {
          // 음성 완료 후 지정된 딜레이 대기 후 다음 스텝
          const delay = step.delay || 1000;
          this.timerId = setTimeout(() => {
            this.playStep(stepIdx + 1);
          }, delay);
        });
      } else {
        // 음소거 상태이거나 음성이 없을 때 텍스트 길이에 맞춘 타이밍 처리
        const readingTime = Math.max(2000, (step.caption.length * 150)) + (step.delay || 1000);
        this.timerId = setTimeout(() => {
          this.playStep(stepIdx + 1);
        }, readingTime);
      }
    }

    showCount(num) {
      if (!this.countOverlay || !this.countBubble) return;
      this.countBubble.textContent = num;
      this.countOverlay.classList.add('show');
    }

    hideCount() {
      if (this.countOverlay) {
        this.countOverlay.classList.remove('show');
      }
    }

    speak(text, onEndCallback) {
      if (!this.speechSynth || this.isMuted) {
        if (onEndCallback) onEndCallback();
        return;
      }

      this.speechSynth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      // 치매 어르신 기준: 또박또박 80% 속도
      utterance.rate = 0.82;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      let ended = false;
      const finish = () => {
        if (!ended) {
          ended = true;
          if (onEndCallback) onEndCallback();
        }
      };

      utterance.onend = finish;
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        finish();
      };

      // 일부 브라우저의 가비지 컬렉션 타임아웃 방지
      const maxSpeechTimeout = Math.max(4000, text.length * 350);
      setTimeout(() => {
        if (!ended && this.isPlaying && !this.isPaused) {
          finish();
        }
      }, maxSpeechTimeout);

      this.speechSynth.speak(utterance);
    }

    onSceneComplete() {
      this.hideCount();
      if (this.currentSceneIndex < GYMNASTICS_SCENES.length - 1) {
        // 다음 운동으로 자동 이동 (부드러운 전환)
        this.currentSceneIndex += 1;
        this.updateUI(this.currentSceneIndex);
        this.timerId = setTimeout(() => {
          this.playCurrentScene();
        }, 1200);
      } else {
        // 전체 운동 완료!
        this.isPlaying = false;
        this.isPaused = false;
        this.updatePlayPauseUI();
        if (this.captionText) {
          this.captionText.textContent = '🎉 오늘 운동을 멋지게 마쳤습니다! 참 잘하셨어요 💖';
        }
      }
    }
  }

  // DOM 로드 완료 시 인스턴스화
  document.addEventListener('DOMContentLoaded', () => {
    window.seniorGymnastics = new SeniorGymnasticsPlayer();
  });

})();
