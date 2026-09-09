import React from 'react';
import {
  CalendarCheck,
  Play,
  ArrowRight,
  Heart,
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

  const dailySteps: {
    stepNum: number;
    title: string;
    sub: string;
    emoji: string;
    gameType: GameType;
    category: string;
    estimatedMin: string;
  }[] = [
    {
      stepNum: 1,
      title: '🧩 같은 그림 찾기 (기억력 깨우기)',
      sub: '두뇌를 부드럽게 깨우는 카드 짝 맞추기 활동입니다.',
      emoji: '🧩',
      gameType: 'card-match',
      category: '기억력 & 집중력',
      estimatedMin: '3분',
    },
    {
      stepNum: 2,
      title: '🔢 일상 순서 맞추기 (사고력 기르기)',
      sub: '일상생활의 친숙한 순서를 차례대로 배열해보세요.',
      emoji: '🔢',
      gameType: 'sequence',
      category: '사고력 & 판단력',
      estimatedMin: '3분',
    },
    {
      stepNum: 3,
      title: '📖 동화와 동요로 편안한 마무리 (힐링 회상)',
      sub: '정겨운 옛 동요 멜로디와 함께 다정한 목소리를 들으며 쉬어갑니다.',
      emoji: '📖',
      gameType: 'storybook',
      category: '정서 힐링 & 회상',
      estimatedMin: '4분',
    },
  ];

  return (
    <div className="today-learning-container anim-pop">
      {/* Header Banner */}
      <div className="today-header">
        <div className="today-date-badge">
          <CalendarCheck size={26} color="#047857" />
          <span>{todayFormatted} 추천 학습</span>
        </div>
        <h2 className="today-title">📅 오늘의 맞춤 학습 코스 🌸</h2>
        <p className="today-sub">
          매일 10분, 3가지 가벼운 활동으로 두뇌 건강과 활력을 채워보세요.
        </p>

        <button
          onClick={() => onStartActivity('card-match')}
          className="today-start-all-btn senior-btn"
          aria-label="오늘의 학습 1단계부터 시작하기"
        >
          <Play size={28} fill="currentColor" />
          <span>오늘 코스 시작하기 (1단계부터)</span>
          <ArrowRight size={24} />
        </button>
      </div>

      {/* 3 Step Cards */}
      <div className="steps-flow-container">
        {dailySteps.map((step) => (
          <div key={step.stepNum} className="step-card anim-pop">
            <div className="step-number-col">
              <div className="step-circle">
                <span>{step.stepNum}단계</span>
              </div>
            </div>

            <div className="step-content-col">
              <div className="step-badge-row">
                <span className="step-cat-tag">{step.category}</span>
                <span className="step-time-tag">⏱️ 약 {step.estimatedMin} 소요</span>
              </div>

              <h3 className="step-title">{step.title}</h3>
              <p className="step-sub">{step.sub}</p>
            </div>

            <div className="step-action-col">
              <button
                onClick={() => onStartActivity(step.gameType)}
                className="step-start-btn senior-btn"
                aria-label={`${step.title} 바로 시작하기`}
              >
                <Play size={22} fill="currentColor" />
                <span>시작</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reassurance */}
      <div className="today-footer-box">
        <Heart size={24} color="#047857" />
        <span>정답을 틀리셔도 괜찮습니다. 편안한 마음으로 즐겁게 참여해주세요!</span>
      </div>

      <style>{`
        .today-learning-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 30px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .today-header {
          background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);
          border: 4px solid #86EFAC;
          border-radius: 32px;
          padding: 36px 30px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          box-shadow: 0 12px 28px rgba(15, 118, 110, 0.08);
        }

        .today-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #D1FAE5;
          border: 2px solid #6EE7B7;
          border-radius: 20px;
          padding: 8px 20px;
          font-size: 19px;
          font-weight: 800;
          color: #065F46;
        }

        .today-title {
          font-size: clamp(30px, 4vw, 40px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .today-sub {
          font-size: clamp(19px, 2.5vw, 22px);
          font-weight: 700;
          color: #334155;
          margin: 0;
        }

        .today-start-all-btn {
          margin-top: 10px;
          min-height: 66px;
          padding: 16px 36px;
          background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
          border: 3px solid #9A3412;
          border-radius: 22px;
          color: #FFFFFF;
          font-size: 23px;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(234, 88, 12, 0.35);
        }

        .today-start-all-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
        }

        /* Steps flow */
        .steps-flow-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .step-card {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 26px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        .step-card:hover {
          transform: translateY(-3px);
          border-color: #10B981;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }

        .step-circle {
          background: linear-gradient(135deg, #0F766E 0%, #047857 100%);
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 900;
          width: 72px;
          height: 72px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(15, 118, 110, 0.25);
        }

        .step-content-col {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .step-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .step-cat-tag {
          background-color: #E0F2FE;
          color: #0369A1;
          font-size: 14px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .step-time-tag {
          font-size: 14px;
          font-weight: 700;
          color: #64748B;
        }

        .step-title {
          font-size: 24px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .step-sub {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
          margin: 0;
          line-height: 1.4;
        }

        .step-action-col {
          flex-shrink: 0;
        }

        .step-start-btn {
          min-height: 56px;
          padding: 12px 24px;
          border-radius: 18px;
          font-size: 20px;
          font-weight: 900;
          background-color: #0F766E;
          border: 2px solid #115E59;
          color: #FFFFFF;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 0 #134E4A;
        }

        .step-start-btn:hover {
          background-color: #115E59;
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
          .today-header {
            padding: 24px 18px;
          }
          .step-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
          }
          .step-action-col {
            width: 100%;
          }
          .step-start-btn {
            width: 100%;
          }
          .today-start-all-btn {
            font-size: 20px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
