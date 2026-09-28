/* Additive question library: stable IDs, three difficulty levels, no removal of original questions. */
(() => {
  "use strict";
  const fruits = [
    "사과 🍎",
    "배 🍐",
    "귤 🍊",
    "바나나 🍌",
    "포도 🍇",
    "딸기 🍓",
    "수박 🍉",
    "복숭아 🍑",
    "체리 🍒",
    "파인애플 🍍",
    "레몬 🍋",
    "참외 🍈",
  ];
  const animals = [
    "강아지 🐶",
    "고양이 🐱",
    "토끼 🐰",
    "곰 🐻",
    "사자 🦁",
    "호랑이 🐯",
    "소 🐮",
    "돼지 🐷",
    "말 🐴",
    "양 🐑",
    "원숭이 🐵",
    "코끼리 🐘",
    "기린 🦒",
    "닭 🐔",
    "오리 🦆",
    "펭귄 🐧",
  ];
  const objects = [
    "우산 ☂️",
    "가위 ✂️",
    "시계 ⏰",
    "전화기 ☎️",
    "열쇠 🔑",
    "안경 👓",
    "책 📕",
    "연필 ✏️",
    "컵 ☕",
    "숟가락 🥄",
    "빗자루 🧹",
    "의자 🪑",
    "문 🚪",
    "신발 👟",
    "모자 👒",
    "가방 👜",
  ];
  const colors = ["빨강", "주황", "노랑", "초록", "파랑", "보라"];
  const pools = {};
  function choices(list, answer, seed) {
    const other = list.filter((x) => x !== answer);
    const offset = seed % other.length;
    return [answer, ...other.slice(offset), ...other.slice(0, offset)].slice(
      0,
      4,
    );
  }
  function make(key, list, n = 36) {
    pools[key] = Array.from({ length: n }, (_, i) => {
      const answer = list[i % list.length];
      return {
        id: key + "-" + i,
        question: answer + "를 찾아볼까요?",
        answer,
        options: choices(list, answer, Math.floor(i / list.length)),
        level: 1 + Math.floor(i / 12),
        category: key,
      };
    });
  }
  make("fruit", fruits);
  make("animal", animals);
  make("objects", objects);
  make("color", colors);
  make("match", [...fruits, ...objects]);
  make("different", [...animals, ...objects]);
  const seasonal = {
    봄: [
      "벚꽃",
      "새싹",
      "봄나들이",
      "진달래",
      "개나리",
      "따뜻한 봄바람",
      "봄꽃",
      "제비가 돌아오는 때",
    ],
    여름: [
      "더운 날",
      "장마",
      "물놀이",
      "선풍기",
      "수박을 시원하게 먹는 날",
      "매미 소리",
      "부채",
      "여름휴가",
    ],
    가을: [
      "단풍",
      "추수",
      "가을 들판",
      "도토리",
      "은행잎",
      "코스모스",
      "밤 줍기",
      "낙엽",
    ],
    겨울: [
      "눈사람",
      "얼음",
      "목도리",
      "겨울장갑",
      "눈 내리는 날",
      "두꺼운 외투",
      "찬바람",
      "겨울방학",
    ],
  };
  pools.season = Object.entries(seasonal).flatMap(([answer, items]) =>
    items.map((item, i) => ({
      id: "season-" + answer + i,
      question: item + " 하면 어느 계절이 떠오르세요?",
      answer,
      options: Object.keys(seasonal),
      category: "season",
      level: 1 + (i % 3),
    })),
  );
  const reminiscence = {
    고향: "고향에서 기억나는 풍경이 있나요?",
    학교: "학교에서 좋아했던 시간이 있나요?",
    가족: "가족과 함께하면 즐거웠던 일은 무엇인가요?",
    결혼: "기억나는 잔치 이야기가 있나요?",
    자녀: "아이들과 함께했던 추억이 있나요?",
    직업: "예전에 하셨던 일 중 기억나는 일이 있나요?",
    시장: "시장에 가면 무엇을 자주 사셨나요?",
    음식: "좋아하셨던 음식은 무엇인가요?",
    명절: "명절에는 무엇을 하며 보내셨나요?",
    농촌: "들판이나 텃밭을 가꾸신 기억이 있나요?",
    옛날물건: "예전에 쓰던 물건 중 떠오르는 것이 있나요?",
    교통수단: "예전에는 먼 곳에 어떻게 다니셨나요?",
    어린시절놀이: "어릴 때 어떤 놀이를 좋아하셨어요?",
  };
  const hobby = {
    민요: "기억나는 민요를 천천히 흥얼거려볼까요?",
    동요: "좋아하는 동요 제목을 이야기해볼까요?",
    자연소리: "들어보고 싶은 자연의 소리는 무엇인가요?",
    그림감상: "그림에서 마음에 드는 색을 찾아볼까요?",
    꽃꾸미기: "좋아하는 꽃 색깔을 고르고 꽃을 꾸며볼까요?",
    간단만들기: "종이를 반으로 접어 작은 책 모양을 만들어볼까요?",
    색칠하기: "좋아하는 색을 골라 천천히 칠해볼까요?",
    추억이야기: "기분이 좋아졌던 추억을 함께 이야기해볼까요?",
    수수께끼: "밤하늘에서 반짝이는 것은 무엇일까요?",
  };
  function draw(category, level = 1, count = 5, storage = localStorage) {
    const key = "school_question_history_v3:" + category;
    let history = [];
    try {
      history = JSON.parse(storage.getItem(key) || "[]");
    } catch {}
    const source = pools[category] || [];
    const fresh = source.filter((q) => !history.includes(q.id));
    const candidates = [
      ...fresh.sort(() => Math.random() - 0.5),
      ...source
        .filter((q) => history.includes(q.id))
        .sort(() => Math.random() - 0.5),
    ]
      .slice(0, count)
      .map((q) => ({
        ...q,
        options: [q.answer, ...q.options.filter((x) => x !== q.answer)]
          .slice(0, level + 1)
          .sort(() => Math.random() - 0.5),
      }));
    try {
      storage.setItem(
        key,
        JSON.stringify(
          [...history, ...candidates.map((q) => q.id)].slice(
            -Math.max(5, source.length - 5),
          ),
        ),
      );
    } catch {}
    return candidates;
  }
  window.SchoolActivityBank = { pools, reminiscence, hobby, draw };
})();
