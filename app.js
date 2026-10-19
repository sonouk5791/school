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

  // 3. 다정한 보리의 음성 안내 (Web Speech API TTS)
  const greetingScript = "안녕하세요! 저는 보리예요. 오늘도 함께해서 참 좋은 날이에요. 하고 싶은 활동을 골라보세요!";
  
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

    window.speechSynthesis.speak(utterance);
  }

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

  // 5. 활동방 모달 처리
  const roomModal = document.getElementById('roomModal');
  const modalRoomIcon = document.getElementById('modalRoomIcon');
  const modalRoomTitle = document.getElementById('modalRoomTitle');
  const modalRoomDesc = document.getElementById('modalRoomDesc');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');

  const roomIcons = {
    '운동방': '🏃',
    '놀이방': '🧩',
    '학습방': '📖',
    '취미정원': '🎨'
  };

  document.querySelectorAll('.activity-card').forEach(card => {
    card.addEventListener('click', () => {
      playChord();
      const room = card.getAttribute('data-room');
      const desc = card.getAttribute('data-desc');

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
      alert(`🎉 ${modalRoomTitle.textContent} 활동 프로그램이 곧 시작됩니다!`);
      roomModal.classList.add('hidden');
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
