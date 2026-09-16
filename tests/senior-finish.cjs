const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 try {
  await page.goto('http://127.0.0.1:8085');
  await page.waitForSelector('.senior-start');
  for(const width of [390,768,1024,1440]){
   await page.setViewportSize({width,height:950});
   assert(await page.locator('.senior-primary').isVisible());
   assert.equal(await page.locator('.senior-primary button').count(),3);
   assert.equal(await page.locator('.section-lessons').isVisible(),false);
   assert.equal(await page.locator('#careRoot').isVisible(),false);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`home overflow ${width}`);
   await page.screenshot({path:`tests/senior-home-${width}.png`,fullPage:true,animations:'disabled'});
  }
  await page.locator('[data-start-mood]').first().click();
  assert.equal(await page.locator('[data-start-mood]').first().getAttribute('aria-pressed'),'true');
  await page.locator('.senior-primary [data-senior-page="exercise"]').click();
  assert(await page.locator('#warmupVideo').isVisible());
  for(const width of [390,768,1024]) {
   await page.setViewportSize({width,height:900});
   assert(await page.locator('#warmupPlay').evaluate(e=>e.getBoundingClientRect().right<=innerWidth),`exercise button clipped ${width}`);
   await page.screenshot({path:`tests/senior-exercise-${width}.png`,fullPage:true,animations:'disabled'});
  }
  await page.locator('#warmupPlay').click();
  await page.waitForFunction(()=>document.querySelector('#warmupVideo').currentTime>0);
  assert.equal(Math.round(await page.locator('#warmupVideo').evaluate(v=>v.duration)),1200);
  await page.screenshot({path:'tests/senior-exercise.png',fullPage:true,animations:'disabled'});
  await page.locator('#warmupClass').click();
  assert(await page.locator('[data-start-basic]').isVisible());
  assert(await page.locator('#warmupVideo').evaluate(v=>v.paused));
  await page.locator('[data-start-basic]').click();
  assert.equal(await page.evaluate(()=>LessonEngine.currentLesson.id),'ai_basic');
  await page.setViewportSize({width:390,height:844});
  assert(await page.locator('#lessonViewport [data-senior-page="home"]').isVisible());
  assert(await page.locator('#lessonViewport [data-senior-page="back"]').evaluate(e=>e.getBoundingClientRect().right<=innerWidth));
  await page.screenshot({path:'tests/senior-lesson-mobile.png',fullPage:true,animations:'disabled'});
  await page.locator('#lessonViewport [data-senior-page="back"]').click();
  assert(await page.locator('[data-start-basic]').isVisible());
  await page.locator('.nav-link[data-target="ai-friend"]').click();
  assert(await page.locator('.friend-selection').isVisible());
  await page.screenshot({path:'tests/senior-friends-mobile.png',fullPage:true,animations:'disabled'});
  for(const role of ['건강 체조 친구','마음 친구','기억 친구','음악 친구']) assert(await page.getByText(role,{exact:true}).isVisible());
  await page.locator('.nav-link[data-target="history"]').click();
  assert(await page.locator('.senior-history').isVisible());
  assert.equal(await page.locator('#careRoot').isVisible(),false);
  await page.locator('.nav-link[data-target="home"]').click();
  await page.locator('.senior-start [data-senior-page="activities"]').click();
  await page.locator('#openColoringRoom').click();
  await page.locator('#coloringRoom [data-senior-page="back"]').click();
  assert(await page.locator('#openColoringRoom').isVisible());
  await page.locator('.lesson-card[data-lesson-id="memory"]').click();
  assert.equal(await page.evaluate(()=>VoiceManager.characterId),'nabi');
  await page.locator('#lessonViewport [data-senior-page="home"]').click();
  await page.locator('#btnTeacherSpace').click();
  for(const value of ['elders','records','journals','analysis','reports','admin']){
   await page.locator(`.care-nav [data-value="${value}"]`).click();
   assert(await page.locator('#careRoot').isVisible(),`staff ${value}`);
  }
  await page.screenshot({path:'tests/senior-staff.png',fullPage:true,animations:'disabled'});
  await page.locator('.nav-link[data-target="home"]').click();
  assert(await page.locator('.senior-start').isVisible());
  assert.deepEqual(errors,[]);
  console.log('PASS: responsive home, mood, 20-minute playback, class/back/home, roles, activity dialog, history isolation, six staff pages; no page errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
