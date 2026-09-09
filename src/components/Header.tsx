import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  LogOut,
  Settings,
  HelpCircle,
  Menu,
  X,
  Home,
  CalendarCheck,
  Brain,
  Smartphone,
  BarChart3,
  GraduationCap,
} from 'lucide-react';
import type { GameType } from '../types/game';

export type NavTab = 'home' | 'today' | 'cognitive' | 'digital' | 'records';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeGame: GameType | null;
  onExitGame: () => void;
  onOpenDevModal: () => void;
  onOpenGuide: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  gameTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeGame,
  onExitGame,
  onOpenDevModal,
  onOpenGuide,
  isMuted,
  onToggleSound,
  gameTitle,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '홈', icon: <Home size={22} /> },
    { id: 'today', label: '오늘의 학습', icon: <CalendarCheck size={22} /> },
    { id: 'cognitive', label: '인지훈련', icon: <Brain size={22} /> },
    { id: 'digital', label: '디지털 배우기', icon: <Smartphone size={22} /> },
    { id: 'records', label: '나의 학습기록', icon: <BarChart3 size={22} /> },
  ];

  const handleTabClick = (tab: NavTab) => {
    if (activeGame) {
      onExitGame();
    }
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo / Brand */}
        <div className="header-left">
          {activeGame ? (
            <button
              onClick={onExitGame}
              className="header-exit-btn"
              aria-label="활동 종료하고 목록으로 돌아가기"
            >
              <LogOut size={24} />
              <span>목록으로</span>
            </button>
          ) : (
            <button
              onClick={() => handleTabClick('home')}
              className="header-logo-btn"
              aria-label="디지털 학교 처음 홈 화면으로 이동"
            >
              <div className="logo-icon-badge">
                <GraduationCap size={28} color="#FFFFFF" />
              </div>
              <span className="logo-text">디지털 학교</span>
            </button>
          )}
        </div>

        {/* Active Game Title (when inside a game) */}
        {activeGame ? (
          <div className="active-game-banner">
            <h1 className="active-game-title">{gameTitle || '두뇌 인지 활동'}</h1>
          </div>
        ) : (
          /* Desktop Navigation Menu (5 Tabs) */
          <nav className="header-nav-desktop" aria-label="메인 메뉴">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Header Right Utilities */}
        <div className="header-right">
          {/* Easy Guide Button */}
          <button
            onClick={onOpenGuide}
            className="util-btn guide-btn"
            title="쉬운 이용 방법 보기"
            aria-label="쉬운 이용 방법 보기"
          >
            <HelpCircle size={26} color="#0F766E" />
            <span className="util-label">쉬운 안내</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="util-btn sound-btn"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? (
              <VolumeX size={26} color="#991B1B" />
            ) : (
              <Volume2 size={26} color="#0F766E" />
            )}
            <span className="util-label">{isMuted ? '소리 끎' : '소리 켬'}</span>
          </button>

          {/* Caregiver Settings Button */}
          <button
            onClick={onOpenDevModal}
            className="util-btn caregiver-btn"
            title="보호자 설정 및 활동 통계"
            aria-label="보호자 설정"
          >
            <Settings size={26} color="#475569" />
            <span className="util-label">보호자</span>
          </button>

          {/* Mobile Hamburger Button */}
          {!activeGame && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-toggle-btn"
              aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {!activeGame && isMobileMenuOpen && (
        <div className="mobile-nav-drawer anim-pop">
          <nav className="mobile-nav-list">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-label">{item.label}</span>
                  {isActive && <span className="active-dot">●</span>}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      <style>{`
        .app-header {
          width: 100%;
          background-color: #FFFFFF;
          border-bottom: 3px solid #E2E8F0;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .header-logo-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 16px;
          transition: background-color 0.2s;
        }

        .header-logo-btn:hover {
          background-color: #F0FDF4;
        }

        .logo-icon-badge {
          background: linear-gradient(135deg, #0F766E 0%, #115E59 100%);
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(15, 118, 110, 0.25);
        }

        .logo-text {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .header-exit-btn {
          background-color: #FEF2F2;
          border: 3px solid #DC2626;
          color: #991B1B;
          font-size: 20px;
          font-weight: 900;
          padding: 10px 20px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 3px 0 #991B1B;
          transition: transform 0.1s, background-color 0.15s;
        }

        .header-exit-btn:hover {
          background-color: #FEE2E2;
        }

        .header-exit-btn:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #991B1B;
        }

        .active-game-banner {
          flex: 1;
          text-align: center;
        }

        .active-game-title {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          white-space: nowrap;
        }

        /* Desktop Navigation Tabs */
        .header-nav-desktop {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .nav-tab-btn {
          background: transparent;
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 8px 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 19px;
          font-weight: 800;
          color: #334155;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .nav-label {
          white-space: nowrap;
        }

        .nav-tab-btn:hover {
          background-color: #F8FAFC;
          color: #0F766E;
        }

        .nav-tab-btn.active {
          background-color: #F0FDF4;
          border-color: #86EFAC;
          color: #047857;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.15);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .util-btn {
          background-color: #F8FAFC;
          border: 2px solid #CBD5E1;
          border-radius: 14px;
          padding: 6px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          min-width: 64px;
          white-space: nowrap;
          transition: background-color 0.15s, transform 0.1s;
        }

        .util-btn:hover {
          background-color: #F1F5F9;
        }

        .util-btn:active {
          transform: scale(0.96);
        }

        .util-label {
          font-size: 13px;
          font-weight: 800;
          color: #334155;
          margin-top: 2px;
          white-space: nowrap;
        }

        .mobile-menu-toggle-btn {
          display: none;
          background-color: #F1F5F9;
          border: 2px solid #CBD5E1;
          border-radius: 12px;
          padding: 8px;
          color: #1E293B;
          cursor: pointer;
        }

        /* Mobile Drawer */
        .mobile-nav-drawer {
          display: none;
          background-color: #FFFFFF;
          border-top: 2px solid #E2E8F0;
          padding: 16px 20px 24px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
        }

        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-nav-item {
          width: 100%;
          background-color: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 16px;
          padding: 16px 20px;
          font-size: 20px;
          font-weight: 800;
          color: #1E293B;
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
          cursor: pointer;
        }

        .mobile-nav-item.active {
          background-color: #F0FDF4;
          border-color: #86EFAC;
          color: #047857;
        }

        .active-dot {
          margin-left: auto;
          color: #10B981;
          font-size: 16px;
        }

        @media (max-width: 1180px) {
          .nav-tab-btn {
            padding: 6px 10px;
            font-size: 17px;
            gap: 4px;
          }
          .logo-text {
            font-size: 22px;
          }
        }

        @media (max-width: 960px) {
          .header-nav-desktop {
            display: none;
          }
          .mobile-menu-toggle-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .mobile-nav-drawer {
            display: block;
          }
          .util-btn {
            min-width: 54px;
            padding: 4px 6px;
          }
          .util-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
