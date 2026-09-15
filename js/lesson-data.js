/**
 * 디지털 학교 - 8대 '오늘의 수업' 콘텐츠 데이터 (Visual Rich & Clear Lesson Data)
 * 모든 단계마다 고화질 사진과 시각적 삽화를 함께 제공하여 직관적 이해와 회상을 돕습니다.
 */

const LESSON_CATALOG = [
  {
    "id": "greeting",
    "icon": "🧡",
    "title": "AI 친구와 인사하기",
    "summary": "AI 친구와 반갑게 인사하고 오늘의 날씨와 기분을 함께 나눠요.",
    "steps": [
      {
        "stepNum": 1,
        "aiMessage": "안녕하세요! 오늘 만나서 정말 반가워요. 저와 인사해 주실래요?",
        "screenText": "안녕하세요! 오늘 만나서 정말 반가워요. 저와 인사해 주실래요?",
        "voiceScript": "안녕하세요! 오늘 이렇게 뵙게 되어 정말 반갑습니다. 오늘 기분 좋은 하루 보내고 계신가요? 저와 반갑게 인사 나눠보아요.",
        "helpScript": "화면에 보이는 보기 중에서 마음에 드는 인사말을 손가락으로 가볍게 눌러보세요.",
        "prompt": "마음에 드는 인사말을 하나 골라보세요.",
        "imageSrc": "assets/images/ai_friend_classroom.jpg",
        "imageAlt": "다정하게 손을 흔드는 AI 친구와 디지털 교실",
        "imageCaption": "🏫 1단계 · 우리들의 따뜻하고 밝은 디지털 교실",
        "options": [
          {
            "text": "반가워요",
            "emoji": "👋",
            "isBest": true,
            "feedback": "반갑게 인사해 주셔서 제 마음도 활짝 밝아졌어요!"
          },
          {
            "text": "좋은 하루예요",
            "emoji": "☀️",
            "isBest": true,
            "feedback": "오늘 하루도 햇살처럼 따뜻하고 기분 좋은 일만 가득하시길 바라요!"
          },
          {
            "text": "오늘도 잘 부탁해요",
            "emoji": "🤝",
            "isBest": true,
            "feedback": "저야말로 함께해 주셔서 참 든든하고 행복합니다!"
          }
        ]
      },
      {
        "stepNum": 2,
        "aiMessage": "교실 창밖을 내다보니 오늘 날씨가 참 궁금해요. 오늘 창밖 날씨는 어떤가요?",
        "screenText": "교실 창밖을 내다보니 오늘 날씨가 참 궁금해요. 오늘 바깥 날씨는 어떤가요?",
        "voiceScript": "교실 창밖을 한번 바라보세요. 오늘 바깥 날씨는 어떤가요? 맑은지 흐린지 한번 골라보세요.",
        "helpScript": "오늘 바깥 날씨와 가장 비슷한 보기를 하나 선택해 주세요.",
        "prompt": "오늘의 바깥 날씨를 선택해 보세요.",
        "imageSrc": "assets/images/spring_flowers.jpg",
        "imageAlt": "화창한 봄 하늘과 활짝 핀 꽃",
        "imageCaption": "🌸 2단계 · 맑고 화창한 날씨와 향긋한 꽃바람",
        "options": [
          {
            "text": "맑고 햇살이 따뜻해요",
            "emoji": "☀️",
            "isBest": true,
            "feedback": "맑은 햇살처럼 어르신의 얼굴에도 환한 미소가 가득하시네요."
          },
          {
            "text": "시원하고 상쾌한 바람이 불어요",
            "emoji": "🍃",
            "isBest": true,
            "feedback": "선선하고 상쾌한 바람이 마음까지 시원하게 식혀주는 날이네요."
          },
          {
            "text": "구름이 조금 끼어 포근해요",
            "emoji": "☁️",
            "isBest": true,
            "feedback": "차분하고 포근해서 마음 편안히 쉬어가기 좋은 날씨예요."
          }
        ]
      },
      {
        "stepNum": 3,
        "aiMessage": "창밖 풍경을 보니 어릴 적 뛰놀던 정겨운 고향 마을 풍경이 떠오르네요.",
        "screenText": "창밖 풍경을 보니 어릴 적 뛰놀던 정겨운 고향 마을 풍경이 떠오르네요.",
        "voiceScript": "날씨가 참 좋으니, 어릴 적 정답게 뛰놀던 고향 마을 생각이 절로 나네요. 어르신은 고향 마을의 어떤 계절이 가장 기억나시나요?",
        "helpScript": "가장 마음에 남는 고향의 계절을 하나 골라보세요.",
        "prompt": "가장 생각나는 고향의 계절을 골라보세요.",
        "imageSrc": "assets/images/nostalgic_village.jpg",
        "imageAlt": "평화로운 고향 마을 초가집과 돌담길",
        "imageCaption": "🏡 3단계 · 정겨운 초가지붕과 흙담이 있는 고향 마을",
        "options": [
          {
            "text": "꽃잎 흩날리던 따스한 봄날",
            "emoji": "🌸",
            "isBest": true,
            "feedback": "진달래 개나리 활짝 피던 고향의 봄은 생각만 해도 가슴이 설레지요."
          },
          {
            "text": "황금빛 벼가 일렁이던 넉넉한 가을",
            "emoji": "🌾",
            "isBest": true,
            "feedback": "풍성하게 익은 곡식에 온 마을 인심이 넉넉하던 참 좋은 계절이에요."
          },
          {
            "text": "시원한 시냇물에 발 담그던 여름",
            "emoji": "🌊",
            "isBest": true,
            "feedback": "원두막에서 수박 쪼개 먹으며 멱감던 추억이 눈에 선하네요."
          }
        ]
      },
      {
        "stepNum": 4,
        "aiMessage": "금강산도 식후경이지요! 오늘 든든하게 식사는 맛있게 챙겨 드셨나요?",
        "screenText": "금강산도 식후경이지요! 오늘 든든하게 식사는 맛있게 챙겨 드셨나요?",
        "voiceScript": "어르신, 무엇보다 건강이 제일이지요. 오늘 식사는 든든하고 맛있게 챙겨 드셨나요?",
        "helpScript": "오늘 식사하셨던 기분을 보기에서 편안하게 선택해 보세요.",
        "prompt": "오늘의 식사 안부를 알려주세요.",
        "imageSrc": "assets/images/korean_stew_table.jpg",
        "imageAlt": "보글보글 끓는 된장찌개와 정갈한 밥상",
        "imageCaption": "🍲 4단계 · 온 가족의 건강을 챙겨주는 따뜻한 진지 밥상",
        "options": [
          {
            "text": "네, 구수한 찌개에 밥 한 그릇 뚝딱 비웠어요",
            "emoji": "🍚",
            "isBest": true,
            "feedback": "밥이 보약입니다! 든든하게 챙겨 드셨다니 제 마음이 정말 흐뭇해요."
          },
          {
            "text": "맛있게 잘 챙겨 먹었답니다",
            "emoji": "😋",
            "isBest": true,
            "feedback": "좋습니다! 입맛 잃지 마시고 매 끼니 맛있게 드시는 게 장수의 비결이에요."
          },
          {
            "text": "이제 든든하게 챙겨 먹으려고 해요",
            "emoji": "🍲",
            "isBest": true,
            "feedback": "따뜻한 국물에 밥 꼭꼭 씹어서 맛있게 드세요!"
          }
        ]
      },
      {
        "stepNum": 5,
        "aiMessage": "귀여운 강아지 친구 콩이가 반갑다고 꼬리를 살랑살랑 흔들며 다가왔어요!",
        "screenText": "귀여운 강아지 친구 콩이가 반갑다고 꼬리를 살랑살랑 흔들며 다가왔어요!",
        "voiceScript": "저기 보세요! 귀여운 바둑이 콩이가 어르신을 뵙고 좋아서 꼬리를 흔들며 달려오네요. 콩이에게 다정하게 인사 한마디 건네주실래요?",
        "helpScript": "강아지 콩이에게 해주고 싶은 말을 골라보세요.",
        "prompt": "꼬리 치는 콩이에게 다정한 인사를 건네보세요.",
        "imageSrc": "assets/images/ai_puppy_friend.jpg",
        "imageAlt": "꼬리를 흔들며 반기는 귀여운 강아지 콩이",
        "imageCaption": "🐶 5단계 · 어르신을 보며 반갑게 반기는 우리 집 콩이",
        "options": [
          {
            "text": "아이고 귀여운 콩이야, 반갑다!",
            "emoji": "🐕",
            "isBest": true,
            "feedback": "콩이가 좋아서 뱅글뱅글 돌며 어르신 손을 핥아주네요!"
          },
          {
            "text": "착하게 꼬리도 잘 흔드는구나, 쓰담쓰담",
            "emoji": "🧡",
            "isBest": true,
            "feedback": "어르신의 부드러운 손길에 콩이가 눈을 지그시 감고 행복해해요."
          },
          {
            "text": "오늘도 우리 함께 신나게 놀자꾸나!",
            "emoji": "🎾",
            "isBest": true,
            "feedback": "멍멍! 콩이가 신이 나서 어깨춤을 추는 것 같아요!"
          }
        ]
      },
      {
        "stepNum": 6,
        "aiMessage": "어르신 얼굴에 더 큰 미소를 선물해 드리려고 마당에서 갓 꺾은 해바라기를 가져왔어요.",
        "screenText": "어르신 얼굴에 더 큰 미소를 선물해 드리려고 마당에서 갓 꺾은 해바라기를 가져왔어요.",
        "voiceScript": "어르신의 밝은 미소와 쏙 빼닮은 노란 해바라기꽃이에요. 활짝 핀 꽃을 보니 기분이 어떠신가요?",
        "helpScript": "꽃을 바라보며 드는 마음을 하나 골라보세요.",
        "prompt": "노란 해바라기를 보며 드는 느낌을 골라보세요.",
        "imageSrc": "assets/images/korean_sunflower.jpg",
        "imageAlt": "파란 하늘 아래 눈부시게 핀 해바라기꽃",
        "imageCaption": "🌻 6단계 · 해를 닮아 밝고 환한 황금빛 해바라기",
        "options": [
          {
            "text": "환하고 기분이 아주 밝아져요",
            "emoji": "🌻",
            "isBest": true,
            "feedback": "해바라기의 따스한 햇살 기운이 어르신 마음에 가득 차오르네요!"
          },
          {
            "text": "얼굴에 저절로 웃음꽃이 피네요",
            "emoji": "😊",
            "isBest": true,
            "feedback": "어르신의 활짝 웃으시는 모습이 세상에서 제일 고우세요."
          },
          {
            "text": "노란 색깔이 참 탐스럽고 예뻐요",
            "emoji": "✨",
            "isBest": true,
            "feedback": "탐스러운 꽃잎처럼 어르신의 오늘 하루도 활짝 피어나실 거예요."
          }
        ]
      },
      {
        "stepNum": 7,
        "aiMessage": "이야기 나누며 목을 축이실 수 있도록 김이 모락모락 나는 대추차 한 잔을 올려드려요.",
        "screenText": "이야기 나누며 목을 축이실 수 있도록 김이 모락모락 나는 대추차 한 잔을 올려드려요.",
        "voiceScript": "도자기 찻잔에 정성스레 달인 따뜻한 대추차 한 잔 드셔보세요. 달콤한 향기가 온 방안에 가득하네요.",
        "helpScript": "따뜻한 차를 드시는 기분을 선택해 보세요.",
        "prompt": "따뜻한 차 한 잔을 손에 쥐신 느낌을 골라보세요.",
        "imageSrc": "assets/images/warm_jujube_tea.jpg",
        "imageAlt": "정성스레 달여 김이 나는 따뜻한 대추차",
        "imageCaption": "🍵 7단계 · 정성과 온기를 가득 담은 따뜻한 대추차",
        "options": [
          {
            "text": "손도 따뜻해지고 속이 참 편안해요",
            "emoji": "🍵",
            "isBest": true,
            "feedback": "달콤하고 따뜻한 차 한 잔에 온몸의 긴장이 사르르 풀리시지요."
          },
          {
            "text": "은은한 단맛에 기운이 절로 나네요",
            "emoji": "🍯",
            "isBest": true,
            "feedback": "대추의 좋은 영양이 어르신을 든든하게 지켜드릴 거예요."
          },
          {
            "text": "함께 마시니 차 맛이 배로 좋아요",
            "emoji": "☕",
            "isBest": true,
            "feedback": "좋은 분과 함께 나누는 차 한 잔이 세상에서 가장 큰 보약이랍니다."
          }
        ]
      },
      {
        "stepNum": 8,
        "aiMessage": "어르신과 정답게 인사 나누고 온기를 나누니 오늘 하루가 온통 축복 같습니다!",
        "screenText": "어르신과 정답게 인사 나누고 온기를 나누니 오늘 하루가 온통 축복 같습니다!",
        "voiceScript": "어르신과 다정하게 눈을 맞추며 이야기 나누니 정말 행복합니다. 오늘 하루도 늘 건강하시고 웃음 가득하시길 진심으로 응원합니다!",
        "helpScript": "마지막으로 나누고 싶은 따뜻한 응원을 선택해 보세요.",
        "prompt": "오늘 하루를 위한 따뜻한 응원을 골라보세요.",
        "imageSrc": "assets/images/ai_puppy_heart.jpg",
        "imageAlt": "하트와 함께 응원을 전하는 다정한 친구",
        "imageCaption": "🧡 8단계 · 어르신의 건강과 행복을 온 마음으로 응원해요",
        "options": [
          {
            "text": "고마워요, 오늘 하루도 힘차게 보낼게요!",
            "emoji": "💪",
            "isBest": true,
            "feedback": "힘찬 다짐 최고입니다! 늘 곁에서 어르신을 힘차게 응원할게요!"
          },
          {
            "text": "이야기 나누니 마음이 아주 푸근해졌어요",
            "emoji": "🥰",
            "isBest": true,
            "feedback": "저도 어르신 덕분에 마음이 참 따뜻해졌어요. 사랑합니다!"
          },
          {
            "text": "내일도 정답게 또 만나요!",
            "emoji": "🤝",
            "isBest": true,
            "feedback": "네! 내일도 변함없이 환한 미소로 기다리고 있을게요!"
          }
        ]
      }
    ]
  },
  {
    "id": "photo",
    "icon": "📷",
    "title": "추억의 사진 이야기",
    "summary": "아침 햇살 비추는 마당 장독대부터 붉은 노을까지, 한 권의 사진첩처럼 이어지는 정겨운 고향의 하루예요.",
    "steps": [
      {
        "stepNum": 1,
        "aiMessage": "오늘은 정겨운 고향 집에서의 따뜻한 하루를 사진첩으로 펼쳐볼게요. 이른 아침, 마당에 햇살이 드리우네요.",
        "screenText": "오늘은 정겨운 고향 집에서의 따뜻한 하루를 사진첩으로 펼쳐볼게요. 이른 아침, 마당에 햇살이 드리우네요.",
        "voiceScript": "어르신, 오늘은 우리들의 정든 고향 집으로 추억 여행을 떠나보아요. 이른 아침, 흙담 너머로 따스한 아침 햇살이 마당 가득 비추고 있어요.",
        "helpScript": "사진 속 마당을 보며 떠오르는 정다운 기억을 하나 골라보세요.",
        "prompt": "아침 마당 사진을 보며 어떤 기억이 떠오르시나요?",
        "imageSrc": "assets/images/nostalgic_village.jpg",
        "imageAlt": "아침 햇살이 비추는 정겨운 시골집 마당과 돌담",
        "imageCaption": "🏺 1쪽 · 아침 햇살이 따스하게 내리쬐는 우리 집 마당",
        "options": [
          {
            "text": "싸륵싸륵 아침 마당 쓸던 빗자루 소리",
            "emoji": "🧹",
            "isBest": true,
            "feedback": "마당을 정갈하게 쓸고 물을 뿌리며 상쾌하게 하루를 열던 아침이었지요."
          },
          {
            "text": "처마 밑에서 지저귀던 참새 소리",
            "emoji": "🐦",
            "isBest": true,
            "feedback": "짹짹 지저귀는 참새들과 함께 눈뜨던 정다운 고향의 아침 풍경이에요."
          },
          {
            "text": "굴뚝에서 모락모락 피어나던 아침 연기",
            "emoji": "💨",
            "isBest": true,
            "feedback": "가마솥에 밥 짓는 구수한 연기가 온 동네를 깨우던 그리운 시절이지요."
          }
        ]
      },
      {
        "stepNum": 2,
        "aiMessage": "마당 한켠 장독대 옆으로 다가가니, 아침 이슬을 머금은 탐스러운 해바라기가 방긋 웃고 있어요.",
        "screenText": "마당 한켠 장독대 옆으로 다가가니, 아침 이슬을 머금은 탐스러운 해바라기가 방긋 웃고 있어요.",
        "voiceScript": "장독대 옆을 한번 보세요. 반질반질 닦아놓은 장독대 곁에 노란 해바라기가 키를 쑥 세우고 활짝 피어있네요.",
        "helpScript": "장독대 옆에 피어난 해바라기를 보며 드는 생각을 골라보세요.",
        "prompt": "장독대 곁에 활짝 핀 해바라기를 보며 어떤 생각이 드시나요?",
        "imageSrc": "assets/images/story_courtyard_sunflower.jpg",
        "imageAlt": "장독대 옆에 해바라기가 활짝 핀 시골 마당",
        "imageCaption": "🌻 2쪽 · 장독대 곁에서 해를 반기는 노란 해바라기",
        "options": [
          {
            "text": "해를 따라 고개를 돌리던 정겨운 모습",
            "emoji": "🌻",
            "isBest": true,
            "feedback": "맞아요! 아침마다 해님을 바라보며 방긋 웃던 우리 집 지킴이 꽃이었지요."
          },
          {
            "text": "반질반질 윤이 나던 항아리 뚜껑",
            "emoji": "🏺",
            "isBest": true,
            "feedback": "어머니께서 매일 행주로 정성껏 닦으시던 보물 항아리들이었지요."
          },
          {
            "text": "마당 한가득 퍼지던 구수한 장 냄새",
            "emoji": "🍲",
            "isBest": true,
            "feedback": "장독 뚜껑만 열어도 곰삭은 된장 간장 냄새가 입맛을 돋우었지요."
          }
        ]
      },
      {
        "stepNum": 3,
        "aiMessage": "장독대 곁 텃밭에서 아침 이슬을 머금은 싱싱하고 푸릇푸릇한 쌈채소를 소쿠리 가득 뜯어왔어요.",
        "screenText": "장독대 곁 텃밭에서 아침 이슬을 머금은 싱싱하고 푸릇푸릇한 쌈채소를 소쿠리 가득 뜯어왔어요.",
        "voiceScript": "어르신, 싱그러운 텃밭으로 가볼까요? 소쿠리 가득 아삭한 상추와 향긋한 깻잎, 풋고추를 담아내니 보기만 해도 입안 가득 군침이 돌지요.",
        "helpScript": "텃밭에서 갓 따온 싱싱한 채소의 매력을 골라보세요.",
        "prompt": "텃밭에서 갓 뜯어온 푸릇푸릇한 채소를 보며 어떤 생각이 드시나요?",
        "imageSrc": "assets/images/story_courtyard_mealtime.jpg",
        "imageAlt": "소쿠리에 가득 담긴 싱싱하고 푸릇푸릇한 텃밭 쌈채소",
        "imageCaption": "🥬 3쪽 · 텃밭에서 갓 뜯어온 싱싱하고 아삭한 채소",
        "options": [
          {
            "text": "텃밭에서 갓 뜯어온 아삭한 채소",
            "emoji": "🥬",
            "isBest": true,
            "feedback": "이슬 묻은 상추와 풋고추를 된장에 콕 찍어 먹던 그 싱그러운 맛!"
          },
          {
            "text": "직접 담근 깊은 맛 된장과 고추장",
            "emoji": "🏺",
            "isBest": true,
            "feedback": "장독대에서 갓 퍼 올린 된장 한 숟가락이면 밥 한 그릇이 금세 뚝딱이었지요!"
          },
          {
            "text": "온 가족이 옹기종기 둘러앉던 온기",
            "emoji": "👨‍👩‍👧‍👦",
            "isBest": true,
            "feedback": "서로 밥그릇에 반찬을 얹어주며 웃음꽃을 피우던 그리운 가족 밥상이에요."
          }
        ]
      },
      {
        "stepNum": 4,
        "aiMessage": "밥상 한가운데에서 뚝배기가 보글보글 끓어올라요! 어머니 손맛이 깃든 구수한 된장찌개예요.",
        "screenText": "밥상 한가운데에서 뚝배기가 보글보글 끓어올라요! 어머니 손맛이 깃든 구수한 된장찌개예요.",
        "voiceScript": "보글보글 소리와 함께 모락모락 김이 피어오르네요. 멸치 육수에 두부 송송 썰어 넣은 된장찌개 한 숟갈, 얼마나 맛있었나요?",
        "helpScript": "어머니께서 끓여주시던 찌개의 맛을 골라보세요.",
        "prompt": "어머니 손맛이 깃든 된장찌개의 맛을 골라보세요.",
        "imageSrc": "assets/images/korean_stew_table.jpg",
        "imageAlt": "보글보글 끓는 따뜻한 된장찌개 밥상",
        "imageCaption": "🍲 4쪽 · 모락모락 김이 나는 어머니 손맛 된장찌개",
        "options": [
          {
            "text": "호박과 부드러운 두부가 듬뿍 들어간 맛",
            "emoji": "🍲",
            "isBest": true,
            "feedback": "뜨거운 두부를 호호 불며 밥 위에 으깨어 비벼 먹던 그 깊고 구수한 맛!"
          },
          {
            "text": "바닥까지 싹싹 긁어먹던 꿀맛",
            "emoji": "😋",
            "isBest": true,
            "feedback": "어머니 손맛은 세상 어떤 요리사와도 바꿀 수 없는 최고였지요."
          },
          {
            "text": "온몸이 훈훈하게 데워지던 든든함",
            "emoji": "✨",
            "isBest": true,
            "feedback": "구수한 국물 한 모금에 속이 든든해지고 하루를 힘차게 시작했답니다."
          }
        ]
      },
      {
        "stepNum": 5,
        "aiMessage": "식사를 든든하게 마치고 툇마루에 앉으니, 따뜻한 도자기 잔에 달콤한 대추차가 담겨 나왔어요.",
        "screenText": "식사를 든든하게 마치고 툇마루에 앉으니, 따뜻한 도자기 잔에 달콤한 대추차가 담겨 나왔어요.",
        "voiceScript": "아침밥을 맛있게 먹고 툇마루에 걸터앉아 쉬는 시간이에요. 두 손으로 찻잔을 감싸 쥐니 온기가 손끝을 타고 전해져요.",
        "helpScript": "툇마루에서 따뜻한 차를 마실 때의 느낌을 골라보세요.",
        "prompt": "툇마루에서 마시는 따뜻한 대추차의 느낌을 골라보세요.",
        "imageSrc": "assets/images/warm_jujube_tea.jpg",
        "imageAlt": "툇마루에서 즐기는 따뜻한 대추차",
        "imageCaption": "🍵 5쪽 · 식후 툇마루에서 음미하는 따뜻한 대추차",
        "options": [
          {
            "text": "달콤한 대추 향에 기분까지 편안해져요",
            "emoji": "🍵",
            "isBest": true,
            "feedback": "은은한 단맛과 깊은 향기가 입안 가득 맴돌며 피로가 싹 가시지요."
          },
          {
            "text": "두 손에 전해지는 찻잔의 따스한 온기",
            "emoji": "🤲",
            "isBest": true,
            "feedback": "따뜻한 온기에 손발이 녹아내리고 마음까지 여유로워져요."
          },
          {
            "text": "마당을 내려다보며 마시는 차 한 잔의 여유",
            "emoji": "☀️",
            "isBest": true,
            "feedback": "평화로운 마당을 바라보며 마시던 그 시간이 참 소중한 휴식이었지요."
          }
        ]
      },
      {
        "stepNum": 6,
        "aiMessage": "차를 마시고 있는데 마당을 뛰놀던 바둑이가 꼬리를 치며 툇마루 앞으로 쪼르르 달려왔어요.",
        "screenText": "차를 마시고 있는데 마당을 뛰놀던 바둑이가 꼬리를 치며 툇마루 앞으로 쪼르르 달려왔어요.",
        "voiceScript": "바둑이가 툇마루 아래 턱을 괴고는 눈을 말똥말똥 뜨며 쳐다보네요. 언제나 내 곁을 지켜주던 세상에서 가장 착한 동무였지요.",
        "helpScript": "반갑게 다가온 바둑이에게 건네던 정다운 행동을 골라보세요.",
        "prompt": "마당 바둑이와 나누던 정겨운 추억을 골라보세요.",
        "imageSrc": "assets/images/ai_puppy_friend.jpg",
        "imageAlt": "정겹게 꼬리를 흔들며 마중 나오는 바둑이",
        "imageCaption": "🐶 6쪽 · 언제나 내 곁을 든든하게 지켜주던 우리 집 바둑이",
        "options": [
          {
            "text": "머리와 등을 부드럽게 쓰다듬어 주던 손길",
            "emoji": "🐕",
            "isBest": true,
            "feedback": "손길이 닿을 때마다 좋아서 꼬리를 살랑살랑 흔들던 모습이 눈에 선해요."
          },
          {
            "text": "어딜 가든 그림자처럼 졸졸 따라다니던 충성심",
            "emoji": "🐾",
            "isBest": true,
            "feedback": "들판에 일하러 갈 때도 앞장서서 뛰어가며 길동무가 되어주었지요."
          },
          {
            "text": "멀리서 발소리만 듣고도 대문 앞까지 뛰어나오던 반가움",
            "emoji": "🏠",
            "isBest": true,
            "feedback": "온몸으로 나를 반겨주던 세상에서 가장 듬직하고 고마운 친구였답니다."
          }
        ]
      },
      {
        "stepNum": 7,
        "aiMessage": "바둑이와 정답게 시간을 보내다 보니, 어느덧 서산 너머로 붉은 노을이 내려앉아 온 마을을 물들여요.",
        "screenText": "바둑이와 정답게 시간을 보내다 보니, 어느덧 서산 너머로 붉은 노을이 내려앉아 온 마을을 물들여요.",
        "voiceScript": "어르신, 저녁 하늘을 보세요. 초가지붕과 돌담길 너머로 붉은 저녁노을이 곱게 번져가고, 집집마다 저녁 밥 짓는 연기가 피어오르네요.",
        "helpScript": "노을 지는 고향 마을을 보며 드는 따뜻한 마음을 골라보세요.",
        "prompt": "노을빛 물든 고향 마을 풍경을 보며 어떤 생각이 드시나요?",
        "imageSrc": "assets/images/nostalgic_village_sunset.jpg",
        "imageAlt": "붉은 저녁노을빛이 평화롭게 물드는 고향 마을 전경",
        "imageCaption": "🏡 7쪽 · 은은한 저녁노을이 내려앉는 평화로운 고향 마을",
        "options": [
          {
            "text": "오늘 하루도 평온하고 감사한 하루였구나",
            "emoji": "🌅",
            "isBest": true,
            "feedback": "땀 흘려 일하고 돌아와 가족과 쉴 수 있던 평화롭고 고마운 저녁이지요."
          },
          {
            "text": "집집마다 굴뚝에서 피어나던 정다운 밥 냄새",
            "emoji": "💨",
            "isBest": true,
            "feedback": "동네 어귀에 구수한 밥 짓는 냄새가 퍼지면 엄마가 이름을 부르곤 하셨지요."
          },
          {
            "text": "세상 그 어떤 곳보다 아늑하고 따뜻했던 내 고향",
            "emoji": "🧡",
            "isBest": true,
            "feedback": "언제 떠올려도 어머니 품처럼 포근하게 감싸주는 그리운 고향이에요."
          }
        ]
      },
      {
        "stepNum": 8,
        "aiMessage": "아침 마당부터 저녁 노을까지, 오늘 함께 펼쳐본 고향의 하루 사진첩이 마음에 깊은 평안을 선물합니다.",
        "screenText": "아침 마당부터 저녁 노을까지, 오늘 함께 펼쳐본 고향의 하루 사진첩이 마음에 깊은 평안을 선물합니다.",
        "voiceScript": "어르신, 오늘 함께 거닐어본 고향 집의 하루, 어떠셨나요? 마음속에 간직된 따뜻한 추억은 언제나 우리를 환하게 비춰주는 등불이랍니다.",
        "helpScript": "오늘 추억의 사진 여행을 마친 소감을 골라보세요.",
        "prompt": "오늘 고향의 하루 사진첩을 함께 펼쳐본 소감을 골라보세요.",
        "imageSrc": "assets/images/story_hometown_album.jpg",
        "imageAlt": "가족들과의 따스한 추억이 깃든 고향의 추억 사진첩",
        "imageCaption": "🧡 8쪽 · 언제 떠올려도 마음이 푸근해지는 고향의 추억",
        "options": [
          {
            "text": "마음이 푸근해지고 그리운 시절이 생생해졌어요",
            "emoji": "🥰",
            "isBest": true,
            "feedback": "어르신의 마음에 따스한 봄볕 같은 행복이 가득 차올랐기를 소망해요!"
          },
          {
            "text": "정다운 사진들을 보니 옛 생각에 가슴이 뭉클해요",
            "emoji": "💐",
            "isBest": true,
            "feedback": "그리운 추억을 함께 나눌 수 있어서 저도 정말 행복하고 감사했습니다."
          },
          {
            "text": "오늘 하루도 좋은 추억을 안고 힘차게 살아갈게요!",
            "emoji": "👏",
            "isBest": true,
            "feedback": "멋진 말씀이에요! 어르신의 매일매일이 늘 건강과 기쁨으로 가득하시길 빕니다!"
          }
        ]
      }
    ]
  },
  {
    "id": "music",
    "icon": "🎵",
    "title": "흘러가는 옛노래",
    "summary": "치지직 도는 레트로 전축부터 그리운 옛 노래와 흥겨운 박수까지, 가슴 뭉클한 음악 소풍을 떠나요.",
    "steps": [
      {
        "stepNum": 1,
        "aiMessage": "치지직- 소리와 함께 바늘이 레코드판 위에 내려앉아요. 추억의 옛 노래 여행을 떠나볼까요?",
        "screenText": "치지직- 소리와 함께 바늘이 레코드판 위에 내려앉아요. 추억의 옛 노래 여행을 떠나볼까요?",
        "voiceScript": "어르신, 옛날 라디오나 까만 전축으로 정다운 노래를 듣던 기억이 나시나요? 오늘 가슴 따뜻해지는 음악 소풍을 함께 떠나보아요.",
        "helpScript": "옛 노래를 들을 때의 기분을 골라보세요.",
        "prompt": "추억의 전축 음악 소풍을 시작하며 어떤 생각이 드시나요?",
        "imageSrc": "assets/images/retro_turntable.jpg",
        "imageAlt": "바늘이 돌아가며 따뜻한 멜로디가 흐르는 추억의 레트로 전축 턴테이블",
        "imageCaption": "📻 1단계 · 치지직- 바늘 돌아가는 추억의 레트로 전축",
        "options": [
          {
            "text": "노랫가락만 들어도 가슴이 뭉클하고 설레요",
            "emoji": "🎶",
            "isBest": true,
            "feedback": "시절마다 함께 울고 웃던 노래들이 마음속 깊은 추억을 깨워주지요."
          },
          {
            "text": "가족들과 라디오 앞에 옹기종기 모이던 기억",
            "emoji": "📻",
            "isBest": true,
            "feedback": "작은 라디오 하나에 온 동네 사람과 가족이 귀를 기울이던 정겨운 시절이에요."
          },
          {
            "text": "오늘 신나게 노래 부르고 힐링하고 싶어요",
            "emoji": "🎤",
            "isBest": true,
            "feedback": "좋습니다! 오늘 가슴 활짝 열고 신나게 음악을 즐겨보아요!"
          }
        ]
      },
      {
        "stepNum": 2,
        "aiMessage": "첫 번째 노래는 우리 모두의 마음의 고향, ‘고향의 봄’이에요. 함께 귀 기울여 들어볼까요?",
        "screenText": "첫 번째 노래는 우리 모두의 마음의 고향, ‘고향의 봄’이에요. 함께 귀 기울여 들어볼까요?",
        "voiceScript": "나의 살던 고향은 꽃피는 산골, 복숭아꽃 살구꽃 아기 진달래… 아래 정겨운 노래 재생 버튼을 눌러 함께 감상해 보아요.",
        "helpScript": "가운데 재생 버튼을 눌러 노래를 들어보세요.",
        "prompt": "고향의 봄 노래를 감상하며 떠오르는 꽃을 골라보세요.",
        "customType": "youtube_music",
        "youtubeId": "XhjovE_9qps",
        "imageSrc": "assets/images/spring_flowers.jpg",
        "imageAlt": "복숭아꽃 살구꽃 피는 고향 산골 풍경",
        "imageCaption": "🌸 2단계 · 복숭아꽃 살구꽃 아기 진달래 피던 고향",
        "options": [
          {
            "text": "동산에 흐드러지게 핀 분홍 진달래",
            "emoji": "🌸",
            "isBest": true,
            "feedback": "진달래꽃 따서 잎에 물들이고 화전 부쳐 먹던 고향의 봄이 눈앞에 선하네요."
          },
          {
            "text": "울긋불긋 꽃 대궐 차리던 마을",
            "emoji": "🏡",
            "isBest": true,
            "feedback": "그 속에서 놀던 때가 그립습니다, 노랫말 한 구절 한 구절이 참 곱지요."
          },
          {
            "text": "냇가에서 불어오던 향긋한 꽃바람",
            "emoji": "🍃",
            "isBest": true,
            "feedback": "꽃향기 실어 나르던 따스한 봄바람의 감촉이 그대로 느껴지는 듯해요."
          }
        ]
      },
      {
        "stepNum": 3,
        "aiMessage": "봄 시냇가에서 조약돌을 던지며 동무들과 부르던 ‘퐁당퐁당’ 동요가 귓가에 맴돌아요.",
        "screenText": "봄 시냇가에서 조약돌을 던지며 동무들과 부르던 ‘퐁당퐁당’ 동요가 귓가에 맴돌아요.",
        "voiceScript": "퐁당퐁당 돌을 던지자, 누나 몰래 돌을 던지자! 시냇가에서 납작한 조약돌로 물수제비 뜨던 시절 기억나시나요?",
        "helpScript": "시냇가에서 뛰놀던 추억을 골라보세요.",
        "prompt": "시냇가 퐁당퐁당 노래를 들으며 떠오르는 추억을 골라보세요.",
        "imageSrc": "assets/images/stream_children_playing.jpg",
        "imageAlt": "맑은 시냇가 징검다리에서 조약돌 던지며 물장구치는 아이들과 다정한 어르신",
        "imageCaption": "🌊 3단계 · 퐁당퐁당 돌을 던지자, 맑은 시냇가 동무들",
        "options": [
          {
            "text": "물수제비 뜨며 통통 튀어가던 조약돌",
            "emoji": "💦",
            "isBest": true,
            "feedback": "조약돌이 물 위를 서너 번 튀어가면 동무들과 손뼉 치며 좋아했지요!"
          },
          {
            "text": "냇가에서 빨래하던 어머니와 누나 모습",
            "emoji": "🧺",
            "isBest": true,
            "feedback": "방망이로 탁탁 두드리며 빨래하던 소리가 시냇물 소리와 어우러졌지요."
          },
          {
            "text": "송사리와 가재 잡던 개구쟁이 시절",
            "emoji": "🐟",
            "isBest": true,
            "feedback": "바짓가랑이 걷어붙이고 물고기 잡느라 해 지는 줄도 몰랐던 날들이에요."
          }
        ]
      },
      {
        "stepNum": 4,
        "aiMessage": "어깨가 절로 들썩이는 우리 민요 ‘아리랑’! 신명나는 장구 장단에 맞추어 박수를 쳐볼까요?",
        "screenText": "어깨가 절로 들썩이는 우리 민요 ‘아리랑’! 신명나는 장구 장단에 맞추어 박수를 쳐볼까요?",
        "voiceScript": "아리랑 아리랑 아라리요, 아리랑 고개로 넘어간다! 덩기덕 쿵덕 신명나는 우리 가락에 맞춰 두 손으로 짝짝짝 박수를 쳐보세요.",
        "helpScript": "신명나는 아리랑 장단에 맞춘 손뼉을 골라보세요.",
        "prompt": "아리랑 장단에 맞춰 박수를 어떻게 쳐볼까요?",
        "imageSrc": "assets/images/arirang_janggu_dance.jpg",
        "imageAlt": "신명나는 장구 가락에 맞춰 어깨춤을 추고 박수를 치는 잔치 마당",
        "imageCaption": "🥁 4단계 · 덩기덕 쿵덕! 흥겨운 아리랑과 어깨춤",
        "options": [
          {
            "text": "얼씨구 좋다! 박수 짝짝짝 치며 어깨춤 덩실덩실",
            "emoji": "👏",
            "isBest": true,
            "feedback": "짝짝짝! 신명나는 박수를 치니 온몸의 혈액순환이 뻥 뚫리고 기운이 솟아나요!"
          },
          {
            "text": "지화자 좋다! 노래 가락에 마음을 실어봐요",
            "emoji": "💃",
            "isBest": true,
            "feedback": "우리 가락의 흥겨운 장단에 가슴속 응어리도 싹 날아가지요."
          },
          {
            "text": "십 리도 못 가서 발병 난다, 노랫말을 흥얼거려요",
            "emoji": "🎵",
            "isBest": true,
            "feedback": "온 백성의 한과 흥을 달래주던 세상에서 가장 위대한 우리 노래예요."
          }
        ]
      },
      {
        "stepNum": 5,
        "aiMessage": "이번엔 마이크를 잡고 가수가 되어보는 시간! 신나는 노래방 무대로 함께 올라가 볼까요?",
        "screenText": "이번엔 마이크를 잡고 가수가 되어보는 시간! 신나는 노래방 무대로 함께 올라가 볼까요?",
        "voiceScript": "자, 무대의 주인공은 바로 어르신입니다! 마이크를 잡고 신나게 한 곡 뽑아보세요. 박수도 치고 탬버린도 흔들어보아요.",
        "helpScript": "화면의 노래방 버튼을 눌러 신나게 노래와 박수를 즐겨보세요.",
        "prompt": "노래방 무대에서 노래를 부르시니 기분이 어떠신가요?",
        "customType": "karaoke_room",
        "imageSrc": "assets/images/karaoke_stage.jpg",
        "imageAlt": "신나는 노래방 무대와 조명",
        "imageCaption": "🎤 5단계 · 신명나는 노래방! 마이크 잡고 가수가 되어봐요",
        "options": [
          {
            "text": "가슴이 뻥 뚫리고 십 년은 젊어진 기분이에요!",
            "emoji": "🎤",
            "isBest": true,
            "feedback": "어르신의 열창에 온 동네가 들썩입니다! 100점 만점에 200점이에요! 👏"
          },
          {
            "text": "박수 치고 탬버린 흔드니 스트레스가 싹 풀려요",
            "emoji": "🥁",
            "isBest": true,
            "feedback": "찰랑찰랑 탬버린 소리와 함께 활력이 온몸에 가득 찹니다!"
          },
          {
            "text": "노래를 크게 부르니 속이 아주 시원해요",
            "emoji": "😆",
            "isBest": true,
            "feedback": "큰 소리로 노래 부르는 것이 바로 최고의 폐활량 건강 비법이랍니다!"
          }
        ]
      },
      {
        "stepNum": 6,
        "aiMessage": "신나게 목청껏 노래를 불렀으니, 도자기 잔에 담긴 따뜻한 대추차로 목을 부드럽게 축여볼까요?",
        "screenText": "신나게 목청껏 노래를 불렀으니, 도자기 잔에 담긴 따뜻한 대추차로 목을 부드럽게 축여볼까요?",
        "voiceScript": "신나게 노래를 부르셨으니 목이 기분 좋게 칼칼하시지요. 김이 모락모락 나는 달콤한 대추차 한 모금으로 목을 축여보세요.",
        "helpScript": "노래 부른 뒤 따뜻한 차를 마실 때의 느낌을 골라보세요.",
        "prompt": "노래 후 마시는 따뜻한 대추차의 느낌을 골라보세요.",
        "imageSrc": "assets/images/warm_jujube_tea.jpg",
        "imageAlt": "목을 부드럽게 축여주는 따뜻한 대추차",
        "imageCaption": "🍵 6단계 · 흥겨운 노래 뒤에 목을 축이는 따뜻한 차 한 잔",
        "options": [
          {
            "text": "목이 부드러워지고 온몸이 편안해져요",
            "emoji": "🍵",
            "isBest": true,
            "feedback": "따뜻한 차가 목을 촉촉하게 감싸주니 목소리가 더 고와지실 거예요."
          },
          {
            "text": "달콤한 온기가 피로를 싹 풀어주네요",
            "emoji": "🥰",
            "isBest": true,
            "feedback": "달콤한 대추의 단맛이 기분 좋은 미소를 머금게 해줍니다."
          },
          {
            "text": "차 한 잔 마시니 다음 곡도 또 부르고 싶어요",
            "emoji": "🎶",
            "isBest": true,
            "feedback": "노래 부르는 즐거움에 시간 가는 줄 모르겠지요!"
          }
        ]
      },
      {
        "stepNum": 7,
        "aiMessage": "마당 평상에 둘러앉아 맛있는 음식을 나누며 노래를 이어 부르던 잔칫날의 정겨운 추억이에요.",
        "screenText": "마당 평상에 둘러앉아 맛있는 음식을 나누며 노래를 이어 부르던 잔칫날의 정겨운 추억이에요.",
        "voiceScript": "동네 잔칫날이면 마당에 멍석을 깔고 음식을 나누며 해 질 녘까지 노래자랑을 펼치곤 했지요. 그 시절의 훈훈한 정이 그립습니다.",
        "helpScript": "이웃들과 노래하며 나누던 잔치 추억을 골라보세요.",
        "prompt": "이웃들과 노래하며 함께 음식을 나누던 추억을 골라보세요.",
        "imageSrc": "assets/images/story_brothers_dinner.jpg",
        "imageAlt": "노랫가락과 웃음꽃이 가득한 정겨운 마당 밥상",
        "imageCaption": "🍲 7단계 · 노랫가락과 웃음꽃이 가득한 마당 잔치",
        "options": [
          {
            "text": "모두가 하나 되어 숟가락 두드리며 흥겨웠던 시절",
            "emoji": "🥄",
            "isBest": true,
            "feedback": "찌개 뚝배기 놓고 숟가락 장단 맞춰 노래 부르던 그 신명나는 정겨움이지요!"
          },
          {
            "text": "음식을 서로 권하며 따뜻한 정을 나누던 기억",
            "emoji": "🍲",
            "isBest": true,
            "feedback": "네 것 내 것 없이 나누어 먹으며 이웃 사촌의 정을 돈독히 쌓았지요."
          },
          {
            "text": "온 동네에 웃음소리가 끊이지 않던 날들",
            "emoji": "🏡",
            "isBest": true,
            "feedback": "작은 일에도 함께 기뻐하고 웃어주던 참 따뜻한 공동체였답니다."
          }
        ]
      },
      {
        "stepNum": 8,
        "aiMessage": "음악에 맞춰 박수를 치고 노래를 흥얼거리면 뇌와 심장이 튼튼해져 무병장수하신답니다!",
        "screenText": "음악에 맞춰 박수를 치고 노래를 흥얼거리면 뇌와 심장이 튼튼해져 무병장수하신답니다!",
        "voiceScript": "어르신, 오늘 추억의 음악 소풍 어떠셨나요? 매일 좋아하는 노래를 한 곡씩 부르시면 마음도 젊어지고 100세까지 건강하시답니다!",
        "helpScript": "오늘 음악 소풍을 마친 신나는 소감을 골라보세요.",
        "prompt": "오늘 추억의 음악 소풍을 마친 소감을 골라보세요.",
        "imageSrc": "assets/images/ai_puppy_heart.jpg",
        "imageAlt": "음악과 박수로 건강해진 어르신 축하",
        "imageCaption": "👏 8단계 · 매일매일 노래하며 건강하고 젊게 살아요",
        "options": [
          {
            "text": "박수도 치고 노래도 부르니 온몸에 활력이 넘쳐요!",
            "emoji": "💪",
            "isBest": true,
            "feedback": "어르신의 밝은 목소리에 제 가슴도 벅차오릅니다! 짱짱하게 건강하세요!"
          },
          {
            "text": "옛 노래를 들으니 청춘 시절로 되돌아간 것 같아요",
            "emoji": "🌸",
            "isBest": true,
            "feedback": "마음은 언제나 청춘이십니다! 늘 그 고운 미소 간직하세요!"
          },
          {
            "text": "내일도 신나게 옛 노래 한 곡 또 부를래요",
            "emoji": "🎶",
            "isBest": true,
            "feedback": "매일매일 노래와 함께 신바람 나는 건강한 하루를 선물해 드릴게요!"
          }
        ]
      }
    ]
  },
  {
    "id": "art",
    "icon": "🎨",
    "title": "AI 그림 만들기",
    "summary": "스케치부터 꽃과 해바라기 채색, 노을 배경까지 차례대로 그려나가는 나만의 명작 풍경화예요.",
    "steps": [
      {
        "stepNum": 1,
        "aiMessage": "오늘은 어르신과 함께 화폭 위에 고향의 아름다운 풍경화를 차례대로 그려볼게요. 먼저 고향 마을 밑그림을 스케치해 볼까요?",
        "screenText": "오늘은 어르신과 함께 화폭 위에 고향의 아름다운 풍경화를 차례대로 그려볼게요. 먼저 고향 마을 밑그림을 스케치해 볼까요?",
        "voiceScript": "어르신, 하얀 도화지 위에 연필을 쥐고 정다운 우리 고향 마을 풍경을 그려보아요. 초가지붕과 돌담길이 참 평화롭지요?",
        "helpScript": "풍경화 스케치에서 가장 먼저 담고 싶은 모습을 골라보세요.",
        "prompt": "고향 마을 스케치에서 가장 먼저 그리고 싶은 곳은 어디인가요?",
        "sketchImageSrc": "assets/images/nostalgic_village_sketch.jpg",
        "initialCaption": "✏️ 1단계 밑그림 · 아래에서 먼저 그리고 싶은 곳을 직접 골라보세요!",
        "imageSrc": "assets/images/nostalgic_village.jpg",
        "imageAlt": "화폭에 펼쳐진 정겨운 고향 마을 풍경",
        "imageCaption": "🎨 1단계 · 화폭에 펼쳐진 정겨운 고향 마을 풍경",
        "options": [
          {
            "text": "나지막한 돌담길과 둥근 초가지붕",
            "emoji": "🏡",
            "imageSrc": "assets/images/nostalgic_village.jpg",
            "isBest": true,
            "feedback": "둥글둥글 박이 열리던 초가지붕과 정겨운 돌담길 스케치가 완벽해요!"
          },
          {
            "text": "마을 뒤를 든든하게 받쳐주는 고향 동산",
            "emoji": "⛰️",
            "imageSrc": "assets/images/village_green_mountain.jpg",
            "isBest": true,
            "feedback": "어머니 품처럼 포근하게 감싸 안아주는 산자락이 도화지에 담겼네요."
          },
          {
            "text": "돌담 옆을 졸졸 흘러가는 맑은 시냇물",
            "emoji": "🌊",
            "imageSrc": "assets/images/village_clear_stream.jpg",
            "isBest": true,
            "feedback": "맑은 물길 스케치에 그림이 한층 더 맑고 깨끗해졌어요."
          }
        ]
      },
      {
        "stepNum": 2,
        "aiMessage": "스케치한 동산 위에 붓으로 곱디고운 분홍빛 물감을 얹어 화사한 봄꽃을 피워볼까요?",
        "screenText": "스케치한 동산 위에 붓으로 곱디고운 분홍빛 물감을 얹어 화사한 봄꽃을 피워볼까요?",
        "voiceScript": "물감 팔레트에서 분홍빛 봄 물감을 콕 찍어 언덕에 톡톡 칠해보세요. 진달래꽃과 복숭아꽃이 활짝 피어나며 봄기운이 가득 차오릅니다.",
        "helpScript": "동산에 입히고 싶은 고운 꽃빛깔을 골라보세요.",
        "prompt": "동산에 어떤 꽃빛깔 물감을 칠해볼까요?",
        "sketchImageSrc": "assets/images/spring_flowers_sketch.jpg",
        "initialCaption": "✏️ 2단계 밑그림 · 동산에 입힐 꽃빛깔을 아래 보기에서 골라보세요!",
        "imageSrc": "assets/images/spring_flowers.jpg",
        "imageAlt": "화폭에 피어난 분홍빛 봄꽃 동산",
        "imageCaption": "🌸 2단계 · 고운 분홍빛 물감으로 채색한 봄 동산",
        "options": [
          {
            "text": "눈부시게 화사한 분홍 진달래 꽃빛",
            "emoji": "🌸",
            "imageSrc": "assets/images/spring_flowers.jpg",
            "isBest": true,
            "feedback": "온 산이 은은한 분홍빛으로 물들어 화폭에서 향긋한 꽃내음이 나는 듯해요!"
          },
          {
            "text": "따뜻한 햇살을 머금은 살구꽃 연분홍빛",
            "emoji": "🌺",
            "imageSrc": "assets/images/spring_apricot_blossom.jpg",
            "isBest": true,
            "feedback": "수줍게 피어난 살구꽃 봉오리가 그림을 한층 더 다정하게 만들어줍니다."
          },
          {
            "text": "싱그럽고 푸릇푸릇한 새싹 연둣빛",
            "emoji": "🌱",
            "imageSrc": "assets/images/spring_fresh_green_hill.jpg",
            "isBest": true,
            "feedback": "파릇파릇 돋아나는 새잎들이 봄의 강인한 생명력을 더해주네요."
          }
        ]
      },
      {
        "stepNum": 3,
        "aiMessage": "이제 마당 입구에 커다란 붓으로 태양처럼 활짝 웃는 샛노란 해바라기를 그려 넣을 차례예요.",
        "screenText": "이제 마당 입구에 커다란 붓으로 태양처럼 활짝 웃는 샛노란 해바라기를 그려 넣을 차례예요.",
        "voiceScript": "노란 물감을 듬뿍 묻혀 둥글고 탐스러운 해바라기 꽃잎을 한 장 한 장 그려보세요. 마당이 금세 환하고 따스해집니다.",
        "helpScript": "해바라기 꽃을 채색할 때의 느낌을 골라보세요.",
        "prompt": "마당 해바라기 꽃잎을 어떤 모양으로 그릴까요?",
        "sketchImageSrc": "assets/images/korean_sunflower_sketch.jpg",
        "initialCaption": "✏️ 3단계 밑그림 · 마당 해바라기 모양을 아래 보기에서 골라보세요!",
        "imageSrc": "assets/images/korean_sunflower.jpg",
        "imageAlt": "마당을 밝히는 노란 해바라기 꽃 채색",
        "imageCaption": "🌻 3단계 · 마당을 환하게 밝히는 탐스러운 해바라기",
        "options": [
          {
            "text": "해님처럼 둥글고 활짝 펼쳐진 탐스러운 꽃잎",
            "emoji": "🌻",
            "imageSrc": "assets/images/korean_sunflower.jpg",
            "isBest": true,
            "feedback": "금빛 꽃잎들이 활짝 펼쳐져 그림을 보는 사람마다 미소를 짓게 하네요!"
          },
          {
            "text": "장독대 곁에서 해를 따라 고개 든 키 큰 줄기",
            "emoji": "🌿",
            "imageSrc": "assets/images/sunflower_near_pots.jpg",
            "isBest": true,
            "feedback": "줄기가 곧고 씩씩해서 마당을 든든하게 지켜주는 수호신 같아요."
          },
          {
            "text": "씨앗이 알알이 여물어가는 풍성한 꽃밥",
            "emoji": "✨",
            "imageSrc": "assets/images/sunflower_seed_head.jpg",
            "isBest": true,
            "feedback": "가을의 풍요로움까지 미리 약속해 주는 멋진 붓 터치입니다."
          }
        ]
      },
      {
        "stepNum": 4,
        "aiMessage": "해바라기 아래 마당에서 꼬리를 살랑살랑 흔들며 뛰노는 귀여운 바둑이를 그려 넣어요.",
        "screenText": "해바라기 아래 마당에서 꼬리를 살랑살랑 흔들며 뛰노는 귀여운 바둑이를 그려 넣어요.",
        "voiceScript": "붓끝으로 바둑이의 까만 눈망울과 복슬복슬한 털을 그려주세요. 꼬리를 치며 반갑게 뛰노는 모습에 그림이 살아 숨 쉬는 것 같아요.",
        "helpScript": "바둑이에게 선물하고 싶은 다정한 표정을 골라보세요.",
        "prompt": "그림 속 바둑이에게 어떤 표정을 선물해 줄까요?",
        "sketchImageSrc": "assets/images/ai_puppy_friend_sketch.jpg",
        "initialCaption": "✏️ 4단계 밑그림 · 바둑이에게 줄 표정을 아래 보기에서 골라보세요!",
        "imageSrc": "assets/images/ai_puppy_friend.jpg",
        "imageAlt": "마당에서 뛰노는 귀여운 바둑이 모습",
        "imageCaption": "🐶 4단계 · 그림에 생기를 불어넣는 귀여운 바둑이",
        "options": [
          {
            "text": "주인을 보고 반갑다고 활짝 웃는 표정",
            "emoji": "🐕",
            "imageSrc": "assets/images/ai_puppy_friend.jpg",
            "isBest": true,
            "feedback": "어르신을 향해 방긋 웃는 바둑이의 표정이 정말 사랑스러워요!"
          },
          {
            "text": "마당을 신나게 달리며 꼬리 치는 모습",
            "emoji": "🐾",
            "imageSrc": "assets/images/baduki_running_yard.jpg",
            "isBest": true,
            "feedback": "바둑이의 힘찬 발걸음에 화폭 가득 즐거움과 생동감이 넘칩니다."
          },
          {
            "text": "툇마루 곁에 다소곳이 엎드려 기다리는 눈망울",
            "emoji": "👀",
            "imageSrc": "assets/images/baduki_lying_porch.jpg",
            "isBest": true,
            "feedback": "주인 곁을 묵묵히 지켜주는 충성스러운 마음씨가 그림에 묻어나네요."
          }
        ]
      },
      {
        "stepNum": 5,
        "aiMessage": "그림을 감상하며 잠시 쉬어갈 수 있도록, 툇마루 위에 김이 모락모락 나는 따뜻한 찻잔을 그려 넣어요.",
        "screenText": "그림을 감상하며 잠시 쉬어갈 수 있도록, 툇마루 위에 김이 모락모락 나는 따뜻한 찻잔을 그려 넣어요.",
        "voiceScript": "도자기 잔에 은은한 대추차가 담겨 있는 모습을 정성스레 채색해 보아요. 하얀 김이 피어오르는 모습까지 섬세하게 표현해 볼까요?",
        "helpScript": "찻잔 위로 피어오르는 온기를 어떻게 그릴지 골라보세요.",
        "prompt": "찻잔 위로 피어오르는 온기를 어떻게 표현할까요?",
        "sketchImageSrc": "assets/images/warm_jujube_tea_sketch.jpg",
        "initialCaption": "✏️ 5단계 밑그림 · 찻잔 온기 표현을 아래 보기에서 골라보세요!",
        "imageSrc": "assets/images/warm_jujube_tea.jpg",
        "imageAlt": "툇마루에 놓인 따뜻한 도자기 찻잔",
        "imageCaption": "🍵 5단계 · 모락모락 김이 피어오르는 정갈한 찻잔",
        "options": [
          {
            "text": "부드럽고 몽실몽실하게 피어오르는 하얀 김",
            "emoji": "♨️",
            "imageSrc": "assets/images/warm_jujube_tea.jpg",
            "isBest": true,
            "feedback": "하얀 김이 은은하게 번져나가며 그림 전체에 따뜻한 온기를 불어넣어 주네요."
          },
          {
            "text": "윤이 나는 고풍스러운 갈색 도자기 잔",
            "emoji": "🍵",
            "imageSrc": "assets/images/teacup_ceramic_antique.jpg",
            "isBest": true,
            "feedback": "단아한 도자기 질감이 정겨운 시골집 툇마루와 완벽하게 어울려요."
          },
          {
            "text": "차 위에 동동 띄운 붉은 대추 고명",
            "emoji": "🍵",
            "imageSrc": "assets/images/teacup_jujube_garnish.jpg",
            "isBest": true,
            "feedback": "대추 고명 하나로 찻잔에 정성과 품격이 듬뿍 더해졌답니다."
          }
        ]
      },
      {
        "stepNum": 6,
        "aiMessage": "찻잔 옆에는 가을 들녘의 넉넉함을 담아 싱싱한 과일이 가득 담긴 풍성한 바구니를 채색해요.",
        "screenText": "찻잔 옆에는 가을 들녘의 넉넉함을 담아 싱싱한 과일이 가득 담긴 풍성한 바구니를 채색해요.",
        "voiceScript": "빨간 사과와 탐스러운 과일들을 알록달록 색칠해 보세요. 수확의 기쁨과 풍요로움이 화폭 가득 넘쳐납니다.",
        "helpScript": "과일 바구니에서 가장 먼저 색칠하고 싶은 과일을 골라보세요.",
        "prompt": "바구니에서 가장 먼저 칠하고 싶은 과일은 무엇인가요?",
        "sketchImageSrc": "assets/images/fruits_basket_sketch.jpg",
        "initialCaption": "✏️ 6단계 밑그림 · 먼저 칠하고 싶은 과일을 아래 보기에서 골라보세요!",
        "imageSrc": "assets/images/fruits_basket.jpg",
        "imageAlt": "화폭에 채색된 풍성한 과일 바구니",
        "imageCaption": "🍎 6단계 · 가을의 풍요로움을 더해주는 과일 바구니",
        "options": [
          {
            "text": "반짝반짝 윤이 나는 탐스러운 빨간 사과",
            "emoji": "🍎",
            "isBest": true,
            "feedback": "새빨간 사과가 그림의 한가운데를 보석처럼 환하게 밝혀주네요!"
          },
          {
            "text": "달콤한 꿀맛이 가득 밴 노란 배",
            "emoji": "🍐",
            "isBest": true,
            "feedback": "시원하고 달콤한 배의 빛깔이 아주 먹음직스럽게 표현되었어요."
          },
          {
            "text": "주렁주렁 탐스럽게 맺힌 보랏빛 포도 송이",
            "emoji": "🍇",
            "isBest": true,
            "feedback": "알알이 영근 포도송이가 화폭에 풍성한 결실을 선물해 줍니다."
          }
        ]
      },
      {
        "stepNum": 7,
        "aiMessage": "이제 풍경화의 배경 전체에 따스하고 은은한 황금빛 저녁노을을 넓은 붓으로 펴 발라요.",
        "screenText": "이제 풍경화의 배경 전체에 따스하고 은은한 황금빛 저녁노을을 넓은 붓으로 펴 발라요.",
        "voiceScript": "주홍빛과 금빛 물감을 섞어 하늘과 지붕 위에 부드럽게 칠해주세요. 온 마을이 노을빛에 감싸이며 가슴 뭉클한 감동을 선사합니다.",
        "helpScript": "노을빛 배경이 더해진 풍경화의 느낌을 골라보세요.",
        "prompt": "황금빛 노을이 더해지니 우리 풍경화가 어떻게 변했나요?",
        "sketchImageSrc": "assets/images/nostalgic_village_sunset_sketch.jpg",
        "initialCaption": "✏️ 7단계 밑그림 · 온 세상을 감쌀 노을 느낌을 아래 보기에서 골라보세요!",
        "imageSrc": "assets/images/nostalgic_village_sunset.jpg",
        "imageAlt": "붉은 저녁노을로 완성되어가는 고향 마을 풍경화",
        "imageCaption": "🌅 7단계 · 온 세상을 포근하게 감싸는 황금빛 노을",
        "options": [
          {
            "text": "가슴이 뭉클해질 만큼 포근하고 따뜻해졌어요",
            "emoji": "🌅",
            "isBest": true,
            "feedback": "노을빛이 모든 풍경을 따스하게 안아주며 최고의 명작으로 거듭났어요."
          },
          {
            "text": "마치 진짜 고향 마을에 서 있는 것처럼 생생해요",
            "emoji": "🏡",
            "isBest": true,
            "feedback": "어르신의 손길이 닿아 그림에 살아있는 고향의 영혼이 깃들었답니다."
          },
          {
            "text": "바라보기만 해도 마음의 근심이 눈 녹듯 사라져요",
            "emoji": "✨",
            "isBest": true,
            "feedback": "진정한 예술이 주는 평안과 치유의 힘이 화폭 가득 빛나고 있어요."
          }
        ]
      },
      {
        "stepNum": 8,
        "aiMessage": "어르신의 고운 감성과 붓 터치로 세상에 단 하나뿐인 위대한 명작 풍경화가 완성되었습니다!",
        "screenText": "어르신의 고운 감성과 붓 터치로 세상에 단 하나뿐인 위대한 명작 풍경화가 완성되었습니다!",
        "voiceScript": "짝짝짝! 축하드립니다! 어르신께서 직접 완성하신 명작 풍경화예요. 멋진 액자에 담아 거실에 걸어두면 매일매일 행복한 웃음꽃이 필 거예요!",
        "helpScript": "완성된 풍경화를 감상하는 자랑스러운 소감을 골라보세요.",
        "prompt": "완성된 세상 최고의 명작 풍경화를 어디에 걸어두고 싶으신가요?",
        "sketchImageSrc": "assets/images/ai_puppy_heart_sketch.jpg",
        "initialCaption": "✏️ 8단계 밑그림 · 완성 액자를 걸어둘 곳을 아래 보기에서 골라보세요!",
        "imageSrc": "assets/images/ai_puppy_heart.jpg",
        "imageAlt": "세상 최고의 명작 풍경화 완성 축하",
        "imageCaption": "🖼️ 8단계 · 어르신과 함께 완성한 세상 최고의 명작 액자",
        "options": [
          {
            "text": "우리 집 가장 잘 보이는 거실 한가운데 걸어둘래요",
            "emoji": "🖼️",
            "isBest": true,
            "feedback": "집안 전체가 환해지고 손주들이 보면 박수갈채를 보낼 거예요! 👏"
          },
          {
            "text": "내가 직접 이렇게 멋진 그림을 완성하다니 참 뿌듯해요",
            "emoji": "🥰",
            "isBest": true,
            "feedback": "어르신의 예술적 재능이 정말 눈부십니다! 참 잘하셨어요!"
          },
          {
            "text": "매일매일 바라보며 고향의 정겨움을 느낄래요",
            "emoji": "🧡",
            "isBest": true,
            "feedback": "어르신의 삶에도 이 그림처럼 늘 평화롭고 따스한 복이 넘쳐나시길 기도해요!"
          }
        ]
      }
    ]
  },
  {
    "id": "memory",
    "icon": "🧠",
    "title": "기억 놀이",
    "summary": "과일 바구니 관찰부터 봄꽃과 전통 장독대까지, 오감을 자극하며 기억력을 총명하게 깨워요.",
    "steps": [
      {
        "stepNum": 1,
        "aiMessage": "오늘 장에서 싱싱한 과일을 한 바구니 가득 담아왔어요. 어떤 과일들이 있는지 눈여겨보세요!",
        "screenText": "오늘 장에서 싱싱한 과일을 한 바구니 가득 담아왔어요. 어떤 과일들이 있는지 눈여겨보세요!",
        "voiceScript": "어르신, 바구니 속에 탐스러운 과일들이 가득 담겨 있지요? 빨갛고 노란 과일들의 모양과 위치를 잘 기억해 두세요. 잠시 후에 퀴즈가 나옵니다!",
        "helpScript": "바구니 속 과일을 잘 살펴보고 질문에 답해 보세요.",
        "prompt": "바구니 한가운데에 놓인 새빨간 과일은 무엇일까요?",
        "imageSrc": "assets/images/fruits_basket.jpg",
        "imageAlt": "싱싱한 과일이 가득 담긴 풍성한 바구니",
        "imageCaption": "🍎 1단계 · 바구니 속 싱싱한 과일을 잘 기억해 두세요",
        "options": [
          {
            "text": "사과",
            "emoji": "🍎",
            "isBest": true,
            "feedback": "맞아요! 새빨갛고 탐스러운 사과예요. 눈썰미가 아주 정확하시네요!"
          },
          {
            "text": "수박",
            "emoji": "🍉",
            "feedback": "괜찮아요. 바구니 한가운데에 놓인 것은 붉고 둥근 사과랍니다."
          },
          {
            "text": "바나나",
            "emoji": "🍌",
            "feedback": "괜찮아요. 샛노란 바나나 옆에 놓인 탐스러운 과일은 바로 사과예요."
          }
        ]
      },
      {
        "stepNum": 2,
        "aiMessage": "방금 보았던 과일들을 카드로 뒤집어 짝을 맞춰보는 신나는 두뇌 카드 짝맞추기 놀이예요!",
        "screenText": "방금 보았던 과일들을 카드로 뒤집어 짝을 맞춰보는 신나는 두뇌 카드 짝맞추기 놀이예요!",
        "voiceScript": "아래 카드들을 손가락으로 가볍게 눌러 뒤집어보세요. 같은 그림을 가진 짝을 찾아 맞춰보아요.",
        "helpScript": "화면의 카드를 눌러 같은 과일 짝을 맞춰보세요.",
        "prompt": "뒤집힌 카드를 눌러 같은 과일 짝을 맞춰보세요.",
        "customType": "memory_game",
        "imageSrc": "assets/images/fruits_basket.jpg",
        "imageAlt": "두뇌 기억력 카드 짝맞추기 놀이",
        "imageCaption": "🧠 2단계 · 뒤집힌 카드를 눌러 같은 과일 짝을 찾아보세요",
        "options": [
          {
            "text": "사과와 바나나 짝을 완벽히 찾았어요!",
            "emoji": "🎯",
            "isBest": true,
            "feedback": "정답입니다! 순발력과 집중력이 청년처럼 아주 기가 막히세요! 👏"
          },
          {
            "text": "차근차근 하나씩 찾아보았어요",
            "emoji": "🧐",
            "isBest": true,
            "feedback": "침착하게 집중하시는 모습이 정말 멋지십니다! 두뇌가 번쩍 깨어났어요."
          },
          {
            "text": "과일 모양을 머릿속에 쏙 외웠어요",
            "emoji": "💡",
            "isBest": true,
            "feedback": "기억력 비타민이 머릿속에 가득 충전되었네요! 참 잘하셨어요!"
          }
        ]
      },
      {
        "stepNum": 3,
        "aiMessage": "꿀이 꽉 찬 빨간 사과를 한 입 베어 물었을 때의 맛을 떠올려보세요. 껍질은 무슨 색깔이었나요?",
        "screenText": "꿀이 꽉 찬 빨간 사과를 한 입 베어 물었을 때의 맛을 떠올려보세요. 껍질은 무슨 색깔이었나요?",
        "voiceScript": "아삭! 사과를 베어 물면 달콤한 과즙이 입안 가득 퍼지지요. 잘 익은 사과의 껍질 색깔을 골라보세요.",
        "helpScript": "사과의 색깔을 보기에서 선택해 보세요.",
        "prompt": "탐스럽게 잘 익은 사과의 껍질 색깔은 무엇인가요?",
        "imageSrc": "assets/images/fruits_basket.jpg",
        "imageAlt": "새콤달콤 빨간 사과 클로즈업",
        "imageCaption": "🍎 3단계 · 입안 가득 아삭함이 퍼지는 빨간 사과",
        "options": [
          {
            "text": "선명한 빨간색",
            "emoji": "🔴",
            "isBest": true,
            "feedback": "딩동댕! 백설공주도 반할 만큼 예쁜 빨간색 사과지요. 백점입니다!"
          },
          {
            "text": "새파란 파란색",
            "emoji": "🔵",
            "feedback": "파란 사과도 있지만, 우리가 본 탐스러운 사과는 먹음직스러운 빨간색이에요."
          },
          {
            "text": "까만 검은색",
            "emoji": "⚫",
            "feedback": "잘 익은 탐스러운 사과는 정열적인 고운 빨간색이랍니다."
          }
        ]
      },
      {
        "stepNum": 4,
        "aiMessage": "이번엔 봄으로 기억 여행을 떠나요. 봄마다 고향 동산에 흐드러지게 피어 화전도 부쳐 먹던 꽃은?",
        "screenText": "이번엔 봄으로 기억 여행을 떠나요. 봄마다 고향 동산에 흐드러지게 피어 화전도 부쳐 먹던 꽃은?",
        "voiceScript": "봄바람이 살랑살랑 불면 온 동산을 분홍빛으로 물들이던 꽃이지요. 찹쌀 반죽 위에 꽃잎 올려 지져 먹던 이 꽃의 이름은 무엇일까요?",
        "helpScript": "봄 동산에 피어 화전을 만들던 꽃 이름을 골라보세요.",
        "prompt": "봄 동산에 가득 피어 화전도 부쳐 먹던 이 꽃의 이름은?",
        "imageSrc": "assets/images/single_azalea_flower.jpg",
        "imageAlt": "탐스럽게 피어난 분홍 진달래꽃 한 송이",
        "imageCaption": "🌸 4단계 · 봄마다 화전을 부쳐 먹던 고운 봄꽃",
        "options": [
          {
            "text": "진달래꽃",
            "emoji": "🌸",
            "isBest": true,
            "feedback": "맞습니다! 봄을 알리는 고운 진달래꽃이지요. 어릴 적 추억이 생생하게 살아나네요."
          },
          {
            "text": "국화꽃",
            "emoji": "🌼",
            "feedback": "국화는 가을에 피는 꽃이지요. 봄날 화전을 부쳐 먹던 꽃은 분홍 진달래랍니다."
          },
          {
            "text": "동백꽃",
            "emoji": "🌺",
            "feedback": "동백꽃은 겨울에 피지요. 봄 동산에 흐드러지게 피던 꽃은 바로 진달래예요."
          }
        ]
      },
      {
        "stepNum": 5,
        "aiMessage": "여름날 시골집 마당에서 해님을 따라 고개를 돌리던 키 큰 노란 꽃의 이름을 기억하시나요?",
        "screenText": "여름날 시골집 마당에서 해님을 따라 고개를 돌리던 키 큰 노란 꽃의 이름을 기억하시나요?",
        "voiceScript": "태양을 쏙 빼닮아서 해를 바라본다는 뜻을 가진 꽃이지요. 키가 담장보다 훌쩍 크던 이 꽃의 이름은 무엇일까요?",
        "helpScript": "해를 닮은 노란 꽃의 이름을 골라보세요.",
        "prompt": "해를 쏙 빼닮은 이 키 큰 노란 꽃의 이름은 무엇일까요?",
        "imageSrc": "assets/images/korean_sunflower.jpg",
        "imageAlt": "해를 향해 활짝 핀 노란 해바라기",
        "imageCaption": "🌻 5단계 · 여름 하늘 아래 활짝 핀 키 큰 노란 꽃",
        "options": [
          {
            "text": "해바라기",
            "emoji": "🌻",
            "isBest": true,
            "feedback": "딩동댕! 정답입니다. 해를 바라는 밝은 꽃, 해바라기예요. 기억력이 정말 탁월하세요!"
          },
          {
            "text": "나팔꽃",
            "emoji": "🎺",
            "feedback": "나팔꽃도 예쁘지만, 해를 닮아 크고 노란 꽃잎을 가진 꽃은 해바라기랍니다."
          },
          {
            "text": "채송화",
            "emoji": "🌷",
            "feedback": "채송화는 땅에 낮게 피지요. 담장 위로 키가 쑥쑥 자라던 꽃은 해바라기예요."
          }
        ]
      },
      {
        "stepNum": 6,
        "aiMessage": "우리 집 마당 장독대 항아리 뚜껑을 열었을 때, 구수한 냄새를 풍기던 우리 전통 양념은?",
        "screenText": "우리 집 마당 장독대 항아리 뚜껑을 열었을 때, 구수한 냄새를 풍기던 우리 전통 양념은?",
        "voiceScript": "콩을 발효시켜 어머니 손맛으로 정성껏 담근 찌개 필수 양념이지요. 뚝배기에 한 숟갈 넣고 끓이면 일품인 이 양념은 무엇일까요?",
        "helpScript": "장독대에 담긴 구수한 찌개 양념을 골라보세요.",
        "prompt": "찌개를 끓일 때 넣는 구수한 우리 전통 양념은 무엇인가요?",
        "imageSrc": "assets/images/story_courtyard_sunflower.jpg",
        "imageAlt": "마당 장독대에 정성껏 담긴 전통 장",
        "imageCaption": "🏺 6단계 · 우리 집 마당 장독대에 담긴 보물 양념",
        "options": [
          {
            "text": "된장",
            "emoji": "🍲",
            "isBest": true,
            "feedback": "맞아요! 구수한 된장찌개의 주인공, 된장이지요! 어머니의 깊은 손맛이 떠오릅니다."
          },
          {
            "text": "케첩",
            "emoji": "🥫",
            "feedback": "서양 소스도 좋지만, 우리 장독대 항아리에 가득 담긴 보물은 바로 된장이랍니다."
          },
          {
            "text": "초콜릿",
            "emoji": "🍫",
            "feedback": "달콤한 초콜릿 대신, 어머니께서 정성스레 담그신 구수한 양념은 된장이에요."
          }
        ]
      },
      {
        "stepNum": 7,
        "aiMessage": "도자기 잔에 따뜻하게 달여 마시던, 붉고 주름진 달콤한 열매가 들어간 전통차는 무엇일까요?",
        "screenText": "도자기 잔에 따뜻하게 달여 마시던, 붉고 주름진 달콤한 열매가 들어간 전통차는 무엇일까요?",
        "voiceScript": "가을이면 나무에서 털어 말리던 달콤한 보약 열매지요. 따뜻하게 우려내어 잣과 함께 띄워 마시던 이 차의 이름은 무엇일까요?",
        "helpScript": "달콤하고 따뜻한 전통차의 이름을 골라보세요.",
        "prompt": "이 달콤하고 따뜻한 전통차의 이름은 무엇일까요?",
        "imageSrc": "assets/images/warm_jujube_tea.jpg",
        "imageAlt": "대추를 정성껏 우려낸 따뜻한 전통 대추차",
        "imageCaption": "🍵 7단계 · 따뜻한 전통차에 띄운 보약 열매",
        "options": [
          {
            "text": "대추차",
            "emoji": "🍵",
            "isBest": true,
            "feedback": "정답입니다! 속을 따뜻하게 데워주고 기운을 돋워주는 달콤한 대추차지요!"
          },
          {
            "text": "시원한 냉수",
            "emoji": "💧",
            "feedback": "냉수도 시원하지만, 찻잔에 모락모락 김이 피어오르는 건강차는 대추차예요."
          },
          {
            "text": "탄산음료",
            "emoji": "🥤",
            "feedback": "정성껏 우려낸 우리 고유의 은은하고 달콤한 약차는 바로 대추차랍니다."
          }
        ]
      },
      {
        "stepNum": 8,
        "aiMessage": "축하드립니다! 모든 퀴즈를 하나도 빠짐없이 완벽하게 맞히셨어요. 기억력 100점 만점왕이십니다!",
        "screenText": "축하드립니다! 모든 퀴즈를 하나도 빠짐없이 완벽하게 맞히셨어요. 기억력 100점 만점왕이십니다!",
        "voiceScript": "짝짝짝! 어르신의 총명함과 기억력은 청년 못지않게 놀랍습니다! 이렇게 매일매일 재미있게 기억을 떠올리시면 100세까지 뇌 건강은 걱정 없으십니다!",
        "helpScript": "오늘 기억 놀이 100점 만점을 축하하는 소감을 골라보세요.",
        "prompt": "오늘 기억 놀이 퀴즈를 모두 멋지게 푸신 소감은 어떠신가요?",
        "imageSrc": "assets/images/ai_puppy_heart.jpg",
        "imageAlt": "기억 놀이 100점 만점 축하와 두뇌 건강 축복",
        "imageCaption": "🏆 8단계 · 총명하고 건강한 두뇌! 100점 만점입니다",
        "options": [
          {
            "text": "머리가 아주 맑아지고 자신감이 넘쳐요!",
            "emoji": "🧠",
            "isBest": true,
            "feedback": "최고예요! 맑아진 두뇌로 오늘 하루도 더욱 활기차게 보내세요!"
          },
          {
            "text": "옛 기억들을 하나하나 떠올리니 참 즐거웠어요",
            "emoji": "🥰",
            "isBest": true,
            "feedback": "소중한 추억을 회상하는 것만으로도 뇌 신경세포가 튼튼하게 활성화된답니다."
          },
          {
            "text": "내일도 두뇌 퀴즈에 또 도전할게요!",
            "emoji": "👏",
            "isBest": true,
            "feedback": "네! 내일도 더 신나고 재미있는 두뇌 놀이로 찾아뵙겠습니다!"
          }
        ]
      }
    ]
  },
  {
    "id": "smartphone",
    "icon": "📱",
    "title": "스마트폰 배우기",
    "summary": "글자 크기 키우기부터 사랑의 문자 보내기, 카메라 촬영과 전화 받기까지 쉽고 재미있게 배워요.",
    "steps": [
      {
        "stepNum": 1,
        "aiMessage": "스마트폰 화면의 작은 글자 때문에 눈이 피로하셨지요? 큰 글자로 시원하게 바꾸는 방법을 배워볼까요?",
        "screenText": "스마트폰 화면의 작은 글자 때문에 눈이 피로하셨지요? 큰 글자로 시원하게 바꾸는 방법을 배워볼까요?",
        "voiceScript": "어르신, 스마트폰 글자가 너무 작아서 보기 힘드셨나요? 화면 가운데 ‘글자 크게 보기’ 버튼을 톡 눌러보세요. 글자가 시원하게 커집니다.",
        "helpScript": "화면의 파란색 버튼을 눌러 글자 크기를 키워보세요.",
        "prompt": "가운데 버튼을 눌러 글자 크기를 시원하게 키워보세요.",
        "customType": "phone_demo_font",
        "imageSrc": "assets/images/smartphone_touch.jpg",
        "imageAlt": "스마트폰 화면을 편안하게 터치하는 손길",
        "imageCaption": "🔍 1단계 · 돋보기 없이도 시원하게 보이는 큰 글자 설정",
        "options": [
          {
            "text": "글자가 큼직해져서 눈이 아주 시원해요!",
            "emoji": "👀",
            "isBest": true,
            "feedback": "참 잘하셨어요! 이제 돋보기 없이도 편안하게 글자를 읽으실 수 있어요."
          },
          {
            "text": "버튼을 톡 누르니 정말 커지네요, 신기해요",
            "emoji": "✨",
            "isBest": true,
            "feedback": "버튼 하나로 내 눈에 딱 맞게 조절할 수 있으니 정말 편리하지요."
          }
        ]
      },
      {
        "stepNum": 2,
        "aiMessage": "자녀나 손주에게 따뜻한 사랑의 하트 이모티콘을 문자로 쏙 보내볼까요?",
        "screenText": "자녀나 손주에게 따뜻한 사랑의 하트 이모티콘을 문자로 쏙 보내볼까요?",
        "voiceScript": "가족에게 다정한 마음을 전하는 가장 쉬운 방법이에요. 아래 ‘하트 전송하기’ 버튼을 톡 누르면 예쁜 하트가 가족에게 날아갑니다.",
        "helpScript": "화면의 하트 전송하기 버튼을 눌러보세요.",
        "prompt": "가족에게 사랑의 하트를 보내보세요.",
        "customType": "phone_demo_heart",
        "imageSrc": "assets/images/smartphone_touch.jpg",
        "imageAlt": "스마트폰으로 가족에게 하트 문자를 보내는 모습",
        "imageCaption": "💌 2단계 · 손주와 자녀에게 따뜻한 사랑의 하트 전송",
        "options": [
          {
            "text": "하트가 정성스레 전달되었어요, 뿌듯해요!",
            "emoji": "🧡",
            "isBest": true,
            "feedback": "손주가 하트를 받으면 얼마나 기뻐할까요! 자주 사랑을 전해보세요."
          },
          {
            "text": "문자 보내기가 이렇게 쉬운 줄 몰랐어요",
            "emoji": "🥰",
            "isBest": true,
            "feedback": "어렵지 않지요? 이제 보고 싶을 때마다 하트를 톡 보내시면 됩니다."
          }
        ]
      },
      {
        "stepNum": 3,
        "aiMessage": "길을 걷다 예쁜 꽃을 보았을 때, 스마트폰 카메라로 찰칵 담아볼까요?",
        "screenText": "길을 걷다 예쁜 꽃을 보았을 때, 스마트폰 카메라로 찰칵 담아볼까요?",
        "voiceScript": "마당에 활짝 핀 해바라기를 카메라에 담아보세요. 가운데 하얀 동그라미 버튼을 톡 누르면 찰칵 소리와 함께 사진이 찍힙니다.",
        "helpScript": "화면 속 찰칵 버튼을 눌러 사진을 찍어보세요.",
        "prompt": "찰칵! 사진 찍기 버튼을 눌러보세요.",
        "customType": "phone_demo_camera",
        "imageSrc": "assets/images/korean_sunflower.jpg",
        "imageAlt": "스마트폰 카메라 렌즈에 담긴 노란 해바라기",
        "imageCaption": "📸 3단계 · 찰칵! 마당의 예쁜 해바라기 사진 촬영",
        "options": [
          {
            "text": "찰칵! 소리와 함께 사진이 멋지게 찍혔어요!",
            "emoji": "📸",
            "isBest": true,
            "feedback": "멋진 사진작가가 되셨네요! 사진이 아주 선명하고 예쁘게 찍혔어요."
          },
          {
            "text": "예쁜 꽃을 언제든 다시 볼 수 있어 참 좋네요",
            "emoji": "🌻",
            "isBest": true,
            "feedback": "찍어둔 꽃 사진을 친구들에게 자랑하며 보여주실 수도 있답니다."
          }
        ]
      },
      {
        "stepNum": 4,
        "aiMessage": "방금 찍은 예쁜 꽃 사진을 앨범(갤러리) 앱에서 찾아보는 방법이에요.",
        "screenText": "방금 찍은 예쁜 꽃 사진을 앨범(갤러리) 앱에서 찾아보는 방법이에요.",
        "voiceScript": "사진을 찍은 후에는 빨간 꽃 모양의 ‘갤러리’ 아이콘을 누르면 내가 찍은 사진들이 날짜순으로 곱게 모여있답니다.",
        "helpScript": "사진첩(갤러리)에서 사진을 확인하는 방법을 골라보세요.",
        "prompt": "내가 찍은 사진은 어디에서 확인할 수 있을까요?",
        "imageSrc": "assets/images/korean_sunflower.jpg",
        "imageAlt": "스마트폰 사진첩 갤러리에 저장된 꽃 사진",
        "imageCaption": "🖼️ 4단계 · 갤러리 앱에서 언제든 꺼내보는 소중한 사진",
        "options": [
          {
            "text": "꽃 모양의 ‘갤러리’ 앱을 누르면 바로 보여요",
            "emoji": "🖼️",
            "isBest": true,
            "feedback": "맞습니다! 갤러리에 들어가면 오늘 찍은 사진이 맨 위에 쏙 나와요."
          },
          {
            "text": "가족에게 찍은 사진을 자랑하고 싶어요",
            "emoji": "👨‍👩‍👧‍👦",
            "isBest": true,
            "feedback": "공유 버튼을 누르면 자녀들에게 사진을 바로 보낼 수도 있답니다."
          }
        ]
      },
      {
        "stepNum": 5,
        "aiMessage": "우리나라 어르신들께서 가장 편리하게 쓰시는 ‘천지인 자판’으로 글자를 쳐볼까요?",
        "screenText": "우리나라 어르신들께서 가장 편리하게 쓰시는 ‘천지인 자판’으로 글자를 쳐볼까요?",
        "voiceScript": "하늘과 땅과 사람을 뜻하는 점과 ㅡ, ㅣ 세 글쇠로 모든 모음을 만드는 마법의 자판이에요. 버튼을 눌러 글자를 연습해 보세요.",
        "helpScript": "화면의 자판 글쇠를 눌러 한글을 조합해 보세요.",
        "prompt": "천지인 자판을 눌러 한글을 완성해 보세요.",
        "customType": "phone_demo_cheonjiin",
        "imageSrc": "assets/images/smartphone_touch.jpg",
        "imageAlt": "천지인 자판으로 한글을 차근차근 입력하는 모습",
        "imageCaption": "✏️ 5단계 · 천지인 자판으로 또박또박 한글 입력하기",
        "options": [
          {
            "text": "글자가 착착 조합되니 아주 재미있어요!",
            "emoji": "✏️",
            "isBest": true,
            "feedback": "손에 익숙해지면 어떤 문장도 술술 쉽게 쓰실 수 있답니다."
          },
          {
            "text": "자음과 모음 누르는 규칙을 금방 이해했어요",
            "emoji": "💡",
            "isBest": true,
            "feedback": "습득력이 정말 대단하세요! 척척박사님이 다 되셨어요."
          }
        ]
      },
      {
        "stepNum": 6,
        "aiMessage": "따르릉~ 전화벨이 울릴 때 당황하지 않고 초록색 버튼을 쓱 밀어서 받아볼까요?",
        "screenText": "따르릉~ 전화벨이 울릴 때 당황하지 않고 초록색 버튼을 쓱 밀어서 받아볼까요?",
        "voiceScript": "전화가 오면 화면에서 깜빡이는 초록색 수화기 버튼을 손가락으로 가볍게 바깥쪽으로 쓱 밀어주시면 전화가 연결됩니다.",
        "helpScript": "전화 받는 올바른 방법을 골라보세요.",
        "prompt": "전화가 걸려올 때 어떻게 받으면 될까요?",
        "imageSrc": "assets/images/smartphone_touch.jpg",
        "imageAlt": "전화가 걸려왔을 때 초록색 버튼을 미는 손동작",
        "imageCaption": "📞 6단계 · 초록색 수화기 버튼을 옆으로 쓱 밀어서 받기",
        "options": [
          {
            "text": "초록색 버튼을 옆으로 쓱 밀어서 받아요",
            "emoji": "🟢",
            "isBest": true,
            "feedback": "완벽합니다! 톡 누르기보다 옆으로 쓱 밀어주는 것이 요령이에요."
          },
          {
            "text": "빨간색 버튼은 전화를 끊을 때 눌러요",
            "emoji": "🔴",
            "isBest": true,
            "feedback": "맞아요! 빨간색은 거절하거나 끊을 때 쓰는 버튼이랍니다."
          }
        ]
      },
      {
        "stepNum": 7,
        "aiMessage": "상대방 목소리가 작게 들릴 때는 스마트폰 옆면에 있는 볼륨 위쪽 버튼을 꾹 눌러주세요.",
        "screenText": "상대방 목소리가 작게 들릴 때는 스마트폰 옆면에 있는 볼륨 위쪽 버튼을 꾹 눌러주세요.",
        "voiceScript": "스마트폰 옆쪽을 만져보시면 긴 버튼이 있어요. 위쪽을 누르면 소리가 커지고, 아래쪽을 누르면 소리가 작아집니다.",
        "helpScript": "스마트폰 소리를 키우는 방법을 골라보세요.",
        "prompt": "상대방 목소리를 더 크게 들으려면 어떻게 해야 할까요?",
        "imageSrc": "assets/images/smartphone_touch.jpg",
        "imageAlt": "스마트폰 옆면 음량 조절 버튼을 누르는 모습",
        "imageCaption": "🔊 7단계 · 옆면 위쪽 버튼으로 상대방 목소리 시원하게 키우기",
        "options": [
          {
            "text": "스마트폰 옆면의 위쪽 음량 버튼을 눌러요",
            "emoji": "🔊",
            "isBest": true,
            "feedback": "정답입니다! 이제 귀가 어두우셔도 또렷하고 시원하게 통화하실 수 있어요."
          },
          {
            "text": "스피커폰 버튼을 누르면 더 크게 들려요",
            "emoji": "📢",
            "isBest": true,
            "feedback": "아주 좋은 꿀팁이에요! 스피커폰을 켜면 귀에 대지 않고도 잘 들리지요."
          }
        ]
      },
      {
        "stepNum": 8,
        "aiMessage": "축하드립니다! 글자 키우기부터 문자, 사진, 전화 받기까지 스마트폰 달인 과정을 모두 수료하셨어요!",
        "screenText": "축하드립니다! 글자 키우기부터 문자, 사진, 전화 받기까지 스마트폰 달인 과정을 모두 수료하셨어요!",
        "voiceScript": "짝짝짝! 이제 스마트폰이 전혀 두렵지 않으시지요? 가족들과 더 자주 연락하시고 사진도 많이 찍으시며 즐겁고 스마트한 생활을 누려보세요!",
        "helpScript": "스마트폰 달인이 되신 기쁨의 소감을 골라보세요.",
        "prompt": "스마트폰 배우기를 모두 마친 소감을 골라보세요.",
        "imageSrc": "assets/images/ai_puppy_heart.jpg",
        "imageAlt": "스마트폰 달인 수료 축하와 응원",
        "imageCaption": "🎓 8단계 · 스마트폰 척척박사 달인 수료를 축하드려요",
        "options": [
          {
            "text": "이제 스마트폰 쓰는 것이 두렵지 않고 재미있어요!",
            "emoji": "🎉",
            "isBest": true,
            "feedback": "당당하게 스마트폰을 활용하시는 어르신 모습이 참 멋지십니다!"
          },
          {
            "text": "오늘 배운 대로 가족들에게 하트 문자 꼭 보낼게요",
            "emoji": "💌",
            "isBest": true,
            "feedback": "가족들이 깜짝 놀라며 기뻐할 거예요! 행복한 소통 많이 나누세요!"
          },
          {
            "text": "친절하게 하나씩 가르쳐줘서 정말 고마워요",
            "emoji": "🥰",
            "isBest": true,
            "feedback": "언제든 궁금한 것이 생기시면 저를 찾아주세요. 늘 곁에 있을게요!"
          }
        ]
      }
    ]
  },
  {
    "id": "ask",
    "icon": "💬",
    "title": "AI에게 물어보기",
    "summary": "건강차 추천부터 무릎 체조, 찌개 비법, 전래동화까지 무엇이든 다정하게 알려드려요.",
    "steps": [
      {
        "stepNum": 1,
        "aiMessage": "환절기나 쌀쌀한 날에 몸을 따뜻하게 데워주는 건강차를 추천해 드릴까요?",
        "screenText": "환절기나 쌀쌀한 날에 몸을 따뜻하게 데워주는 건강차를 추천해 드릴까요?",
        "voiceScript": "어르신, 무엇이든 궁금한 것을 물어보세요. 날씨가 쌀쌀할 때는 혈액순환을 돕고 면역력을 높여주는 대추생강차가 으뜸이랍니다.",
        "helpScript": "AI 선생님이 추천하는 건강차에 대해 선택해 보세요.",
        "prompt": "환절기 건강을 지켜주는 전통차에 대해 물어보세요.",
        "imageSrc": "assets/images/warm_jujube_tea.jpg",
        "imageAlt": "면역력을 높여주는 따뜻한 대추차와 생강차",
        "imageCaption": "🍵 1단계 · 몸을 따뜻하게 데워주는 대추생강차의 효능",
        "options": [
          {
            "text": "대추차는 몸을 어떻게 따뜻하게 해주나요?",
            "emoji": "🍵",
            "isBest": true,
            "feedback": "대추는 혈액순환을 돕고 마음을 차분히 진정시켜 밤에 깊은 잠을 자게 도와줍니다."
          },
          {
            "text": "생강을 함께 넣으면 감기 예방에 좋지요?",
            "emoji": "🌿",
            "isBest": true,
            "feedback": "맞습니다! 생강의 알싸한 성분이 몸속 찬 기운을 몰아내어 감기를 뚝 떨어뜨려요."
          }
        ]
      },
      {
        "stepNum": 2,
        "aiMessage": "의자에 편안히 앉아서 무릎과 다리를 튼튼하게 만드는 가벼운 체조를 알려드릴게요.",
        "screenText": "의자에 편안히 앉아서 무릎과 다리를 튼튼하게 만드는 가벼운 체조를 알려드릴게요.",
        "voiceScript": "의자에 허리를 펴고 앉아 무릎을 앞으로 쭉 폈다가 5초 동안 머무른 후 천천히 내려놓으세요. 허벅지 근육이 튼튼해져 무릎 관절을 든든하게 지켜줍니다.",
        "helpScript": "무릎 관절 건강 체조 팁을 확인해 보세요.",
        "prompt": "무릎 관절을 튼튼하게 하는 의자 체조를 실천해 보세요.",
        "imageSrc": "assets/images/ai_friend_avatar.jpg",
        "imageAlt": "다정하게 건강 체조를 안내하는 AI 선생님",
        "imageCaption": "🧘 2단계 · 의자에 앉아서 실천하는 100세 무릎 튼튼 체조",
        "options": [
          {
            "text": "발목을 까딱까딱 돌려주는 운동도 좋은가요?",
            "emoji": "🦶",
            "isBest": true,
            "feedback": "최고의 질문이에요! 발목을 돌려주면 종아리 펌프 작용으로 혈압도 안정된답니다."
          },
          {
            "text": "의자에 앉아 다리를 쭉 펴니 허벅지에 힘이 들어가요",
            "emoji": "💪",
            "isBest": true,
            "feedback": "아주 잘하고 계세요! 매일 10번씩만 반복하시면 계단도 거뜬히 오르실 수 있어요."
          }
        ]
      },
      {
        "stepNum": 3,
        "aiMessage": "알록달록 제철 과일에는 어르신의 눈과 혈관을 맑게 해주는 비타민이 듬뿍 들어있어요.",
        "screenText": "알록달록 제철 과일에는 어르신의 눈과 혈관을 맑게 해주는 비타민이 듬뿍 들어있어요.",
        "voiceScript": "사과의 펙틴 성분은 장을 편안하게 해주고, 감과 귤의 비타민 C는 혈관을 튼튼하게 가꾸어줍니다. 과일은 껍질째 깨끗이 씻어 드시면 더 좋습니다.",
        "helpScript": "제철 과일의 영양 효능에 대해 골라보세요.",
        "prompt": "건강을 지켜주는 과일의 효능을 알아보세요.",
        "imageSrc": "assets/images/fruits_basket.jpg",
        "imageAlt": "비타민과 미네랄이 풍부한 제철 과일 바구니",
        "imageCaption": "🍎 3단계 · 혈관과 눈 건강을 지키는 제철 과일의 비밀",
        "options": [
          {
            "text": "아침에 먹는 사과가 금사과라고 하지요?",
            "emoji": "🍎",
            "isBest": true,
            "feedback": "맞습니다! 아침 사과는 위장 운동을 촉진하고 독소를 배출해 주는 최고의 보약이에요."
          },
          {
            "text": "달콤한 배는 기관지와 목 건강에 최고지요?",
            "emoji": "🍐",
            "isBest": true,
            "feedback": "루테올린 성분이 풍부해서 기침과 가래를 삭이고 목을 촉촉하게 지켜준답니다."
          }
        ]
      },
      {
        "stepNum": 4,
        "aiMessage": "어머니 손맛처럼 구수하고 깊은 맛이 나는 된장찌개의 비결을 함께 알아볼까요?",
        "screenText": "어머니 손맛처럼 구수하고 깊은 맛이 나는 된장찌개의 비결을 함께 알아볼까요?",
        "voiceScript": "뚝배기에 쌀뜨물을 붓고 멸치와 다시마로 밑국물을 진하게 낸 뒤, 된장을 체에 걸러 풀고 마지막에 다진 마늘과 대파를 듬뿍 넣는 것이 비법이랍니다.",
        "helpScript": "맛있는 된장찌개 조리 팁을 골라보세요.",
        "prompt": "구수한 전통 된장찌개의 깊은 맛 비법을 알아보세요.",
        "imageSrc": "assets/images/korean_stew_table.jpg",
        "imageAlt": "구수한 국물이 일품인 전통 된장찌개 뚝배기",
        "imageCaption": "🍲 4단계 · 쌀뜨물과 멸치 육수로 우려내는 깊은 맛 된장찌개",
        "options": [
          {
            "text": "쌀뜨물로 끓이면 국물이 떫지 않고 부드럽지요?",
            "emoji": "🍚",
            "isBest": true,
            "feedback": "맞아요! 쌀뜨물의 전분질이 된장의 떫은맛을 잡아주고 국물을 구수하게 감싸줍니다."
          },
          {
            "text": "차돌박이나 조개를 넣어도 별미지요?",
            "emoji": "🥩",
            "isBest": true,
            "feedback": "해물이나 고기를 조금 넣으면 국물이 한층 더 진하고 감칠맛이 폭발하지요!"
          }
        ]
      },
      {
        "stepNum": 5,
        "aiMessage": "마음이 따뜻해지는 옛날 전래동화 한 편 들려드릴까요? 서로를 아끼던 ‘의좋은 형제’ 이야기예요.",
        "screenText": "마음이 따뜻해지는 옛날 전래동화 한 편 들려드릴까요? 서로를 아끼던 ‘의좋은 형제’ 이야기예요.",
        "voiceScript": "가을 추수가 끝나고 달 밝은 밤, 동생네 볏가리가 적을까 봐 몰래 볏단을 져다 나르던 형과 아우의 깊은 우애가 담긴 명작 동화랍니다.",
        "helpScript": "의좋은 형제 동화의 줄거리에 대해 선택해 보세요.",
        "prompt": "의좋은 형제 동화 속 감동의 장면을 물어보세요.",
        "imageSrc": "assets/images/story_brothers.jpg",
        "imageAlt": "달밤에 서로를 위해 볏단을 나르는 의좋은 형제",
        "imageCaption": "🌾 5단계 · 서로를 먼저 위하던 의좋은 형제의 감동 동화",
        "options": [
          {
            "text": "서로 몰래 볏단을 날라주던 밤 풍경이 감동적이에요",
            "emoji": "🌾",
            "isBest": true,
            "feedback": "상대방이 나보다 더 필요할 거라 믿고 양보하던 가족 간의 참된 사랑이지요."
          },
          {
            "text": "고갯마루에서 마주치고 얼싸안던 결말이 참 눈물겨워요",
            "emoji": "🌕",
            "isBest": true,
            "feedback": "달빛 아래 서로의 볏단을 보고 뜨겁게 포옹하던 장면은 영원한 우리 민족의 마음이에요."
          }
        ]
      },
      {
        "stepNum": 6,
        "aiMessage": "어깨춤이 절로 나고 가슴이 시원해지는 옛 노래와 우리 민요를 추천해 드릴게요.",
        "screenText": "어깨춤이 절로 나고 가슴이 시원해지는 옛 노래와 우리 민요를 추천해 드릴게요.",
        "voiceScript": "신명나는 태평가와 아리랑, 그리고 고향의 봄은 들을 때마다 마음을 젊게 만들고 활력을 불어넣어 주는 만병통치약이랍니다.",
        "helpScript": "추천 옛 노래의 매력을 골라보세요.",
        "prompt": "어깨춤이 절로 나는 옛 노래의 매력을 알아보세요.",
        "imageSrc": "assets/images/senior-daylight-old-songs.png",
        "imageAlt": "밝은 공간에서 옛 노래를 부르고 손뼉을 치며 즐거워하는 어르신들",
        "imageCaption": "🎶 6단계 · 가슴속 답답함을 뻥 뚫어주는 신명나는 옛 노래",
        "options": [
          {
            "text": "“짜증을 내어서 무엇하나~” 태평가를 부르면 시름이 가셔요",
            "emoji": "🥁",
            "isBest": true,
            "feedback": "그렇지요! 호탕하게 웃으며 부르는 노래 한 곡이 모든 근심을 날려 보냅니다."
          },
          {
            "text": "박자에 맞춰 손뼉을 치면 뇌 건강에도 참 좋지요?",
            "emoji": "👏",
            "isBest": true,
            "feedback": "손바닥의 모든 혈자리를 자극해 주어 온몸이 쌩쌩해진답니다."
          }
        ]
      },
      {
        "stepNum": 7,
        "aiMessage": "어릴 적 뛰놀던 정겨운 고향 마을 풍경을 AI와 함께 추억해 보아요.",
        "screenText": "어릴 적 뛰놀던 정겨운 고향 마을 풍경을 AI와 함께 추억해 보아요.",
        "voiceScript": "박이 주렁주렁 열린 초가지붕, 흙담 길을 따라 핀 맨드라미와 봉선화, 이웃끼리 반찬을 나누던 훈훈한 인심이 바로 고향의 진짜 모습이지요.",
        "helpScript": "고향 마을의 정겨운 정취를 골라보세요.",
        "prompt": "고향 마을의 가장 그리운 풍경을 물어보세요.",
        "imageSrc": "assets/images/nostalgic_village.jpg",
        "imageAlt": "평화롭고 아늑한 시골 고향 마을 전경",
        "imageCaption": "🏡 7단계 · 언제 떠올려도 어머니 품처럼 아늑한 고향 마을",
        "options": [
          {
            "text": "돌담 너머로 이웃끼리 부르며 정을 나누던 풍경",
            "emoji": "🏡",
            "isBest": true,
            "feedback": "대문도 잠그지 않고 이웃이 곧 한 가족처럼 지내던 정다운 시절이었지요."
          },
          {
            "text": "밤하늘 가득 쏟아지던 은하수와 별빛",
            "emoji": "✨",
            "isBest": true,
            "feedback": "평상에 누워 풀벌레 소리 들으며 별을 헤던 그 낭만이 참 그립습니다."
          }
        ]
      },
      {
        "stepNum": 8,
        "aiMessage": "어르신, 오늘도 유익한 대화를 함께 나누어 주셔서 감사합니다. 어르신의 건강을 늘 응원해요!",
        "screenText": "어르신, 오늘도 유익한 대화를 함께 나누어 주셔서 감사합니다. 어르신의 건강을 늘 응원해요!",
        "voiceScript": "궁금한 것이 있으실 때마다 언제든 편안하게 물어보세요. 어르신께서 매일매일 건강하고 웃음 가득한 하루를 보내시길 온 마음으로 기도합니다!",
        "helpScript": "오늘 대화를 마무리하며 나누는 따뜻한 인사를 골라보세요.",
        "prompt": "AI 친구와 대화를 나누신 소감을 골라보세요.",
        "imageSrc": "assets/images/ai_puppy_heart.jpg",
        "imageAlt": "어르신의 100세 건강과 행복을 축복하는 하트",
        "imageCaption": "🧡 8단계 · 어르신의 건강과 행복을 늘 곁에서 지켜드릴게요",
        "options": [
          {
            "text": "궁금한 걸 친절하게 가르쳐줘서 참 든든하고 고마워요!",
            "emoji": "🥰",
            "isBest": true,
            "feedback": "어르신께 도움이 되어 제가 더 기쁘고 보람찹니다! 사랑합니다!"
          },
          {
            "text": "건강 체조와 건강차 매일 잘 챙겨서 실천할게요!",
            "emoji": "💪",
            "isBest": true,
            "feedback": "멋진 약속이에요! 건강하게 오래오래 저와 함께 이야기 나누어요!"
          }
        ]
      }
    ]
  },
  {
    "id": "story",
    "icon": "📖",
    "title": "이야기 만들기",
    "summary": "형과 아우의 깊은 우애가 깃든 전래동화 ‘의좋은 형제’를 한 장 한 장 넘기며 완성해요.",
    "steps": [
      {
        "stepNum": 1,
        "aiMessage": "오늘은 온 세상에 우애 깊기로 소문난 전래동화 ‘의좋은 형제’ 이야기를 함께 지어볼게요. 두 형제는 어떤 성품을 가졌을까요?",
        "screenText": "오늘은 온 세상에 우애 깊기로 소문난 전래동화 ‘의좋은 형제’ 이야기를 함께 지어볼게요. 두 형제는 어떤 성품을 가졌을까요?",
        "voiceScript": "어르신, 옛날 옛적 서로를 끔찍이 아끼며 살아가던 의좋은 형제가 있었어요. 두 형제는 서로를 어떻게 대했을까요?",
        "helpScript": "동화 속 주인공 형제의 성품을 골라보세요.",
        "prompt": "이야기 속 주인공 형제의 우애를 선택해 보세요.",
        "imageSrc": "assets/images/story-brothers-daytime-introduction.png",
        "imageAlt": "밝은 시골 마을에서 어깨에 손을 얹고 다정하게 이야기하는 형제",
        "imageCaption": "📖 1장 · 사이좋은 형제의 정다운 첫 모습",
        "options": [
          {
            "text": "언제나 서로를 먼저 위하고 양보했어요",
            "emoji": "👨‍👦",
            "isBest": true,
            "feedback": "맞아요! 내가 조금 덜 가져도 형을 먼저, 아우를 먼저 챙기던 참 고운 형제였지요."
          },
          {
            "text": "힘든 농사일도 도우며 웃음꽃을 피웠어요",
            "emoji": "🤝",
            "isBest": true,
            "feedback": "무거운 짐도 서로 나누어 지며 우애가 날로 깊어갔답니다."
          }
        ]
      },
      {
        "stepNum": 2,
        "aiMessage": "형제가 함께 땀 흘려 농사를 짓던 평화롭고 아늑한 고향 마을은 어떤 풍경이었을까요?",
        "screenText": "형제가 함께 땀 흘려 농사를 짓던 평화롭고 아늑한 고향 마을은 어떤 풍경이었을까요?",
        "voiceScript": "돌담 너머로 밥 짓는 연기가 모락모락 피어오르고, 초가지붕 위로 박이 익어가던 정겨운 시골 마을이었어요. 마을의 풍경을 골라보세요.",
        "helpScript": "형제가 살던 평화로운 마을의 모습을 골라보세요.",
        "prompt": "형제가 살던 아름다운 고향 마을의 모습을 골라보세요.",
        "imageSrc": "assets/images/story_village_brothers.jpg",
        "imageAlt": "두 형제가 다정하게 거닐던 평화로운 시골 고향 마을",
        "imageCaption": "🏡 2장 · 형제가 함께 자란 평화로운 고향 마을",
        "options": [
          {
            "text": "가을 들판이 황금빛으로 물결치는 풍요로운 마을",
            "emoji": "🌾",
            "isBest": true,
            "feedback": "황금빛 벼이삭이 춤추는 넉넉하고 인심 좋은 마을이었지요."
          },
          {
            "text": "초가지붕 위로 둥근 박이 탐스럽게 열린 마을",
            "emoji": "🏡",
            "isBest": true,
            "feedback": "지붕마다 주렁주렁 열린 박이 평화로운 마을의 정취를 더해주네요."
          }
        ]
      },
      {
        "stepNum": 3,
        "aiMessage": "가을이 깊어가자 형제는 봄부터 정성껏 가꾼 논에서 마침내 풍성하게 벼를 베어 추수했어요.",
        "screenText": "가을이 깊어가자 형제는 봄부터 정성껏 가꾼 논에서 마침내 풍성하게 벼를 베어 추수했어요.",
        "voiceScript": "낫으로 벼를 베고 볏단을 묶으며 흘린 땀방울이 풍성한 결실로 돌아왔어요. 형제는 수확한 볏단을 어떻게 나누었을까요?",
        "helpScript": "형제가 볏단을 수확하고 나눈 방법을 골라보세요.",
        "prompt": "형제는 수확한 볏단을 어떻게 나누어 쌓았을까요?",
        "imageSrc": "assets/images/story_brothers_harvest.jpg",
        "imageAlt": "황금 들판에서 수확한 볏단을 사이좋게 나누어 쌓는 의좋은 형제",
        "imageCaption": "🌾 3장 · 땀 흘려 거둔 풍성한 가을 볏단",
        "options": [
          {
            "text": "형 반, 동생 반 똑같이 공평하게 나누어 쌓았어요",
            "emoji": "🌾",
            "isBest": true,
            "feedback": "맞아요! 서로 욕심부리지 않고 똑같이 반반씩 나누어 마당에 쌓아두었답니다."
          },
          {
            "text": "수확의 기쁨을 나누며 서로에게 감사했어요",
            "emoji": "🙏",
            "isBest": true,
            "feedback": "올 한 해도 함께 고생해 준 서로가 있어서 든든하고 고마웠지요."
          }
        ]
      },
      {
        "stepNum": 4,
        "aiMessage": "낮 동안 마당에 볏단을 높이 쌓아두고, 평상에 둘러앉아 맛있는 저녁밥을 함께 먹었어요.",
        "screenText": "낮 동안 마당에 볏단을 높이 쌓아두고, 평상에 둘러앉아 맛있는 저녁밥을 함께 먹었어요.",
        "voiceScript": "초가집 마당 볏가리 옆에서 구수한 된장찌개와 밥을 나누어 먹으며 형제는 서로에게 어떤 덕담을 건넸을까요?",
        "helpScript": "저녁 밥상에서 형제가 나눈 따뜻한 대화를 골라보세요.",
        "prompt": "저녁 밥상에서 형제가 서로에게 건넨 따뜻한 말을 골라보세요.",
        "imageSrc": "assets/images/story_brothers_dinner.jpg",
        "imageAlt": "마당 볏가리 옆 평상에서 사이좋게 저녁밥을 함께 먹는 의좋은 형제",
        "imageCaption": "🍲 4장 · 마당에 볏단을 쌓아두고 함께 나눈 저녁밥",
        "options": [
          {
            "text": "“아우야, 올 한 해도 함께 땀 흘려줘서 정말 고맙네”",
            "emoji": "🍲",
            "isBest": true,
            "feedback": "서로를 위하는 따뜻한 말 한마디에 피로가 눈 녹듯 사라졌지요."
          },
          {
            "text": "“형님 덕분에 올겨울도 따뜻하고 든든하게 보내겠습니다”",
            "emoji": "🍚",
            "isBest": true,
            "feedback": "형을 공경하는 동생의 진심 어린 마음에 밥상이 훈훈해졌답니다."
          }
        ]
      },
      {
        "stepNum": 5,
        "aiMessage": "깊은 밤, 방에 누운 형은 문 너머 마당의 볏단을 보며 동생을 걱정하기 시작했어요.",
        "screenText": "깊은 밤, 방에 누운 형은 문 너머 마당의 볏단을 보며 동생을 걱정하기 시작했어요.",
        "voiceScript": "‘동생은 살림을 새로 차려 쓸 곳이 많을 텐데, 볏단이 나보다 더 많이 필요할 거야.’ 형은 동생을 위해 어떤 결심을 했을까요?",
        "helpScript": "밤중에 형이 마음에 품은 고운 생각을 골라보세요.",
        "prompt": "깊은 밤, 형은 동생을 위해 어떤 결심을 했을까요?",
        "imageSrc": "assets/images/story-brother-bedroom-thought.png",
        "imageAlt": "깊은 밤, 방 안에서 마당의 볏단을 보며 동생을 위해 결심하는 형의 모습",
        "imageCaption": "🌙 5장 · 깊은 밤, 동생을 걱정하는 형의 고운 마음",
        "options": [
          {
            "text": "“내 볏단을 몰래 동생네 마당에 더 갖다 놔야겠어!”",
            "emoji": "🌙",
            "isBest": true,
            "feedback": "맞아요! 혹여 동생이 알면 사양할까 봐 달밤에 몰래 옮기기로 결심했지요."
          },
          {
            "text": "동생이 부족함 없이 넉넉하게 살기를 바랐어요",
            "emoji": "🧡",
            "isBest": true,
            "feedback": "자신보다 동생의 살림살이를 먼저 걱정하는 형의 깊은 사랑이었어요."
          }
        ]
      },
      {
        "stepNum": 6,
        "aiMessage": "보름달이 환하게 비추는 밤, 형은 지게에 볏단을 지고 살금살금 동생네로 향했어요. 그런데 동생도 같은 생각을 하고 있었지요!",
        "screenText": "보름달이 환하게 비추는 밤, 형은 지게에 볏단을 지고 살금살금 동생네로 향했어요. 그런데 동생도 같은 생각을 하고 있었지요!",
        "voiceScript": "동생 역시 ‘형님은 식구가 많으니 쌀이 더 많이 필요해!’ 하며 형네 집으로 볏단을 나르고 있었어요. 다음 날 아침 마당 볏가리는 어떻게 되었을까요?",
        "helpScript": "다음 날 아침 마당 볏가리의 신기한 비밀을 골라보세요.",
        "prompt": "밤새 볏단을 날랐는데 아침에 마당 볏가리는 왜 줄지 않았을까요?",
        "imageSrc": "assets/images/story-brother-morning-rice.png",
        "imageAlt": "아침 햇살이 드는 마당에서 줄지 않은 볏가리를 보고 고개를 갸우뚱하는 형",
        "imageCaption": "🌾 6장 · 아침에도 그대로인 마당의 볏가리",
        "options": [
          {
            "text": "서로 똑같이 한 단씩 날라다 주어 줄지 않았어요!",
            "emoji": "🌾",
            "isBest": true,
            "feedback": "정답입니다! 형도 동생에게, 동생도 형에게 주었으니 볏가리가 그대로였지요!"
          },
          {
            "text": "형제는 서로 고개를 갸우뚱하며 이상하게 여겼어요",
            "emoji": "🤔",
            "isBest": true,
            "feedback": "‘어라? 내가 밤새 옮겼는데 왜 볏단이 줄지 않았지?’ 신기해했답니다."
          }
        ]
      },
      {
        "stepNum": 7,
        "aiMessage": "다음 날 밤, 또 볏단을 지고 가던 형제는 고갯마루 달빛 아래에서 딱 마주쳤어요!",
        "screenText": "다음 날 밤, 또 볏단을 지고 가던 형제는 고갯마루 달빛 아래에서 딱 마주쳤어요!",
        "voiceScript": "어둠 속에서 지게를 진 사람이 다가오는데, 자세히 보니 내 동생이고 내 형님이었어요! 서로의 지게에 실린 볏단을 본 형제는 뭐라고 외쳤을까요?",
        "helpScript": "고갯마루에서 마주친 형제의 감동적인 대사를 골라보세요.",
        "prompt": "고갯마루에서 딱 마주친 형제는 서로를 바라보며 뭐라고 외쳤을까요?",
        "imageSrc": "assets/images/story-brothers-moonlight-hug.png",
        "imageAlt": "달빛 고갯마루에서 지게와 볏단을 내려놓고 서로 안아주는 의좋은 형제",
        "imageCaption": "🌕 7장 · 달빛 고갯마루에서의 눈물겨운 포옹",
        "options": [
          {
            "text": "“아우야, 네 짓이었구나!” / “형님, 형님 마음이셨군요!”",
            "emoji": "😭",
            "isBest": true,
            "feedback": "형제는 볏단을 내던지고 달빛 아래에서 얼싸안고 눈물을 흘렸답니다!"
          },
          {
            "text": "서로의 지극한 사랑을 깨닫고 뜨겁게 부둥켜안았어요",
            "emoji": "🤝",
            "isBest": true,
            "feedback": "세상에서 가장 순수하고 아름다운 형제애가 온 고갯마루를 환하게 밝혔어요."
          }
        ]
      },
      {
        "stepNum": 8,
        "aiMessage": "두 형제의 감동적인 우애는 온 마을에 널리 퍼져, 마을 사람들 모두가 서로 아끼고 돕는 행복한 마을이 되었답니다.",
        "screenText": "두 형제의 감동적인 우애는 온 마을에 널리 퍼져, 마을 사람들 모두가 서로 아끼고 돕는 행복한 마을이 되었답니다.",
        "voiceScript": "어르신과 함께 완성한 전래동화 ‘의좋은 형제’! 나눌수록 커지고 함께할수록 행복해지는 참된 가족 사랑의 교훈을 전해줍니다. 참 훌륭하셨어요!",
        "helpScript": "완성된 ‘의좋은 형제’ 동화의 교훈을 골라보세요.",
        "prompt": "완성된 ‘의좋은 형제’ 동화가 주는 가장 큰 교훈은 무엇일까요?",
        "imageSrc": "assets/images/ai_puppy_heart.jpg",
        "imageAlt": "온 마을의 행복과 형제의 아름다운 결말",
        "imageCaption": "🧡 8장 · 사랑과 나눔으로 영원히 행복했던 의좋은 형제",
        "options": [
          {
            "text": "가족을 먼저 위하고 나누는 마음이 가장 큰 행복이에요",
            "emoji": "🏡",
            "isBest": true,
            "feedback": "짝짝짝! 어르신의 따뜻한 마음이 담겨 세상에서 가장 감동적인 명작 동화가 완성되었어요! 👏🎉"
          },
          {
            "text": "서로 아끼며 매일매일 웃음꽃을 피우며 살았답니다",
            "emoji": "🌸",
            "isBest": true,
            "feedback": "어르신의 삶에도 이 이야기처럼 늘 따뜻한 복과 우애가 가득하시길 온 마음으로 축복합니다! 💐"
          }
        ]
      }
    ]
  },
  {
    id: 'numbers',
    icon: '🔢',
    title: '숫자 놀이 20단계',
    summary: '숫자 비교, 덧셈, 개수 세기, 달력과 돈 계산까지 재미있는 20가지 인지 숫자 퀴즈예요.',
    steps: [
      {
        stepNum: 1,
        aiMessage: '첫 번째 문제! 3과 7 중 더 큰 숫자는 무엇일까요?',
        prompt: '더 큰 숫자를 골라보세요.',
        options: [
          { text: '3', emoji: '🔢', feedback: '7이 3보다 4만큼 더 큰 숫자랍니다. 같이 천천히 해봐요!' },
          { text: '7', emoji: '🔢', isBest: true, feedback: '맞아요! 7이 3보다 더 큰 숫자랍니다. 참 잘하셨어요! 👏' }
        ]
      },
      {
        stepNum: 2,
        aiMessage: '두 번째 문제! 12와 5 중 더 큰 숫자는 무엇일까요?',
        prompt: '더 큰 숫자를 골라보세요.',
        options: [
          { text: '12', emoji: '🔢', isBest: true, feedback: '정답이에요! 12가 5보다 훨씬 더 큰 숫자예요. 👍' },
          { text: '5', emoji: '🔢', feedback: '괜찮아요. 12가 5보다 더 큰 숫자랍니다.' }
        ]
      },
      {
        stepNum: 3,
        aiMessage: '세 번째 문제! 4와 9 중 더 작은 숫자는 무엇일까요?',
        prompt: '더 작은 숫자를 골라보세요.',
        options: [
          { text: '4', emoji: '🔢', isBest: true, feedback: '맞았어요! 4가 9보다 더 작은 숫자예요. 아주 잘 찾아내셨어요!' },
          { text: '9', emoji: '🔢', feedback: '괜찮아요. 4가 9보다 더 작답니다.' }
        ]
      },
      {
        stepNum: 4,
        aiMessage: '네 번째 문제! 사과 3개에 1개를 더하면 모두 몇 개일까요?',
        prompt: '사과의 전체 개수를 골라보세요.',
        options: [
          { text: '3개', emoji: '🍎🍎🍎', feedback: '3개에 1개를 더하면 4개가 된답니다.' },
          { text: '4개', emoji: '🍎🍎🍎🍎', isBest: true, feedback: '딩동댕! 3 더하기 1은 4개예요. 훌륭해요! ✨' },
          { text: '5개', emoji: '🍎🍎🍎🍎🍎', feedback: '괜찮아요. 3에서 하나를 더하면 4개랍니다.' }
        ]
      },
      {
        stepNum: 5,
        aiMessage: '다섯 번째 문제! 1, 2, 3 다음 숫자는 무엇일까요?',
        prompt: '다음 숫자를 골라보세요.',
        options: [
          { text: '4', emoji: '🔢', isBest: true, feedback: '맞아요! 1, 2, 3 다음은 4지요. 차근차근 잘 따라오고 계세요!' },
          { text: '5', emoji: '🔢', feedback: '괜찮아요. 3 바로 다음 숫자는 4답니다.' }
        ]
      },
      {
        stepNum: 6,
        aiMessage: '여섯 번째 문제! 손가락 5개와 5개를 더하면 몇 개일까요?',
        prompt: '5 더하기 5의 정답을 골라보세요.',
        options: [
          { text: '8개', emoji: '✋', feedback: '한 손 5개, 다른 손 5개를 합치면 10개랍니다.' },
          { text: '10개', emoji: '🙌', isBest: true, feedback: '정답이에요! 5 더하기 5는 10개랍니다. 명쾌하세요!' },
          { text: '12개', emoji: '✋', feedback: '괜찮아요. 5 더하기 5는 10이답니다.' }
        ]
      },
      {
        stepNum: 7,
        aiMessage: '일곱 번째 문제! 15와 25 중 더 큰 숫자는 무엇일까요?',
        prompt: '더 큰 숫자를 골라보세요.',
        options: [
          { text: '15', emoji: '🔢', feedback: '괜찮아요. 25가 15보다 10 더 큰 숫자랍니다.' },
          { text: '25', emoji: '🔢', isBest: true, feedback: '맞아요! 25가 15보다 더 큰 수예요. 참 잘하셨어요! 😊' }
        ]
      },
      {
        stepNum: 8,
        aiMessage: '여덟 번째 문제! 시계 맨 위에 있는 숫자는 몇 시일까요?',
        prompt: '시계 꼭대기의 숫자를 골라보세요.',
        options: [
          { text: '6시', emoji: '⏰', feedback: '6시는 시계의 제일 아래쪽에 위치해 있답니다.' },
          { text: '12시', emoji: '🕛', isBest: true, feedback: '딩동댕! 시계 맨 꼭대기에는 12시가 위치해 있어요. 대단하세요!' },
          { text: '9시', emoji: '🕘', feedback: '9시는 시계의 왼쪽 편에 있답니다. 맨 위는 12시예요.' }
        ]
      },
      {
        stepNum: 9,
        aiMessage: '아홉 번째 문제! 빵 5개 중 2개를 먹으면 몇 개가 남을까요?',
        prompt: '남은 빵의 개수를 골라보세요.',
        options: [
          { text: '2개', emoji: '🍞🍞', feedback: '5개에서 2개를 빼면 3개가 남는답니다.' },
          { text: '3개', emoji: '🍞🍞🍞', isBest: true, feedback: '맞았어요! 5 빼기 2는 3개예요. 문제도 척척 잘 푸시네요!' },
          { text: '4개', emoji: '🍞🍞🍞🍞', feedback: '괜찮아요. 5개에서 2개를 빼면 3개가 남아요.' }
        ]
      },
      {
        stepNum: 10,
        aiMessage: '열 번째 문제! 사과 10개, 20개, 30개 중 가장 많은 것은 몇 개일까요?',
        prompt: '가장 많은 사과 개수를 골라보세요.',
        options: [
          { text: '사과 10개', emoji: '🍎', feedback: '사과 10개는 셋 중에서 가장 적은 양이랍니다. 천천히 다시 골라보세요!' },
          { text: '사과 20개', emoji: '🍎', feedback: '사과 20개보다 10개 더 많은 30개가 있답니다.' },
          { text: '사과 30개', emoji: '🍎', isBest: true, feedback: '정답이에요! 30개가 셋 중 가장 푸짐하고 많은 양이에요. 벌써 절반이나 성공하셨어요! 👏' }
        ]
      },
      {
        stepNum: 11,
        aiMessage: '열한 번째 문제! 100원 동전 2개는 모두 얼마일까요?',
        prompt: '동전의 합계 금액을 골라보세요.',
        options: [
          { text: '100원', emoji: '💰', feedback: '100원이 2개 모이면 200원이 돼요.' },
          { text: '200원', emoji: '💰💰', isBest: true, feedback: '맞아요! 100원 두 개는 200원이랍니다. 계산이 정확하세요!' },
          { text: '300원', emoji: '💰💰💰', feedback: '100원 두 개는 200원이 된답니다.' }
        ]
      },
      {
        stepNum: 12,
        aiMessage: '열두 번째 문제! 신발 한 켤레는 몇 개일까요?',
        prompt: '신발 한 켤레의 개수를 골라보세요.',
        options: [
          { text: '1개', emoji: '👟', feedback: '신발은 왼쪽, 오른쪽 2개가 모여 한 쌍이 된답니다.' },
          { text: '2개', emoji: '👟👟', isBest: true, feedback: '딩동댕! 신발 한 켤레는 양발 2개예요. 센스 만점이세요!' },
          { text: '4개', emoji: '👟👟👟👟', feedback: '신발 한 켤레는 왼쪽과 오른쪽 2개랍니다.' }
        ]
      },
      {
        stepNum: 13,
        aiMessage: '열세 번째 문제! 40과 18 중 더 큰 숫자는 무엇일까요?',
        prompt: '더 큰 숫자를 골라보세요.',
        options: [
          { text: '40', emoji: '🔢', isBest: true, feedback: '정답입니다! 40이 18보다 훨씬 더 큰 숫자예요. 아주 훌륭해요!' },
          { text: '18', emoji: '🔢', feedback: '괜찮아요. 40이 18보다 더 큰 숫자랍니다.' }
        ]
      },
      {
        stepNum: 14,
        aiMessage: '열네 번째 문제! 일주일은 며칠일까요?',
        prompt: '일주일의 날짜 수를 골라보세요.',
        options: [
          { text: '5일', emoji: '📅', feedback: '평일은 5일이지만 주말까지 합치면 7일이 돼요.' },
          { text: '7일', emoji: '📅', isBest: true, feedback: '맞았습니다! 월,화,수,목,금,토,일 모두 7일이에요. 달력 보기도 완벽하세요!' },
          { text: '10일', emoji: '📅', feedback: '일주일은 모두 7일로 이루어져 있답니다.' }
        ]
      },
      {
        stepNum: 15,
        aiMessage: '열다섯 번째 문제! 10 더하기 20은 얼마일까요?',
        prompt: '더하기 정답을 골라보세요.',
        options: [
          { text: '20', emoji: '🔢', feedback: '10에 20을 더하면 30이 된답니다.' },
          { text: '30', emoji: '🔢', isBest: true, feedback: '딩동댕! 10 더하기 20은 30이에요. 정답입니다! 🎉' },
          { text: '40', emoji: '🔢', feedback: '10 더하기 20은 30이랍니다.' }
        ]
      },
      {
        stepNum: 16,
        aiMessage: '열여섯 번째 문제! 5, 10, 15 다음 숫자는 무엇일까요?',
        prompt: '5씩 커지는 다음 숫자를 골라보세요.',
        options: [
          { text: '16', emoji: '🔢', feedback: '5씩 더해가면 15 다음은 20이 돼요.' },
          { text: '20', emoji: '🔢', isBest: true, feedback: '맞아요! 5, 10, 15, 20으로 5씩 커진답니다. 완벽한 규칙을 찾으셨어요!' },
          { text: '25', emoji: '🔢', feedback: '15 다음 숫자는 20이 된답니다.' }
        ]
      },
      {
        stepNum: 17,
        aiMessage: '열일곱 번째 문제! 1,000원과 5,000원 중 더 큰 돈은 얼마일까요?',
        prompt: '더 큰 금액을 골라보세요.',
        options: [
          { text: '1,000원', emoji: '💵', feedback: '5,000원이 1,000원보다 더 큰 돈이랍니다.' },
          { text: '5,000원', emoji: '💵', isBest: true, feedback: '정답이에요! 5,000원이 1,000원보다 더 큰 돈이에요. 알뜰한 계산왕이세요!' }
        ]
      },
      {
        stepNum: 18,
        aiMessage: '열여덟 번째 문제! 70과 65 중 더 큰 숫자는 무엇일까요?',
        prompt: '더 큰 숫자를 골라보세요.',
        options: [
          { text: '70', emoji: '👴', isBest: true, feedback: '맞았어요! 70이 65보다 더 큰 숫자랍니다. 존경스러워요!' },
          { text: '65', emoji: '👵', feedback: '70이 65보다 더 큰 숫자랍니다.' }
        ]
      },
      {
        stepNum: 19,
        aiMessage: '열아홉 번째 문제! 6에 얼마를 더해야 10이 될까요?',
        prompt: '10을 만드는 숫자를 골라보세요.',
        options: [
          { text: '3', emoji: '🔢', feedback: '6에 4를 더하면 10이 된답니다.' },
          { text: '4', emoji: '🔢', isBest: true, feedback: '딩동댕! 6에 4를 더하면 딱 10이 돼요. 19번째 문제까지 모두 정복하셨어요!' },
          { text: '5', emoji: '🔢', feedback: '6 더하기 4가 10이 된답니다.' }
        ]
      },
      {
        stepNum: 20,
        aiMessage: '마지막 스무 번째 문제! 오늘 20문제를 모두 푼 나의 점수는 몇 점일까요?',
        prompt: '어르신의 점수를 축하해주세요.',
        options: [
          { text: '🥇 100점 만점에 100점!', emoji: '🥇', isBest: true, feedback: '우와! 축하합니다! 20문제를 모두 훌륭하게 완수하셨어요! 오늘 인지 왕이세요! 👏🎊' },
          { text: '💖 최고로 멋진 100점!', emoji: '💖', isBest: true, feedback: '참 잘하셨어요! 집중력과 끈기가 정말 대단하세요! 늘 행복하세요! 💐' }
        ]
      }
    ]
  },

  /* ── 생활인지 퀴즈 (10문제 · 이미지 카드형 선택지) ── */
  {
    id: 'daily',
    icon: '🏠',
    title: '생활인지 퀴즈',
    summary: '일상생활에서 자주 보는 사물과 상황을 사진으로 함께 맞춰보는 10문제 인지 퀴즈예요.',
    steps: [
      {
        stepNum: 1,
        aiMessage: '첫 번째 문제! 꽃이 피고 새싹이 돋아나는 계절은 언제일까요?',
        prompt: '사진 속 아름다운 봄꽃의 계절을 골라보세요.',
        imageSrc: 'assets/images/spring_flowers.jpg',
        imageAlt: '봄꽃이 만발한 화창한 풍경',
        imageCaption: '🌸 따스한 봄 햇살과 활짝 핀 봄꽃',
        options: [
          { text: '봄', emoji: '🌸', isBest: true,
            feedback: '맞아요! 봄에는 꽃이 피고 새싹이 돋아나요. 참 잘하셨어요!' },
          { text: '여름', emoji: '☀️',
            feedback: '괜찮아요. 꽃이 피고 새싹이 나는 건 봄이랍니다.' },
          { text: '가을', emoji: '🍁',
            feedback: '괜찮아요. 봄에 꽃이 피고 새싹이 돋아난답니다.' },
          { text: '겨울', emoji: '❄️',
            feedback: '괜찮아요. 봄이 꽃의 계절이에요!' }
        ]
      },
      {
        stepNum: 2,
        aiMessage: '두 번째 문제! 사진 속 상 위에 보글보글 끓고 있는 구수한 찌개는 무엇일까요?',
        prompt: '사진 속 찌개의 이름을 골라보세요.',
        imageSrc: 'assets/images/korean_stew_table.jpg',
        imageAlt: '보글보글 끓는 된장찌개 밥상',
        imageCaption: '🍲 뚝배기에서 보글보글 끓는 구수한 찌개 밥상',
        options: [
          { text: '된장찌개', emoji: '🍲', isBest: true,
            feedback: '딩동! 맞아요! 구수하고 맛있는 된장찌개예요. 정말 잘 아세요!' },
          { text: '김치찌개', emoji: '🌶️',
            feedback: '괜찮아요. 사진 속 음식은 구수한 된장찌개랍니다.' },
          { text: '미역국', emoji: '🌊',
            feedback: '괜찮아요. 된장찌개예요. 구수한 냄새가 날 것 같지요?' },
          { text: '삼계탕', emoji: '🍗',
            feedback: '괜찮아요. 사진은 된장찌개랍니다!' }
        ]
      },
      {
        stepNum: 3,
        aiMessage: '세 번째 문제! 시골 마당에 줄지어 서 있는 이 전통 그릇들은 무엇일까요?',
        prompt: '마당에 줄지어 있는 물건을 골라보세요.',
        imageSrc: 'assets/images/nostalgic_village.jpg',
        imageAlt: '시골 마당의 장독대',
        imageCaption: '🏺 장과 김치를 보관하는 정겨운 마당 장독대',
        options: [
          { text: '장독대', emoji: '🏺', isBest: true,
            feedback: '맞아요! 장독대예요. 간장, 된장, 고추장이 들어있지요. 추억이 새록새록하시죠?' },
          { text: '화분', emoji: '🌱',
            feedback: '괜찮아요. 사진은 전통 장독대랍니다. 어릴 때 보셨을 것 같아요.' },
          { text: '우물', emoji: '💧',
            feedback: '괜찮아요. 줄지어 있는 항아리들이 바로 장독대예요.' },
          { text: '나무', emoji: '🌳',
            feedback: '괜찮아요. 사진은 장독대랍니다!' }
        ]
      },
      {
        stepNum: 4,
        aiMessage: '네 번째 문제! 해를 바라보며 활짝 피어난 이 노란 꽃은 무엇일까요?',
        prompt: '노란 꽃의 이름을 골라보세요.',
        imageSrc: 'assets/images/korean_sunflower.jpg',
        imageAlt: '활짝 핀 해바라기꽃',
        imageCaption: '🌻 황금빛 꽃잎을 활짝 펼친 키 큰 해바라기',
        options: [
          { text: '해바라기', emoji: '🌻', isBest: true,
            feedback: '맞아요! 해바라기예요! 해를 향해 고개를 돌리는 예쁜 꽃이지요. 아주 잘 아세요!' },
          { text: '국화', emoji: '🌼',
            feedback: '괜찮아요. 노란 큰 꽃은 해바라기예요.' },
          { text: '무궁화', emoji: '🌺',
            feedback: '괜찮아요. 해를 따라 고개 드는 꽃은 해바라기랍니다.' },
          { text: '장미', emoji: '🌹',
            feedback: '괜찮아요. 사진은 해바라기예요!' }
        ]
      },
      {
        stepNum: 5,
        aiMessage: '다섯 번째 문제! 바구니에 담긴 탐스럽고 붉은 과일은 무엇일까요?',
        prompt: '빨간 과일의 이름을 골라보세요.',
        imageSrc: 'assets/images/fruits_basket.jpg',
        imageAlt: '과일 바구니',
        imageCaption: '🍎 탐스럽게 익은 달콤한 빨간 사과',
        options: [
          { text: '사과', emoji: '🍎', isBest: true,
            feedback: '딩동! 맞아요! 빨간 사과예요. 사과를 좋아하시나요? 맛있겠지요!' },
          { text: '토마토', emoji: '🍅',
            feedback: '괜찮아요. 바구니 속 빨간 과일은 사과랍니다!' },
          { text: '수박', emoji: '🍉',
            feedback: '괜찮아요. 빨간 둥근 과일은 사과예요.' },
          { text: '딸기', emoji: '🍓',
            feedback: '괜찮아요. 바구니 속 빨간 과일은 사과랍니다!' }
        ]
      },
      {
        stepNum: 6,
        aiMessage: '여섯 번째 문제! 붉은 열매를 달여 만든 따뜻하고 달콤한 전통 차는 무엇일까요?',
        prompt: '따뜻한 전통 차의 이름을 골라보세요.',
        imageSrc: 'assets/images/warm_jujube_tea.jpg',
        imageAlt: '대추차 한잔',
        imageCaption: '🍵 붉은 대추를 띄운 따뜻하고 구수한 전통 대추차',
        options: [
          { text: '대추차', emoji: '🍵', isBest: true,
            feedback: '맞아요! 대추차예요. 몸에 좋고 달콤한 우리 전통 차지요. 어르신께서 잘 아세요!' },
          { text: '녹차', emoji: '🍃',
            feedback: '괜찮아요. 빨간 열매가 들어있는 건 대추차랍니다.' },
          { text: '식혜', emoji: '🥤',
            feedback: '괜찮아요. 이건 대추차예요. 달콤하고 따뜻해요.' },
          { text: '커피', emoji: '☕',
            feedback: '괜찮아요. 사진 속 전통차는 대추차랍니다!' }
        ]
      },
      {
        stepNum: 7,
        aiMessage: '일곱 번째 문제! 칠판과 책걸상이 놓여 있는 이곳은 어디일까요?',
        prompt: '사진 속 장소를 골라보세요.',
        imageSrc: 'assets/images/ai_friend_classroom.jpg',
        imageAlt: '디지털 학교 교실',
        imageCaption: '🏫 선생님과 함께 공부하는 정겨운 학교 교실',
        options: [
          { text: '학교 교실', emoji: '🏫', isBest: true,
            feedback: '맞아요! 학교 교실이에요. 우리가 지금 공부하는 곳이지요. 반가우시죠?' },
          { text: '병원', emoji: '🏥',
            feedback: '괜찮아요. 칠판이 있고 공부하는 곳은 학교 교실이랍니다.' },
          { text: '시장', emoji: '🏪',
            feedback: '괜찮아요. 책걸상이 있는 이 곳은 교실이에요.' },
          { text: '공원', emoji: '🌳',
            feedback: '괜찮아요. 이 곳은 학교 교실이랍니다!' }
        ]
      },
      {
        stepNum: 8,
        aiMessage: '여덟 번째 문제! 가을 추수철에 두 형제가 지게에 싣고 나르는 것은 무엇일까요?',
        prompt: '두 사람이 나르고 있는 것을 골라보세요.',
        imageSrc: 'assets/images/story_brothers.jpg',
        imageAlt: '볏단을 나르는 형제',
        imageCaption: '🌾 황금 들판에서 벤 벼를 묶어놓은 볏단',
        options: [
          { text: '볏단(벼)', emoji: '🌾', isBest: true,
            feedback: '맞아요! 볏단이에요. 가을 추수 때 서로 도우며 일하는 의좋은 형제 이야기지요!' },
          { text: '장작', emoji: '🌲',
            feedback: '괜찮아요. 가을 추수철에 형제가 나르는 건 볏단이에요.' },
          { text: '짐보따리', emoji: '🎒',
            feedback: '괜찮아요. 황금빛 볏단을 함께 나르고 있답니다.' },
          { text: '물항아리', emoji: '🏺',
            feedback: '괜찮아요. 형제가 나르는 건 가을 추수의 볏단이랍니다!' }
        ]
      },
      {
        stepNum: 9,
        aiMessage: '아홉 번째 문제! 마당 평상에 둘러앉아 사람들이 함께 하고 있는 것은 무엇일까요?',
        prompt: '사람들이 함께 하고 있는 일을 골라보세요.',
        imageSrc: 'assets/images/story_brothers_dinner.jpg',
        imageAlt: '마당 평상에서 함께하는 즐거운 저녁 식사',
        imageCaption: '🍚 밥상에 둘러앉아 오순도순 나누는 즐거운 식사',
        options: [
          { text: '함께 밥 먹기', emoji: '🍚', isBest: true,
            feedback: '맞아요! 마당에서 다함께 밥을 먹는 정겨운 모습이에요. 옛날 생각이 나시지요?' },
          { text: '농사짓기', emoji: '🌱',
            feedback: '괜찮아요. 여럿이 모여 함께 식사하는 모습이에요.' },
          { text: '운동하기', emoji: '🏃',
            feedback: '괜찮아요. 마당에서 밥 먹는 정겨운 풍경이랍니다.' },
          { text: '빨래하기', emoji: '👕',
            feedback: '괜찮아요. 함께 식사하는 훈훈한 장면이에요!' }
        ]
      },
      {
        stepNum: 10,
        aiMessage: '마지막 열 번째 문제! 해바라기가 마당에 가득 피어나는 계절은 언제일까요?',
        prompt: '해바라기가 피는 계절을 골라보세요.',
        imageSrc: 'assets/images/story_courtyard_sunflower.jpg',
        imageAlt: '마당의 해바라기',
        imageCaption: '☀️ 눈부신 햇살 아래 해바라기가 피는 여름',
        options: [
          { text: '여름', emoji: '☀️', isBest: true,
            feedback: '딩동! 맞아요! 해바라기가 활짝 핀 건 여름이에요. 10문제를 모두 훌륭히 완성하셨어요!' },
          { text: '봄', emoji: '🌸',
            feedback: '괜찮아요. 해바라기가 활짝 피는 건 여름이에요. 10문제 모두 수고하셨어요!' },
          { text: '가을', emoji: '🍁',
            feedback: '괜찮아요. 해바라기 계절은 여름이랍니다. 끝까지 함께해 주셔서 감사해요!' },
          { text: '겨울', emoji: '❄️',
            feedback: '괜찮아요. 여름에 해바라기가 피어난답니다. 오늘 정말 잘하셨어요!' }
        ]
      }
    ]
  },

  /* =======================================================================
   * 8대 핵심 AI 커리큘럼 수업 (AI 기초, 질문하기, 글쓰기, 이미지, 영상, 음악, 생활활용, 퀴즈)
   * 화면 글자(screenText)와 음성 대본(voiceScript)을 완전 분리한 AI 선생님 맞춤형 강좌
   * ======================================================================= */
  {
    id: 'ai_basic',
    icon: '🤖',
    title: 'AI 기초',
    summary: 'AI가 무엇인지 알아보고, 저녁 메뉴 추천 실습을 함께해요.',
    steps: [
      {
        stepNum: 1,
        page: 'ai_basic_intro',
        screenText: 'AI는 무엇일까요?',
        chatExample: true,
        voiceScript: '좋아요. 오늘은 AI가 무엇인지부터 알아볼게요. 어렵게 생각하지 않으셔도 됩니다. AI는 우리가 질문하면 답을 해주거나, 글을 쓰고, 그림이나 영상을 만드는 것을 도와주는 기술이에요.',
        prompt: 'AI는 무엇을 도와주는 기술일까요?',
        imageSrc: 'assets/images/ai-assistant-tablet.png',
        imageAlt: '태블릿으로 ChatGPT(챗지피티) 화면을 보며 AI 도움을 확인하는 모습',
        imageCaption: '🤖 질문에 답하고 글과 정보를 도와주는 챗지피티(ChatGPT) AI',
        helpScript: 'AI가 어떤 일을 해주는 친구인지 편안하게 들어보시고, 아래 버튼을 눌러보세요.',
        options: [
          { text: '질문 답하기, 글·그림·영상 만들기', emoji: '✨', isBest: true, feedback: '맞았어요! 정말 잘하셨어요.' },
          { text: '복잡한 기계 수리하기', emoji: '🔧', isBest: false, feedback: '괜찮아요. 한 번만 다시 생각해볼까요?' }
        ]
      },
      {
        stepNum: 2,
        page: 'ai_basic_examples',
        screenText: 'AI가 도와줄 수 있는 일들',
        chatExample: true,
        voiceScript: '예를 들어, 오늘 저녁 메뉴를 추천해달라고 할 수도 있고, 편지를 작성해달라고 할 수도 있고, 원하는 그림을 만들어달라고 할 수도 있어요.',
        prompt: 'AI에게 어떤 것을 부탁해볼 수 있을까요?',
        imageSrc: 'assets/images/ai-assistant-tablet.png',
        imageAlt: '챗지피티(ChatGPT) 화면에 표시된 저녁 메뉴 추천과 편지 글쓰기 도움 예시',
        imageCaption: '💡 챗지피티(ChatGPT)에게 부탁할 수 있는 생활 속 도움',
        helpScript: '일상에서 AI에게 부탁할 수 있는 재미있는 일들을 확인해보고 다음으로 넘어가 보세요.',
        options: [
          { text: '저녁 메뉴 추천, 편지 쓰기, 그림 만들기', emoji: '💡', isBest: true, feedback: '정답입니다. 아주 잘 기억하고 계시네요.' },
          { text: '아무것도 부탁할 수 없다', emoji: '❌', isBest: false, feedback: '조금 아쉬웠어요. 힌트를 한번 볼까요?' }
        ]
      },
      {
        stepNum: 3,
        page: 'ai_basic_practice',
        screenText: '직접 한번 해볼까요?',
        chatExample: true,
        voiceScript: '그럼 직접 한번 해볼까요? 아래 입력창에 오늘 저녁 메뉴 추천해줘 라고 적어보세요.',
        prompt: '아래 버튼을 눌러 AI에게 저녁 메뉴를 물어보세요.',
        imageSrc: 'assets/images/ai-assistant-tablet.png',
        imageAlt: '챗지피티(ChatGPT)에 저녁 메뉴를 추천해달라고 질문하는 모습',
        imageCaption: '💬 챗지피티(ChatGPT) 대화창 질문 예시',
        helpScript: '아래에 준비된 질문 버튼을 톡 누르시면 AI가 바로 답을 해드립니다.',
        options: [
          { text: '오늘 저녁 메뉴 추천해줘 🍲', emoji: '🍚', isBest: true, feedback: '잘하셨어요! 벌써 AI에게 질문하는 방법 하나를 배우셨네요.' },
          { text: '가족에게 보낼 따뜻한 안부 문자 써줘 💌', emoji: '✉️', isBest: true, feedback: '참 잘하셨어요! 가족을 생각하는 마음이 참 곱네요.' }
        ]
      },
      {
        stepNum: 4,
        page: 'ai_basic_success',
        screenText: '첫 AI 대화 성공!',
        chatExample: 'stew',
        voiceScript: '잘하셨어요! 벌써 AI에게 질문하는 방법 하나를 배우셨네요.',
        prompt: 'AI가 구수한 된장찌개와 나물 반찬을 추천해 드렸어요!',
        imageSrc: 'assets/images/korean_stew_table.jpg',
        imageAlt: '따뜻한 된장찌개 밥상',
        imageCaption: '✨ AI의 추천: 따뜻한 된장찌개와 나물 반찬',
        helpScript: 'AI가 정성껏 추천해 준 메뉴를 확인해보세요. 첫 실습을 훌륭히 마치셨어요!',
        options: [
          { text: '와, 정말 신기하고 맛있겠어요! 👏', emoji: '😋', isBest: true, feedback: '맞아요! 바로 그겁니다. 다음 수업도 함께해요!' }
        ]
      }
    ]
  },

  {
    id: 'prompt_basic',
    icon: '💡',
    title: '내가 알고 싶은 것 질문하기',
    summary: '궁금한 것을 쉬운 말로 물어보는 연습을 해요.',
    steps: [
      {
        stepNum: 1,
        page: 'prompt_basic_intro',
        screenText: 'AI에게 부탁하기 (프롬프트)',
        chatExample: true,
        voiceScript: '이번에는 AI에게 조금 더 잘 부탁하는 방법을 알아볼게요. AI에게 부탁하는 문장을 프롬프트라고 합니다. 하지만 이름은 어렵게 외우지 않으셔도 돼요. AI에게 무엇을 해달라고 부탁하는 문장이라고 생각하시면 됩니다.',
        prompt: '궁금한 것이 있을 때 AI에게 어떻게 하면 될까요?',
        imageSrc: 'assets/images/ai-assistant-tablet.png',
        imageAlt: 'AI 대화창에 부탁하는 문장을 입력하는 모습',
        imageCaption: '💬 궁금한 것을 편하게 물어보세요',
        helpScript: '궁금한 것을 평소 말하듯 물어보면 돼요. 어려운 말은 쓰지 않아도 괜찮아요.',
        options: [
          { text: '궁금한 것을 말로 물어보기', emoji: '💬', isBest: true, feedback: '정답이에요. 천천히 배우고 있는데 정말 잘하고 계세요.' },
          { text: '복잡한 컴퓨터 코드', emoji: '💻', isBest: false, feedback: '괜찮습니다. 배우는 중에는 얼마든지 틀릴 수 있어요.' }
        ]
      },
      {
        stepNum: 2,
        page: 'prompt_basic_example',
        chatExample: 'travel',
        screenText: '조금 더 자세하게 부탁하기',
        voiceScript: '예를 들어 여행 계획을 만들어줘 라고 하는 것보다, 부산으로 2박 3일 여행을 가려고 해. 걷는 거리가 많지 않은 일정으로 만들어줘. 라고 말하면 AI가 훨씬 자세하게 답해줄 수 있어요.',
        prompt: '어떤 문장으로 말했을 때 AI가 더 자세하게 답해줄까요?',
        imageSrc: 'assets/images/travel-plan-tablet.png',
        imageAlt: '태블릿에 정리된 지역명 없는 2박 3일 여행 일정',
        imageCaption: '🧳 기간과 이동 방법을 정해 여행 부탁하기',
        helpScript: '자세하게 이야기할수록 AI가 내 마음에 쏙 들게 도와줍니다.',
        options: [
          { text: '부산으로 2박 3일, 걷는 거리가 적은 여행 일정으로 만들어줘', emoji: '🚅', isBest: true, feedback: '맞았어요! 정말 잘하셨어요.' },
          { text: '그냥 여행 계획 알아서 만들어줘', emoji: '❓', isBest: false, feedback: '이번에는 다른 답을 한번 골라볼까요?' }
        ]
      },
      {
        stepNum: 3,
        page: 'prompt_basic_core',
        chatExample: 'travel',
        screenText: '가장 중요한 3가지',
        voiceScript: '가장 중요한 건 세 가지예요. 무엇을 원하는지, 누구를 위한 것인지, 어떤 방식으로 만들어달라는지, 조금만 자세하게 알려주는 겁니다.',
        prompt: 'AI에게 질문할 때 무엇을 알려주면 좋을까요?',
        imageSrc: 'assets/images/travel-plan-tablet.png',
        imageAlt: '버스 이동과 벤치 휴식이 포함된 3일 여행 계획',
        imageCaption: '🎯 원하는 것: 여행 · 대상: 나 · 방식: 걷는 거리 적게',
        helpScript: '원하는 것, 대상, 만들어달라는 방식 3가지를 마음에 쏙 담아두세요.',
        options: [
          { text: '원하는 것, 대상, 만들어달라는 방식', emoji: '🌟', isBest: true, feedback: '잘하셨어요. 이제 확실히 이해하셨네요.' },
          { text: '어려운 영어와 숫자', emoji: '🔤', isBest: false, feedback: '천천히 해보세요. 정답을 찾을 수 있을 거예요.' }
        ]
      }
    ]
  },

  {
    id: 'ai_writing',
    icon: '✍️',
    title: '글쓰기',
    summary: '감사 문자, 이메일, 소개글을 AI와 함께 따뜻하게 작성해요.',
    steps: [
      {
        stepNum: 1,
        page: 'ai_writing_intro',
        screenText: 'AI로 다양한 글 만들기',
        voiceScript: '이번에는 AI를 이용해서 글을 만들어볼게요. AI는 문자, 이메일, 블로그 글, 소개글처럼 여러 가지 글쓰기를 도와줄 수 있어요.',
        prompt: 'AI가 작성을 도와줄 수 있는 글은 무엇일까요?',
        imageSrc: 'assets/images/manuscript-handwriting.png',
        imageAlt: '원고지에 연필로 고마운 마음을 전합니다라고 직접 쓰는 어르신의 손',
        imageCaption: '💌 따뜻한 마음을 전하는 글쓰기',
        helpScript: '일상생활에서 자주 쓰는 문자와 편지를 AI와 함께 써볼 수 있어요.',
        options: [
          { text: '안부 문자, 감사 편지, 정겨운 소개글', emoji: '📝', isBest: true, feedback: '정답입니다. 아주 잘 기억하고 계시네요.' },
          { text: '어려운 시험 문제만 작성 가능', emoji: '📑', isBest: false, feedback: '괜찮아요. 한 번만 다시 생각해볼까요?' }
        ]
      },
      {
        stepNum: 2,
        page: 'ai_writing_example',
        screenText: '감사 문자 예시',
        voiceScript: '예를 들어 선생님께 감사 문자를 써줘. 라고 부탁할 수도 있어요.',
        prompt: '감사 문자를 쓰려면 AI에게 어떻게 부탁하면 될까요?',
        imageSrc: 'assets/images/thank-you-message.png',
        imageAlt: '휴대전화로 선생님께 감사 문자를 작성하는 손',
        imageCaption: '💌 선생님께 보내는 감사 문자',
        helpScript: '평소 고마웠던 분에게 보낼 문자를 AI에게 어떻게 부탁하는지 살펴보세요.',
        options: [
          { text: '선생님께 감사 문자를 써줘', emoji: '💐', isBest: true, feedback: '맞아요! 바로 그겁니다.' },
          { text: '아무 말도 하지 않는다', emoji: '🤐', isBest: false, feedback: '조금 아쉬웠어요. 힌트를 한번 볼까요?' }
        ]
      },
      {
        stepNum: 3,
        page: 'ai_writing_mood',
        screenText: '원하는 분위기 추가하기',
        voiceScript: '여기에 조금 더 공손하게 해줘. 짧게 만들어줘. 따뜻하게 작성해줘. 처럼 원하는 분위기를 추가할 수도 있습니다.',
        prompt: '문자에 어떤 분위기를 덧붙여 말할 수 있을까요?',
        chatExample: 'thank-you',
        imageSrc: 'assets/images/thank-you-message.png',
        imageAlt: '선생님 감사합니다, 늘 건강하세요라는 공손한 감사 문자',
        imageCaption: '💖 공손하게, 짧게, 따뜻하게!',
        helpScript: '공손하게, 짧게, 따뜻하게 처럼 원하는 느낌을 덧붙여 말해보세요.',
        options: [
          { text: '공손하고 따뜻하게 작성해줘', emoji: '🥰', isBest: true, feedback: '정답이에요. 천천히 배우고 있는데 정말 잘하고 계세요.' },
          { text: '화내면서 거칠게 작성해줘', emoji: '😠', isBest: false, feedback: '괜찮습니다. 배우는 중에는 얼마든지 틀릴 수 있어요.' }
        ]
      },
      {
        stepNum: 4,
        page: 'ai_writing_practice',
        screenText: '직접 글 써보기',
        voiceScript: '이번에는 직접 해볼까요? 아래 입력창에 만들고 싶은 글을 적어보세요.',
        prompt: '마음에 드는 감사 문자 완성본을 하나 선택해보세요.',
        imageSrc: 'assets/images/thank-you-message.png',
        imageAlt: '휴대전화 화면에 작성된 감사 문자 예시',
        imageCaption: '✨ AI가 완성해 드린 따뜻한 감사 문자',
        helpScript: '준비된 멋진 감사 문자 완성본을 눌러보세요.',
        options: [
          { text: '선생님, 늘 따뜻하게 가르쳐 주셔서 감사드립니다. 건강하세요! 💌', emoji: '🌸', isBest: true, feedback: '와~ 정말 감동적인 글이 완성되었어요! 아주 훌륭해요.' }
        ]
      }
    ]
  },

  {
    id: 'ai_image',
    icon: '🎨',
    title: '이미지 만들기',
    summary: '말로 설명하면 AI가 멋진 한 폭의 그림을 그려줘요.',
    steps: [
      {
        stepNum: 1,
        page: 'ai_image_intro',
        screenText: '말로 그리는 AI 그림',
        chatExample: 'image',
        voiceScript: '이번에는 AI로 그림을 만들어볼게요. 그림을 잘 그리지 못해도 괜찮습니다. 원하는 모습을 말로 설명하면 AI가 그림을 만들어줄 수 있어요.',
        prompt: '그림을 잘 그리지 못해도 AI 그림을 만들 수 있을까요?',
        imageSrc: 'assets/images/autumn-reading-illustration.png',
        imageAlt: '따뜻한 가을 공원 벤치에서 책 읽는 할머니 일러스트',
        imageCaption: '🎨 말로 설명할 수 있는 그림 예시',
        helpScript: '원하는 모습을 말로 설명하면 AI가 멋지게 그려준답니다.',
        options: [
          { text: '네! 원하는 모습을 말로 설명하면 돼요', emoji: '🖌️', isBest: true, feedback: '맞았어요! 정말 잘하셨어요.' },
          { text: '전문 화가만 그릴 수 있다', emoji: '🎨', isBest: false, feedback: '괜찮아요. 한 번만 다시 생각해볼까요?' }
        ]
      },
      {
        stepNum: 2,
        page: 'ai_image_tips',
        screenText: '좋은 그림을 만드는 4가지 설명',
        chatExample: 'image',
        voiceScript: '좋은 이미지를 만들려면 무엇이 나오는지, 어디에 있는지, 어떤 분위기인지, 어떤 그림 스타일인지 알려주면 좋습니다.',
        prompt: '좋은 그림을 만들기 위해 AI에게 알려주면 좋은 네 가지는?',
        imageSrc: 'assets/images/autumn-reading-illustration.png',
        imageAlt: '가을 공원에서 책 읽는 할머니를 부드럽게 그린 일러스트',
        imageCaption: '💡 할머니 · 가을 공원 · 따뜻한 햇살 · 일러스트',
        helpScript: '인물, 장소, 분위기, 그림 스타일 4가지를 짚어보세요.',
        options: [
          { text: '무엇이, 어디에, 어떤 분위기, 어떤 스타일인지', emoji: '🖼️', isBest: true, feedback: '정답입니다. 아주 잘 기억하고 계시네요.' },
          { text: '물감의 화학 성분과 붓의 가격', emoji: '🧪', isBest: false, feedback: '조금 아쉬웠어요. 힌트를 한번 볼까요?' }
        ]
      },
      {
        stepNum: 3,
        page: 'ai_image_example',
        screenText: '따뜻한 가을 공원 그림 예시',
        chatExample: 'image',
        voiceScript: '예를 들어 가을 공원 벤치에 앉아 책을 읽고 있는 할머니, 따뜻한 오후 햇살, 부드러운 일러스트 스타일 이라고 입력할 수 있어요.',
        prompt: '예시 문장으로 어떤 그림이 그려질지 확인해보세요.',
        imageSrc: 'assets/images/autumn-reading-illustration.png',
        imageAlt: '따뜻한 오후 햇살 아래 가을 공원 벤치에서 책 읽는 할머니',
        imageCaption: '🍂 예시 문장과 같은 장면의 그림',
        helpScript: '한 줄의 설명이 그림으로 피어나는 과정을 확인해보세요.',
        options: [
          { text: '따뜻한 오후 햇살 아래 가을 공원 그림 완성하기', emoji: '🍁', isBest: true, feedback: '맞아요! 바로 그겁니다.' }
        ]
      },
      {
        stepNum: 4,
        page: 'ai_image_practice',
        screenText: '직접 그림 설명해보기',
        chatExample: 'image',
        voiceScript: '이제 직접 만들어볼까요? 아래 입력창에 만들고 싶은 그림을 편하게 설명해보세요.',
        prompt: '이 그림을 만들려면 어떤 설명이 좋을까요?',
        imageSrc: 'assets/images/autumn-reading-illustration.png',
        imageAlt: '책과 벤치, 가을 나무가 보이는 할머니의 그림',
        imageCaption: '🖼️ 그림 속 인물과 배경을 설명해보세요',
        helpScript: '아래 보기에서 그림 속 인물이나 분위기를 설명하는 문장을 골라보세요.',
        options: [
          { text: '가을 공원 벤치에서 책 읽는 할머니', emoji: '🌸', isBest: true, feedback: '와~ 잘 만드셨어요. 처음부터 완벽하지 않아도 괜찮아요.' },
          { text: '따뜻한 햇살과 부드러운 일러스트 느낌', emoji: '🍁', isBest: true, feedback: '와~ 참 고운 그림이네요! 아주 잘 만드셨어요.' }
        ]
      },
      {
        stepNum: 5,
        page: 'ai_image_complete',
        screenText: '멋진 그림 완성!',
        voiceScript: '와~ 잘 만드셨어요. 처음부터 완벽하지 않아도 괜찮아요. 마음에 들지 않는 부분이 있으면 AI에게 다시 수정해달라고 부탁하면 됩니다.',
        prompt: '예시 그림에서 마음에 드는 부분을 찾아보세요.',
        imageSrc: 'assets/images/autumn-reading-illustration.png',
        imageAlt: '가을 공원 벤치에서 책 읽는 할머니의 완성 예시',
        imageCaption: '✨ 가을 공원 그림 예시를 감상해요',
        helpScript: '마음에 들지 않는 부분은 언제든 다시 고쳐달라고 말하면 된답니다.',
        options: [
          { text: '정말 마음에 들어요! 다음으로 넘어가요', emoji: '👏', isBest: true, feedback: '잘하셨어요. 이제 확실히 이해하셨네요.' }
        ]
      }
    ]
  },

  {
    id: 'ai_video',
    icon: '🎬',
    title: '영상 만들기',
    summary: '인물, 행동, 장소, 카메라 움직임을 더해 생생한 영상을 만들어요.',
    steps: [
      {
        stepNum: 1,
        page: 'ai_video_intro',
        screenText: '움직이는 AI 영상',
        voiceScript: '이번에는 AI 영상 만들기를 배워볼게요. 이미지를 움직이게 만들거나, 글로 장면을 설명해서 짧은 영상을 만들 수도 있습니다.',
        prompt: 'AI로 영상을 만드는 방법으로 알맞은 것은?',
        imageSrc: 'assets/images/video-walking-editor.png',
        imageAlt: '걷는 할머니의 연속 장면과 재생 버튼이 있는 영상 편집 예시',
        imageCaption: '🎬 여러 장면이 이어지는 영상 만들기',
        helpScript: '그림이 살아 움직이거나 글 설명이 영상으로 완성되는 신기한 기술이에요.',
        options: [
          { text: '이미지를 움직이게 하거나 글로 장면을 설명한다', emoji: '🎞️', isBest: true, feedback: '정답이에요. 천천히 배우고 있는데 정말 잘하고 계세요.' },
          { text: '직접 무거운 방송 카메라를 들고 뛰어야 한다', emoji: '📹', isBest: false, feedback: '괜찮아요. 한 번만 다시 생각해볼까요?' }
        ]
      },
      {
        stepNum: 2,
        page: 'ai_video_factors',
        screenText: '영상 만들기의 4가지 포인트',
        voiceScript: '영상에서는 네 가지를 생각하면 쉬워요. 누가 나오는지, 무엇을 하는지, 어디에 있는지, 카메라가 어떻게 움직이는지입니다.',
        prompt: '영상 제작 시 기억해야 할 네 가지는?',
        imageSrc: 'assets/images/video-walking-editor.png',
        imageAlt: '할머니가 가을 공원에서 카메라를 향해 걷는 연속 장면',
        imageCaption: '🔍 할머니 · 걷기 · 가을 공원 · 앞에서 따라가기',
        helpScript: '누가 무엇을 어디서 하는지, 카메라가 어떻게 찍는지 4가지를 떠올려보세요.',
        options: [
          { text: '누가, 무엇을, 어디서, 카메라가 어떻게 움직이는지', emoji: '🎬', isBest: true, feedback: '맞았어요! 정말 잘하셨어요.' },
          { text: '방송국 PD의 이름과 전화번호', emoji: '☎️', isBest: false, feedback: '조금 아쉬웠어요. 힌트를 한번 볼까요?' }
        ]
      },
      {
        stepNum: 3,
        page: 'ai_video_example',
        screenText: '공원 산책 영상 예시',
        voiceScript: '예를 들어 가을 공원을 걷는 할머니, 천천히 미소를 지으며 앞으로 걸어간다. 카메라는 앞에서 천천히 따라간다. 처럼 작성할 수 있어요.',
        prompt: '카메라가 따라가는 모습을 상상해보세요.',
        imageSrc: 'assets/images/video-walking-editor.png',
        imageAlt: '가을 공원을 걷는 할머니가 점점 가까워지는 영상 장면 예시',
        imageCaption: '🚶‍♀️ 카메라가 앞에서 따라가는 산책 장면',
        helpScript: '카메라가 앞에서 부드럽게 비춰주는 장면을 떠올려보세요.',
        options: [
          { text: '미소 지으며 걸어가는 5초 클립 영상 만들기', emoji: '🎥', isBest: true, feedback: '맞아요! 바로 그겁니다.' }
        ]
      },
      {
        stepNum: 4,
        page: 'ai_video_cheer',
        screenText: '짧은 영상부터 시작해요',
        voiceScript: '처음에는 짧은 영상부터 시작하는 것이 좋습니다. 5초나 8초짜리 영상 하나부터 만들어보세요.',
        prompt: '처음 AI 영상을 만들 때는 몇 초짜리부터 시작하는 게 좋을까요?',
        imageSrc: 'assets/images/video-walking-editor.png',
        imageAlt: '00:05 표시와 재생 버튼이 있는 짧은 영상 편집 화면',
        imageCaption: '⏱️ 5초짜리 영상 구성 예시',
        helpScript: '부담 없이 5초 내외의 귀여운 영상부터 도전해 보세요.',
        options: [
          { text: '5초나 8초짜리 짧은 영상 하나부터', emoji: '🌟', isBest: true, feedback: '잘하셨어요. 이제 확실히 이해하셨네요.' },
          { text: '처음부터 3시간짜리 대작 영화', emoji: '🎬', isBest: false, feedback: '천천히 해보세요. 정답을 찾을 수 있을 거예요.' }
        ]
      }
    ]
  },

  {
    id: 'ai_music',
    icon: '🎵',
    title: '음악 만들기',
    summary: '악기를 다루지 못해도 원하는 분위기로 멋진 음악을 만들어요.',
    steps: [
      {
        stepNum: 1,
        page: 'ai_music_intro',
        screenText: '나만의 멜로디 만들기',
        voiceScript: '이번에는 AI로 음악을 만들어볼게요. 악기를 연주하지 못해도 괜찮아요. 원하는 음악 분위기를 말해주면 AI가 음악 만들기를 도와줄 수 있습니다.',
        prompt: '악기를 연주하지 못해도 AI 음악을 만들 수 있을까요?',
        imageSrc: 'assets/images/music-creation-studio.png',
        imageAlt: '노트북 음악 제작 화면과 피아노, 기타, 마이크',
        imageCaption: '🎶 원하는 분위기를 설명하는 음악 만들기',
        helpScript: '악기를 칠 줄 몰라도 내가 원하는 느낌을 말하면 노래가 만들어져요.',
        options: [
          { text: '네! 원하는 분위기만 말해주면 돼요', emoji: '🎹', isBest: true, feedback: '정답입니다. 아주 잘 기억하고 계시네요.' },
          { text: '피아노를 10년 이상 쳐야 한다', emoji: '🎼', isBest: false, feedback: '괜찮아요. 한 번만 다시 생각해볼까요?' }
        ]
      },
      {
        stepNum: 2,
        page: 'ai_music_factors',
        screenText: '음악을 설명하는 방법',
        voiceScript: '음악을 만들 때는 분위기, 장르, 빠르기, 사용할 악기, 남성 또는 여성 목소리 같은 내용을 알려주면 좋아요.',
        prompt: '음악을 만들 때 AI에게 알려주면 좋은 것들은?',
        imageSrc: 'assets/images/music-creation-studio.png',
        imageAlt: '피아노와 기타의 소리 파형 및 보컬 녹음용 마이크',
        imageCaption: '🎹 분위기 · 악기 · 빠르기 · 목소리로 설명해요',
        helpScript: '신나는 트로트, 잔잔한 클래식, 부드러운 목소리 등 원하는 스타일을 떠올려보세요.',
        options: [
          { text: '분위기, 장르, 빠르기, 악기, 목소리', emoji: '🎸', isBest: true, feedback: '맞았어요! 정말 잘하셨어요.' },
          { text: '스피커의 제조사와 전깃줄 길이', emoji: '🔌', isBest: false, feedback: '조금 아쉬웠어요. 힌트를 한번 볼까요?' }
        ]
      },
      {
        stepNum: 3,
        page: 'ai_music_example',
        screenText: '가을 저녁 노래 예시',
        voiceScript: '예를 들어 따뜻한 가을 저녁 분위기, 잔잔한 피아노와 기타, 여성 보컬, 천천히 흐르는 감성적인 노래 처럼 입력해볼 수 있습니다.',
        prompt: '가을 저녁 노래를 듣고 감상해볼까요?',
        imageSrc: 'assets/images/music-creation-studio.png',
        imageAlt: '가을 저녁 빛 속 피아노와 기타 음악 제작 화면',
        imageCaption: '🌇 가을 저녁 분위기의 피아노와 기타',
        helpScript: '완성된 따뜻한 가을 저녁 멜로디를 편안하게 감상해 보세요.',
        options: [
          { text: '따뜻한 가을 저녁 피아노 멜로디 감상하기', emoji: '🎵', isBest: true, feedback: '맞아요! 바로 그겁니다. 마음이 참 평온해지네요.' }
        ]
      }
    ]
  },

  {
    id: 'ai_life',
    icon: '🏡',
    title: '생활 활용',
    summary: '요리 추천, 여행 일정, 생활 꿀팁까지 일상 속 AI를 활용해요.',
    steps: [
      {
        stepNum: 1,
        page: 'ai_life_intro',
        screenText: '우리 생활 속의 AI',
        chatExample: true,
        voiceScript: 'AI는 특별한 일을 할 때만 사용하는 것이 아닙니다. 우리 생활에서도 다양하게 사용할 수 있어요.',
        prompt: 'AI는 언제 사용하는 기술일까요?',
        imageSrc: 'assets/images/ai-assistant-tablet.png',
        imageAlt: '태블릿으로 ChatGPT(챗지피티) 화면을 보며 생활 속 도움을 확인하는 모습',
        imageCaption: '🏡 일상에서 활용하는 챗지피티(ChatGPT) AI',
        helpScript: '매일매일 밥상 차리기, 병원 가는 길 등 어디서든 AI를 쓸 수 있어요.',
        options: [
          { text: '우리 일상생활 속에서 언제든지', emoji: '🌈', isBest: true, feedback: '정답이에요. 천천히 배우고 있는데 정말 잘하고 계세요.' },
          { text: '우주선을 쏠 때만 쓴다', emoji: '🚀', isBest: false, feedback: '배우는 중에는 얼마든지 틀릴 수 있어요.' }
        ]
      },
      {
        stepNum: 2,
        page: 'ai_life_examples',
        screenText: '생활 속 다양한 질문들',
        chatExample: 'stew',
        voiceScript: '냉장고에 있는 재료로 요리를 추천받거나, 여행 일정을 만들거나, 문자를 작성하거나, 어려운 내용을 쉽게 설명해달라고 할 수도 있습니다.',
        prompt: '생활 속에서 AI에게 물어볼 수 있는 질문으로 알맞은 것은?',
        imageSrc: 'assets/images/korean_stew_table.jpg',
        imageAlt: '냉장고 재료로 만든 밥상',
        imageCaption: '🍳 냉장고 파먹기 요리 추천부터 여행 일정까지',
        helpScript: '궁금하거나 고민되는 일상 이야기를 가볍게 물어보세요.',
        options: [
          { text: '냉장고 재료로 맛있는 요리 추천받기', emoji: '🥗', isBest: true, feedback: '잘하셨어요. 이제 확실히 이해하셨네요.' },
          { text: '아무것도 물어볼 수 없다', emoji: '❌', isBest: false, feedback: '이번에는 다른 답을 한번 골라볼까요?' }
        ]
      },
      {
        stepNum: 3,
        page: 'ai_life_question',
        screenText: '어떤 도움이 필요하세요?',
        chatExample: true,
        voiceScript: '어떤 도움이 필요하세요? 평소에 어려웠던 일을 AI에게 한번 물어보세요.',
        prompt: '평소 궁금했던 질문을 하나 골라 AI에게 물어보세요.',
        imageSrc: 'assets/images/ai-assistant-tablet.png',
        imageAlt: '챗지피티(ChatGPT)에 생활 질문을 입력하는 모습',
        imageCaption: '💬 필요한 도움을 챗지피티(ChatGPT)에게 물어보세요',
        helpScript: '건강 정보나 일상 꿀팁을 마음 편히 물어보세요.',
        options: [
          { text: '소화에 좋은 따뜻한 차 종류 알려줘 🍵', emoji: '🌿', isBest: true, feedback: '참 좋은 질문이에요! 매실차와 생강차가 속에 아주 좋답니다.' },
          { text: '환절기 가벼운 실내 스트레칭 알려줘 🧘', emoji: '💪', isBest: true, feedback: '멋져요! 의자에 앉아 목과 어깨를 천천히 돌려보세요.' }
        ]
      }
    ]
  },

  {
    id: 'ai_quiz',
    icon: '❓',
    title: '퀴즈',
    summary: '배운 내용을 부담 없이 재미있는 퀴즈로 짚어봐요.',
    steps: [
      {
        stepNum: 1,
        page: 'ai_quiz_q1',
        screenText: '1단계 퀴즈',
        voiceScript: '수업 내용을 얼마나 기억하고 있는지 간단한 문제를 풀어볼까요? 시험이 아니니까 부담 갖지 않으셔도 됩니다. 틀려도 괜찮아요. 천천히 한번 골라보세요.',
        prompt: 'AI에게 궁금한 것을 알아보려면 어떻게 하면 될까요?',
        imageSrc: 'assets/images/ai-assistant-tablet.png',
        imageAlt: 'ChatGPT(챗지피티) 메인 화면: 무엇을 도와드릴까요?',
        imageCaption: '💬 챗지피티(ChatGPT) 메인 화면',
        helpScript: '시험이 아니니 편안하게 기억나는 것을 골라보세요.',
        options: [
          { text: '궁금한 것을 질문하기', emoji: '💡', isBest: true, feedback: '정답입니다. 아주 잘 기억하고 계시네요.' },
          { text: '비밀번호', emoji: '🔑', isBest: false, feedback: '괜찮아요. 한 번만 다시 생각해볼까요?' },
          { text: '컴퓨터 부품', emoji: '🔌', isBest: false, feedback: '천천히 해보세요. 정답을 찾을 수 있을 거예요.' }
        ]
      },
      {
        stepNum: 2,
        page: 'ai_quiz_q2',
        screenText: '2단계 퀴즈',
        chatExample: 'travel',
        voiceScript: '두 번째 문제예요. AI에게 원하는 것을 부탁할 때 어떤 방법이 더 좋을까요?',
        prompt: 'AI에게 부탁할 때 더 좋은 방법은 무엇일까요?',
        imageSrc: 'assets/images/travel-plan-tablet.png',
        imageAlt: '기간과 활동을 구체적으로 정한 여행 계획 예시',
        imageCaption: '🎯 원하는 조건을 자세하게 알려주세요',
        helpScript: '자세하게 말할수록 AI가 더 잘 알아듣는답니다.',
        options: [
          { text: '원하는 것을 자세하고 구체적으로 설명하기', emoji: '📝', isBest: true, feedback: '맞았어요! 정말 잘하셨어요.' },
          { text: '한 단어만 짧게 툭 던지기', emoji: '❓', isBest: false, feedback: '조금 아쉬웠어요. 힌트를 한번 볼까요?' }
        ]
      },
      {
        stepNum: 3,
        page: 'ai_quiz_q3',
        screenText: '3단계 퀴즈',
        chatExample: 'stew',
        voiceScript: '세 번째 문제예요. AI로 우리가 할 수 있는 일은 무엇일까요?',
        prompt: 'AI로 할 수 있는 일로 알맞은 것을 골라보세요.',
        imageSrc: 'assets/images/korean_stew_table.jpg',
        imageAlt: '따뜻한 된장찌개와 나물 밥상',
        imageCaption: '🍲 챗GPT가 추천해 준 맛있는 저녁 밥상',
        helpScript: 'AI가 우리 일상에서 얼마나 많은 일을 도와줄 수 있는지 떠올려보세요.',
        options: [
          { text: '글쓰기, 그림 만들기, 저녁 메뉴 추천받기', emoji: '🌟', isBest: true, feedback: '맞아요! 바로 그겁니다.' },
          { text: '아무것도 할 수 없다', emoji: '❌', isBest: false, feedback: '괜찮습니다. 배우는 중에는 얼마든지 틀릴 수 있어요.' }
        ]
      }
    ]
  }
];

window.LESSON_CATALOG = LESSON_CATALOG;




