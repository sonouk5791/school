import React, { useState, useEffect, useRef } from 'react';
import type { HangeulScenario, HangeulTile } from '../types/game';
import { soundManager } from '../utils/soundEffect';
import { CheonjiinKeypad } from './CheonjiinKeypad';
import { HandwritingCanvas } from './HandwritingCanvas';
import { RotateCcw, CheckCircle2, Keyboard, Grid, PenTool } from 'lucide-react';

interface HangeulGameProps {
  scenario: HangeulScenario;
  onCompleteRound: (isSuccess: boolean, reactionTimeMs: number) => void;
}

export const HangeulGame: React.FC<HangeulGameProps> = ({ scenario, onCompleteRound }) => {
  // Input method mode: 'pen' | 'cheonjiin' | 'tiles'
  const [inputMode, setInputMode] = useState<'pen' | 'cheonjiin' | 'tiles'>('pen');

  // Tile Placement Mode States
  const [tilePool, setTilePool] = useState<HangeulTile[]>([]);
  const [placedSlots, setPlacedSlots] = useState<(HangeulTile | null)[]>([]);

  // Cheonjiin Tracing Mode States
  const [typedText, setTypedText] = useState<string>('');

  const [gentleNotice, setGentleNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const startTimeRef = useRef<number>(performance.now());
  const attemptCountRef = useRef<number>(0);

  // Reset board when scenario changes
  useEffect(() => {
    startTimeRef.current = performance.now();
    attemptCountRef.current = 0;
    setGentleNotice(null);
    setIsProcessing(false);
    setTypedText('');

    const shuffled = [...scenario.tiles].sort(() => Math.random() - 0.5);
    setTilePool(shuffled);
    setPlacedSlots(new Array(scenario.tiles.length).fill(null));
  }, [scenario.id, scenario.tiles.length]);

  // --- Pen Handwriting Mode Complete ---
  const handlePenWritingComplete = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    attemptCountRef.current += 1;

    soundManager.playMatch();
    setGentleNotice('정답입니다. 참 잘 따라 적으셨습니다! 🌸');

    const totalTimeMs = Math.round(performance.now() - startTimeRef.current);
    setTimeout(() => {
      onCompleteRound(true, totalTimeMs);
    }, 1000);
  };

  // --- Tile Placement Handlers ---
  const handleSelectPoolTile = (tile: HangeulTile) => {
    if (isProcessing) return;

    soundManager.playFlip();

    const emptyIndex = placedSlots.findIndex((slot) => slot === null);
    if (emptyIndex === -1) return;

    const newSlots = [...placedSlots];
    newSlots[emptyIndex] = tile;
    setPlacedSlots(newSlots);

    const newPool = tilePool.filter((t) => t.id !== tile.id);
    setTilePool(newPool);

    if (newSlots.every((s) => s !== null)) {
      verifyTileSequence(newSlots);
    }
  };

  const handleRemoveSlotTile = (index: number) => {
    if (isProcessing) return;

    const tile = placedSlots[index];
    if (!tile) return;

    soundManager.playFlip();

    const newSlots = [...placedSlots];
    newSlots[index] = null;
    setPlacedSlots(newSlots);

    setTilePool((prev) => [...prev, tile]);
  };

  const handleResetTiles = () => {
    if (isProcessing) return;
    soundManager.playFlip();

    setPlacedSlots(new Array(scenario.tiles.length).fill(null));
    const shuffled = [...scenario.tiles].sort(() => Math.random() - 0.5);
    setTilePool(shuffled);
    setGentleNotice(null);
  };

  const verifyTileSequence = (targetSlots: (HangeulTile | null)[]) => {
    if (isProcessing || targetSlots.some((s) => s === null)) return;

    attemptCountRef.current += 1;
    setIsProcessing(true);

    const assembledWord = targetSlots.map((t) => t?.char).join('');
    const isCorrect = assembledWord === scenario.fullWord;

    if (isCorrect) {
      soundManager.playMatch();
      setGentleNotice('정답입니다.');

      const totalTimeMs = Math.round(performance.now() - startTimeRef.current);
      setTimeout(() => {
        onCompleteRound(true, totalTimeMs);
      }, 900);
    } else {
      soundManager.playMismatch();
      setGentleNotice('괜찮습니다. 천천히 다시 완성해 보세요.');

      setTimeout(() => {
        setIsProcessing(false);
        setGentleNotice(null);
      }, 1500);
    }
  };

  // --- Cheonjiin Keypad Handlers ---
  const handleCheonjiinKeyPress = (key: string) => {
    if (isProcessing) return;

    soundManager.playFlip();
    const newText = typedText + key;
    setTypedText(newText);

    if (newText.length >= scenario.fullWord.length) {
      verifyCheonjiinInput(newText);
    }
  };

  const handleCheonjiinBackspace = () => {
    if (isProcessing || typedText.length === 0) return;
    soundManager.playFlip();
    setTypedText((prev) => prev.slice(0, -1));
  };

  const verifyCheonjiinInput = (input: string) => {
    attemptCountRef.current += 1;
    setIsProcessing(true);

    const cleanInput = input.trim();
    const isCorrect = cleanInput.includes(scenario.fullWord) || cleanInput === scenario.fullWord;

    if (isCorrect) {
      soundManager.playMatch();
      setGentleNotice('정답입니다. 참 잘하셨습니다!');

      const totalTimeMs = Math.round(performance.now() - startTimeRef.current);
      setTimeout(() => {
        onCompleteRound(true, totalTimeMs);
      }, 900);
    } else {
      soundManager.playMismatch();
      setGentleNotice('괜찮습니다. 천천히 자판을 다시 눌러보세요.');

      setTimeout(() => {
        setIsProcessing(false);
        setTypedText('');
        setGentleNotice(null);
      }, 1500);
    }
  };

  return (
    <div className="hangeul-game-wrapper">
      {/* Mode Selector Tabs (3 Modes) */}
      <div className="mode-tab-bar">
        <button
          onClick={() => setInputMode('pen')}
          className={`tab-btn ${inputMode === 'pen' ? 'active' : ''}`}
        >
          <PenTool size={22} />
          <span>🖌️ 터치펜으로 따라 적기</span>
        </button>

        <button
          onClick={() => setInputMode('cheonjiin')}
          className={`tab-btn ${inputMode === 'cheonjiin' ? 'active' : ''}`}
        >
          <Keyboard size={22} />
          <span>⌨️ 천지인 자판 적기</span>
        </button>

        <button
          onClick={() => setInputMode('tiles')}
          className={`tab-btn ${inputMode === 'tiles' ? 'active' : ''}`}
        >
          <Grid size={22} />
          <span>🧩 카드 배치하기</span>
        </button>
      </div>

      <div className="title-box">
        <h2 className="scenario-title">
          🔤 {scenario.questionTitle}
        </h2>
        <div className="target-word-display">
          따라 적을 글자: <span className="word-highlight">{scenario.fullWord}</span>
        </div>
      </div>

      {/* Gentle notice banner */}
      {gentleNotice && (
        <div className="gentle-banner anim-pop" role="status">
          {gentleNotice}
        </div>
      )}

      {/* Mode 1: Direct Stylus Touch Pen Handwriting Mode */}
      {inputMode === 'pen' && (
        <div className="pen-mode-container anim-pop">
          <HandwritingCanvas
            targetWord={scenario.fullWord}
            onComplete={handlePenWritingComplete}
            disabled={isProcessing}
          />
        </div>
      )}

      {/* Mode 2: Cheonjiin Keypad Tracing Mode */}
      {inputMode === 'cheonjiin' && (
        <div className="cheonjiin-mode-container anim-pop">
          <div className="typed-display-box">
            <span className="typed-label">입력한 글자:</span>
            <span className="typed-value">{typedText || '아래 자판을 눌러 따라 적어보세요'}</span>
          </div>

          <CheonjiinKeypad
            onKeyPress={handleCheonjiinKeyPress}
            onBackspace={handleCheonjiinBackspace}
            onConfirm={() => verifyCheonjiinInput(typedText)}
            disabled={isProcessing}
          />
        </div>
      )}

      {/* Mode 3: Tile Placement Mode */}
      {inputMode === 'tiles' && (
        <div className="tiles-mode-container anim-pop">
          <div className="hangeul-slots-container">
            {placedSlots.map((tile, idx) => (
              <div
                key={idx}
                className={`hangeul-slot ${tile ? 'filled' : 'empty'}`}
                onClick={() => tile && handleRemoveSlotTile(idx)}
                role="button"
                tabIndex={0}
                aria-label={`${idx + 1}번째 글자 ${tile ? tile.char : '비어있음'}`}
              >
                <span className="slot-num">{idx + 1}번째</span>
                {tile ? (
                  <span className="tile-char-placed">{tile.char}</span>
                ) : (
                  <span className="slot-text-placeholder">?</span>
                )}
              </div>
            ))}
          </div>

          <div className="tile-pool-section">
            <h3 className="pool-title">선택할 한글 글자 카드:</h3>
            <div className="pool-container">
              {tilePool.length === 0 ? (
                <p className="pool-empty-msg">모든 글자를 위에 만드셨습니다. 확인하는 중입니다.</p>
              ) : (
                tilePool.map((tile) => (
                  <button
                    key={tile.id}
                    onClick={() => handleSelectPoolTile(tile)}
                    className="hangeul-tile-btn senior-btn"
                    aria-label={`글자 ${tile.char} 선택`}
                    disabled={isProcessing}
                  >
                    <span className="tile-char">{tile.char}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="hangeul-actions">
            <button
              onClick={handleResetTiles}
              className="senior-btn senior-btn-secondary action-reset"
              disabled={isProcessing}
            >
              <RotateCcw size={28} />
              <span>다시 정하기</span>
            </button>

            <button
              onClick={() => verifyTileSequence(placedSlots)}
              className={`senior-btn senior-btn-primary action-verify ${placedSlots.every((s) => s !== null) ? 'ready' : ''}`}
              disabled={!placedSlots.every((s) => s !== null) || isProcessing}
            >
              <CheckCircle2 size={32} />
              <span>낱말 확인하기</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .hangeul-game-wrapper {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .mode-tab-bar {
          display: flex;
          gap: 8px;
          width: 100%;
          justify-content: center;
          margin-bottom: 6px;
        }

        .tab-btn {
          flex: 1;
          max-width: 280px;
          padding: 12px 14px;
          font-size: 18px;
          font-weight: 800;
          border-radius: 16px;
          border: 3px solid #CBD5E1;
          background-color: #FFFFFF;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s, border-color 0.2s;
        }

        .tab-btn.active {
          background-color: #0F766E;
          color: #FFFFFF;
          border-color: #115E59;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.2);
        }

        .title-box {
          text-align: center;
        }

        .scenario-title {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 6px;
        }

        .scenario-hint {
          font-size: 20px;
          font-weight: 700;
          color: #0F766E;
          background-color: #CCFBF1;
          border: 2px solid #5EEAD4;
          border-radius: 14px;
          padding: 6px 18px;
          display: inline-block;
          margin-bottom: 6px;
        }

        .target-word-display {
          font-size: 22px;
          font-weight: 800;
          color: #334155;
        }

        .word-highlight {
          color: #0F766E;
          font-size: 28px;
          font-weight: 900;
          background-color: #FEF3C7;
          padding: 2px 12px;
          border-radius: 10px;
          border: 2px solid #F59E0B;
        }

        .gentle-banner {
          background-color: #FFFBEB;
          border: 3px solid #F59E0B;
          color: #B45309;
          font-size: 24px;
          font-weight: 800;
          padding: 10px 28px;
          border-radius: 20px;
          text-align: center;
        }

        .pen-mode-container {
          width: 100%;
        }

        .cheonjiin-mode-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .typed-display-box {
          background-color: #FFFFFF;
          border: 3px solid #0F766E;
          border-radius: 20px;
          padding: 12px 24px;
          width: 100%;
          max-width: 520px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 22px;
          font-weight: 800;
        }

        .typed-label {
          color: #475569;
          font-size: 19px;
        }

        .typed-value {
          color: #0F766E;
          font-size: 28px;
          font-weight: 900;
        }

        .tiles-mode-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .hangeul-slots-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          width: 100%;
        }

        .hangeul-slot {
          width: 110px;
          height: 130px;
          background-color: #FFFFFF;
          border: 4px dashed #CBD5E1;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
        }

        .hangeul-slot.filled {
          border-style: solid;
          border-color: #0F766E;
          background-color: #F0FDF4;
        }

        .slot-num {
          position: absolute;
          top: -12px;
          background-color: #334155;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 10px;
        }

        .hangeul-slot.filled .slot-num {
          background-color: #0F766E;
        }

        .tile-char-placed {
          font-size: 44px;
          font-weight: 900;
          color: #0F172A;
        }

        .slot-text-placeholder {
          font-size: 32px;
          font-weight: 700;
          color: #CBD5E1;
        }

        .tile-pool-section {
          width: 100%;
          background-color: #FFFFFF;
          border: 3px solid #CBD5E1;
          border-radius: 24px;
          padding: 20px;
        }

        .pool-title {
          font-size: 20px;
          font-weight: 800;
          color: #334155;
          margin-bottom: 12px;
        }

        .pool-container {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
        }

        .pool-empty-msg {
          font-size: 19px;
          font-weight: 700;
          color: #0F766E;
          text-align: center;
        }

        .hangeul-tile-btn {
          width: 90px;
          height: 90px;
          background-color: #F8FAFC;
          border: 3px solid #0F766E;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .tile-char {
          font-size: 40px;
          font-weight: 900;
          color: #0F172A;
        }

        .hangeul-actions {
          display: flex;
          gap: 16px;
          width: 100%;
          justify-content: center;
        }

        .action-reset {
          min-width: 180px;
        }

        .action-verify {
          min-width: 260px;
          opacity: 0.6;
        }

        .action-verify.ready {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};
