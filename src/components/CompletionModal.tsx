import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ArrowRight, Home } from 'lucide-react';
import { soundManager } from '../utils/soundEffect';
import type { GameType } from '../types/game';

interface CompletionModalProps {
  isOpen: boolean;
  onNextGame: () => void;
  onGoHome: () => void;
  matchCount: number;
  gameType?: GameType;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onNextGame,
  onGoHome,
  matchCount,
  gameType = 'card-match',
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playVictory();

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0F766E', '#15803D', '#B45309', '#1E3A8A', '#475569'],
        });
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay anim-pop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className="icon-badge">
          <Award size={52} color="#0F766E" />
        </div>

        <h2 id="modal-title" className="modal-title">
          오늘의 두뇌 운동을 마쳤습니다
        </h2>

        <p className="modal-sub">
          {gameType === 'sequence'
            ? `${matchCount}단계의 행동 순서를 차분하게 모두 맞추셨습니다.`
            : gameType === 'hangeul'
            ? `${matchCount}글자의 한글 낱말을 차분하게 모두 맞추셨습니다.`
            : gameType === 'storybook'
            ? '소중한 추억 이야기를 따뜻하게 마음속에 담으셨습니다.'
            : `${matchCount}쌍의 카드 그림 짝을 차분하게 모두 맞추셨습니다.`}
          <br />
          수고하셨습니다.
        </p>

        <div className="modal-buttons">
          <button onClick={onNextGame} className="senior-btn senior-btn-primary modal-btn-main">
            <span>다음 활동 진행하기</span>
            <ArrowRight size={28} />
          </button>

          <button onClick={onGoHome} className="senior-btn senior-btn-secondary modal-btn-sub">
            <Home size={26} />
            <span>처음 화면으로</span>
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-card {
          background-color: #FFFFFF;
          border: 4px solid #0F766E;
          border-radius: 28px;
          padding: 36px 32px;
          max-width: 560px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .icon-badge {
          background-color: #CCFBF1;
          border: 3px solid #5EEAD4;
          border-radius: 50%;
          width: 88px;
          height: 88px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 34px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 12px;
        }

        .modal-sub {
          font-size: 24px;
          font-weight: 700;
          color: #334155;
          line-height: 1.5;
          margin-bottom: 32px;
        }

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
        }

        .modal-btn-main {
          width: 100%;
          font-size: 26px;
          padding: 18px;
          background-color: #0F766E;
          border-color: #115E59;
        }

        .modal-btn-sub {
          width: 100%;
          font-size: 22px;
        }
      `}</style>
    </div>
  );
};
