import type { SequenceScenario } from '../types/game';

// Clean, 100% universal single codepoints without hidden variation selector boxes on Windows
export const SEQUENCE_SCENARIOS: SequenceScenario[] = [
  // Level 1: 2 Steps (쉬움)
  {
    id: 'seq-wash-hands-2',
    title: '손 씻기',
    category: '위생',
    level: 1,
    steps: [
      { stepNumber: 1, label: '비누칠하기', emoji: '🧼' },
      { stepNumber: 2, label: '물로 헹구기', emoji: '🚰' },
    ],
  },
  {
    id: 'seq-glasses-2',
    title: '안경 쓰기',
    category: '일상',
    level: 1,
    steps: [
      { stepNumber: 1, label: '안경 닦기', emoji: '👓' },
      { stepNumber: 2, label: '안경 착용하기', emoji: '👴' },
    ],
  },
  {
    id: 'seq-shoes-2',
    title: '신발 신기',
    category: '외출',
    level: 1,
    steps: [
      { stepNumber: 1, label: '양말 신기', emoji: '🧦' },
      { stepNumber: 2, label: '신발 신기', emoji: '👞' },
    ],
  },
  {
    id: 'seq-drink-water-2',
    title: '물 마시기',
    category: '식사',
    level: 1,
    steps: [
      { stepNumber: 1, label: '컵에 물 따르기', emoji: '🚰' },
      { stepNumber: 2, label: '시원하게 마시기', emoji: '🥛' },
    ],
  },
  {
    id: 'seq-tv-2',
    title: '텔레비전 켜기',
    category: '가전',
    level: 1,
    steps: [
      { stepNumber: 1, label: '리모컨 집기', emoji: '📱' },
      { stepNumber: 2, label: '전원 버튼 누르기', emoji: '📺' },
    ],
  },

  // Level 2: 3 Steps (중간)
  {
    id: 'seq-teeth-3',
    title: '양치하기',
    category: '위생',
    level: 2,
    steps: [
      { stepNumber: 1, label: '칫솔에 치약 짜기', emoji: '🪥' },
      { stepNumber: 2, label: '치아 구석구석 닦기', emoji: '🦷' },
      { stepNumber: 3, label: '물로 입안 헹구기', emoji: '🥛' },
    ],
  },
  {
    id: 'seq-fruit-3',
    title: '사과 먹기',
    category: '식사',
    level: 2,
    steps: [
      { stepNumber: 1, label: '사과 깨끗이 씻기', emoji: '🍎' },
      { stepNumber: 2, label: '사과 껍질 깎기', emoji: '🍏' },
      { stepNumber: 3, label: '맛있게 먹기', emoji: '😋' },
    ],
  },
  {
    id: 'seq-phone-call-3',
    title: '전화 걸기',
    category: '일상',
    level: 2,
    steps: [
      { stepNumber: 1, label: '전화기 들기', emoji: '📱' },
      { stepNumber: 2, label: '전화번호 누르기', emoji: '🔢' },
      { stepNumber: 3, label: '다정하게 통화하기', emoji: '📞' },
    ],
  },
  {
    id: 'seq-plant-water-3',
    title: '화원에 물주기',
    category: '식물',
    level: 2,
    steps: [
      { stepNumber: 1, label: '물뿌리개에 물 담기', emoji: '🚰' },
      { stepNumber: 2, label: '화원에 천천히 물주기', emoji: '🌱' },
      { stepNumber: 3, label: '제자리에 정리하기', emoji: '✨' },
    ],
  },

  // Level 3: 4 Steps (보통)
  {
    id: 'seq-tea-4',
    title: '차 우려 마시기',
    category: '식사',
    level: 3,
    steps: [
      { stepNumber: 1, label: '찻잔과 찻잎 준비하기', emoji: '🍵' },
      { stepNumber: 2, label: '주전자에 따뜻한 물 붓기', emoji: '🫖' },
      { stepNumber: 3, label: '차 차분하게 우려내기', emoji: '☕' },
      { stepNumber: 4, label: '찻잔에 따라 마시기', emoji: '😌' },
    ],
  },
  {
    id: 'seq-bedding-4',
    title: '이부자리 정돈하기',
    category: '가사',
    level: 3,
    steps: [
      { stepNumber: 1, label: '베개 가지런히 놓기', emoji: '🧺' },
      { stepNumber: 2, label: '이불 팡팡 털기', emoji: '🧹' },
      { stepNumber: 3, label: '차곡차곡 개기', emoji: '🛏' },
      { stepNumber: 4, label: '장롱에 넣어두기', emoji: '🚪' },
    ],
  },

  // Level 4: 4 Steps (상급)
  {
    id: 'seq-outing-4',
    title: '외출 준비하기',
    category: '외출',
    level: 4,
    steps: [
      { stepNumber: 1, label: '단정한 외출복 입기', emoji: '👔' },
      { stepNumber: 2, label: '안경과 소지품 챙기기', emoji: '👓' },
      { stepNumber: 3, label: '신발 끈 매고 신기', emoji: '👞' },
      { stepNumber: 4, label: '현관문 잠그고 출발하기', emoji: '🔑' },
    ],
  },
  {
    id: 'seq-laundry-4',
    title: '세탁기 빨래하기',
    category: '가사',
    level: 4,
    steps: [
      { stepNumber: 1, label: '빨래 분류하여 넣기', emoji: '🧺' },
      { stepNumber: 2, label: '알맞은 세제 넣기', emoji: '🧴' },
      { stepNumber: 3, label: '동작 버튼 누르기', emoji: '🔘' },
      { stepNumber: 4, label: '빨래 건조대에 널기', emoji: '👕' },
    ],
  },

  // Level 5: 5 Steps (최고난도)
  {
    id: 'seq-rice-5',
    title: '밥 지어 퍼 담기',
    category: '가사',
    level: 5,
    steps: [
      { stepNumber: 1, label: '쌀 깨끗하게 씻기', emoji: '🍚' },
      { stepNumber: 2, label: '솥에 물 높이 맞추기', emoji: '🚰' },
      { stepNumber: 3, label: '전기밥솥 취사 버튼 누르기', emoji: '🔘' },
      { stepNumber: 4, label: '밥 뜸 들 때까지 기다리기', emoji: '⏰' },
      { stepNumber: 5, label: '밥그릇에 퍼 담기', emoji: '🥣' },
    ],
  },
];

export function getSequenceScenarioForLevel(level: number, currentScenarioId?: string): SequenceScenario {
  const matching = SEQUENCE_SCENARIOS.filter((s) => s.level === level);
  if (matching.length === 0) return SEQUENCE_SCENARIOS[0];

  const pool = matching.filter((s) => s.id !== currentScenarioId);
  const targetPool = pool.length > 0 ? pool : matching;

  return targetPool[Math.floor(Math.random() * targetPool.length)];
}
