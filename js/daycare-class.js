/**
 * 디지털 AI 학교 - 주간보호센터 60분 수업 진행 엔진
 * (Daycare Class Progression & Timer Controller)
 */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);

  // URL에서 session 파라미터 확인 (?session=am 또는 ?session=pm)
  const urlParams = new URLSearchParams(window.location.search);
  let sessionType = urlParams.get('session');
  if (!sessionType) {
    const currentHour = new Date().getHours();
    sessionType = currentHour >= 13 ? 'pm' : 'am';
  }

  const isAM = sessionType === 'am';
  const sessionName = isAM ? '오전' : '오후';
  const resumeStorageKey = 'digital_school_daycare_resume_' + sessionType;

  // 오늘 프로그램 및 운영시간
  const program = window.DaycareSchedule ? window.DaycareSchedule.getTodayProgram() : null;
  const hours = window.DaycareSchedule ? window.DaycareSchedule.getProgramHours() : { amStart: '10:00', amEnd: '11:00', pmStart: '14:00', pmEnd: '15:00' };
  const timeSlotRange = isAM ? `${hours.amStart} ~ ${hours.amEnd}` : `${hours.pmStart} ~ ${hours.pmEnd}`;

  // 상태 관리
  let currentStep = 'attendance'; // attendance -> greeting -> act1 -> break -> act2 -> wrapup -> mood -> done
  let selectedElders = [];
  let totalElapsedSeconds = 0; // 활동 시간 (초)
  let breakElapsedSeconds = 0; // 휴식 시간 (초)
  let isPaused = false;
  let timerInterval = null;
  let subStepIndex = 1;
  const totalSubSteps = 8;
  let selectedMood = '😀 재미있었어요';

  // 음성 대사 (Requirement 23)
  const VOICE_SCRIPTS = {
    kongi: '안녕하세요. 오늘도 저 콩이와 천천히 몸을 움직여봐요. 힘들면 잠시 쉬어도 괜찮아요.',
    tori: '저 토리와 재미있는 놀이를 시작해볼까요? 천천히 해도 괜찮아요.',
    nabi: '정답을 꼭 맞히지 않아도 괜찮아요. 저와 함께 천천히 생각해봐요.',
    bori: '오늘도 좋아하는 활동을 저와 함께 즐겨봐요.'
  };

  // 신체 및 인지 세부 단계 안내 문구 (Requirement 11)
  const EXERCISE_SUBSTEPS = [
    { title: '목과 어깨 천천히 돌리기', desc: '의자에 바르게 앉아 목과 어깨를 부드럽게 3번 돌려볼까요?' },
    { title: '양팔 위로 뻗어 기지개 켜기', desc: '숨을 들이쉬며 두 팔을 하늘 높이 시원하게 올려보세요.' },
    { title: '가슴 펴고 숨 고르기', desc: '양손을 가슴에 얹고 천천히 맑은 공기를 들이마셔요.' },
    { title: '손가락 쥐었다 펴기', desc: '주먹을 쥐었다가 활짝 펴며 손끝의 감각을 깨워봐요.' },
    { title: '발끝 톡톡 까딱이기', desc: '발가락을 바닥에 가볍게 톡톡 두드리며 리듬을 타봐요.' },
    { title: '무릎 살짝 들어올리기', desc: '무리하지 않고 오른쪽, 왼쪽 무릎을 번갈아 살짝 올려요.' },
    { title: '건강 박수 세 번 짝짝짝', desc: '손뼉을 크게 세 번 치며 뇌와 신체를 신나게 깨워요.' },
    { title: '천천히 심호흡 마무리', desc: '편안하게 숨을 내쉬며 오늘 운동을 멋지게 마쳐요.' }
  ];

  const PLAY_SUBSTEPS = [
    { title: '정다운 인사 나누기', desc: '옆에 계신 짝꿍 어르신과 눈을 마주치며 반갑게 인사해요.' },
    { title: '추억의 물건 떠올리기', desc: '화면의 정겨운 옛날 물건의 이름을 천천히 맞춰볼까요?' },
    { title: '소리 듣고 동물 맞히기', desc: '어떤 동물 소리가 들리는지 귀를 기울여 들어보세요.' },
    { title: '같은 그림 카드 찾기', desc: '어디에 같은 짝이 숨어있는지 차근차근 찾아봐요.' },
    { title: '알쏭달쏭 우리 속담', desc: '‘낮말은 새가 듣고 밤말은 쥐가 듣는다’ 다음 문장을 맞춰요.' },
    { title: '노래 가사 기억하기', desc: '‘나의 살던 고향은 꽃피는 산골...’ 익숙한 노래를 흥얼거려요.' },
    { title: '손바닥 지압 놀이', desc: '두 손을 마주 비비며 따뜻한 온기를 느껴보세요.' },
    { title: '오늘 놀이 마무리', desc: '오늘 함께한 즐거운 놀이를 마음에 담아두어요.' }
  ];

  // 1. 초기화
  function init() {
    updateHeaderUI();
    renderAttendanceList();
    bindEvents();
    checkResumeState();
    startMasterTimer();
  }

  // 2. 상단 헤더 UI 업데이트
  function updateHeaderUI() {
    const badge = $('sessionBadge');
    if (badge) {
      badge.textContent = isAM ? '🌞 오늘 오전 수업' : '🌤 오늘 오후 수업';
      badge.className = 'daycare-session-badge ' + (isAM ? 'badge-am' : 'badge-pm');
    }
    updateTimerText();
  }

  // 3. 편안한 분 단위 타이머 (Requirement 8)
  function updateTimerText() {
    const timerDisplay = $('timerDisplay');
    if (!timerDisplay) return;
    const remainingSec = Math.max(0, 3600 - totalElapsedSeconds);
    const remainingMin = Math.ceil(remainingSec / 60);

    if (remainingMin <= 0) {
      timerDisplay.textContent = `${sessionName} 수업 (60분 완료)`;
    } else {
      timerDisplay.textContent = `오늘 ${sessionName} 수업 남은 시간 ${remainingMin}분`;
    }
  }

  // 마스터 타이머 루프
  function startMasterTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!isPaused && currentStep !== 'attendance' && currentStep !== 'done') {
        if (currentStep === 'break') {
          breakElapsedSeconds++;
        } else {
          totalElapsedSeconds++;
        }
        updateTimerText();
        saveResumeState();
      }
    }, 1000);
  }

  // 4. 출석 어르신 목록 렌더링 (Requirement 19, 28, 30)
  function renderAttendanceList() {
    const host = $('attendanceGrid');
    if (!host) return;
    const elders = window.DaycareSchedule ? window.DaycareSchedule.getElders() : [];

    host.innerHTML = elders.map((e, idx) => `
      <label class="attendance-item">
        <input type="checkbox" name="attendanceElder" value="${e.id}" ${idx < 3 ? 'checked' : ''}>
        <div>
          <div class="attendance-name">${e.masked} (${e.id})</div>
          <div class="attendance-meta">${e.age} · ${e.grade} · ${e.cognition}</div>
        </div>
      </label>
    `).join('');
  }

  // 5. 음성 안내 재생 (Requirement 23)
  function speakCurrentGuide() {
    let text = '';
    const char = isAM ? (currentStep === 'act2' ? 'nabi' : 'kongi') : (currentStep === 'act2' ? 'bori' : 'tori');

    if (currentStep === 'greeting') {
      text = VOICE_SCRIPTS[char];
    } else if (currentStep === 'act1') {
      const list = isAM ? EXERCISE_SUBSTEPS : PLAY_SUBSTEPS;
      const cur = list[subStepIndex - 1] || list[0];
      text = `${cur.title}. ${cur.desc}`;
    } else if (currentStep === 'break') {
      text = '잠깐 쉬어갈까요? 편안하게 숨을 고르고 따뜻한 물 한 모금 드세요.';
    } else if (currentStep === 'act2') {
      text = isAM ? VOICE_SCRIPTS.nabi : VOICE_SCRIPTS.bori;
    } else if (currentStep === 'wrapup') {
      text = isAM ? '오늘도 건강하게 몸과 마음을 움직이셨어요. 참 잘하셨습니다!' : '오늘 하루도 즐거운 추억을 함께 나누어 주셔서 감사합니다.';
    } else if (currentStep === 'mood') {
      text = '오늘 수업은 어떠셨어요? 마음에 드는 기분을 꾹 눌러주세요.';
    }

    if (text && window.speakAsCharacter) {
      window.speakAsCharacter(char, text);
    } else if (text && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ko-KR';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  }

  // 6. 단계 전환 (카드 표시/숨김)
  function goToStep(stepName) {
    currentStep = stepName;
    saveResumeState();

    document.querySelectorAll('.step-card').forEach(el => el.classList.add('hidden'));
    const target = $('card_' + stepName);
    if (target) {
      target.classList.remove('hidden');
      target.focus();
    }

    // 단계별 세부 화면 갱신
    if (stepName === 'greeting') {
      renderGreetingCard();
    } else if (stepName === 'act1') {
      renderAct1Card();
    } else if (stepName === 'act2') {
      renderAct2Card();
    } else if (stepName === 'wrapup') {
      renderWrapupCard();
    } else if (stepName === 'done') {
      renderDoneCard();
    }

    speakCurrentGuide();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Greeting 렌더링
  function renderGreetingCard() {
    const char = isAM ? 'kongi' : 'tori';
    const charName = isAM ? '콩이' : '토리';
    $('greetingCharImg').src = `assets/images/uniform-${char}.png`;
    $('greetingCharImg').alt = charName;
    $('greetingText').textContent = `"${VOICE_SCRIPTS[char]}"`;
    $('greetingSubInfo').textContent = `${program ? program.dayName : '오늘'} ${sessionName} 프로그램 (${timeSlotRange})`;
  }

  // Act1 (신체운동/놀이) 렌더링
  function renderAct1Card() {
    const list = isAM ? EXERCISE_SUBSTEPS : PLAY_SUBSTEPS;
    const cur = list[subStepIndex - 1] || list[0];
    const char = isAM ? 'kongi' : 'tori';
    const charName = isAM ? '콩이' : '토리';

    $('act1Counter').textContent = `${charName}와 함께하기 ${subStepIndex} / ${totalSubSteps}`;
    $('act1Title').textContent = cur.title;
    $('act1Desc').textContent = cur.desc;
    $('act1CharImg').src = `assets/images/uniform-${char}.png`;
    $('act1CharImg').alt = charName;

    $('btnAct1Prev').disabled = subStepIndex <= 1;
    $('btnAct1Next').textContent = subStepIndex >= totalSubSteps ? '다음: 5분 쉬어가기 ▶' : '다음 동작 ▶';
  }

  // Act2 (인지/취미) 렌더링
  function renderAct2Card() {
    const char = isAM ? 'nabi' : 'bori';
    const charName = isAM ? '나비' : '보리';
    const actName = isAM ? (program?.am?.partnerActivity || '인지활동') : (program?.pm?.partnerActivity || '취미활동');

    $('act2Title').textContent = `${charName}와 ${actName}`;
    $('act2Desc').textContent = `"${VOICE_SCRIPTS[char]}"`;
    $('act2CharImg').src = `assets/images/uniform-${char}.png`;
    $('act2CharImg').alt = charName;
  }

  // Wrapup 렌더링
  function renderWrapupCard() {
    $('wrapupTitle').textContent = isAM ? '🌷 오전 활동 마무리 및 휴식' : '🌷 오늘 오후 활동 돌아보기';
    $('wrapupDesc').textContent = isAM
      ? '가벼운 숨고르기와 함께 오늘 콩이, 나비와 함께한 즐거운 수업을 마무리해요.'
      : '오늘 토리, 보리와 어떤 활동을 하셨는지 서로 이야기 나누며 하루를 돌아봐요.';
  }

  // Done (완료) 렌더링 및 저장
  function renderDoneCard() {
    const minutes = Math.max(1, Math.round(totalElapsedSeconds / 60));
    $('doneSummaryText').textContent = `오늘 ${sessionName} 프로그램 ${minutes}분 참여를 훌륭하게 완주하셨습니다!`;

    // 선택된 참여자 전원 저장
    saveSessionResults(minutes);
    clearResumeState();
  }

  // 7. 세션 결과 저장 (Requirement 13, 15)
  function saveSessionResults(minutes) {
    const elders = window.DaycareSchedule ? window.DaycareSchedule.getElders() : [];
    const participants = elders.filter(e => selectedElders.includes(e.id));
    const now = new Date();
    const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    const rawDateStr = now.toISOString().slice(0, 10);
    const progTitle = isAM
      ? `콩이 ${program?.am?.activity || '운동'} + 나비 ${program?.am?.partnerActivity || '학습'}`
      : `토리 ${program?.pm?.activity || '놀이'} + 보리 ${program?.pm?.partnerActivity || '취미'}`;

    participants.forEach(p => {
      // 1) RecordManager 에 저장 (동기화)
      if (window.RecordManager) {
        window.RecordManager.saveRecord({
          learner: p.name + ' 어르신',
          lessonTitle: progTitle,
          lessonIcon: isAM ? '🌞' : '🌤',
          isCompleted: true,
          mood: selectedMood,
          moodEmoji: selectedMood.slice(0, 2),
          assistanceNeeded: '스스로 원활히 참여하심',
          durationText: `${minutes}분`,
          sessionType: sessionType,
          timeSlot: sessionName,
          date: dateStr,
          rawDate: rawDateStr,
          elder_id: p.id,
          participation: '◎ 적극 참여',
          assistance: '도움 없음',
          notes: `${p.masked} 어르신 ${sessionName} 60분 통합 프로그램 원활히 참여 완료.`
        });
      }

      // 2) digital_school_management_v1 (care-workflow) 에도 동기화
      try {
        const KEY = 'digital_school_management_v1';
        const raw = localStorage.getItem(KEY);
        const data = raw ? JSON.parse(raw) : { elders: [], sessions: [], reports: [], programs: [], schedules: [] };
        data.sessions = data.sessions || [];
        data.sessions.unshift({
          session_id: 'SES_' + Date.now() + '_' + p.id,
          elder_id: p.id,
          date: rawDateStr,
          timeSlot: sessionName,
          sessionType: sessionType,
          programName: progTitle,
          character: isAM ? 'kongi' : 'tori',
          startTime: isAM ? hours.amStart : hours.pmStart,
          endTime: isAM ? hours.amEnd : hours.pmEnd,
          durationMinutes: minutes,
          isCompleted: true,
          participation: '◎ 적극 참여',
          mood: selectedMood,
          assistance: '도움 없음',
          notes: `${p.masked} 어르신 ${sessionName} 정규 수업 참여`,
          createdAt: now.toISOString()
        });
        localStorage.setItem(KEY, JSON.stringify(data));
      } catch (e) {
        console.error('케어 워크플로우 저장 오류:', e);
      }
    });
  }

  // 8. 이어하기 상태 관리 (Requirement 26)
  function saveResumeState() {
    if (currentStep === 'attendance' || currentStep === 'done') return;
    try {
      const state = {
        sessionType,
        currentStep,
        subStepIndex,
        selectedElders,
        totalElapsedSeconds,
        breakElapsedSeconds,
        savedAt: Date.now()
      };
      localStorage.setItem(resumeStorageKey, JSON.stringify(state));
    } catch (e) {}
  }

  function clearResumeState() {
    localStorage.removeItem(resumeStorageKey);
  }

  function checkResumeState() {
    try {
      const raw = localStorage.getItem(resumeStorageKey);
      if (!raw) return;
      const state = JSON.parse(raw);
      // 당일 3시간 이내의 기록인 경우만 복구 안내
      if (Date.now() - state.savedAt < 3 * 3600 * 1000 && state.currentStep && state.currentStep !== 'done') {
        const modal = $('resumeModal');
        if (modal) {
          $('resumeText').textContent = `이전에 진행 중이던 ${sessionName} 수업(${Math.round(state.totalElapsedSeconds / 60)}분 경과)이 있습니다. 이어서 하시겠습니까?`;
          modal.classList.remove('hidden');

          $('btnResumeYes').onclick = () => {
            modal.classList.add('hidden');
            totalElapsedSeconds = state.totalElapsedSeconds || 0;
            breakElapsedSeconds = state.breakElapsedSeconds || 0;
            subStepIndex = state.subStepIndex || 1;
            selectedElders = state.selectedElders || [];
            goToStep(state.currentStep || 'greeting');
          };

          $('btnResumeNo').onclick = () => {
            modal.classList.add('hidden');
            clearResumeState();
            totalElapsedSeconds = 0;
            breakElapsedSeconds = 0;
          };
        }
      }
    } catch (e) {}
  }

  // 9. 이벤트 바인딩
  function bindEvents() {
    // 음성 다시 듣기
    $('btnVoiceReplay')?.addEventListener('click', speakCurrentGuide);

    // 일시 정지 (Requirement 25)
    $('btnClassPause')?.addEventListener('click', () => {
      isPaused = !isPaused;
      const btn = $('btnClassPause');
      if (isPaused) {
        btn.textContent = '▶ 계속하기';
        btn.style.background = '#E8F5E9';
        btn.style.color = '#2E7D32';
        if (window.speechSynthesis) window.speechSynthesis.pause();
      } else {
        btn.textContent = '⏸ 잠시 멈추기';
        btn.style.background = '';
        btn.style.color = '';
        if (window.speechSynthesis) window.speechSynthesis.resume();
      }
    });

    // 5분 쉬기 (Requirement 24)
    $('btnTakeBreak')?.addEventListener('click', () => {
      goToStep('break');
    });

    // 출석 완료 -> 수업 시작
    $('btnStartClass')?.addEventListener('click', () => {
      const checked = Array.from(document.querySelectorAll('input[name="attendanceElder"]:checked')).map(el => el.value);
      if (!checked.length) {
        alert('수업에 참여할 어르신을 한 분 이상 선택해주세요.');
        return;
      }
      selectedElders = checked;
      goToStep('greeting');
    });

    // 인사 -> 활동 1
    $('btnGreetingNext')?.addEventListener('click', () => {
      subStepIndex = 1;
      goToStep('act1');
    });

    // 활동 1 이전/다음
    $('btnAct1Prev')?.addEventListener('click', () => {
      if (subStepIndex > 1) {
        subStepIndex--;
        renderAct1Card();
        speakCurrentGuide();
      }
    });

    $('btnAct1Next')?.addEventListener('click', () => {
      if (subStepIndex < totalSubSteps) {
        subStepIndex++;
        renderAct1Card();
        speakCurrentGuide();
      } else {
        goToStep('break');
      }
    });

    // 쉬어가기 카드 버튼
    $('btnBreakContinue')?.addEventListener('click', () => {
      goToStep('act2');
    });

    // 활동 2 -> 마무리
    $('btnAct2Next')?.addEventListener('click', () => {
      goToStep('wrapup');
    });

    // 마무리 -> 기분 선택
    $('btnWrapupNext')?.addEventListener('click', () => {
      goToStep('mood');
    });

    // 기분 선택 버튼들 (Requirement 12)
    document.querySelectorAll('.btn-mood-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedMood = btn.dataset.mood || '😀 재미있었어요';
        goToStep('done');
      });
    });

    // 전체 출석 토글
    $('btnSelectAllAttendance')?.addEventListener('click', () => {
      const inputs = document.querySelectorAll('input[name="attendanceElder"]');
      const allChecked = Array.from(inputs).every(i => i.checked);
      inputs.forEach(i => i.checked = !allChecked);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
