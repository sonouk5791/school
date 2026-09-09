import React, { useState, useEffect } from 'react';
import type { StoryBookItem } from '../types/game';
import { INITIAL_STORYBOOKS } from '../constants/storybookData';
import { NURSERY_RHYMES } from '../constants/nurseryRhymeData';
import type { NurseryRhyme } from '../constants/nurseryRhymeData';
import { SentenceChoiceView } from './SentenceChoiceView';
import {
  BookOpen,
  Volume2,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  Heart,
  MousePointerClick,
  Music,
  Play,
  Square,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffect';
import { ttsManager } from '../utils/ttsManager';
import { songPlayer } from '../utils/songPlayer';

interface StorybookGalleryProps {
  onCompleteRound: (isSuccess: boolean, reactionTimeMs: number) => void;
}

export const StorybookGallery: React.FC<StorybookGalleryProps> = ({ onCompleteRound }) => {
  // Main Tab mode: 'books' | 'sentence-choice' | 'rhymes'
  const [galleryTab, setGalleryTab] = useState<'books' | 'sentence-choice' | 'rhymes'>('books');

  // Nursery Rhyme States
  const [activeRhyme, setActiveRhyme] = useState<NurseryRhyme | null>(null);
  const [isRhymePlaying, setIsRhymePlaying] = useState<boolean>(false);
  const [rhymePlayMode, setRhymePlayMode] = useState<'both' | 'melody' | 'lyrics' | null>(null);
  const [activeLyricIndex, setActiveLyricIndex] = useState<number>(-1);
  const [rhymeProgress, setRhymeProgress] = useState<number>(0);

  const [books, setBooks] = useState<StoryBookItem[]>(() => {
    const saved = localStorage.getItem('senior_custom_storybooks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...INITIAL_STORYBOOKS, ...parsed];
      } catch {
        return INITIAL_STORYBOOKS;
      }
    }
    return INITIAL_STORYBOOKS;
  });

  const [activeBook, setActiveBook] = useState<StoryBookItem | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);

  // Creation Modal States
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newPage1, setNewPage1] = useState<string>('');
  const [newPage2, setNewPage2] = useState<string>('');
  const [newEmoji, setNewEmoji] = useState<string>('📖');

  const startTimeRef = React.useRef<number>(performance.now());

  useEffect(() => {
    startTimeRef.current = performance.now();
  }, [activeBook]);

  useEffect(() => {
    return () => {
      songPlayer.stop();
      ttsManager.stop();
    };
  }, []);

  // Nursery Rhyme Playback Handlers
  const handleStopRhyme = () => {
    songPlayer.stop();
    ttsManager.stop();
    setIsRhymePlaying(false);
    setRhymePlayMode(null);
    setActiveLyricIndex(-1);
    setRhymeProgress(0);
  };

  // 1. 🎵 동요 음원(반주) + 다정한 가사 함께 듣기
  const handlePlayRhymeBoth = (rhyme: NurseryRhyme) => {
    handleStopRhyme();
    setIsRhymePlaying(true);
    setRhymePlayMode('both');
    setActiveLyricIndex(0);

    // 반주/멜로디 재생
    songPlayer.playSong(
      rhyme.id,
      (noteIdx, totalNotes) => {
        const lineIdx = Math.min(
          rhyme.lyricLines.length - 1,
          Math.floor((noteIdx / totalNotes) * rhyme.lyricLines.length)
        );
        setActiveLyricIndex(lineIdx);
        setRhymeProgress(Math.round(((noteIdx + 1) / totalNotes) * 100));
      },
      () => {
        handleStopRhyme();
      }
    );

    // 가사 노래/낭독 (밝고 다정한 페르소나)
    ttsManager.speak(rhyme.lyrics, {
      rate: 0.82,
      pitch: 1.08,
      persona: 'cheerful-story',
      onEnd: () => {
        // melody will continue to its natural end
      },
      onError: () => {
        // keep melody going
      },
    });
  };

  // 2. 🎹 멜로디(반주)만 듣기
  const handlePlayRhymeMelodyOnly = (rhyme: NurseryRhyme) => {
    handleStopRhyme();
    setIsRhymePlaying(true);
    setRhymePlayMode('melody');
    setActiveLyricIndex(0);

    songPlayer.playSong(
      rhyme.id,
      (noteIdx, totalNotes) => {
        const lineIdx = Math.min(
          rhyme.lyricLines.length - 1,
          Math.floor((noteIdx / totalNotes) * rhyme.lyricLines.length)
        );
        setActiveLyricIndex(lineIdx);
        setRhymeProgress(Math.round(((noteIdx + 1) / totalNotes) * 100));
      },
      () => {
        handleStopRhyme();
      }
    );
  };

  // 3. 🗣️ 가사 낭독만 듣기
  const handlePlayRhymeLyricsOnly = (rhyme: NurseryRhyme) => {
    handleStopRhyme();
    setIsRhymePlaying(true);
    setRhymePlayMode('lyrics');
    setActiveLyricIndex(0);

    ttsManager.speak(rhyme.lyrics, {
      rate: 0.82,
      pitch: 1.08,
      persona: 'cheerful-story',
      onEnd: () => {
        handleStopRhyme();
      },
      onError: () => {
        handleStopRhyme();
      },
    });
  };

  // Read Aloud Text-to-Speech (TTS)
  const handleReadAloud = (text: string) => {
    setIsReadingAloud(true);
    ttsManager.speak(text, {
      rate: 0.88,
      pitch: 1.02,
      onStart: () => setIsReadingAloud(true),
      onEnd: () => setIsReadingAloud(false),
      onError: () => setIsReadingAloud(false),
    });
  };

  const handleStopSpeech = () => {
    ttsManager.stop();
    setIsReadingAloud(false);
  };

  const handleOpenBook = (book: StoryBookItem) => {
    soundManager.playFlip();
    setActiveBook(book);
    setCurrentPageIndex(0);
    handleStopSpeech();
  };

  const handleCloseBook = () => {
    handleStopSpeech();
    setActiveBook(null);
  };

  const handleNextPage = () => {
    if (!activeBook) return;
    soundManager.playFlip();
    handleStopSpeech();

    if (currentPageIndex < activeBook.pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      soundManager.playMatch();
      const totalTimeMs = Math.round(performance.now() - startTimeRef.current);
      onCompleteRound(true, totalTimeMs);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      soundManager.playFlip();
      handleStopSpeech();
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleSaveCustomBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPage1) return;

    const newBook: StoryBookItem = {
      id: `custom-book-${Date.now()}`,
      title: newTitle,
      category: '나만의 추억 책',
      coverEmoji: newEmoji || '📖',
      description: newDesc || '어르신과 가족이 정성껏 만든 소중한 추억 이야기 책입니다.',
      pages: [
        {
          pageNumber: 1,
          text: newPage1,
          imageEmoji: '🌸',
        },
        ...(newPage2
          ? [
              {
                pageNumber: 2,
                text: newPage2,
                imageEmoji: '☀️',
              },
            ]
          : []),
      ],
    };

    const updated = [...books, newBook];
    setBooks(updated);

    const customOnly = updated.filter((b) => b.category.includes('나만의'));
    localStorage.setItem('senior_custom_storybooks', JSON.stringify(customOnly));

    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewPage1('');
    setNewPage2('');
    soundManager.playMatch();
  };

  return (
    <div className="storybook-gallery-container">
      {/* Top Tab Bar */}
      <div className="gallery-tab-bar">
        <button
          onClick={() => {
            soundManager.playFlip();
            setGalleryTab('books');
          }}
          className={`gallery-tab-btn ${galleryTab === 'books' ? 'active' : ''}`}
        >
          <BookOpen size={24} />
          <span>📖 이야기 책 낭독관</span>
        </button>

        <button
          onClick={() => {
            soundManager.playFlip();
            setGalleryTab('sentence-choice');
          }}
          className={`gallery-tab-btn ${galleryTab === 'sentence-choice' ? 'active' : ''}`}
        >
          <MousePointerClick size={24} />
          <span>✍️ 문장 터치 선택</span>
        </button>

        <button
          onClick={() => {
            soundManager.playFlip();
            handleStopRhyme();
            setActiveRhyme(null);
            setGalleryTab('rhymes');
          }}
          className={`gallery-tab-btn rhyme-tab ${galleryTab === 'rhymes' ? 'active' : ''}`}
        >
          <Music size={24} />
          <span>🎵 동요 듣기</span>
        </button>
      </div>

      {galleryTab === 'sentence-choice' ? (
        <SentenceChoiceView onCompleteRound={onCompleteRound} />
      ) : galleryTab === 'rhymes' ? (
        <div className="rhyme-section anim-pop">
          {/* 동요 헤더 */}
          <div className="gallery-header">
            <div className="header-badge rhyme-badge">
              <Music size={28} color="#7C3AED" />
              <span>추억 회상 요법 · 정다운 동요 음원 & 낭독관</span>
            </div>
            <h2 className="gallery-title">🎵 동요 음원 듣기 방 🌸</h2>
            <p className="gallery-sub">
              정겨운 멜로디 음원과 다정한 목소리로 부르는 옛 동요를 함께 듣고 따라 불러보세요!
            </p>
          </div>

          {/* 동요 상세 보기 */}
          {activeRhyme ? (
            <div className="rhyme-detail-card anim-pop">
              <div className="rhyme-detail-top-bar">
                <button
                  onClick={() => {
                    handleStopRhyme();
                    setActiveRhyme(null);
                    soundManager.playFlip();
                  }}
                  className="reader-back-btn senior-btn senior-btn-secondary"
                >
                  <ArrowLeft size={24} />
                  <span>동요 목록으로</span>
                </button>

                {isRhymePlaying && (
                  <div className="rhyme-playing-pill anim-pulse">
                    <span className="equalizer-bars">
                      <span className="eq-bar bar-1"></span>
                      <span className="eq-bar bar-2"></span>
                      <span className="eq-bar bar-3"></span>
                      <span className="eq-bar bar-4"></span>
                    </span>
                    <span>
                      {rhymePlayMode === 'both'
                        ? '🎶 동요 음원 + 가사 함께 재생 중...'
                        : rhymePlayMode === 'melody'
                        ? '🎹 멜로디 반주 재생 중...'
                        : '🗣️ 가사 낭독 재생 중...'}
                    </span>
                  </div>
                )}
              </div>

              <div className="rhyme-detail-content">
                <div className="rhyme-cover-large-wrapper">
                  <div className="rhyme-cover-large anim-bounce">{activeRhyme.coverEmoji}</div>
                  {isRhymePlaying && (
                    <div className="floating-music-notes">
                      <span className="f-note n1">🎵</span>
                      <span className="f-note n2">🎶</span>
                      <span className="f-note n3">✨</span>
                    </div>
                  )}
                </div>

                <span className="book-category">{activeRhyme.category}</span>
                <h3 className="book-reader-title">{activeRhyme.title}</h3>
                <p className="rhyme-card-desc-detail">{activeRhyme.description}</p>

                {/* 가사 박스 (실시간 진행 하이라이트) */}
                <div className="rhyme-lyrics-box">
                  <div className="lyrics-box-header">
                    <Sparkles size={20} color="#7C3AED" />
                    <span>정겨운 동요 가사</span>
                  </div>
                  {activeRhyme.lyricLines.map((line, idx) => (
                    <div
                      key={idx}
                      className={`rhyme-lyric-line-wrapper ${activeLyricIndex === idx ? 'active-singing' : ''}`}
                    >
                      {activeLyricIndex === idx && <span className="lyric-note-indicator">🎵</span>}
                      <p className="rhyme-lyric-line">{line}</p>
                    </div>
                  ))}

                  {isRhymePlaying && rhymeProgress > 0 && (
                    <div className="rhyme-progress-container">
                      <div className="rhyme-progress-track">
                        <div
                          className="rhyme-progress-fill"
                          style={{ width: `${rhymeProgress}%` }}
                        />
                      </div>
                      <span className="rhyme-progress-label">진행률: {rhymeProgress}%</span>
                    </div>
                  )}
                </div>

                {/* 재생 제어 컨트롤 버튼 그룹 */}
                <div className="rhyme-controls-container">
                  {isRhymePlaying ? (
                    <button
                      onClick={handleStopRhyme}
                      className="rhyme-stop-btn senior-btn"
                    >
                      <Square size={28} />
                      <span>⏹️ 연주 멈추기 (정지)</span>
                    </button>
                  ) : (
                    <div className="rhyme-play-buttons-grid">
                      {/* 1. 메인: 음원 + 노래 함께 듣기 */}
                      <button
                        onClick={() => handlePlayRhymeBoth(activeRhyme)}
                        className="rhyme-play-btn-primary senior-btn"
                      >
                        <Play size={28} fill="currentColor" />
                        <div className="btn-text-col">
                          <span className="btn-main-label">🎶 동요 음원 + 가사 함께 듣기</span>
                          <span className="btn-sub-label">멜로디 반주와 다정한 음성이 함께 나와요</span>
                        </div>
                      </button>

                      {/* 2. 보조 1: 멜로디 반주만 듣기 */}
                      <button
                        onClick={() => handlePlayRhymeMelodyOnly(activeRhyme)}
                        className="rhyme-play-btn-secondary senior-btn"
                      >
                        <Music size={24} />
                        <span>🎹 멜로디(반주)만 듣기</span>
                      </button>

                      {/* 3. 보조 2: 가사 낭독만 듣기 */}
                      <button
                        onClick={() => handlePlayRhymeLyricsOnly(activeRhyme)}
                        className="rhyme-play-btn-secondary senior-btn"
                      >
                        <Volume2 size={24} />
                        <span>🗣️ 가사 낭독만 듣기</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* 동요 목록 그리드 */
            <div className="rhyme-grid">
              {NURSERY_RHYMES.map((rhyme) => (
                <div
                  key={rhyme.id}
                  className="rhyme-card anim-pop"
                  onClick={() => {
                    soundManager.playFlip();
                    handleStopRhyme();
                    setActiveRhyme(rhyme);
                  }}
                >
                  <div className="rhyme-card-emoji">{rhyme.coverEmoji}</div>
                  <div className="rhyme-card-info">
                    <span className="rhyme-card-tag">{rhyme.category}</span>
                    <h3 className="rhyme-card-title">{rhyme.title}</h3>
                    <p className="rhyme-card-desc">{rhyme.description}</p>
                    <div className="rhyme-card-hint">
                      <Music size={18} />
                      <span>터치하여 음원 듣기 ▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Header Banner */}
          <div className="gallery-header">
            <div className="header-badge">
              <BookOpen size={30} color="#0F766E" />
              <span>추억 회상 요법 · 따뜻한 이야기 책 읽어주는 방</span>
            </div>
            <h2 className="gallery-title">📖 책을 읽어주는 방 🌸</h2>
            <p className="gallery-sub">
              사람 목소리처럼 다정한 음성으로 동화와 추억 이야기를 듣고, 나만의 이야기 책을 만들어보세요.
            </p>

            <div className="create-buttons-row">
              <button
                onClick={() => setShowCreateModal(true)}
                className="senior-btn senior-btn-primary create-book-btn"
              >
                <PlusCircle size={26} />
                <span>✍️ 나만의 추억 책 만들기</span>
              </button>
            </div>
          </div>

          {/* Reader View Modal */}
          {activeBook ? (
            <div className="reader-view-card anim-pop">
              <button onClick={handleCloseBook} className="reader-back-btn senior-btn senior-btn-secondary">
                <ArrowLeft size={24} />
                <span>책 목록으로 돌아가기</span>
              </button>

              <div className="reader-content">
                <div className="reader-meta">
                  <span className="book-category">{activeBook.category}</span>
                  <h3 className="book-reader-title">{activeBook.title}</h3>
                </div>

                {activeBook.pages[currentPageIndex] && (
                  <div className="page-box">
                    <div className="page-emoji-display">
                      {activeBook.pages[currentPageIndex].imageEmoji}
                    </div>

                    <p className="page-text-content">
                      {activeBook.pages[currentPageIndex].text}
                    </p>

                    <button
                      onClick={() =>
                        isReadingAloud
                          ? handleStopSpeech()
                          : handleReadAloud(activeBook.pages[currentPageIndex].text)
                      }
                      className={`tts-btn ${isReadingAloud ? 'speaking' : ''}`}
                    >
                      <Volume2 size={26} />
                      <span>{isReadingAloud ? '🔊 낭독 멈추기' : '🔊 다정한 목소리로 읽어주기'}</span>
                    </button>
                  </div>
                )}

                <div className="reader-nav-bar">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className="senior-btn senior-btn-secondary nav-page-btn"
                  >
                    <ArrowLeft size={28} />
                    <span>이전 쪽</span>
                  </button>

                  <span className="page-indicator">
                    {currentPageIndex + 1} / {activeBook.pages.length} 쪽
                  </span>

                  <button
                    onClick={handleNextPage}
                    className="senior-btn senior-btn-primary nav-page-btn"
                  >
                    <span>
                      {currentPageIndex === activeBook.pages.length - 1
                        ? '완독하기'
                        : '다음 쪽'}
                    </span>
                    <ArrowRight size={28} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bookshelf-grid">
              {books.map((book) => (
                <div key={book.id} className="book-card anim-pop" onClick={() => handleOpenBook(book)}>
                  <div className="book-cover-icon">{book.coverEmoji}</div>
                  <div className="book-info">
                    <span className="book-tag">{book.category}</span>
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-desc">{book.description}</p>
                    <div className="book-action-hint">
                      <BookOpen size={20} />
                      <span>책 펼쳐서 음성으로 듣기 ➔</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Creation Modal (Storybook) */}
      {showCreateModal && (
        <div className="modal-overlay anim-fade">
          <div className="create-modal-card anim-pop">
            <h3 className="create-title">
              ✍️ 나만의 추억 이야기 책 만들기
            </h3>
            <p className="create-sub">
              직접 쓰지 않으셔도 <strong>아래 예시 문장을 터치</strong>하면 자동으로 채워집니다.
            </p>

            <form onSubmit={handleSaveCustomBook} className="create-form">
              <div className="form-group">
                <label>책 표지 그림 선택:</label>
                <div className="emoji-select-row">
                  {['📖', '🌸', '🏡', '🌾', '🧺', '❤️', '☀️', '🎪'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewEmoji(em)}
                      className={`emoji-pick-btn ${newEmoji === em ? 'active' : ''}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>이야기 책 제목:</label>
                <input
                  type="text"
                  placeholder="예: 나의 고향 동네 이야기"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="senior-input"
                />

                <div className="example-buttons-group">
                  <span className="example-label">👉 터치하여 추천 제목 넣기:</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewTitle('나의 정겨운 고향 골목길 이야기');
                    }}
                    className="example-touch-btn"
                  >
                    🌸 예시 1: "나의 정겨운 고향 골목길 이야기"
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewTitle('가족과 함께한 행복한 소풍날');
                    }}
                    className="example-touch-btn"
                  >
                    🍱 예시 2: "가족과 함께한 행복한 소풍날"
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>간단한 설명:</label>
                <input
                  type="text"
                  placeholder="예: 따뜻했던 옛 추억을 회상하는 글"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="senior-input"
                />

                <div className="example-buttons-group">
                  <span className="example-label">👉 터치하여 추천 설명 넣기:</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewDesc('따스했던 옛 고향 추억을 다정하게 되돌아보는 글');
                    }}
                    className="example-touch-btn"
                  >
                    🏡 예시 1: "따스했던 옛 고향 추억을 다정하게 되돌아보는 글"
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewDesc('사랑하는 가족들과 함께 웃었던 정다운 기억의 기록');
                    }}
                    className="example-touch-btn"
                  >
                    ❤️ 예시 2: "사랑하는 가족들과 함께 웃었던 정다운 기억의 기록"
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>첫 번째 쪽 이야기 글:</label>
                <textarea
                  rows={3}
                  placeholder="이야기를 적어보세요..."
                  value={newPage1}
                  onChange={(e) => setNewPage1(e.target.value)}
                  required
                  className="senior-textarea"
                />

                <div className="example-buttons-group">
                  <span className="example-label">👉 터치하여 예시 문장 바로 넣기:</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewPage1('햇살 따스한 봄날, 정겨운 고향 마을 골목길을 소담스럽게 거닐며 담벼락 밑 노란 민들레를 봅니다.');
                    }}
                    className="example-touch-btn"
                  >
                    🌸 예시 문장 1: "햇살 따스한 봄날, 정겨운 고향 마을 골목길을 거닐어 봅니다."
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewPage1('이른 아침부터 온 가족이 모여 정성껏 소풍 김밥을 싸고, 푸른 하늘 아래 돗자리를 폅니다.');
                    }}
                    className="example-touch-btn"
                  >
                    🍱 예시 문장 2: "이른 아침 온 가족이 모여 정성껏 소풍 김밥을 쌉니다."
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>두 번째 쪽 이야기 글 (선택):</label>
                <textarea
                  rows={3}
                  placeholder="다음 이야기를 적어보세요..."
                  value={newPage2}
                  onChange={(e) => setNewPage2(e.target.value)}
                  className="senior-textarea"
                />

                <div className="example-buttons-group">
                  <span className="example-label">👉 터치하여 예시 문장 바로 넣기:</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewPage2('이웃 삼촌, 숙모님들과 툇마루에 앉아 따뜻한 찻잔을 나누며 정다운 웃음꽃을 피웁니다.');
                    }}
                    className="example-touch-btn"
                  >
                    🍵 예시 문장 1: "툇마루에 앉아 이웃과 따뜻한 찻잔을 나누며 웃음꽃을 피웁니다."
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewPage2('사랑하는 사람들의 천진난만한 웃음소리에 하루 종일 가슴 가득 따스한 온기가 차오릅니다.');
                    }}
                    className="example-touch-btn"
                  >
                    🎈 예시 문장 2: "사랑하는 사람들의 웃음소리에 가슴 가득 온기가 차오릅니다."
                  </button>
                </div>
              </div>

              <div className="create-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="senior-btn senior-btn-secondary"
                >
                  취소하기
                </button>
                <button type="submit" className="senior-btn senior-btn-primary">
                  <Heart size={24} />
                  <span>추억 책 완성하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        /* ===== 동요 섹션 스타일 ===== */
        .rhyme-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .rhyme-badge {
          background-color: #EDE9FE !important;
          border-color: #C4B5FD !important;
          color: #7C3AED !important;
        }

        .rhyme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
          width: 100%;
        }

        .rhyme-card {
          background-color: #FFFFFF;
          border: 3px solid #7C3AED;
          border-radius: 24px;
          padding: 22px;
          display: flex;
          gap: 16px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(124, 58, 237, 0.12);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .rhyme-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(124, 58, 237, 0.22);
        }

        .rhyme-card-emoji {
          font-size: 52px;
          background-color: #F5F3FF;
          border: 2px solid #DDD6FE;
          border-radius: 18px;
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rhyme-card-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .rhyme-card-tag {
          font-size: 13px;
          font-weight: 800;
          color: #7C3AED;
          background-color: #EDE9FE;
          padding: 2px 10px;
          border-radius: 10px;
          align-self: flex-start;
        }

        .rhyme-card-title {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
        }

        .rhyme-card-desc {
          font-size: 15px;
          font-weight: 600;
          color: #64748B;
          line-height: 1.4;
        }

        .rhyme-card-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 800;
          color: #7C3AED;
          margin-top: 4px;
        }

        .rhyme-tab.active {
          background-color: #7C3AED !important;
          border-color: #6D28D9 !important;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.28) !important;
        }

        .rhyme-detail-card {
          width: 100%;
          background-color: #FFFFFF;
          border: 4px solid #7C3AED;
          border-radius: 28px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 12px 30px rgba(124, 58, 237, 0.15);
        }

        .rhyme-detail-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .rhyme-cover-large {
          font-size: 80px;
          background-color: #F5F3FF;
          border: 3px solid #DDD6FE;
          border-radius: 28px;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rhyme-lyrics-box {
          background-color: #F5F3FF;
          border: 3px solid #DDD6FE;
          border-radius: 20px;
          padding: 28px 36px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 680px;
          width: 100%;
        }

        .rhyme-lyric-line {
          font-size: 26px;
          font-weight: 800;
          color: #1E293B;
          line-height: 1.7;
          letter-spacing: 0.04em;
        }

        .rhyme-tts-btn {
          background-color: #EDE9FE !important;
          border-color: #A78BFA !important;
          color: #6D28D9 !important;
          font-size: 22px !important;
          padding: 16px 34px !important;
        }

        .rhyme-tts-btn.speaking {
          background-color: #C2410C !important;
          border-color: #9A3412 !important;
          color: #FFFFFF !important;
        }

        /* ===== 기존 storybook 스타일 ===== */
        .storybook-gallery-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .gallery-tab-bar {
          display: flex;
          gap: 12px;
          width: 100%;
          justify-content: center;
          margin-bottom: 8px;
        }

        .gallery-tab-btn {
          flex: 1;
          max-width: 360px;
          padding: 14px 20px;
          font-size: 20px;
          font-weight: 800;
          border-radius: 18px;
          border: 3px solid #CBD5E1;
          background-color: #FFFFFF;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background-color 0.2s, border-color 0.2s;
        }

        .gallery-tab-btn.active {
          background-color: #0F766E;
          color: #FFFFFF;
          border-color: #115E59;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);
        }

        .gallery-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #CCFBF1;
          border: 2px solid #5EEAD4;
          border-radius: 20px;
          padding: 6px 20px;
          font-size: 18px;
          font-weight: 700;
          color: #0F766E;
        }

        .gallery-title {
          font-size: 32px;
          font-weight: 900;
          color: #0F172A;
        }

        .gallery-sub {
          font-size: 22px;
          font-weight: 700;
          color: #475569;
        }

        .create-buttons-row {
          display: flex;
          gap: 14px;
          margin-top: 8px;
        }

        .create-book-btn {
          min-width: 260px;
        }

        .bookshelf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          width: 100%;
        }

        .book-card {
          background-color: #FFFFFF;
          border: 3px solid #0F766E;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          gap: 16px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(15, 118, 110, 0.12);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(15, 118, 110, 0.2);
        }

        .book-cover-icon {
          font-size: 56px;
          background-color: #F0FDF4;
          border: 2px solid #BBF7D0;
          border-radius: 20px;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .book-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .book-tag {
          font-size: 14px;
          font-weight: 800;
          color: #0F766E;
          background-color: #CCFBF1;
          padding: 2px 10px;
          border-radius: 10px;
          align-self: flex-start;
        }

        .book-title {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1.3;
        }

        .book-desc {
          font-size: 16px;
          font-weight: 600;
          color: #64748B;
          line-height: 1.4;
        }

        .book-action-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 800;
          color: #0F766E;
          margin-top: 6px;
        }

        .reader-view-card {
          width: 100%;
          background-color: #FFFFFF;
          border: 4px solid #0F766E;
          border-radius: 28px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 12px 30px rgba(15, 118, 110, 0.15);
        }

        .reader-back-btn {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
        }

        .reader-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .reader-meta {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .book-category {
          background-color: #CCFBF1;
          color: #0F766E;
          font-size: 16px;
          font-weight: 800;
          padding: 4px 14px;
          border-radius: 12px;
        }

        .book-reader-title {
          font-size: 30px;
          font-weight: 900;
          color: #0F172A;
        }

        .page-box {
          background-color: #F8FAFC;
          border: 3px solid #E2E8F0;
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          min-height: 280px;
          justify-content: center;
        }

        .page-emoji-display {
          font-size: 64px;
        }

        .page-text-content {
          font-size: 26px;
          font-weight: 800;
          color: #1E293B;
          line-height: 1.6;
          max-width: 800px;
        }

        .tts-btn {
          background-color: #F0FDFA;
          border: 3px solid #5EEAD4;
          color: #0F766E;
          font-size: 20px;
          font-weight: 800;
          padding: 14px 28px;
          border-radius: 20px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: background-color 0.2s, color 0.2s;
        }

        .tts-btn.speaking {
          background-color: #C2410C;
          border-color: #9A3412;
          color: #FFFFFF;
        }

        .reader-nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
        }

        .nav-page-btn {
          min-width: 160px;
          padding: 14px 22px;
        }

        .page-indicator {
          font-size: 20px;
          font-weight: 800;
          color: #475569;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
        }

        .create-modal-card {
          background-color: #FFFFFF;
          border: 4px solid #0F766E;
          border-radius: 28px;
          padding: 30px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        }

        .create-title {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 6px;
          text-align: center;
        }

        .create-sub {
          font-size: 18px;
          font-weight: 700;
          color: #475569;
          text-align: center;
          margin-bottom: 20px;
        }

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 18px;
          font-weight: 800;
          color: #1E293B;
        }

        .emoji-select-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .emoji-pick-btn {
          font-size: 32px;
          padding: 8px 14px;
          border-radius: 14px;
          border: 2px solid #CBD5E1;
          background-color: #F8FAFC;
          cursor: pointer;
        }

        .emoji-pick-btn.active {
          border-color: #0F766E;
          background-color: #CCFBF1;
        }

        .senior-input {
          padding: 12px 18px;
          font-size: 18px;
          font-weight: 700;
          border: 2px solid #CBD5E1;
          border-radius: 14px;
        }

        .senior-textarea {
          padding: 12px 18px;
          font-size: 18px;
          font-weight: 700;
          border: 2px solid #CBD5E1;
          border-radius: 14px;
          resize: vertical;
        }

        .example-buttons-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 4px;
        }

        .example-label {
          font-size: 15px;
          font-weight: 700;
          color: #0F766E;
        }

        .example-touch-btn {
          text-align: left;
          background-color: #F0FDF4;
          border: 2px solid #86EFAC;
          border-radius: 12px;
          padding: 8px 14px;
          font-size: 16px;
          font-weight: 700;
          color: #166534;
          cursor: pointer;
        }

        .example-touch-btn:hover {
          background-color: #DCFCE7;
        }

        .create-actions {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          margin-top: 10px;
        }

        /* ─── 동요 방 (Rhymes) 스타일 ─── */
        .rhyme-badge {
          background-color: #F5F3FF;
          border-color: #DDD6FE;
          color: #7C3AED;
        }

        .rhyme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .rhyme-card {
          background: linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 100%);
          border: 3px solid #E9D5FF;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          box-shadow: 0 8px 16px rgba(124, 58, 237, 0.08);
        }

        .rhyme-card:hover {
          transform: translateY(-6px);
          border-color: #8B5CF6;
          box-shadow: 0 16px 28px rgba(124, 58, 237, 0.16);
        }

        .rhyme-card-emoji {
          font-size: 64px;
          margin-bottom: 12px;
        }

        .rhyme-card-tag {
          display: inline-block;
          background-color: #EDE9FE;
          color: #6D28D9;
          font-size: 15px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .rhyme-card-title {
          font-size: 24px;
          font-weight: 900;
          color: #1E1B4B;
          margin: 0 0 8px 0;
        }

        .rhyme-card-desc {
          font-size: 16px;
          font-weight: 600;
          color: #6B7280;
          line-height: 1.4;
          margin-bottom: 14px;
        }

        .rhyme-card-hint {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #7C3AED;
          font-weight: 800;
          font-size: 15px;
          background-color: #F5F3FF;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #DDD6FE;
        }

        .rhyme-detail-card {
          background-color: #FFFFFF;
          border: 4px solid #C4B5FD;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 12px 30px rgba(124, 58, 237, 0.12);
        }

        .rhyme-detail-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .rhyme-playing-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #7C3AED 0%, #9333EA 100%);
          color: #FFFFFF;
          font-size: 17px;
          font-weight: 800;
          padding: 8px 18px;
          border-radius: 30px;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .equalizer-bars {
          display: inline-flex;
          align-items: flex-end;
          gap: 3px;
          height: 18px;
        }

        .eq-bar {
          width: 4px;
          background-color: #FDE047;
          border-radius: 2px;
          animation: eqAnimation 0.8s ease-in-out infinite alternate;
        }

        .bar-1 { height: 60%; animation-delay: 0.1s; }
        .bar-2 { height: 100%; animation-delay: 0.3s; }
        .bar-3 { height: 40%; animation-delay: 0.2s; }
        .bar-4 { height: 80%; animation-delay: 0.4s; }

        @keyframes eqAnimation {
          0% { height: 20%; }
          100% { height: 100%; }
        }

        .rhyme-cover-large-wrapper {
          position: relative;
          display: inline-block;
        }

        .rhyme-cover-large {
          font-size: 90px;
          line-height: 1;
          margin-bottom: 10px;
        }

        .floating-music-notes {
          position: absolute;
          top: -10px;
          right: -20px;
          display: flex;
          gap: 6px;
        }

        .f-note {
          font-size: 28px;
          animation: floatNote 1.4s ease-in-out infinite alternate;
        }

        .f-note.n1 { animation-delay: 0s; }
        .f-note.n2 { animation-delay: 0.4s; }
        .f-note.n3 { animation-delay: 0.8s; }

        @keyframes floatNote {
          0% { transform: translateY(0px) scale(0.9); opacity: 0.7; }
          100% { transform: translateY(-16px) scale(1.15); opacity: 1; }
        }

        .rhyme-detail-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .rhyme-card-desc-detail {
          font-size: 18px;
          font-weight: 700;
          color: #6B7280;
          margin: 4px 0 20px 0;
        }

        .rhyme-lyrics-box {
          width: 100%;
          max-width: 680px;
          background: linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%);
          border: 3px solid #DDD6FE;
          border-radius: 24px;
          padding: 24px 30px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .lyrics-box-header {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 17px;
          font-weight: 800;
          color: #7C3AED;
          margin-bottom: 8px;
        }

        .rhyme-lyric-line-wrapper {
          padding: 10px 18px;
          border-radius: 16px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .rhyme-lyric-line-wrapper.active-singing {
          background: linear-gradient(135deg, #FEF08A 0%, #FDE047 100%);
          border: 2px solid #EAB308;
          box-shadow: 0 4px 12px rgba(234, 179, 8, 0.35);
          transform: scale(1.03);
        }

        .rhyme-lyric-line {
          font-size: 24px;
          font-weight: 800;
          color: #1E293B;
          line-height: 1.5;
          margin: 0;
        }

        .active-singing .rhyme-lyric-line {
          color: #854D0E;
          font-weight: 900;
        }

        .lyric-note-indicator {
          font-size: 20px;
          animation: spinSmall 1.5s linear infinite;
        }

        @keyframes spinSmall {
          0% { transform: scale(1); }
          50% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }

        .rhyme-controls-container {
          width: 100%;
          max-width: 680px;
          margin-top: 10px;
        }

        .rhyme-play-buttons-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .rhyme-play-btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #7C3AED 0%, #9333EA 100%);
          border: 3px solid #6D28D9;
          color: #FFFFFF;
          padding: 16px 24px;
          border-radius: 20px;
          font-size: 20px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(124, 58, 237, 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .rhyme-play-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(124, 58, 237, 0.45);
        }

        .btn-text-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .btn-main-label {
          font-size: 21px;
          font-weight: 900;
        }

        .btn-sub-label {
          font-size: 14px;
          font-weight: 600;
          opacity: 0.9;
        }

        .rhyme-play-btn-secondary {
          width: 100%;
          background-color: #FAF5FF;
          border: 2px solid #C4B5FD;
          color: #6D28D9;
          padding: 12px 20px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .rhyme-play-btn-secondary:hover {
          background-color: #F3E8FF;
        }

        .rhyme-stop-btn {
          width: 100%;
          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
          border: 3px solid #991B1B;
          color: #FFFFFF;
          padding: 16px 24px;
          border-radius: 20px;
          font-size: 22px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(220, 38, 38, 0.35);
        }
      `}</style>
    </div>
  );
};
