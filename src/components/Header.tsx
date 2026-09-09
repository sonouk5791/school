import React from 'react';
import { Volume2, VolumeX, LogOut, Settings, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onExit: () => void;
  onOpenDevModal: () => void;
  onOpenGuide: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onExit,
  onOpenDevModal,
  onOpenGuide,
  isMuted,
  onToggleSound,
  title = '기억력 두뇌 운동',
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Large exit button */}
        <button
          onClick={onExit}
          className="senior-btn senior-btn-danger header-exit-btn"
          aria-label="처음 화면으로 돌아가기"
        >
          <LogOut size={28} />
          <span>종료</span>
        </button>

        {/* Respectful Title */}
        <h1 className="header-title">{title}</h1>

        {/* Control buttons */}
        <div className="header-right">
          {/* Easy Guide button */}
          <button
            onClick={onOpenGuide}
            className="header-icon-btn guide-trigger-btn"
            title="처음 이용자를 위한 쉬운 이용 방법"
            aria-label="쉬운 이용 안내"
          >
            <HelpCircle size={30} color="#0D9488" />
            <span className="icon-label guide-label">쉬운 안내</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className="header-icon-btn"
            title={isMuted ? '음소거 해제' : '음소거'}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX size={30} color="#991B1B" /> : <Volume2 size={30} color="#0F766E" />}
            <span className="icon-label">{isMuted ? '소리 끎' : '소리 켬'}</span>
          </button>

          {/* Caregiver Settings button */}
          <button
            onClick={onOpenDevModal}
            className="header-icon-btn dev-trigger-btn"
            title="보호자 설정 및 활동 기록"
            aria-label="보호자 설정"
          >
            <Settings size={30} color="#334155" />
            <span className="icon-label">보호자</span>
          </button>
        </div>
      </div>

      <style>{`
        .app-header {
          width: 100%;
          background-color: #FFFFFF;
          border-bottom: 3px solid #CBD5E1;
          padding: 12px 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .header-exit-btn {
          min-height: 56px;
          padding: 8px 20px;
          font-size: 22px;
          border-width: 3px;
        }

        .header-title {
          font-size: 28px;
          font-weight: 900;
          color: #0F172A;
          text-align: center;
          flex: 1;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon-btn {
          background-color: #F8FAFC;
          border: 2px solid #CBD5E1;
          border-radius: 14px;
          padding: 6px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          min-width: 76px;
          transition: background-color 0.2s, transform 0.1s;
        }

        .header-icon-btn:active {
          transform: scale(0.95);
          background-color: #E2E8F0;
        }

        .icon-label {
          font-size: 15px;
          font-weight: 700;
          color: #334155;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .header-title {
            font-size: 22px;
          }
          .header-exit-btn {
            font-size: 19px;
            padding: 6px 14px;
          }
          .header-icon-btn {
            min-width: 60px;
            padding: 4px 8px;
          }
        }
      `}</style>
    </header>
  );
};
