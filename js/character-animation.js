/* Lightweight original-image parts rig; no replacement character artwork. */
(() => {
 'use strict';
 const rigs=[],state={kongi:'idle',tori:'idle',nabi:'idle',bori:'idle'},media=matchMedia('(prefers-reduced-motion: reduce)');
 const ids=Object.keys(state),season=document.documentElement.dataset.season==='chuseok';
 const mouthStates=Object.fromEntries(ids.map(id=>[id,'mouthSmile']));
 const behavior=Object.fromEntries(ids.map((id,i)=>[id,{audible:false,mouthIndex:0,nextMouth:0,blinkAt:Infinity,blinkUntil:0,greetUntil:0}]));
 const mouthCycle=['mouthClosed','mouthA','mouthClosed','mouthO','mouthE','mouthClosed','mouthSmile'];
 let timer=null,serial=0;const ns='http://www.w3.org/2000/svg';
 function create(id){
 if(document.documentElement.dataset.season==='chuseok'){
  const svg=HanbokCharacter.create(id);rigs.push({id,svg,nextBlink:Infinity,blinkUntil:0,waveUntil:0});return svg;
 }
 const d=CharacterRigData[id],uid='rig'+(++serial),svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`${d.x} 96 344 576`);svg.setAttribute('aria-hidden','true');svg.classList.add('character-parts-rig');svg.dataset.character=id;svg.style.setProperty('--breath',d.period+'s');svg.style.setProperty('--wave-angle',d.angle+'deg');
 const image=`<image href="/assets/images/home-hero/four-friends.jpg" width="1376" height="768"/>`;
 const [mx,my,mw,mh]=d.mouth;
 svg.innerHTML=`<defs><clipPath id="${uid}-frame"><rect x="${d.x}" y="96" width="${d.width}" height="576"/></clipPath><clipPath id="${uid}-arm"><path d="${d.arm}"/></clipPath><clipPath id="${uid}-hand"><path d="${d.hand}"/></clipPath><mask id="${uid}-body" maskUnits="userSpaceOnUse" x="0" y="0" width="1376" height="768"><rect width="1376" height="768" fill="white"/><path d="${d.arm}" fill="black"/></mask><mask id="${uid}-forearm" maskUnits="userSpaceOnUse" x="0" y="0" width="1376" height="768"><rect width="1376" height="768" fill="white"/><path d="${d.hand}" fill="black"/></mask></defs>
 <g clip-path="url(#${uid}-frame)"><rect x="${d.x}" y="96" width="344" height="576" fill="white"/><g class="rig-breath"><g data-part="body" mask="url(#${uid}-body)">${image}</g><g data-part="rightArm" style="transform-origin:${d.shoulder[0]}px ${d.shoulder[1]}px"><g clip-path="url(#${uid}-arm)" mask="url(#${uid}-forearm)">${image}</g><g data-part="rightHand" style="transform-origin:${d.wrist[0]}px ${d.wrist[1]}px" clip-path="url(#${uid}-hand)">${image}</g></g><g data-part="eyes" class="rig-eyelids">${d.eyes.map(([x,y,rx,ry])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${d.eyeSkin||d.skin}"/><path d="M${x-rx+3} ${y} Q${x} ${y+9} ${x+rx-3} ${y}" fill="none" stroke="#634b3f" stroke-width="4" stroke-linecap="round"/>`).join('')}</g><g data-part="mouth" class="rig-mouth"><ellipse cx="${mx}" cy="${my+2}" rx="${mw+3}" ry="${mh+4}" fill="${d.skin}"/><path class="rig-mouth-closed" d="M${mx-mw*.65} ${my} Q${mx} ${my+10} ${mx+mw*.65} ${my}" fill="none" stroke="#85483d" stroke-width="3" stroke-linecap="round"/><ellipse class="rig-mouth-a" cx="${mx}" cy="${my+2}" rx="${mw*.62}" ry="${mh*.82}" fill="#833932"/><ellipse class="rig-mouth-o" cx="${mx}" cy="${my+2}" rx="${mw*.4}" ry="${mh*.6}" fill="#833932"/></g></g></g>`;
 rigs.push({id,svg,nextBlink:performance.now()+3000+Math.random()*2000,blinkUntil:0,waveUntil:0});return svg;}
 function mount(){for(const id of Object.keys(state)){const home=document.querySelector('.home-friend-'+id+' svg');if(home){const svg=create(id);svg.classList.add('home-friend-picture');
 const contour=window.HeroContours?.[id];if(contour&&document.documentElement.dataset.season!=='chuseok'){
   const clipId='hero-outline-'+id,clip=document.createElementNS(ns,'clipPath'),path=document.createElementNS(ns,'path');clip.id=clipId;path.setAttribute('d',contour.path);clip.append(path);svg.querySelector('defs').append(clip);
   svg.querySelectorAll('image').forEach(image=>image.setAttribute('clip-path','url(#'+clipId+')'));
   svg.querySelector(':scope > g > rect')?.remove();
   const shadow=document.createElementNS(ns,'ellipse');shadow.setAttribute('cx',contour.center);shadow.setAttribute('cy','632');shadow.setAttribute('rx','92');shadow.setAttribute('ry','10');shadow.classList.add('hero-ground-shadow');svg.querySelector(':scope > g').prepend(shadow);
   svg.setAttribute('viewBox',String(contour.center-172)+' 96 344 576');
   // Uniform scaling about the foot anchor preserves proportions and one baseline.
   const scale={kongi:1,tori:.93,nabi:1.07,bori:1}[id];
   const breath=svg.querySelector('.rig-breath'),alignment=document.createElementNS(ns,'g');alignment.setAttribute('transform',`translate(${contour.center} 626) scale(${scale}) translate(${-contour.center} ${-contour.foot})`);breath.before(alignment);alignment.append(breath);
 }
 home.replaceWith(svg);const link=svg.closest('a');if(!season){link.addEventListener('pointerenter',()=>gesture(id));link.addEventListener('focus',()=>gesture(id));}link.addEventListener('click',e=>{if(e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;gesture(id);if(season)try{sessionStorage.setItem('school_character_entry_greeting',JSON.stringify({id,at:Date.now()}));}catch{}});}}
 for(const [selector,id]of [['.tp-char-img','tori'],['.nl-char-img','nabi'],['.bh-char-img','bori'],['.se-ready-avatar','kongi']]){const old=document.querySelector(selector);if(!old)continue;const svg=create(id);svg.classList.add('room-character-rig');old.hidden=true;old.after(svg);}
 document.querySelectorAll('.tp-game-tab,.nl-tab,.bh-tab,#btnStartExercise').forEach(el=>el.addEventListener('click',()=>{const id=rigs.find(r=>r.svg.classList.contains('room-character-rig'))?.id;if(id)gesture(id,true);}));
 start();
 if(season){Promise.all(ids.flatMap(id=>['expressions','blink'].map(kind=>{const img=new Image();img.src='/assets/images/chuseok/'+id+'-'+kind+'-v3.png';return img.decode().catch(()=>{});}))).then(()=>{ids.forEach((id,i)=>behavior[id].blinkAt=performance.now()+1100+i*320);window.CharacterAnimation.expressionsReady=true;});}
 if(season){try{const entry=JSON.parse(sessionStorage.getItem('school_character_entry_greeting')||'null');const room=document.body.dataset.activityRoom||(document.getElementById('viewReady')?'kongi':null);if(entry&&room===entry.id){sessionStorage.removeItem('school_character_entry_greeting');if(Date.now()-entry.at<10000)setTimeout(()=>{if(!document.hidden&&!window.CharacterVoice?.getState().characterId&&(!window.RoomActivity||RoomActivity.activityStatus==='select')&&(!document.getElementById('viewReady')||document.getElementById('viewReady').getClientRects().length))window.speakAsCharacter?.(room,{kongi:'반가워요. 천천히 몸을 움직여요.',tori:'반가워요. 즐겁게 놀아볼까요?',nabi:'반가워요. 천천히 생각해봐요.',bori:'반가워요. 편안하게 함께해요.'}[room]);},300);}}catch{}}
 }

 function paint(id){const b=behavior[id];for(const r of rigs.filter(r=>r.id===id)){if(r.svg.dataset.state!==state[id])r.svg.dataset.state=state[id];const mouth=season?mouthStates[id]:({mouthClosed:'closed',mouthA:'a',mouthO:'o'}[mouthStates[id]]||'smile');if(r.svg.dataset.mouth!==mouth)r.svg.dataset.mouth=mouth;r.svg.classList.toggle('is-blinking',!media.matches&&performance.now()<b.blinkUntil);}}
 function set(id,value,duration=0){if(!behavior[id])return;if(value==='idle'||value==='talking')for(const r of rigs.filter(r=>r.id===id)){const cancel=r.cancelMotion;r.cancelMotion=null;cancel?.();}state[id]=value;const b=behavior[id];if(value!=='talking'){b.audible=false;mouthStates[id]='mouthSmile';}b.greetUntil=duration?performance.now()+duration:0;paint(id);}
 function motion(id,name){if(!behavior[id]||media.matches||state[id]==='talking')return false;
  const asset=window.HanbokCharacter?.motionAssets[id]?.[name];
  if(asset?.validated){set(id,name);let played=false;for(const r of rigs.filter(r=>r.id===id&&r.svg.getClientRects().length)){r.cancelMotion=HanbokCharacter.playMotion(r.svg,name,()=>set(id,'idle'));played=played||!!r.cancelMotion;}if(!played)set(id,'idle');return played;}
  // Without a validated clip, no body PNG simulation or improvised hand rotation.
  if(name==='bowing')return false;
  if(name==='greeting'){set(id,'greeting',400);behavior[id].blinkAt=performance.now();return true;}return false;
 }
 function gesture(id){return motion(id,'greeting');}
 function reset(){for(const id of ids){behavior[id].blinkUntil=0;set(id,'idle');}}
 function step(){const now=performance.now();let blinking=ids.some(id=>behavior[id].blinkUntil>now);
  for(const id of ids){const b=behavior[id];if(!rigs.some(r=>r.id===id&&r.svg.getClientRects().length))continue;
   if(b.greetUntil&&now>b.greetUntil)set(id,'idle');if(state[id]==='bowing')continue;
   if(now>=b.blinkAt){if(blinking){b.blinkAt=now+200+Math.random()*200;}else{b.blinkUntil=now+150;b.blinkAt=now+4000+Math.random()*2800;blinking=true;}}
   if(state[id]==='talking'&&b.audible&&now>=b.nextMouth){
    const level=window.CharacterVoice?.getAudioLevel?.();const candidate=mouthCycle[b.mouthIndex++%mouthCycle.length];
    mouthStates[id]=level==null?candidate:level<.012?'mouthClosed':level<.1&&candidate==='mouthO'?'mouthA':candidate;
    b.nextMouth=now+120+Math.random()*80;
   }
   paint(id);
  }
 }
 function start(){clearInterval(timer);document.documentElement.classList.toggle('character-motion-reduced',media.matches);if(document.hidden){reset();return;}if(media.matches){for(const id of ids){mouthStates[id]='mouthSmile';behavior[id].blinkUntil=0;paint(id);}return;}timer=setInterval(step,20);}
 window.addEventListener('character-voice-state',e=>{const {state:status,characterId:id}=e.detail;
  if(status==='speaking'&&behavior[id]){reset();set(id,'talking');behavior[id].mouthIndex=0;}
  else if(status==='playing'&&behavior[id]){for(const other of ids)if(other!==id)set(other,'idle');set(id,'talking');behavior[id].audible=true;behavior[id].nextMouth=performance.now();}
  else if(['paused','waiting'].includes(status)&&behavior[id]){behavior[id].audible=false;mouthStates[id]='mouthClosed';paint(id);}
  else if(['ended','error','cancelled','stopped','unavailable'].includes(status)){if(behavior[id])set(id,'idle');else reset();}
 });
 media.addEventListener('change',start);document.addEventListener('visibilitychange',start);window.addEventListener('pagehide',()=>{clearInterval(timer);reset();});document.addEventListener('DOMContentLoaded',mount);
 window.CharacterAnimation={state,mouthStates,set,gesture,motion,create};
})();
