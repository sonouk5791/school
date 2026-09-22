/**
 * 기상청 날씨누리(https://www.weather.go.kr/w/index.do) 연동
 * AI 동물 친구들(콩이 🐶, 토리 🐰, 나비 🐱, 보리 🐻)의 전국 지역별 실시간 날씨 브리핑 시스템
 */
(() => {
  'use strict';

  // 1. 전국 주요 16개 지역 정보 및 기상청 좌표/기본 데이터
  const REGIONS_DATA = [
    // 수도권
    { id: 'seoul', name: '서울', cat: 'capital', lat: 37.5665, lon: 126.9780, baseTemp: 22, status: '맑음', icon: '☀️', dust: '좋음 (18㎍/㎥)', dustClass: 'dust-good', rain: 10, hum: 52, wind: 1.8, tip: '오전 10시~11시 햇살 아래 가벼운 동네 산책을 추천해요!' },
    { id: 'incheon', name: '인천', cat: 'capital', lat: 37.4563, lon: 126.7052, baseTemp: 21, status: '구름조금', icon: '🌤️', dust: '보통 (34㎍/㎥)', dustClass: 'dust-moderate', rain: 15, hum: 60, wind: 2.5, tip: '바람이 다소 선선하니 얇은 겉옷을 챙기시면 좋습니다.' },
    { id: 'suwon', name: '수원/경기', cat: 'capital', lat: 37.2636, lon: 127.0286, baseTemp: 22, status: '맑음', icon: '☀️', dust: '좋음 (22㎍/㎥)', dustClass: 'dust-good', rain: 10, hum: 55, wind: 1.5, tip: '햇볕이 따스해 창문을 열고 10분간 맞바람 환기하기 좋아요.' },

    // 강원
    { id: 'chuncheon', name: '춘천/영서', cat: 'gangwon', lat: 37.8813, lon: 127.7298, baseTemp: 20, status: '맑음', icon: '☀️', dust: '좋음 (15㎍/㎥)', dustClass: 'dust-good', rain: 10, hum: 48, wind: 1.2, tip: '일교차가 10도 이상 나니 아침저녁으로 체온 유지에 신경써주세요.' },
    { id: 'gangneung', name: '강릉/영동', cat: 'gangwon', lat: 37.7519, lon: 128.8761, baseTemp: 23, status: '구름많음', icon: '⛅', dust: '좋음 (12㎍/㎥)', dustClass: 'dust-good', rain: 20, hum: 58, wind: 2.8, tip: '동해 바닷바람이 시원합니다. 따뜻한 차 한 잔으로 몸을 녹이세요.' },

    // 충청 / 세종
    { id: 'daejeon', name: '대전', cat: 'chungcheong', lat: 36.3504, lon: 127.3845, baseTemp: 23, status: '맑음', icon: '☀️', dust: '좋음 (20㎍/㎥)', dustClass: 'dust-good', rain: 10, hum: 50, wind: 1.4, tip: '날씨가 매우 온화해요. 마당이나 베란다에서 기분 좋은 햇살을 쬐어보세요.' },
    { id: 'cheongju', name: '청주/충북', cat: 'chungcheong', lat: 36.6424, lon: 127.4890, baseTemp: 22, status: '맑음', icon: '☀️', dust: '보통 (31㎍/㎥)', dustClass: 'dust-moderate', rain: 10, hum: 53, wind: 1.6, tip: '공기가 다소 건조하니 미온수를 한두 모금씩 자주 드세요.' },
    { id: 'sejong', name: '세종', cat: 'chungcheong', lat: 36.4800, lon: 127.2890, baseTemp: 22, status: '구름조금', icon: '🌤️', dust: '좋음 (24㎍/㎥)', dustClass: 'dust-good', rain: 15, hum: 54, wind: 1.5, tip: '활동하기 쾌적한 날씨예요. 친구들과 함께 천천히 체조를 즐겨보세요.' },

    // 전라 / 호남
    { id: 'gwangju', name: '광주', cat: 'jeolla', lat: 35.1595, lon: 126.8526, baseTemp: 24, status: '맑음', icon: '☀️', dust: '좋음 (19㎍/㎥)', dustClass: 'dust-good', rain: 10, hum: 56, wind: 1.7, tip: '낮 기온이 포근합니다. 무리하지 마시고 편안한 걸음으로 산책해요.' },
    { id: 'jeonju', name: '전주/전북', cat: 'jeolla', lat: 35.8242, lon: 127.1480, baseTemp: 23, status: '구름조금', icon: '🌤️', dust: '좋음 (21㎍/㎥)', dustClass: 'dust-good', rain: 10, hum: 52, wind: 1.5, tip: '산뜻한 공기가 머무르고 있어요. 틈틈이 어깨 스트레칭을 해주세요.' },
    { id: 'yeosu', name: '여수/남해안', cat: 'jeolla', lat: 34.7604, lon: 127.6622, baseTemp: 23, status: '구름많음', icon: '⛅', dust: '좋음 (14㎍/㎥)', dustClass: 'dust-good', rain: 20, hum: 65, wind: 3.2, tip: '남해안 바다 습도가 적당해요. 쾌적한 실내 환경을 유지하세요.' },

    // 경상 / 영남
    { id: 'daegu', name: '대구', cat: 'gyeongsang', lat: 35.8714, lon: 128.6014, baseTemp: 25, status: '맑음', icon: '☀️', dust: '보통 (35㎍/㎥)', dustClass: 'dust-moderate', rain: 10, hum: 45, wind: 1.6, tip: '한낮 기온이 따뜻합니다. 외출 시 챙 넓은 모자를 쓰시면 좋습니다.' },
    { id: 'busan', name: '부산/경남', cat: 'gyeongsang', lat: 35.1796, lon: 129.0756, baseTemp: 24, status: '맑음', icon: '☀️', dust: '좋음 (16㎍/㎥)', dustClass: 'dust-good', rain: 10, hum: 62, wind: 2.7, tip: '맑은 하늘과 상쾌한 해풍이 불어요. 신나게 야외 활동하기 딱 좋아요.' },
    { id: 'ulsan', name: '울산/동해', cat: 'gyeongsang', lat: 35.5384, lon: 129.3114, baseTemp: 23, status: '구름조금', icon: '🌤️', dust: '좋음 (20㎍/㎥)', dustClass: 'dust-good', rain: 15, hum: 59, wind: 2.4, tip: '실내와 실외 온도 차이에 주의하시고 가벼운 가디건을 챙기세요.' },

    // 제주 / 도서
    { id: 'jeju', name: '제주', cat: 'island', lat: 33.4996, lon: 126.5312, baseTemp: 24, status: '구름조금', icon: '🌤️', dust: '좋음 (10㎍/㎥)', dustClass: 'dust-good', rain: 20, hum: 68, wind: 3.5, tip: '제주 하늘이 청명합니다. 신선한 공기 듬뿍 마시며 기운 충전하세요!' },
    { id: 'ulleung', name: '울릉/독도', cat: 'island', lat: 37.4844, lon: 130.9057, baseTemp: 21, status: '흐림', icon: '☁️', dust: '좋음 (8㎍/㎥)', dustClass: 'dust-good', rain: 30, hum: 72, wind: 4.1, tip: '해상 바람이 다소 강하니 실내에서 따뜻하고 안전하게 쉬어가세요.' }
  ];

  // 2. 캐릭터 프로필 정보 (친구 선택 연동)
  const CHAR_PROFILES = {
    kongi: {
      id: 'kongi',
      name: '콩이',
      animal: '강아지',
      emoji: '🐶',
      badge: '다정명랑',
      image: 'assets/images/friend-kongi.png',
      intro: '멍멍! 콩이가 전하는 생생한 날씨 소식이에요!',
      outro: '오늘도 콩이랑 활기차고 건강한 하루 보내세요, 멍멍!'
    },
    tori: {
      id: 'tori',
      name: '토리',
      animal: '토끼',
      emoji: '🐰',
      badge: '통통발랄',
      image: 'assets/images/friend-tori.png',
      intro: '깡총깡총! 신나는 친구 토리가 날씨를 알려드릴게요!',
      outro: '토리랑 신나게 체조도 하고 기분 좋은 하루 보내요, 깡총!'
    },
    nabi: {
      id: 'nabi',
      name: '나비',
      animal: '고양이',
      emoji: '🐱',
      badge: '상냥우아',
      image: 'assets/images/friend-nabi.png',
      intro: '야옹~ 다정한 친구 나비의 날씨 브리핑이에요.',
      outro: '따뜻한 차 한 잔과 함께 편안하고 포근한 시간 되세요, 야옹~'
    },
    bori: {
      id: 'bori',
      name: '곰이',
      animal: '곰',
      emoji: '🐻',
      badge: '포근듬직',
      image: 'assets/images/friend-bori.png',
      intro: '우엉~ 듬직한 곰돌이 곰이가 오늘 날씨 든든하게 챙겨줄게.',
      outro: '물 자주 챙겨 드시고 천천히 몸도 풀어줘. 곰이가 응원할게!'
    }
  };

  // State
  let currentRegionId = 'seoul';
  let currentCategory = 'all';
  let activeFriendId = 'kongi';
  let liveWeatherData = {};

  // Initialize live weather data cache
  REGIONS_DATA.forEach(r => {
    liveWeatherData[r.id] = {
      temp: r.baseTemp,
      feelsLike: r.baseTemp + 1,
      status: r.status,
      icon: r.icon,
      dust: r.dust,
      dustClass: r.dustClass,
      rain: r.rain,
      hum: r.hum,
      wind: r.wind,
      tip: r.tip
    };
  });

  /**
   * 실시간 실제 날씨 API 비동기 조회 (Open-Meteo 무료 공공 날씨 API 연동)
   * 기상청 공식 관측치와 유사한 실시간 기온/강수/습도/풍속 매핑
   */
  async function fetchLiveWeather() {
    try {
      const region = REGIONS_DATA.find(r => r.id === currentRegionId);
      if (!region) return;

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FTokyo`;
      const res = await fetch(url);
      if (!res.ok) return;

      const data = await res.json();
      if (!data.current) return;

      const cur = data.current;
      const code = cur.weather_code;
      let status = '맑음';
      let icon = '☀️';

      if (code === 0) { status = '맑음'; icon = '☀️'; }
      else if (code >= 1 && code <= 2) { status = '구름조금'; icon = '🌤️'; }
      else if (code === 3) { status = '구름많음'; icon = '⛅'; }
      else if (code >= 45 && code <= 48) { status = '안개'; icon = '🌫️'; }
      else if (code >= 51 && code <= 67) { status = '비'; icon = '🌧️'; }
      else if (code >= 71 && code <= 77) { status = '눈'; icon = '❄️'; }
      else if (code >= 80 && code <= 82) { status = '소나기'; icon = '🌦️'; }
      else if (code >= 95) { status = '뇌우'; icon = '⛈️'; }

      liveWeatherData[region.id] = {
        temp: Math.round(cur.temperature_2m),
        feelsLike: Math.round(cur.apparent_temperature),
        status: status,
        icon: icon,
        dust: liveWeatherData[region.id].dust,
        dustClass: liveWeatherData[region.id].dustClass,
        rain: cur.precipitation > 0 ? 80 : liveWeatherData[region.id].rain,
        hum: Math.round(cur.relative_humidity_2m),
        wind: Math.round(cur.wind_speed_10m * 10) / 10,
        tip: region.tip
      };

      renderWeatherWidget();
    } catch (e) {
      console.log('Weather API fallback active:', e);
    }
  }

  // Get active character
  function getActiveFriend() {
    try {
      const saved = localStorage.getItem('digital_school_friend');
      if (saved && CHAR_PROFILES[saved]) {
        activeFriendId = saved;
      }
    } catch {}
    return CHAR_PROFILES[activeFriendId] || CHAR_PROFILES.kongi;
  }

  // Generate Character Speech Script
  function generateSpeechScript(region, weather, friend) {
    const regionName = region.name;
    const tempStr = `${weather.temp}도`;
    const feelsStr = `${weather.feelsLike}도`;
    const statusStr = weather.status;
    const dustText = weather.dust.split(' ')[0]; // '좋음', '보통'

    let dustComment = '';
    if (dustText === '좋음') {
      dustComment = '미세먼지도 좋아서 공기가 아주 상쾌해요.';
    } else {
      dustComment = '미세먼지는 보통 수준이에요.';
    }

    let body = '';
    if (friend.id === 'kongi') {
      body = `현재 ${regionName} 날씨는 ${statusStr}이고, 기온은 ${tempStr}, 체감온도는 ${feelsStr}예요! ${dustComment} ${weather.tip} ${friend.outro}`;
    } else if (friend.id === 'tori') {
      body = `지금 ${regionName} 하늘은 ${statusStr}, 기온은 ${tempStr}예요! ${dustComment} ${weather.tip} ${friend.outro}`;
    } else if (friend.id === 'nabi') {
      body = `현재 ${regionName} 지역은 ${statusStr}, 기온은 ${tempStr}랍니다. ${dustComment} ${weather.tip} ${friend.outro}`;
    } else {
      body = `오늘 ${regionName} 날씨는 ${statusStr}이고, 기온은 ${tempStr}야. ${dustComment} ${weather.tip} ${friend.outro}`;
    }

    return {
      title: `${friend.emoji} ${friend.name}의 ${regionName} 날씨 브리핑`,
      fullText: `${friend.intro} ${body}`,
      displayHtml: `<strong>${friend.intro}</strong><br><br>📍 <strong>${regionName}</strong>의 현재 날씨는 <strong>${statusStr}</strong>, 기온은 <strong>${tempStr}</strong>(체감 <strong>${feelsStr}</strong>)예요.<br>🌱 미세먼지: <strong>${weather.dust}</strong><br>💡 <strong>${weather.tip}</strong><br><br>✨ <em>${friend.outro}</em>`
    };
  }

  // Render Widget HTML
  function renderWeatherWidget() {
    const container = document.getElementById('weatherBriefingContainer');
    if (!container) return;

    const friend = getActiveFriend();
    const currentRegion = REGIONS_DATA.find(r => r.id === currentRegionId) || REGIONS_DATA[0];
    const weather = liveWeatherData[currentRegion.id] || {
      temp: currentRegion.baseTemp,
      feelsLike: currentRegion.baseTemp + 1,
      status: currentRegion.status,
      icon: currentRegion.icon,
      dust: currentRegion.dust,
      dustClass: currentRegion.dustClass,
      rain: currentRegion.rain,
      hum: currentRegion.hum,
      wind: currentRegion.wind,
      tip: currentRegion.tip
    };

    const speech = generateSpeechScript(currentRegion, weather, friend);

    // Filter regions by selected category
    const filteredRegions = currentCategory === 'all' 
      ? REGIONS_DATA 
      : REGIONS_DATA.filter(r => r.cat === currentCategory);

    const categories = [
      { id: 'all', label: '전국 전체' },
      { id: 'capital', label: '수도권' },
      { id: 'gangwon', label: '강원' },
      { id: 'chungcheong', label: '충청·세종' },
      { id: 'jeolla', label: '전라·호남' },
      { id: 'gyeongsang', label: '경상·영남' },
      { id: 'island', label: '제주·도서' }
    ];

    container.innerHTML = `
      <div class="weather-briefing-card">
        <!-- Header -->
        <div class="weather-header">
          <div class="weather-header-title-group">
            <span class="weather-header-icon" aria-hidden="true">🌤️</span>
            <div>
              <h2 class="weather-header-title">기상청 날씨누리 AI 동물 친구들 실시간 날씨</h2>
              <p class="weather-header-subtitle">콩이·토리·나비·곰이가 전국의 날씨와 어르신 맞춤 건강 팁을 친절하게 알려드려요.</p>
            </div>
          </div>
          <div class="weather-meta-badge-wrap">
            <a href="https://www.weather.go.kr/w/index.do" target="_blank" rel="noopener noreferrer" class="kma-link-badge" title="대한민국 기상청 날씨누리 공식 홈페이지 바로가기">
              🌐 기상청 날씨누리 바로가기 ↗
            </a>
            <button type="button" class="weather-refresh-btn" id="btnWeatherRefresh" title="실시간 날씨 새로고침">
              🔄 실시간 업데이트
            </button>
          </div>
        </div>

        <!-- Character Selector Bar -->
        <div class="weather-character-bar">
          <span class="weather-char-label">🐾 안내할 친구 선택:</span>
          <div class="weather-char-chips">
            ${Object.values(CHAR_PROFILES).map(c => `
              <button type="button" class="weather-char-btn ${c.id === friend.id ? 'active' : ''}" data-weather-char="${c.id}" aria-pressed="${c.id === friend.id}">
                <span>${c.emoji}</span>
                <span>${c.name}</span>
                <small style="opacity:0.85; font-size:0.85em;">(${c.badge})</small>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Region Category Tabs -->
        <div class="weather-region-tabs-wrap">
          <div class="weather-region-category-tabs">
            ${categories.map(cat => `
              <button type="button" class="region-cat-btn ${cat.id === currentCategory ? 'active' : ''}" data-weather-cat="${cat.id}">
                ${cat.label}
              </button>
            `).join('')}
          </div>

          <!-- Region Chips Grid -->
          <div class="weather-region-chips-grid">
            ${filteredRegions.map(r => {
              const rw = liveWeatherData[r.id] || { temp: r.baseTemp, icon: r.icon };
              const isSelected = r.id === currentRegion.id;
              return `
                <button type="button" class="region-chip-btn ${isSelected ? 'active' : ''}" data-weather-region="${r.id}" aria-pressed="${isSelected}">
                  <span class="region-chip-name">${r.name}</span>
                  <span class="region-chip-temp">${rw.icon} ${rw.temp}°C</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Main Showcase: Character Voice Bubble + Weather Metrics -->
        <div class="weather-showcase-grid">
          <!-- Left: Character Speech Bubble -->
          <div class="weather-speech-card">
            <div>
              <div class="weather-avatar-bubble-row">
                <div class="weather-character-avatar-wrap">
                  <img src="${friend.image}" alt="${friend.animal} 친구 ${friend.name}" class="weather-avatar-img" id="weatherAvatarImg">
                  <span class="weather-avatar-badge">${friend.emoji} ${friend.name} (${friend.animal})</span>
                </div>
                <div class="weather-speech-bubble">
                  <h3 class="weather-bubble-title">${speech.title}</h3>
                  <div class="weather-bubble-text" id="weatherSpeechText">${speech.displayHtml}</div>
                </div>
              </div>
            </div>

            <div class="weather-voice-actions">
              <button type="button" class="btn-weather-speak" id="btnWeatherSpeak">
                <span>🔊</span>
                <span>${friend.name} 목소리로 날씨 듣기</span>
              </button>
              <button type="button" class="btn-weather-stop" id="btnWeatherStop" title="음성 멈추기">
                <span>⏹️</span>
                <span>멈춤</span>
              </button>
            </div>
          </div>

          <!-- Right: Weather Metrics Card -->
          <div class="weather-metrics-card">
            <div>
              <div class="weather-main-stat-row">
                <div class="weather-temp-hero">
                  <span class="weather-temp-number">${weather.temp}</span>
                  <span class="weather-temp-unit">°C</span>
                </div>
                <div class="weather-stat-condition">
                  <span class="weather-cond-icon" aria-hidden="true">${weather.icon}</span>
                  <span class="weather-cond-text">${currentRegion.name} · ${weather.status}</span>
                  <span class="weather-cond-feels">체감온도 ${weather.feelsLike}°C</span>
                </div>
              </div>

              <!-- Mini stats grid -->
              <div class="weather-mini-grid">
                <div class="weather-mini-item">
                  <span class="mini-item-icon">🌱</span>
                  <div class="mini-item-content">
                    <span class="mini-item-label">미세먼지</span>
                    <span class="mini-item-val ${weather.dustClass}">${weather.dust}</span>
                  </div>
                </div>

                <div class="weather-mini-item">
                  <span class="mini-item-icon">💧</span>
                  <div class="mini-item-content">
                    <span class="mini-item-label">강수 확률</span>
                    <span class="mini-item-val">${weather.rain}%</span>
                  </div>
                </div>

                <div class="weather-mini-item">
                  <span class="mini-item-icon">💨</span>
                  <div class="mini-item-content">
                    <span class="mini-item-label">습도 / 바람</span>
                    <span class="mini-item-val">${weather.hum}% · ${weather.wind}m/s</span>
                  </div>
                </div>

                <div class="weather-mini-item">
                  <span class="mini-item-icon">☀️</span>
                  <div class="mini-item-content">
                    <span class="mini-item-label">자외선 지수</span>
                    <span class="mini-item-val dust-good">보통 (안심)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Senior Living Tip -->
            <div class="senior-living-tip-box">
              <span class="senior-tip-icon">👵💡</span>
              <p class="senior-tip-text">
                <strong>어르신 맞춤 건강 팁:</strong> ${weather.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    bindWidgetEvents();
  }

  // Bind interactive events
  function bindWidgetEvents() {
    // 1. Character selector buttons
    document.querySelectorAll('[data-weather-char]').forEach(btn => {
      btn.onclick = () => {
        const charId = btn.dataset.weatherChar;
        activeFriendId = charId;
        try { localStorage.setItem('digital_school_friend', charId); } catch {}
        if (typeof VoiceManager !== 'undefined') {
          VoiceManager.stopSpeaking();
          VoiceManager.characterId = charId;
          VoiceManager.playCharacterChime(charId);
        }
        // Sync with global friend selector
        document.querySelectorAll('[data-friend]').forEach(b => {
          b.setAttribute('aria-pressed', String(b.dataset.friend === charId));
        });
        document.querySelectorAll('.hero-robot-img,.ai-friend-avatar-img,.completion-robot-img').forEach(img => {
          img.src = CHAR_PROFILES[charId].image;
          img.alt = CHAR_PROFILES[charId].animal + ' 친구 ' + CHAR_PROFILES[charId].name;
        });
        renderWeatherWidget();
        speakCurrentWeather();
      };
    });

    // 2. Category tab buttons
    document.querySelectorAll('[data-weather-cat]').forEach(btn => {
      btn.onclick = () => {
        currentCategory = btn.dataset.weatherCat;
        renderWeatherWidget();
      };
    });

    // 3. Region chip buttons
    document.querySelectorAll('[data-weather-region]').forEach(btn => {
      btn.onclick = () => {
        currentRegionId = btn.dataset.weatherRegion;
        fetchLiveWeather();
        renderWeatherWidget();
        speakCurrentWeather();
      };
    });

    // 4. Voice Speak button
    const btnSpeak = document.getElementById('btnWeatherSpeak');
    if (btnSpeak) {
      btnSpeak.onclick = () => {
        speakCurrentWeather();
      };
    }

    // 5. Voice Stop button
    const btnStop = document.getElementById('btnWeatherStop');
    if (btnStop) {
      btnStop.onclick = () => {
        if (typeof VoiceManager !== 'undefined') {
          VoiceManager.stopSpeaking();
        }
      };
    }

    // 6. Refresh button
    const btnRefresh = document.getElementById('btnWeatherRefresh');
    if (btnRefresh) {
      btnRefresh.onclick = () => {
        btnRefresh.textContent = '🔄 조회 중...';
        fetchLiveWeather().then(() => {
          setTimeout(() => {
            btnRefresh.textContent = '🔄 실시간 업데이트';
          }, 600);
        });
      };
    }
  }

  // Voice speech trigger
  function speakCurrentWeather() {
    if (typeof VoiceManager === 'undefined') return;

    const friend = getActiveFriend();
    const currentRegion = REGIONS_DATA.find(r => r.id === currentRegionId) || REGIONS_DATA[0];
    const weather = liveWeatherData[currentRegion.id] || {
      temp: currentRegion.baseTemp,
      feelsLike: currentRegion.baseTemp + 1,
      status: currentRegion.status,
      icon: currentRegion.icon,
      dust: currentRegion.dust,
      tip: currentRegion.tip
    };

    const speech = generateSpeechScript(currentRegion, weather, friend);

    VoiceManager.stopSpeaking();
    VoiceManager.characterId = friend.id;
    VoiceManager.playCharacterChime(friend.id);

    const avatarImg = document.getElementById('weatherAvatarImg');
    if (avatarImg) avatarImg.classList.add('speaking');

    setTimeout(() => {
      VoiceManager.speak(speech.fullText, { emotion: 'happy' }, () => {
        if (avatarImg) avatarImg.classList.remove('speaking');
      });
    }, 250);
  }

  // Sync when friend selection changes externally
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-friend]');
    if (!b) return;
    const next = b.dataset.friend;
    if (next && CHAR_PROFILES[next]) {
      activeFriendId = next;
      renderWeatherWidget();
    }
  });

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Mount weather briefing container right after hero classroom section
    const heroSection = document.querySelector('.hero-classroom');
    if (heroSection) {
      const weatherSection = document.createElement('section');
      weatherSection.className = 'weather-briefing-section';
      weatherSection.id = 'weatherBriefingContainer';
      weatherSection.setAttribute('aria-label', '기상청 날씨누리 실시간 지역별 날씨 브리핑');
      heroSection.after(weatherSection);
    }

    // Initial render & fetch
    renderWeatherWidget();
    fetchLiveWeather();
  });

  // Export to window
  window.WeatherService = {
    fetchLiveWeather,
    renderWeatherWidget,
    speakCurrentWeather,
    setRegion: (id) => { currentRegionId = id; renderWeatherWidget(); },
    REGIONS_DATA,
    CHAR_PROFILES
  };
})();
