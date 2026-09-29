const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:8085';
(async()=>{for(const channel of ['msedge','chrome']){const b=await chromium.launch({channel,headless:true});try{
 const p=await b.newPage({reducedMotion:'reduce'}),calls=[];
 await p.route('**/api/**',r=>{calls.push(r.request().url());return r.fulfill({status:503,contentType:'application/json',body:'{"configured":false,"error":"test offline"}'});});
 await p.goto(base+'/index.html');await p.waitForFunction(()=>document.querySelector('#homeGreetingVideo')?.currentTime>.1);
 console.log(channel,'initial',await p.locator('#homeGreetingVideo').evaluate(v=>({muted:v.muted,audioDecodedBytes:v.webkitAudioDecodedByteCount})));
 assert(!calls.some(url=>url.includes('/api/tts')));
 await p.locator('#skipHomeGreeting').focus();await p.keyboard.press('Enter');await p.waitForSelector('#friendRooms:visible');
 assert.equal(await p.locator('[data-home-wave]').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 for(const c of await p.locator('.home-friend').all()){await c.focus();assert(await c.evaluate(e=>e===document.activeElement));assert.equal(await c.locator('image').first().getAttribute('href'),'assets/images/home-hero/four-friends.jpg');assert(await c.locator('clipPath[id^="village-outline-"]').count());}
 await p.locator('#replayHomeGreeting').focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>document.getElementById('homeGreetingVideo').currentTime>.1);
 assert(await p.locator('#homeGreetingVideo').evaluate(v=>!v.muted));
 await p.evaluate(()=>dispatchEvent(new Event('character-audio-start')));assert(await p.locator('#homeGreetingVideo').evaluate(v=>v.paused));
 await p.locator('#skipHomeGreeting').click();await p.waitForSelector('#friendRooms:visible');await p.locator('#replayHomeGreeting').click();await p.waitForFunction(()=>document.getElementById('homeGreetingVideo').currentTime>.1);
 await p.locator('#btnTeacherSpace').click();assert(await p.locator('#homeGreetingVideo').evaluate(v=>v.paused));
 console.log('PASS',channel,'keyboard skip/replay/house focus, reduced motion, original art clipping, no intro TTS, competing audio/teacher navigation pauses video');
}finally{await b.close();}}})().catch(e=>{console.error(e);process.exitCode=1});
