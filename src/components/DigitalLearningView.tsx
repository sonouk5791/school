import React from 'react';
import {
  Smartphone,
  CreditCard,
  MessageCircle,
  Clock,
  Brain,
  Home,
} from 'lucide-react';
import type { NavTab } from './Header';

interface DigitalLearningViewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const DigitalLearningView: React.FC<DigitalLearningViewProps> = ({
  onNavigateTab,
}) => {
  const futureCourses = [
    {
      title: '스마트폰 글자 크기 & 화면 밝기 조절',
      desc: '눈이 편안하게 스마트폰 화면을 맞추는 방법을 배워봅니다.',
      icon: <Smartphone size={36} color="#0369A1" />,
      status: '준비 중',
    },
    {
      title: '카카오톡 가족에게 사진 보내기',
      desc: '자녀와 손주에게 정겨운 사진과 메시지를 쉽게 전해보세요.',
      icon: <MessageCircle size={36} color="#D97706" />,
      status: '준비 중',
    },
    {
      title: '병원 · 식당 무인 키오스크 주문 연습',
      desc: '실제 키오스크 화면과 똑같이 누르며 천천히 주문하는 연습입니다.',
      icon: <CreditCard size={36} color="#7C3AED" />,
      status: '준비 중',
    },
  ];

  return (
    <div className="digital-learning-container anim-pop">
      {/* Notice Card */}
      <div className="notice-hero-card">
        <div className="notice-badge">
          <Clock size={24} color="#D97706" />
          <span>콘텐츠 제작 안내</span>
        </div>

        <h2 className="notice-title">📱 디지털 배우기 강좌 준비 중입니다</h2>

        <p className="notice-desc">
          어르신들께서 스마트폰과 키오스크를 두려움 없이 쉽고 천천히 배우실 수 있도록,
          <br />
          <strong>실제 화면과 똑같은 맞춤형 디지털 연습 강좌</strong>를 정성껏 준비하고 있습니다.
        </p>

        <div className="notice-actions-row">
          <button
            onClick={() => onNavigateTab('cognitive')}
            className="notice-action-btn primary senior-btn"
          >
            <Brain size={24} />
            <span>🧠 인지훈련 먼저 하러 가기</span>
          </button>

          <button
            onClick={() => onNavigateTab('home')}
            className="notice-action-btn secondary senior-btn"
          >
            <Home size={24} />
            <span>🏠 처음 홈으로 돌아가기</span>
          </button>
        </div>
      </div>

      {/* Course Previews */}
      <div className="preview-section">
        <h3 className="preview-section-title">✨ 곧 찾아올 디지털 강좌 미리보기</h3>

        <div className="preview-grid">
          {futureCourses.map((course, idx) => (
            <div key={idx} className="preview-card">
              <div className="preview-icon-box">{course.icon}</div>
              <div className="preview-content">
                <span className="preview-status-pill">{course.status}</span>
                <h4 className="preview-card-title">{course.title}</h4>
                <p className="preview-card-desc">{course.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .digital-learning-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 30px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .notice-hero-card {
          background: linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 100%);
          border: 4px solid #FCD34D;
          border-radius: 32px;
          padding: 44px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          box-shadow: 0 12px 28px rgba(217, 119, 6, 0.1);
        }

        .notice-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #FEF3C7;
          border: 2px solid #FDE68A;
          border-radius: 20px;
          padding: 6px 18px;
          font-size: 18px;
          font-weight: 800;
          color: #92400E;
        }

        .notice-title {
          font-size: clamp(28px, 4vw, 38px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .notice-desc {
          font-size: clamp(19px, 2.5vw, 22px);
          font-weight: 700;
          color: #475569;
          line-height: 1.6;
          margin: 0;
          max-width: 780px;
        }

        .notice-actions-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-top: 10px;
          width: 100%;
        }

        .notice-action-btn {
          min-height: 60px;
          padding: 14px 28px;
          border-radius: 20px;
          font-size: 21px;
          font-weight: 900;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .notice-action-btn.primary {
          background: linear-gradient(135deg, #0F766E 0%, #047857 100%);
          border: 3px solid #065F46;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(15, 118, 110, 0.3);
        }

        .notice-action-btn.secondary {
          background-color: #FFFFFF;
          border: 3px solid #CBD5E1;
          color: #1E293B;
        }

        .preview-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .preview-section-title {
          font-size: 24px;
          font-weight: 900;
          color: #0F172A;
          text-align: left;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .preview-card {
          background-color: #FFFFFF;
          border: 2px solid #E2E8F0;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04);
        }

        .preview-icon-box {
          width: 60px;
          height: 60px;
          background-color: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-status-pill {
          display: inline-block;
          background-color: #FEF3C7;
          border: 1px solid #FDE68A;
          color: #B45309;
          font-size: 13px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 8px;
          margin-bottom: 6px;
        }

        .preview-card-title {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 6px 0;
        }

        .preview-card-desc {
          font-size: 17px;
          font-weight: 600;
          color: #64748B;
          margin: 0;
          line-height: 1.45;
        }

        @media (max-width: 768px) {
          .notice-hero-card {
            padding: 30px 18px;
          }
          .notice-actions-row {
            flex-direction: column;
          }
          .notice-action-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
