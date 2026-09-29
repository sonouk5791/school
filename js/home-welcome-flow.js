/* Homepage presentation only. Lesson engines, records, automation and room URLs are unchanged. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const hero=document.querySelector('.character-home-hero'),grid=hero?.querySelector('.home-friends-grid');if(!hero||!grid)return;
 const config=window.SchoolServiceConfig;
 const names=Object.fromEntries(Object.entries(config).map(([id,c])=>[id,c.name])),roles=Object.fromEntries(Object.entries(config).map(([id,c])=>[id,c.role]));
 const lines={kongi:'저랑 같이 몸을 움직여볼까요?',tori:'오늘은 어떤 놀이를 해볼까요?',nabi:'천천히 함께 생각해봐요.',bori:'노래도 듣고 추억 이야기도 해봐요.'};
 const descriptions={kongi:'건강체조와 쉬운 운동을 함께해요!',tori:'신나는 놀이와 재미있는 활동을 해요!',nabi:'차분한 생각과 배움을 함께해요!',bori:'옛 노래와 취미 활동을 즐겨요!'};
 const heading=hero.querySelector('h1'),subtitle=hero.querySelector('.home-welcome p');heading.tabIndex=-1;
 const catalogue=document.getElementById('homeCatalogTools');
 for(const selector of ['.home-one-recommendation','#homeQuickLinks','.home-extra-programs']){const node=hero.querySelector(selector);if(node&&catalogue)catalogue.append(node);}
 const intro=document.createElement('section');intro.id='homeGreeting';intro.className='hw-panel';intro.setAttribute('aria-label','네 친구의 환영 인사');
 intro.innerHTML='<div class="hw-media"><img src="assets/images/home-greeting-poster.png" alt="콩이, 토리, 나비, 보리가 인사하고 있어요"><video id="homeGreetingVideo" autoplay playsinline preload="auto" poster="assets/images/home-greeting-poster.png" aria-label="네 친구의 인사 영상" hidden><source src="assets/videos/home-greeting.mp4" type="video/mp4"></video></div><p class="hw-status" id="homeGreetingStatus" role="status" aria-live="polite"></p><div class="hw-actions"><button type="button" class="hw-primary" id="skipHomeGreeting">🏡 라일락 마을로 산책 가기</button></div><details class="hw-media-controls"><summary>영상 조절</summary><div class="hw-actions"><button type="button" id="homeGreetingPause">영상 잠시 멈추기</button><button type="button" id="homeGreetingAudioToggle" aria-pressed="false">영상 소리 켜기</button></div></details>';
 const rooms=document.createElement('section');rooms.id='friendRooms';rooms.className='hw-panel';rooms.hidden=true;rooms.setAttribute('aria-label','라일락 마을 산책 지도');grid.classList.add('friend-village');
 const recIds=['kongi','tori','nabi','bori'],todayRecId=recIds[new Date().getDay()%recIds.length];
 const recBanner=document.createElement('div');recBanner.className='hw-daily-rec-banner';
 recBanner.setAttribute('role','status');
 recBanner.innerHTML=`<span class="hw-daily-rec-badge">🌸 오늘의 산책 추천</span> <strong class="hw-daily-rec-name">${names[todayRecId]}</strong> <span class="hw-daily-rec-line">"${lines[todayRecId]}"</span> <span class="hw-daily-rec-note">어떤 친구든 자유롭게 놀러가 보세요!</span>`;
 rooms.append(recBanner);
 rooms.append(grid);
 const landscape=document.createElement('div');landscape.className='village-landscape';landscape.setAttribute('aria-hidden','true');
 grid.prepend(landscape);
 const getTodayCompleted=()=>{try{const d=new Date().toISOString().slice(0,10);const map=JSON.parse(localStorage.getItem('school_today_completed_chars')||'{}');return map[d]||[];}catch{return [];}};
 const completedList=getTodayCompleted();
 const decorIcons={kongi:'⚽',tori:'🧩',nabi:'📚',bori:'🎵'};
 const board=document.createElement('div');board.className='hw-today-board';board.setAttribute('aria-label','오늘 만난 친구 활동판');
 board.innerHTML=`<div class="hw-today-board-title">📋 오늘 산책에서 만난 친구</div><div class="hw-today-board-list">${Object.keys(names).map(cid=>{const isDone=completedList.includes(cid);return `<span class="hw-today-chip ${isDone?'is-done':''}">${names[cid]} ${isDone?`✓ ${decorIcons[cid]}`:'⏳'}</span>`;}).join('')}</div>`;
 rooms.append(board);
 const tools=document.createElement('div');tools.className='hw-room-tools';
 tools.innerHTML='<div class="village-bottom-welcome-banner"><span class="welcome-house-icon">🏡</span> <strong>오늘도 반가워요!</strong> <span>즐거운 마을 생활을 시작해요 <span class="heart-pink">♡</span></span></div><div class="hw-room-tools-links"><a href="our-home.html" class="home-living-link">🏡 우리 집으로 가기</a><a href="our-home.html#garden" class="home-living-link">🌱 내 텃밭 가꾸기</a><button type="button" id="replayHomeGreeting">🎬 인사 다시 보기</button></div>';
 rooms.append(tools);if(hasVisited()||history.state?.schoolHomeFlow==='rooms')intro.querySelector('video').autoplay=false;hero.append(intro,rooms);
 const video=intro.querySelector('video'),poster=intro.querySelector('img'),status=intro.querySelector('[role=status]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let phase='greeting',transition=0,playRevision=0,loadTimer,muted=true,ownAudio=false,sequence=null,userPaused=false;
 const cards=Object.keys(names).map(id=>{const card=grid.querySelector('.home-friend-'+id);card.dataset.room=id;card.setAttribute('aria-label',`${names[id]}집 ${roles[id]} 들어가기`);card.replaceChildren();
  const enterBtn=document.createElement('span');enterBtn.className='hw-enter btn-'+id;enterBtn.setAttribute('title',`${names[id]}집 들어가기`);
  card.appendChild(enterBtn);
  card.addEventListener('click',()=>{remember('rooms');stopIntroductions();stopVideo();});return card;});
 window.VillageLandscape?.mount(grid);
 window.VillageRPG?.init(grid);
 function remember(value){if(value==='rooms'){try{sessionStorage.setItem('school_home_intro_played','true');}catch{}}try{history.replaceState({...history.state,schoolHomeFlow:value},'');}catch{}}
 function hasVisited(){try{return sessionStorage.getItem('school_home_intro_played')==='true';}catch{return false;}}
 function globalMuted(){try{return localStorage.getItem('digital_school_muted')==='true';}catch{return false;}}
 function syncSound(){video.muted=muted||globalMuted();syncControls();}
 function syncControls(){const pause=intro.querySelector('#homeGreetingPause'),audio=intro.querySelector('#homeGreetingAudioToggle');pause.disabled=audio.disabled=video.hidden;pause.textContent=video.paused?'영상 이어 보기':'영상 잠시 멈추기';audio.textContent=video.muted?'영상 소리 켜기':'영상 소리 끄기';audio.setAttribute('aria-pressed',String(!video.muted));}
 function stopVideo(){playRevision++;clearTimeout(loadTimer);video.pause();}
 function stopIntroductions(){sequence?.abort();sequence=null;window.CharacterVoice?.stop();cards.forEach(c=>{c.classList.remove('is-introducing');c.querySelector('.hw-speaking-label').textContent='';});}
 function wait(ms,signal){return new Promise(resolve=>{if(signal.aborted)return resolve();const finish=()=>{clearTimeout(timer);signal.removeEventListener('abort',finish);resolve();};const timer=setTimeout(finish,ms);signal.addEventListener('abort',finish,{once:true});});}
 async function introduce(){stopIntroductions();const controller=new AbortController();sequence=controller;const signal=controller.signal;
  for(const card of cards){if(signal.aborted||phase!=='rooms'||document.hidden)return;const id=card.dataset.room;card.classList.add('is-introducing');card.querySelector('.hw-speaking-label').textContent='지금 소개하고 있어요';const start=performance.now();
   if(!muted&&!globalMuted()&&window.speakAsCharacter&&window.CharacterVoice?.getState().configured){
    const speech=Promise.resolve().then(()=>{if(signal.aborted)return;return window.speakAsCharacter(id,lines[id]);}).catch(()=>null);
    // A stalled provider must not trap the UI. Cancel the prior voice before advancing.
    await Promise.race([speech,wait(12000,signal)]);if(signal.aborted)return;window.CharacterVoice?.stop();
   }
   if(signal.aborted)return;await wait(Math.max(0,3800-(performance.now()-start)),signal);if(signal.aborted)return;
   card.classList.remove('is-introducing');card.querySelector('.hw-speaking-label').textContent='';
  }
  if(!signal.aborted)subtitle.textContent='가고 싶은 친구 집을 눌러보세요.';
 }
 async function fade(node,from,to){if(reduced.matches)return;try{await node.animate([{opacity:from},{opacity:to}],{duration:400,easing:'ease-in-out'}).finished;}catch{}}
 async function showRooms(animate=true,announce=true){if(phase==='transitioning'||phase==='rooms')return;const token=++transition;phase='transitioning';hero.dataset.homePhase=phase;remember('rooms');stopVideo();stopIntroductions();if(animate&&!intro.hidden)await fade(intro,1,0);if(token!==transition)return;intro.hidden=true;rooms.hidden=false;phase='rooms';hero.dataset.homePhase=phase;heading.textContent='오늘은 어떤 친구와 함께할까요?';subtitle.textContent='가고 싶은 친구 집을 눌러보세요.';remember('rooms');heading.focus({preventScroll:true});if(animate)await fade(rooms,0,1);if(token===transition&&announce&&!document.hidden)introduce();}

 function showGreeting(){userPaused=false;++transition;stopIntroductions();stopVideo();phase='greeting';hero.dataset.homePhase=phase;rooms.hidden=true;intro.hidden=false;video.currentTime=0;heading.textContent='안녕하세요. 오늘도 반가워요!';subtitle.textContent='콩이, 토리, 나비, 보리가 기다리고 있어요.';remember('greeting');playVideo();}
 function failure(blocked=false){if(phase!=='greeting')return;stopVideo();video.hidden=true;poster.hidden=false;syncControls();status.textContent=blocked?'친구들이 마을에서 기다리고 있어요.':'인사 영상을 불러오지 못했어요.';}
 async function playVideo(){
  if(phase!=='greeting'||hero.classList.contains('senior-away'))return;
  stopIntroductions();window.VoiceManager?.stopSpeaking?.();window.CharacterAudioPlayer?.stop();
  ownAudio=true;window.dispatchEvent(new Event('welcome-audio-start'));ownAudio=false;
  clearTimeout(loadTimer);const token=++playRevision;
  const current=()=>token===playRevision&&phase==='greeting'&&!document.hidden&&!hero.classList.contains('senior-away');
  // Honor an explicit saved mute choice; otherwise try the MP4's own audio first.
  muted=globalMuted();video.defaultMuted=muted;syncSound();
  if(video.error||video.networkState===3)video.load();
  video.hidden=false;poster.hidden=true;status.textContent='';
  loadTimer=setTimeout(()=>{if(current())failure();},12000);
  try{
   try{await video.play();}
   catch(error){
    if(!current())return;
    muted=true;syncSound();await video.play();
   }
   if(!current()){if(phase!=='greeting'||document.hidden)video.pause();return;}
   clearTimeout(loadTimer);
  }catch(error){if(current())failure(error.name==='NotAllowedError');}
 }
 video.loop=false;video.controls=false;video.autoplay=!hasVisited()&&history.state?.schoolHomeFlow!=='rooms';
 video.addEventListener('play',syncControls);video.addEventListener('pause',syncControls);video.addEventListener('volumechange',syncControls);
 intro.querySelector('#homeGreetingPause').onclick=()=>{if(video.paused){userPaused=false;playVideo();}else{userPaused=true;stopVideo();}syncControls();};
 intro.querySelector('#homeGreetingAudioToggle').onclick=()=>{muted=!video.muted;if(!muted&&globalMuted())document.getElementById('btnTtsToggle')?.click();syncSound();};
 video.addEventListener('ended',()=>{if(phase==='greeting')showRooms();});
 video.addEventListener('error',()=>failure());video.querySelector('source').addEventListener('error',()=>failure());
 intro.querySelector('#skipHomeGreeting').onclick=()=>showRooms();
 tools.querySelector('#replayHomeGreeting').onclick=()=>{showGreeting();intro.querySelector('#skipHomeGreeting').focus({preventScroll:true});};
 window.addEventListener('storage',syncSound);
 document.addEventListener('click',e=>{if(e.target.closest?.('#btnTtsToggle'))queueMicrotask(()=>{muted=globalMuted();syncSound();});});
 window.addEventListener('welcome-audio-start',()=>{if(!ownAudio){stopVideo();stopIntroductions();}});
 window.addEventListener('character-audio-start',stopVideo);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopVideo();stopIntroductions();}else if(phase==='greeting'&&!userPaused&&!hero.classList.contains('senior-away'))playVideo();});
 window.addEventListener('pagehide',()=>{stopVideo();stopIntroductions();});
 window.addEventListener('click',e=>{if(e.target.closest?.('#btnTeacherSpace,button[data-senior-page],.brand-logo')){stopVideo();stopIntroductions();}},true);
 // The original single-page navigation owns teacher/catalog screens.
 new MutationObserver(()=>{if(hero.classList.contains('senior-away')){stopVideo();stopIntroductions();}}).observe(hero,{attributes:true,attributeFilter:['class']});
 window.addEventListener('pageshow',e=>{if(e.persisted&&history.state?.schoolHomeFlow==='rooms')showRooms(false,false);});
 syncSound();if(hasVisited()||history.state?.schoolHomeFlow==='rooms')showRooms(false,false);else showGreeting();
});
