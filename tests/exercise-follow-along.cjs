const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
const source=JSON.parse(fs.readFileSync('assets/senior-exercise/program.json','utf8'));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const program=structuredClone(source);program.scenes.forEach(s=>{s.duration=.8;s.speechSteps=[{at:0,text:s.audioText}];});
  await page.route('**/assets/senior-exercise/program.json',r=>r.fulfill({json:program}));
  await page.goto('http://127.0.0.1:8085/senior-exercise.html');await page.waitForFunction(()=>!document.getElementById('btnStart').disabled);
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:1000});assert.equal(await page.locator('#viewReady button:visible').count(),1);assert.equal(await page.locator('#viewCompleted').isVisible(),false);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`tests/exercise4-ready-${width}.png`,fullPage:true});
  }
  await page.evaluate(()=>{window.speakAsCharacter=async()=>({status:'ended'});localStorage.setItem('senior_stamps_v1',JSON.stringify([{type:'existing'}]));});
  await page.clock.install();await page.locator('#btnStart').click();
  assert(await page.locator('#viewPlaying').isVisible());assert.equal(await page.locator('.se-controls-main-row button:visible').count(),4);assert.equal(await page.locator('#sceneVideo').isVisible(),false);
  await page.locator('#btnPause').click();const time=await page.locator('#progressTimeline').inputValue();await page.clock.runFor(3000);assert.equal(await page.locator('#progressTimeline').inputValue(),time);
  await page.locator('#btnExerciseReplay').click();assert.equal(await page.locator('#exerciseCounter').textContent(),'1 / 10');
  for(let i=0;i<9;i++)await page.locator('#btnNext').click();await page.clock.runFor(1000);assert.equal(await page.locator('#viewCompleted').isVisible(),false,'skips cannot earn a stamp');
  await page.clock.runFor(15000);await page.waitForFunction(()=>document.body.dataset.exerciseStatus==='completed');
  assert.equal(await page.locator('#viewCompleted button:visible').count(),1);assert.equal(await page.locator('#viewCompleted a:visible').count(),1);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('senior_stamps_v1')).length),2,'preserve old stamp and add one');
  await page.keyboard.press('Space');await page.clock.runFor(3000);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('senior_stamps_v1')).length),2);
  await page.screenshot({path:'tests/exercise4-completed.png',fullPage:true});await page.locator('#btnReplayExercise').click();assert(await page.locator('#viewPlaying').isVisible());assert.equal(await page.locator('#exerciseCounter').textContent(),'1 / 10');await page.close();
  // Real local WebM playback, pause/resume and image fallback on a missing MP4.
  const video=await browser.newPage({viewport:{width:768,height:1000}});video.on('pageerror',e=>errors.push(e.message));
  const media=structuredClone(source);media.scenes[0].video='assets/videos/friends-chair-warmup.webm';media.scenes[1].video='assets/senior-exercise/missing.mp4';
  media.scenes[2].video='assets/videos/friends-exercise-20min.mp4';
  await video.route('**/assets/senior-exercise/program.json',r=>r.fulfill({json:media}));await video.route('**/missing.mp4',r=>r.fulfill({status:404,body:''}));
  await video.goto('http://127.0.0.1:8085/senior-exercise.html');await video.waitForFunction(()=>!document.getElementById('btnStart').disabled);await video.evaluate(()=>window.speakAsCharacter=async()=>({status:'ended'}));
  await video.locator('#btnStart').click();await video.waitForFunction(()=>document.getElementById('sceneVideo').currentTime>.1);assert(await video.locator('#sceneVideo').isVisible());assert(await video.locator('#sceneVideo').evaluate(v=>v.muted));
  await video.locator('#btnPause').click();assert(await video.locator('#sceneVideo').evaluate(v=>v.paused));await video.locator('#btnPause').click();await video.waitForFunction(()=>!document.getElementById('sceneVideo').paused);
  await video.locator('#btnExerciseReplay').click();assert.equal(await video.locator('#exerciseCounter').textContent(),'1 / 10');await video.locator('#btnNext').click();await video.waitForFunction(()=>document.getElementById('sceneVideo').error!==null);assert.equal(await video.locator('#sceneVideo').isVisible(),false);assert(await video.locator('#sceneFront').isVisible());
  await video.screenshot({path:'tests/exercise4-playing.png',fullPage:true});assert(await video.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await video.locator('#btnNext').click();await video.waitForFunction(()=>document.getElementById('sceneVideo').currentTime>.1);assert(await video.locator('#sceneVideo').isVisible());
  const failed=await browser.newPage();await failed.route('**/assets/senior-exercise/program.json',r=>r.fulfill({status:500,body:''}));await failed.goto('http://127.0.0.1:8085/senior-exercise.html');await failed.waitForFunction(()=>document.getElementById('readyLoadStatus').textContent.includes('불러오지'));assert(await failed.locator('#btnStart').isDisabled());assert.equal(await failed.locator('#viewCompleted').isVisible(),false);
  assert.deepEqual(errors,[]);console.log('PASS ready/play/completed, 4 widths, single start, four controls, all-ten-only stamp, preserved records, repeat, MP4/WebM playback, pause/resume, missing-video image fallback and failed-data protection');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
