/* Homepage presentation only. Lesson engines, records, automation and room URLs are unchanged. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const hero=document.querySelector('.character-home-hero'),grid=hero?.querySelector('.home-friends-grid');if(!hero||!grid)return;
 const names={kongi:'콩이',tori:'토리',nabi:'나비',bori:'보리'},roles={kongi:'운동방',tori:'놀이방',nabi:'학습방',bori:'취미방'};
 const lines={kongi:'안녕하세요! 저는 콩이예요. 저와 함께 즐겁게 몸을 움직여볼까요?',tori:'안녕하세요! 저는 토리예요. 재미있는 놀이를 같이 해봐요!',nabi:'안녕하세요! 저는 나비예요. 저와 함께 천천히 생각해봐요.',bori:'안녕하세요! 저는 보리예요. 노래도 듣고 추억 이야기도 함께 나눠봐요.'};
 const heading=hero.querySelector('h1'),subtitle=hero.querySelector('.home-welcome p');heading.tabIndex=-1;
 const catalogue=document.getElementById('homeCatalogTools');
 for(const selector of ['.home-one-recommendation','#homeQuickLinks','.home-extra-programs']){const node=hero.querySelector(selector);if(node&&catalogue)catalogue.append(node);}
 const intro=document.createElement('section');intro.id='homeGreeting';intro.className='hw-panel';intro.setAttribute('aria-label','네 친구의 환영 인사');
 intro.innerHTML='<div class="hw-media"><img src="assets/images/home-greeting-poster.png" alt="콩이, 토리, 나비, 보리가 인사하고 있어요"><video id="homeGreetingVideo" autoplay muted playsinline preload="auto" poster="assets/images/home-greeting-poster.png" aria-label="네 친구의 인사 영상" hidden><source src="assets/videos/home-greeting.mp4" type="video/mp4"></video></div><div class="hw-actions"><button type="button" class="hw-primary" id="homeGreetingPlay" hidden>▶ 인사 영상 보기</button><button type="button" id="homeGreetingSound" aria-pressed="false">🔊 인사 소리 듣기</button></div><p class="hw-status" id="homeGreetingStatus" role="status" aria-live="polite">재생 버튼을 누르면 네 친구가 인사해요.</p><div class="hw-actions"><button type="button" id="skipHomeGreeting">바로 친구방 보기</button></div>';
 const rooms=document.createElement('section');rooms.id='friendRooms';rooms.className='hw-panel';rooms.hidden=true;rooms.setAttribute('aria-label','친구방 선택');rooms.append(grid);
 const tools=document.createElement('div');tools.className='hw-room-tools';tools.innerHTML='<button type="button" id="replayHomeGreeting">인사 다시 보기</button><button type="button" data-senior-page="activities">전체 활동</button><details><summary>오늘의 수업</summary><div class="hw-course-links"><a href="daycare-class.html?session=am">오전 수업 · 60분</a><a href="daycare-class.html?session=pm">오후 수업 · 60분</a><a href="daily-course.html">간편 수업 · 20분</a><a href="character-house.html">친구 집 꾸미기</a></div></details>';rooms.append(tools);if(hasVisited()||history.state?.schoolHomeFlow==='rooms')intro.querySelector('video').autoplay=false;hero.append(intro,rooms);
 const video=intro.querySelector('video'),poster=intro.querySelector('img'),play=intro.querySelector('#homeGreetingPlay'),status=intro.querySelector('[role=status]'),sound=intro.querySelector('#homeGreetingSound');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let phase='greeting',transition=0,playRevision=0,loadTimer,muted=true,ownAudio=false,sequence=null;
 const cards=Object.keys(names).map(id=>{const card=grid.querySelector('.home-friend-'+id);card.dataset.room=id;card.setAttribute('aria-label',`${names[id]} ${roles[id]} 들어가기`);card.querySelector(':scope > span')?.remove();
  const role=document.createElement('span');role.className='hw-room-name';role.textContent=roles[id];const line=document.createElement('p');line.className='hw-intro';line.textContent=lines[id];const label=document.createElement('span');label.className='hw-speaking-label';label.setAttribute('aria-hidden','true');const enter=document.createElement('span');enter.className='hw-enter';enter.textContent=`${names[id]} ${roles[id]} 들어가기`;card.append(role,line,label,enter);
  // Reuse the original sheet and existing hand coordinates; never move the full PNG.
  const svg=card.querySelector('svg'),d=window.CharacterRigData?.[id],original=svg?.querySelector('image');
  if(original&&d){const ns='http://www.w3.org/2000/svg',defs=svg.querySelector('defs'),mask=document.createElementNS(ns,'mask'),clip=document.createElementNS(ns,'clipPath');mask.id='home-hand-mask-'+id;mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('x','0');mask.setAttribute('y','0');mask.setAttribute('width','1376');mask.setAttribute('height','768');mask.innerHTML=`<rect width="1376" height="768" fill="white"/><path d="${d.hand}" fill="black"/>`;clip.id='home-hand-clip-'+id;const path=document.createElementNS(ns,'path');path.setAttribute('d',d.hand);clip.append(path);defs.append(mask,clip);const hand=document.createElementNS(ns,'g'),crop=document.createElementNS(ns,'g');hand.dataset.homeWave=id;hand.style.transformOrigin=d.wrist[0]+'px '+d.wrist[1]+'px';crop.setAttribute('clip-path',`url(#${clip.id})`);crop.append(original.cloneNode(true));hand.append(crop);original.setAttribute('mask',`url(#${mask.id})`);svg.append(hand);}
  card.addEventListener('click',()=>{remember('rooms');stopIntroductions();stopVideo();});return card;});
 function remember(value){if(value==='rooms'){try{sessionStorage.setItem('school_home_intro_played','true');}catch{}}try{history.replaceState({...history.state,schoolHomeFlow:value},'');}catch{}}
 function hasVisited(){try{return sessionStorage.getItem('school_home_intro_played')==='true';}catch{return false;}}
 function globalMuted(){try{return localStorage.getItem('digital_school_muted')==='true';}catch{return false;}}
 function syncSound(){video.muted=muted||globalMuted();sound.textContent=video.muted?'🔊 인사 소리 듣기':'🔇 소리 끄기';sound.setAttribute('aria-pressed',String(!video.muted));}
 function stopVideo(){playRevision++;clearTimeout(loadTimer);const wasPlaying=!video.paused;video.pause();if(wasPlaying&&phase==='greeting'&&!video.ended){play.hidden=false;play.textContent='▶ 인사 영상 보기';status.textContent='잠깐 쉬고 있어요. 준비되면 다시 시작해요.';}}
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
  if(!signal.aborted)subtitle.textContent='마음에 드는 친구의 방을 눌러주세요.';
 }
 async function fade(node,from,to){if(reduced.matches)return;try{await node.animate([{opacity:from},{opacity:to}],{duration:400,easing:'ease-in-out'}).finished;}catch{}}
 async function showRooms(animate=true,announce=true){const token=++transition;phase='transitioning';hero.dataset.homePhase=phase;stopVideo();stopIntroductions();if(animate&&!intro.hidden)await fade(intro,1,0);if(token!==transition)return;intro.hidden=true;rooms.hidden=false;phase='rooms';hero.dataset.homePhase=phase;heading.textContent='오늘은 어떤 친구와 함께할까요?';subtitle.textContent='친구들이 자기 방을 소개해요. 언제든 바로 들어가도 좋아요.';remember('rooms');heading.focus({preventScroll:true});if(animate)await fade(rooms,0,1);if(token===transition&&announce&&!document.hidden)introduce();}

 function showGreeting(){++transition;stopIntroductions();stopVideo();phase='greeting';hero.dataset.homePhase=phase;rooms.hidden=true;intro.hidden=false;video.hidden=false;poster.hidden=true;video.currentTime=0;muted=true;syncSound();heading.textContent='안녕하세요. 오늘도 반가워요!';subtitle.textContent='네 친구의 인사를 만나보세요.';play.hidden=true;play.textContent='▶ 인사 영상 보기';remember('greeting');playVideo();}
 function failure(blocked=false){if(phase!=='greeting')return;stopVideo();video.hidden=true;poster.hidden=false;status.textContent=blocked?'재생 버튼을 누르면 인사를 볼 수 있어요.':'인사 영상을 불러오지 못했어요.';play.hidden=false;play.textContent='▶ 인사 영상 보기';}
 async function playVideo(){if(phase!=='greeting')return;stopIntroductions();window.VoiceManager?.stopSpeaking?.();window.CharacterAudioPlayer?.stop();ownAudio=true;window.dispatchEvent(new Event('welcome-audio-start'));ownAudio=false;clearTimeout(loadTimer);const token=++playRevision;syncSound();if(video.error||video.networkState===3)video.load();video.currentTime=0;video.hidden=false;poster.hidden=true;play.hidden=true;status.textContent='인사를 준비하고 있어요.';loadTimer=setTimeout(()=>{if(token===playRevision)failure();},12000);
  try{await video.play();if(token!==playRevision)return;clearTimeout(loadTimer);status.textContent=video.muted?'네 친구가 인사하고 있어요. 소리를 켜면 처음부터 들을 수 있어요.':'네 친구가 인사하고 있어요.';}catch(error){if(token===playRevision)failure(error.name==='NotAllowedError');}}
 video.loop=false;video.controls=false;video.autoplay=!hasVisited()&&history.state?.schoolHomeFlow!=='rooms';video.defaultMuted=true;video.muted=true;play.onclick=()=>playVideo();
 video.addEventListener('ended',()=>{if(phase==='greeting')showRooms();});video.addEventListener('error',()=>failure());video.querySelector('source').addEventListener('error',()=>failure());
 intro.querySelector('#skipHomeGreeting').onclick=()=>showRooms();tools.querySelector('#replayHomeGreeting').onclick=()=>{showGreeting();sound.focus();};sound.onclick=()=>{if(video.muted){muted=false;if(globalMuted())document.getElementById('btnTtsToggle')?.click();syncSound();playVideo();}else{muted=true;syncSound();}};
 window.addEventListener('storage',syncSound);document.addEventListener('click',()=>queueMicrotask(syncSound));
 window.addEventListener('welcome-audio-start',()=>{if(!ownAudio){stopVideo();stopIntroductions();}});
 window.addEventListener('character-audio-start',stopVideo);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopVideo();stopIntroductions();if(phase==='greeting')play.textContent='▶ 처음부터 다시 보기';}});
 window.addEventListener('pagehide',()=>{stopVideo();stopIntroductions();});
 window.addEventListener('click',e=>{if(e.target.closest?.('#btnTeacherSpace,button[data-senior-page],.brand-logo')){stopVideo();stopIntroductions();}},true);
 // The original single-page navigation owns teacher/catalog screens.
 new MutationObserver(()=>{if(hero.classList.contains('senior-away')){stopVideo();stopIntroductions();}}).observe(hero,{attributes:true,attributeFilter:['class']});
 window.addEventListener('pageshow',e=>{if(e.persisted&&history.state?.schoolHomeFlow==='rooms')showRooms(false,false);});
 syncSound();if(hasVisited()||history.state?.schoolHomeFlow==='rooms')showRooms(false,false);else showGreeting();
});
