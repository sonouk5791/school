import type { StoryBookItem } from '../types/game';

export const INITIAL_STORYBOOKS: StoryBookItem[] = [
  {
    id: 'book-1',
    title: '고향 마을의 정다운 봄날',
    category: '고향 추억',
    coverEmoji: '🌸',
    description: '따스한 햇살이 비추던 고향 마을 골목길과 노란 민들레의 추억 이야기입니다.',
    pages: [
      {
        pageNumber: 1,
        text: '햇살이 따스하게 내리쬐던 봄날, 정겨운 고향 마을 골목길을 소담스럽게 걸어봅니다.',
        imageEmoji: '🏡',
      },
      {
        pageNumber: 2,
        text: '돌담 밑에 소박하게 피어난 노란 민들레 꽃이 반갑게 미소를 건넵니다.',
        imageEmoji: '🌼',
      },
      {
        pageNumber: 3,
        text: '이웃 삼촌, 숙모님들과 툇마루에 앉아 도란도란 정다운 찻잔을 기울입니다.',
        imageEmoji: '🍵',
      },
      {
        pageNumber: 4,
        text: '오늘 하루도 감사함과 따뜻함으로 마음에 훈훈한 기운이 가득 차오릅니다.',
        imageEmoji: '☀️',
      },
    ],
  },
  {
    id: 'book-2',
    title: '가족과 함께한 따뜻한 소풍',
    category: '가족 이야기',
    coverEmoji: '🧺',
    description: '온 가족이 정성껏 김밥을 싸서 파란 하늘 아래 즐겁게 웃던 날의 기억입니다.',
    pages: [
      {
        pageNumber: 1,
        text: '이른 아침부터 온 가족이 모여 정성스럽게 고소한 김밥을 차곡차곡 쌓아 올립니다.',
        imageEmoji: '🍱',
      },
      {
        pageNumber: 2,
        text: '높고 푸른 하늘 아래 돗자리를 펴고 둘러앉아 맛있는 음식을 함께 나눕니다.',
        imageEmoji: '🌳',
      },
      {
        pageNumber: 3,
        text: '아이들의 천진난만한 웃음소리가 잔디밭을 가득 채우며 행복이 꽃핍니다.',
        imageEmoji: '🎈',
      },
      {
        pageNumber: 4,
        text: '사랑하는 사람들과 함께한 소중한 이 순간이 마음에 영원히 기억됩니다.',
        imageEmoji: '❤️',
      },
    ],
  },
  {
    id: 'book-3',
    title: '장날의 설렘과 달콤한 엿장수',
    category: '옛 시절 추억',
    coverEmoji: '🎪',
    description: '어머니 손을 꼭 잡고 구경하던 왁자지껄 신명 나는 시골 5일 장터 이야기입니다.',
    pages: [
      {
        pageNumber: 1,
        text: '오일장이 서는 날이면, 이른 아침부터 동네 어귀가 북적북적 활기로 넘쳐납니다.',
        imageEmoji: '🛒',
      },
      {
        pageNumber: 2,
        text: '어머니 손을 잡고 걷다 보면, 찰칵찰칵 신명 나는 엿가위 소리가 귓가를 맴돕니다.',
        imageEmoji: '🍬',
      },
      {
        pageNumber: 3,
        text: '달콤한 호떡과 따끈한 국밥 한 그릇에 온 세상을 다 가진 듯 마음이 든든해집니다.',
        imageEmoji: '🍲',
      },
      {
        pageNumber: 4,
        text: '양손 가득 장바구니를 들고 돌아오던 노을 길, 그 시절의 정겨움이 아련하게 떠오릅니다.',
        imageEmoji: '🌅',
      },
    ],
  },
];
