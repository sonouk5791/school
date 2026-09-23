/* Shared presentation state; existing question generators and records remain owners. */
window.RoomActivity={selectedActivity:null,activityStatus:'select',generation:0};
window.roomActivityDelay=(callback,ms)=>{const token=window.RoomActivity.generation;return setTimeout(()=>{if(token===window.RoomActivity.generation)callback();},ms);};
document.addEventListener('DOMContentLoaded',()=>{
 const s=window.RoomActivity;
 const configs={
  tori:{menu:'.tp-game-menu',tab:'[data-game]',panel:'.game-panel',hero:'.tp-hero',name:'🐰 토리',greeting:'오늘은 뭐하고 놀까요?',labels:{match:'같은 그림 찾기',color:'색깔 놀이',season:'계절 놀이',animal:'동물 맞히기'},starts:{match:'startMatchGame',color:'startColorGame',season:'startSeasonGame',animal:'startAnimalGame'}},
  nabi:{menu:'.nl-menu',tab:'[data-learn]',panel:'.learn-panel',hero:'.nl-hero',name:'🐱 나비',greeting:'천천히 같이 생각해볼까요?',labels:{today:'날짜',season:'계절',number:'숫자',proverb:'속담'},starts:{today:'startDayLearn',season:'startSeasonLearn',proverb:'startProvLearn',number:'startNumLearn'}},
  bori:{menu:'.bh-menu',tab:'[data-tab]',panel:'.hobby-panel',hero:'.bh-hero',name:'🐻 보리',greeting:'오늘은 무엇을 하며 즐겨볼까요?',labels:{song:'음악',story:'추억 이야기',color:'색칠',riddle:'수수께끼'},starts:{}}
 };
 const id=document.body.dataset.activityRoom,c=configs[id];if(!c)return;
 const menu=document.querySelector(c.menu),hero=document.querySelector(c.hero),panels=[...document.querySelectorAll(c.panel)];
 const tabs=[...menu.querySelectorAll(c.tab)];menu.setAttribute('role','group');menu.setAttribute('aria-label','활동 선택');
 tabs.forEach(t=>{t.setAttribute('role','button');t.removeAttribute('aria-selected');t.classList.remove('active');});
 const greeting=hero.querySelector('p');if(greeting)greeting.textContent=c.greeting;
 hero.querySelector('h1').textContent=c.name;
 const toolbar=document.createElement('nav');toolbar.className='room-flow-toolbar';toolbar.setAttribute('aria-label','활동 이동');toolbar.innerHTML='<button type="button" data-room-back>← 방으로 돌아가기</button><h2 id="roomFlowTitle"></h2><button type="button" data-room-replay>🔊 다시 듣기</button>';
 menu.after(toolbar);
 const key=t=>t.dataset.game||t.dataset.learn||t.dataset.tab;
 Object.entries(c.labels).forEach(([value,label])=>{const tab=tabs.find(t=>key(t)===value);tab.textContent=label;menu.append(tab);});
 // Secondary destinations stay available without competing with four choices.
 const extras=document.createElement('details');extras.className='room-selection-extras';extras.innerHTML='<summary>내 방과 활동 기록</summary>';
 menu.after(extras);
 document.querySelectorAll(`${c.menu}>a,.stamp-row`).forEach(node=>extras.append(node));
 if(id==='bori'){const house=document.querySelector('body>p:has(a[href*="character-house.html"])');if(house)extras.append(house);}
 const panelFor=k=>!k?null:document.getElementById(id==='bori'?'panel'+k[0].toUpperCase()+k.slice(1):'panel-'+k);
 const stop=()=>{document.getElementById('btnLyricsStop')?.click();window.speechSynthesis?.cancel();window.CharacterVoice?.stop();};
 function paint(){document.body.dataset.activityStatus=s.activityStatus;hero.hidden=s.activityStatus!=='select';menu.hidden=s.activityStatus!=='select';extras.hidden=s.activityStatus!=='select';toolbar.hidden=s.activityStatus!=='playing';panels.forEach(p=>{const selected=p===panelFor(s.selectedActivity||'');p.hidden=!selected||s.activityStatus==='select';p.classList.toggle('active',selected&&s.activityStatus!=='select');const done=p.querySelector('.stamp-area,.completion-banner');if(done)done.hidden=!selected||s.activityStatus!=='completed';});}
 function back(){const previous=s.selectedActivity;stop();s.generation++;s.selectedActivity=null;s.activityStatus='select';paint();(tabs.find(t=>key(t)===previous)||tabs[0]).focus();window.scrollTo(0,0);}
 toolbar.querySelector('[data-room-back]').onclick=back;
 toolbar.querySelector('[data-room-replay]').onclick=()=>window.replayRoomVoice?.();
 function begin(value){
   stop();s.generation++;s.selectedActivity=value;s.activityStatus='playing';
   panelFor(value).querySelector('.stamp-area,.completion-banner')?.classList.remove('show','visible');
   document.getElementById('roomFlowTitle').textContent=c.labels[value];
   paint();const start=c.starts[value];if(start)window[start]?.();else window.startHobbyActivity?.(value);
   toolbar.querySelector('h2').tabIndex=-1;toolbar.querySelector('h2').focus();window.scrollTo(0,0);
 }
 tabs.forEach(tab=>tab.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();begin(key(tab));},true));
 // Restart buttons inside a problem also invalidate callbacks from the old round.
 Object.values(c.starts).forEach(name=>{const original=window[name];window[name]=(...args)=>{s.generation++;return original(...args);};});
 panels.forEach(panel=>{
   const done=panel.querySelector('.stamp-area,.completion-banner');if(!done)return;
   const message=done.querySelector('.stamp-msg,h2');if(message)message.textContent='정말 잘하셨어요!';
   const retry=done.querySelector('button');
   if(retry){retry.textContent='다시 하기';retry.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();begin(s.selectedActivity);},true);}
   done.querySelectorAll('a[href="index.html"]').forEach(a=>a.hidden=true);
   const other=document.createElement('button');other.type='button';other.textContent='다른 활동 고르기';other.className='room-other-activity';other.onclick=back;done.append(other);
   new MutationObserver(()=>{if(panel!==panelFor(s.selectedActivity||'')||s.activityStatus==='select')return;const complete=done.classList.contains('show')||done.classList.contains('visible');const status=complete?'completed':'playing';if(s.activityStatus!==status){s.activityStatus=status;paint();if(complete){s.generation++;done.tabIndex=-1;done.focus();done.scrollIntoView({block:'start'});}}}).observe(done,{attributes:true,attributeFilter:['class']});
 });
 window.addEventListener('pagehide',()=>{stop();s.generation++;});
 paint();
});
