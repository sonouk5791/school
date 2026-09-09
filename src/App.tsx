import React, { useState, useEffect, useRef } from 'react';
import type { EngineState, GameType, SequenceScenario, HangeulScenario } from './types/game';
import { DIFFICULTY_CONFIGS } from './constants/cardData';
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

import { CardMatchGame } from './components/CardMatchGame';
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

  // Round Game state (Sequence / Hangeul)
  const [roundNumber, setRoundNumber] = useState<number>(1);

  // Sequence Game State
  const [currentSequenceScenario, setCurrentSequenceScenario] = useState<SequenceScenario | null>(null);

  // Hangeul Game State
  const [currentHangeulScenario, setCurrentHangeulScenario] = useState<HangeulScenario | null>(null);

  // Completion modal state
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState<boolean>(false);

  // Performance trackers
  const roundStartTimeRef = useRef<number>(0);

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

  // Start Sequence round
  const startSequenceRound = (overrideLevel?: number) => {
    const currentLevel = overrideLevel ?? engineStateRef.current.currentLevel;
    const scenario = getSequenceScenarioForLevel(currentLevel, currentSequenceScenario?.id);

    setCurrentSequenceScenario(scenario);
    setIsCompletionModalOpen(false);
    roundStartTimeRef.current = performance.now();
  };

  // Start Hangeul round
  const startHangeulRound = (overrideLevel?: number) => {
    const currentLevel = overrideLevel ?? engineStateRef.current.currentLevel;
    const scenario = getHangeulScenarioForLevel(currentLevel, currentHangeulScenario?.id);

    setCurrentHangeulScenario(scenario);
    setIsCompletionModalOpen(false);
    roundStartTimeRef.current = performance.now();
  };

  // Handle Game Selection
  const handleSelectGame = (gameType: GameType) => {
    soundManager.playFlip();
    setRoundNumber(1);
    setActiveGame(gameType);

    if (gameType === 'card-match') {
      // CardMatchGame handles its own lifecycle
    } else if (gameType === 'sequence') {
      startSequenceRound();
    } else if (gameType === 'hangeul') {
      startHangeulRound();
    }
  };

  const handleExitGame = () => {
    soundManager.playFlip();
    setActiveGame(null);
    setIsCompletionModalOpen(false);
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

    if (activeGame === 'sequence') {
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

    if (activeGame === 'sequence') {
      startSequenceRound(level);
    } else if (activeGame === 'hangeul') {
      startHangeulRound(level);
    }
  };

  const handleDevResetEngine = () => {
    const initState = INITIAL_ENGINE_STATE(1);
    engineStateRef.current = initState;
    setEngineState(initState);

    if (activeGame === 'sequence') {
      startSequenceRound(1);
    } else if (activeGame === 'hangeul') {
      startHangeulRound(1);
    }
  };

  const currentConfig = DIFFICULTY_CONFIGS[engineState.currentLevel] || DIFFICULTY_CONFIGS[1];

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
            {activeGame === 'card-match' && (
              <CardMatchGame onGoBackToHub={handleExitGame} />
            )}

            {activeGame !== 'card-match' && activeGame !== 'storybook' && activeGame !== 'video-gallery' && activeGame !== 'childhood' && (
              <div className="game-info-bar">
                <span className="info-round">활동 #{roundNumber}</span>
              </div>
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
