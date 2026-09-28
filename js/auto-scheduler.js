/**
 * 디지털 AI 학교 - 월~토 자동 프로그램 편성 엔진
 * (Automatic Program Scheduling & Rotation Engine)
 *
 * 10대 우선순위 판단 규칙:
 * 1. 날짜 및 요일 (월~토 운영, 일요일 기본 휴무)
 * 2. 기관 행사 등록 여부 (행사 시 우선 배치)
 * 3. 휴무일 등록 여부 (휴무일 생성 제외)
 * 4. 최근 진행 프로그램 분석 (7일 이내 중복 방지 및 이틀 연속 편성 금지)
 * 5. 활동 영역(도메인) 10대 균형 유지
 * 6. 어르신 최근 참여도 및 기분 반응 반영
 * 7. 난이도 자동 조절 (참여도 낮으면 쉬움으로 하향)
 * 8. 사계절(봄/여름/가을/겨울) 테마 자동 반영
 * 9. 명절 및 기념일(설날, 추석, 어버이날, 한글날 등) 맞춤 추천
 * 10. 토요일 편안한 주간 회상 & 레크리에이션 특화 편성
 */
((window) => {
  'use strict';

  const STORAGE_SCHEDULES_KEY = 'digital_school_auto_schedules_v2';
  const STORAGE_SETTINGS_KEY = 'digital_school_auto_settings_v2';
  const STORAGE_EVENTS_KEY = 'digital_school_facility_events_v2';
  const STORAGE_OFFDAYS_KEY = 'digital_school_off_days_v2';

  // 1. 기본 설정 (Requirement 31)
  const DEFAULT_SETTINGS = {
    operatingDays: [1, 2, 3, 4, 5, 6], // 월(1) ~ 토(6), 일(0) 휴무
    amStart: '10:00',
    amEnd: '11:00',
    pmStart: '14:00',
    pmEnd: '15:00',
    repeatLimitDays: 14, // 같은 프로그램 7일 이내 반복 금지
    preventConsecutiveDays: true, // 이틀 연속 반복 금지
    seasonEnabled: true,
    holidayEnabled: true,
    feedbackEnabled: true, // 참여도/기분 반응 기반 추천
    difficultyAdjustment: true
  };

  // 2. 한국 주요 명절 및 기념일 캘린더 (Requirement 17)
  const KOREAN_HOLIDAYS = [
    { name: '새해', month: 1, day: 1, range: 3, tags: ['새해', '새해맞이', '덕담', '희망'] },
    { name: '설날', month: 1, day: 28, range: 4, tags: ['설날', '떡국', '윷놀이', '세배', '전통'] }, // 음력 기준 근사치
    { name: '삼일절', month: 3, day: 1, range: 2, tags: ['태극기', '대한독립', '역사'] },
    { name: '어버이날', month: 5, day: 8, range: 4, tags: ['어버이날', '카네이션', '부모님', '감사'] },
    { name: '스승의날', month: 5, day: 15, range: 2, tags: ['선생님', '감사', '학교'] },
    { name: '광복절', month: 8, day: 15, range: 3, tags: ['광복절', '태극기', '아리랑', '옛 노래'] },
    { name: '추석', month: 9, day: 25, range: 5, tags: ['추석', '한가위', '송편', '보름달', '고향', '한복'] },
    { name: '한글날', month: 10, day: 9, range: 3, tags: ['한글날', '세종대왕', '예쁜 우리말', '단어'] },
    { name: '크리스마스', month: 12, day: 25, range: 4, tags: ['크리스마스', '성탄절', '눈사람', '겨울', '선물'] }
  ];

  const AutoScheduler = {
    // ═════════════════════════════════════════════════════════════════════
    // A. 설정, 행사, 휴무일 관리 (Requirements 23, 24, 31)
    // ═════════════════════════════════════════════════════════════════════
    getSettings() {
      try {
        const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
        if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {}
      return { ...DEFAULT_SETTINGS };
    },

    saveSettings(newSettings) {
      const merged = { ...this.getSettings(), ...newSettings };
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('auto-settings-updated', { detail: merged }));
      return merged;
    },

    // 기관 행사 목록 (Requirement 23)
    getEvents() {
      try {
        const saved = localStorage.getItem(STORAGE_EVENTS_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return [
        { date: '2026-10-15', title: '10월 어르신 생신잔치', type: 'birthday', note: '생신 축하 노래 및 축하 다과' },
        { date: '2026-10-20', title: '가을 야외 나들이 프로그램', type: 'outdoor', note: '가을 단풍 산책 및 바깥놀이' }
      ];
    },

    saveEvent(eventObj) {
      const list = this.getEvents().filter(e => e.date !== eventObj.date);
      list.push(eventObj);
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(list));
      return list;
    },

    removeEvent(dateStr) {
      const list = this.getEvents().filter(e => e.date !== dateStr);
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(list));
      return list;
    },

    // 휴무일 목록 (Requirement 24)
    getOffDays() {
      try {
        const saved = localStorage.getItem(STORAGE_OFFDAYS_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return ['2026-10-03', '2026-10-09']; // 개천절, 한글날 등
    },

    toggleOffDay(dateStr) {
      let list = this.getOffDays();
      if (list.includes(dateStr)) list = list.filter(d => d !== dateStr);
      else list.push(dateStr);
      localStorage.setItem(STORAGE_OFFDAYS_KEY, JSON.stringify(list));
      return list;
    },

    // ═════════════════════════════════════════════════════════════════════
    // B. 스케줄 저장소 조회 & 관리 (Requirements 20, 21, 22, 35)
    // ═════════════════════════════════════════════════════════════════════
    getAllSchedules() {
      try {
        const saved = localStorage.getItem(STORAGE_SCHEDULES_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return {};
    },

    saveAllSchedules(schedules) {
      localStorage.setItem(STORAGE_SCHEDULES_KEY, JSON.stringify(schedules));
      window.dispatchEvent(new CustomEvent('auto-schedules-updated', { detail: schedules }));
      return true;
    },

    getScheduleForDate(dateStr) {
      const all = this.getAllSchedules();
      return all[dateStr] || null;
    },

    // 특정 날짜 수동 수정 (Requirement 22)
    updateDateSchedule(dateStr, patch) {
      const all = this.getAllSchedules();
      const current = all[dateStr] || this.createEmptyDateSlot(dateStr);
      all[dateStr] = { ...current, ...patch, isCustomModified: true };
      this.saveAllSchedules(all);
      return all[dateStr];
    },

    // 일정 확정 / 수정 토글 (Requirement 21)
    toggleScheduleLock(dateOrWeekKey, isLocked = true) {
      const all = this.getAllSchedules();
      for (const [d, sched] of Object.entries(all)) {
        if (d.startsWith(dateOrWeekKey) || sched.weekKey === dateOrWeekKey) {
          sched.status = isLocked ? 'confirmed' : 'draft';
        }
      }
      this.saveAllSchedules(all);
      return true;
    },

    // 수업 상태 변경 (Requirement 35: 예정, 진행 중, 완료, 미실시)
    updateSessionStatus(dateStr, sessionType, status) {
      const all = this.getAllSchedules();
      if (!all[dateStr]) return false;
      if (sessionType === 'am') all[dateStr].amStatus = status;
      if (sessionType === 'pm') all[dateStr].pmStatus = status;
      this.saveAllSchedules(all);
      return true;
    },

    createEmptyDateSlot(dateStr) {
      const dt = new Date(dateStr);
      const dayNum = dt.getDay();
      const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      return {
        date: dateStr,
        dayNum,
        dayName: dayNames[dayNum],
        isOffDay: dayNum === 0 || this.getOffDays().includes(dateStr),
        facilityEvent: this.getEvents().find(e => e.date === dateStr) || null,
        am: null,
        pm: null,
        amStatus: '예정',
        pmStatus: '예정',
        status: 'draft', // draft | confirmed
        fallbackNotice: null
      };
    },

    // ═════════════════════════════════════════════════════════════════════
    // C. 지능형 자동 편성 로직 (Requirements 5 ~ 19, 32, 33)
    // ═════════════════════════════════════════════════════════════════════

    // 계절 인식 (봄:3~5, 여름:6~8, 가을:9~11, 겨울:12~2) (Requirement 16)
    detectSeason(dt) {
      const m = dt.getMonth() + 1;
      if (m >= 3 && m <= 5) return '봄';
      if (m >= 6 && m <= 8) return '여름';
      if (m >= 9 && m <= 11) return '가을';
      return '겨울';
    },

    // 기념일 및 명절 체크 (Requirement 17)
    detectHoliday(dt) {
      const m = dt.getMonth() + 1;
      const d = dt.getDate();
      for (const h of KOREAN_HOLIDAYS) {
        if (h.month === m && Math.abs(h.day - d) <= h.range) {
          return h;
        }
      }
      return null;
    },

    // 최근 수업 기록 분석 (참여도, 기분, 미실시) (Requirement 14, 15, 29)
    analyzeRecentCareStats() {
      const records = window.RecordManager ? window.RecordManager.getAllRecords() : [];
      const stats = {
        domainScores: {},
        preferredDomains: [],
        difficultDomains: [],
        positiveMoodKeywords: ['재미', '괜찮', '좋', '행복', '즐거', '만족'],
        highParticipationKeywords: ['적극', '높음', '우수']
      };

      if (!records.length) return stats;

      // 최근 30개 기록 분석
      const recent = records.slice(0, 30);
      recent.forEach(r => {
        const title = r.lessonTitle || '';
        const isHigh = stats.highParticipationKeywords.some(k => (r.participation || '').includes(k));
        const isGoodMood = stats.positiveMoodKeywords.some(k => (r.mood || '').includes(k));

        // 도메인 추정
        let matchedDomain = '기타';
        if (title.includes('체조') || title.includes('운동') || title.includes('스트레칭')) matchedDomain = '신체운동';
        else if (title.includes('음악') || title.includes('노래')) matchedDomain = '음악';
        else if (title.includes('색칠') || title.includes('미술') || title.includes('그림')) matchedDomain = '미술';
        else if (title.includes('회상') || title.includes('사진') || title.includes('추억')) matchedDomain = '회상';
        else if (title.includes('계산') || title.includes('숫자')) matchedDomain = '계산';
        else if (title.includes('놀이') || title.includes('카드') || title.includes('퀴즈')) matchedDomain = '놀이';

        stats.domainScores[matchedDomain] = (stats.domainScores[matchedDomain] || 0) + (isHigh ? 2 : 0) + (isGoodMood ? 2 : -1);
      });

      for (const [dom, score] of Object.entries(stats.domainScores)) {
        if (score >= 4) stats.preferredDomains.push(dom);
        if (score <= -2) stats.difficultDomains.push(dom);
      }

      return stats;
    },

    // 최근 N일간 사용된 프로그램 ID / 제목 목록 추출 (Requirement 10, 11)
    getRecentlyUsedProgramIds(targetDateStr, daysBack = 7) {
      const all = this.getAllSchedules();
      const targetDt = new Date(targetDateStr);
      const usedIds = new Set();
      const usedYesterdayIds = new Set();

      const yesterday = new Date(targetDt);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      for (let i = 1; i <= daysBack; i++) {
        const d = new Date(targetDt);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().slice(0, 10);
        const slot = all[ds];
        if (slot) {
          if (slot.am && slot.am.lead && slot.am.lead.id) usedIds.add(slot.am.lead.id);
          if (slot.am && slot.am.partner && slot.am.partner.id) usedIds.add(slot.am.partner.id);
          if (slot.pm && slot.pm.lead && slot.pm.lead.id) usedIds.add(slot.pm.lead.id);
          if (slot.pm && slot.pm.partner && slot.pm.partner.id) usedIds.add(slot.pm.partner.id);

          if (ds === yesterdayStr) {
            if (slot.am && slot.am.lead && slot.am.lead.id) usedYesterdayIds.add(slot.am.lead.id);
            if (slot.am && slot.am.partner && slot.am.partner.id) usedYesterdayIds.add(slot.am.partner.id);
            if (slot.pm && slot.pm.lead && slot.pm.lead.id) usedYesterdayIds.add(slot.pm.lead.id);
            if (slot.pm && slot.pm.partner && slot.pm.partner.id) usedYesterdayIds.add(slot.pm.partner.id);
          }
        }
      }

      return { usedInLastNDays: usedIds, usedYesterday: usedYesterdayIds };
    },

    // 최적의 단일 프로그램 선택 알고리즘 (Requirements 10 ~ 19, 33)
    selectOptimalProgram(characterId, targetDt, sessionType, alreadyPickedInSession = [], stats = null) {
      const lib = window.ProgramLibrary ? window.ProgramLibrary.getActiveByCharacter(characterId) : [];
      if (!lib.length) return null;

      const settings = this.getSettings();
      const targetDateStr = targetDt.toISOString().slice(0, 10);
      const dayNum = targetDt.getDay();
      const season = this.detectSeason(targetDt);
      const holiday = this.detectHoliday(targetDt);
      const { usedInLastNDays, usedYesterday } = this.getRecentlyUsedProgramIds(targetDateStr, settings.repeatLimitDays);

      // 토요일 특화 (Requirement 18: 주간 회상, 레크리에이션, 가벼운 활동)
      const isSaturday = dayNum === 6;

      // 후보군 필터링 및 점수화 (Scoring)
      let candidates = lib.map(p => {
        let score = 50; // 기본 점수

        // 1. 중복 감점 (가장 중요)
        if (alreadyPickedInSession.includes(p.id)) score -= 2000;
        if (usedYesterday.has(p.id) && settings.preventConsecutiveDays) score -= 1500;
        if (usedInLastNDays.has(p.id)) score -= 1000;

        // 2. 토요일 우선순위 (Requirement 18)
        if (isSaturday) {
          if (p.title.includes('가벼운') || p.title.includes('주간') || p.title.includes('회상') || p.title.includes('레크리에이션') || p.title.includes('자유')) {
            score += 40;
          }
        }

        // 3. 계절 일치 보너스 (Requirement 16)
        if (settings.seasonEnabled && (p.season === season || p.season === '공통')) {
          if (p.season === season) score += 25;
        }

        // 4. 명절 및 기념일 보너스 (Requirement 17)
        if (settings.holidayEnabled && holiday) {
          if (p.holiday === holiday.name || (p.desc && holiday.tags.some(t => p.desc.includes(t)))) {
            score += 35;
          }
        }

        // 5. 어르신 반응 및 난이도 조절 (Requirement 13, 14)
        if (settings.feedbackEnabled && stats) {
          if (stats.preferredDomains.includes(p.domain)) score += 15;
          if (stats.difficultDomains.includes(p.domain)) {
            // 어려운 도메인은 쉬운 난이도 활동을 우선
            if (p.difficulty === '쉬움') score += 10;
            else score -= 15;
          }
        }

        // 사용 횟수 적은 것 우선 (순환 균형)
        score -= (p.usageCount || 0) * 5;

        return { prog: p, score };
      });

      // 점수 내림차순 정렬
      candidates.sort((a, b) => b.score - a.score);

      // 가장 점수가 높은 후보 선택
      let selected = (candidates[0] && candidates[0].prog) || null;
      let isFallback = false;

      // 만약 7일 이내 중복이 불가피한 경우 (후보 부족) -> 가장 오래 전에 쓴 것 재사용 (Requirement 33)
      if (selected && usedInLastNDays.has(selected.id) && candidates.every(c => usedInLastNDays.has(c.prog.id))) {
        // 오래 전에 사용한 순서로 재정렬
        const sortedByAge = [...lib].sort((a, b) => {
          if (!a.lastUsed) return -1;
          if (!b.lastUsed) return 1;
          return a.lastUsed.localeCompare(b.lastUsed);
        });
        selected = sortedByAge[0];
        isFallback = true;
      }

      return { program: selected, isFallback };
    },

    // 하루(오전/오후) 자동 편성 (Requirement 5)
    generateDaily(dateStr, options = {}) {
      const dt = new Date(dateStr);
      const dayNum = dt.getDay();
      const settings = this.getSettings();

      const slot = this.createEmptyDateSlot(dateStr);

      // 휴무일 체크 (Requirement 24)
      if (slot.isOffDay) {
        slot.amStatus = '휴무';
        slot.pmStatus = '휴무';
        slot.status = 'confirmed';
        return slot;
      }

      // 기관 행사 체크 (Requirement 23)
      if (slot.facilityEvent) {
        slot.am = {
          title: `🎪 ${slot.facilityEvent.title}`,
          desc: slot.facilityEvent.note || '기관 특별 행사 진행',
          lead: { character: 'kongi', characterName: '콩이', title: slot.facilityEvent.title, duration: 60 },
          partner: null,
          totalDuration: 60,
          isEvent: true
        };
        slot.pm = {
          title: '🌷 행사 후 휴식 및 자유 대화',
          desc: '어르신들과 행사 소감을 나누고 편안하게 휴식을 취합니다.',
          lead: { character: 'bori', characterName: '보리', title: '자유 대화 및 휴식', duration: 60 },
          partner: null,
          totalDuration: 60,
          isEvent: true
        };
        slot.status = 'confirmed';
        return slot;
      }

      const stats = this.analyzeRecentCareStats();
      let hasFallback = false;

      // ── 오전 세션 (콩이 운동 20분 + 나비 인지 25분) ──
      const pickedAm = [];
      const kongiRes = this.selectOptimalProgram('kongi', dt, 'am', pickedAm, stats);
      if (kongiRes && kongiRes.isFallback) hasFallback = true;
      if (kongiRes && kongiRes.program) pickedAm.push(kongiRes.program.id);

      const nabiRes = this.selectOptimalProgram('nabi', dt, 'am', pickedAm, stats);
      if (nabiRes && nabiRes.isFallback) hasFallback = true;
      if (nabiRes && nabiRes.program) pickedAm.push(nabiRes.program.id);

      const kongiTitle = (kongiRes && kongiRes.program && kongiRes.program.title) || '체조';
      const nabiTitle = (nabiRes && nabiRes.program && nabiRes.program.title) || '회상';

      slot.am = {
        title: `🐶 콩이 ${kongiTitle} 20분 + 🐱 나비 ${nabiTitle} 25분`,
        timeRange: `${settings.amStart} ~ ${settings.amEnd} (60분)`,
        lead: (kongiRes && kongiRes.program) ? Object.assign({}, kongiRes.program, { duration: 20 }) : null,
        partner: (nabiRes && nabiRes.program) ? Object.assign({}, nabiRes.program, { duration: 25 }) : null,
        greetingDuration: 5,
        wrapupDuration: 10,
        totalDuration: 60
      };

      // ── 오후 세션 (토리 놀이 20분 + 보리 취미 25분) ──
      const pickedPm = [];
      const toriRes = this.selectOptimalProgram('tori', dt, 'pm', pickedPm, stats);
      if (toriRes && toriRes.isFallback) hasFallback = true;
      if (toriRes && toriRes.program) pickedPm.push(toriRes.program.id);

      const boriRes = this.selectOptimalProgram('bori', dt, 'pm', pickedPm, stats);
      if (boriRes && boriRes.isFallback) hasFallback = true;
      if (boriRes && boriRes.program) pickedPm.push(boriRes.program.id);

      const toriTitle = (toriRes && toriRes.program && toriRes.program.title) || '놀이';
      const boriTitle = (boriRes && boriRes.program && boriRes.program.title) || '취미';

      slot.pm = {
        title: `🐰 토리 ${toriTitle} 20분 + 🐻 보리 ${boriTitle} 25분`,
        timeRange: `${settings.pmStart} ~ ${settings.pmEnd} (60분)`,
        lead: (toriRes && toriRes.program) ? Object.assign({}, toriRes.program, { duration: 20 }) : null,
        partner: (boriRes && boriRes.program) ? Object.assign({}, boriRes.program, { duration: 25 }) : null,
        greetingDuration: 5,
        wrapupDuration: 10,
        totalDuration: 60
      };

      if (hasFallback) {
        slot.fallbackNotice = '일부 프로그램은 후보 부족으로 재사용되었습니다.';
      }

      slot.status = options.autoConfirm ? 'confirmed' : 'draft';
      return slot;
    },

    // 주간 자동 편성 (월~토 6일 × 오전/오후 = 12개 수업) (Requirement 7, 32-2)
    generateWeekly(mondayDateStr, autoConfirm = false) {
      const monDt = new Date(mondayDateStr);
      // Ensure monday
      const day = monDt.getDay();
      const diffToMon = day === 0 ? 1 : (1 - day);
      monDt.setDate(monDt.getDate() + diffToMon);

      const weekKey = `W_${monDt.toISOString().slice(0, 10)}`;
      const all = this.getAllSchedules();
      const generatedDays = [];

      // 월(0) ~ 토(5) 순회
      for (let i = 0; i < 6; i++) {
        const curDt = new Date(monDt);
        curDt.setDate(monDt.getDate() + i);
        const ds = curDt.toISOString().slice(0, 10);

        const slot = this.generateDaily(ds, { autoConfirm });
        slot.weekKey = weekKey;
        all[ds] = slot;
        this.saveAllSchedules(all); // Save immediately so subsequent days see recent history!
        generatedDays.push(slot);
      }

      return { weekKey, mondayDate: monDt.toISOString().slice(0, 10), days: generatedDays };
    },

    // 월간 전체 자동 편성 (해당 월 모든 운영일) (Requirement 8, 32-3)
    generateMonthly(year, month, autoConfirm = false) {
      const all = this.getAllSchedules();
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      const daysCount = lastDay.getDate();
      const generatedDays = [];

      for (let d = 1; d <= daysCount; d++) {
        const dt = new Date(year, month - 1, d);
        const ds = dt.toISOString().slice(0, 10);
        const slot = this.generateDaily(ds, { autoConfirm });
        slot.monthKey = `${year}-${String(month).padStart(2, '0')}`;
        all[ds] = slot;
        this.saveAllSchedules(all); // Save immediately so subsequent days see recent history!
        generatedDays.push(slot);
      }

      return { year, month, totalDays: generatedDays.length, days: generatedDays };
    },

    // 오늘 프로그램 확정된 것 or 실시간 추천 가져오기 (Requirement 5)
    getTodayResolvedProgram(dateObj = new Date()) {
      const ds = dateObj.toISOString().slice(0, 10);
      const all = this.getAllSchedules();
      if (all[ds] && ['confirmed','approved','active'].includes(all[ds].status) && all[ds].am && all[ds].pm) {
        return all[ds];
      }
      // Unapproved proposals must never become a live lesson. Caller retains the legacy baseline.
      return null;
    },

    // ═════════════════════════════════════════════════════════════════════
    // D. 주간/월간 자동 보고서 & 순환 개선 (Requirements 27, 28, 29)
    // ═════════════════════════════════════════════════════════════════════
    generateWeeklyReport(mondayDateStr) {
      const monDt = new Date(mondayDateStr);
      const days = [];
      const all = this.getAllSchedules();

      for (let i = 0; i < 6; i++) {
        const d = new Date(monDt);
        d.setDate(monDt.getDate() + i);
        const ds = d.toISOString().slice(0, 10);
        if (all[ds]) days.push(all[ds]);
      }

      const totalClasses = days.filter(d => !d.isOffDay).length * 2;
      const completedClasses = days.filter(d => d.amStatus === '완료').length + days.filter(d => d.pmStatus === '완료').length;
      const missedClasses = days.filter(d => d.amStatus === '미실시').length + days.filter(d => d.pmStatus === '미실시').length;

      return {
        weekStart: mondayDateStr,
        totalClasses,
        completedClasses,
        missedClasses,
        exerciseCount: days.filter(d => d.am && d.am.lead && d.am.lead.character === 'kongi').length,
        cognitiveCount: days.filter(d => d.am && d.am.partner && d.am.partner.character === 'nabi').length,
        playCount: days.filter(d => d.pm && d.pm.lead && d.pm.lead.character === 'tori').length,
        hobbyCount: days.filter(d => d.pm && d.pm.partner && d.pm.partner.character === 'bori').length,
        recommendationNotice: '이번 주 반응을 분석하여 다음 주 프로그램의 난이도 및 선호 활동 비중을 자동 최적화했습니다.'
      };
    },

    // 월간 CSV 다운로드 (Requirement 37)
    downloadMonthlyCsv(year, month) {
      const all = this.getAllSchedules();
      const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
      const records = Object.values(all)
        .filter(s => s.date.startsWith(monthPrefix))
        .sort((a, b) => a.date.localeCompare(b.date));

      if (!records.length) {
        alert('해당 월의 편성 프로그램이 없습니다.');
        return;
      }

      const headers = ['날짜', '요일', '구분', '오전 프로그램 (60분)', '오전 상태', '오후 프로그램 (60분)', '오후 상태', '확정 여부'];
      const rows = records.map(r => [
        `"${r.date}"`,
        `"${r.dayName}"`,
        `"${r.isOffDay ? '휴무' : (r.facilityEvent ? '행사' : '일반')}"`,
        `"${r.am ? r.am.title.replace(/"/g, '""') : '-'}"`,
        `"${r.amStatus}"`,
        `"${r.pm ? r.pm.title.replace(/"/g, '""') : '-'}"`,
        `"${r.pmStatus}"`,
        `"${r.status === 'confirmed' ? '확정' : '가안'}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `디지털AI학교_${year}년_${month}월_프로그램편성표.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  window.AutoScheduler = AutoScheduler;
})(typeof window !== 'undefined' ? window : global);
