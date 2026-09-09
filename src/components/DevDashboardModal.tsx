import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, ShieldCheck, Activity, Sparkles, Sliders } from 'lucide-react';
import type { EngineState, RoundLog } from '../types/game';
import { getStoredLogs, downloadLogsAsJson, clearStoredLogs } from '../utils/logger';
import { DIFFICULTY_CONFIGS } from '../constants/cardData';
import { AdminContentApproval } from './AdminContentApproval';

interface DevDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  engineState: EngineState;
  onSetLevel: (level: number) => void;
  onResetEngine: () => void;
}

export const DevDashboardModal: React.FC<DevDashboardModalProps> = ({
  isOpen,
  onClose,
  engineState,
  onSetLevel,
  onResetEngine,
}) => {
  const [logs, setLogs] = useState<RoundLog[]>([]);
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'ai-admin'>('dashboard');

  const refreshLogs = () => {
    setLogs(getStoredLogs());
  };

  useEffect(() => {
    if (isOpen) {
      refreshLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentConfig = DIFFICULTY_CONFIGS[engineState.currentLevel] || DIFFICULTY_CONFIGS[1];
  const avgReactionSec =
    engineState.recentReactionTimes.length > 0
      ? (
          engineState.recentReactionTimes.reduce((a, b) => a + b, 0) /
          engineState.recentReactionTimes.length /
          1000
        ).toFixed(2)
      : '기록 없음';

  const handleClear = () => {
    if (window.confirm('저장된 모든 수행 로그를 삭제하시겠습니까?')) {
      clearStoredLogs();
      refreshLogs();
    }
  };

  return (
    <div className="dev-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="dev-modal-title">
      <div className="dev-modal-card">
        <div className="dev-modal-header">
          <div className="title-group">
            <ShieldCheck size={32} color="#0284C7" />
            <h2 id="dev-modal-title">보호자 &amp; 운영자 모드 대시보드</h2>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="닫기">
            <X size={32} />
          </button>
        </div>

        {/* Dashboard Main Tabs */}
        <div className="dev-main-tabs">
          <button
            onClick={() => setActiveMainTab('dashboard')}
            className={`dev-tab-btn ${activeMainTab === 'dashboard' ? 'active' : ''}`}
          >
            <Sliders size={20} />
            <span>📊 난이도 설정 및 활동 분석</span>
          </button>
          <button
            onClick={() => setActiveMainTab('ai-admin')}
            className={`dev-tab-btn ${activeMainTab === 'ai-admin' ? 'active' : ''}`}
          >
            <Sparkles size={20} />
            <span>🤖 AI 일일 콘텐츠 검수 · 승인</span>
          </button>
        </div>

        {activeMainTab === 'ai-admin' ? (
          <div style={{ marginTop: '16px' }}>
            <AdminContentApproval />
          </div>
        ) : (
          <>

        {/* Realtime Engine Status */}
        <section className="status-section">
          <h3>
            <Activity size={24} color="#059669" />
            실시간 자동 난이도 조절 엔진 상태
          </h3>
          <div className="status-grid">
            <div className="status-box highlight">
              <span className="box-label">현재 적용 난이도</span>
              <span className="box-value">{engineState.currentLevel} 단계</span>
              <span className="box-sub">
                {currentConfig.pairCount}쌍({currentConfig.pairCount * 2}장) | 미리보기 {currentConfig.previewSeconds}초
              </span>
            </div>

            <div className="status-box">
              <span className="box-label">연속 정답 스택 (상승 조건)</span>
              <span className="box-value">{engineState.consecutiveSuccessCount} / 3 판</span>
              <span className="box-sub">3판 달성 시 자동 1단계 상승</span>
            </div>

            <div className="status-box">
              <span className="box-label">연속 오답 스택 (하강 조건)</span>
              <span className="box-value">{engineState.consecutiveFailureCount} / 2 판</span>
              <span className="box-sub">2판 달성 시 자동 1단계 하강</span>
            </div>

            <div className="status-box">
              <span className="box-label">최근 5판 평균 반응시간</span>
              <span className="box-value">{avgReactionSec} 초</span>
              <span className="box-sub">2배 이상 소요 시 "느린 정답" 분류</span>
            </div>
          </div>

          {/* Manual override for testing */}
          <div className="manual-control">
            <span className="control-label">난이도 수동 변경 (테스트용):</span>
            <div className="level-buttons">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onSetLevel(lvl)}
                  className={`level-btn ${engineState.currentLevel === lvl ? 'active' : ''}`}
                >
                  {lvl}단계
                </button>
              ))}
              <button onClick={onResetEngine} className="level-btn reset-engine-btn" title="1단계 및 스택 초기화">
                초기화
              </button>
            </div>
          </div>
        </section>

        {/* Logs Section */}
        <section className="logs-section">
          <div className="logs-header">
            <h3>수행 데이터 로깅 내역 ({logs.length}건)</h3>
            <div className="action-buttons">
              <button onClick={downloadLogsAsJson} className="action-btn download-btn">
                <Download size={20} />
                <span>JSON 다운로드</span>
              </button>
              <button onClick={handleClear} className="action-btn clear-btn">
                <Trash2 size={20} />
                <span>로그 삭제</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            {logs.length === 0 ? (
              <p className="no-logs">아직 저장된 판별 수행 로그가 없습니다. 게임을 완료해보세요!</p>
            ) : (
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>일시</th>
                    <th>활동 종류</th>
                    <th>라운드</th>
                    <th>난이도</th>
                    <th>결과</th>
                    <th>반응시간</th>
                    <th>총 소요시간</th>
                    <th>시도 횟수</th>
                    <th>느린 정답 여부</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.timestamp}</td>
                      <td>
                        <span className="game-type-tag">
                          {log.gameType === 'sequence'
                            ? '🔢 순서 배열'
                            : log.gameType === 'hangeul'
                            ? '🔤 한글 낱말'
                            : log.gameType === 'storybook'
                            ? '📖 추억 책/영상'
                            : '🧩 카드 맞추기'}
                        </span>
                      </td>
                      <td>#{log.roundNumber}</td>
                      <td>
                        <span className={`badge level-badge-${log.difficultyLevel}`}>
                          {log.difficultyLevel}단계
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${log.isSuccess ? 'badge-success' : 'badge-fail'}`}>
                          {log.isSuccess ? '성공' : '실패'}
                        </span>
                      </td>
                      <td>{(log.reactionTimeMs / 1000).toFixed(2)}s</td>
                      <td>{(log.totalTimeMs / 1000).toFixed(1)}s</td>
                      <td>{log.attemptCount}회</td>
                      <td>{log.isSlowResponse ? '⚠️ 느린 정답' : '정상'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
        </>
        )}
      </div>

      <style>{`
        .dev-main-tabs {
          display: flex;
          background-color: #F8FAFC;
          padding: 8px 24px 0 24px;
          border-bottom: 2px solid #E2E8F0;
          gap: 12px;
        }

        .dev-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          background-color: transparent;
          font-size: 17px;
          font-weight: 800;
          color: #64748B;
          border-bottom: 4px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dev-tab-btn:hover {
          color: #0284C7;
          background-color: #F0F9FF;
        }

        .dev-tab-btn.active {
          color: #0284C7;
          border-bottom-color: #0284C7;
          background-color: #FFFFFF;
        }

        .dev-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 20px;
        }

        .dev-modal-card {
          background-color: #FFFFFF;
          border-radius: 24px;
          max-width: 1000px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .dev-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px;
          border-bottom: 2px solid #E2E8F0;
          background-color: #F8FAFC;
        }

        .title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-group h2 {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748B;
          padding: 4px;
          border-radius: 8px;
        }

        .close-btn:hover {
          background-color: #E2E8F0;
          color: #0F172A;
        }

        .status-section {
          padding: 20px 28px;
          background-color: #F0F9FF;
          border-bottom: 2px solid #BAE6FD;
        }

        .status-section h3, .logs-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #0369A1;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .status-box {
          background-color: #FFFFFF;
          border: 2px solid #E2E8F0;
          border-radius: 16px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
        }

        .status-box.highlight {
          border-color: #0284C7;
          background-color: #E0F2FE;
        }

        .box-label {
          font-size: 14px;
          color: #64748B;
          font-weight: 700;
        }

        .box-value {
          font-size: 24px;
          font-weight: 900;
          color: #0F172A;
          margin: 4px 0;
        }

        .box-sub {
          font-size: 13px;
          color: #475569;
        }

        .manual-control {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .control-label {
          font-size: 16px;
          font-weight: 700;
          color: #334155;
        }

        .level-buttons {
          display: flex;
          gap: 8px;
        }

        .level-btn {
          padding: 6px 14px;
          font-size: 16px;
          font-weight: 700;
          border: 2px solid #CBD5E1;
          border-radius: 10px;
          background-color: #FFFFFF;
          cursor: pointer;
        }

        .level-btn.active {
          background-color: #0284C7;
          color: #FFFFFF;
          border-color: #0369A1;
        }

        .logs-section {
          padding: 20px 28px;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .logs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 15px;
          font-weight: 700;
          border-radius: 10px;
          border: 2px solid;
          cursor: pointer;
        }

        .download-btn {
          background-color: #ECFDF5;
          color: #065F46;
          border-color: #10B981;
        }

        .clear-btn {
          background-color: #FEF2F2;
          color: #991B1B;
          border-color: #F87171;
        }

        .table-container {
          flex: 1;
          overflow-y: auto;
          border: 2px solid #E2E8F0;
          border-radius: 16px;
        }

        .no-logs {
          padding: 40px;
          text-align: center;
          font-size: 18px;
          color: #64748B;
        }

        .logs-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
          text-align: left;
        }

        .logs-table th {
          background-color: #F8FAFC;
          padding: 12px 16px;
          font-weight: 700;
          color: #475569;
          position: sticky;
          top: 0;
          border-bottom: 2px solid #E2E8F0;
        }

        .logs-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #F1F5F9;
          color: #1E293B;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }

        .badge-success {
          background-color: #D1FAE5;
          color: #065F46;
        }

        .badge-fail {
          background-color: #FEE2E2;
          color: #991B1B;
        }

        .level-badge-1 { background-color: #E0F2FE; color: #0369A1; }
        .level-badge-2 { background-color: #E0E7FF; color: #3730A3; }
        .level-badge-3 { background-color: #FEF3C7; color: #92400E; }
        .level-badge-4 { background-color: #FFEDD5; color: #9A3412; }
        .level-badge-5 { background-color: #FCE7F3; color: #9D174D; }
      `}</style>
    </div>
  );
};
