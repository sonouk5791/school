/**
 * 디지털 AI 학교 - 치매 어르신 체조 통합 연속 영상 플레이어 (SCENE 1 ~ 10)
 * - 단 한 번의 시작 버튼으로 SCENE 1부터 SCENE 10까지 부드러운 페이드 전환과 함께 자동 연속 재생
 * - 따뜻한 한국어 여성 음성(TTS) + 잔잔한 피아노 BGM + 대형 자막 + 동작 모션 애니메이션
 */
(() => {
  'use strict';

  // DOM Elements
  const $ = id => document.getElementById(id);
  const frontImg = $('sceneFront');
  const backImg = $('sceneBack');
  const stageWrapper = $('stageWrapper');
  const sceneBadge = $('sceneBadge');
  const characterTag = $('characterTag');
  const countBadge = $('countBadge');
  const cueLead = $('cueLead');
  const captionText = $('captionText');
  const captionContainer = $('captionContainer');
  const progressTimeline = $('progressTimeline');
  const timeIndicator = $('timeIndicator');
  const statusMsg = $('statusMsg');
  const sceneGrid = $('sceneGrid');
  const playerCard = $('playerCard');

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

  // State Variables
  let program = null;
  let scenes = [];
  let currentSceneIdx = 0;
  let currentStepIdx = -1;
  let isPlaying = false;
  let isMuted = false;
  let isBgmOn = true;
  let isLargeText = false;
  let totalDuration = 0;
  let sceneTimer = null;
  let stepTimer = null;
  let sceneStartTime = 0;
  let sceneElapsed = 0;
  let bgmAudioCtx = null;
  let bgmGainNode = null;
  let bgmInterval = null;

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
  function speakText(text) {
    if (isMuted || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.75; // 느리고 또박또박
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.startsWith('ko') && (v.name.includes('Yuna') || v.name.includes('SunHi') || v.name.includes('Heami') || v.name.includes('Korean') || v.name.includes('Google')));
      if (koVoice) utterance.voice = koVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  }

  // --- Render Scene Grid ---
  function renderSceneGrid() {
    sceneGrid.innerHTML = '';
    scenes.forEach((sc, idx) => {
      const card = document.createElement('div');
      card.className = `se-thumb-card ${idx === currentSceneIdx ? 'active' : ''}`;
      card.innerHTML = `
        <img class="se-thumb-img" src="assets/senior-exercise/images/${sc.image}" alt="${sc.title}" loading="lazy">
        <div class="se-thumb-info">
          <div class="se-thumb-num">SCENE ${sc.index}</div>
          <div class="se-thumb-title">${sc.title}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        jumpToScene(idx);
      });
      sceneGrid.appendChild(card);
    });
  }

  function updateActiveThumbnail() {
    const cards = sceneGrid.querySelectorAll('.se-thumb-card');
    cards.forEach((card, idx) => {
      if (idx === currentSceneIdx) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        card.classList.remove('active');
      }
    });
  }

  // --- Apply Motion Class to Scene ---
  function applySceneMotion(motionType) {
    // Remove all previous motion classes
    frontImg.className = 'se-scene-layer';
    if (motionType) {
      frontImg.classList.add(`motion-${motionType}`);
    }
  }

  // --- Display Scene UI ---
  function displayScene(sceneIdx) {
    if (!scenes[sceneIdx]) return;
    currentSceneIdx = sceneIdx;
    const scene = scenes[sceneIdx];

    // Smooth Crossfade
    const newSrc = `assets/senior-exercise/images/${scene.image}`;
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

    // Top Header Badge
    sceneBadge.textContent = scene.displayTitle || `${scene.index} / ${scenes.length} ${scene.title}`;
    characterTag.textContent = scene.character;
    characterTag.style.backgroundColor = scene.characterColor || '#2d5a27';

    // Reset Cues
    currentStepIdx = -1;
    cueLead.textContent = scene.subtitle;
    captionText.textContent = scene.speechSteps[0]?.caption || scene.subtitle;
    countBadge.hidden = true;

    updateActiveThumbnail();
    updateControls();
  }

  // --- Playback Step Engine ---
  function runSceneLoop() {
    if (!isPlaying || !scenes[currentSceneIdx]) return;
    const scene = scenes[currentSceneIdx];
    sceneStartTime = performance.now() - sceneElapsed * 1000;

    const checkTimeline = () => {
      if (!isPlaying) return;
      const now = performance.now();
      sceneElapsed = (now - sceneStartTime) / 1000;

      // Find current active speechStep
      for (let i = scene.speechSteps.length - 1; i >= 0; i--) {
        const step = scene.speechSteps[i];
        if (sceneElapsed >= step.at) {
          if (currentStepIdx !== i) {
            currentStepIdx = i;
            cueLead.textContent = step.lead || scene.subtitle;
            captionText.textContent = step.caption;

            if (step.count) {
              countBadge.hidden = false;
              countBadge.textContent = step.count;
            } else {
              countBadge.hidden = true;
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
      if (sceneElapsed >= scene.duration) {
        if (currentSceneIdx < scenes.length - 1) {
          currentSceneIdx++;
          sceneElapsed = 0;
          displayScene(currentSceneIdx);
          runSceneLoop();
        } else {
          // Program Complete
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
    progressTimeline.value = current;
    timeIndicator.textContent = `${formatTime(current)} / ${formatTime(totalDuration)}`;
  }

  // --- Public Playback Actions ---
  function play() {
    if (isPlaying) return;
    isPlaying = true;
    initBgm();
    updateBgmGain();

    if (currentSceneIdx >= scenes.length - 1 && sceneElapsed >= (scenes[currentSceneIdx]?.duration || 10)) {
      currentSceneIdx = 0;
      sceneElapsed = 0;
    }

    displayScene(currentSceneIdx);
    runSceneLoop();
    updateControls();
    statusMsg.textContent = '편안하게 앉아서 천천히 따라해요. 무리하지 마세요.';
  }

  function pause(message = '잠시 쉬고 있어요. 준비되면 이어서 해요.') {
    isPlaying = false;
    clearTimeout(sceneTimer);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    updateBgmGain();
    updateControls();
    if (message) statusMsg.textContent = message;
  }

  function jumpToScene(idx) {
    const wasPlaying = isPlaying;
    pause('');
    currentSceneIdx = Math.max(0, Math.min(scenes.length - 1, idx));
    sceneElapsed = 0;
    displayScene(currentSceneIdx);
    updateOverallTimeline();
    if (wasPlaying) {
      play();
    } else {
      statusMsg.textContent = `[${scenes[currentSceneIdx].title}] 준비됐어요. 재생 버튼을 눌러주세요.`;
    }
  }

  function finishProgram() {
    pause('');
    sceneElapsed = scenes[currentSceneIdx].duration;
    updateOverallTimeline();
    statusMsg.textContent = '🎉 오늘도 어르신 체조를 끝까지 정말 잘하셨습니다! 건강하고 행복한 하루 보내세요.';
    captionText.textContent = '오늘도 정말 잘하셨어요!\n다음에 또 만나요.';
    cueLead.textContent = '마무리 인사';
    countBadge.hidden = true;

    // Award Stamp & Show Complete Modal
    try {
      const stamps = JSON.parse(localStorage.getItem('senior_stamps_v1') || '[]');
      const newStamp = {
        type: 'flower',
        title: '10단계 AI 어르신 의자 체조 완료',
        date: new Date().toISOString()
      };
      stamps.push(newStamp);
      localStorage.setItem('senior_stamps_v1', JSON.stringify(stamps));
    } catch (e) {
      console.warn('Stamp save error:', e);
    }

    const modal = document.getElementById('exerciseCompleteModal');
    if (modal) {
      modal.hidden = false;
      speakText('오늘도 정말 잘하셨습니다! 열 가지 건강 의자 체조를 모두 마치셨습니다.');
    }
  }

  function updateControls() {
    btnStart.disabled = isPlaying;
    btnPause.disabled = !isPlaying;
    btnPrev.disabled = currentSceneIdx <= 0;
    btnNext.disabled = currentSceneIdx >= scenes.length - 1;

    btnStart.textContent = isPlaying ? '▶ 재생 중...' : sceneElapsed > 0 ? '▶ 이어서 하기' : '▶ 어르신 체조 시작';
    btnHeroStart.textContent = isPlaying ? '⏸ 체조 진행 중' : sceneElapsed > 0 ? '▶ 이어서 하기' : '▶ 어르신 체조 시작';
  }

  // --- Event Listeners ---
  btnStart.addEventListener('click', play);
  btnHeroStart.addEventListener('click', () => {
    playerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!isPlaying) play();
  });

  btnPause.addEventListener('click', () => pause());

  btnRestart.addEventListener('click', () => {
    jumpToScene(0);
    play();
  });

  btnPrev.addEventListener('click', () => {
    if (currentSceneIdx > 0) jumpToScene(currentSceneIdx - 1);
  });

  btnNext.addEventListener('click', () => {
    if (currentSceneIdx < scenes.length - 1) jumpToScene(currentSceneIdx + 1);
  });

  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    btnMute.textContent = isMuted ? '🔇 소리 켜기' : '🔊 소리 끄기';
    btnMute.setAttribute('aria-pressed', String(isMuted));
    if (isMuted && window.speechSynthesis) window.speechSynthesis.cancel();
    updateBgmGain();
    statusMsg.textContent = isMuted ? '소리를 껐어요. 자막과 영상은 계속 진행됩니다.' : '소리를 켰어요.';
  });

  btnBgm.addEventListener('click', () => {
    isBgmOn = !isBgmOn;
    btnBgm.textContent = isBgmOn ? '🎵 배경음악 끄기' : '🎵 배경음악 켜기';
    btnBgm.setAttribute('aria-pressed', String(isBgmOn));
    initBgm();
    updateBgmGain();
  });

  btnTextSize.addEventListener('click', () => {
    isLargeText = !isLargeText;
    captionContainer.classList.toggle('large-text', isLargeText);
    btnTextSize.textContent = isLargeText ? '🔠 글자 보통' : '🔠 글자 크게';
  });

  btnFullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        btnFullscreen.textContent = '⛶ 전체화면';
      } else {
        await playerCard.requestFullscreen();
        btnFullscreen.textContent = '⛶ 전체화면 나가기';
      }
    } catch (e) {
      console.warn('Fullscreen error:', e);
    }
  });

  document.addEventListener('fullscreenchange', () => {
    btnFullscreen.textContent = document.fullscreenElement ? '⛶ 전체화면 나가기' : '⛶ 전체화면';
  });

  progressTimeline.addEventListener('input', (e) => {
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
  });

  // Replay from modal
  const btnReplay = document.getElementById('btnReplayExercise');
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      const modal = document.getElementById('exerciseCompleteModal');
      if (modal) modal.hidden = true;
      jumpToScene(0);
      play();
    });
  }

  // TTS Help Button
  const btnTtsHelp = document.getElementById('btnTtsExerciseHelp');
  if (btnTtsHelp) {
    btnTtsHelp.addEventListener('click', () => {
      speakText('디지털 에이아이 학교 어르신 체조 교실입니다. 의자에 편안하게 앉으신 뒤 어르신 체조 시작 버튼을 누르시면 1번 시작 인사부터 10번 마무리까지 천천히 자동으로 진행됩니다.');
    });
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (isPlaying) pause();
      else play();
    } else if (e.code === 'ArrowLeft') {
      if (currentSceneIdx > 0) jumpToScene(currentSceneIdx - 1);
    } else if (e.code === 'ArrowRight') {
      if (currentSceneIdx < scenes.length - 1) jumpToScene(currentSceneIdx + 1);
    }
  });

  // Init Program
  async function init() {
    try {
      statusMsg.textContent = '체조 자료와 음성을 준비하고 있어요...';
      const res = await fetch('assets/senior-exercise/program.json');
      if (!res.ok) throw new Error('program.json load failed');
      program = await res.json();
      scenes = program.scenes;

      totalDuration = scenes.reduce((sum, sc) => sum + sc.duration, 0);
      progressTimeline.max = totalDuration;

      // Preload images
      const imgPromises = scenes.map(sc => {
        const img = new Image();
        img.src = `assets/senior-exercise/images/${sc.image}`;
        return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
      });
      await Promise.all(imgPromises);

      renderSceneGrid();
      displayScene(0);
      updateOverallTimeline();
      updateControls();
      statusMsg.textContent = '준비됐어요. 어르신 체조 시작 버튼을 누르면 1번부터 10번까지 자동으로 이어집니다.';
    } catch (err) {
      console.error('Init error:', err);
      statusMsg.textContent = '체조 자료를 불러오지 못했습니다. 새로고침 해주세요.';
    }
  }

  init();
})();
