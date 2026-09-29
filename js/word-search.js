(()=>{
'use strict';
const id='word_search',labels=['쉬움','보통','도전','고급'];
window.LESSON_CATALOG.push({id,title:'단어 찾기',icon:'🔎',summary:'글자판에서 단어를 찾아요. 하루 20판.',steps:Array.from({length:20},(_,i)=>({prompt:'단어의 첫 글자와 마지막 글자를 차례로 눌러주세요.',screenText:'단어 찾기 · '+labels[Math.floor(i/5)]+' · '+(i+1)+'/20',voiceScript:'찾을 단어를 보고 첫 글자와 마지막 글자를 차례로 눌러주세요. 위치 힌트도 볼 수 있어요.',helpScript:'가로, 세로로 이어지는 글자를 찾아요. 도전 단계부터 대각선도 있어요. 첫 글자를 잘못 눌렀으면 선택 지우기를 눌러주세요.',options:[]}))});
let state,round=-1,run=null,date='';
function generate(boardDate=date,boardRound=round){
 const level=Math.floor(boardRound/5),size=4+level,count=2+level;
 let seed=Number(boardDate.replaceAll('-',''))+boardRound*7919;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const pool=[
  '사과','나비','기차','모자','우산','장미','포도','바나나','강아지','해바라기',
  '고양이','부채','토끼','두부','감자','소금','비누','구두','의자','딸기',
  '복숭아','참외','수박','도토리','다람쥐','소나무','개나리','진달래','코스모스','단풍잎',
  '무지개','달팽이','호박','당근','배추','옥수수','고구마','시금치','도라지','고사리',
  '비둘기','까치','제비','병아리','송아지','망아지','물고기','개구리','올챙이','반딧불',
  '장독대','항아리','복주머니','버선','한복','돌담길','윷놀이','풍선','피리','하모니카',
  '태극기','샛별','초승달','보름달','은하수','소나기','눈사람','선풍기','주전자'
 ];
 const dirs=level<2?[[0,1],[1,0]]:[[0,1],[1,0],[1,1]];
 const allDirs=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
 for(let retry=0;retry<500;retry++){
  const grid=Array(size*size).fill(''),targets=[];
  for(const word of shuffle(pool)){
   if(targets.length===count)break;
   const positions=[];
   for(const [dr,dc] of dirs)for(let r=0;r<size;r++)for(let c=0;c<size;c++){
    if(r+dr*(word.length-1)>=size||c+dc*(word.length-1)>=size)continue;
    const path=Array.from(word,(_,i)=>(r+dr*i)*size+c+dc*i);
    if(path.every(n=>!grid[n]))positions.push(path);
   }
   if(!positions.length)continue;
   const path=positions[Math.floor(random()*positions.length)];
   path.forEach((n,i)=>grid[n]=word[i]);targets.push({word,path});
  }
  if(targets.length!==count)continue;
  // Filler never uses target syllables, so it cannot create extra target words.
  const used=new Set(targets.flatMap(t=>Array.from(t.word)));
  const filler=shuffle(Array.from('가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호구누두루무부수우주추쿠투푸후개내대래매배새애재채캐태패해').filter(c=>!used.has(c)));
  let f=0;const filled=grid.map(v=>v||filler[f++%filler.length]);
  // Reject accidental second occurrences, including reversed and diagonal ones.
  const unique=targets.every(t=>{
   let occurrences=0;
   for(let r=0;r<size;r++)for(let c=0;c<size;c++)for(const [dr,dc] of allDirs){
    const er=r+dr*(t.word.length-1),ec=c+dc*(t.word.length-1);
    if(er<0||er>=size||ec<0||ec>=size)continue;
    if(Array.from(t.word).every((ch,i)=>filled[(r+dr*i)*size+c+dc*i]===ch))occurrences++;
   }
   return occurrences===1;
  });
  if(unique)return {layoutVersion:2,size,targets,grid:filled,found:[],start:null,hint:false,message:'',complete:false};
 }
 throw new Error('단어판을 만들지 못했어요. 다시 시작해주세요.');
}
window.WordSearchBoards={generate};

function advanceAfterCompletion() {
 const capturedState = state, capturedRun = LessonEngine.startTime, capturedStep = LessonEngine.currentStepIndex, capturedId = id;
 setTimeout(() => {
  if (state !== capturedState || LessonEngine.startTime !== capturedRun || LessonEngine.currentStepIndex !== capturedStep || LessonEngine.currentLesson?.id !== capturedId || !document.getElementById('lessonViewport')?.classList.contains('active')) return;
  LessonEngine.nextStep();
 }, 1500);
}
function save(){state.complete=state.found.length===state.targets.length;DailyGames.save(date,id,round,state);LessonEngine.selectedAnswers['game_'+id+'_'+round]=JSON.parse(JSON.stringify(state));}
function render(){
 if(LessonEngine.currentLesson?.id!==id||LessonEngine.currentStepIndex>=20)return;
 if(run!==LessonEngine.startTime||round!==LessonEngine.currentStepIndex){run=LessonEngine.startTime;round=LessonEngine.currentStepIndex;date=DailyGames.day();state=DailyGames.read(date,id,round)||generate();if(state.layoutVersion!==2){state=generate();state.message='겹치지 않는 새 단어판으로 바꿨어요.';save();}}
 const el=document.getElementById('choiceOptionsGrid');if(!el)return;
 const target=state.targets.find((_,i)=>!state.found.includes(i));
 const marked=state.targets.flatMap((t,i)=>state.found.includes(i)?t.path:[]);
 el.className='variety-widget search-game';
 el.innerHTML=`<p>${date} · ${round+1}/20 · ${labels[Math.floor(round/5)]} · ${state.size}×${state.size} 글자판</p><p class="play-clue">찾을 단어: ${state.targets.map((t,i)=>state.found.includes(i)?'✓ '+t.word:t.word).join(' · ')}</p><p>가로 · 세로${round>=10?' · 대각선':''}로 찾아요. 첫 글자 → 마지막 글자를 눌러주세요.</p><div class="search-grid" style="--search-size:${state.size}">${state.grid.map((v,n)=>`<button type="button" data-search-cell="${n}" class="${marked.includes(n)?'found ':''}${state.hint&&target?.path.includes(n)?'hint':''}" aria-pressed="${state.start===n}" aria-label="${Math.floor(n/state.size)+1}행 ${n%state.size+1}열 ${v}">${v}</button>`).join('')}</div><div class="care-actions"><button class="care-btn" data-search-action="hint">💡 위치 힌트</button><button class="care-btn" data-search-action="clear">선택 지우기</button><button class="care-btn" data-search-action="reset">이 문제 다시</button></div><p role="status" id="searchFeedback">${state.message}</p><p id="dailySaveWarning" role="status"></p>`;
}
function feedback(text){state.message=text;save();render();VoiceManager.speak(text);}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelector('.extra-game-launchers').insertAdjacentHTML('beforeend','<div><h3>🔎 단어 찾기</h3><p data-daily-count="word_search"></p><button type="button" class="care-btn primary" id="startWordSearch">오늘 놀이 · 이어하기</button></div>');
 DailyGames.counts();
 document.getElementById('startWordSearch').onclick=()=>{LessonEngine.startLesson(id);if(LessonEngine.currentLesson?.id===id){LessonEngine.currentStepIndex=DailyGames.next(id);LessonEngine.renderCurrentStep();}};
 const original=LessonEngine.renderCurrentStep.bind(LessonEngine);LessonEngine.renderCurrentStep=()=>{original();render();};
 document.addEventListener('click',e=>{
  if(LessonEngine.currentLesson?.id!==id||LessonEngine.currentStepIndex>=20)return;
  const action=e.target.closest('[data-search-action]'),cell=e.target.closest('[data-search-cell]');
  if(!action&&!cell)return;VoiceManager.clearInactivityTimer();
  if(action){if(action.dataset.searchAction==='reset'){state=generate();save();render();}
   if(action.dataset.searchAction==='clear'){state.start=null;feedback('선택을 지웠어요. 첫 글자부터 골라주세요.');}
   if(action.dataset.searchAction==='hint'){state.hint=true;feedback('초록색으로 표시한 단어의 첫 글자와 마지막 글자를 눌러주세요.');}return;}
  const n=Number(cell.dataset.searchCell);
  if(state.start===null){state.start=n;feedback('이제 단어의 마지막 글자를 눌러주세요.');return;}
  const start=state.start;state.start=null;
  const a=[Math.floor(start/state.size),start%state.size],b=[Math.floor(n/state.size),n%state.size],dr=b[0]-a[0],dc=b[1]-a[1];
  if(dr&&dc&&(Math.abs(dr)!==Math.abs(dc)||round<10)){feedback('일직선으로 이어진 단어를 찾아주세요.');return;}
  const length=Math.max(Math.abs(dr),Math.abs(dc))+1;
  const path=Array.from({length},(_,i)=>(a[0]+Math.sign(dr)*i)*state.size+a[1]+Math.sign(dc)*i);
  const word=path.map(i=>state.grid[i]).join('');
  const found=state.targets.findIndex((t,i)=>!state.found.includes(i)&&(t.word===word||t.word===Array.from(word).reverse().join('')));
  if(found>=0){
    state.targets[found].path=path;
    state.found.push(found);
    state.hint=false;
    if(state.found.length===state.targets.length){
      feedback('모든 단어를 찾았어요! 참 잘하셨어요.');
      advanceAfterCompletion();
    } else {
      const nextTarget = state.targets.find((_, i) => !state.found.includes(i));
      feedback(state.targets[found].word + ' 맞아요! 다음은 ' + (nextTarget ? '“' + nextTarget.word + '”' : '다음') + ' 단어를 찾아보세요.');
    }
  } else {
    feedback('괜찮아요. 위치 힌트를 보고 다시 찾아볼까요?');
  }
 });
});
})();
