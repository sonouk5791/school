const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://localhost:8085';
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const page = await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{localStorage.setItem('school_character_voice_prefs_v1',JSON.stringify({muted:true}));localStorage.setItem('digital_school_muted','true');});
  for (const [width,height] of [[1920,1080],[1600,900],[1366,768],[768,1024],[390,844]]) {
    await page.setViewportSize({width,height});
    await page.goto(base+'/index.html');
    if(await page.locator('#friendRooms').isVisible())await page.locator('#replayHomeGreeting').click();
    await page.waitForSelector('#homeGreetingPlay');
    assert.equal(await page.locator('.class-choice:visible').count(),0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(width===1600)await page.screenshot({path:'tests/operations-home-1600.png'});
    await page.locator('#skipHomeGreeting').click();
    await page.waitForSelector('#friendRooms:visible');
    assert.equal(await page.locator('.home-friend:visible').count(),4);
    const broken=await page.evaluate(()=>[...document.querySelectorAll('#friendRooms img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));
    assert.deepEqual(broken,[]);
  }
  for (const path of ['daycare-class.html?session=am','daycare-class.html?session=pm','daily-course.html','senior-exercise.html','tori-play.html','nabi-learn.html','bori-hobby.html']) {
    const response=await page.goto(base+'/'+path);
    assert.equal(response.status(),200,path);
    if(path.startsWith('daycare-class'))assert(await page.locator('#btnStartClass').isVisible());
  }
  const status=await page.request.get(base+'/api/operations?action=status');
  assert.equal(status.status(),200);
  console.log('Operations status:',await status.json());
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log('PASS live 5 responsive sizes, four preserved character cards, seven lesson/room URLs, no page errors');
})().catch(e=>{console.error(e);process.exit(1)});
