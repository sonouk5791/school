/* Anonymous standalone activity summaries only. Institution evaluations remain in OperationsStore. */
(()=>{'use strict';const key='school_public_activity_results_v1';let current=null;
 const read=()=>{try{const rows=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(rows)?rows:[];}catch{return [];}};
 const session=(value)=>{try{if(value)sessionStorage.setItem('school_public_activity_resume',JSON.stringify(value));else sessionStorage.removeItem('school_public_activity_resume');}catch{}};
 window.ServiceActivity={read,
  start(character,activity,title){if(window!==parent)return;current={id:crypto.randomUUID(),character,activity,title,startedAt:new Date().toISOString(),activeMs:0,running:true,lastTick:performance.now()};session({character,activity,title});},
  stop(){current=null;session(null);},
  pause(paused){if(!current)return;const now=performance.now();if(current.running&&!document.hidden)current.activeMs+=now-current.lastTick;current.lastTick=now;current.running=!paused;},
  complete(host){if(!current||window!==parent)return;const tick=performance.now();if(current.running&&!document.hidden)current.activeMs+=tick-current.lastTick;const row={id:current.id,character:current.character,activity:current.activity,title:current.title,date:new Date().toISOString(),durationSeconds:Math.round(current.activeMs/1000),completion:100,participation:null,mood:null,assistance:null,note:null};
   let saved=false;try{const rows=read();if(!rows.some(r=>r.id===row.id))rows.push(row);localStorage.setItem(key,JSON.stringify(rows));saved=true;}catch{}
   current=null;session(null);if(!host)return;host.querySelector('.service-result')?.remove();const result=document.createElement('div');result.className='service-result';const p=document.createElement('p');p.setAttribute('role','status');p.textContent=`활동 완료 100% · 활동 시간 ${Math.floor(row.durationSeconds/60)}분 ${row.durationSeconds%60}초 · ${saved?'이 기기에 저장했어요.':'저장 공간이 부족해 결과를 저장하지 못했어요.'}`;result.append(p);const home=document.createElement('a');home.href='index.html';home.textContent='마을로 돌아가기';home.onclick=()=>{try{sessionStorage.setItem('school_home_intro_played','true');}catch{}};const existing=[...host.querySelectorAll('a')].find(a=>a.getAttribute('href')==='index.html'&&!a.hidden);if(existing){existing.textContent='마을로 돌아가기';existing.onclick=home.onclick;}else result.append(home);host.append(result);
  }
 };
 document.addEventListener('visibilitychange',()=>{if(!current)return;const now=performance.now();if(document.hidden&&current.running)current.activeMs+=now-current.lastTick;current.lastTick=now;});
 document.addEventListener('DOMContentLoaded',()=>{
  const room=document.body.dataset.activityRoom||(document.getElementById('viewReady')?'kongi':null),config=window.SchoolServiceConfig?.[room];if(!config)return;
  const crumb=document.createElement('nav');crumb.className='service-location';crumb.setAttribute('aria-label','현재 위치');const a=document.createElement('a');a.href='index.html';a.textContent='마을로 돌아가기';a.onclick=()=>{try{sessionStorage.setItem('school_home_intro_played','true');}catch{}};const name=document.createElement('span');name.textContent=`친구들 마을 › ${config.name}집 · ${config.role}`;crumb.append(name);document.querySelector('header')?.after(crumb);if(window!==parent)crumb.hidden=true;
  if(room==='kongi'){let previous='ready';new MutationObserver(()=>{const state=document.body.dataset.exerciseStatus;if(state===previous)return;previous=state;if(state==='playing'&&!current)ServiceActivity.start('kongi','exercise','건강체조');if(state==='completed')ServiceActivity.complete(document.getElementById('viewCompleted'));if(state==='ready')ServiceActivity.stop();}).observe(document.body,{attributes:true,attributeFilter:['data-exercise-status']});}
 });
})();
