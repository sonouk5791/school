/**
 * 콩이 3분 체조 플레이어 시스템 (Kongi 3-Minute Seated Senior Exercise)
 * - 원본 3분 영상(캐릭터, 의상, 안경, 배경, 동작 순서 100% 보존)
 * - 차분하고 밝은 여성 톤 (SunHi) 음성 안내 싱크
 * - 동작 약 1초 전 음성 선행 안내, 문장 간 2~4초 여유 휴식
 * - 오디오 자동 덕킹(음성 재생 시 BGM 볼륨 감소)
 * - 대형 실시간 자막, 동작별 원클릭 바로가기, 어르신 친화적 조작계
 */
(() => {
  'use strict';

  // Movement Stages Definition
  const STAGES = [
    { id: 1, title: '시작 인사', icon: '👋', start: 0, end: 15, desc: '콩이와 반갑게 인사해요' },
    { id: 2, title: '자세 준비', icon: '🪑', start: 15, end: 30, desc: '허리를 펴고 두 발을 바닥에 놓아요' },
    { id: 3, title: '양팔 올렸다 내리기', icon: '🙆', start: 30, end: 55, desc: '양팔을 천천히 위로 올려요' },
    { id: 4, title: '오른팔·왼팔 번갈아', icon: '🙋', start: 55, end: 80, desc: '오른팔 먼저, 그 다음 왼팔' },
    { id: 5, title: '몸통과 어깨 움직이기', icon: '🤸', start: 80, end: 105, desc: '어깨를 편안하게 오른쪽 왼쪽' },
    { id: 6, title: '손뼉과 앞으로 밀기', icon: '👏', start: 105, end: 130, desc: '짝짝 박수치고 앞으로 쭉' },
    { id: 7, title: '발 번갈아 들어 올리기', icon: '🦵', start: 130, end: 155, desc: '오른발 살짝, 왼발 살짝' },
    { id: 8, title: '양팔 편안하게 벌리기', icon: '👐', start: 155, end: 170, desc: '양팔을 시원하게 벌려요' },
    { id: 9, title: '숨고르기 및 마무리', icon: '🌸', start: 170, end: 180.5, desc: '크게 숨을 들이마시고 후우' }
  ];

  // Speech Cues (Exact timing matching master audio)
  const CUES = [
    { start: 1.5, end: 5.3, stageId: 1, text: '안녕하세요. 콩이예요.' },
    { start: 8.0, end: 12.3, stageId: 1, text: '오늘도 저와 함께 천천히 체조해 볼까요?' },
    { start: 15.0, end: 17.7, stageId: 2, text: '허리를 편안하게 펴고,' },
    { start: 21.0, end: 23.9, stageId: 2, text: '두 발을 바닥에 놓아주세요.' },
    { start: 29.0, end: 32.1, stageId: 3, text: '양팔을 천천히 올려볼게요.' },
    { start: 35.5, end: 38.0, stageId: 3, text: '하나, 둘.' },
    { start: 41.0, end: 42.9, stageId: 3, text: '좋아요.' },
    { start: 46.0, end: 48.5, stageId: 3, text: '천천히 내려옵니다.' },
    { start: 54.0, end: 56.8, stageId: 4, text: '이번에는 오른팔입니다.' },
    { start: 60.0, end: 62.4, stageId: 4, text: '크게 한번 올려요.' },
    { start: 65.5, end: 67.4, stageId: 4, text: '좋아요.' },
    { start: 70.5, end: 73.1, stageId: 4, text: '이번에는 왼팔이에요.' },
    { start: 79.0, end: 82.2, stageId: 5, text: '어깨를 편안하게 움직여볼게요.' },
    { start: 86.0, end: 88.6, stageId: 5, text: '오른쪽, 왼쪽.' },
    { start: 92.0, end: 94.4, stageId: 5, text: '천천히 따라오세요.' },
    { start: 104.0, end: 107.0, stageId: 6, text: '이번에는 박수를 쳐볼까요?' },
    { start: 110.0, end: 111.9, stageId: 6, text: '짝짝.' },
    { start: 115.0, end: 116.9, stageId: 6, text: '좋아요.' },
    { start: 120.0, end: 123.4, stageId: 6, text: '두 손을 앞으로 쭉 밀어봅니다.' },
    { start: 129.0, end: 131.7, stageId: 7, text: '오른발을 살짝 들어요.' },
    { start: 135.0, end: 137.5, stageId: 7, text: '하나, 둘.' },
    { start: 141.0, end: 143.6, stageId: 7, text: '이번에는 왼발입니다.' },
    { start: 147.0, end: 149.5, stageId: 7, text: '천천히 들어볼게요.' },
    { start: 154.0, end: 157.1, stageId: 8, text: '이제 천천히 마무리할게요.' },
    { start: 160.0, end: 163.2, stageId: 8, text: '양팔을 편안하게 벌려주세요.' },
    { start: 169.0, end: 171.7, stageId: 9, text: '크게 숨을 들이마시고,' },
    { start: 174.0, end: 175.9, stageId: 9, text: '후우.' },
    { start: 177.5, end: 180.5, stageId: 9, text: '오늘도 정말 잘하셨어요.' }
  ];

  function formatTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function init() {
    const video = document.getElementById('kongiExerciseVideo');
    if (!video) return;

    const playBtn = document.getElementById('btnKongiPlayToggle');
    const replayBtn = document.getElementById('btnKongiReplay');
    const skipBackBtn = document.getElementById('btnKongiBack10');
    const skipFwdBtn = document.getElementById('btnKongiFwd10');
    const textToggleBtn = document.getElementById('btnKongiTextSize');
    const muteToggleBtn = document.getElementById('btnKongiMute');
    const completeBtn = document.getElementById('btnKongiComplete');
    const stageBadge = document.getElementById('kongiCurrentStageBadge');
    const statusText = document.getElementById('kongiStatusLead');
    const captionEl = document.getElementById('kongiCaptionText');
    const progressInput = document.getElementById('kongiProgressSlider');
    const timeDisplay = document.getElementById('kongiTimeIndicator');
    const chipsContainer = document.getElementById('kongiStageChips');
    const overlayPlay = document.getElementById('kongiVideoOverlayPlay');

    let currentStageIndex = -1;
    let isLargeText = false;

    // Render Stage Chips
    if (chipsContainer) {
      chipsContainer.innerHTML = STAGES.map((st, idx) => `
        <button type="button" class="kongi-chip" data-idx="${idx}" data-start="${st.start}" title="${st.desc}">
          <span class="chip-num">${st.id}</span>
          <span class="chip-icon">${st.icon}</span>
          <span class="chip-name">${st.title}</span>
        </button>
      `).join('');

      chipsContainer.querySelectorAll('.kongi-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const startSec = parseFloat(chip.dataset.start);
          video.currentTime = startSec;
          video.play().catch(() => {});
        });
      });
    }

    // Play/Pause Toggle
    function togglePlay() {
      if (video.paused || video.ended) {
        video.play().catch(e => {
          console.warn('Playback error:', e);
        });
      } else {
        video.pause();
      }
    }

    playBtn?.addEventListener('click', togglePlay);
    overlayPlay?.addEventListener('click', togglePlay);

    video.addEventListener('play', () => {
      if (playBtn) {
        playBtn.innerHTML = '<span>⏸</span><span>잠깐 쉬기</span>';
        playBtn.style.background = 'linear-gradient(135deg, #1b5e20, #2e7d32)';
      }
      if (overlayPlay) overlayPlay.style.display = 'none';
      if (statusText) statusText.textContent = '🌸 콩이 동작을 보며 천천히 따라해보세요!';
    });

    video.addEventListener('pause', () => {
      if (playBtn) {
        playBtn.innerHTML = '<span>▶</span><span>체조 계속하기</span>';
        playBtn.style.background = 'linear-gradient(135deg, #2e6628, #43a047)';
      }
      if (overlayPlay) overlayPlay.style.display = 'flex';
      if (statusText) statusText.textContent = '⏸ 편안하게 숨을 고르며 쉬어가세요.';
    });

    video.addEventListener('ended', () => {
      if (playBtn) {
        playBtn.innerHTML = '<span>🔄</span><span>다시 시작하기</span>';
      }
      if (statusText) statusText.textContent = '🎉 3분 건강 체조를 훌륭하게 마치셨어요!';
      onExerciseFinished();
    });

    // Replay
    replayBtn?.addEventListener('click', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });

    // Skip Buttons
    skipBackBtn?.addEventListener('click', () => {
      video.currentTime = Math.max(0, video.currentTime - 10);
    });

    skipFwdBtn?.addEventListener('click', () => {
      video.currentTime = Math.min(video.duration || 180, video.currentTime + 10);
    });

    // Text Size Toggle
    textToggleBtn?.addEventListener('click', () => {
      isLargeText = !isLargeText;
      if (captionEl) {
        captionEl.classList.toggle('large-text', isLargeText);
      }
      if (textToggleBtn) {
        textToggleBtn.textContent = isLargeText ? '🔠 보통 글자' : '🔠 글자 크게';
      }
    });

    // Mute Toggle
    muteToggleBtn?.addEventListener('click', () => {
      video.muted = !video.muted;
      if (muteToggleBtn) {
        muteToggleBtn.textContent = video.muted ? '🔇 음소거 해제' : '🔊 소리 켜짐';
      }
    });

    // Timeline Scrubbing
    progressInput?.addEventListener('input', () => {
      video.currentTime = parseFloat(progressInput.value);
    });

    // Time Update Loop
    video.addEventListener('timeupdate', () => {
      const cur = video.currentTime;
      const dur = video.duration || 180;

      // Update Slider & Time Display
      if (progressInput) {
        progressInput.value = cur;
        progressInput.max = dur;
      }
      if (timeDisplay) {
        timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
      }

      // Find Current Stage
      const stageIdx = STAGES.findIndex(s => cur >= s.start && cur < s.end);
      if (stageIdx !== -1 && stageIdx !== currentStageIndex) {
        currentStageIndex = stageIdx;
        const curStage = STAGES[stageIdx];
        if (stageBadge) {
          stageBadge.textContent = `${curStage.id}단계 · ${curStage.icon} ${curStage.title}`;
        }
        // Update active chip
        chipsContainer?.querySelectorAll('.kongi-chip').forEach((chip, i) => {
          chip.classList.toggle('active', i === stageIdx);
          if (i === stageIdx) {
            chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        });
      }

      // Find Active Subtitle / Cue
      const activeCue = CUES.find(c => cur >= c.start && cur < c.end);
      if (captionEl) {
        if (activeCue) {
          captionEl.textContent = `"${activeCue.text}"`;
          captionEl.style.opacity = '1';
        } else {
          // If in a resting gap, display current movement guidance
          const curStage = STAGES[currentStageIndex];
          if (curStage) {
            captionEl.textContent = curStage.desc;
            captionEl.style.opacity = '0.85';
          }
        }
      }
    });

    // Completion Stamp
    function onExerciseFinished() {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const map = JSON.parse(localStorage.getItem('school_today_completed_chars') || '{}');
        const list = map[today] || [];
        if (!list.includes('kongi')) {
          list.push('kongi');
          map[today] = list;
          localStorage.setItem('school_today_completed_chars', JSON.stringify(map));
        }
        const waterCount = parseInt(localStorage.getItem('school_garden_water_count') || '0', 10);
        localStorage.setItem('school_garden_water_count', String(waterCount + 1));
      } catch (e) {
        console.warn('Storage error:', e);
      }

      if (completeBtn) {
        completeBtn.textContent = '🌸 건강 꽃 도장 획득 완료!';
        completeBtn.style.background = '#e8f5e9';
        completeBtn.style.color = '#1b5e20';
        completeBtn.style.borderColor = '#81c784';
      }

      // Show celebratory alert
      const modal = document.getElementById('exerciseCompleteModal');
      const viewCompleted = document.getElementById('viewCompleted');
      if (modal && viewCompleted) {
        viewCompleted.style.display = 'block';
        modal.style.display = 'block';
        modal.removeAttribute('hidden');
        viewCompleted.scrollIntoView({ behavior: 'smooth' });
      }
    }

    completeBtn?.addEventListener('click', () => {
      onExerciseFinished();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
