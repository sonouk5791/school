import type { VoicePersona } from '../utils/ttsManager';

export interface VideoItem {
  id: string;
  title: string;
  category: string; // '전원일기 다시보기', '자연 힐링', '고향 풍경', '나만의 추억 영상'
  coverEmoji: string;
  description: string;
  videoUrl: string;
  narrationText: string;
  voicePersona: VoicePersona;
  voiceLabel: string;
}

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'video-jeonwon-1',
    title: '🌾 [전원일기 다시보기] 양촌리 김회장네와 정겨운 고향 이야기',
    category: '전원일기 다시보기',
    coverEmoji: '🌾',
    description: 'MBC 전설의 국민 드라마 전원일기! 김회장님 댁과 양촌리 이웃들의 따뜻하고 구수한 사람 사는 이야기 다시보기 영상입니다.',
    videoUrl: 'https://www.youtube.com/embed/KvxFPGpKbos',
    narrationText: '양촌리 김회장님 댁과 일용이네, 복길이네가 함께 울고 웃던 따뜻한 전원일기입니다. 정겨운 고향 이웃들과 어머니의 푸근한 정이 마음을 따스하게 감싸줍니다.',
    voicePersona: 'warm-mother',
    voiceLabel: '🌸 따뜻하고 다정한 고향 목소리',
  },
  {
    id: 'video-nature-1',
    title: '맑은 시냇물과 숲속 새소리 힐링 영상',
    category: '자연 힐링',
    coverEmoji: '🌊',
    description: '싱그러운 새소리와 맑은 물소리를 들으며 마음의 긴장을 풀고 편안한 안식을 누려보세요.',
    videoUrl: 'https://www.youtube.com/embed/2OEL4P1Rz04',
    narrationText: '푸른 숲속 사이로 싱그러운 햇살이 스며들고, 맑은 시냇물 소리에 마음의 모든 걱정과 근심이 깨끗이 씻겨 내려갑니다.',
    voicePersona: 'clear-nature',
    voiceLabel: '🌊 맑고 청아한 자연 목소리',
  },
  {
    id: 'video-spring-2',
    title: '따스한 봄날의 들꽃과 들판 풍경',
    category: '고향 풍경',
    coverEmoji: '🌸',
    description: '노란 민들레와 분홍 꽃잎이 흩날리는 정겨운 고향 들판의 봄 풍경 영상입니다.',
    videoUrl: 'https://www.youtube.com/embed/L_LUpnjgPso',
    narrationText: '따스한 봄바람이 솔솔 불어오고, 소담스레 피어난 예쁜 들꽃들이 사랑하는 우리를 반갑게 맞이해 줍니다.',
    voicePersona: 'warm-mother',
    voiceLabel: '🌸 따뜻하고 다정한 봄날 목소리',
  },
  {
    id: 'video-sunset-3',
    title: '노을 지는 저녁 고향 마을 풍경',
    category: '고향 풍경',
    coverEmoji: '🌅',
    description: '붉게 물드는 저녁노을과 굴뚝에서 피어오르는 밥 짓는 연기의 정겨운 풍경입니다.',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    narrationText: '서산 너머로 붉게 물드는 아름다운 저녁노을을 바라보며, 오늘 하루도 참 수고 많으셨습니다. 평온하고 따뜻한 밤 되세요.',
    voicePersona: 'calm-sunset',
    voiceLabel: '🌅 그윽하고 차분한 노을 목소리',
  },
];
