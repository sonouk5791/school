const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8085');await p.evaluate(()=>{VoiceManager.isMuted=true;VoiceManager.stopSpeaking();LessonEngine.startLesson('picture_puzzle');LessonEngine.currentStepIndex=15;LessonEngine.renderCurrentStep();});await p.waitForFunction(()=>document.querySelector('.puzzle-reference').naturalWidth>0);
const ratios=await p.evaluate(()=>{const img=document.querySelector('.puzzle-reference'),grid=document.querySelector('.puzzle-board'),c=grid.querySelector('.puzzle-cell');return {source:img.naturalWidth/img.naturalHeight,cell:c.clientWidth/c.clientHeight,ratio:parseFloat(grid.style.getPropertyValue('--image-ratio'))};});assert(Math.abs(ratios.source-ratios.ratio)<.001);
await p.evaluate(()=>document.querySelector('#lessonViewport').scrollTop=900);await p.evaluate(()=>LessonEngine.nextStep());assert.equal(await p.locator('#lessonViewport').evaluate(e=>e.scrollTop),0);
for(const target of ['word_cross','picture_bingo','word_search']){await p.evaluate(id=>{LessonEngine.startLesson(id);LessonEngine.currentStepIndex=19;LessonEngine.renderCurrentStep();},target);assert(await p.locator('#lessonViewport').evaluate(e=>e.scrollWidth<=e.clientWidth));}
await p.screenshot({path:'tests/audit-mobile-word-search.png'});
const voice=await p.evaluate(()=>{
 VoiceManager.stopSpeaking();VoiceManager.currentSpeakingToken=123;VoiceManager.setTeacherSpeaking(true);
 VoiceManager._playChunkQueue([],0,122,1,1);const stalePreserved=VoiceManager.isSpeakingNow;
 VoiceManager.synth={cancel(){},getVoices(){return[]},speak(u){window.testSpeech=u;},pause(){},resume(){},paused:false,speaking:false};
 VoiceManager.isMuted=false;VoiceManager.speak('첫 문장입니다. 다음 문장입니다.');
 VoiceManager.isPaused=true;window.testSpeech.onend();const pausedTimers=VoiceManager.queuedTimers.length;
 let completed=0;VoiceManager.pausedQueue={chunks:[],nextIndex:0,onEndCallback:()=>completed++};VoiceManager.resumeSpeaking();VoiceManager.stopSpeaking();
 return {stalePreserved,pausedTimers,completed};
});assert(voice.stalePreserved);assert.equal(voice.pausedTimers,0);assert.equal(voice.completed,1);assert.deepEqual(errors,[]);console.log('PASS: puzzle source proportions, lesson scroll reset, highest-tier mobile width, stale speech callback, paused queue and completion.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
