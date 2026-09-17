const assert=require('node:assert/strict'),r=require('../js/home-care-recommendations');
const A={activities:['음악','회상활동'],forms:['앉아서 활동'],themes:['고향','옛노래'],duration:20};
const B={activities:['체조','캐릭터 활동'],forms:['손운동','앉아서 활동'],duration:10};
const C={activities:['기억놀이'],themes:['계절','음식'],duration:15};
for(const p of [A,B,C]){const a=r.recommendPrograms(p);assert(a.length>=3&&a.length<=5);assert(a.reduce((n,x)=>n+x.duration,0)<=p.duration);assert(a.every(x=>r.eligible(r.normalize(p),x)));assert(a.every(x=>x.reason));}
assert(r.recommendPrograms(A).filter(x=>['음악','회상활동'].includes(x.category)).length>=3);
assert(r.recommendPrograms(B).some(x=>x.id==='clap'));
assert(r.recommendPrograms(C).filter(x=>x.category==='기억놀이').every(x=>x.themes.some(t=>['계절','음식'].includes(t))));
const first=r.recommendPrograms(A),second=r.recommendPrograms(A,{previous:first.map(x=>x.id)});assert.notDeepEqual(first.map(x=>x.id),second.map(x=>x.id));
assert(!r.recommendPrograms({activities:['체조'],forms:['앉아서 활동']}).some(x=>x.category==='체조'));
for(const duration of [5,10,15,20,30])for(const cautions of [[],r.cautions]){const p={...B,duration,cautions,difficulty:'보통'};const plan=r.recommendPrograms(p);assert(plan.reduce((n,x)=>n+x.duration,0)<=duration);assert(plan.every(x=>r.eligible(r.normalize(p),x)));if(cautions.length)assert(plan.every(x=>x.duration<=3&&!x.risks.includes('audio')&&!x.risks.includes('independentTouch')));}
assert.deepEqual(r.recommendPrograms(A,{available:()=>false}),[]);assert.deepEqual(r.recommendPrograms(A),r.recommendPrograms(A));
const recent=r.recommendPrograms(A,{recent:[{ids:['song-home']},{ids:['song-home']},{ids:['song-home']}]});assert.notEqual(recent[0].id,'song-home');
console.log('PASS A/B/C preferences, conditions, time budgets, cautions, deterministic alternatives, recent penalty, no available content');
