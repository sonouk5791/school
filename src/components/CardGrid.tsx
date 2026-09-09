import React from 'react';
import type { CardState } from '../types/game';
import { CardItem } from './CardItem';

interface CardGridProps {
  cards: CardState[];
  onCardClick: (card: CardState) => void;
  disabled?: boolean;
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, onCardClick, disabled = false }) => {
  const cardCount = cards.length;

  // Determine optimal grid column count
  let columns = 2;
  if (cardCount <= 4) {
    columns = 2; // 2x2
  } else if (cardCount <= 6) {
    columns = 3; // 2x3
  } else if (cardCount <= 10) {
    columns = 5; // 2x5
  } else if (cardCount <= 12) {
    columns = 4; // 3x4
  } else {
    columns = 4; // 4x4
  }

  return (
    <div className="card-grid-wrapper">
      <div
        className="card-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {cards.map((card) => (
          <CardItem key={card.id} card={card} onFlip={onCardClick} disabled={disabled} />
        ))}
      </div>

      <style>{`
        .card-grid-wrapper {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
        }

        .card-grid {
          display: grid;
          gap: 16px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .card-grid {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};
