/**
 * 디지털 AI 학교 - 주간보호센터 프로그램 스케줄 & 데이터 관리 엔진
 * (Daycare Schedule & Program Management Engine)
 */
((window) => {
  'use strict';

  const STORAGE_SCHEDULE_KEY = 'digital_school_weekly_schedule_v1';
  const STORAGE_HOURS_KEY = 'digital_school_program_hours_v1';
  const STORAGE_PIN_KEY = 'digital_school_admin_pin';
  const STORAGE_ELDERS_KEY = 'digital_school_daycare_elders_v1';
  const STORAGE_JOURNALS_KEY = 'digital_school_ai_journals_v1';

  // 1. 월요일~금요일 기본 프로그램 편성 (Requirement 5)
  const DEFAULT_WEEKLY_SCHEDULE = {
    1: {
      dayName: '월요일',
      am: { character: '콩이', activity: '의자 건강체조', duration: 20, partner: '나비', partnerActivity: '고향 사진 회상', partnerDuration: 25 },
      pm: { character: '토리', activity: '그림 맞추기', duration: 20, partner: '보리', partnerActivity: '색칠하기', partnerDuration: 25 }
    },
    2: {
      dayName: '화요일',
      am: { character: '콩이', activity: '손가락·관절 운동', duration: 20, partner: '나비', partnerActivity: '속담 맞히기', partnerDuration: 25 },
      pm: { character: '토리', activity: '옛날 물건 맞히기', duration: 20, partner: '보리', partnerActivity: '음악 감상', partnerDuration: 25 }
    },
    3: {
      dayName: '수요일',
      am: { character: '콩이', activity: '상체 스트레칭', duration: 20, partner: '나비', partnerActivity: '숫자·계산 활동', partnerDuration: 25 },
      pm: { character: '토리', activity: '기억력 카드 놀이', duration: 20, partner: '보리', partnerActivity: '만들기 활동', partnerDuration: 25 }
    },
    4: {
      dayName: '목요일',
      am: { character: '콩이', activity: '박수 건강체조', duration: 20, partner: '나비', partnerActivity: '어린 시절 이야기', partnerDuration: 25 },
      pm: { character: '토리', activity: '그림 찾기 놀이', duration: 20, partner: '보리', partnerActivity: '옛 노래 감상', partnerDuration: 25 }
    },
    5: {
      dayName: '금요일',
      am: { character: '콩이', activity: '전신 의자체조', duration: 20, partner: '나비', partnerActivity: '이번 주 기억 회상', partnerDuration: 25 },
      pm: { character: '토리', activity: '재미있는 퀴즈', duration: 20, partner: '보리', partnerActivity: '자유 취미활동', partnerDuration: 25 }
    },
    6: {
      dayName: '토요일',
      am: { character: '콩이', activity: '가벼운 건강체조', duration: 20, partner: '나비', partnerActivity: '이번 주 기억 회상', partnerDuration: 25 },
      pm: { character: '토리', activity: '간단한 레크리에이션', duration: 20, partner: '보리', partnerActivity: '자유 취미활동', partnerDuration: 25 }
    }
  };

  // 2. 기본 운영시간 (Requirement 1, 7)
  const DEFAULT_HOURS = {
    amStart: '10:00',
    amEnd: '11:00',
    pmStart: '14:00',
    pmEnd: '15:00'
  };

  // 3. 테스트용 가상 대상자 (Requirement 28, 30) - 개인정보 최소화
  const DEFAULT_ELDERS = [
    { id: 'A001', name: '박순옥', masked: '박○○', age: '78세', grade: '3등급', cognition: '경도인지장애', note: '오전 체조에 적극적으로 참여하심' },
    { id: 'A002', name: '김영자', masked: '김○○', age: '82세', grade: '2등급', cognition: '중등도 치매', note: '회상 대화 시 옛 기억 표현이 풍부하심' },
    { id: 'A003', name: '이종수', masked: '이○○', age: '75세', grade: '4등급', cognition: '인지 정상', note: '만들기 및 미술 활동 집중도 우수' },
    { id: 'A004', name: '정태호', masked: '정○○', age: '80세', grade: '5등급', cognition: '경도인지장애', note: '옛 노래 감상과 박수 치기 즐겨하심' },
    { id: 'A005', name: '최말순', masked: '최○○', age: '85세', grade: '3등급', cognition: '경도인지장애', note: '상체 스트레칭 시 보조 필요' }
  ];

  const DaycareSchedule = {
    // 주간 프로그램표 조회
    getWeeklySchedule() {
      try {
        const saved = localStorage.getItem(STORAGE_SCHEDULE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('스케줄 로드 실패:', e);
      }
      return JSON.parse(JSON.stringify(DEFAULT_WEEKLY_SCHEDULE));
    },

    // 주간 프로그램표 저장
    saveWeeklySchedule(schedule) {
      localStorage.setItem(STORAGE_SCHEDULE_KEY, JSON.stringify(schedule));
      window.dispatchEvent(new CustomEvent('daycare-schedule-updated', { detail: schedule }));
      return true;
    },

    // 오늘 요일의 프로그램 자동 조회 (AutoScheduler 연동 및 Fallback) (Requirement 5, 6)
    getTodayProgram(dateObj = new Date()) {
      if (window.AutoScheduler) {
        const slot = window.AutoScheduler.getTodayResolvedProgram(dateObj);
        if (slot && slot.am && slot.pm) {
          return {
            dayName: slot.dayName,
            isOffDay: slot.isOffDay,
            facilityEvent: slot.facilityEvent,
            status: slot.status,
            amStatus: slot.amStatus,
            pmStatus: slot.pmStatus,
            fallbackNotice: slot.fallbackNotice,
            am: {
              character: '콩이',
              activity: (slot.am.lead && slot.am.lead.title) || '건강체조',
              duration: (slot.am.lead && slot.am.lead.duration) || 20,
              partner: '나비',
              partnerActivity: (slot.am.partner && slot.am.partner.title) || '인지활동',
              partnerDuration: (slot.am.partner && slot.am.partner.duration) || 25,
              raw: slot.am
            },
            pm: {
              character: '토리',
              activity: (slot.pm.lead && slot.pm.lead.title) || '놀이활동',
              duration: (slot.pm.lead && slot.pm.lead.duration) || 20,
              partner: '보리',
              partnerActivity: (slot.pm.partner && slot.pm.partner.title) || '취미활동',
              partnerDuration: (slot.pm.partner && slot.pm.partner.duration) || 25,
              raw: slot.pm
            }
          };
        }
      }

      let day = dateObj.getDay(); // 0(일) ~ 6(토)
      if (day === 0) day = 1; // 일요일은 기본 월요일 대체
      const schedule = this.getWeeklySchedule();
      return schedule[day] || schedule[1];
    },

    // 운영시간 조회 (Requirement 7)
    getProgramHours() {
      try {
        const saved = localStorage.getItem(STORAGE_HOURS_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return { ...DEFAULT_HOURS };
    },

    // 운영시간 저장
    saveProgramHours(hours) {
      localStorage.setItem(STORAGE_HOURS_KEY, JSON.stringify(hours));
      window.dispatchEvent(new CustomEvent('daycare-hours-updated', { detail: hours }));
      return true;
    },

    // 관리자 PIN 확인 (Requirement 10)
    verifyPin(inputPin) {
      const pin = localStorage.getItem(STORAGE_PIN_KEY) || '1234';
      return String(inputPin).trim() === pin;
    },

    // 관리자 PIN 변경
    changePin(newPin) {
      if (!newPin || String(newPin).trim().length < 4) return false;
      localStorage.setItem(STORAGE_PIN_KEY, String(newPin).trim());
      return true;
    },

    // 가상 대상자 목록 조회 (Requirement 28, 30)
    getElders() {
      try {
        const saved = localStorage.getItem(STORAGE_ELDERS_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return JSON.parse(JSON.stringify(DEFAULT_ELDERS));
    },

    // 대상자 추가/수정
    saveElders(elders) {
      localStorage.setItem(STORAGE_ELDERS_KEY, JSON.stringify(elders));
      window.dispatchEvent(new CustomEvent('daycare-elders-updated', { detail: elders }));
      return true;
    },

    // 가상 대상자 초기화
    resetElders() {
      this.saveElders(DEFAULT_ELDERS);
      return DEFAULT_ELDERS;
    },

    // 이름 마스킹 유틸 (홍길동 -> 홍○○, 김철 -> 김○)
    maskName(name) {
      if (!name) return '어르신';
      const str = String(name).trim();
      if (str.length <= 1) return str;
      if (str.length === 2) return str[0] + '○';
      return str[0] + '○'.repeat(str.length - 1);
    },

    // 날짜별 AI 수업일지 자동 생성 (Requirement 17)
    generateAiJournal(targetDateStr) {
      const allRecords = window.RecordManager ? window.RecordManager.getAllRecords() : [];
      // 해당 날짜 기록 필터
      const dayRecords = allRecords.filter(r => (r.date || '').includes(targetDateStr));
      const amRecords = dayRecords.filter(r => r.sessionType === 'am' || (r.timeSlot === '오전'));
      const pmRecords = dayRecords.filter(r => r.sessionType === 'pm' || (r.timeSlot === '오후'));

      // 오늘 프로그램 정보
      const dateParts = targetDateStr.split('-');
      const year = dateParts[0] || '2026';
      const month = dateParts[1] || '09';
      const day = dateParts[2] || '26';
      const dateObj = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
      const prog = this.getTodayProgram(dateObj);

      const amProgramName = `콩이와 ${prog.am.activity} 및 나비와 ${prog.am.partnerActivity}`;
      const pmProgramName = `토리와 ${prog.pm.activity} 및 보리와 ${prog.pm.partnerActivity}`;

      // 참여자 목록 마스킹 취합
      const attendees = Array.from(new Set(dayRecords.map(r => this.maskName(r.learner)))).join(', ') || '등록 어르신 다수';

      // 참여도 통계
      const activeCount = dayRecords.filter(r => (r.participation || '').includes('적극')).length;
      const normalCount = dayRecords.filter(r => (r.participation || '').includes('보통')).length;
      const needHelpCount = dayRecords.filter(r => (r.assistance || '').includes('도움')).length;

      let participationSummary = '대부분의 이용 어르신께서 캐릭터의 친근한 음성 안내에 집중하여 전 과정에 편안하게 참여하셨습니다.';
      if (amRecords.length > 0 && pmRecords.length > 0) {
        participationSummary += ' 특히 오전 체조 활동 시 큰 호응을 보였으며, 오후 인지·취미 시간에도 차분히 집중하여 완성도를 높였습니다.';
      }

      let notes = '특이사항: 참여자 전원 이상 반응 없이 안정적으로 일과를 마쳤으며, ';
      if (needHelpCount > 0) {
        notes += '신체 동작 시 일부 어르신께 가벼운 자세 보조를 제공하였습니다.';
      } else {
        notes += '모든 어르신께서 스스로 원활히 동작과 퀴즈에 참여하셨습니다.';
      }

      return {
        date: `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일 (${prog.dayName})`,
        rawDate: targetDateStr,
        programTitle: '디지털 AI 학교 인지·신체 통합 돌봄 프로그램',
        attendees,
        amProgram: `${amProgramName} (오전 진행 완료 / 총 60분)`,
        pmProgram: `${pmProgramName} (오후 진행 완료 / 총 60분)`,
        participationSummary,
        notes,
        totalSessions: dayRecords.length,
        createdAt: new Date().toISOString()
      };
    },

    // AI 수업일지 목록 조회
    getJournals() {
      try {
        const saved = localStorage.getItem(STORAGE_JOURNALS_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return [];
    },

    // AI 수업일지 저장
    saveJournal(journal) {
      const list = this.getJournals().filter(j => j.rawDate !== journal.rawDate);
      list.unshift(journal);
      localStorage.setItem(STORAGE_JOURNALS_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('daycare-journals-updated', { detail: journal }));
      return true;
    },

    // CSV 다운로드 (Requirement 29)
    downloadRecordsCsv() {
      const records = window.RecordManager ? window.RecordManager.getAllRecords() : [];
      if (!records.length) {
        alert('내보낼 수업 기록이 없습니다.');
        return;
      }
      const headers = ['수업일시', '대상자', '시간대', '프로그램명', '활동시간', '완료여부', '참여도', '기분', '도움필요여부', '메모'];
      const rows = records.map(r => [
        `"${r.date || ''}"`,
        `"${r.learner || ''}"`,
        `"${r.timeSlot || (r.sessionType === 'am' ? '오전' : '오후') || '오전'}"`,
        `"${r.lessonTitle || ''}"`,
        `"${r.durationText || ''}"`,
        `"${r.isCompleted ? '완료' : '미완료'}"`,
        `"${r.participation || '보통'}"`,
        `"${r.mood || ''}"`,
        `"${r.assistance || '도움 없음'}"`,
        `"${(r.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `디지털AI학교_수업기록_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    // JSON 전체 백업 (Requirement 29)
    downloadJsonBackup() {
      const backupData = {
        exportedAt: new Date().toISOString(),
        weeklySchedule: this.getWeeklySchedule(),
        programHours: this.getProgramHours(),
        elders: this.getElders(),
        journals: this.getJournals(),
        careRecords: window.RecordManager ? window.RecordManager.getAllRecords() : []
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `디지털AI학교_전체백업_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    // JSON 백업 복원
    restoreJsonBackup(jsonString) {
      try {
        const data = JSON.parse(jsonString);
        if (data.weeklySchedule) this.saveWeeklySchedule(data.weeklySchedule);
        if (data.programHours) this.saveProgramHours(data.programHours);
        if (data.elders) this.saveElders(data.elders);
        if (data.journals) localStorage.setItem(STORAGE_JOURNALS_KEY, JSON.stringify(data.journals));
        if (data.careRecords && window.RecordManager) {
          localStorage.setItem(window.RecordManager.STORAGE_KEY, JSON.stringify(data.careRecords));
        }
        return true;
      } catch (e) {
        console.error('백업 복원 실패:', e);
        return false;
      }
    }
  };

  window.DaycareSchedule = DaycareSchedule;
})(window);
