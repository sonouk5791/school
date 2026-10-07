/**
 * 기억정원 디지털 AI 학교 - 어르신 친화 코어 인터랙션 스크립트
 * - 한국어 음성 안내 (Web Speech API)
 * - 한 화면 한 가지 주요 기능 전환
 * - 전 화면 '처음으로' 복귀 지원
 * - 큰 글씨 확대 토글
 */

const SeniorGardenApp = {
  soundEnabled: true,
  fontZoomed: false,
  currentView: 'main',
  currentSenior: {
    name: '김순자 어르신',
    group: '사랑반',
    character: '콩이'
  },

  // 음성 안내 발화
  speak(text) {
    if (!this.soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85; // 어르신을 위한 편안하고 차분한 속도
      utterance.pitch = 1.05; // 온화하고 따뜻한 톤
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('음성 안내 오류:', e);
    }
  },

  // 화면 전환 (한 화면에는 한 가지 주요 기능만 배치)
  switchView(viewName) {
    this.currentView = viewName;

    // 모든 서브 화면 및 메인 화면 숨김/표시
    const mainStage = document.getElementById('view-main');
    const subviews = document.querySelectorAll('.sga-subview');
    const topHomeBtn = document.getElementById('topbarHomeBtn');
    const bottomBtns = document.querySelectorAll('.sga-bottom-btn');

    // 하단 버튼 활성 상태 초기화
    bottomBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      }
    });

    if (viewName === 'main') {
      if (mainStage) mainStage.style.display = 'flex';
      subviews.forEach(v => v.classList.remove('active'));
      if (topHomeBtn) topHomeBtn.style.display = 'none';
      this.speak('기억정원 마을 메인 화면입니다. 함께할 친구를 눌러보세요.');
    } else {
      if (mainStage) mainStage.style.display = 'none';
      subviews.forEach(v => {
        if (v.id === `view-${viewName}`) {
          v.classList.add('active');
        } else {
          v.classList.remove('active');
        }
      });
      if (topHomeBtn) topHomeBtn.style.display = 'inline-flex';

      // 화면별 음성 안내
      if (viewName === 'today-activities') {
        this.speak('오늘의 활동 화면입니다. 오늘 함께할 수업을 확인하세요.');
      } else if (viewName === 'garden-tour') {
        this.speak('기억정원 산책 화면입니다. 따뜻한 마을 풍경을 둘러보세요.');
      } else if (viewName === 'my-records') {
        this.speak('내 활동 기록 화면입니다. 어르신의 예쁜 꽃 도장판을 확인해보세요.');
      } else if (viewName === 'care-dashboard') {
        this.speak('선생님과 관리자 공간입니다.');
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 소리 토글
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const btn = document.getElementById('btnSoundToggle');
    if (btn) {
      if (this.soundEnabled) {
        btn.classList.add('active');
        btn.innerHTML = '<span>🔊</span><span>소리 켜짐</span>';
        this.speak('선생님 음성 안내가 켜졌습니다.');
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<span>🔈</span><span>소리 꺼짐</span>';
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      }
    }
  },

  // 글자 크기 확대 토글
  toggleFontZoom() {
    this.fontZoomed = !this.fontZoomed;
    const btn = document.getElementById('btnFontZoom');
    if (document.body) {
      document.body.classList.toggle('font-zoomed', this.fontZoomed);
    }
    if (btn) {
      if (this.fontZoomed) {
        btn.classList.add('active');
        btn.innerHTML = '<span>🔤</span><span>글자 보통</span>';
        this.speak('글자 크기를 아주 크게 확대했습니다.');
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<span>🔤</span><span>글자 크게</span>';
        this.speak('글자 크기를 기본 크기로 변경했습니다.');
      }
    }
  },

  // 캐릭터 방 이동 처리
  enterRoom(roomKey, roomUrl, roomTitle) {
    const messages = {
      kongi: '콩이의 운동방으로 이동합니다. 의자에 앉아 시원하게 몸을 움직여요.',
      tori: '토리의 놀이방으로 이동합니다. 재미있는 그림 찾기와 퍼즐 놀이를 해요.',
      nabi: '나비의 학습방으로 이동합니다. 오늘 날짜와 정다운 옛이야기를 배워요.',
      bori: '보리의 취미방으로 이동합니다. 추억의 노래를 듣고 예쁘게 색칠해요.'
    };

    const msg = messages[roomKey] || `${roomTitle}으로 이동합니다.`;
    this.speak(msg);

    // 차분하고 부드러운 화면 이동 (갑작스러운 전환 방지)
    setTimeout(() => {
      window.location.href = roomUrl;
    }, 400);
  }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 상단 소리 토글
  const btnSound = document.getElementById('btnSoundToggle');
  if (btnSound) {
    btnSound.addEventListener('click', () => SeniorGardenApp.toggleSound());
  }

  // 상단 글자 크기 조절
  const btnFont = document.getElementById('btnFontZoom');
  if (btnFont) {
    btnFont.addEventListener('click', () => SeniorGardenApp.toggleFontZoom());
  }

  // 상단 및 서브화면의 모든 '처음으로' 버튼 이벤트 등록
  document.querySelectorAll('.btn-home-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      SeniorGardenApp.switchView('main');
    });
  });

  // 하단 4대 추가 메뉴 버튼 클릭 이벤트
  document.querySelectorAll('.sga-bottom-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view');
      if (targetView) {
        if (SeniorGardenApp.currentView === targetView) {
          // 이미 해당 뷰이면 메인으로 토글 복귀
          SeniorGardenApp.switchView('main');
        } else {
          SeniorGardenApp.switchView(targetView);
        }
      }
    });
  });

  // 메인 화면 4대 캐릭터 공간 카드 클릭 이벤트
  document.querySelectorAll('.char-room-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const roomKey = card.getAttribute('data-room-key');
      const roomUrl = card.getAttribute('href') || card.getAttribute('data-url');
      const roomTitle = card.getAttribute('data-title');
      if (roomUrl) {
        SeniorGardenApp.enterRoom(roomKey, roomUrl, roomTitle);
      }
    });
  });

  // 서브화면 내부 프로그램 바로가기 버튼
  document.querySelectorAll('.btn-start-program').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = btn.getAttribute('data-url');
      const name = btn.getAttribute('data-name');
      if (url) {
        SeniorGardenApp.speak(`${name} 프로그램을 시작합니다.`);
        setTimeout(() => {
          window.location.href = url;
        }, 350);
      }
    });
  });

  // 관리자 탭 전환 이벤트
  document.querySelectorAll('.admin-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      tabBtn.classList.add('active');
      const tabTarget = tabBtn.getAttribute('data-admin-tab');
      const targetContent = document.getElementById(`admin-tab-${tabTarget}`);
      if (targetContent) targetContent.style.display = 'block';
    });
  });

  // 초기 안내 멘트 (페이지 진입 후 0.6초 뒤 온화하게 발화)
  setTimeout(() => {
    if (SeniorGardenApp.soundEnabled) {
      SeniorGardenApp.speak('기억정원 디지털 AI 학교에 오신 것을 환영합니다. 함께할 친구를 눌러보세요.');
    }
  }, 600);
});
