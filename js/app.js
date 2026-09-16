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

// 상단 고정 AI 선생님 음성 컨트롤 UI 동기화
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

  // 2. 음성 속도 토글 버튼
  const iconSpeed = document.getElementById('iconVoiceSpeed');
  const textSpeed = document.getElementById('textVoiceSpeed');
  const btnLessonSpeed = document.getElementById('btnLessonSpeed');

  const speedText = speed === 'slow' ? '천천히' : '보통';
  const speedIcon = speed === 'slow' ? '🐢' : '▶';

  if (iconSpeed) iconSpeed.textContent = speedIcon;
  if (textSpeed) textSpeed.textContent = speedText;
  if (btnLessonSpeed) btnLessonSpeed.innerHTML = `${speedIcon} ${speedText}`;

  // 3. 일시정지 / 이어듣기 상태 동기화
  if (window.VoiceManager && window.VoiceManager._updatePauseUI) {
    window.VoiceManager._updatePauseUI();
  }
}
window.updateGlobalVoiceUI = updateGlobalVoiceUI;

// 상단 고정 접근성 음성 컨트롤 바 이벤트 바인딩 (Section 20 & 31)
function initVoiceControls() {
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

  // 3. 속도 변경 (천천히 ↔ 보통)
  const btnSpeed = document.getElementById('btnVoiceSpeed');
  if (btnSpeed) {
    btnSpeed.addEventListener('click', () => {
      window.VoiceManager.toggleSpeed();
      updateGlobalVoiceUI();
    });
  }

  // 4. 도움말 안내
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
  if (btnStartToday) {
    btnStartToday.addEventListener('click', () => {
      window.LessonEngine.startLesson('greeting');
    });
  }

  const btnMeetAi = document.getElementById('btnHeroMeetAi');
  if (btnMeetAi) {
    btnMeetAi.addEventListener('click', () => {
      window.LessonEngine.startLesson('ask');
    });
  }

  const btnViewHistory = document.getElementById('btnHeroHistory');
  if (btnViewHistory) {
    btnViewHistory.addEventListener('click', () => {
      openTeacherModal();
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
}

function openTeacherModal() {
  const modal = document.getElementById('teacherModal');
  if (modal) {
    modal.classList.add('active');
    populateLearnerFilter();
    renderTeacherRecords('all');
  }
}

function closeTeacherModal() {
  const modal = document.getElementById('teacherModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function populateLearnerFilter() {
  const select = document.getElementById('selectLearnerFilter');
  if (!select) return;

  const records = window.RecordManager.getAllRecords();
  const learnerNames = Array.from(new Set(records.map(r => r.learner)));

  let html = `<option value="all">전체 어르신 보기</option>`;
  learnerNames.forEach(name => {
    html += `<option value="${name}">${name}</option>`;
  });
  select.innerHTML = html;
}

function renderTeacherRecords(filterLearner = 'all') {
  const stats = window.RecordManager.getCareStats(filterLearner);
  const records = window.RecordManager.getAllRecords();
  const filtered = filterLearner === 'all' ? records : records.filter(r => r.learner === filterLearner);

  // 상단 4종 통계 카드 업데이트
  document.getElementById('statTotalSessions').textContent = `${stats.totalSessions}회`;
  document.getElementById('statCompletedSessions').textContent = `${stats.completedSessions}회 완료`;
  document.getElementById('statPositiveRate').textContent = `${stats.positiveRate}%`;
  document.getElementById('statActiveLearners').textContent = `${stats.activeLearnersCount}명`;

  // 테이블 행 렌더링
  const tbody = document.getElementById('careRecordsTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
          기록된 수업 내역이 없습니다.
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
        <td><span>${rec.lessonIcon} ${rec.lessonTitle}</span></td>
        <td><span class="badge-status-completed">✓ ${rec.isCompleted ? '완료' : '진행'}</span></td>
        <td><span class="mood-tag-sm">${rec.mood}</span></td>
        <td><span class="badge-help-normal">${rec.assistanceNeeded}</span></td>
        <td><strong>${rec.durationText}</strong></td>
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

// 글로벌 등록
window.openTeacherModal = openTeacherModal;
window.closeTeacherModal = closeTeacherModal;
window.initFloatingActions = initFloatingActions;
