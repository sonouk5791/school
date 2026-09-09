import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  Undo2,
  Download,
  Eraser,
  PenTool,
  CheckCircle2,
  Brush,
  Palette,
  Eye,
  Heart,
  Image as ImageIcon,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffect';
import { ttsManager } from '../utils/ttsManager';

export interface ColoringTemplate {
  id: string;
  title: string;
  category: string;
  emoji: string;
  difficulty: string;
  svgPath: string; // SVG path or outline elements
  description: string;
}

export const COLORING_TEMPLATES: ColoringTemplate[] = [
  {
    id: 'marbles',
    title: '유리구슬 도안',
    category: '골목놀이',
    emoji: '🔮',
    difficulty: '쉬움',
    description: '동글동글 유리구슬에 알록달록 무지개 색을 칠해보세요.',
    svgPath: 'marbles',
  },
  {
    id: 'ddakji',
    title: '종이딱지 도안',
    category: '골목놀이',
    emoji: '📦',
    difficulty: '쉬움',
    description: '빨간색, 파란색 접힌 종이딱지를 예쁘게 칠해보세요.',
    svgPath: 'ddakji',
  },
  {
    id: 'dalgona',
    title: '추억의 달고나 별 도안',
    category: '추억간식',
    emoji: '⭐',
    difficulty: '보통',
    description: '달콤한 노란 달고나와 가운데 별 모양을 따라 그려보세요.',
    svgPath: 'dalgona',
  },
  {
    id: 'hibiscus',
    title: '우리꽃 무궁화 도안',
    category: '고향자연',
    emoji: '🌸',
    difficulty: '보통',
    description: '분홍빛 고운 무궁화 꽃잎과 노란 꽃술을 칠해보세요.',
    svgPath: 'hibiscus',
  },
  {
    id: 'apple',
    title: '탐스러운 빨간 사과',
    category: '과일',
    emoji: '🍎',
    difficulty: '쉬움',
    description: '싱싱하고 달콤한 사과와 초록 잎사귀를 칠해보세요.',
    svgPath: 'apple',
  },
  {
    id: 'hanok',
    title: '정겨운 고향 기와집',
    category: '고향풍경',
    emoji: '🏡',
    difficulty: '조금 어려움',
    description: '먹빛 기와지붕과 따뜻한 흙벽을 따라 멋지게 채색해보세요.',
    svgPath: 'hanok',
  },
  {
    id: 'blank',
    title: '하얀 도화지 (자유 그리기)',
    category: '자유스케치',
    emoji: '🎨',
    difficulty: '자유',
    description: '마음속에 떠오르는 옛 추억이나 가족 얼굴을 자유롭게 그려보세요.',
    svgPath: 'blank',
  },
];

const SENIOR_PALETTE = [
  { name: '진빨강', color: '#DC2626', label: '빨강' },
  { name: '주황', color: '#EA580C', label: '주황' },
  { name: '해바라기노랑', color: '#FACC15', label: '노랑' },
  { name: '연두', color: '#84CC16', label: '연두' },
  { name: '초록숲', color: '#16A34A', label: '초록' },
  { name: '맑은하늘', color: '#38BDF8', label: '하늘' },
  { name: '진파랑', color: '#2563EB', label: '파랑' },
  { name: '보라', color: '#9333EA', label: '보라' },
  { name: '분홍꽃', color: '#F472B6', label: '분홍' },
  { name: '살구색', color: '#FDBA74', label: '살구' },
  { name: '흙갈색', color: '#92400E', label: '갈색' },
  { name: '먹물검정', color: '#1E293B', label: '검정' },
  { name: '하양', color: '#FFFFFF', label: '흰색' },
];

const PEN_SIZES = [
  { size: 28, label: '굵은 터치펜 (넓게 칠하기)', iconSize: 22 },
  { size: 14, label: '중간 터치펜 (일반 색칠)', iconSize: 16 },
  { size: 6, label: '얇은 터치펜 (선 따라그리기)', iconSize: 10 },
];

interface ColoringCanvasStudioProps {
  initialPhotoUrl?: string;
  initialPhotoTitle?: string;
  onClose?: () => void;
}

