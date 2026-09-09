import React, { useRef, useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, PenTool, ArrowRight } from 'lucide-react';

interface HandwritingCanvasProps {
  targetWord: string; // Full word or consonants string (e.g. 'ㄱㄴㄷ' or '가방')
  onComplete: () => void;
  disabled?: boolean;
}

export const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({
  targetWord,
  onComplete,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#0F766E');

  // Single character active index (0: first char 'ㄱ', 1: second char 'ㄴ'...)
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);

  // Array of single characters
  const charArray = targetWord.split('');
  const activeChar = charArray[currentCharIndex] || charArray[0] || 'ㄱ';

  // Draw background grid & single target character guide
  const drawTracingGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background dash grid (+)
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw Single Consonant / Character Tracing Template
    ctx.font = `bold ${Math.min(canvas.width, canvas.height) * 0.65}px 'Gowun Dodum', 'Noto Sans KR', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#CBD5E1'; // Light grey guide
    ctx.fillText(activeChar, canvas.width / 2, canvas.height / 2);
  };

  useEffect(() => {
    drawTracingGuide();
    setHasDrawn(false);
  }, [activeChar]);

  // Reset character index when targetWord changes
  useEffect(() => {
    setCurrentCharIndex(0);
    setHasDrawn(false);
  }, [targetWord]);

  // Drawing Handlers
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 16;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas && e.pointerId) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    drawTracingGuide();
    setHasDrawn(false);
  };

  const handleNextCharOrFinish = () => {
    if (currentCharIndex < charArray.length - 1) {
      // Move to next single character box
      setCurrentCharIndex((prev) => prev + 1);
    } else {
      // Finished all characters in word
      onComplete();
    }
  };

  return (
    <div className="handwriting-container">
      {/* Individual Single Character Boxes Step Selector */}
      <div className="single-char-boxes-bar">
        <span className="boxes-title">글자 칸:</span>
        <div className="char-box-list">
          {charArray.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentCharIndex(idx)}
              className={`single-char-box ${idx === currentCharIndex ? 'active' : idx < currentCharIndex ? 'completed' : ''}`}
            >
              <span className="box-idx">{idx + 1}번</span>
              <span className="box-char">{ch}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="canvas-header">
        <div className="guide-msg">
          <PenTool size={26} color="#0F766E" />
          <span>현재 칸 (<strong>{activeChar}</strong>)을 터치펜으로 따라 적어보세요</span>
        </div>

        <div className="color-picker">
          <button
            onClick={() => setPenColor('#0F766E')}
            className={`color-btn teal ${penColor === '#0F766E' ? 'active' : ''}`}
            aria-label="청록색 펜"
          />
          <button
            onClick={() => setPenColor('#1E3A8A')}
            className={`color-btn navy ${penColor === '#1E3A8A' ? 'active' : ''}`}
            aria-label="남색 펜"
          />
          <button
            onClick={() => setPenColor('#991B1B')}
            className={`color-btn red ${penColor === '#991B1B' ? 'active' : ''}`}
            aria-label="붉은색 펜"
          />
        </div>
      </div>

      {/* Main Single Character Canvas Frame */}
      <div className="canvas-frame">
        <canvas
          ref={canvasRef}
          width={400}
          height={320}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          className="touch-canvas"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Control Action Buttons */}
      <div className="canvas-actions">
        <button
          onClick={handleClear}
          className="senior-btn senior-btn-secondary"
          disabled={disabled}
        >
          <RotateCcw size={26} />
          <span>다시 적기</span>
        </button>

        <button
          onClick={handleNextCharOrFinish}
          className={`senior-btn senior-btn-primary ${hasDrawn ? 'ready' : ''}`}
          disabled={!hasDrawn || disabled}
        >
          {currentCharIndex < charArray.length - 1 ? (
            <>
              <span>다음 글자 칸 적기</span>
              <ArrowRight size={28} />
            </>
          ) : (
            <>
              <CheckCircle2 size={28} />
              <span>모두 다 적었습니다</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        .handwriting-container {
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .single-char-boxes-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: #F8FAFC;
          border: 3px solid #0F766E;
          border-radius: 20px;
          padding: 10px 18px;
          width: 100%;
          justify-content: center;
        }

        .boxes-title {
          font-size: 19px;
          font-weight: 800;
          color: #334155;
        }

        .char-box-list {
          display: flex;
          gap: 10px;
        }

        .single-char-box {
          min-width: 68px;
          height: 68px;
          background-color: #FFFFFF;
          border: 3px solid #CBD5E1;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.15s, background-color 0.15s;
        }

        .single-char-box.active {
          border-color: #0F766E;
          background-color: #E0F2FE;
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.2);
        }

        .single-char-box.completed {
          background-color: #ECFDF5;
          border-color: #10B981;
        }

        .box-idx {
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
        }

        .box-char {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
        }

        .canvas-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #FFFFFF;
          border: 2px solid #CBD5E1;
          border-radius: 18px;
          padding: 10px 16px;
        }

        .guide-msg {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 19px;
          font-weight: 700;
          color: #334155;
        }

        .color-picker {
          display: flex;
          gap: 8px;
        }

        .color-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .color-btn.active {
          transform: scale(1.15);
          outline: 3px solid #0F172A;
        }

        .color-btn.teal { background-color: #0F766E; }
        .color-btn.navy { background-color: #1E3A8A; }
        .color-btn.red { background-color: #991B1B; }

        .canvas-frame {
          background-color: #FFFFFF;
          border: 5px solid #0F766E;
          border-radius: 28px;
          box-shadow: 0 10px 25px rgba(15, 118, 110, 0.15);
          overflow: hidden;
          touch-action: none;
        }

        .touch-canvas {
          display: block;
          background-color: #FFFFFF;
          cursor: crosshair;
        }

        .canvas-actions {
          display: flex;
          gap: 14px;
          width: 100%;
          justify-content: center;
        }

        .canvas-actions .senior-btn {
          flex: 1;
        }
      `}</style>
    </div>
  );
};
