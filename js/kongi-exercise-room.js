/**
 * 기억정원 콩이 운동방 - 코어 인터랙션 및 어르신 안심 의자 체조 제어
 * - 5개 큰 카드 메뉴
 * - 8단계 의자 체조 시퀀스
 * - 오직 4개 조작 버튼 (이전 동작, 잠깐 쉬기, 다음 동작, 그만하기)
 * - 한국어 Web Speech 음성 안내
 * - 운동 참여 기록 저장 (날짜, 종류, 시간, 완료여부, 중단여부)
 */

const KongiExerciseRoom = {
  // 상태 변수
  currentProgramKey: null,
  currentProgramTitle: '',
  steps: [],
  currentStepIndex: 0,
  stepSecondsRemaining: 40,
  timerInterval: null,
  isPaused: false,
  totalElapsedSeconds: 0,
  voiceEnabled: true,
  startTime: null,

  // 8대 의자 체조 기본 마스터 동작 데이터
  masterSteps: {
    prep: {
      name: "준비운동 (천천히 깊게 호흡하기)",
      actionTitle: "🌸 1단계: 천천히 깊게 호흡하기",
      speech: "안녕하세요, 콩이예요. 의자에 등을 편안히 기대고, 코로 숨을 깊게 들이쉬고 입으로 천천히 후~ 내쉬어 볼까요?",
      guide: "의자에 편안하게 앉아 코로 숨을 들이쉬고 입으로 천천히 내쉽니다.",
      duration: 35,
      motionType: "breath"
    },
    neck: {
      name: "목 운동 (좌우 천천히 부드럽게 숙이기)",
      actionTitle: "🌸 2단계: 부드럽게 목 숙이기",
      speech: "천천히 고개를 좌우로 움직여볼까요? 무리하지 말고 아프지 않은 만큼만 살며시 젖혀주세요.",
      guide: "고개를 오른쪽으로 천천히 기울였다가, 반대쪽으로도 부드럽게 움직입니다.",
      duration: 40,
      motionType: "neck"
    },
    shoulder: {
      name: "어깨 운동 (양 어깨 으쓱으쓱 올렸다 내리기)",
      actionTitle: "🌸 3단계: 어깨 으쓱으쓱 올렸다 내리기",
      speech: "어깨를 귀 쪽으로 으쓱 올렸다가 툭 하고 내려놓으세요. 아주 잘하고 계세요.",
      guide: "양 어깨를 부드럽게 위로 올렸다가 편안하게 아래로 내려놓습니다.",
      duration: 40,
      motionType: "shoulder"
    },
    arm: {
      name: "팔 운동 (양팔 앞으로 뻗고 살포시 굽히기)",
      actionTitle: "🌸 4단계: 양팔을 앞으로 뻗고 당기기",
      speech: "천천히 팔을 앞으로 올려볼까요? 가슴 앞으로 쭉 뻗었다가 살며시 당겨주세요.",
      guide: "양팔을 가슴 앞으로 천천히 뻗었다가 부드럽게 가슴 쪽으로 끌어당깁니다.",
      duration: 40,
      motionType: "arm"
    },
    finger: {
      name: "손가락 운동 (주먹 쥐고 쫙 펴기)",
      actionTitle: "🌸 5단계: 손가락 주먹 쥐고 활짝 펴기",
      speech: "손가락을 주먹 쥐었다가 활짝 펴보세요. 손끝을 톡톡 마주치며 뇌를 깨워요.",
      guide: "양손 주먹을 살며시 쥐었다가 손바닥을 활짝 펴고, 손끝을 톡톡 부딪힙니다.",
      duration: 40,
      motionType: "finger"
    },
    knee: {
      name: "무릎 운동 (의자에 앉아 한쪽 무릎 살짝 들기)",
      actionTitle: "🌸 6단계: 의자에서 무릎 살짝 들기",
      speech: "의자를 가볍게 잡고 무릎을 살짝 들어 올려보세요. 힘들면 언제든 쉬어도 괜찮아요.",
      guide: "의자를 양손으로 꼭 잡고, 발을 바닥에서 5센티미터만 살짝 들어 올립니다.",
      duration: 40,
      motionType: "knee"
    },
    ankle: {
      name: "발목 운동 (발끝 들고 까딱까딱 움직이기)",
      actionTitle: "🌸 7단계: 발끝 들고 발목 까딱까딱",
      speech: "발뒤꿈치를 바닥에 대고 발끝을 까딱까딱 움직여볼까요? 다리가 시원해져요.",
      guide: "뒤꿈치를 바닥에 두고 발끝을 위로 살며시 당겼다 내립니다.",
      duration: 40,
      motionType: "ankle"
    },
    finish: {
      name: "마무리 호흡 (가슴 활짝 펴고 숨 고르기)",
      actionTitle: "🌸 8단계: 가슴 펴고 마무리 호흡하기",
      speech: "마지막으로 가슴을 활짝 펴고 깊게 숨을 쉬어보세요. 오늘도 정말 훌륭하게 해내셨어요!",
      guide: "양팔을 넓게 벌려 가슴을 펴고, 깊고 편안한 호흡으로 운동을 마무리합니다.",
      duration: 35,
      motionType: "finish"
    }
  },

  // 5개 메뉴별 맞춤 동작 구성
  programs: {
    '5min': {
      title: "5분 가벼운 운동",
      stepKeys: ['prep', 'neck', 'shoulder', 'finish']
    },
    '10min': {
      title: "10분 아침 체조",
      stepKeys: ['prep', 'neck', 'shoulder', 'arm', 'finger', 'finish']
    },
    '20min': {
      title: "20분 전신 운동",
      stepKeys: ['prep', 'neck', 'shoulder', 'arm', 'finger', 'knee', 'ankle', 'finish']
    },
    'finger': {
      title: "손가락 운동",
      stepKeys: ['prep', 'finger', 'arm', 'finger', 'finish']
    },
    'music': {
      title: "음악과 함께 운동",
      stepKeys: ['prep', 'shoulder', 'arm', 'finger', 'ankle', 'finish']
    }
  },

  // 한국어 음성 발화 (TTS)
  speak(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85; // 어르신을 위한 편안하고 차분한 속도
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('음성 발화 예외:', e);
    }
  },

  // 운동 프로그램 시작
  startProgram(key) {
    const prog = this.programs[key];
    if (!prog) return;

    this.currentProgramKey = key;
    this.currentProgramTitle = prog.title;
    this.steps = prog.stepKeys.map(k => this.masterSteps[k]);
    this.currentStepIndex = 0;
    this.totalElapsedSeconds = 0;
    this.isPaused = false;
    this.startTime = new Date();

    // 화면 전환 (메뉴 숨김 -> 운동 진행 화면 표시)
    document.getElementById('viewMenuStage').style.display = 'none';
    const playStage = document.getElementById('viewPlayStage');
    playStage.classList.add('active');
    document.getElementById('viewFinishStage').classList.remove('active');

    // UI 정보 업데이트
    document.getElementById('currentProgramBadge').textContent = `🐶 콩이 — ${prog.title}`;
    
    // 첫 동작 진입
    this.renderCurrentStep();
    this.startStepTimer();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 현재 동작 렌더링
  renderCurrentStep() {
    const step = this.steps[this.currentStepIndex];
    if (!step) return;

    this.stepSecondsRemaining = step.duration;

    // 헤더 카운터 및 진행도
    const indicatorEl = document.getElementById('stepProgressIndicator');
    indicatorEl.textContent = `${this.currentStepIndex + 1} / ${this.steps.length} 동작`;

    // 동작 명칭 및 말풍선
    document.getElementById('actionNameText').textContent = step.actionTitle;
    document.getElementById('actionPromptText').textContent = `"${step.speech}"`;
    document.getElementById('actionGuideText').textContent = step.guide;

    // 타이머 텍스트 업데이트
    this.updateTimerDisplay();

    // 콩이 캐릭터 모션 이미지 연출
    const charImg = document.getElementById('giantKongiImg');
    if (charImg) {
      charImg.style.transform = 'scale(1.04)';
      setTimeout(() => {
        charImg.style.transform = 'scale(1)';
      }, 350);
    }

    // 음성 안내 발화
    this.speak(step.speech);
  },

  // 단계 타이머 시작
  startStepTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;

      this.stepSecondsRemaining--;
      this.totalElapsedSeconds++;
      this.updateTimerDisplay();

      // 중간 음성 격려 멘트
      if (this.stepSecondsRemaining === 15) {
        this.speak("아주 잘하고 계세요. 무리하지 마시고 편안하게 호흡하세요.");
      }

      // 단계 종료 시 다음 동작으로 자동 또는 유도
      if (this.stepSecondsRemaining <= 0) {
        if (this.currentStepIndex < this.steps.length - 1) {
          this.nextStep();
        } else {
          // 전 동작 정상 완료
          this.finishExercise(true);
        }
      }
    }, 1000);
  },

  // 타이머 표시 포맷
  updateTimerDisplay() {
    const timerEl = document.getElementById('stepTimerDisplay');
    if (!timerEl) return;
    const mins = Math.floor(this.stepSecondsRemaining / 60);
    const secs = this.stepSecondsRemaining % 60;
    timerEl.textContent = `⏱️ ${mins > 0 ? mins + '분 ' : ''}${secs}초`;
  },

  // [이전 동작] 버튼 동작
  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderCurrentStep();
    } else {
      this.speak("첫 번째 동작입니다.");
    }
  },

  // [다음 동작] 버튼 동작
  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderCurrentStep();
    } else {
      this.finishExercise(true);
    }
  },

  // [잠깐 쉬기 / 계속하기] 토글
  togglePause() {
    this.isPaused = !this.isPaused;
    const btn = document.getElementById('btnPlayPause');
    const overlay = document.getElementById('pauseOverlay');

    if (this.isPaused) {
      btn.innerHTML = '<span>▶</span><span>계속하기</span>';
      btn.style.background = 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)';
      if (overlay) overlay.classList.add('active');
      this.speak("잠시 쉬어갑니다. 숨을 편안하게 고르세요. 몸이 불편하시면 언제든 그만하셔도 괜찮아요.");
    } else {
      btn.innerHTML = '<span>⏸</span><span>잠깐 쉬기</span>';
      btn.style.background = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      if (overlay) overlay.classList.remove('active');
      this.speak("다시 천천히 시작해 볼까요?");
    }
  },

  // [그만하기] 버튼 동작
  exitProgram() {
    this.speak("운동을 종료합니다. 오늘 참여하신 내용을 안전하게 저장할게요.");
    this.finishExercise(false);
  },

  // 운동 종료 처리 및 기록 저장
  finishExercise(isFullyCompleted) {
    clearInterval(this.timerInterval);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const elapsedMins = Math.floor(this.totalElapsedSeconds / 60);
    const elapsedSecs = this.totalElapsedSeconds % 60;
    const timeFormatted = `${elapsedMins > 0 ? elapsedMins + '분 ' : ''}${elapsedSecs}초`;

    const now = new Date();
    const dateFormatted = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours()}시 ${now.getMinutes()}분`;

    // 저장 대상 데이터 객체
    const recordData = {
      participatedAt: dateFormatted,
      exerciseType: this.currentProgramTitle || "의자 건강 체조",
      participatedTime: timeFormatted,
      isCompleted: isFullyCompleted ? "완료" : "미완료",
      interruptedStatus: isFullyCompleted ? "정상 완료" : "중간 중단"
    };

    // 로컬 스토리지에 저장
    this.saveRecordToStorage(recordData);

    // 완료 화면 UI 렌더링
    document.getElementById('viewPlayStage').classList.remove('active');
    const finishStage = document.getElementById('viewFinishStage');
    finishStage.classList.add('active');

    // 리포트 테이블 채우기
    document.getElementById('reportDate').textContent = recordData.participatedAt;
    document.getElementById('reportType').textContent = recordData.exerciseType;
    document.getElementById('reportTime').textContent = recordData.participatedTime;
    document.getElementById('reportCompleted').textContent = recordData.isCompleted;
    document.getElementById('reportStatus').textContent = recordData.interruptedStatus;

    if (isFullyCompleted) {
      document.getElementById('finishStampIcon').textContent = '🌸';
      document.getElementById('finishMainTitle').textContent = '어르신, 오늘도 정말 훌륭하게 마치셨어요!';
      document.getElementById('finishMainDesc').textContent = '모든 의자 체조 동작을 완벽하게 따라 하셨습니다. 건강 꽃 도장을 드려요!';
      this.speak('어르신, 오늘도 정말 훌륭하게 마치셨어요! 모든 동작을 안전하게 완료하셨습니다.');
    } else {
      document.getElementById('finishStampIcon').textContent = '🌿';
      document.getElementById('finishMainTitle').textContent = '무리하지 않고 안전하게 쉬어가셨어요!';
      document.getElementById('finishMainDesc').textContent = '조금이라도 몸을 움직이신 것만으로도 건강에 큰 도움이 됩니다. 참 잘하셨어요!';
      this.speak('무리하지 않고 안전하게 쉬어가셨어요. 조금이라도 몸을 움직이신 것만으로도 아주 훌륭합니다.');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 로컬 스토리지 저장
  saveRecordToStorage(record) {
    try {
      const records = JSON.parse(localStorage.getItem('kongi_exercise_records') || '[]');
      records.unshift(record);
      // 최근 30개까지 보관
      if (records.length > 30) records.pop();
      localStorage.setItem('kongi_exercise_records', JSON.stringify(records));
    } catch (e) {
      console.warn('기록 저장 실패:', e);
    }
  },

  // 다시 메뉴로 돌아가기
  returnToMenu() {
    clearInterval(this.timerInterval);
    document.getElementById('viewPlayStage').classList.remove('active');
    document.getElementById('viewFinishStage').classList.remove('active');
    document.getElementById('viewMenuStage').style.display = 'flex';
    this.speak("운동방 메인 메뉴입니다. 마음에 드는 운동을 골라보세요.");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// DOM 로드 완료 후 바인딩
document.addEventListener('DOMContentLoaded', () => {
  // 5개 메뉴 카드 클릭 이벤트
  document.querySelectorAll('.kr-menu-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const progKey = card.getAttribute('data-program');
      if (progKey) {
        KongiExerciseRoom.startProgram(progKey);
      }
    });
  });

  // 하단 4대 조작 버튼
  const btnPrev = document.getElementById('btnActionPrev');
  if (btnPrev) btnPrev.addEventListener('click', () => KongiExerciseRoom.prevStep());

  const btnPause = document.getElementById('btnPlayPause');
  if (btnPause) btnPause.addEventListener('click', () => KongiExerciseRoom.togglePause());

  const btnNext = document.getElementById('btnActionNext');
  if (btnNext) btnNext.addEventListener('click', () => KongiExerciseRoom.nextStep());

  const btnExit = document.getElementById('btnActionExit');
  if (btnExit) btnExit.addEventListener('click', () => KongiExerciseRoom.exitProgram());

  // 완료 화면 액션 버튼
  const btnRestart = document.getElementById('btnRestartMenu');
  if (btnRestart) btnRestart.addEventListener('click', () => KongiExerciseRoom.returnToMenu());

  // 상단 소리 토글 버튼
  const btnSound = document.getElementById('btnTopSound');
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      KongiExerciseRoom.voiceEnabled = !KongiExerciseRoom.voiceEnabled;
      if (KongiExerciseRoom.voiceEnabled) {
        btnSound.classList.add('active');
        btnSound.innerHTML = '<span>🔊</span><span>소리 켜짐</span>';
        KongiExerciseRoom.speak("음성 안내가 켜졌습니다.");
      } else {
        btnSound.classList.remove('active');
        btnSound.innerHTML = '<span>🔈</span><span>소리 꺼짐</span>';
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      }
    });
  }

  // 상단 글자 확대 버튼
  const btnFont = document.getElementById('btnTopFont');
  if (btnFont) {
    btnFont.addEventListener('click', () => {
      document.body.classList.toggle('font-zoomed');
      btnFont.classList.toggle('active');
      const isZoomed = document.body.classList.contains('font-zoomed');
      KongiExerciseRoom.speak(isZoomed ? "글자 크기를 아주 크게 확대했습니다." : "글자 크기를 기본 크기로 변경했습니다.");
    });
  }

  // 초기 안내 음성
  setTimeout(() => {
    if (KongiExerciseRoom.voiceEnabled) {
      KongiExerciseRoom.speak("콩이의 운동방에 오신 것을 환영합니다. 의자에 편안하게 앉아서 마음에 드는 운동을 골라보세요.");
    }
  }, 500);
});
