/**

 * 디지털 학교 - 단계형 수업 렌더링 및 인터랙션 엔진 (Lesson Engine)

 * 사진과 함께 직관적으로 설명하는 시각적 인지 돌봄 시스템

 */

const LessonEngine = {

  currentLesson: null,

  currentStepIndex: 0,

  totalSteps: 0,

  startTime: null,

  selectedAnswers: {},

  selectedMood: '😊 재미있었어요',

  selectedMoodEmoji: '😊',

  needsAssistance: '스스로 원활히 참여하심',

  // 수업 시작

  startLesson(lessonId) {

    const lesson = window.LESSON_CATALOG.find(l => l.id === lessonId);

    if (!lesson) return;

    this.currentLesson = lesson;

    this.currentStepIndex = 0;

    this.totalSteps = lesson.steps.length + 1; // 마지막 기분 선택 단계 포함

    this.startTime = Date.now();

    this.selectedAnswers = {};

    this.selectedMood = '😊 재미있었어요';

    this.selectedMoodEmoji = '😊';

    this.needsAssistance = '스스로 원활히 참여하심';

    const viewport = document.getElementById('lessonViewport');

    viewport.classList.add('active');

    document.body.style.overflow = 'hidden';

    // 천지인 자판 상태 초기화

    this._cjState.buffer = '';

    this._cjState.composed = '';

    this._cjState.jamo = [];

    this._cjState.mode = 'init';

    this._cjState.lastVowel = null;

    this._cjState.dotCount = 0;

    this._cjState.shiftOn = false;

    this.renderCurrentStep();

  },

  // 현재 단계 렌더링 (사진 + 설명 + 초대형 선택지)

  renderCurrentStep() {

    document.getElementById('lessonViewport').scrollTop = 0;

    const stageContainer = document.getElementById('lessonStageContainer');

    const badgeName = document.getElementById('lessonBadgeName');

    const badgeIcon = document.getElementById('lessonBadgeIcon');

    const stepIndicator = document.getElementById('lessonStepIndicator');

    const btnPrev = document.getElementById('btnLessonPrev');

    const btnNext = document.getElementById('btnLessonNext');

    badgeIcon.textContent = this.currentLesson.icon;

    badgeName.textContent = this.currentLesson.title;

    // 이전 버튼 제어

    btnPrev.disabled = this.currentStepIndex === 0;

    // 마지막 단계(기분 선택 및 종료)인지 확인

    if (this.currentStepIndex >= this.currentLesson.steps.length) {

      stepIndicator.textContent = `마무리 단계`;

      btnNext.style.display = 'none';

      this.renderCompletionScreen(stageContainer);

      return;

    }

    btnNext.style.display = 'inline-flex';

    btnNext.className = 'btn-nav-step btn-nav-next';

    btnNext.innerHTML = `다음 활동 ▶`;

    const sourceStep = this.currentLesson.steps[this.currentStepIndex];
    const step = window.ReminiscenceImages ? window.ReminiscenceImages.protect(sourceStep, this.currentLesson.id, this.currentStepIndex) : sourceStep;

    stepIndicator.textContent = `${this.currentStepIndex + 1} / ${this.totalSteps} 단계`;

    // 1. 콩이 말풍선 (어르신 맞춤 다정한 스타일, 손자/손녀 말투)

    let aiMessageText = step.aiMessage || step.screenText || '';

    if (this.currentStepIndex === 0 && window.RecordManager && aiMessageText) {

      const learner = window.RecordManager.getCurrentLearner();

      if (learner && !aiMessageText.startsWith(learner)) {

        const namePart = learner.replace(' 어르신', '');

        // 성별 확인 (care-workflow DB 활용)

        let grandparent = '할머니'; // 기본값

        try {

          const raw = localStorage.getItem('digital_school_management_v1');

          if (raw) {

            const dbData = JSON.parse(raw);

            const found = dbData.elders && dbData.elders.find(e => e.name === namePart);

            if (found && found.gender === '남성') grandparent = '할아버지';

          }

        } catch(e) {}

        // 손자/손녀처럼 친근하고 자연스러운 랜덤 인사

        const greetings = [

          `${namePart} ${grandparent}! 저 콩이에요~ 오늘도 만나서 너무 좋아요!`,

          `${grandparent}~ 안녕하세요? 저 콩이에요! 같이 재미있게 해봐요!`,

          `${namePart} ${grandparent}! 콩이 왔어요! 오늘도 잘 부탁해요!`,

          `${grandparent}! 오늘 기분 어때요? 저 콩이에요, 반가워요!`

        ];

        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

        aiMessageText = `${randomGreeting} ${aiMessageText}`;

      }

    }

    let html = `

      <div class="ai-friend-speech-area">

        <div class="ai-friend-avatar-box">

          <img src="assets/images/friend-kongi-talk.png" alt="AI 선생님 & 콩이" class="ai-friend-avatar-img">

        </div>

        <div class="ai-friend-speech-content">

          <div class="ai-friend-name-tag">👩‍🏫 AI 선생님 & 🐶 콩이</div>

          <div class="ai-speech-text" id="aiSpeechText">${step.screenText || step.aiMessage || aiMessageText}</div>

          <div class="ai-speech-btn-group" style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;">

            <button class="btn-tts-replay" onclick="VoiceManager.replayLastScript()" title="선생님 말씀 다시 듣기">

              ↻ 다시 듣기

            </button>

            <button class="btn-tts-replay btn-tts-help-btn" onclick="LessonEngine.speakStepHelp()" title="도움말 듣기" style="background:#FFF3E0; border-color:#FFB74D; color:#E65100;">

              ❓ 도움말

            </button>

          </div>

        </div>

      </div>

      <div class="activity-card">

        <h2 class="activity-prompt-title">${step.prompt}</h2>

    `;

    // 2. 사진과 함께 설명하는 비주얼 포토 카드 (노래방 단계는 노래방 전용 무대 사용)

    if (step.chatExample === 'thank-you') {

      html += `<section class="chatgpt-example" aria-label="챗GPT 감사 문자 작성 예시">

        <h3>챗GPT(ChatGPT)와 감사 문자 쓰기</h3>

        <p class="chat-example-note">질문과 답변을 보여주는 연습용 대화 화면이에요.</p>

        <div class="chat-example-question"><strong>🙋 내가 부탁해요</strong><p>선생님께 감사 문자를 보내고 싶어요.<br>공손하고 짧게, 따뜻한 마음이 느껴지도록 써주세요.</p></div>

        <div class="chat-example-answer"><strong>💬 챗GPT의 예시 답변</strong><p>이렇게 적어보면 어떨까요?</p><blockquote>선생님, 감사합니다.<br>늘 건강하세요!</blockquote><figure class="chat-travel-figure"><img src="assets/images/thank-you-message.png" alt="선생님, 감사합니다. 늘 건강하세요!라는 문자가 적힌 휴대전화"><figcaption>💖 감사한 마음을 공손하고 짧게 전해요.</figcaption></figure></div>

        <p class="chat-example-tip">“조금 더 다정하게 써주세요”처럼 다시 부탁해도 돼요.</p>

        <p class="chat-example-note">미리 작성한 답변과 준비된 이미지입니다. 실제로 문자가 전송되지는 않아요.</p>

      </section>`;

    } else if (step.chatExample === 'travel') {

      html += `<section class="chatgpt-example" aria-label="챗GPT 여행 질문과 이미지 답변 예시">

        <h3>챗GPT(ChatGPT)와 여행 이야기</h3>

        <p class="chat-example-note">질문과 답변을 보여주는 연습용 대화 화면이에요.</p>

        <div class="chat-example-question"><strong>🙋 내가 질문해요</strong><p>2박 3일 여행을 가고 싶어요.<br>걷는 거리가 적고, 중간에 쉴 수 있는 일정으로 알려주세요.<br>그림도 함께 보여주세요.</p></div>

        <div class="chat-example-answer"><strong>💬 챗GPT의 예시 답변</strong><p>이렇게 천천히 여행해보면 어떨까요?</p><ol><li><strong>첫째 날:</strong> 버스로 이동하고 숙소에서 쉬어요.</li><li><strong>둘째 날:</strong> 가까운 공원을 구경하고 벤치에서 쉬어요.</li><li><strong>셋째 날:</strong> 아침을 먹고 여유 있게 집으로 돌아와요.</li></ol><figure class="chat-travel-figure"><img src="assets/images/travel-plan-tablet.png" alt="버스 이동, 공원 벤치 휴식, 편안한 숙소가 담긴 2박 3일 여행 일정 예시"><figcaption>🖼️ 여행 일정을 그림으로 함께 살펴봐요.</figcaption></figure></div>

        <p class="chat-example-tip">“벤치에서 자주 쉬고 싶어요”처럼 원하는 것을 더 말해도 돼요.</p>

        <p class="chat-example-note">미리 작성한 답변과 준비된 이미지입니다. 실제 챗GPT의 답변은 달라질 수 있어요.</p>

      </section>`;

    } else if (step.chatExample === 'recipe' || step.chatExample === 'food' || step.chatExample === 'stew') {
      html += `<section class="chatgpt-example" aria-label="챗GPT 요리 추천 질문과 밥상 이미지 답변 예시">
        <h3>챗GPT(ChatGPT)와 요리 추천</h3>
        <p class="chat-example-note">냉장고 재료를 말하면 챗GPT가 요리를 추천해주는 대화 화면이에요.</p>
        <div class="chat-example-question"><strong>🙋 내가 질문해요</strong><p>냉장고에 두부, 애호박, 된장이 있어요.<br>오늘 저녁에 따뜻하게 끓여 먹을 수 있는 요리를 알려주세요.</p></div>
        <div class="chat-example-answer"><strong>💬 챗GPT의 예시 답변</strong><p>구수하고 따뜻한 된장찌개와 나물 밥상을 추천해 드려요!</p><figure class="chat-travel-figure"><img src="assets/images/korean_stew_table.jpg" alt="따뜻한 된장찌개와 정갈한 밥상"><figcaption>🍲 챗GPT가 추천해 준 맛있는 저녁 밥상이에요.</figcaption></figure></div>
        <p class="chat-example-tip">“맵지 않게 끓이는 법도 알려줘”처럼 더 물어봐도 돼요.</p>
        <p class="chat-example-note">미리 작성한 답변과 예시 밥상 사진입니다. 실제 챗GPT는 다양한 요리법을 알려줘요.</p>
      </section>`;
    } else if (step.chatExample === 'image' || step.chatExample === 'autumn-reading' || step.chatExample === 'drawing') {
      html += `<section class="chatgpt-example" aria-label="챗GPT 그림 만들기 질문과 이미지 답변 예시">
        <h3>챗GPT(ChatGPT)와 그림 만들기</h3>
        <p class="chat-example-note">말로 설명하면 챗GPT가 그림을 그려주는 대화 화면이에요.</p>
        <div class="chat-example-question"><strong>🙋 내가 부탁해요</strong><p>가을 공원 벤치에 앉아 책을 읽고 있는 할머니 그림을 그려줘.<br>따뜻한 햇살과 단풍나무가 보이는 포근한 그림으로 부탁해.</p></div>
        <div class="chat-example-answer"><strong>💬 챗GPT의 예시 답변</strong><p>어르신 말씀대로 포근한 가을 공원 그림을 완성했어요!</p><figure class="chat-travel-figure"><img src="assets/images/autumn-reading-illustration.png" alt="가을 공원 벤치에서 책을 읽는 할머니 일러스트"><figcaption>🎨 챗GPT가 어르신의 설명대로 그려준 그림이에요.</figcaption></figure></div>
        <p class="chat-example-tip">“단풍잎을 더 많이 그려줘”처럼 원하는 모습을 더 덧붙여도 돼요.</p>
        <p class="chat-example-note">미리 작성한 답변과 예시 그림입니다. 실제 챗GPT의 결과는 다양하게 표현될 수 있어요.</p>
      </section>`;
    } else if (step.chatExample) {

      html += `<section class="chatgpt-example" aria-label="챗GPT 질문과 답변 예시">

        <h3>챗GPT(ChatGPT)에 이렇게 물어봐요</h3>

        <p class="chat-example-note">질문하는 방법을 보여주는 연습 예시예요.</p>

        <div class="chat-example-question"><strong>🙋 내가 질문해요</strong><p>오늘 저녁에 무엇을 먹을까요?<br>간단하게 만들 수 있는 음식 2가지를 알려주세요.</p></div>

        <details class="chat-example-answer"><summary>💬 챗GPT의 예시 답변 보기</summary><p>달걀찜과 두부국은 어떨까요?</p><p>① 달걀찜: 달걀에 물을 넣고 부드럽게 익혀요.<br>② 두부국: 국물에 두부와 채소를 넣고 끓여요.</p><p>집에 있는 재료를 알려주시면 다른 음식도 함께 생각해볼게요.</p></details>

        <p class="chat-example-tip">이어서 “집에 달걀이 있어요”처럼 더 이야기해도 돼요.</p>

        <p class="chat-example-note">미리 작성한 예시이며, 실제 챗GPT의 답변은 달라질 수 있어요.</p>

      </section>`;

    } else if (step.missingReminiscenceImage) {
      html += '<p class="photo-memory-unavailable" role="status">준비된 사진이 없습니다.</p>';
    } else if (step.imageSrc && step.customType !== 'karaoke_room') {
      const isSelected = (this.selectedAnswers[this.currentStepIndex] !== undefined);
      const hasSketch = Boolean(step.sketchImageSrc);
      const isHiddenInitially = hasSketch && !isSelected;
      const chosen = isSelected ? step.options[this.selectedAnswers[this.currentStepIndex]] : null;
      const displaySrc = (chosen && chosen.imageSrc) ? chosen.imageSrc : step.imageSrc;
      let displayCaption = step.imageCaption || '';

      if (isSelected && hasSketch) {
        const chosen = step.options[this.selectedAnswers[this.currentStepIndex]];
        if (chosen) {
          displayCaption = `🎨 ${step.stepNum || ''}단계 · [${chosen.emoji || '✨'} ${chosen.text || ''}] 완성!`;
        }
      }

      html += `
        <div class="photo-memory-box is-painted-mode ${isSelected ? 'reveal-anim' : ''}" id="photoMemoryBox" style="${isHiddenInitially ? 'display: none;' : ''}">
          <img src="${displaySrc}" alt="${step.imageAlt || '수업 사진'}" class="photo-memory-img" id="photoMemoryImg">
          <div class="photo-caption-tag" id="photoCaptionTag">${displayCaption}</div>
        </div>
      `;
    }

    if (this.currentLesson.id === 'prompt_basic') {
      html += '<div class="solar-controls"><button type="button" class="care-btn primary" data-open-chatgpt>💬 챗지피티에 직접 질문해 보기 ↗</button></div>';
    }

    // 3. 커스텀 인터랙션 요소 (유튜브 흘러가는 옛노래, 신나는 노래방, 메모리 게임 등)

    if (step.customType === 'youtube_music') {

      html += this.getYoutubeMusicHtml(step.youtubeId || 'XhjovE_9qps');

    } else if (step.customType === 'karaoke_room') {

      html += this.getKaraokeRoomHtml();

    } else if (step.customType === 'memory_game') {

      html += this.getMemoryGameHtml();

    } else if (step.customType && step.customType.startsWith('phone_demo')) {

      html += this.getPhoneDemoHtml(step.customType);

    }

    // 4. 선택지 버튼 (이미지가 있으면 큰 이미지 카드, 없으면 기존 이모지 버튼)

    const isMemoryGame = (step.customType === 'memory_game');

    const hiddenClass = isMemoryGame ? 'memory-options-hidden' : '';

    html += `<div class="choice-options-grid ${step.options.some(o => o.imageSrc) ? 'has-images' : ''} ${isMemoryGame ? 'memory-options-grid' : ''} ${hiddenClass}" id="choiceOptionsGrid">`;

    step.options.forEach((opt, idx) => {

      const isSelected = this.selectedAnswers[this.currentStepIndex] === idx;

      if (opt.imageSrc) {

        // 이미지 카드형 선택지

        html += `

          <button class="btn-choice-img ${isSelected ? 'selected' : ''}"

                  onclick="LessonEngine.handleOptionSelect(${idx})"

                  id="choiceBtn_${idx}">

            <img src="${opt.imageSrc}" alt="${opt.text}" class="choice-img">

            <span class="choice-img-label">${opt.text}</span>

          </button>

        `;

      } else if (isMemoryGame) {

        // 메모리 게임 전용 3열 카드 (유저 스크린샷 100% 일치)

        const displayText = opt.htmlText || opt.text

          .replace(' 짝을 ', '<br>짝을 ')

          .replace(' 하나씩 ', '<br>하나씩<br>')

          .replace(' 머릿속에 ', '<br>머릿속에 ');

        html += `

          <button class="btn-choice btn-choice-memory ${isSelected ? 'selected' : ''}"

                  onclick="LessonEngine.handleOptionSelect(${idx})"

                  id="choiceBtn_${idx}">

            <span class="choice-emoji-badge">${opt.emoji || '✨'}</span>

            <span class="choice-memory-text">${displayText}</span>

          </button>

        `;

      } else {

        // 이모티콘 중복 방지 (각 카테고리/선택지당 1개만 깔끔하게 표시)

        let displayEmoji = opt.emoji || '✨';

        let displayText = opt.text || '';

        // 텍스트 앞부분에 이모티콘이 들어있는 경우 (예: "😊 기뻐요", "🥇 100점 만점")

        const leadingEmojiMatch = displayText.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Extended_Pictographic}|\p{Emoji_Presentation})\s*/u);

        if (leadingEmojiMatch) {

          displayEmoji = leadingEmojiMatch[1]; // 텍스트의 고유 이모티콘을 뱃지로 우선 사용

          displayText = displayText.replace(leadingEmojiMatch[0], ''); // 텍스트에서는 이모티콘 제거

        }

        // 텍스트 뒷부분에 중복 이모티콘이 있는 경우도 제거

        displayText = displayText.replace(/\s*([\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Extended_Pictographic}|\p{Emoji_Presentation})$/u, '');

        // 단일 이모지+텍스트 버튼

        html += `

          <button class="btn-choice ${isSelected ? 'selected' : ''}"

                  onclick="LessonEngine.handleOptionSelect(${idx})"

                  id="choiceBtn_${idx}">

            <span class="choice-emoji">${displayEmoji}</span>

            <span>${displayText}</span>

          </button>

        `;

      }

    });

    html += `</div>`;

    // 5. 온화하고 따뜻한 피드백 영역

    html += `<div id="warmFeedbackArea"></div>`;

    html += `</div>`; // .activity-card 끝

    stageContainer.innerHTML = html;

    // 노래방 화면일 경우 초기 곡(고향의 봄) 가사 및 배경 로드

    if (step.customType === 'karaoke_room' && window.KaraokeEngine) {

      window.KaraokeEngine.currentSongIndex = 0;

      window.KaraokeEngine.renderLyricsBox(window.KaraokeEngine.SONGS[0]);

      window.KaraokeEngine.applySongBackground(window.KaraokeEngine.SONGS[0]);

    }

    // 메모리 게임일 경우 2.5초 후 자동 뒤집기 시퀀스 시작

    if (step.customType === 'memory_game') {

      setTimeout(() => this.startMemoryAutoFlip(), 150);

    }

    // 한국인 여성 AI 선생님의 자연스러운 음성으로 자동 안내

    this.speakStepVoice(step);

  },

  // 추억의 흘러가는 옛노래 안심 플레이어 (YouTube Error 153 차단 및 자체 고음질 음악 연동)

  getYoutubeMusicHtml(youtubeId = 'XhjovE_9qps') {

    return `

      <div class="retro-music-player" data-playback="youtube">

        <div class="retro-lp-wrapper">

          <div class="retro-lp-disc" id="retroLpRecord">

            <span class="retro-lp-label">🌸</span>

          </div>

        </div>

        <div class="retro-song-info">

          <div class="retro-song-title">🌸 고향의 봄 & 그리운 흘러가는 옛 노래</div>

          <div class="retro-song-lyrics">"나의 살던 고향은 꽃피는 산골, 복숭아꽃 살구꽃 아기 진달래..."</div>

        </div>

        <button class="btn-retro-play" id="btnRetroPlay" onclick="LessonEngine.toggleRetroMusic()">

          ▶ 노래 듣기

        </button>

        <p id="oldSongStatus" role="status" aria-live="polite"></p>

        <div class="retro-extra-links">

          <a href="https://www.youtube.com/watch?v=${youtubeId}" target="_blank" rel="noopener noreferrer" class="btn-retro-yt">

            📺 YouTube 원본 영상으로 열기 &gt;

          </a>

        </div>

        <!-- 신나는 3대 어깨춤/박수 참여 버튼 바 -->

        <div class="karaoke-instruments-bar" style="margin-top: 10px; width: 100%;">

          <button class="btn-instrument" onclick="KaraokeEngine.clapHands()">

            <span class="instrument-icon">👏</span>

            <span>박수 치기 (짝짝짝!)</span>

          </button>

          <button class="btn-instrument" onclick="KaraokeEngine.shakeTambourine()">

            <span class="instrument-icon">🥁</span>

            <span>탬버린 흔들기 (찰랑!)</span>

          </button>

          <button class="btn-instrument" onclick="KaraokeEngine.danceShoulders()">

            <span class="instrument-icon">💃</span>

            <span>어깨춤 덩실덩실</span>

          </button>

        </div>

      </div>

    `;

  },

  // 레트로 옛 노래 재생 / 정지 토글

  toggleRetroMusic() {
    return window.OldSongPlayer.toggle();
  },

  // 신나는 추억의 노래방 & 율동 체조실 HTML 생성 (곡과 완벽히 어울리는 정겨운 배경 적용)

  getKaraokeRoomHtml() {

    const initialSong = window.KaraokeEngine ? window.KaraokeEngine.SONGS[0] : null;

    const initialBg = initialSong ? initialSong.backgroundImg : 'assets/images/spring_flowers.jpg';

    const initialBadge = initialSong ? initialSong.themeBadge : '🌸 복숭아꽃 살구꽃 아기 진달래 피는 산골';

    return `

      <div class="karaoke-stage-wrapper" id="karaokeStageWrapper" 

           style="background-image: linear-gradient(rgba(20, 15, 12, 0.6), rgba(30, 20, 15, 0.75)), url('${initialBg}');">

        <!-- 노래방 테마 배지 -->

        <div class="karaoke-theme-badge" id="karaokeThemeBadge">${initialBadge}</div>

        <!-- 1. 선곡 탭 -->

        <div class="karaoke-song-tabs">

          <button class="btn-song-tab active" id="songTab_0" onclick="LessonEngine.selectKaraokeSong(0)">

            🌸 고향의 봄

          </button>

          <button class="btn-song-tab" id="songTab_1" onclick="LessonEngine.selectKaraokeSong(1)">

            🌊 퐁당퐁당

          </button>

          <button class="btn-song-tab" id="songTab_2" onclick="LessonEngine.selectKaraokeSong(2)">

            🚂 기차길 옆

          </button>

        </div>

        <!-- 2. 대형 가사 스크린 -->

        <div class="karaoke-screen-panel">

          <div class="karaoke-screen-title" id="karaokeCurrentTitle">🌸 &lt;고향의 봄&gt; 노래방 반주</div>

          <div class="karaoke-lyrics-track" id="karaokeLyricsTrack">

            <!-- 실시간 가사 하이라이트 -->

          </div>

          <div id="karaokeCheerBanner"></div>

        </div>

        <!-- 3. 중앙 춤추는 콩이 & 노래방 컨트롤 버튼들 -->

        <div class="karaoke-stage-center">

          <img src="assets/images/ai_puppy_heart.jpg" alt="춤추는 콩이" class="karaoke-dance-puppy" id="karaokeDancePuppy">

          <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">

            <button class="btn-karaoke-play" id="btnKaraokePlay" onclick="KaraokeEngine.toggleKaraoke()">

              🎵 반주 시작하기

            </button>

            <button class="btn-karaoke-play" style="background: linear-gradient(135deg, #10B981, #059669);" onclick="KaraokeEngine.singWithAi()">

              🎤 콩이와 함께 부르기

            </button>

          </div>

        </div>

        <!-- 4. 신나는 3대 어깨춤/악기 참여 버튼 바 -->

        <div class="karaoke-instruments-bar">

          <button class="btn-instrument" onclick="KaraokeEngine.clapHands()">

            <span class="instrument-icon">👏</span>

            <span>박수 치기 (짝짝짝!)</span>

          </button>

          <button class="btn-instrument" onclick="KaraokeEngine.shakeTambourine()">

            <span class="instrument-icon">🥁</span>

            <span>탬버린 흔들기 (찰랑!)</span>

          </button>

          <button class="btn-instrument" onclick="KaraokeEngine.danceShoulders()">

            <span class="instrument-icon">💃</span>

            <span>어깨춤 덩실덩실</span>

          </button>

        </div>

      </div>

    `;

  },

  selectKaraokeSong(songIndex) {

    if (!window.KaraokeEngine) return;

    window.VoiceManager.playChime('click');

    const tabs = document.querySelectorAll('.btn-song-tab');

    tabs.forEach((tab, idx) => {

      if (idx === songIndex) tab.classList.add('active');

      else tab.classList.remove('active');

    });

    const song = window.KaraokeEngine.SONGS[songIndex];

    if (song) {

      document.getElementById('karaokeCurrentTitle').textContent = `${song.emoji} <${song.title}> 노래방 반주`;

      const cheerBanner = document.getElementById('karaokeCheerBanner');

      if (cheerBanner) cheerBanner.innerHTML = '';

      window.KaraokeEngine.applySongBackground(song);

      window.KaraokeEngine.renderLyricsBox(song);

      window.KaraokeEngine.startKaraoke(songIndex);

    }

  },

  getPhoneDemoHtml(type) {

    if (type === 'phone_demo_font') {

      return `

        <div class="phone-simulator-frame">

          <div class="phone-screen" id="phoneScreen">

            <div style="font-size: 22px; font-weight: 700; line-height: 1.4;" id="phoneSampleText">

              어르신, 오늘도 활기차고 행복한 하루 보내세요! 🌻

            </div>

            <button class="phone-btn-action" onclick="LessonEngine.togglePhoneFontSize()">

              🔍 글자 크게 돋보기

            </button>

          </div>

        </div>

      `;

    } else if (type === 'phone_demo_heart') {

      return `

        <div class="phone-simulator-frame">

          <div class="phone-screen">

            <div style="font-size: 24px; font-weight: 700; color: #333;" id="phoneHeartMsg">

              수신자: 사랑하는 자녀/손주 ❤️

            </div>

            <div style="font-size: 54px; text-align: center;" id="phoneHeartDisplay">💌</div>

            <button class="phone-btn-action" onclick="LessonEngine.sendPhoneHeart()">

              🧡 하트 전송하기

            </button>

          </div>

        </div>

      `;

    } else if (type === 'phone_demo_camera') {

      return `

        <div class="phone-simulator-frame">

          <div class="phone-screen">

            <div style="border-radius: 16px; overflow: hidden; background: #EEE;">

              <img src="assets/images/korean_sunflower.jpg" alt="카메라 화면" style="width: 100%; height: 200px; object-fit: cover;" id="cameraPreview">

            </div>

            <button class="phone-btn-action" onclick="LessonEngine.snapPhoto()">

              📸 찰칵! 사진 찍기

            </button>

          </div>

        </div>

      `;

    } else if (type === 'phone_demo_cheonjiin') {

      return this.getCheonjiinKeyboardHtml();

    }

    return '';

  },

  // ──────────────────────────────────────────────

  // 천지인 자판 HTML 생성

  // ──────────────────────────────────────────────

  getCheonjiinKeyboardHtml() {

    return `

      <div class="cheonjiin-wrapper">

        <!-- 입력된 글자 표시창 -->

        <div class="cheonjiin-display-area">

          <div class="cheonjiin-display-label">✏️ 입력된 글자</div>

          <div class="cheonjiin-display-text" id="cjDisplayText">여기에 글자가 나타나요</div>

          <button class="cheonjiin-clear-btn" onclick="LessonEngine.cjClear()">⌫ 모두 지우기</button>

        </div>

        <!-- 천지인 자판 -->

        <div class="cheonjiin-keyboard" id="cheonjiinKeyboard">

          <!-- Row 1 -->

          <button class="cj-key cj-key--consonant" onclick="LessonEngine.cjTap('ㄱ')" id="cjKey_ㄱ">

            <span class="cj-main">ㄱ</span><span class="cj-sub">ㅋ</span>

          </button>

          <button class="cj-key cj-key--consonant" onclick="LessonEngine.cjTap('ㄴ')" id="cjKey_ㄴ">

            <span class="cj-main">ㄴ</span><span class="cj-sub">ㄹ</span>

          </button>

          <button class="cj-key cj-key--consonant" onclick="LessonEngine.cjTap('ㄷ')" id="cjKey_ㄷ">

            <span class="cj-main">ㄷ</span><span class="cj-sub">ㅌ</span>

          </button>

          <!-- Row 2 -->

          <button class="cj-key cj-key--consonant" onclick="LessonEngine.cjTap('ㅂ')" id="cjKey_ㅂ">

            <span class="cj-main">ㅂ</span><span class="cj-sub">ㅍ</span>

          </button>

          <button class="cj-key cj-key--vowel cj-key--sky" onclick="LessonEngine.cjTap('ㆍ')" id="cjKey_ㆍ">

            <span class="cj-main">ㆍ</span><span class="cj-sub">하늘</span>

          </button>

          <button class="cj-key cj-key--consonant" onclick="LessonEngine.cjTap('ㅅ')" id="cjKey_ㅅ">

            <span class="cj-main">ㅅ</span><span class="cj-sub">ㅈ ㅊ</span>

          </button>

          <!-- Row 3 -->

          <button class="cj-key cj-key--consonant" onclick="LessonEngine.cjTap('ㅇ')" id="cjKey_ㅇ">

            <span class="cj-main">ㅇ</span><span class="cj-sub">ㅎ</span>

          </button>

          <button class="cj-key cj-key--vowel cj-key--earth" onclick="LessonEngine.cjTap('ㅡ')" id="cjKey_ㅡ">

            <span class="cj-main">ㅡ</span><span class="cj-sub">땅</span>

          </button>

          <button class="cj-key cj-key--consonant" onclick="LessonEngine.cjTap('ㅁ')" id="cjKey_ㅁ">

            <span class="cj-main">ㅁ</span><span class="cj-sub">ㄴ</span>

          </button>

          <!-- Row 4 -->

          <button class="cj-key cj-key--action cj-key--shift" onclick="LessonEngine.cjToggleShift()">

            <span class="cj-main" id="cjShiftLabel">⇧ 쌍자</span>

          </button>

          <button class="cj-key cj-key--vowel cj-key--human" onclick="LessonEngine.cjTap('ㅣ')" id="cjKey_ㅣ">

            <span class="cj-main">ㅣ</span><span class="cj-sub">사람</span>

          </button>

          <button class="cj-key cj-key--action cj-key--backspace" onclick="LessonEngine.cjBackspace()">

            <span class="cj-main">⌫</span>

          </button>

          <!-- Row 5 (full width) -->

          <button class="cj-key cj-key--space" onclick="LessonEngine.cjTap(' ')">

            <span class="cj-main">공백</span>

          </button>

        </div>

        <!-- 안내 문구 -->

        <div class="cheonjiin-guide">

          💡 <strong>천지인 자판 사용법:</strong>

          ㆍ(하늘) + ㅣ = <strong>ㅏ</strong> &nbsp;|&nbsp;

          ㅣ + ㆍ = <strong>ㅓ</strong> &nbsp;|&nbsp;

          ㆍ + ㅡ = <strong>ㅗ</strong> &nbsp;|&nbsp;

          ㅡ + ㆍ = <strong>ㅜ</strong>

        </div>

      </div>

    `;

  },

  // ──────────────────────────────────────────────

  // 천지인 자판 엔진

  // ──────────────────────────────────────────────

  _cjState: {

    buffer: '',        // 현재 조합 중인 글자 상태

    composed: '',      // 완성된 글자들

    jamo: [],          // 현재 조합 자모 배열 [초성, 중성, 종성]

    mode: 'init',      // 'init' | 'cho' | 'jung' | 'jong'

    lastVowel: null,   // 마지막 입력 모음 (연속 ㆍ 처리용)

    dotCount: 0,       // ㆍ 연속 입력 횟수

    shiftOn: false,    // 쌍자음 모드

  },

  // 초성 리스트 (유니코드 순서)

  _CHOSEONG:  ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],

  _JUNGSEONG: ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'],

  _JONGSEONG: ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],

  // 초성 인덱스 맵

  _choIdx(c) { return this._CHOSEONG.indexOf(c); },

  _jungIdx(v) { return this._JUNGSEONG.indexOf(v); },

  _jongIdx(c) { return this._JONGSEONG.indexOf(c); },

  // 조합 가능 여부

  _canCombine(cho, jung) {

    return this._choIdx(cho) >= 0 && this._jungIdx(jung) >= 0;

  },

  // 한글 음절 조합

  _buildSyllable(cho, jung, jong) {

    const ci = this._choIdx(cho);

    const vi = this._jungIdx(jung);

    const ji = jong ? this._jongIdx(jong) : 0;

    if (ci < 0 || vi < 0 || ji < 0) return cho + jung + (jong || '');

    return String.fromCharCode(0xAC00 + ci * 21 * 28 + vi * 28 + ji);

  },

  // 천지인 모음 조합 규칙

  //   ㆍ + ㅣ → ㅏ,  ㅣ + ㆍ → ㅓ

  //   ㆍ + ㅡ → ㅗ,  ㅡ + ㆍ → ㅜ

  //   ㅗ + ㆍ → ㅛ,  ㅜ + ㆍ → ㅠ

  //   ㅏ + ㆍ → ㅑ,  ㅓ + ㆍ → ㅕ

  //   ㅗ + ㅣ → ㅚ,  ㅜ + ㅣ → ㅓ (ㅟ 생략)

  _vowelCombo: {

    'ㆍ+ㅣ':'ㅏ', 'ㅣ+ㆍ':'ㅓ',

    'ㆍ+ㅡ':'ㅗ', 'ㅡ+ㆍ':'ㅜ',

    'ㅗ+ㆍ':'ㅛ', 'ㅜ+ㆍ':'ㅠ',

    'ㅏ+ㆍ':'ㅑ', 'ㅓ+ㆍ':'ㅕ',

    'ㅗ+ㅣ':'ㅚ', 'ㅜ+ㅣ':'ㅟ',

    'ㅡ+ㅣ':'ㅢ',

  },

  // 쌍자음 맵

  _doubleConsonant: { 'ㄱ':'ㄲ', 'ㄷ':'ㄸ', 'ㅂ':'ㅃ', 'ㅅ':'ㅆ', 'ㅈ':'ㅉ' },

  // 쌍자음 토글

  cjToggleShift() {

    const s = this._cjState;

    s.shiftOn = !s.shiftOn;

    const lbl = document.getElementById('cjShiftLabel');

    if (lbl) lbl.textContent = s.shiftOn ? '⇧ 쌍자 ON' : '⇧ 쌍자';

    const shiftBtn = document.querySelector('.cj-key--shift');

    if (shiftBtn) shiftBtn.classList.toggle('active', s.shiftOn);

    window.VoiceManager && VoiceManager.playChime('click');

  },

  // 키 누름 처리 메인

  cjTap(key) {

    const s = this._cjState;

    window.VoiceManager && VoiceManager.playChime('click');

    // 쌍자음 모드 처리

    if (s.shiftOn && this._doubleConsonant[key]) {

      key = this._doubleConsonant[key];

      s.shiftOn = false;

      const lbl = document.getElementById('cjShiftLabel');

      if (lbl) lbl.textContent = '⇧ 쌍자';

      const shiftBtn = document.querySelector('.cj-key--shift');

      if (shiftBtn) shiftBtn.classList.remove('active');

    }

    const isConsonant = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.includes(key);

    const isVowelBase = 'ㆍㅡㅣ'.includes(key);

    const isComposedVowel = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅢ'.includes(key);

    const isVowel = isVowelBase || isComposedVowel;

    if (key === ' ') {

      // 공백: 현재 조합 완성하고 공백 추가

      this._cjFlush();

      s.composed += ' ';

      this._cjRefresh();

      return;

    }

    if (isConsonant) {

      this._cjHandleConsonant(key);

    } else if (isVowel) {

      this._cjHandleVowel(key);

    }

    this._cjRefresh();

  },

  _cjHandleConsonant(key) {

    const s = this._cjState;

    if (s.mode === 'init') {

      // 새 음절 초성 시작

      s.jamo = [key, null, null];

      s.mode = 'cho';

    } else if (s.mode === 'cho') {

      // 초성만 있는 상태에서 자음 → 이전 초성 확정, 새 초성 시작

      s.composed += s.jamo[0];

      s.jamo = [key, null, null];

    } else if (s.mode === 'jung') {

      // 초성+중성 상태에서 자음 → 종성 후보

      s.jamo[2] = key;

      s.mode = 'jong';

    } else if (s.mode === 'jong') {

      // 종성이 있는 상태에서 자음 → 이전 음절 완성, 새 초성

      s.composed += this._buildSyllable(s.jamo[0], s.jamo[1], s.jamo[2]);

      s.jamo = [key, null, null];

      s.mode = 'cho';

    }

  },

  _cjHandleVowel(key) {

    const s = this._cjState;

    // ㆍ/ㅡ/ㅣ 조합 처리

    const resolvedVowel = this._resolveVowel(key);

    if (s.mode === 'init') {

      // 자음 없이 모음만 → 그냥 출력

      s.composed += resolvedVowel;

      s.lastVowel = resolvedVowel;

    } else if (s.mode === 'cho') {

      // 초성 + 모음 → 중성

      s.jamo[1] = resolvedVowel;

      s.mode = 'jung';

      s.lastVowel = resolvedVowel;

    } else if (s.mode === 'jung') {

      // 중성 + 추가 모음 → 복합 모음 시도

      const combo = s.jamo[1] + '+' + key;

      const comboResult = this._vowelCombo[combo];

      if (comboResult) {

        s.jamo[1] = comboResult;

        s.lastVowel = comboResult;

      } else {

        // 조합 안 되면 현재 음절 완성하고 새 모음 시작

        s.composed += this._buildSyllable(s.jamo[0], s.jamo[1], null);

        s.jamo = [null, resolvedVowel, null];

        s.mode = 'jung';

        s.lastVowel = resolvedVowel;

      }

    } else if (s.mode === 'jong') {

      // 종성 + 모음 → 종성을 다음 음절의 초성으로

      const prevSyllable = this._buildSyllable(s.jamo[0], s.jamo[1], null);

      s.composed += prevSyllable;

      s.jamo = [s.jamo[2], resolvedVowel, null];

      s.mode = 'jung';

      s.lastVowel = resolvedVowel;

    }

  },

  _resolveVowel(key) {

    const s = this._cjState;

    // 마지막 모음 + 새 키 조합 시도

    if (s.lastVowel) {

      const combo = s.lastVowel + '+' + key;

      if (this._vowelCombo[combo]) {

        // 복합 모음 성공 → 이미 중성에 있으면 업데이트

        const result = this._vowelCombo[combo];

        s.lastVowel = result;

        return result;

      }

    }

    // 단일 ㆍ → 단독으로 나타낼 때

    if (key === 'ㆍ') {

      s.lastVowel = 'ㆍ';

      return 'ㆍ';

    }

    s.lastVowel = key;

    return key;

  },

  _cjFlush() {

    const s = this._cjState;

    if (s.mode === 'cho' && s.jamo[0]) {

      s.composed += s.jamo[0];

    } else if ((s.mode === 'jung' || s.mode === 'jong') && s.jamo[0]) {

      s.composed += this._buildSyllable(s.jamo[0], s.jamo[1] || '', s.jamo[2]);

    } else if (s.mode === 'jung' && !s.jamo[0] && s.jamo[1]) {

      s.composed += s.jamo[1];

    }

    s.jamo = [];

    s.mode = 'init';

    s.lastVowel = null;

    s.dotCount = 0;

  },

  _cjRefresh() {

    const s = this._cjState;

    // 현재 조합 중인 글자 미리보기

    let preview = '';

    if (s.mode === 'cho') preview = s.jamo[0] || '';

    else if (s.mode === 'jung') preview = this._buildSyllable(s.jamo[0], s.jamo[1], null);

    else if (s.mode === 'jong') preview = this._buildSyllable(s.jamo[0], s.jamo[1], s.jamo[2]);

    const displayEl = document.getElementById('cjDisplayText');

    if (displayEl) {

      const displayText = s.composed + (preview ? `<span class="cj-composing">${preview}</span>` : '');

      displayEl.innerHTML = displayText || '<span style="color:#bbb">여기에 글자가 나타나요</span>';

    }

  },

  cjBackspace() {

    const s = this._cjState;

    window.VoiceManager && VoiceManager.playChime('click');

    if (s.mode === 'jong') {

      s.jamo[2] = null;

      s.mode = 'jung';

    } else if (s.mode === 'jung') {

      if (s.jamo[1] && s.jamo[1].length > 1) {

        // 복합 모음 → 첫 자모로 롤백 (간략 처리)

        s.jamo[1] = null;

        s.mode = 'cho';

      } else {

        s.jamo[1] = null;

        s.mode = 'cho';

      }

      s.lastVowel = null;

    } else if (s.mode === 'cho') {

      s.jamo = [];

      s.mode = 'init';

    } else if (s.mode === 'init' && s.composed.length > 0) {

      s.composed = s.composed.slice(0, -1);

    }

    this._cjRefresh();

  },

  cjClear() {

    const s = this._cjState;

    s.buffer = '';

    s.composed = '';

    s.jamo = [];

    s.mode = 'init';

    s.lastVowel = null;

    s.dotCount = 0;

    this._cjRefresh();

    window.VoiceManager && VoiceManager.playChime('click');

  },

  togglePhoneFontSize() {

    const textEl = document.getElementById('phoneSampleText');

    if (textEl) {

      if (textEl.style.fontSize === '32px') {

        textEl.style.fontSize = '22px';

      } else {

        textEl.style.fontSize = '32px';

      }

      window.VoiceManager.playChime('click');

    }

  },

  sendPhoneHeart() {

    const display = document.getElementById('phoneHeartDisplay');

    const msg = document.getElementById('phoneHeartMsg');

    if (display && msg) {

      display.textContent = '💖 🧡 💖';

      msg.textContent = '하트가 정성스럽게 전달되었습니다! 🥰';

      window.VoiceManager.playChime('success');

      window.VoiceManager.speak('하트가 가족에게 잘 전달되었어요. 참 따뜻해요!');

    }

  },

  snapPhoto() {

    const preview = document.getElementById('cameraPreview');

    if (preview) {

      preview.style.filter = 'brightness(1.5)';

      setTimeout(() => {

        preview.style.filter = 'none';

      }, 300);

      window.VoiceManager.playChime('success');

      window.VoiceManager.speak('찰칵! 노란 해바라기 사진이 아주 멋지게 찍혔어요!');

    }

  },

  togglePlaySong() {

    const btn = document.getElementById('btnPlaySong');

    if (btn) {

      btn.classList.toggle('playing');

      if (btn.classList.contains('playing')) {

        btn.innerHTML = '⏸️ 멜로디 멈추기';

        window.VoiceManager.speak('나의 살던 고향은 꽃피는 산골, 복숭아꽃 살구꽃 아기 진달래. 가사를 함께 불러보세요.');

      } else {

        btn.innerHTML = '🎵 정다운 멜로디 듣기';

        window.VoiceManager.stopSpeaking();

      }

    }

  },

  // 두뇌 기억력 카드 짝맞추기 놀이 (Memory Game with Auto-Flip)

  getMemoryGameHtml() {

    const cards = [

      { id: 0, name: '사과', emoji: '🍎', pairId: 'apple' },

      { id: 1, name: '바나나', emoji: '🍌', pairId: 'banana' },

      { id: 2, name: '사과', emoji: '🍎', pairId: 'apple' },

      { id: 3, name: '바나나', emoji: '🍌', pairId: 'banana' }

    ];

    return `

      <div class="memory-game-wrapper">

        <div class="memory-game-status-bar">

          <span id="memoryStatusBadge" class="memory-status-badge">👀 2.5초간 과일 위치를 눈으로 쏙 외워보세요!</span>

          <button type="button" class="btn-memory-replay" onclick="LessonEngine.startMemoryAutoFlip()">🔄 다시 외우기 (자동 뒤집기)</button>

        </div>

        <div class="memory-cards-grid" id="memoryCardsGrid">

          ${cards.map(c => `

            <div class="memory-flip-card flipped" data-card-idx="${c.id}" data-pair="${c.pairId}" onclick="LessonEngine.onMemoryCardClick(${c.id})">

              <div class="memory-flip-inner">

                <!-- 카드 앞면 (과일 그림과 글자) -->

                <div class="memory-card-face memory-card-front">

                  <div class="card-fruit-emoji">${c.emoji}</div>

                  <div class="card-fruit-name">${c.name}</div>

                </div>

                <!-- 카드 뒷면 (물음표 및 기억하기) -->

                <div class="memory-card-face memory-card-back">

                  <div class="card-back-icon">❓</div>

                  <div class="card-back-text">과일 짝</div>

                </div>

              </div>

            </div>

          `).join('')}

        </div>

      </div>

    `;

  },

  // 2.5초간 앞면을 보여준 뒤 자동으로 슉! 뒤집히는 엔진

  startMemoryAutoFlip() {

    if (this._memoryFlipTimer) clearTimeout(this._memoryFlipTimer);

    this.memoryState = {

      openedCards: [],

      matchedPairs: 0,

      isLocked: true

    };

    const grid = document.getElementById('memoryCardsGrid');

    const badge = document.getElementById('memoryStatusBadge');

    if (!grid) return;

    const cards = grid.querySelectorAll('.memory-flip-card');

    // 1단계: 모든 카드를 앞면(과일 보임)으로 열기

    cards.forEach(c => {

      c.classList.remove('matched');

      c.classList.add('flipped');

    });

    const optGrid = document.getElementById('choiceOptionsGrid');

    if (optGrid) {

      optGrid.classList.add('memory-options-hidden');

      optGrid.classList.remove('memory-options-revealed');

    }

    const feedbackArea = document.getElementById('warmFeedbackArea');

    if (feedbackArea) {

      feedbackArea.innerHTML = '';

    }

    if (badge) {

      badge.textContent = '👀 2.5초간 과일 위치를 눈으로 쏙 외워보세요!';

      badge.classList.remove('active-play');

    }

    if (window.VoiceManager) {

      window.VoiceManager.playChime('chime');

    }

    // 2단계: 2.5초 후 자동으로 카드가 슉! 뒤집혀 뒷면으로 닫힘

    this._memoryFlipTimer = setTimeout(() => {

      cards.forEach((c, idx) => {

        setTimeout(() => {

          c.classList.remove('flipped');

        }, idx * 80); // 살짝 시차를 두어 더욱 생동감 넘치게 뒤집힘

      });

      if (badge) {

        badge.textContent = '✨ 카드가 뒤집혔어요! 같은 과일 짝을 터치해보세요.';

        badge.classList.add('active-play');

      }

      if (window.VoiceManager) {

        window.VoiceManager.playChime('click');

      }

      this.memoryState.isLocked = false;

    }, 2500);

  },

  // 어르신이 카드를 터치했을 때 플립 및 짝맞추기 처리

  onMemoryCardClick(idx) {

    if (!this.memoryState || this.memoryState.isLocked) return;

    const cardEl = document.querySelector(`.memory-flip-card[data-card-idx="${idx}"]`);

    if (!cardEl || cardEl.classList.contains('matched') || cardEl.classList.contains('flipped')) return;

    // 카드 열기

    cardEl.classList.add('flipped');

    window.VoiceManager.playChime('click');

    const opened = this.memoryState.openedCards;

    opened.push({ idx, el: cardEl, pair: cardEl.dataset.pair });

    if (opened.length === 2) {

      const [first, second] = opened;

      if (first.pair === second.pair) {

        // 짝 맞춤 성공!

        this.memoryState.matchedPairs++;

        setTimeout(() => {

          first.el.classList.add('matched');

          second.el.classList.add('matched');

          window.VoiceManager.playChime('chime');

          const badge = document.getElementById('memoryStatusBadge');

          if (this.memoryState.matchedPairs >= 2) {

            if (badge) badge.textContent = '🎉 짝을 완벽히 다 맞추셨어요! 백점 만점입니다! 👏';

            // 4개 모두 맞춤 -> 사용자 요청대로 첨부된 3개 카드 스르륵 등장 및 첫 번째 카드 자동 선택/하이라이트!

            const optGrid = document.getElementById('choiceOptionsGrid');

            if (optGrid) {

              optGrid.classList.remove('memory-options-hidden');

              optGrid.classList.add('memory-options-revealed');

            }

            // 첫 번째 선택지 자동 선택 및 따뜻한 피드백 표시

            LessonEngine.handleOptionSelect(0);

            // 축하 음성 안내

            if (window.VoiceManager) {

              window.VoiceManager.speak('참 잘하셨어요! 사과와 바나나 짝을 완벽하게 모두 찾으셨어요!');

            }

          } else {

            if (badge) badge.textContent = '👏 딩동댕! 짝이 맞았어요! 다음 과일도 찾아보세요.';

          }

        }, 300);

        this.memoryState.openedCards = [];

      } else {

        // 일치하지 않음 -> 1.2초 후 다시 자동으로 뒤집어서 닫기

        this.memoryState.isLocked = true;

        setTimeout(() => {

          first.el.classList.remove('flipped');

          second.el.classList.remove('flipped');

          this.memoryState.openedCards = [];

          this.memoryState.isLocked = false;

        }, 1200);

      }

    }

  },

  flipMemoryCard(el) {

    window.VoiceManager.playChime('click');

    el.classList.toggle('flipped');

  },

  handleOptionSelect(optionIndex) {

    this.selectedAnswers[this.currentStepIndex] = optionIndex;

    if (window.VoiceManager) window.VoiceManager.resetInactivityTimer();

    const sourceStep = this.currentLesson.steps[this.currentStepIndex];
    const step = window.ReminiscenceImages ? window.ReminiscenceImages.protect(sourceStep, this.currentLesson.id, this.currentStepIndex) : sourceStep;

    step.options.forEach((_, idx) => {

      const btn = document.getElementById(`choiceBtn_${idx}`);

      if (btn) {

        if (idx === optionIndex) {

          btn.classList.add('selected');

        } else {

          btn.classList.remove('selected');

        }

      }

    });

    const chosen = step.options[optionIndex];
    const feedbackArea = document.getElementById('warmFeedbackArea');

    // 문제가 선택되면 아름다운 완성 이미지가 스르륵 나타나는 인터랙티브 효과
    if (step.sketchImageSrc || step.revealOnSelect) {
      const photoBox = document.getElementById('photoMemoryBox');
      const photoImg = document.getElementById('photoMemoryImg');
      const photoCaption = document.getElementById('photoCaptionTag');

      if (photoBox) {
        photoBox.style.display = 'block';
        photoBox.classList.remove('reveal-anim');
        void photoBox.offsetWidth; // trigger reflow
        photoBox.classList.add('reveal-anim');
      }

      const targetSrc = (chosen && chosen.imageSrc) ? chosen.imageSrc : step.imageSrc;
      if (photoImg && targetSrc) {
        photoImg.src = targetSrc;
      }

      if (photoCaption) {
        photoCaption.innerHTML = `🎨 ${step.stepNum || ''}단계 · [${chosen.emoji || '✨'} ${chosen.text || ''}] 완성!`;
      }
    }

    let feedbackHtml = '';

    const isQuizOrQuestion = (chosen.isBest !== undefined);

    if (chosen.isBest) {

      feedbackHtml = `

        <div class="warm-feedback-banner">

          <span>👏</span>

          <span>${chosen.feedback || '맞았어요! 정말 잘하셨어요.'}</span>

        </div>

      `;
    } else {

      window.VoiceManager.playChime('click');

      feedbackHtml = `

        <div class="warm-feedback-banner">

          <span>🧡</span>

          <span>${chosen.feedback || '좋아요. 함께 천천히 해봐요.'}</span>

        </div>

      `;

      if (feedbackArea) feedbackArea.innerHTML = feedbackHtml;

      if (chosen.feedback) {

        window.VoiceManager.speak(chosen.feedback, null, { emotion: 'warm' });

      }

    }

    const aiSpeechText = document.getElementById('aiSpeechText');

    if (aiSpeechText && chosen.feedback) {

      aiSpeechText.textContent = chosen.feedback;

    }

  },

  // 화면 텍스트와 분리된 voiceScript를 우선 발화하고 25초 무반응 타이머 시작

  speakStepVoice(step) {

    if (!step) return;

    // voiceScript 객체 또는 문자열 추출

    let scriptToSpeak = step.voiceScript || step.aiMessage || step.prompt;

    let emotion = step.emotion || 'warm';

    // 이전 버튼으로 돌아온 경우 따뜻한 안심 안내 결합 (Section 22)

    if (this._isNavigatingPrev) {

      this._isNavigatingPrev = false;

      const prevIntro = (window.VoiceScripts && window.VoiceScripts.navPrev && window.VoiceScripts.navPrev.voiceScript)

        || "괜찮아요. 이전 내용을 다시 보고 싶으시면 천천히 살펴보셔도 됩니다.";

      scriptToSpeak = prevIntro + " " + scriptToSpeak;

    }

    window.VoiceManager.speak(scriptToSpeak, () => {

      // 발화 완료 후 사용자가 25초간 무반응일 때 격려 안내 타이머 가동 (Section 21)

      window.VoiceManager.startInactivityTimer(step);

    }, { emotion: emotion, speed: step.speed });

  },

  // 18. 도움말 버튼 안내 음성 실행

  speakStepHelp() {

    if (!this.currentLesson || !this.currentLesson.steps) return;

    const sourceStep = this.currentLesson.steps[this.currentStepIndex];
    const step = window.ReminiscenceImages ? window.ReminiscenceImages.protect(sourceStep, this.currentLesson.id, this.currentStepIndex) : sourceStep;

    const specificHelp = step ? step.helpScript : null;

    window.VoiceManager.speakHelp(specificHelp);

  },

  // 레거시 호환용 다시 듣기

  speakCurrentAiMessage() {

    window.VoiceManager.replayLastScript();

  },

  nextStep() {

    if (window.KaraokeEngine) window.KaraokeEngine.stopKaraoke();

    window.VoiceManager.clearInactivityTimer();

    window.VoiceManager.playChime('click');

    this.currentStepIndex++;

    this.renderCurrentStep();

    document.getElementById('lessonViewport').scrollTop = 0;

  },

  prevStep() {

    if (this.currentStepIndex > 0) {

      if (window.KaraokeEngine) window.KaraokeEngine.stopKaraoke();

      window.VoiceManager.clearInactivityTimer();

      window.VoiceManager.playChime('click');

      this.currentStepIndex--;

      this._isNavigatingPrev = true;

      this.renderCurrentStep();

      document.getElementById('lessonViewport').scrollTop = 0;

    }

  },

  renderCompletionScreen(container) {

    if (window.KaraokeEngine) window.KaraokeEngine.stopKaraoke();

    window.VoiceManager.clearInactivityTimer();

    window.VoiceManager.playChime('success');

    // Section 24: 단일 수업 완료 대본

    const completeScript = (window.VoiceScripts && window.VoiceScripts.lessonComplete && window.VoiceScripts.lessonComplete.voiceScript)

      || '오늘 수업은 여기까지입니다. 정말 잘하셨어요. 처음에는 조금 어렵게 느껴질 수 있지만 몇 번 사용하다 보면 금방 익숙해질 거예요. 오늘 배운 내용 중에서 한 가지만 직접 사용해보셔도 충분합니다.';

    container.innerHTML = `

      <div class="completion-container">

        <img src="assets/images/ai_puppy_heart.jpg" alt="수업 완료 축하" class="completion-robot-img">

        <div class="ai-friend-speech-area" style="width: 100%;">

          <div class="ai-friend-speech-content" style="align-items: center; text-align: center;">

            <div class="ai-friend-name-tag">👩‍🏫 AI 선생님</div>

            <div class="ai-speech-text" id="aiCompleteText" style="line-height:1.7;">

              오늘 수업은 여기까지입니다. 정말 잘하셨어요!<br>

              오늘 배운 내용 중에서 한 가지만 직접 사용해보셔도 충분합니다.

            </div>

            <button class="btn-tts-replay" onclick="VoiceManager.replayLastScript()" style="margin-top:12px;">

              ↻ 다시 듣기

            </button>

          </div>

        </div>

        <h2 class="completion-title">오늘 수업은 어떠셨어요?</h2>

        <div class="mood-selector-grid">

          <button class="btn-mood-choice ${this.selectedMoodEmoji === '😊' ? 'selected' : ''}" onclick="LessonEngine.selectMood('😊 재미있었어요', '😊')">

            <span class="mood-icon">😊</span>

            <span class="mood-label">재미있었어요</span>

          </button>

          <button class="btn-mood-choice ${this.selectedMoodEmoji === '🙂' ? 'selected' : ''}" onclick="LessonEngine.selectMood('🙂 괜찮았어요', '🙂')">

            <span class="mood-icon">🙂</span>

            <span class="mood-label">괜찮았어요</span>

          </button>

          <button class="btn-mood-choice ${this.selectedMoodEmoji === '😐' ? 'selected' : ''}" onclick="LessonEngine.selectMood('😐 잘 모르겠어요', '😐')">

            <span class="mood-icon">😐</span>

            <span class="mood-label">잘 모르겠어요</span>

          </button>

          <button class="btn-mood-choice ${this.selectedMoodEmoji === '😴' ? 'selected' : ''}" onclick="LessonEngine.selectMood('😴 조금 피곤해요', '😴')">

            <span class="mood-icon">😴</span>

            <span class="mood-label">조금 피곤해요</span>

          </button>

        </div>

        <button class="btn-hero-action btn-hero-primary" style="font-size: 26px; padding: 18px 48px; margin-top: 20px; width: 100%; max-width: 460px;" onclick="LessonEngine.finishLessonAndSave()">

          🎉 오늘 수업 끝내기

        </button>

      </div>

    `;

    window.VoiceManager.speak(completeScript, null, { emotion: 'warm' });

  },

  speakCompleteMessage() {

    window.VoiceManager.replayLastScript();

  },

  selectMood(moodText, moodEmoji) {

    this.selectedMood = moodText;

    this.selectedMoodEmoji = moodEmoji;

    window.VoiceManager.playChime('click');

    const buttons = document.querySelectorAll('.btn-mood-choice');

    buttons.forEach(btn => {

      if (btn.textContent.includes(moodText.replace(/[^가-힣]/g, ''))) {

        btn.classList.add('selected');

      } else {

        btn.classList.remove('selected');

      }

    });

    window.VoiceManager.speak(`${moodText}를 선택하셨어요. 소중한 의견 고마워요.`);

  },

  finishLessonAndSave() {

    if (window.KaraokeEngine) window.KaraokeEngine.stopKaraoke();

    const durationSeconds = Math.max(10, Math.round((Date.now() - this.startTime) / 1000));

    const mins = Math.floor(durationSeconds / 60);

    const secs = durationSeconds % 60;

    const durationText = mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`;

    window.RecordManager.saveRecord({

      learner: window.RecordManager.getCurrentLearner(),

      lessonTitle: this.currentLesson.title,

      lessonIcon: this.currentLesson.icon,

      isCompleted: true,

      mood: this.selectedMood,

      moodEmoji: this.selectedMoodEmoji,

      assistanceNeeded: this.needsAssistance,

      durationText: durationText

    });

    window.VoiceManager.playChime('success');

    // Section 25: 모든 수업 완료 검사 및 음성 재생

    const allDoneScript = (window.VoiceScripts && window.VoiceScripts.allComplete && window.VoiceScripts.allComplete.voiceScript)

      || '축하드려요! AI 디지털 학교의 수업을 잘 마치셨습니다. 앞으로도 궁금한 것이 생기면 언제든 다시 찾아주세요. 오늘 정말 수고 많으셨습니다.';

    window.VoiceManager.speak(allDoneScript, () => {

      this.exitLesson();

    }, { emotion: 'happy' });

  },

  exitLesson() {

    if (window.KaraokeEngine) window.KaraokeEngine.stopKaraoke();

    window.VoiceManager.stopSpeaking();

    const viewport = document.getElementById('lessonViewport');

    viewport.classList.remove('active');

    document.body.style.overflow = '';

  }

};

window.LessonEngine = LessonEngine;