export const ColoringCanvasStudio: React.FC<ColoringCanvasStudioProps> = ({
  initialPhotoUrl,
  initialPhotoTitle,
  onClose,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ColoringTemplate>(
    COLORING_TEMPLATES[0]
  );
  const [selectedColor, setSelectedColor] = useState<string>('#DC2626');
  const [penSize, setPenSize] = useState<number>(14);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [brushType, setBrushType] = useState<'crayon' | 'watercolor' | 'pen'>('crayon');
  const [guideOpacity, setGuideOpacity] = useState<number>(0.4); // 0.0 ~ 1.0
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [customPhotoBackground, setCustomPhotoBackground] = useState<string | null>(
    initialPhotoUrl || null
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  // Initialize and redraw guide when template changes
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 560;

    // Background fill
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial blank state into history
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    setIsCompleted(false);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas, selectedTemplate, customPhotoBackground]);

  // Coordinate helper that scales appropriately to canvas resolution
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Drawing Handlers using Pointer Events (Mouse, Finger Touch, Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    isDrawingRef.current = true;
    const coords = getCanvasCoords(e);
    lastPointRef.current = coords;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, penSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#FFFFFF' : selectedColor;
    ctx.fill();

    soundManager.playFlip();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPoint = getCanvasCoords(e);
    const lastPoint = lastPointRef.current || currentPoint;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = penSize;

    if (isEraser) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.globalAlpha = 1.0;
    } else {
      ctx.strokeStyle = selectedColor;
      if (brushType === 'watercolor') {
        ctx.globalAlpha = 0.35;
      } else if (brushType === 'crayon') {
        ctx.globalAlpha = 0.85;
      } else {
        ctx.globalAlpha = 1.0;
      }
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    lastPointRef.current = currentPoint;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset alpha
    ctx.globalAlpha = 1.0;

    // Push new state to history (limit to 12 steps)
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(currentState);
    if (historyRef.current.length > 12) {
      historyRef.current.shift();
    }
  };

  // Undo last stroke
  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    historyRef.current.pop(); // Remove current
    const prevState = historyRef.current[historyRef.current.length - 1];
    if (prevState) {
      ctx.putImageData(prevState, 0, 0);
      soundManager.playFlip();
    }
  };

  // Clear all
  const handleClearAll = () => {
    initCanvas();
    soundManager.playFlip();
  };

  // Finish and Stamp Congratulations
  const handleCompleteColoring = () => {
    setIsCompleted(true);
    soundManager.playVictory();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
    });
    ttsManager.speak('참 잘하셨어요! 알록달록 멋진 그림이 완성되었습니다.', {
      rate: 0.95,
      pitch: 1.0,
      persona: 'warm-mother',
    });
  };

  // Download artwork image
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundManager.playMatch();

    const link = document.createElement('a');
    link.download = `디지털학교_추억그림_${selectedTemplate.title}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="coloring-studio-container anim-pop">
      {/* 1. Header Banner */}
      <div className="studio-header">
        <div className="studio-badge">
          <Palette size={24} color="#047857" />
          <span>어르신 맞춤 감성 터치펜 색칠 교실</span>
        </div>
        <h1 className="studio-title">🎨 추억 따라그리기 &amp; 색칠하기 🌸</h1>
        <p className="studio-sub">
          원하시는 도안을 고르고, 터치펜으로 예쁘게 선을 따라 그리고 색을 칠해보세요.
        </p>
      </div>

      {/* 2. Template Selector Bar */}
      <div className="template-carousel-bar">
        <span className="template-bar-label">도안 선택:</span>
        <div className="template-buttons-strip">
          {COLORING_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              className={`template-pill-btn ${
                selectedTemplate.id === tpl.id && !customPhotoBackground ? 'active' : ''
              }`}
              onClick={() => {
                soundManager.playFlip();
                setCustomPhotoBackground(null);
                setSelectedTemplate(tpl);
              }}
            >
              <span className="tpl-emoji">{tpl.emoji}</span>
              <span className="tpl-name">{tpl.title}</span>
            </button>
          ))}

          {initialPhotoUrl && (
            <button
              type="button"
              className={`template-pill-btn photo-tpl-btn ${
                customPhotoBackground ? 'active' : ''
              }`}
              onClick={() => {
                soundManager.playFlip();
                setCustomPhotoBackground(initialPhotoUrl);
              }}
            >
              <ImageIcon size={18} />
              <span>🖼️ {initialPhotoTitle || '선택한 옛 사진 따라그리기'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Drawing Workspace Area */}
      <div className="studio-workspace-grid">
        {/* Left: Canvas Area with Layered Outline Guide */}
        <div className="canvas-column">
          <div className="canvas-card-frame">
            <div className="canvas-top-tools-bar">
              <div className="guide-opacity-control">
                <Eye size={20} color="#047857" />
                <span className="guide-label">밑그림 진하기:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={guideOpacity}
                  onChange={(e) => setGuideOpacity(Number(e.target.value))}
                  className="guide-slider"
                  aria-label="밑그림 투명도 조절"
                />
                <span className="guide-val">{Math.round(guideOpacity * 100)}%</span>
              </div>

              <div className="canvas-quick-actions">
                <button
                  type="button"
                  onClick={handleUndo}
                  className="quick-action-btn"
                  title="방금 칠한 획 취소"
                  aria-label="되돌리기"
                >
                  <Undo2 size={20} />
                  <span>되돌리기</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="quick-action-btn btn-clear"
                  title="도화지 전부 깨끗이 지우기"
                  aria-label="모두 지우기"
                >
                  <RotateCcw size={20} />
                  <span>다시 칠하기</span>
                </button>
              </div>
            </div>

            {/* Layered Canvas Container */}
            <div className="canvas-wrapper-box">
              {/* Background SVG / Photo Outline Guide */}
              <div
                className="guide-outline-layer"
                style={{ opacity: guideOpacity }}
                aria-hidden="true"
              >
                {customPhotoBackground ? (
                  <img
                    src={customPhotoBackground}
                    alt="따라그리기 밑그림 사진"
                    className="guide-bg-photo"
                  />
                ) : (
                  <OutlineSvgRenderer type={selectedTemplate.svgPath} />
                )}
              </div>

              {/* Interactive Painting Canvas */}
              <canvas
                ref={canvasRef}
                className="interactive-paint-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              />

              {/* Completion Stamp Banner */}
              {isCompleted && (
                <div className="completion-stamp-badge anim-pop">
                  <div className="stamp-circle">
                    <Heart size={36} color="#DC2626" />
                    <span>참 잘했어요!</span>
                    <small>🌸 최고의 솜씨</small>
                  </div>
                </div>
              )}
            </div>

            <div className="canvas-bottom-hint">
              <span>👆 화면을 손가락이나 터치펜으로 쓱쓱 문질러서 자유롭게 색칠해보세요.</span>
            </div>
          </div>
        </div>

        {/* Right: Touch Pen & Palette Control Panel */}
        <div className="tools-column">
          {/* 1. Touch Pen Tools & Sizes */}
          <div className="tool-box-card">
            <h2 className="tool-box-title">
              <PenTool size={22} color="#0F766E" />
              <span>터치펜 도구 선택</span>
            </h2>

            {/* Pen Type / Eraser */}
            <div className="brush-mode-tabs">
              <button
                type="button"
                className={`brush-tab-btn ${!isEraser && brushType === 'crayon' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playFlip();
                  setIsEraser(false);
                  setBrushType('crayon');
                }}
              >
                <Brush size={20} />
                <span>🖍️ 크레파스 펜</span>
              </button>
              <button
                type="button"
                className={`brush-tab-btn ${!isEraser && brushType === 'pen' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playFlip();
                  setIsEraser(false);
                  setBrushType('pen');
                }}
              >
                <PenTool size={20} />
                <span>✏️ 매직펜</span>
              </button>
              <button
                type="button"
                className={`brush-tab-btn btn-eraser ${isEraser ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playFlip();
                  setIsEraser(true);
                }}
              >
                <Eraser size={20} />
                <span>🧽 지우개 펜</span>
              </button>
            </div>

            {/* Pen Thickness Sizes */}
            <div className="pen-sizes-group">
              <span className="group-label">터치펜 굵기:</span>
              <div className="size-buttons-grid">
                {PEN_SIZES.map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    className={`pen-size-btn ${penSize === item.size ? 'active' : ''}`}
                    onClick={() => {
                      soundManager.playFlip();
                      setPenSize(item.size);
                    }}
                  >
                    <div
                      className="size-dot-preview"
                      style={{
                        width: `${item.iconSize}px`,
                        height: `${item.iconSize}px`,
                        backgroundColor: isEraser ? '#64748B' : selectedColor,
                      }}
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Senior 12-Color Palette */}
          <div className="tool-box-card">
            <div className="palette-header-row">
              <h2 className="tool-box-title">
                <Palette size={22} color="#D97706" />
                <span>알록달록 색상 팔레트</span>
              </h2>
              <div
                className="current-color-pill"
                style={{
                  backgroundColor: isEraser ? '#FFFFFF' : selectedColor,
                  border: '2px solid #0F172A',
                }}
              >
                <span>선택한 색상</span>
              </div>
            </div>

            <div className="palette-grid">
              {SENIOR_PALETTE.map((item) => {
                const isCurrent = !isEraser && selectedColor === item.color;
                return (
                  <button
                    key={item.color}
                    type="button"
                    className={`palette-color-btn ${isCurrent ? 'selected' : ''}`}
                    style={{ backgroundColor: item.color }}
                    onClick={() => {
                      soundManager.playFlip();
                      setIsEraser(false);
                      setSelectedColor(item.color);
                    }}
                    aria-label={`색상: ${item.label}`}
                  >
                    <span
                      className="color-label-tag"
                      style={{
                        color:
                          item.color === '#FFFFFF' || item.color === '#FACC15' || item.color === '#FDBA74'
                            ? '#0F172A'
                            : '#FFFFFF',
                      }}
                    >
                      {item.label}
                    </span>
                    {isCurrent && (
                      <CheckCircle2
                        size={22}
                        color={item.color === '#FFFFFF' || item.color === '#FACC15' ? '#0F172A' : '#FFFFFF'}
                        className="color-check-icon"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Completion & Download Action Buttons */}
          <div className="actions-card">
            <button
              type="button"
              onClick={handleCompleteColoring}
              className="complete-art-btn senior-btn"
              aria-label="그림 완성하기 도장 쾅"
            >
              <Sparkles size={28} />
              <span>🎉 그림 완성하기 (도장 쾅!)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              className="download-art-btn senior-btn"
              aria-label="내 그림 사진으로 저장하기"
            >
              <Download size={24} />
              <span>💾 내 그림 사진으로 저장하기</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="close-studio-btn"
                aria-label="이전 화면으로 돌아가기"
              >
                <span>이전 화면으로 돌아가기</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .coloring-studio-container {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: 16px 16px 60px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .studio-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .studio-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #D1FAE5;
          border: 2px solid #6EE7B7;
          border-radius: 24px;
          padding: 8px 24px;
          font-size: 19px;
          font-weight: 800;
          color: #065F46;
        }

        .studio-title {
          font-size: clamp(30px, 4vw, 42px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .studio-sub {
          font-size: clamp(19px, 2.4vw, 22px);
          font-weight: 700;
          color: #334155;
          margin: 0;
        }

        /* Template Carousel */
        .template-carousel-bar {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 24px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
          overflow-x: auto;
        }

        .template-bar-label {
          font-size: 19px;
          font-weight: 900;
          color: #0F766E;
          white-space: nowrap;
        }

        .template-buttons-strip {
          display: flex;
          gap: 10px;
          flex-wrap: nowrap;
        }

        .template-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 18px;
          font-weight: 800;
          border-radius: 16px;
          border: 2px solid #CBD5E1;
          background-color: #F8FAFC;
          color: #334155;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .template-pill-btn:hover {
          border-color: #0F766E;
          background-color: #F0FDF4;
        }

        .template-pill-btn.active {
          background: linear-gradient(135deg, #0F766E 0%, #047857 100%);
          border-color: #065F46;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);
        }

        .photo-tpl-btn {
          border-color: #D97706;
          background-color: #FEF3C7;
          color: #92400E;
        }

        .photo-tpl-btn.active {
          background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
          border-color: #9A3412;
          color: #FFFFFF;
        }

        /* Workspace Grid */
        .studio-workspace-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
          align-items: start;
        }

        /* Left Canvas Column */
        .canvas-card-frame {
          background-color: #FFFFFF;
          border: 4px solid #86EFAC;
          border-radius: 28px;
          padding: 20px;
          box-shadow: 0 12px 28px rgba(15, 118, 110, 0.1);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .canvas-top-tools-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 2px solid #F1F5F9;
        }

        .guide-opacity-control {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #F0FDF4;
          border: 2px solid #BBF7D0;
          border-radius: 14px;
          padding: 6px 14px;
        }

        .guide-label {
          font-size: 16px;
          font-weight: 800;
          color: #166534;
        }

        .guide-slider {
          cursor: pointer;
          accent-color: #047857;
          width: 90px;
        }

        .guide-val {
          font-size: 15px;
          font-weight: 800;
          color: #047857;
          min-width: 38px;
        }

        .canvas-quick-actions {
          display: flex;
          gap: 8px;
        }

        .quick-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 800;
          border-radius: 12px;
          border: 2px solid #CBD5E1;
          background-color: #F8FAFC;
          color: #334155;
          cursor: pointer;
        }

        .quick-action-btn:hover {
          background-color: #E2E8F0;
        }

        .btn-clear:hover {
          border-color: #EF4444;
          color: #DC2626;
        }

        /* Layered Canvas Box */
        .canvas-wrapper-box {
          position: relative;
          width: 100%;
          aspect-ratio: 800 / 560;
          background-color: #FFFFFF;
          border: 3px solid #CBD5E1;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.06);
          touch-action: none;
        }

        .guide-outline-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }

        .guide-bg-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) contrast(150%);
        }

        .interactive-paint-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          cursor: crosshair;
          touch-action: none;
        }

        .completion-stamp-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          pointer-events: none;
        }

        .stamp-circle {
          background-color: #FEF2F2;
          border: 4px dashed #DC2626;
          border-radius: 50%;
          width: 140px;
          height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #DC2626;
          font-size: 19px;
          font-weight: 900;
          transform: rotate(-12deg);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.25);
        }

        .stamp-circle small {
          font-size: 13px;
          font-weight: 800;
        }

        .canvas-bottom-hint {
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          color: #047857;
          background-color: #F0FDF4;
          padding: 8px;
          border-radius: 12px;
        }

        /* Right Tools Column */
        .tools-column {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .tool-box-card {
          background-color: #FFFFFF;
          border: 3px solid #E2E8F0;
          border-radius: 24px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
        }

        .tool-box-title {
          font-size: 21px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Brush Tabs */
        .brush-mode-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .brush-tab-btn {
          padding: 10px 8px;
          font-size: 15px;
          font-weight: 800;
          border-radius: 14px;
          border: 2px solid #CBD5E1;
          background-color: #F8FAFC;
          color: #334155;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .brush-tab-btn.active {
          background: linear-gradient(135deg, #0F766E 0%, #047857 100%);
          border-color: #065F46;
          color: #FFFFFF;
        }

        .btn-eraser.active {
          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
          border-color: #991B1B;
          color: #FFFFFF;
        }

        /* Pen sizes */
        .pen-sizes-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .group-label {
          font-size: 15px;
          font-weight: 800;
          color: #64748B;
        }

        .size-buttons-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pen-size-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          font-size: 17px;
          font-weight: 800;
          border-radius: 14px;
          border: 2px solid #CBD5E1;
          background-color: #FFFFFF;
          color: #1E293B;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
        }

        .pen-size-btn.active {
          border-color: #059669;
          background-color: #ECFDF5;
          color: #065F46;
          border-width: 3px;
        }

        .size-dot-preview {
          border-radius: 50%;
          flex-shrink: 0;
          border: 1px solid rgba(0,0,0,0.2);
        }

        /* Palette Grid */
        .palette-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .current-color-pill {
          padding: 4px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 900;
        }

        .palette-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .palette-color-btn {
          aspect-ratio: 1;
          border-radius: 16px;
          border: 3px solid rgba(0, 0, 0, 0.15);
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 6px;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .palette-color-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .palette-color-btn.selected {
          transform: scale(1.12);
          border: 4px solid #0F172A;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
        }

        .color-label-tag {
          font-size: 13px;
          font-weight: 900;
          text-shadow: 0 1px 2px rgba(0,0,0,0.6);
        }

        .color-check-icon {
          position: absolute;
          top: 4px;
          right: 4px;
        }

        /* Action Cards */
        .actions-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .complete-art-btn {
          width: 100%;
          min-height: 64px;
          background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
          border: 3px solid #9A3412;
          border-radius: 20px;
          color: #FFFFFF;
          font-size: 21px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(234, 88, 12, 0.35);
        }

        .download-art-btn {
          width: 100%;
          min-height: 56px;
          background: linear-gradient(135deg, #0F766E 0%, #047857 100%);
          border: 3px solid #065F46;
          border-radius: 18px;
          color: #FFFFFF;
          font-size: 19px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
        }

        .close-studio-btn {
          width: 100%;
          min-height: 48px;
          background-color: #F1F5F9;
          border: 2px solid #CBD5E1;
          border-radius: 16px;
          color: #475569;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .studio-workspace-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// ── SVG 도안 외곽선 렌더러 컴포넌트 ──────────────────────────────
function OutlineSvgRenderer({ type }: { type: string }) {
  switch (type) {
    case 'marbles':
      return (
        <svg viewBox="0 0 800 560" width="100%" height="100%">
          <circle cx="400" cy="280" r="190" fill="none" stroke="#334155" strokeWidth="6" strokeDasharray="14 10" />
          <circle cx="340" cy="230" r="55" fill="none" stroke="#0F172A" strokeWidth="6" />
          <circle cx="470" cy="250" r="60" fill="none" stroke="#0F172A" strokeWidth="6" />
          <circle cx="390" cy="350" r="65" fill="none" stroke="#0F172A" strokeWidth="6" />
          {/* Internal shine / swirls */}
          <path d="M 310 210 Q 340 250 370 230" fill="none" stroke="#64748B" strokeWidth="4" />
          <path d="M 440 230 Q 470 270 500 250" fill="none" stroke="#64748B" strokeWidth="4" />
          <path d="M 360 330 Q 390 370 420 350" fill="none" stroke="#64748B" strokeWidth="4" />
        </svg>
      );

    case 'ddakji':
      return (
        <svg viewBox="0 0 800 560" width="100%" height="100%">
          {/* 딱지 1 */}
          <rect x="180" y="160" width="220" height="220" rx="14" fill="none" stroke="#0F172A" strokeWidth="7" transform="rotate(-15 290 270)" />
          <line x1="200" y1="180" x2="380" y2="360" stroke="#475569" strokeWidth="5" transform="rotate(-15 290 270)" />
          <line x1="380" y1="180" x2="200" y2="360" stroke="#475569" strokeWidth="5" transform="rotate(-15 290 270)" />

          {/* 딱지 2 */}
          <rect x="400" y="140" width="240" height="240" rx="14" fill="none" stroke="#0F172A" strokeWidth="7" transform="rotate(20 520 260)" />
          <line x1="420" y1="160" x2="620" y2="360" stroke="#475569" strokeWidth="5" transform="rotate(20 520 260)" />
          <line x1="620" y1="160" x2="420" y2="360" stroke="#475569" strokeWidth="5" transform="rotate(20 520 260)" />
        </svg>
      );

    case 'dalgona':
      return (
        <svg viewBox="0 0 800 560" width="100%" height="100%">
          <circle cx="400" cy="280" r="180" fill="none" stroke="#0F172A" strokeWidth="7" />
          <circle cx="400" cy="280" r="150" fill="none" stroke="#64748B" strokeWidth="4" strokeDasharray="8 6" />
          {/* Big Star */}
          <polygon
            points="400,160 435,235 515,235 450,285 475,360 400,315 325,360 350,285 285,235 365,235"
            fill="none"
            stroke="#0F172A"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Handle needle */}
          <line x1="580" y1="120" x2="480" y2="220" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
          <circle cx="590" cy="110" r="12" fill="none" stroke="#0F172A" strokeWidth="4" />
        </svg>
      );

    case 'hibiscus':
      return (
        <svg viewBox="0 0 800 560" width="100%" height="100%">
          {/* Flower 5 petals */}
          <ellipse cx="400" cy="180" rx="85" ry="75" fill="none" stroke="#0F172A" strokeWidth="6" />
          <ellipse cx="490" cy="250" rx="85" ry="75" fill="none" stroke="#0F172A" strokeWidth="6" transform="rotate(72 490 250)" />
          <ellipse cx="460" cy="360" rx="85" ry="75" fill="none" stroke="#0F172A" strokeWidth="6" transform="rotate(144 460 360)" />
          <ellipse cx="340" cy="360" rx="85" ry="75" fill="none" stroke="#0F172A" strokeWidth="6" transform="rotate(216 340 360)" />
          <ellipse cx="310" cy="250" rx="85" ry="75" fill="none" stroke="#0F172A" strokeWidth="6" transform="rotate(288 310 250)" />

          {/* Center pistil */}
          <circle cx="400" cy="280" r="38" fill="none" stroke="#0F172A" strokeWidth="5" />
          <line x1="400" y1="280" x2="400" y2="170" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
          <circle cx="400" cy="160" r="16" fill="none" stroke="#0F172A" strokeWidth="5" />
        </svg>
      );

    case 'apple':
      return (
        <svg viewBox="0 0 800 560" width="100%" height="100%">
          {/* Apple body */}
          <path
            d="M 400 200 C 330 140 240 200 240 310 C 240 430 350 470 400 450 C 450 470 560 430 560 310 C 560 200 470 140 400 200 Z"
            fill="none"
            stroke="#0F172A"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Stem */}
          <path d="M 400 195 Q 410 130 435 110" fill="none" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M 415 155 Q 470 120 480 160 Q 435 180 415 155 Z" fill="none" stroke="#0F172A" strokeWidth="6" />
        </svg>
      );

    case 'hanok':
      return (
        <svg viewBox="0 0 800 560" width="100%" height="100%">
          {/* Giwa roof curved */}
          <path
            d="M 160 240 Q 400 170 640 240 L 610 290 Q 400 240 190 290 Z"
            fill="none"
            stroke="#0F172A"
            strokeWidth="8"
          />
          {/* Roof tiles lines */}
          <line x1="260" y1="230" x2="280" y2="280" stroke="#475569" strokeWidth="4" />
          <line x1="340" y1="210" x2="355" y2="270" stroke="#475569" strokeWidth="4" />
          <line x1="400" y1="200" x2="400" y2="265" stroke="#475569" strokeWidth="4" />
          <line x1="460" y1="210" x2="445" y2="270" stroke="#475569" strokeWidth="4" />
          <line x1="540" y1="230" x2="520" y2="280" stroke="#475569" strokeWidth="4" />

          {/* Pillars & House frame */}
          <rect x="220" y="290" width="360" height="170" fill="none" stroke="#0F172A" strokeWidth="7" />
          {/* Columns */}
          <line x1="250" y1="290" x2="250" y2="460" stroke="#0F172A" strokeWidth="8" />
          <line x1="390" y1="290" x2="390" y2="460" stroke="#0F172A" strokeWidth="8" />
          <line x1="550" y1="290" x2="550" y2="460" stroke="#0F172A" strokeWidth="8" />

          {/* Windows / Traditional Doors */}
          <rect x="275" y="320" width="90" height="110" fill="none" stroke="#0F172A" strokeWidth="5" />
          <line x1="320" y1="320" x2="320" y2="430" stroke="#64748B" strokeWidth="3" />
          <line x1="275" y1="375" x2="365" y2="375" stroke="#64748B" strokeWidth="3" />

          <rect x="415" y="320" width="110" height="140" fill="none" stroke="#0F172A" strokeWidth="5" />
          <line x1="470" y1="320" x2="470" y2="460" stroke="#64748B" strokeWidth="3" />
        </svg>
      );

    default:
      return null;
  }
}
