const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const p=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8085');await p.evaluate(()=>{VoiceManager.isMuted=true;VoiceManager.stopSpeaking();});
const start=async id=>p.evaluate(id=>LessonEngine.startLesson(id),id);
await start('word_cross');
for(let i=0;i<3;i++){await p.locator('[data-game="word-select"][data-n="'+i+'"]').click();await p.locator('[data-game="word-answer"][data-n="'+i+'"]').click();}
assert.match(await p.locator('#gameFeedback').textContent(),/모든 낱말/);
await p.locator('.extra-game').screenshot({path:'tests/word-cross.png'});
await start('picture_puzzle');
await p.locator('[data-game="puzzle-select"][data-n="0"]').click();await p.locator('[data-game="puzzle-place"][data-n="1"]').click();assert.equal(await p.locator('.piece-number').count(),4);
for(let i=0;i<4;i++){await p.locator('[data-game="puzzle-select"][data-n="'+i+'"]').click();await p.locator('[data-game="puzzle-place"][data-n="'+i+'"]').click();}
assert.match(await p.locator('#gameFeedback').textContent(),/完成|완성/);
await p.locator('.extra-game').screenshot({path:'tests/picture-puzzle.png'});
await p.locator('[data-game="reset"]').click();assert.equal(await p.locator('.puzzle-board .filled').count(),0);
await start('picture_bingo');
for(let i=0;i<9;i++){
 await p.locator('[data-game="bingo-call"]').click();
 const called=await p.locator('.play-clue strong').textContent();
 await p.locator('[data-game="bingo-mark"]').filter({hasText:called}).click();
 if((await p.locator('#gameFeedback').textContent()).includes('빙고!'))break;
}
assert.match(await p.locator('#gameFeedback').textContent(),/빙고!/);
await p.setViewportSize({width:390,height:844});
await p.locator('.extra-game').screenshot({path:'tests/bingo-mobile.png'});
assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
assert.deepEqual(errors,[]);console.log('PASS: crossword intersections, puzzle hint and completion/reset, bingo valid calls and win, mobile width, no JS errors.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
