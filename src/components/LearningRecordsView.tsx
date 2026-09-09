import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Award,
  Zap,
  Clock,
  Settings,
  Brain,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { getStoredLogs } from '../utils/logger';
import type { RoundLog } from '../types/game';
import type { NavTab } from './Header';

interface LearningRecordsViewProps {
  onOpenCaregiverModal: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const LearningRecordsView: React.FC<LearningRecordsViewProps> = ({
  onOpenCaregiverModal,
  onNavigateTab,
}) => {
  const [logs, setLogs] = useState<RoundLog[]>([]);

  useEffect(() => {
    setLogs(getStoredLogs());
  }, []);

  const totalRounds = logs.length;
  const successRounds = logs.filter((l) => l.isSuccess).length;
  const avgReactionSec =
    logs.length > 0
      ? (logs.reduce((acc, l) => acc + l.reactionTimeMs, 0) / logs.length / 1000).toFixed(1)
      : '0.0';

  const gameNames: Record<string, string> = {
    'card-match': '🧩 같은 그림 찾기',
    'sequence': '🔢 일상 순서 배열',
    'hangeul': '🔤 한글 낱말 맞추기',
    'storybook': '📖 책 읽어주는 방',
    'video-gallery': '🎥 추억 영상 앨범',
    'childhood': '🧒 나의 어린 시절',
  };

  return (
    <div className="learning-records-container anim-pop">
      {/* Header */}
      <div className="records-header">
        <div className="records-badge">
          <BarChart3 size={26} color="#047857" />
          <span>나의 소중한 배움 기록</span>
        </div>
        <h2 className="records-title">📊 나의 학습 기록 🌸</h2>
        <p className="records-sub">
          어르신께서 지금까지 즐겁게 참여하신 두뇌 훈련 기록을 확인해보세요.
        </p>
      </div>

      {/* 3 Summary Stats Cards */}
      <div className="stats-summary-grid">
        <div className="stat-card anim-pop">
          <div className="stat-icon-wrapper bg-green">
            <Award size={36} color="#047857" />
          </div>
          <div className="stat-text-col">
            <span className="stat-label">총 완료한 활동</span>
            <span className="stat-value">{totalRounds} <small>회</small></span>
          </div>
        </div>

        <div className="stat-card anim-pop">
          <div className="stat-icon-wrapper bg-blue">
            <CheckCircle2 size={36} color="#0284C7" />
          </div>
          <div className="stat-text-col">
            <span className="stat-label">성공 완료 횟수</span>
            <span className="stat-value">{successRounds} <small>회</small></span>
          </div>
        </div>

        <div className="stat-card anim-pop">
          <div className="stat-icon-wrapper bg-amber">
            <Zap size={36} color="#D97706" />
          </div>
          <div className="stat-text-col">
            <span className="stat-label">평균 반응 속도</span>
            <span className="stat-value">{avgReactionSec} <small>초</small></span>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="recent-logs-section">
        <div className="section-header-row">
          <h3 className="section-title">🕒 최근 활동 이력</h3>
          <button
            onClick={onOpenCaregiverModal}
            className="caregiver-link-btn"
          >
            <Settings size={20} />
            <span>보호자 상세 분석 대시보드 열기 ▶</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="empty-logs-box">
            <Brain size={48} color="#94A3B8" />
            <p className="empty-text">아직 완료한 학습 기록이 없습니다.</p>
            <button
              onClick={() => onNavigateTab('cognitive')}
              className="start-first-btn senior-btn-primary"
            >
              지금 첫 학습 시작하기
            </button>
          </div>
        ) : (
          <div className="logs-list">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="log-item-card">
                <div className="log-game-col">
                  <span className="log-game-title">
                    {gameNames[log.gameType] || log.gameType}
                  </span>
                  <span className="log-time-text">
                    <Clock size={16} /> {log.timestamp}
                  </span>
                </div>

                <div className="log-badge-col">
                  <span className="log-level-badge">{log.difficultyLevel}단계</span>
                  <span
                    className={`log-status-badge ${
                      log.isSuccess ? 'status-success' : 'status-try'
                    }`}
                  >
                    {log.isSuccess ? '완료' : '재도전'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Encouragement */}
      <div className="records-footer">
        <Heart size={24} color="#047857" />
        <span>꾸준한 학습으로 오늘도 두뇌가 한층 더 젊어졌습니다! 🌸</span>
      </div>

      <style>{`
        .learning-records-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 30px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .records-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .records-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #D1FAE5;
          border: 2px solid #6EE7B7;
          border-radius: 20px;
          padding: 8px 22px;
          font-size: 18px;
          font-weight: 800;
          color: #065F46;
        }

        .records-title {
          font-size: clamp(30px, 4vw, 40px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .records-sub {
          font-size: clamp(19px, 2.5vw, 22px);
          font-weight: 700;
          color: #475569;
          margin: 0;
        }

        /* Stats Grid */
        .stats-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 26px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
        }

        .stat-icon-wrapper {
          width: 68px;
          height: 68px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-green {
          background-color: #D1FAE5;
          border: 2px solid #A7F3D0;
        }

        .bg-blue {
          background-color: #E0F2FE;
          border: 2px solid #BAE6FD;
        }

        .bg-amber {
          background-color: #FEF3C7;
          border: 2px solid #FDE68A;
        }

        .stat-text-col {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 17px;
          font-weight: 700;
          color: #64748B;
        }

        .stat-value {
          font-size: 34px;
          font-weight: 900;
          color: #0F172A;
        }

        .stat-value small {
          font-size: 20px;
          font-weight: 700;
          color: #475569;
        }

        /* Recent logs */
        .recent-logs-section {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 28px;
          padding: 30px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .caregiver-link-btn {
          background: none;
          border: 2px solid #CBD5E1;
          border-radius: 14px;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 800;
          color: #0F766E;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.15s;
        }

        .caregiver-link-btn:hover {
          background-color: #F0FDF4;
          border-color: #86EFAC;
        }

        .empty-logs-box {
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .empty-text {
          font-size: 20px;
          font-weight: 700;
          color: #64748B;
        }

        .start-first-btn {
          min-height: 56px;
          padding: 12px 28px;
          border-radius: 18px;
          font-size: 20px;
          font-weight: 900;
          cursor: pointer;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .log-item-card {
          background-color: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 18px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .log-game-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .log-game-title {
          font-size: 21px;
          font-weight: 800;
          color: #0F172A;
        }

        .log-time-text {
          font-size: 15px;
          font-weight: 600;
          color: #64748B;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .log-badge-col {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .log-level-badge {
          background-color: #E0F2FE;
          color: #0369A1;
          font-size: 15px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 10px;
        }

        .log-status-badge {
          font-size: 15px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 10px;
        }

        .status-success {
          background-color: #D1FAE5;
          color: #065F46;
        }

        .status-try {
          background-color: #FEF3C7;
          color: #92400E;
        }

        .records-footer {
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
          .stats-summary-grid {
            grid-template-columns: 1fr;
          }
          .recent-logs-section {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
};
