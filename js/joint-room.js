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
 const sync=()=>entry.hidden=document.querySelector('.hero-classroom').hidden;
 sync();new MutationObserver(sync).observe(document.querySelector('.hero-classroom'),{attributes:true,attributeFilter:['hidden']});
 document.getElementById('openJointRoom').onclick=()=>{window.VoiceManager?.stopSpeaking();room.showModal();};
 room.querySelector('#closeJointRoom').onclick=()=>room.close();
 room.querySelectorAll('.joint-video-choice').forEach(a=>a.addEventListener('click',()=>window.VoiceManager?.stopSpeaking()));
});
})();
