const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:8085';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('flow-preserve','keep'));
 for(const [width,height,cols]of [[1920,1080,4],[1366,768,4],[768,1024,2],[390,844,1]]){
  await page.setViewportSize({width,height});await page.goto(base+'/index.html');
  await page.evaluate(()=>{history.replaceState({},'');});await page.reload();
  await page.waitForSelector('#homeGreetingPlay');assert(await page.locator('#homeGreeting').isVisible());assert(!(await page.locator('#friendRooms').isVisible()));assert.equal(await page.locator('#classChoices').count(),0);assert.equal(await page.locator('#todayProgramSummary').count(),0);
  assert(await page.locator('#homeGreetingVideo').evaluate(v=>v.paused&&!v.autoplay&&!v.loop));
  await page.evaluate(()=>{window.introCalls=[];window.speakAsCharacter=async(id,text)=>{introCalls.push(id);return {status:'ended'};};});
  await page.locator('#homeGreetingPlay').click();await page.waitForFunction(()=>document.querySelector('#homeGreetingVideo').currentTime>.15);
  assert(!(await page.locator('#friendRooms').isVisible()));await page.locator('#homeGreetingVideo').evaluate(v=>v.currentTime=v.duration-.25);
  await page.waitForSelector('#friendRooms:visible');await page.waitForFunction(()=>document.querySelector('.is-introducing')?.dataset.room==='kongi');
  assert.equal(await page.locator('#friendRooms .home-friend').count(),4);assert.equal(await page.locator('#friendRooms .home-friends-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),cols);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.equal(await page.evaluate(()=>localStorage.getItem('flow-preserve')),'keep');
  await page.screenshot({path:`tests/home-flow-rooms-${width}.png`,fullPage:true});
  if(width===1920){await page.waitForFunction(()=>introCalls.length===4,{},{timeout:20000});assert.deepEqual(await page.evaluate(()=>introCalls),['kongi','tori','nabi','bori']);}
  // Navigation is available during introduction; browser Back restores room choices.
  const target={1920:['kongi','senior-exercise'],1366:['tori','tori-play'],768:['nabi','nabi-learn'],390:['bori','bori-hobby']}[width];
  await page.locator('.home-friend-'+target[0]).click();await page.waitForURL('**/'+target[1]+'.html');await page.goBack();await page.waitForSelector('#friendRooms:visible');
  await page.locator('#replayHomeGreeting').click();assert(await page.locator('#homeGreeting').isVisible());assert(await page.locator('#homeGreetingVideo').evaluate(v=>v.paused));
  await page.locator('#skipHomeGreeting').click();await page.waitForSelector('#friendRooms:visible');
 }
 // Pausing indefinitely cannot trigger a timed transition. Only ended or explicit skip can.
 await page.locator('#replayHomeGreeting').click();await page.locator('#homeGreetingPlay').click();await page.waitForFunction(()=>document.querySelector('#homeGreetingVideo').currentTime>.1);await page.locator('#homeGreetingPlay').click();await page.clock.install();await page.clock.runFor(30000);assert(await page.locator('#homeGreeting').isVisible());await page.clock.resume();
 await page.route('**/assets/videos/home-greeting.mp4',r=>r.fulfill({status:404,body:''}));await page.evaluate(()=>history.replaceState({},''));await page.reload();await page.locator('#homeGreetingPlay').click();await page.waitForFunction(()=>document.querySelector('#homeGreetingStatus').textContent.includes('불러오지'));await page.locator('#skipHomeGreeting').click();await page.waitForSelector('#friendRooms:visible');
 assert.deepEqual(errors,[]);console.log('PASS real ended transition, four sequential introductions, responsive 4/4/2/1 columns, all room links, early selection, Back/replay/skip, paused-video nontransition, failed-video escape, existing data');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
