import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  HelpCircle,
  Mail,
  Music,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MessageCircleHeart,
  Volume2,
  VolumeX,
  Heart,
  Play,
  Square,
} from 'lucide-react';
import {
  CHILDHOOD_QUIZZES,
  REMINISCENCE_TOPICS,
  CHILDHOOD_SONGS,
  type ChildhoodQuizItem,
  type ReminiscenceTopic,
} from '../constants/childhoodData';
import { soundManager } from '../utils/soundEffect';
import { ttsManager } from '../utils/ttsManager';
import { songPlayer } from '../utils/songPlayer';

interface ChildhoodMemoryGameProps {
  onCompleteActivity?: () => void;
}

type SubActivityMode = 'quiz' | 'postcard' | 'song';

// ── 테마별 정밀 레트로 SVG/CSS 회상 그래픽 카드 렌더러 ──────────────────
function renderChildhoodIllustration(type: string) {
  switch (type) {
    case 'marbles':
      return (
        <div className="retro-card-art art-marbles">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 흙마당 원 */}
            <circle cx="80" cy="70" r="55" fill="#FDE68A" stroke="#D97706" strokeWidth="4" strokeDasharray="6 4" />
            <circle cx="80" cy="70" r="38" fill="#FEF3C7" opacity="0.8" />
            {/* 알록달록 유리구슬들 */}
            <circle cx="65" cy="58" r="14" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
            <circle cx="60" cy="54" r="4" fill="#93C5FD" />
            <circle cx="95" cy="62" r="14" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
            <circle cx="90" cy="58" r="4" fill="#FCA5A5" />
            <circle cx="78" cy="85" r="15" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
            <circle cx="74" cy="81" r="5" fill="#6EE7B7" />
            <circle cx="108" cy="88" r="11" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          </svg>
          <div className="art-badge-tag">🔮 유리구슬치기 마당</div>
        </div>
      );
    case 'rubber-jump':
      return (
        <div className="retro-card-art art-rubber">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 고무줄 두 줄 */}
            <line x1="20" y1="75" x2="140" y2="75" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
            <line x1="20" y1="92" x2="140" y2="92" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
            {/* 뛰어넘는 발동작/스파크 */}
            <circle cx="80" cy="52" r="22" fill="#EC4899" stroke="#BE185D" strokeWidth="3" />
            <path d="M 72 45 L 88 45 M 80 40 L 80 62" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <circle cx="45" cy="84" r="8" fill="#F59E0B" />
            <circle cx="115" cy="84" r="8" fill="#F59E0B" />
          </svg>
          <div className="art-badge-tag">➰ 골목길 고무줄놀이</div>
        </div>
      );
    case 'ddakji':
      return (
        <div className="retro-card-art art-ddakji">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 바닥 딱지 */}
            <rect x="35" y="45" width="50" height="50" rx="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" transform="rotate(-12 60 70)" />
            <path d="M 40 50 L 80 90 M 80 50 L 40 90" stroke="#93C5FD" strokeWidth="3" transform="rotate(-12 60 70)" />
            {/* 내리치는 왕딱지 */}
            <rect x="75" y="35" width="55" height="55" rx="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="3.5" transform="rotate(15 102 62)" />
            <path d="M 80 40 L 125 85 M 125 40 L 80 85" stroke="#FCA5A5" strokeWidth="3" transform="rotate(15 102 62)" />
            {/* 타격 바람 효과 */}
            <path d="M 68 25 Q 75 15 85 20 M 130 50 Q 140 60 135 70" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <div className="art-badge-tag">📦 종이딱지 대결</div>
        </div>
      );
    case 'spinning-top':
      return (
        <div className="retro-card-art art-top">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 얼음판 */}
            <ellipse cx="80" cy="115" rx="60" ry="16" fill="#BAE6FD" stroke="#0284C7" strokeWidth="3" />
            {/* 팽이 몸체 */}
            <polygon points="80,112 55,50 105,50" fill="#D97706" stroke="#78350F" strokeWidth="3" />
            <rect x="55" y="38" width="50" height="12" rx="4" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />
            {/* 팽이 쇠촉 */}
            <circle cx="80" cy="114" r="4" fill="#475569" />
            {/* 회전 선 */}
            <ellipse cx="80" cy="44" rx="35" ry="8" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="6 4" />
          </svg>
          <div className="art-badge-tag">🌀 얼음판 나무팽이</div>
        </div>
      );
    case 'dalgona':
      return (
        <div className="retro-card-art art-dalgona">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 국자 손잡이 */}
            <line x1="25" y1="110" x2="60" y2="85" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
            {/* 노란 달고나 둥근 판 */}
            <circle cx="92" cy="68" r="42" fill="#FBBF24" stroke="#B45309" strokeWidth="4" />
            <circle cx="92" cy="68" r="36" fill="#FCD34D" />
            {/* 가운데 찍힌 별(⭐) 문양 */}
            <polygon points="92,44 98,58 113,58 101,68 105,82 92,73 79,82 83,68 71,58 86,58" fill="#B45309" />
            {/* 바늘 핀 */}
            <line x1="130" y1="30" x2="108" y2="52" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <circle cx="132" cy="28" r="3" fill="#DC2626" />
          </svg>
          <div className="art-badge-tag">⭐ 연탄불 달고나 뽑기</div>
        </div>
      );
    case 'ice-candy':
      return (
        <div className="retro-card-art art-ice">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 얼음과자 통 */}
            <rect x="35" y="45" width="90" height="65" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="3.5" />
            <rect x="42" y="52" width="76" height="50" fill="#E0F2FE" />
            <text x="80" y="84" textAnchor="middle" fontSize="16" fontWeight="900" fill="#0369A1">아이스</text>
            {/* 아이스케키 막대 */}
            <rect x="74" y="16" width="12" height="34" rx="4" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
            <rect x="77" y="44" width="6" height="15" fill="#FDE047" />
          </svg>
          <div className="art-badge-tag">🍦 추억의 아이스케키</div>
        </div>
      );
    case 'ironing-stone':
      return (
        <div className="retro-card-art art-ironing">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 다듬이돌 */}
            <rect x="30" y="75" width="100" height="36" rx="8" fill="#94A3B8" stroke="#475569" strokeWidth="3.5" />
            <rect x="36" y="80" width="88" height="14" rx="4" fill="#CBD5E1" />
            {/* 다듬이 방망이 2개 */}
            <rect x="48" y="32" width="12" height="48" rx="5" fill="#D97706" stroke="#78350F" strokeWidth="2.5" transform="rotate(-18 54 56)" />
            <rect x="100" y="32" width="12" height="48" rx="5" fill="#D97706" stroke="#78350F" strokeWidth="2.5" transform="rotate(18 106 56)" />
          </svg>
          <div className="art-badge-tag">🥢 정겨운 다듬이돌과 방망이</div>
        </div>
      );
    case 'popped-rice':
      return (
        <div className="retro-card-art art-popped">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 뻥튀기 쇠통 */}
            <ellipse cx="65" cy="72" rx="30" ry="22" fill="#334155" stroke="#0F172A" strokeWidth="3" />
            <rect x="65" y="60" width="38" height="24" fill="#475569" stroke="#0F172A" strokeWidth="2.5" />
            {/* 튀밥 그물망과 연기 */}
            <path d="M 98 52 Q 130 40 140 70 Q 130 100 98 90 Z" fill="#FEF08A" stroke="#D97706" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="115" cy="65" r="4" fill="#FFFFFF" />
            <circle cx="125" cy="74" r="5" fill="#FFFFFF" />
            <circle cx="120" cy="82" r="3.5" fill="#FFFFFF" />
          </svg>
          <div className="art-badge-tag">💥 뻥이요~ 뻥튀기 기계</div>
        </div>
      );
    case 'classroom-stove':
      return (
        <div className="retro-card-art art-stove">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 원통 난로 */}
            <rect x="52" y="62" width="56" height="55" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            <rect x="68" y="85" width="24" height="18" rx="3" fill="#EF4444" />
            {/* 난로 위 층층이 쌓인 양은 도시락 */}
            <rect x="46" y="50" width="68" height="12" rx="3" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
            <rect x="48" y="38" width="64" height="12" rx="3" fill="#FCD34D" stroke="#B45309" strokeWidth="2.5" />
            <rect x="52" y="26" width="56" height="12" rx="3" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
          </svg>
          <div className="art-badge-tag">🔥 난로 위 양은 도시락</div>
        </div>
      );
    case 'reed-organ':
      return (
        <div className="retro-card-art art-organ">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 오르간 나무 외관 */}
            <rect x="35" y="35" width="90" height="80" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="3" />
            {/* 보면대 & 악보 */}
            <polygon points="55,30 105,30 95,18 65,18" fill="#D97706" />
            <rect x="68" y="16" width="24" height="14" fill="#FFFFFF" stroke="#334155" strokeWidth="1" />
            {/* 건반 (흰 건반 & 검은 건반) */}
            <rect x="44" y="62" width="72" height="22" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <line x1="53" y1="62" x2="53" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="62" y1="62" x2="62" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="71" y1="62" x2="71" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="80" y1="62" x2="80" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="89" y1="62" x2="89" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="98" y1="62" x2="98" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="107" y1="62" x2="107" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* 흑건 */}
            <rect x="49" y="62" width="6" height="13" fill="#0F172A" />
            <rect x="58" y="62" width="6" height="13" fill="#0F172A" />
            <rect x="76" y="62" width="6" height="13" fill="#0F172A" />
            <rect x="85" y="62" width="6" height="13" fill="#0F172A" />
            <rect x="94" y="62" width="6" height="13" fill="#0F172A" />
            {/* 발판 2개 */}
            <rect x="58" y="102" width="18" height="10" rx="2" fill="#451A03" />
            <rect x="84" y="102" width="18" height="10" rx="2" fill="#451A03" />
          </svg>
          <div className="art-badge-tag">🎹 교실 앞 발풍금 오르간</div>
        </div>
      );
    case 'sports-day':
      return (
        <div className="retro-card-art art-sports">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 만국기 줄 */}
            <path d="M 20 22 Q 80 36 140 22" stroke="#475569" strokeWidth="2" fill="none" />
            <polygon points="35,25 47,27 41,40" fill="#EF4444" />
            <polygon points="60,29 72,30 66,44" fill="#3B82F6" />
            <polygon points="88,30 100,29 94,44" fill="#10B981" />
            <polygon points="113,27 125,25 119,40" fill="#F59E0B" />
            {/* 매달린 큰 바구니 박 */}
            <ellipse cx="80" cy="74" rx="32" ry="24" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            {/* 던져지는 오자미(모래주머니) */}
            <circle cx="48" cy="92" r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <circle cx="112" cy="86" r="9" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          </svg>
          <div className="art-badge-tag">🎊 가을 운동회 박 터뜨리기</div>
        </div>
      );
    case 'river-play':
      return (
        <div className="retro-card-art art-river">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 시냇물 물결 */}
            <rect x="20" y="55" width="120" height="65" rx="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
            <path d="M 30 75 Q 55 65 80 75 Q 105 85 130 75" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 30 95 Q 55 85 80 95 Q 105 105 130 95" stroke="#E0F2FE" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* 물고기 2마리 */}
            <ellipse cx="60" cy="85" rx="10" ry="5" fill="#F59E0B" />
            <polygon points="50,85 44,80 44,90" fill="#F59E0B" />
            <ellipse cx="100" cy="70" rx="10" ry="5" fill="#10B981" />
            <polygon points="90,70 84,65 84,75" fill="#10B981" />
          </svg>
          <div className="art-badge-tag">🏊 시원한 개울가 멱감기</div>
        </div>
      );
    case 'fire-can':
      return (
        <div className="retro-card-art art-fire">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            {/* 밤하늘 보름달 */}
            <circle cx="120" cy="38" r="18" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
            {/* 쥐불놀이 깡통 & 회전 불꽃 궤적 */}
            <ellipse cx="75" cy="75" rx="42" ry="32" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="10 6" />
            <rect x="96" y="60" width="18" height="24" rx="3" fill="#64748B" stroke="#1E293B" strokeWidth="2" />
            <circle cx="105" cy="72" r="7" fill="#EF4444" />
            <circle cx="105" cy="72" r="4" fill="#FEF08A" />
          </svg>
          <div className="art-badge-tag">🔥 정월 대보름 쥐불놀이</div>
        </div>
      );
    default:
      return (
        <div className="retro-card-art art-default">
          <div className="art-default-symbol">🌸</div>
          <div className="art-badge-tag">그리운 어린 시절 추억</div>
        </div>
      );
  }
}

