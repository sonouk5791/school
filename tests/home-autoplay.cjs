const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://localhost:8085';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const [width,height,columns]of [[1920,1080,2],[1366,768,2],[768,1024,2],[390,844,1]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/index.html');await page.waitForFunction(()=>document.querySelector('#homeGreetingVideo')?.currentTime>.1);
  assert(await page.locator('#homeGreetingVideo').evaluate(v=>v.muted&&v.autoplay&&v.playsInline&&v.preload==='auto'&&!v.loop));
  assert(!(await page.locator('#homeGreetingPlay').isVisible()));
  await page.evaluate(()=>{window.introCalls=[];window.speakAsCharacter=async(id)=>{introCalls.push(id);};});
  await page.locator('#homeGreetingVideo').evaluate(v=>v.currentTime=4);
  await page.locator('#homeGreetingSound').click();assert(await page.locator('#homeGreetingVideo').evaluate(v=>!v.muted&&v.currentTime<2));
  await page.locator('#homeGreetingVideo').evaluate(v=>v.currentTime=v.duration-.2);await page.waitForSelector('#friendRooms:visible');
  assert.equal(await page.locator('.home-friends-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),columns);
  if(width===1920){await page.waitForFunction(()=>introCalls.length===4,{},{timeout:20000});assert.deepEqual(await page.evaluate(()=>introCalls),['kongi','tori','nabi','bori']);}
  const dest={1920:['kongi','senior-exercise'],1366:['tori','tori-play'],768:['nabi','nabi-learn'],390:['bori','bori-hobby']}[width];
  assert.equal(await page.locator('.village-house-art').count(),4);for(const button of await page.locator('.hw-enter').all())assert((await button.boundingBox()).height>=64);
  await page.waitForSelector('.is-introducing');
  await page.screenshot({path:'tests/village-'+width+'.png',fullPage:true});
  await page.locator('.home-friend-'+dest[0]).click();await page.waitForURL('**/'+dest[1]+'.html');
  await page.goto(base+'/index.html');await page.waitForSelector('#friendRooms:visible');assert(await page.locator('#homeGreetingVideo').evaluate(v=>v.paused));
  await page.locator('#replayHomeGreeting').click();await page.waitForFunction(()=>{const v=document.querySelector('#homeGreetingVideo');return !v.paused&&v.currentTime>.1&&v.muted;});
  await page.locator('#skipHomeGreeting').click();await page.waitForSelector('#friendRooms:visible');assert(await page.locator('#homeGreetingVideo').evaluate(v=>v.paused));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);await page.close();
 }
 const page=await browser.newPage();await page.addInitScript(()=>{const original=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(!window.allowGreetingPlay)return Promise.reject(new DOMException('Blocked','NotAllowedError'));return original.call(this);};});
 await page.goto(base+'/index.html');await page.locator('#homeGreetingPlay').waitFor({state:'visible'});assert(await page.locator('.hw-media img').isVisible());
 await page.evaluate(()=>window.allowGreetingPlay=true);await page.locator('#homeGreetingPlay').click();await page.waitForFunction(()=>document.querySelector('#homeGreetingVideo').currentTime>.1);
 await page.close();
 const fail=await browser.newPage();await fail.route('**/assets/videos/home-greeting.mp4',r=>r.fulfill({status:404,body:''}));await fail.goto(base+'/index.html');await fail.waitForFunction(()=>document.querySelector('#homeGreetingStatus')?.textContent.includes('불러오지'));await fail.locator('#skipHomeGreeting').click();await fail.waitForSelector('#friendRooms:visible');await fail.close();
 console.log('PASS muted autoplay, sound restart, real ended, four intros, 2/2/2/1 village layout, four house destinations, 64px buttons, session return suppression, replay, skip, autoplay denied recovery and video 404 escape');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
