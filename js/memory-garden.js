/**
 * 기억정원 (Memory Garden) - Core Application Logic
 * 상용화 1차 통합: 가상카드 고유 ID 바인딩, 페이지 이동 구조, 음성 피드백, Care & Admin 지원
 */

// Application State
const MemoryGarden = {
  currentView: 'gateway',
  currentSenior: {
    id: 'senior-001',
    name: '김순자 어르신',
    group: '사랑반',
    character: '콩이',
    characterImg: 'assets/images/friend-kongi.png',
    todayActivity: '콩이와 의자 체조',
    recentActivity: '옛날 노래 교실 (어제)'
  },
  
  // 가상카드 및 향후 NFC 태그 매핑 고유 ID 구조
  virtualCards: {
    'memory-card-personal': {
      title: '내 기억카드',
      targetView: 'today-activities',
      voiceText: '김순자 어르신의 오늘의 활동 화면으로 이동합니다.',
      character: 'kongi'
    },
    'activity-card-exercise': {
      title: '콩이와 운동해요',
      targetView: 'exercise-select',
      voiceText: '콩이와 함께 몸을 움직여 볼까요? 오늘 어떤 운동을 해볼까요?',
      character: 'kongi'
    },
    'activity-card-cognitive': {
      title: '나비와 생각해요',
      targetView: 'cognitive-garden',
      voiceText: '나비와 함께 재미있는 문제를 풀어봐요.',
      character: 'nabi'
    },
    'activity-card-remembrance': {
      title: '토리와 추억을 이야기해요',
      targetView: 'remembrance-garden',
      voiceText: '토리와 함께 옛날 이야기를 나눠봐요.',
      character: 'tori'
    },
    'activity-card-music': {
      title: '곰이와 노래를 들어요',
      targetView: 'music-garden',
      voiceText: '곰이와 함께 즐거운 노래를 들어봐요.',
      character: 'bori'
    },
    'activity-card-play': {
      title: '함께 놀아요',
      targetView: 'cognitive-garden', // 1차에서는 놀이/인지 통합
      voiceText: '친구들과 함께 신나게 놀아봐요.',
      character: 'tori'
    }
  },

  // State trackers
  exerciseTimer: null,
  exerciseSeconds: 300, // 5 min default
  isExercisePaused: false,
  isMusicPlaying: false,
  musicTrackIndex: 0,
  remembrancePhotoIndex: 0,
  
  // Dummy data sets
  musicTracks: [
    { title: '고향의 봄', artist: '이원수 작사 / 홍난파 작곡', duration: '2분 40초' },
    { title: '봄날은 간다', artist: '백설희 노래', duration: '3분 15초' },
    { title: '찔레꽃', artist: '백난아 노래', duration: '2분 55초' }
  ],
  remembrancePhotos: [
    {
      title: '그 시절 활기찼던 남대문 시장',
      url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
      desc: '시끌벅적하고 정겨웠던 옛 장터 풍경'
    },
    {
      title: '정겨운 시골집 마당과 장독대',
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80',
      desc: '된장 고추장이 익어가던 따스한 마당'
    },
    {
      title: '따뜻한 난로가 있던 옛날 교실',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&auto=format&fit=crop&q=80',
      desc: '도시락을 데워 먹던 추억의 나무 책걸상'
    }
  ],
  seniorsList: [
    { id: 'senior-001', name: '김순자 어르신', group: '사랑반', character: '콩이', characterImg: 'assets/images/friend-kongi.png', today: '콩이와 의자 체조', recent: '어제 노래 교실' },
    { id: 'senior-002', name: '박영수 어르신', group: '행복반', character: '나비', characterImg: 'assets/images/friend-nabi.png', today: '나비와 숫자 짝맞추기', recent: '그림 회상' },
    { id: 'senior-003', name: '이정애 어르신', group: '사랑반', character: '토리', characterImg: 'assets/images/friend-tori.png', today: '추억의 장터 이야기', recent: '의자 스트레칭' },
    { id: 'senior-004', name: '최동철 어르신', group: '희망반', character: '곰이', characterImg: 'assets/images/friend-bori.png', today: '가요 감상과 박수 치기', recent: '과일 퀴즈' }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  updateSeniorDisplay();
  renderCareDashboard();
  renderAdminDashboard();
});

/**
 * Event Listeners Registration
 */
