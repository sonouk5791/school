/**
 * 디지털 AI 학교 - 캐릭터별 프로그램 종합 라이브러리 데이터베이스
 * (Character Program Database & Library Manager)
 *
 * 4대 캐릭터 고유 역할:
 * 🐶 콩이 = 운동 (신체활동)
 * 🐰 토리 = 놀이 (인지놀이 & 레크리에이션)
 * 🐱 나비 = 학습·인지 (회상, 계산, 언어)
 * 🐻 보리 = 취미 (미술, 음악, 공예)
 */
((window) => {
  'use strict';

  const STORAGE_LIBRARY_KEY = 'digital_school_program_library_v2';

  // 기본 프로그램 데이터베이스 (캐릭터별 11개 이상, 도메인/난이도/계절/기념일 메타데이터 완비)
  const DEFAULT_LIBRARY = [
    // ═════════════════════════════════════════════════════════════════════════
    // 🐶 콩이 운동 프로그램 (11개)
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'KONGI_01',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '의자체조',
      domain: '신체운동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '의자에 바르게 앉아 척추와 어깨를 펴고 가볍게 팔다리를 움직이는 안전 체조',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_02',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '손가락·관절 운동',
      domain: '신체운동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '손가락 마디와 손목 관절을 부드럽게 쥐었다 펴며 뇌 신경을 자극하는 소근육 운동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_03',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '관절 운동',
      domain: '신체운동',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '팔꿈치, 무릎, 발목 등 주요 관절의 유연성을 기르고 굳은 몸을 풀어주는 관절 순환 운동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_04',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '어깨 운동',
      domain: '신체운동',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '어깨를 앞뒤로 천천히 원을 그리며 뭉친 승모근과 견갑골을 시원하게 풀어주는 상체 체조',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_05',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '목 스트레칭',
      domain: '신체운동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '목을 좌우로 천천히 갸우뚱하며 뇌 혈류 순환을 돕고 두통을 완화하는 부드러운 목 운동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_06',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '상체 스트레칭',
      domain: '신체운동',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '양팔을 머리 위로 쭉 뻗어 옆구리와 가슴을 시원하게 늘려주는 기지개 스트레칭',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_07',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '하체 근력 운동',
      domain: '신체운동',
      difficulty: '조금 어려움',
      season: '공통',
      holiday: null,
      desc: '의자에 앉아 한 발씩 무릎을 펴 올리고 허벅지에 힘을 주는 낙상 예방 하체 근력 운동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_08',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '박수 건강체조',
      domain: '신체운동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '합장 박수, 주먹 박수, 손끝 박수 등 다양한 박수로 손바닥 반사구를 자극하는 활력 체조',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_09',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '전신 의자체조',
      domain: '신체운동',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '팔과 다리를 번갈아 함께 움직여 전신 혈액 순환을 촉진하고 활기를 북돋우는 종합 체조',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_10',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '균형 운동',
      domain: '신체운동',
      difficulty: '조금 어려움',
      season: '공통',
      holiday: null,
      desc: '의자 등받이를 살짝 잡고 발뒤꿈치 들기와 무게중심 옮기기를 익히는 보행 균형 훈련',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_11',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '호흡 운동',
      domain: '신체운동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '코로 깊이 숨을 들이마시고 입으로 천천히 내쉬며 마음을 안정시키고 폐활량을 늘리는 단전호흡',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'KONGI_12',
      character: 'kongi',
      characterName: '콩이',
      role: '운동',
      title: '가벼운 건강체조',
      domain: '신체운동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '토요일 주말을 맞아 몸에 무리 없이 가볍고 상쾌하게 몸을 깨우는 주말 맞춤 체조',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },

    // ═════════════════════════════════════════════════════════════════════════
    // 🐱 나비 학습·인지 프로그램 (12개)
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'NABI_01',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '고향 사진 회상',
      domain: '회상',
      difficulty: '쉬움',
      season: '가을',
      holiday: '추석',
      desc: '옛 정겨운 고향 마을 풍경과 장독대, 초가집 사진을 보며 따뜻한 옛 추억을 나누는 시간',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_02',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '속담 맞히기',
      domain: '언어',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '친숙한 옛 속담의 빈칸 단어를 채워보며 장기 기억과 언어 연상 능력을 자극하는 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_03',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '숫자·계산 활동',
      domain: '계산',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '장보기 거스름돈 셈하기, 과일 개수 세기 등 일상생활에 유용한 쉬운 산수 계산 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_04',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '그림 기억하기',
      domain: '기억력',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '화면에 잠깐 나온 친근한 물건 3~4가지를 기억해두었다가 다시 맞혀보는 단기 기억력 훈련',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_05',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '단어 맞히기',
      domain: '언어',
      difficulty: '쉬움',
      season: '공통',
      holiday: '한글날',
      desc: '초성 힌트(ㄱ, ㄴ, ㄷ)를 보고 맛있는 과일이나 친근한 생활용품 단어를 연상해보는 언어 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_06',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '옛날 물건 맞히기',
      domain: '회상',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '맷돌, 다듬이, 호롱불, 짚신 등 옛 생활도구의 이름과 쓰임새를 회상해보는 인지 대화',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_07',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '어린 시절 회상 이야기',
      domain: '회상',
      difficulty: '쉬움',
      season: '봄',
      holiday: '어버이날',
      desc: '어릴 적 봄소풍 기억, 동네 골목놀이, 부모님과의 따뜻한 추억을 함께 나누는 정서 지지 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_08',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '계절 맞히기',
      domain: '기억력',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '꽃, 매미, 단풍, 눈사람 등 사계절 대표 풍경과 제철 과일을 보며 계절 감각을 일깨우는 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_09',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '날짜 알아보기 (지남력)',
      domain: '기억력',
      difficulty: '쉬움',
      season: '공통',
      holiday: '새해',
      desc: '오늘의 년·월·일과 요일, 현재 날씨를 확인하며 시간과 공간에 대한 지남력을 강화하는 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_10',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '음식 이름 맞히기',
      domain: '언어',
      difficulty: '쉬움',
      season: '공통',
      holiday: '설날',
      desc: '떡국, 송편, 부침개 등 명절 대표 음식과 구수한 전통 음식 재료를 알아맞히는 대화',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_11',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '시장 물건 맞히기',
      domain: '사회성 활동',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '오일장 전통시장의 생선가게, 청과물점 풍경을 둘러보며 장바구니에 담을 물건을 짝짓는 인지 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'NABI_12',
      character: 'nabi',
      characterName: '나비',
      role: '학습·인지',
      title: '이번 주 기억 회상',
      domain: '회상',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '토요일 주말에 한 주 동안 친구들과 함께했던 활동과 반가웠던 순간을 정리해보는 주간 회상',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },

    // ═════════════════════════════════════════════════════════════════════════
    // 🐰 토리 놀이 프로그램 (12개)
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'TORI_01',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '그림 맞추기',
      domain: '놀이',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '큰 조각으로 나뉜 친근한 전통 그림과 민화 조각의 짝을 찾아 완성하는 직관적 퍼즐 놀이',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_02',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '카드 뒤집기',
      domain: '기억력',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '뒤집혀 있는 카드 속 같은 꽃과 과일 그림을 2장씩 찾아내는 집중력 향상 카드 놀이',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_03',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '색깔 찾기',
      domain: '놀이',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '빨강, 노랑, 파랑 등 따뜻한 고유 색상 카드를 보고 같은 색의 물건을 짚어보는 감각 자극 놀이',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_04',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '물건 찾기',
      domain: '놀이',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '방 안이나 마당 그림 속에 숨겨져 있는 안경, 부채, 고무신을 찾아보는 관찰력 놀이',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_05',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '기억력 카드 놀이',
      domain: '기억력',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '4장의 카드를 기억하고 순서대로 눌러보며 성취감과 미소를 짓는 편안한 기억 놀이',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_06',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '같은 그림 찾기',
      domain: '놀이',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '서로 다른 여러 동물과 꽃 그림 중에서 모양이 똑같은 짝꿍 그림을 가리켜보는 시각 놀이',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_07',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '옛날 물건 퀴즈',
      domain: '회상',
      difficulty: '보통',
      season: '공통',
      holiday: '추석',
      desc: '키, 윷, 지게, 절구 등 옛 조상들의 지혜가 담긴 생활도구 퀴즈를 풀며 웃음 짓는 놀이',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_08',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '재미있는 OX 퀴즈',
      domain: '놀이',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '건강 상식, 계절 과일 이야기 등 부담 없는 질문에 O 또는 X 큰 버튼을 누르는 유쾌한 퀴즈',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_09',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '소리 맞히기',
      domain: '놀이',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '빗소리, 기차 소리, 풍경 소리, 새소리를 귀 기울여 듣고 어떤 소리인지 맞혀보는 청각 자극 놀이',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_10',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '박수 놀이',
      domain: '사회성 활동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '토리의 신나는 구호에 맞춰 하나 둘 셋 리듬 박수를 치며 함께 웃고 박자감을 익히는 놀이',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_11',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '간단한 레크리에이션',
      domain: '사회성 활동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '어르신 다 함께 손뼉을 치며 퀴즈와 칭찬을 나누는 주말 맞춤형 마음 열기 레크리에이션',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'TORI_12',
      character: 'tori',
      characterName: '토리',
      role: '놀이',
      title: '그림 찾기 놀이',
      domain: '놀이',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '화면 속에 숨어 있는 귀여운 친구들과 보물을 찾아내며 높은 몰입감을 선사하는 보물찾기',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },

    // ═════════════════════════════════════════════════════════════════════════
    // 🐻 보리 취미 프로그램 (12개)
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'BORI_01',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '색칠하기',
      domain: '미술',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '선이 굵고 큼직한 나비, 해바라기, 과일 도안을 손가락 터치로 알록달록 곱게 채우는 힐링 미술',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_02',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '음악 감상',
      domain: '음악',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '마음을 편안하게 가라앉혀주는 맑은 가야금 소리와 고요한 자연의 소리를 감상하는 명상 시간',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_03',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '옛 노래 듣기',
      domain: '음악',
      difficulty: '쉬움',
      season: '공통',
      holiday: '광복절',
      desc: '아리랑, 도라지 타령, 고향의 봄 등 청춘 시절 즐겨 부르던 그리운 가요와 민요를 함께 흥얼거리는 시간',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_04',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '종이 만들기 활동',
      domain: '만들기',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '종이접기 순서를 보며 딱지, 꽃, 종이배를 단계별로 접어보며 성취감을 느끼는 공예 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_05',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '그림 그리기',
      domain: '미술',
      difficulty: '보통',
      season: '공통',
      holiday: null,
      desc: '자유로운 캔버스 위에 크레파스 느낌으로 오늘 날씨와 기분을 선과 색으로 표현해보는 시간',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_06',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '꽃 꾸미기',
      domain: '미술',
      difficulty: '쉬움',
      season: '봄',
      holiday: '어버이날',
      desc: '카네이션, 진달래, 장미 꽃잎을 화분에 자유롭게 배치하며 아름다운 꽃다발을 완성하는 정원 꾸미기',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_07',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '풍경 사진 보기',
      domain: '회상',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '전국 명소의 사계절 절경과 아름다운 산천 사진을 슬라이드로 보며 눈과 마음을 맑게 하는 시간',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_08',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '계절 꾸미기',
      domain: '만들기',
      difficulty: '보통',
      season: '가을',
      holiday: '추석',
      desc: '가을 단풍잎과 보름달, 감나무 스티커를 붙여 계절 풍경을 꾸며보는 창의 공예 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_09',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '추억 이야기 나누기',
      domain: '사회성 활동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '보리가 들려주는 정겨운 옛 전래동화를 듣고 느낀 점과 옛 생각을 도란도란 이야기하는 나눔',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_10',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '자유 미술 활동',
      domain: '미술',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '규칙 없이 손 가는 대로 다양한 색채를 골라 마음껏 터치하며 정서적 안정을 얻는 표현 활동',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_11',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '간단한 만들기',
      domain: '만들기',
      difficulty: '보통',
      season: '겨울',
      holiday: '크리스마스',
      desc: '예쁜 털모자, 목도리, 트리 장식 스티커를 골라 캐릭터에게 입혀주는 재미난 소품 만들기',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    },
    {
      id: 'BORI_12',
      character: 'bori',
      characterName: '보리',
      role: '취미',
      title: '자유 취미활동',
      domain: '사회성 활동',
      difficulty: '쉬움',
      season: '공통',
      holiday: null,
      desc: '토요일 주말에 노래 부르기, 색칠하기, 이야기 듣기 중 어르신이 가장 좋아하는 것을 골라 즐기는 시간',
      enabled: true,
      lastUsed: null,
      usageCount: 0
    }
  ];

  const ProgramLibrary = {
    // 라이브러리 전체 조회
    withMedia(list) {
      const extra=window.BoriMediaDomain?.programs||[];
      let contents=[];try{contents=JSON.parse(localStorage.getItem('school_bori_media_v1')||'{}').contents||[];}catch{}
      return [...list.filter(p=>!extra.some(m=>m.id===p.id)),...extra.map(p=>({...p,enabled:contents.some(c=>c.kind===p.mediaKind&&c.enabled&&!c.deletedAt)}))];
    },
    getAll() {
      try {
        const saved = localStorage.getItem(STORAGE_LIBRARY_KEY);
        if (saved) return this.withMedia(JSON.parse(saved));
      } catch (e) {
        console.error('프로그램 라이브러리 로드 실패:', e);
      }
      return this.withMedia(JSON.parse(JSON.stringify(DEFAULT_LIBRARY)));
    },

    // 라이브러리 저장
    saveAll(list) {
      localStorage.setItem(STORAGE_LIBRARY_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('program-library-updated', { detail: list }));
      return true;
    },

    // 캐릭터별 활성화된 프로그램 목록 조회
    getActiveByCharacter(characterId) {
      return this.getAll().filter(p => p.character === characterId && p.enabled);
    },

    // 단일 프로그램 조회
    getById(id) {
      return this.getAll().find(p => p.id === id) || null;
    },

    // 프로그램 추가
    add(item) {
      const list = this.getAll();
      const newId = (item.character || 'PROG').toUpperCase() + '_' + Date.now().toString().slice(-4);
      const newProg = {
        id: newId,
        character: item.character,
        characterName: item.character === 'kongi' ? '콩이' : item.character === 'tori' ? '토리' : item.character === 'nabi' ? '나비' : '보리',
        role: item.character === 'kongi' ? '운동' : item.character === 'tori' ? '놀이' : item.character === 'nabi' ? '학습·인지' : '취미',
        title: item.title || '새 프로그램',
        domain: item.domain || '신체운동',
        difficulty: item.difficulty || '보통',
        season: item.season || '공통',
        holiday: item.holiday || null,
        desc: item.desc || '',
        enabled: true,
        lastUsed: null,
        usageCount: 0
      };
      list.push(newProg);
      this.saveAll(list);
      return newProg;
    },

    // 프로그램 수정
    update(id, updates) {
      const list = this.getAll();
      const idx = list.findIndex(p => p.id === id);
      if (idx === -1) return false;
      list[idx] = { ...list[idx], ...updates };
      this.saveAll(list);
      return true;
    },

    // 활성/비활성 토글
    toggle(id) {
      const list = this.getAll();
      const item = list.find(p => p.id === id);
      if (!item) return false;
      item.enabled = !item.enabled;
      this.saveAll(list);
      return item.enabled;
    },

    // 초기화
    resetToDefault() {
      this.saveAll(DEFAULT_LIBRARY);
      return DEFAULT_LIBRARY;
    },

    // 사용 기록 업데이트
    recordUsage(id, dateStr) {
      const list = this.getAll();
      const item = list.find(p => p.id === id || p.title === id);
      if (item) {
        item.lastUsed = dateStr;
        item.usageCount = (item.usageCount || 0) + 1;
        this.saveAll(list);
      }
    }
  };

  window.ProgramLibrary = ProgramLibrary;
})(typeof window !== 'undefined' ? window : global);
