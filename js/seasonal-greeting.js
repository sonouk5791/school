/**
 * 디지털 AI 학교 - 날짜 기반 계절 인사 자동 제어 모듈
 * (Date-Based Seasonal Greeting Engine)
 */
((window) => {
  'use strict';

  function getSeasonalGreeting(date = new Date()) {
    const month = date.getMonth() + 1; // 1~12
    const day = date.getDate();

    // 1. 설날 시즌 (1월 15일 ~ 2월 15일)
    if ((month === 1 && day >= 15) || (month === 2 && day <= 15)) {
      return {
        season: 'seollal',
        title: '새해 복 많이 받으세요!',
        desc: '새해의 밝은 기운을 담아, 네 친구와 활기찬 하루 보내요.',
        banner: '☀️ 새해에도 어르신의 건강과 행복을 온 마음으로 응원해요.'
      };
    }

    // 2. 어버이날 / 가정의 달 시즌 (5월 1일 ~ 5월 20일)
    if (month === 5 && day <= 20) {
      return {
        season: 'parents',
        title: '감사와 사랑의 5월, 어르신 환영해요!',
        desc: '언제나 든든한 어르신께 감사드리며, 네 친구와 따뜻한 하루 보내요.',
        banner: '💐 늘 감사하고 사랑합니다. 오늘도 즐겁게 함께해요.'
      };
    }

    // 3. 여름 시즌 (6월 ~ 8월)
    if (month >= 6 && month <= 8) {
      return {
        season: 'summer',
        title: '시원하고 건강한 하루 보내요!',
        desc: '여름날의 싱그러움을 느끼며, 네 친구와 천천히 움직여봐요.',
        banner: '🍃 시원한 물 한 잔 드시며, 편안하고 쾌적하게 함께해요.'
      };
    }

    // 4. 추석 시즌 (9월 20일 ~ 10월 5일)
    if ((month === 9 && day >= 20) || (month === 10 && day <= 5)) {
      return {
        season: 'chuseok',
        title: '풍요로운 추석, 반가워요!',
        desc: '한복 입은 네 친구들과 보름달처럼 넉넉한 하루 보내요.',
        banner: '🌕 달처럼 환한 마음으로, 온 가족과 따뜻한 명절 보내세요.'
      };
    }

    // 5. 가을 시즌 (9월 ~ 11월)
    if (month >= 9 && month <= 11) {
      return {
        season: 'autumn',
        title: '맑고 고운 가을날, 어르신 반가워요!',
        desc: '청명한 가을바람과 함께, 네 친구와 따뜻한 배움을 시작해요.',
        banner: '🍁 알록달록 고운 가을, 오늘도 천천히 즐겁게 함께해요.'
      };
    }

    // 6. 겨울 시즌 (12월 ~ 2월)
    if (month === 12 || month <= 2) {
      return {
        season: 'winter',
        title: '포근하고 따뜻한 겨울날 보내요!',
        desc: '추운 날씨에도 건강 잃지 않도록, 네 친구와 몸을 가볍게 움직여요.',
        banner: '❄️ 따뜻하게 입으시고, 오늘도 훈훈한 온기를 나눠요.'
      };
    }

    // 7. 봄 시즌 (3월 ~ 5월)
    return {
      season: 'spring',
      title: '꽃 피는 따스한 봄날, 반가워요!',
      desc: '새싹처럼 파릇한 활력으로, 네 친구와 함께 기분 좋은 하루 보내요.',
      banner: '🌸 봄 햇살처럼 환하고 즐거운 하루를 함께해요.'
    };
  }

  function applySeasonalGreeting() {
    const greeting = getSeasonalGreeting();
    const titleEl = document.getElementById('homeWelcomeTitle');
    if (titleEl && document.documentElement.dataset.homeArt !== 'reference') {
      titleEl.textContent = greeting.title;
      const descEl = titleEl.nextElementSibling;
      if (descEl && descEl.tagName === 'P') {
        descEl.textContent = greeting.desc;
      }
    }

    const bannerEl = document.querySelector('.chuseok-banner p');
    if (bannerEl) {
      bannerEl.textContent = greeting.banner;
    }

    // data-season 동적 갱신
    document.documentElement.dataset.season = greeting.season;
  }

  window.SeasonalGreeting = {
    getSeasonalGreeting,
    applySeasonalGreeting
  };

  document.addEventListener('DOMContentLoaded', applySeasonalGreeting);
})(window);
