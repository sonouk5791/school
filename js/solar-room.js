(()=>{
'use strict';
// Learning dates are approximate solar-calendar dates, not an astronomical calendar.
const raw=[
['입춘','2월 4일','🌱','봄의 문을 여는 때예요. 아직 추워도 새 계절을 기다려요.','봄을 기다리며 어떤 일을 하셨나요?'],
['우수','2월 19일','🌧️','눈과 얼음이 녹고 봄비를 떠올리는 때예요.','봄비가 내리던 날을 떠올려 볼까요?'],
['경칩','3월 6일','🐸','겨울잠을 자던 생물이 깨어나는 봄을 나타내요.','개구리 울음소리를 들어보셨나요?'],
['춘분','3월 21일','🌤️','봄에 낮과 밤의 길이가 비슷해지는 때예요.','따뜻한 봄날 어디로 산책하고 싶으세요?'],
['청명','4월 5일','🌿','하늘이 맑아지는 봄을 뜻해요. 들판도 푸르게 변해요.','맑은 봄 하늘 아래 무엇을 하고 싶으세요?'],
['곡우','4월 20일','🌾','곡식이 자라는 데 도움이 되는 봄비를 뜻해요.','봄에 씨앗을 심어본 기억이 있으세요?'],
['입하','5월 6일','🌳','여름이 시작됨을 알리는 때예요. 나뭇잎이 무성해져요.','나무 그늘에서 쉬던 이야기를 나눠요.'],
['소만','5월 21일','🌱','풀과 나무가 자라 세상이 푸르게 차오르는 때예요.','좋아하는 초록 식물은 무엇인가요?'],
['망종','6월 6일','🌾','벼와 보리처럼 까끄라기가 있는 곡식과 관련된 때예요. 농사일이 바빴어요.','보리밭이나 모내기를 본 기억이 있으세요?'],
['하지','6월 21일','☀️','우리나라에서 일 년 중 낮이 가장 긴 때예요.','해가 긴 여름날 무엇을 하며 지내셨나요?'],
['소서','7월 7일','🪭','작은 더위라는 뜻이에요. 본격적인 여름 더위를 맞는 때예요.','여름에 부채를 써보셨나요?'],
['대서','7월 23일','🍉','큰 더위라는 뜻이에요. 한여름의 더위를 나타내요.','시원한 수박을 누구와 나눠 드셨나요?'],
['입추','8월 8일','🌾','가을의 시작을 알리는 때예요. 실제 날씨는 아직 더울 수 있어요.','가을이 오면 무엇이 가장 먼저 생각나세요?'],
['처서','8월 23일','🍃','더위가 물러난다는 뜻이에요. 선선한 바람을 기다려요.','선선한 저녁에 누구와 걷고 싶으세요?'],
['백로','9월 8일','💧','흰 이슬이라는 뜻이에요. 풀잎에 맺힌 이슬을 떠올려요.','아침 풀잎의 물방울을 본 적이 있으세요?'],
['추분','9월 23일','🍂','가을에 낮과 밤의 길이가 비슷해지는 때예요.','가을 저녁의 기억을 들려주세요.'],
['한로','10월 8일','🍁','찬 이슬이라는 뜻이에요. 가을 공기가 차가워지는 때예요.','쌀쌀한 날 즐겨 입던 옷은 무엇인가요?'],
['상강','10월 23일','❄️','서리가 내린다는 뜻이에요. 늦가을 추위를 떠올려요.','하얀 서리가 내린 들판을 보셨나요?'],
['입동','11월 7일','🧣','겨울의 시작을 알리는 때예요. 겨울 채비를 떠올려요.','가족과 겨울 준비를 하던 이야기를 나눠요.'],
['소설','11월 22일','🌨️','작은 눈이라는 뜻이에요. 겨울 눈을 떠올리는 때예요.','첫눈이 오면 어떤 기분이 드세요?'],
['대설','12월 7일','☃️','큰 눈이라는 뜻이에요. 이름과 달리 꼭 눈이 많이 오는 것은 아니에요.','눈사람을 만들어본 적이 있으세요?'],
['동지','12월 22일','🌙','우리나라에서 일 년 중 밤이 가장 긴 때예요. 팥죽을 먹는 풍습이 있어요.','동지에 팥죽을 드신 기억이 있으세요?'],
['소한','1월 6일','🧤','작은 추위라는 뜻이지만 매우 추울 수 있어요.','추운 겨울 손을 어떻게 따뜻하게 하셨나요?'],
['대한','1월 20일','🧥','큰 추위라는 뜻이에요. 겨울의 끝자락에서 다음 봄을 기다려요.','겨울이 지나면 가장 하고 싶은 일은 무엇인가요?']
];
const seasons=['봄','여름','가을','겨울'],icons=['🌸','🌻','🍁','☃️'];
document.addEventListener('DOMContentLoaded',()=>{
 const hero=document.querySelector('.hero-classroom');if(!hero)return;
 const entry=document.createElement('section');entry.className='care-card solar-entry';
 entry.innerHTML='<div><h2>🌸 24절기 이야기방</h2><p>봄·여름·가을·겨울, 계절의 이야기를 함께 알아봐요.</p></div><button class="care-btn primary" id="openSolarRoom" type="button">24절기 방 들어가기</button>';
 (document.querySelector('.joint-room-entry')||hero).after(entry);
 const room=document.createElement('dialog');room.id='solarRoom';room.className='solar-room';room.setAttribute('aria-labelledby','solarTitle');
 room.innerHTML='<header class="solar-header"><h2 id="solarTitle">🌸 24절기 이야기방</h2><button class="care-btn" id="closeSolarRoom" type="button">◀ 방 나가기</button></header><p>24절기는 해의 위치를 기준으로 한 해를 나눈 24개의 계절 길잡이예요.</p><p class="solar-note">날짜는 양력의 대략적인 시기예요. 해마다 조금 달라지며, 실제 날씨는 지역과 해에 따라 달라요.</p><nav class="solar-seasons" aria-label="계절 고르기"></nav><div class="solar-list" aria-label="절기 고르기"></div><article id="solarDetail"></article><details class="solar-source"><summary>설명 참고 자료</summary><a href="https://www.alimi.or.kr/board/a/season/selectSeasonalDiv.do" target="_blank" rel="noopener noreferrer">한국농어촌공사 농어촌알리미 · 농사 24절기 ↗</a><br><a href="https://data.kma.go.kr/climate/solarTerms/solarTerms.do" target="_blank" rel="noopener noreferrer">기상청 · 연도별 24절기 날짜 확인 ↗</a></details>';
 document.body.append(room);let selected=0;
 const speak=t=>window.VoiceManager?.speak(t),stop=()=>window.VoiceManager?.stopSpeaking();
 function render(){
  const season=Math.floor(selected/6),d=raw[selected];
  room.querySelector('.solar-seasons').innerHTML=seasons.map((s,i)=>`<button type="button" data-season="${i}" aria-pressed="${season===i}">${icons[i]} ${s}</button>`).join('');
  room.querySelector('.solar-list').innerHTML=raw.slice(season*6,season*6+6).map((t,i)=>`<button type="button" data-term="${season*6+i}" aria-pressed="${selected===season*6+i}">${t[2]} ${t[0]}</button>`).join('');
  const options=selected%2?[seasons[(season+2)%4],seasons[season]]:[seasons[season],seasons[(season+2)%4]];
  room.querySelector('#solarDetail').innerHTML=`<div class="solar-story season-${season}"><span class="solar-symbol" aria-hidden="true">${d[2]}</span><div><p>${selected+1} / 24 · ${seasons[season]} 이야기</p><h3 tabindex="-1">${d[0]} <small>${d[1]} 무렵</small></h3><p class="solar-explain">${d[3]}</p></div></div><div class="solar-controls"><button type="button" data-solar="read">🔊 이야기 듣기</button><button type="button" data-solar="stop">■ 읽기 멈추기</button></div><div class="solar-memory"><h4>💬 추억을 나눠요</h4><p>${d[4]}</p><p class="solar-note">편하게 이야기해 주세요. 정답은 없어요.</p></div><div class="solar-quiz"><h4>함께 맞혀볼까요?</h4><p>${d[0]}는 어느 계절의 절기일까요?</p><button type="button" data-solar="hint">💡 힌트 보기</button><div class="solar-answers">${options.map(s=>`<button type="button" data-answer="${s}">${icons[seasons.indexOf(s)]} ${s}</button>`).join('')}</div><p id="solarFeedback" role="status" aria-live="polite"></p></div><div class="solar-controls"><button type="button" data-solar="prev" ${selected===0?'disabled':''}>◀ 이전 절기</button><button type="button" data-solar="next">${selected===23?'처음부터 다시 보기 ↻':'다음 절기 ▶'}</button></div>`;
 }
 room.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.season!==undefined||b.dataset.term!==undefined||['prev','next'].includes(b.dataset.solar)){
   stop();selected=b.dataset.season!==undefined?Number(b.dataset.season)*6:b.dataset.term!==undefined?Number(b.dataset.term):b.dataset.solar==='prev'?Math.max(0,selected-1):(selected+1)%24;render();room.querySelector('h3').focus({preventScroll:true});return;
  }
  const d=raw[selected],season=seasons[Math.floor(selected/6)];
  if(b.dataset.solar==='read')speak(d[0]+'. '+d[1]+' 무렵. '+d[3]+' '+d[4]);
  if(b.dataset.solar==='stop')stop();
  if(b.dataset.solar==='hint'||b.dataset.answer){const msg=b.dataset.solar==='hint'?`힌트: ${d[0]}는 ${season}의 절기예요.`:b.dataset.answer===season?`맞아요! ${d[0]}는 ${season}의 절기예요. 참 잘하셨어요.`:`괜찮아요. ${season} 그림을 보고 다시 골라볼까요?`;room.querySelector('#solarFeedback').textContent=msg;speak(msg);}
 });
 entry.querySelector('button').onclick=()=>{stop();render();room.showModal();};
 room.querySelector('#closeSolarRoom').onclick=()=>room.close();room.addEventListener('close',stop);room.addEventListener('cancel',stop);
 const sync=()=>entry.hidden=hero.hidden;sync();new MutationObserver(sync).observe(hero,{attributes:true,attributeFilter:['hidden']});
});
})();
