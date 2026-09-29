/* Pure, staff-input-only rules. No diagnosis, network request or random ranking. */
(function(root){
 'use strict';
 const activities=['체조','음악','기억놀이','회상활동','그림/색깔 활동','캐릭터 활동','대화'];
 const forms=['앉아서 활동','손운동','가벼운 상체운동','서서 하는 활동','영상 시청','터치 활동'];
 const themes=['옛노래','고향','가족','음식','계절','농촌생활','옛날 시장','꽃','동물','명절','여행'];
 const cautions=['빠른 동작 피하기','큰 음량 피하기','긴 활동 피하기','반복 설명 필요','터치 도움 필요'];
 const item=(id,title,source,step,category,topics,character,extra={})=>({id,title,source,step,category,themes:topics,character,position:'seated',difficulty:'쉬움',min:1,max:7,requirements:[],risks:[],...extra});
 const programs=[
  item('hello','토리와 반가운 인사','greeting',0,'대화',[],'tori',{max:2,also:['캐릭터 활동']}),
  item('weather','토리와 오늘 날씨','greeting',1,'대화',['계절'],'tori',{max:2,also:['캐릭터 활동']}),
  item('clap','콩이와 천천히 손뼉 운동','monthly-14',1,'체조',['옛노래'],'kongi',{max:3,requirements:['손운동'],also:['캐릭터 활동']}),
  item('song-home','보리와 고향의 봄','music',1,'음악',['옛노래','고향','꽃'],'bori',{risks:['audio']}),
  item('song-stream','보리와 퐁당퐁당','music',2,'음악',['옛노래','고향'],'bori',{risks:['audio']}),
  item('home-photo','나비와 고향 사진 이야기','photo',0,'회상활동',['고향','농촌생활'],'nabi'),
  item('family-photo','나비와 가족 이야기','monthly-11',1,'회상활동',['가족'],'nabi'),
  item('market-photo','나비와 옛날 시장 이야기','monthly-10',1,'회상활동',['옛날 시장','음식'],'nabi'),
  item('fruit-memory','나비와 과일 기억 놀이','memory',0,'기억놀이',['음식'],'nabi'),
  item('spring-memory','나비와 봄꽃 기억 놀이','memory',3,'기억놀이',['계절','꽃','고향'],'nabi'),
  item('fruit-pairs','나비와 과일 짝 맞추기','memory',1,'기억놀이',['음식'],'nabi',{difficulty:'보통',requirements:['터치 활동'],risks:['independentTouch','complex']}),
  item('flower-color','나비와 꽃 색깔 고르기','art',1,'그림/색깔 활동',['꽃','계절'],'nabi'),
  item('animal-color','나비와 강아지 표정 고르기','art',3,'그림/색깔 활동',['동물'],'nabi'),
  item('season-talk','토리와 좋아하는 계절','monthly-15',1,'대화',['계절','음식'],'tori'),
  item('song-talk','보리와 노래 추억 나누기','monthly-4',1,'음악',['옛노래'],'bori',{also:['캐릭터 활동']})
 ];
 function normalize(p={}){if(!p||typeof p!=='object')p={};const list=(key,allowed)=>Array.isArray(p[key])?[...new Set(p[key].filter(x=>allowed.includes(x)))]:[];return {activities:list('activities',activities),forms:list('forms',forms),themes:list('themes',themes),cautions:list('cautions',cautions),duration:[5,10,15,20,30].includes(Number(p.duration))?Number(p.duration):10,difficulty:p.difficulty==='보통'?'보통':'쉬움'};}
 function eligible(p,x){return !(p.forms.includes('서서 하는 활동')&&!p.forms.includes('앉아서 활동')&&x.position==='seated') && x.requirements.every(f=>p.forms.includes(f)) && (p.difficulty==='보통'||x.difficulty==='쉬움') && !(p.forms.length&& !p.forms.includes('서서 하는 활동')&&x.position==='standing') && !(p.cautions.includes('큰 음량 피하기')&&x.risks.includes('audio')) && !(p.cautions.includes('빠른 동작 피하기')&&x.risks.includes('fast')) && !(p.cautions.includes('반복 설명 필요')&&x.risks.includes('complex')) && !(p.cautions.includes('터치 도움 필요')&&x.risks.includes('independentTouch'));}
 function recommendPrograms(input,options={}){
  const p=normalize(input),recent=(options.recent||[]).slice(-3).flatMap(r=>r.ids||[]),previous=options.previous||[];
  const candidates=programs.filter(x=>eligible(p,x)&&(!options.available||options.available(x))).map((x,index)=>{
   const preference=p.activities.some(a=>a===x.category||x.also?.includes(a)),topic=x.themes.find(t=>p.themes.includes(t));
   return {...x,score:(preference?100:0)+(topic?15:0)-recent.filter(id=>id===x.id).length*3-(previous.includes(x.id)?20:0),index,reason:preference?`선호 활동인 ${x.category}과 연결된 활동입니다.${topic?' '+topic+' 주제를 함께 활용해요.':''}`:topic?`선호 주제인 ${topic} 이야기를 활용한 활동입니다.`:'앉아서 직원과 함께 천천히 참여할 수 있는 활동입니다.'};
  }).sort((a,b)=>b.score-a.score||a.index-b.index);
  const count=Math.min(p.duration>=15?4:3,candidates.length,p.duration);
  const chosen=candidates.slice(0,count).map(x=>({...x,duration:x.min}));
  let remaining=p.duration-chosen.length;
  while(remaining>0){let changed=false;for(const x of chosen){const max=p.cautions.includes('긴 활동 피하기')?Math.min(x.max,3):x.max;if(remaining&&x.duration<max){x.duration++;remaining--;changed=true;}}if(!changed)break;}
  return chosen;
 }
 const api={activities,forms,themes,cautions,programs,normalize,eligible,recommendPrograms};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.HomeCareRecommendations=api;
})(typeof window==='object'?window:globalThis);
