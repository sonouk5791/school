const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:8085';
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({reducedMotion:'reduce'}),calls=[];await p.route('**/api/tts',r=>{calls.push(r.request().postDataJSON());return r.fulfill({status:503,json:{error:'TTS_NOT_CONFIGURED',message:'test unavailable'}});});
 await p.goto(base+'/index.html');await p.locator('#homeGreetingSound').click();await p.locator('#skipHomeGreeting').click();await p.waitForFunction(()=>document.querySelector('.home-welcome p').textContent==='마음에 드는 친구의 방을 눌러주세요.',null,{timeout:25000});assert.deepEqual(calls.map(c=>c.characterId),['kongi','tori','nabi','bori']);
 assert.equal(await p.locator('[data-home-wave]').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 await p.locator('#replayHomeGreeting').click();await p.locator('#homeGreetingSound').focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>document.getElementById('homeGreetingVideo').currentTime>.1);
 await p.locator('#btnTeacherSpace').click();assert(await p.locator('#homeGreetingVideo').evaluate(v=>v.paused));await p.locator('#inputTeacherPin').fill('flow-test-local-password');await p.locator('#btnSubmitTeacherPin').click();await p.waitForSelector('.operations-panel');
 for(const href of ['daycare-class.html?session=am','daycare-class.html?session=pm','daily-course.html'])assert(await p.locator(`.operations-panel a[href="${href}"]`).isVisible());
 await p.locator('#btnCloseTeacherModal').click();
 console.log('PASS four missing-voice text introductions, fixed voice IDs, reduced motion, keyboard play, teacher-open stops audio, authenticated AM/PM/20-minute entry links');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
