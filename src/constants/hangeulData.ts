import type { HangeulScenario } from '../types/game';

export const HANGEUL_SCENARIOS: HangeulScenario[] = [
  // =========================================================
  // 1단계: 기본 자음 & 모음 익히기 (1글자 1칸 따라 적기)
  // =========================================================
  {
    id: 'han-consonants-1',
    questionTitle: '한글 첫 자음 "ㄱ, ㄴ, ㄷ"을 맞춰보세요.',
    hintText: '💡 자음 첫걸음: ㄱ ➔ ㄴ ➔ ㄷ',
    fullWord: 'ㄱㄴㄷ',
    level: 1,
    tiles: [
      { id: 'c-1-1', char: 'ㄱ', correctIndex: 0 },
      { id: 'c-1-2', char: 'ㄴ', correctIndex: 1 },
      { id: 'c-1-3', char: 'ㄷ', correctIndex: 2 },
    ],
  },
  {
    id: 'han-vowels-1',
    questionTitle: '한글 첫 모음 "ㅏ, ㅑ, ㅓ, ㅕ"를 맞춰보세요.',
    hintText: '💡 모음 첫걸음: ㅏ ➔ ㅑ ➔ ㅓ ➔ ㅕ',
    fullWord: 'ㅏㅑㅓㅕ',
    level: 1,
    tiles: [
      { id: 'v-1-1', char: 'ㅏ', correctIndex: 0 },
      { id: 'v-1-2', char: 'ㅑ', correctIndex: 1 },
      { id: 'v-1-3', char: 'ㅓ', correctIndex: 2 },
      { id: 'v-1-4', char: 'ㅕ', correctIndex: 3 },
    ],
  },
  {
    id: 'han-consonants-2',
    questionTitle: '한글 자음 "ㄹ, ㅁ, ㅂ"을 맞춰보세요.',
    hintText: '💡 차근차근 자음: ㄹ ➔ ㅁ ➔ ㅂ',
    fullWord: 'ㄹㅁㅂ',
    level: 1,
    tiles: [
      { id: 'c-2-1', char: 'ㄹ', correctIndex: 0 },
      { id: 'c-2-2', char: 'ㅁ', correctIndex: 1 },
      { id: 'c-2-3', char: 'ㅂ', correctIndex: 2 },
    ],
  },
  {
    id: 'han-vowels-2',
    questionTitle: '한글 모음 "ㅗ, ㅛ, ㅜ, ㅠ"를 맞춰보세요.',
    hintText: '💡 둥근 모음: ㅗ ➔ ㅛ ➔ ㅜ ➔ ㅠ',
    fullWord: 'ㅗㅛㅜㅠ',
    level: 1,
    tiles: [
      { id: 'v-2-1', char: 'ㅗ', correctIndex: 0 },
      { id: 'v-2-2', char: 'ㅛ', correctIndex: 1 },
      { id: 'v-2-3', char: 'ㅜ', correctIndex: 2 },
      { id: 'v-2-4', char: 'ㅠ', correctIndex: 3 },
    ],
  },
  {
    id: 'han-consonants-3',
    questionTitle: '한글 자음 "ㅅ, ㅇ, ㅈ"을 맞춰보세요.',
    hintText: '💡 정다운 자음: ㅅ ➔ ㅇ ➔ ㅈ',
    fullWord: 'ㅅㅇㅈ',
    level: 1,
    tiles: [
      { id: 'c-3-1', char: 'ㅅ', correctIndex: 0 },
      { id: 'c-3-2', char: 'ㅇ', correctIndex: 1 },
      { id: 'c-3-3', char: 'ㅈ', correctIndex: 2 },
    ],
  },
  {
    id: 'han-vowels-3',
    questionTitle: '천지인 기본 모음 "ㅡ, ㅣ"를 맞춰보세요.',
    hintText: '💡 땅(ㅡ)과 사람(ㅣ): ㅡ ➔ ㅣ',
    fullWord: 'ㅡㅣ',
    level: 1,
    tiles: [
      { id: 'v-3-1', char: 'ㅡ', correctIndex: 0 },
      { id: 'v-3-2', char: 'ㅣ', correctIndex: 1 },
    ],
  },

  // =========================================================
  // 2단계: 자음과 모음이 만난 정다운 2자 낱말
  // =========================================================
  {
    id: 'han-bag-2',
    questionTitle: '자음과 모음이 만난 낱말 "가방"을 맞춰보세요.',
    hintText: '💡 🎒 소지품을 챙겨 담는 [가방]',
    fullWord: '가방',
    level: 2,
    tiles: [
      { id: 'w-1-1', char: '가', correctIndex: 0 },
      { id: 'w-1-2', char: '방', correctIndex: 1 },
    ],
  },
  {
    id: 'han-butterfly-2',
    questionTitle: '자음과 모음이 만난 낱말 "나비"를 맞춰보세요.',
    hintText: '💡 🦋 꽃밭을 예쁘게 날아다니는 [나비]',
    fullWord: '나비',
    level: 2,
    tiles: [
      { id: 'w-2-1', char: '나', correctIndex: 0 },
      { id: 'w-2-2', char: '비', correctIndex: 1 },
    ],
  },
  {
    id: 'han-bridge-2',
    questionTitle: '자음과 모음이 만난 낱말 "다리"를 맞춰보세요.',
    hintText: '💡 🌉 강을 안전하게 건너는 [다리]',
    fullWord: '다리',
    level: 2,
    tiles: [
      { id: 'w-3-1', char: '다', correctIndex: 0 },
      { id: 'w-3-2', char: '리', correctIndex: 1 },
    ],
  },

  // =========================================================
  // 3단계: 정다운 3자 낱말
  // =========================================================
  {
    id: 'han-rainbow-3',
    questionTitle: '알맞은 3자 낱말을 순서대로 맞추어 보세요.',
    hintText: '💡 🌈 비 온 뒤 하늘에 뜨는 일곱 빛깔 [무지개]',
    fullWord: '무지개',
    level: 3,
    tiles: [
      { id: 'w-4-1', char: '무', correctIndex: 0 },
      { id: 'w-4-2', char: '지', correctIndex: 1 },
      { id: 'w-4-3', char: '개', correctIndex: 2 },
    ],
  },
  {
    id: 'han-sunflower-3',
    questionTitle: '알맞은 3자 낱말을 순서대로 맞추어 보세요.',
    hintText: '💡 🌻 해를 바라보며 피는 노란 꽃 [해바라기]',
    fullWord: '해바라기',
    level: 3,
    tiles: [
      { id: 'w-5-1', char: '해', correctIndex: 0 },
      { id: 'w-5-2', char: '바', correctIndex: 1 },
      { id: 'w-5-3', char: '라', correctIndex: 2 },
      { id: 'w-5-4', char: '기', correctIndex: 3 },
    ],
  },

  // =========================================================
  // 4단계: 4자 낱말 & 사자성어
  // =========================================================
  {
    id: 'han-doran-4',
    questionTitle: '정답게 이야기하는 4자 낱말을 완성해보세요.',
    hintText: '💡 여럿이 모여 다정하게 성의를 나누는 모습 [도란도란]',
    fullWord: '도란도란',
    level: 4,
    tiles: [
      { id: 'a-1-1', char: '도', correctIndex: 0 },
      { id: 'a-1-2', char: '란', correctIndex: 1 },
      { id: 'a-1-3', char: '도', correctIndex: 2 },
      { id: 'a-1-4', char: '란', correctIndex: 3 },
    ],
  },
  {
    id: 'han-health-4',
    questionTitle: '건강을 축원하는 사자성어를 완성해보세요.',
    hintText: '💡 큰 병 없이 오랫동안 건강하게 살아감 [무병장수]',
    fullWord: '무병장수',
    level: 4,
    tiles: [
      { id: 'a-2-1', char: '무', correctIndex: 0 },
      { id: 'a-2-2', char: '병', correctIndex: 1 },
      { id: 'a-2-3', char: '장', correctIndex: 2 },
      { id: 'a-2-4', char: '수', correctIndex: 3 },
    ],
  },

  // =========================================================
  // 5단계: 지혜로운 속담 & 완성된 문장
  // =========================================================
  {
    id: 'han-proverb-taesan-4',
    questionTitle: '지혜로운 속담을 완성해보세요.',
    hintText: '💡 아무리 작은 것도 모이면 매우 커짐 ("티끌 모아 [태산]")',
    fullWord: '태산',
    level: 5,
    tiles: [
      { id: 's-1-1', char: '태', correctIndex: 0 },
      { id: 's-1-2', char: '산', correctIndex: 1 },
    ],
  },
  {
    id: 'han-smile-5',
    questionTitle: '마음이 따뜻해지는 문장을 완성해보세요.',
    hintText: '💡 늘 웃는 얼굴에 좋은 일이 찾아옵니다 [웃으면복이와요]',
    fullWord: '웃으면복이와요',
    level: 5,
    tiles: [
      { id: 's-2-1', char: '웃', correctIndex: 0 },
      { id: 's-2-2', char: '으', correctIndex: 1 },
      { id: 's-2-3', char: '면', correctIndex: 2 },
      { id: 's-2-4', char: '복', correctIndex: 3 },
      { id: 's-2-5', char: '이', correctIndex: 4 },
      { id: 's-2-6', char: '와', correctIndex: 5 },
      { id: 's-2-7', char: '요', correctIndex: 6 },
    ],
  },
];

export function getHangeulScenarioForLevel(level: number, currentScenarioId?: string): HangeulScenario {
  const matching = HANGEUL_SCENARIOS.filter((s) => s.level === level);
  if (matching.length === 0) return HANGEUL_SCENARIOS[0];

  const pool = matching.filter((s) => s.id !== currentScenarioId);
  const targetPool = pool.length > 0 ? pool : matching;

  return targetPool[Math.floor(Math.random() * targetPool.length)];
}
