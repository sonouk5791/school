const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://localhost:8085';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const setup=async(options={})=>{const p=await browser.newPage(options);await p.route('**/api/**',r=>r.fulfill({status:503,contentType:'application/json',body:'{"configured":false,"error":"test offline"}'}));return p;};
 for(const [width,height]of [[1920,1080],[1366,768],[768,1024],[390,844]]){
  const page=await setup({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;window.greetingAttempts=[];HTMLMediaElement.prototype.play=function(){if(this.id==='homeGreetingVideo')greetingAttempts.push(this.muted);return play.call(this);};});
  await page.goto(base+'/index.html');await page.waitForFunction(()=>document.querySelector('#homeGreetingVideo')?.currentTime>.1);
  assert.equal((await page.evaluate(()=>greetingAttempts))[0],false);
  assert(await page.locator('#homeGreetingVideo').evaluate(v=>v.autoplay&&v.playsInline&&v.preload==='auto'&&!v.loop));
  assert.equal(await page.locator('#homeGreetingPlay,#homeGreetingSound').count(),0);
  assert((await page.locator('#skipHomeGreeting').boundingBox()).height>=64);
  assert.equal(await page.locator('.character-home-hero h1').textContent(),'안녕하세요. 오늘도 반가워요!');
  await page.screenshot({path:'tests/greeting-'+width+'.png',fullPage:true});
  // Observe a genuine media ended event, not a synthetic dispatch or a duration timer.
  await page.locator('#homeGreetingVideo').evaluate(v=>{window.realEnded=false;v.addEventListener('ended',e=>window.realEnded=e.isTrusted,{once:true});v.currentTime=v.duration-.3;});
  await page.waitForSelector('#friendRooms:visible');assert(await page.evaluate(()=>realEnded));
  assert.equal(await page.locator('.character-home-hero h1').textContent(),'오늘은 어떤 친구 집에 가볼까요?');
  assert.equal(await page.locator('.village-house-art').count(),4);
  for(const button of await page.locator('.hw-enter').all())assert((await button.boundingBox()).height>=64);
  const dest={1920:['kongi','senior-exercise'],1366:['tori','tori-play'],768:['nabi','nabi-learn'],390:['bori','bori-hobby']}[width];
  await page.screenshot({path:'tests/village-'+width+'.png',fullPage:true});
  await page.locator('.home-friend-'+dest[0]).click();await page.waitForURL('**/'+dest[1]+'.html');
  await page.goBack();await page.waitForSelector('#friendRooms:visible');assert(await page.locator('#homeGreetingVideo').evaluate(v=>v.paused));
  await page.reload();await page.waitForSelector('#friendRooms:visible');assert(await page.locator('#homeGreetingVideo').evaluate(v=>v.paused));
  await page.locator('#replayHomeGreeting').click();await page.waitForFunction(()=>{const v=document.querySelector('#homeGreetingVideo');return !v.paused&&v.currentTime>.1&&v.currentTime<3;});
  // Check pause synchronously in the click dispatch, before either fade completes.
  assert(await page.locator('#skipHomeGreeting').evaluate(b=>{b.click();return document.querySelector('video#homeGreetingVideo').paused&&sessionStorage.getItem('school_home_intro_played')==='true';}));
  await page.waitForSelector('#friendRooms:visible');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);await page.close();
 }
 for(const mode of ['audible-blocked','both-blocked','saved-mute','late-rejection']){
  const p=await setup();await p.addInitScript(mode=>{
   if(mode==='saved-mute')localStorage.setItem('digital_school_muted','true');
   const play=HTMLMediaElement.prototype.play;window.calls=[];
   HTMLMediaElement.prototype.play=function(){if(this.id!=='homeGreetingVideo')return play.call(this);calls.push(this.muted);
    if(mode==='late-rejection')return new Promise((resolve,reject)=>setTimeout(()=>reject(new DOMException('Blocked','NotAllowedError')),800));
    if(mode==='both-blocked'||(mode==='audible-blocked'&&!this.muted))return Promise.reject(new DOMException('Blocked','NotAllowedError'));
    return play.call(this);
   };
  },mode);
  await p.goto(base+'/index.html');
  if(mode==='both-blocked'){await p.waitForFunction(()=>document.querySelector('#homeGreetingVideo').hidden);assert(await p.locator('.hw-media img').isVisible());assert.deepEqual(await p.evaluate(()=>calls),[false,true]);}
  else if(mode==='late-rejection'){await p.locator('#skipHomeGreeting').click();await p.waitForTimeout(1100);assert.deepEqual(await p.evaluate(()=>calls),[false]);assert(await p.locator('#homeGreetingVideo').evaluate(v=>v.paused));}
  else{await p.waitForFunction(()=>document.querySelector('#homeGreetingVideo').currentTime>.1);assert(await p.locator('#homeGreetingVideo').evaluate(v=>v.muted));assert.deepEqual(await p.evaluate(()=>calls),mode==='saved-mute'?[true]:[false,true]);}
  if(mode!=='late-rejection'){await p.locator('#skipHomeGreeting').click();await p.waitForSelector('#friendRooms:visible');}await p.close();
 }
 const fail=await setup();await fail.route('**/assets/videos/home-greeting.mp4',r=>r.fulfill({status:404,body:''}));await fail.goto(base+'/index.html');await fail.waitForFunction(()=>document.querySelector('#homeGreetingStatus')?.textContent==='인사 영상을 불러오지 못했어요.');await fail.locator('#skipHomeGreeting').click();await fail.waitForSelector('#friendRooms:visible');await fail.close();
 console.log('PASS audible-first/muted fallback, both denied poster, saved mute, late rejection after skip, real ended, four viewports/room links/back/reload/replay, immediate pause/session flag, 64px actions, video 404 and no page errors/overflow');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
