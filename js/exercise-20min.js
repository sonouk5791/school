/**
 * 디지털 AI 학교 – 20분 건강체조 단일 TV 화면 플레이어 JS v5
 * 
 * 핵심 구조:
 * - 20분 전체가 단 하나의 메인 체조 무대 화면 안에서 끊김 없이 연속 재생
 * - 1부~5부는 내부 진행 데이터로만 사용 (화면 분할 및 카드형 뷰 노출 제거)
 * - 상단: 현재 단계 배지 + 현재 동작명(크게) + 20분 전체 시간(누적 진행)
 * - 중앙: 주간보호센터 체조실 배경 + 4인 캐릭터(콩이·토리·나비·보리)와 어르신들이 함께 체조하는 고화질 GIF 뷰어
 * - 하단: 큰 숫자 카운트(1,2,3,4) + 짧고 큰 한 줄 자막 + 20분 전체 진행바
 */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);

  // ═══ DOM Elements ═══
  const tvScreen         = $('tvScreen');
  const tvStage          = $('tvStage');

  // Overlays
  const startOverlay     = $('startOverlay');
  const pauseOverlay     = $('pauseOverlay');
  const completeOverlay  = $('completeOverlay');

  const loadStatus       = $('loadStatus');
  const btnStart         = $('btnStart');
  const btnOverlayResume = $('btnOverlayResume');
  const btnRestart       = $('btnRestart');

  // Header Elements
  const headerStepBadge  = $('headerStepBadge');
  const headerCharBadge  = $('headerCharBadge');
  const moveBadge        = $('moveBadge');
  const moveIcon         = $('moveIcon');
  const moveName         = $('moveName');
  const headerTime       = $('headerTime');

  // Stage & Live GIF
  const liveGifImg       = $('liveGifImg');

  // Counter & Rep
  const countDisplay     = $('countDisplay');
  const countNum         = $('countNum');
  const repProgress      = $('repProgress');
  const repDots          = $('repDots');
  const repLabel         = $('repLabel');

  // Caption
  const captionCharTag   = $('captionCharTag');
  const captionText      = $('captionText');

  // Timeline
  const progressBar      = $('progressBar');
  const currentTimeLabel = $('currentTime');
  const totalTimeLabel   = $('totalTime');

  // Controls
  const btnPause  = $('btnPause');
  const btnPrev   = $('btnPrev');
  const btnNext   = $('btnNext');
  const btnReplay = $('btnReplay');
  const btnSlow   = $('btnSlow');
  const btnMute   = $('btnMute');
  const btnBgm    = $('btnBgm');
  const btnFull   = $('btnFull');

  const narrationAudio = $('narrationAudio');

  // ═══ CONSTANTS ═══
  const CHARACTER_MAP = {
    kongi: { emoji: '🐶', name: '콩이', img: 'assets/images/everyday/kongi-active.png', fallback: 'assets/images/friend-kongi.png' },
    tori:  { emoji: '🐰', name: '토리', img: 'assets/images/everyday/tori-active.png',  fallback: 'assets/images/friend-tori.png' },
    nabi:  { emoji: '🐱', name: '나비', img: 'assets/images/everyday/nabi-active.png',  fallback: 'assets/images/friend-nabi.png' },
    bori:  { emoji: '🐕', name: '보리', img: 'assets/images/everyday/bori-active.png',  fallback: 'assets/images/friend-bori.png' },
  };

  const MOVE_LABELS = {
    'wave':           { icon: '👋', label: '손 흔들기 인사' },
    'rest':           { icon: '🧘', label: '편안히 쉬기' },
    'inhale':         { icon: '🫁', label: '숨 들이마시기' },
    'exhale':         { icon: '💨', label: '숨 내쉬기' },
    'shoulder-up':    { icon: '💪', label: '어깨 올리기' },
    'neck-right':     { icon: '➡️', label: '목 좌우 돌리기' },
    'neck-left':      { icon: '⬅️', label: '목 왼쪽 돌리기' },
    'shoulder-front': { icon: '🔄', label: '어깨 앞으로 돌리기' },
    'shoulder-back':  { icon: '🔄', label: '어깨 뒤로 돌리기' },
    'hands-open':     { icon: '🖐', label: '손가락 펴기' },
    'hands-close':    { icon: '✊', label: '주먹 쥐기' },
    'wrist-left':     { icon: '🔄', label: '손목 돌리기' },
    'wrist-right':    { icon: '🔄', label: '손목 흔들기' },
    'arms-forward':   { icon: '🙌', label: '팔 앞으로 뻗기' },
    'arms-side':      { icon: '🤗', label: '팔 옆으로 펴기' },
    'hands-chest':    { icon: '🤲', label: '가슴 모으기' },
    'arm-right':      { icon: '💪', label: '오른팔 들어올리기' },
    'arm-left':       { icon: '💪', label: '왼팔 들어올리기' },
    'both-up':        { icon: '🙌', label: '두 팔 올리기' },
    'heel-right':     { icon: '🦶', label: '발뒤꿈치 들기' },
    'heel-left':      { icon: '🦶', label: '왼쪽 발뒤꿈치 들기' },
    'toes':           { icon: '🦶', label: '발끝 톡톡 운동' },
    'knee-right':     { icon: '🦵', label: '의자 무릎 들기' },
    'knee-left':      { icon: '🦵', label: '왼쪽 무릎 들기' },
    'clap':           { icon: '👏', label: '짝짝 손뼉 치기' },
    'clap-one':       { icon: '✋', label: '신나는 인지 박수' },
    'thumbsup':       { icon: '👍', label: '모두 함께 최고!' },
  };

  const MOVE_GIF_MAP = {
    // 1. 손 흔들기 / 인사 / 호흡 / 마무리
    'wave':           'assets/exercise-20min/exercise_wave.gif',
    'rest':           'assets/exercise-20min/exercise_wave.gif',
    'thumbsup':       'assets/exercise-20min/exercise_wave.gif',
    'inhale':         'assets/exercise-20min/exercise_wave.gif',
    'exhale':         'assets/exercise-20min/exercise_wave.gif',

    // 2. 두 팔 올리기 / 상체 스트레칭
    'both-up':        'assets/exercise-20min/exercise_arms_up.gif',
    'arm-right':      'assets/exercise-20min/exercise_arms_up.gif',
    'arm-left':       'assets/exercise-20min/exercise_arms_up.gif',
    'shoulder-up':    'assets/exercise-20min/exercise_arms_up.gif',
    'shoulder-front': 'assets/exercise-20min/exercise_arms_up.gif',
    'shoulder-back':  'assets/exercise-20min/exercise_arms_up.gif',
    'neck-right':     'assets/exercise-20min/exercise_arms_up.gif',
    'neck-left':      'assets/exercise-20min/exercise_arms_up.gif',
    'arms-forward':   'assets/exercise-20min/exercise_arms_up.gif',
    'arms-side':      'assets/exercise-20min/exercise_arms_up.gif',
    'hands-chest':    'assets/exercise-20min/exercise_arms_up.gif',

    // 3. 박수 치기 / 손 운동 / 인지박수
    'clap':           'assets/exercise-20min/exercise_clap.gif',
    'clap-one':       'assets/exercise-20min/exercise_clap.gif',
    'hands-open':     'assets/exercise-20min/exercise_clap.gif',
    'hands-close':    'assets/exercise-20min/exercise_clap.gif',
    'wrist-left':     'assets/exercise-20min/exercise_clap.gif',
    'wrist-right':    'assets/exercise-20min/exercise_clap.gif',

    // 4. 무릎 들기 / 하체 의자 운동
    'knee-right':     'assets/exercise-20min/exercise_knee_lift.gif',
    'knee-left':      'assets/exercise-20min/exercise_knee_lift.gif',
    'heel-right':     'assets/exercise-20min/exercise_knee_lift.gif',
    'heel-left':      'assets/exercise-20min/exercise_knee_lift.gif',
    'toes':           'assets/exercise-20min/exercise_knee_lift.gif',
  };

  const CHAPTER_STEP_NAMES = [
    '준비운동',
    '상체 스트레칭',
    '의자 하체운동',
    '신나는 박수체조',
    '마무리 호흡'
  ];

  const COUNTABLE_MOVES = new Set([
    'shoulder-up', 'neck-right', 'neck-left', 'shoulder-front', 'shoulder-back',
    'hands-open', 'hands-close', 'wrist-left', 'wrist-right',
    'arms-forward', 'arms-side', 'arm-right', 'arm-left', 'both-up', 'hands-chest',
    'heel-right', 'heel-left', 'toes', 'knee-right', 'knee-left',
    'clap', 'clap-one', 'inhale', 'exhale',
  ]);

  // ═══ STATE ═══
  let program           = null;
  let isPlaying         = false;
  let isPaused          = false;
  let isMuted           = false;
  let isBgmOn           = true;
  let isSlowMode        = false;
  let currentTime       = 0;
  let currentEventIdx   = -1;
  let currentChapterIdx = -1;
  let currentCharId     = 'kongi';
  let animFrame         = null;
  let lastTick          = 0;

  // BGM Audio
  let bgmAudio          = null;
  const BPM             = 120;
  let beatInterval      = null;
  let beatCount         = 0;

  // ═══ INIT ═══
  async function init() {
    try {
      loadStatus.textContent = '체조 프로그램을 불러오고 있어요…';
      const resp = await fetch('assets/exercise-20min/program.json');
      program = await resp.json();

      precomputeCountSequences();

      // BGM 로드
      loadStatus.textContent = '신나는 음악을 준비하고 있어요…';
      bgmAudio = new Audio(program.musicFile || 'assets/exercise-20min/audio/bgm-trot.mp3');
      bgmAudio.loop = true;
      bgmAudio.volume = 0;
      bgmAudio.preload = 'auto';

      await new Promise((resolve) => {
        if (bgmAudio.readyState >= 2) { resolve(); return; }
        bgmAudio.addEventListener('canplay', resolve, { once: true });
        bgmAudio.addEventListener('error', () => {
          console.warn('BGM load failed, continuing without BGM');
          resolve();
        }, { once: true });
        bgmAudio.load();
      });

      // 나레이션 로드
      loadStatus.textContent = '음성을 준비하고 있어요…';
      await new Promise((resolve) => {
        if (narrationAudio.readyState >= 2) { resolve(); return; }
        narrationAudio.addEventListener('canplay', resolve, { once: true });
        narrationAudio.addEventListener('error', () => {
          resolve();
        }, { once: true });
        narrationAudio.load();
      });

      totalTimeLabel.textContent = formatTime(program.duration);
      headerTime.textContent = `00:00 / ${formatTime(program.duration)}`;
      progressBar.max = program.duration;

      loadStatus.textContent = '준비 완료! 시작 버튼을 눌러주세요.';
      btnStart.disabled = false;
      btnStart.textContent = '▶ 20분 체조 시작하기';
    } catch (err) {
      console.error('Init error:', err);
      loadStatus.textContent = '준비에 문제가 있어요. 새로고침해주세요.';
    }
  }

  // ═══ PRECOMPUTE COUNT SEQUENCES ═══
  function precomputeCountSequences() {
    if (!program || !program.events) return;
    const events = program.events;
    for (let i = 0; i < events.length; i++) {
      events[i]._seqStart = -1;
      events[i]._seqPos = 0;
      events[i]._seqTotal = 1;
    }

    let seqStart = 0;
    for (let i = 1; i <= events.length; i++) {
      const prev = events[i - 1];
      const curr = i < events.length ? events[i] : null;
      if (!curr || curr.move !== prev.move || curr.chapter !== prev.chapter) {
        const len = i - seqStart;
        if (len >= 2 && COUNTABLE_MOVES.has(prev.move)) {
          for (let j = seqStart; j < i; j++) {
            events[j]._seqStart = seqStart;
            events[j]._seqPos = j - seqStart;
            events[j]._seqTotal = len;
          }
        }
        seqStart = i;
      }
    }
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // ═══ START ═══
  function startExercise() {
    startOverlay.hidden = true;
    pauseOverlay.hidden = true;
    completeOverlay.hidden = true;

    currentTime = 0;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    isPlaying = true;
    isPaused = false;

    // 나레이션 재생
    narrationAudio.currentTime = 0;
    narrationAudio.muted = isMuted;
    narrationAudio.play().catch(() => {});

    // BGM 재생
    startBgm();
    startBeatTracker();

    lastTick = performance.now();
    tick();
  }

  // ═══ TICK ═══
  function tick() {
    if (!isPlaying) return;
    const now = performance.now();
    const delta = (now - lastTick) / 1000;
    lastTick = now;

    if (!isPaused) {
      const speed = isSlowMode ? 0.7 : 1;
      currentTime += delta * speed;
      if (currentTime >= program.duration) { completeExercise(); return; }
      syncNarration();
      updateEvent();
      updateUI();
      updateBgmBalance();
    }
    animFrame = requestAnimationFrame(tick);
  }

  function syncNarration() {
    if (!narrationAudio || narrationAudio.paused) return;
    const speed = isSlowMode ? 0.7 : 1;
    narrationAudio.playbackRate = speed;
    const drift = Math.abs(narrationAudio.currentTime - currentTime);
    if (drift > 1.5) narrationAudio.currentTime = currentTime;
  }

  function updateBgmBalance() {
    if (!bgmAudio || !isBgmOn) return;
    const isEnding = currentChapterIdx >= (program?.chapters?.length || 5) - 2;
    const targetVol = isEnding ? 0.15 : 0.32;
    const diff = targetVol - bgmAudio.volume;
    if (Math.abs(diff) > 0.005) {
      bgmAudio.volume = Math.max(0, Math.min(1, bgmAudio.volume + diff * 0.02));
    }
  }

  // ═══ UPDATE EVENT (한 화면 안에서 동작/자막/GIF/카운트만 자연스럽게 변경) ═══
  function updateEvent() {
    if (!program || !program.events) return;
    const events = program.events;
    let newIdx = currentEventIdx;

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

      // 1. 캐릭터 & 자막 변경
      const charId = ev.character || 'kongi';
      currentCharId = charId;
      const charData = CHARACTER_MAP[charId] || CHARACTER_MAP.kongi;
      
      headerCharBadge.textContent = `${charData.emoji} ${charData.name}`;
      captionCharTag.textContent = `${charData.emoji} ${charData.name}`;
      captionText.textContent = ev.text || '';

      // 2. 상단 현재 동작명 텍스트 및 아이콘 갱신
      const moveData = MOVE_LABELS[ev.move] || { icon: '🧘', label: ev.move || '건강체조' };
      moveIcon.textContent = moveData.icon;
      moveName.textContent = moveData.label;

      // 3. 중앙 고화질 체조 GIF 자동 전환 (캐릭터+어르신 함께 동작)
      if (liveGifImg) {
        const gifSrc = MOVE_GIF_MAP[ev.move] || 'assets/exercise-20min/exercise_wave.gif';
        if (!liveGifImg.src.endsWith(gifSrc)) {
          liveGifImg.src = gifSrc;
        }
      }

      // 4. 큰 숫자 카운트 및 반복 갱신
      if (ev._seqTotal >= 2) {
        const pos = ev._seqPos + 1;
        const total = ev._seqTotal;
        countNum.textContent = pos;
        countDisplay.hidden = false;

        let dotsHtml = '';
        for (let d = 0; d < total; d++) {
          const cls = d < pos ? (d === pos - 1 ? 'rep-dot active' : 'rep-dot done') : 'rep-dot';
          dotsHtml += `<span class="${cls}"></span>`;
        }
        repDots.innerHTML = dotsHtml;
        repLabel.textContent = `${pos} / ${total}회`;
        repProgress.hidden = false;
      } else {
        countDisplay.hidden = false;
        repProgress.hidden = true;
      }

      // 5. 상단 현재 단계 (1부/2부 화면 전환이 아닌 '준비운동' 등 텍스트 배지만 부드럽게 갱신)
      const chIdx = ev.chapter;
      if (chIdx !== currentChapterIdx && chIdx < (program.chapters?.length || 5)) {
        currentChapterIdx = chIdx;
        const stepName = CHAPTER_STEP_NAMES[chIdx] || program.chapters[chIdx]?.title || '건강체조';
        headerStepBadge.textContent = stepName;
      }
    }
  }

  // ═══ UPDATE UI ═══
  function updateUI() {
    progressBar.value = currentTime;
    currentTimeLabel.textContent = formatTime(currentTime);
    headerTime.textContent = `${formatTime(currentTime)} / ${formatTime(program.duration)}`;
    btnPrev.disabled = currentChapterIdx <= 0;
    btnNext.disabled = currentChapterIdx >= (program.chapters?.length || 5) - 1;
  }

  // ═══ PAUSE / RESUME ═══
  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      narrationAudio.pause();
      if (bgmAudio) bgmAudio.pause();
      stopBeatTracker();
      btnPause.textContent = '▶ 계속하기';
      pauseOverlay.hidden = false;
    } else {
      pauseOverlay.hidden = true;
      narrationAudio.play().catch(() => {});
      if (bgmAudio && isBgmOn) bgmAudio.play().catch(() => {});
      startBeatTracker();
      btnPause.textContent = '⏸ 잠깐 쉬기';
      lastTick = performance.now();
    }
  }

  // ═══ NAVIGATION ═══
  function goToChapter(chIdx) {
    if (!program || !program.chapters || chIdx < 0 || chIdx >= program.chapters.length) return;
    currentTime = program.chapters[chIdx].start;
    narrationAudio.currentTime = currentTime;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    lastTick = performance.now();
    updateEvent();
    updateUI();
  }
  function prevChapter() { if (currentChapterIdx > 0) goToChapter(currentChapterIdx - 1); }
  function nextChapter() { if (program && currentChapterIdx < program.chapters.length - 1) goToChapter(currentChapterIdx + 1); }
  function replayChapter() { if (currentChapterIdx >= 0) goToChapter(currentChapterIdx); }

  function seekTo(time) {
    currentTime = Math.max(0, Math.min(time, program?.duration || 1200));
    narrationAudio.currentTime = currentTime;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    lastTick = performance.now();
    updateEvent();
    updateUI();
  }

  // ═══ BGM ═══
  function startBgm() {
    if (!isBgmOn || !bgmAudio) return;
    bgmAudio.currentTime = 0;
    bgmAudio.volume = 0;
    bgmAudio.play().catch(() => {});
    fadeBgm(0.3, 1500);
  }

  function stopBgm() {
    if (!bgmAudio) return;
    fadeBgm(0, 400, () => bgmAudio.pause());
  }

  function fadeBgm(targetVol, durationMs, callback) {
    if (!bgmAudio) return;
    const startVol = bgmAudio.volume;
    const startTime = performance.now();
    const fadeStep = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      bgmAudio.volume = startVol + (targetVol - startVol) * progress;
      if (progress < 1) {
        requestAnimationFrame(fadeStep);
      } else {
        if (callback) callback();
      }
    };
    requestAnimationFrame(fadeStep);
  }

  // ═══ BEAT TRACKER ═══
  function startBeatTracker() {
    if (beatInterval) return;
    const beatMs = 60000 / BPM;
    beatInterval = setInterval(() => {
      if (!isPlaying || isPaused) return;
      onBeat(beatCount);
      beatCount++;
    }, beatMs);
  }

  function stopBeatTracker() {
    if (beatInterval) {
      clearInterval(beatInterval);
      beatInterval = null;
    }
  }

  function onBeat(beatIdx) {
    const beatInBar = beatIdx % 4;
    const beatNumber = beatInBar + 1;

    const ev = program && program.events ? program.events[currentEventIdx] : null;
    if (countNum && (!ev || ev._seqTotal < 2)) {
      countNum.textContent = beatNumber;
      countNum.style.animation = 'none';
      countNum.offsetHeight;
      countNum.style.animation = 'countPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
  }

  // ═══ COMPLETE ═══
  function completeExercise() {
    isPlaying = false;
    isPaused = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    narrationAudio.pause();
    stopBeatTracker();
    stopBgm();

    completeOverlay.hidden = false;

    try {
      const key = 'exercise20min_completions';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push({ date: new Date().toISOString(), duration: program.duration });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {}
  }

  function restartExercise() {
    completeOverlay.hidden = true;
    startExercise();
  }

  // ═══ TOGGLES ═══
  function toggleMute() {
    isMuted = !isMuted;
    narrationAudio.muted = isMuted;
    btnMute.textContent = isMuted ? '🔇 음소거' : '🔊 음성';
    btnMute.setAttribute('aria-pressed', String(isMuted));
  }
  function toggleBgm() {
    isBgmOn = !isBgmOn;
    btnBgm.textContent = isBgmOn ? '🎵 음악 켜짐' : '🔕 음악 끔';
    btnBgm.setAttribute('aria-pressed', String(isBgmOn));
    if (isBgmOn && isPlaying && !isPaused) {
      bgmAudio.play().catch(() => {});
      fadeBgm(0.3, 1000);
      startBeatTracker();
    } else {
      stopBgm();
      stopBeatTracker();
    }
  }
  function toggleSlow() {
    isSlowMode = !isSlowMode;
    btnSlow.textContent = isSlowMode ? '🐢 천천히 켜짐' : '🐢 천천히';
    btnSlow.setAttribute('aria-pressed', String(isSlowMode));
    if (narrationAudio) narrationAudio.playbackRate = isSlowMode ? 0.7 : 1;
    if (bgmAudio) bgmAudio.playbackRate = isSlowMode ? 0.85 : 1;
  }
  function toggleFullscreen() {
    const el = tvScreen || document.documentElement;
    if (!document.fullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen).call(document);
    }
  }

  // ═══ EVENTS ═══
  btnStart.addEventListener('click', startExercise);
  btnOverlayResume.addEventListener('click', togglePause);
  btnPause.addEventListener('click', togglePause);
  btnPrev.addEventListener('click', prevChapter);
  btnNext.addEventListener('click', nextChapter);
  btnReplay.addEventListener('click', replayChapter);
  btnSlow.addEventListener('click', toggleSlow);
  btnMute.addEventListener('click', toggleMute);
  btnBgm.addEventListener('click', toggleBgm);
  btnFull.addEventListener('click', toggleFullscreen);
  btnRestart.addEventListener('click', restartExercise);

  progressBar.addEventListener('input', () => seekTo(Number(progressBar.value)));

  document.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    switch (e.key) {
      case ' ': case 'k': e.preventDefault(); togglePause(); break;
      case 'ArrowLeft': e.preventDefault(); seekTo(currentTime - 10); break;
      case 'ArrowRight': e.preventDefault(); seekTo(currentTime + 10); break;
      case 'm': toggleMute(); break;
      case 'f': toggleFullscreen(); break;
    }
  });

  // ═══ RUN ═══
  init();

})();
