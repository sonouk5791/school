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
      targetView: 'exercise-garden',
      voiceText: '콩이와 함께 몸을 움직여 볼까요?',
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
    if (role === 'senior' && (viewName.startsWith('senior') || ['today-activities', 'exercise-garden', 'cognitive-garden', 'remembrance-garden', 'music-garden', 'activity-finish', 'garden-tour'].includes(viewName))) {
      b.classList.add('active');
    } else if (role === 'care' && viewName.startsWith('care')) {
      b.classList.add('active');
    } else if (role === 'admin' && viewName.startsWith('admin')) {
      b.classList.add('active');
    }
  });

  // View-specific initializations
  if (viewName === 'exercise-garden') {
    startExerciseTimer();
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
   Activity 1: Exercise Garden (운동정원)
   ========================================================================== */

function startExerciseTimer() {
  stopExerciseTimer();
  MemoryGarden.exerciseSeconds = 300; // 5 min
  MemoryGarden.isExercisePaused = false;
  updateExerciseTimerUI();

  MemoryGarden.exerciseTimer = setInterval(() => {
    if (!MemoryGarden.isExercisePaused && MemoryGarden.exerciseSeconds > 0) {
      MemoryGarden.exerciseSeconds--;
      updateExerciseTimerUI();
    } else if (MemoryGarden.exerciseSeconds <= 0) {
      stopExerciseTimer();
      completeActivity('콩이와 의자 체조', 'exercise');
    }
  }, 1000);
}

function stopExerciseTimer() {
  if (MemoryGarden.exerciseTimer) {
    clearInterval(MemoryGarden.exerciseTimer);
    MemoryGarden.exerciseTimer = null;
  }
}

function toggleExercisePause() {
  MemoryGarden.isExercisePaused = !MemoryGarden.isExercisePaused;
  const btn = document.getElementById('btnExercisePause');
  if (btn) {
    btn.textContent = MemoryGarden.isExercisePaused ? '계속하기' : '잠시 쉬기';
    btn.style.background = MemoryGarden.isExercisePaused ? '#386641' : '';
    btn.style.color = MemoryGarden.isExercisePaused ? '#FFFFFF' : '';
  }
}

function resetExercise() {
  MemoryGarden.exerciseSeconds = 300;
  MemoryGarden.isExercisePaused = false;
  updateExerciseTimerUI();
  const btn = document.getElementById('btnExercisePause');
  if (btn) btn.textContent = '잠시 쉬기';
}

function setExerciseDuration(minutes) {
  document.querySelectorAll('.btn-duration').forEach(b => b.classList.remove('active'));
  const targetBtn = document.getElementById(`btnDuration${minutes}`);
  if (targetBtn) targetBtn.classList.add('active');

  MemoryGarden.exerciseSeconds = minutes * 60;
  updateExerciseTimerUI();
  speakVoicePrompt(`운동 시간을 ${minutes}분으로 설정했습니다.`);
}

function updateExerciseTimerUI() {
  const timerEl = document.getElementById('exerciseTimerDisplay');
  if (!timerEl) return;
  const mins = Math.floor(MemoryGarden.exerciseSeconds / 60);
  const secs = MemoryGarden.exerciseSeconds % 60;
  timerEl.textContent = `남은 시간: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
