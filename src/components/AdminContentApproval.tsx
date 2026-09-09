import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Edit3,
  RefreshCw,
  History,
  Eye,
  Check,
  Save,
  Sparkles,
  Layers
} from 'lucide-react';
import type { DailyContentCandidate, DailyHistoryRecord, DailyItem } from '../types/dailyContent';
import { DailyContentManager, getTodayDateString } from '../utils/dailyContentManager';

interface AdminContentApprovalProps {
  onClose?: () => void;
}

export const AdminContentApproval: React.FC<AdminContentApprovalProps> = () => {
  // Password protection state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);

  // Active sub tab: 'pending' | 'edit' | 'history'
  const [activeTab, setActiveTab] = useState<'pending' | 'edit' | 'history'>('pending');

  // Candidate data & history
  const [pendingCandidates, setPendingCandidates] = useState<DailyContentCandidate[]>([]);
  const [historyRecords, setHistoryRecords] = useState<DailyHistoryRecord[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<DailyContentCandidate | null>(null);

  // Manual editing state
  const [editTheme, setEditTheme] = useState<string>('');
  const [editItems, setEditItems] = useState<DailyItem[]>([]);

  // Notification message
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const pending = DailyContentManager.getPendingCandidates();
    const history = DailyContentManager.getHistoryRecords();
    setPendingCandidates(pending);
    setHistoryRecords(history);

    if (pending.length > 0) {
      setSelectedCandidate(pending[0]);
      setEditTheme(pending[0].payload.theme);
      setEditItems(pending[0].payload.items);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1234' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleApprove = (candidateId: string) => {
    DailyContentManager.approveCandidate(candidateId, editItems, editTheme, '관리자(본인)');
    showFeedback('✅ 콘텐츠가 승인되어 "오늘의 활동"에 즉시 반영되었습니다!');
    loadData();
  };

  const handleRejectAndEdit = () => {
    setActiveTab('edit');
  };

  const handleSaveManualEdit = () => {
    if (!selectedCandidate) return;
    DailyContentManager.approveCandidate(selectedCandidate.id, editItems, editTheme, '관리자 (수동 수정 승인)');
    showFeedback('✏️ 수동 수정된 콘텐츠가 성공적으로 저장 및 승인되었습니다!');
    setActiveTab('pending');
    loadData();
  };

  const handleSimulateAi = () => {
    const newCand = DailyContentManager.simulateAiGenerationPipeline();
    showFeedback('🤖 AI가 새로운 일일 인지 콘텐츠 초안을 생성하고 2차 자동 검수를 완료했습니다.');
    loadData();
    setSelectedCandidate(newCand);
  };

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // 1. Password Verification View
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card anim-pop">
          <div className="lock-icon-circle">
            <Lock size={40} color="#0F766E" />
          </div>
          <h3>🔒 관리자 승인 접근 보호</h3>
          <p className="lock-sub">
            어르신 및 보호자 화면과 분리된 관리자 전용 기능입니다.<br />
            비밀번호를 입력하여 접속해주세요. (기본 핀: <strong>1234</strong>)
          </p>

          <form onSubmit={handlePasswordSubmit} className="lock-form">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호 4자리 입력 (1234)"
              className={`lock-input ${passwordError ? 'error' : ''}`}
              autoFocus
            />
            {passwordError && <p className="error-text">❌ 비밀번호가 올바르지 않습니다. (기본: 1234)</p>}
            <button type="submit" className="senior-btn senior-btn-primary lock-btn">
              <span>관리자 전용 화면 열기</span>
            </button>
          </form>
        </div>

        <style>{`
          .admin-lock-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }
          .admin-lock-card {
            background-color: #FFFFFF;
            border-radius: 24px;
            padding: 36px;
            max-width: 480px;
            width: 100%;
            text-align: center;
            border: 3px solid #0D9488;
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
          }
          .lock-icon-circle {
            width: 72px;
            height: 72px;
            background-color: #CCFBF1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px auto;
          }
          .admin-lock-card h3 {
            font-size: 24px;
            font-weight: 900;
            color: #0F172A;
            margin-bottom: 8px;
          }
          .lock-sub {
            font-size: 15px;
            color: #475569;
            line-height: 1.5;
            margin-bottom: 24px;
          }
          .lock-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .lock-input {
            width: 100%;
            font-size: 20px;
            padding: 14px 18px;
            border-radius: 14px;
            border: 2px solid #CBD5E1;
            text-align: center;
            outline: none;
          }
          .lock-input.error {
            border-color: #EF4444;
            background-color: #FEF2F2;
          }
          .error-text {
            color: #DC2626;
            font-size: 14px;
            font-weight: 700;
          }
          .lock-btn {
            min-height: 54px;
            font-size: 18px;
          }
        `}</style>
      </div>
    );
  }

  // 2. Admin Content Management Main Interface
  return (
    <div className="admin-approval-panel">
      {/* Action Notification Toast */}
      {actionFeedback && (
        <div className="toast-notification anim-pop">
          <span>{actionFeedback}</span>
        </div>
      )}

      <header className="admin-panel-header">
        <div className="header-left">
          <ShieldCheck size={32} color="#0D9488" />
          <div>
            <h2>🤖 AI 일일 인지 콘텐츠 생성 · 검수 · 승인 관리</h2>
            <p className="admin-desc">매일 새벽 AI가 생성한 인지활동 8종을 미리보고 최종 승인/수정하는 대시보드입니다.</p>
          </div>
        </div>

        <button onClick={handleSimulateAi} className="senior-btn senior-btn-secondary ai-sim-btn">
          <RefreshCw size={20} />
          <span>AI 테스트 생성 실행</span>
        </button>
      </header>

      {/* Navigation Sub-Tabs */}
      <nav className="admin-sub-tabs">
        <button
          onClick={() => setActiveTab('pending')}
          className={`admin-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
        >
          <Eye size={20} />
          <span>1. 승인 대기 목록 &amp; 실시간 미리보기 ({pendingCandidates.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`admin-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
        >
          <Edit3 size={20} />
          <span>2. 수동 수정 편집기</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`admin-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
        >
          <History size={20} />
          <span>3. 최근 7일 승인 및 발행 이력</span>
        </button>
      </nav>

      {/* TAB 1: Pending Candidates & Live Preview */}
      {activeTab === 'pending' && (
        <div className="admin-tab-content fade-in">
          {pendingCandidates.length === 0 ? (
            <div className="empty-state-box">
              <CheckCircle2 size={48} color="#16A34A" />
              <h4>현재 승인 대기중인 AI 초안이 없습니다.</h4>
              <p>오늘의 콘텐츠가 이미 승인되어 발간되었거나, 전날 콘텐츠가 안전하게 폴백 노출중입니다.</p>
              <button onClick={handleSimulateAi} className="senior-btn senior-btn-primary" style={{ marginTop: '16px' }}>
                <Sparkles size={20} />
                <span>새 AI 생성 초안 만들어보기</span>
              </button>
            </div>
          ) : (
            <div className="approval-main-grid">
              {/* Left Column: AI Candidate Details & Auto-Evaluation Report */}
              <div className="candidate-info-card">
                <div className="card-badge">
                  <Sparkles size={20} color="#0F766E" />
                  <span>오늘 자 기준 AI 자동 생성본 (검수 완료)</span>
                </div>

                <h3 className="candidate-date">📅 {selectedCandidate?.payload.date || getTodayDateString()}</h3>
                <h4 className="candidate-theme">주제: "{selectedCandidate?.payload.theme}"</h4>

                {/* Auto Evaluation 5 Criteria Box */}
                <div className="eval-report-box">
                  <div className="eval-header">
                    <ShieldCheck size={24} color="#16A34A" />
                    <span>2차 AI 자동 검수 결과 리포트</span>
                  </div>
                  <ul className="eval-criteria-list">
                    <li><Check size={18} color="#16A34A" /> 8개 사물이 서로 명확히 구분되는가: <strong>적합 (합격)</strong></li>
                    <li><Check size={18} color="#16A34A" /> 한국 어르신에게 친숙한 소재인가: <strong>적합 (합격)</strong></li>
                    <li><Check size={18} color="#16A34A" /> 무섭거나 슬픈 소재 제외: <strong>적합 (합격)</strong></li>
                    <li><Check size={18} color="#16A34A" /> 브랜드, 정치, 종교 소재 제외: <strong>적합 (합격)</strong></li>
                    <li><Check size={18} color="#16A34A" /> 어렵지 않은 쉬운 단어: <strong>적합 (합격)</strong></li>
                  </ul>
                </div>

                {/* Big Action Buttons */}
                <div className="approval-action-buttons">
                  <button
                    onClick={() => selectedCandidate && handleApprove(selectedCandidate.id)}
                    className="senior-btn senior-btn-primary approve-big-btn"
                  >
                    <CheckCircle2 size={28} />
                    <span>승인하여 오늘 앱에 발행</span>
                  </button>

                  <button
                    onClick={handleRejectAndEdit}
                    className="senior-btn senior-btn-secondary edit-big-btn"
                  >
                    <Edit3 size={24} />
                    <span>거부하고 내용 수동 수정하기</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Card Game Preview (Exact Senior View) */}
              <div className="live-preview-card">
                <div className="preview-header">
                  <Layers size={22} color="#0D9488" />
                  <span>📱 어르신 화면 실제 렌더링 미리보기</span>
                </div>

                <div className="mock-screen-wrapper">
                  <div className="mock-game-grid">
                    {selectedCandidate?.payload.items.map((item, idx) => (
                      <div key={`prev-${item.id}-${idx}`} className="mock-card-tile">
                        <span className="tile-emoji">{item.emoji}</span>
                        <span className="tile-label">{item.label}</span>
                        <span className="tile-category">{item.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Manual Edit Form */}
      {activeTab === 'edit' && (
        <div className="admin-tab-content fade-in">
          <div className="edit-form-container">
            <h3>✍️ 콘텐츠 주제 및 사물 8종 수동 수정</h3>
            <p className="edit-desc">어르신들께 더 친숙하거나 원하시는 사물로 단어와 이모지를 직접 조정하실 수 있습니다.</p>

            <div className="field-group">
              <label>오늘의 인지활동 주제</label>
              <input
                type="text"
                value={editTheme}
                onChange={(e) => setEditTheme(e.target.value)}
                className="theme-edit-input"
                placeholder="예: 정겨운 시골 전원 풍경 🏡"
              />
            </div>

            <h4 style={{ marginTop: '20px', marginBottom: '12px' }}>8개 카드 사물 목록 편집</h4>
            <div className="items-edit-grid">
              {editItems.map((item, idx) => (
                <div key={`edit-item-${idx}`} className="item-edit-row">
                  <span className="item-num">#{idx + 1}</span>
                  <input
                    type="text"
                    value={item.emoji}
                    onChange={(e) => {
                      const updated = [...editItems];
                      updated[idx].emoji = e.target.value;
                      setEditItems(updated);
                    }}
                    className="emoji-input"
                    placeholder="이모지"
                  />
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...editItems];
                      updated[idx].label = e.target.value;
                      setEditItems(updated);
                    }}
                    className="label-input"
                    placeholder="사물 명칭 (예: 사과)"
                  />
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => {
                      const updated = [...editItems];
                      updated[idx].category = e.target.value;
                      setEditItems(updated);
                    }}
                    className="category-input"
                    placeholder="분류"
                  />
                </div>
              ))}
            </div>

            <div className="edit-submit-bar">
              <button onClick={handleSaveManualEdit} className="senior-btn senior-btn-primary save-edit-btn">
                <Save size={24} />
                <span>수정 내용 저장 및 즉시 승인 발행</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 7-Day History Log */}
      {activeTab === 'history' && (
        <div className="admin-tab-content fade-in">
          <div className="history-container">
            <h3>📜 최근 승인 및 발행 이력 (안전 승인 기록)</h3>
            <p className="history-desc">검수를 거쳐 승인되었거나 자동 폴백으로 발행된 콘텐츠 목록입니다.</p>

            <table className="history-table">
              <thead>
                <tr>
                  <th>발행 날짜</th>
                  <th>오늘의 주제</th>
                  <th>포함 사물 8종 요약</th>
                  <th>승인 구분</th>
                  <th>승인 시각</th>
                </tr>
              </thead>
              <tbody>
                {historyRecords.map((rec) => (
                  <tr key={rec.id}>
                    <td><strong>{rec.date}</strong></td>
                    <td>{rec.theme}</td>
                    <td className="items-summary-cell">{rec.itemsSummary.join(', ')}</td>
                    <td>
                      <span className={`status-badge ${rec.status === 'APPROVED' ? 'green' : 'orange'}`}>
                        {rec.status === 'APPROVED' ? '✅ 정상 승인' : '🛡️ 폴백 유지'}
                      </span>
                    </td>
                    <td>{rec.approvedAt} ({rec.approvedBy})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .admin-approval-panel {
          background-color: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          border: 2px solid #CBD5E1;
        }

        .toast-notification {
          position: fixed;
          top: 24px;
          right: 24px;
          background-color: #0F766E;
          color: #FFFFFF;
          padding: 14px 24px;
          border-radius: 16px;
          font-size: 17px;
          font-weight: 800;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          z-index: 1100;
        }

        .admin-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 2px solid #E2E8F0;
          margin-bottom: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-left h2 {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
        }

        .admin-desc {
          font-size: 15px;
          color: #64748B;
          font-weight: 700;
        }

        .ai-sim-btn {
          min-height: 48px;
          font-size: 16px;
          padding: 8px 18px;
        }

        .admin-sub-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #E2E8F0;
          padding-bottom: 8px;
        }

        .admin-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border: none;
          background-color: #F1F5F9;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 800;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-tab-btn.active {
          background-color: #0D9488;
          color: #FFFFFF;
        }

        .approval-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .approval-main-grid {
            grid-template-columns: 1fr;
          }
        }

        .candidate-info-card {
          background-color: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .card-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 800;
          color: #0F766E;
          background-color: #CCFBF1;
          padding: 6px 14px;
          border-radius: 20px;
          width: fit-content;
          margin-bottom: 12px;
        }

        .candidate-date {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
        }

        .candidate-theme {
          font-size: 18px;
          font-weight: 800;
          color: #15803D;
          margin-top: 4px;
          margin-bottom: 16px;
        }

        .eval-report-box {
          background-color: #F0FDF4;
          border: 2px solid #BBF7D0;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .eval-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 900;
          color: #166534;
          margin-bottom: 10px;
        }

        .eval-criteria-list {
          list-style: none;
          padding: 0;
        }

        .eval-criteria-list li {
          font-size: 14px;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .approval-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
        }

        .approve-big-btn {
          width: 100%;
          min-height: 56px;
          font-size: 19px;
        }

        .edit-big-btn {
          width: 100%;
          min-height: 50px;
          font-size: 17px;
        }

        .live-preview-card {
          background-color: #FAF8F5;
          border: 3px solid #0D9488;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 900;
          color: #0F766E;
          margin-bottom: 16px;
        }

        .mock-screen-wrapper {
          background-color: #FFFFFF;
          border-radius: 14px;
          padding: 16px;
          border: 2px solid #E2E8F0;
          flex: 1;
        }

        .mock-game-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .mock-card-tile {
          background-color: #F8FAFC;
          border: 2px solid #CBD5E1;
          border-radius: 12px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .tile-emoji {
          font-size: 32px;
        }

        .tile-label {
          font-size: 15px;
          font-weight: 900;
          color: #0F172A;
          margin-top: 4px;
        }

        .tile-category {
          font-size: 11px;
          color: #64748B;
          margin-top: 2px;
        }

        .edit-form-container {
          background-color: #F8FAFC;
          padding: 24px;
          border-radius: 18px;
          border: 2px solid #E2E8F0;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-group label {
          font-size: 16px;
          font-weight: 900;
          color: #0F172A;
        }

        .theme-edit-input {
          font-size: 18px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 2px solid #CBD5E1;
          outline: none;
        }

        .items-edit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .item-edit-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #FFFFFF;
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid #CBD5E1;
        }

        .item-num {
          font-size: 14px;
          font-weight: 900;
          color: #0D9488;
          width: 28px;
        }

        .emoji-input {
          width: 50px;
          font-size: 18px;
          text-align: center;
          padding: 6px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
        }

        .label-input {
          flex: 1;
          font-size: 15px;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
        }

        .category-input {
          width: 80px;
          font-size: 13px;
          padding: 6px 8px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
        }

        .edit-submit-bar {
          display: flex;
          justify-content: flex-end;
        }

        .save-edit-btn {
          min-height: 52px;
          font-size: 18px;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        .history-table th, .history-table td {
          border: 1px solid #CBD5E1;
          padding: 12px 14px;
          font-size: 14px;
          text-align: left;
        }

        .history-table th {
          background-color: #F1F5F9;
          color: #334155;
          font-weight: 800;
        }

        .items-summary-cell {
          color: #475569;
          font-size: 13px;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
        }

        .status-badge.green { background-color: #DCFCE7; color: #15803D; }
        .status-badge.orange { background-color: #FFEDD5; color: #C2410C; }

        .fade-in { animation: fadeIn 0.2s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};