function initEventListeners() {
  // Global View Navigation
  document.querySelectorAll('[data-view-target]').forEach(el => {
    el.addEventListener('click', (e) => {
      const target = el.getAttribute('data-view-target');
      if (target) {
        switchView(target);
      }
    });
  });

  // Top Bar Role Switcher
  document.querySelectorAll('.mg-role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mg-role-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.getAttribute('data-role');
      if (role === 'senior') switchView('senior-main');
      else if (role === 'care') switchView('care-dashboard');
      else if (role === 'admin') switchView('admin-dashboard');
    });
  });

  // Virtual Card Touch Event Handler (Core Interaction)
  document.querySelectorAll('.v-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const cardId = card.getAttribute('data-card-id');
      handleVirtualCardTouch(cardId, card);
    });
  });

  // Virtual NFC Simulator Buttons
  document.querySelectorAll('.nfc-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nfcId = btn.getAttribute('data-nfc-id');
      simulateNfcTap(nfcId);
    });
  });

  // Senior Profile Switch Modal
  const profilePill = document.getElementById('currentSeniorPill');
  if (profilePill) {
    profilePill.addEventListener('click', () => {
      openSeniorSelectModal();
    });
  }
}

/**
 * View Switcher
 */
function switchView(viewName) {
  MemoryGarden.currentView = viewName;
  
  // Hide all views
  document.querySelectorAll('.mg-view').forEach(view => {
    view.classList.remove('active');
  });

  // Show target view
  const targetEl = document.getElementById(`view-${viewName}`);
  if (targetEl) {
    targetEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update Topbar Role Pill Active State
  document.querySelectorAll('.mg-role-btn').forEach(b => {
    b.classList.remove('active');
    const role = b.getAttribute('data-role');
    if (role === 'senior' && (viewName.startsWith('senior') || ['today-activities', 'exercise-select', 'exercise-garden', 'cognitive-garden', 'remembrance-garden', 'music-garden', 'activity-finish', 'garden-tour'].includes(viewName))) {
      b.classList.add('active');
    } else if (role === 'care' && viewName.startsWith('care')) {
      b.classList.add('active');
    } else if (role === 'admin' && viewName.startsWith('admin')) {
      b.classList.add('active');
    }
  });

  // View-specific initializations
  if (viewName === 'exercise-select') {
    stopExerciseTimer();
    speakVoicePrompt('오늘 어떤 운동을 해볼까요? 5분, 10분, 20분 코스 중에서 선택해 보세요.');
  } else if (viewName !== 'exercise-garden') {
    stopExerciseTimer();
  }

  if (viewName === 'cognitive-garden') {
    resetCognitiveGame();
  }

  if (viewName === 'remembrance-garden') {
    updateRemembrancePhoto(0);
  }

  if (viewName === 'music-garden') {
    updateMusicDisplay();
  }
}

/**
 * Handle Screen-Touch Virtual Card Reaction
 * Sequence: Scale & Glow -> Character Bounce -> Voice Prompt -> Navigate
 */
function handleVirtualCardTouch(cardId, cardElement) {
  const cardConfig = MemoryGarden.virtualCards[cardId];
  if (!cardConfig) return;

  // 1. Visual Reaction
  cardElement.classList.add('card-touch-active');
  
  // 2. Voice Prompt (Speech Synthesis + Toast)
  speakVoicePrompt(cardConfig.voiceText);

  // 3. Navigate after short feedback delay
  setTimeout(() => {
    cardElement.classList.remove('card-touch-active');
    switchView(cardConfig.targetView);
  }, 1000);
}

/**
 * Simulate NFC Tag Tap (For testing NFC high-level binding)
 */
function simulateNfcTap(tagId) {
  const cardConfig = MemoryGarden.virtualCards[tagId];
  if (!cardConfig) return;

  showVoiceToast(`[가상 NFC 태그 감지] 고유 ID: ${tagId}`);
  speakVoicePrompt(cardConfig.voiceText);

  setTimeout(() => {
    switchView(cardConfig.targetView);
  }, 800);
}

/**
 * Web Speech API Voice Prompt & Visual Toast
 */
function speakVoicePrompt(text) {
  showVoiceToast(text);

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9; // 조금 천천히 명확하게
    utterance.pitch = 1.05; // 온화하고 다정한 톤
    window.speechSynthesis.speak(utterance);
  }
}

