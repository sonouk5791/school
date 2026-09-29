(()=>{'use strict';
 const G=GardenRules,app=document.getElementById('homeApp'),key='school_anonymous_garden_v1';let cloud=false,state,home,screen='yard',plot=0,busy=false,sound=false,neighbors=[],greetings=[],notice='',lastActive=Date.now(),activeSeconds=0,pending=null;
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const btn=(text,action,extra='')=>`<button type="button" data-action="${action}" ${extra}>${text}</button>`;
 const veggie=id=>G.vegetables.find(v=>v.id===id);
 async function api(action,data){const r=await fetch('/api/garden?action='+action,{method:data?'POST':'GET',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(15000)});const x=await r.json();if(!r.ok)throw Object.assign(Error(x.error||'연결을 확인해주세요.'),{status:r.status});return x;}
 function guide(id,text){return `<div class="guide"><img src="${esc(window.characters[id].idle)}" alt="${{kongi:'콩이',tori:'토리',nabi:'나비',bori:'보리'}[id]}"><p>${esc(text)}</p></div>`;}
 function say(id,text){if(sound)window.speakAsCharacter?.(id,text)?.catch?.(()=>{});}
 function note(text){notice=text;render();}
 function error(e){if(e.name==='TimeoutError'||e.name==='TypeError')e={message:'서버 연결이 늦어지고 있어요. 잠시 후 다시 눌러주세요.'};if(e.name==='QuotaExceededError')e={message:'저장 공간이 부족해요. 선생님에게 알려주세요. 활동은 아직 저장되지 않았어요.'};if(e.name==='SyntaxError')e={message:'저장된 텃밭을 읽지 못했어요. 선생님에게 알려주세요.'};app.innerHTML=`<section class="error"><h1>잠시 쉬어갈까요?</h1><p>${esc(e.message)}</p>${btn(pending?'같은 활동 다시 저장하기':'다시 연결하기','retry')} <a class="home-link" href="index.html">마을로 돌아가기</a></section>`;}
 function yard(){return '<div class="yard" role="img" aria-label="기와지붕과 작은 문, 꽃과 벤치가 있는 따뜻한 우리 집 마당"><div class="yard-props">🌳🌷</div><div class="house"><span class="window"></span><span class="door"></span></div><div class="yard-props" aria-hidden="true">🪴 🪑<span class="jars"></span></div><span class="yard-wall" aria-hidden="true"></span></div>';}
 function render(){
  let html=`<p class="notice">${cloud?'기관 서버에 저장해요.':'개인정보 없는 체험 텃밭 · 이 기기에만 저장해요. 실제 어르신 연결과 이웃 방문은 서버 준비 후 사용할 수 있어요.'}</p>`;
  if(notice)html+=`<p class="status" role="status">${esc(notice)}</p>`;
  const mine=home?.own!==false;
  if(screen==='yard')html+=`<h1>편안한 우리 집에 오셨어요.</h1>${yard()}${guide('bori','마당에서 쉬고, 텃밭도 함께 가꿔볼까요?')}${greetings.length?'<h2>이웃이 남긴 인사</h2>'+greetings.map(x=>'<p>'+esc(x.text)+'</p>').join(''):''}<div class="actions primary">${btn('🌱 우리 텃밭','garden')}${btn('🌷 마당 둘러보기','tour')}${btn('🏡 이웃집 둘러보기','neighbors')}</div>`;
  if(screen==='tour')html+=`<h1>마당에서 잠깐 쉬어요.</h1>${yard()}${guide('kongi','편안히 앉아 손을 펴고, 어깨에 힘을 빼볼까요?')}<p>꽃을 보고, 평상에 앉아 쉬어가요.</p>`;
  if(screen==='garden'){
   html+=`<h1>${mine?'우리 텃밭':esc(home.alias)+' 텃밭'}</h1><p>${home.mode==='lesson'?'수업 텃밭 · 물주기와 돌보기 후 약 6분에 자라요.':'하루하루 자라요 · 심은 날부터 4일째 수확해요.'}</p><div class="plots">${home.plots.map((p,i)=>btn(`<span>${i+1}번 밭</span><span class="plant-icon">${p?['🌰','🌱','🌿',veggie(p.vegetable).icon][p.stage]:'＋'}</span><strong>${p?veggie(p.vegetable).name:'빈 밭'}</strong><span>${p?['씨앗을 심었어요','새싹이 났어요','쑥쑥 자라요','수확할 수 있어요'][p.stage]:mine?'채소 심기':'아직 비어 있어요'}</span>`,'plot',`class="plot" data-plot="${i}"`)).join('')}</div>`;
   if(mine)html+=`<h2>오늘 할 일</h2><p>${home.plots.some(Boolean)?'🌱 채소 살펴보기':'🌱 빈 밭에 채소 심기'}　${home.plots.some(p=>p&&!p.wateredToday)?'💧 물 주기':'💧 오늘 물주기 쉬어가기'}　${home.plots.some(p=>p?.stage===3)?'🧺 자란 채소 수확하기':'🌿 천천히 자라기를 기다리기'}</p><div class="basket"><h2>오늘 수확 바구니</h2><p>${G.vegetables.map(v=>{const n=home.basket.filter(x=>x.vegetable===v.id).length;return n?`${v.icon} ${v.name} ${n}개`:'';}).filter(Boolean).join(' · ')||'잘 자란 채소를 기다리고 있어요.'}</p></div><div class="actions">${btn('🥬 채소 이름 알아보기','quiz')}${btn('💬 채소 추억 이야기','memories')}</div>`;
   else html+=`${yard()}<div class="actions"> ${btn('따뜻한 인사 전하기','greetings')}${btn('내 집으로 돌아가기','own')}</div>`;
  }
  if(screen==='plant')html+=`<h1>${plot+1}번 밭에 무엇을 심을까요?</h1>${guide('tori','마음에 드는 채소 하나를 골라주세요.')}<div class="choices">${G.vegetables.map(v=>btn(`${v.icon} ${v.name}`,'choose',`data-veg="${v.id}"`)).join('')}</div>`;
  if(screen==='detail'){const p=home.plots[plot],v=veggie(p.vegetable);html+=`<h1>${plot+1}번 밭 · ${v.name}</h1><p class="plant-icon">${['🌰','🌱','🌿',v.icon][p.stage]}</p>${guide('nabi',['씨앗을 심었어요. 물을 주고 기다려요.','작은 새싹이 나왔어요.','싱그럽게 자라고 있어요.','잘 자랐어요. 수확해볼까요?'][p.stage])}<div class="actions primary">${mine?(p.stage===3?btn('🧺 수확하기','harvest'):btn(p.wateredToday?'오늘 물을 주었어요':'💧 물 주기','water')+btn('🌿 살펴보고 돌보기','care')):btn('💧 물주기 도와드리기','help')}</div>${btn('자란 모습 확인하기','refresh')} ${btn('텃밭으로 돌아가기','garden')}`;}
  if(screen==='neighbors')html+=`<h1>어느 이웃집에 가볼까요?</h1><p>선생님이 방문을 허용한 집만 보여요.</p>${!cloud?'<p>서버 연결과 선생님 승인이 필요해요.</p>':neighbors.length?`<div class="choices">${neighbors.map(h=>btn(esc(h.alias),'askVisit',`data-id="${esc(h.id)}"`)).join('')}</div>`:'<p>지금은 방문할 수 있는 집이 없어요.</p>'}`;
  if(screen==='greetings')html+=`<h1>따뜻한 인사를 골라주세요.</h1><div class="choices">${G.greetings.map((t,i)=>btn(t,'greet',`data-index="${i}"`)).join('')}</div>`;
  if(screen==='quiz')html+=`<h1>🥬 이 채소는 무엇일까요?</h1>${guide('nabi','천천히 생각해봐요. 괜찮아요.')}<div class="choices">${G.vegetables.slice(0,3).map(v=>btn(v.name,'answer',`data-veg="${v.id}"`)).join('')}</div>`;
  if(screen==='memories')html+=`<h1>어떤 채소 이야기를 나눠볼까요?</h1><div class="choices">${G.vegetables.map(v=>btn(v.icon+' '+v.name,'memory',`data-veg="${v.id}"`)).join('')}</div>`;
  app.innerHTML=html+`<nav class="actions">${mine&&screen!=='yard'?btn('우리 집 마당으로','yard'):''}<a class="home-link" href="index.html" onclick="sessionStorage.setItem('school_home_intro_played','true')">🏡 친구들 마을로 돌아가기</a></nav>`;
 }
 async function save(action,data={}){
  const request=pending||{action,plot,target:home.id,eventId:crypto.randomUUID(),durationSeconds:Math.floor(activeSeconds),...data};pending=request;
  if(cloud)home=(await api('act',request)).home;
  else {const next=structuredClone(state);const event=G.act(next,'demo',request);event.durationSeconds=Math.floor(activeSeconds);localStorage.setItem(key,JSON.stringify(next));state=next;home=G.view(state.garden.homes.demo,true);}
  pending=null;activeSeconds=0;screen='garden';
  note(({plant:'채소를 심었어요. 천천히 함께 가꿔요.',water:'물을 주었어요. 잘 자라기를 기다려요.',care:'돌보기를 마쳤어요.',harvest:'잘하셨어요! 오늘 수확 바구니에 담았어요.',help:'이웃의 물주기를 도왔어요.',greet:'따뜻한 인사를 전했어요.',memory:'추억 이야기 활동을 기록했어요.',quiz:request.answer==='lettuce'?'맞아요. 상추예요!':'괜찮아요. 정답은 상추예요.'})[action]||'활동을 기록했어요.');
 }
 async function load(){pending=null;cloud=(await api('status')).configured;if(cloud){const data=await api('home');home=data.home;greetings=data.greetings;}else{state=JSON.parse(localStorage.getItem(key)||'null')||{};const g=G.init(state);if(!g.homes.demo){g.homes.demo=G.home('demo');g.homes.demo.mode='lesson';}home=G.view(g.homes.demo,true);}screen=new URLSearchParams(location.search).has('neighbors')?'neighbors':'yard';if(cloud&&screen==='neighbors')neighbors=(await api('neighbors')).homes;render();}
 app.onclick=async e=>{const b=e.target.closest('[data-action]');if(!b||busy)return;busy=true;b.disabled=true;notice='';try{const a=b.dataset.action;window.CharacterVoice?.stop?.();
  if(a==='retry'){if(pending)await save(pending.action);else await load();}
  else if(a==='own'){const data=await api('home');home=data.home;greetings=data.greetings;screen='yard';render();}
  else if(a==='neighbors'){if(cloud)neighbors=(await api('neighbors')).homes;screen=a;render();}
  else if(a==='askVisit'){const n=neighbors.find(x=>x.id===b.dataset.id);app.innerHTML=`<h1>${esc(n.alias)}에 방문할까요?</h1><p>텃밭을 구경하고 인사를 나눠요.</p><div class="actions">${btn('방문하기','visit',`data-id="${esc(n.id)}"`)}${btn('돌아가기','neighbors')}</div>`;}
  else if(a==='visit'){home=(await api('visit',{target:b.dataset.id})).home;screen='garden';render();}
  else if(a==='refresh'){if(cloud)home=(await api('view&target='+encodeURIComponent(home.id))).home;else home=G.view(state.garden.homes.demo,true);render();}
  else if(a==='plot'){if(cloud)home=(await api('view&target='+encodeURIComponent(home.id))).home;else home=G.view(state.garden.homes.demo,true);plot=Number(b.dataset.plot);screen=home.plots[plot]?'detail':home.own?'plant':'garden';render();if(screen==='plant')say('tori','마음에 드는 채소 하나를 골라주세요.');else if(screen==='detail')say('nabi',veggie(home.plots[plot].vegetable).name+'를 함께 살펴볼까요?');}
  else if(a==='choose'){const v=veggie(b.dataset.veg);app.innerHTML=`<h1>${v.icon} ${v.name}를 심을까요?</h1><p>${plot+1}번 밭에서 함께 키워요.</p><div class="actions">${btn('심기','plant',`data-veg="${v.id}"`)}${btn('다시 고르기','plantScreen')}</div>`;}
  else if(a==='plant')await save('plant',{vegetable:b.dataset.veg});
  else if(['water','care','harvest','help'].includes(a))await save(a);
  else if(a==='greet')await save('greet',{text:G.greetings[Number(b.dataset.index)]});
  else if(a==='answer')await save('quiz',{answer:b.dataset.veg});
  else if(a==='memory'){const v=veggie(b.dataset.veg);app.innerHTML=`<h1>${v.name} 추억 이야기</h1>${guide('bori',v.memory)}<p>떠오르는 이야기를 편안하게 나눠주세요. 대답하지 않고 쉬어도 좋아요.</p><div class="actions">${btn('이야기 마치기','memoryDone',`data-veg="${v.id}"`)}${btn('쉬어가기','garden')}</div>`;say('bori',v.memory);}
  else if(a==='memoryDone')await save('memory',{vegetable:b.dataset.veg});
  else {screen=a==='plantScreen'?'plant':a;render();if(a==='tour')say('kongi','편안히 앉아 손을 펴고 어깨에 힘을 빼볼까요?');}
 }catch(e){if(pending&&(e.status===400||/이미|먼저|기다|오늘|선택|골라/.test(e.message))){pending=null;note(e.message);}else error(e);}finally{busy=false;b.disabled=false;const title=app.querySelector('h1');if(title){title.tabIndex=-1;title.focus();}}};
 document.getElementById('sound').onclick=e=>{sound=!sound;e.currentTarget.textContent=sound?'🔇 안내 끄기':'🔊 안내 듣기';e.currentTarget.setAttribute('aria-pressed',String(sound));if(sound)say('bori','우리 집에 오신 것을 환영해요. 천천히 함께해요.');else window.CharacterVoice?.stop?.();};
 setInterval(()=>{const now=Date.now();if(!document.hidden)activeSeconds+=Math.min(2,(now-lastActive)/1000);lastActive=now;},1000);

 window.addEventListener('pagehide',()=>window.CharacterVoice?.stop?.());load().catch(error);
})();
