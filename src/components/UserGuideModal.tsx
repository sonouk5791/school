import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Layers,
  Hash,
  Type,
  BookOpen,
  Volume2,
  Printer,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Heart
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'start' | 'card' | 'sequence' | 'hangeul' | 'storybook' | 'print';

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('start');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.open('/guide.html', '_blank');
  };

  return (
    <div className="guide-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="guide-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="guide-modal-header">
          <div className="guide-header-title">
            <HelpCircle size={32} color="#0D9488" />
            <div>
              <h2>처음 하시는 분을 위한 쉬운 이용 안내</h2>
              <p className="guide-subtitle">천천히 읽어보시면 누구나 쉽게 두뇌 운동에 참여하실 수 있습니다 🌸</p>
            </div>
          </div>
          <button onClick={onClose} className="guide-close-btn" aria-label="닫기">
            <X size={32} />
          </button>
        </header>

        {/* Tab Navigation */}
        <nav className="guide-tabs" aria-label="안내 항목">
          <button
            onClick={() => setActiveTab('start')}
            className={`guide-tab-btn ${activeTab === 'start' ? 'active' : ''}`}
          >
            <Sparkles size={22} />
            <span>기초 시작하기</span>
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`guide-tab-btn ${activeTab === 'card' ? 'active' : ''}`}
          >
            <Layers size={22} />
            <span>🧩 카드 맞추기</span>
          </button>
          <button
            onClick={() => setActiveTab('sequence')}
            className={`guide-tab-btn ${activeTab === 'sequence' ? 'active' : ''}`}
          >
            <Hash size={22} />
            <span>🔢 순서 배열하기</span>
          </button>
          <button
            onClick={() => setActiveTab('hangeul')}
            className={`guide-tab-btn ${activeTab === 'hangeul' ? 'active' : ''}`}
          >
            <Type size={22} />
            <span>🔤 한글 낱말</span>
          </button>
          <button
            onClick={() => setActiveTab('storybook')}
            className={`guide-tab-btn ${activeTab === 'storybook' ? 'active' : ''}`}
          >
            <BookOpen size={22} />
            <span>📖 추억 책</span>
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`guide-tab-btn ${activeTab === 'print' ? 'active' : ''}`}
          >
            <Printer size={22} />
            <span>🖨️ 학습지 인쇄</span>
          </button>
        </nav>

        {/* Tab Content */}
        <div className="guide-content-body">
          {/* TAB 1: 기초 시작하기 */}
          {activeTab === 'start' && (
            <div className="guide-section fade-in">
              <h3 className="section-heading">🌟 오늘의 두뇌 학교에 오신 것을 환영합니다!</h3>
              <p className="section-intro">
                어렵거나 서두르실 필요가 전혀 없습니다. 화면의 큰 글씨와 정겨운 소리를 들으며 편안한 마음으로 따라해 보세요.
              </p>

              <div className="guide-card-grid">
                <div className="info-box green-box">
                  <div className="box-icon"><Smartphone size={32} color="#15803D" /></div>
                  <h4>1. 누르기 (터치)</h4>
                  <p>원하는 글자나 그림 카드를 <strong>손가락으로 살짝 꾹</strong> 눌러주세요. 틀려도 다시 도전하면 되니 안심하세요.</p>
                </div>

                <div className="info-box blue-box">
                  <div className="box-icon"><Volume2 size={32} color="#1D4ED8" /></div>
                  <h4>2. 칭찬 소리와 친절한 설명</h4>
                  <p>문제를 맞추면 기분 좋은 효과음과 목소리가 나옵니다. 오른쪽 상단의 🔊 <strong>소리 버튼</strong>으로 소리를 켜거나 끌 수 있습니다.</p>
                </div>

                <div className="info-box purple-box">
                  <div className="box-icon"><Heart size={32} color="#7E22CE" /></div>
                  <h4>3. 천천히 진행하기</h4>
                  <p>시간 제한 없이 여유롭게 진행하실 수 있습니다. 힘들 땐 상단의 <strong>[종료]</strong> 버튼을 눌러 언제든 쉬었다 가세요.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 그림 카드 맞추기 */}
          {activeTab === 'card' && (
            <div className="guide-section fade-in">
              <h3 className="section-heading">🧩 그림 카드 맞추기 쉬운 순서</h3>
              <p className="section-intro">엎어둔 카드 중에서 짝이 같은 2장의 카드를 찾아서 기억력을 쑥쑥 높여보세요!</p>

              <div className="step-list">
                <div className="step-item">
                  <span className="step-number">1</span>
                  <div className="step-detail">
                    <h4>잠깐 보여주는 그림 기억하기</h4>
                    <p>게임 시작 시 수 초 동안 카드의 그림이 모두 공개됩니다. <strong>어디에 무슨 그림이 있는지</strong> 눈여겨 봐주세요.</p>
                  </div>
                </div>

                <div className="step-item">
                  <span className="step-number">2</span>
                  <div className="step-detail">
                    <h4>첫 번째 카드 뒤집기</h4>
                    <p>궁금한 카드를 한 장 눌러 뒤집습니다. 카드가 짠 하고 열리며 어떤 그림인지 보여줍니다.</p>
                  </div>
                </div>

                <div className="step-item">
                  <span className="step-number">3</span>
                  <div className="step-detail">
                    <h4>같은 짝 찾아 맞추기</h4>
                    <p>똑같은 그림이 있는 카드를 찾아 눌러주세요. 짝이 맞으면 폭죽 소리와 함께 카드가 성공적으로 완성됩니다!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 일상 순서 배열하기 */}
          {activeTab === 'sequence' && (
            <div className="guide-section fade-in">
              <h3 className="section-heading">🔢 일상 순서 배열하기 쉬운 순서</h3>
              <p className="section-intro">아침에 일어나서 밤에 잘 때까지, 우리가 늘 하는 일상의 순서를 바르게 맞춰보세요.</p>

              <div className="step-list">
                <div className="step-item">
                  <span className="step-number">1</span>
                  <div className="step-detail">
                    <h4>질문 읽기 또는 소리 듣기</h4>
                    <p>예: "아침에 일어나서 외출 준비를 하는 순서대로 골라보세요!" 질문 아래의 <strong>[🔊 소리로 듣기]</strong>를 누르면 읽어드립니다.</p>
                  </div>
                </div>

                <div className="step-item">
                  <span className="step-number">2</span>
                  <div className="step-detail">
                    <h4>가장 먼저 해야 할 그림 누르기</h4>
                    <p>가장 처음에 할 순서의 카드를 살짝 누르면 <strong>①번 번호표</strong>가 자동으로 붙습니다.</p>
                  </div>
                </div>

                <div className="step-item">
                  <span className="step-number">3</span>
                  <div className="step-detail">
                    <h4>그 다음 순서대로 고르기</h4>
                    <p>차례대로 ②번, ③번 카드를 고르면 완료됩니다. 순서를 바꾸고 싶으면 붙은 번호 카드를 다시 누르시면 취소됩니다.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 한글 낱말 맞추기 */}
          {activeTab === 'hangeul' && (
            <div className="guide-section fade-in">
              <h3 className="section-heading">🔤 한글 낱말 입력 및 손글씨 사용법</h3>
              <p className="section-intro">핸드폰에서 자주 쓰는 <strong>천지인 자판</strong>이나 <strong>직접 손글씨 쓰기</strong>로 한글 낱말을 맞춰보세요!</p>

              <div className="hangeul-guide-grid">
                <div className="hangeul-card">
                  <h4>📱 천지인 자판 모드 (ㅣ, ·, ㅡ 조합)</h4>
                  <p>스마트폰 기본 자판과 동일합니다.</p>
                  <ul className="guide-bullet-list">
                    <li><strong>'ㅏ'</strong> = [ㅣ] 버튼 누르고 [ · ] 누르기</li>
                    <li><strong>'ㅓ'</strong> = [ · ] 버튼 누르고 [ㅣ] 누르기</li>
                    <li><strong>'ㅗ'</strong> = [ · ] 버튼 누르고 [ㅡ] 누르기</li>
                    <li><strong>'ㅜ'</strong> = [ㅡ] 버튼 누르고 [ · ] 누르기</li>
                    <li><strong>'ㄱ, ㅋ'</strong> = 같은 자음 버튼을 누를수록 ㅋ, ㄲ 등으로 전환됩니다.</li>
                  </ul>
                </div>

                <div className="hangeul-card">
                  <h4>✍️ 손글씨 모드 (직접 쓰기)</h4>
                  <p>붓이나 연필로 적듯 손가락으로 그립니다.</p>
                  <ul className="guide-bullet-list">
                    <li>네모 칸 안에 손가락으로 글자를 정성껏 적어보세요.</li>
                    <li>잘못 쓰셨다면 <strong>[지우기]</strong> 버튼을 누르면 깨끗해집니다.</li>
                    <li>완성 후 <strong>[확인]</strong>을 누르면 정답인지 알려드립니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 추억 책 & 이야기관 */}
          {activeTab === 'storybook' && (
            <div className="guide-section fade-in">
              <h3 className="section-heading">📖 추억 책 &amp; 영상 이야기관 이용법</h3>
              <p className="section-intro">정겨운 옛 시절 이야기와 민화를 감상하고 나만의 목소리와 추억을 기록해 보세요.</p>

              <div className="step-list">
                <div className="step-item">
                  <span className="step-number">1</span>
                  <div className="step-detail">
                    <h4>추억 카드 선택하기</h4>
                    <p>"옛날 시골 정자나무 아래", "정겨운 전통 장터" 등 맘에 드는 옛 이야기를 선택하세요.</p>
                  </div>
                </div>

                <div className="step-item">
                  <span className="step-number">2</span>
                  <div className="step-detail">
                    <h4>이야기 낭독 듣기</h4>
                    <p><strong>[🔊 정겨운 이야기 듣기]</strong>를 누르면 따뜻한 목소리로 옛 이야기를 들려드립니다.</p>
                  </div>
                </div>

                <div className="step-item">
                  <span className="step-number">3</span>
                  <div className="step-detail">
                    <h4>나만의 목소리로 추억 남기기</h4>
                    <p><strong>[🎙️ 내 목소리로 이야기 기록하기]</strong>를 눌러 당시의 추억을 이야기하면 나만의 소중한 추억 책이 완성됩니다!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: 학습지 인쇄 안내 */}
          {activeTab === 'print' && (
            <div className="guide-section fade-in print-guide-box">
              <h3 className="section-heading">🖨️ 복지관/가정용 Printable 안내서 및 학습지</h3>
              <p className="section-intro">
                어르신, 보호자, 종사자 강사분들을 위해 <strong>A4 용지로 인쇄할 수 있는 큰 글씨 설명서</strong>를 제공합니다.
              </p>

              <div className="print-action-card">
                <Printer size={48} color="#0D9488" />
                <div className="print-text">
                  <h4>종이 안내서 열기 및 인쇄</h4>
                  <p>버튼을 누르시면 큰 글씨와 순서도가 깔끔하게 정리된 종이 교재 페이지가 나타납니다.</p>
                </div>
                <button onClick={handlePrint} className="senior-btn senior-btn-primary print-open-btn">
                  <Printer size={24} />
                  <span>인쇄용 안내서 열기</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="guide-modal-footer">
          <button onClick={onClose} className="senior-btn senior-btn-primary guide-confirm-btn">
            <CheckCircle2 size={24} />
            <span>네, 잘 알겠습니다 (닫기)</span>
          </button>
        </footer>
      </div>

      <style>{`
        .guide-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .guide-modal-container {
          background-color: #FFFFFF;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          border: 3px solid #0D9488;
        }

        .guide-modal-header {
          padding: 20px 24px;
          background-color: #F0FDF4;
          border-bottom: 2px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .guide-header-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .guide-header-title h2 {
          font-size: 24px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .guide-subtitle {
          font-size: 15px;
          color: #15803D;
          font-weight: 700;
          margin: 4px 0 0 0;
        }

        .guide-close-btn {
          background: transparent;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 6px;
          border-radius: 12px;
          transition: background-color 0.2s;
        }

        .guide-close-btn:hover {
          background-color: #E2E8F0;
          color: #0F172A;
        }

        .guide-tabs {
          display: flex;
          background-color: #F8FAFC;
          border-bottom: 2px solid #E2E8F0;
          overflow-x: auto;
          padding: 8px 16px 0 16px;
          gap: 8px;
        }

        .guide-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border: none;
          background-color: transparent;
          font-size: 16px;
          font-weight: 800;
          color: #64748B;
          border-bottom: 4px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .guide-tab-btn:hover {
          color: #0D9488;
          background-color: #EDFDFD;
        }

        .guide-tab-btn.active {
          color: #0D9488;
          border-bottom-color: #0D9488;
          background-color: #FFFFFF;
        }

        .guide-content-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .section-heading {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 8px;
        }

        .section-intro {
          font-size: 17px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 24px;
        }

        .guide-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .info-box {
          border-radius: 16px;
          padding: 20px;
          border: 2px solid #E2E8F0;
        }

        .info-box.green-box { background-color: #F0FDF4; border-color: #BBF7D0; }
        .info-box.blue-box { background-color: #EFF6FF; border-color: #BFDBFE; }
        .info-box.purple-box { background-color: #FAF5FF; border-color: #E9D5FF; }

        .box-icon { margin-bottom: 12px; }

        .info-box h4 {
          font-size: 18px;
          font-weight: 900;
          margin-bottom: 8px;
          color: #0F172A;
        }

        .info-box p {
          font-size: 15px;
          line-height: 1.5;
          color: #334155;
        }

        .step-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background-color: #F8FAFC;
          padding: 16px 20px;
          border-radius: 16px;
          border: 2px solid #E2E8F0;
        }

        .step-number {
          background-color: #0D9488;
          color: #FFFFFF;
          font-size: 20px;
          font-weight: 900;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-detail h4 {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 4px;
        }

        .step-detail p {
          font-size: 15px;
          color: #334155;
          line-height: 1.5;
        }

        .hangeul-guide-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .hangeul-guide-grid {
            grid-template-columns: 1fr;
          }
        }

        .hangeul-card {
          background-color: #FEFCE8;
          border: 2px solid #FEF08A;
          border-radius: 16px;
          padding: 20px;
        }

        .hangeul-card h4 {
          font-size: 17px;
          font-weight: 900;
          color: #854D0E;
          margin-bottom: 8px;
        }

        .guide-bullet-list {
          margin-top: 12px;
          padding-left: 20px;
        }

        .guide-bullet-list li {
          font-size: 14px;
          margin-bottom: 6px;
          color: #334155;
          line-height: 1.4;
        }

        .print-action-card {
          background-color: #CCFBF1;
          border: 3px dashed #0D9488;
          border-radius: 20px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .print-text h4 {
          font-size: 20px;
          font-weight: 900;
          color: #0F766E;
        }

        .print-text p {
          font-size: 16px;
          color: #115E59;
          font-weight: 700;
        }

        .print-open-btn {
          min-height: 52px;
          padding: 10px 24px;
          font-size: 18px;
        }

        .guide-modal-footer {
          padding: 16px 24px;
          background-color: #F8FAFC;
          border-top: 2px solid #E2E8F0;
          display: flex;
          justify-content: flex-end;
        }

        .guide-confirm-btn {
          min-height: 52px;
          font-size: 18px;
          padding: 8px 28px;
        }

        .fade-in {
          animation: fadeIn 0.25s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
