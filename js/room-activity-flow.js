/* Shared presentation state; existing question generators and records remain owners. */
window.RoomActivity={selectedActivity:null,activityStatus:'select',generation:0};
window.roomActivityDelay=(callback,ms)=>{const token=window.RoomActivity.generation;return setTimeout(()=>{if(token===window.RoomActivity.generation)callback();},ms);};
document.addEventListener('DOMContentLoaded',()=>{
 const s=window.RoomActivity;
 const configs={
  tori:{menu:'.tp-game-menu',tab:'[data-game]',panel:'.game-panel',hero:'.tp-hero',greeting:'오늘은 어떤 놀이를 해볼까요?',starts:{match:'startMatchGame',color:'startColorGame',season:'startSeasonGame',animal:'startAnimalGame'}},
  nabi:{menu:'.nl-menu',tab:'[data-learn]',panel:'.learn-panel',hero:'.nl-hero',greeting:'천천히 같이 생각해볼까요?',starts:{today:'startDayLearn',season:'startSeasonLearn',proverb:'startProvLearn',number:'startNumLearn'}},
  bori:{menu:'.bh-menu',tab:'[data-tab]',panel:'.hobby-panel',hero:'.bh-hero',greeting:'오늘은 무엇을 하며 쉬어볼까요?',starts:{}}
 };
 const id=document.body.dataset.activityRoom,c=configs[id];if(!c)return;
 const menu=document.querySelector(c.menu),hero=document.querySelector(c.hero),panels=[...document.querySelectorAll(c.panel)];
 const tabs=[...menu.querySelectorAll(c.tab)];menu.setAttribute('role','group');menu.setAttribute('aria-label','활동 선택');
 tabs.forEach(t=>{t.setAttribute('role','button');t.removeAttribute('aria-selected');t.classList.remove('active');});
 const greeting=hero.querySelector('p');if(greeting)greeting.textContent=c.greeting;
 const toolbar=document.createElement('nav');toolbar.className='room-flow-toolbar';toolbar.setAttribute('aria-label','활동 이동');toolbar.innerHTML='<button type="button" data-room-back>← 방으로 돌아가기</button><h2 id="roomFlowTitle"></h2><button type="button" data-room-replay>🔊 다시 듣기</button>';
 menu.after(toolbar);
 const key=t=>t.dataset.game||t.dataset.learn||t.dataset.tab;
 const panelFor=k=>!k?null:document.getElementById(id==='bori'?'panel'+k[0].toUpperCase()+k.slice(1):'panel-'+k);
 const stop=()=>{document.getElementById('btnLyricsStop')?.click();window.speechSynthesis?.cancel();window.CharacterVoice?.stop();};
 function paint(){document.body.dataset.activityStatus=s.activityStatus;hero.hidden=s.activityStatus!=='select';menu.hidden=s.activityStatus!=='select';toolbar.hidden=s.activityStatus==='select';panels.forEach(p=>{const selected=p===panelFor(s.selectedActivity||'');p.hidden=!selected||s.activityStatus==='select';p.classList.toggle('active',selected&&s.activityStatus!=='select');});}
 function back(){stop();s.generation++;s.selectedActivity=null;s.activityStatus='select';paint();tabs[0].focus();}
 toolbar.querySelector('[data-room-back]').onclick=back;
 toolbar.querySelector('[data-room-replay]').onclick=()=>window.replayRoomVoice?.();
 tabs.forEach(tab=>tab.addEventListener('click',()=>{
   stop();s.generation++;s.selectedActivity=key(tab);s.activityStatus='playing';
   document.getElementById('roomFlowTitle').textContent=tab.textContent.trim();
   paint();const start=c.starts[s.selectedActivity];if(start)window[start]?.();
   else panelFor(s.selectedActivity).querySelector('.completion-banner.visible .btn-retry')?.click();
   toolbar.querySelector('h2').tabIndex=-1;toolbar.querySelector('h2').focus();window.scrollTo(0,0);
 }));
 panels.forEach(panel=>{
   const done=panel.querySelector('.stamp-area,.completion-banner');if(!done)return;
   const other=document.createElement('button');other.type='button';other.textContent='다른 활동 고르기';other.className='room-other-activity';other.onclick=back;done.append(other);
   if(!done.querySelector('a[href="index.html"]')){const home=document.createElement('a');home.href='index.html';home.textContent='학교 홈';home.className='room-other-activity';done.append(home);}
   new MutationObserver(()=>{if(panel!==panelFor(s.selectedActivity||'')||s.activityStatus==='select')return;const complete=done.classList.contains('show')||done.classList.contains('visible');const status=complete?'completed':'playing';if(s.activityStatus!==status){s.activityStatus=status;paint();if(complete){stop();done.tabIndex=-1;done.focus();}}}).observe(done,{attributes:true,attributeFilter:['class']});
 });
 window.addEventListener('pagehide',()=>{stop();s.generation++;});
 paint();
});
