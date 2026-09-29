(()=>{
'use strict';
const videos=[{id:'uzc_4nnMIz0',title:'라파시니어 운동 영상'},{id:'7x9F-RQwypc',title:'함께하는 운동 영상 2'}];
document.addEventListener('DOMContentLoaded',()=>{
 const entry=document.createElement('section');
 entry.className='care-card joint-room-entry';
 entry.innerHTML='<div><h2>🌿 관절운동 방</h2><p>원하는 운동 영상을 골라 함께 움직여요.</p></div><button type="button" class="care-btn primary" id="openJointRoom">관절운동 방 들어가기</button>';
 document.querySelector('.friend-selection').after(entry);
 const room=document.createElement('dialog');
 room.className='joint-room';room.id='jointExerciseRoom';room.setAttribute('aria-labelledby','jointRoomTitle');
 room.innerHTML=`<div class="joint-room-header"><h2 id="jointRoomTitle">🌿 관절운동 방</h2><button type="button" class="care-btn" id="closeJointRoom">◀ 방 나가기</button></div><p class="joint-intro">보고 싶은 영상을 누르면 YouTube가 새 창에서 열려요.</p><p class="joint-comfort">무리하지 않고 편안한 범위에서 움직여요. 불편하거나 아프면 멈추고 담당 선생님께 알려주세요.</p><div class="joint-video-choices">${videos.map(v=>`<a class="joint-video-choice" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer" aria-label="${v.title}, YouTube에서 보기, 새 창"><img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.title} 미리보기"><strong>${v.title}</strong><span>▶ YouTube에서 보기 ↗</span></a>`).join('')}</div>`;
 document.body.append(room);
 const guide=document.createElement('section');guide.className='joint-guided';
 guide.innerHTML=`<img src="assets/images/friends-exercise-guide.png" alt="운동복을 입고 함께 체조하는 콩이, 토리, 나비, 보리" loading="lazy"><div><h3>친구들과 함께하는 20분 체조 시간</h3><p>콩이, 토리, 나비, 보리가 응원해요! 영상을 보며 편안하게 따라해요.</p><a class="care-btn primary" href="https://www.youtube.com/watch?v=7x9F-RQwypc" target="_blank" rel="noopener noreferrer" id="jointGuidedVideo">▶ 체조 영상 보기 · 새 창</a><p>영상이 준비되면 아래 시작 버튼을 눌러주세요.</p><output id="jointCountdown" aria-label="남은 체조 시간" role="timer">20:00</output><div class="care-actions"><button type="button" class="care-btn primary" id="jointTimerToggle">▶ 20분 시작</button><button type="button" class="care-btn" id="jointTimerReset">처음부터</button></div><p id="jointTimerStatus" role="status">준비되시면 시작해요.</p><small>타이머는 영상 재생과 별도로 움직여요. YouTube에서 멈추면 여기에서도 쉬기를 눌러주세요. 영상이 먼저 끝나면 쉬거나 원하는 부분을 다시 보세요. 20분을 모두 채우지 않아도 괜찮아요.</small></div>`;
 room.querySelector('.joint-video-choices').before(guide);
 let remaining=1200000,deadline=0,running=false;
 const timer=guide.querySelector('#jointCountdown'),toggle=guide.querySelector('#jointTimerToggle'),notice=guide.querySelector('#jointTimerStatus');
 function paint(){if(running)remaining=Math.max(0,deadline-Date.now());const seconds=Math.ceil(remaining/1000);timer.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');if(running&&!remaining){running=false;toggle.textContent='▶ 다시 시작';notice.textContent='20분이 지났어요. 함께해주셔서 고마워요. 편안히 쉬어요.'}}
 function pause(){if(!running)return;remaining=Math.max(0,deadline-Date.now());running=false;toggle.textContent='▶ 이어서 하기';notice.textContent='잠시 쉬는 중이에요. 영상도 직접 멈춰주세요.';paint()}
 toggle.onclick=()=>{if(running){pause();return}if(!remaining)remaining=1200000;deadline=Date.now()+remaining;running=true;toggle.textContent='Ⅱ 잠시 쉬기';notice.textContent='천천히 따라해요. 새 창에서 영상을 보는 동안에도 시간이 흘러가요.';paint()};
 guide.querySelector('#jointTimerReset').onclick=()=>{if(remaining<1200000&&!confirm('체조 시간을 20분으로 다시 맞출까요?'))return;running=false;remaining=1200000;toggle.textContent='▶ 20분 시작';notice.textContent='준비되시면 시작해요.';paint()};
 guide.querySelector('#jointGuidedVideo').onclick=()=>window.VoiceManager?.stopSpeaking();
 setInterval(paint,500);room.addEventListener('close',pause);
 const homeButton=document.createElement('button');homeButton.type='button';homeButton.className='care-btn';homeButton.id='openGuidedExercise';homeButton.textContent='친구들과 영상 보며 20분 체조';
 homeButton.onclick=()=>{document.querySelector('#warmupVideo')?.pause();document.getElementById('openJointRoom').click();guide.scrollIntoView({block:'start'})};
 document.querySelector('.warmup-actions')?.append(homeButton);
 const sync=()=>entry.hidden=document.querySelector('.hero-classroom').hidden;
 sync();new MutationObserver(sync).observe(document.querySelector('.hero-classroom'),{attributes:true,attributeFilter:['hidden']});
 document.getElementById('openJointRoom').onclick=()=>{window.VoiceManager?.stopSpeaking();room.showModal();};
 room.querySelector('#closeJointRoom').onclick=()=>room.close();
 room.querySelectorAll('.joint-video-choice').forEach(a=>a.addEventListener('click',()=>window.VoiceManager?.stopSpeaking()));
});
})();
