/* ==========================================================================
   기억정원 - 라일락마을 시니어 인터랙션 스크립트 (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 날짜 세팅
  const dateEl = document.getElementById('currentDate');
  const now = new Date();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const formattedDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}`;
  if (dateEl) dateEl.textContent = formattedDate;

  // 2. 부드러운 차임벨 사운드 신시사이저 (Web Audio API)
  let audioCtx = null;
  function playChime(freq = 523.25, type = 'sine', duration = 0.4) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      // 벨소리처럼 자연스러운 감쇄
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported:', e);
    }
  }

  // 화음 차임벨 (입장 시 3화음)
  function playChord() {
    playChime(523.25, 'sine', 0.5); // 도
    setTimeout(() => playChime(659.25, 'sine', 0.5), 100); // 미
    setTimeout(() => playChime(783.99, 'sine', 0.6), 200); // 솔
  }

  // 3. 다정한 보리의 음성 안내 (Web Speech API TTS) & 실시간 립싱크 모션
  const greetingScript = "안녕하세요! 저는 보리예요. 오늘도 함께해서 참 좋은 날이에요. 하고 싶은 활동을 골라보세요!";
  const boriCard = document.getElementById('boriCard');
  
  function speakBoriVoice(customText = null) {
    if (!('speechSynthesis' in window)) {
      alert(customText || greetingScript);
      return;
    }
    window.speechSynthesis.cancel(); // 기존 음성 취소

    const textToSpeak = customText || greetingScript;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.88; // 어르신을 위해 천천히
    utterance.pitch = 1.08; // 따뜻하고 살짝 높은 다정한 톤

    // 한국어 음성 필터링
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(v => v.lang.includes('ko') || v.lang.includes('KO'));
    if (koreanVoice) utterance.voice = koreanVoice;

    // 말하기 시작할 때 입모양 립싱크 활성화
    utterance.onstart = () => {
      if (boriCard) boriCard.classList.add('talking');
    };
    // 말이 끝나면 입모양 반달 미소로 복귀
    utterance.onend = () => {
      if (boriCard) boriCard.classList.remove('talking');
    };
    utterance.onerror = () => {
      if (boriCard) boriCard.classList.remove('talking');
    };

    window.speechSynthesis.speak(utterance);
  }

  // 보리 모션 컨트롤러 툴바 이벤트 바인딩
  const motionBtns = document.querySelectorAll('.motion-tool-btn');
  motionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const motion = btn.getAttribute('data-motion');
      playChime(523.25, 'sine', 0.2);

      motionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (boriCard) {
        // 기존 모션 클래스 모두 제거
        boriCard.classList.remove('motion-wave', 'motion-bow', 'motion-nod', 'motion-point', 'motion-walk', 'motion-sit');
        boriCard.classList.add(`motion-${motion}`);
      }

      // 모션별 보리 한마디
      const motionMessages = {
        'wave': '어르신, 반갑습니다! 손을 반갑게 흔들어요!',
        'bow': '정성껏 배꼽손 인사를 드려요. 오늘도 참 반갑습니다.',
        'nod': '네, 어르신 말씀이 맞아요. 보리가 귀 기울여 듣고 있어요.',
        'point': '저기 활동방 버튼들을 콕 눌러보세요!',
        'walk': '보리와 함께 라일락마을 오솔길을 산책해볼까요?',
        'sit': '편안히 의자에 앉아 푹 쉬어가셔도 괜찮아요.'
      };
      if (motionMessages[motion]) {
        speakBoriVoice(motionMessages[motion]);
      }
    });
  });

  // 음성 듣기 버튼 이벤트
  const ttsBtn = document.getElementById('ttsPlayBtn');
  const reListenBtn = document.getElementById('reListenBtn');
  
  if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
      playChime(659.25);
      speakBoriVoice();
    });
  }
  if (reListenBtn) {
    reListenBtn.addEventListener('click', () => {
      playChime(659.25);
      speakBoriVoice();
    });
  }

  // 4. 글씨 크기 조절 토글
  const fontBtn = document.getElementById('fontSizeBtn');
  if (fontBtn) {
    fontBtn.addEventListener('click', () => {
      playChime(440);
      document.body.classList.toggle('font-large');
      const isLarge = document.body.classList.contains('font-large');
      fontBtn.querySelector('.ctrl-label').textContent = isLarge ? '보통 글씨' : '글씨 크게';
    });
  }

  // 5. 활동방 모달 처리 & 실제 페이지 전환
  const roomModal = document.getElementById('roomModal');
  const modalRoomIcon = document.getElementById('modalRoomIcon');
  const modalRoomTitle = document.getElementById('modalRoomTitle');
  const modalRoomDesc = document.getElementById('modalRoomDesc');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');

  const roomIcons = {
    '보리의 쉼터': '🍵',
    '콩이 운동방': '🏃',
    '토리 놀이방': '🧩',
    '나비 학습방': '📖',
    '보리 취미정원': '🎨'
  };

  let currentRoomTarget = 'exercise.html';

  document.querySelectorAll('.activity-card').forEach(card => {
    card.addEventListener('click', () => {
      playChord();
      const room = card.getAttribute('data-room');
      const desc = card.getAttribute('data-desc');
      currentRoomTarget = card.getAttribute('data-target') || 'index.html';

      modalRoomIcon.textContent = roomIcons[room] || '🌸';
      modalRoomTitle.textContent = `${room}으로 가볼까요?`;
      modalRoomDesc.textContent = `${desc}이 준비되어 있어요.`;

      roomModal.classList.remove('hidden');
      
      // 보리 음성으로 공간 안내
      speakBoriVoice(`${room}으로 함께 가보실까요? 준비되셨으면 시작하기를 눌러주세요!`);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      playChime(440);
      window.speechSynthesis.cancel();
      roomModal.classList.add('hidden');
    });
  }

  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      playChord();
      modalConfirmBtn.textContent = '입장하는 중... 🌸';
      setTimeout(() => {
        window.location.href = currentRoomTarget;
      }, 300);
    });
  }

  // 모달 바깥 클릭 시 닫기
  if (roomModal) {
    roomModal.addEventListener('click', (e) => {
      if (e.target === roomModal) {
        roomModal.classList.add('hidden');
        window.speechSynthesis.cancel();
      }
    });
  }

  // 6. 하단 버튼 이벤트
  // 처음 화면 (새로고침)
  const homeBtn = document.getElementById('homeRefreshBtn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      playChime(523.25);
      window.location.reload();
    });
  }

  // 도우미(복지사) 부르기
  const helperBtn = document.getElementById('callHelperBtn');
  if (helperBtn) {
    helperBtn.addEventListener('click', () => {
      playChord();
      alert('🔔 담당 선생님께 신호를 보냈습니다.\n선생님께서 곧 오실 테니 편안하게 기다려주세요! 😊');
      speakBoriVoice('선생님을 불렀어요. 잠시만 기다려주세요!');
    });
  }

  // 관리자(복지사용) 모드
  const adminBtn = document.getElementById('adminBtn');
  const adminModal = document.getElementById('adminModal');
  const closeAdminBtn = document.getElementById('closeAdminBtn');

  if (adminBtn && adminModal) {
    adminBtn.addEventListener('click', () => {
      playChime(440);
      adminModal.classList.remove('hidden');
    });
  }

  if (closeAdminBtn && adminModal) {
    closeAdminBtn.addEventListener('click', () => {
      adminModal.classList.add('hidden');
    });
  }

  // 7. 첫 화면 접속 시 1.2초 뒤 부드러운 환영 차임벨
  setTimeout(() => {
    playChime(523.25, 'sine', 0.6);
  }, 1000);
});
