const {chromium}=require('playwright'),assert=require('node:assert/strict');const base=process.argv[2]||'http://localhost:8085';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/our-home.html');await page.getByRole('button',{name:'🌱 우리 텃밭',exact:true}).click();
 await page.locator('[data-action=plot]').first().click();await page.getByRole('button',{name:'🥬 상추',exact:true}).click();await page.getByRole('button',{name:'심기',exact:true}).click();await page.getByText('채소를 심었어요. 천천히 함께 가꿔요.',{exact:true}).waitFor();
 await page.reload();await page.getByRole('button',{name:'🌱 우리 텃밭',exact:true}).click();assert.match(await page.locator('[data-action=plot]').first().innerText(),/상추/);
 await page.locator('[data-action=plot]').first().click();await page.getByRole('button',{name:'💧 물 주기',exact:true}).click();await page.getByText('물을 주었어요. 잘 자라기를 기다려요.',{exact:true}).waitFor();
 await page.locator('[data-action=plot]').first().click();await page.getByRole('button',{name:'오늘 물을 주었어요',exact:true}).click();await page.getByText('오늘 물을 주었어요. 내일 다시 만나요.',{exact:true}).waitFor();
 await page.getByRole('button',{name:'🌿 살펴보고 돌보기',exact:true}).click();await page.getByText('돌보기를 마쳤어요.',{exact:true}).waitFor();
 await page.evaluate(()=>{const k='school_anonymous_garden_v1',s=JSON.parse(localStorage.getItem(k));s.garden.homes.demo.plots[0].plantedAt=Date.now()-370000;localStorage.setItem(k,JSON.stringify(s));});await page.reload();await page.getByRole('button',{name:'🌱 우리 텃밭',exact:true}).click();await page.locator('[data-action=plot]').first().click();await page.getByRole('button',{name:'🧺 수확하기',exact:true}).click();await page.getByText('🥬 상추 1개',{exact:true}).waitFor();
 await page.getByRole('button',{name:'🥬 채소 이름 알아보기',exact:true}).click();await page.getByRole('button',{name:'상추',exact:true}).click();await page.getByText('맞아요. 상추예요!',{exact:true}).waitFor();
 await page.getByRole('button',{name:'💬 채소 추억 이야기',exact:true}).click();await page.getByRole('button',{name:'🥔 감자',exact:true}).click();await page.getByRole('button',{name:'이야기 마치기',exact:true}).click();await page.getByText('추억 이야기 활동을 기록했어요.',{exact:true}).waitFor();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);const boxes=await page.locator('button').evaluateAll(bs=>bs.map(b=>b.getBoundingClientRect().height));assert(boxes.every(h=>h>=64));await page.screenshot({path:`tests/garden-${width}.png`,fullPage:true});
 await page.getByRole('button',{name:'우리 집 마당으로',exact:true}).click();await page.getByRole('button',{name:'🏡 이웃집 둘러보기',exact:true}).click();await page.getByText('서버 연결과 선생님 승인이 필요해요.',{exact:true}).waitFor();await page.close();
 }
 console.log('Garden browser: 4 sizes, planting confirmation, reload, water limit, accelerated harvest, quiz, memory, disabled neighbors passed');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
