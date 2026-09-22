/* Provider-independent character speech. Never substitutes a device voice. */
window.CharacterVoice = (() => {
  'use strict';
  // Fixed external voice names requested by the user; not browser voiceURIs.
  const characterVoices = Object.freeze({kongi:'Achird',tori:'Aoede',nabi:'Gacrux',bori:'Charon'});
  window.characterVoices = characterVoices;
  const profiles = Object.freeze({
    kongi: Object.freeze({voiceId:characterVoices.kongi,name:'콩이',role:'exercise',speed:0.94,style:'warm energetic supportive adult male or neutral',pause:450}),
    tori: Object.freeze({voiceId:characterVoices.tori,name:'토리',role:'play',speed:0.98,style:'bright warm playful adult female',pause:450}),
    nabi: Object.freeze({voiceId:characterVoices.nabi,name:'나비',role:'learning',speed:0.91,style:'calm clear patient adult female',pause:650,questionPause:1800}),
    bori: Object.freeze({voiceId:characterVoices.bori,name:'보리',role:'hobby',speed:0.89,style:'warm calm comforting adult male',pause:650})
  });
  let provider={name:'vertex-ai',voiceIds:characterVoices,synthesize:serverSynthesize},sequence=0,active=null,last=null,audio=null,controller=null,url=null;
  let prefs={muted:false,slow:false};
  try {const saved=JSON.parse(localStorage.getItem('school_character_voice_prefs_v1'));if(saved)prefs={muted:saved.muted===true,slow:saved.slow===true};} catch {}

  const mappingKey='school_character_voice_uris_v1';
  let mapping={};try{mapping=JSON.parse(localStorage.getItem(mappingKey)||'{}');}catch{}
  const synth=window.speechSynthesis;
  function voices(){return [...new Map((synth?.getVoices()||[]).filter(v=>/^ko(?:-|_)/i.test(v.lang)).map(v=>[v.voiceURI,v])).values()].sort((a,b)=>a.voiceURI.localeCompare(b.voiceURI));}
  function refresh(){
    const available=voices(),used=new Set();if(!available.length)return;
    for(const id of Object.keys(profiles)){const uri=mapping[id];if(uri&&available.some(v=>v.voiceURI===uri)&&!used.has(uri))used.add(uri);else mapping[id]=null;}
    // Known voice names only: Web Speech exposes no gender field. Unknown voices require teacher assignment.
    for(const [id,pattern] of [['kongi',/InJoon|인준/i],['bori',/Hyunsu|현수/i],['tori',/SunHi|선히|Yuna|Heami/i],['nabi',/Heami|Yuna|SunHi|Google/i]]){
      if(mapping[id])continue;const v=available.find(v=>!used.has(v.voiceURI)&&pattern.test(v.name));if(v){mapping[id]=v.voiceURI;used.add(v.voiceURI);}
    }
    try{localStorage.setItem(mappingKey,JSON.stringify(mapping));}catch{}
    emit('voices',diagnostics());
  }
  function diagnostics(){return {requestedVoiceIds:characterVoices,provider:provider?.name||'external',model:'gemini-3.1-flash-tts-preview',voices:voices().map(({name,lang,voiceURI,default:d,localService})=>({name,lang,voiceURI,default:d,localService})),mapping:Object.fromEntries(Object.keys(profiles).map(id=>[id,provider?.voiceIds[id]||mapping[id]||null]))};}
  function getAvailableBrowserVoice(id){return voices().find(v=>v.voiceURI===mapping[id])||null;}
  function assign(id,uri){if(!profiles[id]||!voices().some(v=>v.voiceURI===uri))throw Error('사용 가능한 한국어 음성을 골라주세요.');if(Object.keys(mapping).some(k=>k!==id&&mapping[k]===uri))throw Error('다른 친구가 사용하는 음성입니다.');stop();mapping[id]=uri;refresh();}
  function ready(){if(voices().length){refresh();return Promise.resolve();}return new Promise(resolve=>{const done=()=>{clearTimeout(timer);synth?.removeEventListener('voiceschanged',done);refresh();resolve();};const timer=setTimeout(done,2000);synth?.addEventListener('voiceschanged',done,{once:true});});}
  synth?.addEventListener('voiceschanged',refresh);
  function browserSpeak(id,text,signal,options){return new Promise(resolve=>{
    const voice=voices().find(v=>v.voiceURI===mapping[id]);
    if(!voice){emit('unavailable',{characterId:id,message:profiles[id].name+'의 별도 목소리가 아직 준비되지 않았어요. 화면 안내를 봐주세요.'});resolve({status:'unavailable'});return;}
    const u=new SpeechSynthesisUtterance(text);u.voice=voice;u.lang=voice.lang;u.pitch=1;u.rate=profiles[id].speed*(localStorage.getItem('digital_school_voice_speed')==='slow'?.9:1)*(options.rateScale||1);
    const done=status=>{signal.removeEventListener('abort',abort);resolve({status});};const abort=()=>{synth.cancel();done('cancelled');};signal.addEventListener('abort',abort,{once:true});u.onend=()=>done('ended');u.onerror=()=>done('error');u.onboundary=options.onboundary||null;synth.speak(u);
  });}
  ready();
  window.addEventListener('character-voice-state',event=>{if(!['unavailable','error'].includes(event.detail.state))return;let note=document.getElementById('characterVoiceNotice');if(!note){note=document.createElement('p');note.id='characterVoiceNotice';note.setAttribute('role','status');note.style.cssText='font-size:20px;padding:12px;background:#fff9e9;position:relative;z-index:5';document.body.append(note);}note.textContent=event.detail.message;});
  document.addEventListener('DOMContentLoaded',()=>{const nav=document.querySelector('.care-nav');if(nav&&!nav.querySelector('[href="character-voice-test.html"]')){const a=document.createElement('a');a.href='character-voice-test.html';a.className='care-btn';a.textContent='캐릭터 음성 테스트';nav.append(a);}});

  function emit(state,detail={}) {window.dispatchEvent(new CustomEvent('character-voice-state',{detail:{state,...detail}}));}
  function save(){try{localStorage.setItem('school_character_voice_prefs_v1',JSON.stringify(prefs));localStorage.setItem('digital_school_muted',String(prefs.muted));localStorage.setItem('digital_school_voice_speed',prefs.slow?'slow':'normal');}catch{}emit('preferences',prefs);}
  function stop(){sequence++;controller?.abort();synth?.cancel();controller=null;if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null;}if(url)URL.revokeObjectURL(url);url=null;active=null;emit('stopped');}
  function configure(next){
    if(next)next={...next,voiceIds:next.voiceIds||characterVoices};
    const ids=Object.keys(profiles).map(id=>next?.voiceIds?.[id]);
    if(!next||typeof next.synthesize!=='function'||ids.some(id=>typeof id!=='string'||!id.trim())||new Set(ids).size!==4)throw Error('서로 다른 고정 음성 ID 4개가 필요합니다.');
    stop();provider={...next,voiceIds:Object.freeze({...next.voiceIds})};
    emit('ready');
  }
  function wait(ms,signal){return new Promise((resolve,reject)=>{const abort=()=>{clearTimeout(timer);reject(new DOMException('Stopped','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);signal.addEventListener('abort',abort,{once:true});});}
  async function serverSynthesize({characterId,text,signal}){
    const response=await fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({characterId,text}),signal});
    if(!response.ok){const data=await response.json().catch(()=>({}));console.error('[Google TTS]',response.status,data.error,data.message);throw Object.assign(Error(data.message||('TTS HTTP '+response.status)),{code:data.error||'TTS_REQUEST_FAILED',googleStatus:data.googleStatus});}
    if(!response.headers.get('content-type')?.startsWith('audio/'))throw Error('TTS response is not audio');return response.blob();
  }
  async function run(id,text,token,signal,options){
    try {
      if(!provider)await ready();if(signal.aborted)return {status:'cancelled'};
      if(!provider){const result=await browserSpeak(id,text,signal,options);if(token===sequence)emit(result.status,{characterId:id});return result;}
      const profile=profiles[id],sentences=provider.name==='vertex-ai'?[text]:(text.match(/[^.!?。！？]+[.!?。！？]*/g)||[text]);
      for(let i=0;i<sentences.length;i++){
        let blob;try{blob=await provider.synthesize({characterId:id,voiceId:provider.voiceIds[id],text:sentences[i].trim(),speed:profile.speed*(prefs.slow?0.9:1),style:profile.style,signal});}catch(error){if(signal.aborted)throw new DOMException('Stopped','AbortError');if(error.code!=='GOOGLE_TTS_FAILED')throw error;await ready();if(!getAvailableBrowserVoice(id)){emit('unavailable',{characterId:id,message:'Google 음성 연결을 확인해주세요. 별도 브라우저 음성도 없습니다.'});return {status:'unavailable'};}console.warn('Google TTS failed - browser fallback used');emit('fallback',{characterId:id,voiceURI:getAvailableBrowserVoice(id).voiceURI});const result=await browserSpeak(id,text,signal,options);emit(result.status,{characterId:id});return {...result,provider:'browser-fallback'};}
        if(signal.aborted||token!==sequence)return {status:'cancelled'};
        if(!(blob instanceof Blob)||!blob.type.startsWith('audio/'))throw Error('음성 응답을 확인할 수 없습니다.');
        url=URL.createObjectURL(blob);audio=new Audio(url);audio.preservesPitch=true;audio.playbackRate=(options.rateScale||1)*(localStorage.getItem('digital_school_voice_speed')==='slow'?.9:1);
        await new Promise((resolve,reject)=>{const current=audio;const cleanup=()=>signal.removeEventListener('abort',abort);const abort=()=>{cleanup();reject(new DOMException('Stopped','AbortError'));};signal.addEventListener('abort',abort,{once:true});current.onended=()=>{cleanup();resolve();};current.onerror=()=>{cleanup();reject(Error('음성을 재생하지 못했어요.'));};current.play().catch(e=>{cleanup();reject(e);});});
        URL.revokeObjectURL(url);url=null;audio=null;
        if(i<sentences.length-1)await wait(/[?？]\s*$/.test(sentences[i])?(profile.questionPause||900):profile.pause,signal);
      }
      emit('ended',{characterId:id});return {status:'ended'};
    }catch(error){if(error.name==='AbortError')return {status:'cancelled'};emit('error',{message:error.message});return {status:'error',message:error.message};}
    finally{if(token===sequence){active=null;controller=null;if(url)URL.revokeObjectURL(url);url=null;audio=null;}}
  }
  function speak(id,text,options={}){const {restart=false}=options;
    if(!profiles[id])return Promise.resolve({status:'unknown-character'});
    text=String(text||'').trim();if(!text)return Promise.resolve({status:'empty'});
    if(localStorage.getItem('digital_school_muted')==='true')return Promise.resolve({status:'muted'});
    if(!restart&&active?.id===id&&active.text===text)return active.promise;
    stop();window.speechSynthesis?.cancel();window.dispatchEvent(new Event('character-audio-start'));window.CharacterAudioPlayer?.stop();
    last={id,text};controller=new AbortController();const token=sequence;
    active={id,text};emit('speaking',{characterId:id});active.promise=run(id,text,token,controller.signal,options);return active.promise;
  }

  const recordings=Object.freeze(Object.fromEntries(Object.keys(profiles).map(id=>[id,'/assets/audio/character-samples/'+id+'.wav'])));
  function playRecording(id,{restart=false}={}){
    if(!recordings[id])return Promise.resolve({status:'unknown-character'});
    if(localStorage.getItem('digital_school_muted')==='true')return Promise.resolve({status:'muted'});
    if(!restart&&active?.id===id&&active.recording)return active.promise;
    stop();window.dispatchEvent(new Event('character-audio-start'));window.CharacterAudioPlayer?.stop();
    const token=sequence;controller=new AbortController();const signal=controller.signal;
    const current=new Audio(recordings[id]);audio=current;last={id,recording:true};
    active={id,recording:true};emit('speaking',{characterId:id,source:'recording'});
    active.promise=new Promise(resolve=>{
      const done=status=>{signal.removeEventListener('abort',abort);current.onended=null;current.onerror=null;if(token===sequence){audio=null;controller=null;active=null;emit(status,{characterId:id,source:'recording'});}resolve({status});};
      const abort=()=>{current.pause();done('cancelled');};signal.addEventListener('abort',abort,{once:true});
      current.onended=()=>done('ended');current.onerror=()=>done('error');current.play().catch(()=>done(signal.aborted?'cancelled':'error'));
    });return active.promise;
  }

  function mount(container){const labels=['🔊 음성 켜짐','🔁 다시 듣기','🐢 천천히 듣기'];const buttons=labels.map((text,i)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.style.cssText='min-height:56px;font-size:20px;padding:12px 18px;border:2px solid #d8cfbd;border-radius:14px;background:#fffaf0;cursor:pointer';b.onclick=()=>{if(i===0){prefs.muted=!prefs.muted;if(prefs.muted)stop();save();}else if(i===1){if(last)speak(last.id,last.text,{restart:true});}else{prefs.slow=!prefs.slow;save();if(active&&last)speak(last.id,last.text,{restart:true});}paint();};container.append(b);return b;});function paint(){buttons[0].textContent=prefs.muted?'🔇 음성 꺼짐':'🔊 음성 켜짐';buttons[0].setAttribute('aria-pressed',String(!prefs.muted));buttons[2].setAttribute('aria-pressed',String(prefs.slow));}paint();return buttons;}
  window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('welcome-audio-start',stop);
  window.speakAsCharacter=speak;
  return {recordings,playRecording,characterVoices,profiles,diagnostics,assign,ready,getVoice:id=>voices().find(v=>v.voiceURI===mapping[id])||null,configure,speak,stop,mount,replay:()=>last?(last.recording?playRecording(last.id,{restart:true}):speak(last.id,last.text,{restart:true})):Promise.resolve({status:'empty'}),getState:()=>({configured:!!provider,characterId:active?.id||null,...prefs})};
})();