export const ChildhoodMemoryGame: React.FC<ChildhoodMemoryGameProps> = ({ onCompleteActivity }) => {
  const [activeMode, setActiveMode] = useState<SubActivityMode>('quiz');

  // ── [1] 퀴즈 모드 상태 ─────────────────────────────────────────
  const [quizCategory, setQuizCategory] = useState<string>('전체');
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const filteredQuizzes =
    quizCategory === '전체'
      ? CHILDHOOD_QUIZZES
      : CHILDHOOD_QUIZZES.filter((q) => q.category === quizCategory);

  const currentQuiz: ChildhoodQuizItem =
    filteredQuizzes[currentQuizIndex] || filteredQuizzes[0];

  // TTS 음성 읽기 기능 (다정하고 자연스러운 목소리)
  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
      ttsManager.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    ttsManager.speak(text, {
      rate: 0.88,
      pitch: 1.02,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // 문제 변경 시 TTS 중지
  useEffect(() => {
    ttsManager.stop();
    setIsSpeaking(false);
  }, [currentQuizIndex, activeMode]);

  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked) return;
    setSelectedOptionId(optId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || isAnswerChecked) return;

    const chosen = currentQuiz.options.find((o) => o.id === selectedOptionId);
    const correct = chosen?.isCorrect || false;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      soundManager.playMatch();
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });
    } else {
      soundManager.playMismatch();
    }
  };

  const handleNextQuiz = () => {
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);

    if (currentQuizIndex < filteredQuizzes.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setCurrentQuizIndex(0);
      if (onCompleteActivity) onCompleteActivity();
    }
  };

  // ── [2] 추억 엽서 모드 상태 ─────────────────────────────────────
  const [selectedTopic, setSelectedTopic] = useState<ReminiscenceTopic>(REMINISCENCE_TOPICS[0]);
  const [chosenOptionIndex, setChosenOptionIndex] = useState<number>(0);
  const [customCaregiverNote, setCustomCaregiverNote] = useState<string>('');
  const [isPostcardSaved, setIsPostcardSaved] = useState<boolean>(false);

  const handleSavePostcard = () => {
    soundManager.playVictory();
    setIsPostcardSaved(true);
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  // ── [3] 동요 모드 상태 ─────────────────────────────────────────
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [currentSongPhotoIndex, setCurrentSongPhotoIndex] = useState<number>(0);
  const [isPlayingMelody, setIsPlayingMelody] = useState<boolean>(false);
  const [isReadingLyrics, setIsReadingLyrics] = useState<boolean>(false);
  const currentSong = CHILDHOOD_SONGS[currentSongIndex];

  // 동요 전환 시 사진 인덱스 초기화 및 재생 중단
  const handleSelectSong = (idx: number) => {
    songPlayer.stop();
    ttsManager.stop();
    setIsPlayingMelody(false);
    setIsReadingLyrics(false);
    setCurrentSongIndex(idx);
    setCurrentSongPhotoIndex(0);
  };

  // 모드 또는 동요 변경 시 음악/음성 정지
  useEffect(() => {
    songPlayer.stop();
    ttsManager.stop();
    setIsPlayingMelody(false);
    setIsReadingLyrics(false);
  }, [activeMode, currentSongIndex]);

  // 동요 멜로디 재생/정지 토글
  const handleToggleMelody = () => {
    if (isPlayingMelody) {
      songPlayer.stop();
      setIsPlayingMelody(false);
    } else {
      ttsManager.stop();
      setIsReadingLyrics(false);
      setIsPlayingMelody(true);
      songPlayer.playSong(
        currentSong.id,
        undefined,
        () => setIsPlayingMelody(false)
      );
    }
  };

  // 가사 다정하게 읽어주기 토글
  const handleToggleLyrics = () => {
    if (isReadingLyrics) {
      ttsManager.stop();
      setIsReadingLyrics(false);
    } else {
      songPlayer.stop();
      setIsPlayingMelody(false);
      setIsReadingLyrics(true);
      const fullLyrics = `${currentSong.title}. ${currentSong.lyrics.join('. ')}`;
      ttsManager.speak(fullLyrics, {
        rate: 0.85,
        pitch: 1.02,
        persona: 'warm-mother',
        onStart: () => setIsReadingLyrics(true),
        onEnd: () => setIsReadingLyrics(false),
        onError: () => setIsReadingLyrics(false),
      });
    }
  };

  // 깔끔한 원문자 번호 배지
  const numberBadges = ['①', '②', '③', '④'];

  return (
    <div className="childhood-container">
      {/* 1. 상단 인트로 헤더 */}
      <header className="childhood-header anim-pop">
        <div className="header-badge">
          <Sparkles size={24} color="#D97706" />
          <span>기억 회상 · 정서 안정 · 언어 자극 두뇌 학교</span>
        </div>
        <h1 className="header-title">
          🧒 나의 어린 시절 추억 여행 🌸
        </h1>
        <p className="header-desc">
          골목길 동무들과 뛰놀던 정겨운 놀이, 맛있는 간식, 학교 시절 풍경을 떠올려보세요.
        </p>

        {/* 3대 핵심 서브 활동 탭 */}
        <nav className="activity-nav-tabs">
          <button
            className={`nav-tab-btn ${activeMode === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveMode('quiz')}
          >
            <HelpCircle size={24} />
            <span>🎯 1. 추억 퀴즈 맞추기</span>
          </button>
          <button
            className={`nav-tab-btn ${activeMode === 'postcard' ? 'active' : ''}`}
            onClick={() => setActiveMode('postcard')}
          >
            <Mail size={24} />
            <span>💌 2. 나의 추억 엽서 만들기</span>
          </button>
          <button
            className={`nav-tab-btn ${activeMode === 'song' ? 'active' : ''}`}
            onClick={() => setActiveMode('song')}
          >
            <Music size={24} />
            <span>🎶 3. 그 시절 동요와 사진첩</span>
          </button>
        </nav>
      </header>

      {/* ── [모드 1] 추억 퀴즈 맞추기 ── */}
      {activeMode === 'quiz' && (
        <section className="quiz-section anim-pop">
          {/* 카테고리 필터 */}
          <div className="quiz-category-bar">
            <span className="cat-bar-label">주제별 선택:</span>
            <div className="cat-buttons">
              {['전체', '골목놀이', '추억의물건', '옛날학교', '고향사계절'].map((cat) => (
                <button
                  key={cat}
                  className={`cat-btn ${quizCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setQuizCategory(cat);
                    setCurrentQuizIndex(0);
                    setSelectedOptionId(null);
                    setIsAnswerChecked(false);
                  }}
                >
                  {cat === '전체'
                    ? '🌟 전체 보기'
                    : cat === '골목놀이'
                    ? '골목놀이'
                    : cat === '추억의물건'
                    ? '추억의 물건'
                    : cat === '옛날학교'
                    ? '옛날 학교'
                    : '고향 사계절'}
                </button>
              ))}
            </div>
          </div>

          {/* 퀴즈 메인 카드 */}
          <div className="quiz-card">
            <div className="quiz-card-header">
              <div className="quiz-index-badge">
                질문 {currentQuizIndex + 1} / {filteredQuizzes.length}
              </div>
              <div className="quiz-score-badge">
                🌟 맞힌 추억: <strong>{score}</strong>개
              </div>
              <div className="quiz-theme-badge">
                {currentQuiz.category}
              </div>
            </div>

            <h2 className="quiz-question-title">{currentQuiz.question}</h2>

            {/* 소리 힌트 & 음성 듣기 버튼 */}
            <div className="quiz-hint-box">
              <div className="hint-content">
                <Volume2 size={26} color="#D97706" />
                <span className="hint-text">{currentQuiz.soundHint}</span>
              </div>
              <button
                className={`tts-speak-btn ${isSpeaking ? 'speaking' : ''}`}
                onClick={() =>
                  handleSpeakText(`${currentQuiz.question} 소리 힌트: ${currentQuiz.soundHint}`)
                }
                title="음성으로 문제와 힌트 듣기"
                aria-label="문제와 힌트를 소리로 들려줍니다"
              >
                {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                <span>{isSpeaking ? '소리 멈춤' : '🔊 소리로 듣기'}</span>
              </button>
            </div>

            {/* 정확한 레트로 그래픽 카드 & ①②③④ 깔끔한 번호 보기 그리드 */}
            <div className="quiz-content-grid">
              <div className="quiz-photo-wrapper">
                {renderChildhoodIllustration(currentQuiz.illustrationType)}
                <p className="photo-caption">{currentQuiz.photoCaption}</p>
              </div>

              <div className="quiz-options-wrapper">
                <div className="options-title">알맞은 정답 번호를 하나 골라보세요:</div>
                <div className="options-grid">
                  {currentQuiz.options.map((opt, idx) => {
                    const isSelected = selectedOptionId === opt.id;
                    let optClass = 'quiz-opt-btn';

                    if (isAnswerChecked) {
                      if (opt.isCorrect) optClass += ' correct-opt';
                      else if (isSelected && !opt.isCorrect) optClass += ' wrong-opt';
                    } else if (isSelected) {
                      optClass += ' selected-opt';
                    }

                    return (
                      <button
                        key={opt.id}
                        className={optClass}
                        onClick={() => handleSelectOption(opt.id)}
                        disabled={isAnswerChecked}
                      >
                        <span className="opt-number-badge">{numberBadges[idx]}</span>
                        <span className="opt-text">{opt.text}</span>
                        {isAnswerChecked && opt.isCorrect && (
                          <CheckCircle2 size={28} color="#059669" className="opt-check-icon" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 정답 확인 / 다음 문제 버튼 */}
                <div className="quiz-action-bar">
                  {!isAnswerChecked ? (
                    <button
                      className="check-btn"
                      disabled={!selectedOptionId}
                      onClick={handleCheckAnswer}
                    >
                      <span>정답 확인하기</span>
                      <ChevronRight size={26} />
                    </button>
                  ) : (
                    <button className="next-btn anim-pop" onClick={handleNextQuiz}>
                      <span>다음 추억 문제로 이동</span>
                      <ChevronRight size={26} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 정답 확인 후 나타나는 해설 및 회상 대화 질문 */}
            {isAnswerChecked && (
              <div className={`quiz-feedback-box anim-pop ${isCorrect ? 'fb-correct' : 'fb-retry'}`}>
                <div className="feedback-title">
                  {isCorrect ? '🎉 참 잘하셨습니다! 정답입니다.' : '💡 괜찮습니다! 천천히 함께 알아볼까요?'}
                </div>
                <p className="feedback-explanation">{currentQuiz.explanation}</p>

                <div className="reminiscence-talk-box">
                  <MessageCircleHeart size={28} color="#0F766E" />
                  <div className="talk-content">
                    <span className="talk-label">🌸 어르신과 도란도란 나누는 추억 이야기:</span>
                    <p className="talk-question">"{currentQuiz.reminiscenceTalk}"</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── [모드 2] 나의 추억 엽서 만들기 ── */}
      {activeMode === 'postcard' && (
        <section className="postcard-section anim-pop">
          <div className="postcard-intro">
            <h2 className="section-heading">💌 나만의 어린 시절 추억 엽서 만들기</h2>
            <p className="section-sub">
              기억에 남는 주제를 선택하고, 그 시절 가장 좋았던 추억을 골라 예쁜 엽서를 완성해보세요.
            </p>
          </div>

          {/* 주제 탭 선택 */}
          <div className="topic-tabs">
            {REMINISCENCE_TOPICS.map((topic) => (
              <button
                key={topic.id}
                className={`topic-tab-btn ${selectedTopic.id === topic.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTopic(topic);
                  setChosenOptionIndex(0);
                  setIsPostcardSaved(false);
                }}
              >
                <span className="topic-title">{topic.title}</span>
              </button>
            ))}
          </div>

          <div className="postcard-maker-grid">
            {/* 왼쪽: 질문과 선택지 */}
            <div className="maker-left-panel">
              <div className="prompt-header">
                <span className="prompt-badge">💭 오늘의 회상 질문</span>
                <h3 className="prompt-question">{selectedTopic.promptQuestion}</h3>
                <p className="prompt-subtitle">{selectedTopic.subtitle}</p>
              </div>

              <div className="prompt-choices">
                {selectedTopic.options.map((opt, idx) => (
                  <button
                    key={opt.label}
                    className={`choice-card ${chosenOptionIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setChosenOptionIndex(idx);
                      setIsPostcardSaved(false);
                    }}
                  >
                    <div className="choice-top">
                      <span className="choice-num-badge">{numberBadges[idx]}</span>
                      <span className="choice-label">{opt.label}</span>
                    </div>
                    <p className="choice-desc">{opt.description}</p>
                  </button>
                ))}
              </div>

              {/* 추가 한마디 작성 (보호자/어르신 입력) */}
              <div className="caregiver-memo-box">
                <label className="memo-label">
                  ✍️ 어르신이 덧붙여주신 소중한 한마디 (선택):
                </label>
                <input
                  type="text"
                  className="memo-input"
                  placeholder="예: '동구 밖 느티나무 아래서 철수랑 같이 놀았제~'"
                  value={customCaregiverNote}
                  onChange={(e) => setCustomCaregiverNote(e.target.value)}
                />
              </div>

              <button className="create-postcard-btn" onClick={handleSavePostcard}>
                <Sparkles size={24} />
                <span>추억 엽서 완성하기</span>
              </button>
            </div>

            {/* 오른쪽: 완성된 프리뷰 엽서 */}
            <div className="maker-right-panel">
              <div className="postcard-preview-card">
                <div className="postcard-stamp">
                  <span>추억 우표</span>
                  <Heart size={20} color="#DC2626" />
                </div>

                <div className="postcard-title-bar">
                  <h4 className="pc-title">🌸 {selectedTopic.title}</h4>
                </div>

                <div className="postcard-body">
                  <div className="pc-chosen-highlight">
                    <span className="pc-chosen-text">{selectedTopic.options[chosenOptionIndex]?.label}</span>
                  </div>

                  <p className="pc-story-quote">
                    "{selectedTopic.options[chosenOptionIndex]?.description}"
                  </p>

                  {customCaregiverNote && (
                    <div className="pc-extra-note">
                      <strong>나의 한마디:</strong> "{customCaregiverNote}"
                    </div>
                  )}
                </div>

                <div className="postcard-footer">
                  <span>🌸 디지털 두뇌 학교 어린 시절 추억 엽서</span>
                  <span>기억일자: 오늘</span>
                </div>
              </div>

              {isPostcardSaved && (
                <div className="postcard-success-banner anim-pop">
                  <CheckCircle2 size={28} color="#059669" />
                  <span>멋진 추억 엽서가 완성되었습니다! 참 잘하셨습니다.</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── [모드 3] 그 시절 동요와 사진첩 ── */}
      {activeMode === 'song' && (
        <section className="song-section anim-pop">
          <div className="song-selector-bar">
            {CHILDHOOD_SONGS.map((s, idx) => (
              <button
                key={s.id}
                className={`song-select-btn ${idx === currentSongIndex ? 'active' : ''}`}
                onClick={() => handleSelectSong(idx)}
              >
                <Music size={20} />
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          <div className="song-main-card">
            <div className="song-card-left">
              <div className="song-photo-frame">
                <img
                  src={currentSong.galleryPhotos?.[currentSongPhotoIndex]?.url || currentSong.photoUrl}
                  alt={currentSong.title}
                  className="song-main-img"
                />
                <div className="song-photo-caption-bar">
                  <span className="caption-theme">{currentSong.theme}</span>
                  <span className="caption-desc">
                    {currentSong.galleryPhotos?.[currentSongPhotoIndex]?.caption || currentSong.photoCaption}
                  </span>
                </div>
              </div>

              {/* 사진 넘겨보기 썸네일 스트립 */}
              {currentSong.galleryPhotos && currentSong.galleryPhotos.length > 1 && (
                <div className="song-thumb-strip">
                  {currentSong.galleryPhotos.map((photo, pIdx) => (
                    <button
                      key={pIdx}
                      className={`song-mini-thumb ${pIdx === currentSongPhotoIndex ? 'active' : ''}`}
                      onClick={() => setCurrentSongPhotoIndex(pIdx)}
                      title={photo.caption}
                    >
                      <img src={photo.url} alt={photo.caption} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="song-card-right">
              <div className="song-header">
                <h2 className="song-title">🎶 {currentSong.title}</h2>
                <span className="song-composer">{currentSong.composer}</span>
              </div>

              {/* 🌟 동요 실행 버튼 바 🌟 */}
              <div className="song-playback-panel">
                <button
                  type="button"
                  onClick={handleToggleMelody}
                  className={`song-main-play-btn ${isPlayingMelody ? 'playing' : ''}`}
                >
                  {isPlayingMelody ? <Square size={24} /> : <Play size={24} />}
                  <span>{isPlayingMelody ? '⏹️ 동요 연주 멈추기' : '▶️ 동요 멜로디 연주 듣기'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleLyrics}
                  className={`song-sub-speak-btn ${isReadingLyrics ? 'speaking' : ''}`}
                >
                  <Volume2 size={22} />
                  <span>{isReadingLyrics ? '🔊 가사 낭독 멈추기' : '🔊 가사 들으며 따라 부르기'}</span>
                </button>
              </div>

              {isPlayingMelody && (
                <div className="playing-indicator-badge anim-pop">
                  <Music size={20} className="anim-bounce" />
                  <span>🎶 정겨운 동요 멜로디가 연주 중입니다. 박수를 치며 함께 불러보세요!</span>
                </div>
              )}

              <div className="lyrics-box">
                {currentSong.lyrics.map((line, i) => (
                  <p key={i} className="lyric-line">
                    {line}
                  </p>
                ))}
              </div>

              <div className="song-guide-prompt">
                <Heart size={24} color="#E11D48" />
                <span>박자에 맞추어 손뼉을 치며 함께 흥얼거려 보세요!</span>
              </div>

              <div className="song-nav-row">
                <button
                  className="song-prev-btn"
                  onClick={() =>
                    handleSelectSong(
                      currentSongIndex > 0 ? currentSongIndex - 1 : CHILDHOOD_SONGS.length - 1
                    )
                  }
                >
                  <ChevronLeft size={24} />
                  <span>이전 동요</span>
                </button>
                <button
                  className="song-next-btn"
                  onClick={() =>
                    handleSelectSong(
                      currentSongIndex < CHILDHOOD_SONGS.length - 1 ? currentSongIndex + 1 : 0
                    )
                  }
                >
                  <span>다음 동요</span>
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 고대비 & 어르신 최적화 스타일 ──────────────────────── */}
      <style>{`
        .childhood-container {
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 8px 0 24px 0;
          color: #0F172A;
        }

        /* 상단 인트로 헤더 */
        .childhood-header {
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
          border: 4px solid #F59E0B;
          border-radius: 26px;
          padding: 24px 28px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 2px solid #FBBF24;
          border-radius: 20px;
          padding: 6px 18px;
          font-size: 18px;
          font-weight: 800;
          color: #B45309;
          margin-bottom: 12px;
        }

        .header-title {
          font-size: clamp(28px, 4.5vw, 38px);
          font-weight: 900;
          color: #78350F;
          margin: 0 0 10px 0;
        }

        .header-desc {
          font-size: clamp(18px, 2.8vw, 22px);
          font-weight: 700;
          color: #451A03;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        /* 3대 핵심 서브 활동 탭 */
        .activity-nav-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .nav-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 20px;
          font-weight: 900;
          border: 3px solid #D97706;
          border-radius: 18px;
          background: #FFFFFF;
          color: #78350F;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-tab-btn:hover {
          background: #FEF3C7;
          transform: translateY(-2px);
        }

        .nav-tab-btn.active {
          background: #D97706;
          color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.35);
        }

        /* ── [1] 퀴즈 모드 스타일 ── */
        .quiz-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .quiz-category-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border: 3px solid #CBD5E1;
          border-radius: 20px;
          padding: 12px 20px;
          flex-wrap: wrap;
        }

        .cat-bar-label {
          font-size: 19px;
          font-weight: 900;
          color: #0F766E;
        }

        .cat-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cat-btn {
          padding: 8px 18px;
          font-size: 18px;
          font-weight: 800;
          border: 2px solid #CBD5E1;
          border-radius: 12px;
          background: #F8FAFC;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-btn:hover {
          border-color: #0F766E;
          background: #F0FDF4;
        }

        .cat-btn.active {
          background: #0F766E;
          border-color: #115E59;
          color: #FFFFFF;
        }

        .quiz-card {
          background: #FFFFFF;
          border: 4px solid #0F766E;
          border-radius: 26px;
          padding: 26px 30px;
          box-shadow: 0 10px 26px rgba(15, 118, 110, 0.12);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .quiz-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .quiz-index-badge {
          background: #CCFBF1;
          color: #0F766E;
          border: 2px solid #5EEAD4;
          font-size: 18px;
          font-weight: 800;
          padding: 6px 16px;
          border-radius: 14px;
        }

        .quiz-score-badge {
          background: #EFF6FF;
          color: #1D4ED8;
          border: 2px solid #93C5FD;
          font-size: 18px;
          font-weight: 800;
          padding: 6px 16px;
          border-radius: 14px;
        }

        .quiz-theme-badge {
          background: #FEF3C7;
          color: #B45309;
          border: 2px solid #FCD34D;
          font-size: 16px;
          font-weight: 800;
          padding: 4px 14px;
          border-radius: 10px;
        }

        .quiz-question-title {
          font-size: clamp(24px, 3.8vw, 30px);
          font-weight: 900;
          color: #0F172A;
          line-height: 1.4;
          margin: 0;
        }

        /* 힌트 박스 및 TTS 버튼 */
        .quiz-hint-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFBEB;
          border: 2.5px solid #FDE68A;
          padding: 12px 20px;
          border-radius: 18px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .hint-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hint-text {
          font-size: 20px;
          font-weight: 800;
          color: #B45309;
        }

        .tts-speak-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 17px;
          font-weight: 800;
          border: 2px solid #D97706;
          border-radius: 12px;
          background: #FFFFFF;
          color: #B45309;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tts-speak-btn:hover {
          background: #FEF3C7;
          transform: scale(1.03);
        }

        .tts-speak-btn.speaking {
          background: #DC2626;
          border-color: #B91C1C;
          color: #FFFFFF;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .quiz-content-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 24px;
          align-items: start;
        }

        .quiz-photo-wrapper {
          border: 3px solid #CBD5E1;
          border-radius: 20px;
          overflow: hidden;
          background: #F8FAFC;
        }

        /* 정밀 레트로 SVG 회상 그래픽 카드 */
        .retro-card-art {
          width: 100%;
          height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
          padding: 12px;
        }

        .retro-svg {
          max-height: 155px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
        }

        .art-badge-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.85);
          color: #FEF08A;
          font-size: 13px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .art-default-symbol {
          font-size: 70px;
        }

        .photo-caption {
          padding: 10px 14px;
          font-size: 15px;
          font-weight: 700;
          color: #475569;
          margin: 0;
          background: #F1F5F9;
          text-align: center;
          border-top: 1px solid #E2E8F0;
        }

        .quiz-options-wrapper {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .options-title {
          font-size: 21px;
          font-weight: 900;
          color: #334155;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        /* 보기 버튼 (이모지 대신 ①②③④ 원문자 배지 적용) */
        .quiz-opt-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 22px;
          border: 3.5px solid #CBD5E1;
          border-radius: 18px;
          background: #F8FAFC;
          color: #0F172A;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          position: relative;
        }

        .quiz-opt-btn:hover:not(:disabled) {
          border-color: #0F766E;
          background: #F0FDF4;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 118, 110, 0.15);
        }

        .quiz-opt-btn.selected-opt {
          border-color: #0F766E;
          background: #CCFBF1;
          box-shadow: 0 6px 18px rgba(15, 118, 110, 0.25);
        }

        .quiz-opt-btn.correct-opt {
          border-color: #059669;
          background: #D1FAE5;
          color: #065F46;
        }

        .quiz-opt-btn.wrong-opt {
          border-color: #DC2626;
          background: #FEE2E2;
          color: #991B1B;
          opacity: 0.7;
        }

        .opt-number-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 900;
          color: #0F766E;
          background: #E6FFFA;
          border: 2px solid #5EEAD4;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .selected-opt .opt-number-badge {
          background: #0F766E;
          color: #FFFFFF;
          border-color: #115E59;
        }

        .correct-opt .opt-number-badge {
          background: #059669;
          color: #FFFFFF;
          border-color: #047857;
        }

        .opt-text {
          font-size: 23px;
          font-weight: 900;
          line-height: 1.3;
        }

        .opt-check-icon {
          margin-left: auto;
          flex-shrink: 0;
        }

        .quiz-action-bar {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .check-btn, .next-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          font-size: 22px;
          font-weight: 900;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .check-btn {
          background: #0F766E;
          color: #FFFFFF;
        }

        .check-btn:disabled {
          background: #CBD5E1;
          cursor: not-allowed;
        }

        .next-btn {
          background: #D97706;
          color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.3);
        }

        .quiz-feedback-box {
          border-radius: 20px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .fb-correct {
          background: #ECFDF5;
          border: 3px solid #10B981;
        }

        .fb-retry {
          background: #FFFBEB;
          border: 3px solid #F59E0B;
        }

        .feedback-title {
          font-size: 24px;
          font-weight: 900;
          color: #065F46;
        }

        .feedback-explanation {
          font-size: 20px;
          font-weight: 700;
          color: #1E293B;
          line-height: 1.5;
          margin: 0;
        }

        .reminiscence-talk-box {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: #FFFFFF;
          border: 2px solid #CCFBF1;
          border-radius: 16px;
          padding: 16px 20px;
          margin-top: 6px;
        }

        .talk-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .talk-label {
          font-size: 16px;
          font-weight: 900;
          color: #0F766E;
        }

        .talk-question {
          font-size: 20px;
          font-weight: 800;
          color: #1E3A8A;
          margin: 0;
        }

        /* ── [2] 엽서 만들기 모드 ── */
        .postcard-section {
          background: #FFFFFF;
          border: 3px solid #CBD5E1;
          border-radius: 26px;
          padding: 26px 30px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section-heading {
          font-size: 28px;
          font-weight: 900;
          color: #78350F;
          margin: 0 0 6px 0;
        }

        .section-sub {
          font-size: 19px;
          font-weight: 700;
          color: #64748B;
          margin: 0;
        }

        .topic-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .topic-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 19px;
          font-weight: 800;
          border: 2.5px solid #CBD5E1;
          border-radius: 14px;
          background: #F8FAFC;
          cursor: pointer;
          transition: all 0.2s;
        }

        .topic-tab-btn.active {
          background: #D97706;
          border-color: #B45309;
          color: #FFFFFF;
        }

        .postcard-maker-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .maker-left-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .prompt-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .prompt-badge {
          align-self: flex-start;
          background: #FEF3C7;
          color: #B45309;
          font-size: 15px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 8px;
        }

        .prompt-question {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }

        .prompt-subtitle {
          font-size: 16px;
          font-weight: 600;
          color: #64748B;
          margin: 0;
        }

        .prompt-choices {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .choice-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px 18px;
          border: 2.5px solid #E2E8F0;
          border-radius: 16px;
          background: #F8FAFC;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .choice-card.active {
          background: #CCFBF1;
          border-color: #0F766E;
          box-shadow: 0 4px 14px rgba(15, 118, 110, 0.2);
        }

        .choice-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .choice-num-badge {
          font-size: 20px;
          font-weight: 900;
          color: #0F766E;
        }

        .choice-label {
          font-size: 19px;
          font-weight: 900;
          color: #0F172A;
        }

        .choice-desc {
          font-size: 15px;
          font-weight: 600;
          color: #475569;
          margin: 0;
        }

        .caregiver-memo-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .memo-label {
          font-size: 16px;
          font-weight: 800;
          color: #334155;
        }

        .memo-input {
          padding: 12px 16px;
          font-size: 17px;
          font-weight: 700;
          border: 2.5px solid #CBD5E1;
          border-radius: 14px;
          font-family: inherit;
        }

        .create-postcard-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          font-size: 20px;
          font-weight: 900;
          border: none;
          border-radius: 16px;
          background: #0F766E;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s;
        }

        .create-postcard-btn:hover {
          background: #115E59;
          transform: translateY(-2px);
        }

        /* 오른쪽: 완성된 엽서 프리뷰 */
        .maker-right-panel {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .postcard-preview-card {
          background: #FFFDF9;
          border: 4px dashed #D97706;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 24px rgba(217, 119, 6, 0.12);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .postcard-stamp {
          position: absolute;
          top: 18px;
          right: 18px;
          border: 2px dashed #DC2626;
          border-radius: 8px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 900;
          color: #DC2626;
          background: #FEF2F2;
        }

        .postcard-title-bar {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pc-title {
          font-size: 22px;
          font-weight: 900;
          color: #78350F;
          margin: 0;
        }

        .postcard-body {
          background: #FFFFFF;
          border: 2px solid #FEF3C7;
          border-radius: 18px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pc-chosen-highlight {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FEF3C7;
          padding: 8px 14px;
          border-radius: 12px;
        }

        .pc-chosen-text {
          font-size: 20px;
          font-weight: 900;
          color: #92400E;
        }

        .pc-story-quote {
          font-size: 18px;
          font-weight: 700;
          color: #334155;
          line-height: 1.6;
          margin: 0;
        }

        .pc-extra-note {
          background: #EFF6FF;
          border-left: 4px solid #3B82F6;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 17px;
          font-weight: 800;
          color: #1E40AF;
        }

        .postcard-footer {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 800;
          color: #94A3B8;
          border-top: 1px dashed #CBD5E1;
          padding-top: 10px;
        }

        .postcard-success-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ECFDF5;
          border: 2px solid #10B981;
          border-radius: 16px;
          padding: 12px 18px;
          font-size: 18px;
          font-weight: 800;
          color: #065F46;
        }

        /* ── [3] 동요 모드 ── */
        .song-section {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .song-selector-bar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .song-select-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 19px;
          font-weight: 800;
          border: 2.5px solid #CBD5E1;
          border-radius: 14px;
          background: #FFFFFF;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .song-select-btn.active {
          background: #0F766E;
          border-color: #115E59;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);
        }

        .song-main-card {
          background: #FFFFFF;
          border: 4px solid #0F766E;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 10px 26px rgba(15, 118, 110, 0.15);
          display: grid;
          grid-template-columns: 380px 1fr;
        }

        .song-card-left {
          background: #F8FAFC;
          border-right: 3px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 20px;
          gap: 14px;
        }

        .song-photo-frame {
          width: 100%;
          border: 3px solid #CBD5E1;
          border-radius: 20px;
          overflow: hidden;
          background: #FFFFFF;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
        }

        .song-main-img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .song-main-img:hover {
          transform: scale(1.03);
        }

        .song-photo-caption-bar {
          padding: 12px 16px;
          background: #FFFBEB;
          border-top: 2px solid #FEF3C7;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .caption-theme {
          font-size: 14px;
          font-weight: 900;
          color: #B45309;
        }

        .caption-desc {
          font-size: 16px;
          font-weight: 800;
          color: #1E293B;
          line-height: 1.4;
        }

        .song-thumb-strip {
          display: flex;
          gap: 10px;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }

        .song-mini-thumb {
          width: 70px;
          height: 52px;
          border-radius: 10px;
          overflow: hidden;
          border: 2.5px solid #CBD5E1;
          cursor: pointer;
          padding: 0;
          background: #E2E8F0;
          transition: all 0.2s;
        }

        .song-mini-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .song-mini-thumb:hover {
          border-color: #0F766E;
          transform: translateY(-2px);
        }

        .song-mini-thumb.active {
          border-color: #0F766E;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.35);
          transform: scale(1.05);
        }

        .song-card-right {
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .song-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .song-title {
          font-size: 32px;
          font-weight: 900;
          color: #0F766E;
          margin: 0;
        }

        .song-composer {
          font-size: 16px;
          font-weight: 700;
          color: #64748B;
        }

        .song-playback-panel {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .song-main-play-btn {
          flex: 1;
          min-width: 220px;
          background-color: #059669;
          color: #FFFFFF;
          border: 3px solid #047857;
          box-shadow: 0 4px 0 #065F46;
          border-radius: 18px;
          padding: 14px 20px;
          font-size: 20px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.15s;
        }

        .song-main-play-btn.playing {
          background-color: #DC2626;
          border-color: #B91C1C;
          box-shadow: 0 4px 0 #991B1B;
          animation: pulse-glow 1.5s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(220, 38, 38, 0.6); }
          50% { box-shadow: 0 0 25px rgba(220, 38, 38, 0.9); }
        }

        .song-sub-speak-btn {
          flex: 1;
          min-width: 220px;
          background-color: #FFFFFF;
          color: #0F766E;
          border: 3px solid #0F766E;
          border-radius: 18px;
          padding: 14px 20px;
          font-size: 19px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.15s;
        }

        .song-sub-speak-btn.speaking {
          background-color: #C2410C;
          color: #FFFFFF;
          border-color: #9A3412;
        }

        .playing-indicator-badge {
          background-color: #ECFDF5;
          border: 2px solid #6EE7B7;
          color: #065F46;
          padding: 10px 16px;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .lyrics-box {
          background: #F8FAFC;
          border-left: 6px solid #0F766E;
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .lyric-line {
          font-size: 24px;
          font-weight: 800;
          color: #1E293B;
          margin: 0;
          line-height: 1.5;
        }

        .song-guide-prompt {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFF1F2;
          border: 2px solid #FECDD3;
          border-radius: 14px;
          padding: 10px 18px;
          font-size: 18px;
          font-weight: 800;
          color: #BE123C;
        }

        .song-nav-row {
          display: flex;
          justify-content: space-between;
          margin-top: auto;
        }

        .song-prev-btn, .song-next-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          font-size: 18px;
          font-weight: 800;
          border: 2px solid #CBD5E1;
          border-radius: 14px;
          background: #F8FAFC;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .song-prev-btn:hover, .song-next-btn:hover {
          background: #E2E8F0;
        }

        /* 반응형 */
        @media (max-width: 820px) {
          .quiz-content-grid, .postcard-maker-grid, .song-main-card {
            grid-template-columns: 1fr;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }

          .song-card-left {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};
