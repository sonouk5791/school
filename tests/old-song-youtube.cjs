const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const context=await browser.newContext();await context.route('https://www.youtube.com/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<title>YouTube navigation test</title>'}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{sessionStorage.setItem('school_character_welcome_v1','1');localStorage.setItem('digital_school_voice_enabled','false')});
 await page.goto('http://127.0.0.1:8085/');await page.evaluate(()=>{LessonEngine.startLesson('music');LessonEngine.currentStepIndex=1;LessonEngine.renderCurrentStep()});
 await page.locator('#btnRetroPlay').waitFor({state:'visible'});assert.equal(await page.locator('#oldSongAudio').count(),0);assert(await page.locator('#oldSongStatus').isHidden());
 const expected=await page.locator('.btn-retro-yt').getAttribute('href');const popupPromise=page.waitForEvent('popup');await page.locator('#btnRetroPlay').click();const popup=await popupPromise;await popup.waitForLoadState();assert.equal(popup.url(),expected);
 assert.equal(await page.locator('#btnRetroPlay').innerText(),'▶ 노래 듣기');assert.equal(await page.locator('#retroLpRecord.spinning').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS primary listen button opens existing YouTube video URL, no missing-file message/audio, no false playback, existing button style retained');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
