(()=>{
'use strict';
const words=[['사과','🍎'],['나무','🌳'],['모자','👒'],['바다','🌊'],['우산','☂️'],['포도','🍇'],['오이','🥒'],['나비','🦋'],['기차','🚂'],['토끼','🐰']];
const q=(prompt,visual,answer,options,hint)=>({prompt,visual,answer:String(answer),options:options.map(String),hint});
const hangul=[
{name:'1단계 · 글자 익히기',items:['가','나','다','라','마','바','사','아','자','하'].map((c,i)=>q('큰 글자와 같은 글자를 골라주세요.',c,c,[c,'고','누'].sort((a,b)=>a.localeCompare(b)),`같은 글자는 “${c}”예요. 모양을 천천히 살펴보세요.`))},
{name:'2단계 · 낱말 익히기',items:words.map(([w,e],i)=>q(e+' 그림의 이름을 골라주세요.',e,w,[words[(i+3)%10][0],w,words[(i+1)%10][0]],`“${w[0]}”로 시작해요. ${w}예요.`))},
{name:'3단계 · 빈 글자 채우기',items:words.map(([w,e],i)=>q('빈칸에 들어갈 글자를 골라주세요.',e+' '+w[0]+' □',w[1],[w[1],'무','가'].filter((x,i,a)=>a.indexOf(x)===i),`이 낱말은 ${w}예요. 마지막 글자는 “${w[1]}”예요.`))}
];
const numbers=[
{name:'1단계 · 수 세기',items:Array.from({length:10},(_,i)=>{let n=i+1;return q('사과는 모두 몇 개일까요?',Array(n).fill('🍎').join(' '),n,[n+1,n,Math.max(0,n-1)],`하나씩 세어보세요. 사과는 모두 ${n}개예요.`)})},
{name:'2단계 · 숫자 순서',items:Array.from({length:10},(_,i)=>{let n=i+1;return q('빈칸에 들어갈 숫자는 무엇일까요?',`${n} → □ → ${n+2}`,n+1,[n+2,n,n+1],`${n} 다음에는 ${n+1}이 와요.`)})},
{name:'3단계 · 쉬운 더하기',items:Array.from({length:10},(_,i)=>{let a=i%5+1,b=i<5?1:2;return q('두 수를 더하면 얼마일까요?',`${a} + ${b} = □`,a+b,[a+b,a+b+1,a+b-1],`${a}에서 ${b}만큼 더 세어보세요. 답은 ${a+b}예요.`)})},
{name:'4단계 · 쉬운 빼기',items:Array.from({length:10},(_,i)=>{let a=i+2,b=i%2+1;return q('수를 빼면 얼마일까요?',`${a} − ${b} = □`,a-b,[a-b+1,a-b,a],`${a}에서 ${b}만큼 줄어요. 답은 ${a-b}예요.`)})}
];
document.addEventListener('DOMContentLoaded',()=>{
const hero=document.querySelector('.hero-classroom');if(!hero)return;
const entry=document.createElement('section');entry.className='basic-study-entries';entry.innerHTML=[['hangul','가','한글 공부방','글자와 친숙한 낱말을 천천히 익혀요.'],['number','123','숫자 공부방','수를 세고 쉬운 계산을 함께해요.']].map(([id,icon,title,desc])=>`<article class="care-card"><h2>${icon} ${title}</h2><p>${desc}</p><button type="button" class="care-btn primary" data-study-open="${id}">${title} 들어가기</button></article>`).join('');hero.after(entry);
const room=document.createElement('dialog');room.id='basicStudyRoom';room.className='solar-room';room.setAttribute('aria-labelledby','basicStudyTitle');document.body.append(room);
let kind='hangul',level=0,index=0,solved=false;
const stop=()=>window.VoiceManager?.stopSpeaking(),speak=t=>window.VoiceManager?.speak(t),levels=()=>kind==='hangul'?hangul:numbers;
function render(){const ls=levels(),d=ls[level].items[index];solved=false;
room.innerHTML=`<div class="solar-header"><h2 id="basicStudyTitle">${kind==='hangul'?'가 한글 공부방':'123 숫자 공부방'}</h2><button type="button" data-study="close">◀ 방 나가기</button></div><p>시간제한은 없어요. 힌트를 보고 천천히 골라주세요.</p><nav class="solar-controls" aria-label="공부 단계">${ls.map((l,i)=>`<button type="button" data-study-level="${i}" aria-pressed="${i===level}">${l.name}</button>`).join('')}</nav><p>${ls[level].name} · ${index+1} / 10 문제</p><h3 id="basicQuestion" tabindex="-1">${d.prompt}</h3><div class="basic-study-visual" aria-label="${kind==='number'&&level===0?'사과 '+(index+1)+'개':d.visual}">${d.visual}</div><div class="solar-controls"><button type="button" data-study="read">🔊 문제 듣기</button><button type="button" data-study="hint">💡 힌트 보기</button><button type="button" data-study="stop">■ 읽기 멈추기</button></div><section class="study-writing"><h4>✍️ 직접 써보세요</h4><p>따라 쓸 ${kind==='hangul'?'글자':'숫자'}: <strong>${d.answer}</strong></p><p class="solar-note">아래 칸에 손가락이나 마우스로 써보세요. 자유롭게 연습하는 칸이에요.</p><canvas id="studyWritingCanvas" width="900" height="360" aria-label="손가락이나 마우스로 직접 쓰는 연습장"></canvas><div class="solar-controls"><button type="button" id="studyWritingClear">🧽 모두 지우기</button></div><label for="studyTyping">키보드로도 써볼 수 있어요</label><input id="studyTyping" type="text" autocomplete="off" placeholder="여기에 직접 써보세요"><p class="solar-note">다음 문제로 이동하면 연습 칸은 새로 비워져요.</p></section><div class="basic-study-answers">${d.options.map(o=>`<button type="button" data-study-answer="${o}">${o}</button>`).join('')}</div><p id="basicFeedback" role="status" aria-live="polite">마음 편히 골라보세요.</p><div class="solar-controls"><button type="button" data-study="prev" ${index===0?'disabled':''}>◀ 이전 문제</button><button type="button" data-study="next">${index===9?'이 단계 처음부터 ↻':'다음 문제 ▶'}</button></div>`;
 const canvas=room.querySelector('#studyWritingCanvas'),ctx=canvas.getContext('2d');
 let pointer=null;
 const point=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*canvas.width/r.width,(e.clientY-r.top)*canvas.height/r.height]};
 ctx.lineWidth=7;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#293e65';ctx.fillStyle='#293e65';
 canvas.addEventListener('pointerdown',e=>{if(pointer!==null||e.button>0)return;e.preventDefault();pointer=e.pointerId;canvas.setPointerCapture(pointer);const [x,y]=point(e);ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(x,y)});
 canvas.addEventListener('pointermove',e=>{if(e.pointerId!==pointer)return;e.preventDefault();ctx.lineTo(...point(e));ctx.stroke()});
 const end=e=>{if(e.pointerId===pointer){pointer=null;ctx.beginPath()}};
 canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
 room.querySelector('#studyWritingClear').onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);room.querySelector('#studyTyping').value=''};
}
entry.addEventListener('click',e=>{const b=e.target.closest('[data-study-open]');if(!b)return;stop();kind=b.dataset.studyOpen;level=0;index=0;render();room.showModal()});
room.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=levels()[level].items[index];
if(b.dataset.studyLevel!==undefined){stop();level=Number(b.dataset.studyLevel);index=0;render();return}
const a=b.dataset.study;if(a==='close'){room.close();return}if(a==='stop'){stop();return}if(a==='prev'||a==='next'){stop();index=a==='prev'?Math.max(0,index-1):(index+1)%10;render();room.querySelector('#basicQuestion').focus({preventScroll:true});return}
if(a==='read'){speak(d.prompt+' '+(kind==='hangul'&&level===0?'글자는 '+d.visual:kind==='number'&&level>0?d.visual.replace('□','빈칸').replace('→','다음').replace('−','빼기').replace('+','더하기'):''));return}
let message;if(a==='hint')message=d.hint;else if(b.dataset.studyAnswer!==undefined){solved=b.dataset.studyAnswer===d.answer;message=solved?'맞아요! 참 잘하셨어요. 다음 문제도 해볼까요?':'괜찮아요. '+d.hint;room.querySelectorAll('[data-study-answer]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}if(message){room.querySelector('#basicFeedback').textContent=message;speak(message)}
});room.addEventListener('close',stop);room.addEventListener('cancel',stop);
const sync=()=>entry.hidden=hero.hidden;sync();new MutationObserver(sync).observe(hero,{attributes:true,attributeFilter:['hidden']});
});
})();
