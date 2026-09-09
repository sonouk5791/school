import React from 'react';
import type { CardState } from '../types/game';
import { Check } from 'lucide-react';

interface CardItemProps {
  card: CardState;
  onFlip: (card: CardState) => void;
  disabled?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onFlip, disabled = false }) => {
  const handleClick = () => {
    if (disabled || card.isFlipped || card.isMatched) return;
    onFlip(card);
  };

  return (
    <div
      className={`card-container ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={card.isFlipped ? `카드: ${card.label}` : '뒷면 카드'}
      aria-disabled={disabled || card.isFlipped || card.isMatched}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="card-inner">
        {/* Front Face (Shown when flipped) */}
        <div className="card-face card-front">
          <span className="card-emoji" role="img" aria-label={card.label}>
            {card.emoji}
          </span>
          <span className="card-label">{card.label}</span>
          {card.isMatched && (
            <div className="matched-badge" aria-label="맞춘 카드">
              <Check size={28} strokeWidth={4} color="#FFFFFF" />
            </div>
          )}
        </div>

        {/* Back Face (Covered card) */}
        <div className="card-face card-back">
          <div className="card-back-pattern">
            <span className="card-back-icon">🏫</span>
            <span className="card-back-text">눌러보세요</span>
          </div>
        </div>
      </div>

      <style>{`
        .card-container {
          perspective: 1000px;
          aspect-ratio: 1 / 1.15;
          width: 100%;
          cursor: pointer;
          user-select: none;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .card-container.flipped .card-inner,
        .card-container.matched .card-inner {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 24px;
          border: 4px solid #1E293B;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        /* Front Face (Flipped) */
        .card-front {
          background-color: #FFFFFF;
          transform: rotateY(180deg);
          border-color: #0284C7;
          gap: 6px;
          padding: 8px;
        }

        .card-emoji {
          font-size: clamp(3rem, 7vw, 5rem);
          line-height: 1.1;
        }

        .card-label {
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 900;
          color: #0F172A;
          letter-spacing: -0.5px;
        }

        /* Back Face (Hidden) */
        .card-back {
          background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
          color: #FFFFFF;
          border-color: #075985;
        }

        .card-back:hover {
          background: linear-gradient(135deg, #0369A1 0%, #075985 100%);
        }

        .card-back-pattern {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .card-back-icon {
          font-size: clamp(2.5rem, 5vw, 4rem);
        }

        .card-back-text {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 700;
          color: #E0F2FE;
        }

        /* Matched State */
        .card-container.matched .card-front {
          background-color: #ECFDF5;
          border-color: #059669;
          border-width: 5px;
          animation: pulseMatch 0.4s ease;
        }

        .matched-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: #059669;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .card-container.matched {
          cursor: default;
        }
      `}</style>
    </div>
  );
};
