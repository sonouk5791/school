/**
 * 디지털 AI 학교 - 치매 어르신 체조 통합 연속 영상 플레이어 (SCENE 1 ~ 10)
 * - 단 한 번의 시작 버튼으로 SCENE 1부터 SCENE 10까지 부드러운 페이드 전환과 함께 자동 연속 재생
 * - 따뜻한 한국어 여성 음성(TTS) + 잔잔한 피아노 BGM + 대형 자막 + 동작 모션 애니메이션
 * - 어르신 친화적: 시작 전 완료 팝업 완전 배제, 10개 동작 완료 시에만 축하 팝업 노출, 실시간 진행 표시
 */
(() => {
  'use strict';

  // DOM Elements
  const $ = id => document.getElementById(id);
  const frontImg = $('sceneFront');
  const backImg = $('sceneBack');
  const sceneVideo = $('sceneVideo');
  const stageWrapper = $('stageWrapper');
  const sceneBadge = $('sceneBadge');
  const characterTag = $('characterTag');
  const countBadge = $('countBadge');
  const cueLead = $('cueLead');
  const captionText = $('captionText');
  const captionContainer = $('captionContainer');
  const progressTimeline = $('progressTimeline');
  const timeIndicator = $('timeIndicator');
  const timeIndicatorTop = $('timeIndicatorTop');
  const stepProgressIndicator = $('stepProgressIndicator');
  const statusMsg = $('statusMsg');
  const sceneGrid = $('sceneGrid');
  const playerCard = $('playerCard');
  const kongiSpeechLead = document.querySelector('.se-speech-lead');

  // 3-State View Containers
  const viewReady = $('viewReady');
  const viewPlaying = $('viewPlaying');
  const viewCompleted = $('viewCompleted');
  const readySceneList = $('readySceneList');

  // Controls
  const btnStart = $('btnStart');
  const btnHeroStart = $('heroStartBtn');
  const btnPause = $('btnPause');
  const btnRestart = $('btnRestart');
  const btnPrev = $('btnPrev');
  const btnNext = $('btnNext');
  const btnMute = $('btnMute');
  const btnBgm = $('btnBgm');
  const btnTextSize = $('btnTextSize');
  const btnFullscreen = $('btnFullscreen');
  const btnBackToReady = $('btnBackToReady');
  const completeModal = $('exerciseCompleteModal');

  // State Variables
  let program = null;
  let programReady = false;
  let stampAwarded = false;
  let mediaRevision = 0;
  let mediaReady = false;
  let scenes = [];
  let currentSceneIdx = 0;
  let currentStepIdx = -1;
  let isPlaying = false;
  let isMuted = false;
  let isBgmOn = true;
  let isLargeText = false;
  let totalDuration = 0;
  let sceneTimer = null;
  let sceneStartTime = 0;
  let sceneElapsed = 0;
  let bgmAudioCtx = null;
  let bgmGainNode = null;
  let bgmInterval = null;
  let exerciseSpeed = 1;
  const watchedSeconds = new Map();
  const completedScenes = new Set(); // 완료한 씬 인덱스 추적

  // Existing basename images remain valid. Videos use site-relative MP4/WebM paths.
  const imagePath = scene => scene.image.includes('/') ? scene.image : `assets/senior-exercise/images/${scene.image}`;
  function syncVideo() {
    if (!sceneVideo || !mediaReady) return;
    if (!isPlaying || currentExerciseState !== 'playing') { sceneVideo.pause(); return; }
    sceneVideo.playbackRate = exerciseSpeed;
    const revision = mediaRevision;
    sceneVideo.play().catch(error => { if (revision === mediaRevision && error.name !== 'AbortError' && isPlaying) useImage(); });
  }
  function useImage() {
    mediaReady = false;
    if (sceneVideo) { sceneVideo.pause(); sceneVideo.hidden = true; }
    if (frontImg) frontImg.style.opacity = '1';
    stageWrapper.dataset.media = 'image';
  }
  function loadSceneMedia(scene) {
    const revision = ++mediaRevision;
    useImage();
    if (!sceneVideo) return;
    sceneVideo.onloadeddata = null; sceneVideo.onerror = null;
    sceneVideo.removeAttribute('src'); sceneVideo.replaceChildren();sceneVideo.load();
    sceneVideo.poster = imagePath(scene);
    if (!scene.video) return;
    const sources = Array.isArray(scene.video) ? scene.video : [scene.video];
    const valid = sources.filter(src => typeof src === 'string' && /\.(mp4|webm)(?:[?#].*)?$/i.test(src));
    if (!valid.length) return;
    sceneVideo.onloadeddata = () => {
      if (revision !== mediaRevision) return;
      mediaReady = true; sceneVideo.hidden = false;stageWrapper.dataset.media = 'video';syncVideo();
    };
    sceneVideo.onerror = () => { if (revision === mediaRevision) useImage(); };
    if (valid.length === 1) sceneVideo.src = valid[0];
    else valid.forEach((src,index) => {const source=document.createElement('source');source.src=src;source.type=/\.webm(?:[?#].*)?$/i.test(src)?'video/webm':'video/mp4';if(index===valid.length-1)source.onerror=sceneVideo.onerror;sceneVideo.append(source);});
    sceneVideo.load();
  }

  // Format MM:SS
  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // --- Web Audio Soft Ambient BGM Generator ---
  function initBgm() {
    if (bgmAudioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      bgmAudioCtx = new AudioContext();
      bgmGainNode = bgmAudioCtx.createGain();
      bgmGainNode.gain.setValueAtTime(isBgmOn && !isMuted ? 0.05 : 0, bgmAudioCtx.currentTime);
      bgmGainNode.connect(bgmAudioCtx.destination);

      const chords = [
        [261.63, 329.63, 392.00, 523.25], // C major
        [220.00, 261.63, 329.63, 440.00], // A minor
        [174.61, 220.00, 261.63, 349.23], // F major
        [196.00, 246.94, 293.66, 392.00]  // G major
      ];
      let chordIndex = 0;

      const playChord = () => {
        if (!isPlaying || !isBgmOn || isMuted || !bgmAudioCtx) return;
        if (bgmAudioCtx.state === 'suspended') {
          bgmAudioCtx.resume();
        }
        const chord = chords[chordIndex % chords.length];
        chordIndex++;

        chord.forEach((freq, i) => {
          const osc = bgmAudioCtx.createOscillator();
          const noteGain = bgmAudioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, bgmAudioCtx.currentTime);

          const now = bgmAudioCtx.currentTime + i * 0.15;
          noteGain.gain.setValueAtTime(0, now);
          noteGain.gain.linearRampToValueAtTime(0.035, now + 0.8);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

          osc.connect(noteGain);
          noteGain.connect(bgmGainNode);
          osc.start(now);
          osc.stop(now + 4.5);
        });
      };

      bgmInterval = setInterval(playChord, 4200);
    } catch (e) {
      console.warn('BGM error:', e);
    }
  }

  function updateBgmGain() {
    if (!bgmGainNode || !bgmAudioCtx) return;
    const targetGain = isBgmOn && !isMuted && isPlaying ? 0.05 : 0;
    bgmGainNode.gain.linearRampToValueAtTime(targetGain, bgmAudioCtx.currentTime + 0.3);
  }

  // --- Korean Female TTS Voice Helper ---
  let speechBusy = false;
  let speechRevision = 0;
  function stopNarration() {
    speechRevision++;
    speechBusy = false;
    window.CharacterVoice?.stop();
    window.speechSynthesis?.cancel();
  }
  async function speakText(text) {
    text = String(text || '').trim();
    if (!text) return;
    stopNarration();
    const revision = ++speechRevision;
    // The caption and Kongi's bubble always use the exact spoken sentence.
    if (captionText) captionText.textContent = text;
    if (kongiSpeechLead) kongiSpeechLead.textContent = text;
    if (isMuted) return;
    speechBusy = true;
    try {
      const result = await speakAsCharacter('kongi', text, {rateScale:exerciseSpeed,restart:true});
      if (revision === speechRevision && result?.status === 'error' && statusMsg)
        statusMsg.textContent = '소리를 재생하지 못했어요. 자막을 보며 천천히 따라해 주세요.';
    } catch (error) {
      if (revision === speechRevision && statusMsg)
        statusMsg.textContent = '소리를 재생하지 못했어요. 자막을 보며 천천히 따라해 주세요.';
    } finally {
      if (revision === speechRevision) speechBusy = false;
    }
  }

  // --- 3-State View Flow Manager (ready / playing / completed) ---
  let currentExerciseState = 'ready';

  function setExerciseState(state) {
    if (state === 'playing' && !programReady) return;
    currentExerciseState = state;
    document.body.dataset.exerciseStatus = state;

    if (viewReady) {
      viewReady.style.display = (state === 'ready') ? 'block' : 'none';
      viewReady.classList.toggle('active', state === 'ready');
    }
    if (viewPlaying) {
      viewPlaying.style.display = (state === 'playing') ? 'block' : 'none';
      viewPlaying.classList.toggle('active', state === 'playing');
    }
    if (viewCompleted) {
      viewCompleted.style.display = (state === 'completed') ? 'block' : 'none';
      viewCompleted.classList.toggle('active', state === 'completed');
    }

    if (state === 'ready') {
      pause('');
      if (completeModal) {
        completeModal.hidden = true;
        completeModal.style.display = 'none';
      }
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {}
    } else if (state === 'playing') {
      if (completeModal) {
        completeModal.hidden = true;
        completeModal.style.display = 'none';
      }
      if (playerCard) {
        try {
          playerCard.scrollIntoView({ behavior: 'auto', block: 'start' });
        } catch (e) {}
      }
    } else if (state === 'completed') {
      if (completeModal) {
        completeModal.hidden = false;
        completeModal.style.display = 'flex';
      }
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {}
    }
    updateControls();
  }

  // --- Render Ready Scene Preview List (State 1: Ready) ---
  function renderReadySceneList() {
    if (!readySceneList) return;
    readySceneList.innerHTML = '';
    scenes.forEach((sc, idx) => {
      const card = document.createElement('div');
      const isCompleted = completedScenes.has(idx);
      card.className = `se-ready-scene-card ${isCompleted ? 'completed' : ''}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${sc.index}단계 ${sc.title} 바로 시작하기`);
      card.innerHTML = `
        <img class="se-ready-card-img" src="${imagePath(sc)}" alt="${sc.title}" loading="lazy">
        <div class="se-ready-card-body">
          <div class="se-ready-card-top">
            <span class="se-ready-step-num">${sc.index}단계</span>
            <span class="se-ready-char-tag" style="background-color: ${sc.characterColor || '#2d5a27'};">${sc.character}</span>
          </div>
          <div class="se-ready-card-title">${sc.title}</div>
          <div class="se-ready-card-desc">${sc.subtitle || '편안하게 호흡하며 따라해요'}</div>
        </div>
      `;
      const startFromScene = () => {
        jumpToScene(idx);
        setExerciseState('playing');
        play();
      };
      card.addEventListener('click', startFromScene);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startFromScene();
        }
      });
      readySceneList.appendChild(card);
    });
  }

  // --- Render Scene Grid ---
  function renderSceneGrid() {
    if (!sceneGrid) return;
    sceneGrid.innerHTML = '';
    scenes.forEach((sc, idx) => {
      const card = document.createElement('div');
      const isCompleted = completedScenes.has(idx);
      const isActive = idx === currentSceneIdx;
      card.className = `se-thumb-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${sc.index}번 ${sc.title}${isCompleted ? ' 완료' : ''}`);
      card.innerHTML = `
        <img class="se-thumb-img" src="${imagePath(sc)}" alt="${sc.title}" loading="lazy">
        <div class="se-thumb-info">
          <div class="se-thumb-num">SCENE ${sc.index}</div>
          <div class="se-thumb-title">${sc.title}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        jumpToScene(idx);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          jumpToScene(idx);
        }
      });
      sceneGrid.appendChild(card);
    });
  }

  function updateActiveThumbnail() {
    if (!sceneGrid) return;
    const cards = sceneGrid.querySelectorAll('.se-thumb-card');
    cards.forEach((card, idx) => {
      if (idx === currentSceneIdx) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        card.classList.remove('active');
      }

      if (completedScenes.has(idx)) {
        card.classList.add('completed');
      } else {
        card.classList.remove('completed');
      }
    });
  }

  // --- Apply Motion Class to Scene ---
  function applySceneMotion(motionType) {
    if (!frontImg) return;
    frontImg.className = 'se-scene-layer';
    if (motionType) {
      frontImg.classList.add(`motion-${motionType}`);
    }
  }

  // --- Update Kongi Speech Encouragement ---
  function updateKongiEncouragement(sceneIdx) {
    if (!kongiSpeechLead) return;
    if (sceneIdx === 0) {
      kongiSpeechLead.textContent = '"안녕하세요 어르신! 오늘도 편안한 의자에 앉아서 천천히 함께 운동해볼까요?"';
    } else if (sceneIdx <= 3) {
      kongiSpeechLead.textContent = '"준비되셨나요? 참 잘하고 계세요! 호흡을 편안하게 들이쉬고 내쉬어보세요."';
    } else if (sceneIdx <= 7) {
      kongiSpeechLead.textContent = '"몸이 한결 가벼워지고 있어요. 아프지 않고 편안한 만큼만 부드럽게 움직여보세요."';
    } else {
      kongiSpeechLead.textContent = '"거의 다 왔어요! 끝까지 정말 멋지게 잘하고 계세요. 마지막까지 화이팅!"';
    }
  }

  // --- Display Scene UI ---
  function displayScene(sceneIdx) {
    if (!scenes[sceneIdx]) return;
    currentSceneIdx = sceneIdx;
    const scene = scenes[sceneIdx];

    // Smooth Crossfade
    const newSrc = imagePath(scene);
    if (backImg && frontImg) {
      backImg.src = frontImg.src;
      backImg.style.opacity = '1';

      frontImg.style.opacity = '0';
      frontImg.src = newSrc;
      applySceneMotion(scene.motionType);

      setTimeout(() => {
        frontImg.style.opacity = '1';
        setTimeout(() => {
          backImg.style.opacity = '0';
        }, 1000);
      }, 40);
    }
    loadSceneMedia(scene);
    if ($('exerciseCounter')) $('exerciseCounter').textContent = `${scene.index} / ${scenes.length}`;
    if ($('exerciseTitle')) $('exerciseTitle').textContent = scene.title;

    // Top Header Badge
    if (sceneBadge) {
      sceneBadge.textContent = scene.displayTitle || `${scene.index} / ${scenes.length} ${scene.title}`;
    }
    if (characterTag) {
      characterTag.textContent = scene.character;
      characterTag.style.backgroundColor = scene.characterColor || '#2d5a27';
    }

    // Progress Badge
    if (stepProgressIndicator) {
      const completedCount = completedScenes.size;
      stepProgressIndicator.textContent = `${scene.index} / ${scenes.length} 동작 (${completedCount}개 완료)`;
    }

    // Kongi Speech
    if (kongiSpeechLead) kongiSpeechLead.textContent = scene.audioText || scene.speechSteps[0]?.text || scene.instruction;

    // Reset Cues
    currentStepIdx = -1;
    if (cueLead) cueLead.textContent = scene.subtitle;
    if (captionText) captionText.textContent = scene.audioText || scene.speechSteps[0]?.text || scene.instruction;
    if (countBadge) countBadge.hidden = true;

    updateActiveThumbnail();
    updateControls();
  }

  // --- Playback Step Engine ---
  function runSceneLoop() {
    if (!isPlaying || !scenes[currentSceneIdx]) return;
    const scene = scenes[currentSceneIdx];
    let lastTick = performance.now();

    const checkTimeline = () => {
      if (!isPlaying) return;
      const now = performance.now();
      const delta = Math.min(0.5, Math.max(0, (now - lastTick) / 1000)) * exerciseSpeed;
      lastTick = now;
      // Network latency and slower speech must not advance the next instruction.
      if (speechBusy) {
        sceneTimer = setTimeout(checkTimeline, 120);
        return;
      }
      sceneElapsed += delta;
      watchedSeconds.set(currentSceneIdx, (watchedSeconds.get(currentSceneIdx) || 0) + delta);

      // Find current active speechStep
      for (let i = scene.speechSteps.length - 1; i >= 0; i--) {
        const step = scene.speechSteps[i];
        if (sceneElapsed >= step.at) {
          if (currentStepIdx !== i) {
            currentStepIdx = i;
            if (cueLead) cueLead.textContent = step.lead || scene.subtitle;
            if (captionText) captionText.textContent = step.text || step.caption;

            if (countBadge) {
              if (step.count) {
                countBadge.hidden = false;
                countBadge.textContent = step.count;
              } else {
                countBadge.hidden = true;
              }
            }

            // Speak step text
            if (step.text) {
              speakText(step.text);
            }
          }
          break;
        }
      }

      updateOverallTimeline();

      // Check Scene End -> Auto Next Scene Seamlessly
      if (sceneElapsed >= scene.duration && !speechBusy) {
        // Mark current scene as completed
        if ((watchedSeconds.get(currentSceneIdx) || 0) >= scene.duration) completedScenes.add(currentSceneIdx);
        updateActiveThumbnail();

        if (currentSceneIdx < scenes.length - 1) {
          currentSceneIdx++;
          sceneElapsed = 0;
          displayScene(currentSceneIdx);
          currentStepIdx = 0;
          speakText(scenes[currentSceneIdx].audioText);
          runSceneLoop();
        } else {
          // Program Complete - All 10 Scenes Finished!
          finishProgram();
        }
      } else {
        sceneTimer = setTimeout(checkTimeline, 120);
      }
    };

    checkTimeline();
  }

  function getGlobalCurrentTime() {
    let t = 0;
    for (let i = 0; i < currentSceneIdx; i++) {
      t += scenes[i].duration;
    }
    return t + sceneElapsed;
  }

  function updateOverallTimeline() {
    const current = Math.min(totalDuration, getGlobalCurrentTime());
    if (progressTimeline) {
      progressTimeline.value = current;
    }
    const timeStr = `${formatTime(current)} / ${formatTime(totalDuration)}`;
    if (timeIndicator) {
      timeIndicator.textContent = timeStr;
    }
    if (timeIndicatorTop) {
      timeIndicatorTop.textContent = timeStr;
    }
  }

  // --- Public Playback Actions ---
  function play() {
    if (isPlaying || !programReady || currentExerciseState !== 'playing') return;
    isPlaying = true;
    initBgm();
    updateBgmGain();

    if (currentSceneIdx >= scenes.length - 1 && sceneElapsed >= (scenes[currentSceneIdx]?.duration || 10)) {
      currentSceneIdx = 0;
      sceneElapsed = 0;
    }

    syncVideo();
    // Start immediately with Kongi's first line; subsequent cues retain their timing.
    if (currentStepIdx === -1 && sceneElapsed === 0) {
      currentStepIdx = 0;
      speakText(scenes[currentSceneIdx].audioText || scenes[currentSceneIdx].speechSteps[0]?.text);
    }
    runSceneLoop();
    updateControls();
    if (statusMsg) {
      statusMsg.textContent = '편안하게 앉아서 천천히 따라해요. 무리하지 마세요.';
    }
  }

  function pause(message = '잠시 쉬고 있어요. 준비되면 이어서 해요.') {
    isPlaying = false;
    clearTimeout(sceneTimer);
    sceneVideo?.pause();
    const interrupted = speechBusy;
    stopNarration();
    if (interrupted) currentStepIdx = -1;
    updateBgmGain();
    updateControls();
    if (message && statusMsg) statusMsg.textContent = message;
  }

  function jumpToScene(idx) {
    if (!programReady) return;
    const wasPlaying = isPlaying;
    pause('');
    currentSceneIdx = Math.max(0, Math.min(scenes.length - 1, idx));
    sceneElapsed = 0;
    displayScene(currentSceneIdx);
    updateOverallTimeline();
    if (wasPlaying) {
      play();
    } else if (statusMsg) {
      statusMsg.textContent = `[${scenes[currentSceneIdx].title}] 준비됐어요. 재생 버튼을 눌러주세요.`;
    }
  }

  // 10개 동작을 모두 완료했을 때만 호출되는 완료 함수
  function finishProgram() {
    pause('');
    if (completedScenes.size !== scenes.length) {
      const next = scenes.findIndex((_, i) => !completedScenes.has(i));
      jumpToScene(next);
      if (statusMsg) statusMsg.textContent = "아직 하지 않은 동작을 함께해요.";
      play();
      return;
    }
    updateActiveThumbnail();

    sceneElapsed = scenes[currentSceneIdx]?.duration || 10;
    updateOverallTimeline();
    if (statusMsg) {
      statusMsg.textContent = '🎉 오늘도 어르신 체조를 끝까지 정말 잘하셨습니다! 건강하고 행복한 하루 보내세요.';
    }
    if (captionText) {
      captionText.textContent = '오늘도 정말 잘하셨어요!\n다음에 또 만나요.';
    }
    if (cueLead) cueLead.textContent = '마무리 인사';
    if (countBadge) countBadge.hidden = true;

    // Award Stamp & Show Complete Modal
    try {
      if (stampAwarded) return;
      const stamps = JSON.parse(localStorage.getItem('senior_stamps_v1') || '[]');
      const newStamp = {
        type: 'flower',
        title: '10단계 AI 어르신 의자 체조 완료',
        date: new Date().toISOString()
      };
      stamps.push(newStamp);
      localStorage.setItem('senior_stamps_v1', JSON.stringify(stamps));
      stampAwarded = true;
    } catch (e) {
      console.warn('Stamp save error:', e);
    }

    // Switch to Completed View & Show modal only when all 10 are actually finished
    setExerciseState('completed');
    if (completeModal) {
      completeModal.hidden = false;
      completeModal.style.display = 'flex';
      const completionText = '오늘도 정말 잘하셨어요!';
      const completionCaption = document.querySelector('.se-completed-desc');
      if (completionCaption) completionCaption.textContent = completionText;
      speakText(completionText);
    }
  }

  function updateControls() {
    if (btnStart) {
      btnStart.disabled = !programReady || isPlaying;
      btnStart.textContent = '▶ 운동 시작하기';
    }
    if (btnHeroStart) {
      btnHeroStart.textContent = isPlaying ? '⏸ 체조 진행 중' : sceneElapsed > 0 ? '▶ 이어서 하기' : '▶ 바로 체조 시작하기';
    }
    if (btnPause) {
      btnPause.disabled = false;
      btnPause.textContent = isPlaying ? '⏸ 잠깐 쉬기' : '▶ 이어서 하기';
      btnPause.setAttribute('aria-label', isPlaying ? '체조 잠시 멈춤' : '체조 이어서 하기');
    }
    if (btnPrev) {
      btnPrev.disabled = currentSceneIdx <= 0;
    }
    if (btnNext) {
      btnNext.disabled = currentSceneIdx >= scenes.length - 1;
    }
  }

  $('btnExerciseReplay')?.addEventListener('click', () => { jumpToScene(currentSceneIdx);play(); });
  $('btnExerciseSlow')?.addEventListener('click', () => {
    exerciseSpeed = exerciseSpeed === 1 ? 0.8 : 1;
    syncVideo();
    $('btnExerciseSlow').setAttribute('aria-pressed', String(exerciseSpeed !== 1));
    $('btnExerciseSlow').textContent = exerciseSpeed === 1 ? '🐢 천천히' : '🐢 천천히 켜짐';
  });
  // --- Event Listeners ---
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      setExerciseState('playing');
      play();
    });
  }

  if (btnHeroStart) {
    btnHeroStart.addEventListener('click', () => {
      setExerciseState('playing');
      play();
    });
  }

  if (btnPause) {
    btnPause.addEventListener('click', () => {
      if (isPlaying) {
        pause('잠시 쉬고 있어요. 준비되면 이어서 해요.');
      } else {
        play();
      }
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      completedScenes.clear();
      stampAwarded = false;
      watchedSeconds.clear();
      jumpToScene(0);
      setExerciseState('playing');
      play();
    });
  }

  if (btnBackToReady) {
    btnBackToReady.addEventListener('click', () => {
      pause('체조를 잠시 멈추고 준비 화면으로 돌아왔어요.');
      setExerciseState('ready');
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentSceneIdx > 0) jumpToScene(currentSceneIdx - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      // Navigation does not award completion.
      if (currentSceneIdx < scenes.length - 1) {
        jumpToScene(currentSceneIdx + 1);
      }
    });
  }

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      isMuted = !isMuted;
      btnMute.textContent = isMuted ? '🔇 음성 꺼짐' : '🔊 음성 켜짐';
      btnMute.setAttribute('aria-pressed', String(isMuted));
      if (isMuted) stopNarration();
      updateBgmGain();
      if (statusMsg) {
        statusMsg.textContent = isMuted ? '음성을 껐어요. 자막과 영상은 계속 진행됩니다.' : '음성을 켰어요.';
      }
    });
  }

  if (btnBgm) {
    btnBgm.addEventListener('click', () => {
      isBgmOn = !isBgmOn;
      btnBgm.textContent = isBgmOn ? '🎵 배경음악 켜짐' : '🎵 배경음악 꺼짐';
      btnBgm.setAttribute('aria-pressed', String(isBgmOn));
      initBgm();
      updateBgmGain();
    });
  }

  if (btnTextSize) {
    btnTextSize.addEventListener('click', () => {
      isLargeText = !isLargeText;
      if (captionContainer) {
        captionContainer.classList.toggle('large-text', isLargeText);
      }
      btnTextSize.textContent = isLargeText ? '🔠 글자 보통' : '🔠 글자 크게';
    });
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          btnFullscreen.textContent = '⛶ 큰 화면으로 보기';
        } else if (playerCard) {
          await playerCard.requestFullscreen();
          btnFullscreen.textContent = '⛶ 전체화면 나가기';
        }
      } catch (e) {
        console.warn('Fullscreen error:', e);
      }
    });
  }

  document.addEventListener('fullscreenchange', () => {
    if (btnFullscreen) {
      btnFullscreen.textContent = document.fullscreenElement ? '⛶ 전체화면 나가기' : '⛶ 큰 화면으로 보기';
    }
  });

  if (progressTimeline) {
    progressTimeline.addEventListener('input', (e) => {
      const resumeAfterSeek = isPlaying;
      pause('');
      const targetVal = parseFloat(e.target.value);
      let accum = 0;
      for (let i = 0; i < scenes.length; i++) {
        if (targetVal <= accum + scenes[i].duration || i === scenes.length - 1) {
          currentSceneIdx = i;
          sceneElapsed = Math.max(0, targetVal - accum);
          displayScene(currentSceneIdx);
          break;
        }
        accum += scenes[i].duration;
      }
      updateOverallTimeline();
      if (resumeAfterSeek) play();
    });
  }

  // Replay from modal
  const btnReplay = $('btnReplayExercise');
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      if (completeModal) {
        completeModal.hidden = true;
        completeModal.style.display = 'none';
      }
      completedScenes.clear();
      stampAwarded = false;
      watchedSeconds.clear();
      jumpToScene(0);
      setExerciseState('playing');
      play();
    });
  }

  // TTS Help Button
  const btnTtsHelp = $('btnTtsExerciseHelp');
  if (btnTtsHelp) {
    btnTtsHelp.addEventListener('click', () => {
      speakText('디지털 에이아이 학교 어르신 체조 교실입니다. 의자에 편안하게 앉으신 뒤 지금 운동 시작하기 버튼을 누르시면 1번 시작 인사부터 10번 마무리까지 천천히 자동으로 진행됩니다.');
    });
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (!programReady || currentExerciseState === 'completed') return;
    if (e.target.closest('input,textarea,button,a,select,summary,[role="button"]')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (currentExerciseState === 'ready') {
        setExerciseState('playing');
        play();
      } else if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else if (e.code === 'ArrowLeft' && currentExerciseState === 'playing') {
      if (currentSceneIdx > 0) jumpToScene(currentSceneIdx - 1);
    } else if (e.code === 'ArrowRight' && currentExerciseState === 'playing') {
      if (currentSceneIdx < scenes.length - 1) jumpToScene(currentSceneIdx + 1);
    }
  });

  // Init Program
  async function init() {
    try {
      // Ensure Complete Modal is completely hidden at start
      if (completeModal) {
        completeModal.hidden = true;
        completeModal.style.display = 'none';
      }

      if (statusMsg) {
        statusMsg.textContent = '체조 자료와 음성을 준비하고 있어요...';
      }

      const res = await fetch('assets/senior-exercise/program.json');
      if (!res.ok) throw new Error('program.json load failed');
      program = await res.json();
      scenes = program.scenes.map((scene,i) => ({...scene,
        exerciseId:scene.exerciseId || `exercise-${String(i+1).padStart(2,'0')}`,
        instruction:scene.instruction || scene.subtitle || scene.title,
        audioText:scene.audioText || scene.speechSteps?.[0]?.text || scene.instruction || scene.title,
        speechSteps:scene.speechSteps?.length ? scene.speechSteps : [{at:0,text:scene.audioText || scene.instruction || scene.title}]
      }));
      if (scenes.length !== 10 || scenes.some(sc => !sc.image || !Number.isFinite(sc.duration) || sc.duration <= 0)) throw new Error('Invalid exercise data');

      totalDuration = scenes.reduce((sum, sc) => sum + sc.duration, 0);
      if (progressTimeline) {
        progressTimeline.max = totalDuration;
      }

      // Preload images
      const imgPromises = scenes.map(sc => {
        const img = new Image();
        img.src = imagePath(sc);
        return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
      });
      await Promise.all(imgPromises);
      programReady = true;
      if ($('readyLoadStatus')) $('readyLoadStatus').textContent = '';

      renderReadySceneList();
      renderSceneGrid();
      displayScene(0);
      updateOverallTimeline();
      updateControls();

      // Explicitly set Ready State (State 1: Starts before play)
      setExerciseState('ready');

      // Double guarantee modal is hidden
      if (completeModal) {
        completeModal.hidden = true;
        completeModal.style.display = 'none';
      }

      if (statusMsg) {
        statusMsg.textContent = '준비됐어요. [지금 운동 시작하기] 버튼을 누르면 1번부터 10번까지 천천히 자동으로 이어집니다.';
      }
    } catch (err) {
      console.error('Init error:', err);
      if (statusMsg) {
        statusMsg.textContent = '체조 자료를 불러오지 못했습니다. 새로고침 해주세요.';
      }
      if ($('readyLoadStatus')) $('readyLoadStatus').textContent = '운동 자료를 불러오지 못했어요. 새로고침 해주세요.';
      updateControls();
    }
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden && isPlaying) pause(); });
  window.addEventListener('pagehide', () => { pause('');mediaRevision++;sceneVideo?.removeAttribute('src'); });
  init();
})();
