import React, { useState, useEffect } from 'react';
import type { SentenceChoiceQuiz } from '../constants/sentenceChoiceData';
import { SENTENCE_CHOICE_QUIZZES } from '../constants/sentenceChoiceData';
import { soundManager } from '../utils/soundEffect';
import { ttsManager } from '../utils/ttsManager';
import { CheckCircle2, ArrowRight, MousePointerClick, Volume2, VolumeX } from 'lucide-react';

interface SentenceChoiceViewProps {
  onCompleteRound: (isSuccess: boolean, reactionTimeMs: number) => void;
}

export const SentenceChoiceView: React.FC<SentenceChoiceViewProps> = ({ onCompleteRound }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gentleNotice, setGentleNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const quiz: SentenceChoiceQuiz = SENTENCE_CHOICE_QUIZZES[currentIndex] || SENTENCE_CHOICE_QUIZZES[0];
  const startTimeRef = React.useRef<number>(performance.now());

  useEffect(() => {
    startTimeRef.current = performance.now();
    setSelectedOption(null);
    setGentleNotice(null);
    setIsProcessing(false);
    ttsManager.stop();
    setIsSpeaking(false);
  }, [currentIndex]);

  const handleSpeakQuestion = () => {
    if (isSpeaking) {
      ttsManager.stop();
      setIsSpeaking(false);
      return;
    }
    const textToRead = `${quiz.question}. 1번: ${quiz.option1.text}. 2번: ${quiz.option2.text}`;
    setIsSpeaking(true);
    ttsManager.speak(textToRead, {
      rate: 0.88,
      pitch: 1.02,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSelectSentence = (optionNum: 1 | 2) => {
    if (isProcessing) return;

    setSelectedOption(optionNum);
    const isCorrect =
      (optionNum === 1 && quiz.option1.isCorrect) ||
      (optionNum === 2 && quiz.option2.isCorrect);

    if (isCorrect) {
      soundManager.playMatch();
      setGentleNotice(`정답입니다! ${quiz.explanation}`);
      setIsProcessing(true);
    } else {
      soundManager.playMismatch();
      setGentleNotice('괜찮습니다. 천천히 다시 읽어보시고 다른 예시 문장을 선택해보세요.');
    }
  };

  const handleNextQuiz = () => {
    ttsManager.stop();
    setIsSpeaking(false);
    const totalTimeMs = Math.round(performance.now() - startTimeRef.current);

    if (currentIndex < SENTENCE_CHOICE_QUIZZES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all sentence choice quizzes
      onCompleteRound(true, totalTimeMs);
    }
  };

  return (
    <div className="sentence-choice-container anim-pop">
      {/* Header Prompt */}
      <div className="choice-header-box">
        <div className="prompt-badge">
          <MousePointerClick size={26} color="#0F766E" />
          <span>터치펜 선택 활동 · 예시 문장 고르기</span>
        </div>
        <h2 className="quiz-question">{quiz.question}</h2>

        <button
          className={`speech-btn ${isSpeaking ? 'speaking' : ''}`}
          onClick={handleSpeakQuestion}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isSpeaking ? '#C2410C' : '#F0FDFA',
            color: isSpeaking ? '#FFFFFF' : '#0F766E',
            border: '2px solid #5EEAD4',
            borderRadius: '16px',
            padding: '8px 18px',
            fontSize: '18px',
            fontWeight: 800,
            cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          {isSpeaking ? <VolumeX size={22} /> : <Volume2 size={22} />}
          <span>{isSpeaking ? '음성 멈추기' : '🔊 문장 음성으로 듣기'}</span>
        </button>
      </div>

      {/* Gentle Notice Banner */}
      {gentleNotice && (
        <div className={`gentle-banner anim-pop ${selectedOption ? 'success' : 'retry'}`}>
          {gentleNotice}
        </div>
      )}

      {/* Two Large Touch Sentence Cards */}
      <div className="sentence-cards-grid">
        {/* Option 1 Card */}
        <button
          onClick={() => handleSelectSentence(1)}
          className={`sentence-touch-card ${selectedOption === 1 ? (quiz.option1.isCorrect ? 'selected-correct' : 'selected-wrong') : ''}`}
          disabled={isProcessing}
          aria-label={`1번 예시 문장: ${quiz.option1.text}`}
        >
          <div className="card-top-row">
            <span className="card-badge">1번 예시 문장</span>
            <span className="card-emoji">{quiz.option1.emoji}</span>
          </div>
          <p className="card-text">{quiz.option1.text}</p>
          <div className="touch-pen-icon-hint">
            <span>👉 터치펜으로 이 문장 선택하기</span>
          </div>
        </button>

        {/* Option 2 Card */}
        <button
          onClick={() => handleSelectSentence(2)}
          className={`sentence-touch-card ${selectedOption === 2 ? (quiz.option2.isCorrect ? 'selected-correct' : 'selected-wrong') : ''}`}
          disabled={isProcessing}
          aria-label={`2번 예시 문장: ${quiz.option2.text}`}
        >
          <div className="card-top-row">
            <span className="card-badge">2번 예시 문장</span>
            <span className="card-emoji">{quiz.option2.emoji}</span>
          </div>
          <p className="card-text">{quiz.option2.text}</p>
          <div className="touch-pen-icon-hint">
            <span>👉 터치펜으로 이 문장 선택하기</span>
          </div>
        </button>
      </div>

      {/* Next Quiz Action */}
      {isProcessing && (
        <div className="next-action-box anim-pop">
          <button onClick={handleNextQuiz} className="senior-btn senior-btn-primary next-quiz-btn">
            <CheckCircle2 size={32} />
            <span>다음 예시 문장 활동으로 넘어가기</span>
            <ArrowRight size={30} />
          </button>
        </div>
      )}

      <style>{`
        .sentence-choice-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .choice-header-box {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .prompt-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #CCFBF1;
          border: 2px solid #5EEAD4;
          border-radius: 18px;
          padding: 6px 20px;
          font-size: 18px;
          font-weight: 700;
          color: #0F766E;
        }

        .quiz-question {
          font-size: 28px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1.4;
        }

        .gentle-banner {
          width: 100%;
          padding: 14px 24px;
          border-radius: 20px;
          font-size: 22px;
          font-weight: 800;
          text-align: center;
        }

        .gentle-banner.success {
          background-color: #ECFDF5;
          border: 3px solid #10B981;
          color: #047857;
        }

        .gentle-banner.retry {
          background-color: #FFFBEB;
          border: 3px solid #F59E0B;
          color: #B45309;
        }

        .sentence-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: 100%;
        }

        .sentence-touch-card {
          background-color: #FFFFFF;
          border: 4px solid #CBD5E1;
          border-radius: 26px;
          padding: 24px 28px;
          text-align: left;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.2s, background-color 0.2s;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        }

        .sentence-touch-card:hover {
          transform: translateY(-2px);
          border-color: #0F766E;
        }

        .sentence-touch-card.selected-correct {
          background-color: #F0FDF4;
          border-color: #0F766E;
          box-shadow: 0 10px 25px rgba(15, 118, 110, 0.2);
        }

        .sentence-touch-card.selected-wrong {
          background-color: #FEF2F2;
          border-color: #EF4444;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-badge {
          font-size: 16px;
          font-weight: 800;
          color: #0F766E;
          background-color: #CCFBF1;
          padding: 4px 14px;
          border-radius: 12px;
        }

        .card-emoji {
          font-size: 36px;
        }

        .card-text {
          font-size: 25px;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.5;
        }

        .touch-pen-icon-hint {
          font-size: 16px;
          font-weight: 700;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .next-action-box {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        .next-quiz-btn {
          min-width: 340px;
          padding: 16px 28px;
        }
      `}</style>
    </div>
  );
};
