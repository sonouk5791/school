import type {
  DailyContentCandidate,
  DailyHistoryRecord,
  DailyItem,
  GeneratedContentPayload
} from '../types/dailyContent';

const STORAGE_KEY_PENDING = 'brain_school_daily_pending';
const STORAGE_KEY_APPROVED = 'brain_school_daily_approved';
const STORAGE_KEY_HISTORY = 'brain_school_daily_history';

// Default initial fallback library of senior-friendly item sets
const DEFAULT_FALLBACK_PAYLOADS: GeneratedContentPayload[] = [
  {
    date: '2026-09-01',
    theme: '정겨운 수확 과일과 채소 🍎',
    generatedAt: new Date().toISOString(),
    items: [
      { id: 'fb-apple', label: '사과', emoji: '🍎', category: '과일' },
      { id: 'fb-persimmon', label: '단감', emoji: '🍊', category: '과일' },
      { id: 'fb-chestnut', label: '밤', emoji: '🌰', category: '과일' },
      { id: 'fb-sweetpotato', label: '고구마', emoji: '🍠', category: '채소' },
      { id: 'fb-grape', label: '포도', emoji: '🍇', category: '과일' },
      { id: 'fb-corn', label: '옥수수', emoji: '🌽', category: '채소' },
      { id: 'fb-pumpkin', label: '늙은호박', emoji: '🎃', category: '채소' },
      { id: 'fb-mushroom', label: '송이버섯', emoji: '🍄', category: '채소' }
    ]
  },
  {
    date: '2026-08-31',
    theme: '추억의 시골 전원 풍경 🏡',
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    items: [
      { id: 'fb-sparrow', label: '참새', emoji: '🐦', category: '동물' },
      { id: 'fb-sunflower', label: '해바라기', emoji: '🌻', category: '식물' },
      { id: 'fb-pine', label: '소나무', emoji: '🌲', category: '식물' },
      { id: 'fb-cow', label: '황소', emoji: '🐂', category: '동물' },
      { id: 'fb-dragonfly', label: '고추잠자리', emoji: '🦟', category: '곤충' },
      { id: 'fb-frog', label: '청개구리', emoji: '🐸', category: '동물' },
      { id: 'fb-bicycle', label: '자전거', emoji: '🚲', category: '탈것' },
      { id: 'fb-flower', label: '코스모스', emoji: '🌸', category: '식물' }
    ]
  }
];

