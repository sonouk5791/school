/* Action sprites are curated by appearance. Unknown actions keep official idle.
 * Lip sync takes priority: never paste front-facing mouths onto a turned head. */
window.CharacterActions=(()=>{
 'use strict';
 const states=new Map(),timers=new Map();
 const categories=Object.freeze({basic:['idle','hello','wave','wink','turn'],lesson:['explain','point','read','cheer','bow'],positive:['happy','smile','clap','thumbsup'],activity:['exercise','dance','jump','music','play'],emotion:['surprise','shy','emotional','sad'],rest:['tired','sit','rest','sleep']});
 const imgOf=target=>target?.matches?.('img')?target:target?.querySelector?.('img');
 function resolve(id,action){const c=window.characters[id];if(!c)return null;const available=!!c.actions?.[action];return {id,requested:action,action:available?action:'idle',available,src:c.actions?.[action]||c.idle};}
 function paint(img,state){if(!img.isConnected){clear(img);return;}if(state.speaking)return;const r=resolve(state.id,state.action);img.dataset.characterId=state.id;img.dataset.characterAction=r.action;img.src=r.src;}
 function clear(img){clearTimeout(timers.get(img));timers.delete(img);states.delete(img);}
 function expire(img,id){if(window.CharacterLipSync?.identity(img)===id||!window.CharacterLipSync)show(img,id,'idle');else clear(img);}
 function show(target,id,action='idle',{duration=0}={}){const img=imgOf(target),r=resolve(id,action);if(!img||!r)return null;clearTimeout(timers.get(img));const old=states.get(img),state={id,action:r.action,duration,speaking:old?.id===id&&old.speaking};states.set(img,state);paint(img,state);if(duration>0&&!state.speaking)timers.set(img,setTimeout(()=>expire(img,id),duration));return r;}
 function speaking(target,id,on){const img=imgOf(target);if(!img)return;let state=states.get(img);if(!state||state.id!==id){clear(img);state={id,action:'idle',speaking:false};states.set(img,state);}const wasSpeaking=state.speaking;state.speaking=on;if(on){clearTimeout(timers.get(img));timers.delete(img);}else{paint(img,state);if(wasSpeaking&&state.duration>0)timers.set(img,setTimeout(()=>expire(img,id),state.duration));}}
 function reset(){for(const [img,state] of states){clearTimeout(timers.get(img));state.action='idle';if(!state.speaking)paint(img,state);}timers.clear();}
 function lesson(action,duration=2400){document.querySelectorAll('.ai-friend-avatar-img,.completion-robot-img').forEach(img=>{const id=window.CharacterLipSync.identity(img)||window.VoiceManager?.characterId||'kongi';show(img,id,action,{duration});});}
 document.addEventListener('character:action',event=>{const {target,id,action,duration}=event.detail||{};if(target)show(typeof target==='string'?document.querySelector(target):target,id,action,{duration});else lesson(action,duration);});
 document.addEventListener('DOMContentLoaded',()=>{
  // Decorate existing methods without replacing lesson logic or changing its return value.
  if(typeof LessonEngine==='undefined')return;
  for(const [name,action] of [['startLesson','hello'],['speakStepVoice','explain'],['renderCompletionScreen','cheer'],['finishLessonAndSave','wave']]){
   const original=LessonEngine[name];if(typeof original!=='function')continue;
   LessonEngine[name]=function(...args){const result=original.apply(this,args);lesson(action);return result;};
  }
  const original=LessonEngine.handleOptionSelect;
  if(original)LessonEngine.handleOptionSelect=function(index,...args){const chosen=this.currentLesson?.steps?.[this.currentStepIndex]?.options?.[index];const result=original.call(this,index,...args);if(chosen?.isBest)lesson('happy');return result;};
  const exit=LessonEngine.exitLesson;if(exit)LessonEngine.exitLesson=function(...args){reset();return exit.apply(this,args);};
 });
 window.addEventListener('pagehide',()=>{reset();for(const img of [...states.keys()])clear(img);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
 return {categories,resolve,show,setSpeaking:speaking,reset,lesson};
})();
