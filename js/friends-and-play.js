/* Optional companions and gentle activity formats extend the existing lesson engine. */
(()=>{'use strict';
const friends=[
  {id:'kongi',name:'콩이',animal:'강아지',emoji:'🐶',image:'friend-kongi-talk.png',voiceDesc:'밝고 다정한 목소리',badge:'건강 체조 친구',message:'저랑 천천히 몸을 움직여봐요!'},
  {id:'tori',name:'토리',animal:'토끼',emoji:'🐰',image:'friend-tori.png',voiceDesc:'따뜻하고 다정한 목소리',badge:'마음 친구',message:'오늘 기분은 어떠세요?'},
  {id:'nabi',name:'나비',animal:'고양이',emoji:'🐱',image:'friend-nabi.png',voiceDesc:'나긋나긋 고운 목소리',badge:'기억 친구',message:'우리 같이 기억해볼까요?'},
  {id:'bori',name:'보리',animal:'곰',emoji:'🐻',image:'friend-bori.png',voiceDesc:'포근하고 듬직한 목소리',badge:'음악 친구',message:'좋아하는 노래를 같이 들어봐요!'}
];
let selected='kongi';try{selected=localStorage.getItem('digital_school_friend')||'kongi';}catch{}if(!friends.some(f=>f.id===selected))selected='kongi';const friend=()=>friends.find(f=>f.id===selected);
const path=n=>'assets/images/'+n;
const course={id:'variety_play',title:'친구와 다양한 놀이',icon:'🧩',summary:'그림 찾기, O·X, 순서, 기억, 과일 힌트, 마음 표현을 함께 해요.',steps:[
{prompt:'위 사진과 같은 꽃을 찾아볼까요?',screenText:'같은 그림 찾기',voiceScript:'위 사진과 같은 꽃을 아래에서 골라주세요. 천천히 살펴봐요.',imageSrc:path('korean_sunflower.jpg'),imageAlt:'노란 해바라기',imageCaption:'🌻 같은 그림을 찾아요',helpScript:'꽃잎의 색과 가운데 모양을 비교해보세요.',options:[{text:'해바라기',imageSrc:path('korean_sunflower.jpg'),isBest:true,feedback:'같은 해바라기를 찾으셨어요.'},{text:'진달래',imageSrc:path('single_azalea_flower.jpg'),isBest:false,feedback:'노란 꽃잎을 함께 찾아볼까요?'},{text:'과일 바구니',imageSrc:path('fruits_basket.jpg'),isBest:false,feedback:'꽃 사진을 천천히 살펴보세요.'}]},
{prompt:'바나나는 보통 노란색이에요. 맞을까요?',screenText:'맞아요 · 아니에요',voiceScript:'바나나는 보통 노란색이에요. 맞으면 맞아요, 아니면 아니에요를 골라주세요.',imageSrc:path('fruits_basket.jpg'),imageAlt:'바나나가 있는 과일 바구니',helpScript:'잘 익은 바나나의 색을 떠올려보세요.',options:[{text:'맞아요',emoji:'⭕',isBest:true,feedback:'맞아요. 잘 익은 바나나는 노란색이지요.'},{text:'아니에요',emoji:'❎',isBest:false,feedback:'함께 바나나의 노란색을 찾아보아요.'}]},
{prompt:'손을 씻는 순서대로 하나씩 눌러주세요.',screenText:'생활 순서 맞추기',voiceScript:'손을 씻을 때 무엇을 먼저 할까요? 순서대로 하나씩 눌러주세요.',varietyKind:'sequence',helpScript:'물을 묻히고, 비누칠하고, 헹군 다음 수건으로 닦아요.',options:[]},
{prompt:'같은 동물 친구 두 장을 찾아주세요.',screenText:'그림 기억 놀이',voiceScript:'동물 친구들의 자리를 살펴보세요. 5초 뒤 카드가 자동으로 가려지면 같은 친구 두 장을 찾아보아요.',varietyKind:'memory',helpScript:'같은 그림 두 장을 찾으면 돼요. 언제든 모두 보기로 다시 살펴볼 수 있어요.',options:[]},
{prompt:'빨갛고 동그란 과일을 찾아볼까요?',screenText:'힌트로 과일 찾기',voiceScript:'힌트를 함께 볼까요? 빨갛고 동그란 과일이에요. 한 입 베어 물면 아삭아삭해요. 아래 그림에서 천천히 골라주세요.',varietyKind:'listen',helpScript:'이름은 사로 시작하고 두 글자예요. 더 쉬운 힌트 버튼을 누르면 그림도 볼 수 있어요.',options:[]},
{prompt:'오늘 다시 해보고 싶은 놀이는 무엇인가요?',screenText:'내 마음 표현하기',voiceScript:'어떤 놀이가 마음에 드셨나요? 정답은 없어요. 좋아하는 놀이를 골라주세요.',helpScript:'어떤 선택도 괜찮아요. 지금의 마음을 알려주세요.',options:[{text:'그림 놀이',emoji:'🖼️',feedback:'그림 놀이가 마음에 드셨군요. 알려주셔서 고마워요.'},{text:'순서 놀이',emoji:'👐',feedback:'순서 놀이를 다시 함께 해봐요.'},{text:'과일 힌트 놀이',emoji:'🍎',feedback:'다음에도 힌트를 보며 과일을 찾아봐요.'}]}]};
window.LESSON_CATALOG.push(course);
let state={},playRun=null,memoryPreviewTimer=null;const defaults=()=>({sequence:[],memory:{cards:['🐰','🐱','🐰','🐱'].map((value,i)=>({value,key:i})).sort(()=>Math.random()-.5),preview:true,open:[],matched:[],mismatch:false},listened:false,textClue:false,heardChoice:null});
window.selectSchoolCompanion=id=>{if(friends.some(f=>f.id===id)){selected=id;companion();}};
function companion(){const f=friend();VoiceManager.characterId=f.id;document.querySelectorAll('.hero-robot-img,.ai-friend-avatar-img,.completion-robot-img').forEach(img=>{img.src=path(f.image);img.alt=f.animal+' 친구 '+f.name;});document.querySelectorAll('.hero-greeting-tag').forEach(el=>el.textContent=f.emoji+' '+f.name+' · '+f.badge);document.querySelectorAll('.ai-friend-name-tag').forEach(el=>el.textContent=f.emoji+' '+f.name);document.querySelectorAll('[data-friend]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.friend===selected)));}
const button=(label,action,extra='')=>`<button type="button" class="play-button" data-play="${action}" ${extra}>${label}</button>`;
function announce(text){document.querySelector('#playFeedback').textContent=text;VoiceManager.speak(text);}
function savePlay(kind,value){LessonEngine.selectedAnswers['play_'+kind]=JSON.parse(JSON.stringify(value));}
function renderPlay(){clearInterval(memoryPreviewTimer);memoryPreviewTimer=null;if(LessonEngine.currentLesson?.id!=='variety_play')return;const step=LessonEngine.currentLesson.steps[LessonEngine.currentStepIndex];if(!step?.varietyKind)return;const holder=document.getElementById('choiceOptionsGrid');if(!holder)return;holder.className='variety-widget';const kind=step.varietyKind;
if(kind==='sequence'){
  const icons=[
    '<svg class="seq-icon-img" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6C18 15 12 21 12 28a12 12 0 0 0 24 0c0-7-6-13-12-22z" fill="#60a5fa" stroke="#2563eb" stroke-width="2.5"/><path d="M19 24a6 6 0 0 0 6 6" stroke="#eff6ff" stroke-width="3" stroke-linecap="round"/></svg>',
    '<svg class="seq-icon-img" viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="18" width="32" height="20" rx="8" fill="#a7f3d0" stroke="#059669" stroke-width="2.5"/><path d="M14 25h20" stroke="#6ee7b7" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="11" r="4.5" fill="#d1fae5" stroke="#059669" stroke-width="2"/><circle cx="27" cy="9" r="6" fill="#d1fae5" stroke="#059669" stroke-width="2"/><circle cx="36" cy="14" r="3.5" fill="#d1fae5" stroke="#059669" stroke-width="1.8"/></svg>',
    '<svg class="seq-icon-img" viewBox="0 0 48 48" aria-hidden="true"><path d="M12 28V16a6 6 0 0 1 6-6h12a4 4 0 0 1 4 4v6" fill="none" stroke="#4a5568" stroke-width="4.5" stroke-linecap="round"/><rect x="26" y="6" width="12" height="5" rx="2.5" fill="#718096"/><rect x="30" y="4" width="4" height="4" fill="#a0aec0"/><path d="M6 34c0 7 8 10 18 10s18-3 18-10H6z" fill="#edf2f7" stroke="#cbd5e0" stroke-width="2"/><ellipse cx="24" cy="34" rx="18" ry="4" fill="#e2e8f0"/><path d="M34 20v14" stroke="#3182ce" stroke-width="4" stroke-linecap="round"/><path d="M30 24v8" stroke="#63b3ed" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="32" cy="34" rx="6" ry="2" fill="#90cdf4"/></svg>',
    '<svg class="seq-icon-img" viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="8" width="32" height="4" rx="2" fill="#718096"/><circle cx="10" cy="10" r="3.5" fill="#4a5568"/><circle cx="38" cy="10" r="3.5" fill="#4a5568"/><path d="M13 12h22v26a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V12z" fill="#fed7aa" stroke="#f97316" stroke-width="2.5" stroke-linejoin="round"/><line x1="16" y1="28" x2="32" y2="28" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/><line x1="16" y1="33" x2="32" y2="33" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/><path d="M13 37h22v2a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2v-2z" fill="#fdba74"/></svg>'
  ];
  const items=[icons[0]+'<span>물 묻히기</span>',icons[1]+'<span>비누칠하기</span>',icons[2]+'<span>물로 헹구기</span>',icons[3]+'<span>수건으로 닦기</span>'];
  holder.innerHTML=`<p class="play-guide">먼저 할 일부터 차례로 눌러요. 틀려도 다시 고를 수 있어요.</p><div class="play-sequence">${state.sequence.map((n,i)=>`<span class="seq-step-pill">${i+1}. ${items[n]}</span>`).join('')||'선택한 순서가 여기에 보여요.'}</div><div class="play-grid">${[3,1,0,2].map(n=>button(items[n],'sequence',`data-index="${n}" ${state.sequence.includes(n)?'disabled':''}`)).join('')}</div><div class="care-actions">${button('처음부터','reset-sequence')}${button('순서 확인','check-sequence')}</div><p id="playFeedback" role="status"></p>`;
}
if(kind==='memory'){const m=state.memory;holder.innerHTML=`<p class="play-guide">${m.preview?'친구들의 자리를 살펴보세요. <strong id="memoryCountdown">5초</strong> 뒤 자동으로 가려져요.':'한 번에 두 장씩 골라주세요. 시간제한은 없어요.'}</p><div class="play-grid memory-four">${m.cards.map((c,i)=>{const visible=m.preview||m.open.includes(i)||m.matched.includes(i);return button(visible?c.value:'❔','memory',`data-index="${i}" aria-label="${i+1}번 카드 ${visible?(c.value==='🐰'?'토끼':'고양이'):'뒷면'}" ${m.preview||m.matched.includes(i)||m.open.includes(i)?'disabled':''}`);}).join('')}</div><div class="care-actions">${button(m.preview?'카드 가리기':'모두 보기','memory-preview')}${m.mismatch?button('다시 고르기','memory-retry'):''}${button('처음부터','reset-memory')}</div><p id="playFeedback" role="status">${m.matched.length===4?'모든 친구를 찾으셨어요!':m.mismatch?'서로 다른 친구네요. 다시 고르기를 눌러 천천히 찾아보아요.':''}</p>`;
if(m.preview){
 let remaining=5;
 memoryPreviewTimer=setInterval(()=>{
  if(state.memory!==m||LessonEngine.currentLesson?.id!=='variety_play'||LessonEngine.currentLesson.steps[LessonEngine.currentStepIndex]?.varietyKind!=='memory'||!document.getElementById('lessonViewport')?.classList.contains('active')){
   clearInterval(memoryPreviewTimer);memoryPreviewTimer=null;return;
  }
  remaining--;
  const countdown=document.getElementById('memoryCountdown');
  if(countdown)countdown.textContent=remaining+'초';
  if(remaining<=0){m.preview=false;m.open=[];m.mismatch=false;renderPlay();}
 },1000);
}
}
if(kind==='listen'){holder.innerHTML=`<div class="play-clue"><strong>💡 힌트</strong><p>빨갛고 동그란 과일이에요.<br>한 입 베어 물면 아삭아삭해요.</p></div><div class="care-actions">${button('🔊 힌트 듣기','listen')}${button('💡 더 쉬운 힌트','text-clue')}</div>${state.textClue?'<p class="play-clue extra-fruit-clue" role="status">🍎 이 그림과 같은 과일을 찾아요.<br>이름은 “사”로 시작해요.</p>':''}<div class="play-grid fruit-hint-choices">${['바나나','사과','포도'].map((v,i)=>button('<span class="fruit-picture" aria-hidden="true">'+['🍌','🍎','🍇'][i]+'</span><span>'+v+'</span>','heard',`data-index="${i}" aria-pressed="${state.heardChoice===i}"`)).join('')}</div><p id="playFeedback" role="status">${state.heardChoice===1?'사과를 찾으셨어요! 빨갛고 동그란 사과예요.':''}</p>`;}

}
document.addEventListener('DOMContentLoaded',()=>{
const section=document.createElement('section');section.className='friend-selection care-card';section.innerHTML=`<h2>오늘 함께할 친구를 골라주세요</h2><p>콩이는 체조, 토리는 마음, 나비는 기억, 보리는 음악을 함께해요.</p><div class="friend-grid">${friends.map(f=>`<button type="button" class="friend-choice" data-friend="${f.id}" aria-pressed="false"><img src="${path(f.image)}" alt="${f.animal} 친구 ${f.name}"><strong>${f.emoji} ${f.name}</strong><span class="friend-role">${f.badge}</span><span class="friend-guide">${f.message}</span><span class="friend-voice-tag">${f.voiceDesc}</span><span class="friend-voice-hint">🔊 목소리 듣기</span></button>`).join('')}</div><div class="variety-start"><div><h3>🧩 친구와 다양한 놀이</h3><p>원하는 놀이를 골라 바로 시작하거나, 전체 놀이를 차례대로 즐겨보세요.</p><div class="variety-chips-grid"><button type="button" class="variety-chip-btn" data-variety-step="0">🖼️ 같은 그림 찾기</button><button type="button" class="variety-chip-btn" data-variety-step="1">⭕ O / X 놀이</button><button type="button" class="variety-chip-btn" data-variety-step="2">👐 순서 맞추기</button><button type="button" class="variety-chip-btn" data-variety-step="3">🧠 그림 기억 놀이</button><button type="button" class="variety-chip-btn" data-variety-step="4">🍎 힌트로 과일 찾기</button><button type="button" class="variety-chip-btn" data-variety-step="5">💖 내 마음 표현하기</button></div></div><button type="button" class="care-btn primary" id="startVariety">놀이 전체 시작 ▶</button></div><p class="friend-status" role="status"></p>`;document.querySelector('.section-lessons').before(section);
const start=LessonEngine.startLesson.bind(LessonEngine);LessonEngine.startLesson=id=>{if(id==='variety_play')state=defaults();start(id);};
const render=LessonEngine.renderCurrentStep.bind(LessonEngine);LessonEngine.renderCurrentStep=()=>{render();companion();if(LessonEngine.currentLesson?.id==='variety_play'&&playRun!==LessonEngine.startTime){state=defaults();playRun=LessonEngine.startTime;}renderPlay();};
const speak=VoiceManager.speak.bind(VoiceManager);VoiceManager.speak=(input,...args)=>{const f=friend();const name=f.name;VoiceManager.characterId=f.id;const replace=v=>typeof v==='string'?v.replaceAll('콩이',name):v;if(input&&typeof input==='object')input={...input,voiceScript:replace(input.voiceScript),text:replace(input.text)};else input=replace(input);return speak(input,...args);};
document.getElementById('startVariety').onclick=()=>LessonEngine.startLesson('variety_play');
new MutationObserver(()=>{section.hidden=document.querySelector('.hero-classroom').hidden;}).observe(document.querySelector('.hero-classroom'),{attributes:true,attributeFilter:['hidden']});
document.addEventListener('click',e=>{const b=e.target.closest('[data-friend]');if(!b)return;const next=b.dataset.friend;let saved=true;try{localStorage.setItem('digital_school_friend',next);}catch{saved=false;}VoiceManager.stopSpeaking();selected=next;VoiceManager.characterId=next;companion();const f=friend();section.querySelector('.friend-status').textContent=f.name+' 친구와 함께해요. ('+f.voiceDesc+')'+(saved?'':' 이번 선택은 브라우저에 저장하지 못했습니다.');window.CharacterAudioPlayer?.select(next);});
document.addEventListener('click',e=>{
  const chip=e.target.closest('[data-variety-step]');
  if(chip){
    const stepIdx=Number(chip.dataset.varietyStep);
    LessonEngine.startLesson('variety_play');
    if(LessonEngine.currentLesson?.id==='variety_play'){
      LessonEngine.currentStepIndex=stepIdx;
      LessonEngine.renderCurrentStep();
    }
    return;
  }
  const b=e.target.closest('[data-play]');if(!b||LessonEngine.currentLesson?.id!=='variety_play')return;
  const n=Number(b.dataset.index);VoiceManager.clearInactivityTimer();
  switch(b.dataset.play){
    case'sequence':state.sequence.push(n);savePlay('sequence',state.sequence);renderPlay();break;
    case'reset-sequence':state.sequence=[];savePlay('sequence',[]);renderPlay();break;
    case'check-sequence':
      if(state.sequence.length!==4){
        announce('네 가지를 모두 골라주세요.');
      }else if(state.sequence.every((v,i)=>v===i)){
        announce('손 씻는 순서를 차근차근 찾으셨어요! 참 잘하셨어요.');
        setTimeout(()=>{if(LessonEngine.currentLesson?.id==='variety_play'&&LessonEngine.currentStepIndex===2)LessonEngine.nextStep();},1500);
      }else{
        announce('물을 먼저 묻혀요. 처음부터 버튼으로 다시 함께 해볼까요?');
      }
      break;
    case'memory-preview':state.memory.preview=!state.memory.preview;state.memory.open=[];state.memory.mismatch=false;renderPlay();break;
    case'memory-retry':state.memory.open=[];state.memory.mismatch=false;renderPlay();break;
    case'reset-memory':state.memory=defaults().memory;savePlay('memory',{matchedPairs:0});renderPlay();break;
    case'memory':{
      const m=state.memory;if(m.preview||m.mismatch||m.open.includes(n)||m.matched.includes(n))return;
      m.open.push(n);
      if(m.open.length===2){
        if(m.cards[m.open[0]].value===m.cards[m.open[1]].value){
          m.matched.push(...m.open);m.open=[];savePlay('memory',{matchedPairs:m.matched.length/2});
        }else m.mismatch=true;
      }
      renderPlay();
      if(m.matched.length===4){
        VoiceManager.speak('모든 친구를 찾으셨어요! 참 잘하셨어요.');
        setTimeout(()=>{if(LessonEngine.currentLesson?.id==='variety_play'&&LessonEngine.currentStepIndex===3)LessonEngine.nextStep();},1500);
      }
      break;
    }
    case'listen':state.listened=true;VoiceManager.speak('빨갛고 동그란 과일이에요. 한 입 베어 물면 아삭아삭해요. 어떤 과일일까요?');break;
    case'text-clue':state.textClue=true;renderPlay();VoiceManager.speak('이 그림과 같은 과일을 찾아요. 이름은 사로 시작해요.');break;
    case'heard':
      state.heardChoice=n;if(n!==1)state.textClue=true;savePlay('listen',{choice:n,textClue:state.textClue});renderPlay();
      if(n===1){
        announce('사과를 찾으셨어요! 빨갛고 동그란 사과예요.');
        setTimeout(()=>{if(LessonEngine.currentLesson?.id==='variety_play'&&LessonEngine.currentStepIndex===4)LessonEngine.nextStep();},1500);
      }else{
        announce('괜찮아요. 힌트의 빨간 사과 그림과 같은 것을 다시 골라볼까요?');
      }
      break;
  }
});
companion();
const talkImages={};
friends.forEach(f=>{const img=new Image();img.src=path('friend-'+f.id+'-talk.png');talkImages[f.id]=img;});
let talkTimer=null,open=false;
const portraits=()=>document.querySelectorAll('.hero-robot-img,.ai-friend-avatar-img,.completion-robot-img');
function frame(talking){
 const f=friend(),asset=talkImages[f.id];
 const src=talking&&asset.complete&&asset.naturalWidth?asset.src:path(f.image);
 portraits().forEach(img=>img.src=src);
}
const speaking=VoiceManager.setTeacherSpeaking.bind(VoiceManager);
VoiceManager.setTeacherSpeaking=value=>{
 speaking(value);clearInterval(talkTimer);talkTimer=null;open=false;
 frame(value);
 document.querySelectorAll('.voice-status-badge').forEach(b=>b.textContent=friend().name+(value?'가 이야기하고 있어요':' 목소리 듣기'));
 if(value&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   open=true;
   talkTimer=setInterval(()=>{open=!open;frame(open);},700);
 }
};
const greet=document.createElement('button');
greet.type='button';greet.className='care-btn character-greet';
greet.textContent='🔊 친구 목소리 듣기';
greet.onclick=()=>window.CharacterAudioPlayer?.select(friend().id,true);
document.querySelector('.hero-robot-wrapper').append(greet);
window.addEventListener('pagehide',()=>{clearInterval(talkTimer);clearInterval(memoryPreviewTimer);});
});
})();
