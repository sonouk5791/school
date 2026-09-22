/**
 * 디지털 학교 - 메인 애플리케이션 진입점 및 내비게이션 컨트롤러 (App Controller)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 모듈 초기화
  window.VoiceManager.init();
  window.RecordManager.init();

  initNavigation();
  initVoiceControls();
  initLessonCards();
  initTeacherModal();
  initHeroActions();
  initFloatingActions();
  initPrivacyModal();
  initDailyRecommendations();

  // First-entry greeting is handled by welcome-greeting.js using recordings only.

});

// 상단 내비게이션 탭 처리
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const target = link.dataset.target;
      if (target === 'home' || target === 'lessons') {
        window.scrollTo({ top: target === 'lessons' ? 450 : 0, behavior: 'smooth' });
        // Section 7: 메인 수업 선택 화면 진입 시 안내 음성 (세션당 1회)
        if (target === 'lessons' && !sessionStorage.getItem('digital_school_lesson_select_guided') && !window.VoiceManager.isMuted) {
          sessionStorage.setItem('digital_school_lesson_select_guided', 'true');
          const script = window.VoiceScripts && window.VoiceScripts.lessonSelect;
          if (script) {
            window.VoiceManager.speak(script);
          }
        }
      } else if (target === 'ai-friend') {
        window.LessonEngine.startLesson('greeting');
      } else if (target === 'history') {
        openTeacherModal();
      }
    });
  });
}

// 상단 고정 AI 선생님 음성 및 접근성 컨트롤 UI 동기화
function updateGlobalVoiceUI() {
  const isMuted = window.VoiceManager.isMuted;
  const speed = window.VoiceManager.speedMode;

  // 1. 음성 켜기/끄기 토글 버튼
  const btnToggle = document.getElementById('btnTtsToggle');
  const iconToggle = document.getElementById('iconVoiceToggle');
  const textToggle = document.getElementById('textVoiceToggle');

  if (btnToggle) {
    if (isMuted) {
      btnToggle.classList.add('muted');
      if (iconToggle) iconToggle.textContent = '🔇';
      if (textToggle) textToggle.textContent = '음성 끄기';
    } else {
      btnToggle.classList.remove('muted');
      if (iconToggle) iconToggle.textContent = '🔊';
      if (textToggle) textToggle.textContent = '선생님 음성';
    }
  }

  // 2. 음성 속도 토글 버튼 및 화면 애니메이션 감속 연동
  const iconSpeed = document.getElementById('iconVoiceSpeed');
  const textSpeed = document.getElementById('textVoiceSpeed');
  const btnLessonSpeed = document.getElementById('btnLessonSpeed');

  const speedText = speed === 'slow' ? '천천히' : '보통';
  const speedIcon = speed === 'slow' ? '🐢' : '▶';

  if (iconSpeed) iconSpeed.textContent = speedIcon;
  if (textSpeed) textSpeed.textContent = speedText;
  if (btnLessonSpeed) btnLessonSpeed.innerHTML = `${speedIcon} ${speedText}`;

  // 천천히 모드일 때 전체 UI 전환 및 애니메이션도 여유롭게 감속
  document.documentElement.classList.toggle('slow-motion-mode', speed === 'slow');
  document.body.classList.toggle('slow-motion-mode', speed === 'slow');

  // 3. 일시정지 / 이어듣기 상태 동기화
  if (window.VoiceManager && window.VoiceManager._updatePauseUI) {
    window.VoiceManager._updatePauseUI();
  }
}
window.updateGlobalVoiceUI = updateGlobalVoiceUI;

// 글자 크기 및 고대비 접근성 설정 로드 및 동기화
function initAccessibilityPreferences() {
  // 1. 글자 크기 (normal, large, xlarge)
  const savedScale = localStorage.getItem('digital_school_font_scale') || 'normal';
  applyFontSize(savedScale);

  // 2. 고대비 모드
  const savedContrast = localStorage.getItem('digital_school_high_contrast') === 'true';
  applyHighContrast(savedContrast);
}

function applyFontSize(scale) {
  document.documentElement.classList.remove('font-scale-large', 'font-scale-xlarge');
  document.body.classList.remove('font-scale-large', 'font-scale-xlarge');

  if (scale === 'large') {
    document.documentElement.classList.add('font-scale-large');
    document.body.classList.add('font-scale-large');
  } else if (scale === 'xlarge') {
    document.documentElement.classList.add('font-scale-xlarge');
    document.body.classList.add('font-scale-xlarge');
  }

  localStorage.setItem('digital_school_font_scale', scale);

  const textBtn = document.getElementById('textFontSize');
  if (textBtn) {
    textBtn.textContent = scale === 'xlarge' ? '글자 아주크게' : scale === 'large' ? '글자 크게' : '글자 보통';
  }
}

function applyHighContrast(enabled) {
  document.documentElement.classList.toggle('high-contrast-mode', enabled);
  document.body.classList.toggle('high-contrast-mode', enabled);

  localStorage.setItem('digital_school_high_contrast', enabled ? 'true' : 'false');

  const textBtn = document.getElementById('textHighContrast');
  const btn = document.getElementById('btnHighContrast');
  if (textBtn) {
    textBtn.textContent = enabled ? '고대비 켬' : '고대비';
  }
  if (btn) {
    btn.classList.toggle('active', enabled);
  }
}

// 상단 고정 접근성 음성 컨트롤 바 이벤트 바인딩 (Section 20 & 31)
function initVoiceControls() {
  initAccessibilityPreferences();
  updateGlobalVoiceUI();

  // 1. 음성 On/Off 토글
  const btnToggle = document.getElementById('btnTtsToggle');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      window.VoiceManager.toggleMute();
      updateGlobalVoiceUI();
    });
  }

  // 2. 음성 일시정지 / 이어듣기 토글
  const btnPause = document.getElementById('btnVoicePause');
  if (btnPause) {
    btnPause.addEventListener('click', () => {
      window.VoiceManager.togglePause();
      updateGlobalVoiceUI();
    });
  }

  // 3. 다시 듣기
  const btnReplay = document.getElementById('btnVoiceReplay');
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      window.VoiceManager.replayLastScript();
    });
  }

  // 4. 속도 변경 (천천히 ↔ 보통)
  const btnSpeed = document.getElementById('btnVoiceSpeed');
  if (btnSpeed) {
    btnSpeed.addEventListener('click', () => {
      window.VoiceManager.toggleSpeed();
      updateGlobalVoiceUI();
    });
  }

  // 5. 글자 크기 조절 (보통 ↔ 크게 ↔ 아주크게)
  const btnFontSize = document.getElementById('btnFontSize');
  if (btnFontSize) {
    btnFontSize.addEventListener('click', () => {
      const current = localStorage.getItem('digital_school_font_scale') || 'normal';
      const next = current === 'normal' ? 'large' : current === 'large' ? 'xlarge' : 'normal';
      applyFontSize(next);
      if (!window.VoiceManager.isMuted) {
        const desc = next === 'xlarge' ? '글자 크기를 아주 크게 설정했어요.' : next === 'large' ? '글자 크기를 크게 설정했어요.' : '글자 크기를 보통으로 맞췄어요.';
        window.VoiceManager.speak(desc);
      }
    });
  }

  // 6. 고대비 화면 모드 토글
  const btnContrast = document.getElementById('btnHighContrast');
  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      const current = localStorage.getItem('digital_school_high_contrast') === 'true';
      const next = !current;
      applyHighContrast(next);
      if (!window.VoiceManager.isMuted) {
        window.VoiceManager.speak(next ? '눈이 편안한 고대비 화면을 켰어요.' : '기본 화면으로 돌아왔어요.');
      }
    });
  }

  // 7. 도움말 안내
  const btnHelp = document.getElementById('btnVoiceHelp');
  if (btnHelp) {
    btnHelp.addEventListener('click', () => {
      window.VoiceManager.speakHelp("여기에서 배우고 싶은 수업을 골라볼 수 있어요. 마음에 드는 수업 카드를 편하게 하나 골라보세요.");
    });
  }
}

// 8대 수업 카드 클릭 이벤트 바인딩
function initLessonCards() {
  const cards = document.querySelectorAll('.lesson-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const lessonId = card.dataset.lessonId;
      if (lessonId) {
        window.VoiceManager.playChime('click');
        window.LessonEngine.startLesson(lessonId);
      }
    });
  });
}

// 히어로 영역 바로가기 버튼들
function initHeroActions() {
  const btnStartToday = document.getElementById('btnHeroStart');
  if (btnStartToday && btnStartToday.tagName === 'BUTTON') {
    btnStartToday.addEventListener('click', () => {
      window.LessonEngine.startLesson('greeting');
    });
  }

  const btnMeetAi = document.getElementById('btnHeroMeetAi');
  if (btnMeetAi) {
    btnMeetAi.addEventListener('click', () => {
      const actSec = document.getElementById('seniorActivitiesSection');
      if (actSec) {
        actSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.LessonEngine.startLesson('greeting');
      }
    });
  }

  const btnViewHistory = document.getElementById('btnHeroHistory');
  if (btnViewHistory) {
    btnViewHistory.addEventListener('click', () => {
      openTeacherModal();
    });
  }

  const btnViewHistoryBottom = document.getElementById('btnHeroHistoryBottom');
  if (btnViewHistoryBottom) {
    btnViewHistoryBottom.addEventListener('click', () => {
      openTeacherModal();
    });
  }

  const btnToggleAll = document.getElementById('btnToggleAllLessons');
  const drawer = document.getElementById('moreLessonsDrawer');
  if (btnToggleAll && drawer) {
    btnToggleAll.addEventListener('click', () => {
      const isHidden = drawer.hidden;
      drawer.hidden = !isHidden;
      btnToggleAll.setAttribute('aria-expanded', String(isHidden));
      btnToggleAll.textContent = isHidden ? '📚 전체 수업 및 활동 접기 ▴' : '📚 전체 수업 및 활동 더보기 ▾';
      if (isHidden) {
        drawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}


// 사회복지사 / 선생님 공간 모달 제어
function initTeacherModal() {
  const btnOpen = document.getElementById('btnTeacherSpace');
  const modal = document.getElementById('teacherModal');
  const btnClose = document.getElementById('btnCloseTeacherModal');
  const selectFilter = document.getElementById('selectLearnerFilter');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      openTeacherModal();
      // 서브 네비게이션 바 표시
      const subnav = document.getElementById('teacherSubnav');
      if (subnav) subnav.style.display = '';
    });
  }

  const btnHeaderJournal = document.getElementById('btnHeaderJournal');
  if (btnHeaderJournal) {
    btnHeaderJournal.addEventListener('click', () => {
      closeTeacherModal();
      const careNavBtn = document.querySelector('.care-nav button[data-value="journals"]');
      if (careNavBtn) {
        careNavBtn.click();
      } else {
        const careRoot = document.getElementById('careRoot');
        if (careRoot) careRoot.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 서브 네비게이션 링크 활성화 및 care-workflow 페이지 연동
  const subnavMap = {
    'home': 'home',
    'users': 'elders',
    'today-ai': 'home',
    'records': 'records',
    'ai-journal': 'journals',
    'analysis': 'analysis',
    'report': 'reports',
    'settings': 'admin'
  };

  const subnavLinks = document.querySelectorAll('.subnav-link');
  subnavLinks.forEach(link => {
    link.addEventListener('click', () => {
      subnavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const targetSub = link.dataset.subnav;
      const careTarget = subnavMap[targetSub];
      if (careTarget) {
        closeTeacherModal();
        const targetBtn = document.querySelector(`.care-nav button[data-value="${careTarget}"]`);
        if (targetBtn) targetBtn.click();
      }
    });
  });

  // 선생님 공간 모달 내부 6대 탭 바 연동
  const modalTabItems = document.querySelectorAll('.teacher-tab-item');
  const defaultBody = document.getElementById('teacherPanelDefaultBody');
  const workflowMount = document.getElementById('teacherWorkflowMount');

  modalTabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      modalTabItems.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetTab = tab.dataset.tab;
      if (targetTab === 'records') {
        if (defaultBody) defaultBody.style.display = 'flex';
        if (workflowMount) {
          workflowMount.style.display = 'none';
          workflowMount.innerHTML = '';
        }
      } else {
        const careTarget = subnavMap[targetTab];
        if (careTarget) {
          closeTeacherModal();
          const targetBtn = document.querySelector(`.care-nav button[data-value="${careTarget}"]`);
          if (targetBtn) targetBtn.click();
        }
      }
    });
  });


  if (btnClose) {
    btnClose.addEventListener('click', () => {
      closeTeacherModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeTeacherModal();
      }
    });
  }

  if (selectFilter) {
    selectFilter.addEventListener('change', () => {
      renderTeacherRecords(selectFilter.value);
    });
  }

  // 수업 완료 등으로 돌봄 기록이 갱신되었을 때 실시간 반영
  window.addEventListener('care-record-updated', () => {
    const activeFilter = selectFilter ? selectFilter.value : 'all';
    populateLearnerFilter(activeFilter);
    renderTeacherRecords(activeFilter);
  });
}

function openTeacherModal() {
  const modal = document.getElementById('teacherModal');
  if (modal) {
    modal.classList.add('active');
    const selectFilter = document.getElementById('selectLearnerFilter');
    const currentFilter = selectFilter ? selectFilter.value : 'all';
    populateLearnerFilter(currentFilter);
    renderTeacherRecords(currentFilter);
  }
}

function closeTeacherModal() {
  const modal = document.getElementById('teacherModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function populateLearnerFilter(selectedVal = 'all') {
  const select = document.getElementById('selectLearnerFilter');
  if (!select) return;

  const learnerNames = window.RecordManager.getRegisteredLearners ? window.RecordManager.getRegisteredLearners() : ['김영자 어르신', '박순옥 어르신', '이종수 어르신', '정태호 어르신', '최말순 어르신'];

  let html = `<option value="all" ${selectedVal === 'all' ? 'selected' : ''}>전체 어르신 보기</option>`;
  learnerNames.forEach(name => {
    html += `<option value="${name}" ${selectedVal === name ? 'selected' : ''}>${name}</option>`;
  });
  select.innerHTML = html;
  if (selectedVal) {
    select.value = selectedVal;
  }
}

function renderTeacherRecords(filterLearner = 'all') {
  const stats = window.RecordManager.getCareStats(filterLearner);
  const records = window.RecordManager.getAllRecords();
  const filtered = filterLearner === 'all' ? records : records.filter(r => r.learner === filterLearner);

  // 상단 4종 통계 카드 업데이트
  const elTotal = document.getElementById('statTotalSessions');
  const elCompleted = document.getElementById('statCompletedSessions');
  const elPositive = document.getElementById('statPositiveRate');
  const elActive = document.getElementById('statActiveLearners');

  if (elTotal) elTotal.textContent = `${stats.totalSessions}회`;
  if (elCompleted) elCompleted.textContent = `${stats.completedSessions}회 완료`;
  if (elPositive) elPositive.textContent = `${stats.positiveRate}%`;
  if (elActive) elActive.textContent = `${stats.activeLearnersCount}명`;

  // 테이블 행 렌더링
  const tbody = document.getElementById('careRecordsTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
          선택하신 어르신의 기록된 수업 내역이 없습니다.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  filtered.forEach(rec => {
    html += `
      <tr>
        <td><strong>${rec.date}</strong></td>
        <td><span style="font-weight: 700; color: var(--color-orange-main);">${rec.learner}</span></td>
        <td><span>${rec.lessonIcon || '📖'} ${rec.lessonTitle}</span></td>
        <td><span class="badge-status-completed">✓ ${rec.isCompleted ? '완료' : '진행'}</span></td>
        <td><span class="mood-tag-sm">${rec.mood || '😊 재미있었어요'}</span></td>
        <td><span class="badge-help-normal">${rec.assistanceNeeded || '스스로 원활히 참여하심'}</span></td>
        <td><strong>${rec.durationText || '3분'}</strong></td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

// 우측 하단 고정 액션 버튼 (TOP & 관리자) 초기화
function initFloatingActions() {
  const btnTop = document.getElementById('btnFloatingTop');
  const btnAdmin = document.getElementById('btnFloatingAdmin');

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const lessonVp = document.getElementById('lessonViewport');
      if (lessonVp) {
        lessonVp.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
      closeTeacherModal();
      
      // 1. care-workflow nav 관리자 설정 버튼 탐색
      const careAdminBtn = document.querySelector('.care-nav button[data-value="admin"]');
      if (careAdminBtn) {
        careAdminBtn.click();
      } else {
        // 2. 상단 서브네비게이션의 관리자 설정 링크 탐색
        const subnavAdmin = document.querySelector('.subnav-link[data-subnav="settings"]');
        if (subnavAdmin) {
          subnavAdmin.click();
        } else if (window.careWorkflow && typeof window.careWorkflow.route === 'function') {
          window.careWorkflow.route('admin');
        } else {
          openTeacherModal();
        }
      }

      // 관리자 화면 영역으로 부드럽게 스크롤 이동
      const careRoot = document.getElementById('careRoot');
      if (careRoot) {
        setTimeout(() => {
          careRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  }
}

// 개인정보처리방침 모달 다이얼로그 초기화
function initPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  const btnOpen = document.getElementById('btnOpenPrivacy');
  const btnClose = document.getElementById('btnClosePrivacy');
  const btnConfirm = document.getElementById('btnConfirmPrivacy');

  if (!modal) return;

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    });
  }

  const closeModal = () => {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  };

  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnConfirm) btnConfirm.addEventListener('click', closeModal);

  // 모달 바깥 배경 클릭 시 닫기
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
      && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      closeModal();
    }
  });
}

// 3차 고도화: 일일 추천 활동 및 요일별 테마, 출석 인사 초기화
function initDailyRecommendations() {
  const themeBadge = document.getElementById('dailyDayThemeBadge');
  if (themeBadge) {
    const day = new Date().getDay(); // 0: 일, 1: 월, 2: 화, 3: 수, 4: 목, 5: 금, 6: 토
    const dayThemes = [
      '🌿 일요일: 편안한 휴식과 따뜻한 대화의 날',
      '🌸 월요일: 새로운 꽃 향기 가득한 날',
      '👕 화요일: 멋진 새 옷을 입어보는 날',
      '🧸 수요일: 신나는 새로운 놀이의 날',
      '🎨 목요일: 고운 새 그림을 감상하는 날',
      '🎵 금요일: 정겨운 새 음악을 들려주는 날',
      '🏃 토요일: 활기찬 기지개와 스트레칭의 날'
    ];
    themeBadge.textContent = dayThemes[day] || dayThemes[1];
  }

  // 카드 클릭 시 캐릭터별 정겨운 출석 음성 안내
  const cards = document.querySelectorAll('.daily-rec-card');
  const greetings = [
    '콩이: 오늘도 만나서 반가워요! 편안하게 5분 체조를 함께해봐요.',
    '토리: 오늘도 같이 놀아요! 알록달록 같은 꽃을 맞춰봐요.',
    '나비: 오늘은 무엇을 알아볼까요? 차근차근 계절을 알아봐요.',
    '곰이: 오늘도 편안하게 함께해요. 좋아하는 정겨운 음악을 들어요.'
  ];

  cards.forEach((card, idx) => {
    card.style.cursor = 'pointer';
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => {
      if (window.VoiceManager && typeof window.VoiceManager.speakText === 'function') {
        window.VoiceManager.speakText(greetings[idx]);
      } else if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(greetings[idx]);
        utter.lang = 'ko-KR';
        utter.rate = 0.85;
        window.speechSynthesis.speak(utter);
      }
    });
  });
}

// 글로벌 등록
window.openTeacherModal = openTeacherModal;
window.closeTeacherModal = closeTeacherModal;
window.initFloatingActions = initFloatingActions;
window.initPrivacyModal = initPrivacyModal;
window.initDailyRecommendations = initDailyRecommendations;
