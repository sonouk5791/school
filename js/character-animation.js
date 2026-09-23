/* Lightweight original-image parts rig; no replacement character artwork. */
(() => {
 'use strict';
 const rigs=[],state={kongi:'idle',tori:'idle',nabi:'idle',bori:'idle'},media=matchMedia('(prefers-reduced-motion: reduce)');
 let timer=null,tick=0,waveIndex=0,serial=0;const ns='http://www.w3.org/2000/svg';
 function create(id){
 if(document.documentElement.dataset.season==='chuseok'){
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1122 1402');svg.setAttribute('aria-hidden','true');svg.classList.add('character-parts-rig','hanbok-character');svg.dataset.character=id;
  const image=document.createElementNS(ns,'image');image.setAttribute('href','/assets/images/chuseok/'+id+'-hanbok-v2.png');image.setAttribute('width','1122');image.setAttribute('height','1402');svg.append(image);
  rigs.push({id,svg,nextBlink:Infinity,blinkUntil:0,waveUntil:0});return svg;
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
 home.replaceWith(svg);const link=svg.closest('a');link.addEventListener('pointerenter',()=>gesture(id));link.addEventListener('focus',()=>gesture(id));link.addEventListener('pointerdown',()=>set(id,'selected',600));}}
 for(const [selector,id]of [['.tp-char-img','tori'],['.nl-char-img','nabi'],['.bh-char-img','bori'],['.se-ready-avatar','kongi']]){const old=document.querySelector(selector);if(!old)continue;const svg=create(id);svg.classList.add('room-character-rig');old.hidden=true;old.after(svg);}
 document.querySelectorAll('.tp-game-tab,.nl-tab,.bh-tab,#btnStartExercise').forEach(el=>el.addEventListener('click',()=>{const id=rigs.find(r=>r.svg.classList.contains('room-character-rig'))?.id;if(id)gesture(id,true);}));
 start();}
 function set(id,value,duration=0){if(!state[id])return;state[id]=value;for(const r of rigs.filter(r=>r.id===id)){r.svg.dataset.state=value;r.waveUntil=duration?performance.now()+duration:0;}}
 function gesture(id,signature=false){if(state[id]==='talking'||media.matches)return;set(id,signature?'exercising':'waving',id==='bori'?2400:1800);}
 function reset(){for(const id of Object.keys(state))set(id,'idle');for(const r of rigs){r.svg.classList.remove('is-blinking');r.svg.dataset.mouth='smile';}}
 function step(){tick++;const now=performance.now();for(const r of rigs){if(!r.svg.getClientRects().length)continue;if(r.waveUntil&&now>r.waveUntil)set(r.id,'idle');if(now>r.nextBlink){r.blinkUntil=now+220;r.nextBlink=now+3000+Math.random()*2000;}r.svg.classList.toggle('is-blinking',now<r.blinkUntil);r.svg.dataset.mouth=state[r.id]==='talking'?['closed','a','o','smile'][Math.floor(tick/3)%4]:'smile';}
 if(tick%120===0){const visible=rigs.filter(r=>r.svg.getClientRects().length);if(visible.length)gesture(visible[(waveIndex++)%visible.length].id,true);}}
 function start(){clearInterval(timer);reset();document.documentElement.classList.toggle('character-motion-reduced',media.matches);if(!media.matches&&!document.hidden)timer=setInterval(step,100);}
 window.addEventListener('character-voice-state',e=>{const {state:status,characterId:id}=e.detail;if(status==='speaking'&&id){for(const key of Object.keys(state))set(key,'idle');set(id,'talking');}else if(['ended','error','cancelled','stopped','unavailable'].includes(status)){if(id)set(id,'idle');else reset();}});
 media.addEventListener('change',start);document.addEventListener('visibilitychange',start);window.addEventListener('pagehide',()=>{clearInterval(timer);reset();});document.addEventListener('DOMContentLoaded',mount);
 window.CharacterAnimation={state,set,gesture};
})();
