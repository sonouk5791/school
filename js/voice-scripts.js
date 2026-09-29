/**
 * AI 디지털 학교 — AI 선생님 전용 음성 대본 데이터 모듈 (Voice Scripts)
 * 화면 글자(screenText)와 음성 대본(voiceScript)을 분리하여
 * 실제 친절한 한국인 여성 선생님이 바로 옆에서 다정하게 설명해주는 구어체 스크립트 제공
 */

const VoiceScripts = {
  // 1. 첫 화면 환영 인사 (Section 6)
  welcome: {
    page: "home_welcome",
    screenText: "AI 친구 콩이의 인사",
    voiceScript: "안녕하세요~ 반갑습니다. AI 디지털 학교에 잘 오셨어요. AI가 처음이라 조금 어렵게 느껴지셔도 괜찮아요. 제가 하나씩, 천천히 같이 해볼게요. 오늘은 어떤 걸 배워볼까요?",
    emotion: "warm",
    speed: 0.92,
    autoPlay: true
  },

  // 2. 메인 수업 선택 화면 (Section 7)
  lessonSelect: {
    page: "lesson_select",
    screenText: "오늘은 무엇을 해볼까요?",
    voiceScript: "여기에서 배우고 싶은 수업을 골라볼 수 있어요. AI가 처음이시라면 AI 기초 수업부터 시작해보시는 걸 추천드려요. 이미 조금 사용해보셨다면 이미지나 영상 만들기 수업을 선택하셔도 좋아요. 편하게 하나 골라보세요.",
    emotion: "warm",
    speed: 0.92,
    autoPlay: false
  },

  // 3. 퀴즈 시작 안내 (Section 15)
  quizStart: {
    page: "quiz_start",
    screenText: "간단한 퀴즈 풀기",
    voiceScript: "수업 내용을 얼마나 기억하고 있는지 간단한 문제를 풀어볼까요? 시험이 아니니까 부담 갖지 않으셔도 됩니다. 틀려도 괜찮아요. 천천히 한번 골라보세요.",
    emotion: "encouraging",
    speed: 0.92,
    autoPlay: true
  },

  // 4. 정답 맞혔을 때 5종 랜덤 피드백 (Section 16)
  correctAnswers: [
    { text: "맞았어요! 정말 잘하셨어요.", emotion: "happy", speed: 0.95 },
    { text: "정답입니다. 아주 잘 기억하고 계시네요.", emotion: "happy", speed: 0.95 },
    { text: "맞아요! 바로 그겁니다.", emotion: "happy", speed: 0.95 },
    { text: "잘하셨어요. 이제 확실히 이해하셨네요.", emotion: "happy", speed: 0.95 },
    { text: "정답이에요. 천천히 배우고 있는데 정말 잘하고 계세요.", emotion: "happy", speed: 0.95 }
  ],

  // 5. 오답일 때 5종 랜덤 피드백 (Section 17 - '틀렸습니다' 없이 따뜻하게 격려)
  wrongAnswers: [
    { text: "괜찮아요. 한 번만 다시 생각해볼까요?", emotion: "encouraging", speed: 0.90 },
    { text: "조금 아쉬웠어요. 힌트를 한번 볼까요?", emotion: "encouraging", speed: 0.90 },
    { text: "괜찮습니다. 배우는 중에는 얼마든지 틀릴 수 있어요.", emotion: "encouraging", speed: 0.90 },
    { text: "이번에는 다른 답을 한번 골라볼까요?", emotion: "encouraging", speed: 0.90 },
    { text: "천천히 해보세요. 정답을 찾을 수 있을 거예요.", emotion: "encouraging", speed: 0.90 }
  ],

  // 6. 도움말 안내 (Section 18)
  help: {
    intro: "어려우신가요? 괜찮아요. 현재 화면에서 무엇을 하면 되는지 제가 다시 설명해드릴게요.",
    defaultHelp: "화면에 보이는 글을 천천히 읽어보시고, 마음에 드는 버튼을 살짝 눌러보세요."
  },

  // 7. 20~30초 무반응 안내 (Section 21 - 1회만 재생)
  inactivity: {
    voiceScript: "천천히 하셔도 괜찮아요. 준비되셨으면 화면에 있는 버튼을 한번 눌러보세요.",
    emotion: "calm",
    speed: 0.90
  },

  // 8. 이전 화면으로 이동할 때 (Section 22)
  navPrev: {
    voiceScript: "괜찮아요. 이전 내용을 다시 보고 싶으시면 천천히 살펴보셔도 됩니다.",
    emotion: "warm",
    speed: 0.92
  },

  // 9. 다음 수업으로 이동할 때 (Section 23)
  navNext: {
    voiceScript: "좋아요. 그럼 이제 다음 내용을 한번 배워볼까요?",
    emotion: "encouraging",
    speed: 0.92
  },

  // 10. 단일 수업 완료 (Section 24)
  lessonComplete: {
    voiceScript: "오늘 수업은 여기까지입니다. 정말 잘하셨어요. 처음에는 조금 어렵게 느껴질 수 있지만 몇 번 사용하다 보면 금방 익숙해질 거예요. 오늘 배운 내용 중에서 한 가지만 직접 사용해보셔도 충분합니다.",
    emotion: "warm",
    speed: 0.90
  },

  // 11. 모든 수업 완료 (Section 25)
  allComplete: {
    voiceScript: "축하드려요! AI 디지털 학교의 수업을 잘 마치셨습니다. 이제 AI에게 질문하고, 글을 만들고, 그림과 영상도 만들어볼 수 있게 되었어요. 가장 중요한 건 완벽하게 하는 것이 아니라 직접 한번 사용해보는 것입니다. 앞으로도 궁금한 것이 생기면 언제든 다시 찾아주세요. 오늘 정말 수고 많으셨습니다.",
    emotion: "happy",
    speed: 0.90
  },

  // 12. 8대 AI 전문 수업 전용 대본 데이터 (Section 8 ~ 14)
  aiCourses: {
    // 8. AI 기초 수업
    ai_basic: [
      {
        stepNum: 1,
        page: "ai_basic_intro",
        screenText: "AI는 무엇일까요?",
        voiceScript: "좋아요. 오늘은 AI가 무엇인지부터 알아볼게요. 어렵게 생각하지 않으셔도 됩니다. AI는 우리가 질문하면 답을 해주거나, 글을 쓰고, 그림이나 영상을 만드는 것을 도와주는 기술이에요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "AI가 어떤 일을 해주는 친구인지 편안하게 들어보시고, 아래 다음 버튼을 눌러보세요."
      },
      {
        stepNum: 2,
        page: "ai_basic_examples",
        screenText: "AI가 도와줄 수 있는 일들",
        voiceScript: "예를 들어, 오늘 저녁 메뉴를 추천해달라고 할 수도 있고, 편지를 작성해달라고 할 수도 있고, 원하는 그림을 만들어달라고 할 수도 있어요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "일상에서 AI에게 부탁할 수 있는 재미있는 일들을 확인해보고 다음으로 넘어가 보세요."
      },
      {
        stepNum: 3,
        page: "ai_basic_practice",
        screenText: "직접 한번 해볼까요?",
        voiceScript: "그럼 직접 한번 해볼까요? 아래 입력창에, 오늘 저녁 메뉴 추천해줘, 라고 적어보세요.",
        emotion: "encouraging",
        speed: 0.90,
        helpScript: "아래 입력창을 톡 누르시고 '오늘 저녁 메뉴 추천해줘'를 입력해보세요. 미리 준비된 예시 버튼을 누르셔도 좋아요."
      },
      {
        stepNum: 4,
        page: "ai_basic_success",
        screenText: "첫 AI 대화 성공!",
        voiceScript: "잘하셨어요! 벌써 AI에게 질문하는 방법 하나를 배우셨네요.",
        emotion: "happy",
        speed: 0.95,
        helpScript: "AI가 추천해 준 메뉴를 확인해보세요. 정말 훌륭하게 해내셨어요!"
      }
    ],

    // 9. 프롬프트 기초 수업 (Section 9)
    prompt_basic: [
      {
        stepNum: 1,
        page: "prompt_basic_intro",
        screenText: "AI에게 부탁하기 (프롬프트)",
        voiceScript: "이번에는 AI에게 조금 더 잘 부탁하는 방법을 알아볼게요. AI에게 부탁하는 문장을 프롬프트라고 합니다. 하지만 이름은 어렵게 외우지 않으셔도 돼요. AI에게 무엇을 해달라고 부탁하는 문장이라고 생각하시면 됩니다.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "AI에게 무엇을 해달라고 부탁하는 말을 프롬프트라고 해요. 편안하게 읽어보세요."
      },
      {
        stepNum: 2,
        page: "prompt_basic_example",
        screenText: "자세하게 부탁하는 예시",
        voiceScript: "예를 들어 여행 계획을 만들어줘 라고 하는 것보다, 부산으로 2박 3일 여행을 가려고 해. 걷는 거리가 많지 않은 일정으로 만들어줘. 라고 말하면 AI가 훨씬 자세하게 답해줄 수 있어요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "두 문장의 차이를 비교해보세요. 자세하게 이야기할수록 AI가 똑똑하게 도와줍니다."
      },
      {
        stepNum: 3,
        page: "prompt_basic_core",
        screenText: "가장 중요한 3가지",
        voiceScript: "가장 중요한 건 세 가지예요. 무엇을 원하는지, 누구를 위한 것인지, 어떤 방식으로 만들어달라는지, 조금만 자세하게 알려주는 겁니다.",
        emotion: "encouraging",
        speed: 0.90,
        helpScript: "무엇을, 누구를 위해, 어떻게 해줄지 3가지를 마음에 쏙 담아두세요."
      }
    ],

    // 10. AI 글쓰기 수업 (Section 10)
    ai_writing: [
      {
        stepNum: 1,
        page: "ai_writing_intro",
        screenText: "AI로 다양한 글 만들기",
        voiceScript: "이번에는 AI를 이용해서 글을 만들어볼게요. AI는 문자, 이메일, 블로그 글, 소개글처럼 여러 가지 글쓰기를 도와줄 수 있어요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "일상생활에서 자주 쓰는 문자와 편지를 AI와 함께 써볼 수 있어요."
      },
      {
        stepNum: 2,
        page: "ai_writing_example",
        screenText: "감사 문자 예시",
        voiceScript: "예를 들어 선생님께 감사 문자를 써줘. 라고 부탁할 수도 있어요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "평소 고마웠던 분에게 보낼 문자를 AI에게 어떻게 부탁하는지 살펴보세요."
      },
      {
        stepNum: 3,
        page: "ai_writing_mood",
        screenText: "원하는 분위기 추가하기",
        voiceScript: "여기에 조금 더 공손하게 해줘. 짧게 만들어줘. 따뜻하게 작성해줘. 처럼 원하는 분위기를 추가할 수도 있습니다.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "공손하게, 짧게, 따뜻하게 처럼 원하는 느낌을 덧붙여 말해보세요."
      },
      {
        stepNum: 4,
        page: "ai_writing_practice",
        screenText: "직접 글 써보기",
        voiceScript: "이번에는 직접 해볼까요? 아래 입력창에 만들고 싶은 글을 적어보세요.",
        emotion: "encouraging",
        speed: 0.90,
        helpScript: "보내고 싶은 문자나 글의 내용을 아래 창에 적어보세요."
      }
    ],

    // 11. AI 이미지 만들기 수업 (Section 11)
    ai_image: [
      {
        stepNum: 1,
        page: "ai_image_intro",
        screenText: "말로 그리는 AI 그림",
        voiceScript: "이번에는 AI로 그림을 만들어볼게요. 그림을 잘 그리지 못해도 괜찮습니다. 원하는 모습을 말로 설명하면 AI가 그림을 만들어줄 수 있어요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "붓이나 물감 없이, 내가 상상한 풍경을 말로 풀어서 멋진 그림으로 만들 수 있어요."
      },
      {
        stepNum: 2,
        page: "ai_image_tips",
        screenText: "좋은 그림을 만드는 4가지 설명",
        voiceScript: "좋은 이미지를 만들려면 무엇이 나오는지, 어디에 있는지, 어떤 분위기인지, 어떤 그림 스타일인지 알려주면 좋습니다.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "주인공, 배경 장소, 분위기, 그림 스타일 4가지를 떠올려보세요."
      },
      {
        stepNum: 3,
        page: "ai_image_example",
        screenText: "따뜻한 가을 공원 그림 예시",
        voiceScript: "예를 들어 가을 공원 벤치에 앉아 책을 읽고 있는 할머니, 따뜻한 오후 햇살, 부드러운 일러스트 스타일 이라고 입력할 수 있어요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "문장 하나로 멋진 한 폭의 그림이 완성되는 예시를 감상해보세요."
      },
      {
        stepNum: 4,
        page: "ai_image_practice",
        screenText: "직접 그림 설명해보기",
        voiceScript: "이제 직접 만들어볼까요? 아래 입력창에 만들고 싶은 그림을 편하게 설명해보세요.",
        emotion: "encouraging",
        speed: 0.90,
        helpScript: "그리고 싶은 그림을 단어나 문장으로 자유롭게 적고 그림 만들기 버튼을 눌러보세요."
      },
      {
        stepNum: 5,
        page: "ai_image_complete",
        screenText: "멋진 그림 완성!",
        voiceScript: "와~ 잘 만드셨어요. 처음부터 완벽하지 않아도 괜찮아요. 마음에 들지 않는 부분이 있으면 AI에게 다시 수정해달라고 부탁하면 됩니다.",
        emotion: "happy",
        speed: 0.92,
        helpScript: "완성된 그림을 감상해보세요. 색감이나 요소를 바꾸고 싶을 땐 언제든 다시 말하면 돼요."
      }
    ],

    // 12. AI 영상 만들기 수업
    ai_video: [
      {
        stepNum: 1,
        page: "ai_video_intro",
        screenText: "움직이는 AI 영상",
        voiceScript: "이번에는 AI 영상 만들기를 배워볼게요. 이미지를 움직이게 만들거나, 글로 장면을 설명해서 짧은 영상을 만들 수도 있습니다.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "그림이 살아 움직이거나, 이야기 장면이 영상으로 탄생하는 재미있는 경험이에요."
      },
      {
        stepNum: 2,
        page: "ai_video_factors",
        screenText: "영상 만들기의 4가지 포인트",
        voiceScript: "영상에서는 네 가지를 생각하면 쉬워요. 누가 나오는지, 무엇을 하는지, 어디에 있는지, 카메라가 어떻게 움직이는지입니다.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "인물, 행동, 장소, 카메라 움직임 4가지를 짚어보세요."
      },
      {
        stepNum: 3,
        page: "ai_video_example",
        screenText: "공원 산책 영상 예시",
        voiceScript: "예를 들어 가을 공원을 걷는 할머니, 천천히 미소를 지으며 앞으로 걸어간다. 카메라는 앞에서 천천히 따라간다. 처럼 작성할 수 있어요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "카메라가 따라가는 모습을 상상해보세요. 훨씬 생동감 있는 영상이 돼요."
      },
      {
        stepNum: 4,
        page: "ai_video_cheer",
        screenText: "짧은 영상부터 시작해요",
        voiceScript: "처음에는 짧은 영상부터 시작하는 것이 좋습니다. 5초나 8초짜리 영상 하나부터 만들어보세요.",
        emotion: "encouraging",
        speed: 0.90,
        helpScript: "5초 정도의 짧고 귀여운 영상 클립부터 하나씩 재미있게 도전해보세요."
      }
    ],

    // 13. AI 음악 만들기 수업
    ai_music: [
      {
        stepNum: 1,
        page: "ai_music_intro",
        screenText: "나만의 멜로디 만들기",
        voiceScript: "이번에는 AI로 음악을 만들어볼게요. 악기를 연주하지 못해도 괜찮아요. 원하는 음악 분위기를 말해주면 AI가 음악 만들기를 도와줄 수 있습니다.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "피아노나 기타를 칠 줄 몰라도, 내가 원하는 느낌을 말하면 노래가 만들어져요."
      },
      {
        stepNum: 2,
        page: "ai_music_factors",
        screenText: "음악을 설명하는 방법",
        voiceScript: "음악을 만들 때는 분위기, 장르, 빠르기, 사용할 악기, 남성 또는 여성 목소리 같은 내용을 알려주면 좋아요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "신나는 트로트, 잔잔한 클래식, 부드러운 목소리 등 원하는 스타일을 떠올려보세요."
      },
      {
        stepNum: 3,
        page: "ai_music_example",
        screenText: "가을 저녁 노래 예시",
        voiceScript: "예를 들어 따뜻한 가을 저녁 분위기, 잔잔한 피아노와 기타, 여성 보컬, 천천히 흐르는 감성적인 노래 처럼 입력해볼 수 있습니다.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "원하는 악기와 목소리를 조합해 정다운 노래를 함께 들어보세요."
      }
    ],

    // 14. AI 생활 활용 수업
    ai_life: [
      {
        stepNum: 1,
        page: "ai_life_intro",
        screenText: "우리 생활 속의 AI",
        voiceScript: "AI는 특별한 일을 할 때만 사용하는 것이 아닙니다. 우리 생활에서도 다양하게 사용할 수 있어요.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "매일매일 밥상 차리기, 병원 가는 길, 가족 모임 등 어디서든 AI를 유용하게 쓸 수 있어요."
      },
      {
        stepNum: 2,
        page: "ai_life_examples",
        screenText: "생활 속 다양한 질문들",
        voiceScript: "냉장고에 있는 재료로 요리를 추천받거나, 여행 일정을 만들거나, 문자를 작성하거나, 어려운 내용을 쉽게 설명해달라고 할 수도 있습니다.",
        emotion: "warm",
        speed: 0.92,
        helpScript: "궁금하거나 어려운 일상 고민들을 언제든 가볍게 물어볼 수 있어요."
      },
      {
        stepNum: 3,
        page: "ai_life_question",
        screenText: "어떤 도움이 필요하세요?",
        voiceScript: "어떤 도움이 필요하세요? 평소에 어려웠던 일을 AI에게 한번 물어보세요.",
        emotion: "encouraging",
        speed: 0.90,
        helpScript: "평소 궁금했던 건강 정보나 생활 꿀팁을 무엇이든 편안하게 물어보세요."
      }
    ]
  },

  // 헬퍼: 랜덤 정답 칭찬 문구 가져오기
  getRandomCorrect() {
    const list = this.correctAnswers;
    return list[Math.floor(Math.random() * list.length)];
  },

  // 헬퍼: 랜덤 오답 격려 문구 가져오기
  getRandomWrong() {
    const list = this.wrongAnswers;
    return list[Math.floor(Math.random() * list.length)];
  }
};

window.VoiceScripts = VoiceScripts;

