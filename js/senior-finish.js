/* Final, additive navigation layer. Existing activities and care records stay intact. */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const main = document.querySelector('main.main-wrapper');
  const hero = main.querySelector('.hero-classroom');
  const warmup = main.querySelector('.warmup-intro');
  const friends = main.querySelector('.friend-selection');
  let page = 'home', trail = [], mood = '', activityOrigin = 'home';
  const visited = new Set();
  const button = (label, target, cls = '') => `<button type="button" class="care-btn ${cls}" data-senior-page="${target}">${label}</button>`;
  const navigation = () => `<nav class="senior-return" aria-label="화면 이동">${button('🏠 처음으로', 'home', 'primary')}${button('← 이전 화면', 'back')}</nav>`;
  document.body.classList.add('senior-finish');
  const voiceControls = document.querySelector('.teacher-voice-controls');
  const voiceMore = document.createElement('details'); voiceMore.className='senior-voice-more';
  voiceMore.innerHTML='<summary>음성 안내 더보기</summary><div></div>';
  if (voiceControls) {
    [...voiceControls.children].slice(1).forEach(el=>voiceMore.querySelector('div').append(el));
    voiceControls.append(voiceMore);
  }
  document.querySelector('.hero-main-title').textContent = '안녕하세요!';
  document.querySelector('.hero-sub-text').textContent = '오늘도 함께 즐겁게 시작해볼까요?';
  const oldActions = document.querySelector('.hero-action-buttons');
  oldActions.hidden = true;
  const start = document.createElement('section');
  start.className = 'senior-start';
  start.innerHTML = `<p id="seniorDate"></p><div class="senior-mood"><div><h2>오늘 기분은 어떠세요?</h2><div class="senior-mood-buttons">${['😊 좋아요', '😐 괜찮아요', '😔 조금 힘들어요'].map(t => `<button type="button" class="care-btn" data-start-mood="${t}" aria-pressed="false">${t}</button>`).join('')}</div><p id="seniorMoodReply" role="status">마음에 드는 표정을 눌러주세요.</p></div></div><p id="seniorInvitation">콩이와 몸을 천천히 움직여볼까요?</p><div class="senior-primary">${button('<span>🏃 콩이와 오늘 체조하기</span><small>천천히 따라해요</small>', 'exercise', 'primary')}${button('<span>📖 오늘의 수업</span><small>재미있게 하나씩 배워봐요</small>', 'today')}${button('<span>🐶 AI 친구 만나기</span><small>콩이, 토리, 나비, 곰이를 만나보세요</small>', 'friends')}</div>${button('다른 활동 보기', 'activities')}</section>`;
  hero.after(start);
  const today = document.createElement('section');
  today.className = 'senior-today care-card';
  today.innerHTML = '<h1>오늘의 수업</h1><p>하나씩 천천히 배워봐요.</p><button type="button" class="care-btn primary" data-start-basic>📖 AI 기초수업 시작하기</button>' + button('다른 수업 보기', 'activities');
  const history = document.createElement('section');
  history.className = 'senior-history care-card';
  main.append(today, history);
  const bar = document.createElement('div');
  bar.innerHTML = navigation();
  main.prepend(bar);
  const groups = new Map();
  const classify = () => [...main.children].forEach(el => {
    if (el === bar || el.id === 'careRoot' || groups.has(el)) return;
    groups.set(el, el === hero || el === start || el.id === 'morningLauncher' ? 'home' : el === warmup ? 'exercise' : el === friends ? 'friends' : el === today ? 'today' : el === history ? 'history' : 'activities');
  });
  const updateDate = () => {
    document.querySelector('#seniorDate').textContent = '오늘은 ' + new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul', month:'long', day:'numeric', weekday:'long'}).format(new Date()) + '이에요.';
  };
  updateDate(); setInterval(updateDate, 60000);
  function show(target, push = true) {
    if (target === 'back') target = trail.pop() || 'home', push = false;
    if (push && target !== page) trail.push(page);
    page = target;
    document.body.dataset.seniorPage = page;
    classify();
    groups.forEach((group, el) => { el.classList.toggle('senior-away', group !== page); if (group === page) { el.hidden = false; el.style.removeProperty('display'); } });
    bar.hidden = page === 'home';
    document.querySelectorAll('.nav-link').forEach(a => {
      const active = ({home:'home',lessons:'today','ai-friend':'friends',history:'history'})[a.dataset.target] === page;
      a.classList.toggle('active', active); if (active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    if (page !== 'exercise') document.querySelector('#warmupVideo').pause();
    if (page === 'history') {
      history.replaceChildren();
      const heading = document.createElement('h1'); heading.textContent = '내 활동'; history.append(heading);
      const desc = document.createElement('p'); desc.textContent = '이번 방문에 열어본 활동이에요.'; history.append(desc);
      [...visited].forEach(title => { const p = document.createElement('p'); p.textContent = title; history.append(p); });
      if (!visited.size) { const p = document.createElement('p'); p.textContent = '함께 첫 활동을 시작해볼까요?'; history.append(p); }
    }
    if (page === 'exercise') visited.add('콩이와 20분 체조');
    window.VoiceManager.stopSpeaking();
    window.scrollTo(0,0);
    const heading = page === 'home' ? hero.querySelector('h1') : [...groups].find(([el,g])=>g===page)?.[0].querySelector('h1,h2');
    if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
  }
  function leaveOverlays() {
    for (const room of document.querySelectorAll('dialog[open]')) {
      if (!room.dispatchEvent(new Event('before-room-leave', {cancelable:true}))) return false;
    }
    if (document.querySelector('#lessonViewport.active')) LessonEngine.exitLesson();
    if (document.querySelector('#lessonViewport.active')) return false;
    document.querySelectorAll('dialog[open]').forEach(d=>d.close());
    document.querySelector('#btnCloseTeacherModal')?.click();
    document.querySelector('.care-nav [data-action="nav"][data-value="home"]')?.click();
    document.querySelector('#teacherSubnav').style.display = 'none';
    return true;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-senior-page],.main-nav .nav-link,.brand-logo,#btnHeroStart,#btnHeroMeetAi,#btnHeroHistory,#warmupClass,[data-start-basic],[data-start-mood]');
    if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (b.hasAttribute('data-start-mood')) {
      mood = b.dataset.startMood;
      start.querySelectorAll('[data-start-mood]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
      document.querySelector('#seniorMoodReply').textContent = mood + '. 이야기해주셔서 고마워요.';
      document.querySelector('#seniorInvitation').textContent = '콩이와 몸을 천천히 움직여볼까요?';
      start.querySelector('[data-senior-page="exercise"]').focus(); return;
    }
    if (b.hasAttribute('data-start-basic')) { LessonEngine.startLesson('ai_basic'); return; }
    let target = b.dataset.seniorPage || ({home:'home',lessons:'today','ai-friend':'friends',history:'history'})[b.dataset.target] || ({btnHeroStart:'today',btnHeroMeetAi:'friends',btnHeroHistory:'history',warmupClass:'today'})[b.id] || 'home';
    if (target === 'back' && b.closest('#lessonViewport')) { LessonEngine.exitLesson(); if (!document.querySelector('#lessonViewport.active')) show(activityOrigin, false); return; }
    if (target === 'back' && b.closest('dialog')) { const room=b.closest('dialog'); if(room.dispatchEvent(new Event('before-room-leave',{cancelable:true})))room.close(); return; }
    if (leaveOverlays()) show(target);
  }, true);
  document.querySelector('.brand-logo').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(leaveOverlays())show('home');}});
  document.addEventListener('care:navigate',e=>{
    if(e.detail==='home') { if(document.body.dataset.seniorPage==='staff')show('home',false); return; }
    document.body.dataset.seniorPage='staff';
    groups.forEach((_,el)=>el.classList.add('senior-away'));bar.hidden=false;
  });
  // Staff navigation continues to use the original care workflow and data.
  document.querySelector('#btnTeacherSpace').addEventListener('click',()=>{
    document.body.dataset.seniorPage = 'staff';
    groups.forEach((_,el)=>el.classList.add('senior-away'));
    document.querySelector('#teacherSubnav').style.display='none';
    document.querySelector('#btnCloseTeacherModal')?.click();
    bar.hidden=false;
  });
  const journal = document.querySelector('#btnHeaderJournal');
  document.querySelector('.care-nav').append(journal);
  const toolbar = document.querySelector('.lesson-topbar');
  toolbar.querySelector('.lesson-exit-btn').hidden = true;
  toolbar.insertAdjacentHTML('afterbegin', navigation());
  function addRoomNavigation() {
    document.querySelectorAll('dialog[open]').forEach(d => {
      if (!d.querySelector('.senior-return')) d.insertAdjacentHTML('afterbegin', navigation());
      const role = ({jointExerciseRoom:['kongi-talk','콩이','편하게 앉아서 천천히 따라해요.'],karaokeModalRoom:['bori','곰이','좋아하는 노래를 같이 들어봐요!'],basicStudyRoom:['nabi','나비','우리 같이 기억해볼까요?'],coloringRoom:['nabi','나비','좋아하는 색으로 함께 그려봐요.'],storyLibrary:['tori','토리','편하게 이야기해요.']})[d.id];
      if(role&&!d.querySelector('.senior-room-guide'))d.querySelector('.senior-return').insertAdjacentHTML('afterend',`<p class="senior-room-guide"><img src="assets/images/friend-${role[0]}.png" alt="${role[1]}"><span>${role[1]} · ${role[2]}</span></p>`);
    });
  }
  new MutationObserver(addRoomNavigation).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});
  const originalStart = LessonEngine.startLesson.bind(LessonEngine);
  LessonEngine.startLesson = function(id) {
    activityOrigin = page;
    const lesson = window.LESSON_CATALOG.find(l=>l.id===id);
    if (lesson) visited.add(lesson.title);
    const role = /music|karaoke/.test(id) ? 'bori' : /memory|picture|word|number|sorting|clock|larger/.test(id) ? 'nabi' : /greeting|photo/.test(id) ? 'tori' : 'kongi';
    window.selectSchoolCompanion?.(role);
    return originalStart(id);
  };
  warmup.querySelector('h2').textContent = '콩이와 천천히 20분 체조해요';
  warmup.querySelector('.warmup-copy > p:not(.warmup-eyebrow)').textContent = '편하게 앉아서 시작해요. 무리하지 않아도 괜찮아요. 불편한 동작은 쉬어가셔도 됩니다.';
  const remaining = document.createElement('p'); remaining.id='warmupRemaining'; remaining.textContent='남은 시간 20분 00초';
  warmup.querySelector('.warmup-actions').before(remaining);
  const video = document.querySelector('#warmupVideo');
  video.addEventListener('timeupdate',()=>{const seconds=Math.max(0,Math.ceil((Number.isFinite(video.duration)?video.duration:1200)-video.currentTime));remaining.textContent=`남은 시간 ${Math.floor(seconds/60)}분 ${String(seconds%60).padStart(2,'0')}초`;});
  show('home',false);
});
