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
  Image as ImageIcon,
  Gamepad2,
  Trophy,
  RotateCcw,
  Sliders,
  Zap,
} from 'lucide-react';
import {
  CHILDHOOD_QUIZZES,
  REMINISCENCE_TOPICS,
  CHILDHOOD_SONGS,
  RETRO_PHOTOS,
  type ChildhoodQuizItem,
  type ReminiscenceTopic,
  type RetroPhotoItem,
} from '../constants/childhoodData';
import { soundManager } from '../utils/soundEffect';
import { ttsManager } from '../utils/ttsManager';
import { songPlayer } from '../utils/songPlayer';

interface ChildhoodMemoryGameProps {
  onCompleteActivity?: () => void;
}

type SubActivityMode = 'quiz' | 'photos' | 'aigame' | 'postcard' | 'song';

// ── 테마별 정밀 레트로 SVG/CSS 회상 그래픽 카드 렌더러 ──────────────────
function renderChildhoodIllustration(type: string) {
  switch (type) {
    case 'marbles':
      return (
        <div className="retro-card-art art-marbles">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            <circle cx="80" cy="70" r="55" fill="#FDE68A" stroke="#D97706" strokeWidth="4" strokeDasharray="6 4" />
            <circle cx="80" cy="70" r="38" fill="#FEF3C7" opacity="0.8" />
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
            <line x1="20" y1="75" x2="140" y2="75" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
            <line x1="20" y1="92" x2="140" y2="92" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
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
            <rect x="35" y="45" width="50" height="50" rx="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" transform="rotate(-12 60 70)" />
            <path d="M 40 50 L 80 90 M 80 50 L 40 90" stroke="#93C5FD" strokeWidth="3" transform="rotate(-12 60 70)" />
            <rect x="75" y="35" width="55" height="55" rx="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="3.5" transform="rotate(15 102 62)" />
            <path d="M 80 40 L 125 85 M 125 40 L 80 85" stroke="#FCA5A5" strokeWidth="3" transform="rotate(15 102 62)" />
            <path d="M 68 25 Q 75 15 85 20 M 130 50 Q 140 60 135 70" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <div className="art-badge-tag">📦 종이딱지 대결</div>
        </div>
      );
    case 'spinning-top':
      return (
        <div className="retro-card-art art-top">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            <ellipse cx="80" cy="115" rx="60" ry="16" fill="#BAE6FD" stroke="#0284C7" strokeWidth="3" />
            <polygon points="80,112 55,50 105,50" fill="#D97706" stroke="#78350F" strokeWidth="3" />
            <rect x="55" y="38" width="50" height="12" rx="4" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="80" cy="114" r="4" fill="#475569" />
            <ellipse cx="80" cy="44" rx="35" ry="8" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="6 4" />
          </svg>
          <div className="art-badge-tag">🌀 얼음판 나무팽이</div>
        </div>
      );
    case 'dalgona':
      return (
        <div className="retro-card-art art-dalgona">
          <svg viewBox="0 0 160 140" className="retro-svg" width="100%" height="100%">
            <line x1="25" y1="110" x2="60" y2="85" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
            <circle cx="92" cy="68" r="42" fill="#FBBF24" stroke="#B45309" strokeWidth="4" />
            <circle cx="92" cy="68" r="36" fill="#FCD34D" />
            <polygon points="92,44 98,58 113,58 101,68 105,82 92,73 79,82 83,68 71,58 86,58" fill="#B45309" />
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
            <rect x="35" y="45" width="90" height="65" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="3.5" />
            <rect x="42" y="52" width="76" height="50" fill="#E0F2FE" />
            <text x="80" y="84" textAnchor="middle" fontSize="16" fontWeight="900" fill="#0369A1">아이스</text>
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
            <rect x="30" y="75" width="100" height="36" rx="8" fill="#94A3B8" stroke="#475569" strokeWidth="3.5" />
            <rect x="36" y="80" width="88" height="14" rx="4" fill="#CBD5E1" />
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
            <ellipse cx="65" cy="72" rx="30" ry="22" fill="#334155" stroke="#0F172A" strokeWidth="3" />
            <rect x="65" y="60" width="38" height="24" fill="#475569" stroke="#0F172A" strokeWidth="2.5" />
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
            <rect x="52" y="62" width="56" height="55" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            <rect x="68" y="85" width="24" height="18" rx="3" fill="#EF4444" />
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
            <rect x="35" y="35" width="90" height="80" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="3" />
            <polygon points="55,30 105,30 95,18 65,18" fill="#D97706" />
            <rect x="68" y="16" width="24" height="14" fill="#FFFFFF" stroke="#334155" strokeWidth="1" />
            <rect x="44" y="62" width="72" height="22" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <line x1="53" y1="62" x2="53" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="62" y1="62" x2="62" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="71" y1="62" x2="71" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="80" y1="62" x2="80" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="89" y1="62" x2="89" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="98" y1="62" x2="98" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="107" y1="62" x2="107" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="49" y="62" width="6" height="13" fill="#0F172A" />
            <rect x="58" y="62" width="6" height="13" fill="#0F172A" />
            <rect x="76" y="62" width="6" height="13" fill="#0F172A" />
            <rect x="85" y="62" width="6" height="13" fill="#0F172A" />
            <rect x="94" y="62" width="6" height="13" fill="#0F172A" />
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
            <path d="M 20 22 Q 80 36 140 22" stroke="#475569" strokeWidth="2" fill="none" />
            <polygon points="35,25 47,27 41,40" fill="#EF4444" />
            <polygon points="60,29 72,30 66,44" fill="#3B82F6" />
            <polygon points="88,30 100,29 94,44" fill="#10B981" />
            <polygon points="113,27 125,25 119,40" fill="#F59E0B" />
            <ellipse cx="80" cy="74" rx="32" ry="24" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
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
            <rect x="20" y="55" width="120" height="65" rx="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
            <path d="M 30 75 Q 55 65 80 75 Q 105 85 130 75" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 30 95 Q 55 85 80 95 Q 105 105 130 95" stroke="#E0F2FE" strokeWidth="3" fill="none" strokeLinecap="round" />
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
            <circle cx="120" cy="38" r="18" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
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

  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
      ttsManager.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    ttsManager.speak(text, {
      rate: 0.92,
      pitch: 1.0,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  useEffect(() => {
    ttsManager.stop();
    setIsSpeaking(false);
    setIsSpeakingPhotoStory(false);
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
      soundManager.playSoundByTheme(currentQuiz.illustrationType);
      setTimeout(() => soundManager.playMatch(), 200);
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

  // ── [2] 추억 사진관 (사진으로 보기) 상태 ──────────────────────
  const [photoCategory, setPhotoCategory] = useState<string>('전체');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [isSpeakingPhotoStory, setIsSpeakingPhotoStory] = useState<boolean>(false);

  const filteredPhotos =
    photoCategory === '전체'
      ? RETRO_PHOTOS
      : RETRO_PHOTOS.filter((p) => p.category === photoCategory);
  const currentPhoto: RetroPhotoItem =
    filteredPhotos[currentPhotoIndex] || filteredPhotos[0];

  const handleTogglePhotoStory = () => {
    if (isSpeakingPhotoStory) {
      ttsManager.stop();
      setIsSpeakingPhotoStory(false);
    } else {
      setIsSpeakingPhotoStory(true);
      const fullStory = `${currentPhoto.title}. ${currentPhoto.summary}. ${currentPhoto.story}. 함께 나누는 이야기: ${currentPhoto.conversationPrompt}`;
      ttsManager.speak(fullStory, {
        rate: 0.92,
        pitch: 1.0,
        persona: 'warm-mother',
        onStart: () => setIsSpeakingPhotoStory(true),
        onEnd: () => setIsSpeakingPhotoStory(false),
        onError: () => setIsSpeakingPhotoStory(false),
      });
    }
  };

  // ── [3] AI와 추억 게임방 상태 ─────────────────────────────────
  const [aiGameType, setAiGameType] = useState<'marbles' | 'ddakji'>('marbles');
  
  // 구슬치기 게임 상태
  const [marbleRound, setMarbleRound] = useState<number>(1);
  const [playerMarbleScore, setPlayerMarbleScore] = useState<number>(0);
  const [aiMarbleScore, setAiMarbleScore] = useState<number>(0);
  const [marblePower, setMarblePower] = useState<number>(75);
  const [isMarbleShooting, setIsMarbleShooting] = useState<boolean>(false);
  const [marbleTurn, setMarbleTurn] = useState<'player' | 'ai' | 'roundEnd' | 'gameOver'>('player');
  const [marbleAiDialogue, setMarbleAiDialogue] = useState<string>('할머니, 준비되셨나요? 가운데 타겟 구슬을 향해 힘을 맞춰 튕겨보세요!');

  // 딱지치기 게임 상태
  const [ddakjiRound, setDdakjiRound] = useState<number>(1);
  const [playerDdakjiScore, setPlayerDdakjiScore] = useState<number>(0);
  const [aiDdakjiScore, setAiDdakjiScore] = useState<number>(0);
  const [isDdakjiSlapping, setIsDdakjiSlapping] = useState<boolean>(false);
  const [isTargetFlipped, setIsTargetFlipped] = useState<boolean>(false);
  const [ddakjiTurn, setDdakjiTurn] = useState<'player' | 'ai' | 'roundEnd' | 'gameOver'>('player');
  const [ddakjiAiDialogue, setDdakjiAiDialogue] = useState<string>('할머니! 바람을 가르며 힘차게 바닥으로 내리쳐보세요!');

  // 구슬치기 어르신 튕기기
  const handlePlayerShootMarble = () => {
    if (isMarbleShooting || marbleTurn !== 'player') return;

    setIsMarbleShooting(true);
    soundManager.playMarbles();

    // 파워에 따른 적중 성공 여부 (60~90 사이 적중)
    const isHit = marblePower >= 55 && marblePower <= 95;

    setTimeout(() => {
      setIsMarbleShooting(false);
      if (isHit) {
        soundManager.playMarbles();
        setPlayerMarbleScore((prev) => prev + 1);
        setMarbleAiDialogue('와! 딱! 소리 나면서 맞았어요! 할머니 구슬치기 실력 대단하세요! 👍');
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } else {
        setMarbleAiDialogue('아쉽게 빗나갔어요! 괜찮아요, 다음엔 조금 더 가운데로 맞춰봐요.');
      }

      // AI 순이의 턴으로 전환
      setMarbleTurn('ai');
      setTimeout(() => {
        handleAiShootMarble();
      }, 1800);
    }, 900);
  };

  // 구슬치기 AI 순이 턴
  const handleAiShootMarble = () => {
    soundManager.playMarbles();
    const aiHit = Math.random() > 0.35; // 65% 확률 적중

    setTimeout(() => {
      if (aiHit) {
        soundManager.playMarbles();
        setAiMarbleScore((prev) => prev + 1);
        setMarbleAiDialogue('저도 딱! 하고 맞혔어요! 헤헤~ 다음 라운드도 기대돼요!');
      } else {
        setMarbleAiDialogue('아이쿠, 제 구슬은 데굴데굴 빗나갔네요~ 할머니가 훨씬 잘하세요!');
      }

      if (marbleRound >= 3) {
        setMarbleTurn('gameOver');
        soundManager.playVictory();
      } else {
        setMarbleRound((prev) => prev + 1);
        setMarbleTurn('player');
      }
    }, 900);
  };

  // 구슬치기 재시작
  const handleResetMarbleGame = () => {
    setMarbleRound(1);
    setPlayerMarbleScore(0);
    setAiMarbleScore(0);
    setMarbleTurn('player');
    setMarbleAiDialogue('다시 한번 신나게 구슬치기 한판 겨뤄볼까요?');
  };

  // 딱지치기 어르신 내리치기
  const handlePlayerSlapDdakji = () => {
    if (isDdakjiSlapping || ddakjiTurn !== 'player') return;

    setIsDdakjiSlapping(true);
    soundManager.playDdakji();

    const isFlipped = Math.random() > 0.3; // 70% 확률로 뒤집기 성공

    setTimeout(() => {
      setIsDdakjiSlapping(false);
      if (isFlipped) {
        setIsTargetFlipped(true);
        soundManager.playMatch();
        setPlayerDdakjiScore((prev) => prev + 1);
        setDdakjiAiDialogue('착! 팡! 와~ 상대방 딱지가 시원하게 휙 뒤집어졌어요! 👏');
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } else {
        setIsTargetFlipped(false);
        setDdakjiAiDialogue('바람은 셌는데 아깝게 안 뒤집혔어요! 다음엔 모서리를 노려봐요!');
      }

      // AI 순이 턴
      setDdakjiTurn('ai');
      setTimeout(() => {
        handleAiSlapDdakji();
      }, 2000);
    }, 800);
  };

  // 딱지치기 AI 순이 턴
  const handleAiSlapDdakji = () => {
    soundManager.playDdakji();
    const aiFlipped = Math.random() > 0.45;

    setTimeout(() => {
      if (aiFlipped) {
        soundManager.playMatch();
        setAiDdakjiScore((prev) => prev + 1);
        setDdakjiAiDialogue('저도 힘껏 쳤더니 뒤집혔어요! 할머니 손맛 진짜 최고예요!');
      } else {
        setDdakjiAiDialogue('순이 딱지는 힘이 모자랐나 봐요~ 할머니 차례예요!');
      }

      if (ddakjiRound >= 3) {
        setDdakjiTurn('gameOver');
        soundManager.playVictory();
      } else {
        setDdakjiRound((prev) => prev + 1);
        setIsTargetFlipped(false);
        setDdakjiTurn('player');
      }
    }, 800);
  };

  // 딱지치기 재시작
  const handleResetDdakjiGame = () => {
    setDdakjiRound(1);
    setPlayerDdakjiScore(0);
    setAiDdakjiScore(0);
    setIsTargetFlipped(false);
    setDdakjiTurn('player');
    setDdakjiAiDialogue('새 딱지로 다시 한번 대결해봐요! 힘차게 내리쳐보세요!');
  };

  // ── [4] 추억 엽서 모드 상태 ─────────────────────────────────────
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

  // ── [5] 동요 모드 상태 ─────────────────────────────────────────
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [currentSongPhotoIndex, setCurrentSongPhotoIndex] = useState<number>(0);
  const [isPlayingMelody, setIsPlayingMelody] = useState<boolean>(false);
  const [isReadingLyrics, setIsReadingLyrics] = useState<boolean>(false);
  const currentSong = CHILDHOOD_SONGS[currentSongIndex];

  const handleSelectSong = (idx: number) => {
    songPlayer.stop();
    ttsManager.stop();
    setIsPlayingMelody(false);
    setIsReadingLyrics(false);
    setCurrentSongIndex(idx);
    setCurrentSongPhotoIndex(0);
  };

  useEffect(() => {
    songPlayer.stop();
    ttsManager.stop();
    setIsPlayingMelody(false);
    setIsReadingLyrics(false);
  }, [activeMode, currentSongIndex]);

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
        rate: 0.92,
        pitch: 1.0,
        persona: 'warm-mother',
        onStart: () => setIsReadingLyrics(true),
        onEnd: () => setIsReadingLyrics(false),
        onError: () => setIsReadingLyrics(false),
      });
    }
  };

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
          골목길 동무들과 뛰놀던 정겨운 놀이, 맛있는 간식, 학교 시절 풍경을 사진과 게임으로 만나보세요.
        </p>

        {/* 5대 핵심 서브 활동 탭 */}
        <nav className="activity-nav-tabs">
          <button
            className={`nav-tab-btn ${activeMode === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveMode('quiz')}
          >
            <HelpCircle size={22} />
            <span>🎯 1. 추억 퀴즈</span>
          </button>
          <button
            className={`nav-tab-btn ${activeMode === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveMode('photos')}
          >
            <ImageIcon size={22} />
            <span>🖼️ 2. 사진으로 보기</span>
          </button>
          <button
            className={`nav-tab-btn ${activeMode === 'aigame' ? 'active' : ''}`}
            onClick={() => setActiveMode('aigame')}
          >
            <Gamepad2 size={22} />
            <span>🤖 3. AI와 추억 게임</span>
          </button>
          <button
            className={`nav-tab-btn ${activeMode === 'postcard' ? 'active' : ''}`}
            onClick={() => setActiveMode('postcard')}
          >
            <Mail size={22} />
            <span>💌 4. 추억 엽서</span>
          </button>
          <button
            className={`nav-tab-btn ${activeMode === 'song' ? 'active' : ''}`}
            onClick={() => setActiveMode('song')}
          >
            <Music size={22} />
            <span>🎶 5. 동요와 사진첩</span>
          </button>
        </nav>
      </header>

      {/* ── [모드 1] 추억 퀴즈 맞추기 ── */}
      {activeMode === 'quiz' && (
        <section className="quiz-section anim-pop">
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

            <div className="quiz-hint-box">
              <div className="hint-content">
                <Volume2 size={26} color="#D97706" />
                <span className="hint-text">{currentQuiz.soundHint}</span>
              </div>
              <div className="quiz-sound-actions">
                <button
                  className="sfx-play-btn"
                  onClick={() => soundManager.playSoundByTheme(currentQuiz.illustrationType)}
                  title="실제 추억의 소리 듣기 (예: 구슬치기 딱딱 소리, 딱지 소리)"
                >
                  <Sparkles size={20} />
                  <span>🔔 실제 소리 듣기</span>
                </button>
                <button
                  className={`tts-speak-btn ${isSpeaking ? 'speaking' : ''}`}
                  onClick={() =>
                    handleSpeakText(`${currentQuiz.question} 소리 힌트: ${currentQuiz.soundHint}`)
                  }
                  title="음성으로 문제와 힌트 듣기"
                >
                  {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  <span>{isSpeaking ? '소리 멈춤' : '🔊 문제 읽기'}</span>
                </button>
              </div>
            </div>

            <div className="quiz-content-grid">
              <div
                className="quiz-photo-wrapper interactive-photo"
                onClick={() => soundManager.playSoundByTheme(currentQuiz.illustrationType)}
                title="카드를 누르면 실제 소리가 납니다"
              >
                {renderChildhoodIllustration(currentQuiz.illustrationType)}
                <div className="photo-tap-badge">👆 터치하여 실제 소리 듣기</div>
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

      {/* ── [모드 2] 추억 사진관 (사진으로 보기) ── */}
      {activeMode === 'photos' && (
        <section className="photos-section anim-pop">
          {/* 카테고리 탭 */}
          <div className="photo-category-bar">
            <span className="cat-bar-label">사진 주제:</span>
            <div className="cat-buttons">
              {['전체', '골목놀이', '추억의물건', '옛날학교', '고향풍경'].map((cat) => (
                <button
                  key={cat}
                  className={`cat-btn ${photoCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setPhotoCategory(cat);
                    setCurrentPhotoIndex(0);
                    ttsManager.stop();
                    setIsSpeakingPhotoStory(false);
                  }}
                >
                  {cat === '전체'
                    ? '🌟 전체 사진'
                    : cat === '골목놀이'
                    ? '골목 놀이'
                    : cat === '추억의물건'
                    ? '추억의 물건'
                    : cat === '옛날학교'
                    ? '옛날 학교'
                    : '고향 풍경'}
                </button>
              ))}
            </div>
          </div>

          <div className="photo-gallery-card">
            {/* 좌측: 고화질 레트로 사진 프레임 */}
            <div className="photo-viewer-left">
              <div className="vintage-photo-frame">
                <img
                  src={currentPhoto.photoUrl}
                  alt={currentPhoto.title}
                  className="vintage-photo-img"
                />
                <div className="vintage-era-badge">{currentPhoto.period}</div>
                <button
                  className="photo-sfx-overlay-btn"
                  onClick={() => soundManager.playSoundByTheme(currentPhoto.themeSound)}
                  title="이 사진의 실제 소리 듣기"
                >
                  <Sparkles size={20} />
                  <span>{currentPhoto.soundLabel}</span>
                </button>
              </div>

              {/* 사진 썸네일 스트립 */}
              <div className="photo-thumb-strip">
                {filteredPhotos.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`photo-thumb-btn ${idx === currentPhotoIndex ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentPhotoIndex(idx);
                      ttsManager.stop();
                      setIsSpeakingPhotoStory(false);
                    }}
                  >
                    <img src={item.photoUrl} alt={item.title} />
                    <span className="thumb-title">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 우측: 사진 설명 및 이야기 낭독 */}
            <div className="photo-viewer-right">
              <div className="photo-header-tag">
                <span className="category-pill">{currentPhoto.category}</span>
                <span className="period-pill">🗓️ {currentPhoto.period}</span>
              </div>

              <h2 className="photo-title-main">{currentPhoto.title}</h2>
              <p className="photo-summary-lead">{currentPhoto.summary}</p>

              <div className="photo-story-box">
                <h3 className="story-box-title">📖 그 시절 풍경과 이야기</h3>
                <p className="story-box-text">{currentPhoto.story}</p>
              </div>

              {/* 소리 및 음성 낭독 액션 바 */}
              <div className="photo-actions-row">
                <button
                  className={`tts-read-story-btn ${isSpeakingPhotoStory ? 'speaking' : ''}`}
                  onClick={handleTogglePhotoStory}
                >
                  {isSpeakingPhotoStory ? <VolumeX size={22} /> : <Volume2 size={22} />}
                  <span>{isSpeakingPhotoStory ? '이야기 읽기 멈춤' : '🔊 다정한 목소리로 이야기 듣기'}</span>
                </button>
                <button
                  className="photo-sfx-btn"
                  onClick={() => soundManager.playSoundByTheme(currentPhoto.themeSound)}
                >
                  <Sparkles size={22} />
                  <span>🔔 실제 소리 재생</span>
                </button>
              </div>

              {/* 어르신과 함께 나누는 대화 박스 */}
              <div className="photo-dialogue-prompt">
                <MessageCircleHeart size={28} color="#D97706" />
                <div className="prompt-text-wrap">
                  <strong className="prompt-label">🌸 어르신과 나누는 추억 이야기</strong>
                  <p className="prompt-content">"{currentPhoto.conversationPrompt}"</p>
                </div>
              </div>

              {/* 이전 / 다음 사진 네비게이션 */}
              <div className="photo-nav-footer">
                <button
                  className="photo-nav-btn"
                  disabled={currentPhotoIndex === 0}
                  onClick={() => {
                    setCurrentPhotoIndex((prev) => prev - 1);
                    ttsManager.stop();
                    setIsSpeakingPhotoStory(false);
                  }}
                >
                  <ChevronLeft size={24} />
                  <span>이전 사진</span>
                </button>
                <span className="photo-count-indicator">
                  {currentPhotoIndex + 1} / {filteredPhotos.length}
                </span>
                <button
                  className="photo-nav-btn"
                  disabled={currentPhotoIndex === filteredPhotos.length - 1}
                  onClick={() => {
                    setCurrentPhotoIndex((prev) => prev + 1);
                    ttsManager.stop();
                    setIsSpeakingPhotoStory(false);
                  }}
                >
                  <span>다음 사진</span>
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── [모드 3] AI와 추억 게임방 ── */}
      {activeMode === 'aigame' && (
        <section className="aigame-section anim-pop">
          {/* 게임 선택 탭 */}
          <div className="aigame-selector-bar">
            <button
              className={`aigame-tab-btn ${aiGameType === 'marbles' ? 'active' : ''}`}
              onClick={() => {
                setAiGameType('marbles');
                handleResetMarbleGame();
              }}
            >
              <span>🔮 1. AI 순이와 구슬치기 대결</span>
            </button>
            <button
              className={`aigame-tab-btn ${aiGameType === 'ddakji' ? 'active' : ''}`}
              onClick={() => {
                setAiGameType('ddakji');
                handleResetDdakjiGame();
              }}
            >
              <span>📦 2. AI 순이와 종이딱지 넘기기</span>
            </button>
          </div>

          {/* AI 대화 말풍선 */}
          <div className="ai-companion-card">
            <div className="companion-avatar">
              <span className="avatar-emoji">👧</span>
              <span className="avatar-name">AI 동무 순이</span>
            </div>
            <div className="companion-bubble">
              <p className="bubble-text">
                {aiGameType === 'marbles' ? marbleAiDialogue : ddakjiAiDialogue}
              </p>
            </div>
          </div>

          {/* 🔮 [게임 1] 구슬치기 인터랙티브 보드 */}
          {aiGameType === 'marbles' && (
            <div className="gameplay-card anim-pop">
              <div className="game-status-header">
                <div className="round-badge">🚩 라운드: {marbleRound} / 3</div>
                <div className="scores-wrap">
                  <span className="score-item player-score">
                    👵 어르신: <strong>{playerMarbleScore}</strong>점
                  </span>
                  <span className="score-vs">VS</span>
                  <span className="score-item ai-score">
                    👧 AI 순이: <strong>{aiMarbleScore}</strong>점
                  </span>
                </div>
              </div>

              {/* 흙마당 구슬치기 필드 */}
              <div className="marble-field-arena">
                <div className="sand-circle">
                  {/* 타겟 구슬들 */}
                  <div className="target-marble m-red"></div>
                  <div className="target-marble m-blue"></div>
                  <div className="target-marble m-green"></div>
                </div>

                {/* 어르신의 발사 구슬 */}
                <div className={`player-marble ${isMarbleShooting ? 'shooting' : ''}`}>
                  <span className="marble-label">어르신 구슬</span>
                </div>
              </div>

              {/* 구슬 조작 패널 */}
              {marbleTurn !== 'gameOver' ? (
                <div className="marble-control-panel">
                  <div className="power-slider-wrap">
                    <label className="slider-label">
                      <Sliders size={22} color="#059669" />
                      <span>튕기는 힘 조절 (게이지: {marblePower}%)</span>
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={marblePower}
                      onChange={(e) => setMarblePower(Number(e.target.value))}
                      className="power-slider"
                      disabled={marbleTurn !== 'player' || isMarbleShooting}
                    />
                  </div>

                  <button
                    className="shoot-marble-btn"
                    disabled={marbleTurn !== 'player' || isMarbleShooting}
                    onClick={handlePlayerShootMarble}
                  >
                    <Zap size={24} />
                    <span>
                      {marbleTurn === 'player'
                        ? '🔮 구슬 튕기기 (딱! 소리)'
                        : '👧 AI 순이가 구슬을 튕기는 중...'}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="game-over-banner anim-pop">
                  <Trophy size={40} color="#D97706" />
                  <div className="over-text-wrap">
                    <h3 className="over-title">
                      {playerMarbleScore > aiMarbleScore
                        ? '🎉 축하합니다! 어르신이 승리하셨습니다!'
                        : playerMarbleScore === aiMarbleScore
                        ? '🤝 멋진 승부! 어르신과 순이가 비겼습니다!'
                        : '👏 멋진 실력이셨습니다! 순이와 즐거운 한판!'}
                    </h3>
                    <p className="over-sub">
                      최종 점수: 어르신 {playerMarbleScore}점 vs AI 순이 {aiMarbleScore}점
                    </p>
                  </div>
                  <button className="restart-game-btn" onClick={handleResetMarbleGame}>
                    <RotateCcw size={22} />
                    <span>구슬치기 다시 하기</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 📦 [게임 2] 종이딱지 넘기기 인터랙티브 보드 */}
          {aiGameType === 'ddakji' && (
            <div className="gameplay-card anim-pop">
              <div className="game-status-header">
                <div className="round-badge">🚩 대결: {ddakjiRound} / 3</div>
                <div className="scores-wrap">
                  <span className="score-item player-score">
                    👵 어르신: <strong>{playerDdakjiScore}</strong>점
                  </span>
                  <span className="score-vs">VS</span>
                  <span className="score-item ai-score">
                    👧 AI 순이: <strong>{aiDdakjiScore}</strong>점
                  </span>
                </div>
              </div>

              {/* 딱지 필드 */}
              <div className="ddakji-field-arena">
                <div className="floor-wood">
                  {/* 바닥 타겟 딱지 */}
                  <div className={`target-ddakji ${isTargetFlipped ? 'flipped' : ''}`}>
                    <span className="ddakji-icon">📦</span>
                    <span className="ddakji-text">
                      {isTargetFlipped ? '뒤집힘! 👏' : '상대방 왕딱지'}
                    </span>
                  </div>

                  {/* 어르신의 내리치는 딱지 */}
                  <div className={`attacker-ddakji ${isDdakjiSlapping ? 'slapping' : ''}`}>
                    <span className="attacker-text">어르신 딱지</span>
                  </div>
                </div>
              </div>

              {/* 딱지 조작 패널 */}
              {ddakjiTurn !== 'gameOver' ? (
                <div className="ddakji-control-panel">
                  <button
                    className="slap-ddakji-btn"
                    disabled={ddakjiTurn !== 'player' || isDdakjiSlapping}
                    onClick={handlePlayerSlapDdakji}
                  >
                    <Zap size={24} />
                    <span>
                      {ddakjiTurn === 'player'
                        ? '💥 힘차게 딱지 내리치기 (착-팡!)'
                        : '👧 AI 순이가 내리치는 중...'}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="game-over-banner anim-pop">
                  <Trophy size={40} color="#D97706" />
                  <div className="over-text-wrap">
                    <h3 className="over-title">
                      {playerDdakjiScore > aiDdakjiScore
                        ? '🎉 멋진 왕딱지 대결 승리! 어르신 손맛이 최고입니다!'
                        : playerDdakjiScore === aiDdakjiScore
                        ? '🤝 팽팽한 딱지 명승부! 무승부입니다!'
                        : '👏 멋진 딱지 승부였습니다! 다음엔 꼭 이겨보세요!'}
                    </h3>
                    <p className="over-sub">
                      최종 점수: 어르신 {playerDdakjiScore}점 vs AI 순이 {aiDdakjiScore}점
                    </p>
                  </div>
                  <button className="restart-game-btn" onClick={handleResetDdakjiGame}>
                    <RotateCcw size={22} />
                    <span>딱지치기 다시 하기</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── [모드 4] 나의 추억 엽서 만들기 ── */}
      {activeMode === 'postcard' && (
        <section className="postcard-section anim-pop">
          <div className="postcard-intro">
            <h2 className="section-heading">💌 나만의 어린 시절 추억 엽서 만들기</h2>
            <p className="section-sub">
              기억에 남는 주제를 선택하고, 그 시절 가장 좋았던 추억을 골라 예쁜 엽서를 완성해보세요.
            </p>
          </div>

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

      {/* ── [모드 5] 그 시절 동요와 사진첩 ── */}
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
                <div>
                  <h3 className="song-title-large">{currentSong.title}</h3>
                  <span className="song-composer">{currentSong.composer}</span>
                </div>
              </div>

              <div className="song-control-bar">
                <button
                  className={`melody-play-btn ${isPlayingMelody ? 'playing' : ''}`}
                  onClick={handleToggleMelody}
                >
                  {isPlayingMelody ? <Square size={24} /> : <Play size={24} />}
                  <span>{isPlayingMelody ? '음악 멈춤' : '🎵 동요 음악 재생'}</span>
                </button>

                <button
                  className={`lyrics-read-btn ${isReadingLyrics ? 'speaking' : ''}`}
                  onClick={handleToggleLyrics}
                >
                  {isReadingLyrics ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  <span>{isReadingLyrics ? '낭독 멈춤' : '🔊 가사 읽어주기'}</span>
                </button>
              </div>

              <div className="lyrics-box">
                {currentSong.lyrics.map((line, lIdx) => (
                  <p key={lIdx} className="lyric-line">{line}</p>
                ))}
              </div>

              <div className="song-nav-row">
                <button
                  className="song-prev-btn"
                  disabled={currentSongIndex === 0}
                  onClick={() => handleSelectSong(currentSongIndex - 1)}
                >
                  <ChevronLeft size={22} />
                  <span>이전 동요</span>
                </button>
                <button
                  className="song-next-btn"
                  disabled={currentSongIndex === CHILDHOOD_SONGS.length - 1}
                  onClick={() => handleSelectSong(currentSongIndex + 1)}
                >
                  <span>다음 동요</span>
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 통합 스타일 ── */}
      <style>{`
        .childhood-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px 60px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .childhood-header {
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
          border: 3px solid #F59E0B;
          border-radius: 28px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(217, 119, 6, 0.12);
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 2px solid #F59E0B;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 800;
          color: #B45309;
          margin-bottom: 12px;
        }

        .header-title {
          font-size: clamp(28px, 4.5vw, 42px);
          font-weight: 900;
          color: #78350F;
          margin: 0 0 10px;
          letter-spacing: -1px;
        }

        .header-desc {
          font-size: clamp(17px, 2.2vw, 21px);
          font-weight: 700;
          color: #92400E;
          margin: 0 auto 24px;
          max-width: 760px;
          line-height: 1.5;
        }

        .activity-nav-tabs {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .nav-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 18px;
          font-weight: 800;
          border-radius: 18px;
          border: 3px solid #D97706;
          background: #FFFFFF;
          color: #78350F;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
        }

        .nav-tab-btn:hover {
          background: #FEF3C7;
          transform: translateY(-2px);
        }

        .nav-tab-btn.active {
          background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
          color: #FFFFFF;
          border-color: #78350F;
          box-shadow: 0 6px 16px rgba(180, 83, 9, 0.35);
          transform: translateY(-2px) scale(1.02);
        }

        /* ── [모드 1 퀴즈 스타일] ── */
        .quiz-category-bar, .photo-category-bar {
          background: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 18px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cat-bar-label {
          font-size: 18px;
          font-weight: 800;
          color: #0F766E;
        }

        .cat-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cat-btn {
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 800;
          border-radius: 12px;
          border: 2px solid #CBD5E1;
          background: #FFFFFF;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-btn.active {
          background: #0F766E;
          border-color: #115E59;
          color: #FFFFFF;
        }

        .quiz-card {
          background: #FFFFFF;
          border: 3px solid #0D9488;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 12px 28px rgba(13, 148, 136, 0.12);
        }

        .quiz-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .quiz-index-badge {
          background: #CCFBF1;
          color: #0F766E;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 17px;
          font-weight: 800;
        }

        .quiz-score-badge {
          background: #FEF3C7;
          color: #92400E;
          padding: 6px 16px;
          border-radius: 10px;
          font-size: 17px;
          font-weight: 800;
        }

        .quiz-theme-badge {
          background: #FEF08A;
          color: #854D0E;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 800;
        }

        .quiz-question-title {
          font-size: clamp(22px, 3.2vw, 30px);
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 16px;
          line-height: 1.4;
        }

        .quiz-hint-box {
          background: #FFFBEB;
          border: 2px solid #FDE68A;
          border-radius: 16px;
          padding: 12px 20px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .hint-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hint-text {
          font-size: 19px;
          font-weight: 800;
          color: #B45309;
        }

        .quiz-sound-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sfx-play-btn, .photo-sfx-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 800;
          border: 2px solid #059669;
          border-radius: 12px;
          background: #ECFDF5;
          color: #047857;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(5, 150, 105, 0.15);
          transition: all 0.2s;
        }

        .sfx-play-btn:hover, .photo-sfx-btn:hover {
          background: #D1FAE5;
          transform: translateY(-2px);
        }

        .tts-speak-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 16px;
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
        }

        .tts-speak-btn.speaking {
          background: #DC2626;
          color: #FFFFFF;
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
          position: relative;
        }

        .quiz-photo-wrapper.interactive-photo {
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .quiz-photo-wrapper.interactive-photo:hover {
          border-color: #10B981;
          transform: translateY(-4px);
        }

        .photo-tap-badge {
          text-align: center;
          background: #F0FDF4;
          color: #15803D;
          font-size: 14px;
          font-weight: 800;
          padding: 6px 10px;
          border-top: 1px dashed #86EFAC;
          border-bottom: 1px dashed #86EFAC;
        }

        .photo-caption {
          padding: 10px 14px;
          font-size: 15px;
          font-weight: 700;
          color: #475569;
          text-align: center;
          margin: 0;
          background: #F1F5F9;
        }

        .options-title {
          font-size: 19px;
          font-weight: 800;
          color: #334155;
          margin-bottom: 12px;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        .quiz-opt-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          font-size: 21px;
          font-weight: 800;
          border: 3px solid #CBD5E1;
          border-radius: 18px;
          background: #FFFFFF;
          color: #1E293B;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .quiz-opt-btn:hover:not(:disabled) {
          border-color: #0F766E;
          background: #F0FDFA;
          transform: translateY(-2px);
        }

        .quiz-opt-btn.selected-opt {
          border-color: #0F766E;
          background: #CCFBF1;
          color: #115E59;
        }

        .quiz-opt-btn.correct-opt {
          border-color: #059669;
          background: #ECFDF5;
          color: #065F46;
          border-width: 4px;
        }

        .quiz-opt-btn.wrong-opt {
          border-color: #EF4444;
          background: #FEF2F2;
          color: #991B1B;
        }

        .opt-number-badge {
          font-size: 24px;
          color: #0F766E;
        }

        .opt-text {
          flex: 1;
        }

        .check-btn, .next-btn {
          width: 100%;
          padding: 16px;
          font-size: 22px;
          font-weight: 900;
          border-radius: 18px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .check-btn {
          background: #0F766E;
          color: #FFFFFF;
        }

        .check-btn:disabled {
          background: #94A3B8;
          cursor: not-allowed;
        }

        .next-btn {
          background: #D97706;
          color: #FFFFFF;
        }

        .quiz-feedback-box {
          margin-top: 24px;
          border-radius: 20px;
          padding: 22px;
        }

        .quiz-feedback-box.fb-correct {
          background: #ECFDF5;
          border: 3px solid #10B981;
        }

        .quiz-feedback-box.fb-retry {
          background: #FEF3C7;
          border: 3px solid #F59E0B;
        }

        .feedback-title {
          font-size: 22px;
          font-weight: 900;
          margin-bottom: 8px;
          color: #065F46;
        }

        .fb-retry .feedback-title {
          color: #92400E;
        }

        .feedback-explanation {
          font-size: 19px;
          font-weight: 700;
          color: #1E293B;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .reminiscence-talk-box {
          background: #FFFFFF;
          border: 2px dashed #0F766E;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .talk-label {
          display: block;
          font-size: 16px;
          font-weight: 800;
          color: #0F766E;
          margin-bottom: 4px;
        }

        .talk-question {
          font-size: 19px;
          font-weight: 800;
          color: #134E4A;
          margin: 0;
          line-height: 1.5;
        }

        /* ── [모드 2 추억 사진관 스타일] ── */
        .photo-gallery-card {
          background: #FFFFFF;
          border: 3px solid #D97706;
          border-radius: 28px;
          padding: 28px;
          display: grid;
          grid-template-columns: 480px 1fr;
          gap: 30px;
          box-shadow: 0 12px 28px rgba(217, 119, 6, 0.12);
        }

        .vintage-photo-frame {
          position: relative;
          border: 8px solid #FEF3C7;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          height: 340px;
        }

        .vintage-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vintage-era-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.85);
          color: #FEF08A;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 800;
        }

        .photo-sfx-overlay-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: #059669;
          color: #FFFFFF;
          border: 2px solid #FFFFFF;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        }

        .photo-thumb-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 14px;
        }

        .photo-thumb-btn {
          border: 3px solid #CBD5E1;
          border-radius: 12px;
          overflow: hidden;
          background: #F8FAFC;
          cursor: pointer;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.2s;
        }

        .photo-thumb-btn img {
          width: 100%;
          height: 55px;
          object-fit: cover;
        }

        .photo-thumb-btn .thumb-title {
          font-size: 12px;
          font-weight: 800;
          padding: 4px;
          color: #334155;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .photo-thumb-btn.active {
          border-color: #D97706;
          box-shadow: 0 0 0 2px #F59E0B;
        }

        .photo-viewer-right {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .photo-header-tag {
          display: flex;
          gap: 8px;
        }

        .category-pill {
          background: #ECFDF5;
          color: #065F46;
          border: 1.5px solid #A7F3D0;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 800;
        }

        .period-pill {
          background: #FEF3C7;
          color: #92400E;
          border: 1.5px solid #FDE68A;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 800;
        }

        .photo-title-main {
          font-size: 28px;
          font-weight: 900;
          color: #78350F;
          margin: 0;
        }

        .photo-summary-lead {
          font-size: 19px;
          font-weight: 800;
          color: #0F766E;
          margin: 0;
          line-height: 1.4;
        }

        .photo-story-box {
          background: #FFFBEB;
          border-left: 6px solid #D97706;
          border-radius: 14px;
          padding: 16px 20px;
        }

        .story-box-title {
          font-size: 18px;
          font-weight: 800;
          color: #B45309;
          margin: 0 0 6px;
        }

        .story-box-text {
          font-size: 18px;
          font-weight: 700;
          color: #1E293B;
          line-height: 1.6;
          margin: 0;
        }

        .photo-actions-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .tts-read-story-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 18px;
          font-weight: 800;
          border: 2px solid #D97706;
          border-radius: 14px;
          background: #FEF3C7;
          color: #78350F;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tts-read-story-btn.speaking {
          background: #DC2626;
          color: #FFFFFF;
          border-color: #B91C1C;
        }

        .photo-dialogue-prompt {
          background: #F0FDF4;
          border: 2px dashed #10B981;
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .prompt-label {
          display: block;
          font-size: 15px;
          font-weight: 800;
          color: #047857;
          margin-bottom: 3px;
        }

        .prompt-content {
          font-size: 17px;
          font-weight: 800;
          color: #064E3B;
          margin: 0;
          line-height: 1.4;
        }

        .photo-nav-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 10px;
        }

        .photo-nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          font-size: 17px;
          font-weight: 800;
          border: 2px solid #CBD5E1;
          border-radius: 12px;
          background: #F8FAFC;
          color: #334155;
          cursor: pointer;
        }

        .photo-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .photo-count-indicator {
          font-size: 17px;
          font-weight: 800;
          color: #64748B;
        }

        /* ── [모드 3 AI 추억 게임방 스타일] ── */
        .aigame-selector-bar {
          display: flex;
          gap: 14px;
          margin-bottom: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .aigame-tab-btn {
          padding: 14px 28px;
          font-size: 20px;
          font-weight: 900;
          border-radius: 18px;
          border: 3px solid #6366F1;
          background: #FFFFFF;
          color: #4338CA;
          cursor: pointer;
          transition: all 0.2s;
        }

        .aigame-tab-btn.active {
          background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%);
          color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
        }

        .ai-companion-card {
          background: #EEF2FF;
          border: 3px solid #818CF8;
          border-radius: 24px;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .companion-avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .avatar-emoji {
          font-size: 42px;
        }

        .avatar-name {
          font-size: 15px;
          font-weight: 900;
          color: #3730A3;
          background: #C7D2FE;
          padding: 3px 8px;
          border-radius: 8px;
        }

        .companion-bubble {
          flex: 1;
          background: #FFFFFF;
          border: 2px solid #C7D2FE;
          border-radius: 18px;
          padding: 14px 20px;
          position: relative;
        }

        .bubble-text {
          font-size: 20px;
          font-weight: 800;
          color: #1E1B4B;
          margin: 0;
          line-height: 1.4;
        }

        .gameplay-card {
          background: #FFFFFF;
          border: 3px solid #4F46E5;
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 12px 28px rgba(79, 70, 229, 0.12);
        }

        .game-status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .round-badge {
          background: #E0E7FF;
          color: #3730A3;
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 900;
        }

        .scores-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .score-item {
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 800;
        }

        .player-score {
          background: #ECFDF5;
          color: #065F46;
          border: 2px solid #10B981;
        }

        .ai-score {
          background: #EEF2FF;
          color: #3730A3;
          border: 2px solid #6366F1;
        }

        .score-vs {
          font-size: 18px;
          font-weight: 900;
          color: #94A3B8;
        }

        /* 구슬치기 아레나 */
        .marble-field-arena {
          height: 280px;
          background: radial-gradient(circle, #FDE68A 0%, #D97706 100%);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 4px 14px rgba(0,0,0,0.25);
          margin-bottom: 24px;
        }

        .sand-circle {
          width: 190px;
          height: 190px;
          border: 4px dashed #92400E;
          border-radius: 50%;
          background: rgba(254, 243, 199, 0.6);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .target-marble {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          position: absolute;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .m-red {
          background: radial-gradient(circle at 35% 35%, #FCA5A5, #DC2626);
          top: 35px;
          left: 55px;
        }

        .m-blue {
          background: radial-gradient(circle at 35% 35%, #93C5FD, #2563EB);
          top: 100px;
          left: 110px;
        }

        .m-green {
          background: radial-gradient(circle at 35% 35%, #86EFAC, #16A34A);
          top: 95px;
          left: 45px;
        }

        .player-marble {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #FED7AA, #EA580C);
          border: 3px solid #FFFFFF;
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 6px 14px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .player-marble.shooting {
          bottom: 120px;
          transform: translateX(-50%) scale(1.15);
        }

        .marble-label {
          font-size: 11px;
          font-weight: 900;
          color: #FFFFFF;
          text-shadow: 0 1px 3px rgba(0,0,0,0.7);
        }

        /* 딱지치기 아레나 */
        .ddakji-field-arena {
          height: 280px;
          background: linear-gradient(135deg, #78350F 0%, #451A03 100%);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 4px 14px rgba(0,0,0,0.3);
          margin-bottom: 24px;
        }

        .floor-wood {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .target-ddakji {
          width: 110px;
          height: 110px;
          background: #3B82F6;
          border: 5px solid #1D4ED8;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
          transform: rotate(-10deg);
          transition: all 0.5s ease;
        }

        .target-ddakji.flipped {
          background: #10B981;
          border-color: #047857;
          transform: rotate(190deg) scale(1.05);
        }

        .ddakji-icon {
          font-size: 32px;
        }

        .ddakji-text {
          font-size: 14px;
          font-weight: 900;
        }

        .attacker-ddakji {
          position: absolute;
          width: 100px;
          height: 100px;
          background: #EF4444;
          border: 5px solid #B91C1C;
          border-radius: 16px;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          top: -120px;
          right: 35%;
          box-shadow: 0 10px 24px rgba(0,0,0,0.5);
          transition: all 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045);
        }

        .attacker-ddakji.slapping {
          top: 90px;
          right: 48%;
          transform: rotate(20deg) scale(1.1);
        }

        .attacker-text {
          font-size: 15px;
          font-weight: 900;
        }

        /* 게임 조작 패널 */
        .marble-control-panel, .ddakji-control-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .power-slider-wrap {
          background: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .slider-label {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .power-slider {
          width: 100%;
          height: 12px;
          accent-color: #059669;
          cursor: pointer;
        }

        .shoot-marble-btn, .slap-ddakji-btn {
          width: 100%;
          padding: 18px;
          font-size: 22px;
          font-weight: 900;
          border-radius: 18px;
          border: none;
          background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.3);
          transition: all 0.2s;
        }

        .shoot-marble-btn:hover:not(:disabled), .slap-ddakji-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(79, 70, 229, 0.4);
        }

        .shoot-marble-btn:disabled, .slap-ddakji-btn:disabled {
          background: #94A3B8;
          cursor: not-allowed;
          box-shadow: none;
        }

        .game-over-banner {
          background: #FEF3C7;
          border: 3px solid #D97706;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .over-text-wrap {
          flex: 1;
        }

        .over-title {
          font-size: 22px;
          font-weight: 900;
          color: #78350F;
          margin: 0 0 6px;
        }

        .over-sub {
          font-size: 18px;
          font-weight: 800;
          color: #92400E;
          margin: 0;
        }

        .restart-game-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 18px;
          font-weight: 900;
          background: #D97706;
          color: #FFFFFF;
          border: none;
          border-radius: 14px;
          cursor: pointer;
        }

        /* ── [모드 4 엽서 & 모드 5 동요 스타일] ── */
        .postcard-section, .song-section {
          background: #FFFFFF;
          border: 3px solid #D97706;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 12px 28px rgba(217, 119, 6, 0.12);
        }

        .section-heading {
          font-size: 26px;
          font-weight: 900;
          color: #78350F;
          margin: 0 0 6px;
        }

        .section-sub {
          font-size: 18px;
          font-weight: 700;
          color: #92400E;
          margin: 0 0 20px;
        }

        .topic-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .topic-tab-btn {
          padding: 10px 18px;
          font-size: 17px;
          font-weight: 800;
          border: 2px solid #CBD5E1;
          border-radius: 14px;
          background: #FFFFFF;
          color: #334155;
          cursor: pointer;
        }

        .topic-tab-btn.active {
          background: #D97706;
          border-color: #B45309;
          color: #FFFFFF;
        }

        .postcard-maker-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        .prompt-header {
          margin-bottom: 16px;
        }

        .prompt-badge {
          background: #FEF3C7;
          color: #92400E;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 800;
        }

        .prompt-question {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
          margin: 8px 0 4px;
        }

        .prompt-subtitle {
          font-size: 16px;
          font-weight: 700;
          color: #64748B;
          margin: 0;
        }

        .prompt-choices {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .choice-card {
          border: 2px solid #CBD5E1;
          border-radius: 16px;
          padding: 14px 18px;
          background: #FFFFFF;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .choice-card.active {
          border-color: #D97706;
          background: #FFFBEB;
        }

        .choice-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .choice-num-badge {
          font-size: 20px;
          color: #D97706;
        }

        .choice-label {
          font-size: 18px;
          font-weight: 800;
          color: #1E293B;
        }

        .choice-desc {
          font-size: 15px;
          font-weight: 700;
          color: #64748B;
          margin: 0;
        }

        .caregiver-memo-box {
          margin-bottom: 20px;
        }

        .memo-label {
          display: block;
          font-size: 16px;
          font-weight: 800;
          color: #334155;
          margin-bottom: 6px;
        }

        .memo-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border: 2px solid #CBD5E1;
          border-radius: 12px;
          box-sizing: border-box;
        }

        .create-postcard-btn {
          width: 100%;
          padding: 14px;
          font-size: 19px;
          font-weight: 900;
          border-radius: 14px;
          border: none;
          background: #059669;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .postcard-preview-card {
          background: #FFFBEB;
          border: 4px double #D97706;
          border-radius: 20px;
          padding: 24px;
          position: relative;
          box-shadow: 0 8px 18px rgba(0,0,0,0.08);
        }

        .postcard-stamp {
          position: absolute;
          top: 18px;
          right: 18px;
          border: 2px dashed #DC2626;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #DC2626;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .pc-title {
          font-size: 22px;
          font-weight: 900;
          color: #78350F;
          margin: 0 0 16px;
        }

        .pc-chosen-highlight {
          background: #FEF3C7;
          border-radius: 10px;
          padding: 8px 14px;
          margin-bottom: 12px;
          font-size: 18px;
          font-weight: 900;
          color: #92400E;
        }

        .pc-story-quote {
          font-size: 18px;
          font-weight: 700;
          color: #334155;
          line-height: 1.6;
          margin: 0 0 16px;
        }

        .pc-extra-note {
          background: #FFFFFF;
          border-left: 4px solid #059669;
          padding: 10px 14px;
          font-size: 16px;
          color: #065F46;
          border-radius: 8px;
        }

        .postcard-footer {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 700;
          color: #94A3B8;
          margin-top: 24px;
          border-top: 1px dashed #CBD5E1;
          padding-top: 12px;
        }

        .postcard-success-banner {
          margin-top: 16px;
          background: #ECFDF5;
          border: 2px solid #10B981;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 800;
          color: #065F46;
        }

        /* 동요 뷰 */
        .song-selector-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .song-select-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          font-size: 17px;
          font-weight: 800;
          border: 2px solid #CBD5E1;
          border-radius: 14px;
          background: #FFFFFF;
          color: #334155;
          cursor: pointer;
        }

        .song-select-btn.active {
          background: #D97706;
          border-color: #B45309;
          color: #FFFFFF;
        }

        .song-main-card {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 28px;
        }

        .song-photo-frame {
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          height: 280px;
        }

        .song-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .song-photo-caption-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.8);
          color: #FFFFFF;
          padding: 8px 12px;
          font-size: 14px;
        }

        .song-card-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .song-title-large {
          font-size: 26px;
          font-weight: 900;
          color: #78350F;
          margin: 0;
        }

        .song-composer {
          font-size: 15px;
          color: #64748B;
        }

        .song-control-bar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .melody-play-btn, .lyrics-read-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          font-size: 17px;
          font-weight: 800;
          border-radius: 14px;
          cursor: pointer;
          border: 2px solid #D97706;
        }

        .melody-play-btn {
          background: #FEF3C7;
          color: #78350F;
        }

        .melody-play-btn.playing {
          background: #DC2626;
          color: #FFFFFF;
          border-color: #B91C1C;
        }

        .lyrics-read-btn {
          background: #ECFDF5;
          color: #065F46;
          border-color: #10B981;
        }

        .lyrics-read-btn.speaking {
          background: #DC2626;
          color: #FFFFFF;
          border-color: #B91C1C;
        }

        .lyrics-box {
          background: #F8FAFC;
          border-left: 6px solid #0F766E;
          border-radius: 14px;
          padding: 16px 20px;
        }

        .lyric-line {
          font-size: 21px;
          font-weight: 800;
          color: #1E293B;
          margin: 0 0 6px;
          line-height: 1.5;
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
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 800;
          border: 2px solid #CBD5E1;
          border-radius: 12px;
          background: #F8FAFC;
          color: #334155;
          cursor: pointer;
        }

        /* 반응형 */
        @media (max-width: 900px) {
          .quiz-content-grid, .photo-gallery-card, .postcard-maker-grid, .song-main-card {
            grid-template-columns: 1fr;
          }
          .options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
