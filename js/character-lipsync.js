/* Reusable audio-clock lip sync. Timed Korean vowels when cues exist; audio
 * energy approximation otherwise (not phoneme recognition). Never swaps identity. */
window.CharacterLipSync=(()=>{
 'use strict';
 const registry=window.characters, sessions=new Map();
 // Decode frames before the first spoken vowel; retain references in the cache.
 const frameCache=[];
 for(const c of Object.values(registry)){for(const src of new Set([c.idle,...Object.values(c.stable)])){const img=new Image();img.src=src;img.decode().catch(()=>{});frameCache.push(img);}}
 const identity=el=>{const img=el?.matches?.('img')?el:el?.querySelector?.('img');return img?.getAttribute('src')?.match(/friend-(kongi|tori|nabi|bori)|characters\/(kongi|tori|nabi|bori)\//)?.slice(1).find(Boolean)||img?.dataset.characterId;};
 function image(el){return el?.matches?.('img')?el:el?.querySelector?.('img');}
 function set(el,id,v='idle'){const img=image(el),c=registry[id];if(!img||!c)return;img.dataset.characterId=id;img.dataset.viseme=v;const src=v==='idle'?c.idle:c.stable[v]||c.idle;if(img.getAttribute('src')!==src)img.src=src;}
 function vowel(char){const n=char.charCodeAt(0)-0xac00;if(n<0||n>11171)return 'idle';const j=Math.floor(n/28)%21;return [0,2,4,6].includes(j)?'a':[1,3,5,7,10,11].includes(j)?'e':[8,9,12].includes(j)?'o':[13,14,15,16,17,18].includes(j)?'u':'i';}
 function at(words,t){const w=words.find(w=>t>=w[1]&&t<w[2]);if(!w)return 'idle';const chars=Array.from(w[0]);return vowel(chars[Math.min(chars.length-1,Math.floor((t-w[1])/(w[2]-w[1])*chars.length))]);}
 function bind(audio,el,id,words=[]){
  unbind(audio);if(!image(el)||!registry[id])return;
  const abort=new AbortController(),s={audio,el,id,abort,raf:0,words};sessions.set(audio,s);
  const reset=()=>{cancelAnimationFrame(s.raf);set(el,id);window.CharacterActions?.setSpeaking(el,id,false);};
  const tick=()=>{if(audio.paused||audio.ended||!image(el)?.isConnected){reset();return;}
   window.CharacterActions?.setSpeaking(el,id,true);let v='idle';
   if(words.length)v=at(words,audio.currentTime);
   else if(s.analyser){s.analyser.getByteTimeDomainData(s.samples);let energy=0;for(const x of s.samples)energy+=(x-128)**2;energy=Math.sqrt(energy/s.samples.length)/128;if(energy>.015)v=energy>.24?'a':energy>.13?'e':energy>.075?'i':energy>.035?'o':'u';}
   if(matchMedia('(prefers-reduced-motion: reduce)').matches)v='idle';set(el,id,v);s.raf=requestAnimationFrame(tick);
  };
  // Keep each media element's AudioNode reusable; createMediaElementSource may be called only once.
  if(!words.length){try{let graph=graphs.get(audio);if(!graph){const context=new (window.AudioContext||window.webkitAudioContext)(),source=context.createMediaElementSource(audio),analyser=context.createAnalyser();analyser.fftSize=256;source.connect(analyser);analyser.connect(context.destination);graph={context,analyser};graphs.set(audio,graph);}graph.context.resume().catch(()=>{});s.analyser=graph.analyser;s.samples=new Uint8Array(256);}catch{/* Audio remains playable when analysis is unavailable. */}}
  for(const event of ['pause','ended','waiting','emptied','error'])audio.addEventListener(event,reset,{signal:abort.signal});
  audio.addEventListener('playing',()=>{cancelAnimationFrame(s.raf);tick();},{signal:abort.signal});
  if(!audio.paused)tick();else reset();
 }
 const graphs=new WeakMap();
 function unbind(audio){const s=sessions.get(audio);if(!s)return;cancelAnimationFrame(s.raf);s.abort.abort();set(s.el,s.id);window.CharacterActions?.setSpeaking(s.el,s.id,false);sessions.delete(audio);}
 function stopAll(){for(const audio of sessions.keys())unbind(audio);}
 window.addEventListener('pagehide',stopAll);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});
 return {identity,set,vowel,at,bind,unbind,stopAll};
})();
