import type { CardData, DifficultyConfig } from '../types/game';
import { DailyContentManager } from '../utils/dailyContentManager';

// Standard Difficulty Level Configurations
export const DIFFICULTY_CONFIGS: Record<number, DifficultyConfig> = {
  1: { level: 1, pairCount: 2, previewSeconds: 5, similarityLevel: 'distinct' },
  2: { level: 2, pairCount: 3, previewSeconds: 4, similarityLevel: 'distinct' },
  3: { level: 3, pairCount: 5, previewSeconds: 2, similarityLevel: 'medium' },
  4: { level: 4, pairCount: 6, previewSeconds: 1, similarityLevel: 'similar' },
  5: { level: 5, pairCount: 8, previewSeconds: 0, similarityLevel: 'similar' },
};

// Dignified everyday objects with clear icons & respectful Korean labels
export const ALL_CARDS: CardData[] = [
  // Distinct Items (Level 1 & Level 2 pool - Familiar everyday items for adults)
  { id: 'item-apple', pairId: 'apple', emoji: '🍎', label: '사과', category: '과일', similarityGroup: 'distinct' },
  { id: 'item-car', pairId: 'car', emoji: '🚘', label: '승용차', category: '생활용품', similarityGroup: 'distinct' },
  { id: 'item-flower', pairId: 'flower', emoji: '🌸', label: '벚꽃', category: '식물', similarityGroup: 'distinct' },
  { id: 'item-clock', pairId: 'clock', emoji: '⏰', label: '탁상시계', category: '생활용품', similarityGroup: 'distinct' },
  { id: 'item-glasses', pairId: 'glasses', emoji: '👓', label: '안경', category: '생활용품', similarityGroup: 'distinct' },
  { id: 'item-teacup', pairId: 'teacup', emoji: '☕', label: '찻잔', category: '생활용품', similarityGroup: 'distinct' },
  { id: 'item-radio', pairId: 'radio', emoji: '📻', label: '라디오', category: '가전', similarityGroup: 'distinct' },
  { id: 'item-ricebowl', pairId: 'ricebowl', emoji: '🍚', label: '밥그릇', category: '식기', similarityGroup: 'distinct' },

  // Medium Similarity Items (Level 3 pool)
  { id: 'item-strawberry', pairId: 'strawberry', emoji: '🍓', label: '딸기', category: '과일', similarityGroup: 'medium' },
  { id: 'item-cherry', pairId: 'cherry', emoji: '🍒', label: '체리', category: '과일', similarityGroup: 'medium' },
  { id: 'item-bus', pairId: 'bus', emoji: '🚌', label: '시내버스', category: '탈것', similarityGroup: 'medium' },
  { id: 'item-truck', pairId: 'truck', emoji: '🚚', label: '화물트럭', category: '탈것', similarityGroup: 'medium' },
  { id: 'item-pine', pairId: 'pine', emoji: '🌲', label: '소나무', category: '식물', similarityGroup: 'medium' },
  { id: 'item-tree', pairId: 'tree', emoji: '🌳', label: '느티나무', category: '식물', similarityGroup: 'medium' },
  { id: 'item-teapot', pairId: 'teapot', emoji: '🫖', label: '찻주전자', category: '생활용품', similarityGroup: 'medium' },
  { id: 'item-mug', pairId: 'mug', emoji: '🍵', label: '물컵', category: '생활용품', similarityGroup: 'medium' },

  // High Similarity Items (Level 4 & Level 5 pool)
  { id: 'item-tangerine', pairId: 'tangerine', emoji: '🍊', label: '귤', category: '과일', similarityGroup: 'similar' },
  { id: 'item-lemon', pairId: 'lemon', emoji: '🍋', label: '레몬', category: '과일', similarityGroup: 'similar' },
  { id: 'item-greenapple', pairId: 'greenapple', emoji: '🍏', label: '청사과', category: '과일', similarityGroup: 'similar' },
  { id: 'item-pear', pairId: 'pear', emoji: '🍐', label: '배', category: '과일', similarityGroup: 'similar' },
  { id: 'item-bicycle', pairId: 'bicycle', emoji: '🚲', label: '자전거', category: '탈것', similarityGroup: 'similar' },
  { id: 'item-scooter', pairId: 'scooter', emoji: '🛵', label: '오토바이', category: '탈것', similarityGroup: 'similar' },
  { id: 'item-shoes', pairId: 'shoes', emoji: '👞', label: '구두', category: '의류', similarityGroup: 'similar' },
  { id: 'item-boots', pairId: 'boots', emoji: '🥾', label: '등산화', category: '의류', similarityGroup: 'similar' },
  { id: 'item-key', pairId: 'key', emoji: '🔑', label: '열쇠', category: '생활용품', similarityGroup: 'similar' },
  { id: 'item-lock', pairId: 'lock', emoji: '🔒', label: '자물쇠', category: '생활용품', similarityGroup: 'similar' },
  { id: 'item-tv', pairId: 'tv', emoji: '📺', label: '텔레비전', category: '가전', similarityGroup: 'similar' },
  { id: 'item-phone', pairId: 'phone', emoji: '📱', label: '전화기', category: '가전', similarityGroup: 'similar' },
];

/**
 * Get card pairs according to difficulty level.
 * Uses today's approved AI content items (or fallback items if unapproved).
 */
export function getCardsForLevel(level: number): CardData[] {
  const config = DIFFICULTY_CONFIGS[level] || DIFFICULTY_CONFIGS[1];
  const pairCount = config.pairCount;

  // Retrieve today's approved AI items (or fallback)
  const { payload } = DailyContentManager.getTodayApprovedContent();

  let pool: CardData[] = [];
  if (payload && payload.items && payload.items.length > 0) {
    pool = payload.items.map((item) => ({
      id: `ai-${item.id}`,
      pairId: item.id,
      emoji: item.emoji,
      label: item.label,
      category: item.category,
      similarityGroup: level <= 2 ? 'distinct' : level === 3 ? 'medium' : 'similar'
    }));
  }

  // Backup pool if approved items count is less than needed
  if (pool.length < pairCount) {
    pool = ALL_CARDS;
  }

  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  const selectedItems = shuffledPool.slice(0, pairCount);

  const cardList: CardData[] = [];
  selectedItems.forEach((item, index) => {
    cardList.push({
      ...item,
      id: `${item.pairId}-A-${index}`,
    });
    cardList.push({
      ...item,
      id: `${item.pairId}-B-${index}`,
    });
  });

  return cardList.sort(() => Math.random() - 0.5);
}

