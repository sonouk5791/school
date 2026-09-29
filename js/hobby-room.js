/**
 * 디지털 학교 - 어르신을 위한 나만의 취미방 (Dedicated Senior Hobby Room)
 * 1. 홈 화면 바로가기 진입 카드 제공
 * 2. 4대 핵심 코너 제공:
 *    - 🖌️ 마음대로 그림 그리기 캔버스 (크레파스/붓, 8색 팔레트, 스탬프, 밑그림 컬러링)
 *    - ✍️ 정겨운 마음 글쓰기 (원고지/편지 서식, 추천 글감, 빠른 문구 칩, AI 다정한 낭독)
 *    - 🔍 나의 취미 찾기 (3문항 그림 질문 테스트 & 맞춤 취미 추천)
 *    - 🖼️ 나의 작품 보관함 (갤러리 저장 및 감상)
 */
(()=>{
  'use strict';

  // 로컬 스토리지 키
  const STORAGE_KEY_WORKS = 'digital_school_hobby_works';

  // 취미 테스트 질문 데이터
  const HOBBY_QUESTIONS = [
    {
      q: 'Q1. 오늘 하루 중 가장 기분 좋고 편안한 순간은 언제인가요?',
      choices: [
        { text: '따뜻한 햇살을 받으며 풍경 바라보기', emoji: '🌻', score: { art: 2, garden: 2 } },
        { text: '신명나는 옛 노래나 트로트 흥얼거리기', emoji: '🎵', score: { music: 3 } },
        { text: '조용히 옛 추억을 떠올리며 생각에 잠기기', emoji: '✍️', score: { write: 3 } },
        { text: '초록빛 화초나 마당 꽃밭 돌보기', emoji: '🌿', score: { garden: 3 } }
      ]
    },
    {
      q: 'Q2. 손으로 무언가 만지고 활동할 때 더 마음이 끌리는 것은?',
      choices: [
        { text: '알록달록 고운 색깔로 칠하고 그리기', emoji: '🎨', score: { art: 3 } },
        { text: '정갈하게 한 자 한 자 마음을 적어 내려가기', emoji: '📝', score: { write: 3 } },
        { text: '박자에 맞춰 탬버린 치고 손뼉 치기', emoji: '👏', score: { music: 3 } },
        { text: '화분 흙을 만지고 잎을 닦아주기', emoji: '🌱', score: { garden: 3 } }
      ]
    },
    {
      q: 'Q3. 나를 가장 미소 짓게 만드는 소리는 어떤 소리인가요?',
      choices: [
        { text: '정겨운 트로트 가락과 색소폰 소리', emoji: '🎷', score: { music: 3 } },
        { text: '사각사각 연필 소리와 정다운 편지', emoji: '💌', score: { write: 2, art: 1 } },
        { text: '마당 처마 밑 새소리와 바람 소리', emoji: '🕊️', score: { garden: 2, art: 2 } },
        { text: '반가운 친구들과 마주 앉아 나누는 도란도란 이야기', emoji: '☕', score: { write: 2, music: 1 } }
      ]
    }
  ];

  // 취미 결과 정의
  const HOBBY_RESULTS = {
    art: {
      badge: '🌻 낭만 풍경 화가형',
      title: '마음을 곱게 물들이는 감성 화가',
      desc: '어르신은 아름다운 풍경과 색채를 느끼는 감수성이 매우 풍부하세요! 오늘 취미방의 [그림 그리기] 코너에서 마음에 드는 고운 색으로 나만의 멋진 그림을 그려보시는 것을 추천해 드려요 😊',
      actionTab: 'draw',
      actionText: '🖌️ 그림 그리러 가기'
    },
    write: {
      badge: '✍️ 따뜻한 수필 작가형',
      title: '소중한 추억을 엮어내는 이야기 작가',
      desc: '어르신은 지나온 세월의 정겨운 이야기와 따뜻한 마음을 글로 표현하는 훌륭한 재능이 있으세요! [마음 글쓰기] 코너에서 고향 이야기나 감사한 분께 편지를 한 줄 적어보세요 💌',
      actionTab: 'write',
      actionText: '✍️ 글 쓰러 가기'
    },
    music: {
      badge: '🎤 흥겨운 트로트 명가수형',
      title: '모두에게 기쁨을 주는 열정 가수',
      desc: '어르신은 신명나는 가락과 노래로 일상의 활력을 만드시는 멋쟁이세요! 우리 학교의 [신나는 트로트 노래방]에서 애창곡을 부르시며 건강하고 유쾌한 시간을 보내보세요 🎶',
      actionLink: 'karaoke',
      actionText: '🎤 트로트 노래방 가기'
    },
    garden: {
      badge: '🌿 마음 치유 원예 산책가형',
      title: '자연과 생명을 사랑하는 힐링 전문가',
      desc: '어르신은 푸른 풀잎과 꽃, 맑은 바람을 보며 마음의 평온을 찾으시는 맑고 고운 마음을 가지셨어요! 마당 꽃밭을 떠올리며 예쁜 해바라기 밑그림을 색칠해보세요 🌻',
      actionTab: 'draw',
      actionText: '🌻 해바라기 그림 그리러 가기'
    }
  };

  // 밑그림 템플릿 SVG / 드로잉 패스 데이터
  const SKETCH_TEMPLATES = {
    blank: { name: '📄 깨끗한 도화지 (자유 그림)', draw: null },
    sunflower: {
      name: '🌻 활짝 핀 해바라기',
      draw: (ctx, w, h) => {
        ctx.save();
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        // 중심 원
        const cx = w / 2, cy = h / 2 - 20;
        ctx.beginPath();
        ctx.arc(cx, cy, 55, 0, Math.PI * 2);
        ctx.fillStyle = '#f5f6fa';
        ctx.fill();
        ctx.stroke();
        // 꽃잎
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI) / 6;
          const x1 = cx + Math.cos(angle) * 55;
          const y1 = cy + Math.sin(angle) * 55;
          const x2 = cx + Math.cos(angle) * 115;
          const y2 = cy + Math.sin(angle) * 115;
          const perpAngle = angle + Math.PI / 2;
          const cpX = (x1 + x2) / 2 + Math.cos(perpAngle) * 22;
          const cpY = (y1 + y2) / 2 + Math.sin(perpAngle) * 22;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(cpX, cpY, x2, y2);
          ctx.stroke();
          const cpX2 = (x1 + x2) / 2 - Math.cos(perpAngle) * 22;
          const cpY2 = (y1 + y2) / 2 - Math.sin(perpAngle) * 22;
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.quadraticCurveTo(cpX2, cpY2, x1, y1);
          ctx.stroke();
        }
        // 줄기
        ctx.beginPath();
        ctx.moveTo(cx, cy + 55);
        ctx.lineTo(cx, h - 30);
        ctx.lineWidth = 6;
        ctx.stroke();
        // 잎사귀
        ctx.beginPath();
        ctx.moveTo(cx, cy + 120);
        ctx.quadraticCurveTo(cx + 70, cy + 100, cx + 85, cy + 140);
        ctx.quadraticCurveTo(cx + 40, cy + 160, cx, cy + 130);
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      }
    },
    dog: {
      name: '🐶 귀여운 바둑이 강아지',
      draw: (ctx, w, h) => {
        ctx.save();
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        const cx = w / 2, cy = h / 2 - 10;
        // 머리
        ctx.beginPath();
        ctx.arc(cx, cy - 30, 65, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.stroke();
        // 귀
        ctx.beginPath();
        ctx.ellipse(cx - 65, cy - 40, 22, 45, -Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx + 65, cy - 40, 22, 45, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
        // 눈
        ctx.beginPath();
        ctx.arc(cx - 24, cy - 35, 6, 0, Math.PI * 2);
        ctx.arc(cx + 24, cy - 35, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#2d3436';
        ctx.fill();
        // 코
        ctx.beginPath();
        ctx.arc(cx, cy - 15, 10, 0, Math.PI * 2);
        ctx.fill();
        // 입
        ctx.beginPath();
        ctx.arc(cx - 10, cy, 10, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 10, cy, 10, 0, Math.PI);
        ctx.stroke();
        // 몸통
        ctx.beginPath();
        ctx.ellipse(cx, cy + 90, 60, 50, 0, 0, Math.PI * 2);
        ctx.stroke();
        // 꼬리
        ctx.beginPath();
        ctx.moveTo(cx + 55, cy + 80);
        ctx.quadraticCurveTo(cx + 95, cy + 50, cx + 90, cy + 30);
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.restore();
      }
    },
    house: {
      name: '🏡 정겨운 고향 기와집',
      draw: (ctx, w, h) => {
        ctx.save();
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        const cx = w / 2, cy = h / 2 + 10;
        // 지붕
        ctx.beginPath();
        ctx.moveTo(cx - 140, cy - 30);
        ctx.quadraticCurveTo(cx, cy - 90, cx + 140, cy - 30);
        ctx.lineTo(cx + 120, cy - 10);
        ctx.quadraticCurveTo(cx, cy - 65, cx - 120, cy - 10);
        ctx.closePath();
        ctx.stroke();
        // 집 본체
        ctx.strokeRect(cx - 100, cy - 10, 200, 110);
        // 문
        ctx.strokeRect(cx - 30, cy + 20, 60, 80);
        // 창문
        ctx.strokeRect(cx - 85, cy + 15, 40, 40);
        ctx.strokeRect(cx + 45, cy + 15, 40, 40);
        // 담장
        ctx.beginPath();
        ctx.moveTo(cx - 160, cy + 60);
        ctx.lineTo(cx - 100, cy + 60);
        ctx.moveTo(cx + 100, cy + 60);
        ctx.lineTo(cx + 160, cy + 60);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  // 글쓰기 글감 추천 데이터
  const WRITING_PROMPTS = [
    {
      title: '가장 그리운 고향과 어린 시절 이야기',
      desc: '어릴 적 살던 고향 마을, 뛰놀던 동산, 친구들과의 따뜻한 추억을 적어보세요.',
      template: '내가 나고 자란 고향 마을은 봄이면 진달래가 곱게 피고...\n'
    },
    {
      title: '소중한 가족과 자녀, 손주에게 전하는 사랑',
      desc: '늘 고맙고 사랑하는 가족들에게 전하고 싶은 따뜻한 덕담과 마음을 담아보세요.',
      template: '사랑하는 우리 가족에게,\n늘 건강하고 웃음 가득한 날들이 되기를 바라며...\n'
    },
    {
      title: '오늘 하루 감사한 마음과 기분 좋은 일',
      desc: '오늘 먹은 맛있는 식사, 반가운 인사, 맑은 하늘에 감사한 마음을 표현해보세요.',
      template: '오늘 아침 창밖을 보니 맑고 푸른 하늘이 참 반가웠습니다.\n'
    },
    {
      title: '내가 가장 좋아하는 계절과 추억의 노래',
      desc: '가장 좋아하는 계절(봄, 가을 등)의 풍경과 흥얼거리던 옛 노래를 적어보세요.',
      template: '내가 가장 좋아하는 계절은 가을입니다. 시원한 바람이 불어올 때면...\n'
    }
  ];

  // 빠른 문구 칩
  const QUICK_PHRASES = [
    '사랑합니다 💖', '늘 건강하세요 🌸', '참 고맙습니다 😊', '행복한 하루 ✨',
    '마음이 참 따뜻합니다 ☀️', '웃음꽃이 활짝 피어납니다 🌻', '아름다운 추억 🏡'
  ];

  // 작품 보관함 헬퍼
  function loadSavedWorks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_WORKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveWorkItem(item) {
    const list = loadSavedWorks();
    list.unshift({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      ...item
    });
    try {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(list.slice(0, 30)));
      return true;
    } catch (e) {
      console.warn('작품 저장 공간 부족:', e);
      alert('저장 공간이 부족해 보관하지 못했어요. 그림이나 글을 따로 보관한 뒤 다시 시도해 주세요.');
      return false;
    }
  }

  function deleteWorkItem(id) {
    let list = loadSavedWorks();
    list = list.filter(w => w.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(list));
    } catch {}
  }

  // DOM 로드 시 초기화
  document.addEventListener('DOMContentLoaded', () => {
    // 1. 홈 화면 진입 카드 생성
    const entry = document.createElement('section');
    entry.className = 'care-card hobby-room-entry';
    entry.innerHTML = `
      <div>
        <h2>🎨 나만의 취미방 (내 취미 찾기 & 창작 공방)</h2>
        <p>마음껏 고운 그림을 그리고 정겨운 글도 쓰며, 나에게 딱 맞는 즐거운 취미를 찾아보아요.</p>
      </div>
      <button type="button" class="care-btn primary" id="openHobbyRoom">취미방 들어가기 🎨</button>
    `;

    // 노래방 카드 뒤나 관절운동 카드 뒤에 배치
    const karaokeEntry = document.querySelector('.karaoke-room-entry');
    const jointEntry = document.querySelector('.joint-room-entry');
    const friendSelection = document.querySelector('.friend-selection');

    if (karaokeEntry) {
      karaokeEntry.after(entry);
    } else if (jointEntry) {
      jointEntry.after(entry);
    } else if (friendSelection) {
      friendSelection.after(entry);
    } else {
      document.querySelector('.section-lessons')?.before(entry);
    }

    // 2. 취미방 모달 다이얼로그 생성
    const room = document.createElement('dialog');
    room.className = 'hobby-room';
    room.id = 'hobbyModalRoom';
    room.setAttribute('aria-labelledby', 'hobbyModalTitle');

    room.innerHTML = `
      <div class="hobby-room-header">
        <div>
          <h2 id="hobbyModalTitle">🎨 어르신 나만의 취미방</h2>
          <div class="room-sub">손수 그림도 그리고 글도 쓰며, 나의 행복한 취미를 가꾸는 공간입니다 🌻</div>
        </div>
        <button type="button" class="care-btn-close" id="closeHobbyRoom">◀ 방 나가기</button>
      </div>

<!-- 4대 상단 탭 바 -->
      <div class="hobby-tab-nav" role="tablist">
        <button type="button" class="hobby-tab-btn active" data-tab="draw" role="tab" aria-selected="true">
          🖌️ 그림 그리기
        </button>
        <button type="button" class="hobby-tab-btn" data-tab="write" role="tab" aria-selected="false">
          ✍️ 마음 글쓰기
        </button>
        <button type="button" class="hobby-tab-btn" data-tab="finder" role="tab" aria-selected="false">
          🔍 나의 취미 찾기
        </button>
        <button type="button" class="hobby-tab-btn" data-tab="gallery" role="tab" aria-selected="false">
          🖼️ 나의 작품 보관함
        </button>
        <a class="hobby-tab-btn hobby-channel-tab" id="hobbyYoutubeChannel" href="https://www.youtube.com/channel/UCp3Vy7dFjIheDLbMekpdMQw" target="_blank" rel="noopener noreferrer" aria-label="취미 영상 보기, YouTube 새 창">📺 취미 영상 보기 ↗</a>
      </div>

      <!-- 탭 1: 🖌️ 마음대로 그림 그리기 -->
      <div class="hobby-tab-content active" id="tabContentDraw">
        <div class="hobby-draw-container">
          <!-- 도구 사이드바 -->
          <div class="hobby-draw-sidebar">
            <div>
              <div class="hobby-draw-section-title">🖼️ 밑그림 고르기</div>
              <select class="draw-template-select" id="drawTemplateSelect">
                ${Object.entries(SKETCH_TEMPLATES).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}
              </select>
            </div>

            <div>
              <div class="hobby-draw-section-title">✏️ 그리기 도구</div>
              <div class="draw-tool-row">
                <button type="button" class="draw-tool-btn active" data-tool="brush" data-size="8">굵은 붓</button>
                <button type="button" class="draw-tool-btn" data-tool="brush" data-size="16">크레파스</button>
                <button type="button" class="draw-tool-btn" data-tool="eraser" data-size="24">지우개</button>
              </div>
            </div>

            <div>
              <div class="hobby-draw-section-title">🎨 고운 색상 팔레트</div>
              <div class="draw-color-grid">
                <button type="button" class="draw-color-btn active" data-color="#eb4d4b" style="background: #eb4d4b;" title="빨강"></button>
                <button type="button" class="draw-color-btn" data-color="#f0932b" style="background: #f0932b;" title="주황"></button>
                <button type="button" class="draw-color-btn" data-color="#f6e58d" style="background: #f9ca24;" title="노랑"></button>
                <button type="button" class="draw-color-btn" data-color="#6ab04c" style="background: #6ab04c;" title="초록"></button>
                <button type="button" class="draw-color-btn" data-color="#22a6b3" style="background: #22a6b3;" title="하늘"></button>
                <button type="button" class="draw-color-btn" data-color="#4834d4" style="background: #4834d4;" title="파랑"></button>
                <button type="button" class="draw-color-btn" data-color="#be2edd" style="background: #be2edd;" title="보라"></button>
                <button type="button" class="draw-color-btn" data-color="#2d3436" style="background: #2d3436;" title="검정"></button>
              </div>
            </div>

            <div>
              <div class="hobby-draw-section-title">🌸 예쁜 스탬프 콕콕</div>
              <div class="draw-stamp-row">
                <button type="button" class="draw-stamp-btn" data-stamp="🌸" title="꽃">🌸</button>
                <button type="button" class="draw-stamp-btn" data-stamp="⭐" title="별">⭐</button>
                <button type="button" class="draw-stamp-btn" data-stamp="💖" title="하트">💖</button>
                <button type="button" class="draw-stamp-btn" data-stamp="☀️" title="해">☀️</button>
                <button type="button" class="draw-stamp-btn" data-stamp="🌻" title="해바라기">🌻</button>
              </div>
            </div>
          </div>

          <!-- 캔버스 영역 -->
          <div class="hobby-canvas-wrapper">
            <div class="hobby-canvas-bar">
              <span class="canvas-status" id="canvasStatusText">도화지에 마음껏 색칠하고 그려보세요 😊</span>
              <div class="hobby-canvas-actions">
                <button type="button" id="btnClearCanvas">🗑️ 새로 그리기</button>
                <button type="button" class="btn-save-canvas" id="btnSaveCanvas">💾 그림 저장하기</button>
              </div>
            </div>
            <canvas class="hobby-paint-canvas" id="hobbyPaintCanvas"></canvas>
          </div>
        </div>
      </div>

      <!-- 탭 2: ✍️ 정겨운 마음 글쓰기 -->
      <div class="hobby-tab-content" id="tabContentWrite">
        <div class="hobby-write-container">
          <!-- 추천 글감 카드 -->
          <div class="hobby-write-prompts">
            <div class="hobby-write-prompts-title">💡 쓰고 싶은 이야기 주제를 골라보세요</div>
            <div class="hobby-prompt-chips" id="writingPromptChips">
              ${WRITING_PROMPTS.map((p, idx) => `
                <button type="button" class="hobby-prompt-chip ${idx === 0 ? 'active' : ''}" data-prompt-idx="${idx}">
                  ${p.title}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 원고지 / 편지 에디터 -->
          <div class="hobby-paper-wrapper">
            <input type="text" class="hobby-paper-title-input" id="writingTitleInput" value="${WRITING_PROMPTS[0].title}" placeholder="글 제목을 입력하세요">
            <textarea class="hobby-paper-textarea" id="writingContentArea" placeholder="이곳에 어르신의 따뜻한 이야기를 자유롭게 적어보세요...">${WRITING_PROMPTS[0].template}</textarea>

            <!-- 빠른 문구 칩 -->
            <div class="hobby-quick-phrases">
              <span>빠른 문구:</span>
              ${QUICK_PHRASES.map(phrase => `
                <button type="button" class="hobby-phrase-chip" data-phrase="${phrase}">${phrase}</button>
              `).join('')}
            </div>

            <div class="hobby-write-actions">
              <button type="button" class="btn-read-aloud" id="btnReadAloudWriting">🔊 AI 친구가 읽어주기</button>
              <button type="button" class="btn-save-writing" id="btnSaveWriting">💾 내 글 보관하기</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 탭 3: 🔍 나의 취미 찾기 -->
      <div class="hobby-tab-content" id="tabContentFinder">
        <div class="hobby-finder-container" id="hobbyFinderContainer">
          <div class="hobby-finder-intro">
            <h3>🌟 어르신에게 딱 맞는 행복한 취미를 찾아드려요!</h3>
            <p>질문을 읽고 가장 마음에 드는 그림이나 보기를 콕 눌러보세요 😊</p>
          </div>

          <div class="hobby-finder-card" id="hobbyQuestionCard">
            <!-- 질문과 선택지가 동적으로 렌더링됨 -->
          </div>
        </div>
      </div>

      <!-- 탭 4: 🖼️ 나의 작품 보관함 -->
      <div class="hobby-tab-content" id="tabContentGallery">
        <div class="hobby-gallery-container">
          <div class="hobby-gallery-header">
            <h3>🏆 어르신이 정성껏 만드신 소중한 작품들</h3>
            <span style="color: #795548; font-weight: 700;">오늘의 멋진 솜씨를 언제든 다시 볼 수 있어요</span>
          </div>
          <div class="hobby-gallery-grid" id="hobbyGalleryGrid">
            <!-- 작품들이 동적으로 렌더링됨 -->
          </div>
        </div>
      </div>
    `;

    document.body.append(room);

    // =========================================================================
    // 3. 캔버스 드로잉 엔진 초기화
    // =========================================================================
    const canvas = room.querySelector('#hobbyPaintCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#eb4d4b';
    let currentTool = 'brush';
    let currentSize = 8;
    let currentStamp = null;
    let currentTemplate = 'blank';

    function initCanvasDimensions() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = (rect.width || 680) * dpr;
      canvas.height = (rect.height || 420) * dpr;
      ctx.scale(dpr, dpr);
      renderCanvasBackground();
    }

    function renderCanvasBackground() {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 680;
      const h = rect.height || 420;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      if (SKETCH_TEMPLATES[currentTemplate]?.draw) {
        SKETCH_TEMPLATES[currentTemplate].draw(ctx, w, h);
      }
    }

    function getCanvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      if (currentStamp) {
        // 스탬프 찍기 모드
        const { x, y } = getCanvasCoords(e);
        ctx.save();
        ctx.font = '38px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentStamp, x, y);
        ctx.restore();
        playPencilSound();
        return;
      }

      isDrawing = true;
      const { x, y } = getCanvasCoords(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
      ctx.lineWidth = currentSize;
      playPencilSound();
    }

    function doDraw(e) {
      if (!isDrawing || currentStamp) return;
      e.preventDefault();
      const { x, y } = getCanvasCoords(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    function endDraw() {
      if (isDrawing) {
        ctx.closePath();
        isDrawing = false;
      }
    }

    function playPencilSound() {
      // 가벼운 드로잉 터치 피드백
      try {
        const audioCtx = window.AudioContext || window.webkitAudioContext;
        if (!audioCtx) return;
        const ac = new audioCtx();
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ac.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.05);
      } catch {}
    }

    // 마우스 이벤트
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', doDraw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);

    // 터치 이벤트
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', doDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    // 템플릿 변경
    room.querySelector('#drawTemplateSelect').addEventListener('change', (e) => {
      currentTemplate = e.target.value;
      renderCanvasBackground();
      window.VoiceManager?.speak?.(SKETCH_TEMPLATES[currentTemplate].name + ' 밑그림이에요. 예쁘게 색칠해보세요!');
    });

    // 도구 선택 (붓/크레파스/지우개)
    room.querySelectorAll('.draw-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        room.querySelectorAll('.draw-tool-btn').forEach(b => b.classList.remove('active'));
        room.querySelectorAll('.draw-stamp-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool;
        currentSize = parseInt(btn.dataset.size, 10);
        currentStamp = null;
        room.querySelector('#canvasStatusText').textContent = btn.textContent + ' 모드입니다.';
      });
    });

    // 컬러 팔레트 선택
    room.querySelectorAll('.draw-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        room.querySelectorAll('.draw-color-btn').forEach(b => b.classList.remove('active'));
        room.querySelectorAll('.draw-stamp-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentColor = btn.dataset.color;
        if (currentTool === 'eraser') {
          currentTool = 'brush';
          room.querySelector('.draw-tool-btn[data-tool="brush"]').classList.add('active');
          room.querySelector('.draw-tool-btn[data-tool="eraser"]').classList.remove('active');
        }
        currentStamp = null;
      });
    });

    // 스탬프 선택
    room.querySelectorAll('.draw-stamp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isAlready = btn.classList.contains('active');
        room.querySelectorAll('.draw-stamp-btn').forEach(b => b.classList.remove('active'));
        if (isAlready) {
          currentStamp = null;
          room.querySelector('#canvasStatusText').textContent = '도화지에 자유롭게 그려보세요.';
        } else {
          btn.classList.add('active');
          currentStamp = btn.dataset.stamp;
          room.querySelector('#canvasStatusText').textContent = currentStamp + ' 스탬프를 도화지에 콕 눌러 찍어보세요!';
          window.VoiceManager?.speak?.(btn.title + ' 스탬프를 도화지에 콕 찍어보세요.');
        }
      });
    });

    // 새로 그리기
    room.querySelector('#btnClearCanvas').addEventListener('click', () => {
      if (confirm('도화지를 깨끗하게 지우고 새로 그리시겠어요?')) {
        renderCanvasBackground();
      }
    });

    // 그림 저장하기
    room.querySelector('#btnSaveCanvas').addEventListener('click', () => {
      const dataUrl = canvas.toDataURL('image/png');
      const tName = SKETCH_TEMPLATES[currentTemplate]?.name || '자유 그림';
      if (!saveWorkItem({
        type: 'draw',
        title: tName + ' 작품',
        data: dataUrl
      })) return;
      alert('🎨 어르신의 멋진 그림이 보관함에 잘 저장되었습니다! 갤러리 탭에서 언제든 보실 수 있어요.');
      window.VoiceManager?.speak?.('어르신의 고운 그림이 작품 보관함에 예쁘게 저장되었어요. 정말 훌륭하세요!');
      renderGallery();
    });

    // =========================================================================
    // 4. 글쓰기 에디터 & 낭독 기능
    // =========================================================================
    const promptChipsContainer = room.querySelector('#writingPromptChips');
    const titleInput = room.querySelector('#writingTitleInput');
    const contentArea = room.querySelector('#writingContentArea');

    promptChipsContainer.querySelectorAll('.hobby-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        promptChipsContainer.querySelectorAll('.hobby-prompt-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const idx = parseInt(chip.dataset.promptIdx, 10);
        const p = WRITING_PROMPTS[idx];
        titleInput.value = p.title;
        contentArea.value = p.template;
        window.VoiceManager?.speak?.(p.title + ' 주제예요. 편안하게 이야기를 적어보세요.');
      });
    });

    // 빠른 문구 칩 삽입
    room.querySelectorAll('.hobby-phrase-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.dataset.phrase + ' ';
        contentArea.value += text;
        contentArea.focus();
        playPencilSound();
      });
    });

    // AI 친구 낭독하기
    room.querySelector('#btnReadAloudWriting').addEventListener('click', () => {
      const text = (titleInput.value ? titleInput.value + '.\n' : '') + contentArea.value;
      if (!text.trim()) {
        alert('먼저 글을 작성해주세요.');
        return;
      }
      window.VoiceManager?.speak?.(text);
    });

    // 내 글 보관하기
    room.querySelector('#btnSaveWriting').addEventListener('click', () => {
      const title = titleInput.value.trim() || '소중한 나의 글';
      const content = contentArea.value.trim();
      if (!content) {
        alert('내용을 작성해주세요.');
        return;
      }
      if (!saveWorkItem({
        type: 'write',
        title: title,
        content: content
      })) return;
      alert('✍️ 어르신의 정겨운 글이 보관함에 안전하게 저장되었습니다!');
      window.VoiceManager?.speak?.('어르신의 따뜻한 마음이 담긴 글이 잘 저장되었어요. 참 고맙습니다.');
      renderGallery();
    });

    // =========================================================================
    // 5. 나의 취미 찾기 탐색기 로직
    // =========================================================================
    let currentQIdx = 0;
    const scores = { art: 0, write: 0, music: 0, garden: 0 };

    function renderQuestion() {
      const card = room.querySelector('#hobbyQuestionCard');
      if (currentQIdx >= HOBBY_QUESTIONS.length) {
        // 결과 도출
        let bestKey = 'art';
        let maxScore = -1;
        for (const [k, v] of Object.entries(scores)) {
          if (v > maxScore) {
            maxScore = v;
            bestKey = k;
          }
        }
        const res = HOBBY_RESULTS[bestKey] || HOBBY_RESULTS.art;

        card.innerHTML = `
          <div class="hobby-result-card">
            <div class="hobby-result-badge">${res.badge}</div>
            <h3 class="hobby-result-title">${res.title}</h3>
            <p class="hobby-result-desc">${res.desc}</p>
            <div class="hobby-recommend-actions">
              <button type="button" class="hobby-recommend-btn primary" id="btnGoRecommendedHobby">
                ${res.actionText}
              </button>
              <button type="button" class="hobby-recommend-btn secondary" id="btnRestartHobbyTest">
                🔄 다시 찾아보기
              </button>
            </div>
          </div>
        `;

        window.VoiceManager?.speak?.('취미 찾기가 완료되었어요! 어르신은 ' + res.title + '이세요. ' + res.desc);

        // 추천 액션 버튼 핸들러
        card.querySelector('#btnGoRecommendedHobby').addEventListener('click', () => {
          if (res.actionLink === 'karaoke') {
            room.close();
            window.openDedicatedKaraokeRoom?.();
          } else if (res.actionTab) {
            switchTab(res.actionTab);
          }
        });

        card.querySelector('#btnRestartHobbyTest').addEventListener('click', () => {
          currentQIdx = 0;
          for (const k in scores) scores[k] = 0;
          renderQuestion();
        });
        return;
      }

      const qObj = HOBBY_QUESTIONS[currentQIdx];
      card.innerHTML = `
        <div class="hobby-q-header">
          <span>${qObj.q}</span>
        </div>
        <div class="hobby-choice-grid">
          ${qObj.choices.map((c, cIdx) => `
            <button type="button" class="hobby-choice-btn" data-choice-idx="${cIdx}">
              <span class="choice-emoji">${c.emoji}</span>
              <span class="choice-text">${c.text}</span>
            </button>
          `).join('')}
        </div>
      `;

      window.VoiceManager?.speak?.(qObj.q);

      card.querySelectorAll('.hobby-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cIdx = parseInt(btn.dataset.choiceIdx, 10);
          const choice = qObj.choices[cIdx];
          for (const [k, pts] of Object.entries(choice.score)) {
            scores[k] = (scores[k] || 0) + pts;
          }
          btn.classList.add('selected');
          playPencilSound();
          setTimeout(() => {
            currentQIdx++;
            renderQuestion();
          }, 350);
        });
      });
    }

    // =========================================================================
    // 6. 나의 작품 갤러리 렌더링
    // =========================================================================
    const escapeMarkup = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function renderGallery() {
      const grid = room.querySelector('#hobbyGalleryGrid');
      const list = loadSavedWorks();

      if (list.length === 0) {
        grid.innerHTML = `
          <div class="hobby-gallery-empty" style="grid-column: 1 / -1;">
            <span style="font-size: 3.5rem;">🎨 ✍️</span>
            <span>아직 보관된 작품이 없습니다.</span>
            <span style="font-size: 1.1rem; color: #747d8c;">[그림 그리기]나 [마음 글쓰기]에서 나만의 작품을 완성하고 저장해보세요!</span>
          </div>
        `;
        return;
      }

      grid.innerHTML = list.map(item => `
        <div class="hobby-gallery-card" data-work-id="${escapeMarkup(item.id)}">
          ${item.type === 'draw' ? `
            <img class="hobby-gallery-img" src="${item.data}" alt="${escapeMarkup(item.title)}">
          ` : `
            <div class="hobby-gallery-writing-preview">
              <strong style="color: #2f3542; margin-bottom: 0.3rem;">${escapeMarkup(item.title)}</strong>
              <div>${escapeMarkup(item.content).replace(/\n/g, '<br>')}</div>
            </div>
          `}
          <h4 class="hobby-gallery-card-title">${escapeMarkup(item.title)}</h4>
          <div class="hobby-gallery-card-date">${escapeMarkup(item.date)}</div>
          <div class="hobby-gallery-card-actions">
            ${item.type === 'write' ? `
              <button type="button" class="care-btn" style="padding: 0.35rem 0.8rem; font-size: 0.95rem;" data-read-id="${escapeMarkup(item.id)}">🔊 읽기</button>
            ` : `
              <a href="${item.data}" download="${escapeMarkup(item.title)}.png" class="care-btn" style="padding: 0.35rem 0.8rem; font-size: 0.95rem; text-decoration: none;">⬇️ 다운로드</a>
            `}
            <button type="button" class="hobby-gallery-btn-del" data-del-id="${escapeMarkup(item.id)}">🗑️ 삭제</button>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('[data-read-id]').forEach(btn => btn.addEventListener('click', () => {
        const item = list.find(work => String(work.id) === btn.dataset.readId);
        if (item) window.VoiceManager?.speak?.(item.content);
      }));

      grid.querySelectorAll('.hobby-gallery-btn-del').forEach(btn => {
        btn.addEventListener('click', () => {
          if (confirm('이 작품을 보관함에서 삭제하시겠습니까?')) {
            deleteWorkItem(btn.dataset.delId);
            renderGallery();
          }
        });
      });
    }

    // =========================================================================
    // 7. 탭 전환 제어
    // =========================================================================
    function switchTab(tabId) {
      room.querySelectorAll('.hobby-tab-btn[data-tab]').forEach(b => {
        const isTarget = b.dataset.tab === tabId;
        b.classList.toggle('active', isTarget);
        b.setAttribute('aria-selected', isTarget);
      });

      room.querySelectorAll('.hobby-tab-content').forEach(c => {
        c.classList.remove('active');
      });

      if (tabId === 'draw') {
        room.querySelector('#tabContentDraw').classList.add('active');
        setTimeout(initCanvasDimensions, 100);
      } else if (tabId === 'write') {
        room.querySelector('#tabContentWrite').classList.add('active');
      } else if (tabId === 'finder') {
        room.querySelector('#tabContentFinder').classList.add('active');
        renderQuestion();
      } else if (tabId === 'gallery') {
        room.querySelector('#tabContentGallery').classList.add('active');
        renderGallery();
      }
    }

    room.querySelectorAll('.hobby-tab-btn[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
      });
    });

    // =========================================================================
    // 8. 모달 열기 / 닫기
    // =========================================================================
    function openHobbyRoom() {
      window.VoiceManager?.stopSpeaking();
      room.showModal();
      switchTab('draw');
      window.VoiceManager?.speak?.('나만의 취미방에 오신 것을 환영해요! 그림도 그리고 글도 쓰며 즐거운 시간을 보내보아요.');
    }

    function closeHobbyRoom() {
      window.VoiceManager?.stopSpeaking();
      room.close();
    }

    room.querySelector('#hobbyYoutubeChannel').addEventListener('click', () => window.VoiceManager?.stopSpeaking());
    window.openHobbyRoom = openHobbyRoom;
    window.closeHobbyRoom = closeHobbyRoom;

    document.getElementById('openHobbyRoom').onclick = openHobbyRoom;
    room.querySelector('#closeHobbyRoom').onclick = closeHobbyRoom;

    // 모달 배경 클릭 시 닫기
    room.addEventListener('click', (e) => {
      const rect = room.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        closeHobbyRoom();
      }
    });

    // ESC 키로 닫힐 때 음성 정지 동기화
    room.addEventListener('cancel', () => {
      window.VoiceManager?.stopSpeaking();
    });

    // 히어로 화면 가림 동기화
    const sync = () => {
      const hero = document.querySelector('.hero-classroom');
      if (hero) entry.hidden = hero.hidden;
    };
    sync();
    const heroEl = document.querySelector('.hero-classroom');
    if (heroEl) {
      new MutationObserver(sync).observe(heroEl, { attributes: true, attributeFilter: ['hidden'] });
    }
  });
})();
