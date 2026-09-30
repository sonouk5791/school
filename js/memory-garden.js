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
  } else if (viewName === 'exercise-garden') {
    if (!MemoryGarden.exerciseTimer) {
      startExerciseCourse(MemoryGarden.activeExerciseCourse || 5);
    }
  } else {
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
   Activity 1: 콩이 건강체조 16:9 다이내믹 플레이어 엔진 (Kongi 16:9 Engine)
   각 동작이 3~8초 간격으로 살아 움직이듯 부드럽게 자동 전환
   ========================================================================== */

// 3~8초 단위의 생생한 동작 타임라인 데이터
MemoryGarden.exerciseCourses = {
  5: {
    title: '5분 가볍게',
    totalSeconds: 300,
    actions: [
      { start: 0, end: 6, stage: '1단계: 콩이 인사', label: '동작 1/20', primary: '"안녕하세요! 콩이와 함께 가볍게 몸을 움직여 볼까요?"', secondary: '의자에 등을 편안히 기대고 바른 자세로 앉아주세요.', dir: '양쪽 함께 천천히', motion: 'motion-breathing', voice: '안녕하세요. 콩이와 함께 가볍게 몸을 움직여 볼까요?' },
      { start: 6, end: 12, stage: '1단계: 콩이 인사', label: '동작 2/20', primary: '손을 가볍게 무릎 위에 올리고 편안하게 호흡합니다.', secondary: '무리하지 않고 내 몸에 맞춰 천천히 따라합니다.', dir: '바른 자세', motion: 'motion-breathing' },
      { start: 12, end: 20, stage: '1단계: 콩이 인사', label: '동작 3/20', primary: '콩이가 손을 반갑게 흔들어요. 기분 좋게 시작해 볼까요?', secondary: '오늘도 건강하고 활기찬 하루를 만듭니다.', dir: '손 흔들기 👏', motion: 'motion-left-right', voice: '오늘도 건강하게 시작해 볼까요?' },
      
      { start: 20, end: 28, stage: '2단계: 천천히 호흡하기', label: '동작 4/20', primary: '양팔을 옆에서 천천히 위로 올려보세요.', secondary: '가슴을 활짝 펴면서 천천히 올립니다.', dir: '양팔 위로 ⇪', motion: 'motion-arms-up', voice: '양팔을 옆에서 천천히 위로 올려보세요.' },
      { start: 28, end: 36, stage: '2단계: 천천히 호흡하기', label: '동작 5/20', primary: '코로 맑은 공기를 깊~게 들이마십니다.', secondary: '배가 볼록해지도록 깊은 숨을 쉽니다.', dir: '숨 들이마시기 ⇪', motion: 'motion-arms-up' },
      { start: 36, end: 48, stage: '2단계: 천천히 호흡하기', label: '동작 6/20', primary: '입으로 후- 내쉬며 팔을 천천히 내립니다.', secondary: '몸의 긴장이 사르르 풀리도록 부드럽게 내립니다.', dir: '숨 내쉬기 ⇩', motion: 'motion-breathing', voice: '천천히 숨을 내쉬며 팔을 내립니다.' },
      { start: 48, end: 60, stage: '2단계: 천천히 호흡하기', label: '동작 7/20', primary: '한 번 더 깊게 들이마시고... 천천히 내쉽니다.', secondary: '마음까지 차분하고 편안해집니다.', dir: '심호흡 ↔', motion: 'motion-arms-up' },

      { start: 60, end: 75, stage: '3단계: 목과 어깨 운동', label: '동작 8/20', primary: '고개를 왼쪽으로 천천히 돌려보세요.', secondary: '목 옆선이 시원하게 늘어납니다.', dir: '◀ 왼쪽 천천히', motion: 'motion-left-right', voice: '고개를 왼쪽으로 천천히 돌려보세요.' },
      { start: 75, end: 90, stage: '3단계: 목과 어깨 운동', label: '동작 9/20', primary: '이번엔 오른쪽으로 천천히 돌려보세요.', secondary: '무리하게 꺾지 않고 편안한 곳까지만 돌립니다.', dir: '오른쪽 천천히 ▶', motion: 'motion-left-right', voice: '이번엔 오른쪽으로 천천히 돌려봅니다.' },
      { start: 90, end: 105, stage: '3단계: 목과 어깨 운동', label: '동작 10/20', primary: '어깨를 귀 가까이 으쓱~ 올려보세요!', secondary: '어깨에 힘을 주며 천천히 올립니다.', dir: '어깨 으쓱 ⇪', motion: 'motion-arms-up', voice: '어깨를 으쓱 올려보세요.' },
      { start: 105, end: 120, stage: '3단계: 목과 어깨 운동', label: '동작 11/20', primary: '툭- 내려놓고, 어깨를 뒤로 천천히 돌려줍니다.', secondary: '어깨 뭉친 곳이 시원하게 풀립니다.', dir: '어깨 돌리기 ↻', motion: 'motion-left-right', voice: '어깨를 뒤로 부드럽게 돌려줍니다.' },

      { start: 120, end: 140, stage: '4단계: 팔 운동', label: '동작 12/20', primary: '두 팔을 앞으로 시원하게 쭉 뻗어보세요.', secondary: '손가락 끝까지 활짝 펴며 뻗습니다.', dir: '앞으로 뻗기 ➔', motion: 'motion-arms-up', voice: '두 팔을 앞으로 시원하게 쭉 뻗어보세요.' },
      { start: 140, end: 160, stage: '4단계: 팔 운동', label: '동작 13/20', primary: '양팔을 넓게 벌려 가슴을 활짝 펴주세요.', secondary: '가슴 속까지 시원하게 열립니다.', dir: '가슴 활짝 ↔', motion: 'motion-breathing', voice: '양팔을 넓게 벌려 가슴을 펴보세요.' },
      { start: 160, end: 180, stage: '4단계: 팔 운동', label: '동작 14/20', primary: '두 팔을 머리 위로 높이 올려 스트레칭합니다.', secondary: '시원하게 기지개를 켜듯 쭉 뻗어보세요.', dir: '양팔 만세 ⇪', motion: 'motion-arms-up', voice: '팔을 위로 올려 시원하게 펴줍니다.' },

      { start: 180, end: 200, stage: '5단계: 다리 운동', label: '동작 15/20', primary: '의자에 앉은 상태로 왼쪽 무릎을 가볍게 들어 올립니다.', secondary: '허벅지에 기분 좋은 힘이 들어갑니다.', dir: '◀ 왼쪽 무릎 들기', motion: 'motion-leg-lift', voice: '왼쪽 무릎을 가볍게 들어 올려봅니다.' },
      { start: 200, end: 220, stage: '5단계: 다리 운동', label: '동작 16/20', primary: '이번엔 오른쪽 무릎을 가볍게 들어 올립니다.', secondary: '양쪽 다리를 번갈아 천천히 움직입니다.', dir: '오른쪽 무릎 들기 ▶', motion: 'motion-leg-lift', voice: '오른쪽 무릎도 천천히 들어 올려보세요.' },
      { start: 220, end: 240, stage: '5단계: 다리 운동', label: '동작 17/20', primary: '발목을 까닥까닥 움직이고 발끝을 당겨줍니다.', secondary: '종아리와 발목이 부드럽고 가벼워집니다.', dir: '발목 까닥까닥 ↔', motion: 'motion-left-right', voice: '발목을 까닥까닥 움직여 보세요.' },

      { start: 240, end: 260, stage: '6단계: 정리운동', label: '동작 18/20', primary: '천천히 팔을 올리며 온몸의 힘을 편안히 뺍니다.', secondary: '온몸의 순환을 느끼며 깊게 호흡합니다.', dir: '온몸 이완', motion: 'motion-breathing', voice: '팔을 천천히 올리며 온몸의 힘을 뺍니다.' },
      { start: 260, end: 280, stage: '6단계: 정리운동', label: '동작 19/20', primary: '깊게 숨을 들이마시고... 편안하게 내쉽니다.', secondary: '몸과 마음이 한결 가볍고 상쾌해졌어요.', dir: '깊은 숨', motion: 'motion-breathing' },
      { start: 280, end: 300, stage: '6단계: 정리운동', label: '동작 20/20', primary: '손을 흔들며 마무리합니다. 오늘도 참 잘하셨어요!', secondary: '"콩이와 함께한 오늘, 몸도 마음도 튼튼해졌어요."', dir: '손 흔들며 마무리 👏', motion: 'motion-breathing', voice: '오늘도 정말 잘하셨어요. 참 잘하셨습니다.' }
    ]
  },
  10: {
    title: '10분 건강체조',
    totalSeconds: 600,
    actions: [
      { start: 0, end: 60, stage: '준비운동 (2분)', label: '호흡 풀기', primary: '의자에 앉아 깊은 호흡으로 몸과 마음을 이완합니다.', secondary: '코로 들이마시고 입으로 천천히 내쉽니다.', dir: '깊은 호흡', motion: 'motion-breathing', voice: '준비운동입니다. 호흡을 천천히 가다듬어 보세요.' },
      { start: 60, end: 120, stage: '준비운동 (2분)', label: '목·어깨·손목', primary: '목을 좌우로, 손목을 부드럽게 돌려줍니다.', secondary: '관절을 부드럽게 깨워줍니다.', dir: '관절 이완 ↔', motion: 'motion-left-right' },
      { start: 120, end: 210, stage: '상체운동 (3분)', label: '팔 앞·옆·위', primary: '팔을 앞으로 뻗고, 양옆으로 벌리고, 위로 올려줍니다.', secondary: '가슴과 등을 활짝 펴주세요.', dir: '앞 ➔ 옆 ➔ 위', motion: 'motion-arms-up', voice: '상체운동입니다. 팔을 시원하게 뻗어보세요.' },
      { start: 210, end: 300, stage: '상체운동 (3분)', label: '팔꿈치 & 손가락', primary: '팔꿈치를 굽혔다 펴며 손가락을 쥐었다 펴보세요.', secondary: '손가락을 잼잼 움직여 두뇌와 순환을 자극합니다.', dir: '손가락 잼잼 ✊', motion: 'motion-breathing' },
      { start: 300, end: 390, stage: '하체운동 (3분)', label: '무릎 들기', primary: '의자에 앉아 무릎을 번갈아 들어 올립니다.', secondary: '허벅지와 아랫배에 힘을 줍니다.', dir: '무릎 번갈아 ⇪', motion: 'motion-leg-lift', voice: '하체운동입니다. 무릎을 천천히 들어 올려보세요.' },
      { start: 390, end: 480, stage: '하체운동 (3분)', label: '다리 펴기 & 발목', primary: '다리를 앞으로 펴고 발목을 둥글게 돌려줍니다.', secondary: '발끝을 몸쪽으로 당겨 종아리를 늘려줍니다.', dir: '발목 돌리기 ↻', motion: 'motion-left-right' },
      { start: 480, end: 540, stage: '리듬운동 (1분)', label: '교대 리듬', primary: '음악에 맞춰 오른손 ➔ 왼손, 오른발 ➔ 왼발 움직여요.', secondary: '경쾌한 리듬에 맞춰 즐겁게 박수칩니다.', dir: '오른쪽 ➔ 왼쪽 리듬 🎵', motion: 'motion-left-right', voice: '음악에 맞추어 오른손, 왼손, 발을 천천히 움직입니다.' },
      { start: 540, end: 600, stage: '정리운동 (1분)', label: '전신 이완', primary: '깊은 호흡과 함께 전신 스트레칭으로 마무리합니다.', secondary: '"오늘도 콩이와 함께 10분 건강체조 성공!"', dir: '심호흡과 마무리 👏', motion: 'motion-breathing', voice: '수고하셨습니다. 오늘도 정말 훌륭하게 마치셨어요.' }
    ]
  },
  20: {
    title: '20분 함께 운동',
    totalSeconds: 1200,
    actions: [
      { start: 0, end: 180, stage: '1단계: 준비운동 (3분)', label: '전신 관절 풀기', primary: '깊은 호흡과 함께 목, 어깨, 손목, 손가락을 풉니다.', secondary: '온몸의 긴장을 풀고 편안한 호흡을 유지합니다.', dir: '양쪽 함께 천천히', motion: 'motion-breathing', voice: '1단계 준비운동입니다. 관절을 부드럽게 이완합니다.' },
      { start: 180, end: 480, stage: '2단계: 상체운동 (5분)', label: '가슴 열기 & 상체 활력', primary: '양팔을 앞으로, 옆으로, 위로 올리고 가슴을 활짝 엽니다.', secondary: '어깨와 등 근육을 시원하게 스트레칭합니다.', dir: '앞으로 ➔ 가슴 열기 ➔ 위로', motion: 'motion-arms-up', voice: '2단계 상체운동입니다. 팔을 뻗고 가슴을 활짝 열어보세요.' },
      { start: 480, end: 780, stage: '3단계: 하체운동 (5분)', label: '무릎 & 발목 활력', primary: '의자에 앉아 무릎 번갈아 들기, 발끝과 발뒤꿈치 들기.', secondary: '낙상 걱정 없이 안전하게 다리 근력을 기릅니다.', dir: '왼발 ◀ ▶ 오른발', motion: 'motion-leg-lift', voice: '3단계 하체운동입니다. 무릎과 발목을 천천히 움직여 봅니다.' },
      { start: 780, end: 1020, stage: '4단계: 리듬운동 (4분)', label: '손뼉 & 협응 리듬', primary: '음악에 맞춰 손뼉 치기 ➔ 팔 벌리기 ➔ 무릎 들기 반복.', secondary: '뇌를 자극하며 즐겁게 리듬을 탑니다.', dir: '손뼉 ➔ 무릎 ➔ 좌우 🎵', motion: 'motion-left-right', voice: '4단계 리듬운동입니다. 음악에 맞춰 손뼉을 치고 팔을 벌려보세요.' },
      { start: 1020, end: 1200, stage: '5단계: 정리운동 (3분)', label: '깊은 호흡과 마무리', primary: '팔을 위로 천천히 올리고 깊은 호흡으로 마무리합니다.', secondary: '"수고하셨어요. 오늘도 콩이와 함께 건강한 하루 보내세요."', dir: '깊은 심호흡 👏', motion: 'motion-breathing', voice: '수고하셨어요. 오늘도 콩이와 함께 건강한 하루 보내세요.' }
    ]
  }
};

// 현재 선택된 코스 상태
MemoryGarden.activeExerciseCourse = 5;
MemoryGarden.exerciseElapsedSec = 0;
MemoryGarden.exerciseActionIndex = -1;
MemoryGarden.exerciseViewMode = 'anim';

/**
 * 콩이 건강체조 코스 시작 (5분 / 10분 / 20분)
 */
function startExerciseCourse(minutes) {
  MemoryGarden.activeExerciseCourse = minutes;
  const courseData = MemoryGarden.exerciseCourses[minutes] || MemoryGarden.exerciseCourses[5];
  MemoryGarden.exerciseElapsedSec = 0;
  MemoryGarden.exerciseActionIndex = -1;
  MemoryGarden.isExercisePaused = false;

  // 상단 코스 타이틀 갱신
  const tagEl = document.getElementById('currentCourseTag');
  if (tagEl) tagEl.textContent = `⏱ ${courseData.title}`;

  // 일시정지 버튼 초기화
  const pauseBtn = document.getElementById('btnExercisePauseLarge');
  if (pauseBtn) {
    pauseBtn.innerHTML = '<span>⏸</span><span>일시정지</span>';
  }

  // 16:9 플레이어 화면으로 전환
  switchView('exercise-garden');

  // 첫 번째 동작 즉시 렌더링
  checkAndRenderExerciseAction();

  // 1초 단위 타이머 가동 (매초 경과 및 3~8초 단위 자동 전환)
  stopExerciseTimer();
  MemoryGarden.exerciseTimer = setInterval(() => {
    if (!MemoryGarden.isExercisePaused) {
      MemoryGarden.exerciseElapsedSec++;
      updateExercisePlayerTick();
    }
  }, 1000);
}

/**
 * 1초마다 실행되는 16:9 플레이어 틱 엔진
 */
function updateExercisePlayerTick() {
  const courseData = MemoryGarden.exerciseCourses[MemoryGarden.activeExerciseCourse] || MemoryGarden.exerciseCourses[5];
  const total = courseData.totalSeconds;
  const elapsed = MemoryGarden.exerciseElapsedSec;
  const remaining = Math.max(0, total - elapsed);

  // 1. 남은 시간 UI 갱신 (상단 안전 헤더)
  const timerEl = document.getElementById('exerciseTimerDisplay');
  if (timerEl) {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    timerEl.textContent = `남은 시간: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // 2. 상단 프로그레스 바 부드럽게 전진
  const progressEl = document.getElementById('exerciseStepProgress');
  if (progressEl) {
    const percent = Math.min(100, (elapsed / total) * 100);
    progressEl.style.width = `${percent}%`;
  }

  // 3. 현재 시간에 부합하는 세부 동작 자동 감지 및 렌더링 (3~8초 간격 자동 전환)
  checkAndRenderExerciseAction();

  // 4. 코스 종료 시 축하 화면으로 자연 전환
  if (elapsed >= total) {
    stopExerciseTimer();
    completeActivity(`콩이의 ${courseData.title}`, 'exercise');
  }
}

/**
 * 현재 경과 시간에 부합하는 동작을 찾아 3~8초 단위로 자동 전환
 */
function checkAndRenderExerciseAction() {
  const courseData = MemoryGarden.exerciseCourses[MemoryGarden.activeExerciseCourse] || MemoryGarden.exerciseCourses[5];
  const elapsed = MemoryGarden.exerciseElapsedSec;
  
  // 현재 시간에 해당하는 액션 찾기
  let actionIdx = courseData.actions.findIndex(a => elapsed >= a.start && elapsed < a.end);
  if (actionIdx === -1) {
    actionIdx = courseData.actions.length - 1;
  }

  // 액션이 변경되었을 때 부드럽게 UI 및 모션 갱신
  if (actionIdx !== MemoryGarden.exerciseActionIndex) {
    MemoryGarden.exerciseActionIndex = actionIdx;
    renderCurrentAction(courseData.actions[actionIdx]);
  }
}

/**
 * 동작 UI 갱신 및 콩이 모션 / 방향 / 음성 적용 (부드러운 전환)
 */
function renderCurrentAction(action) {
  if (!action) return;

  // 1. 상단 단계 및 동작명 갱신
  const leadEl = document.getElementById('currentStepNameLead');
  if (leadEl) leadEl.textContent = `${action.stage} · ${action.label}`;

  // 2. 중앙 자막 캡션 (부드러운 페이드)
  const badgeEl = document.getElementById('captionStepBadge');
  const primEl = document.getElementById('captionPrimaryText');
  const secEl = document.getElementById('captionSecondaryText');

  if (badgeEl) badgeEl.textContent = action.label;
  if (primEl) {
    primEl.style.opacity = '0.4';
    primEl.textContent = action.primary;
    setTimeout(() => { primEl.style.opacity = '1'; }, 100);
  }
  if (secEl) secEl.textContent = action.secondary;

  // 3. 방향 가이드 뱃지
  const dirText = document.getElementById('directionText');
  if (dirText) dirText.textContent = action.dir;

  // 4. 콩이 캐릭터 모션 클래스 교체 (생동감 넘치는 움직임)
  const animImg = document.getElementById('kongiExerciseAnimImg');
  if (animImg) {
    animImg.className = `stage-kongi-character ${action.motion}`;
  }

  // 5. 음성 안내가 지정되어 있다면 친절하게 출력
  if (action.voice) {
    speakVoicePrompt(action.voice);
  }
}

/**
 * 3대 컨트롤 버튼: 이전 동작, 일시정지, 다음 동작
 */

// 1. 이전 동작으로 이동
function prevExerciseStep() {
  const courseData = MemoryGarden.exerciseCourses[MemoryGarden.activeExerciseCourse] || MemoryGarden.exerciseCourses[5];
  const currentIdx = MemoryGarden.exerciseActionIndex;
  const prevIdx = Math.max(0, currentIdx - 1);
  const prevAction = courseData.actions[prevIdx];

  if (prevAction) {
    MemoryGarden.exerciseElapsedSec = prevAction.start;
    updateExercisePlayerTick();
  }
}

// 2. 일시정지 / 계속하기
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
    if (pauseBtn) pauseBtn.innerHTML = '<span>⏸</span><span>일시정지</span>';
    if (animImg) animImg.style.animationPlayState = 'running';
    if (video && MemoryGarden.exerciseViewMode === 'video') video.play();
    speakVoicePrompt('운동을 계속합니다.');
  }
}

// 3. 다음 동작으로 즉시 넘어가기
function nextExerciseStep() {
  const courseData = MemoryGarden.exerciseCourses[MemoryGarden.activeExerciseCourse] || MemoryGarden.exerciseCourses[5];
  const currentIdx = MemoryGarden.exerciseActionIndex;
  const nextIdx = currentIdx + 1;

  if (nextIdx < courseData.actions.length) {
    const nextAction = courseData.actions[nextIdx];
    MemoryGarden.exerciseElapsedSec = nextAction.start;
    updateExercisePlayerTick();
  } else {
    stopExerciseTimer();
    completeActivity(`콩이의 ${courseData.title}`, 'exercise');
  }
}

// 4. 처음부터 다시 시작
function resetCurrentExercise() {
  startExerciseCourse(MemoryGarden.activeExerciseCourse || 5);
  speakVoicePrompt('처음부터 다시 시작합니다.');
}

/**
 * 콩이 가이드 모드 vs 실제 영상 모드 전환
 */
function setExerciseViewMode(mode) {
  MemoryGarden.exerciseViewMode = mode;
  const btnAnim = document.getElementById('btnModeAnim');
  const btnVideo = document.getElementById('btnModeVideo');
  const videoEl = document.getElementById('exerciseVideoElement');

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
