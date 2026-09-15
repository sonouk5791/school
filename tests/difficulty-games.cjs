const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8085');await p.evaluate(()=>{VoiceManager.isMuted=true;VoiceManager.stopSpeaking();LessonEngine.startLesson('picture_puzzle');});
for(const [r,count] of [[0,4],[5,8],[10,12],[15,20]]){await p.evaluate(r=>{LessonEngine.currentStepIndex=r;LessonEngine.renderCurrentStep();},r);assert.equal(await p.locator('[data-game="puzzle-place"]').count(),count);assert.equal(await p.locator('[data-game="puzzle-select"]').count(),count);}
for(let n=0;n<20;n++){await p.locator('[data-game="puzzle-select"][data-n="'+n+'"]').click();await p.locator('[data-game="puzzle-place"][data-n="'+n+'"]').click();}
assert.match(await p.locator('#gameFeedback').textContent(),/완성/);
await p.evaluate(()=>LessonEngine.startLesson('word_search'));
for(let r=0;r<20;r++){await p.evaluate(r=>{LessonEngine.currentStepIndex=r;LessonEngine.renderCurrentStep();},r);assert.equal(await p.locator('[data-search-cell]').count(),(4+Math.floor(r/5))**2);await p.locator('[data-search-action="hint"]').click();const d=await p.evaluate(r=>DailyGames.read(DailyGames.day(),'word_search',r),r);assert.equal(d.targets.length,2+Math.floor(r/5));for(const t of d.targets){assert.equal(t.path.map(n=>d.grid[n]).join(''),t.word);}}
const d=await p.evaluate(()=>DailyGames.read(DailyGames.day(),'word_search',19));
for(const t of d.targets){await p.locator('[data-search-cell="'+t.path[0]+'"]').click();await p.locator('[data-search-cell="'+t.path.at(-1)+'"]').click();}
assert.match(await p.locator('#searchFeedback').textContent(),/모든 단어/);
await p.setViewportSize({width:390,height:844});assert(await p.locator('.search-grid').evaluate(e=>e.getBoundingClientRect().width<=390));assert.deepEqual(errors,[]);console.log('PASS: 4/8/12/20 piece tiers, 20-piece completion; 20 word grids, valid placements, all words completion, mobile width.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
