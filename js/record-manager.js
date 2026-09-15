/**
 * 디지털 학교 - 사회복지사/선생님 돌봄 기록 관리자 (Care Record Manager)
 * 원칙: 점수, 등수, 실패 횟수 절대 배제. 참여도와 정서적 안정을 돕는 케어 지표 중심 기록
 */

const RecordManager = {
  STORAGE_KEY: 'digital_school_care_records',
  CURRENT_USER_KEY: 'digital_school_current_learner',

  // 기본 학습자 목록 (치매 안심센터/복지관 맞춤)
  LEARNERS: ['김영자 어르신', '박순옥 어르신', '이종수 어르신', '정태호 어르신', '최말순 어르신'],

  init() {
    if (!localStorage.getItem(this.CURRENT_USER_KEY)) {
      localStorage.setItem(this.CURRENT_USER_KEY, this.LEARNERS[0]);
    }
    // 초기 샘플 기록이 없으면 따뜻한 기본 데이터 생성
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, '[]');
    }
  },

  getCurrentLearner() {
    return localStorage.getItem(this.CURRENT_USER_KEY) || this.LEARNERS[0];
  },

  setCurrentLearner(name) {
    localStorage.setItem(this.CURRENT_USER_KEY, name);
  },

  getAllRecords() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('기록 불러오기 오류:', e);
      return [];
    }
  },

  saveRecord(record) {
    const records = this.getAllRecords();
    const newRecord = {
      id: 'REC_' + Date.now(),
      date: record.date || new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      learner: record.learner || this.getCurrentLearner(),
      lessonTitle: record.lessonTitle || '오늘의 AI 수업',
      lessonIcon: record.lessonIcon || '🧡',
      isCompleted: record.isCompleted !== undefined ? record.isCompleted : true,
      mood: record.mood || '😊 재미있었어요',
      moodEmoji: record.moodEmoji || '😊',
      assistanceNeeded: record.assistanceNeeded || '스스로 원활히 참여하심',
      durationText: record.durationText || '3분 20초',
      timestamp: Date.now()
    };

    records.unshift(newRecord);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    return newRecord;
  },

  seedInitialRecords() {
    const initialRecords = [
      {
        id: 'REC_1',
        date: '2026년 9월 9일 10:15',
        learner: '김영자 어르신',
        lessonTitle: '📷 추억의 사진 이야기',
        lessonIcon: '📷',
        isCompleted: true,
        mood: '😊 재미있었어요',
        moodEmoji: '😊',
        assistanceNeeded: '스스로 원활히 참여하심',
        durationText: '4분 15초',
        timestamp: Date.now() - 14400000
      },
      {
        id: 'REC_2',
        date: '2026년 9월 9일 11:30',
        learner: '박순옥 어르신',
        lessonTitle: '🎵 추억의 음악',
        lessonIcon: '🎵',
        isCompleted: true,
        mood: '🙂 괜찮았어요',
        moodEmoji: '🙂',
        assistanceNeeded: '박자 맞추기 가벼운 안내',
        durationText: '5분 40초',
        timestamp: Date.now() - 10800000
      },
      {
        id: 'REC_3',
        date: '2026년 9월 8일 14:20',
        learner: '이종수 어르신',
        lessonTitle: '🎨 AI 그림 만들기',
        lessonIcon: '🎨',
        isCompleted: true,
        mood: '😊 재미있었어요',
        moodEmoji: '😊',
        assistanceNeeded: '스스로 원활히 참여하심',
        durationText: '3분 50초',
        timestamp: Date.now() - 86400000
      },
      {
        id: 'REC_4',
        date: '2026년 9월 8일 15:10',
        learner: '김영자 어르신',
        lessonTitle: '🧠 기억 놀이',
        lessonIcon: '🧠',
        isCompleted: true,
        mood: '🙂 괜찮았어요',
        moodEmoji: '🙂',
        assistanceNeeded: '스스로 원활히 참여하심',
        durationText: '4분 05초',
        timestamp: Date.now() - 82800000
      }
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialRecords));
  },

  // 사회복지사용 케어 요약 통계 계산
  getCareStats(filterLearner = 'all') {
    const all = this.getAllRecords();
    const filtered = filterLearner === 'all' ? all : all.filter(r => r.learner === filterLearner);

    const totalSessions = filtered.length;
    const completedSessions = filtered.filter(r => r.isCompleted).length;
    
    // 긍정 기분 비율 계산
    const positiveMoods = filtered.filter(r => r.mood.includes('재미') || r.mood.includes('괜찮')).length;
    const positiveRate = totalSessions > 0 ? Math.round((positiveMoods / totalSessions) * 100) : 100;

    return {
      totalSessions,
      completedSessions,
      positiveRate,
      activeLearnersCount: new Set(all.map(r => r.learner)).size
    };
  }
};

window.RecordManager = RecordManager;
