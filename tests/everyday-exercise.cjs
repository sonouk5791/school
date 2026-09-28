const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.argv[2]||'http://127.0.0.1:8085';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('everyday-preserve','saved'));
  const data=await (await page.request.get(base+'/assets/senior-exercise/program.json')).json();
  assert.equal(data.scenes.length,10);
  for(const scene of data.scenes){
   const path=scene.image.includes('/')?scene.image:'assets/senior-exercise/images/'+scene.image;
   assert.equal((await page.request.get(base+'/'+path)).status(),200,path);
  }
  for(const [width,height] of [[1920,1080],[1600,900],[1366,768],[768,1024],[390,844],[320,900]]){
   await page.setViewportSize({width,height});
   for(const [file,id,button] of [['senior-exercise.html','kongi','#btnStart'],['tori-play.html','tori','[data-game="match"]'],['nabi-learn.html','nabi','[data-learn="today"]'],['bori-hobby.html','bori','[data-tab="song"]']]){
    await page.goto(base+'/'+file);await page.waitForFunction(()=>window.CharacterAnimation?.expressionsReady);
    assert.equal(await page.getAttribute('html','data-season'),'everyday');
    assert.match(await page.locator('.room-character-rig [data-part="fixed-body"]').getAttribute('href'),new RegExp('everyday/'+id+'-active.png'));
    assert(!/명절을 앞두고|추석을 기다리며|한가위/.test(await page.locator('body').innerText()));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' overflow '+width);
    assert.equal(await page.evaluate(()=>localStorage.getItem('everyday-preserve')),'saved');
    assert.equal(await page.evaluate(()=>[...document.images].filter(i=>i.getClientRects().length && (!i.complete||i.naturalWidth===0)).length),0);
    // Exercise real voice-state listeners without making paid synthesis requests.
    await page.evaluate(id=>window.dispatchEvent(new CustomEvent('character-voice-state',{detail:{state:'playing',characterId:id,text:'아 오 에'}})),id);
    assert.equal(await page.evaluate(id=>CharacterAnimation.state[id],id),'talking');
    assert(await page.evaluate(id=>Object.entries(CharacterAnimation.state).every(([key,value])=>key===id||value==='idle'),id));
    for(const shape of ['mouthClosed','mouthA','mouthO','mouthE','mouthSmile']){
      await page.locator('.room-character-rig').evaluate((el,state)=>el.dataset.mouth=state,shape);
      assert.equal(await page.locator('.room-character-rig [data-mouth-shape]').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none').length),1);
    }
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('character-voice-state',{detail:{state:'ended'}})));
    if(width===1366&&id==='kongi')await page.screenshot({path:'tests/everyday-ready.png',fullPage:true});
    await page.evaluate(()=>window.speakAsCharacter=async()=>({status:'ended'}));await page.locator(button).click();
    assert(await page.locator('.everyday-guide .character-parts-rig').isVisible());
    if(id==='kongi'){assert(await page.locator('#viewPlaying').isVisible());assert(!(await page.locator('#viewCompleted').isVisible()));}
   }
  }
  await page.goto(base+'/index.html');assert.equal(await page.locator('.chuseok-banner').count(),0);
  assert.deepEqual(errors,[]);console.log('PASS everyday outfits, four rooms, six viewport sizes, activity entry, five expression layers, independent voice states, images, no overflow/JS errors, storage preserved');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
