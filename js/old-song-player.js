/* Register only existing, licensed recordings. Empty means no prepared song. */
window.OLD_SONG_AUDIO = window.OLD_SONG_AUDIO || {};
window.OldSongPlayer = (()=>{
 'use strict';
 let host=null,audio=null,request=0,pending=false,failure='';
 const state={isPlaying:false,currentSong:null,currentTime:0,duration:0};
 function paint(message){
  if(!host)return;
  const button=host.querySelector('#btnRetroPlay'),status=host.querySelector('#oldSongStatus');
  if(button){button.textContent=state.isPlaying?'⏸ 잠시 멈춤':'▶ 노래 듣기';button.setAttribute('aria-pressed',String(state.isPlaying));}
  host.querySelector('#retroLpRecord')?.classList.toggle('spinning',state.isPlaying);
  if(status)status.textContent=message??(failure||(state.isPlaying?'🎵 재생 중':'노래가 멈춰 있습니다.'));
 }
 function stop(){request++;pending=false;failure='';if(audio){audio.pause();audio.removeAttribute('src');audio.load();}audio=null;host=null;Object.assign(state,{isPlaying:false,currentSong:null,currentTime:0,duration:0});}
 function mount(){
  const next=document.querySelector('.retro-music-player');if(next===host)return;
  stop();if(!next)return;host=next;
  if(host.dataset.playback==='youtube'){const status=host.querySelector('#oldSongStatus');if(status){status.textContent='';status.hidden=true;}return;}
  const step=window.LessonEngine.currentLesson?.steps[window.LessonEngine.currentStepIndex];
  const key=step?.oldSongKey||'hometown-spring',src=window.OLD_SONG_AUDIO[key];
  audio=document.createElement('audio');audio.preload='none';audio.id='oldSongAudio';audio.muted=false;audio.volume=.7;host.append(audio);
  const current=audio;
  current.addEventListener('playing',()=>{if(current!==audio)return;pending=false;state.isPlaying=!current.paused;paint();});
  const paused=()=>{if(current!==audio)return;state.isPlaying=false;paint();};
  current.addEventListener('pause',paused);current.addEventListener('ended',()=>{if(current!==audio)return;paused();paint('노래가 끝났습니다. 다시 들을 수 있어요.');});
  current.addEventListener('waiting',()=>{if(current!==audio)return;state.isPlaying=false;paint('노래를 불러오는 중입니다.');});
  current.addEventListener('timeupdate',()=>{if(current===audio)state.currentTime=current.currentTime||0;});
  current.addEventListener('loadedmetadata',()=>{if(current===audio)state.duration=Number.isFinite(current.duration)?current.duration:0;});
  current.addEventListener('error',()=>{if(current!==audio||!state.currentSong)return;pending=false;state.isPlaying=false;console.error('Old song audio file not found or unreadable.',current.error);failure=current.error?.code===3?'노래 파일을 재생할 수 없습니다. 담당자에게 알려주세요.':'준비된 노래 파일이 없습니다.';paint(failure);});
  if(typeof src!=='string'||!src.trim()){paint('준비된 노래 파일이 없습니다.');console.error('Old song audio file not found. No recording configured:',key);return;}
  current.src=src;state.currentSong=key;paint('노래 듣기 버튼을 눌러주세요.');
 }
 async function toggle(){
  mount();if(host?.dataset.playback==='youtube'){window.VoiceManager?.stopSpeaking();host.querySelector('.btn-retro-yt')?.click();return;}if(!audio||!state.currentSong||!audio.getAttribute('src')){paint('준비된 노래 파일이 없습니다.');console.error('Old song audio file not found.');return;}
  if(pending||!audio.paused){request++;pending=false;audio.pause();state.isPlaying=false;paint();return;}
  const current=audio,token=++request;pending=true;failure='';if(current.error)current.load();
  current.muted=false;if(!Number.isFinite(current.volume)||current.volume===0)current.volume=.7;
  if(current.ended||(Number.isFinite(current.duration)&&current.currentTime>=current.duration))current.currentTime=0;
  window.VoiceManager?.stopSpeaking();paint('노래를 불러오는 중입니다.');
  try{await current.play();if(current!==audio){current.pause();return;}if(token!==request)return;}
  catch(error){if(token!==request||current!==audio)return;pending=false;state.isPlaying=false;console.error('Audio playback failed:',error);failure=current.error?(current.error.code===3?'노래 파일을 재생할 수 없습니다. 담당자에게 알려주세요.':'준비된 노래 파일이 없습니다.'):error.name==='NotAllowedError'?'브라우저에서 재생을 허용하지 않았습니다. 노래 듣기를 다시 눌러주세요.':error.name==='NotSupportedError'?'준비된 노래 파일이 없습니다.':'노래를 재생하지 못했습니다. 다시 눌러주세요.';paint(failure);}
 }
 document.addEventListener('DOMContentLoaded',()=>{
  const render=LessonEngine.renderCurrentStep.bind(LessonEngine);
  LessonEngine.renderCurrentStep=(...args)=>{stop();const value=render(...args);mount();return value;};
  new MutationObserver(()=>{if(!document.querySelector('#lessonViewport.active'))stop();}).observe(document.querySelector('#lessonViewport'),{attributes:true,attributeFilter:['class']});
  window.addEventListener('pagehide',stop);
 });
 return {mount,toggle,stop,getState:()=>({...state})};
})();