function showVoiceToast(text) {
  let toast = document.getElementById('seniorVoiceToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'seniorVoiceToast';
    toast.className = 'senior-voice-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>💬</span><span>${text}</span>`;
  toast.classList.add('show');

  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/**
 * Update Senior Profile Display
 */
function updateSeniorDisplay() {
  const s = MemoryGarden.currentSenior;
  
  // Topbar Pill
  const pillName = document.getElementById('topbarSeniorName');
  if (pillName) pillName.textContent = `${s.name} (${s.group})`;

  // Personal Card Elements
  const pName = document.getElementById('personalCardName');
  const pChar = document.getElementById('personalCardChar');
  const pToday = document.getElementById('personalCardToday');
  const pRecent = document.getElementById('personalCardRecent');
  const pAvatar = document.getElementById('personalCardAvatar');

  if (pName) pName.textContent = s.name;
  if (pChar) pChar.textContent = s.character;
  if (pToday) pToday.textContent = s.todayActivity;
  if (pRecent) pRecent.textContent = s.recentActivity;
  if (pAvatar) pAvatar.src = s.characterImg;
}

/**
 * Senior Select Modal for Social Workers
 */
function openSeniorSelectModal() {
  let modal = document.getElementById('seniorSelectModal');
  if (!modal) return;

  const listEl = document.getElementById('seniorSelectList');
  listEl.innerHTML = MemoryGarden.seniorsList.map(senior => `
    <div class="senior-select-item ${senior.id === MemoryGarden.currentSenior.id ? 'active' : ''}" 
         onclick="selectSenior('${senior.id}')"
         style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 16px; border: 1.5px solid rgba(0,0,0,0.08); margin-bottom: 10px; cursor: pointer; background: #FAF8F5;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <img src="${senior.characterImg}" style="width: 44px; height: 44px; border-radius: 12px; background: white; padding: 4px;">
        <div>
          <div style="font-size: 18px; font-weight: 800; color: #212922;">${senior.name}</div>
          <div style="font-size: 14px; color: #7D8A7F;">${senior.group} · 담당 캐릭터: ${senior.character}</div>
        </div>
      </div>
      <button style="border: none; background: #386641; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 700; cursor: pointer;">선택</button>
    </div>
  `).join('');

  modal.classList.add('open');
}

function selectSenior(seniorId) {
  const found = MemoryGarden.seniorsList.find(s => s.id === seniorId);
  if (found) {
    MemoryGarden.currentSenior = {
      id: found.id,
      name: found.name,
      group: found.group,
      character: found.character,
      characterImg: found.characterImg,
      todayActivity: found.today,
      recentActivity: found.recent
    };
    updateSeniorDisplay();
    speakVoicePrompt(`${found.name}으로 이용자를 전환하였습니다.`);
  }
  closeModal('seniorSelectModal');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

/* ==========================================================================
   Activity 1: 콩이 건강체조 프로그램 (Kongi Seated Chair Exercise Program)
   5분, 10분, 20분 맞춤 타임라인 엔진 및 실시간 가이드
   ========================================================================== */

// 체조 코스별 세부 타임라인 데이터
MemoryGarden.exerciseCourses = {
  5: {
    title: '5분 가볍게',
    totalSeconds: 300,
    steps: [
      {
        start: 0,
        end: 20,
        timeLabel: '0:00 ~ 0:20',
        title: '콩이 인사',
        primaryText: '"안녕하세요! 콩이와 함께 가볍게 몸을 움직여 볼까요?"',
        secondaryText: '의자에 등을 편안하게 대고 바른 자세로 준비합니다.',
        direction: '양쪽 함께 천천히',
        motion: 'motion-breathing',
        voiceText: '안녕하세요. 콩이와 함께 가볍게 몸을 움직여 볼까요?'
      },
      {
        start: 20,
        end: 60,
        timeLabel: '0:20 ~ 1:00',
        title: '천천히 호흡하기',
        primaryText: '팔을 옆에서 위로 올리며 숨을 깊게 들이마시고, 천천히 내립니다.',
        secondaryText: '팔을 천천히 내리면서 후- 하고 숨을 내쉬어 보세요.',
        direction: '양팔 위로 ➔ 천천히 내리기',
        motion: 'motion-arms-up',
        voiceText: '팔을 옆에서 위로 천천히 올리며 숨을 들이마시고, 천천히 내립니다.'
      },
      {
        start: 60,
        end: 120,
        timeLabel: '1:00 ~ 2:00',
        title: '목과 어깨 운동',
        primaryText: '고개를 좌우로 천천히 돌리고, 어깨를 으쓱 올렸다가 내려놓으세요.',
        secondaryText: '어깨를 뒤로 천천히 둥글게 돌려줍니다.',
        direction: '왼쪽 ◀ ▶ 오른쪽',
        motion: 'motion-left-right',
        voiceText: '고개를 좌우로 천천히 움직이고, 어깨를 부드럽게 돌려줍니다.'
      },
      {
        start: 120,
        end: 180,
        timeLabel: '2:00 ~ 3:00',
        title: '팔 운동',
        primaryText: '팔을 앞으로 쭉 뻗고, 양팔을 넓게 벌려 가슴을 활짝 펴보세요.',
        secondaryText: '마지막으로 팔을 위로 높이 올려 시원하게 펴줍니다.',
        direction: '앞으로 ➔ 옆으로 ➔ 위로',
        motion: 'motion-arms-up',
        voiceText: '팔을 앞으로 뻗고, 양팔을 넓게 벌려 가슴을 펴보세요.'
      },
      {
        start: 180,
        end: 240,
        timeLabel: '3:00 ~ 4:00',
        title: '다리 운동',
        primaryText: '의자에 앉은 상태로 무릎을 번갈아 들고, 발목을 움직여 주세요.',
        secondaryText: '발끝을 몸쪽으로 살짝 당겨 종아리를 이완합니다.',
        direction: '왼발 ◀ ▶ 오른발',
        motion: 'motion-left-right',
        voiceText: '의자에 앉아서 무릎을 번갈아 가볍게 들고, 발목을 움직여 봅니다.'
      },
      {
        start: 240,
        end: 300,
        timeLabel: '4:00 ~ 5:00',
        title: '정리운동',
        primaryText: '천천히 팔을 올리며 깊은 호흡을 하고, 가볍게 손을 흔들어주세요.',
        secondaryText: '"오늘도 정말 잘하셨어요!"',
        direction: '깊은 심호흡',
        motion: 'motion-breathing',
        voiceText: '오늘도 정말 잘하셨어요. 참 잘하셨습니다.'
      }
    ]
  },
  10: {
    title: '10분 건강체조',
    totalSeconds: 600,
    steps: [
      {
        start: 0,
        end: 120,
        timeLabel: '0:00 ~ 2:00',
        title: '준비운동 (2분)',
        primaryText: '깊은 호흡을 하며 목과 어깨, 손목을 부드럽게 풀어줍니다.',
        secondaryText: '몸의 긴장을 풀고 천천히 숨을 쉽니다.',
        direction: '양쪽 함께 천천히',
        motion: 'motion-breathing',
        voiceText: '준비운동입니다. 호흡과 목, 어깨를 부드럽게 풀어주세요.'
      },
      {
        start: 120,
        end: 300,
        timeLabel: '2:00 ~ 5:00',
        title: '상체운동 (3분)',
        primaryText: '팔을 앞으로, 옆으로, 위로 뻗고 팔꿈치와 손가락을 쥐었다 펴보세요.',
        secondaryText: '손가락을 잼잼 쥐었다 펴며 혈액순환을 돕습니다.',
        direction: '앞으로 ➔ 옆으로 ➔ 위로',
        motion: 'motion-arms-up',
        voiceText: '상체운동입니다. 팔을 뻗고 팔꿈치와 손가락을 천천히 쥐었다 펴보세요.'
      },
      {
        start: 300,
        end: 480,
        timeLabel: '5:00 ~ 8:00',
        title: '하체운동 (3분)',
        primaryText: '무릎을 들고 다리를 펴며, 발목을 돌리고 발끝을 올려줍니다.',
        secondaryText: '의자에 앉아 편안한 높이까지만 들어 올립니다.',
        direction: '왼쪽 ◀ ▶ 오른쪽',
        motion: 'motion-left-right',
        voiceText: '하체운동입니다. 무릎을 들고 발목을 천천히 돌려주세요.'
      },
      {
        start: 480,
        end: 540,
        timeLabel: '8:00 ~ 9:00',
        title: '리듬운동 (1분)',
        primaryText: '음악에 맞춰 오른손 ➔ 왼손, 오른발 ➔ 왼발 천천히 움직여요.',
        secondaryText: '경쾌한 박자에 맞춰 즐겁게 움직입니다.',
        direction: '오른쪽 ➔ 왼쪽 리듬',
        motion: 'motion-left-right',
        voiceText: '음악에 맞추어 오른손, 왼손, 오른발, 왼발을 천천히 움직여 봅니다.'
      },
      {
        start: 540,
        end: 600,
        timeLabel: '9:00 ~ 10:00',
        title: '정리운동 (1분)',
        primaryText: '깊은 호흡과 함께 전신 스트레칭으로 마무리합니다.',
        secondaryText: '"오늘도 콩이와 함께 건강해졌어요!"',
        direction: '깊은 호흡과 이완',
        motion: 'motion-breathing',
        voiceText: '수고하셨습니다. 깊은 호흡과 함께 몸을 편안하게 정리합니다.'
      }
    ]
  },
  20: {
    title: '20분 함께 운동',
    totalSeconds: 1200,
    steps: [
      {
        start: 0,
        end: 180,
        timeLabel: '0:00 ~ 3:00',
        title: '1단계 준비운동 (3분)',
        primaryText: '깊은 호흡, 목, 어깨, 손목, 손가락을 고루 풀어줍니다.',
        secondaryText: '바른 자세로 앉아 천천히 관절을 이완합니다.',
        direction: '양쪽 함께 천천히',
        motion: 'motion-breathing',
        voiceText: '1단계 준비운동입니다. 호흡과 관절을 부드럽게 이완해 주세요.'
      },
      {
        start: 180,
        end: 480,
        timeLabel: '3:00 ~ 8:00',
        title: '2단계 상체운동 (5분)',
        primaryText: '양팔 앞으로, 옆으로, 위로 올리고 가슴을 열며 좌우로 뻗어줍니다.',
        secondaryText: '어깨와 등 근육을 시원하게 펴줍니다.',
        direction: '앞으로 ➔ 가슴 열기 ➔ 위로',
        motion: 'motion-arms-up',
        voiceText: '2단계 상체운동입니다. 팔을 뻗고 가슴을 활짝 열어보세요.'
      },
      {
        start: 480,
        end: 780,
        timeLabel: '8:00 ~ 13:00',
        title: '3단계 하체운동 (5분)',
        primaryText: '의자에 앉아 무릎 번갈아 들기, 다리 펴기, 발목·발끝·발뒤꿈치 들기.',
        secondaryText: '무리하지 않고 가능한 범위에서 안전하게 움직입니다.',
        direction: '왼발 ◀ ▶ 오른발',
        motion: 'motion-left-right',
        voiceText: '3단계 하체운동입니다. 의자에 앉은 채로 무릎과 발목을 움직여 봅니다.'
      },
      {
        start: 780,
        end: 1020,
        timeLabel: '13:00 ~ 17:00',
        title: '4단계 리듬운동 (4분)',
        primaryText: '음악에 맞춰 손뼉 치기 ➔ 팔 벌리기 ➔ 무릎 들기 ➔ 좌우 팔 뻗기.',
        secondaryText: '동작을 반복하며 리듬감과 협응력을 기릅니다.',
        direction: '손뼉 ➔ 무릎 ➔ 좌우',
        motion: 'motion-left-right',
        voiceText: '4단계 리듬운동입니다. 음악에 맞춰 손뼉을 치고 팔을 벌려보세요.'
      },
      {
        start: 1020,
        end: 1200,
        timeLabel: '17:00 ~ 20:00',
        title: '5단계 정리운동 (3분)',
        primaryText: '팔을 위로 천천히, 옆으로 내리며 깊은 호흡과 손 흔들기로 마무리.',
        secondaryText: '"수고하셨어요. 오늘도 콩이와 함께 건강한 하루 보내세요."',
        direction: '깊은 심호흡',
        motion: 'motion-breathing',
        voiceText: '수고하셨어요. 오늘도 콩이와 함께 건강한 하루 보내세요.'
      }
    ]
  }
};

// 현재 선택된 코스 상태
MemoryGarden.activeExerciseCourse = 5;
MemoryGarden.exerciseElapsedSec = 0;
MemoryGarden.exerciseStepIndex = 0;
MemoryGarden.exerciseViewMode = 'anim';

/**
 * 콩이 건강체조 코스 시작 (5분 / 10분 / 20분)
 */
function startExerciseCourse(minutes) {
  MemoryGarden.activeExerciseCourse = minutes;
  const courseData = MemoryGarden.exerciseCourses[minutes] || MemoryGarden.exerciseCourses[5];
  MemoryGarden.exerciseElapsedSec = 0;
  MemoryGarden.exerciseStepIndex = -1;
  MemoryGarden.isExercisePaused = false;

  // UI 요소 초기화
  const tagEl = document.getElementById('currentCourseTag');
  if (tagEl) tagEl.textContent = `⏱ ${courseData.title}`;

  const pauseBtn = document.getElementById('btnExercisePauseLarge');
  if (pauseBtn) {
    pauseBtn.innerHTML = '<span>⏸</span><span>잠시 쉬기</span>';
  }

  // 화면을 체조 플레이어로 전환
  switchView('exercise-garden');

  // 첫 번째 스텝 렌더링 및 음성
  checkAndRenderExerciseStep();

  // 인터벌 타이머 시작
  stopExerciseTimer();
  MemoryGarden.exerciseTimer = setInterval(() => {
    if (!MemoryGarden.isExercisePaused) {
      MemoryGarden.exerciseElapsedSec++;
      updateExercisePlayerTick();
    }
  }, 1000);
}

/**
 * 1초마다 실행되는 체조 플레이어 틱
 */
function updateExercisePlayerTick() {
  const courseData = MemoryGarden.exerciseCourses[MemoryGarden.activeExerciseCourse];
  const total = courseData.totalSeconds;
  const elapsed = MemoryGarden.exerciseElapsedSec;
  const remaining = Math.max(0, total - elapsed);

  // 1. 남은 시간 UI 갱신
  const timerEl = document.getElementById('exerciseTimerDisplay');
  if (timerEl) {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    timerEl.textContent = `남은 시간: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // 2. 상단 프로그레스 바 갱신
  const progressEl = document.getElementById('exerciseStepProgress');
  if (progressEl) {
    const percent = Math.min(100, (elapsed / total) * 100);
    progressEl.style.width = `${percent}%`;
  }

  // 3. 현재 구간 스텝 확인 및 렌더링
  checkAndRenderExerciseStep();

  // 4. 시간 종료 시 활동 종료 화면 이동
  if (elapsed >= total) {
    stopExerciseTimer();
    completeActivity(`콩이의 ${courseData.title}`, 'exercise');
  }
}

/**
 * 현재 경과 시간에 맞는 스텝 렌더링
 */
function checkAndRenderExerciseStep() {
  const courseData = MemoryGarden.exerciseCourses[MemoryGarden.activeExerciseCourse];
  const elapsed = MemoryGarden.exerciseElapsedSec;
  
  const stepIdx = courseData.steps.findIndex(s => elapsed >= s.start && elapsed < s.end);
  const currentStep = courseData.steps[stepIdx !== -1 ? stepIdx : courseData.steps.length - 1];

  if (stepIdx !== MemoryGarden.exerciseStepIndex && currentStep) {
    MemoryGarden.exerciseStepIndex = stepIdx;
    renderCurrentExerciseStep(currentStep);
  }
}

/**
 * 스텝 UI 갱신 및 콩이 모션 / 음성 적용
 */
function renderCurrentExerciseStep(step) {
  // 상단 스텝 라벨
  const leadEl = document.getElementById('currentStepNameLead');
  if (leadEl) leadEl.textContent = step.title;

  // 대형 캡션
  const badgeEl = document.getElementById('captionStepBadge');
  const primEl = document.getElementById('captionPrimaryText');
  const secEl = document.getElementById('captionSecondaryText');

  if (badgeEl) badgeEl.textContent = `${step.timeLabel} · ${step.title}`;
  if (primEl) primEl.textContent = step.primaryText;
  if (secEl) secEl.textContent = step.secondaryText;

  // 방향 가이드 배지
  const dirText = document.getElementById('directionText');
  if (dirText) dirText.textContent = step.direction;

  // 콩이 캐릭터 모션 클래스 변경 (시니어 맞춤 느린 호흡 / 좌우 / 팔 뻗기)
  const animImg = document.getElementById('kongiExerciseAnimImg');
  if (animImg) {
    animImg.className = `stage-kongi-character ${step.motion}`;
  }

  // 다정한 콩이 음성 안내
  speakVoicePrompt(step.voiceText);
}

/**
 * 3개 메인 컨트롤 버튼 동작
 */

// 1. 처음부터
function resetCurrentExercise() {
  startExerciseCourse(MemoryGarden.activeExerciseCourse);
  speakVoicePrompt('처음부터 다시 시작합니다. 천천히 따라해 보세요.');
}

// 2. 잠시 쉬기 / 계속하기
function toggleExercisePause() {
  MemoryGarden.isExercisePaused = !MemoryGarden.isExercisePaused;
  const pauseBtn = document.getElementById('btnExercisePauseLarge');
  const animImg = document.getElementById('kongiExerciseAnimImg');
  const video = document.getElementById('exerciseVideoElement');

  if (MemoryGarden.isExercisePaused) {
    if (pauseBtn) pauseBtn.innerHTML = '<span>▶</span><span>계속하기</span>';
    if (animImg) animImg.style.animationPlayState = 'paused';
    if (video) video.pause();
    speakVoicePrompt('잠시 쉬어갑니다. 편안하게 호흡하세요.');
  } else {
    if (pauseBtn) pauseBtn.innerHTML = '<span>⏸</span><span>잠시 쉬기</span>';
    if (animImg) animImg.style.animationPlayState = 'running';
    if (video && MemoryGarden.exerciseViewMode === 'video') video.play();
    speakVoicePrompt('운동을 계속합니다.');
  }
}

// 3. 다음 운동 (다음 스텝으로 점프)
function nextExerciseStep() {
  const courseData = MemoryGarden.exerciseCourses[MemoryGarden.activeExerciseCourse];
  const nextIdx = (MemoryGarden.exerciseStepIndex + 1);

  if (nextIdx < courseData.steps.length) {
    const nextStep = courseData.steps[nextIdx];
    MemoryGarden.exerciseElapsedSec = nextStep.start;
    updateExercisePlayerTick();
  } else {
    stopExerciseTimer();
    completeActivity(`콩이의 ${courseData.title}`, 'exercise');
  }
}

/**
 * 콩이 가이드 모드 vs 실제 영상 모드 전환
 */
function setExerciseViewMode(mode) {
  MemoryGarden.exerciseViewMode = mode;
  const btnAnim = document.getElementById('btnModeAnim');
  const btnVideo = document.getElementById('btnModeVideo');
  const videoEl = document.getElementById('exerciseVideoElement');
  const stageWrap = document.getElementById('kongiCharacterStage');

  if (mode === 'video') {
    if (btnVideo) btnVideo.classList.add('active');
    if (btnAnim) btnAnim.classList.remove('active');
    if (videoEl) {
      videoEl.classList.add('active');
      videoEl.play().catch(() => {});
    }
  } else {
    if (btnAnim) btnAnim.classList.add('active');
    if (btnVideo) btnVideo.classList.remove('active');
    if (videoEl) {
      videoEl.classList.remove('active');
      videoEl.pause();
    }
  }
}

function stopExerciseTimer() {
  if (MemoryGarden.exerciseTimer) {
    clearInterval(MemoryGarden.exerciseTimer);
    MemoryGarden.exerciseTimer = null;
  }
}

/* ==========================================================================
   Activity 2: Cognitive Garden (두뇌정원)
   ========================================================================== */

function resetCognitiveGame() {
  const feedback = document.getElementById('cognitiveFeedback');
  if (feedback) {
    feedback.className = 'cognitive-feedback-box';
    feedback.textContent = '아래 보기에서 맛있는 사과를 찾아보세요.';
  }

  document.querySelectorAll('.cognitive-choice-card').forEach(card => {
    card.classList.remove('correct', 'wrong');
  });
}

function handleCognitiveChoice(isCorrect, element) {
  const feedback = document.getElementById('cognitiveFeedback');
  
  if (isCorrect) {
    element.classList.add('correct');
    feedback.className = 'cognitive-feedback-box correct';
    feedback.textContent = '🌸 참 잘하셨어요! 예쁜 꽃잎이 피어났습니다.';
    speakVoicePrompt('잘하셨어요! 꽃잎이 활짝 피어났습니다.');

    setTimeout(() => {
      completeActivity('나비와 과일 찾기', 'cognitive');
    }, 1800);
  } else {
    element.classList.add('wrong');
    feedback.className = 'cognitive-feedback-box wrong';
    feedback.textContent = '괜찮아요. 다시 한번 찾아볼까요?';
    speakVoicePrompt('괜찮아요. 다시 한번 찾아볼까요?');
  }
}

/* ==========================================================================
   Activity 3: Remembrance Garden (추억정원)
   ========================================================================== */

function updateRemembrancePhoto(index) {
  MemoryGarden.remembrancePhotoIndex = index;
  const photo = MemoryGarden.remembrancePhotos[index];
  if (!photo) return;

  const imgEl = document.getElementById('remembrancePhotoImg');
  const titleEl = document.getElementById('remembrancePhotoTitle');
  
  if (imgEl) imgEl.src = photo.url;
  if (titleEl) titleEl.textContent = photo.title;
}

function answerRemembrance(hasMemory) {
  const text = hasMemory 
    ? '기억해 주셔서 감사해요. 그때의 소중한 이야기를 들려주세요.' 
    : '괜찮습니다. 사진을 함께 바라보는 것만으로도 좋은 시간이에요.';
  speakVoicePrompt(text);

  const nextIdx = (MemoryGarden.remembrancePhotoIndex + 1) % MemoryGarden.remembrancePhotos.length;
  setTimeout(() => {
    if (nextIdx === 0) {
      completeActivity('토리와 옛날 이야기', 'remembrance');
    } else {
      updateRemembrancePhoto(nextIdx);
    }
  }, 1600);
}

/* ==========================================================================
   Activity 4: Music Garden (음악정원)
   ========================================================================== */

function updateMusicDisplay() {
  const track = MemoryGarden.musicTracks[MemoryGarden.musicTrackIndex];
  const titleEl = document.getElementById('musicCurrentTitle');
  const artistEl = document.getElementById('musicCurrentArtist');
  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist;
}

function toggleMusicPlay() {
  MemoryGarden.isMusicPlaying = !MemoryGarden.isMusicPlaying;
  const btn = document.getElementById('btnMusicPlay');
  const turntable = document.getElementById('musicTurntable');

  if (MemoryGarden.isMusicPlaying) {
    if (btn) btn.textContent = '노래 멈춤 ⏸';
    if (turntable) turntable.classList.add('spinning');
    speakVoicePrompt('노래를 들려드립니다.');
  } else {
    if (btn) btn.textContent = '노래 듣기 ▶';
    if (turntable) turntable.classList.remove('spinning');
  }
}

function nextMusicTrack() {
  MemoryGarden.musicTrackIndex = (MemoryGarden.musicTrackIndex + 1) % MemoryGarden.musicTracks.length;
  updateMusicDisplay();
  if (MemoryGarden.isMusicPlaying) {
    speakVoicePrompt(`다음 곡, ${MemoryGarden.musicTracks[MemoryGarden.musicTrackIndex].title}입니다.`);
  }
}

/* ==========================================================================
   Activity Finish Screen (활동 종료 화면)
   ========================================================================== */

function completeActivity(activityTitle, type) {
  const finishChar = document.getElementById('finishCharacterImg');
  const finishMsg = document.getElementById('finishActivityTitle');

  if (finishMsg) finishMsg.textContent = `${activityTitle} 활동 완료!`;
  
  if (finishChar) {
    if (type === 'exercise') finishChar.src = 'assets/images/friend-kongi.png';
    else if (type === 'cognitive') finishChar.src = 'assets/images/friend-nabi.png';
    else if (type === 'remembrance') finishChar.src = 'assets/images/friend-tori.png';
    else finishChar.src = 'assets/images/friend-bori.png';
  }

  speakVoicePrompt('오늘도 정말 잘하셨어요. 기억정원에 건강한 꽃이 한 송이 피어났습니다.');
  switchView('activity-finish');
}

/* ==========================================================================
   Garden Tour: Landmark Click Interaction
   ========================================================================== */

function openLandmarkInfo(landmarkKey) {
  const landmarks = {
    'plaza': { title: '기억정원 중앙광장', desc: '어르신들과 친구들이 모여 체조와 축제를 즐기는 따뜻한 만남의 광장입니다.' },
    'shelter': { title: '라일락 마을 쉼터', desc: '은은한 라일락 향기와 함께 따뜻한 차 한 잔을 마시며 담소를 나누는 공간입니다.' },
    'kongi-house': { title: '콩이의 운동 집', desc: '활기차고 긍정적인 콩이와 함께 매일 건강한 체조와 스트레칭을 하는 공간입니다.' },
    'nabi-house': { title: '나비의 지혜 집', desc: '차분하고 친절한 나비와 함께 재미있는 퀴즈와 두뇌 퍼즐을 풀어보는 배움터입니다.' },
    'tori-house': { title: '토리의 이야기 집', desc: '다정한 토리와 함께 정겨운 옛 사진을 보며 따스한 추억을 나누는 공간입니다.' },
    'bori-house': { title: '곰이의 음악 쉼터', desc: '편안하고 따뜻한 곰이와 함께 흥겨운 추억의 가요를 부르고 노래를 감상합니다.' },
    'garden-field': { title: '행복 텃밭', desc: '어르신들이 함께 싱그러운 채소와 꽃을 가꾸는 향후 확장 예정 공간입니다.' }
  };

  const landmark = landmarks[landmarkKey];
  if (!landmark) return;

  speakVoicePrompt(`${landmark.title}입니다.`);
  alert(`[${landmark.title}]\n\n${landmark.desc}\n\n(향후 라일락 마을 인터랙티브 메타버스 공간으로 확장될 예정입니다.)`);
}

/* ==========================================================================
   Social Worker Care Dashboard (기억정원 Care)
   ========================================================================== */

function renderCareDashboard() {
  // Render Tab Navigation handlers
  document.querySelectorAll('.care-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.care-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabKey = btn.getAttribute('data-tab');
      
      document.querySelectorAll('.care-tab-content').forEach(c => c.style.display = 'none');
      const target = document.getElementById(`careTab-${tabKey}`);
      if (target) target.style.display = 'block';
    });
  });
}

function handleCareFlowStep(stepNumber) {
  document.querySelectorAll('.flow-step-item').forEach((step, idx) => {
    if (idx + 1 < stepNumber) {
      step.className = 'flow-step-item completed';
    } else if (idx + 1 === stepNumber) {
      step.className = 'flow-step-item active';
    } else {
      step.className = 'flow-step-item';
    }
  });

  const flowMsg = document.getElementById('careFlowMessage');
  const stepTitles = [
    '1단계: 대상자 선택 완료 (김순자 어르신)',
    '2단계: 프로그램 선택 완료 (콩이와 의자 체조)',
    '3단계: 수업 시작 및 세션 진행',
    '4단계: 활동 종료 및 데이터 수집',
    '5단계: 어르신 참여도 평가 (적극적)',
    '6단계: 신체 및 표정 반응 체크 (밝은 미소)',
    '7단계: 특이사항 메모 작성 중',
    '8단계: 수업일지 안전하게 저장 완료!'
  ];
  if (flowMsg) flowMsg.textContent = stepTitles[stepNumber - 1];

  if (stepNumber === 8) {
    alert('사회복지사 수업일지가 안전하게 저장되었습니다.\n향후 AI 수업일지 자동생성 기능과 연계될 준비가 완료되었습니다.');
  }
}

/* ==========================================================================
   Admin Dashboard (기억정원 Admin)
   ========================================================================== */

function renderAdminDashboard() {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabKey = btn.getAttribute('data-admin-tab');
      
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      const target = document.getElementById(`adminTab-${tabKey}`);
      if (target) target.style.display = 'block';
    });
  });
}
