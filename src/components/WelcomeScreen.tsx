import React, { useState } from 'react';
import { Activity, Heart, Settings, Layers, Hash, Type, BookOpen, HelpCircle, Sparkles, Video } from 'lucide-react';
import type { GameType } from '../types/game';

interface WelcomeScreenProps {
  onSelectGame: (gameType: GameType) => void;
  onOpenDevModal: () => void;
  onOpenGuide: () => void;
  currentLevel: number;
  onSetLevel: (level: number) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectGame,
  onOpenDevModal,
  onOpenGuide,
  currentLevel,
  onSetLevel,
}) => {
  const [showCaregiverQuickSetup, setShowCaregiverQuickSetup] = useState<boolean>(false);

  return (
    <div className="welcome-container">
      <main className="welcome-card anim-pop">
        <div className="welcome-badge">
          <Activity size={32} color="#0F766E" />
          <span>매일 건강한 습관 · 기억력 · 사고력 · 언어력 · 회상 감성 두뇌 학교</span>
        </div>

        <h1 className="welcome-title">
          오늘의 두뇌 학교 🌸
        </h1>

        <p className="welcome-desc">
          원하시는 두뇌 운동 및 힐링 이야기 방을 선택하여 차분하게 시작해보세요.
        </p>

        {/* Beginner Guide Banner Button */}
        <div className="first-timer-banner">
          <button
            onClick={onOpenGuide}
            className="guide-banner-btn"
            aria-label="처음 이용하시는 분을 위한 쉬운 가이드 열기"
          >
            <HelpCircle size={32} color="#0D9488" />
            <div className="banner-text">
              <span className="banner-title">💡 처음 오셨나요? 쉬운 이용 방법 보기</span>
              <span className="banner-sub">단계별 큰 글씨 설명과 그림 안내를 바로 확인하실 수 있습니다.</span>
            </div>
          </button>
        </div>

        {/* Six Senior Main Activity Buttons */}
        <div className="game-selection-grid">
          <button
            onClick={() => onSelectGame('card-match')}
            className="senior-btn game-select-btn card-match-btn"
            aria-label="그림 카드 맞추기 시작하기"
          >
            <Layers size={40} color="#FFFFFF" />
            <div className="btn-text-group">
              <span className="btn-title">🧩 그림 카드 맞추기</span>
              <span className="btn-sub">기억력 &amp; 집중력 운동</span>
            </div>
          </button>

          <button
            onClick={() => onSelectGame('sequence')}
            className="senior-btn game-select-btn sequence-btn"
            aria-label="일상 순서 배열하기 시작하기"
          >
            <Hash size={40} color="#FFFFFF" />
            <div className="btn-text-group">
              <span className="btn-title">🔢 일상 순서 배열하기</span>
              <span className="btn-sub">사고력 &amp; 순서 인지 운동</span>
            </div>
          </button>

          <button
            onClick={() => onSelectGame('hangeul')}
            className="senior-btn game-select-btn hangeul-btn"
            aria-label="한글 낱말 맞추기 시작하기"
          >
            <Type size={40} color="#FFFFFF" />
            <div className="btn-text-group">
              <span className="btn-title">🔤 한글 낱말 맞추기</span>
              <span className="btn-sub">언어력 &amp; 자음/모음/낱말 운동</span>
            </div>
          </button>

          <button
            onClick={() => onSelectGame('storybook')}
            className="senior-btn game-select-btn storybook-btn"
            aria-label="책을 읽어주는 방 시작하기"
          >
            <BookOpen size={40} color="#FFFFFF" />
            <div className="btn-text-group">
              <span className="btn-title">📖 책을 읽어주는 방</span>
              <span className="btn-sub">따뜻한 이야기 책 낭독 &amp; 나만의 책 만들기</span>
            </div>
          </button>

          <button
            onClick={() => onSelectGame('video-gallery')}
            className="senior-btn game-select-btn video-gallery-btn"
            aria-label="추억 영상 앨범관 시작하기"
          >
            <Video size={40} color="#FFFFFF" />
            <div className="btn-text-group">
              <span className="btn-title">🎥 추억 영상 앨범관</span>
              <span className="btn-sub">힐링 풍경 영상 감상 &amp; 나만의 영상 만들기</span>
            </div>
          </button>

          <button
            onClick={() => onSelectGame('childhood')}
            className="senior-btn game-select-btn childhood-btn"
            aria-label="나의 어린 시절 회상 인지활동 시작하기"
          >
            <Sparkles size={40} color="#FFFFFF" />
            <div className="btn-text-group">
              <span className="btn-title">🧒 나의 어린 시절</span>
              <span className="btn-sub">추억 퀴즈 · 회상 엽서 만들기 · 그 시절 동요</span>
            </div>
          </button>
        </div>

        {/* Respectful adult note */}
        <div className="welcome-footer-info">
          <Heart size={24} color="#15803D" />
          <span>천천히 진행하셔도 좋습니다. 편안하게 참여해 주세요.</span>
        </div>

        {/* Caregiver Setup Toggle */}
        <div className="caregiver-section">
          <button
            onClick={() => setShowCaregiverQuickSetup(!showCaregiverQuickSetup)}
            className="caregiver-link"
            aria-label="보호자 설정을 표시하거나 숨깁니다"
          >
            <Settings size={20} />
            <span>보호자 초기 설정 {showCaregiverQuickSetup ? '▲' : '▼'}</span>
          </button>

          {showCaregiverQuickSetup && (
            <div className="caregiver-quick-box anim-pop">
              <p className="quick-title">⚙️ 보호자 추천 시작 난이도 설정 (모든 활동 공통)</p>
              <div className="quick-level-buttons">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSetLevel(lvl)}
                    className={`quick-lvl-btn ${currentLevel === lvl ? 'active' : ''}`}
                  >
                    {lvl}단계 {lvl === 1 ? '(처음/쉬움)' : lvl === 5 ? '(높음)' : ''}
                  </button>
                ))}
              </div>
              <button onClick={onOpenDevModal} className="dev-modal-link">
                📊 활동 기록 대시보드 열기
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .welcome-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(180deg, #FAF8F5 0%, #F0FDF4 100%);
        }

        .welcome-card {
          background-color: #FFFFFF;
          border: 4px solid #0F766E;
          border-radius: 32px;
          padding: 36px 32px;
          max-width: 800px;
          width: 100%;
          text-align: center;
          box-shadow: 0 16px 36px rgba(15, 118, 110, 0.12);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #CCFBF1;
          border: 2px solid #5EEAD4;
          border-radius: 24px;
          padding: 8px 24px;
          font-size: 18px;
          font-weight: 700;
          color: #0F766E;
          margin-bottom: 16px;
        }

        .welcome-title {
          font-size: clamp(34px, 5vw, 44px);
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .welcome-desc {
          font-size: clamp(20px, 3vw, 24px);
          font-weight: 700;
          color: #334155;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .game-selection-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
          margin-bottom: 24px;
        }

        .game-select-btn {
          width: 100%;
          padding: 18px 26px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 18px;
          text-align: left;
        }

        .card-match-btn {
          background-color: #0F766E;
          border-color: #115E59;
          box-shadow: 0 5px 0 #134E4A;
          color: #FFFFFF;
        }

        .sequence-btn {
          background-color: #1E3A8A;
          border-color: #1E40AF;
          box-shadow: 0 5px 0 #1E3A8A;
          color: #FFFFFF;
        }

        .hangeul-btn {
          background-color: #9333EA;
          border-color: #7E22CE;
          box-shadow: 0 5px 0 #6B21A8;
          color: #FFFFFF;
        }

        .storybook-btn {
          background-color: #0F766E;
          border-color: #115E59;
          box-shadow: 0 5px 0 #134E4A;
          color: #FFFFFF;
        }

        .video-gallery-btn {
          background-color: #7E22CE;
          border-color: #6B21A8;
          box-shadow: 0 5px 0 #581C87;
          color: #FFFFFF;
        }

        .childhood-btn {
          background: linear-gradient(135deg, #D97706 0%, #EA580C 100%);
          border-color: #B45309;
          box-shadow: 0 5px 0 #9A3412;
          color: #FFFFFF;
        }

        .btn-text-group {
          display: flex;
          flex-direction: column;
        }

        .btn-title {
          font-size: 26px;
          font-weight: 900;
          line-height: 1.2;
        }

        .btn-sub {
          font-size: 17px;
          font-weight: 700;
          opacity: 0.9;
          margin-top: 2px;
        }

        .first-timer-banner {
          width: 100%;
          margin-bottom: 20px;
        }

        .guide-banner-btn {
          width: 100%;
          background: linear-gradient(135deg, #CCFBF1 0%, #E0F2FE 100%);
          border: 3px solid #0D9488;
          border-radius: 20px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
          text-align: left;
        }

        .guide-banner-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(13, 148, 136, 0.25);
        }

        .guide-banner-btn:active {
          transform: scale(0.98);
        }

        .banner-text {
          display: flex;
          flex-direction: column;
        }

        .banner-title {
          font-size: 20px;
          font-weight: 900;
          color: #0F766E;
        }

        .banner-sub {
          font-size: 15px;
          font-weight: 700;
          color: #0369A1;
          margin-top: 2px;
        }

        .welcome-footer-info {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 19px;
          font-weight: 700;
          color: #15803D;
          background-color: #F0FDF4;
          padding: 10px 22px;
          border-radius: 18px;
          border: 2px solid #BBF7D0;
          margin-bottom: 20px;
        }

        .caregiver-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .caregiver-link {
          background: none;
          border: none;
          font-size: 17px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
        }

        .caregiver-quick-box {
          margin-top: 12px;
          background-color: #F8FAFC;
          border: 2px solid #CBD5E1;
          border-radius: 18px;
          padding: 16px 20px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quick-title {
          font-size: 16px;
          font-weight: 700;
          color: #334155;
        }

        .quick-level-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .quick-lvl-btn {
          padding: 8px 14px;
          font-size: 15px;
          font-weight: 700;
          border: 2px solid #CBD5E1;
          border-radius: 10px;
          background-color: #FFFFFF;
          cursor: pointer;
        }

        .quick-lvl-btn.active {
          background-color: #0F766E;
          color: #FFFFFF;
          border-color: #115E59;
        }

        .dev-modal-link {
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 700;
          color: #0F766E;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
