const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:8085';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function open(){await page.goto(base+'/index.html');await page.locator('#openFriendRooms').click();await page.locator('#homeMoreOptions summary').click();await page.locator('#homeMoreOptions [data-senior-page="activities"]').click();await page.locator('.home-legacy-greeting summary').click();await page.locator('[data-kongi-greeting]').scrollIntoViewIfNeeded();}
 for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844],[320,900]]){
  await page.setViewportSize({width,height});await open();const video=page.locator('.kgv-video');
  assert(await video.evaluate(v=>v.paused&&!v.loop&&!v.controls&&!v.autoplay&&v.playsInline));assert(await page.locator('.kgv-poster').isVisible());
  await page.locator(width===390?'.kgv-touch':'.kgv-play').click();await page.waitForFunction(()=>document.querySelector('.kgv-video').currentTime>.2);
  assert.equal(await video.evaluate(v=>getComputedStyle(v).objectFit),'contain');assert(await video.isVisible());
  await page.locator('.kgv-sound').click();assert(await video.evaluate(v=>v.muted));await page.locator('.kgv-sound').click();assert(!(await video.evaluate(v=>v.muted)));
  await video.evaluate(v=>v.currentTime=v.duration-.3);await page.waitForFunction(()=>document.querySelector('.kgv-video').ended);
  assert(await page.locator('.kgv-poster').isVisible());assert.equal(await page.locator('.kgv-play').textContent(),'▶ 다시 인사해요');assert(await page.locator('.kgv-line').isVisible());
  await page.locator('.kgv-play').click();await page.waitForFunction(()=>document.querySelector('.kgv-video').currentTime>.1&&!document.querySelector('.kgv-video').ended);
  await page.locator('.home-legacy-greeting summary').click();await page.waitForFunction(()=>document.querySelector('.kgv-video').paused);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
 await page.setViewportSize({width:1366,height:900});await open();await page.screenshot({path:'tests/kongi-greeting-video.png',fullPage:false});
 await page.reload();assert(await page.locator('.kgv-video').evaluate(v=>v.paused));
 await page.route('**/assets/videos/kongi-greeting.mp4',r=>r.fulfill({status:404,body:''}));await open();await page.locator('.kgv-play').click();await page.waitForFunction(()=>document.querySelector('.kgv-status').textContent.includes('불러오지'));assert(await page.locator('.kgv-poster').isVisible());assert(await page.locator('.kgv-line').isVisible());
 assert.deepEqual(errors,[]);console.log('PASS MP4 playback/audio controls/end poster/replay/reload/fallback/disclosure stop, five responsive sizes, no JS errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
