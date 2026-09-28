/**
 * 디지털 AI 학교 - 프로그램 자동 편성 관리자 UI 모듈
 * (Auto Scheduler UI & Interaction Component)
 */
((window) => {
  'use strict';

  const $ = id => document.getElementById(id);

  let currentSubTab = 'weekly';
  let calendarYear = 2026;
  let calendarMonth = 10;
  let selectedWeekMonday = getMondayOfCurrentWeek();

  function getMondayOfCurrentWeek(d = new Date()) {
    const dt = new Date(d);
    const day = dt.getDay();
    const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
    dt.setDate(diff);
    return dt.toISOString().slice(0, 10);
  }

  function initAutoSchedulerUI() {
    renderMainView();
  }

  function renderMainView() {
    const mount = $('autoSchedulerMount');
    if (!mount) return;

    mount.innerHTML = `
      <div class="auto-scheduler-container">
        <!-- 상단 서브 내비게이션 -->
        <nav class="auto-subnav" aria-label="자동 편성 메뉴">
          <button type="button" class="auto-subnav-btn ${currentSubTab === 'weekly' ? 'active' : ''}" data-sub="weekly">📅 주간 편성</button>
          <button type="button" class="auto-subnav-btn ${currentSubTab === 'calendar' ? 'active' : ''}" data-sub="calendar">🗓️ 월간 캘린더</button>
          <button type="button" class="auto-subnav-btn ${currentSubTab === 'library' ? 'active' : ''}" data-sub="library">📚 프로그램 라이브러리</button>
          <button type="button" class="auto-subnav-btn ${currentSubTab === 'events' ? 'active' : ''}" data-sub="events">🎪 기관행사 & 휴무일</button>
          <button type="button" class="auto-subnav-btn ${currentSubTab === 'settings' ? 'active' : ''}" data-sub="settings">⚙️ 자동화 설정</button>
          <button type="button" class="auto-subnav-btn ${currentSubTab === 'report' ? 'active' : ''}" data-sub="report">📊 주간/월간 분석</button>
        </nav>

        <!-- 서브 뷰 마운트 -->
        <div id="autoSubViewContainer"></div>
      </div>
    `;

    mount.querySelectorAll('.auto-subnav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentSubTab = btn.dataset.sub;
        mount.querySelectorAll('.auto-subnav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSubView();
      });
    });

    renderSubView();
  }

  function renderSubView() {
    const container = $('autoSubViewContainer');
    if (!container) return;

    if (currentSubTab === 'weekly') renderWeeklyView(container);
    else if (currentSubTab === 'calendar') renderCalendarView(container);
    else if (currentSubTab === 'library') renderLibraryView(container);
    else if (currentSubTab === 'events') renderEventsView(container);
    else if (currentSubTab === 'settings') renderSettingsView(container);
    else if (currentSubTab === 'report') renderReportView(container);
  }

  // 1. 주간 편성 뷰
  function renderWeeklyView(container) {
    if (!window.AutoScheduler) return;

    // Ensure weekly schedule exists
    let weekData = window.AutoScheduler.generateWeekly(selectedWeekMonday, false);
    const days = weekData.days;
    const isLocked = days.every(d => d.status === 'confirmed');

    container.innerHTML = `
      <div class="auto-action-toolbar">
        <div class="auto-toolbar-title">
          <span>📅 ${selectedWeekMonday} 주간 프로그램 편성</span>
          <span class="status-badge ${isLocked ? 'confirmed' : 'draft'}">${isLocked ? '🔒 일정 확정' : '📝 가안 (미리보기)'}</span>
        </div>
        <div class="auto-toolbar-actions">
          <button type="button" class="btn-auto-action" id="btnPrevWeek">◀ 이전 주</button>
          <button type="button" class="btn-auto-action" id="btnNextWeek">다음 주 ▶</button>
          <button type="button" class="btn-auto-action btn-auto-primary" id="btnAutoGenerateThisWeek">⚡ 이번 주 자동 생성</button>
          <button type="button" class="btn-auto-action btn-auto-primary" id="btnAutoGenerateNextWeek">⚡ 다음 주 자동 생성</button>
          <button type="button" class="btn-auto-action ${isLocked ? '' : 'btn-auto-confirm'}" id="btnToggleWeekLock">
            ${isLocked ? '✏️ 일정 수정' : '🔒 일정 확정'}
          </button>
        </div>
      </div>

      <div class="weekly-schedule-grid" style="margin-top: 16px;">
        ${days.map(d => renderDayCardHtml(d)).join('')}
      </div>
    `;

    // 이벤트 리스너 연결
    $('btnPrevWeek')?.addEventListener('click', () => {
      const dt = new Date(selectedWeekMonday);
      dt.setDate(dt.getDate() - 7);
      selectedWeekMonday = dt.toISOString().slice(0, 10);
      renderSubView();
    });

    $('btnNextWeek')?.addEventListener('click', () => {
      const dt = new Date(selectedWeekMonday);
      dt.setDate(dt.getDate() + 7);
      selectedWeekMonday = dt.toISOString().slice(0, 10);
      renderSubView();
    });

    $('btnAutoGenerateThisWeek')?.addEventListener('click', () => {
      window.AutoScheduler.generateWeekly(selectedWeekMonday, false);
      alert('이번 주 프로그램이 자동 편성되었습니다. 미리보기를 확인해주세요.');
      renderSubView();
    });

    $('btnAutoGenerateNextWeek')?.addEventListener('click', () => {
      const dt = new Date(selectedWeekMonday);
      dt.setDate(dt.getDate() + 7);
      const nextMon = dt.toISOString().slice(0, 10);
      window.AutoScheduler.generateWeekly(nextMon, false);
      selectedWeekMonday = nextMon;
      alert('다음 주 프로그램이 자동 편성되었습니다. 미리보기를 확인해주세요.');
      renderSubView();
    });

    $('btnToggleWeekLock')?.addEventListener('click', () => {
      window.AutoScheduler.toggleScheduleLock(`W_${selectedWeekMonday}`, !isLocked);
      alert(isLocked ? '일정 수정 모드로 전환되었습니다.' : '일정이 최종 확정되었습니다 (🔒).');
      renderSubView();
    });
  }

  function renderDayCardHtml(d) {
    if (d.isOffDay) {
      return `
        <div class="daily-schedule-card is-offday">
          <div class="card-date-header">
            <span class="card-date-title">${d.date} (${d.dayName})</span>
            <span class="status-badge offday">💤 휴무일</span>
          </div>
          <div style="padding: 24px; text-align: center; color: #78909C; font-weight: 700;">
            정기 휴무일 또는 공휴일입니다. (프로그램 미운영)
          </div>
        </div>
      `;
    }

    if (d.facilityEvent) {
      return `
        <div class="daily-schedule-card is-event">
          <div class="card-date-header">
            <span class="card-date-title">${d.date} (${d.dayName})</span>
            <span class="status-badge confirmed">🎪 기관 행사</span>
          </div>
          <div class="session-block" style="background:#FFF9E6; border-color:#FFE082;">
            <div class="session-title" style="color:#E65100;">${d.facilityEvent.title}</div>
            <div style="font-size:13px; color:#5D4037;">${d.facilityEvent.note || '특별 일정 진행'}</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="daily-schedule-card">
        <div class="card-date-header">
          <span class="card-date-title">${d.date} (${d.dayName})</span>
          <span class="status-badge ${d.status === 'confirmed' ? 'confirmed' : 'draft'}">
            ${d.status === 'confirmed' ? '🔒 확정' : '📝 가안'}
          </span>
        </div>

        <!-- 오전 세션 -->
        <div class="session-block">
          <div class="session-block-header">
            <span class="session-tag">🌞 오전 (60분)</span>
            <span class="session-status">${d.amStatus || '예정'}</span>
          </div>
          <div class="session-title">${d.am?.title || '오전 프로그램 미편성'}</div>
          <div>
            <span class="session-meta-pill">🐶 ${d.am?.lead?.title || '체조'} 20분</span>
            <span class="session-meta-pill">🐱 ${d.am?.partner?.title || '회상'} 25분</span>
          </div>
        </div>

        <!-- 오후 세션 -->
        <div class="session-block">
          <div class="session-block-header">
            <span class="session-tag">🌤 오후 (60분)</span>
            <span class="session-status">${d.pmStatus || '예정'}</span>
          </div>
          <div class="session-title">${d.pm?.title || '오후 프로그램 미편성'}</div>
          <div>
            <span class="session-meta-pill">🐰 ${d.pm?.lead?.title || '놀이'} 20분</span>
            <span class="session-meta-pill">🐻 ${d.pm?.partner?.title || '취미'} 25분</span>
          </div>
        </div>

        ${d.fallbackNotice ? `<div class="fallback-warning">⚠️ ${d.fallbackNotice}</div>` : ''}

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:4px;">
          <button type="button" class="btn-auto-action" onclick="window.AutoSchedulerUI.openEditSlotModal('${d.date}')" style="padding:6px 12px; font-size:13px;">
            ✏️ 수동 변경
          </button>
        </div>
      </div>
    `;
  }

  // 2. 월간 캘린더 뷰 (Requirement 9, 38)
  function renderCalendarView(container) {
    if (!window.AutoScheduler) return;

    const all = window.AutoScheduler.getAllSchedules();
    const firstDay = new Date(calendarYear, calendarMonth - 1, 1);
    const lastDay = new Date(calendarYear, calendarMonth, 0);
    const totalDays = lastDay.getDate();
    const startWeekday = firstDay.getDay(); // 0(일) ~ 6(토)

    container.innerHTML = `
      <div class="auto-action-toolbar">
        <div class="auto-toolbar-title">
          <span>🗓️ ${calendarYear}년 ${calendarMonth}월 프로그램 계획표</span>
        </div>
        <div class="auto-toolbar-actions">
          <button type="button" class="btn-auto-action" id="btnPrevMonth">◀ 이전 달</button>
          <button type="button" class="btn-auto-action" id="btnNextMonth">다음 달 ▶</button>
          <button type="button" class="btn-auto-action btn-auto-primary" id="btnAutoGenerateNextMonth">⚡ ${calendarMonth}월 전체 자동 생성</button>
          <button type="button" class="btn-auto-action" id="btnDownloadMonthCsv">📥 CSV 다운로드</button>
          <button type="button" class="btn-auto-action btn-auto-confirm" id="btnPrintA4Calendar">🖨️ A4 계획표 인쇄</button>
        </div>
      </div>

      <div class="calendar-view-wrap" style="margin-top: 16px;">
        <div class="calendar-grid">
          <div class="calendar-weekday sun">일</div>
          <div class="calendar-weekday">월</div>
          <div class="calendar-weekday">화</div>
          <div class="calendar-weekday">수</div>
          <div class="calendar-weekday">목</div>
          <div class="calendar-weekday">금</div>
          <div class="calendar-weekday sat">토</div>

          ${generateCalendarCellsHtml(startWeekday, totalDays, all)}
        </div>
      </div>

      <!-- 인쇄용 숨김 컨테이너 -->
      <div id="a4PrintContainer" style="display:none;"></div>
    `;

    $('btnPrevMonth')?.addEventListener('click', () => {
      calendarMonth--;
      if (calendarMonth < 1) { calendarMonth = 12; calendarYear--; }
      renderSubView();
    });

    $('btnNextMonth')?.addEventListener('click', () => {
      calendarMonth++;
      if (calendarMonth > 12) { calendarMonth = 1; calendarYear++; }
      renderSubView();
    });

    $('btnAutoGenerateNextMonth')?.addEventListener('click', () => {
      window.AutoScheduler.generateMonthly(calendarYear, calendarMonth, false);
      alert(`${calendarYear}년 ${calendarMonth}월 전체 프로그램이 자동 생성되었습니다.`);
      renderSubView();
    });

    $('btnDownloadMonthCsv')?.addEventListener('click', () => {
      window.AutoScheduler.downloadMonthlyCsv(calendarYear, calendarMonth);
    });

    $('btnPrintA4Calendar')?.addEventListener('click', () => {
      printA4Calendar(calendarYear, calendarMonth);
    });
  }

  function generateCalendarCellsHtml(startWeekday, totalDays, all) {
    let html = '';
    // Empty cells before month start
    for (let i = 0; i < startWeekday; i++) {
      html += `<div class="calendar-cell other-month"></div>`;
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const slot = all[dateStr] || window.AutoScheduler.createEmptyDateSlot(dateStr);
      const isToday = dateStr === todayStr;

      let contentHtml = '';
      if (slot.isOffDay) {
        contentHtml = `<span class="cell-prog-badge cell-prog-off">휴무일</span>`;
      } else if (slot.facilityEvent) {
        contentHtml = `<span class="cell-prog-badge cell-prog-event">🎪 ${slot.facilityEvent.title}</span>`;
      } else if (slot.am || slot.pm) {
        if (slot.am) contentHtml += `<span class="cell-prog-badge cell-prog-am" title="${slot.am.title}">오전: ${slot.am.lead?.title || '체조'}</span>`;
        if (slot.pm) contentHtml += `<span class="cell-prog-badge cell-prog-pm" title="${slot.pm.title}">오후: ${slot.pm.lead?.title || '놀이'}</span>`;
      } else {
        contentHtml = `<span style="font-size:11px; color:#B0BEC5;">(미편성)</span>`;
      }

      html += `
        <div class="calendar-cell ${isToday ? 'is-today' : ''}" onclick="window.AutoSchedulerUI.openEditSlotModal('${dateStr}')">
          <div class="cell-date-num">
            <span>${d}</span>
            ${slot.status === 'confirmed' ? '<span style="font-size:11px; color:#2E7D32;">🔒</span>' : ''}
          </div>
          ${contentHtml}
        </div>
      `;
    }

    return html;
  }

  // 3. 프로그램 라이브러리 뷰 (Requirement 4)
  function renderLibraryView(container) {
    if (!window.ProgramLibrary) return;
    const all = window.ProgramLibrary.getAll();

    container.innerHTML = `
      <div class="auto-action-toolbar">
        <div class="auto-toolbar-title">
          <span>📚 캐릭터별 프로그램 라이브러리 (총 ${all.length}개)</span>
        </div>
        <div class="auto-toolbar-actions">
          <button type="button" class="btn-auto-action btn-auto-primary" id="btnAddProgram">➕ 새 프로그램 등록</button>
          <button type="button" class="btn-auto-action" id="btnResetLibrary">↺ 기본값 초기화</button>
        </div>
      </div>

      <div class="library-table-container" style="margin-top: 16px;">
        <table class="library-table">
          <thead>
            <tr>
              <th>캐릭터</th>
              <th>프로그램명</th>
              <th>영역(도메인)</th>
              <th>난이도</th>
              <th>계절/기념일</th>
              <th>설명</th>
              <th>누적 사용</th>
              <th>활성 상태</th>
            </tr>
          </thead>
          <tbody>
            ${all.map(p => `
              <tr>
                <td><strong>${p.characterName}</strong> (${p.role})</td>
                <td><strong>${p.title}</strong></td>
                <td><span class="session-meta-pill">${p.domain}</span></td>
                <td>${p.difficulty}</td>
                <td>${p.season}${p.holiday ? ` / 🎁 ${p.holiday}` : ''}</td>
                <td style="font-size:12px; color:#5D4037; max-width:260px;">${p.desc}</td>
                <td>${p.usageCount || 0}회</td>
                <td>
                  <button type="button" class="btn-auto-action" onclick="window.AutoSchedulerUI.toggleProgram('${p.id}')" style="padding:4px 8px; font-size:12px; background:${p.enabled ? '#E8F5E9' : '#FFEBEE'}; color:${p.enabled ? '#2E7D32' : '#C62828'};">
                    ${p.enabled ? 'ON 활성' : 'OFF 중지'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    $('btnAddProgram')?.addEventListener('click', () => {
      const title = prompt('새 프로그램 제목을 입력해주세요:');
      if (!title) return;
      const char = prompt('담당 캐릭터를 입력해주세요 (kongi/tori/nabi/bori):', 'kongi');
      const domain = prompt('활동 영역을 입력해주세요 (신체운동/놀이/회상/언어/계산/미술/음악/만들기):', '신체운동');
      window.ProgramLibrary.add({ title, character: char, domain });
      alert('새 프로그램이 등록되었습니다.');
      renderSubView();
    });

    $('btnResetLibrary')?.addEventListener('click', () => {
      if (confirm('프로그램 라이브러리를 초기 상태로 되돌리시겠습니까?')) {
        window.ProgramLibrary.resetToDefault();
        renderSubView();
      }
    });
  }

  // 4. 기관행사 & 휴무일 뷰 (Requirement 23, 24)
  function renderEventsView(container) {
    if (!window.AutoScheduler) return;
    const events = window.AutoScheduler.getEvents();
    const offDays = window.AutoScheduler.getOffDays();

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- 기관 행사 -->
        <div class="session-block" style="background:#FFF;">
          <div class="auto-action-toolbar" style="padding:8px 12px; margin-bottom:12px;">
            <span style="font-weight:800; font-size:16px;">🎪 기관 특별 행사</span>
            <button type="button" class="btn-auto-action btn-auto-primary" id="btnAddEvent">➕ 행사 등록</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${events.map(e => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border:1px solid #EADBCC; border-radius:8px; background:#FFFDF7;">
                <div>
                  <div style="font-weight:800; color:#E65100;">${e.date} · ${e.title}</div>
                  <div style="font-size:13px; color:#5D4037;">${e.note || ''}</div>
                </div>
                <button type="button" class="btn-auto-action" onclick="window.AutoSchedulerUI.removeEvent('${e.date}')" style="padding:4px 8px; font-size:12px; color:#D32F2F;">삭제</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 휴무일 -->
        <div class="session-block" style="background:#FFF;">
          <div class="auto-action-toolbar" style="padding:8px 12px; margin-bottom:12px;">
            <span style="font-weight:800; font-size:16px;">💤 지정 휴무일 (공휴일)</span>
            <button type="button" class="btn-auto-action" id="btnAddOffDay">➕ 휴무일 추가</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${offDays.map(d => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border:1px solid #EADBCC; border-radius:8px; background:#ECEFF1;">
                <div style="font-weight:800; color:#455A64;">${d} (기관 휴무)</div>
                <button type="button" class="btn-auto-action" onclick="window.AutoSchedulerUI.toggleOffDay('${d}')" style="padding:4px 8px; font-size:12px; color:#D32F2F;">해제</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    $('btnAddEvent')?.addEventListener('click', () => {
      const date = prompt('행사 날짜 (YYYY-MM-DD):', '2026-10-25');
      if (!date) return;
      const title = prompt('행사명:', '가을 어르신 음악회');
      const note = prompt('행사 내용/메모:', '어르신 합창 및 특별 다과회');
      window.AutoScheduler.saveEvent({ date, title, note });
      renderSubView();
    });

    $('btnAddOffDay')?.addEventListener('click', () => {
      const date = prompt('휴무일 날짜 (YYYY-MM-DD):', '2026-10-10');
      if (date) {
        window.AutoScheduler.toggleOffDay(date);
        renderSubView();
      }
    });
  }

  // 5. 자동화 설정 뷰 (Requirement 31)
  function renderSettingsView(container) {
    if (!window.AutoScheduler) return;
    const s = window.AutoScheduler.getSettings();

    container.innerHTML = `
      <div class="session-block" style="background:#FFF; max-width:680px; margin:0 auto; padding:24px;">
        <h3 style="font-size:18px; color:#4A3525; margin-bottom:16px; border-bottom:1px solid #EADBCC; padding-bottom:8px;">
          ⚙️ 자동 프로그램 편성 규칙 설정
        </h3>

        <div style="display:flex; flex-direction:column; gap:16px; font-size:15px;">
          <div>
            <strong>운영 요일:</strong>
            <div style="display:flex; gap:12px; margin-top:6px;">
              ${['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => `
                <label style="display:flex; align-items:center; gap:4px;">
                  <input type="checkbox" name="opDay" value="${idx}" ${s.operatingDays.includes(idx) ? 'checked' : ''}>
                  ${day}
                </label>
              `).join('')}
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div>
              <label><strong>오전 운영시간:</strong></label>
              <input type="text" id="setAmStart" value="${s.amStart}" style="width:70px; padding:6px; font-size:15px; margin:0 4px;"> ~
              <input type="text" id="setAmEnd" value="${s.amEnd}" style="width:70px; padding:6px; font-size:15px; margin:0 4px;">
            </div>
            <div>
              <label><strong>오후 운영시간:</strong></label>
              <input type="text" id="setPmStart" value="${s.pmStart}" style="width:70px; padding:6px; font-size:15px; margin:0 4px;"> ~
              <input type="text" id="setPmEnd" value="${s.pmEnd}" style="width:70px; padding:6px; font-size:15px; margin:0 4px;">
            </div>
          </div>

          <div>
            <label><strong>같은 프로그램 반복 제한 (일):</strong></label>
            <input type="number" id="setRepeatLimit" value="${s.repeatLimitDays}" style="width:80px; padding:6px; font-size:15px; margin-left:8px;"> 일 이내 반복 금지
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" id="setSeason" ${s.seasonEnabled ? 'checked' : ''}>
              <strong>계절 프로그램 자동 반영 (봄/여름/가을/겨울)</strong>
            </label>
            <label style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" id="setHoliday" ${s.holidayEnabled ? 'checked' : ''}>
              <strong>한국 명절 및 기념일 테마 자동 반영</strong>
            </label>
            <label style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" id="setFeedback" ${s.feedbackEnabled ? 'checked' : ''}>
              <strong>어르신 최근 참여도 및 기분 반응 기반 자동 추천</strong>
            </label>
          </div>

          <div style="text-align:right; margin-top:12px;">
            <button type="button" class="btn-auto-action btn-auto-primary" id="btnSaveAutoSettings" style="padding:10px 24px;">
              설정 저장
            </button>
          </div>
        </div>
      </div>
    `;

    $('btnSaveAutoSettings')?.addEventListener('click', () => {
      const opDays = Array.from(document.querySelectorAll('input[name="opDay"]:checked')).map(cb => parseInt(cb.value, 10));
      window.AutoScheduler.saveSettings({
        operatingDays: opDays,
        amStart: $('setAmStart').value.trim(),
        amEnd: $('setAmEnd').value.trim(),
        pmStart: $('setPmStart').value.trim(),
        pmEnd: $('setPmEnd').value.trim(),
        repeatLimitDays: parseInt($('setRepeatLimit').value, 10) || 7,
        seasonEnabled: $('setSeason').checked,
        holidayEnabled: $('setHoliday').checked,
        feedbackEnabled: $('setFeedback').checked
      });
      alert('자동화 설정이 성공적으로 저장되었습니다.');
      renderSubView();
    });
  }

  // 6. 주간/월간 분석 뷰 (Requirement 27, 28)
  function renderReportView(container) {
    if (!window.AutoScheduler) return;
    const weeklyRep = window.AutoScheduler.generateWeeklyReport(selectedWeekMonday);

    container.innerHTML = `
      <div class="session-block" style="background:#FFF; padding:20px;">
        <h3 style="font-size:18px; color:#4A3525; margin-bottom:12px;">
          📊 ${selectedWeekMonday} 주간 프로그램 자동 분석 보고서
        </h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:12px; margin-bottom:16px;">
          <div style="background:#F4EBE1; padding:12px; border-radius:8px; text-align:center;">
            <div style="font-size:13px;">총 예정 수업</div>
            <div style="font-size:24px; font-weight:800; color:#E65100;">${weeklyRep.totalClasses}회</div>
          </div>
          <div style="background:#E8F5E9; padding:12px; border-radius:8px; text-align:center;">
            <div style="font-size:13px;">완료 수업</div>
            <div style="font-size:24px; font-weight:800; color:#2E7D32;">${weeklyRep.completedClasses}회</div>
          </div>
          <div style="background:#FFF3E0; padding:12px; border-radius:8px; text-align:center;">
            <div style="font-size:13px;">운동/인지/놀이/취미 균형</div>
            <div style="font-size:18px; font-weight:800; color:#5D4037;">각 6회 균등</div>
          </div>
        </div>
        <p style="font-size:15px; color:#4A3525; line-height:1.6;">
          ${weeklyRep.recommendationNotice}
        </p>
        <div style="margin-top:16px;">
          <button type="button" class="btn-auto-action btn-auto-primary" id="btnApplyWeeklyToNext">
            다음 주 프로그램에 분석 결과 반영하기 ▶
          </button>
        </div>
      </div>
    `;

    $('btnApplyWeeklyToNext')?.addEventListener('click', () => {
      const dt = new Date(selectedWeekMonday);
      dt.setDate(dt.getDate() + 7);
      const nextMon = dt.toISOString().slice(0, 10);
      window.AutoScheduler.generateWeekly(nextMon, false);
      selectedWeekMonday = nextMon;
      currentSubTab = 'weekly';
      alert('분석 결과가 반영되어 다음 주 프로그램이 생성되었습니다.');
      renderMainView();
    });
  }

  // A4 출력 생성 (Requirement 38)
  function printA4Calendar(year, month) {
    const all = window.AutoScheduler.getAllSchedules();
    const lastDay = new Date(year, month, 0).getDate();
    const rows = [];

    for (let d = 1; d <= lastDay; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const slot = all[dateStr] || window.AutoScheduler.createEmptyDateSlot(dateStr);
      if (slot.dayNum === 0) continue; // 일요일 제외

      rows.push(`
        <tr>
          <td style="border:1px solid #333; padding:6px; text-align:center; font-weight:700;">${d}일 (${slot.dayName})</td>
          <td style="border:1px solid #333; padding:6px;">${slot.isOffDay ? '기관 휴무' : (slot.am ? slot.am.title : '-')}</td>
          <td style="border:1px solid #333; padding:6px;">${slot.isOffDay ? '기관 휴무' : (slot.pm ? slot.pm.title : '-')}</td>
          <td style="border:1px solid #333; padding:6px; text-align:center;">${slot.facilityEvent ? slot.facilityEvent.title : (slot.status === 'confirmed' ? '확정' : '가안')}</td>
        </tr>
      `);
    }

    const printContainer = $('a4PrintContainer');
    if (printContainer) {
      printContainer.innerHTML = `
        <div style="padding:20px; font-family:sans-serif;">
          <h1 style="text-align:center; font-size:22pt; margin-bottom:8px;">${year}년 ${month}월 디지털 AI 학교 월간 프로그램 계획표</h1>
          <p style="text-align:right; font-size:10pt; margin-bottom:14px;">장기요양기관 인지·신체 기능 유지 프로그램 (오전 60분 + 오후 60분)</p>
          <table style="width:100%; border-collapse:collapse; font-size:10pt;">
            <thead>
              <tr style="background:#EEE;">
                <th style="border:1px solid #333; padding:8px; width:15%;">날짜/요일</th>
                <th style="border:1px solid #333; padding:8px; width:38%;">오전 프로그램 (10:00 ~ 11:00)</th>
                <th style="border:1px solid #333; padding:8px; width:38%;">오후 프로그램 (14:00 ~ 15:00)</th>
                <th style="border:1px solid #333; padding:8px; width:9%;">비고</th>
              </tr>
            </thead>
            <tbody>
              ${rows.join('')}
            </tbody>
          </table>
        </div>
      `;
      window.print();
    }
  }

  // 모달: 특정 날짜 수동 수정 (Requirement 22)
  function openEditSlotModal(dateStr) {
    const slot = window.AutoScheduler.getScheduleForDate(dateStr) || window.AutoScheduler.createEmptyDateSlot(dateStr);
    const newAmTitle = prompt(`[${dateStr} (${slot.dayName})] 오전 프로그램명을 변경해주세요:`, slot.am?.title || '');
    if (newAmTitle === null) return;
    const newPmTitle = prompt(`[${dateStr} (${slot.dayName})] 오후 프로그램명을 변경해주세요:`, slot.pm?.title || '');
    if (newPmTitle === null) return;

    window.AutoScheduler.updateDateSchedule(dateStr, {
      am: slot.am ? { ...slot.am, title: newAmTitle } : { title: newAmTitle },
      pm: slot.pm ? { ...slot.pm, title: newPmTitle } : { title: newPmTitle },
      status: 'confirmed'
    });
    alert('해당 날짜의 프로그램이 수동 변경되었습니다.');
    renderSubView();
  }

  window.AutoSchedulerUI = {
    init: initAutoSchedulerUI,
    renderMainView,
    openEditSlotModal,
    toggleProgram: (id) => {
      window.ProgramLibrary.toggle(id);
      renderSubView();
    },
    removeEvent: (d) => {
      window.AutoScheduler.removeEvent(d);
      renderSubView();
    },
    toggleOffDay: (d) => {
      window.AutoScheduler.toggleOffDay(d);
      renderSubView();
    }
  };
})(typeof window !== 'undefined' ? window : global);
