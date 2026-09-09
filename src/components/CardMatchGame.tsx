import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  LayoutGrid,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import type { CardState } from '../types/game';
import {
  DIFFICULTY_SETTINGS,
  type DifficultyKey,
  getCardsForPairCount,
} from '../constants/cardData';
import { CardGrid } from './CardGrid';
import { soundManager } from '../utils/soundEffect';

interface CardMatchGameProps {
  onGoBackToHub: () => void;
}

type GamePhase = 'intro' | 'playing' | 'completed';

export const CardMatchGame: React.FC<CardMatchGameProps> = ({ onGoBackToHub }) => {
  // Phase: intro -> playing -> completed
  const [phase, setPhase] = useState<GamePhase>('intro');

  // Selected Difficulty (default: 'easy')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyKey>('easy');

  // Game state
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardState[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [positiveNotice, setPositiveNotice] = useState<string | null>(null);

  // Timer ref
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Format seconds into MM:SS or Korean friendly format
  const formatTimeMinutesSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    if (mins === 0) return `${secs}초`;
    return `${mins}분 ${secs}초`;
  };

  const formatTimerDigital = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Start the game with specified difficulty
  const startGame = (diffKey: DifficultyKey = selectedDifficulty) => {
    soundManager.playFlip();
    const config = DIFFICULTY_SETTINGS[diffKey];
    const rawCards = getCardsForPairCount(config.pairCount);

    setCards(
      rawCards.map((c) => ({
        ...c,
        isFlipped: false,
        isMatched: false,
      }))
    );
    setFlippedCards([]);
    setIsProcessing(false);
    setAttempts(0);
    setElapsedSeconds(0);
    setPositiveNotice(null);
    setPhase('playing');

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Card click handler
  const handleCardClick = (clickedCard: CardState) => {
    if (isProcessing || clickedCard.isFlipped || clickedCard.isMatched) return;

    soundManager.playFlip();

    const updatedCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 1) {
      return;
    }

    if (newFlipped.length === 2) {
      setAttempts((prev) => prev + 1);
      setIsProcessing(true);

      const [card1, card2] = newFlipped;

      if (card1.pairId === card2.pairId) {
        // Matched!
        soundManager.playMatch();
        setPositiveNotice('잘 찾으셨어요! 👏');

        const matchedCards = updatedCards.map((c) =>
          c.pairId === card1.pairId ? { ...c, isMatched: true } : c
        );
        setCards(matchedCards);
        setFlippedCards([]);
        setIsProcessing(false);

        const allMatched = matchedCards.every((c) => c.isMatched);
        if (allMatched) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setTimeout(() => {
            setPhase('completed');
          }, 800);
        } else {
          setTimeout(() => setPositiveNotice(null), 1200);
        }
      } else {
        // Mismatch: warm senior-friendly encouragement (Never "틀렸습니다")
        soundManager.playMismatch();
        setPositiveNotice('한 번 더 찾아볼까요? 😊');

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
          setPositiveNotice(null);
        }, 1100);
      }
    }
  };

  const currentPairCount = DIFFICULTY_SETTINGS[selectedDifficulty].pairCount;
  const matchedPairsCount = cards.filter((c) => c.isMatched).length / 2;

  return (
    <div className="card-match-wrapper anim-pop">
      {/* 1. Breadcrumb Step Indicator */}
      <nav className="game-breadcrumb" aria-label="현재 위치">
        <span className="crumb-item" onClick={onGoBackToHub}>
          홈
        </span>
        <ChevronRight size={18} className="crumb-arrow" />
        <span className="crumb-item" onClick={onGoBackToHub}>
          인지훈련
        </span>
        <ChevronRight size={18} className="crumb-arrow" />
        <span className="crumb-current">같은 그림 찾기</span>
      </nav>

      {/* ========================================================= */}
      {/* PHASE 1: GAME INTRO & DIFFICULTY SELECTOR                 */}
      {/* ========================================================= */}
      {phase === 'intro' && (
        <div className="intro-container anim-pop">
          {/* Header Card */}
          <div className="intro-header-card">
            <div className="intro-icon-box">🧩</div>
            <h1 className="intro-title">같은 그림 찾기</h1>
            <p className="intro-desc">
              뒤집힌 카드의 위치를 기억해서 같은 그림끼리 짝을 맞춰보세요.
            </p>
          </div>

          {/* 3-Step Simple How to Play */}
          <div className="how-to-card">
            <div className="how-to-header">
              <HelpCircle size={24} color="#047857" />
              <span className="how-to-title">게임 방법</span>
            </div>
            <div className="how-to-steps">
              <div className="step-item">
                <div className="step-num-badge">1</div>
                <div className="step-item-text">
                  카드를 눌러 그림을 확인합니다.
                </div>
              </div>
              <div className="step-item">
                <div className="step-num-badge">2</div>
                <div className="step-item-text">
                  같은 그림의 카드를 찾아봅니다.
                </div>
              </div>
              <div className="step-item">
                <div className="step-num-badge">3</div>
                <div className="step-item-text">
                  모든 카드의 짝을 맞추면 성공입니다.
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="difficulty-section">
            <h2 className="difficulty-section-title">
              <Sliders size={24} color="#0F766E" />
              <span>난이도를 선택해주세요</span>
            </h2>

            <div className="difficulty-cards-grid">
              {(Object.keys(DIFFICULTY_SETTINGS) as DifficultyKey[]).map((key) => {
                const setting = DIFFICULTY_SETTINGS[key];
                const isSelected = selectedDifficulty === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setSelectedDifficulty(key);
                    }}
                    className={`diff-choice-btn ${isSelected ? 'selected' : ''}`}
                    aria-pressed={isSelected}
                    aria-label={`난이도 ${setting.label}, ${setting.subLabel}`}
                  >
                    <div className="diff-header-row">
                      <span className="diff-label">{setting.label}</span>
                      {isSelected ? (
                        <CheckCircle2 size={28} color="#059669" className="check-icon" />
                      ) : (
                        <div className="diff-radio-circle" />
                      )}
                    </div>
                    <span className="diff-sub">{setting.subLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Big Start Button (>=60px) */}
          <button
            type="button"
            onClick={() => startGame(selectedDifficulty)}
            className="big-start-game-btn senior-btn"
            aria-label="같은 그림 찾기 게임 시작하기"
          >
            <Play size={32} fill="currentColor" />
            <span>▶ 게임 시작하기</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 2: ACTIVE GAME PLAY HUD & GRID                      */}
      {/* ========================================================= */}
      {phase === 'playing' && (
        <div className="playing-container anim-pop">
          {/* Top In-Game HUD Bar */}
          <div className="game-hud-bar">
            {/* Title & Difficulty Badge */}
            <div className="hud-title-box">
              <span className="hud-game-name">🧩 같은 그림 찾기</span>
              <span className="hud-diff-badge">
                난이도: {DIFFICULTY_SETTINGS[selectedDifficulty].label}
              </span>
            </div>

            {/* Core Stats: Matched Cards is Prominently Highlighted */}
            <div className="hud-stats-group">
              <div className="hud-stat-item highlight-matched">
                <span className="stat-label">맞춘 카드</span>
                <span className="stat-value-big">
                  {matchedPairsCount} <span className="stat-divider">/</span> {currentPairCount} 쌍
                </span>
              </div>

              <div className="hud-stat-item">
                <span className="stat-label">시도 횟수</span>
                <span className="stat-value">{attempts}회</span>
              </div>

              <div className="hud-stat-item">
                <span className="stat-label">시간</span>
                <span className="stat-value font-mono">
                  {formatTimerDigital(elapsedSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Warm Senior-Friendly Positive Notice */}
          {positiveNotice && (
            <div className="positive-feedback-banner anim-pop" role="status">
              <Sparkles size={24} />
              <span>{positiveNotice}</span>
            </div>
          )}

          {/* Card Grid */}
          <div className="game-grid-area">
            <CardGrid
              cards={cards}
              onCardClick={handleCardClick}
              disabled={isProcessing}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 3: GAME COMPLETED RESULT SCREEN                     */}
      {/* ========================================================= */}
      {phase === 'completed' && (
        <div className="result-container anim-pop">
          <div className="result-card">
            <div className="result-trophy-icon">🎉</div>
            <h1 className="result-title">잘하셨어요!</h1>
            <p className="result-desc">오늘의 인지훈련을 완료했습니다.</p>

            {/* Results Breakdown */}
            <div className="result-stats-table">
              <div className="result-row">
                <span className="row-label">
                  <Award size={22} color="#0F766E" />
                  <span>난이도</span>
                </span>
                <span className="row-value badge-diff">
                  {DIFFICULTY_SETTINGS[selectedDifficulty].label}
                </span>
              </div>

              <div className="result-row highlight-row">
                <span className="row-label">
                  <CheckCircle2 size={22} color="#059669" />
                  <span>맞춘 카드</span>
                </span>
                <span className="row-value font-bold">
                  {currentPairCount} / {currentPairCount} 쌍
                </span>
              </div>

              <div className="result-row">
                <span className="row-label">
                  <RotateCcw size={22} color="#0284C7" />
                  <span>시도 횟수</span>
                </span>
                <span className="row-value">{attempts}회</span>
              </div>

              <div className="result-row">
                <span className="row-label">
                  <Clock size={22} color="#D97706" />
                  <span>걸린 시간</span>
                </span>
                <span className="row-value">
                  {formatTimeMinutesSeconds(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* 3 Big Action Buttons */}
            <div className="result-actions-group">
              <button
                type="button"
                onClick={() => startGame(selectedDifficulty)}
                className="result-btn senior-btn-restart"
                aria-label="현재 난이도로 게임 한 번 더 하기"
              >
                <RotateCcw size={26} />
                <span>한 번 더 하기</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playFlip();
                  setPhase('intro');
                }}
                className="result-btn senior-btn-difficulty"
                aria-label="다른 난이도 선택 화면으로 이동"
              >
                <Sliders size={26} />
                <span>다른 난이도 선택</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playFlip();
                  onGoBackToHub();
                }}
                className="result-btn senior-btn-hub"
                aria-label="인지훈련 메인 화면으로 돌아가기"
              >
                <LayoutGrid size={26} />
                <span>다른 활동 보기</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .card-match-wrapper {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding: 16px 16px 60px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Breadcrumb */
        .game-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
          color: #64748B;
          padding: 8px 4px;
        }

        .crumb-item {
          cursor: pointer;
          color: #0F766E;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .crumb-item:hover {
          color: #065F46;
        }

        .crumb-arrow {
          color: #94A3B8;
        }

        .crumb-current {
          color: #0F172A;
          font-weight: 900;
        }

        /* ----------------------------------------------------- */
        /* INTRO PHASE STYLES                                   */
        /* ----------------------------------------------------- */
        .intro-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .intro-header-card {
          background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);
          border: 3px solid #86EFAC;
          border-radius: 28px;
          padding: 32px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          box-shadow: 0 8px 20px rgba(15, 118, 110, 0.06);
        }

        .intro-icon-box {
          font-size: 56px;
          line-height: 1;
        }

        .intro-title {
          font-size: clamp(32px, 4vw, 42px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .intro-desc {
          font-size: clamp(19px, 2.5vw, 22px);
          font-weight: 700;
          color: #334155;
          margin: 0;
          line-height: 1.5;
        }

        /* How to play card */
        .how-to-card {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 24px;
          padding: 24px 28px;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
        }

        .how-to-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .how-to-title {
          font-size: 22px;
          font-weight: 900;
          color: #0F766E;
        }

        .how-to-steps {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .step-num-badge {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #D1FAE5;
          border: 2px solid #34D399;
          color: #065F46;
          font-size: 19px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-item-text {
          font-size: clamp(18px, 2.2vw, 21px);
          font-weight: 700;
          color: #1E293B;
          line-height: 1.4;
        }

        /* Difficulty selection */
        .difficulty-section {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 24px;
          padding: 24px 28px;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
        }

        .difficulty-section-title {
          font-size: 24px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .difficulty-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .diff-choice-btn {
          background-color: #F8FAFC;
          border: 3px solid #CBD5E1;
          border-radius: 20px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 100px;
        }

        .diff-choice-btn:hover {
          border-color: #10B981;
          background-color: #F0FDF4;
        }

        .diff-choice-btn.selected {
          border-color: #059669;
          border-width: 4px;
          background: linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%);
          box-shadow: 0 6px 16px rgba(5, 150, 105, 0.15);
        }

        .diff-header-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .diff-label {
          font-size: 24px;
          font-weight: 900;
          color: #0F172A;
        }

        .diff-sub {
          font-size: 16px;
          font-weight: 700;
          color: #475569;
          line-height: 1.35;
        }

        .diff-radio-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #94A3B8;
        }

        /* Big start button (>=60px) */
        .big-start-game-btn {
          width: 100%;
          min-height: 68px;
          background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
          border: 3px solid #9A3412;
          border-radius: 22px;
          color: #FFFFFF;
          font-size: clamp(22px, 3vw, 26px);
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(234, 88, 12, 0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .big-start-game-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(234, 88, 12, 0.45);
        }

        .big-start-game-btn:active {
          transform: translateY(2px);
        }

        /* ----------------------------------------------------- */
        /* PLAYING PHASE STYLES                                 */
        /* ----------------------------------------------------- */
        .playing-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .game-hud-bar {
          width: 100%;
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 22px;
          padding: 16px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
        }

        .hud-title-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hud-game-name {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
        }

        .hud-diff-badge {
          background-color: #DCFCE7;
          color: #166534;
          border: 1px solid #86EFAC;
          font-size: 15px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 10px;
        }

        .hud-stats-group {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .hud-stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 14px;
          padding: 8px 16px;
        }

        .highlight-matched {
          background-color: #ECFDF5;
          border-color: #34D399;
        }

        .stat-label {
          font-size: 16px;
          font-weight: 700;
          color: #475569;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
        }

        .stat-value-big {
          font-size: 22px;
          font-weight: 900;
          color: #047857;
        }

        .stat-divider {
          color: #94A3B8;
          font-weight: 700;
        }

        .font-mono {
          font-family: monospace;
          letter-spacing: 0.5px;
        }

        .positive-feedback-banner {
          background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
          border: 3px solid #34D399;
          color: #065F46;
          font-size: 24px;
          font-weight: 900;
          padding: 12px 32px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.2);
        }

        .game-grid-area {
          width: 100%;
        }

        /* ----------------------------------------------------- */
        /* COMPLETED RESULT PHASE STYLES                        */
        /* ----------------------------------------------------- */
        .result-container {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .result-card {
          background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);
          border: 4px solid #86EFAC;
          border-radius: 32px;
          padding: 40px 32px;
          max-width: 640px;
          width: 100%;
          text-align: center;
          box-shadow: 0 16px 36px rgba(15, 118, 110, 0.12);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .result-trophy-icon {
          font-size: 64px;
          line-height: 1;
        }

        .result-title {
          font-size: clamp(34px, 4.5vw, 44px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .result-desc {
          font-size: clamp(20px, 2.8vw, 24px);
          font-weight: 700;
          color: #334155;
          margin: 0;
        }

        .result-stats-table {
          width: 100%;
          background-color: #FFFFFF;
          border: 3px solid #CBD5E1;
          border-radius: 20px;
          overflow: hidden;
          margin: 10px 0;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 2px solid #F1F5F9;
          font-size: 19px;
        }

        .result-row:last-child {
          border-bottom: none;
        }

        .highlight-row {
          background-color: #F0FDF4;
        }

        .row-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: #475569;
        }

        .row-value {
          font-size: 21px;
          font-weight: 800;
          color: #0F172A;
        }

        .badge-diff {
          background-color: #DCFCE7;
          color: #166534;
          border: 1px solid #86EFAC;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 18px;
        }

        .font-bold {
          font-weight: 900;
          color: #059669;
        }

        /* 3 Big Action Buttons */
        .result-actions-group {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 8px;
        }

        .result-btn {
          width: 100%;
          min-height: 62px;
          border-radius: 18px;
          font-size: 22px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          border: 3px solid transparent;
          transition: transform 0.15s;
        }

        .result-btn:hover {
          transform: translateY(-2px);
        }

        .result-btn:active {
          transform: translateY(2px);
        }

        .senior-btn-restart {
          background: linear-gradient(135deg, #0F766E 0%, #047857 100%);
          border-color: #065F46;
          color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(15, 118, 110, 0.3);
        }

        .senior-btn-difficulty {
          background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%);
          border-color: #1E40AF;
          color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(30, 58, 138, 0.3);
        }

        .senior-btn-hub {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
          color: #334155;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        .senior-btn-hub:hover {
          background-color: #F8FAFC;
          border-color: #94A3B8;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .difficulty-cards-grid {
            grid-template-columns: 1fr;
          }
          .game-hud-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .hud-stats-group {
            justify-content: space-between;
          }
          .result-card {
            padding: 28px 20px;
          }
        }
      `}</style>
    </div>
  );
};
