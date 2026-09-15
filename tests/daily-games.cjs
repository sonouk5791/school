const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8085');await p.evaluate(()=>{VoiceManager.isMuted=true;VoiceManager.stopSpeaking();});
for(const id of ['word_cross','picture_puzzle','picture_bingo']){
await p.evaluate(id=>LessonEngine.startLesson(id),id);
assert.equal(await p.evaluate(()=>LessonEngine.currentLesson.steps.length),20);
for(let n=0;n<20;n++){await p.evaluate(n=>{LessonEngine.currentStepIndex=n;LessonEngine.renderCurrentStep();},n);assert.equal(await p.locator('.extra-game').count(),1);}
}
const sets=await p.evaluate(()=>Array.from({length:20},(_,i)=>DailyGames.words('2026-09-14',i)));
assert.equal(new Set(sets.map(w=>w.map(x=>x.answer).join())).size,20);
for(const w of sets){assert.equal(w[0].answer[1],w[1].answer[0]);assert.equal(w[1].answer[1],w[2].answer[0]);}
const images=await p.evaluate(()=>Array.from({length:20},(_,i)=>DailyGames.image('2026-09-14',i)));for(const path of images)assert(fs.existsSync(path));
await p.evaluate(()=>{LessonEngine.startLesson('picture_puzzle');LessonEngine.currentStepIndex=0;LessonEngine.renderCurrentStep();});
for(let n=0;n<4;n++){await p.locator('[data-game="puzzle-select"][data-n="'+n+'"]').click();await p.locator('[data-game="puzzle-place"][data-n="'+n+'"]').click();}
assert.match(await p.locator('[data-daily-count="picture_puzzle"]').textContent(),/1\/20/);
await p.reload();await p.evaluate(()=>VoiceManager.isMuted=true);await p.locator('[data-launch-game="picture_puzzle"]').click();
assert.equal(await p.evaluate(()=>LessonEngine.currentStepIndex),1);
assert.equal(await p.evaluate(()=>DailyGames.read('2099-01-01','picture_puzzle',0)),null);
assert.notEqual(await p.evaluate(()=>DailyGames.image('2026-09-14',0)),await p.evaluate(()=>DailyGames.image('2026-09-15',0)));
assert.deepEqual(errors,[]);console.log('PASS: 60 game rounds, 20 valid crossword sets and local puzzle assets, completed count, reload/resume, daily separation and rotation, no JS errors.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
