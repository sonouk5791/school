/* Provider-independent character speech. Never substitutes a device voice. */
window.CharacterVoice = (() => {
  'use strict';
  const profiles = Object.freeze({
    kongi: Object.freeze({name:'콩이',role:'exercise',speed:0.94,style:'warm energetic supportive adult male or neutral',pause:450}),
    tori: Object.freeze({name:'토리',role:'play',speed:0.98,style:'bright warm playful adult female',pause:450}),
    nabi: Object.freeze({name:'나비',role:'learning',speed:0.91,style:'calm clear patient adult female',pause:650,questionPause:1800}),
    bori: Object.freeze({name:'보리',role:'hobby',speed:0.89,style:'warm calm comforting adult male',pause:650})
  });
  let provider=null,sequence=0,active=null,last=null,audio=null,controller=null,url=null;
  let prefs={muted:false,slow:false};
  try {const saved=JSON.parse(localStorage.getItem('school_character_voice_prefs_v1'));if(saved)prefs={muted:saved.muted===true,slow:saved.slow===true};} catch {}
  function emit(state,detail={}) {window.dispatchEvent(new CustomEvent('character-voice-state',{detail:{state,...detail}}));}
  function save(){try{localStorage.setItem('school_character_voice_prefs_v1',JSON.stringify(prefs));}catch{}emit('preferences',prefs);}
  function stop(){sequence++;controller?.abort();controller=null;if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null;}if(url)URL.revokeObjectURL(url);url=null;active=null;emit('stopped');}
  function configure(next){
    const ids=Object.keys(profiles).map(id=>next?.voiceIds?.[id]);
    if(!next||typeof next.synthesize!=='function'||ids.some(id=>typeof id!=='string'||!id.trim())||new Set(ids).size!==4)throw Error('서로 다른 고정 음성 ID 4개가 필요합니다.');
    stop();provider={...next,voiceIds:Object.freeze({...next.voiceIds})};
    emit('ready');
  }
  function wait(ms,signal){return new Promise((resolve,reject)=>{const abort=()=>{clearTimeout(timer);reject(new DOMException('Stopped','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);signal.addEventListener('abort',abort,{once:true});});}
  async function run(id,text,token,signal){
    try {
      const profile=profiles[id],sentences=text.match(/[^.!?。！？]+[.!?。！？]*/g)||[text];
      for(let i=0;i<sentences.length;i++){
        const blob=await provider.synthesize({characterId:id,voiceId:provider.voiceIds[id],text:sentences[i].trim(),speed:profile.speed*(prefs.slow?0.9:1),style:profile.style,signal});
        if(signal.aborted||token!==sequence)return {status:'cancelled'};
        if(!(blob instanceof Blob)||!blob.type.startsWith('audio/'))throw Error('음성 응답을 확인할 수 없습니다.');
        url=URL.createObjectURL(blob);audio=new Audio(url);audio.preservesPitch=true;
        await new Promise((resolve,reject)=>{const current=audio;const cleanup=()=>signal.removeEventListener('abort',abort);const abort=()=>{cleanup();reject(new DOMException('Stopped','AbortError'));};signal.addEventListener('abort',abort,{once:true});current.onended=()=>{cleanup();resolve();};current.onerror=()=>{cleanup();reject(Error('음성을 재생하지 못했어요.'));};current.play().catch(e=>{cleanup();reject(e);});});
        URL.revokeObjectURL(url);url=null;audio=null;
        if(i<sentences.length-1)await wait(/[?？]\s*$/.test(sentences[i])?(profile.questionPause||900):profile.pause,signal);
      }
      emit('ended',{characterId:id});return {status:'ended'};
    }catch(error){if(error.name==='AbortError')return {status:'cancelled'};emit('error',{message:error.message});return {status:'error'};}
    finally{if(token===sequence){active=null;controller=null;if(url)URL.revokeObjectURL(url);url=null;audio=null;}}
  }
  function speak(id,text,{restart=false}={}){
    if(!profiles[id])return Promise.resolve({status:'unknown-character'});
    text=String(text||'').trim();if(!text)return Promise.resolve({status:'empty'});
    if(prefs.muted)return Promise.resolve({status:'muted'});
    if(!provider){emit('unconfigured',{message:'선생님이 캐릭터 목소리를 준비하고 있어요.'});return Promise.resolve({status:'unconfigured'});}
    if(!restart&&active?.id===id&&active.text===text)return active.promise;
    stop();window.speechSynthesis?.cancel();window.dispatchEvent(new Event('character-audio-start'));window.CharacterAudioPlayer?.stop();
    last={id,text};controller=new AbortController();const token=sequence;
    active={id,text};emit('speaking',{characterId:id});active.promise=run(id,text,token,controller.signal);return active.promise;
  }
  function mount(container){const labels=['🔊 음성 켜짐','🔁 다시 듣기','🐢 천천히 듣기'];const buttons=labels.map((text,i)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.style.cssText='min-height:56px;font-size:20px;padding:12px 18px;border:2px solid #d8cfbd;border-radius:14px;background:#fffaf0;cursor:pointer';b.onclick=()=>{if(i===0){prefs.muted=!prefs.muted;if(prefs.muted)stop();save();}else if(i===1){if(last)speak(last.id,last.text,{restart:true});}else{prefs.slow=!prefs.slow;save();if(active&&last)speak(last.id,last.text,{restart:true});}paint();};container.append(b);return b;});function paint(){buttons[0].textContent=prefs.muted?'🔇 음성 꺼짐':'🔊 음성 켜짐';buttons[0].setAttribute('aria-pressed',String(!prefs.muted));buttons[2].setAttribute('aria-pressed',String(prefs.slow));}paint();return buttons;}
  window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('welcome-audio-start',stop);
  window.speakAsCharacter=speak;
  return {profiles,configure,speak,stop,mount,replay:()=>last?speak(last.id,last.text,{restart:true}):Promise.resolve({status:'empty'}),getState:()=>({configured:!!provider,characterId:active?.id||null,...prefs})};
})();
