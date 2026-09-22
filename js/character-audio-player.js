/* Human recordings only. One shared audio element; playback requires a user gesture. */
window.CharacterAudioPlayer=(()=>{
 'use strict';
 const names={kongi:'콩이',tori:'토리',nabi:'나비',bori:'곰이'},audio=new Audio();audio.preload='none';audio.volume=.7;
 let files={},active=null,sequence=0,pending=null,speaking=false;
 const groups=new Set(),originalAttributes=new WeakMap();
 const visible=el=>el?.isConnected&&el.getClientRects().length&&!el.closest('dialog:not([open]),[hidden]');
 function paint(){for(const group of groups){if(!group.el.isConnected){groups.delete(group);continue;}const available=!!files[group.id]?.[group.situation];if(group.el.hidden===available)group.el.hidden=!available;const playing=active===group&&speaking&&!audio.paused&&!audio.ended;group.image?.classList.toggle('character-audio-speaking',playing);group.buttons.forEach((b,i)=>{b.disabled=!available||(i===1&&(active!==group||audio.paused));});if(group.image&&!group.image.closest('button')){if(available){if(!originalAttributes.has(group.image))originalAttributes.set(group.image,['tabindex','role','aria-label'].map(key=>[key,group.image.getAttribute(key)]));group.image.tabIndex=0;group.image.setAttribute('role','button');group.image.setAttribute('aria-label',names[group.id]+' 목소리 듣기');}else if(originalAttributes.has(group.image)){for(const [key,value] of originalAttributes.get(group.image)){if(value===null)group.image.removeAttribute(key);else group.image.setAttribute(key,value);}originalAttributes.delete(group.image);}}}}
 function stop(){window.CharacterLipSync?.unbind(audio);speaking=false;sequence++;audio.pause();audio.removeAttribute('src');audio.load();active=null;paint();}
 async function play(group,restart=false){const src=files[group?.id]?.[group?.situation];if(!src||!visible(group.el))return;
  if(active!==group||restart||audio.ended){stop();active=group;audio.src=src;}const token=++sequence;
  window.dispatchEvent(new Event('character-audio-start'));window.VoiceManager?.stopSpeaking();audio.muted=false;audio.volume=.7;
  window.CharacterLipSync?.bind(audio,group.image,group.id,src==='/assets/audio/'+group.id+'-greeting-ko.wav'?(window.CharacterSpeechCues?.[group.id]||[]):[]);
  try{await audio.play();if(token===sequence)paint();}catch{if(token===sequence){audio.pause();paint();await refresh();}}
 }
 function attach(anchor,id,situation,image,inside=false){if(!names[id])return;let group=[...groups].find(g=>g.anchor===anchor&&g.el.isConnected);if(group){if(group.id!==id||group.situation!==situation||group.image!==image){if(active===group)stop();group.id=id;group.situation=situation;group.image=image;}return group;}
  const el=document.createElement('div');el.className='character-audio-controls';el.hidden=true;el.setAttribute('role','group');el.setAttribute('aria-label',names[id]+' 음성');
  const buttons=['🔊 목소리 듣기','⏸ 잠시 멈춤','🔊 다시 듣기'].map((text,index)=>{const existing=index===0&&anchor.matches('.hero-robot-wrapper')?anchor.querySelector('.character-greet'):null;const b=existing||document.createElement('button');b.type='button';if(!existing){b.className='care-btn';b.textContent=text;}b.disabled=true;if(existing)b.onclick=null;b.addEventListener('click',()=>index===1?(audio.pause(),paint()):play(group,index===2));if(!existing)el.append(b);return b;});
  group={el,anchor,id,situation,image,buttons};groups.add(group);if(inside)anchor.append(el);else anchor.after(el);return group;
 }
 function scan(){if(active&&!visible(active.image))stop();
  document.querySelectorAll('[data-welcome-friend]').forEach(el=>attach(el,el.dataset.welcomeFriend,'welcome',el.querySelector('img'),true));
  const morning=document.querySelector('#morningProgram .morning-character');if(morning){const id=window.CharacterLipSync.identity(morning),step=Number(document.querySelector('.morning-progress')?.textContent.trim()[0]);attach(morning,id,step===6?'goodjob':step<=2?'welcome':'activity',morning);}
  document.querySelectorAll('.cr-scene[data-room-theme]').forEach(el=>attach(el,el.dataset.roomTheme,'welcome',el.querySelector('.cw-character')||el.querySelector('.cr-character')));
  const grid=document.querySelector('.friend-grid'),selected=grid?.querySelector('[data-friend][aria-pressed="true"]');if(selected)attach(grid,selected.dataset.friend,'welcome',selected.querySelector('img'));
  const hero=document.querySelector('.hero-robot-wrapper'),heroImage=hero?.querySelector('img');if(heroImage&&!heroImage.closest('.animated-character'))attach(hero,window.CharacterLipSync.identity(heroImage),'welcome',heroImage,true);
  paint();
 }
 async function refresh(){if(pending)return pending;pending=(async()=>{try{const response=await fetch('/character-recordings.json',{cache:'no-store'});const data=response.ok?await response.json():{},safe={};for(const id of Object.keys(names)){safe[id]={welcome:'/assets/audio/'+id+'-greeting-ko.wav'};for(const situation of ['welcome','activity','goodjob']){const url=data?.[id]?.[situation];if(typeof url==='string'&&new RegExp('^/public/audio/characters/'+id+'/'+situation+'\\.(mp3|wav)$').test(url))safe[id][situation]=url;}}files=safe;if(active&&files[active.id]?.[active.situation]!==audio.getAttribute('src'))stop();}catch{files={};stop();}finally{pending=null;scan();}})();return pending;}
 for(const event of ['playing','pause','ended','waiting'])audio.addEventListener(event,()=>{speaking=event==='playing';paint();});
 audio.addEventListener('error',()=>{audio.pause();paint();});
 document.addEventListener('DOMContentLoaded',()=>{scan();refresh();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open','hidden','aria-pressed']});});
 document.addEventListener('click',event=>{const target=event.target.closest('.cw-character')||event.target.closest('img');if(!target||target.closest('[data-friend]'))return;const group=[...groups].find(g=>g.image===target);if(group)play(group);});
 document.addEventListener('keydown',event=>{if(event.key!=='Enter'&&event.key!==' ')return;const group=[...groups].find(g=>g.image===event.target);if(group){event.preventDefault();play(group);}});
 document.addEventListener('close',()=>{if(active&&!visible(active.image))stop();},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);window.addEventListener('welcome-audio-start',stop);window.addEventListener('focus',refresh);setInterval(()=>{if(!document.hidden)refresh();},30000);
 return {refresh,stop,pause:()=>{audio.pause();paint();},select(id,hero=false){scan();const group=[...groups].find(g=>g.anchor.matches(hero?'.hero-robot-wrapper':'.friend-grid')&&g.id===id);if(group)play(group);},getState:()=>({character:active?.id||null,situation:active?.situation||null,isPlaying:speaking&&!audio.paused&&!audio.ended,currentTime:audio.currentTime,volume:audio.volume})};
})();
