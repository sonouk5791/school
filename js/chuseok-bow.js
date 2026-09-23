/* First home greeting once. Later greetings are user/audio initiated only. */
document.addEventListener('DOMContentLoaded',()=>{
 if(document.documentElement.dataset.season!=='chuseok')return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),items=new Map();let introduced=false,ready=false;
 function finish(svg){const item=items.get(svg);if(item)clearTimeout(item.timer);svg.classList.remove('is-bowing');}
 function play(svg){
  if(reduce.matches||document.hidden||svg.classList.contains('is-bowing')||!svg.getClientRects().length)return;
  const item=items.get(svg)||{last:-Infinity};if(performance.now()-item.last<10000)return;
  item.last=performance.now();items.set(svg,item);svg.classList.add('is-bowing');
  item.timer=setTimeout(()=>finish(svg),window.HanbokCharacter.specs[svg.dataset.character].duration+100);
 }
 document.addEventListener('animationend',e=>{if(e.animationName==='chuseok-waist-bow')finish(e.target.closest('.hanbok-character'));});
 const homes=[...document.querySelectorAll('.home-friend .hanbok-character')];
 const images=homes.flatMap(svg=>[false,true].map(bow=>{const img=new Image();img.src=HanbokCharacter.art(svg.dataset.character,bow);return img.decode().catch(()=>{});}));
 function initial(){if(!ready||introduced||document.hidden)return;introduced=true;homes.forEach(play);}
 Promise.all(images).then(()=>{ready=true;requestAnimationFrame(initial);});
 homes.forEach(svg=>{const link=svg.closest('a');link.addEventListener('pointerenter',e=>{if(introduced&&e.pointerType==='mouse')play(svg);});link.addEventListener('focus',()=>{if(introduced)play(svg);});});
 // Clasped hands follow the upper torso once at the beginning of audible speech.
 window.addEventListener('character-voice-state',e=>{if(e.detail.state==='playing')document.querySelectorAll('.hanbok-character').forEach(svg=>{if(svg.dataset.character===e.detail.characterId)play(svg);});});
 function stop(){for(const svg of items.keys())finish(svg);}
 reduce.addEventListener('change',()=>{if(reduce.matches)stop();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else initial();});window.addEventListener('pagehide',stop);
});
