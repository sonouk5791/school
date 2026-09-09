import React, { useState } from 'react';
import {
  Play,
  Heart,
  Brain,
  Sparkles,
  Clock,
  ArrowRight,
  X,
  Smile,
} from 'lucide-react';
import type { GameType } from '../types/game';

interface CognitiveTrainingHubProps {
  onSelectGame: (gameType: GameType) => void;
  currentLevel?: number;
}

export const CognitiveTrainingHub: React.FC<CognitiveTrainingHubProps> = ({
  onSelectGame,
}) => {
  // Coming soon modal state
  const [comingSoonModal, setComingSoonModal] = useState<{
    isOpen: boolean;
    title: string;
  }>({
    isOpen: false,
    title: '',
  });

  const handleOpenComingSoon = (programTitle: string) => {
    setComingSoonModal({
      isOpen: true,
      title: programTitle,
    });
  };

  const handleCloseComingSoon = () => {
    setComingSoonModal({
      isOpen: false,
      title: '',
    });
  };

  return (
    <div className="cognitive-hub-container anim-pop">
      {/* 1. Header Banner */}
      <div className="hub-header">
        <div className="hub-badge">
          <Brain size={26} color="#047857" />
          <span>두뇌 건강 지킴이 교실</span>
        </div>
        <h1 className="hub-title">두뇌 건강 인지훈련</h1>
        <p className="hub-sub">
          쉬운 활동부터 하나씩 시작해보세요.<br />
          기억력과 집중력을 재미있게 연습할 수 있습니다.
        </p>
      </div>

      {/* 2. 4 Main Program Cards Grid */}
      <section className="programs-section" aria-label="4대 인지훈련 프로그램">
        <div className="cognitive-grid">
          {/* Card 1: 같은 그림 찾기 (실제 게임 연결) */}
          <div className="cognitive-card card-active anim-pop">
            <div className="card-emoji-icon" role="img" aria-label="퍼즐 아이콘">
              🧩
            </div>

            <h2 className="cog-card-title">같은 그림 찾기</h2>

            <p className="cog-card-desc">
              같은 그림의 위치를 기억하고 짝을 맞춰보세요.
            </p>

            <div className="card-info-rows">
              <div className="info-row">
                <span className="info-label">훈련 영역:</span>
                <span className="info-val tag-domain">기억력 · 집중력</span>
              </div>
              <div className="info-row">
                <span className="info-label">난이도:</span>
                <span className="info-val tag-diff">쉬움 / 보통 / 어려움</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectGame('card-match')}
              className="cog-play-btn senior-btn-primary"
              aria-label="같은 그림 찾기 게임 시작하기"
            >
              <Play size={24} fill="currentColor" />
              <span>게임 시작하기</span>
            </button>
          </div>

          {/* Card 2: 숫자 기억하기 (준비 중) */}
          <div
            className="cognitive-card card-pending anim-pop"
            onClick={() => handleOpenComingSoon('숫자 기억하기')}
          >
            <div className="card-emoji-icon" role="img" aria-label="숫자 아이콘">
              🔢
            </div>

            <h2 className="cog-card-title">숫자 기억하기</h2>

            <p className="cog-card-desc">
              화면에 나타난 숫자를 기억해보세요.
            </p>

            <div className="card-info-rows">
              <div className="info-row">
                <span className="info-label">훈련 영역:</span>
                <span className="info-val tag-domain">단기 기억력</span>
              </div>
              <div className="info-row">
                <span className="info-label">상태:</span>
                <span className="info-val tag-status-pending">준비 중</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenComingSoon('숫자 기억하기');
              }}
              className="cog-play-btn senior-btn-pending"
              aria-label="숫자 기억하기. 준비 중인 프로그램 안내 보기"
            >
              <Clock size={22} />
              <span>준비 중</span>
            </button>
          </div>

          {/* Card 3: 순서 기억하기 (준비 중) */}
          <div
            className="cognitive-card card-pending anim-pop"
            onClick={() => handleOpenComingSoon('순서 기억하기')}
          >
            <div className="card-emoji-icon" role="img" aria-label="순서 화살표 아이콘">
              🔄
            </div>

            <h2 className="cog-card-title">순서 기억하기</h2>

            <p className="cog-card-desc">
              나타난 그림의 순서를 기억하고 맞춰보세요.
            </p>

            <div className="card-info-rows">
              <div className="info-row">
                <span className="info-label">훈련 영역:</span>
                <span className="info-val tag-domain">기억력 · 판단력</span>
              </div>
              <div className="info-row">
                <span className="info-label">상태:</span>
                <span className="info-val tag-status-pending">준비 중</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenComingSoon('순서 기억하기');
              }}
              className="cog-play-btn senior-btn-pending"
              aria-label="순서 기억하기. 준비 중인 프로그램 안내 보기"
            >
              <Clock size={22} />
              <span>준비 중</span>
            </button>
          </div>

          {/* Card 4: 다른 그림 찾기 (준비 중) */}
          <div
            className="cognitive-card card-pending anim-pop"
            onClick={() => handleOpenComingSoon('다른 그림 찾기')}
          >
            <div className="card-emoji-icon" role="img" aria-label="돋보기 아이콘">
              🔍
            </div>

            <h2 className="cog-card-title">다른 그림 찾기</h2>

            <p className="cog-card-desc">
              비슷한 그림 속에서 다른 그림을 찾아보세요.
            </p>

            <div className="card-info-rows">
              <div className="info-row">
                <span className="info-label">훈련 영역:</span>
                <span className="info-val tag-domain">집중력 · 관찰력</span>
              </div>
              <div className="info-row">
                <span className="info-label">상태:</span>
                <span className="info-val tag-status-pending">준비 중</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenComingSoon('다른 그림 찾기');
              }}
              className="cog-play-btn senior-btn-pending"
              aria-label="다른 그림 찾기. 준비 중인 프로그램 안내 보기"
            >
              <Clock size={22} />
              <span>준비 중</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Additional Healing & Reminiscence Rooms (Preserved) */}
      <section className="extra-rooms-section">
        <div className="extra-section-header">
          <Sparkles size={24} color="#047857" />
          <h2 className="extra-section-title">🌸 정겨운 추억 &amp; 힐링 교실</h2>
        </div>
        <div className="extra-rooms-grid">
          <div className="extra-room-card anim-pop">
            <div className="room-icon">🧒</div>
            <div className="room-info">
              <h3 className="room-title">나의 어린 시절</h3>
              <p className="room-desc">골목길 놀이 퀴즈와 AI 엽서 만들기, 구슬치기 게임을 즐겨보세요.</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectGame('childhood')}
              className="room-btn senior-btn-childhood"
              aria-label="나의 어린 시절 활동 입장하기"
            >
              <span>입장하기</span>
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="extra-room-card anim-pop">
            <div className="room-icon">📖</div>
            <div className="room-info">
              <h3 className="room-title">책을 읽어주는 방</h3>
              <p className="room-desc">다정한 음성으로 읽어주는 옛날 동화와 아름다운 음악을 감상해보세요.</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectGame('storybook')}
              className="room-btn senior-btn-story"
              aria-label="책을 읽어주는 방 입장하기"
            >
              <span>입장하기</span>
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="extra-room-card anim-pop">
            <div className="room-icon">🌾</div>
            <div className="room-info">
              <h3 className="room-title">전원일기 &amp; 풍경 영상관</h3>
              <p className="room-desc">전원일기 다시보기 및 자연의 편안한 소리와 영상으로 쉬어가세요.</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectGame('video-gallery')}
              className="room-btn senior-btn-video"
              aria-label="전원일기 및 풍경 영상관 입장하기"
            >
              <span>입장하기</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Footer Encouragement */}
      <div className="hub-footer">
        <div className="footer-tip-pill">
          <Heart size={24} color="#15803D" />
          <span>매일 10분씩 좋아하는 활동을 꾸준히 하시면 두뇌 건강에 큰 도움이 됩니다.</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* COMING SOON MODAL (안전한 준비 중 안내)                    */}
      {/* ========================================================= */}
      {comingSoonModal.isOpen && (
        <div className="modal-overlay anim-pop" onClick={handleCloseComingSoon}>
          <div
            className="coming-soon-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-title"
          >
            <button
              type="button"
              onClick={handleCloseComingSoon}
              className="modal-close-icon-btn"
              aria-label="안내 닫기"
            >
              <X size={28} />
            </button>

            <div className="modal-icon-badge">
              <Smile size={56} color="#047857" />
            </div>

            <h2 id="modal-title" className="modal-title">
              {comingSoonModal.title}
            </h2>

            <p className="modal-message">
              새로운 활동을 준비하고 있습니다.<br />
              조금만 기다려주세요.
            </p>

            <button
              type="button"
              onClick={handleCloseComingSoon}
              className="modal-back-btn senior-btn"
              aria-label="인지훈련으로 돌아가기"
            >
              <span>인지훈련으로 돌아가기</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .cognitive-hub-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 24px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .hub-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .hub-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #D1FAE5;
          border: 2px solid #6EE7B7;
          border-radius: 24px;
          padding: 8px 24px;
          font-size: 19px;
          font-weight: 800;
          color: #065F46;
        }

        .hub-title {
          font-size: clamp(34px, 4.5vw, 46px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .hub-sub {
          font-size: clamp(20px, 2.6vw, 24px);
          font-weight: 700;
          color: #334155;
          line-height: 1.5;
          margin: 0;
        }

        /* 4 Main Cards Grid */
        .programs-section {
          width: 100%;
        }

        .cognitive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 24px;
        }

        .cognitive-card {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 28px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          min-height: 380px;
        }

        .cognitive-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 30px rgba(15, 23, 42, 0.1);
        }

        .card-active {
          border-color: #10B981;
          background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);
          box-shadow: 0 10px 24px rgba(16, 185, 129, 0.12);
        }

        .card-active:hover {
          border-color: #059669;
        }

        .card-pending {
          cursor: pointer;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
        }

        .card-emoji-icon {
          font-size: 52px;
          line-height: 1;
          margin-bottom: 16px;
        }

        .cog-card-title {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 8px 0;
        }

        .cog-card-desc {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
          line-height: 1.45;
          margin: 0 0 20px 0;
          flex-grow: 1;
        }

        .card-info-rows {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 22px;
          padding-top: 12px;
          border-top: 2px solid #F1F5F9;
        }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 16px;
          gap: 6px;
        }

        .info-label {
          font-weight: 700;
          color: #64748B;
        }

        .info-val {
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 15px;
        }

        .tag-domain {
          background-color: #E0F2FE;
          color: #0369A1;
        }

        .tag-diff {
          background-color: #DCFCE7;
          color: #166534;
        }

        .tag-status-pending {
          background-color: #F1F5F9;
          color: #64748B;
          border: 1px solid #CBD5E1;
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
          box-shadow: 0 4px 14px rgba(15, 118, 110, 0.3);
        }

        .senior-btn-primary:hover {
          filter: brightness(1.06);
          transform: translateY(-2px);
        }

        .senior-btn-pending {
          background-color: #F1F5F9;
          border-color: #CBD5E1;
          color: #64748B;
        }

        .senior-btn-pending:hover {
          background-color: #E2E8F0;
        }

        /* Extra rooms section */
        .extra-rooms-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding-top: 10px;
        }

        .extra-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .extra-section-title {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .extra-rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .extra-room-card {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 24px;
          padding: 22px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .room-icon {
          font-size: 40px;
          line-height: 1;
          flex-shrink: 0;
        }

        .room-info {
          flex-grow: 1;
        }

        .room-title {
          font-size: 21px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 4px 0;
        }

        .room-desc {
          font-size: 16px;
          font-weight: 600;
          color: #475569;
          line-height: 1.35;
          margin: 0;
        }

        .room-btn {
          padding: 12px 18px;
          min-height: 52px;
          border-radius: 14px;
          font-size: 18px;
          font-weight: 900;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          border: none;
          flex-shrink: 0;
        }

        .senior-btn-childhood {
          background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
        }

        .senior-btn-story {
          background: linear-gradient(135deg, #0F766E 0%, #0D9488 100%);
        }

        .senior-btn-video {
          background: linear-gradient(135deg, #7E22CE 0%, #6B21A8 100%);
        }

        /* Footer */
        .hub-footer {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        .footer-tip-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background-color: #F0FDF4;
          border: 2px solid #BBF7D0;
          border-radius: 24px;
          padding: 14px 28px;
          font-size: 19px;
          font-weight: 800;
          color: #166534;
          text-align: center;
        }

        /* Coming Soon Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .coming-soon-modal {
          background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);
          border: 4px solid #86EFAC;
          border-radius: 32px;
          padding: 40px 32px;
          max-width: 520px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-close-icon-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
        }

        .modal-close-icon-btn:hover {
          background-color: #F1F5F9;
        }

        .modal-icon-badge {
          background-color: #DCFCE7;
          border: 3px solid #86EFAC;
          border-radius: 50%;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 28px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 12px 0;
        }

        .modal-message {
          font-size: 22px;
          font-weight: 700;
          color: #334155;
          line-height: 1.5;
          margin: 0 0 28px 0;
        }

        .modal-back-btn {
          width: 100%;
          min-height: 60px;
          background: linear-gradient(135deg, #0F766E 0%, #047857 100%);
          border: 3px solid #065F46;
          border-radius: 20px;
          color: #FFFFFF;
          font-size: 22px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(15, 118, 110, 0.3);
        }

        .modal-back-btn:hover {
          filter: brightness(1.08);
        }

        @media (max-width: 768px) {
          .cognitive-grid {
            grid-template-columns: 1fr;
          }
          .extra-room-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .room-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
