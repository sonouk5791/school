/* Shared garden rules. Identity and authorization are enforced by api/garden. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.GardenRules=factory();})(globalThis,()=>{
 'use strict';
 const vegetables=[['lettuce','상추','🥬','상추를 쌈으로 드셔 보셨나요?'],['perilla','깻잎','🌿','깻잎 향을 기억하시나요?'],['pepper','고추','🌶️','고추를 말리던 풍경이 떠오르나요?'],['tomato','방울토마토','🍅','빨간 토마토를 누구와 나누고 싶나요?'],['cucumber','오이','🥒','여름에 오이로 어떤 음식을 드셨나요?'],['potato','감자','🥔','따뜻한 감자를 드셨던 기억이 있나요?']].map(([id,name,icon,memory])=>({id,name,icon,memory}));
 const greetings=['반가워요.','텃밭이 참 예뻐요.','오늘도 좋은 하루 보내세요.','수확을 축하해요.'];
 const date=(now=Date.now())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
 const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
 function init(s){return s.garden ||= {homes:{},sessions:{},events:[]};}
 function home(id,alias='우리 집'){return {id,alias,visitable:false,mode:'real',plots:Array(6).fill(null),harvests:[],help:{}};}
 function stage(p,mode,now=Date.now()) {if(!p)return -1;if(mode==='lesson')return Math.min(3,Math.floor((now-p.plantedAt)/120000),p.watered? (p.cared?3:1):0);return Math.min(3,Math.max(0,Math.round((Date.parse(date(now))-Date.parse(date(p.plantedAt)))/86400000)));}
 function view(h,own,now=Date.now()){return {id:h.id,alias:h.alias,own,mode:h.mode,plots:h.plots.map(p=>p?{vegetable:p.vegetable,stage:stage(p,h.mode,now),wateredToday:p.lastWater===date(now),watered:!!p.watered,cared:!!p.cared}:null),basket:own?h.harvests.filter(x=>x.date===date(now)):[]};}
 function act(s,actor,body,now=Date.now()){
  const g=init(s),mine=g.homes[actor];if(!mine)fail('우리 집 연결이 필요해요.',401);
  const target=body.target||actor,h=g.homes[target],own=actor===target;
  if(!h||(!own&&!h.visitable))fail('지금은 방문할 수 없는 집이에요.',403);
  const action=body.action;
  if(!own&&!['visit','help','greet'].includes(action))fail('이웃 텃밭은 바꿀 수 없어요.',403);
  const i=body.plot,p=h.plots[i];let detail='';
  if(['plant','water','care','harvest','help'].includes(action)&&(!Number.isInteger(i)||i<0||i>5))fail('밭을 선택해주세요.');
  if(action==='plant'){if(p)fail('이미 채소가 자라고 있어요.');if(!vegetables.some(v=>v.id===body.vegetable))fail('채소를 골라주세요.');h.plots[i]={vegetable:body.vegetable,plantedAt:now,watered:false,cared:false};detail=body.vegetable;}
  else if(action==='water'||action==='help'){
   if(!p)fail('먼저 채소를 심어주세요.');const key=`${actor}:${i}:${date(now)}`;
   if(action==='help'){if(h.help[key])fail('오늘은 이미 물주기를 도왔어요.');h.help[key]=true;}
   else if(p.lastWater===date(now))fail('오늘 물을 주었어요. 내일 다시 만나요.');
   p.lastWater=date(now);p.watered=true;detail=p.vegetable;
  }else if(action==='care'){if(!p||!p.watered)fail('먼저 물을 주세요.');if(p.cared)fail('오늘 돌보기를 마쳤어요.');p.cared=true;detail=p.vegetable;}
  else if(action==='harvest'){if(!p||stage(p,h.mode,now)!==3)fail('조금 더 자라기를 기다려주세요.');h.harvests.push({vegetable:p.vegetable,date:date(now)});detail=p.vegetable;h.plots[i]=null;}
  else if(action==='greet'){if(!greetings.includes(body.text))fail('인사말을 골라주세요.');detail=body.text;}
  else if(action==='quiz'){if(!vegetables.some(v=>v.id===body.answer))fail('답을 골라주세요.');detail=body.answer==='lettuce'?'상추 이름 맞히기: 정답 선택':'상추 이름 맞히기: 다시 생각하기';}
  else if(action==='memory'){if(!vegetables.some(v=>v.id===body.vegetable))fail('채소를 골라주세요.');detail=body.vegetable+' 회상 질문 마치기 (답변 내용 미수집)';}
  else if(action!=='visit')fail('지원하지 않는 활동이에요.');
  const labels={plant:'심기',water:'물주기',care:'돌보기',harvest:'수확',help:'이웃 물주기',greet:'인사',quiz:'채소 맞히기',memory:'회상',visit:'이웃 방문'};
  detail=detail.replace(/lettuce|perilla|pepper|tomato|cucumber|potato/g,id=>vegetables.find(v=>v.id===id).name);
  const event={id:body.eventId||`${now}-${g.events.length}`,actor,target,action,label:labels[action],detail,date:date(now),at:now};g.events.push(event);return event;
 }
 return {vegetables,greetings,date,init,home,stage,view,act};
});
