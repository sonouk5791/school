export interface SentenceChoiceQuiz {
  id: string;
  question: string; // Situation prompt
  category: string;
  option1: {
    text: string;
    emoji: string;
    isCorrect: boolean;
  };
  option2: {
    text: string;
    emoji: string;
    isCorrect: boolean;
  };
  explanation: string;
}

export const SENTENCE_CHOICE_QUIZZES: SentenceChoiceQuiz[] = [
  {
    id: 'sc-1',
    question: '따스한 봄날 고향 마을 산책에 어울리는 예시 문장을 터치펜으로 선택해보세요.',
    category: '봄날의 추억',
    option1: {
      text: '따스한 봄 햇살 아래, 돌담 밑에 피어난 노란 민들레를 보며 웃음 짓습니다.',
      emoji: '🌸',
      isCorrect: true,
    },
    option2: {
      text: '찬 바람이 쌩쌩 부는 겨울 눈길을 두꺼운 코트를 입고 소담스레 걷습니다.',
      emoji: '❄️',
      isCorrect: false,
    },
    explanation: '봄날의 따스함과 민들레 꽃이 담긴 예시 문장을 참 잘 고르셨습니다.',
  },
  {
    id: 'sc-2',
    question: '가족과 함께 소풍을 갔을 때의 상황에 알맞은 예시 문장을 터치펜으로 선택해보세요.',
    category: '가족 소풍',
    option1: {
      text: '소리를 지르며 밤늦게 혼자 깜깜한 방에서 텔레비전을 봅니다.',
      emoji: '📺',
      isCorrect: false,
    },
    option2: {
      text: '푸른 잔디밭 위에 돗자리를 펴고 온 가족이 정성껏 싸 온 김밥을 맛있게 먹습니다.',
      emoji: '🍱',
      isCorrect: true,
    },
    explanation: '온 가족이 돗자리에서 김밥을 나눠 먹는 정다운 문장을 잘 선택하셨습니다.',
  },
  {
    id: 'sc-3',
    question: '아침에 일어난 후 몸을 시원하게 정돈하는 알맞은 예시 문장을 터치펜으로 선택해보세요.',
    category: '건강한 하루',
    option1: {
      text: '기분 좋게 창문을 열어 맑은 공기를 마시고 따뜻한 물 한 잔으로 몸을 깨웁니다.',
      emoji: '🥛',
      isCorrect: true,
    },
    option2: {
      text: '하루 종일 불을 끄고 이불을 뒤집어쓴 채 아무 말도 하지 않고 누워 있습니다.',
      emoji: '🛌',
      isCorrect: false,
    },
    explanation: '창문을 열고 따뜻한 물로 아침을 시작하는 활기찬 예시 문장을 잘 선택하셨습니다.',
  },
  {
    id: 'sc-4',
    question: '이웃 주민과 반갑게 만났을 때 나누는 알맞은 예시 문장을 터치펜으로 선택해보세요.',
    category: '정다운 이웃',
    option1: {
      text: '얼굴을 찌푸리며 외면하고 모른 척 지나쳐 버립니다.',
      emoji: '😠',
      isCorrect: false,
    },
    option2: {
      text: '"오늘 날씨가 참 따뜻하고 좋습니다. 안녕하셨습니까?" 하고 밝게 인사를 전합니다.',
      emoji: '😊',
      isCorrect: true,
    },
    explanation: '이웃과 다정하게 온정의 인사를 전하는 고운 예시 문장을 잘 고르셨습니다.',
  },
];
