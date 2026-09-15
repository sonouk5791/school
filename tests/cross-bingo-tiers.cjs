const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8085');await p.evaluate(()=>{VoiceManager.isMuted=true;VoiceManager.stopSpeaking();});
const validation=await p.evaluate(()=>{for(let d=1;d<=20;d++)for(let r=0;r<20;r++){const ws=DailyGames.words('2026-09-'+String(d).padStart(2,'0'),r),cells={};for(const w of ws)for(let i=0;i<w.cells.length;i++){const c=w.cells[i];if(cells[c]&&cells[c]!==w.answer[i])throw Error('cross mismatch');cells[c]=w.answer[i];}}return true;});assert(validation);
await p.evaluate(()=>LessonEngine.startLesson('word_cross'));
for(const [r,count,total] of [[0,3,6],[5,5,12],[10,7,20],[15,9,30]]){
await p.evaluate(r=>{LessonEngine.currentStepIndex=r;LessonEngine.renderCurrentStep();},r);assert.equal(await p.locator('.cross-board>div').count(),total);
const words=await p.evaluate(r=>DailyGames.words(DailyGames.day(),r),r);
for(let i=0;i<count;i++){await p.locator('[data-game="word-select"][data-n="'+i+'"]').click();await p.locator('[data-game="word-answer"]').filter({hasText:words[i].answer}).click();}
assert.match(await p.locator('#gameFeedback').textContent(),/모든 낱말/);}
await p.evaluate(()=>LessonEngine.startLesson('picture_bingo'));
for(const r of [0,5,10,15]){await p.evaluate(r=>{LessonEngine.currentStepIndex=r;LessonEngine.renderCurrentStep();},r);const size=3+r/5;assert.equal(await p.locator('[data-game="bingo-mark"]').count(),size*size);
for(let i=0;i<size*size;i++){await p.locator('[data-game="bingo-call"]').click();const called=await p.locator('.play-clue strong').textContent();await p.locator('[data-game="bingo-mark"]').filter({hasText:called}).click();if((await p.locator('#gameFeedback').textContent()).includes('빙고!'))break;}
assert.match(await p.locator('#gameFeedback').textContent(),/빙고!/);}
await p.setViewportSize({width:390,height:844});assert(await p.locator('.bingo-board').evaluate(e=>e.scrollWidth<=e.clientWidth));assert.deepEqual(errors,[]);console.log('PASS: 400 crossword configurations; all four crossword and bingo sizes and completions; mobile width.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
