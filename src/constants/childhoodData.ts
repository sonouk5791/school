export interface ChildhoodQuizItem {
  id: string;
  category: '골목놀이' | '추억의물건' | '옛날학교' | '고향사계절';
  title: string;
  question: string;
  soundHint: string;
  illustrationType: string;
  photoUrl: string; // 실제 옛 정취를 담은 고화질 사진
  photoCaption: string;
  options: {
    id: string;
    text: string;
    emoji: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  reminiscenceTalk: string; // 어르신과 나눌 회상 대화 질문
}

export interface ReminiscenceTopic {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
  promptQuestion: string;
  options: {
    label: string;
    emoji: string;
    description: string;
  }[];
}

export interface ChildhoodSong {
  id: string;
  title: string;
  composer: string;
  lyrics: string[];
  theme: string;
  photoUrl: string; // 아름다운 고화질 한국 풍경 사진
  photoCaption: string;
  galleryPhotos: {
    url: string;
    caption: string;
  }[];
}

// ── 1. 어린 시절 추억 회상 퀴즈 16선 ──────────────────────────────
export const CHILDHOOD_QUIZZES: ChildhoodQuizItem[] = [
  // [골목놀이]
  {
    id: 'quiz-play-1',
    category: '골목놀이',
    title: '동무들과 땅바닥에 쪼그려 앉아 하던 놀이',
    question: '땅바닥에 둥근 원을 그리고, 유리알을 손가락 끝으로 튕겨서 상대방 것을 맞히거나 원 밖으로 쳐내던 이 놀이는 무엇일까요?',
    soundHint: '✨ "딱! 딱! 유리알 부딪히는 맑은 소리"',
    illustrationType: 'marbles', // 구슬치기
    photoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '흙마당 골목길에서 옹기종기 모여 놀던 유리구슬',
    options: [
      { id: 'opt-1', text: '구슬치기', emoji: '🔮', isCorrect: true },
      { id: 'opt-2', text: '연날리기', emoji: '🪁', isCorrect: false },
      { id: 'opt-3', text: '그네타기', emoji: '🎠', isCorrect: false },
      { id: 'opt-4', text: '숨바꼭질', emoji: '🙈', isCorrect: false },
    ],
    explanation: '정답입니다! 알록달록 무지개 유리구슬을 주머니 가득 넣고 다니며 흙바닥에서 구슬치기를 하던 추억이 떠오릅니다.',
    reminiscenceTalk: '어르신께서는 어릴 때 구슬치기나 사방치기 놀이에서 구슬을 많이 따보신 기억이 있으신가요?',
  },
  {
    id: 'quiz-play-2',
    category: '골목놀이',
    title: '여자 동무들이 노래 부르며 넘던 놀이',
    question: '"꼬마야 꼬마야 뒤를 돌아라~" 노래에 맞춰 양쪽에서 잡고 있는 검은 줄을 발로 걸치며 높이높이 뛰던 놀이는?',
    soundHint: '🎵 "꼬마야 꼬마야 만세를 불러라~ 노랫소리"',
    illustrationType: 'rubber-jump', // 고무줄놀이
    photoUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '해 질 녘 골목길에 울려 퍼지던 고무줄 노래',
    options: [
      { id: 'opt-1', text: '고무줄놀이', emoji: '➰', isCorrect: true },
      { id: 'opt-2', text: '널뛰기', emoji: '⚖️', isCorrect: false },
      { id: 'opt-3', text: '제기차기', emoji: '👟', isCorrect: false },
      { id: 'opt-4', text: '공기놀이', emoji: '⚪', isCorrect: false },
    ],
    explanation: '정답입니다! 까만 고무줄 하나만 있으면 발목부터 무릎, 허리, 머리 위 만세 높이까지 훌쩍 뛰어넘으며 놀았습니다.',
    reminiscenceTalk: '골목에서 고무줄놀이 할 때 장난꾸러기 남자아이들이 고무줄을 가위로 끊고 달아나던 일 기억나시나요?',
  },
  {
    id: 'quiz-play-3',
    category: '골목놀이',
    title: '두꺼운 종이를 접어 넘겨먹던 놀이',
    question: '달력이나 헌 공책 종이를 네모나게 꽁꽁 접어서, 바닥에 놓인 상대방 것을 힘껏 내리쳐 뒤집으면 따먹던 놀이는?',
    soundHint: '💥 "팡! 바람을 가르며 바닥을 치는 소리"',
    illustrationType: 'ddakji', // 딱지치기
    photoUrl: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '달력 종이로 꽁꽁 접어 만든 알록달록 종이딱지',
    options: [
      { id: 'opt-1', text: '딱지치기', emoji: '📦', isCorrect: true },
      { id: 'opt-2', text: '비석치기', emoji: '🗿', isCorrect: false },
      { id: 'opt-3', text: '팽이치기', emoji: '🌀', isCorrect: false },
      { id: 'opt-4', text: '자치기', emoji: '🥢', isCorrect: false },
    ],
    explanation: '정답입니다! 두꺼운 달력 종이로 만든 왕딱지를 들고 나오면 온 동네 아이들이 부러워하곤 했습니다.',
    reminiscenceTalk: '딱지가 잘 안 뒤집히게 하려고 발로 꼭꼭 밟거나 침을 바르기도 했던 추억이 있으신가요?',
  },
  {
    id: 'quiz-play-4',
    category: '골목놀이',
    title: '겨울철 얼음판 위에서 돌리던 놀이',
    question: '나무를 깎아 쇠구슬을 박아 만든 이것을, 짚풀이나 끈이 달린 채찍으로 탁탁 치며 얼음 위에서 오래 돌리던 놀이는?',
    soundHint: '❄️ "탁! 탁! 쌩쌩~ 얼음 위를 맴도는 소리"',
    illustrationType: 'spinning-top', // 팽이치기
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '꽁꽁 언 논바닥 얼음판에서 쌩쌩 돌리던 나무 팽이',
    options: [
      { id: 'opt-1', text: '팽이치기', emoji: '🌀', isCorrect: true },
      { id: 'opt-2', text: '썰매타기', emoji: '🎿', isCorrect: false },
      { id: 'opt-3', text: '쥐불놀이', emoji: '🔥', isCorrect: false },
      { id: 'opt-4', text: '눈싸움', emoji: '⛄', isCorrect: false },
    ],
    explanation: '정답입니다! 겨울 방학이면 얼어붙은 냇가나 논바닥에서 손이 꽁꽁 얼어도 시간 가는 줄 모르고 팽이를 쳤습니다.',
    reminiscenceTalk: '외발 썰매를 타고 쇠꼬챙이를 양손에 쥐고 얼음판을 씽씽 달리던 기억이 나시나요?',
  },

  // [추억의 물건 & 간식]
  {
    id: 'quiz-item-1',
    category: '추억의물건',
    title: '연탄불 위 국자에 설탕을 녹여 먹던 달콤한 간식',
    question: '국자에 설탕을 넣고 연탄불에 살살 녹이다가 소다를 콕 찍어 넣으면 부풀어 오르던, 별이나 하트 모양을 떼어내던 간식은?',
    soundHint: '🍯 "보글보글 부풀어 오르는 달콤한 설탕 냄새"',
    illustrationType: 'dalgona', // 달고나
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '연탄불 국자 위에 솔솔 피어나던 달콤한 뽑기',
    options: [
      { id: 'opt-1', text: '달고나 (뽑기)', emoji: '⭐', isCorrect: true },
      { id: 'opt-2', text: '솜사탕', emoji: '☁️', isCorrect: false },
      { id: 'opt-3', text: '국화빵', emoji: '🥞', isCorrect: false },
      { id: 'opt-4', text: '엿가락', emoji: '🍬', isCorrect: false },
    ],
    explanation: '정답입니다! 바늘이나 핀에 침을 묻혀가며 모양대로 깨지지 않게 떼어내면 주인아주머니가 하나 더 주시던 뽑기입니다.',
    reminiscenceTalk: '국자를 태워 먹어서 어머니께 혼났던 정겨운 기억이 있으신가요?',
  },
  {
    id: 'quiz-item-2',
    category: '추억의물건',
    title: '여름날 골목길에 울려 퍼지던 시원한 외침',
    question: '네모난 나무통을 어깨에 메거나 자전거 뒤에싣고 다니며, "아이스○○~ 얼음과자!" 하고 외치던 옛날 여름 빙과는?',
    soundHint: '🔔 "땡그랑 땡그랑~ 아이스○○ 사세요!"',
    illustrationType: 'ice-candy', // 아이스케키
    photoUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '무더운 여름날 최고의 꿀맛이었던 얼음과자',
    options: [
      { id: 'opt-1', text: '아이스케키', emoji: '🍦', isCorrect: true },
      { id: 'opt-2', text: '팥빙수', emoji: '🍧', isCorrect: false },
      { id: 'opt-3', text: '미숫가루', emoji: '🥤', isCorrect: false },
      { id: 'opt-4', text: '수박화채', emoji: '🍉', isCorrect: false },
    ],
    explanation: '정답입니다! 사카린과 색소를 넣어 달콤하고 시원했던 아이스케키를 입에 물면 입술이 빨갛게 물들곤 했습니다.',
    reminiscenceTalk: '어릴 적 더운 여름날 우물물에 담가두었던 시원한 수박이나 얼음과자 드셨던 기억이 나시나요?',
  },
  {
    id: 'quiz-item-3',
    category: '추억의물건',
    title: '두 손으로 방망이를 두드리며 옷을 다듬던 도구',
    question: '반듯한 돌 위에 풀 먹인 이불 호청이나 옷감을 올려놓고, 두 개의 나무 방망이로 경쾌하게 박자를 맞추어 두드리던 도구는?',
    soundHint: '🥁 "딱콩 딱콩 따닥딱콩~ 정겨운 방망이 장단 소리"',
    illustrationType: 'ironing-stone', // 다듬이돌
    photoUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '달빛 아래 어머니들이 마주 앉아 두드리던 다듬이돌',
    options: [
      { id: 'opt-1', text: '다듬이돌과 방망이', emoji: '🥢', isCorrect: true },
      { id: 'opt-2', text: '절구와 공이', emoji: '🥣', isCorrect: false },
      { id: 'opt-3', text: '맷돌', emoji: '🗿', isCorrect: false },
      { id: 'opt-4', text: '물레', emoji: '🧵', isCorrect: false },
    ],
    explanation: '정답입니다! 어머니와 올케언니가 마주 앉아 다듬이 방망이로 박자를 맞추어 두드리면 구김살이 쫙 펴지고 윤기가 났습니다.',
    reminiscenceTalk: '밤에 들려오던 다듬이 소리를 자장가 삼아 잠들었던 기억이 나시나요?',
  },
  {
    id: 'quiz-item-4',
    category: '추억의물건',
    title: '골목길 장날마다 귀를 막게 하던 소리',
    question: '"뻥이요~!" 큰 외침 뒤에 콰광 하는 연기와 함께 쌀과 옥수수가 하얗고 고소한 과자로 변신하던 기계는?',
    soundHint: '💥 "콰앙~! 하얀 연기와 함께 퍼지던 고소한 냄새"',
    illustrationType: 'popped-rice', // 뻥튀기
    photoUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '장날 깡통을 줄 세워놓고 기다리던 뻥튀기 기계',
    options: [
      { id: 'opt-1', text: '뻥튀기 기계', emoji: '🍿', isCorrect: true },
      { id: 'opt-2', text: '방앗간 분쇄기', emoji: '⚙️', isCorrect: false },
      { id: 'opt-3', text: '가래떡 뽑는 기계', emoji: '🍡', isCorrect: false },
      { id: 'opt-4', text: '탈곡기', emoji: '🌾', isCorrect: false },
    ],
    explanation: '정답입니다! 쇠 깡통에 쌀이나 마른 옥수수를 담아 줄을 서서, 귀를 꽉 막고 튀밥이 한 자루 쏟아져 나오는 걸 지켜봤습니다.',
    reminiscenceTalk: '따끈따끈한 뻥튀기를 두 손 가득 쥐고 동무들과 나누어 먹던 맛 기억나시나요?',
  },

  // [옛날 학교 풍경]
  {
    id: 'quiz-school-1',
    category: '옛날학교',
    title: '겨울철 교실 한가운데 놓여있던 온기',
    question: '국민학교 교실 한가운데에서 조개탄이나 장작을 때고, 그 위에 학생들의 노란 양은 도시락을 층층이 쌓아 데우던 것은?',
    soundHint: '🔥 "타닥타닥 장작 타는 소리와 구수한 누룽지 밥 냄새"',
    illustrationType: 'classroom-stove', // 조개탄 난로
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '교실 난로 위에 층층이 올려둔 노란 양은 도시락',
    options: [
      { id: 'opt-1', text: '교실 조개탄 난로', emoji: '🔥', isCorrect: true },
      { id: 'opt-2', text: '온돌방 아궁이', emoji: '🏠', isCorrect: false },
      { id: 'opt-3', text: '석유 곤로', emoji: '🛢️', isCorrect: false },
      { id: 'opt-4', text: '보온 밥솥', emoji: '🍚', isCorrect: false },
    ],
    explanation: '정답입니다! 맨 아래 도시락 밥은 노릇노릇 누룽지가 되고, 4교시가 되면 볶은 김치 냄새가 교실 가득 퍼져 군침이 돌았습니다.',
    reminiscenceTalk: '도시락 밑에 깔린 계란 프라이를 친구들 몰래 밥 속에 숨겨왔던 일 있으셨나요?',
  },
  {
    id: 'quiz-school-2',
    category: '옛날학교',
    title: '음악 시간에 선생님이 발로 밟으며 연주하던 악기',
    question: '발판을 양발로 번갈아 밟아 바람을 넣고 건반을 누르면 삐익~ 맑고 구성진 소리가 나던 교실 앞 큰 악기는?',
    soundHint: '🎹 "도레미파솔라시도~ 발을 구르며 내던 건반 소리"',
    illustrationType: 'reed-organ', // 오르간
    photoUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '선생님의 오르간 반주에 맞춰 목청껏 노래 부르던 교실',
    options: [
      { id: 'opt-1', text: '오르간', emoji: '🎹', isCorrect: true },
      { id: 'opt-2', text: '피아노', emoji: '🎼', isCorrect: false },
      { id: 'opt-3', text: '하모니카', emoji: '🎵', isCorrect: false },
      { id: 'opt-4', text: '아코디언', emoji: '🎺', isCorrect: false },
    ],
    explanation: '정답입니다! 선생님께서 오르간을 쳐주시면 다 함께 고향의 봄이나 학교종이 땡땡땡을 큰 소리로 합창했습니다.',
    reminiscenceTalk: '학창 시절 음악 시간에 좋아하셨던 동요나 가곡이 있으신가요?',
  },
  {
    id: 'quiz-school-3',
    category: '옛날학교',
    title: '가을 운동회의 꽃, 온 동네가 응원하던 경기',
    question: '청군 백군 머리띠를 두르고, 높이 매달린 큰 바구니를 향해 모래주머니(오자미)를 힘껏 던져 터뜨리던 운동회 경기는?',
    soundHint: '🎊 "청군 이겨라! 백군 이겨라! 짝짝짝~"',
    illustrationType: 'sports-day', // 박 터뜨리기
    photoUrl: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '만국기 아래 콩주머니를 던져 박을 터뜨리던 가을 운동회',
    options: [
      { id: 'opt-1', text: '박 터뜨리기', emoji: '🎊', isCorrect: true },
      { id: 'opt-2', text: '줄다리기', emoji: '🎗️', isCorrect: false },
      { id: 'opt-3', text: '계주 달리기', emoji: '🏃', isCorrect: false },
      { id: 'opt-4', text: '차전놀이', emoji: '🛡️', isCorrect: false },
    ],
    explanation: '정답입니다! 콩주머니를 던져 박이 쩍 갈라지며 "축 우승" 현수막과 오색 꽃가루가 쏟아지면 온 운동장이 함성으로 가득 찼습니다.',
    reminiscenceTalk: '운동회 날 점심시간에 온 가족이 둘러앉아 삶은 밤과 사이다, 김밥을 드시던 기억이 나시나요?',
  },

  // [고향의 사계절 일상]
  {
    id: 'quiz-season-1',
    category: '고향사계절',
    title: '여름철 시원한 냇가에서 동무들과 하던 일',
    question: '더운 여름날 바지를 둥둥 걷어붙이고 맑은 시냇물에 뛰어들어 헤엄치고 물장구치던 일을 일컫는 순우리말은?',
    soundHint: '🌊 "첨벙첨벙~ 시원한 물소리와 까르르 웃음소리"',
    illustrationType: 'river-play', // 멱감기
    photoUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '버드나무 그늘 아래 맑은 개울물에서 멱감던 여름날',
    options: [
      { id: 'opt-1', text: '멱감기 (물놀이)', emoji: '🏊', isCorrect: true },
      { id: 'opt-2', text: '다슬기 줍기', emoji: '🐚', isCorrect: false },
      { id: 'opt-3', text: '빨래하기', emoji: '🧺', isCorrect: false },
      { id: 'opt-4', text: '낚시하기', emoji: '🎣', isCorrect: false },
    ],
    explanation: '정답입니다! 입술이 파래지도록 냇가에서 멱을 감고, 큰 바위에 누워 등을 지지며 따뜻한 햇볕을 쬐곤 했습니다.',
    reminiscenceTalk: '어릴 때 냇가에서 피라미나 가재, 다슬기를 잡아보신 적이 있으신가요?',
  },
  {
    id: 'quiz-season-2',
    category: '고향사계절',
    title: '정월 대보름 밤하늘을 붉게 수놓던 불놀이',
    question: '구멍을 뚫은 깡통에 솔방울과 숯을 넣고 불을 붙여, 줄을 잡고 빙빙 돌리다가 논두렁에 던지며 풍년을 기원하던 놀이는?',
    soundHint: '🔥 "빙글빙글 윙윙~ 붉은 불꽃 궤적"',
    illustrationType: 'fire-can', // 쥐불놀이
    photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '대보름 밤하늘을 붉게 수놓던 불꽃 쥐불놀이',
    options: [
      { id: 'opt-1', text: '쥐불놀이', emoji: '🔥', isCorrect: true },
      { id: 'opt-2', text: '달집태우기', emoji: '🌾', isCorrect: false },
      { id: 'opt-3', text: '불꽃놀이', emoji: '🎆', isCorrect: false },
      { id: 'opt-4', text: '풍등날리기', emoji: '🏮', isCorrect: false },
    ],
    explanation: '정답입니다! 논두렁 밭두렁에 불을 놓아 해충을 태우고, 보름달을 보며 한 해의 건강과 소원을 빌었습니다.',
    reminiscenceTalk: '대보름날 아침에 부럼으로 호두나 땅콩을 깨물고 귀밝이술 한 모금 마시던 일 기억나시나요?',
  },
];

// ── 2. 나만의 어린 시절 추억 엽서 만들기 주제들 ──────────────────
export const REMINISCENCE_TOPICS: ReminiscenceTopic[] = [
  {
    id: 'topic-game',
    title: '내가 가장 좋아했던 골목 놀이',
    emoji: '🪁',
    subtitle: '동무들과 해 질 때까지 흙먼지 날리며 하던 놀이를 골라보세요.',
    promptQuestion: '어르신께서 어린 시절 가장 신나게 하셨던 놀이는 무엇인가요?',
    options: [
      { label: '구슬치기 & 딱지치기', emoji: '🔮', description: '주머니 가득 구슬을 따서 집으로 돌아올 때의 뿌듯함!' },
      { label: '고무줄놀이 & 공기놀이', emoji: '➰', description: '골목 가득 노래 부르며 높이높이 뛰놀던 유쾌한 시간' },
      { label: '숨바꼭질 & 술래잡기', emoji: '🙈', description: '"꼭꼭 숨어라 머리카락 보일라~" 장독대 뒤에 숨던 추억' },
      { label: '썰매타기 & 팽이치기', emoji: '🎿', description: '겨울 얼음판에서 손이 꽁꽁 얼어도 달리던 씩씩한 놀이' },
    ],
  },
  {
    id: 'topic-snack',
    title: '그 시절 가장 맛있었던 군것질과 간식',
    emoji: '🍠',
    subtitle: '입안 가득 달콤하고 구수했던 그 맛을 떠올려보세요.',
    promptQuestion: '어릴 때 어머니가 만들어 주셨거나 사 먹었던 가장 그리운 맛은?',
    options: [
      { label: '달고나 & 뽑기', emoji: '⭐', description: '연탄불 국자에 설탕을 녹여 바늘로 조심조심 떼어내던 달콤함' },
      { label: '군고구마 & 동치미', emoji: '🍠', description: '추운 겨울 아랫목에서 살얼음 둥둥 뜬 동치미와 먹던 맛' },
      { label: '누룽지 & 숭늉', emoji: '🍚', description: '가마솥 바닥에서 바삭하게 긁어낸 구수한 우리 집 간식' },
      { label: '시원한 아이스케키', emoji: '🍦', description: '여름날 골목길 땡그랑 종소리에 뛰어나가 먹던 얼음과자' },
    ],
  },
  {
    id: 'topic-school',
    title: '국민학교 시절 그리운 풍경',
    emoji: '🏫',
    subtitle: '나무 책걸상과 정겨운 선생님, 동무들의 얼굴을 회상해보세요.',
    promptQuestion: '학교 다니던 시절 가장 기억에 남는 정겨운 순간은 언제인가요?',
    options: [
      { label: '조개탄 난로 위 양은 도시락', emoji: '🍱', description: '김치 냄새 솔솔 풍기며 바닥이 노릇하게 눌어붙던 꿀맛 도시락' },
      { label: '만국기 펄럭이던 가을 운동회', emoji: '🎊', description: '온 동네 어른들이 모여 박 터뜨리고 김밥을 나누어 먹던 날' },
      { label: '오르간 소리와 음악 시간 합창', emoji: '🎹', description: '선생님 반주에 맞추어 목청 높여 고향의 봄을 부르던 교실' },
      { label: '동무들과 손잡고 걷던 하굣길', emoji: '🎒', description: '논둑길을 따라 풀피리를 불며 집으로 걸어오던 노을 풍경' },
    ],
  },
  {
    id: 'topic-home',
    title: '그리운 고향 집과 따뜻한 가족',
    emoji: '🏡',
    subtitle: '연기 피어오르던 초가지붕과 어머니의 따스한 품을 떠올려보세요.',
    promptQuestion: '어르신의 기억 속에 가장 따뜻하게 남아있는 집의 모습은?',
    options: [
      { label: '아궁이에 장작 때던 따뜻한 온돌방', emoji: '🔥', description: '이불 속에 발을 쏙 넣고 도란도란 이야기 나누던 겨울밤' },
      { label: '마당 평상에서 먹던 수박과 밤하늘 별', emoji: '🍉', description: '멍석을 깔고 모깃불을 피우며 은하수를 올려다보던 여름' },
      { label: '장독대와 어머니의 정성 어린 밥상', emoji: '🍲', description: '된장찌개 보글보글 끓여내던 어머니의 구수한 손맛' },
      { label: '마을 어귀 큰 느티나무 그늘', emoji: '🌳', description: '동네 어르신들이 장기 두시며 쉬어가던 쉼터' },
    ],
  },
];

// ── 3. 함께 부르는 그 시절 대표 동요 4선 (풍성한 고화질 사진첩 포함) ────────────────
export const CHILDHOOD_SONGS: ChildhoodSong[] = [
  {
    id: 'song-1',
    title: '고향의 봄',
    composer: '이원수 작사 / 홍난파 작곡',
    theme: '봄날의 꽃 대궐 차린 고향 산골',
    photoUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '🌸 진달래와 복숭아꽃이 활짝 핀 정겨운 고향 마을 풍경',
    lyrics: [
      '나의 살던 고향은 꽃피는 산골',
      '복숭아꽃 살구꽃 아기 진달래',
      '울긋불긋 꽃 대궐 차린 동네',
      '그 속에서 놀던 때가 그립습니다.',
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1000&auto=format&fit=crop&q=80',
        caption: '울긋불긋 봄꽃이 만발한 고향 산골 마을',
      },
      {
        url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1000&auto=format&fit=crop&q=80',
        caption: '봄날 화사하게 피어난 복숭아꽃과 살구꽃',
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
        caption: '푸른 산자락과 꽃 대궐 차린 고향 동네',
      },
    ],
  },
  {
    id: 'song-2',
    title: '과수원길',
    composer: '박화목 작사 / 김공선 작곡',
    theme: '아카시아 꽃 향기 가득한 시골길',
    photoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '🌿 하얀 아카시아꽃이 눈송이처럼 날리던 시골 오솔길',
    lyrics: [
      '동구 밖 과수원길 아카시아 꽃이 활짝 폈네',
      '하얀 꽃 이파리 눈송이처럼 날리네',
      '향긋한 꽃냄새가 실바람 타고 솔솔',
      '둘이서 말이 없이 웃으며 걸었네.',
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
        caption: '싱그러운 풀잎 향기 가득한 시골길 풍경',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
        caption: '푸른 산자락과 굽이굽이 이어진 정겨운 논둑길',
      },
    ],
  },
  {
    id: 'song-3',
    title: '섬집 아기',
    composer: '한인현 작사 / 이흥렬 작곡',
    theme: '어머니의 사랑과 바닷가 파도소리',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '🌊 은빛 파도가 잔잔히 밀려오는 평화로운 섬마을 바다',
    lyrics: [
      '엄마가 섬그늘에 굴 따러 가면',
      '아기는 혼자 남아 집을 보다가',
      '바다가 불러주는 자장노래에',
      '팔 베고 스르르르 잠이 듭니다.',
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
        caption: '푸른 물결과 은빛 모래사장이 펼쳐진 섬마을',
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1000&auto=format&fit=crop&q=80',
        caption: '소나무 솔바람과 파도 소리가 어우러진 해변',
      },
    ],
  },
  {
    id: 'song-4',
    title: '오빠 생각',
    composer: '최순애 작사 / 박태준 작곡',
    theme: '서울 간 오빠를 기다리던 마음',
    photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&auto=format&fit=crop&q=80',
    photoCaption: '🌾 황금빛 벼가 물결치는 가을 들판과 고향 풍경',
    lyrics: [
      '뜸북 뜸북 뜸북새 논에서 울고',
      '뻐꾹 뻐꾹 뻐꾹새 숲에서 울 때',
      '우리 오빠 말 타고 서울 가시면',
      '비단 구두 사가지고 오신다더니.',
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&auto=format&fit=crop&q=80',
        caption: '황금빛 벼가 익어가는 풍요로운 가을 들판',
      },
      {
        url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1000&auto=format&fit=crop&q=80',
        caption: '따스한 가을 햇살이 내리쬐는 정겨운 시골길',
      },
    ],
  },
];
