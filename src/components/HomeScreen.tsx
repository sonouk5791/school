import React, { useState } from 'react';
import {
  Brain,
  Smartphone,
  Gamepad2,
  BarChart3,
  Play,
  HelpCircle,
  Heart,
  Sparkles,
  ArrowRight,
  Clock,
  Settings,
} from 'lucide-react';
import type { NavTab } from './Header';

interface HomeScreenProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenGuide: () => void;
  onOpenCaregiver: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenGuide,
  onOpenCaregiver,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showUnderConstruction = (featureName: string) => {
    setToastMessage(`📢 [${featureName}] 메뉴는 어르신을 위해 열심히 준비 중입니다. 곧 찾아뵙겠습니다!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="home-screen-container anim-pop">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="home-toast-banner anim-pop">
          <Clock size={24} color="#D97706" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="toast-close-btn">
            확인
          </button>
        </div>
      )}

      {/* 1. Main Hero Area */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={24} color="#047857" />
          <span>어르신을 위한 맞춤형 두뇌 &amp; 디지털 배움터</span>
        </div>

        <h1 className="hero-title">
          배우는 즐거움이 있는 <span className="highlight-text">디지털 학교</span>
        </h1>

        <p className="hero-subtitle">
          쉽고 재미있는 활동으로 디지털 생활과 두뇌 건강을 함께 시작해보세요.
        </p>

        <div className="hero-action-group">
          <button
            onClick={() => onNavigateTab('today')}
            className="hero-main-cta-btn senior-btn"
            aria-label="오늘 학습 시작하기. 오늘의 추천 학습 코스로 이동합니다."
          >
            <Play size={32} fill="currentColor" />
            <span>오늘 학습 시작하기</span>
            <ArrowRight size={28} />
          </button>
        </div>
      </section>

      {/* 2. Four Main Learning Menu Cards */}
      <section className="main-cards-section" aria-label="주요 학습 메뉴">
        <div className="section-title-box">
          <h2 className="section-title">📚 주요 학습 과정</h2>
          <p className="section-sub">원하시는 과정을 선택하여 편안하게 배움을 시작해보세요.</p>
        </div>

        <div className="learning-cards-grid">
          {/* Card 1: 인지훈련 */}
          <div className="learning-card active-card anim-pop">
            <div className="card-header-row">
              <div className="card-icon-wrapper icon-cognitive">
                <Brain size={44} color="#047857" />
              </div>
              <span className="card-status-tag tag-ready">이용 가능</span>
            </div>

            <h3 className="card-title">인지훈련</h3>
            <p className="card-desc">
              기억력과 집중력을 재미있는 활동으로 훈련해보세요.
            </p>

            <button
              onClick={() => onNavigateTab('cognitive')}
              className="card-action-btn senior-btn-primary"
              aria-label="인지훈련 시작하기"
            >
              <Play size={22} fill="currentColor" />
              <span>시작하기</span>
            </button>
          </div>

          {/* Card 2: 스마트폰 배우기 */}
          <div
            className="learning-card pending-card"
            onClick={() => showUnderConstruction('스마트폰 배우기')}
          >
            <div className="card-header-row">
              <div className="card-icon-wrapper icon-phone">
                <Smartphone size={44} color="#0369A1" />
              </div>
              <span className="card-status-tag tag-pending">준비 중</span>
            </div>

            <h3 className="card-title">스마트폰 배우기</h3>
            <p className="card-desc">
              스마트폰의 기본 기능을 쉽고 천천히 배워보세요.
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showUnderConstruction('스마트폰 배우기');
              }}
              className="card-action-btn btn-pending"
              aria-label="스마트폰 배우기. 준비 중인 서비스입니다."
            >
              <span>준비 중</span>
            </button>
          </div>

          {/* Card 3: 게임으로 배우기 */}
          <div
            className="learning-card pending-card"
            onClick={() => showUnderConstruction('게임으로 배우기')}
          >
            <div className="card-header-row">
              <div className="card-icon-wrapper icon-game">
                <Gamepad2 size={44} color="#7C3AED" />
              </div>
              <span className="card-status-tag tag-pending">준비 중</span>
            </div>

            <h3 className="card-title">게임으로 배우기</h3>
            <p className="card-desc">
              재미있는 게임을 통해 자연스럽게 학습해보세요.
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showUnderConstruction('게임으로 배우기');
              }}
              className="card-action-btn btn-pending"
              aria-label="게임으로 배우기. 준비 중인 서비스입니다."
            >
              <span>준비 중</span>
            </button>
          </div>

          {/* Card 4: 나의 학습 기록 */}
          <div
            className="learning-card pending-card"
            onClick={() => onNavigateTab('records')}
          >
            <div className="card-header-row">
              <div className="card-icon-wrapper icon-chart">
                <BarChart3 size={44} color="#D97706" />
              </div>
              <span className="card-status-tag tag-ready">기록 보기</span>
            </div>

            <h3 className="card-title">나의 학습 기록</h3>
            <p className="card-desc">
              오늘 무엇을 배웠는지 한눈에 확인해보세요.
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateTab('records');
              }}
              className="card-action-btn btn-records"
              aria-label="나의 학습 기록 확인하기"
            >
              <span>기록 확인하기</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. First Timer Help Banner */}
      <section className="first-timer-section">
        <button
          onClick={onOpenGuide}
          className="first-timer-guide-btn"
          aria-label="처음 오신 분을 위한 쉬운 이용 안내서 보기"
        >
          <div className="guide-btn-icon">
            <HelpCircle size={36} color="#0F766E" />
          </div>
          <div className="guide-btn-text">
            <span className="guide-main-text">💡 처음 오셨나요? 쉬운 이용 방법 보기</span>
            <span className="guide-sub-text">
              글자 크기, 소리 조절, 화면 누르는 방법을 그림으로 친절히 알려드립니다.
            </span>
          </div>
          <ArrowRight size={28} color="#0F766E" className="guide-arrow-icon" />
        </button>
      </section>

      {/* 4. Warm Senior Reassurance Footer */}
      <footer className="home-reassurance-footer">
        <div className="reassurance-pill">
          <Heart size={24} color="#047857" />
          <span>천천히 진행하셔도 좋습니다. 어르신의 속도에 맞춰 함께합니다. 🌸</span>
        </div>

        <button
          onClick={onOpenCaregiver}
          className="home-caregiver-btn"
          aria-label="보호자 설정 및 난이도 관리 열기"
        >
          <Settings size={18} />
          <span>보호자 관리 설정</span>
        </button>
      </footer>

      <style>{`
        .home-screen-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 30px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        /* Toast Banner */
        .home-toast-banner {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border: 3px solid #F59E0B;
          border-radius: 20px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 20px;
          font-weight: 800;
          color: #92400E;
          box-shadow: 0 8px 18px rgba(245, 158, 11, 0.2);
        }

        .toast-close-btn {
          margin-left: auto;
          background-color: #92400E;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(180deg, #FFFFFF 0%, #F4FAF7 100%);
          border: 4px solid #A7F3D0;
          border-radius: 36px;
          padding: 48px 36px;
          text-align: center;
          box-shadow: 0 16px 36px rgba(15, 118, 110, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #D1FAE5;
          border: 2px solid #6EE7B7;
          border-radius: 30px;
          padding: 8px 24px;
          font-size: 19px;
          font-weight: 800;
          color: #065F46;
        }

        .hero-title {
          font-size: clamp(34px, 4.5vw, 48px);
          font-weight: 900;
          color: #0F172A;
          line-height: 1.3;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .highlight-text {
          color: #047857;
          text-decoration: underline;
          text-decoration-color: #A7F3D0;
          text-underline-offset: 8px;
        }

        .hero-subtitle {
          font-size: clamp(20px, 2.8vw, 24px);
          font-weight: 700;
          color: #334155;
          line-height: 1.5;
          max-width: 800px;
          margin: 0;
        }

        .hero-action-group {
          margin-top: 12px;
          width: 100%;
          max-width: 520px;
        }

        .hero-main-cta-btn {
          width: 100%;
          min-height: 72px;
          background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
          color: #FFFFFF;
          border: 3px solid #9A3412;
          border-radius: 24px;
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

        .hero-main-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(234, 88, 12, 0.45);
        }

        .hero-main-cta-btn:active {
          transform: translateY(2px);
          box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3);
        }

        /* Learning Cards Section */
        .main-cards-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section-title-box {
          text-align: left;
        }

        .section-title {
          font-size: 30px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 4px;
        }

        .section-sub {
          font-size: 19px;
          font-weight: 700;
          color: #475569;
        }

        .learning-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 22px;
        }

        .learning-card {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 28px;
          padding: 30px 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          min-height: 290px;
        }

        .learning-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.1);
        }

        .active-card {
          border-color: #6EE7B7;
          background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);
        }

        .active-card:hover {
          border-color: #059669;
        }

        .pending-card {
          cursor: pointer;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
        }

        .card-header-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .card-icon-wrapper {
          width: 68px;
          height: 68px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-cognitive {
          background-color: #D1FAE5;
          border: 2px solid #A7F3D0;
        }

        .icon-phone {
          background-color: #E0F2FE;
          border: 2px solid #BAE6FD;
        }

        .icon-game {
          background-color: #EDE9FE;
          border: 2px solid #DDD6FE;
        }

        .icon-chart {
          background-color: #FEF3C7;
          border: 2px solid #FDE68A;
        }

        .card-status-tag {
          font-size: 14px;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 12px;
        }

        .tag-ready {
          background-color: #D1FAE5;
          color: #065F46;
          border: 1px solid #6EE7B7;
        }

        .tag-pending {
          background-color: #F1F5F9;
          color: #64748B;
          border: 1px solid #CBD5E1;
        }

        .card-title {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 8px;
        }

        .card-desc {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
          line-height: 1.45;
          margin-bottom: 24px;
          flex-grow: 1;
        }

        .card-action-btn {
          width: 100%;
          min-height: 56px;
          border-radius: 18px;
          font-size: 20px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: background-color 0.15s;
        }

        .btn-pending {
          background-color: #F1F5F9;
          border: 2px solid #CBD5E1;
          color: #64748B;
        }

        .btn-records {
          background-color: #FEF3C7;
          border: 2px solid #F59E0B;
          color: #B45309;
        }

        .btn-records:hover {
          background-color: #FDE68A;
        }

        /* First Timer Help Section */
        .first-timer-section {
          width: 100%;
        }

        .first-timer-guide-btn {
          width: 100%;
          background: linear-gradient(135deg, #ECFDF5 0%, #E0F2FE 100%);
          border: 3px solid #6EE7B7;
          border-radius: 26px;
          padding: 20px 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          text-align: left;
          box-shadow: 0 8px 20px rgba(15, 118, 110, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .first-timer-guide-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(15, 118, 110, 0.15);
        }

        .guide-btn-icon {
          background-color: #FFFFFF;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 2px solid #A7F3D0;
        }

        .guide-btn-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-grow: 1;
        }

        .guide-main-text {
          font-size: 22px;
          font-weight: 900;
          color: #065F46;
        }

        .guide-sub-text {
          font-size: 17px;
          font-weight: 700;
          color: #0369A1;
        }

        .guide-arrow-icon {
          flex-shrink: 0;
        }

        /* Reassurance Footer */
        .home-reassurance-footer {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        .reassurance-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background-color: #F0FDF4;
          border: 2px solid #BBF7D0;
          border-radius: 24px;
          padding: 12px 28px;
          font-size: 19px;
          font-weight: 800;
          color: #166534;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 32px 20px;
            border-radius: 28px;
          }
          .hero-title {
            font-size: 30px;
          }
          .hero-subtitle {
            font-size: 18px;
          }
          .learning-cards-grid {
            grid-template-columns: 1fr;
          }
          .first-timer-guide-btn {
            padding: 16px 18px;
            gap: 14px;
          }
          .guide-main-text {
            font-size: 19px;
          }
          .guide-sub-text {
            font-size: 15px;
          }
          .guide-arrow-icon {
            display: none;
          }
          .reassurance-pill {
            font-size: 16px;
            padding: 10px 18px;
          }
        }
      `}</style>
    </div>
  );
};
