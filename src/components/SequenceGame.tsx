import React, { useState, useEffect, useRef } from 'react';
import type { SequenceScenario, SequenceStep } from '../types/game';
import { soundManager } from '../utils/soundEffect';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

interface SequenceGameProps {
  scenario: SequenceScenario;
  onCompleteRound: (isSuccess: boolean, reactionTimeMs: number) => void;
}

export const SequenceGame: React.FC<SequenceGameProps> = ({ scenario, onCompleteRound }) => {
  const [cardPool, setCardPool] = useState<SequenceStep[]>([]);
  const [placedSlots, setPlacedSlots] = useState<(SequenceStep | null)[]>([]);
  const [gentleNotice, setGentleNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const startTimeRef = useRef<number>(performance.now());
  const attemptCountRef = useRef<number>(0);

  // Initialize/Reset game whenever scenario ID changes
  useEffect(() => {
    startTimeRef.current = performance.now();
    attemptCountRef.current = 0;
    setGentleNotice(null);
    setIsProcessing(false);

    const shuffled = [...scenario.steps].sort(() => Math.random() - 0.5);
    setCardPool(shuffled);
    setPlacedSlots(new Array(scenario.steps.length).fill(null));
  }, [scenario.id, scenario.steps.length]);

  // Place card into first available empty slot
  const handleSelectPoolCard = (step: SequenceStep) => {
    if (isProcessing) return;

    soundManager.playFlip();

    const emptyIndex = placedSlots.findIndex((slot) => slot === null);
    if (emptyIndex === -1) return;

    const newSlots = [...placedSlots];
    newSlots[emptyIndex] = step;
    setPlacedSlots(newSlots);

    const newPool = cardPool.filter((item) => item.label !== step.label);
    setCardPool(newPool);

    // Auto-verify when all slots are filled!
    if (newSlots.every((s) => s !== null)) {
      verifySequence(newSlots);
    }
  };

  // Remove card from slot back to pool
  const handleRemoveSlotCard = (index: number) => {
    if (isProcessing) return;

    const step = placedSlots[index];
    if (!step) return;

    soundManager.playFlip();

    const newSlots = [...placedSlots];
    newSlots[index] = null;
    setPlacedSlots(newSlots);

    setCardPool((prev) => [...prev, step]);
  };

  // Reset placement
  const handleResetPlacement = () => {
    if (isProcessing) return;
    soundManager.playFlip();

    setPlacedSlots(new Array(scenario.steps.length).fill(null));
    const shuffled = [...scenario.steps].sort(() => Math.random() - 0.5);
    setCardPool(shuffled);
    setGentleNotice(null);
  };

  // Verify function
  const verifySequence = (targetSlots: (SequenceStep | null)[]) => {
    if (isProcessing || targetSlots.some((s) => s === null)) return;

    attemptCountRef.current += 1;
    setIsProcessing(true);

    const isCorrect = targetSlots.every((step, index) => step?.stepNumber === index + 1);

    if (isCorrect) {
      soundManager.playMatch();
      setGentleNotice('정답입니다.');

      const totalTimeMs = Math.round(performance.now() - startTimeRef.current);
      setTimeout(() => {
        onCompleteRound(true, totalTimeMs);
      }, 900);
    } else {
      soundManager.playMismatch();
      setGentleNotice('괜찮습니다. 천천히 다시 순서를 정해보세요.');

      setTimeout(() => {
        setIsProcessing(false);
        setGentleNotice(null);
      }, 1500);
    }
  };

  const isAllPlaced = placedSlots.every((s) => s !== null);

  return (
    <div className="sequence-game-wrapper">
      <div className="title-box">
        <h2 className="scenario-title">
          📌 {scenario.title} ({scenario.steps.length}단계) 순서 맞추기
        </h2>
        <p className="scenario-desc">아래의 순서 카드를 누르면 차례대로 들어갑니다.</p>
      </div>

      {/* Gentle notice banner */}
      {gentleNotice && (
        <div className="gentle-banner anim-pop" role="status">
          {gentleNotice}
        </div>
      )}

      {/* Placed Target Slots */}
      <div className="slots-container">
        {placedSlots.map((step, idx) => (
          <div
            key={idx}
            className={`slot-box ${step ? 'filled' : 'empty'}`}
            onClick={() => step && handleRemoveSlotCard(idx)}
            role="button"
            tabIndex={0}
            aria-label={`${idx + 1}번 순서 ${step ? step.label : '비어있음'}`}
          >
            <span className="slot-badge">{idx + 1}번 순서</span>
            {step ? (
              <div className="slot-content">
                <span className="slot-emoji">{step.emoji.replace(/[\uFE00-\uFE0F]/g, '')}</span>
                <span className="slot-label">{step.label}</span>
              </div>
            ) : (
              <span className="slot-placeholder">카드를 누르면<br />여기에 들어옵니다</span>
            )}
          </div>
        ))}
      </div>

      {/* Available Card Pool */}
      <div className="pool-section">
        <h3 className="pool-title">선택할 순서 카드:</h3>
        <div className="pool-container">
          {cardPool.length === 0 ? (
            <p className="pool-empty-msg">모든 카드를 위에 배치하셨습니다. 순서를 확인하는 중입니다.</p>
          ) : (
            cardPool.map((step) => (
              <button
                key={step.label}
                onClick={() => handleSelectPoolCard(step)}
                className="pool-card senior-btn"
                aria-label={`${step.label} 선택하기`}
                disabled={isProcessing}
              >
                <span className="card-emoji">{step.emoji.replace(/[\uFE00-\uFE0F]/g, '')}</span>
                <span className="card-label">{step.label}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Action Control Buttons */}
      <div className="sequence-actions">
        <button
          onClick={handleResetPlacement}
          className="senior-btn senior-btn-secondary action-reset"
          disabled={isProcessing}
        >
          <RotateCcw size={28} />
          <span>다시 정하기</span>
        </button>

        <button
          onClick={() => verifySequence(placedSlots)}
          className={`senior-btn senior-btn-primary action-verify ${isAllPlaced ? 'ready' : ''}`}
          disabled={!isAllPlaced || isProcessing}
        >
          <CheckCircle2 size={32} />
          <span>순서 확인하기</span>
        </button>
      </div>

      <style>{`
        .sequence-game-wrapper {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .title-box {
          text-align: center;
        }

        .scenario-title {
          font-size: 30px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 6px;
        }

        .scenario-desc {
          font-size: 22px;
          font-weight: 700;
          color: #475569;
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

        .slots-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          width: 100%;
        }

        .slot-box {
          flex: 1;
          min-width: 160px;
          max-width: 200px;
          min-height: 180px;
          background-color: #FFFFFF;
          border: 4px dashed #CBD5E1;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 12px;
          cursor: pointer;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .slot-box.filled {
          border-style: solid;
          border-color: #0F766E;
          background-color: #F0FDF4;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.1);
        }

        .slot-badge {
          position: absolute;
          top: -14px;
          background-color: #334155;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          padding: 2px 12px;
          border-radius: 12px;
        }

        .slot-box.filled .slot-badge {
          background-color: #0F766E;
        }

        .slot-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .slot-emoji {
          font-size: 48px;
        }

        .slot-label {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          text-align: center;
        }

        .slot-placeholder {
          font-size: 18px;
          color: #94A3B8;
          font-weight: 700;
          text-align: center;
        }

        .pool-section {
          width: 100%;
          background-color: #FFFFFF;
          border: 3px solid #CBD5E1;
          border-radius: 24px;
          padding: 20px;
        }

        .pool-title {
          font-size: 22px;
          font-weight: 800;
          color: #334155;
          margin-bottom: 14px;
        }

        .pool-container {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
        }

        .pool-empty-msg {
          font-size: 20px;
          font-weight: 700;
          color: #0F766E;
          text-align: center;
          padding: 12px;
        }

        .pool-card {
          background-color: #F8FAFC;
          border: 3px solid #0F766E;
          border-radius: 18px;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .card-emoji {
          font-size: 38px;
        }

        .card-label {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
        }

        .sequence-actions {
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
