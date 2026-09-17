/* Six short morning screens; reuse the existing video and memory lesson. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const launcher=document.createElement('section');launcher.id='morningLauncher';
 launcher.innerHTML='<button type="button" id="morningStart"><strong>🌞 오늘 프로그램 시작</strong><span>콩이와 함께 천천히 시작해볼까요?</span></button>';
 document.querySelector('.hero-classroom').before(launcher);
 const dialog=document.createElement('dialog');dialog.id='morningProgram';dialog.setAttribute('aria-labelledby','morningTitle');document.body.append(dialog);
 const video=document.querySelector('#warmupVideo'),anchor=document.createComment('existing warmup video');video.before(anchor);
 const viewport=document.querySelector('#lessonViewport');let step=0,mood='',running=false,inMemory=false,returnStep=5;
 const names=['아침 인사','오늘 날짜','오늘 기분','체조','기억 활동','마무리'];
 const btn=(label,action,cls='')=>`<button type="button" class="care-btn ${cls}" data-morning="${action}">${label}</button>`;
 const stop=()=>window.VoiceManager?.stopSpeaking();
 function restoreVideo(){video.pause();if(video.parentElement===dialog.querySelector('#morningVideo'))anchor.after(video);}
 function leave(target='home'){running=false;inMemory=false;stop();restoreVideo();dialog.close();document.querySelector(`[data-senior-page="${target}"]`)?.click();}
 function render(next){restoreVideo();stop();step=next;
  const date=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',weekday:'long'}).format(new Date());
  const roles=['kongi','kongi','tori','kongi','nabi','bori'],labels=['콩이','콩이','토리','콩이','나비','보리'];
  const titles=['안녕하세요!',`오늘은 ${date}이에요.`,'오늘 기분은 어떠세요?','몸을 천천히 움직여볼까요?','이번에는 기억 놀이를 해볼까요?','오늘도 정말 잘하셨어요.'];
  const descriptions=['오늘도 함께 시작해볼까요?','오늘 날씨는 어떨까요?','','무리하지 않아도 괜찮아요.<br>불편한 동작은 쉬어가셔도 됩니다.','','함께해서 즐거웠어요.'];
  dialog.innerHTML=`<nav class="senior-return morning-nav" aria-label="프로그램 이동">${btn('🏠 처음으로','home','primary')}${btn('← 이전','prev')}</nav><p class="morning-progress">${step+1} / 6 · ${names[step]}</p><img class="morning-character" src="assets/images/friend-${roles[step]}.png" alt="${labels[step]}"><h1 id="morningTitle" tabindex="-1">${titles[step]}</h1><p class="morning-message">${descriptions[step]}</p>${step===2?`<div class="morning-moods">${['😊 좋아요','😐 괜찮아요','😔 조금 힘들어요'].map((t,i)=>`<button type="button" class="care-btn" data-morning-mood="${i}" aria-pressed="${mood===t}">${t}</button>`).join('')}</div><p id="morningMoodReply" role="status">${mood?mood+' · 이야기해주셔서 고마워요.':'마음에 드는 표정을 눌러주세요.'}</p>`:''}${step===3?`<div id="morningVideo" hidden></div><p id="morningVideoStatus" role="status"></p>`:''}<div class="morning-actions">${step===3?btn('▶ 체조 시작','exercise','primary'):step===4?btn('🧠 기억 놀이 시작','memory','primary'):''}${step<5?btn(step===3?'다음 · 기억 활동':step===4?'다음 · 마무리':'다음','next',step<3?'primary':''):btn('🏠 처음으로','home','primary')+btn('🎵 다른 활동 보기','activities')}</div>`;
  if(!dialog.open)dialog.showModal();dialog.scrollTop=0;dialog.querySelector('h1').focus();
 }
 launcher.querySelector('button').addEventListener('click',()=>{running=true;const selected=document.querySelector('[data-start-mood][aria-pressed="true"]');mood=selected?.dataset.startMood||'';render(0)});
 dialog.addEventListener('cancel',e=>{e.preventDefault();leave()});
 dialog.addEventListener('click',e=>{
  const choice=e.target.closest('[data-morning-mood]');if(choice){mood=choice.textContent;dialog.querySelectorAll('[data-morning-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b===choice)));document.querySelectorAll('[data-start-mood]').forEach(b=>{if(b.dataset.startMood===mood)b.click()});dialog.querySelector('#morningMoodReply').textContent=mood+' · 이야기해주셔서 고마워요.';return;}
  const action=e.target.closest('[data-morning]')?.dataset.morning;if(!action)return;
  if(action==='home'||action==='activities'){leave(action==='home'?'home':'activities');return;}
  if(action==='prev'){if(step===0)leave();else render(step-1);return;}
  if(action==='next'){render(Math.min(5,step+1));return;}
  if(action==='exercise'){const slot=dialog.querySelector('#morningVideo');slot.hidden=false;slot.append(video);stop();video.play().catch(()=>{if(dialog.querySelector('#morningVideoStatus'))dialog.querySelector('#morningVideoStatus').textContent='영상의 재생 버튼을 눌러주세요.'});return;}
  if(action==='memory'){stop();dialog.close();inMemory=true;returnStep=5;LessonEngine.startLesson('memory');if(!viewport.classList.contains('active')){inMemory=false;render(4);}}
 });
 video.addEventListener('ended',()=>{if(running&&step===3&&dialog.open)render(4)});
 // Intercept only this program's lesson navigation; normal lessons keep their original behavior.
 window.addEventListener('click',e=>{if(!inMemory)return;const b=e.target.closest('[data-senior-page]');if(!b||!b.closest('#lessonViewport'))return;
  if(b.dataset.seniorPage==='home'){running=false;inMemory=false;return;}
  if(b.dataset.seniorPage==='back'){e.preventDefault();e.stopImmediatePropagation();returnStep=4;LessonEngine.exitLesson();}
 },true);
 new MutationObserver(()=>{if(!running||!inMemory||viewport.classList.contains('active'))return;inMemory=false;document.querySelector('#careDialog[open]')?.close();render(returnStep)}).observe(viewport,{attributes:true,attributeFilter:['class']});
});
