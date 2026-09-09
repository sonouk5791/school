import React, { useState, useEffect, useRef } from 'react';
import type { CardState, EngineState, GameType, SequenceScenario, HangeulScenario } from './types/game';
import { getCardsForLevel, DIFFICULTY_CONFIGS } from './constants/cardData';
import { getSequenceScenarioForLevel } from './constants/sequenceData';
import { getHangeulScenarioForLevel } from './constants/hangeulData';
import { evaluateRoundResult, INITIAL_ENGINE_STATE } from './utils/difficultyEngine';
import { getInitialSessionLevel, saveRoundLog } from './utils/logger';
import { soundManager } from './utils/soundEffect';

import { Header, type NavTab } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { CognitiveTrainingHub } from './components/CognitiveTrainingHub';
import { TodaysLearningView } from './components/TodaysLearningView';
import { DigitalLearningView } from './components/DigitalLearningView';
import { LearningRecordsView } from './components/LearningRecordsView';

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
  // Navigation Tabs: 'home' | 'today' | 'cognitive' | 'digital' | 'records'
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Active cognitive game mode (null when browsing tabs)
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

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
    soundManager.playFlip();
    setRoundNumber(1);
    setActiveGame(gameType);

    if (gameType === 'card-match') {
      startCardMatchRound();
    } else if (gameType === 'sequence') {
      startSequenceRound();
    } else if (gameType === 'hangeul') {
      startHangeulRound();
    }
  };

  const handleExitGame = () => {
    soundManager.playFlip();
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setActiveGame(null);
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
        setGentleNotice('정답입니다! 👏');

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

    if (activeGame === 'card-match') {
      startCardMatchRound();
    } else if (activeGame === 'sequence') {
      startSequenceRound();
    } else if (activeGame === 'hangeul') {
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

    if (activeGame === 'card-match') {
      startCardMatchRound(level);
    } else if (activeGame === 'sequence') {
      startSequenceRound(level);
    } else if (activeGame === 'hangeul') {
      startHangeulRound(level);
    }
  };

  const handleDevResetEngine = () => {
    const initState = INITIAL_ENGINE_STATE(1);
    engineStateRef.current = initState;
    setEngineState(initState);

    if (activeGame === 'card-match') {
      startCardMatchRound(1);
    } else if (activeGame === 'sequence') {
      startSequenceRound(1);
    } else if (activeGame === 'hangeul') {
      startHangeulRound(1);
    }
  };

  const currentConfig = DIFFICULTY_CONFIGS[engineState.currentLevel] || DIFFICULTY_CONFIGS[1];
  const matchedPairsCount = cards.filter((c) => c.isMatched).length / 2;

  const gameTitles: Record<GameType, string> = {
    'card-match': '🧩 같은 그림 찾기',
    'sequence': '🔢 일상 순서 배열하기',
    'hangeul': '🔤 한글 낱말 맞추기',
    'storybook': '📖 책을 읽어주는 방',
    'video-gallery': '🎥 추억 영상 앨범관',
    'childhood': '🧒 나의 어린 시절',
  };

  return (
    <div className="app-root">
      {/* Global Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          soundManager.playFlip();
          setCurrentTab(tab);
        }}
        activeGame={activeGame}
        onExitGame={handleExitGame}
        onOpenDevModal={() => setIsDevModalOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        gameTitle={activeGame ? gameTitles[activeGame] : undefined}
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        {activeGame ? (
          /* Active Cognitive Activity View */
          <div className="active-activity-container anim-pop">
            {activeGame !== 'storybook' && activeGame !== 'video-gallery' && activeGame !== 'childhood' && (
              <div className="game-info-bar">
                <span className="info-round">활동 #{roundNumber}</span>

                {activeGame === 'card-match' && (
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

            {activeGame === 'card-match' && (
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

            {activeGame === 'sequence' && currentSequenceScenario && (
              <SequenceGame
                key={`seq-round-${roundNumber}-${currentSequenceScenario.id}`}
                scenario={currentSequenceScenario}
                onCompleteRound={handleSequenceComplete}
              />
            )}

            {activeGame === 'hangeul' && currentHangeulScenario && (
              <HangeulGame
                key={`han-round-${roundNumber}-${currentHangeulScenario.id}`}
                scenario={currentHangeulScenario}
                onCompleteRound={handleHangeulComplete}
              />
            )}

            {activeGame === 'storybook' && (
              <StorybookGallery onCompleteRound={handleStorybookComplete} />
            )}

            {activeGame === 'video-gallery' && (
              <VideoGallery onCompleteRound={handleVideoComplete} />
            )}

            {activeGame === 'childhood' && (
              <ChildhoodMemoryGame />
            )}
          </div>
        ) : (
          /* Main Platform Tab Views */
          <>
            {currentTab === 'home' && (
              <HomeScreen
                onNavigateTab={(tab) => {
                  soundManager.playFlip();
                  setCurrentTab(tab);
                }}
                onOpenGuide={() => setIsGuideOpen(true)}
                onOpenCaregiver={() => setIsDevModalOpen(true)}
              />
            )}

            {currentTab === 'today' && (
              <TodaysLearningView
                onStartActivity={handleSelectGame}
              />
            )}

            {currentTab === 'cognitive' && (
              <CognitiveTrainingHub
                onSelectGame={handleSelectGame}
                currentLevel={engineState.currentLevel}
              />
            )}

            {currentTab === 'digital' && (
              <DigitalLearningView
                onNavigateTab={(tab) => {
                  soundManager.playFlip();
                  setCurrentTab(tab);
                }}
              />
            )}

            {currentTab === 'records' && (
              <LearningRecordsView
                onOpenCaregiverModal={() => setIsDevModalOpen(true)}
                onNavigateTab={(tab) => {
                  soundManager.playFlip();
                  setCurrentTab(tab);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onNextGame={handleNextGame}
        onGoHome={handleExitGame}
        matchCount={
          activeGame === 'card-match'
            ? currentConfig.pairCount
            : activeGame === 'sequence'
            ? currentSequenceScenario?.steps.length || 0
            : activeGame === 'hangeul'
            ? currentHangeulScenario?.tiles.length || 0
            : 1
        }
        gameType={activeGame || 'card-match'}
      />

      {/* Senior Easy Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Caregiver Settings & Dashboard Modal */}
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
          background: linear-gradient(180deg, #FAF8F5 0%, #F5FDF8 100%);
        }

        .app-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .active-activity-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 20px 16px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .game-info-bar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          margin-bottom: 12px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .info-round {
          font-size: 22px;
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
          font-size: 22px;
          font-weight: 800;
          padding: 8px 24px;
          border-radius: 18px;
        }

        .progress-badge {
          font-size: 22px;
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
