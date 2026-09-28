/* User-provided MP4 owns this greeting's audio; no duplicate TTS or simulated mouth. */
document.addEventListener('DOMContentLoaded',()=>{
 const root=document.querySelector('[data-kongi-greeting]');if(!root)return;
 const video=root.querySelector('video'),poster=root.querySelector('.kgv-poster'),play=root.querySelector('.kgv-play'),sound=root.querySelector('.kgv-sound'),touch=root.querySelector('.kgv-touch'),status=root.querySelector('.kgv-status');
 let played=false,revision=0,localMuted=false,announcing=false,loadTimer;
 const storedMute=()=>{try{return localStorage.getItem('digital_school_muted')==='true';}catch{return false;}};
 function syncSound(){video.muted=localMuted||storedMute();sound.textContent=video.muted?'🔇 소리 켜기':'🔊 소리 끄기';sound.setAttribute('aria-pressed',String(!video.muted));}
 function still(message){revision++;clearTimeout(loadTimer);video.pause();video.hidden=true;poster.hidden=false;play.textContent=played?'▶ 다시 인사해요':'▶ 콩이 인사 듣기';touch.setAttribute('aria-label','콩이 인사 영상 재생');if(message)status.textContent=message;}
 function failed(){still('영상을 불러오지 못했어요. 다시 인사해요를 눌러주세요.');poster.src='assets/images/friend-kongi.png';}
 poster.addEventListener('error',()=>{if(!poster.src.endsWith('/friend-kongi.png'))poster.src='assets/images/friend-kongi.png';});
 async function start(){
  if(!video.paused&&!video.ended){still('잠깐 쉬고 있어요. 다시 인사해요를 눌러주세요.');return;}
  window.CharacterVoice?.stop();window.CharacterAudioPlayer?.stop();window.VoiceManager?.stop?.();
  announcing=true;window.dispatchEvent(new Event('welcome-audio-start'));announcing=false;
  const token=++revision;played=true;syncSound();status.textContent='콩이 인사를 준비하고 있어요.';
  if(video.error||video.networkState===HTMLMediaElement.NETWORK_NO_SOURCE)video.load();video.currentTime=0;
  loadTimer=setTimeout(()=>{if(token===revision)failed();},12000);
  try{await video.play();if(token!==revision)return;clearTimeout(loadTimer);video.hidden=false;poster.hidden=true;play.textContent='⏸ 잠깐 멈추기';touch.setAttribute('aria-label','콩이 인사 영상 잠깐 멈추기');status.textContent='콩이가 인사하고 있어요.';}
  catch{if(token===revision)failed();}
 }
 video.controls=false;video.loop=false;video.autoplay=false;
 play.addEventListener('click',start);touch.addEventListener('click',start);
 sound.addEventListener('click',()=>{localMuted=!video.muted;if(!localMuted&&storedMute())document.getElementById('btnTtsToggle')?.click();syncSound();});
 video.addEventListener('ended',()=>still('콩이와 인사를 나눴어요. 오늘도 함께 즐겁게 시작해요.'));
 video.addEventListener('error',failed);
 video.querySelector('source').addEventListener('error',failed);
 window.addEventListener('character-audio-start',()=>still());
 window.addEventListener('welcome-audio-start',()=>{if(!announcing)still();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)still();});
 window.addEventListener('pagehide',()=>still());window.addEventListener('storage',syncSound);
 window.addEventListener('character-voice-state',syncSound);
 document.addEventListener('click',()=>queueMicrotask(syncSound));
 // Closing the existing disclosure or leaving the catalogue must stop its sound.
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&!video.paused)still();});observer.observe(root);
 root.closest('details')?.addEventListener('toggle',event=>{if(!event.currentTarget.open)still();});
 syncSound();
});
