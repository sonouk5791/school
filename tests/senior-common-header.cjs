const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{localStorage.setItem('digital_school_muted','true');localStorage.setItem('digital_school_voice_enabled','false');});
  for(const file of ['index.html','senior-exercise.html','tori-play.html','nabi-learn.html','bori-hobby.html','character-house.html','daily-course.html']){
   await page.goto('http://127.0.0.1:8085/'+file);await page.waitForSelector('.senior-common-nav');
   const nav=page.locator('.senior-common-nav');
   assert.equal(await nav.locator(':scope>button,:scope>a').count(),5,file);
   await page.evaluate(()=>{if(window.VoiceManager)window.VoiceManager.speak=()=>Promise.resolve();});
   const sound=nav.locator('#btnTtsToggle,[data-common-sound]');
   await sound.click();assert.equal(await page.evaluate(()=>localStorage.getItem('digital_school_muted')),'false');
   await sound.click();assert.equal(await page.evaluate(()=>localStorage.getItem('digital_school_muted')),'true');
   for(const width of [1440,768,390,320]){
    await page.setViewportSize({width,height:1000});
    assert(await nav.evaluate(n=>n.scrollWidth<=n.clientWidth+1),file+' nav overflow '+width);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' page overflow '+width);
    assert(await nav.locator(':scope>button,:scope>a').evaluateAll(nodes=>nodes.every(n=>n.getBoundingClientRect().height>=55.9&&getComputedStyle(n).whiteSpace==='nowrap')),file+' whole labels');
    if(width===390)await page.screenshot({path:'tests/nav2-'+file.replace('.html','.png'),fullPage:true});
   }
   await nav.getByText('Aa 보기 편하게',{exact:true}).click();
   const panel=page.locator(file==='index.html'?'#viewSettingsPanel':'#commonView');assert(await panel.isVisible());
   await panel.getByText('큰 글씨',{exact:true}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('digital_school_font_scale')),'large');
   const contrast=panel.locator('#btnHighContrast,[data-common-contrast]');
   await contrast.click();assert.equal(await page.evaluate(()=>localStorage.getItem('digital_school_high_contrast')),'true');
   const speed=await panel.locator('#btnVoiceSpeed,[data-common-slow]').getAttribute('aria-pressed');
   await panel.getByText('천천히 듣기',{exact:true}).click();
   assert.equal(await page.evaluate(()=>localStorage.getItem('digital_school_voice_speed')),speed==='true'?'normal':'slow');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' large settings overflow');
   await contrast.click();
   await panel.getByText(/기본 글씨/).click();await panel.getByText('닫기',{exact:true}).click();
   await nav.getByText('❓ 도움',{exact:true}).click();
   assert(await page.locator(file==='index.html'?'#headerHelpText':'#commonHelp').isVisible());
   await page.keyboard.press('Escape');
   if(file==='senior-exercise.html'){
    assert.equal(await page.locator('#btnPause').isVisible(),false);
    await nav.getByText('Aa 보기 편하게',{exact:true}).focus();await page.keyboard.press('Space');
    assert(await page.locator('#viewReady').isVisible(),'Space on header must not start exercise');
   }
   console.log('PASS header, accessibility and 4 viewports:',file);
  }
  await page.goto('http://127.0.0.1:8085/index.html#teacher');
  await page.waitForFunction(()=>document.body.dataset.seniorPage==='staff');
  assert.deepEqual(errors,[]);console.log('PASS staff link and no JS errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
