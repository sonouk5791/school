/**
 * 「내가 꾸미는 AI 캐릭터 집」 고도화 인터랙티브 시스템 (v3)
 * - 치매·인지저하 어르신 맞춤형 직관적 인터랙션
 * - 4인 캐릭터(콩이, 토리, 나비, 곰이), 원클릭 의상 변경
 * - 6대 방 구조, 9대 가구/소품 카테고리
 * - 쉬운 꾸미기 모드(좌/중/우 자동배치, 기본값) & 자유 꾸미기 모드
 * - 되돌리기(Undo), 저장/이어하기, 칭찬 및 꽃/별 도장 시스템
 * - 음성 안내(TTS) 및 어르신 친화적 접근성 보장
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'senior_character_house_data_v1';
  const STAMPS_KEY = 'senior_stamps_v1';
  const $ = id => document.getElementById(id);

  // --- DATA DEFINITIONS ---
  const CHARACTERS = {
    kongi: {
      id: 'kongi',
      name: '콩이의 집',
      charName: '콩이',
      theme: '운동방',
      avatar: 'assets/images/friend-kongi.png',
      completeImg: 'assets/images/kongi-home-decorating.png',
      color: '#e6a100',
      badge: '🏃 건강한 운동방',
      greeting: '어서 오세요! 오늘은 제 운동방을 어떻게 꾸며볼까요?',
      mission: '노란 꽃이나 운동 기구를 하나 놓아볼까요?',
      reactions: [
        '와, 여기 놓으니까 정말 잘 어울려요!',
        '어르신 덕분에 방이 아주 활기차졌어요!',
        '우와, 정말 멋져요! 감사합니다.'
      ]
    },
    tori: {
      id: 'tori',
      name: '토리의 집',
      charName: '토리',
      theme: '놀이방',
      avatar: 'assets/images/friend-tori.png',
      completeImg: 'assets/images/tori-home-decorating.png',
      color: '#d53f8c',
      badge: '🧸 신나는 놀이방',
      greeting: '반가워요! 오늘은 토리방을 재미있게 꾸며봐요.',
      mission: '토리가 좋아할 폭신한 쿠션이나 장난감을 골라주세요.',
      reactions: [
        '정말 예뻐졌어요! 토리는 너무 좋아요.',
        '알록달록 방이 반짝반짝 빛나요!',
        '어르신 최고예요! 정말 재미있어요.'
      ]
    },
    nabi: {
      id: 'nabi',
      name: '나비의 집',
      charName: '나비',
      theme: '학습방',
      avatar: 'assets/images/friend-nabi.png',
      completeImg: 'assets/images/nabi-home-decorating.png',
      color: '#805ad5',
      badge: '📚 지혜로운 학습방',
      greeting: '잘 오셨어요. 오늘은 어떤 공부방을 만들어볼까요?',
      mission: '책 한 권을 책장에 나란히 꽂아볼까요?',
      reactions: [
        '이 자리가 참 잘 어울려요.',
        '마음이 차분해지고 머리가 맑아져요.',
        '어르신의 따뜻한 손길 덕분에 참 아늑해요.'
      ]
    },
    bori: {
      id: 'bori',
      name: '곰이의 집',
      charName: '곰이',
      theme: '취미방',
      avatar: 'assets/images/friend-bori.png',
      completeImg: 'assets/images/bori-home-decorating.png',
      color: '#2b6cb0',
      badge: '🎵 평온한 취미방',
      greeting: '오늘은 편안하게 좋아하는 음악과 소품으로 방을 꾸며봐요.',
      mission: '편안한 의자나 라디오를 하나 골라주세요.',
      reactions: [
        '아늑해서 마음에 쏙 들어요.',
        '정겨운 옛 노래가 흘러나올 것 같아요.',
        '곰이의 서재가 최고로 멋져졌습니다.'
      ]
    }
  };

  // Wardrobe Options
  const OUTFITS = {
    tops: [
      { id: 'top_sport', name: '편안한 운동복', icon: '🏃', color: '#c8e6c9' },
      { id: 'top_knit', name: '따뜻한 니트', icon: '🧶', color: '#f8bbd0' },
      { id: 'top_cardigan', name: '노란 가디건', icon: '🧥', color: '#fff9c4' },
      { id: 'top_vest', name: '꽃무늬 옷', icon: '👚', color: '#ffe0b2' },
      { id: 'top_shirt', name: '단정한 셔츠', icon: '👔', color: '#bbdefb' }
    ],
    bottoms: [
      { id: 'bot_pants', name: '편안한 바지', icon: '👖', color: '#cfd8dc' },
      { id: 'bot_sport', name: '운동복 바지', icon: '👖', color: '#d7ccc8' },
      { id: 'bot_overall', name: '귀여운 멜빵바지', icon: '👖', color: '#90caf9' },
      { id: 'bot_skirt', name: '화사한 치마', icon: '👗', color: '#f48fb1' }
    ],
    accs: [
      { id: 'acc_hat', name: '멋진 모자', icon: '👒' },
      { id: 'acc_scarf', name: '따뜻한 스카프', icon: '🧣' },
      { id: 'acc_glasses', name: '단정한 안경', icon: '👓' },
      { id: 'acc_bag', name: '작은 손가방', icon: '👜' }
    ]
  };

  // 6 Room Architecture Options
  const ROOM_TYPES = [
    { id: 'room_spacious', name: '구조 1: 넓은 한 개의 방', icon: '🏠', desc: '탁 트인 시원하고 넓은 방' },
    { id: 'room_living', name: '구조 2: 거실 + 작은 방', icon: '🏡', desc: '아늑하게 나뉜 2개 공간' },
    { id: 'room_window', name: '구조 3: 큰 창문이 있는 방', icon: '☀️', desc: '따스한 햇살 가득한 창가 방' },
    { id: 'room_garden', name: '구조 4: 정원이 보이는 방', icon: '🌳', desc: '푸른 나무와 뜰이 보이는 방' },
    { id: 'room_hanok', name: '구조 5: 따뜻한 한옥방', icon: '🏮', desc: '고즈넉하고 정겨운 전통 방' },
    { id: 'room_books', name: '구조 6: 책장이 많은 방', icon: '📚', desc: '지혜와 이야기 가득한 서재' }
  ];

  // Wall, Floor, Window, Door
  const WALL_STYLES = [
    { id: 'w_cream', name: '크림색 벽', icon: '🎨', color: '#faf6eb' },
    { id: 'w_pink', name: '연한 분홍 벽', icon: '🌸', color: '#fdf0f4' },
    { id: 'w_purple', name: '연한 보라 벽', icon: '💜', color: '#f6f0fd' },
    { id: 'w_blue', name: '연한 파랑 벽', icon: '🌊', color: '#f0f6fd' },
    { id: 'w_hanji', name: '전통 한지 벽', icon: '📜', color: '#f5edd6' }
  ];

  const FLOOR_STYLES = [
    { id: 'f_wood_light', name: '밝은 원목 바닥', icon: '🟫', color: '#e8d8be' },
    { id: 'f_wood_warm', name: '따뜻한 원목 바닥', icon: '🟫', color: '#c9a87c' },
    { id: 'f_carpet', name: '밝은 카펫 바닥', icon: '🧶', color: '#f0e6d2' },
    { id: 'f_hanok', name: '전통 한옥 바닥', icon: '🏮', color: '#d9b48f' }
  ];

  // 9 Furniture & Decor Catalogs
  const ITEM_CATALOG = {
    furniture: [
      { id: 'f_chair', name: '편안한 의자', icon: '🪑' },
      { id: 'f_table', name: '나무 테이블', icon: '☕' },
      { id: 'f_bookshelf', name: '원목 책장', icon: '📚' },
      { id: 'f_drawer', name: '서랍 수납장', icon: '🗄️' },
      { id: 'f_sofa', name: '폭신한 소파', icon: '🛋️' }
    ],
    plants: [
      { id: 'p_flower', name: '화사한 꽃화분', icon: '🌷' },
      { id: 'p_sunflower', name: '노란 해바라기', icon: '🌻' },
      { id: 'p_rose', name: '분홍 장미', icon: '🌹' },
      { id: 'p_succulent', name: '초록 다육이', icon: '🌱' },
      { id: 'p_tree', name: '공기정화 화분', icon: '🌿' }
    ],
    toys: [
      { id: 't_teddy', name: '곰 인형', icon: '🧸' },
      { id: 't_horse', name: '목마 장난감', icon: '🎠' },
      { id: 't_blocks', name: '알록달록 블록', icon: '🎨' },
      { id: 't_spinning', name: '추억의 팽이', icon: '🎯' }
    ],
    books: [
      { id: 'b_story', name: '그림 동화책', icon: '📖' },
      { id: 'b_poetry', name: '따뜻한 시집', icon: '📜' },
      { id: 'b_cards', name: '낱말 기억카드', icon: '🎴' }
    ],
    frames: [
      { id: 'pic_family', name: '추억 사진액자', icon: '🖼️' },
      { id: 'pic_flower', name: '풍경 수채화', icon: '🎨' },
      { id: 'pic_clock', name: '벽걸이 괘종시계', icon: '🕰️' }
    ],
    lights: [
      { id: 'l_stand', name: '은은한 스탠드', icon: '💡' },
      { id: 'l_lamp', name: '따뜻한 등롱', icon: '🏮' }
    ],
    cushions: [
      { id: 'c_knit', name: '손뜨개 쿠션', icon: '🛋️' },
      { id: 'c_star', name: '별빛 베개', icon: '⭐' }
    ],
    music: [
      { id: 'm_radio', name: '원목 라디오', icon: '📻' },
      { id: 'm_score', name: '추억의 악보', icon: '🎼' },
      { id: 'm_piano', name: '작은 오르골', icon: '🎹' }
    ],
    exercise: [
      { id: 'e_ball', name: '스트레칭 볼', icon: '⚽' },
      { id: 'e_dumbbell', name: '가벼운 아령', icon: '💪' },
      { id: 'e_mat', name: '운동 매트', icon: '🧘' }
    ]
  };

  // --- STATE ---
  let state = {
    screen: 'select', // 'select' | 'studio'
    currentCharId: 'kongi',
    mode: 'easy', // 'easy' (default) | 'free'
    outfit: { top: 'top_cardigan', bottom: 'bot_pants', acc: 'acc_glasses' },
    roomType: 'room_spacious',
    wallStyle: 'w_cream',
    floorStyle: 'f_wood_light',
    windowStyle: 'win_big',
    doorStyle: 'door_wood',
    placedItems: [], // Array of { uid, id, name, icon, x, y, scale, rot }
    selectedItemUid: null,
    pendingEasyItem: null, // item chosen in easy mode waiting for L/C/R button
    lastUpdated: null
  };

  const historyStack = [];

  function pushHistory() {
    historyStack.push(JSON.stringify({
      outfit: state.outfit,
      roomType: state.roomType,
      wallStyle: state.wallStyle,
      floorStyle: state.floorStyle,
      windowStyle: state.windowStyle,
      doorStyle: state.doorStyle,
      placedItems: state.placedItems
    }));
    if (historyStack.length > 25) historyStack.shift();
  }

  function undoHistory() {
    if (historyStack.length === 0) {
      showToast('처음 상태입니다.');
      speak('더 이상 되돌릴 이전 작업이 없습니다.');
      return;
    }
    const prev = JSON.parse(historyStack.pop());
    state.outfit = prev.outfit;
    state.roomType = prev.roomType;
    state.wallStyle = prev.wallStyle;
    state.floorStyle = prev.floorStyle;
    state.windowStyle = prev.windowStyle;
    state.doorStyle = prev.doorStyle;
    state.placedItems = prev.placedItems;
    state.selectedItemUid = null;
    state.pendingEasyItem = null;
    $('easyPositionBar').hidden = true;
    $('itemController').hidden = true;
    renderCanvas();
    renderToolsPanel();
    showToast('↩ 방금 전으로 되돌렸어요.');
    speak('방금 전으로 되돌렸습니다.');
  }

  // TTS Helper
  function speak(text) {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ko-KR';
      utter.rate = 0.82;
      utter.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.startsWith('ko') && (v.name.includes('Yuna') || v.name.includes('SunHi') || v.name.includes('Heami') || v.name.includes('Korean') || v.name.includes('Google 한국어')));
      if (koVoice) utter.voice = koVoice;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  }

  function showToast(msg) {
    const toast = $('chToast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  }

  // --- STORAGE ---
  function saveToStorage() {
    state.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    showToast('💾 내 집이 안전하게 저장되었어요!');
    speak('어르신이 꾸민 집이 소중하게 저장되었습니다.');
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // Stamp Award System
  function awardStamp() {
    try {
      const current = JSON.parse(localStorage.getItem(STAMPS_KEY) || '[]');
      const newStamp = {
        type: Math.random() > 0.5 ? 'flower' : 'star',
        title: `${CHARACTERS[state.currentCharId].charName}의 방 꾸미기 완료`,
        date: new Date().toISOString()
      };
      current.push(newStamp);
      localStorage.setItem(STAMPS_KEY, JSON.stringify(current));
      $('chStampBadge').textContent = newStamp.type === 'flower' ? '🌸 향긋한 꽃 도장 획득!' : '⭐ 반짝이는 별 도장 획득!';
    } catch (e) {
      console.warn('Stamp storage error:', e);
    }
  }

  // --- RENDER VIEWS ---
  function init() {
    // Ensure all modals are closed initially
    if ($('completeView')) {
      $('completeView').hidden = true;
      $('completeView').style.display = 'none';
    }
    if ($('resetModal')) {
      $('resetModal').hidden = true;
      $('resetModal').style.display = 'none';
    }

    renderCharCards();
    setupGlobalEvents();

    // Check URL parameter (?char=kongi|tori|nabi|bori)
    const urlParams = new URLSearchParams(window.location.search);
    const charParam = urlParams.get('char');
    if (charParam && CHARACTERS[charParam]) {
      selectCharacter(charParam);
      return;
    }

    const saved = loadFromStorage();
    if (saved) {
      $('resumeBanner').hidden = false;
      const charInfo = CHARACTERS[saved.currentCharId] || CHARACTERS.kongi;
      $('resumeCharText').textContent = `지난번에 꾸미던 [${charInfo.charName}의 ${charInfo.theme}]이 저장되어 있어요.`;
    }
  }

  function renderCharCards() {
    const grid = $('charSelectGrid');
    grid.innerHTML = '';

    Object.values(CHARACTERS).forEach(c => {
      const card = document.createElement('article');
      card.className = 'ch-char-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${c.charName}의 ${c.theme} 꾸미기 시작`);
      card.innerHTML = `
        <div class="ch-char-avatar-box">
          <img src="${c.avatar}" alt="${c.charName}" class="ch-char-img">
        </div>
        <div class="ch-char-badge" style="background:${c.color}22; color:${c.color}; border-color:${c.color}44;">
          ${c.badge}
        </div>
        <h2 class="ch-char-name">${c.name}</h2>
        <p class="ch-char-desc">${c.greeting}</p>
        <div class="ch-char-btn" style="background:${c.color};">
          ${c.charName} 방 꾸미기 시작 &gt;
        </div>
      `;

      const startAction = () => selectCharacter(c.id);
      card.addEventListener('click', startAction);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startAction();
        }
      });
      grid.appendChild(card);
    });

    $('chLocationBadge').innerHTML = '지금은 <strong>캐릭터 친구 선택</strong> 화면이에요';
  }

  function goToSelectScreen() {
    state.screen = 'select';
    $('studioScreen').hidden = true;
    $('studioScreen').style.display = 'none';
    $('selectScreen').hidden = false;
    $('selectScreen').style.display = 'block';

    const saved = loadFromStorage();
    if (saved) {
      $('resumeBanner').hidden = false;
      $('resumeBanner').style.display = 'flex';
      const charInfo = CHARACTERS[saved.currentCharId] || CHARACTERS.kongi;
      $('resumeCharText').textContent = `지난번에 꾸미던 [${charInfo.charName}의 ${charInfo.theme}]이 저장되어 있어요.`;
    }

    $('chLocationBadge').innerHTML = '지금은 <strong>캐릭터 친구 선택</strong> 화면이에요';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('🏡 다른 친구의 방도 골라보세요.');
    speak('누구의 집을 꾸며볼까요? 마음에 드는 친구를 선택해주세요.');
  }

  function selectCharacter(charId, resumeData = null) {
    state.currentCharId = charId;
    state.screen = 'studio';

    if (resumeData) {
      state.outfit = resumeData.outfit || state.outfit;
      state.roomType = resumeData.roomType || state.roomType;
      state.wallStyle = resumeData.wallStyle || state.wallStyle;
      state.floorStyle = resumeData.floorStyle || state.floorStyle;
      state.windowStyle = resumeData.windowStyle || state.windowStyle;
      state.doorStyle = resumeData.doorStyle || state.doorStyle;
      state.placedItems = resumeData.placedItems || [];
    } else {
      // Default initialization
      state.placedItems = [];
      state.selectedItemUid = null;
      state.pendingEasyItem = null;
    }

    pushHistory();

    $('selectScreen').hidden = true;
    $('selectScreen').style.display = 'none';
    $('resumeBanner').hidden = true;
    $('resumeBanner').style.display = 'none';
    $('studioScreen').hidden = false;
    $('studioScreen').style.display = 'block';

    const charInfo = CHARACTERS[charId];
    $('stageTitle').textContent = `🏡 ${charInfo.name} (${charInfo.theme})`;
    $('stageTitle').style.color = charInfo.color;
    $('speechName').textContent = `${charInfo.charName}의 한마디`;
    $('speechMsg').textContent = charInfo.greeting;
    $('speechAvatar').textContent = charId === 'kongi' ? '🐶' : charId === 'tori' ? '🐰' : charId === 'nabi' ? '🐱' : '🐻';
    $('charAvatar').src = charInfo.avatar;
    $('missionText').textContent = charInfo.mission;

    if ($('missionSuccessBadge')) $('missionSuccessBadge').hidden = true;
    if ($('itemToolbar')) $('itemToolbar').hidden = true;

    $('chLocationBadge').innerHTML = `지금은 <strong>${charInfo.charName}의 방</strong>을 꾸미고 있어요`;

    renderCanvas();
    renderToolsPanel('outfit');

    speak(`${charInfo.charName}의 방에 오신 것을 환영합니다. ${charInfo.greeting}`);
  }

  // --- CANVAS & STAGE RENDERING ---
  function renderCanvas() {
    const wall = $('roomWall');
    const floor = $('roomFloor');
    const windowEl = $('windowElem');
    const doorEl = $('doorElem');
    const charWrap = $('charAvatarWrap');
    const badge = $('avatarOutfitBadge');

    // Wall Color
    const wInfo = WALL_STYLES.find(w => w.id === state.wallStyle) || WALL_STYLES[0];
    wall.style.backgroundColor = wInfo.color;

    // Floor Color
    const fInfo = FLOOR_STYLES.find(f => f.id === state.floorStyle) || FLOOR_STYLES[0];
    floor.style.backgroundColor = fInfo.color;

    // Window Emojis & Styling
    if (state.roomType === 'room_garden') {
      windowEl.textContent = '🌳';
    } else if (state.roomType === 'room_hanok') {
      windowEl.textContent = '🏮';
    } else if (state.roomType === 'room_books') {
      windowEl.textContent = '📚';
    } else {
      windowEl.textContent = '☀️';
    }

    // Outfit Badge
    const topObj = OUTFITS.tops.find(t => t.id === state.outfit.top);
    const botObj = OUTFITS.bottoms.find(b => b.id === state.outfit.bottom);
    const accObj = OUTFITS.accs.find(a => a.id === state.outfit.acc);

    const outfitParts = [];
    if (topObj) outfitParts.push(topObj.name);
    if (botObj) outfitParts.push(botObj.name);
    if (accObj) outfitParts.push(accObj.name);

    badge.textContent = outfitParts.join(' · ') || '기본 평상복';

    // Placed Items
    const itemsLayer = $('itemsLayer');
    itemsLayer.innerHTML = '';

    state.placedItems.forEach(item => {
      const el = document.createElement('div');
      el.className = `ch-placed-item ${state.selectedItemUid === item.uid ? 'selected' : ''}`;
      el.dataset.uid = item.uid;
      el.style.left = `${item.x}%`;
      el.style.top = `${item.y}%`;
      el.style.transform = `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rot}deg)`;
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', `${item.name}, 선택하여 위치 이동`);

      el.innerHTML = `
        <span class="ch-placed-icon">${item.icon}</span>
        <span class="ch-placed-label">${item.name}</span>
      `;

      el.addEventListener('click', e => {
        e.stopPropagation();
        selectItemOnCanvas(item.uid);
      });

      // Drag in free mode
      setupItemDrag(el, item);

      itemsLayer.appendChild(el);
    });
  }

  function setupItemDrag(elem, item) {
    let isDragging = false;
    let startX = 0, startY = 0;

    const onStart = e => {
      isDragging = true;
      const evt = e.touches ? e.touches[0] : e;
      startX = evt.clientX;
      startY = evt.clientY;
      selectItemOnCanvas(item.uid);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    };

    const onMove = e => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      const evt = e.touches ? e.touches[0] : e;
      const dx = evt.clientX - startX;
      const dy = evt.clientY - startY;
      startX = evt.clientX;
      startY = evt.clientY;

      const viewport = $('roomViewport');
      const rect = viewport.getBoundingClientRect();
      const pctX = (dx / rect.width) * 100;
      const pctY = (dy / rect.height) * 100;

      item.x = Math.max(8, Math.min(92, item.x + pctX));
      item.y = Math.max(12, Math.min(88, item.y + pctY));

      elem.style.left = `${item.x}%`;
      elem.style.top = `${item.y}%`;
    };

    const onEnd = () => {
      if (isDragging) {
        isDragging = false;
        pushHistory();
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };

    elem.addEventListener('mousedown', onStart);
    elem.addEventListener('touchstart', onStart, { passive: false });
  }

  // --- TOOLS PANEL & CATEGORY RENDERING ---
  let currentCategory = 'outfit';

  function renderToolsPanel(cat = currentCategory) {
    currentCategory = cat;

    // Update Category Menu buttons
    document.querySelectorAll('.ch-cat-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === cat);
    });

    const grid = $('optionsGrid');
    grid.innerHTML = '';
    const title = $('optionsTitle');

    if (cat === 'outfit') {
      title.textContent = '👕 콩이의 예쁜 옷을 골라보세요';
      renderOutfitOptions(grid);
    } else if (cat === 'room') {
      title.textContent = '🏠 방 구조와 벽·바닥을 골라보세요';
      renderRoomOptions(grid);
    } else if (cat === 'furniture') {
      title.textContent = '🪑 편안한 가구를 골라 방에 놓아보세요';
      renderCatalogOptions(grid, [
        { id: 'f_bed', name: '포근한 침대', icon: '🛏️' },
        ...ITEM_CATALOG.furniture
      ]);
    } else if (cat === 'decor') {
      title.textContent = '🌷 꽃과 소품으로 방을 화사하게 꾸며보세요';
      const decorItems = [
        ...ITEM_CATALOG.plants,
        ...ITEM_CATALOG.frames,
        ...ITEM_CATALOG.lights,
        ...ITEM_CATALOG.cushions
      ];
      renderCatalogOptions(grid, decorItems);
    } else if (cat === 'play') {
      title.textContent = '🧸 재미있는 놀이와 음악, 운동 소품';
      const playItems = [
        ...ITEM_CATALOG.toys,
        ...ITEM_CATALOG.music,
        ...ITEM_CATALOG.exercise,
        ...ITEM_CATALOG.books
      ];
      renderCatalogOptions(grid, playItems);
    }
  }

  function renderOutfitOptions(grid) {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '14px';
    wrap.style.width = '100%';

    const makeSection = (secTitle, items, field) => {
      const sec = document.createElement('div');
      sec.innerHTML = `<h4 style="font-size:18px; font-weight:800; color:#5d4037; margin-bottom:8px;">${secTitle}</h4>`;
      const itemGrid = document.createElement('div');
      itemGrid.className = 'ch-options-grid';

      items.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `ch-opt-card ${state.outfit[field] === item.id ? 'selected' : ''}`;
        btn.innerHTML = `
          <div class="ch-opt-icon">${item.icon}</div>
          <div class="ch-opt-name">${item.name}</div>
        `;
        btn.addEventListener('click', () => {
          pushHistory();
          state.outfit[field] = item.id;
          renderCanvas();
          renderToolsPanel('outfit');
          showToast(`✨ [${item.name}]으로 입혔어요!`);
          speak(`콩이에게 ${item.name}을 입혔습니다.`);
          $('speechMsg').textContent = `어르신, ${item.name}이 참 따뜻하고 멋져요!`;
        });
        itemGrid.appendChild(btn);
      });

      sec.appendChild(itemGrid);
      return sec;
    };

    wrap.appendChild(makeSection('상의 (옷)', OUTFITS.tops, 'top'));
    wrap.appendChild(makeSection('하의 (바지/치마)', OUTFITS.bottoms, 'bottom'));
    wrap.appendChild(makeSection('소품 및 장신구', OUTFITS.accs, 'acc'));
    grid.appendChild(wrap);
  }

  function renderRoomOptions(grid) {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '16px';
    wrap.style.width = '100%';

    // 1. Structure
    const structSec = document.createElement('div');
    structSec.innerHTML = `<h4 style="font-size:18px; font-weight:800; color:#5d4037; margin-bottom:8px;">방 구조 선택</h4>`;
    const structGrid = document.createElement('div');
    structGrid.className = 'ch-options-grid';
    ROOM_TYPES.forEach(r => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `ch-opt-card ${state.roomType === r.id ? 'selected' : ''}`;
      btn.innerHTML = `
        <div class="ch-opt-icon">${r.icon}</div>
        <div class="ch-opt-name">${r.name}</div>
      `;
      btn.addEventListener('click', () => {
        pushHistory();
        state.roomType = r.id;
        renderCanvas();
        renderToolsPanel('room');
        showToast(`🏠 [${r.name}] 구조로 변경했어요!`);
        speak(`${r.name} 구조로 변경되었습니다.`);
      });
      structGrid.appendChild(btn);
    });
    structSec.appendChild(structGrid);
    wrap.appendChild(structSec);

    // 2. Walls
    const wallSec = document.createElement('div');
    wallSec.innerHTML = `<h4 style="font-size:18px; font-weight:800; color:#5d4037; margin-bottom:8px;">벽지 색상</h4>`;
    const wallGrid = document.createElement('div');
    wallGrid.className = 'ch-options-grid';
    WALL_STYLES.forEach(w => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `ch-opt-card ${state.wallStyle === w.id ? 'selected' : ''}`;
      btn.innerHTML = `
        <div class="ch-opt-icon" style="background:${w.color}; width:36px; height:36px; border-radius:10px; border:2px solid #ccc; margin:0 auto 4px;"></div>
        <div class="ch-opt-name">${w.name}</div>
      `;
      btn.addEventListener('click', () => {
        pushHistory();
        state.wallStyle = w.id;
        renderCanvas();
        renderToolsPanel('room');
        showToast(`🎨 [${w.name}]로 벽지를 바꿨어요!`);
      });
      wallGrid.appendChild(btn);
    });
    wallSec.appendChild(wallGrid);
    wrap.appendChild(wallSec);

    // 3. Floors
    const floorSec = document.createElement('div');
    floorSec.innerHTML = `<h4 style="font-size:18px; font-weight:800; color:#5d4037; margin-bottom:8px;">바닥 원목</h4>`;
    const floorGrid = document.createElement('div');
    floorGrid.className = 'ch-options-grid';
    FLOOR_STYLES.forEach(f => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `ch-opt-card ${state.floorStyle === f.id ? 'selected' : ''}`;
      btn.innerHTML = `
        <div class="ch-opt-icon" style="background:${f.color}; width:36px; height:36px; border-radius:10px; border:2px solid #ccc; margin:0 auto 4px;"></div>
        <div class="ch-opt-name">${f.name}</div>
      `;
      btn.addEventListener('click', () => {
        pushHistory();
        state.floorStyle = f.id;
        renderCanvas();
        renderToolsPanel('room');
        showToast(`🟫 [${f.name}]로 바닥을 바꿨어요!`);
      });
      floorGrid.appendChild(btn);
    });
    floorSec.appendChild(floorGrid);
    wrap.appendChild(floorSec);

    grid.appendChild(wrap);
  }

  function renderCatalogOptions(grid, items) {
    items.forEach(item => {
      const isPlaced = state.placedItems.some(i => i.id === item.id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `ch-opt-card ${isPlaced ? 'selected' : ''}`;
      btn.innerHTML = `
        <div class="ch-opt-icon">${item.icon}</div>
        <div class="ch-opt-name">${item.name}</div>
      `;
      btn.addEventListener('click', () => {
        handleCatalogItemClick(item);
      });
      grid.appendChild(btn);
    });
  }

  function handleCatalogItemClick(item) {
    if (state.mode === 'easy') {
      // Show Easy Mode placement bar
      state.pendingEasyItem = item;
      $('easyPositionBar').hidden = false;
      $('easyItemName').textContent = `선택한 물건: ${item.name} ${item.icon}`;
      speak(`${item.name}을 선택하셨습니다. 왼쪽, 가운데, 오른쪽 중 원하는 위치 버튼을 눌러주세요.`);
    } else {
      // Free mode direct drop
      pushHistory();
      const uid = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const newItem = {
        uid,
        id: item.id,
        name: item.name,
        icon: item.icon,
        x: 35 + (Math.random() * 30),
        y: 65 + (Math.random() * 15 - 7),
        scale: 1.0,
        rot: 0
      };
      state.placedItems.push(newItem);
      state.selectedItemUid = uid;
      renderCanvas();
      selectItemOnCanvas(uid);
      showToast(`🪑 [${item.name}]을 방에 놓았어요!`);
      speak(`${item.name}을 방에 놓았습니다. 마우스나 손가락으로 끌어 위치를 옮길 수 있습니다.`);
      checkMissionProgress(item);
    }
  }

  function placeEasyItem(pos) {
    if (!state.pendingEasyItem) return;
    pushHistory();

    const item = state.pendingEasyItem;
    const uid = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    let x = 50, y = 70;
    if (pos === 'left') {
      x = 20; y = 68;
    } else if (pos === 'center') {
      x = 50; y = 74;
    } else if (pos === 'right') {
      x = 80; y = 68;
    }

    const newItem = {
      uid,
      id: item.id,
      name: item.name,
      icon: item.icon,
      x,
      y,
      scale: 1.0,
      rot: 0
    };

    state.placedItems.push(newItem);
    state.selectedItemUid = uid;
    state.pendingEasyItem = null;
    $('easyPositionBar').hidden = true;

    renderCanvas();
    selectItemOnCanvas(uid);

    const posNames = { left: '왼쪽', center: '가운데', right: '오른쪽' };
    showToast(`✨ [${item.name}]을 방의 ${posNames[pos]}에 예쁘게 놓았어요!`);
    speak(`${item.name}을 방의 ${posNames[pos]}에 배치했습니다.`);

    checkMissionProgress(item);
  }

  function checkMissionProgress(item) {
    const charInfo = CHARACTERS[state.currentCharId];
    // Check if item matches current character mission
    const isFlower = item.id.startsWith('p_') || item.name.includes('꽃') || item.name.includes('해바라기');
    const isExercise = item.id.startsWith('e_') || item.name.includes('운동') || item.name.includes('볼') || item.name.includes('아령');

    if (isFlower || isExercise) {
      if ($('missionSuccessBadge')) $('missionSuccessBadge').hidden = false;
      const praise = `🎉 참 잘하셨어요! ${charInfo.charName}가 ${item.name}을 정말 마음에 들어 해요!`;
      $('speechMsg').textContent = praise;
      speak(`참 잘하셨어요! ${charInfo.charName}가 ${item.name}을 정말 좋아합니다.`);
      showToast(`🎉 오늘의 미션 완료! 참 잘하셨어요.`);
    } else {
      const reaction = charInfo.reactions[Math.floor(Math.random() * charInfo.reactions.length)];
      $('speechMsg').textContent = reaction;
    }
  }

  function selectItemOnCanvas(uid) {
    state.selectedItemUid = uid;
    renderCanvas();

    const item = state.placedItems.find(i => i.uid === uid);
    if (!item) {
      if ($('itemToolbar')) $('itemToolbar').hidden = true;
      return;
    }

    if ($('itemToolbar')) {
      $('itemToolbar').hidden = false;
      $('toolbarItemName').textContent = `[${item.name}]`;
    }
  }

  // --- GLOBAL EVENTS SETUP ---
  function setupGlobalEvents() {
    // Top TTS
    $('btnTtsHelp').addEventListener('click', () => {
      if (state.screen === 'select') {
        speak('누구의 집을 꾸며볼까요? 콩이의 운동방, 토리의 놀이방, 나비의 학습방, 곰이의 취미방 중 마음에 드는 친구를 선택해주세요.');
      } else {
        const charInfo = CHARACTERS[state.currentCharId];
        speak(`지금은 ${charInfo.charName}의 방을 꾸미고 있습니다. 왼쪽 메뉴에서 옷, 가구, 소품을 골라 방을 예쁘게 꾸며보세요.`);
      }
    });

    // Mode switch
    $('btnModeEasy').addEventListener('click', () => {
      state.mode = 'easy';
      $('btnModeEasy').classList.add('active');
      $('btnModeFree').classList.remove('active');
      showToast('✨ 쉬운 꾸미기 모드 (버튼으로 쏙쏙 배치)');
      speak('쉬운 꾸미기 모드로 변경되었습니다.');
    });

    $('btnModeFree').addEventListener('click', () => {
      state.mode = 'free';
      $('btnModeFree').classList.add('active');
      $('btnModeEasy').classList.remove('active');
      $('easyPositionBar').hidden = true;
      showToast('🎨 자유롭게 꾸미기 모드 (자유 이동 및 조절)');
      speak('자유롭게 꾸미기 모드로 변경되었습니다.');
    });

    // Easy Placement Buttons
    $('btnPlaceLeft').addEventListener('click', () => placeEasyItem('left'));
    $('btnPlaceCenter').addEventListener('click', () => placeEasyItem('center'));
    $('btnPlaceRight').addEventListener('click', () => placeEasyItem('right'));

    // Category Buttons (5 Menu Buttons)
    document.querySelectorAll('.ch-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        renderToolsPanel(btn.dataset.cat);
      });
    });

    // Mini Toolbar Events
    const getSelectedItem = () => state.placedItems.find(i => i.uid === state.selectedItemUid);

    if ($('btnToolScaleUp')) {
      $('btnToolScaleUp').addEventListener('click', () => {
        const item = getSelectedItem();
        if (!item) return;
        pushHistory();
        item.scale = Math.min(2.0, item.scale + 0.15);
        renderCanvas();
      });
    }

    if ($('btnToolScaleDown')) {
      $('btnToolScaleDown').addEventListener('click', () => {
        const item = getSelectedItem();
        if (!item) return;
        pushHistory();
        item.scale = Math.max(0.6, item.scale - 0.15);
        renderCanvas();
      });
    }

    if ($('btnToolRotate')) {
      $('btnToolRotate').addEventListener('click', () => {
        const item = getSelectedItem();
        if (!item) return;
        pushHistory();
        item.rot = (item.rot + 20) % 360;
        renderCanvas();
      });
    }

    if ($('btnToolDelete')) {
      $('btnToolDelete').addEventListener('click', () => {
        const item = getSelectedItem();
        if (!item) return;
        pushHistory();
        state.placedItems = state.placedItems.filter(i => i.uid !== item.uid);
        state.selectedItemUid = null;
        if ($('itemToolbar')) $('itemToolbar').hidden = true;
        renderCanvas();
        renderToolsPanel();
        showToast(`🗑 [${item.name}]을 치웠어요.`);
        speak(`${item.name}을 치웠습니다.`);
      });
    }

    // Canvas click to deselect
    $('roomViewport').addEventListener('click', e => {
      if (e.target === $('roomViewport') || e.target === $('roomWall') || e.target === $('roomFloor')) {
        state.selectedItemUid = null;
        if ($('itemToolbar')) $('itemToolbar').hidden = true;
        renderCanvas();
      }
    });

    // Bottom Action Buttons
    $('btnBottomUndo').addEventListener('click', undoHistory);
    $('btnBottomSave').addEventListener('click', saveToStorage);

    // Completion View
    $('btnBottomComplete').addEventListener('click', () => {
      saveToStorage();
      awardStamp();
      const charInfo = CHARACTERS[state.currentCharId];
      if (charInfo) {
        $('completeCharImg').src = charInfo.completeImg;
        $('completeDesc').textContent = `어르신의 따뜻한 손길로 ${charInfo.charName}의 ${charInfo.theme}이 반짝반짝 완성되었습니다.`;
      }
      $('completeView').hidden = false;
      $('completeView').style.display = 'flex';
      const charName = charInfo ? charInfo.charName : '친구';
      speak(`오늘도 정말 잘하셨어요! 어르신 덕분에 ${charName}의 방이 최고로 멋지게 완성되었습니다.`);
    });

    $('btnCloseComplete').addEventListener('click', () => {
      $('completeView').hidden = true;
      $('completeView').style.display = 'none';
      goToSelectScreen();
    });

    const btnKeep = $('btnKeepDecorating');
    if (btnKeep) {
      btnKeep.addEventListener('click', () => {
        $('completeView').hidden = true;
        $('completeView').style.display = 'none';
        showToast('✏️ 방을 계속 더 꾸며보세요.');
      });
    }

    // Resume Banner Buttons
    $('btnResumeWork').addEventListener('click', () => {
      const saved = loadFromStorage();
      if (saved) {
        selectCharacter(saved.currentCharId, saved);
        showToast('▶ 지난번 집을 그대로 불러왔어요.');
      }
    });

    $('btnNewWork').addEventListener('click', () => {
      $('resumeBanner').hidden = true;
      showToast('새로운 친구의 집을 골라주세요.');
    });
  }

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
