/* Anonymous standalone activity summaries only. Institution evaluations remain in OperationsStore. */
(()=>{'use strict';const key='school_public_activity_results_v1';let current=null;
 const read=()=>{try{const rows=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(rows)?rows:[];}catch{return [];}};
 const session=(value)=>{try{if(value)sessionStorage.setItem('school_public_activity_resume',JSON.stringify(value));else sessionStorage.removeItem('school_public_activity_resume');}catch{}};
 window.ServiceActivity={read,
  start(character,activity,title){if(window!==parent)return;current={id:crypto.randomUUID(),character,activity,title,startedAt:new Date().toISOString(),activeMs:0,running:true,lastTick:performance.now()};session({character,activity,title});},
  stop(){current=null;session(null);},
  pause(paused){if(!current)return;const now=performance.now();if(current.running&&!document.hidden)current.activeMs+=now-current.lastTick;current.lastTick=now;current.running=!paused;},
  complete(host){
    if(!current||window!==parent)return;
    const tick=performance.now();
    if(current.running&&!document.hidden)current.activeMs+=tick-current.lastTick;
    const row={id:current.id,character:current.character,activity:current.activity,title:current.title,date:new Date().toISOString(),durationSeconds:Math.round(current.activeMs/1000),completion:100,participation:null,mood:null,assistance:null,note:null,rewardType:'flower'};
    let saved=false;
    try{
      const rows=read();
      if(!rows.some(r=>r.id===row.id))rows.push(row);
      localStorage.setItem(key,JSON.stringify(rows));
      saved=true;

      const d=new Date().toISOString().slice(0,10);
      const todayKey='school_today_completed_chars';
      const map=JSON.parse(localStorage.getItem(todayKey)||'{}');
      const list=new Set(map[d]||[]);
      list.add(row.character);
      map[d]=[...list];
      localStorage.setItem(todayKey,JSON.stringify(map));

      const waterKey='school_garden_water_count';
      const curWater=parseInt(localStorage.getItem(waterKey)||'0',10);
      localStorage.setItem(waterKey,String(curWater+1));
    }catch{}

    const charName={kongi:'🐶 콩이',tori:'🐰 토리',nabi:'🐱 나비',bori:'🐻 보리'}[current.character]||'친구';
    current=null;session(null);
    if(!host)return;
    host.querySelector('.service-result')?.remove();

    const result=document.createElement('div');
    result.className='service-result';
    result.innerHTML=`<div class="service-reward-card"><div class="service-reward-flower" aria-hidden="true">🌼</div><div class="service-reward-badge">🌸 오늘의 꽃 획득! (텃밭 물주기 +1)</div><h3 class="service-reward-title">오늘도 정말 잘하셨어요!</h3><p class="service-reward-desc">${charName}와 함께 즐겁게 활동을 완료하셨습니다.</p><p class="service-reward-meta" role="status">활동 시간: 약 ${Math.max(1, Math.round(row.durationSeconds/60))}분 · 100% 완료</p><div class="service-reward-actions"><button type="button" class="service-btn-again" onclick="window.location.reload()">🔄 한 번 더 하기</button><a href="index.html" class="service-btn-village" onclick="sessionStorage.setItem('school_home_intro_played','true')">🏡 친구들 마을로 돌아가기</a></div></div>`;
    host.append(result);
  }
 };
 document.addEventListener('visibilitychange',()=>{if(!current)return;const now=performance.now();if(document.hidden&&current.running)current.activeMs+=now-current.lastTick;current.lastTick=now;});
 document.addEventListener('DOMContentLoaded',()=>{
  const room=document.body.dataset.activityRoom||(document.getElementById('viewReady')?'kongi':null),config=window.SchoolServiceConfig?.[room];if(!config)return;
  const crumb=document.createElement('nav');crumb.className='service-location';crumb.setAttribute('aria-label','현재 위치');const a=document.createElement('a');a.href='index.html';a.textContent='마을로 돌아가기';a.onclick=()=>{try{sessionStorage.setItem('school_home_intro_played','true');}catch{}};const name=document.createElement('span');name.textContent=`친구들 마을 › ${config.name}집 · ${config.role}`;crumb.append(name);document.querySelector('header')?.after(crumb);if(window!==parent)crumb.hidden=true;
  if(room==='kongi'){let previous='ready';new MutationObserver(()=>{const state=document.body.dataset.exerciseStatus;if(state===previous)return;previous=state;if(state==='playing'&&!current)ServiceActivity.start('kongi','exercise','건강체조');if(state==='completed')ServiceActivity.complete(document.getElementById('viewCompleted'));if(state==='ready')ServiceActivity.stop();}).observe(document.body,{attributes:true,attributeFilter:['data-exercise-status']});}
 });
})();
