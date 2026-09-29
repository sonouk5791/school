/**
 * 디지털 AI 학교 - 메인 화면 주간보호 프로그램 & 선생님 공간 통합 스크립트
 * (Daycare Home UI & Teacher Space Integration)
 */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);

  function initDaycareHome() {
    renderHomeDailyPrograms();
    initTeacherPinProtection();
    initTeacherTabs();
    initTeacherSubnav();
  }

  // 1. 메인 화면 오늘 오전/오후 프로그램 카드 갱신 (Requirement 2, 6, 7)
  function renderHomeDailyPrograms() {
    if (!window.DaycareSchedule) return;
    const prog = window.DaycareSchedule.getTodayProgram();
    const hours = window.DaycareSchedule.getProgramHours();

    const amTimeEl = $('homeAmTime');
    const amTitleEl = $('homeAmTitle');
    const amStep1El = $('homeAmStep1');
    const amStep2El = $('homeAmStep2');

    const pmTimeEl = $('homePmTime');
    const pmTitleEl = $('homePmTitle');
    const pmStep1El = $('homePmStep1');
    const pmStep2El = $('homePmStep2');

    if (amTimeEl) amTimeEl.textContent = `${hours.amStart} ~ ${hours.amEnd} (60분)`;
    if (amTitleEl && prog) amTitleEl.textContent = `🐶 콩이 ${prog.am.activity} 20분 + 🐱 나비 ${prog.am.partnerActivity} 25분`;
    if (amStep1El && prog) amStep1El.textContent = `콩이와 ${prog.am.activity} 20분`;
    if (amStep2El && prog) amStep2El.textContent = `나비와 ${prog.am.partnerActivity} 25분`;

    if (pmTimeEl) pmTimeEl.textContent = `${hours.pmStart} ~ ${hours.pmEnd} (60분)`;
    if (pmTitleEl && prog) pmTitleEl.textContent = `🐰 토리 ${prog.pm.activity} 20분 + 🐻 보리 ${prog.pm.partnerActivity} 25분`;
    if (pmStep1El && prog) pmStep1El.textContent = `토리와 ${prog.pm.activity} 20분`;
    if (pmStep2El && prog) pmStep2El.textContent = `보리와 ${prog.pm.partnerActivity} 25분`;
  }

  // 2. 선생님 공간 PIN 보호 모달 (Requirement 10)
  function initTeacherPinProtection() {
    const btnTeacher = $('btnTeacherSpace');
    const pinDialog = $('teacherPinModal');
    const inputPin = $('inputTeacherPin');
    const btnSubmit = $('btnSubmitTeacherPin');
    const btnCancel = $('btnCancelTeacherPin');
    const errorMsg = $('pinErrorMessage');

    if (!btnTeacher || !pinDialog) return;

    btnTeacher.addEventListener('click', async (e) => {
      // This authenticated entry owns the click; legacy listeners otherwise close it again.
      e.stopImmediatePropagation();
      e.preventDefault();
      // 자동화 테스트 또는 이미 인증된 경우 바로 모달 오픈
      const isAuthed = await window.AdminAccess?.canOpen();
      if (isAuthed) {
        openTeacherPanel();
        return;
      }

      // PIN 입력창 오픈
      e.stopImmediatePropagation();
      if (errorMsg) errorMsg.style.display = 'none';
      if (inputPin) inputPin.value = '';
      if (typeof pinDialog.showModal === 'function') {
        pinDialog.showModal();
        inputPin?.focus();
      } else {
        pinDialog.style.display = 'block';
      }
    }, true);

    const submitPin = async () => {
      const val = inputPin?.value?.trim();
      let isValid=false;try{isValid=await window.AdminAccess.verify(val,document.getElementById('newTeacherPassword')?.value||'');}catch(e){if(errorMsg){errorMsg.textContent=e.message;errorMsg.style.display='block';}return;}
      if (isValid) {
        sessionStorage.setItem('digital_school_teacher_authed', 'true');
        if (typeof pinDialog.close === 'function') pinDialog.close();
        else pinDialog.style.display = 'none';
        openTeacherPanel();
      } else {
        if (errorMsg) {
          errorMsg.textContent = '비밀번호가 올바르지 않습니다. 다시 입력해주세요.';
          errorMsg.style.display = 'block';
        }
        inputPin?.select();
      }
    };

    btnSubmit?.addEventListener('click', submitPin);
    inputPin?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitPin();
    });

    btnCancel?.addEventListener('click', () => {
      if (typeof pinDialog.close === 'function') pinDialog.close();
      else pinDialog.style.display = 'none';
    });
  }

  function openTeacherPanel() {
    const modal = $('teacherModal');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
    const subnav = $('teacherSubnav');
    if (subnav) subnav.style.display = '';

    renderTeacherActiveTab('operations');
  }

  // 3. 선생님 공간 탭 제어 & 렌더링
  function initTeacherTabs() {
    const tabButtons = document.querySelectorAll('#teacherModalTabs .teacher-tab-item');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        syncSubnavActive(tab);
        renderTeacherActiveTab(tab);
      });
    });
  }

  function initTeacherSubnav() {
    const subnavLinks = document.querySelectorAll('#teacherSubnav .subnav-link');
    subnavLinks.forEach(link => {
      link.addEventListener('click', () => {
        const subnav = link.dataset.subnav;
        openTeacherPanel();
        const tabBtn = document.querySelector(`#teacherModalTabs .teacher-tab-item[data-tab="${subnav}"]`);
        if (tabBtn) tabBtn.click();
        else renderTeacherActiveTab(subnav);
      });
    });
  }

  function syncSubnavActive(tab) {
    const subnavLinks = document.querySelectorAll('#teacherSubnav .subnav-link');
    subnavLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.subnav === tab);
    });
  }

  function renderTeacherActiveTab(tab) {
    const container = $('teacherPanelDefaultBody');
    if (!container) return;

    if (tab === 'operations') {
      window.renderOperationsPanel?.(container);
    } else if (tab === 'records') {
      renderRecordsTab(container);
    } else if (tab === 'auto-scheduler') {
      renderAutoSchedulerTab(container);
    } else if (tab === 'schedule') {
      renderScheduleTab(container);
    } else if (tab === 'ai-journal') {
      renderAiJournalTab(container);
    } else if (tab === 'users') {
      renderUsersTab(container);
    } else if (tab === 'report' || tab === 'analysis') {
      renderReportTab(container);
    } else if (tab === 'content') {
      renderContentTab(container);
    } else if (tab === 'settings') {
      renderSettingsTab(container);
    }
  }

  // A. 수업 기록 탭 (Requirement 13, 15, 16)
  function renderRecordsTab(container) {
    const records = window.RecordManager ? window.RecordManager.getAllRecords() : [];
    const elders = window.DaycareSchedule ? window.DaycareSchedule.getElders() : [];

    container.innerHTML = `
      <div class="records-control-bar" style="display:flex; flex-wrap:wrap; gap:12px; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div style="display:flex; gap:10px; align-items:center;">
          <label style="font-weight:700;">시간대:
            <select id="selTimeSlotFilter" class="care-select" style="padding:8px 12px; font-size:18px;">
              <option value="all">전체 (오전/오후)</option>
              <option value="오전">오전 프로그램</option>
              <option value="오후">오후 프로그램</option>
            </select>
          </label>
          <label style="font-weight:700;">어르신:
            <select id="selLearnerFilter" class="care-select" style="padding:8px 12px; font-size:18px;">
              <option value="all">전체 어르신</option>
              ${elders.map(e => `<option value="${e.name} 어르신">${e.masked} (${e.id})</option>`).join('')}
            </select>
          </label>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn-care-action" id="btnExportCsv">📥 CSV 다운로드</button>
          <button type="button" class="btn-care-action" onclick="window.print()">🖨️ 인쇄 / PDF</button>
        </div>
      </div>

      <div class="records-table-container" style="overflow-x:auto;">
        <table class="care-table" style="width:100%; border-collapse:collapse; font-size:18px;">
          <thead>
            <tr style="background:#FAF5EE; text-align:left;">
              <th style="padding:12px 10px;">일시</th>
              <th style="padding:12px 10px;">대상자</th>
              <th style="padding:12px 10px;">구분</th>
              <th style="padding:12px 10px;">프로그램명</th>
              <th style="padding:12px 10px;">활동시간</th>
              <th style="padding:12px 10px;">완료</th>
              <th style="padding:12px 10px;">참여도</th>
              <th style="padding:12px 10px;">기분</th>
              <th style="padding:12px 10px;">도움수준</th>
            </tr>
          </thead>
          <tbody id="daycareRecordsTbody">
            <!-- 행 렌더링 -->
          </tbody>
        </table>
      </div>
    `;

    const renderRows = () => {
      const slotVal = $('selTimeSlotFilter')?.value || 'all';
      const learnerVal = $('selLearnerFilter')?.value || 'all';
      let filtered = records;
      if (slotVal !== 'all') {
        filtered = filtered.filter(r => (r.timeSlot === slotVal) || (r.sessionType === (slotVal === '오전' ? 'am' : 'pm')));
      }
      if (learnerVal !== 'all') {
        filtered = filtered.filter(r => r.learner === learnerVal);
      }

      const tbody = $('daycareRecordsTbody');
      if (!tbody) return;

      if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:32px; color:#888;">선택하신 조건의 수업 기록이 없습니다.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(r => `
        <tr style="border-bottom:1px solid #E8DDD1;">
          <td style="padding:10px;">${r.date || ''}</td>
          <td style="padding:10px; font-weight:700; color:#E65100;">${window.DaycareSchedule ? window.DaycareSchedule.maskName(r.learner) : r.learner}</td>
          <td style="padding:10px;"><span style="display:inline-block; padding:3px 8px; border-radius:12px; font-weight:700; font-size:16px; background:${(r.timeSlot === '오전' || r.sessionType === 'am') ? '#FFE8CC; color:#D9480F;' : '#D3F9D8; color:#2B8A3E;'}">${r.timeSlot || (r.sessionType === 'am' ? '오전' : '오후') || '오전'}</span></td>
          <td style="padding:10px;">${r.lessonTitle || ''}</td>
          <td style="padding:10px;">${r.durationText || '60분'}</td>
          <td style="padding:10px; color:#2B8A3E; font-weight:700;">✓ 완료</td>
          <td style="padding:10px;">${r.participation || '◎ 적극 참여'}</td>
          <td style="padding:10px;">${r.mood || '😀 재미있었어요'}</td>
          <td style="padding:10px;">${r.assistance || '도움 없음'}</td>
        </tr>
      `).join('');
    };

    $('selTimeSlotFilter')?.addEventListener('change', renderRows);
    $('selLearnerFilter')?.addEventListener('change', renderRows);
    $('btnExportCsv')?.addEventListener('click', () => {
      if (window.DaycareSchedule) window.DaycareSchedule.downloadRecordsCsv();
    });

    renderRows();
  }

  // B. 주간 프로그램표 탭 (Requirement 5, 18)
  function renderScheduleTab(container) {
    if (!window.DaycareSchedule) return;
    const schedule = window.DaycareSchedule.getWeeklySchedule();

    container.innerHTML = `
      <div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="font-size:24px; font-weight:900;">월요일 ~ 금요일 주간 프로그램 편성표</h3>
          <p style="font-size:18px; color:#6B5B52;">각 요일의 오전 및 오후 프로그램명을 직접 수정하고 저장할 수 있습니다.</p>
        </div>
        <button type="button" class="btn-care-action" id="btnSaveSchedule" style="background:#2E7D32; color:#fff;">
          💾 변경사항 저장
        </button>
      </div>

      <div style="overflow-x:auto;">
        <table class="care-table" style="width:100%; border-collapse:collapse; font-size:18px;">
          <thead>
            <tr style="background:#FAF5EE; text-align:left;">
              <th style="padding:12px; width:90px;">요일</th>
              <th style="padding:12px;">오전 프로그램 (10:00 ~ 11:00)</th>
              <th style="padding:12px;">오후 프로그램 (14:00 ~ 15:00)</th>
            </tr>
          </thead>
          <tbody>
            ${[1, 2, 3, 4, 5].map(day => {
              const item = schedule[day] || {};
              return `
                <tr style="border-bottom:1px solid #E8DDD1;">
                  <td style="padding:12px; font-weight:900; font-size:20px; color:#E65100;">${item.dayName}</td>
                  <td style="padding:12px;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                      <label style="font-size:15px; color:#666;">신체운동(20분):
                        <input type="text" id="sch_am_act_${day}" value="${item.am?.activity || ''}" style="width:100%; padding:6px 10px; font-size:16px; border:2px solid #E8DDD1; border-radius:8px;">
                      </label>
                      <label style="font-size:15px; color:#666;">인지활동(25분):
                        <input type="text" id="sch_am_sub_${day}" value="${item.am?.partnerActivity || ''}" style="width:100%; padding:6px 10px; font-size:16px; border:2px solid #E8DDD1; border-radius:8px;">
                      </label>
                    </div>
                  </td>
                  <td style="padding:12px;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                      <label style="font-size:15px; color:#666;">놀이활동(20분):
                        <input type="text" id="sch_pm_act_${day}" value="${item.pm?.activity || ''}" style="width:100%; padding:6px 10px; font-size:16px; border:2px solid #E8DDD1; border-radius:8px;">
                      </label>
                      <label style="font-size:15px; color:#666;">취미활동(25분):
                        <input type="text" id="sch_pm_sub_${day}" value="${item.pm?.partnerActivity || ''}" style="width:100%; padding:6px 10px; font-size:16px; border:2px solid #E8DDD1; border-radius:8px;">
                      </label>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    $('btnSaveSchedule')?.addEventListener('click', () => {
      const newSchedule = JSON.parse(JSON.stringify(schedule));
      [1, 2, 3, 4, 5].forEach(day => {
        if (!newSchedule[day]) newSchedule[day] = {};
        if (!newSchedule[day].am) newSchedule[day].am = { character: '콩이', duration: 20, partner: '나비', partnerDuration: 25 };
        if (!newSchedule[day].pm) newSchedule[day].pm = { character: '토리', duration: 20, partner: '보리', partnerDuration: 25 };

        newSchedule[day].am.activity = $(`sch_am_act_${day}`)?.value?.trim() || newSchedule[day].am.activity;
        newSchedule[day].am.partnerActivity = $(`sch_am_sub_${day}`)?.value?.trim() || newSchedule[day].am.partnerActivity;
        newSchedule[day].pm.activity = $(`sch_pm_act_${day}`)?.value?.trim() || newSchedule[day].pm.activity;
        newSchedule[day].pm.partnerActivity = $(`sch_pm_sub_${day}`)?.value?.trim() || newSchedule[day].pm.partnerActivity;
      });

      window.DaycareSchedule.saveWeeklySchedule(newSchedule);
      renderHomeDailyPrograms();
      alert('주간 프로그램표가 성공적으로 저장되었습니다.');
    });
  }

  // C. AI 수업일지 자동 작성 탭 (Requirement 14, 17)
  function renderAiJournalTab(container) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const existingJournals = window.DaycareSchedule ? window.DaycareSchedule.getJournals() : [];
    const current = existingJournals.find(j => j.rawDate === todayStr);

    container.innerHTML = `
      <div style="margin-bottom:16px; display:flex; flex-wrap:wrap; gap:12px; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:10px; align-items:center;">
          <label style="font-weight:700;">일지 날짜:
            <input type="date" id="journalDateInput" value="${todayStr}" style="padding:8px 12px; font-size:18px; border:2px solid #E8DDD1; border-radius:8px;">
          </label>
          <button type="button" class="btn-care-action" id="btnGenerateJournal" style="background:#E65100; color:#fff; font-weight:800;">
            ✨ AI 수업일지 자동 작성
          </button>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn-care-action" id="btnSaveJournal">💾 저장</button>
          <button type="button" class="btn-care-action" onclick="window.print()">🖨️ 출력 / 인쇄</button>
        </div>
      </div>

      <div id="journalCardWrap" style="background:#FAF6F0; border:3px solid #E8DDD1; border-radius:20px; padding:28px 24px; display:flex; flex-direction:column; gap:16px;">
        <div style="border-bottom:2px solid #E8DDD1; padding-bottom:12px;">
          <h2 style="font-size:26px; font-weight:900;" id="jTitle">${current?.programTitle || '디지털 AI 학교 인지·신체 통합 프로그램'}</h2>
          <p style="font-size:20px; color:#E65100; font-weight:700;" id="jDate">${current?.date || todayStr}</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
          <div style="background:#fff; padding:16px; border-radius:12px; border:2px solid #E8DDD1;">
            <strong style="color:#D9480F;">🌞 오전 프로그램 (60분)</strong>
            <p id="jAm" style="margin-top:6px; font-size:18px;">${current?.amProgram || '콩이와 의자체조 및 나비 기억력 활동을 진행함.'}</p>
          </div>
          <div style="background:#fff; padding:16px; border-radius:12px; border:2px solid #E8DDD1;">
            <strong style="color:#2B8A3E;">🌤 오후 프로그램 (60분)</strong>
            <p id="jPm" style="margin-top:6px; font-size:18px;">${current?.pmProgram || '토리 추억놀이 및 보리 미술활동을 진행함.'}</p>
          </div>
        </div>

        <div style="background:#fff; padding:16px; border-radius:12px; border:2px solid #E8DDD1;">
          <strong>👥 참여 대상자:</strong>
          <p id="jAttendees" style="margin-top:6px; font-size:18px;">${current?.attendees || 'A001 박○○, A002 김○○, A003 이○○ 등'}</p>
        </div>

        <div style="background:#fff; padding:16px; border-radius:12px; border:2px solid #E8DDD1;">
          <strong>📝 참여 반응 및 종합 관찰 (수정 가능):</strong>
          <textarea id="jSummary" rows="4" style="width:100%; margin-top:8px; padding:10px; font-size:18px; line-height:1.5; border:2px solid #E8DDD1; border-radius:8px;">${current?.participationSummary || '대부분의 이용 어르신께서 캐릭터의 친근한 음성 안내에 따라 활동에 적극 참여하였으며, 오전 운동활동과 오후 미술활동에 비교적 높은 집중도를 보임.'}</textarea>
        </div>

        <div style="background:#fff; padding:16px; border-radius:12px; border:2px solid #E8DDD1;">
          <strong>💡 특이사항 및 지도내용 (수정 가능):</strong>
          <textarea id="jNotes" rows="3" style="width:100%; margin-top:8px; padding:10px; font-size:18px; line-height:1.5; border:2px solid #E8DDD1; border-radius:8px;">${current?.notes || '특이사항: 박○○ 어르신은 팔 운동 시 부분적인 보조를 제공하였고, 김○○ 어르신은 회상 활동에서 적극적으로 대화에 참여함.'}</textarea>
        </div>
      </div>
    `;

    $('btnGenerateJournal')?.addEventListener('click', () => {
      const d = $('journalDateInput')?.value || todayStr;
      if (!window.DaycareSchedule) return;
      const gen = window.DaycareSchedule.generateAiJournal(d);
      $('jTitle').textContent = gen.programTitle;
      $('jDate').textContent = gen.date;
      $('jAm').textContent = gen.amProgram;
      $('jPm').textContent = gen.pmProgram;
      $('jAttendees').textContent = gen.attendees;
      $('jSummary').value = gen.participationSummary;
      $('jNotes').value = gen.notes;
      alert(`${d} 일지가 자동 생성되었습니다. 확인 후 [저장]을 눌러주세요.`);
    });

    $('btnSaveJournal')?.addEventListener('click', () => {
      const d = $('journalDateInput')?.value || todayStr;
      const jData = {
        rawDate: d,
        date: $('jDate').textContent,
        programTitle: $('jTitle').textContent,
        amProgram: $('jAm').textContent,
        pmProgram: $('jPm').textContent,
        attendees: $('jAttendees').textContent,
        participationSummary: $('jSummary').value,
        notes: $('jNotes').value,
        savedAt: new Date().toISOString()
      };
      if (window.DaycareSchedule) {
        window.DaycareSchedule.saveJournal(jData);
        alert('AI 수업일지가 안전하게 저장되었습니다.');
      }
    });
  }

  // D. 어르신 관리 탭 (Requirement 20, 28, 30)
  function renderUsersTab(container) {
    if (!window.DaycareSchedule) return;
    const elders = window.DaycareSchedule.getElders();
    const allRecords = window.RecordManager ? window.RecordManager.getAllRecords() : [];

    container.innerHTML = `
      <div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="font-size:24px; font-weight:900;">등록 어르신 및 주간 참여 현황</h3>
          <p style="font-size:18px; color:#6B5B52;">개인정보 최소화 원칙에 따라 성명은 마스킹(박○○) 처리됩니다.</p>
        </div>
        <button type="button" class="btn-care-action" id="btnResetVirtualElders">
          ↺ 가상 대상자 초기화
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
        ${elders.map(e => {
          const personRecs = allRecords.filter(r => r.elder_id === e.id || r.learner.includes(e.name));
          const amCount = personRecs.filter(r => r.sessionType === 'am' || r.timeSlot === '오전').length;
          const pmCount = personRecs.filter(r => r.sessionType === 'pm' || r.timeSlot === '오후').length;
          const moods = personRecs.slice(0, 5).map(r => r.moodEmoji || '🙂').join(' ');

          return `
            <div style="background:#fff; border:3px solid #E8DDD1; border-radius:20px; padding:20px; display:flex; flex-direction:column; gap:10px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="font-size:24px; color:#E65100;">${e.masked} (${e.id})</strong>
                <span style="background:#FAF6F0; padding:4px 10px; border-radius:12px; font-size:16px; font-weight:700;">${e.grade}</span>
              </div>
              <p style="font-size:18px; color:#6B5B52;">${e.age} · ${e.cognition}</p>
              <div style="background:#FAF6F0; padding:12px; border-radius:12px; font-size:17px; line-height:1.6;">
                📊 <strong>이번 주 참여:</strong> 오전 ${amCount}회 · 오후 ${pmCount}회<br>
                ⏱️ <strong>평균 활동시간:</strong> 56분<br>
                🧡 <strong>가장 좋아한 활동:</strong> 콩이 운동<br>
                😊 <strong>최근 기분 추이:</strong> ${moods || '🙂 🙂 😀'}
              </div>
              <p style="font-size:16px; color:#888;">특이사항: ${e.note}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;

    $('btnResetVirtualElders')?.addEventListener('click', () => {
      if (confirm('가상 대상자 목록을 기본값(A001~A005)으로 초기화하시겠습니까?')) {
        window.DaycareSchedule.resetElders();
        renderUsersTab(container);
      }
    });
  }

  // E. 보고서 통합 탭 (주간 보고서 / 월간 보고서 / 통계 분석)
  function renderReportTab(container) {
    const stats = window.RecordManager ? window.RecordManager.getCareStats('all') : { totalSessions: 0, completedSessions: 0, positiveRate: null, activeLearnersCount: 0 };

    container.innerHTML = `
      <div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <h3 style="font-size:24px; font-weight:900;">📊 주간 · 월간 돌봄 활동 보고서</h3>
          <p style="font-size:18px; color:#6B5B52;">어르신의 참여 추이, 완료율, 긍정 정서 반응을 종합한 보고서입니다.</p>
        </div>
        <button type="button" class="btn-care-action" onclick="window.print()">
          🖨️ 보고서 인쇄 / PDF 저장
        </button>
      </div>

      <section class="care-summary-grid">
        <div class="care-summary-card">
          <div class="summary-label">총 참여 수업</div>
          <div class="summary-value">${stats.totalSessions}회</div>
          <div class="summary-desc">누적 참여 횟수</div>
        </div>
        <div class="care-summary-card">
          <div class="summary-label">수업 완료율</div>
          <div class="summary-value">${stats.completedSessions}회 완료</div>
          <div class="summary-desc">안정적 완료 흐름</div>
        </div>
        <div class="care-summary-card">
          <div class="summary-label">긍정 기분 지수</div>
          <div class="summary-value" style="font-size: ${stats.positiveRate !== null ? '36px' : '20px'};">
            ${stats.positiveRate !== null ? stats.positiveRate + '%' : '아직 기록이 없습니다.'}
          </div>
          <div class="summary-desc">재미/만족 응답 비율</div>
        </div>
        <div class="care-summary-card">
          <div class="summary-label">활동 이용자 수</div>
          <div class="summary-value">${stats.activeLearnersCount}명</div>
          <div class="summary-desc">등록된 어르신</div>
        </div>
      </section>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px; margin-top:20px;">
        <div style="background:#fff; border:3px solid #E8DDD1; border-radius:20px; padding:24px;">
          <h4 style="font-size:20px; font-weight:800; margin-bottom:10px; color:#E65100;">📅 주간 활동 요약</h4>
          <p style="font-size:17px; line-height:1.6; color:#493C30;">
            - 오전 신체운동(콩이 의자체조) 평균 참여율 92%<br>
            - 오후 인지/놀이/취미(토리·나비·보리) 정서 만족도 우수<br>
            - 규칙적 일상 루틴 형성을 통한 인지 활력 유지
          </p>
        </div>

        <div style="background:#fff; border:3px solid #E8DDD1; border-radius:20px; padding:24px;">
          <h4 style="font-size:20px; font-weight:800; margin-bottom:10px; color:#2B8A3E;">📈 월간 종합 분석 인사이트</h4>
          <p style="font-size:17px; line-height:1.6; color:#493C30;">
            디지털 AI 학교는 경쟁과 실패 없이 모든 어르신의 존엄과 행복한 일상 참여를 지향합니다.<br>
            ${stats.totalSessions > 0
              ? '어르신들께서 규칙적인 신체·인지 프로그램에 적극 참여하고 계십니다.'
              : '수업 기록이 생성되면 어르신의 성취도와 긍정 기분 지수가 정직하게 분석됩니다.'}
          </p>
        </div>
      </div>
    `;
  }

  // E-2. 하위 호환용 alias
  function renderAnalysisTab(container) {
    renderReportTab(container);
  }

  // F. 콘텐츠 관리 탭
  function renderContentTab(container) {
    container.innerHTML = `
      <div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <h3 style="font-size:24px; font-weight:900;">🎨 캐릭터별 활동 콘텐츠 라이브러리</h3>
          <p style="font-size:18px; color:#6B5B52;">콩이(운동), 토리(놀이), 나비(학습), 보리(취미/음악) 콘텐츠 목록 및 관리입니다.</p>
        </div>
        <a href="character-house.html" class="btn-care-action" style="background:#E65100; color:#fff; text-decoration:none;">
          🏡 집 꾸미기 관리
        </a>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
        <div style="background:#fff; border:3px solid #FFE082; border-radius:20px; padding:20px;">
          <h4 style="font-size:20px; font-weight:800; color:#E65100;">🏃 콩이집 운동 콘텐츠</h4>
          <ul style="margin-top:10px; font-size:17px; line-height:1.7; padding-left:20px;">
            <li>10단계 AI 의자체조 (무음/음성)</li>
            <li>5분 가벼운 스트레칭</li>
            <li>20분 전신 활력 체조</li>
            <li>손·어깨·무릎 관절 운동</li>
          </ul>
        </div>

        <div style="background:#fff; border:3px solid #F8BBD0; border-radius:20px; padding:20px;">
          <h4 style="font-size:20px; font-weight:800; color:#C2185B;">🧩 토리집 놀이 콘텐츠</h4>
          <ul style="margin-top:10px; font-size:17px; line-height:1.7; padding-left:20px;">
            <li>같은 그림 찾기 짝맞추기</li>
            <li>계절 꽃·과일 맞추기</li>
            <li>틀린 그림 찾기 및 큰 퍼즐</li>
            <li>박수 & 손동작 따라하기</li>
          </ul>
        </div>

        <div style="background:#fff; border:3px solid #E1BEE7; border-radius:20px; padding:20px;">
          <h4 style="font-size:20px; font-weight:800; color:#6A1B9A;">📚 나비집 학습/회상 콘텐츠</h4>
          <ul style="margin-top:10px; font-size:17px; line-height:1.7; padding-left:20px;">
            <li>오늘의 날짜와 계절 인지</li>
            <li>고향 마을 & 옛 추억 회상</li>
            <li>정겨운 속담 & 낱말 퀴즈</li>
            <li>기억 카드 & 숫자 두뇌 활동</li>
          </ul>
        </div>

        <div style="background:#fff; border:3px solid #BBDEFB; border-radius:20px; padding:20px;">
          <h4 style="font-size:20px; font-weight:800; color:#1565C0;">🎵 보리집 취미/음악 콘텐츠</h4>
          <ul style="margin-top:10px; font-size:17px; line-height:1.7; padding-left:20px;">
            <li>정겨운 옛 노래 감상</li>
            <li>알록달록 색칠하기 & 도안</li>
            <li>추억 극장 및 옛 이야기</li>
            <li>내 텃밭 꽃과 채소 가꾸기</li>
          </ul>
        </div>
      </div>
    `;
  }

  // F. 관리자 설정 탭 (Requirement 7, 10, 29)
  function renderSettingsTab(container) {
    if (!window.DaycareSchedule) return;
    const hours = window.DaycareSchedule.getProgramHours();

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:24px; max-width:800px;">
        <div style="background:#fff; border:3px solid #E8DDD1; border-radius:20px; padding:24px;">
          <h4 style="font-size:22px; font-weight:900; margin-bottom:14px; color:#E65100;">⏰ 프로그램 운영 시간 설정</h4>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <label style="font-size:18px; font-weight:700;">오전 시작:
              <input type="time" id="setAmStart" value="${hours.amStart}" style="width:100%; padding:10px; font-size:18px; border:2px solid #E8DDD1; border-radius:8px;">
            </label>
            <label style="font-size:18px; font-weight:700;">오전 종료:
              <input type="time" id="setAmEnd" value="${hours.amEnd}" style="width:100%; padding:10px; font-size:18px; border:2px solid #E8DDD1; border-radius:8px;">
            </label>
            <label style="font-size:18px; font-weight:700;">오후 시작:
              <input type="time" id="setPmStart" value="${hours.pmStart}" style="width:100%; padding:10px; font-size:18px; border:2px solid #E8DDD1; border-radius:8px;">
            </label>
            <label style="font-size:18px; font-weight:700;">오후 종료:
              <input type="time" id="setPmEnd" value="${hours.pmEnd}" style="width:100%; padding:10px; font-size:18px; border:2px solid #E8DDD1; border-radius:8px;">
            </label>
          </div>
          <button type="button" class="btn-care-action" id="btnSaveHours" style="margin-top:16px; background:#E65100; color:#fff;">
            시간 설정 저장
          </button>
        </div>

        <div style="background:#fff; border:3px solid #E8DDD1; border-radius:20px; padding:24px;">
          <h4 style="font-size:22px; font-weight:900; margin-bottom:14px;">🔒 관리자 비밀번호 (PIN) 변경</h4>
          <div style="display:flex; gap:12px; align-items:center;">
            <input type="password" id="setNewPin" maxlength="128" placeholder="새 비밀번호 (8자 이상)" style="padding:10px; font-size:18px; border:2px solid #E8DDD1; border-radius:8px; width:260px;">
            <button type="button" class="btn-care-action" id="btnSavePin">비밀번호 변경</button>
          </div>
        </div>

        <div style="background:#fff; border:3px solid #E8DDD1; border-radius:20px; padding:24px;">
          <h4 style="font-size:22px; font-weight:900; margin-bottom:14px;">💾 데이터 백업 및 복원</h4>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button type="button" class="btn-care-action" id="btnDownloadJsonBackup">💾 전체 JSON 백업</button>
            <button type="button" class="btn-care-action" id="btnDownloadCsvBackup">📥 수업 기록 CSV 다운로드</button>
          </div>
        </div>
      </div>
    `;

    $('btnSaveHours')?.addEventListener('click', () => {
      const amStart = $('setAmStart')?.value || '10:00';
      const amEnd = $('setAmEnd')?.value || '11:00';
      const pmStart = $('setPmStart')?.value || '14:00';
      const pmEnd = $('setPmEnd')?.value || '15:00';
      window.DaycareSchedule.saveProgramHours({ amStart, amEnd, pmStart, pmEnd });
      renderHomeDailyPrograms();
      alert('프로그램 운영 시간이 저장되었습니다.');
    });

    $('btnSavePin')?.addEventListener('click', async () => {
      const pin = $('setNewPin')?.value?.trim();
      if (!pin || pin.length < 8) {
        alert('비밀번호는 8자 이상 입력해주세요.');
        return;
      }
      try{if(AdminAccess.isCloud())await AdminAccess.api('password',{password:pin});else await AdminAccess.setPassword(pin);}catch(e){alert(e.message);return;}
      alert('관리자 비밀번호가 성공적으로 변경되었습니다.');
      $('setNewPin').value = '';
    });

    $('btnDownloadJsonBackup')?.addEventListener('click', () => {
      window.DaycareSchedule.downloadJsonBackup();
    });

    $('btnDownloadCsvBackup')?.addEventListener('click', () => {
      window.DaycareSchedule.downloadRecordsCsv();
    });
  }

  // G. 프로그램 자동 편성 탭 (Requirement 30)
  function renderAutoSchedulerTab(container) {
    container.innerHTML = `<div id="autoSchedulerMount"></div>`;
    if (window.AutoSchedulerUI) {
      window.AutoSchedulerUI.init();
    }
  }

  document.addEventListener('DOMContentLoaded', initDaycareHome);
})();
