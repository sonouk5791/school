/* First-entry overlay; existing images and human recordings only, never TTS. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const key='school_character_welcome_v1';
 const friends=[['kongi','콩이','안녕하세요! 저는 콩이에요.'],['tori','토리','반가워요! 저는 토리예요.'],['nabi','나비','오늘도 함께해서 기뻐요.'],['bori','곰이','천천히 즐겁게 시작해볼까요?']];
 let dialog=null,player=null,generation=0,settle=null,seen=false;
 function stop(){generation++;if(player){window.CharacterLipSync?.unbind(player);player.pause();player.removeAttribute('src');player.load();player=null;}if(settle){settle();settle=null;}}
 function syncAudio(){const hasAudio=Object.keys(window.SchoolWelcomeRecordings||{}).length>0;replay.hidden=!hasAudio;if(dialog){dialog.querySelector('#welcomeListen').hidden=!hasAudio;if(!hasAudio){stop();const status=dialog.querySelector('.welcome-status');status.textContent='';status.hidden=true;}}}
 function close(){stop();dialog.close();document.querySelector('#morningStart')?.focus();}
 function show(){
  if(!dialog){dialog=document.createElement('dialog');dialog.id='welcomeGreeting';dialog.setAttribute('aria-labelledby','welcomeGreetingTitle');
   dialog.innerHTML=`<button type="button" class="welcome-close" aria-label="환영 화면 닫고 홈페이지 보기">×</button><h1 id="welcomeGreetingTitle" tabindex="-1">안녕하세요!</h1><p class="welcome-title">디지털 AI학교에 오신 것을 환영합니다.</p><div class="welcome-characters">${friends.map(([id,name,line],i)=>`<figure data-welcome-friend="${id}" style="--welcome-delay:${i*180}ms"><img src="assets/images/friend-${id}.png" alt="${name}"><figcaption>${name}</figcaption><p class="welcome-line">${line}</p></figure>`).join('')}</div><p class="welcome-message">오늘도 저희와 함께 천천히 즐겁게 시작해볼까요?</p><div class="welcome-actions senior-return"><button type="button" class="care-btn" id="welcomeListen" hidden>🔊 인사 다시 듣기</button><button type="button" class="care-btn primary" id="welcomeStart">🌞 오늘 프로그램 시작</button></div><p class="welcome-status" role="status" aria-live="polite" hidden></p>`;
   document.body.append(dialog);dialog.querySelector('.welcome-close').addEventListener('click',close);dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
   dialog.querySelector('#welcomeStart').addEventListener('click',()=>{close();document.querySelector('#morningStart')?.click()});dialog.querySelector('#welcomeListen').addEventListener('click',play);
  }
  syncAudio();if(!dialog.open)dialog.showModal();seen=true;try{sessionStorage.setItem(key,'1')}catch{}dialog.querySelector('h1').focus();
 }
 window.addEventListener('character-audio-start',stop);
 async function play(){
  window.dispatchEvent(new Event('welcome-audio-start'));
  stop();const token=generation,status=dialog.querySelector('.welcome-status'),button=dialog.querySelector('#welcomeListen');button.textContent='🔊 인사 다시 듣기';
  const available=friends.filter(([id])=>typeof window.SchoolWelcomeRecordings?.[id]==='string'&&/^\/?(?:[\w-]+\/)*[\w.-]+\.(mp3|wav)$/i.test(window.SchoolWelcomeRecordings[id]));
  if(!available.length){syncAudio();return;}
  for(const [id,name] of available){
   if(token!==generation)return;
   const audio=new Audio(window.SchoolWelcomeRecordings[id]);player=audio;window.CharacterLipSync?.bind(audio,dialog.querySelector('[data-welcome-friend="'+id+'"] img'),id);audio.volume=.7;status.hidden=false;status.textContent=name+'의 환영 인사를 듣고 있어요.';
   const result=await new Promise(resolve=>{let done=false;const finish=value=>{if(done)return;done=true;settle=null;resolve(value)};settle=()=>finish('cancel');audio.addEventListener('ended',()=>finish('end'),{once:true});audio.addEventListener('error',()=>finish('error'),{once:true});audio.play().catch(()=>finish('error'));});
   if(token!==generation)return;
   if(result!=='end'){stop();await window.refreshWelcomeRecordings();syncAudio();if(!button.hidden){status.hidden=false;status.textContent='인사 다시 듣기를 눌러주세요.';}return;}
  }
  player=null;status.textContent='환영 인사를 모두 들었어요. 다시 듣거나 오늘 프로그램을 시작해보세요.';
 }
 const replay=document.createElement('button');replay.type='button';replay.hidden=true;replay.id='welcomeReplay';replay.className='care-btn';replay.textContent='🔊 인사 다시 듣기';document.querySelector('#morningLauncher').append(replay);replay.addEventListener('click',()=>{show();play()});
 window.addEventListener('welcome-recordings-changed',syncAudio);syncAudio();
 // Give the original homepage time to appear. Never interrupt another screen or modal.
 try{seen=!!sessionStorage.getItem(key)}catch{}
 if(!seen)setTimeout(()=>{if(seen)return;if(document.body.dataset.seniorPage==='home'&&!document.querySelector('dialog[open],#lessonViewport.active'))show()},650);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&player){stop();if(dialog)dialog.querySelector('.welcome-status').textContent='인사 다시 듣기를 눌러 계속 들을 수 있어요.'}});
});
