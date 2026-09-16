/* Standalone first-entry welcome. Only supplied recordings may be played; no TTS. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const key='school_character_welcome_v1';
 try{if(sessionStorage.getItem(key))return}catch{}
 const recordings=[]; // No verified human welcome MP3 exists in this static project.
 const dialog=document.createElement('dialog');dialog.id='welcomeGreeting';dialog.setAttribute('aria-labelledby','welcomeGreetingTitle');
 dialog.innerHTML=`<button type="button" class="welcome-close" aria-label="환영 화면 닫고 홈페이지 보기">×</button><h1 id="welcomeGreetingTitle" tabindex="-1">안녕하세요!</h1><p class="welcome-title">디지털 AI학교에 오신 것을 환영합니다.</p><div class="welcome-characters">${[['kongi','콩이'],['tori','토리'],['nabi','나비'],['bori','보리']].map(([id,name],i)=>`<figure style="--welcome-delay:${i*180}ms"><img src="assets/images/friend-${id}.png" alt="${name}"><figcaption>${name}</figcaption></figure>`).join('')}</div><p class="welcome-message">오늘도 저희와 함께 천천히 즐겁게 시작해볼까요?</p><div class="welcome-actions senior-return"><button type="button" class="care-btn" id="welcomeListen">🔊 환영 인사 듣기</button><button type="button" class="care-btn primary" id="welcomeStart">🌞 오늘 프로그램 시작</button></div><p class="welcome-status" role="status" aria-live="polite">${recordings.length?'버튼을 누르면 환영 인사를 들을 수 있어요.':'환영 음성을 준비 중이에요.'}</p>`;
 document.body.append(dialog);let player=null;
 function stop(){if(player){player.pause();player.currentTime=0;player=null;}}
 function close(){stop();try{sessionStorage.setItem(key,'1')}catch{}dialog.close();document.querySelector('#morningStart')?.focus();}
 dialog.querySelector('.welcome-close').addEventListener('click',close);
 dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
 dialog.querySelector('#welcomeStart').addEventListener('click',()=>{close();document.querySelector('#morningStart')?.click()});
 dialog.querySelector('#welcomeListen').addEventListener('click',()=>{
  const status=dialog.querySelector('.welcome-status');
  if(!recordings.length){status.textContent='아직 등록된 환영 음성이 없어요. 오늘 프로그램을 시작해주세요.';return;}
  stop();player=new Audio(recordings[0]);player.addEventListener('error',()=>{status.textContent='음성을 재생할 수 없어요. 잠시 후 다시 눌러주세요.'});
  player.play().then(()=>{status.textContent='환영 인사를 듣고 있어요.'}).catch(()=>{status.textContent='음성을 재생할 수 없어요. 다시 눌러주세요.'});
 });
 dialog.showModal();dialog.querySelector('h1').focus();
});
