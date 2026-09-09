import React, { useState, useEffect, useRef } from 'react';
import type { CardState, EngineState, GameType, SequenceScenario, HangeulScenario } from './types/game';
import { getCardsForLevel, DIFFICULTY_CONFIGS } from './constants/cardData';
import { getSequenceScenarioForLevel } from './constants/sequenceData';
import { getHangeulScenarioForLevel } from './constants/hangeulData';
import { evaluateRoundResult, INITIAL_ENGINE_STATE } from './utils/difficultyEngine';
import { getInitialSessionLevel, saveRoundLog } from './utils/logger';
import { soundManager } from './utils/soundEffect';

import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CardGrid } from './components/CardGrid';
import { SequenceGame } from './components/SequenceGame';
import { HangeulGame } from './components/HangeulGame';
import { StorybookGallery } from './components/StorybookGallery';
import { VideoGallery } from './components/VideoGallery';
import { ChildhoodMemoryGame } from './components/ChildhoodMemoryGame';
import { CompletionModal } from './components/CompletionModal';
import { DevDashboardModal } from './components/DevDashboardModal';
import { UserGuideModal } from './components/UserGuideModal';

export const App: React.FC = () => {
  // Navigation screen: 'welcome' | 'card-match' | 'sequence' | 'hangeul' | 'storybook' | 'video-gallery' | 'childhood'
  const [screen, setScreen] = useState<'welcome' | 'card-match' | 'sequence' | 'hangeul' | 'storybook' | 'video-gallery' | 'childhood'>('welcome');

  // Engine state & level management
  const [engineState, setEngineState] = useState<EngineState>(() =>
    INITIAL_ENGINE_STATE(getInitialSessionLevel())
  );
  const engineStateRef = useRef<EngineState>(engineState);

  useEffect(() => {
    engineStateRef.current = engineState;
  }, [engineState]);

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.isMuted());

  // Dev modal state
  const [isDevModalOpen, setIsDevModalOpen] = useState<boolean>(false);

  // User guide modal state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Round Game state (Card Match)
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardState[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [previewSecondsLeft, setPreviewSecondsLeft] = useState<number>(0);

  // Sequence Game State
  const [currentSequenceScenario, setCurrentSequenceScenario] = useState<SequenceScenario | null>(null);

  // Hangeul Game State
  const [currentHangeulScenario, setCurrentHangeulScenario] = useState<HangeulScenario | null>(null);

  // Gentle adult notice banner
  const [gentleNotice, setGentleNotice] = useState<string | null>(null);

  // Completion modal state
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState<boolean>(false);

  // Performance trackers
  const roundStartTimeRef = useRef<number>(0);
  const turnStartTimeRef = useRef<number>(0);
  const matchReactionTimesRef = useRef<number[]>([]);
  const attemptCountRef = useRef<number>(0);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const initLevel = getInitialSessionLevel();
    const initState = INITIAL_ENGINE_STATE(initLevel);
    setEngineState(initState);
    engineStateRef.current = initState;
  }, []);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Start Card Match round
  const startCardMatchRound = (overrideLevel?: number) => {
    const currentLevel = overrideLevel ?? engineStateRef.current.currentLevel;
    const config = DIFFICULTY_CONFIGS[currentLevel] || DIFFICULTY_CONFIGS[1];

    const rawCards = getCardsForLevel(currentLevel);

    attemptCountRef.current = 0;
    matchReactionTimesRef.current = [];
    roundStartTimeRef.current = performance.now();
    turnStartTimeRef.current = performance.now();

    setFlippedCards([]);
    setIsProcessing(false);
    setGentleNotice(null);
    setIsCompletionModalOpen(false);

    if (config.previewSeconds > 0) {
      setIsPreviewing(true);
      setPreviewSecondsLeft(config.previewSeconds);

      setCards(
        rawCards.map((c) => ({
          ...c,
          isFlipped: true,
          isMatched: false,
        }))
      );

      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = setInterval(() => {
        setPreviewSecondsLeft((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
      previewTimerRef.current = setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((c) => ({
            ...c,
            isFlipped: false,
          }))
        );
        setIsPreviewing(false);
        turnStartTimeRef.current = performance.now();
      }, config.previewSeconds * 1000);
    } else {
      setIsPreviewing(false);
      setCards(
        rawCards.map((c) => ({
          ...c,
          isFlipped: false,
          isMatched: false,
        }))
      );
      turnStartTimeRef.current = performance.now();
    }
  };

  // Start Sequence round
  const startSequenceRound = (overrideLevel?: number) => {
    const currentLevel = overrideLevel ?? engineStateRef.current.currentLevel;
    const scenario = getSequenceScenarioForLevel(currentLevel, currentSequenceScenario?.id);

    setCurrentSequenceScenario(scenario);
    setIsCompletionModalOpen(false);
    setGentleNotice(null);
    roundStartTimeRef.current = performance.now();
  };

  // Start Hangeul round
  const startHangeulRound = (overrideLevel?: number) => {
    const currentLevel = overrideLevel ?? engineStateRef.current.currentLevel;
    const scenario = getHangeulScenarioForLevel(currentLevel, currentHangeulScenario?.id);

    setCurrentHangeulScenario(scenario);
    setIsCompletionModalOpen(false);
    setGentleNotice(null);
    roundStartTimeRef.current = performance.now();
  };

  // Handle Game Selection
  const handleSelectGame = (gameType: GameType) => {
    setRoundNumber(1);
    setScreen(gameType);
    if (gameType === 'card-match') {
      startCardMatchRound();
    } else if (gameType === 'sequence') {
      startSequenceRound();
    } else if (gameType === 'hangeul') {
      startHangeulRound();
    }
  };

  const handleExitGame = () => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setScreen('welcome');
    setIsCompletionModalOpen(false);
  };

  // Card Match flip click handler
  const handleCardClick = (clickedCard: CardState) => {
    if (isPreviewing || isProcessing || clickedCard.isFlipped || clickedCard.isMatched) return;

    soundManager.playFlip();

    const updatedCards = cards.map((c) => (c.id === clickedCard.id ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 1) {
      turnStartTimeRef.current = performance.now();
      return;
    }

    if (newFlipped.length === 2) {
      attemptCountRef.current += 1;
      setIsProcessing(true);

      const [card1, card2] = newFlipped;

      if (card1.pairId === card2.pairId) {
        const pairReactionTime = performance.now() - turnStartTimeRef.current;
        matchReactionTimesRef.current.push(pairReactionTime);

        soundManager.playMatch();
        setGentleNotice('정답입니다.');

        const matchedCards = updatedCards.map((c) =>
          c.pairId === card1.pairId ? { ...c, isMatched: true } : c
        );
        setCards(matchedCards);
        setFlippedCards([]);
        setIsProcessing(false);

        const allMatched = matchedCards.every((c) => c.isMatched);
        if (allMatched) {
          handleCardMatchComplete();
        } else {
          setTimeout(() => setGentleNotice(null), 1200);
        }
      } else {
        soundManager.playMismatch();
        setGentleNotice('괜찮습니다. 천천히 다시 확인해 보세요.');

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
          setGentleNotice(null);
        }, 1200);
      }
    }
  };

  const handleCardMatchComplete = () => {
    const totalTimeMs = Math.round(performance.now() - roundStartTimeRef.current);
    const avgReactionTimeMs =
      matchReactionTimesRef.current.length > 0
        ? Math.round(
            matchReactionTimesRef.current.reduce((a, b) => a + b, 0) /
              matchReactionTimesRef.current.length
          )
        : totalTimeMs;

    const evaluation = evaluateRoundResult(engineStateRef.current, true, avgReactionTimeMs);

    saveRoundLog({
      gameType: 'card-match',
      roundNumber,
      difficultyLevel: engineStateRef.current.currentLevel,
      isSuccess: true,
      reactionTimeMs: avgReactionTimeMs,
      totalTimeMs,
      attemptCount: attemptCountRef.current,
      isSlowResponse: evaluation.isSlowResponse,
      consecutiveSuccessCount: evaluation.nextState.consecutiveSuccessCount,
      consecutiveFailureCount: evaluation.nextState.consecutiveFailureCount,
    });

    engineStateRef.current = evaluation.nextState;
    setEngineState(evaluation.nextState);
    setIsCompletionModalOpen(true);
  };

  const handleSequenceComplete = (isSuccess: boolean, reactionTimeMs: number) => {
    const totalTimeMs = Math.round(performance.now() - roundStartTimeRef.current);
    const evaluation = evaluateRoundResult(engineStateRef.current, isSuccess, reactionTimeMs);

    saveRoundLog({
      gameType: 'sequence',
      roundNumber,
      difficultyLevel: engineStateRef.current.currentLevel,
      isSuccess,
      reactionTimeMs,
      totalTimeMs,
      attemptCount: 1,
      isSlowResponse: evaluation.isSlowResponse,
      consecutiveSuccessCount: evaluation.nextState.consecutiveSuccessCount,
      consecutiveFailureCount: evaluation.nextState.consecutiveFailureCount,
    });

    engineStateRef.current = evaluation.nextState;
    setEngineState(evaluation.nextState);
    setIsCompletionModalOpen(true);
  };

  const handleHangeulComplete = (isSuccess: boolean, reactionTimeMs: number) => {
    const totalTimeMs = Math.round(performance.now() - roundStartTimeRef.current);
    const evaluation = evaluateRoundResult(engineStateRef.current, isSuccess, reactionTimeMs);

    saveRoundLog({
      gameType: 'hangeul',
      roundNumber,
      difficultyLevel: engineStateRef.current.currentLevel,
      isSuccess,
      reactionTimeMs,
      totalTimeMs,
      attemptCount: 1,
      isSlowResponse: evaluation.isSlowResponse,
      consecutiveSuccessCount: evaluation.nextState.consecutiveSuccessCount,
      consecutiveFailureCount: evaluation.nextState.consecutiveFailureCount,
    });

    engineStateRef.current = evaluation.nextState;
    setEngineState(evaluation.nextState);
    setIsCompletionModalOpen(true);
  };

  const handleStorybookComplete = (isSuccess: boolean, reactionTimeMs: number) => {
    saveRoundLog({
      gameType: 'storybook',
      roundNumber,
      difficultyLevel: engineStateRef.current.currentLevel,
      isSuccess,
      reactionTimeMs,
      totalTimeMs: reactionTimeMs,
      attemptCount: 1,
      isSlowResponse: false,
      consecutiveSuccessCount: engineStateRef.current.consecutiveSuccessCount + 1,
      consecutiveFailureCount: 0,
    });

    setIsCompletionModalOpen(true);
  };

  const handleVideoComplete = (isSuccess: boolean, reactionTimeMs: number) => {
    saveRoundLog({
      gameType: 'video-gallery',
      roundNumber,
      difficultyLevel: engineStateRef.current.currentLevel,
      isSuccess,
      reactionTimeMs,
      totalTimeMs: reactionTimeMs,
      attemptCount: 1,
      isSlowResponse: false,
      consecutiveSuccessCount: engineStateRef.current.consecutiveSuccessCount + 1,
      consecutiveFailureCount: 0,
    });

    setIsCompletionModalOpen(true);
  };

  const handleNextGame = () => {
    setIsCompletionModalOpen(false);
    const nextRound = roundNumber + 1;
    setRoundNumber(nextRound);

    if (screen === 'card-match') {
      startCardMatchRound();
    } else if (screen === 'sequence') {
      startSequenceRound();
    } else if (screen === 'hangeul') {
      startHangeulRound();
    }
  };

  const handleDevSetLevel = (level: number) => {
    const newState = {
      ...engineStateRef.current,
      currentLevel: level,
      consecutiveSuccessCount: 0,
      consecutiveFailureCount: 0,
    };
    engineStateRef.current = newState;
    setEngineState(newState);

    if (screen === 'card-match') {
      startCardMatchRound(level);
    } else if (screen === 'sequence') {
      startSequenceRound(level);
    } else if (screen === 'hangeul') {
      startHangeulRound(level);
    }
  };

  const handleDevResetEngine = () => {
    const initState = INITIAL_ENGINE_STATE(1);
    engineStateRef.current = initState;
    setEngineState(initState);

    if (screen === 'card-match') {
      startCardMatchRound(1);
    } else if (screen === 'sequence') {
      startSequenceRound(1);
    } else if (screen === 'hangeul') {
      startHangeulRound(1);
    }
  };

  const currentConfig = DIFFICULTY_CONFIGS[engineState.currentLevel] || DIFFICULTY_CONFIGS[1];
  const matchedPairsCount = cards.filter((c) => c.isMatched).length / 2;

  const headerTitle =
    screen === 'card-match'
      ? '🧩 그림 카드 맞추기'
      : screen === 'sequence'
      ? '🔢 일상 순서 배열하기'
      : screen === 'hangeul'
      ? '🔤 한글 낱말 맞추기'
      : screen === 'storybook'
      ? '📖 책을 읽어주는 방'
      : screen === 'video-gallery'
      ? '🎥 추억 영상 앨범관'
      : '🧒 나의 어린 시절';

  return (
    <div className="app-root">
      {screen === 'welcome' ? (
        <WelcomeScreen
          onSelectGame={handleSelectGame}
          onOpenDevModal={() => setIsDevModalOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          currentLevel={engineState.currentLevel}
          onSetLevel={handleDevSetLevel}
        />
      ) : (
        <div className="game-screen">
          <Header
            onExit={handleExitGame}
            onOpenDevModal={() => setIsDevModalOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            isMuted={isMuted}
            onToggleSound={toggleSound}
            title={headerTitle}
          />

          <main className="game-main">
            {screen !== 'storybook' && screen !== 'video-gallery' && screen !== 'childhood' && (
              <div className="game-info-bar">
                <span className="info-round">활동 #{roundNumber}</span>

                {screen === 'card-match' && (
                  <>
                    {isPreviewing ? (
                      <div className="preview-badge anim-pop">
                        🔍 그림의 위치를 천천히 기억해 보세요 ({previewSecondsLeft}초)
                      </div>
                    ) : (
                      <div className="progress-badge">
                        완료한 그림: {matchedPairsCount} / {currentConfig.pairCount} 쌍
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {screen === 'card-match' && (
              <>
                {gentleNotice && (
                  <div className="gentle-banner anim-pop" role="status">
                    {gentleNotice}
                  </div>
                )}
                <CardGrid
                  key={`grid-round-${roundNumber}`}
                  cards={cards}
                  onCardClick={handleCardClick}
                  disabled={isPreviewing || isProcessing}
                />
              </>
            )}

            {screen === 'sequence' && currentSequenceScenario && (
              <SequenceGame
                key={`seq-round-${roundNumber}-${currentSequenceScenario.id}`}
                scenario={currentSequenceScenario}
                onCompleteRound={handleSequenceComplete}
              />
            )}

            {screen === 'hangeul' && currentHangeulScenario && (
              <HangeulGame
                key={`han-round-${roundNumber}-${currentHangeulScenario.id}`}
                scenario={currentHangeulScenario}
                onCompleteRound={handleHangeulComplete}
              />
            )}

            {screen === 'storybook' && (
              <StorybookGallery onCompleteRound={handleStorybookComplete} />
            )}

            {screen === 'video-gallery' && (
              <VideoGallery onCompleteRound={handleVideoComplete} />
            )}

            {screen === 'childhood' && (
              <ChildhoodMemoryGame />
            )}
          </main>
        </div>
      )}

      <CompletionModal
        isOpen={isCompletionModalOpen}
        onNextGame={handleNextGame}
        onGoHome={handleExitGame}
        matchCount={
          screen === 'card-match'
            ? currentConfig.pairCount
            : screen === 'sequence'
            ? currentSequenceScenario?.steps.length || 0
            : screen === 'hangeul'
            ? currentHangeulScenario?.tiles.length || 0
            : 1
        }
        gameType={screen === 'welcome' ? 'card-match' : screen}
      />

      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <DevDashboardModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
        engineState={engineState}
        onSetLevel={handleDevSetLevel}
        onResetEngine={handleDevResetEngine}
      />

      <style>{`
        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .game-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #FAF8F5 0%, #F0FDF4 100%);
        }

        .game-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .game-info-bar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          margin-bottom: 12px;
        }

        .info-round {
          font-size: 24px;
          font-weight: 800;
          color: #334155;
          background-color: #FFFFFF;
          border: 2px solid #CBD5E1;
          border-radius: 14px;
          padding: 6px 18px;
        }

        .preview-badge {
          background-color: #FEF3C7;
          border: 2px solid #F59E0B;
          color: #92400E;
          font-size: 23px;
          font-weight: 800;
          padding: 8px 24px;
          border-radius: 18px;
        }

        .progress-badge {
          font-size: 24px;
          font-weight: 800;
          color: #0F766E;
          background-color: #CCFBF1;
          border: 2px solid #5EEAD4;
          border-radius: 14px;
          padding: 6px 20px;
        }

        .gentle-banner {
          background-color: #FFFBEB;
          border: 3px solid #F59E0B;
          color: #B45309;
          font-size: 24px;
          font-weight: 800;
          padding: 10px 28px;
          border-radius: 20px;
          margin-bottom: 14px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default App;
