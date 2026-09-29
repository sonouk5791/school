/**
 * 디지털 AI 학교 – 20분 건강체조 플레이어 v3 (exercise-20min.js)
 * 
 * v3 개선사항:
 * - 신나는 트로트 BGM 엔진 연동 (뽕짝 리듬)
 * - 비트 인디케이터 (쿵짝쿵짝 시각 표시)
 * - 챕터별 음악 분위기 자동 변화
 * - 노래 가사 자막 연동
 * - Body-part 리그 시스템
 * - 큰 숫자 카운트, 동작 반복 진행률
 * - 음성/숫자/동작 동기화
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

  // Header (simplified)
  const headerPartLabel = $('headerPartLabel');
  const headerCharLabel = $('headerCharLabel');
  const headerTime      = $('headerTime');

  // Rig
  const charRig  = $('charRig');
  const charImg  = $('charImg');
  const rigHead  = $('rigHead');
  const rigArmL  = $('rigArmL');
  const rigArmR  = $('rigArmR');
  const rigBody  = $('rigBody');
  const rigLegL  = $('rigLegL');
  const rigLegR  = $('rigLegR');

  // Count
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
    'inhale':        { icon: '🫁', label: '들이마시기' },
    'exhale':        { icon: '💨', label: '내쉬기' },
    'shoulder-up':   { icon: '💪', label: '어깨 올리기' },
    'neck-right':    { icon: '➡️', label: '고개 오른쪽' },
    'neck-left':     { icon: '⬅️', label: '고개 왼쪽' },
    'shoulder-front': { icon: '🔄', label: '어깨 앞으로' },
    'shoulder-back':  { icon: '🔄', label: '어깨 뒤로' },
    'hands-open':    { icon: '🖐', label: '손가락 펴기' },
    'hands-close':   { icon: '✊', label: '손 쥐기' },
    'wrist-left':    { icon: '🔄', label: '손목 돌리기' },
    'wrist-right':   { icon: '🔄', label: '손목 반대로' },
    'arms-forward':  { icon: '🙌', label: '팔 앞으로' },
    'arms-side':     { icon: '🤗', label: '팔 옆으로' },
    'hands-chest':   { icon: '🤲', label: '가슴 앞으로' },
    'arm-right':     { icon: '💪', label: '오른팔 올리기' },
    'arm-left':      { icon: '💪', label: '왼팔 올리기' },
    'both-up':       { icon: '🙌', label: '양손 위로' },
    'heel-right':    { icon: '🦶', label: '오른발 뒤꿈치' },
    'heel-left':     { icon: '🦶', label: '왼발 뒤꿈치' },
    'toes':          { icon: '🦶', label: '발끝 들기' },
    'knee-right':    { icon: '🦵', label: '오른쪽 무릎' },
    'knee-left':     { icon: '🦵', label: '왼쪽 무릎' },
    'clap':          { icon: '👏', label: '박수' },
    'clap-one':      { icon: '✋', label: '한 손 박수' },
    'thumbsup':      { icon: '👍', label: '최고!' },
  };

  // 반복 동작: 같은 move가 연속될 때 카운트
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
  let trotBgm       = null;  // TrotBgmEngine 인스턴스

  // Count tracking
  let countSequence   = [];  // indices of consecutive events with same move
  let countCurrent    = 0;   // current position in sequence
  let lastCountMove   = '';  // last counted move type

  // Beat indicator elements
  const beatIndicator  = document.createElement('div');
  beatIndicator.id = 'beatIndicator';
  beatIndicator.className = 'ex20-beat-indicator';
  beatIndicator.setAttribute('aria-hidden', 'true');
  beatIndicator.innerHTML = '<span class="ex20-beat-text" id="beatText">🎵</span><span class="ex20-beat-pulse" id="beatPulse"></span>';

  // ═══ INIT ═══
  async function init() {
    try {
      loadStatus.textContent = '체조 프로그램을 불러오고 있어요…';
      const resp = await fetch('assets/exercise-20min/program.json');
      program = await resp.json();

      buildChapterTimeline();
      precomputeCountSequences();

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

  // ═══ PRECOMPUTE COUNT SEQUENCES ═══
  // 같은 move가 연속으로 나오는 구간을 미리 계산
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
        // End of sequence from seqStart to i-1
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

  // ═══ RIG: Set character image for all body parts ═══
  function setRigCharacter(charId) {
    const charData = CHARACTER_MAP[charId] || CHARACTER_MAP.kongi;
    const imgUrl = charData.img;

    // Set image on all rig parts and fallback full image
    [rigHead, rigArmL, rigArmR, rigBody, rigLegL, rigLegR].forEach(el => {
      el.style.backgroundImage = `url('${imgUrl}')`;
    });

    charImg.src = imgUrl;
    charImg.onerror = () => {
      charImg.src = charData.fallback;
      const fallbackUrl = charData.fallback;
      [rigHead, rigArmL, rigArmR, rigBody, rigLegL, rigLegR].forEach(el => {
        el.style.backgroundImage = `url('${fallbackUrl}')`;
      });
    };
    charImg.alt = charData.name;

    // Activate rig (hide full image, show parts)
    charRig.classList.add('rig-active');
    currentCharId = charId;
  }

  // ═══ START ═══
  function startExercise() {
    showState('playing');
    currentTime = 0;
    currentEventIdx = -1;
    currentChapterIdx = -1;
    isPlaying = true;
    isPaused = false;

    // 비트 인디케이터를 스테이지에 추가
    const stage = $('exerciseStage');
    if (stage && !stage.querySelector('#beatIndicator')) {
      stage.appendChild(beatIndicator);
    }

    narrationAudio.currentTime = 0;
    narrationAudio.muted = isMuted;
    narrationAudio.play().catch(() => {});

    startBgm();
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

      // Character
      const charId = ev.character || 'kongi';
      if (charId !== currentCharId) {
        setRigCharacter(charId);
      }
      const charData = CHARACTER_MAP[charId] || CHARACTER_MAP.kongi;
      statePlaying.setAttribute('data-active-char', charId);

      // Rig animation
      charRig.setAttribute('data-move', ev.move || 'rest');

      // Caption
      captionText.textContent = ev.text || '';
      captionCharTag.textContent = `${charData.emoji} ${charData.name}`;

      // Move badge
      const moveData = MOVE_LABELS[ev.move] || { icon: '🧘', label: ev.move || '동작' };
      moveIcon.textContent = moveData.icon;
      moveName.textContent = moveData.label;

      // ── Count & Rep Progress ──
      if (ev._seqTotal >= 2) {
        const pos = ev._seqPos + 1;
        const total = ev._seqTotal;

        // Big number
        countNum.textContent = pos;
        countDisplay.hidden = false;
        countNum.style.animation = 'none';
        countNum.offsetHeight; // reflow
        countNum.style.animation = '';

        // Rep dots
        let dotsHtml = '';
        for (let d = 0; d < total; d++) {
          const cls = d < pos ? (d === pos - 1 ? 'rep-dot active' : 'rep-dot done') : 'rep-dot';
          dotsHtml += `<span class="${cls}"></span>`;
        }
        repDots.innerHTML = dotsHtml;
        repLabel.textContent = `${pos} / ${total}회`;
        repProgress.hidden = false;
      } else {
        countDisplay.hidden = true;
        repProgress.hidden = true;
      }

      // Chapter
      const chIdx = ev.chapter;
      if (chIdx !== currentChapterIdx && chIdx < program.chapters.length) {
        currentChapterIdx = chIdx;
        const ch = program.chapters[chIdx];
        const chCharData = CHARACTER_MAP[ch.character] || CHARACTER_MAP.kongi;
        headerPartLabel.textContent = `${chIdx + 1}부 · ${ch.title}`;
        headerCharLabel.textContent = `${chCharData.emoji} ${chCharData.name}`;
        updateChapterHighlight(chIdx);

        // 트로트 BGM 챕터 전환
        if (trotBgm && trotBgm.isPlaying) {
          trotBgm.setChapter(chIdx);
        }
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

  // ═══ BGM (트로트 엔진) ═══
  function startBgm() {
    if (!isBgmOn) return;
    if (!trotBgm) {
      trotBgm = new TrotBgmEngine();
      trotBgm.onBeatCallback = onBeat;
    }
    trotBgm.start(currentChapterIdx >= 0 ? currentChapterIdx : 0);
  }

  function stopBgm() {
    if (trotBgm) {
      trotBgm.stop();
    }
  }

  function destroyBgm() {
    if (trotBgm) {
      trotBgm.destroy();
      trotBgm = null;
    }
  }

  // ── 비트 콜백 (화면 리듬 효과) ──
  function onBeat(beatIdx, isStrong) {
    if (!isPlaying || isPaused) return;

    const pulse = document.getElementById('beatPulse');
    const text = document.getElementById('beatText');
    if (!pulse || !text) return;

    // 쿵짝 표시
    const beatInBar = beatIdx % 4;
    if (beatInBar === 0) {
      text.textContent = '쿵';
      text.className = 'ex20-beat-text ex20-beat-strong';
    } else if (beatInBar === 2) {
      text.textContent = '짝';
      text.className = 'ex20-beat-text ex20-beat-weak';
    } else {
      text.textContent = '🎵';
      text.className = 'ex20-beat-text';
    }

    // 펄스 애니메이션
    pulse.style.animation = 'none';
    pulse.offsetHeight; // reflow
    pulse.style.animation = isStrong ? 'beatPulseStrong 0.3s ease-out' : 'beatPulseWeak 0.25s ease-out';

    // 캐릭터 미세 리듬 바운스
    if (charRig && isStrong) {
      charRig.style.transition = 'none';
      charRig.style.transform = 'translateX(-50%) translateY(-3px)';
      requestAnimationFrame(() => {
        charRig.style.transition = 'transform 0.2s ease';
        charRig.style.transform = 'translateX(-50%) translateY(0)';
      });
    }
  }

  // ═══ COMPLETE ═══
  function completeExercise() {
    isPlaying = false; isPaused = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    narrationAudio.pause(); stopBgm(); destroyBgm();
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
    btnBgm.textContent = isBgmOn ? '🎵 트로트' : '🔕 음악 끔';
    btnBgm.setAttribute('aria-pressed', String(isBgmOn));
    if (isBgmOn && isPlaying && !isPaused) startBgm(); else { stopBgm(); destroyBgm(); }
    // 비트 인디케이터 표시/숨김
    beatIndicator.style.display = isBgmOn ? '' : 'none';
  }
  function toggleSlow() {
    isSlowMode = !isSlowMode;
    btnSlow.textContent = isSlowMode ? '🐢 천천히 켜짐' : '🐢 천천히';
    btnSlow.setAttribute('aria-pressed', String(isSlowMode));
    if (narrationAudio) narrationAudio.playbackRate = isSlowMode ? 0.7 : 1;
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
  // Set initial rig character
  setRigCharacter('kongi');
  init();

})();
