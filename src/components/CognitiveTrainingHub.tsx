import React from 'react';
import { Play, Heart, Brain, Award } from 'lucide-react';
import type { GameType } from '../types/game';

interface CognitiveTrainingHubProps {
  onSelectGame: (gameType: GameType) => void;
  currentLevel: number;
}

export const CognitiveTrainingHub: React.FC<CognitiveTrainingHubProps> = ({
  onSelectGame,
  currentLevel,
}) => {
  return (
    <div className="cognitive-hub-container anim-pop">
      {/* Header Banner */}
      <div className="hub-header">
        <div className="hub-badge">
          <Brain size={28} color="#047857" />
          <span>기억력 · 집중력 · 사고력 · 회상 감성 교실</span>
        </div>
        <h2 className="hub-title">🧠 인지훈련 교실 🌸</h2>
        <p className="hub-sub">
          원하시는 두뇌 훈련 활동을 선택해주세요. 즐겁고 편안하게 두뇌 건강을 가꿔보세요.
        </p>
      </div>

      {/* Cognitive Activities Grid */}
      <div className="cognitive-grid">
        {/* 1. 같은 그림 찾기 (기억력 카드 매칭 - 핵심 메인 카드) */}
        <div className="cognitive-card card-match-highlight anim-pop">
          <div className="card-top-row">
            <div className="card-emoji-icon">🧩</div>
            <div className="badge-group">
              <span className="difficulty-badge level-easy">
                <Award size={16} /> 난이도: {currentLevel === 1 ? '쉬움 (1단계)' : `${currentLevel}단계`}
              </span>
              <span className="category-tag tag-memory">기억력 훈련</span>
            </div>
          </div>

          <h3 className="cog-card-title">같은 그림 찾기</h3>
          <p className="cog-card-desc">
            같은 그림의 위치를 기억하고 짝을 맞춰보세요.
          </p>

          <button
            onClick={() => onSelectGame('card-match')}
            className="cog-play-btn senior-btn-primary"
            aria-label="같은 그림 찾기 게임 시작하기"
          >
            <Play size={24} fill="currentColor" />
            <span>게임 시작하기</span>
          </button>
        </div>

        {/* 2. 일상 순서 배열하기 */}
        <div className="cognitive-card anim-pop">
          <div className="card-top-row">
            <div className="card-emoji-icon">🔢</div>
            <div className="badge-group">
              <span className="difficulty-badge level-medium">
                <Award size={16} /> 난이도: 보통
              </span>
              <span className="category-tag tag-logic">사고력 훈련</span>
            </div>
          </div>

          <h3 className="cog-card-title">일상 순서 배열하기</h3>
          <p className="cog-card-desc">
            요리하기, 외출 준비 등 일상 속의 올바른 순서를 맞춰보세요.
          </p>

          <button
            onClick={() => onSelectGame('sequence')}
            className="cog-play-btn senior-btn-sequence"
            aria-label="일상 순서 배열하기 게임 시작하기"
          >
            <Play size={24} fill="currentColor" />
            <span>게임 시작하기</span>
          </button>
        </div>

        {/* 3. 한글 낱말 맞추기 */}
        <div className="cognitive-card anim-pop">
          <div className="card-top-row">
            <div className="card-emoji-icon">🔤</div>
            <div className="badge-group">
              <span className="difficulty-badge level-easy">
                <Award size={16} /> 난이도: 쉬움
              </span>
              <span className="category-tag tag-language">언어력 훈련</span>
            </div>
          </div>

          <h3 className="cog-card-title">한글 낱말 맞추기</h3>
          <p className="cog-card-desc">
            자음과 모음을 차례로 터치하여 정겨운 우리말 낱말을 완성해보세요.
          </p>

          <button
            onClick={() => onSelectGame('hangeul')}
            className="cog-play-btn senior-btn-hangeul"
            aria-label="한글 낱말 맞추기 게임 시작하기"
          >
            <Play size={24} fill="currentColor" />
            <span>게임 시작하기</span>
          </button>
        </div>

        {/* 4. 나의 어린 시절 (추억 회상 활동) */}
        <div className="cognitive-card anim-pop">
          <div className="card-top-row">
            <div className="card-emoji-icon">🧒</div>
            <div className="badge-group">
              <span className="difficulty-badge level-comfort">
                <Award size={16} /> 난이도: 편안함
              </span>
              <span className="category-tag tag-reminiscence">추억 회상</span>
            </div>
          </div>

          <h3 className="cog-card-title">나의 어린 시절</h3>
          <p className="cog-card-desc">
            골목길 놀이 퀴즈, 정겨운 회상 엽서 만들기, 그 시절 동요를 즐겨보세요.
          </p>

          <button
            onClick={() => onSelectGame('childhood')}
            className="cog-play-btn senior-btn-childhood"
            aria-label="나의 어린 시절 추억 활동 입장하기"
          >
            <Play size={24} fill="currentColor" />
            <span>입장하기</span>
          </button>
        </div>

        {/* 5. 책을 읽어주는 방 */}
        <div className="cognitive-card anim-pop">
          <div className="card-top-row">
            <div className="card-emoji-icon">📖</div>
            <div className="badge-group">
              <span className="difficulty-badge level-comfort">
                <Award size={16} /> 난이도: 편안함
              </span>
              <span className="category-tag tag-story">이야기 &amp; 동요</span>
            </div>
          </div>

          <h3 className="cog-card-title">책을 읽어주는 방</h3>
          <p className="cog-card-desc">
            다정한 목소리로 읽어주는 옛날 동화와 아름다운 동요 음원을 감상해보세요.
          </p>

          <button
            onClick={() => onSelectGame('storybook')}
            className="cog-play-btn senior-btn-story"
            aria-label="책을 읽어주는 방 입장하기"
          >
            <Play size={24} fill="currentColor" />
            <span>입장하기</span>
          </button>
        </div>

        {/* 6. 추억 영상 앨범관 */}
        <div className="cognitive-card anim-pop">
          <div className="card-top-row">
            <div className="card-emoji-icon">🎥</div>
            <div className="badge-group">
              <span className="difficulty-badge level-comfort">
                <Award size={16} /> 난이도: 편안함
              </span>
              <span className="category-tag tag-video">풍경 힐링</span>
            </div>
          </div>

          <h3 className="cog-card-title">추억 영상 앨범관</h3>
          <p className="cog-card-desc">
            맑은 시냇물, 노을 풍경과 함께 영상 맞춤 해설 목소리로 편안히 쉬어가세요.
          </p>

          <button
            onClick={() => onSelectGame('video-gallery')}
            className="cog-play-btn senior-btn-video"
            aria-label="추억 영상 앨범관 입장하기"
          >
            <Play size={24} fill="currentColor" />
            <span>입장하기</span>
          </button>
        </div>
      </div>

      {/* Footer Encouragement */}
      <div className="hub-footer">
        <div className="footer-tip-pill">
          <Heart size={22} color="#15803D" />
          <span>매일 10분씩 좋아하는 활동을 골라 꾸준히 하시면 두뇌 건강에 큰 도움이 됩니다.</span>
        </div>
      </div>

      <style>{`
        .cognitive-hub-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 30px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .hub-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .hub-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #D1FAE5;
          border: 2px solid #6EE7B7;
          border-radius: 24px;
          padding: 8px 22px;
          font-size: 18px;
          font-weight: 800;
          color: #065F46;
        }

        .hub-title {
          font-size: clamp(32px, 4vw, 42px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .hub-sub {
          font-size: clamp(19px, 2.5vw, 22px);
          font-weight: 700;
          color: #475569;
          margin: 0;
        }

        /* Grid */
        .cognitive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .cognitive-card {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 28px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .cognitive-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
        }

        .card-match-highlight {
          border-color: #10B981;
          background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);
          box-shadow: 0 10px 24px rgba(16, 185, 129, 0.12);
        }

        .card-match-highlight:hover {
          border-color: #059669;
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .card-emoji-icon {
          font-size: 48px;
          line-height: 1;
        }

        .badge-group {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .difficulty-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 10px;
        }

        .level-easy {
          background-color: #DCFCE7;
          color: #166534;
          border: 1px solid #86EFAC;
        }

        .level-medium {
          background-color: #FEF3C7;
          color: #92400E;
          border: 1px solid #FDE68A;
        }

        .level-comfort {
          background-color: #F3E8FF;
          color: #6B21A8;
          border: 1px solid #DDD6FE;
        }

        .category-tag {
          font-size: 13px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 8px;
        }

        .tag-memory {
          background-color: #E0F2FE;
          color: #0369A1;
        }

        .tag-logic {
          background-color: #EDE9FE;
          color: #6D28D9;
        }

        .tag-language {
          background-color: #FCE7F3;
          color: #BE185D;
        }

        .tag-reminiscence {
          background-color: #FFEDD5;
          color: #C2410C;
        }

        .tag-story {
          background-color: #CCFBF1;
          color: #0F766E;
        }

        .tag-video {
          background-color: #EDE9FE;
          color: #7E22CE;
        }

        .cog-card-title {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 10px 0;
        }

        .cog-card-desc {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 24px;
          flex-grow: 1;
        }

        .cog-play-btn {
          width: 100%;
          min-height: 60px;
          border-radius: 18px;
          font-size: 21px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          border: 3px solid transparent;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .senior-btn-primary {
          background: linear-gradient(135deg, #0F766E 0%, #047857 100%);
          border-color: #065F46;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.3);
        }

        .senior-btn-sequence {
          background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%);
          border-color: #1E40AF;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
        }

        .senior-btn-hangeul {
          background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
          border-color: #6B21A8;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
        }

        .senior-btn-childhood {
          background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
          border-color: #9A3412;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
        }

        .senior-btn-story {
          background: linear-gradient(135deg, #0F766E 0%, #0D9488 100%);
          border-color: #115E59;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.3);
        }

        .senior-btn-video {
          background: linear-gradient(135deg, #7E22CE 0%, #6B21A8 100%);
          border-color: #581C87;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(126, 34, 206, 0.3);
        }

        .cog-play-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
        }

        .cog-play-btn:active {
          transform: translateY(2px);
        }

        .hub-footer {
          display: flex;
          justify-content: center;
          margin-top: 12px;
        }

        .footer-tip-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background-color: #F0FDF4;
          border: 2px solid #BBF7D0;
          border-radius: 20px;
          padding: 12px 24px;
          font-size: 18px;
          font-weight: 700;
          color: #166534;
          text-align: center;
        }

        @media (max-width: 768px) {
          .cognitive-grid {
            grid-template-columns: 1fr;
          }
          .hub-title {
            font-size: 28px;
          }
          .hub-sub {
            font-size: 18px;
          }
          .footer-tip-pill {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};
