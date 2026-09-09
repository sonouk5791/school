import type { EngineState } from '../types/game';

export const INITIAL_ENGINE_STATE = (startingLevel: number): EngineState => ({
  currentLevel: startingLevel,
  consecutiveSuccessCount: 0,
  consecutiveFailureCount: 0,
  recentReactionTimes: [],
});

export interface EvaluateResult {
  nextState: EngineState;
  isSlowResponse: boolean;
  levelChanged: 'up' | 'down' | 'same';
  previousLevel: number;
  newLevel: number;
}

/**
 * Evaluates game round result and updates engine difficulty state according to rules.
 *
 * Rules:
 * - 3 consecutive successes -> level + 1 (unless slow response)
 * - 2 consecutive failures -> level - 1
 * - Reaction time check: If correct, but reaction time >= 2x recent 5-round average, classify as slow response and exclude from level-up stack.
 * - Min 1, Max 5.
 */
export function evaluateRoundResult(
  currentState: EngineState,
  isSuccess: boolean,
  roundReactionTimeMs: number
): EvaluateResult {
  const { currentLevel, consecutiveSuccessCount, consecutiveFailureCount, recentReactionTimes } = currentState;
  const previousLevel = currentLevel;

  // 1. Calculate baseline reaction time from recent history (last 5 rounds)
  let isSlowResponse = false;
  let updatedReactionTimes = [...recentReactionTimes];

  if (isSuccess) {
    if (recentReactionTimes.length >= 2) {
      const avgBaseline = recentReactionTimes.reduce((a, b) => a + b, 0) / recentReactionTimes.length;
      if (roundReactionTimeMs >= 2 * avgBaseline) {
        isSlowResponse = true;
      }
    }
    // Update recent 5 reaction times (only keep up to 5)
    updatedReactionTimes.push(roundReactionTimeMs);
    if (updatedReactionTimes.length > 5) {
      updatedReactionTimes = updatedReactionTimes.slice(-5);
    }
  }

  let nextLevel = currentLevel;
  let newSuccessCount = consecutiveSuccessCount;
  let newFailureCount = consecutiveFailureCount;
  let levelChanged: 'up' | 'down' | 'same' = 'same';

  if (!isSuccess) {
    // Failure or give up
    newSuccessCount = 0; // Reset success stack
    newFailureCount = consecutiveFailureCount + 1;

    if (newFailureCount >= 2) {
      if (currentLevel > 1) {
        nextLevel = currentLevel - 1;
        levelChanged = 'down';
      }
      newFailureCount = 0; // Reset stack after level decrease
    }
  } else {
    // Success
    newFailureCount = 0; // Reset failure stack

    if (isSlowResponse) {
      // Exclude from level up elevation counter
      // Keep existing success count without incrementing
    } else {
      newSuccessCount = consecutiveSuccessCount + 1;

      if (newSuccessCount >= 3) {
        if (currentLevel < 5) {
          nextLevel = currentLevel + 1;
          levelChanged = 'up';
        }
        newSuccessCount = 0; // Reset stack after level increase
      }
    }
  }

  return {
    nextState: {
      currentLevel: nextLevel,
      consecutiveSuccessCount: newSuccessCount,
      consecutiveFailureCount: newFailureCount,
      recentReactionTimes: updatedReactionTimes,
    },
    isSlowResponse,
    levelChanged,
    previousLevel,
    newLevel: nextLevel,
  };
}
