import React, { useState, useEffect } from 'react';
import type { VideoItem } from '../constants/videoData';
import { INITIAL_VIDEOS } from '../constants/videoData';
import { Video, PlusCircle, ArrowLeft, Heart, Volume2, Sparkles, Film, Mic } from 'lucide-react';
import { soundManager } from '../utils/soundEffect';
import { ttsManager, type VoicePersona } from '../utils/ttsManager';

interface VideoGalleryProps {
  onCompleteRound: (isSuccess: boolean, reactionTimeMs: number) => void;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ onCompleteRound }) => {
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('senior_custom_videos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...INITIAL_VIDEOS, ...parsed];
      } catch {
        return INITIAL_VIDEOS;
      }
    }
    return INITIAL_VIDEOS;
  });

  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activePersona, setActivePersona] = useState<VoicePersona>('clear-nature');
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);

  // Creation Modal States
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newNarration, setNewNarration] = useState<string>('');
  const [newEmoji, setNewEmoji] = useState<string>('🎥');
  const [newVideoUrl, setNewVideoUrl] = useState<string>('https://www.youtube.com/embed/2OEL4P1Rz04');
  const [newPersona, setNewPersona] = useState<VoicePersona>('clear-nature');

  const startTimeRef = React.useRef<number>(performance.now());

  useEffect(() => {
    startTimeRef.current = performance.now();
  }, [activeVideo]);

  // Read Aloud Text-to-Speech (TTS) with matched voice persona
  const handleReadAloud = (text: string, persona: VoicePersona) => {
    setIsReadingAloud(true);
    ttsManager.speak(text, {
      persona,
      onStart: () => setIsReadingAloud(true),
      onEnd: () => setIsReadingAloud(false),
      onError: () => setIsReadingAloud(false),
    });
  };

  const handleStopSpeech = () => {
    ttsManager.stop();
    setIsReadingAloud(false);
  };

  const handleOpenVideo = (video: VideoItem) => {
    soundManager.playFlip();
    setActiveVideo(video);
    setActivePersona(video.voicePersona || 'warm-mother');
    handleStopSpeech();
  };

  const handleCloseVideo = () => {
    handleStopSpeech();
    setActiveVideo(null);
  };

  const handleCompleteWatch = () => {
    soundManager.playMatch();
    handleStopSpeech();
    const totalTimeMs = Math.round(performance.now() - startTimeRef.current);
    onCompleteRound(true, totalTimeMs);
    setActiveVideo(null);
  };

  const handleSaveCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newNarration) return;

    const newVideo: VideoItem = {
      id: `custom-video-${Date.now()}`,
      title: newTitle,
      category: '나만의 추억 영상',
      coverEmoji: newEmoji || '🎥',
      description: newDesc || '어르신과 가족이 정성껏 만든 소중한 힐링 추억 영상입니다.',
      videoUrl: newVideoUrl,
      narrationText: newNarration,
      voicePersona: newPersona,
      voiceLabel:
        newPersona === 'clear-nature'
          ? '🌊 맑고 청아한 자연 목소리'
          : newPersona === 'calm-sunset'
          ? '🌅 그윽하고 차분한 노을 목소리'
          : '🌸 따뜻하고 다정한 봄날 목소리',
    };

    const updated = [...videos, newVideo];
    setVideos(updated);

    const customOnly = updated.filter((v) => v.category.includes('나만의'));
    localStorage.setItem('senior_custom_videos', JSON.stringify(customOnly));

    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewNarration('');
    soundManager.playMatch();
  };

  return (
    <div className="video-gallery-container anim-pop">
      {/* Header Banner */}
      <div className="video-gallery-header">
        <div className="header-badge">
          <Film size={28} color="#7E22CE" />
          <span>추억 회상 요법 · 힐링 풍경 &amp; 영상 맞춤 목소리 앨범관</span>
        </div>
        <h2 className="video-gallery-title">🎥 추억 영상 앨범관 🌸</h2>
        <p className="video-gallery-sub">
          영상 분위기에 맞추어 <strong>다르게 들리는 맞춤 해설 목소리</strong>와 함께 편안한 힐링 시간을 가져보세요.
        </p>

        <div className="create-buttons-row">
          <button
            onClick={() => setShowCreateModal(true)}
            className="senior-btn create-video-btn"
          >
            <PlusCircle size={26} />
            <span>🎥 나만의 추억 영상 만들기</span>
          </button>
        </div>
      </div>

      {/* Video Player Modal View */}
      {activeVideo ? (
        <div className="video-player-card anim-pop">
          <button onClick={handleCloseVideo} className="video-back-btn senior-btn senior-btn-secondary">
            <ArrowLeft size={24} />
            <span>영상 목록으로 돌아가기</span>
          </button>

          <div className="video-player-content">
            <div className="video-meta">
              <span className="video-category-tag">{activeVideo.category}</span>
              <h3 className="video-watch-title">{activeVideo.title}</h3>
              <p className="video-watch-desc">{activeVideo.description}</p>
            </div>

            <div className="video-frame-box">
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {activeVideo.narrationText && (
              <div className="narration-box">
                <div className="narration-header">
                  <Sparkles size={24} color="#7E22CE" />
                  <span>영상 맞춤 해설 이야기 (클릭한 영상의 전용 목소리)</span>
                </div>

                <p className="narration-text">"{activeVideo.narrationText}"</p>

                {/* 영상 분위기별 목소리 선택 바 */}
                <div className="voice-persona-selector">
                  <span className="voice-selector-label">
                    <Mic size={18} /> 해설 목소리 선택:
                  </span>
                  <div className="voice-btn-group">
                    <button
                      type="button"
                      onClick={() => {
                        handleStopSpeech();
                        setActivePersona('clear-nature');
                      }}
                      className={`voice-choice-btn ${activePersona === 'clear-nature' ? 'active' : ''}`}
                    >
                      🌊 맑고 청아한 목소리
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleStopSpeech();
                        setActivePersona('warm-mother');
                      }}
                      className={`voice-choice-btn ${activePersona === 'warm-mother' ? 'active' : ''}`}
                    >
                      🌸 다정하고 포근한 목소리
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleStopSpeech();
                        setActivePersona('calm-sunset');
                      }}
                      className={`voice-choice-btn ${activePersona === 'calm-sunset' ? 'active' : ''}`}
                    >
                      🌅 그윽하고 차분한 목소리
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    isReadingAloud
                      ? handleStopSpeech()
                      : handleReadAloud(activeVideo.narrationText, activePersona)
                  }
                  className={`tts-btn ${isReadingAloud ? 'speaking' : ''}`}
                >
                  <Volume2 size={26} />
                  <span>
                    {isReadingAloud
                      ? '🔊 해설 낭독 멈추기'
                      : `🔊 [${
                          activePersona === 'clear-nature'
                            ? '맑고 청아한'
                            : activePersona === 'calm-sunset'
                            ? '그윽하고 차분한'
                            : '다정하고 포근한'
                        } 목소리]로 듣기`}
                  </span>
                </button>
              </div>
            )}

            <div className="video-actions-bottom">
              <button onClick={handleCompleteWatch} className="senior-btn complete-watch-btn">
                <Heart size={26} />
                <span>영상 감상 완료 (목록으로)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((vid) => (
            <div key={vid.id} className="video-card anim-pop" onClick={() => handleOpenVideo(vid)}>
              <div className="video-cover-icon">{vid.coverEmoji}</div>
              <div className="video-info">
                <span className="video-tag">{vid.category}</span>
                <h3 className="video-title">{vid.title}</h3>
                <p className="video-desc">{vid.description}</p>
                <div className="video-voice-badge">
                  <Mic size={16} />
                  <span>{vid.voiceLabel || '🌸 맞춤 해설 음성'}</span>
                </div>
                <div className="video-action-hint">
                  <Video size={20} />
                  <span>영상 재생 및 감상하기 ▶</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal (Video Album) */}
      {showCreateModal && (
        <div className="modal-overlay anim-fade">
          <div className="create-modal-card anim-pop">
            <h3 className="create-title">
              🎥 나만의 추억 영상 앨범 만들기
            </h3>
            <p className="create-sub">
              원하는 풍경과 <strong>맞춤 목소리를 선택</strong>하여 감상해보세요.
            </p>

            <form onSubmit={handleSaveCustomVideo} className="create-form">
              <div className="form-group">
                <label>추억 힐링 배경 영상 선택 (터치):</label>
                <div className="video-sample-select">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewVideoUrl('https://www.youtube.com/embed/2OEL4P1Rz04');
                      setNewPersona('clear-nature');
                    }}
                    className={`sample-vid-btn ${newVideoUrl.includes('2OEL4P1Rz04') ? 'active' : ''}`}
                  >
                    🌊 1. 맑은 시냇물과 숲속 새소리 영상 (맑고 청아한 목소리 추천)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewVideoUrl('https://www.youtube.com/embed/L_LUpnjgPso');
                      setNewPersona('warm-mother');
                    }}
                    className={`sample-vid-btn ${newVideoUrl.includes('L_LUpnjgPso') ? 'active' : ''}`}
                  >
                    🌸 2. 따뜻한 봄날 들꽃 풍경 영상 (다정하고 포근한 목소리 추천)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewVideoUrl('https://www.youtube.com/embed/jfKfPfyJRdk');
                      setNewPersona('calm-sunset');
                    }}
                    className={`sample-vid-btn ${newVideoUrl.includes('jfKfPfyJRdk') ? 'active' : ''}`}
                  >
                    🌅 3. 노을 지는 저녁 고향 마을 풍경 영상 (그윽하고 차분한 목소리 추천)
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>표지 이모지 선택:</label>
                <div className="emoji-select-row">
                  {['🎥', '🌊', '🌸', '🌅', '🌲', '🦆'].map((em) => (
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
                <label>해설해 줄 목소리 종류 선택:</label>
                <div className="voice-btn-group">
                  <button
                    type="button"
                    onClick={() => setNewPersona('clear-nature')}
                    className={`voice-choice-btn ${newPersona === 'clear-nature' ? 'active' : ''}`}
                  >
                    🌊 맑고 청아한 목소리
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPersona('warm-mother')}
                    className={`voice-choice-btn ${newPersona === 'warm-mother' ? 'active' : ''}`}
                  >
                    🌸 다정하고 포근한 목소리
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPersona('calm-sunset')}
                    className={`voice-choice-btn ${newPersona === 'calm-sunset' ? 'active' : ''}`}
                  >
                    🌅 그윽하고 차분한 목소리
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>영상 앨범 제목:</label>
                <input
                  type="text"
                  placeholder="예: 나의 마음 힐링 영상"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="senior-input"
                />

                <div className="example-buttons-group">
                  <span className="example-label">👉 터치하여 추천 제목 바로 넣기:</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewTitle('그리운 고향 마을 힐링 영상');
                    }}
                    className="example-touch-btn"
                  >
                    🌸 예시 1: "그리운 고향 마을 힐링 영상"
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewTitle('우리 가족의 따뜻한 추억 영상 앨범');
                    }}
                    className="example-touch-btn"
                  >
                    ❤️ 예시 2: "우리 가족의 따뜻한 추억 영상 앨범"
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>간단한 설명:</label>
                <input
                  type="text"
                  placeholder="예: 가족과 함께 보는 따뜻한 추억 영상"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="senior-input"
                />
              </div>

              <div className="form-group">
                <label>영상과 함께 읽어줄 해설 이야기:</label>
                <textarea
                  rows={3}
                  placeholder="영상과 함께 들려줄 해설을 적어보세요..."
                  value={newNarration}
                  onChange={(e) => setNewNarration(e.target.value)}
                  required
                  className="senior-textarea"
                />

                <div className="example-buttons-group">
                  <span className="example-label">👉 터치하여 추천 해설 이야기 바로 넣기:</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewNarration('맑은 시냇물 소리와 싱그러운 새소리를 들으며 마음의 평화와 건강을 빕니다.');
                    }}
                    className="example-touch-btn"
                  >
                    🌊 예시 1: "맑은 시냇물 소리와 새소리를 들으며 마음의 평화를 찾습니다."
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playFlip();
                      setNewNarration('사랑하는 우리 가족들과 함께 웃었던 정다운 시간들이 마음에 따스하게 남아있습니다.');
                    }}
                    className="example-touch-btn"
                  >
                    ❤️ 예시 2: "사랑하는 가족들과 함께 웃었던 순간을 영원히 기억합니다."
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
                <button type="submit" className="senior-btn create-video-btn">
                  <Heart size={24} />
                  <span>추억 영상 완성하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .video-gallery-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .video-gallery-header {
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
          background-color: #F3E8FF;
          border: 2px solid #D8B4FE;
          border-radius: 20px;
          padding: 6px 20px;
          font-size: 18px;
          font-weight: 700;
          color: #7E22CE;
        }

        .video-gallery-title {
          font-size: 32px;
          font-weight: 900;
          color: #0F172A;
        }

        .video-gallery-sub {
          font-size: 22px;
          font-weight: 700;
          color: #475569;
        }

        .create-buttons-row {
          display: flex;
          gap: 14px;
          margin-top: 8px;
        }

        .create-video-btn {
          min-width: 260px;
          background-color: #9333EA;
          color: #FFFFFF;
          border: 3px solid #7E22CE;
          box-shadow: 0 5px 0 #6B21A8;
          border-radius: 18px;
          padding: 14px 22px;
          font-size: 20px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          width: 100%;
        }

        .video-card {
          background-color: #FFFFFF;
          border: 3px solid #9333EA;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          gap: 16px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(147, 51, 234, 0.12);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(147, 51, 234, 0.2);
        }

        .video-cover-icon {
          font-size: 54px;
          background-color: #FAF5FF;
          border: 2px solid #E9D5FF;
          border-radius: 20px;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .video-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .video-tag {
          font-size: 14px;
          font-weight: 800;
          color: #7E22CE;
          background-color: #F3E8FF;
          padding: 2px 10px;
          border-radius: 10px;
          align-self: flex-start;
        }

        .video-title {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1.3;
        }

        .video-desc {
          font-size: 16px;
          font-weight: 600;
          color: #64748B;
          line-height: 1.4;
        }

        .video-voice-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          color: #7E22CE;
          background-color: #FAF5FF;
          border: 1px solid #D8B4FE;
          padding: 3px 8px;
          border-radius: 8px;
          align-self: flex-start;
          margin-top: 2px;
        }

        .video-action-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 800;
          color: #9333EA;
          margin-top: 6px;
        }

        .video-player-card {
          width: 100%;
          background-color: #FFFFFF;
          border: 4px solid #9333EA;
          border-radius: 28px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 12px 30px rgba(147, 51, 234, 0.15);
        }

        .video-back-btn {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
        }

        .video-player-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .video-meta {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .video-category-tag {
          background-color: #F3E8FF;
          color: #7E22CE;
          font-size: 16px;
          font-weight: 800;
          padding: 4px 14px;
          border-radius: 12px;
        }

        .video-watch-title {
          font-size: 30px;
          font-weight: 900;
          color: #0F172A;
        }

        .video-watch-desc {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
        }

        .video-frame-box {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 20px;
          border: 3px solid #E2E8F0;
          background-color: #000;
        }

        .video-frame-box iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .narration-box {
          background-color: #FAF5FF;
          border: 3px solid #E9D5FF;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .narration-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 800;
          color: #7E22CE;
        }

        .narration-text {
          font-size: 24px;
          font-weight: 800;
          color: #1E293B;
          line-height: 1.6;
          max-width: 800px;
        }

        .voice-persona-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .voice-selector-label {
          font-size: 16px;
          font-weight: 700;
          color: #6B21A8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .voice-btn-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .voice-choice-btn {
          background-color: #FFFFFF;
          border: 2px solid #D8B4FE;
          border-radius: 14px;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 700;
          color: #6B21A8;
          cursor: pointer;
          transition: all 0.2s;
        }

        .voice-choice-btn.active {
          background-color: #7E22CE;
          color: #FFFFFF;
          border-color: #581C87;
          box-shadow: 0 4px 10px rgba(126, 34, 206, 0.25);
        }

        .tts-btn {
          background-color: #FFFFFF;
          border: 3px solid #C084FC;
          color: #7E22CE;
          font-size: 20px;
          font-weight: 800;
          padding: 14px 28px;
          border-radius: 20px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .tts-btn.speaking {
          background-color: #C2410C;
          border-color: #9A3412;
          color: #FFFFFF;
        }

        .video-actions-bottom {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        .complete-watch-btn {
          min-width: 280px;
          background-color: #9333EA;
          color: #FFFFFF;
          border: 3px solid #7E22CE;
          box-shadow: 0 5px 0 #6B21A8;
        }

        .video-sample-select {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sample-vid-btn {
          text-align: left;
          background-color: #FAF5FF;
          border: 2px solid #D8B4FE;
          border-radius: 14px;
          padding: 12px 18px;
          font-size: 17px;
          font-weight: 800;
          color: #581C87;
          cursor: pointer;
        }

        .sample-vid-btn.active {
          background-color: #7E22CE;
          color: #FFFFFF;
          border-color: #6B21A8;
        }
      `}</style>
    </div>
  );
};
