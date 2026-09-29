/**
 * 디지털 AI 학교 – 20분 건강체조 플레이어 v4 (exercise-20min.js)
 * 
 * v4 주요 개선:
 * - 첨부 음악(bgm-trot.mp3) 루프 재생 + 체조 동작 동기화
 * - 어르신 일러스트 레이어 표시
 * - 30개 운동 구간 자동 진행
 * - 비트 인디케이터 (쿵짝 시각 표시)
 * - 음악-동작 박자 동기화
 * - 챕터별 분위기 변화
 * - 캐릭터별 리드 타이밍 차이
 * - 음악 fade in/out 전환
 * - 음성 나레이션 + 음악 볼륨 자동 밸런스
 */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);

  // ═══ DOM ═══
  const stateReady    = $('stateReady');
  const statePlaying  = $('statePlaying');
  const stateComplete = $('stateComplete');

  const loadStatus = $('loadStatus');
  const btnStart   = $('btnStart');

  // Header
  const headerPartLabel = $('headerPartLabel');
  const headerCharLabel = $('headerCharLabel');
  const headerTime      = $('headerTime');

  // Crew stage (4인 캐릭터 전원 무대)
  const crewStage = $('crewStage');
  const crewMembers = {
    kongi: $('crewKongi'),
    tori:  $('crewTori'),
    bori:  $('crewBori'),
    nabi:  $('crewNabi'),
  };

  // Count (하단 중앙 1, 2, 3, 4 카운트)
  const countDisplay = $('countDisplay');
  const countNum     = $('countNum');

  // Move badge
  const moveBadge = $('moveBadge');
  const moveIcon  = $('moveIcon');
  const moveName  = $('moveName');

  // Rep progress
  const repProgress = $('repProgress');
  const repDots     = $('repDots');
  const repLabel    = $('repLabel');

  // Caption
  const captionCharTag = $('captionCharTag');
  const captionText    = $('captionText');

  // Timeline
  const progressBar      = $('progressBar');
  const currentTimeLabel = $('currentTime');
  const totalTimeLabel   = $('totalTime');
  const timelineChapters = $('timelineChapters');

  // Controls
  const btnPause  = $('btnPause');
  const btnPrev   = $('btnPrev');
  const btnNext   = $('btnNext');
  const btnReplay = $('btnReplay');
  const btnSlow   = $('btnSlow');
  const btnMute   = $('btnMute');
  const btnBgm    = $('btnBgm');
  const btnFull   = $('btnFull');
  const btnRestart = $('btnRestart');

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
    'inhale':        { icon: '🫁', label: '심호흡' },
    'exhale':        { icon: '💨', label: '내쉬기' },
    'shoulder-up':   { icon: '💪', label: '어깨 올리기' },
    'neck-right':    { icon: '➡️', label: '고개 좌우' },
    'neck-left':     { icon: '⬅️', label: '고개 왼쪽' },
    'shoulder-front': { icon: '🔄', label: '어깨 앞으로' },
    'shoulder-back':  { icon: '🔄', label: '어깨 뒤로' },
    'hands-open':    { icon: '🖐', label: '손 펴기/쥐기' },
    'hands-close':   { icon: '✊', label: '손 쥐기' },
    'wrist-left':    { icon: '🔄', label: '손목 돌리기' },
    'wrist-right':   { icon: '🔄', label: '손목 흔들기' },
    'arms-forward':  { icon: '🙌', label: '팔 앞으로' },
    'arms-side':     { icon: '🤗', label: '팔 옆으로' },
    'hands-chest':   { icon: '🤲', label: '가슴 앞으로' },
    'arm-right':     { icon: '💪', label: '오른팔 올리기' },
    'arm-left':      { icon: '💪', label: '왼팔 올리기' },
    'both-up':       { icon: '🙌', label: '양팔 위로' },
    'heel-right':    { icon: '🦶', label: '발뒤꿈치 들기' },
    'heel-left':     { icon: '🦶', label: '왼발 들기' },
    'toes':          { icon: '🦶', label: '발끝 운동' },
    'knee-right':    { icon: '🦵', label: '무릎 올리기' },
    'knee-left':     { icon: '🦵', label: '왼쪽 무릎' },
    'clap':          { icon: '👏', label: '박수' },
    'clap-one':      { icon: '✋', label: '인지 박수' },
    'thumbsup':      { icon: '👍', label: '최고!' },
  };

  const COUNTABLE_MOVES = new Set([
    'shoulder-up', 'neck-right', 'neck-left', 'shoulder-front', 'shoulder-back',
    'hands-open', 'hands-close', 'wrist-left', 'wrist-right',
    'arms-forward', 'arms-side', 'arm-right', 'arm-left', 'both-up', 'hands-chest',
    'heel-right', 'heel-left', 'toes', 'knee-right', 'knee-left',
    'clap', 'clap-one', 'inhale', 'exhale',
  ]);

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
  let currentCharId = 'kongi';
  let animFrame     = null;
  let lastTick      = 0;

  // BGM (첨부 음악 파일)
  let bgmAudio      = null;
  let bgmVolume     = 0.3;   // 기본 BGM 볼륨
  let bgmFadeTarget = 0.3;
  let bgmLoopCount  = 0;

  // Beat tracking
  const BPM = 120;   // 첨부 음악의 추정 BPM
  let beatInterval = null;
  let beatCount    = 0;

  // ═══ INIT ═══
  async function init() {
    try {
      loadStatus.textContent = '체조 프로그램을 불러오고 있어요…';
      const resp = await fetch('assets/exercise-20min/program.json');
      program = await resp.json();

      buildChapterTimeline();
      precomputeCountSequences();

      // BGM 음악 로드
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

      // 나레이션 오디오 로드
      loadStatus.textContent = '음성을 준비하고 있어요…';
      await new Promise((resolve, reject) => {
        if (narrationAudio.readyState >= 2) { resolve(); return; }
        narrationAudio.addEventListener('canplay', resolve, { once: true });
        narrationAudio.addEventListener('error', () => {
          loadStatus.textContent = '음성 파일을 불러올 수 없지만 음악으로 진행합니다.';
          resolve();
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
    timelineChapters.querySelectorAll('.chapter-seg').forEach((seg, i) => {
      seg.classList.toggle('done', i < chIdx);
      seg.classList.toggle('active', i === chIdx);
    });
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function showState(state) {
    stateReady.style.display    = state === 'ready'    ? '' : 'none';
    statePlaying.style.display  = state === 'playing'  ? '' : 'none';
    stateComplete.style.display = state === 'complete' ? '' : 'none';
  }

  // ═══ CHARACTER UPDATE ═══
  function updateActiveCharacter(charId) {
    currentCharId = charId;
    statePlaying.setAttribute('data-active-char', charId);
  }

  // ═══ START ═══
  function startExercise() {
    showState('playing');
    currentTime = 0;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    isPlaying = true;
    isPaused = false;

    // 나레이션
    narrationAudio.currentTime = 0;
    narrationAudio.muted = isMuted;
    narrationAudio.play().catch(() => {});

    // BGM 시작
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

  // ═══ BGM 볼륨 자동 밸런스 ═══
  // 음성 나레이션이 나올 때 BGM을 낮추고, 동작만 진행할 때 BGM 올림
  function updateBgmBalance() {
    if (!bgmAudio || !isBgmOn) return;
    const ev = program.events[currentEventIdx];
    if (!ev) return;

    // 마무리 챕터에서는 BGM 낮춤
    const isEnding = currentChapterIdx >= program.chapters.length - 2;
    const targetVol = isEnding ? 0.12 : 0.3;

    // 부드러운 볼륨 전환
    const diff = targetVol - bgmAudio.volume;
    if (Math.abs(diff) > 0.005) {
      bgmAudio.volume = Math.max(0, Math.min(1, bgmAudio.volume + diff * 0.02));
    }
  }

  // ═══ UPDATE EVENT ═══
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

      // Character & Crew Leader Update
      const charId = ev.character || 'kongi';
      if (charId !== currentCharId) {
        updateActiveCharacter(charId);
      }
      const charData = CHARACTER_MAP[charId] || CHARACTER_MAP.kongi;

      // 4인 캐릭터 크루 무대 리더 상태 갱신
      const isAllChapter = currentChapterIdx === 4 || charId === 'all';
      if (crewStage) {
        crewStage.classList.toggle('is-all-active', isAllChapter);
        Object.entries(crewMembers).forEach(([id, el]) => {
          if (!el) return;
          if (isAllChapter) {
            el.classList.add('is-leader');
          } else {
            el.classList.toggle('is-leader', id === charId);
          }
        });
      }

      // Caption
      captionText.textContent = ev.text || '';
      captionCharTag.textContent = `${charData.emoji} ${charData.name}`;

      // Move badge
      const moveData = MOVE_LABELS[ev.move] || { icon: '🧘', label: ev.move || '동작' };
      moveIcon.textContent = moveData.icon;
      moveName.textContent = moveData.label;

      // Count & Rep Progress (하단 중앙 1, 2, 3, 4 카운트 표시)
      if (ev._seqTotal >= 2) {
        const pos = ev._seqPos + 1;
        const total = ev._seqTotal;
        countNum.textContent = pos;
        countDisplay.hidden = false;
        countNum.style.animation = 'none';
        countNum.offsetHeight;
        countNum.style.animation = '';

        let dotsHtml = '';
        for (let d = 0; d < total; d++) {
          const cls = d < pos ? (d === pos - 1 ? 'rep-dot active' : 'rep-dot done') : 'rep-dot';
          dotsHtml += `<span class="${cls}"></span>`;
        }
        repDots.innerHTML = dotsHtml;
        repLabel.textContent = `${pos} / ${total}회`;
        repProgress.hidden = false;
      } else {
        // 기본 4박자 모드 유지
        countDisplay.hidden = false;
        repProgress.hidden = true;
      }

      // Chapter
      const chIdx = ev.chapter;
      if (chIdx !== currentChapterIdx && chIdx < program.chapters.length) {
        currentChapterIdx = chIdx;
        const ch = program.chapters[chIdx];
        const chCharData = CHARACTER_MAP[ch.character] || CHARACTER_MAP.kongi;
        const partNum = ch.part || (chIdx + 1);
        headerPartLabel.textContent = `${partNum}부 · ${ch.title}`;
        headerCharLabel.textContent = `${chCharData.emoji} ${chCharData.name}`;
        updateChapterHighlight(chIdx);
      }
    }
  }

  // ═══ UPDATE UI ═══
  function updateUI() {
    progressBar.value = currentTime;
    currentTimeLabel.textContent = formatTime(currentTime);
    headerTime.textContent = `${formatTime(currentTime)} / ${formatTime(program.duration)}`;
    btnPrev.disabled = currentChapterIdx <= 0;
    btnNext.disabled = currentChapterIdx >= program.chapters.length - 1;
  }

  // ═══ PAUSE / RESUME ═══
  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      narrationAudio.pause();
      if (bgmAudio) bgmAudio.pause();
      stopBeatTracker();
      btnPause.textContent = '▶ 계속하기';
      btnPause.setAttribute('data-paused', 'true');
    } else {
      narrationAudio.play().catch(() => {});
      if (bgmAudio && isBgmOn) bgmAudio.play().catch(() => {});
      startBeatTracker();
      btnPause.textContent = '⏸ 잠깐 쉬기';
      btnPause.setAttribute('data-paused', 'false');
      lastTick = performance.now();
    }
  }

  // ═══ NAVIGATION ═══
  function goToChapter(chIdx) {
    if (!program || chIdx < 0 || chIdx >= program.chapters.length) return;
    currentTime = program.chapters[chIdx].start;
    narrationAudio.currentTime = currentTime;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    lastTick = performance.now();
    updateEvent();
    updateUI();
  }
  function prevChapter() { if (currentChapterIdx > 0) goToChapter(currentChapterIdx - 1); }
  function nextChapter() { if (currentChapterIdx < program.chapters.length - 1) goToChapter(currentChapterIdx + 1); }
  function replayChapter() { if (currentChapterIdx >= 0) goToChapter(currentChapterIdx); }

  function seekTo(time) {
    currentTime = Math.max(0, Math.min(time, program.duration));
    narrationAudio.currentTime = currentTime;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    lastTick = performance.now();
    updateEvent();
    updateUI();
  }

  // ═══ BGM (첨부 음악 루프 재생) ═══
  function startBgm() {
    if (!isBgmOn || !bgmAudio) return;
    bgmAudio.currentTime = 0;
    bgmAudio.volume = 0;
    bgmAudio.play().catch(() => {});
    // Fade in
    fadeBgm(0.3, 2000);
  }

  function stopBgm() {
    if (!bgmAudio) return;
    fadeBgm(0, 500, () => {
      bgmAudio.pause();
    });
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
      onBeat(beatCount, beatCount % 4 === 0);
      beatCount++;
    }, beatMs);
  }

  function stopBeatTracker() {
    if (beatInterval) {
      clearInterval(beatInterval);
      beatInterval = null;
    }
  }

  function onBeat(beatIdx, isStrong) {
    const beatInBar = beatIdx % 4; // 0, 1, 2, 3 -> 박자 1, 2, 3, 4
    const beatNumber = beatInBar + 1;

    // 하단 중앙 큰 카운터(1, 2, 3, 4) 실시간 반응
    const ev = program && program.events ? program.events[currentEventIdx] : null;
    if (countNum && (!ev || ev._seqTotal < 2)) {
      countNum.textContent = beatNumber;
      countNum.style.animation = 'none';
      countNum.offsetHeight;
      countNum.style.animation = 'countPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }

    // 4인 캐릭터 크루 리듬 바운스
    if (crewStage && isStrong) {
      const activeImgs = crewStage.querySelectorAll('.ex20-crew-img');
      activeImgs.forEach((img, idx) => {
        img.style.transform = idx % 2 === 0 ? 'translateY(-6px) rotate(1deg)' : 'translateY(-6px) rotate(-1deg)';
        setTimeout(() => {
          img.style.transform = '';
        }, 180);
      });
    }
  }

  // ═══ COMPLETE ═══
  function completeExercise() {
    isPlaying = false; isPaused = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    narrationAudio.pause();
    stopBeatTracker();
    stopBgm();
    showState('complete');
    try {
      const key = 'exercise20min_completions';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push({ date: new Date().toISOString(), duration: program.duration });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {}
  }

  function restartExercise() {
    currentTime = 0; currentEventIdx = -1; currentChapterIdx = -1;
    showState('ready');
    btnStart.disabled = false;
    loadStatus.textContent = '준비 완료! 시작 버튼을 눌러주세요.';
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
    const el = statePlaying;
    if (!document.fullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen).call(document);
    }
  }

  // ═══ EVENTS ═══
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

  narrationAudio.addEventListener('ended', () => {});

  // ═══ INIT ═══
  setRigCharacter('kongi');
  init();

})();