// Helper to get formatted YYYY-MM-DD
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class DailyContentManager {
  /**
   * Get today's approved content.
   * Fallback rule: If today has no approved content, returns yesterday's or standard fallback content.
   */
  static getTodayApprovedContent(): { payload: GeneratedContentPayload; isFallback: boolean } {
    const today = getTodayDateString();
    const approvedList = this.getApprovedList();

    // Check if today has an explicit approved content
    const todayApproved = approvedList.find((item) => item.date === today);
    if (todayApproved) {
      return { payload: todayApproved.payload, isFallback: false };
    }

    // Fallback: Pick the most recent approved candidate from history
    if (approvedList.length > 0) {
      const sorted = [...approvedList].sort((a, b) => b.date.localeCompare(a.date));
      return { payload: sorted[0].payload, isFallback: true };
    }

    // Default built-in fallback
    return { payload: DEFAULT_FALLBACK_PAYLOADS[0], isFallback: true };
  }

  /**
   * Get candidates pending approval
   */
  static getPendingCandidates(): DailyContentCandidate[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PENDING);
      if (!raw) {
        // Return a mock pending candidate if empty for testing/demo purposes
        const mockPending: DailyContentCandidate = {
          id: `cand-${Date.now()}`,
          date: getTodayDateString(),
          payload: {
            date: getTodayDateString(),
            theme: '가을 뜰안의 정겨운 열매와 생활도구 🧺',
            generatedAt: new Date().toISOString(),
            items: [
              { id: 'ai-1', label: '단감', emoji: '🍊', category: '과일' },
              { id: 'ai-2', label: '대추', emoji: '🍒', category: '과일' },
              { id: 'ai-3', label: '짚신', emoji: '👞', category: '생활용품' },
              { id: 'ai-4', label: '풍로', emoji: '📻', category: '생활도구' },
              { id: 'ai-5', label: '국수', emoji: '🍜', category: '음식' },
              { id: 'ai-6', label: '바구니', emoji: '🧺', category: '생활용품' },
              { id: 'ai-7', label: '해바라기', emoji: '🌻', category: '식물' },
              { id: 'ai-8', label: '청사과', emoji: '🍏', category: '과일' }
            ]
          },
          evaluation: {
            approved: true,
            reason: '',
            evaluatedAt: new Date().toISOString(),
            criteriaScores: {
              distinctiveness: true,
              familiarity: true,
              nonThreatening: true,
              noBrandOrPolitics: true,
              simpleLanguage: true
            }
          },
          status: 'PENDING_APPROVAL',
          retryCount: 0
        };
        return [mockPending];
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Approve a candidate content
   */
  static approveCandidate(
    candidateId: string,
    customItems?: DailyItem[],
    customTheme?: string,
    approverName: string = '운영 관리자'
  ): void {
    const pendingList = this.getPendingCandidates();
    const candidate = pendingList.find((c) => c.id === candidateId);

    const approvedList = this.getApprovedList();
    const historyList = this.getHistoryRecords();

    let targetPayload: GeneratedContentPayload;

    if (candidate) {
      targetPayload = {
        ...candidate.payload,
        theme: customTheme || candidate.payload.theme,
        items: customItems || candidate.payload.items
      };
    } else {
      // Create new custom payload if candidate id not found
      targetPayload = {
        date: getTodayDateString(),
        theme: customTheme || '수동 편집 등록 콘텐츠 🌸',
        generatedAt: new Date().toISOString(),
        items: customItems || DEFAULT_FALLBACK_PAYLOADS[0].items
      };
    }

    const approvedRecord: DailyContentCandidate = {
      id: candidateId,
      date: targetPayload.date,
      payload: targetPayload,
      evaluation: candidate?.evaluation || {
        approved: true,
        reason: '수동 검수 및 승인',
        evaluatedAt: new Date().toISOString()
      },
      status: 'APPROVED',
      retryCount: candidate?.retryCount || 0,
      approvedBy: approverName,
      approvedAt: new Date().toISOString()
    };

    // Filter out existing approved for same date
    const updatedApproved = approvedList.filter((a) => a.date !== targetPayload.date);
    updatedApproved.push(approvedRecord);
    localStorage.setItem(STORAGE_KEY_APPROVED, JSON.stringify(updatedApproved));

    // Remove from pending list
    const updatedPending = pendingList.filter((c) => c.id !== candidateId);
    localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(updatedPending));

    // Add to history log
    const historyRecord: DailyHistoryRecord = {
      id: `hist-${Date.now()}`,
      date: targetPayload.date,
      theme: targetPayload.theme,
      itemsSummary: targetPayload.items.map((i) => i.label),
      approvedBy: approverName,
      approvedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      status: 'APPROVED'
    };

    const updatedHistory = [historyRecord, ...historyList].slice(0, 14); // Keep last 14 records
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
  }

  /**
   * Reject a candidate content
   */
  static rejectCandidate(candidateId: string, reason: string): void {
    const pendingList = this.getPendingCandidates();
    const target = pendingList.find((c) => c.id === candidateId);
    if (target) {
      target.status = 'REJECTED';
      target.rejectionReason = reason;
    }
    const updatedPending = pendingList.filter((c) => c.id !== candidateId);
    localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(updatedPending));
  }

  /**
   * Get history of last 7-14 days
   */
  static getHistoryRecords(): DailyHistoryRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!raw) {
        // Initial sample history
        return [
          {
            id: 'hist-1',
            date: '2026-08-31',
            theme: '추억의 시골 전원 풍경 🏡',
            itemsSummary: ['참새', '해바라기', '소나무', '황소', '고추잠자리', '청개구리', '자전거', '코스모스'],
            approvedBy: '운영 관리자',
            approvedAt: '어제 16:30',
            status: 'APPROVED'
          },
          {
            id: 'hist-2',
            date: '2026-08-30',
            theme: '정겨운 수확 과일과 채소 🍎',
            itemsSummary: ['사과', '단감', '밤', '고구마', '포도', '옥수수', '늙은호박', '송이버섯'],
            approvedBy: '자동 폴백 적용',
            approvedAt: '09:00',
            status: 'FALLBACK'
          }
        ];
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Get approved candidates list
   */
  private static getApprovedList(): DailyContentCandidate[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_APPROVED);
      if (!raw) {
        return DEFAULT_FALLBACK_PAYLOADS.map((payload) => ({
          id: `approved-${payload.date}`,
          date: payload.date,
          payload,
          evaluation: { approved: true, reason: '기본 보증 승인', evaluatedAt: new Date().toISOString() },
          status: 'APPROVED',
          retryCount: 0,
          approvedBy: '시스템 기본 보증',
          approvedAt: payload.generatedAt
        }));
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Simulate running the AI Generator Pipeline (for Admin Panel demo)
   */
  static simulateAiGenerationPipeline(): DailyContentCandidate {
    const today = getTodayDateString();

    const sampleThemes = [
      { theme: '가을 가을한 시골 정원과 꽃 🌸', items: [
        { id: 's-1', label: '국화', emoji: '🌼', category: '식물' },
        { id: 's-2', label: '단풍잎', emoji: '🍁', category: '식물' },
        { id: 's-3', label: '은행열매', emoji: '🍂', category: '식물' },
        { id: 's-4', label: '도토리', emoji: '🌰', category: '열매' },
        { id: 's-5', label: '석류', emoji: '🍎', category: '과일' },
        { id: 's-6', label: '무화과', emoji: '🍐', category: '과일' },
        { id: 's-7', label: '돌담', emoji: '🪨', category: '풍경' },
        { id: 's-8', label: '허수아비', emoji: '🌾', category: '풍경' }
      ]},
      { theme: '정겨운 어머니 밥상 재료 🍚', items: [
        { id: 's-10', label: '갓지은밥', emoji: '🍚', category: '음식' },
        { id: 's-11', label: '된장찌개', emoji: '🍲', category: '음식' },
        { id: 's-12', label: '계란말이', emoji: '🍳', category: '음식' },
        { id: 's-13', label: '배추김치', emoji: '🥬', category: '음식' },
        { id: 's-14', label: '조기구이', emoji: '🐟', category: '음식' },
        { id: 's-15', label: '시금치나물', emoji: '🥗', category: '음식' },
        { id: 's-16', label: '김가루', emoji: '🍙', category: '음식' },
        { id: 's-17', label: '숭늉', emoji: '🍵', category: '음식' }
      ]}
    ];

    const chosen = sampleThemes[Math.floor(Math.random() * sampleThemes.length)];

    const candidate: DailyContentCandidate = {
      id: `ai-gen-${Date.now()}`,
      date: today,
      payload: {
        date: today,
        theme: chosen.theme,
        generatedAt: new Date().toISOString(),
        items: chosen.items
      },
      evaluation: {
        approved: true,
        reason: '자동 검수 5개 항목 모두 합격',
        evaluatedAt: new Date().toISOString(),
        criteriaScores: {
          distinctiveness: true,
          familiarity: true,
          nonThreatening: true,
          noBrandOrPolitics: true,
          simpleLanguage: true
        }
      },
      status: 'PENDING_APPROVAL',
      retryCount: 0
    };

    const pending = this.getPendingCandidates();
    const updatedPending = [candidate, ...pending.filter((p) => p.date !== today)];
    localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(updatedPending));

    return candidate;
  }
}
