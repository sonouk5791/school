import React from 'react';
import {
  CalendarCheck,
  Play,
  ArrowRight,
  Heart,
  Sparkles,
  Award,
} from 'lucide-react';
import type { GameType } from '../types/game';

interface TodaysLearningViewProps {
  onStartActivity: (gameType: GameType) => void;
}

export const TodaysLearningView: React.FC<TodaysLearningViewProps> = ({
  onStartActivity,
}) => {
  const todayFormatted = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="today-learning-container anim-pop">
      {/* 1. Header Banner */}
      <div className="today-header">
        <div className="today-date-badge">
          <CalendarCheck size={26} color="#047857" />
          <span>{todayFormatted} 오늘의 학습</span>
        </div>
        <h1 className="today-title">오늘도 즐겁게 시작해볼까요?</h1>
        <p className="today-sub">
          매일 가벼운 두뇌 활동으로 기억력과 집중력을 재미있게 깨워보세요.
        </p>
      </div>

      {/* 2. Today's Recommended Main Activity (같은 그림 찾기) */}
      <section className="recommendation-hero-card anim-pop" aria-label="오늘의 추천 활동">
        <div className="rec-badge-row">
          <span className="rec-badge-pill">
            <Sparkles size={20} />
            <span>오늘의 추천 활동</span>
          </span>
          <span className="rec-domain-tag">기억력 · 집중력</span>
        </div>

        <div className="rec-main-body">
          <div className="rec-icon-box">🧩</div>
          <div className="rec-text-col">
            <h2 className="rec-activity-title">같은 그림 찾기</h2>
            <p className="rec-activity-desc">
              카드의 위치를 기억하며 기억력과 집중력을 연습해보세요.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartActivity('card-match')}
          className="rec-start-btn senior-btn"
          aria-label="오늘의 활동 시작하기. 같은 그림 찾기 게임으로 이동합니다."
        >
          <Play size={28} fill="currentColor" />
          <span>오늘의 활동 시작하기</span>
          <ArrowRight size={26} />
        </button>
      </section>

      {/* 3. Additional Daily Steps */}
      <section className="extra-steps-section">
        <div className="extra-steps-header">
          <Award size={24} color="#0F766E" />
          <h2 className="extra-steps-title">함께 하면 더 좋은 활동</h2>
        </div>

        <div className="extra-step-card anim-pop">
          <div className="step-num-circle">2</div>
          <div className="step-info-col">
            <span className="step-cat">추억 회상 교실</span>
            <h3 className="step-title">나의 어린 시절 추억방</h3>
            <p className="step-desc">골목길 놀이 퀴즈와 사진 갤러리, 추억 소리를 함께 즐겨보세요.</p>
          </div>
          <button
            type="button"
            onClick={() => onStartActivity('childhood')}
            className="step-btn-play senior-btn"
            aria-label="나의 어린 시절 시작하기"
          >
            <Play size={20} fill="currentColor" />
            <span>시작</span>
          </button>
        </div>

        <div className="extra-step-card anim-pop">
          <div className="step-num-circle">3</div>
          <div className="step-info-col">
            <span className="step-cat">영상 &amp; 힐링</span>
            <h3 className="step-title">전원일기 다시보기 &amp; 풍경 영상</h3>
            <p className="step-desc">정겨운 전원일기 영상과 편안한 풍경으로 마음을 편안히 쉬어갑니다.</p>
          </div>
          <button
            type="button"
            onClick={() => onStartActivity('video-gallery')}
            className="step-btn-play senior-btn"
            aria-label="전원일기 및 풍경 영상관 시작하기"
          >
            <Play size={20} fill="currentColor" />
            <span>시작</span>
          </button>
        </div>
      </section>

      {/* 4. Warm Reassurance Footer */}
      <div className="today-footer-box">
        <Heart size={24} color="#047857" />
        <span>정답을 틀리셔도 괜찮습니다. 편안한 마음으로 즐겁게 참여해주세요! 🌸</span>
      </div>

      <style>{`
        .today-learning-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .today-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .today-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #D1FAE5;
          border: 2px solid #6EE7B7;
          border-radius: 24px;
          padding: 8px 22px;
          font-size: 19px;
          font-weight: 800;
          color: #065F46;
        }

        .today-title {
          font-size: clamp(34px, 4.5vw, 44px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .today-sub {
          font-size: clamp(20px, 2.6vw, 23px);
          font-weight: 700;
          color: #334155;
          margin: 0;
          line-height: 1.5;
        }

        /* Recommendation Hero Card */
        .recommendation-hero-card {
          background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);
          border: 4px solid #86EFAC;
          border-radius: 32px;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 12px 28px rgba(15, 118, 110, 0.1);
        }

        .rec-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .rec-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #FEF3C7;
          border: 2px solid #F59E0B;
          color: #92400E;
          font-size: 18px;
          font-weight: 900;
          padding: 6px 18px;
          border-radius: 16px;
        }

        .rec-domain-tag {
          background-color: #E0F2FE;
          color: #0369A1;
          font-size: 16px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 12px;
        }

        .rec-main-body {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .rec-icon-box {
          font-size: 64px;
          line-height: 1;
          flex-shrink: 0;
        }

        .rec-text-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rec-activity-title {
          font-size: 32px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .rec-activity-desc {
          font-size: 20px;
          font-weight: 600;
          color: #334155;
          margin: 0;
          line-height: 1.5;
        }

        .rec-start-btn {
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
          gap: 16px;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(234, 88, 12, 0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .rec-start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(234, 88, 12, 0.45);
        }

        /* Extra Steps */
        .extra-steps-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .extra-steps-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .extra-steps-title {
          font-size: 24px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .extra-step-card {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 24px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
          transition: border-color 0.2s, transform 0.2s;
        }

        .extra-step-card:hover {
          border-color: #10B981;
          transform: translateY(-2px);
        }

        .step-num-circle {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background-color: #D1FAE5;
          border: 2px solid #6EE7B7;
          color: #065F46;
          font-size: 22px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-info-col {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }

        .step-cat {
          font-size: 14px;
          font-weight: 800;
          color: #0F766E;
        }

        .step-title {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .step-desc {
          font-size: 17px;
          font-weight: 600;
          color: #475569;
          margin: 0;
        }

        .step-btn-play {
          padding: 12px 24px;
          min-height: 52px;
          border-radius: 16px;
          font-size: 19px;
          font-weight: 900;
          background-color: #0F766E;
          border: 2px solid #065F46;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .step-btn-play:hover {
          background-color: #065F46;
        }

        .today-footer-box {
          background-color: #F0FDF4;
          border: 2px solid #BBF7D0;
          border-radius: 20px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 19px;
          font-weight: 800;
          color: #166534;
          text-align: center;
        }

        @media (max-width: 768px) {
          .recommendation-hero-card {
            padding: 24px 20px;
          }
          .rec-main-body {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .extra-step-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .step-btn-play {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
