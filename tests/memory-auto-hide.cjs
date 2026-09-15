const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8085');
await page.evaluate(()=>{VoiceManager.isMuted=true;VoiceManager.stopSpeaking();LessonEngine.startLesson('variety_play');LessonEngine.currentStepIndex=3;LessonEngine.renderCurrentStep();});
assert.equal(await page.locator('[data-play="memory"]:disabled').count(),4);
await page.waitForFunction(()=>[...document.querySelectorAll('[data-play="memory"]')].every(b=>b.textContent==='❔'),{},{timeout:8000});
assert.equal(await page.locator('[data-play="memory"]:disabled').count(),0);
await page.locator('[data-play="memory-preview"]').click();
assert.equal(await page.locator('[data-play="memory"]:disabled').count(),4);
await page.waitForFunction(()=>[...document.querySelectorAll('[data-play="memory"]')].every(b=>b.textContent==='❔'),{},{timeout:8000});
await page.locator('[data-play="reset-memory"]').click();
assert.equal(await page.locator('#memoryCountdown').textContent(),'5초');
await page.evaluate(()=>{LessonEngine.currentStepIndex=4;LessonEngine.renderCurrentStep();});
assert.equal(await page.locator('#memoryCountdown').count(),0);
assert.deepEqual(errors,[]);console.log('PASS: initial auto-hide, replay auto-hide, selectable cards, reset countdown, navigation cleanup.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
