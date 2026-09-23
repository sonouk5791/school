const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {chromium}=require('playwright');
const bank=(file,name)=>{const s=fs.readFileSync(file,'utf8');const start=s.indexOf('const '+name+' = [');return vm.runInNewContext(s.slice(start+s.slice(start).indexOf('['),s.indexOf('];',start)+1));};
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{localStorage.setItem('digital_school_muted','true');});
  const state=async v=>{await page.waitForFunction(v=>RoomActivity.activityStatus===v,v);};
  const select=async key=>{await page.locator(`[data-game="${key}"],[data-learn="${key}"],[data-tab="${key}"]`).click();await state('playing');assert.equal(await page.locator('.game-panel:visible,.learn-panel:visible,.hobby-panel:visible').count(),1);assert.equal(await page.locator('.stamp-area:visible,.completion-banner:visible').count(),0);};
  const completed=async()=>{await state('completed');assert.equal(await page.locator('.stamp-area:visible,.completion-banner:visible').count(),1);assert(await page.getByText('정말 잘하셨어요!',{exact:true}).filter({visible:true}).count());assert.equal(await page.locator('.stamp-area:visible button,.completion-banner:visible button').count(),2);};
  const back=async()=>{await page.getByRole('button',{name:'다른 활동 고르기',exact:true}).click();await state('select');};
  for(const room of ['tori','nabi','bori']){
   const file={tori:'tori-play.html',nabi:'nabi-learn.html',bori:'bori-hobby.html'}[room];
   await page.goto('http://127.0.0.1:8085/'+file);await state('select');
   await page.evaluate(()=>{window.speakAsCharacter=async()=>({status:'ended'});});
   for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:1000});assert.equal(await page.locator('.game-panel:visible,.learn-panel:visible,.hobby-panel:visible').count(),0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`tests/flow3-${room}-${width}.png`,fullPage:true});}
   if(room==='tori'){
    for(const [key,name] of [['match','MATCH_SETS'],['color','COLOR_SETS'],['season','SEASON_SETS'],['animal','ANIMAL_SETS']]){
     await select(key);const questions=key==='season'?await page.evaluate(()=>window._seasonQs):bank(file,name);
     for(const q of questions){await page.locator('#'+key+'Grid').getByRole('button').filter({hasText:q.answer}).click();await page.locator('#btn'+key[0].toUpperCase()+key.slice(1)+'Next').click();}
     await completed();await page.getByRole('button',{name:'다시 하기',exact:true}).click();await state('playing');assert.equal(await page.locator('.stamp-area:visible').count(),0);await page.locator('[data-room-back]').click();await state('select');
    }
   }else if(room==='nabi'){
    await select('today');const day=await page.locator('#todayDayText').textContent();await page.locator('#dayChoiceGrid').getByRole('button').filter({hasText:day}).click();await completed();await back();
    for(const [key,name,prefix] of [['season','SEASON_DATA','seasonL'],['number','NUM_SETS','num'],['proverb','PROVERBS','prov']]){
     await select(key);for(const q of bank(file,name)){await page.locator('#'+prefix+'Grid').getByRole('button').filter({hasText:String(q.a)}).click();await page.locator('#btn'+prefix[0].toUpperCase()+prefix.slice(1)+'Next').click();}await completed();await back();
    }
   }else{
    await page.clock.install();
    await select('riddle');for(let i=0;i<11;i++)await page.locator('#btnRiddleNext').click();assert.equal(await page.locator('.completion-banner:visible').count(),0,'skipping questions must not complete');
    await page.locator('[data-room-back]').click();await select('riddle');await page.locator('#btnRiddleAnswer').click();await page.evaluate(()=>{for(let i=0;i<12;i++)document.getElementById('btnRiddleAnswer').click();});assert.equal(await page.locator('#riddleProgress').textContent(),'확인한 수수께끼: 1개');
    for(let i=1;i<10;i++){await page.locator('#btnRiddleNext').click();await page.locator('#btnRiddleAnswer').click();}await page.clock.runFor(1800);await completed();await back();
    await select('story');await page.locator('.story-card').first().click();await page.locator('.story-answer-btn').nth(1).click();await page.clock.runFor(1600);await page.locator('.story-answer-btn').first().click();await page.clock.runFor(1600);await completed();await back();
    await select('color');await page.locator('.coloring-thumb').first().click();await page.locator('#btnColorSave').click();await state('playing');const rect=await page.locator('#coloringCanvas').boundingBox();await page.mouse.move(rect.x+30,rect.y+50);await page.mouse.down();await page.mouse.move(rect.x+80,rect.y+80);await page.mouse.up();await page.locator('#btnColorSave').click();await completed();await back();
    await select('song');await page.locator('.song-play-btn').first().click();assert.equal(await page.locator('#songList').isVisible(),false);await page.locator('#btnLyricsPlay').click();await page.clock.runFor(32000);await completed();await back();
    // Leaving before delayed completion must not award a stamp in the next activity.
    await select('story');await page.locator('.story-card').first().click();const before=await page.locator('#bhStampNum').textContent();await page.locator('.story-answer-btn').first().click();await page.locator('[data-room-back]').click();await select('riddle');await page.clock.runFor(2000);assert.equal(await page.locator('#bhStampNum').textContent(),before);await state('playing');
   }
   console.log('PASS select/playing/completed, 4 activities and responsive layout:',room);
  }
  assert.deepEqual(errors,[]);console.log('PASS existing questions, real completion, retries, duplicate/stale completion protection, no JS errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
