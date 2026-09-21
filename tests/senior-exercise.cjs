const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs');
const program=JSON.parse(fs.readFileSync('assets/senior-exercise/program.json','utf8'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const width of [390,768,1440]){
  const p=await browser.newPage({viewport:{width,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:8085/senior-exercise.html');await p.waitForFunction(()=>!document.getElementById('exerciseStart').disabled);
  assert(await p.locator('#exerciseAudio').evaluate(a=>a.paused));assert.equal(await p.locator('#currentScene').evaluate(i=>i.naturalWidth),1672);
  const stage=await p.locator('#exerciseStage').boundingBox();assert(Math.abs(stage.width/stage.height-16/9)<.01);assert.equal(await p.locator('#currentScene').evaluate(i=>getComputedStyle(i).objectFit),'contain');
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.locator('#exerciseStart').click();await p.waitForFunction(()=>document.getElementById('exerciseAudio').currentTime>.15&&!document.getElementById('exerciseAudio').paused);
  await p.locator('#exercisePause').click();const time=await p.locator('#exerciseAudio').evaluate(a=>a.currentTime);await p.waitForTimeout(250);assert.equal(await p.locator('#exerciseAudio').evaluate(a=>a.currentTime),time);
  await p.locator('#exerciseNext').click();assert.match(await p.locator('#exerciseTitle').innerText(),/목과 어깨/);assert(await p.locator('#exerciseAudio').evaluate(a=>a.paused));
  await p.locator('#exerciseNext').click();assert.match(await p.locator('#exerciseTitle').innerText(),/팔 올리기/);await p.locator('#exercisePrev').click();assert.match(await p.locator('#exerciseTitle').innerText(),/목과 어깨/);
  await p.locator('#exerciseMute').click();assert(await p.locator('#exerciseAudio').evaluate(a=>a.muted));await p.locator('#exerciseMute').click();assert(!await p.locator('#exerciseAudio').evaluate(a=>a.muted));
  for(const cue of program.cues.filter(c=>c.scene==='arms'&&c.number).slice(0,4)){await p.locator('#exerciseAudio').evaluate((a,t)=>a.currentTime=t,cue.start+.1);await p.waitForFunction(n=>document.getElementById('exerciseCount').textContent===String(n),cue.number);}
  // The browser audio clock, not a separate timer, advances to the next picture.
  await p.locator('#exerciseAudio').evaluate((a,t)=>a.currentTime=t,program.scenes[2].end-.2);await p.locator('#exerciseStart').click();await p.waitForFunction(()=>document.getElementById('exerciseTitle').textContent.includes('무릎'));
  await p.locator('#exercisePause').click();const transform=await p.locator('#currentScene').getAttribute('style');await p.waitForTimeout(200);assert.equal(await p.locator('#currentScene').getAttribute('style'),transform);
  for(const scene of program.scenes){await p.locator('#exerciseAudio').evaluate((a,t)=>a.currentTime=t,scene.start+.1);await p.waitForFunction(title=>document.getElementById('exerciseTitle').textContent===title,scene.title);assert((await p.locator('#currentScene').getAttribute('src')).endsWith(scene.image));await p.locator('#currentScene').evaluate(i=>i.decode());}
  await p.locator('#exerciseFullscreen').click();assert(await p.evaluate(()=>!!document.fullscreenElement||document.getElementById('exercisePlayer').classList.contains('se-focus')));await p.locator('#exerciseFullscreen').click();
  await p.locator('#exerciseRestart').click();await p.waitForFunction(()=>document.getElementById('exerciseAudio').currentTime<1&&!document.getElementById('exerciseAudio').paused);assert.match(await p.locator('#exerciseTitle').innerText(),/디지털 AI/);
  await p.locator('#exerciseAudio').evaluate(a=>a.currentTime=a.duration-.15);await p.waitForFunction(()=>!document.getElementById('exerciseComplete').hidden);assert(await p.locator('#exerciseAudio').evaluate(a=>a.paused));
  await p.locator('#exerciseRestart').click();await p.evaluate(()=>window.dispatchEvent(new Event('pagehide')));assert(await p.locator('#exerciseAudio').evaluate(a=>a.paused));
  await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('#currentScene').evaluate(i=>getComputedStyle(i).transform),'none');
  await p.locator('#exerciseAudio').evaluate(a=>a.currentTime=70);await p.screenshot({path:`tests/senior-exercise-${width}.png`,fullPage:true});assert.deepEqual(errors,[]);await p.close();console.log('PASS exercise playback, pause, all 6 scenes, 4 counts, auto transition, mute, restart/end, fullscreen, cleanup, reduced motion at '+width);
 }
 const p=await browser.newPage({viewport:{width:390,height:900}});await p.addInitScript(()=>sessionStorage.setItem('school_character_welcome_v1','1'));await p.goto('http://127.0.0.1:8085/');await p.locator('.senior-exercise-entry').click();await p.waitForURL('**/senior-exercise.html');assert(await p.locator('#exerciseStart').isVisible());assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.close();console.log('PASS homepage entry opens exercise');
 const q=await browser.newPage();await q.addInitScript(()=>{Element.prototype.requestFullscreen=undefined});await q.goto('http://127.0.0.1:8085/senior-exercise.html');await q.locator('#exerciseFullscreen').click();assert(await q.locator('#exercisePlayer').evaluate(e=>e.classList.contains('se-focus')));await q.keyboard.press('Escape');assert(!await q.locator('#exercisePlayer').evaluate(e=>e.classList.contains('se-focus')));await q.close();console.log('PASS unsupported-fullscreen fallback and Escape');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
