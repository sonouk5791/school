/**
 * 디지털 학교 - 어르신을 위한 전용 신나는 노래방 (Dedicated Senior Karaoke Room)
 * 1. 홈 화면 바로가기 카드 제공
 * 2. 전용 노래방 모달 창과 고음질 화음 반주 & 실시간 가사 하이라이트
 * 3. 5대 대표 애창곡(고향의 봄, 퐁당퐁당, 기차길 옆, 아리랑, 오빠 생각) 자유 선곡
 * 4. AI 친구와 함께 부르기, 박수치기, 탬버린, 어깨춤 인터랙션
 */
(()=>{
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. 홈 화면 노래방 진입 카드 생성
    const entry = document.createElement('section');
    entry.className = 'care-card karaoke-room-entry';
    entry.innerHTML = `
      <div>
        <h2>🎤 신나는 트로트 & 애창곡 노래방</h2>
        <p>내 나이가 어때서, 남행열차, 안동역에서 등 정겨운 트로트와 옛노래를 신나게 불러보아요.</p>
      </div>
      <button type="button" class="care-btn primary" id="openKaraokeRoom">노래방 들어가기 🎵</button>
    `;

    // .joint-room-entry 뒤에, 없으면 .friend-selection 뒤에 배치
    const jointEntry = document.querySelector('.joint-room-entry');
    const friendSelection = document.querySelector('.friend-selection');
    if (jointEntry) {
      jointEntry.after(entry);
    } else if (friendSelection) {
      friendSelection.after(entry);
    } else {
      document.querySelector('.section-lessons')?.before(entry);
    }

    // 2. 노래방 전용 모달 다이얼로그 생성
    const room = document.createElement('dialog');
    room.className = 'karaoke-room';
    room.id = 'karaokeModalRoom';
    room.setAttribute('aria-labelledby', 'karaokeModalTitle');

    const songs = window.KaraokeEngine?.SONGS || [];

    room.innerHTML = `
      <div class="karaoke-room-header">
        <div>
          <h2 id="karaokeModalTitle">🎤 신나는 트로트 & 애창곡 노래방</h2>
          <div class="room-sub">부르고 싶은 트로트와 옛노래를 골라 AI 친구와 함께 흥겹게 불러보아요 🌸</div>
        </div>
        <button type="button" class="care-btn" id="closeKaraokeRoom">◀ 방 나가기</button>
      </div>

      <!-- 선곡 탭 바 -->
      <div class="karaoke-song-selector" role="tablist" aria-label="노래 선택">
        ${songs.map((s, idx) => `
          <button type="button" class="karaoke-song-chip ${idx === 0 ? 'active' : ''}" data-song-idx="${idx}" role="tab" aria-selected="${idx === 0}">
            ${s.emoji} ${s.title}
          </button>
        `).join('')}
      </div>

      <!-- 메인 노래방 무대 -->
      <div class="karaoke-dedicated-stage" id="karaokeDedicatedStage">
        <div class="karaoke-theme-badge" id="karaokeRoomThemeBadge">
          ${songs[0]?.themeBadge || '🌸 정겨운 노래방'}
        </div>

        <!-- 대형 가사 스크린 -->
        <div class="karaoke-room-screen">
          <div class="karaoke-screen-song-title" id="karaokeRoomSongTitle">
            ${songs[0]?.emoji || '🌸'} <${songs[0]?.title || '고향의 봄'}> 노래방 반주
          </div>
          <div class="karaoke-lyrics-flow" id="karaokeRoomLyricsTrack">
            <!-- 실시간 가사 하이라이트 렌더링 -->
          </div>
          <div class="karaoke-score-banner" id="karaokeRoomCheerBanner"></div>
        </div>

        <!-- 중앙 캐릭터 & 재생/함께 부르기 버튼 -->
        <div class="karaoke-center-row">
          <img src="assets/images/ai_puppy_heart.jpg" alt="노래 친구" class="karaoke-mascot-avatar" id="karaokeRoomMascot">
          <div class="karaoke-play-controls">
            <button type="button" class="btn-karaoke-action play" id="btnKaraokeRoomPlay">
              🎵 반주 시작하기
            </button>
            <button type="button" class="btn-karaoke-action sing-ai" id="btnKaraokeRoomSingAi">
              🎙️ 친구와 함께 부르기
            </button>
          </div>
        </div>

        <!-- 하단 참여 악기 & 응원 툴바 -->
        <div class="karaoke-cheer-toolbar">
          <button type="button" class="btn-karaoke-cheer" id="btnKaraokeRoomClap">
            <span class="cheer-icon">👏</span>
            <span>박수 치기 (짝짝짝!)</span>
          </button>
          <button type="button" class="btn-karaoke-cheer" id="btnKaraokeRoomTambourine">
            <span class="cheer-icon">🥁</span>
            <span>탬버린 흔들기 (찰랑!)</span>
          </button>
          <button type="button" class="btn-karaoke-cheer" id="btnKaraokeRoomDance">
            <span class="cheer-icon">💃</span>
            <span>어깨춤 덩실덩실</span>
          </button>
        </div>
      </div>

      <!-- TJ 노래방 공식 유튜브 채널 (UCZUhx8ClCv6paFW7qi3qljg) 및 인기 애창곡 연동 -->
      <section class="karaoke-tj-section">
        <div class="karaoke-tj-header">
          <div>
            <h3>📺 TJ 노래방 공식 유튜브 애창곡 모음</h3>
            <p>TJ 노래방 공식 채널(@TJ노래방TJKaraoke)의 생생한 트로트 반주 영상으로 더 많은 노래를 즐겨보세요.</p>
          </div>
          <a class="care-btn primary btn-tj-channel" href="https://www.youtube.com/channel/UCZUhx8ClCv6paFW7qi3qljg" target="_blank" rel="noopener noreferrer" aria-label="TJ 노래방 공식 유튜브 채널 바로가기, 새 창">
            ▶ TJ 노래방 채널 바로가기 ↗
          </a>
        </div>

        <div class="karaoke-tj-grid">
          <a class="tj-song-card" href="https://www.youtube.com/results?search_query=TJ노래방+내나이가어때서" target="_blank" rel="noopener noreferrer">
            <span class="tj-song-icon">🌸</span>
            <div class="tj-song-info">
              <strong>내 나이가 어때서</strong>
              <span>오승근 · 신나는 트로트</span>
            </div>
            <span class="tj-link-tag">반주 영상 보기 ↗</span>
          </a>

          <a class="tj-song-card" href="https://www.youtube.com/results?search_query=TJ노래방+안동역에서" target="_blank" rel="noopener noreferrer">
            <span class="tj-song-icon">🚂</span>
            <div class="tj-song-info">
              <strong>안동역에서</strong>
              <span>진성 · 정겨운 애창곡</span>
            </div>
            <span class="tj-link-tag">반주 영상 보기 ↗</span>
          </a>

          <a class="tj-song-card" href="https://www.youtube.com/results?search_query=TJ노래방+남행열차" target="_blank" rel="noopener noreferrer">
            <span class="tj-song-icon">🌊</span>
            <div class="tj-song-info">
              <strong>남행열차</strong>
              <span>김수희 · 흥겨운 가요</span>
            </div>
            <span class="tj-link-tag">반주 영상 보기 ↗</span>
          </a>

          <a class="tj-song-card" href="https://www.youtube.com/results?search_query=TJ노래방+찔레꽃" target="_blank" rel="noopener noreferrer">
            <span class="tj-song-icon">🌾</span>
            <div class="tj-song-info">
              <strong>찔레꽃</strong>
              <span>백난아 · 추억의 명곡</span>
            </div>
            <span class="tj-link-tag">반주 영상 보기 ↗</span>
          </a>

          <a class="tj-song-card" href="https://www.youtube.com/results?search_query=TJ노래방+고향역" target="_blank" rel="noopener noreferrer">
            <span class="tj-song-icon">🍁</span>
            <div class="tj-song-info">
              <strong>고향역</strong>
              <span>나훈아 · 가슴 찡한 고향 노래</span>
            </div>
            <span class="tj-link-tag">반주 영상 보기 ↗</span>
          </a>

          <a class="tj-song-card" href="https://www.youtube.com/results?search_query=TJ노래방+홍시" target="_blank" rel="noopener noreferrer">
            <span class="tj-song-icon">🍊</span>
            <div class="tj-song-info">
              <strong>홍시 (울 엄마)</strong>
              <span>나훈아 · 어머니 생각</span>
            </div>
            <span class="tj-link-tag">반주 영상 보기 ↗</span>
          </a>

          <a class="tj-song-card" href="https://www.youtube.com/results?search_query=TJ노래방+보릿고개" target="_blank" rel="noopener noreferrer">
            <span class="tj-song-icon">🌾</span>
            <div class="tj-song-info">
              <strong>보릿고개</strong>
              <span>진성 · 애절한 추억 노래</span>
            </div>
            <span class="tj-link-tag">반주 영상 보기 ↗</span>
          </a>

          <a class="tj-song-card" href="https://www.youtube.com/results?search_query=TJ노래방+소풍같은인생" target="_blank" rel="noopener noreferrer">
            <span class="tj-song-icon">💖</span>
            <div class="tj-song-info">
              <strong>소풍같은 인생</strong>
              <span>추가열 · 따뜻한 힐링송</span>
            </div>
            <span class="tj-link-tag">반주 영상 보기 ↗</span>
          </a>
        </div>
      </section>
    `;

    document.body.append(room);

    // 3. 홈 화면 가시성 동기화
    const syncVisibility = () => {
      const hero = document.querySelector('.hero-classroom');
      if (hero) {
        entry.hidden = hero.hidden;
      }
    };
    syncVisibility();
    const heroEl = document.querySelector('.hero-classroom');
    if (heroEl) {
      new MutationObserver(syncVisibility).observe(heroEl, {
        attributes: true,
        attributeFilter: ['hidden']
      });
    }

    // 4. 친구 캐릭터 아바타 동기화
    const updateRoomMascot = () => {
      const mascot = room.querySelector('#karaokeRoomMascot');
      const friendImg = document.querySelector('.hero-robot-img');
      if (mascot && friendImg && friendImg.src) {
        mascot.src = friendImg.src;
        mascot.alt = friendImg.alt || '노래 친구';
      }
    };

    // 5. 노래 선택 탭 변경 함수
    const selectSong = (idx) => {
      if (!window.KaraokeEngine) return;
      const songList = window.KaraokeEngine.SONGS;
      const song = songList[idx];
      if (!song) return;

      room.querySelectorAll('.karaoke-song-chip').forEach((chip, i) => {
        const isTarget = i === idx;
        chip.classList.toggle('active', isTarget);
        chip.setAttribute('aria-selected', String(isTarget));
      });

      window.KaraokeEngine.currentSongIndex = idx;
      window.KaraokeEngine.applySongBackground(song);
      window.KaraokeEngine.renderLyricsBox(song);
      const cheerBanner = room.querySelector('#karaokeRoomCheerBanner');
      if (cheerBanner) cheerBanner.innerHTML = '';
      window.KaraokeEngine.startKaraoke(idx);
    };

    // 6. 이벤트 바인딩
    // 방 들어가기
    document.getElementById('openKaraokeRoom')?.addEventListener('click', () => {
      window.VoiceManager?.stopSpeaking();
      updateRoomMascot();

      const engine = window.KaraokeEngine;
      if (engine) {
        const currentIdx = engine.currentSongIndex || 0;
        const currentSong = engine.SONGS[currentIdx] || engine.SONGS[0];
        engine.applySongBackground(currentSong);
        engine.renderLyricsBox(currentSong);
      }

      room.showModal();
      window.VoiceManager?.speak('신나는 트로트 노래방에 오신 것을 환영해요! 부르고 싶은 애창곡을 골라 신나게 불러보아요 🌸', null, { emotion: 'happy' });
    });

    // 방 나가기
    const exitRoom = () => {
      window.KaraokeEngine?.stopKaraoke();
      window.VoiceManager?.stopSpeaking();
      room.close();
    };

    room.querySelector('#closeKaraokeRoom')?.addEventListener('click', exitRoom);
    room.addEventListener('close', () => {
      window.KaraokeEngine?.stopKaraoke();
      window.VoiceManager?.stopSpeaking();
    });

    // 선곡 탭 클릭
    room.querySelectorAll('.karaoke-song-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.songIdx, 10);
        selectSong(idx);
      });
    });

    // 재생 / 멈춤 토글
    room.querySelector('#btnKaraokeRoomPlay')?.addEventListener('click', () => {
      window.KaraokeEngine?.toggleKaraoke();
    });

    // AI 친구와 함께 부르기
    room.querySelector('#btnKaraokeRoomSingAi')?.addEventListener('click', () => {
      window.KaraokeEngine?.singWithAi();
    });

    // 악기 / 응원 버튼
    room.querySelector('#btnKaraokeRoomClap')?.addEventListener('click', () => {
      window.KaraokeEngine?.clapHands();
    });
    room.querySelector('#btnKaraokeRoomTambourine')?.addEventListener('click', () => {
      window.KaraokeEngine?.shakeTambourine();
    });
    room.querySelector('#btnKaraokeRoomDance')?.addEventListener('click', () => {
      window.KaraokeEngine?.danceShoulders();
    });
  });
})();
