/**
 * 디지털 AI 학교 – 20분 건강체조 플레이어 (exercise-20min.js)
 * program.json(1200초, 8챕터, 236이벤트) + class-20min.mp3 + VTT 자막 통합
 * 어르신 친화적 자동 재생 체조 수업 엔진
 */
(() => {
  'use strict';

  // ═══ DOM ═══
  const $ = id => document.getElementById(id);

  // States
  const stateReady    = $('stateReady');
  const statePlaying  = $('statePlaying');
  const stateComplete = $('stateComplete');

  // Ready
  const loadStatus = $('loadStatus');
  const btnStart   = $('btnStart');

  // Player Header
  const headerPartLabel = $('headerPartLabel');
  const headerCharLabel = $('headerCharLabel');
  const headerTime      = $('headerTime');

  // Stage
  const charImg       = $('charImg');
  const moveBadge     = $('moveBadge');
  const moveIcon      = $('moveIcon');
  const moveName      = $('moveName');
  const chapterBadge  = $('chapterBadge');
  const bgLayer       = $('bgLayer');

  // Caption
  const captionArea    = $('captionArea');
  const captionCharTag = $('captionCharTag');
  const captionText    = $('captionText');

  // Timeline
  const progressBar      = $('progressBar');
  const currentTimeLabel = $('currentTime');
  const totalTimeLabel   = $('totalTime');
  const timelineChapters = $('timelineChapters');

  // Controls
  const btnPause   = $('btnPause');
  const btnPrev    = $('btnPrev');
  const btnNext    = $('btnNext');
  const btnReplay  = $('btnReplay');
  const btnSlow    = $('btnSlow');
  const btnMute    = $('btnMute');
  const btnBgm     = $('btnBgm');
  const btnFull    = $('btnFull');

  // Complete
  const btnRestart = $('btnRestart');

  // Audio
  const narrationAudio = $('narrationAudio');

  // ═══ CONSTANTS ═══
  const CHARACTER_MAP = {
    kongi: { emoji: '🐶', name: '콩이', img: 'assets/images/everyday/kongi-active.png', fallback: 'assets/images/friend-kongi.png' },
    tori:  { emoji: '🐰', name: '토리', img: 'assets/images/everyday/tori-active.png',  fallback: 'assets/images/friend-tori.png' },
    nabi:  { emoji: '🐱', name: '나비', img: 'assets/images/everyday/nabi-active.png',  fallback: 'assets/images/friend-nabi.png' },
    bori:  { emoji: '🐕', name: '보리', img: 'assets/images/everyday/bori-active.png',  fallback: 'assets/images/friend-bori.png' },
  };

  const MOVE_LABELS = {
    'wave':          { icon: '👋', label: '인사' },
    'rest':          { icon: '🧘', label: '쉬기' },
    'inhale':        { icon: '🫁', label: '들이마시기' },
    'exhale':        { icon: '💨', label: '내쉬기' },
    'shoulder-up':   { icon: '💪', label: '어깨 올리기' },
    'head-right':    { icon: '➡️', label: '고개 오른쪽' },
    'head-center':   { icon: '⬆️', label: '고개 가운데' },
    'head-left':     { icon: '⬅️', label: '고개 왼쪽' },
    'shoulder-roll-f': { icon: '🔄', label: '어깨 앞으로 돌리기' },
    'shoulder-roll-b': { icon: '🔄', label: '어깨 뒤로 돌리기' },
    'finger-spread': { icon: '🖐', label: '손가락 펴기' },
    'finger-curl':   { icon: '✊', label: '손 쥐기' },
    'wrist-roll':    { icon: '🔄', label: '손목 돌리기' },
    'wrist-roll-r':  { icon: '🔄', label: '손목 반대로' },
    'arms-front':    { icon: '🙌', label: '팔 앞으로' },
    'arms-side':     { icon: '🤗', label: '팔 옆으로' },
    'arms-relax':    { icon: '😌', label: '편안하게' },
    'arm-right':     { icon: '💪', label: '오른팔 올리기' },
    'arm-left':      { icon: '💪', label: '왼팔 올리기' },
    'heel-right':    { icon: '🦶', label: '오른발 뒤꿈치' },
    'heel-left':     { icon: '🦶', label: '왼발 뒤꿈치' },
    'toe-up':        { icon: '🦶', label: '발끝 들기' },
    'toe-down':      { icon: '🦶', label: '발끝 내리기' },
    'knee-right':    { icon: '🦵', label: '오른쪽 무릎' },
    'knee-left':     { icon: '🦵', label: '왼쪽 무릎' },
    'clap':          { icon: '👏', label: '박수' },
    'right-hand':    { icon: '✋', label: '오른손' },
    'left-hand':     { icon: '🤚', label: '왼손' },
    'wait':          { icon: '⏳', label: '기다리기' },
    'sway':          { icon: '💃', label: '좌우 흔들기' },
    'hands-up':      { icon: '🙌', label: '손 위로' },
    'pat-shoulder':  { icon: '🤝', label: '어깨 토닥토닥' },
    'cheer':         { icon: '🎉', label: '최고!' },
  };

  // ═══ STATE ═══
  let program      = null;
  let isPlaying     = false;
  let isPaused      = false;
  let isMuted       = false;
  let isBgmOn       = true;
  let isSlowMode    = false;
  let currentTime   = 0;
  let currentEventIdx = -1;
  let currentChapterIdx = -1;
  let animFrame     = null;
  let lastTick      = 0;
  let bgmCtx        = null;
  let bgmGain       = null;
  let bgmOsc        = null;
  let bgmInterval   = null;

  // ═══ INIT ═══
  async function init() {
    try {
      loadStatus.textContent = '체조 프로그램을 불러오고 있어요…';
      const resp = await fetch('assets/exercise-20min/program.json');
      program = await resp.json();

      // Build chapter timeline UI
      buildChapterTimeline();

      // Preload audio
      loadStatus.textContent = '음성을 준비하고 있어요…';
      await new Promise((resolve, reject) => {
        if (narrationAudio.readyState >= 2) { resolve(); return; }
        narrationAudio.addEventListener('canplay', resolve, { once: true });
        narrationAudio.addEventListener('error', () => {
          loadStatus.textContent = '음성 파일을 불러올 수 없습니다.';
          reject(new Error('audio load failed'));
        }, { once: true });
        narrationAudio.load();
      });

      totalTimeLabel.textContent = formatTime(program.duration);
      progressBar.max = program.duration;

      loadStatus.textContent = '준비 완료! 시작 버튼을 눌러주세요.';
      btnStart.disabled = false;
      btnStart.textContent = '▶ 체조 시작하기';

    } catch (err) {
      console.error('Init error:', err);
      loadStatus.textContent = '준비에 문제가 있어요. 페이지를 새로고침해주세요.';
    }
  }

  // ═══ CHAPTER TIMELINE ═══
  function buildChapterTimeline() {
    if (!program || !program.chapters) return;
    timelineChapters.innerHTML = '';
    program.chapters.forEach((ch, i) => {
      const seg = document.createElement('div');
      seg.className = 'chapter-seg';
      seg.title = ch.title;
      seg.style.flex = ch.duration;
      seg.dataset.idx = i;
      timelineChapters.appendChild(seg);
    });
  }

  function updateChapterHighlight(chIdx) {
    const segs = timelineChapters.querySelectorAll('.chapter-seg');
    segs.forEach((seg, i) => {
      seg.classList.toggle('done', i < chIdx);
      seg.classList.toggle('active', i === chIdx);
    });
  }

  // ═══ TIME FORMAT ═══
  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // ═══ SHOW STATE ═══
  function showState(state) {
    stateReady.style.display    = state === 'ready'    ? '' : 'none';
    statePlaying.style.display  = state === 'playing'  ? '' : 'none';
    stateComplete.style.display = state === 'complete' ? '' : 'none';
  }

  // ═══ START ═══
  function startExercise() {
    showState('playing');
    currentTime = 0;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    isPlaying = true;
    isPaused = false;

    narrationAudio.currentTime = 0;
    narrationAudio.muted = isMuted;
    narrationAudio.play().catch(() => {});

    startBgm();
    lastTick = performance.now();
    tick();
  }

  // ═══ MAIN TICK ═══
  function tick() {
    if (!isPlaying) return;

    const now = performance.now();
    const delta = (now - lastTick) / 1000;
    lastTick = now;

    if (!isPaused) {
      const speed = isSlowMode ? 0.7 : 1;
      currentTime += delta * speed;

      if (currentTime >= program.duration) {
        completeExercise();
        return;
      }

      syncNarration();
      updateEvent();
      updateUI();
    }

    animFrame = requestAnimationFrame(tick);
  }

  // ═══ SYNC NARRATION ═══
  function syncNarration() {
    if (!narrationAudio || narrationAudio.paused) return;

    const speed = isSlowMode ? 0.7 : 1;
    narrationAudio.playbackRate = speed;

    // Keep audio in rough sync with our timer
    const drift = Math.abs(narrationAudio.currentTime - currentTime);
    if (drift > 1.5) {
      narrationAudio.currentTime = currentTime;
    }
  }

  // ═══ UPDATE EVENT ═══
  function updateEvent() {
    if (!program || !program.events) return;

    const events = program.events;
    let newIdx = currentEventIdx;

    // Find current event by time
    for (let i = 0; i < events.length; i++) {
      if (currentTime >= events[i].start && currentTime < events[i].end) {
        newIdx = i;
        break;
      }
    }

    if (newIdx !== currentEventIdx) {
      currentEventIdx = newIdx;
      const ev = events[currentEventIdx];
      if (!ev) return;

      // Update character
      const charId = ev.character || 'kongi';
      const charData = CHARACTER_MAP[charId] || CHARACTER_MAP.kongi;

      // Character image
      charImg.src = charData.img;
      charImg.onerror = () => { charImg.src = charData.fallback; };
      charImg.alt = charData.name;

      // Set animation data attribute
      charImg.setAttribute('data-move', ev.move || 'rest');

      // Active character theme
      statePlaying.setAttribute('data-active-char', charId);

      // Caption
      captionText.textContent = ev.text || '';
      captionCharTag.textContent = `${charData.emoji} ${charData.name}`;

      // Move badge
      const moveData = MOVE_LABELS[ev.move] || { icon: '🧘', label: ev.move || '동작' };
      moveIcon.textContent = moveData.icon;
      moveName.textContent = moveData.label;

      // Chapter
      const chIdx = ev.chapter;
      if (chIdx !== currentChapterIdx && chIdx < program.chapters.length) {
        currentChapterIdx = chIdx;
        const ch = program.chapters[chIdx];
        const chCharData = CHARACTER_MAP[ch.character] || CHARACTER_MAP.kongi;
        chapterBadge.textContent = `${chIdx + 1}부 · ${ch.title}`;
        headerPartLabel.textContent = `${chIdx + 1}부 · ${ch.title}`;
        headerCharLabel.textContent = `${chCharData.emoji} ${chCharData.name}`;
        updateChapterHighlight(chIdx);
      }
    }
  }

  // ═══ UPDATE UI ═══
  function updateUI() {
    // Progress bar
    progressBar.value = currentTime;
    currentTimeLabel.textContent = formatTime(currentTime);
    headerTime.textContent = `${formatTime(currentTime)} / ${formatTime(program.duration)}`;

    // Prev/Next buttons
    btnPrev.disabled = currentChapterIdx <= 0;
    btnNext.disabled = currentChapterIdx >= program.chapters.length - 1;
  }

  // ═══ PAUSE / RESUME ═══
  function togglePause() {
    isPaused = !isPaused;

    if (isPaused) {
      narrationAudio.pause();
      btnPause.textContent = '▶ 계속하기';
      btnPause.setAttribute('data-paused', 'true');
      stopBgm();
    } else {
      narrationAudio.play().catch(() => {});
      btnPause.textContent = '⏸ 잠깐 쉬기';
      btnPause.setAttribute('data-paused', 'false');
      lastTick = performance.now();
      if (isBgmOn) startBgm();
    }
  }

  // ═══ NAVIGATION ═══
  function goToChapter(chIdx) {
    if (!program || chIdx < 0 || chIdx >= program.chapters.length) return;
    const ch = program.chapters[chIdx];
    currentTime = ch.start;
    narrationAudio.currentTime = currentTime;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    lastTick = performance.now();
    updateEvent();
    updateUI();
  }

  function prevChapter() {
    if (currentChapterIdx > 0) {
      goToChapter(currentChapterIdx - 1);
    }
  }

  function nextChapter() {
    if (currentChapterIdx < program.chapters.length - 1) {
      goToChapter(currentChapterIdx + 1);
    }
  }

  function replayChapter() {
    if (currentChapterIdx >= 0) {
      goToChapter(currentChapterIdx);
    }
  }

  // ═══ SEEK ═══
  function seekTo(time) {
    currentTime = Math.max(0, Math.min(time, program.duration));
    narrationAudio.currentTime = currentTime;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    lastTick = performance.now();
    updateEvent();
    updateUI();
  }

  // ═══ BGM (Simple piano-like ambient) ═══
  function startBgm() {
    if (!isBgmOn || bgmCtx) return;
    try {
      bgmCtx = new (window.AudioContext || window.webkitAudioContext)();
      bgmGain = bgmCtx.createGain();
      bgmGain.gain.value = 0.06;
      bgmGain.connect(bgmCtx.destination);

      // Simple gentle chords progression
      const playChord = () => {
        if (!bgmCtx || !isBgmOn) return;
        const chords = [
          [261.63, 329.63, 392.0],  // C major
          [293.66, 349.23, 440.0],  // D minor-ish
          [329.63, 392.0, 493.88],  // E minor-ish
          [349.23, 440.0, 523.25],  // F major
        ];
        const chord = chords[Math.floor(Math.random() * chords.length)];
        chord.forEach(freq => {
          const osc = bgmCtx.createOscillator();
          const env = bgmCtx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          env.gain.setValueAtTime(0, bgmCtx.currentTime);
          env.gain.linearRampToValueAtTime(0.04, bgmCtx.currentTime + 0.3);
          env.gain.linearRampToValueAtTime(0, bgmCtx.currentTime + 3.5);
          osc.connect(env);
          env.connect(bgmGain);
          osc.start(bgmCtx.currentTime);
          osc.stop(bgmCtx.currentTime + 4);
        });
      };

      playChord();
      bgmInterval = setInterval(playChord, 4000);
    } catch (e) {
      console.warn('BGM init failed:', e);
    }
  }

  function stopBgm() {
    if (bgmInterval) { clearInterval(bgmInterval); bgmInterval = null; }
    if (bgmCtx) {
      try { bgmCtx.close(); } catch (e) {}
      bgmCtx = null;
      bgmGain = null;
    }
  }

  // ═══ COMPLETE ═══
  function completeExercise() {
    isPlaying = false;
    isPaused = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    narrationAudio.pause();
    stopBgm();
    showState('complete');

    // Save completion to localStorage
    try {
      const key = 'exercise20min_completions';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push({ date: new Date().toISOString(), duration: program.duration });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {}
  }

  // ═══ RESTART ═══
  function restartExercise() {
    currentTime = 0;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    showState('ready');
    btnStart.disabled = false;
    loadStatus.textContent = '준비 완료! 시작 버튼을 눌러주세요.';
  }

  // ═══ TOGGLE HELPERS ═══
  function toggleMute() {
    isMuted = !isMuted;
    narrationAudio.muted = isMuted;
    btnMute.textContent = isMuted ? '🔇 음소거' : '🔊 음성';
    btnMute.setAttribute('aria-pressed', String(isMuted));
  }

  function toggleBgm() {
    isBgmOn = !isBgmOn;
    btnBgm.textContent = isBgmOn ? '🎵 음악' : '🔕 음악 끔';
    btnBgm.setAttribute('aria-pressed', String(isBgmOn));
    if (isBgmOn && isPlaying && !isPaused) {
      startBgm();
    } else {
      stopBgm();
    }
  }

  function toggleSlow() {
    isSlowMode = !isSlowMode;
    btnSlow.textContent = isSlowMode ? '🐢 천천히 켜짐' : '🐢 천천히';
    btnSlow.setAttribute('aria-pressed', String(isSlowMode));
    if (narrationAudio) {
      narrationAudio.playbackRate = isSlowMode ? 0.7 : 1;
    }
  }

  function toggleFullscreen() {
    const el = statePlaying;
    if (!document.fullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen).call(document);
    }
  }

  // ═══ EVENT LISTENERS ═══
  btnStart.addEventListener('click', startExercise);

  btnPause.addEventListener('click', togglePause);
  btnPrev.addEventListener('click', prevChapter);
  btnNext.addEventListener('click', nextChapter);
  btnReplay.addEventListener('click', replayChapter);
  btnSlow.addEventListener('click', toggleSlow);
  btnMute.addEventListener('click', toggleMute);
  btnBgm.addEventListener('click', toggleBgm);
  btnFull.addEventListener('click', toggleFullscreen);

  btnRestart.addEventListener('click', restartExercise);

  // Progress bar seek
  progressBar.addEventListener('input', () => {
    seekTo(Number(progressBar.value));
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        seekTo(currentTime - 10);
        break;
      case 'ArrowRight':
        e.preventDefault();
        seekTo(currentTime + 10);
        break;
      case 'm':
        toggleMute();
        break;
      case 'f':
        toggleFullscreen();
        break;
    }
  });

  // Prevent audio ending abruptly
  narrationAudio.addEventListener('ended', () => {
    if (isPlaying && currentTime < program.duration - 5) {
      // Audio ended but exercise timer hasn't finished - just let timer continue
    }
  });

  // ═══ INITIALIZE ═══
  init();

})();
