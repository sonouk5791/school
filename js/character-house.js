/**
 * 「내가 꾸미는 AI 캐릭터 집」 인터랙티브 시스템
 * - 치매·인지저하 어르신 맞춤형 참여·소근육·회상 활동
 * - 4인 캐릭터(콩이/토리/나비/곰이), 옷 입히기, 방 구조/벽/바닥/창문, 가구 배치, 이동/회전 조작, 저장/복원
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'senior_character_house_data_v1';
  const $ = id => document.getElementById(id);

  // --- DATA DEFINITIONS ---
  const CHARACTERS = {
    kongi: {
      id: 'kongi',
      name: '콩이의 집',
      charName: '콩이',
      theme: '운동방',
      avatar: 'assets/images/friend-kongi.png',
      color: '#e6a100',
      badge: '🏃 건강한 운동방',
      greeting: '어서 오세요! 오늘은 제 방을 어떻게 꾸며볼까요?',
      mission: '노란 꽃 하나를 예쁘게 놓아볼까요?',
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
      color: '#d53f8c',
      badge: '🧸 신나는 놀이방',
      greeting: '반가워요! 오늘은 토리방을 재미있게 꾸며봐요.',
      mission: '토리가 좋아할 폭신한 쿠션을 골라주세요.',
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
      color: '#2b6cb0',
      badge: '🎵 평온한 취미방',
      greeting: '오늘은 편안하게 좋아하는 것으로 방을 꾸며봐요.',
      mission: '편안한 의자 하나를 골라주세요.',
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
      { id: 'top_cardigan', name: '노란 가디건', icon: '🧥', color: '#fff9c4' },
      { id: 'top_knit', name: '분홍 니트', icon: '🧶', color: '#f8bbd0' },
      { id: 'top_shirt', name: '파란 셔츠', icon: '👔', color: '#bbdefb' },
      { id: 'top_vest', name: '꽃무늬 조끼', icon: '👚', color: '#ffe0b2' },
      { id: 'top_sport', name: '편안한 운동복', icon: '🏃', color: '#c8e6c9' }
    ],
    bottoms: [
      { id: 'bot_pants', name: '편안한 바지', icon: '👖', color: '#cfd8dc' },
      { id: 'bot_sport', name: '운동복 바지', icon: '👖', color: '#d7ccc8' },
      { id: 'bot_skirt', name: '예쁜 치마', icon: '👗', color: '#f48fb1' },
      { id: 'bot_overall', name: '귀여운 멜빵', icon: '👖', color: '#90caf9' }
    ],
    accs: [
      { id: 'acc_hat', name: '멋진 모자', icon: '👒' },
      { id: 'acc_glasses', name: '단정한 안경', icon: '👓' },
      { id: 'acc_scarf', name: '따뜻한 스카프', icon: '🧣' },
      { id: 'acc_bag', name: '작은 가방', icon: '👜' }
    ]
  };

  // Room Architecture Options
  const ROOM_TYPES = [
    { id: 'room_spacious', name: '넓은 한 개의 방', icon: '🏠', desc: '탁 트인 시원한 방' },
    { id: 'room_living', name: '거실 + 작은 방', icon: '🏡', desc: '아늑한 2개 공간' },
    { id: 'room_window', name: '창가가 넓은 방', icon: '☀️', desc: '햇살 가득한 창가' },
    { id: 'room_books', name: '책장이 많은 방', icon: '📚', desc: '지혜가 샘솟는 서재' },
    { id: 'room_garden', name: '정원이 보이는 방', icon: '🌳', desc: '푸른 뜰이 보이는 방' },
    { id: 'room_hanok', name: '따뜻한 한옥방', icon: '🏮', desc: '정겨운 전통 공간' }
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

  const WINDOW_STYLES = [
    { id: 'win_big', name: '큰 창문', icon: '☀️', emoji: '☀️' },
    { id: 'win_small', name: '작은 창문', icon: '🌤️', emoji: '🌤️' },
    { id: 'win_hanok', name: '한옥 창문', icon: '🏮', emoji: '🏮' },
    { id: 'win_garden', name: '정원 창문', icon: '🌳', emoji: '🌳' }
  ];

  const DOOR_STYLES = [
    { id: 'door_wood', name: '기본 나무문', icon: '🚪', color: '#a1887f' },
    { id: 'door_light', name: '밝은 나무문', icon: '🚪', color: '#d7ccc8' },
    { id: 'door_hanok', name: '한옥 전통문', icon: '🚪', color: '#8d6e63' }
  ];

  // Furniture & Decor Catalog
  const ITEM_CATALOG = {
    furniture: [
      { id: 'f_chair', name: '편안한 의자', icon: '🛋️' },
      { id: 'f_table', name: '나무 테이블', icon: '☕' },
      { id: 'f_bookshelf', name: '원목 책장', icon: '📚' },
      { id: 'f_drawer', name: '서랍 수납장', icon: '🗄️' },
      { id: 'f_mat', name: '포근한 방석매트', icon: '🛋️' }
    ],
    plants: [
      { id: 'p_flower', name: '화사한 꽃화분', icon: '🌷' },
      { id: 'p_sunflower', name: '노란 해바라기', icon: '🌻' },
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
      { id: 'e_dumbbell', name: '가벼운 아령', icon: '💪' }
    ]
  };

  // --- STATE ---
  let state = {
    screen: 'select', // 'select' | 'studio'
    currentCharId: 'kongi',
    outfit: { top: 'top_cardigan', bottom: 'bot_pants', acc: 'acc_glasses' },
    roomType: 'room_spacious',
    wallStyle: 'w_cream',
    floorStyle: 'f_wood_light',
    windowStyle: 'win_big',
    doorStyle: 'door_wood',
    placedItems: [], // Array of { uid, id, name, icon, x, y, scale, rot }
    selectedItemUid: null,
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
    if (historyStack.length > 20) historyStack.shift();
  }

  function undoHistory() {
    if (historyStack.length === 0) {
      showToast('처음 상태입니다.');
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
    renderCanvas();
    renderToolsPanel();
    showToast('↩ 방금 전으로 되돌렸어요.');
    speak('방금 전으로 되돌렸습니다.');
  }

  // Speech Helper
  function speak(text) {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ko-KR';
      utter.rate = 0.78;
      utter.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.startsWith('ko') && (v.name.includes('Yuna') || v.name.includes('SunHi') || v.name.includes('Heami') || v.name.includes('Korean')));
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

  // --- RENDER VIEWS ---
  function init() {
    const saved = loadFromStorage();
    if (saved) {
      $('resumeBanner').hidden = false;
      const charInfo = CHARACTERS[saved.currentCharId] || CHARACTERS.kongi;
      $('resumeCharText').textContent = `지난번에 꾸미던 [${charInfo.charName}의 ${charInfo.theme}]이 저장되어 있어요.`;
    }

    renderCharCards();
    setupGlobalEvents();
  }

  function renderCharCards() {
    const grid = $('charSelectGrid');
    grid.innerHTML = '';

    Object.values(CHARACTERS).forEach(c => {
      const card = document.createElement('article');
      card.className = `ch-char-card char-${c.id}`;
      card.tabIndex = 0;
      card.innerHTML = `
        <img class="ch-char-avatar" src="${c.avatar}" alt="${c.name}">
        <div class="ch-char-details">
          <span class="ch-char-badge">${c.badge}</span>
          <h3>${c.name}</h3>
          <p>${c.greeting}</p>
        </div>
      `;
      card.addEventListener('click', () => {
        startDecorating(c.id, false);
      });
      grid.appendChild(card);
    });
  }

  function startDecorating(charId, isResume = false) {
    state.currentCharId = charId;
    state.screen = 'studio';

    if (!isResume) {
      pushHistory();
      // Default items for each room
      state.placedItems = [
        { uid: 'init_1', id: 'f_table', name: '나무 테이블', icon: '🪵', x: 28, y: 55, scale: 1, rot: 0 },
        { uid: 'init_2', id: 'p_flower', name: '화사한 꽃화분', icon: '🌷', x: 30, y: 46, scale: 1, rot: 0 }
      ];
    }

    $('selectScreen').hidden = true;
    $('studioScreen').hidden = false;

    const charInfo = CHARACTERS[charId];
    $('stageTitle').textContent = `🏡 ${charInfo.name} (${charInfo.theme})`;
    $('missionText').textContent = `💡 미션: ${charInfo.mission}`;
    $('speechMsg').textContent = charInfo.greeting;
    $('speechAvatar').textContent = charId === 'kongi' ? '🐶' : charId === 'tori' ? '🐰' : charId === 'nabi' ? '🐱' : '🐻';
    $('speechName').textContent = charInfo.charName;

    renderCanvas();
    renderToolsPanel('outfit');
    speak(`${charInfo.greeting} 오늘의 작은 미션은 ${charInfo.mission}`);
  }

  // --- CANVAS RENDERING ---
  function renderCanvas() {
    const wall = $('roomWall');
    const floor = $('roomFloor');
    const win = $('windowElem');
    const door = $('doorElem');
    const itemsLayer = $('itemsLayer');
    const charAvatar = $('charAvatar');

    // Wall & Floor
    const wallObj = WALL_STYLES.find(w => w.id === state.wallStyle) || WALL_STYLES[0];
    const floorObj = FLOOR_STYLES.find(f => f.id === state.floorStyle) || FLOOR_STYLES[0];
    wall.style.backgroundColor = wallObj.color;
    floor.style.backgroundColor = floorObj.color;

    // Window & Door
    const winObj = WINDOW_STYLES.find(w => w.id === state.windowStyle) || WINDOW_STYLES[0];
    win.textContent = winObj.emoji;
    const doorObj = DOOR_STYLES.find(d => d.id === state.doorStyle) || DOOR_STYLES[0];
    door.style.backgroundColor = doorObj.color;

    // Character Avatar
    const charInfo = CHARACTERS[state.currentCharId];
    charAvatar.src = charInfo.avatar;
    const topObj = OUTFITS.tops.find(t => t.id === state.outfit.top);
    $('avatarOutfitBadge').textContent = topObj ? topObj.name : '기본 의상';

    // Placed Items
    itemsLayer.innerHTML = '';
    state.placedItems.forEach(item => {
      const el = document.createElement('div');
      el.className = `ch-placed-item ${item.uid === state.selectedItemUid ? 'selected' : ''}`;
      el.textContent = item.icon;
      el.title = item.name;
      el.style.left = `${item.x}%`;
      el.style.top = `${item.y}%`;
      el.style.transform = `scale(${item.scale || 1}) rotate(${item.rot || 0}deg)`;

      // Click to select
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectPlacedItem(item.uid);
      });

      itemsLayer.appendChild(el);
    });

    // Update Controller
    updateItemController();
  }

  function selectPlacedItem(uid) {
    state.selectedItemUid = uid;
    renderCanvas();
    const item = state.placedItems.find(it => it.uid === uid);
    if (item) {
      showToast(`[${item.name}]이 선택되었어요. 위치를 움직여보세요.`);
    }
  }

  function updateItemController() {
    const ctrl = $('itemController');
    const label = $('selectedItemName');
    const item = state.placedItems.find(it => it.uid === state.selectedItemUid);

    if (item) {
      ctrl.hidden = false;
      label.textContent = `선택된 물건: ${item.name} (${item.icon})`;
    } else {
      ctrl.hidden = true;
    }
  }

  // --- TOOLS & CATEGORIES ---
  let currentCategory = 'outfit'; // 'outfit' | 'structure' | 'interior' | 'furniture'

  function renderToolsPanel(cat = currentCategory) {
    currentCategory = cat;
    document.querySelectorAll('.ch-cat-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.cat === cat);
    });

    const titleEl = $('optionsTitle');
    const gridEl = $('optionsGrid');
    gridEl.innerHTML = '';

    if (cat === 'outfit') {
      titleEl.textContent = '👕 오늘은 어떤 옷을 입혀볼까요?';
      
      // Tops
      OUTFITS.tops.forEach(top => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `ch-opt-btn ${state.outfit.top === top.id ? 'active' : ''}`;
        btn.innerHTML = `<span class="ch-opt-icon">${top.icon}</span><span class="ch-opt-label">${top.name}</span>`;
        btn.addEventListener('click', () => {
          pushHistory();
          state.outfit.top = top.id;
          renderCanvas();
          renderToolsPanel('outfit');
          react(`${top.name}을 입었어요! 참 멋져요.`);
        });
        gridEl.appendChild(btn);
      });

      // Bottoms
      OUTFITS.bottoms.forEach(bot => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `ch-opt-btn ${state.outfit.bottom === bot.id ? 'active' : ''}`;
        btn.innerHTML = `<span class="ch-opt-icon">${bot.icon}</span><span class="ch-opt-label">${bot.name}</span>`;
        btn.addEventListener('click', () => {
          pushHistory();
          state.outfit.bottom = bot.id;
          renderCanvas();
          renderToolsPanel('outfit');
          react(`${bot.name}을 골라주셨네요!`);
        });
        gridEl.appendChild(btn);
      });
    } else if (cat === 'structure') {
      titleEl.textContent = '🏠 방 모양과 구조 바꾸기';
      ROOM_TYPES.forEach(r => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `ch-opt-btn ${state.roomType === r.id ? 'active' : ''}`;
        btn.innerHTML = `<span class="ch-opt-icon">${r.icon}</span><span class="ch-opt-label">${r.name}</span>`;
        btn.addEventListener('click', () => {
          pushHistory();
          state.roomType = r.id;
          renderCanvas();
          renderToolsPanel('structure');
          react(`[${r.name}] 구조로 바꾸었어요! 시원하고 좋습니다.`);
        });
        gridEl.appendChild(btn);
      });
    } else if (cat === 'interior') {
      titleEl.textContent = '🎨 벽지 / 바닥 / 창문 고르기';
      
      // Walls
      WALL_STYLES.forEach(w => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `ch-opt-btn ${state.wallStyle === w.id ? 'active' : ''}`;
        btn.innerHTML = `<span class="ch-opt-icon">${w.icon}</span><span class="ch-opt-label">${w.name}</span>`;
        btn.addEventListener('click', () => {
          pushHistory();
          state.wallStyle = w.id;
          renderCanvas();
          renderToolsPanel('interior');
          react(`벽을 ${w.name}로 바꿨어요.`);
        });
        gridEl.appendChild(btn);
      });

      // Floors
      FLOOR_STYLES.forEach(f => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `ch-opt-btn ${state.floorStyle === f.id ? 'active' : ''}`;
        btn.innerHTML = `<span class="ch-opt-icon">${f.icon}</span><span class="ch-opt-label">${f.name}</span>`;
        btn.addEventListener('click', () => {
          pushHistory();
          state.floorStyle = f.id;
          renderCanvas();
          renderToolsPanel('interior');
          react(`바닥을 ${f.name}로 깔았어요.`);
        });
        gridEl.appendChild(btn);
      });
    } else if (cat === 'furniture') {
      titleEl.textContent = '🪑 가구와 소품을 방에 놓아보세요';
      
      // All Categories flatten
      const allItems = [
        ...ITEM_CATALOG.furniture,
        ...ITEM_CATALOG.plants,
        ...ITEM_CATALOG.toys,
        ...ITEM_CATALOG.books,
        ...ITEM_CATALOG.frames,
        ...ITEM_CATALOG.cushions,
        ...ITEM_CATALOG.music,
        ...ITEM_CATALOG.exercise
      ];

      allItems.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ch-opt-btn';
        btn.innerHTML = `<span class="ch-opt-icon">${item.icon}</span><span class="ch-opt-label">${item.name}</span>`;
        btn.addEventListener('click', () => {
          pushHistory();
          const newItem = {
            uid: 'item_' + Date.now(),
            id: item.id,
            name: item.name,
            icon: item.icon,
            x: 35 + Math.floor(Math.random() * 25),
            y: 35 + Math.floor(Math.random() * 30),
            scale: 1,
            rot: 0
          };
          state.placedItems.push(newItem);
          state.selectedItemUid = newItem.uid;
          renderCanvas();
          react(`[${item.name}]을 방에 놓았어요!`);
        });
        gridEl.appendChild(btn);
      });
    }
  }

  function react(msg) {
    const charInfo = CHARACTERS[state.currentCharId];
    const reaction = charInfo.reactions[Math.floor(Math.random() * charInfo.reactions.length)];
    const fullMsg = `${msg} ${reaction}`;
    $('speechMsg').textContent = fullMsg;
    showToast(msg);
    speak(fullMsg);
  }

  // --- ITEM MOVEMENT CONTROLS ---
  function moveSelectedItem(dx, dy) {
    const item = state.placedItems.find(it => it.uid === state.selectedItemUid);
    if (!item) return;
    pushHistory();
    item.x = Math.max(5, Math.min(85, item.x + dx));
    item.y = Math.max(10, Math.min(75, item.y + dy));
    renderCanvas();
  }

  function rotateSelectedItem() {
    const item = state.placedItems.find(it => it.uid === state.selectedItemUid);
    if (!item) return;
    pushHistory();
    item.rot = ((item.rot || 0) + 45) % 360;
    renderCanvas();
  }

  function scaleSelectedItem(delta) {
    const item = state.placedItems.find(it => it.uid === state.selectedItemUid);
    if (!item) return;
    pushHistory();
    item.scale = Math.max(0.6, Math.min(2.0, (item.scale || 1) + delta));
    renderCanvas();
  }

  function deleteSelectedItem() {
    if (!state.selectedItemUid) return;
    pushHistory();
    state.placedItems = state.placedItems.filter(it => it.uid !== state.selectedItemUid);
    state.selectedItemUid = null;
    renderCanvas();
    showToast('🗑 물건을 치웠어요.');
    speak('물건을 치웠습니다.');
  }

  // --- GLOBAL EVENT LISTENERS ---
  function setupGlobalEvents() {
    // Resume Banner Actions
    $('btnResumeWork').addEventListener('click', () => {
      const saved = loadFromStorage();
      if (saved) {
        state = saved;
        startDecorating(state.currentCharId, true);
      }
    });

    $('btnNewWork').addEventListener('click', () => {
      $('resumeBanner').hidden = true;
    });

    // Category Tabs
    document.querySelectorAll('.ch-cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        renderToolsPanel(tab.dataset.cat);
      });
    });

    // D-Pad Position Controls
    $('btnMoveLeft').addEventListener('click', () => moveSelectedItem(-5, 0));
    $('btnMoveRight').addEventListener('click', () => moveSelectedItem(5, 0));
    $('btnMoveUp').addEventListener('click', () => moveSelectedItem(0, -5));
    $('btnMoveDown').addEventListener('click', () => moveSelectedItem(0, 5));
    $('btnRotate').addEventListener('click', rotateSelectedItem);
    $('btnScaleUp').addEventListener('click', () => scaleSelectedItem(0.2));
    $('btnScaleDown').addEventListener('click', () => scaleSelectedItem(-0.2));
    $('btnDeleteItem').addEventListener('click', deleteSelectedItem);

    // Bottom Fixed Actions
    $('btnBottomHome').addEventListener('click', () => {
      $('studioScreen').hidden = true;
      $('selectScreen').hidden = false;
      state.screen = 'select';
    });

    $('btnBottomUndo').addEventListener('click', undoHistory);
    $('btnBottomSave').addEventListener('click', saveToStorage);

    $('btnBottomReset').addEventListener('click', () => {
      $('resetModal').hidden = false;
    });

    $('btnConfirmResetYes').addEventListener('click', () => {
      $('resetModal').hidden = true;
      pushHistory();
      state.placedItems = [];
      state.selectedItemUid = null;
      renderCanvas();
      showToast('처음 모습으로 돌아갔어요.');
      speak('처음 모습으로 돌아갔습니다.');
    });

    $('btnConfirmResetNo').addEventListener('click', () => {
      $('resetModal').hidden = true;
    });

    $('btnBottomHelp').addEventListener('click', () => {
      const msg = '원하는 옷이나 물건을 한 번 눌러보세요. 제가 방에 예쁘게 놓아드릴게요!';
      $('speechMsg').textContent = msg;
      speak(msg);
    });

    // Complete Decorating View
    $('btnBottomComplete').addEventListener('click', () => {
      saveToStorage();
      const view = $('completeView');
      view.hidden = false;

      const charInfo = CHARACTERS[state.currentCharId];
      $('completeCharImg').src = charInfo.avatar;
      $('completeTitle').textContent = `🎉 정말 멋진 [${charInfo.name}]이 완성되었어요!`;
      
      const congrats = '어르신, 정말 멋진 집이 되었어요! 함께 꾸며줘서 진심으로 고마워요.';
      speak(congrats);
    });

    $('btnCloseComplete').addEventListener('click', () => {
      $('completeView').hidden = true;
    });
  }

  // Run
  init();
})();
