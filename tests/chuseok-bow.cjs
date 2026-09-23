const assert=require('assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{window.bows=[];document.addEventListener('animationstart',e=>{if(e.animationName==='chuseok-gentle-bow')window.bows.push({id:e.target.closest('[data-character]').dataset.character,time:performance.now(),active:document.querySelectorAll('.is-bowing').length});});});
await page.goto('http://localhost:8085/index.html');await page.waitForTimeout(13000);
const events=await page.evaluate(()=>window.bows);assert.equal(events.length,4);assert.equal(new Set(events.map(e=>e.id)).size,4);assert(events.every(e=>e.active===1));assert(events.slice(1).every((e,i)=>e.time-events[i].time>=2400));
assert.deepEqual(await page.locator('.home-friend').evaluateAll(links=>links.map(a=>a.getAttribute('href'))),['senior-exercise.html','tori-play.html','nabi-learn.html','bori-hobby.html']);
await page.locator('.home-friend-kongi').hover();assert.equal(await page.locator('.is-bowing').count(),0);
await page.evaluate(()=>document.querySelector('.home-friend-kongi svg').classList.add('is-bowing'));await page.waitForTimeout(950);await page.screenshot({path:'tests/chuseok-bow-mid.png'});
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);assert.equal(await page.locator('.is-bowing').count(),0);await page.reload();await page.waitForTimeout(3000);assert.equal(await page.evaluate(()=>window.bows.length),0);
for(const width of [768,390,320]){await page.setViewportSize({width,height:950});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);}
assert.deepEqual(errors,[]);await browser.close();console.log('PASS sequential once-only bows, duration spacing, cooldown, links, reduced motion, responsive overflow and console');})();

