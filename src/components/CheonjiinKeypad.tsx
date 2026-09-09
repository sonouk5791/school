import React from 'react';

interface CheonjiinKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export const CheonjiinKeypad: React.FC<CheonjiinKeypadProps> = ({
  onKeyPress,
  onBackspace,
  onConfirm,
  disabled = false,
}) => {
  return (
    <div className="cheonjiin-keypad-wrapper">
      <div className="keypad-grid">
        {/* Row 1: Vowels (ㅣ, ㆍ, ㅡ) */}
        <button
          onClick={() => onKeyPress('ㅣ')}
          className="keypad-btn vowel-btn"
          disabled={disabled}
          aria-label="사람 ㅣ"
        >
          <span className="key-main">ㅣ</span>
          <span className="key-sub">인(人)</span>
        </button>

        <button
          onClick={() => onKeyPress('ㆍ')}
          className="keypad-btn vowel-btn"
          disabled={disabled}
          aria-label="하늘 ㆍ"
        >
          <span className="key-main">ㆍ</span>
          <span className="key-sub">천(天)</span>
        </button>

        <button
          onClick={() => onKeyPress('ㅡ')}
          className="keypad-btn vowel-btn"
          disabled={disabled}
          aria-label="땅 ㅡ"
        >
          <span className="key-main">ㅡ</span>
          <span className="key-sub">지(地)</span>
        </button>

        {/* Row 2: Consonants */}
        <button
          onClick={() => onKeyPress('ㄱ')}
          className="keypad-btn consonant-btn"
          disabled={disabled}
        >
          <span className="key-main">ㄱ ㅋ</span>
        </button>

        <button
          onClick={() => onKeyPress('ㄴ')}
          className="keypad-btn consonant-btn"
          disabled={disabled}
        >
          <span className="key-main">ㄴ ㄹ</span>
        </button>

        <button
          onClick={() => onKeyPress('ㄷ')}
          className="keypad-btn consonant-btn"
          disabled={disabled}
        >
          <span className="key-main">ㄷ ㅌ</span>
        </button>

        {/* Row 3: Consonants */}
        <button
          onClick={() => onKeyPress('ㅂ')}
          className="keypad-btn consonant-btn"
          disabled={disabled}
        >
          <span className="key-main">ㅂ ㅍ</span>
        </button>

        <button
          onClick={() => onKeyPress('ㅅ')}
          className="keypad-btn consonant-btn"
          disabled={disabled}
        >
          <span className="key-main">ㅅ ㅎ</span>
        </button>

        <button
          onClick={() => onKeyPress('ㅈ')}
          className="keypad-btn consonant-btn"
          disabled={disabled}
        >
          <span className="key-main">ㅈ ㅊ</span>
        </button>

        {/* Row 4: Consonants & Controls */}
        <button
          onClick={() => onKeyPress('ㅇ')}
          className="keypad-btn consonant-btn"
          disabled={disabled}
        >
          <span className="key-main">ㅇ ㅁ</span>
        </button>

        <button
          onClick={onBackspace}
          className="keypad-btn control-btn backspace-btn"
          disabled={disabled}
        >
          <span className="key-main">지움</span>
        </button>

        <button
          onClick={onConfirm}
          className="keypad-btn control-btn confirm-btn"
          disabled={disabled}
        >
          <span className="key-main">확인</span>
        </button>
      </div>

      <style>{`
        .cheonjiin-keypad-wrapper {
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          background-color: #FFFFFF;
          border: 4px solid #0F766E;
          border-radius: 28px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(15, 118, 110, 0.12);
        }

        .keypad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .keypad-btn {
          height: 80px;
          border-radius: 18px;
          border: 3px solid #CBD5E1;
          background-color: #F8FAFC;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: transform 0.1s, background-color 0.15s;
          box-shadow: 0 4px 0 #CBD5E1;
        }

        .keypad-btn:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #CBD5E1;
        }

        .vowel-btn {
          background-color: #E0F2FE;
          border-color: #0284C7;
          box-shadow: 0 4px 0 #0369A1;
        }

        .vowel-btn .key-main {
          font-size: 32px;
          font-weight: 900;
          color: #0369A1;
        }

        .vowel-btn .key-sub {
          font-size: 13px;
          font-weight: 700;
          color: #0369A1;
        }

        .consonant-btn {
          background-color: #FFFFFF;
          border-color: #0F766E;
          box-shadow: 0 4px 0 #115E59;
        }

        .consonant-btn .key-main {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
        }

        .control-btn.backspace-btn {
          background-color: #FEF2F2;
          border-color: #991B1B;
          box-shadow: 0 4px 0 #7F1D1D;
        }

        .control-btn.backspace-btn .key-main {
          font-size: 22px;
          font-weight: 800;
          color: #991B1B;
        }

        .control-btn.confirm-btn {
          background-color: #0F766E;
          border-color: #115E59;
          box-shadow: 0 4px 0 #134E4A;
        }

        .control-btn.confirm-btn .key-main {
          font-size: 24px;
          font-weight: 900;
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
};
