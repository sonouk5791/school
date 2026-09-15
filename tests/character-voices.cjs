const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8085');await page.evaluate(()=>VoiceManager.stopSpeaking());
console.log('Available Korean voices:',await page.evaluate(()=>speechSynthesis.getVoices().filter(v=>/^ko/i.test(v.lang)).map(v=>v.name)));
await page.evaluate(()=>{
 window.spoken=[];
 VoiceManager.synth={getVoices:()=>[],cancel(){},speak(u){window.spoken.push({pitch:u.pitch,rate:u.rate,text:u.text});window.testUtterance=u;u.onstart();},pause(){},resume(){}};
 VoiceManager.isMuted=false;
});
const profiles=[];
for(const id of ['kongi','tori','nabi','bori']){
 await page.locator('[data-friend="'+id+'"]').click();
 await page.waitForFunction(id=>document.querySelector('#kongiHeroImg').src.includes('friend-'+id+'-talk'),id);
 profiles.push(await page.evaluate(()=>window.spoken.at(-1)));
 await page.evaluate(()=>VoiceManager.pauseSpeaking());
 assert(!(await page.locator('#kongiHeroImg').getAttribute('src')).includes('-talk'));
 await page.evaluate(()=>VoiceManager.stopSpeaking());
}
assert.equal(new Set(profiles.map(p=>p.pitch)).size,4);
assert.equal(new Set(profiles.map(p=>p.rate)).size,4);
assert.equal(await page.locator('#kongiMouth').count(),0);
await page.locator('.character-greet').click();
await page.waitForFunction(()=>document.querySelector('#kongiHeroImg').src.includes('-talk'));
await page.locator('.hero-robot-wrapper').screenshot({path:'tests/character-speaking.png'});
await page.evaluate(()=>window.testUtterance.onend());
assert(!(await page.locator('#kongiHeroImg').getAttribute('src')).includes('-talk'));
await page.evaluate(()=>VoiceManager.stopSpeaking());
assert.deepEqual(errors,[]);
console.log('PASS: four distinct pitch/rate profiles, speech frames, pause/end reset, preview button, no mouth overlay or JS errors.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
