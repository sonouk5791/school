(()=>{
'use strict';
const definitions=[
{id:'word_cross',title:'가로세로 낱말놀이',icon:'✏️',prompt:'힌트를 보고 빈칸에 들어갈 낱말을 골라주세요.',help:'가로 사과, 세로 과일, 가로 일기가 서로 이어져요.'},
{id:'picture_puzzle',title:'그림 조각 퍼즐',icon:'🧩',prompt:'조각을 누르고, 들어갈 자리를 눌러주세요.',help:'완성 그림을 보며 조각을 맞춰요. 자리 힌트를 누르면 번호로도 찾을 수 있어요.'},
{id:'picture_bingo',title:'그림 빙고',icon:'🎯',prompt:'불러주는 그림을 찾아 한 줄을 만들어보세요.',help:'위에 나온 그림과 같은 칸을 눌러요. 가로, 세로, 대각선 중 한 줄이면 빙고예요.'}
];
definitions.forEach(d=>window.LESSON_CATALOG.push({id:d.id,title:d.title,icon:d.icon,summary:d.prompt,steps:Array.from({length:20},(_,i)=>({prompt:d.prompt,screenText:d.title+' · '+(i+1)+'/20',voiceScript:d.prompt,helpScript:d.id==='word_cross'?'힌트와 첫 글자를 보고 골라주세요.':d.help,gameKind:d.id,options:[]}))}));
const words=[{label:'① 가로',hint:'🍎 빨갛고 동그란 과일이에요.',answer:'사과',choices:['사과','우유','나무'],cells:[0,1]},{label:'② 세로',hint:'🍎 🍇 사과와 포도를 함께 부르는 말이에요.',answer:'과일',choices:['바다','과일','모자'],cells:[1,4]},{label:'③ 가로',hint:'📖 오늘 있었던 일을 적는 글이에요.',answer:'일기',choices:['의자','구두','일기'],cells:[4,5]}];
const items=[
  '🍎 사과','🍌 바나나','🍇 포도','🌻 해바라기','🐶 강아지','🐰 토끼','🐱 고양이','🐻 곰','🦋 나비','🍓 딸기',
  '🍊 귤','🍐 배','🍉 수박','🍒 체리','🍑 복숭아','🥕 당근','🥔 감자','🌽 옥수수','🥒 오이','🍆 가지',
  '🌹 장미','🌷 튤립','🌲 소나무','🐮 소','🐷 돼지','🐔 닭','🐥 병아리','🐸 개구리','🐢 거북이','🐟 물고기',
  '🦀 게','🐙 문어','🐝 벌','🐘 코끼리','🦁 사자','🐴 말','🌰 알밤','🍠 고구마','🌼 국화','🕊️ 비둘기',
  '🍞 식빵','🍙 주먹밥','🪑 의자','👒 모자','🎈 풍선','🚗 자동차','🚲 자전거','🪕 기타','☂️ 우산','🏮 초롱',
  '🌾 벼이삭','🍁 단풍잎','🌸 벚꽃','🌺 무궁화','🦆 오리','🦌 사슴','🐿️ 다람쥐','🐳 고래','🦜 앵무새','🍇 머루'
];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
let image='assets/images/ai_puppy_friend.jpg';
let run=null,game=null,data=null;
const puzzleSize=()=>[[2,2],[4,2],[4,3],[5,4]][Math.min(3,Math.floor(Math.max(0,round)/5))];
const pieceCount=()=>puzzleSize()[0]*puzzleSize()[1];
const boardSize=()=>3+Math.floor(Math.max(0,round)/5);
const fresh=()=>{
  const pool=shuffle(items).slice(0,boardSize()**2);
  return {tierVersion:3,puzzleVersion:2,word:0,solved:[],hint:false,pieces:shuffle(Array.from({length:pieceCount()},(_,i)=>i)),placed:[],selected:null,board:shuffle(pool),calls:shuffle(pool),call:-1,marked:[],message:''};
};
const btn=(text,action,attrs='')=>`<button type="button" class="play-button" data-game="${action}" ${attrs}>${text}</button>`;
function lines(){const size=boardSize(),list=[];for(let n=0;n<size;n++){list.push(Array.from({length:size},(_,i)=>n*size+i));list.push(Array.from({length:size},(_,i)=>i*size+n));}list.push(Array.from({length:size},(_,i)=>i*size+i),Array.from({length:size},(_,i)=>i*size+size-1-i));return list.filter(line=>line.every(i=>data.marked.includes(i))).length;}

function say(message){data.message=message;save();render();VoiceManager.speak(message);}
function advanceAfterCompletion() {
 const capturedState = data, capturedRun = LessonEngine.startTime, capturedStep = LessonEngine.currentStepIndex, capturedId = game;
 setTimeout(() => {
  if (data !== capturedState || LessonEngine.startTime !== capturedRun || LessonEngine.currentStepIndex !== capturedStep || LessonEngine.currentLesson?.id !== capturedId || !document.getElementById('lessonViewport')?.classList.contains('active')) return;
  LessonEngine.nextStep();
 }, 1500);
}
function save(){const copy=JSON.parse(JSON.stringify(data));copy.complete=game==='word_cross'?data.solved.length===words.length:game==='picture_puzzle'?data.placed.length===pieceCount():lines()>0;LessonEngine.selectedAnswers['game_'+game+'_'+round]=copy;DailyGames.save(activeDay,game,round,copy);}
let round=-1,activeDay='';
function render(){
 const lesson=LessonEngine.currentLesson;
 if(!definitions.some(d=>d.id===lesson?.id)||LessonEngine.currentStepIndex>=20)return;
 if(run!==LessonEngine.startTime||game!==lesson.id||round!==LessonEngine.currentStepIndex){run=LessonEngine.startTime;game=lesson.id;round=LessonEngine.currentStepIndex;activeDay=DailyGames.day();words.splice(0,words.length,...DailyGames.words(activeDay,round));image=DailyGames.image(activeDay,round);data=DailyGames.read(activeDay,game,round)||fresh();if(['word_cross','picture_bingo'].includes(game)&&data.tierVersion!==3){data=fresh();save();}if(game==='picture_puzzle'&&data.pieces.length!==pieceCount()){data=fresh();save();}}
 const el=document.getElementById('choiceOptionsGrid');if(!el)return;el.className='variety-widget extra-game';
 let html='';
 if(game==='word_cross'){
 const cols=Math.ceil(words.length/2)+1,rows=Math.floor(words.length/2)+1,active=words.flatMap(w=>w.cells);const w=words[data.word],letters={};data.solved.forEach(n=>words[n].cells.forEach((cell,i)=>letters[cell]=words[n].answer[i]));
 html=`<p class="play-guide">${rows}×${cols} 낱말판 · ${words.length}개 단어 · ${['쉬움','보통','도전','고급'][Math.floor(round/5)]}</p><div class="cross-board" style="--cross-cols:${cols}" aria-label="서로 이어지는 낱말판">${Array.from({length:rows*cols},(_,i)=>active.includes(i)?`<div class="cross-cell ${w.cells.includes(i)?'current':''}"><small>${words.findIndex(w=>w.cells[0]===i)>=0?words.findIndex(w=>w.cells[0]===i)+1:''}</small>${letters[i]||'□'}</div>`:'<div class="cross-block"></div>').join('')}</div><div class="care-actions">${words.map((v,i)=>btn(v.label,'word-select',`data-n="${i}" aria-pressed="${data.word===i}"`)).join('')}</div><p class="play-clue">${w.label}: ${w.hint}${data.hint?'<br>첫 글자는 “'+w.answer[0]+'”예요.':''}</p><div class="play-grid">${w.choices.map((v,i)=>btn(v,'word-answer',`data-n="${i}" ${data.solved.includes(data.word)?'disabled':''}`)).join('')}</div>${btn('💡 첫 글자 힌트','hint')}`;
 }
 if(game==='picture_puzzle'){
 const [cols,rows]=puzzleSize();const position=n=>`${n%cols*100/(cols-1)}% ${Math.floor(n/cols)*100/(rows-1)}%`;const gridStyle=`--puzzle-cols:${cols};--puzzle-rows:${rows}`;
 html=`<p class="play-guide">${pieceCount()}조각 · ${['쉬움','보통','도전','고급'][Math.floor(round/5)]} · 완성 그림을 보며 맞춰요. 조각 → 빈자리를 차례로 눌러주세요.</p><img class="puzzle-reference" src="${image}" alt="완성할 그림"><div class="puzzle-board" style="${gridStyle}">${Array.from({length:pieceCount()},(_,i)=>i).map(n=>`<button type="button" class="puzzle-cell ${data.placed.includes(n)?'filled':''}" data-game="puzzle-place" data-n="${n}" aria-label="${n+1}번 자리${data.placed.includes(n)?' 완성':''}" ${data.placed.includes(n)?'disabled':''} style="${data.placed.includes(n)?'background-image:url('+image+');background-position:'+position(n):''}">${data.placed.includes(n)?'':n+1}</button>`).join('')}</div><p>아래에서 조각을 골라주세요.</p><div class="puzzle-pieces" style="${gridStyle}">${data.pieces.map(n=>`<button type="button" class="puzzle-cell filled" data-game="puzzle-select" data-n="${n}" aria-label="그림 조각 ${n+1}" aria-pressed="${data.selected===n}" ${data.placed.includes(n)?'disabled':''} style="background-image:url(${image});background-position:${position(n)}">${data.hint?'<span class="piece-number">'+(n+1)+'번 자리</span>':''}</button>`).join('')}</div>${btn('💡 자리 힌트','hint')}`;
 }
  if(game==='picture_bingo'){
  const called=data.calls[data.call];
  html=`<p class="play-clue">${called?'찾을 그림: <strong>'+called+'</strong>':'게임시작을 누르면 시작해요.'}</p><div class="care-actions">${data.call<0?btn('🎯 게임시작','bingo-call'):btn('🔊 다시 듣기','bingo-call')}${btn('💡 위치 힌트','hint')}</div><p class="play-guide">${boardSize()}×${boardSize()} · ${data.board.length}칸 · ${['쉬움','보통','도전','고급'][Math.floor(round/5)]}</p><div class="bingo-board" style="--bingo-cols:${boardSize()}">${data.board.map((v,n)=>btn((data.marked.includes(n)?'✓ ':'')+v,'bingo-mark',`data-n="${n}" aria-pressed="${data.marked.includes(n)}" ${data.marked.includes(n)?'disabled':''} ${data.hint&&v===called?'data-highlight="true"':''}`)).join('')}</div><p>가로 · 세로 · 대각선 중 한 줄을 완성해요.</p>`;
  }
 el.innerHTML=`<p class="play-guide">${activeDay} · 오늘의 놀이 ${round+1} / 20 · 5개씩 쉬어 가세요.</p><p id="dailySaveWarning" role="status"></p>`+html+`<p id="gameFeedback" role="status">${data.message}</p>`+btn('이 문제 다시','reset');
 if(game==='picture_puzzle'){
  const reference=el.querySelector('.puzzle-reference');
  const resize=()=>{if(reference.naturalWidth&&reference.naturalHeight)el.querySelectorAll('.puzzle-board,.puzzle-pieces').forEach(grid=>grid.style.setProperty('--image-ratio',reference.naturalWidth/reference.naturalHeight));};
  reference.addEventListener('load',resize,{once:true});resize();
 }

}
document.addEventListener('DOMContentLoaded',()=>{
 const home=document.querySelector('.friend-selection');
 const panel=document.createElement('div');panel.className='extra-game-launchers';panel.innerHTML=definitions.map(d=>`<div><h3>${d.icon} ${d.title}</h3><p data-daily-count="${d.id}">하루 20개</p><button type="button" class="care-btn primary" data-launch-game="${d.id}">오늘 놀이 · 이어하기</button></div>`).join('');home.append(panel);DailyGames.counts();
 const original=LessonEngine.renderCurrentStep.bind(LessonEngine);
 LessonEngine.renderCurrentStep=()=>{original();render();};
 document.addEventListener('click',e=>{
  const launch=e.target.closest('[data-launch-game]');if(launch){const id=launch.dataset.launchGame;LessonEngine.startLesson(id);if(LessonEngine.currentLesson?.id===id){LessonEngine.currentStepIndex=DailyGames.next(id);LessonEngine.renderCurrentStep();}return;}
  const b=e.target.closest('[data-game]');if(!b||LessonEngine.currentLesson?.id!==game||LessonEngine.currentStepIndex>=20)return;
  VoiceManager.clearInactivityTimer();const n=Number(b.dataset.n),a=b.dataset.game;
  if(a==='reset'){data=fresh();save();render();return;}
  if(a==='hint'){data.hint=true;save();say(game==='picture_puzzle'?'조각에 표시된 번호와 같은 자리를 눌러주세요.':game==='picture_bingo'?(data.call<0?'게임시작을 먼저 눌러주세요.':'초록 테두리의 그림을 눌러주세요.'):'첫 글자는 '+words[data.word].answer[0]+'예요.');return;}
  if(a==='word-select'){data.word=n;data.hint=false;data.message='';render();}
  if(a==='word-answer'){
    const w=words[data.word];
    if(w.choices[n]===w.answer){
      if(!data.solved.includes(data.word)) data.solved.push(data.word);
      const isComplete = data.solved.length === words.length;
      if (isComplete) {
        save();
        say('모든 낱말이 이어졌어요! 참 잘하셨어요.');
        advanceAfterCompletion();
      } else {
        // 정답을 맞히면 바로 다음 미해결 낱말 칸으로 자동 전환
        let nextWord = (data.word + 1) % words.length;
        while (data.solved.includes(nextWord)) {
          nextWord = (nextWord + 1) % words.length;
        }
        data.word = nextWord;
        data.hint = false;
        save();
        say(w.answer + ' 맞아요! 다음 ' + words[nextWord].label + ' 문제를 풀어보아요.');
      }
    } else {
      data.hint=true;
      say('괜찮아요. 첫 글자 '+w.answer[0]+'로 시작하는 낱말을 찾아보세요.');
    }
  }
  if(a==='puzzle-select'){data.selected=n;say('조각을 골랐어요. 들어갈 자리를 눌러주세요.');}
  if(a==='puzzle-place'){
    if(data.selected===null)say('아래 그림 조각을 먼저 골라주세요.');
    else if(data.selected===n){
      data.placed.push(n);data.selected=null;
      const isComplete = data.placed.length === pieceCount();
      save();
      say(isComplete ? '그림을 완성했어요! 참 잘하셨어요.' : '알맞은 자리를 찾았어요.');
      if (isComplete) {
        advanceAfterCompletion();
      }
    } else {
      data.hint=true;say('다른 자리예요. 조각에 표시된 번호와 같은 자리를 찾아보세요.');
    }
  }
  if(a==='bingo-call'&&!lines()){
    if(data.call<0){
      data.call=0;
      data.hint=false;
      save();
      say(data.calls[data.call]+' 그림을 찾아 눌러주세요.');
    } else {
      VoiceManager.speak(data.calls[data.call]+' 그림을 찾아 눌러주세요.');
    }
  }
  if(a==='bingo-repeat'&&data.call>=0){
    VoiceManager.speak(data.calls[data.call]+' 그림을 찾아 눌러주세요.');
  }
  if(a==='bingo-mark'){
    if(data.call<0){
      say('게임시작을 먼저 눌러주세요.');
    } else if(data.board[n]===data.calls[data.call]){
      if(!data.marked.includes(n)) data.marked.push(n);
      const isWon = lines() > 0;
      if (isWon) {
        save();
        say('빙고! 한 줄을 완성했어요! 참 잘하셨어요.');
        advanceAfterCompletion();
      } else {
        const currentName = data.board[n];
        if (data.call < data.calls.length - 1) {
          data.call++;
        }
        data.hint = false;
        save();
        say(currentName + ' 맞아요! 다음은 ' + data.calls[data.call] + ' 그림을 찾아보세요.');
      }
    } else {
      data.hint=true;
      say('위에 나온 그림과 같은 칸을 찾아보세요. 초록 테두리로 알려드릴게요.');
    }
  }
 });
});
})();

