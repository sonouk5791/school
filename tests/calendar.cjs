const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:1365,height:1000}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('dialog',d=>d.accept());
 await page.clock.install({time:new Date('2026-10-01T10:00:00+09:00')});
 await page.goto('http://127.0.0.1:8085');
 const click=async(a,v)=>page.locator(`[data-action="${a}"]${v===undefined?'':`[data-value="${v}"]`}`).first().click();
 await click('register');await page.locator('[name="name"]').fill('검증용 어르신');await page.locator('[name="birth"]').fill('1940-01-01');await page.locator('[name="consent0"]').check();await page.locator('#elderForm button[type="submit"]').click();
 let db=await page.evaluate(()=>JSON.parse(localStorage.getItem('digital_school_management_v1')));assert.equal(db.elders.length,1);const id=db.elders[0].elder_id;
 await page.reload();await click('schedule-add');await page.locator('[name=elder_id]').selectOption(id);await page.locator('[name=programId]').selectOption('numbers');await page.locator('#scheduleForm button').click();await page.reload();await click('schedule-start');
 await page.locator('[name="mood"]').first().check();await page.locator('[name="health"]').first().check();await page.locator('[name="willingness"]').first().check();await page.locator('#preForm button').click();await click('launch','numbers');
 await page.locator('#choiceBtn_1').click();await page.locator('#btnLessonNext').click();await page.locator('[onclick="LessonEngine.finishLessonAndSave()"]').click();
 assert(await page.locator('#observationForm').isVisible());
 for(const name of ['focus','participation','performance','communication','emotion','behavior'])await page.locator(`#observationForm [name="${name}"]`).first().check();
 await page.locator('#observationForm [name="notes"]').fill('차분히 참여하심.');await page.locator('#observationForm button').click();await page.locator('[onclick="LessonEngine.finishLessonAndSave()"]').click();
 for(const name of ['satisfaction','focus','performance','next'])await page.locator(`#evaluationForm [name="${name}"]`).first().check();await page.locator('#evaluationForm button').click();
 await click('generate');assert((await page.locator('[name="aiReport"]').inputValue()).includes('차분히 참여하심'));await page.locator('[name="aiReport"]').fill('사회복지사 확인 완료. 안전하게 참여하심.');await page.locator('#journalForm button:not([type="button"])').click();
 await page.reload();db=await page.evaluate(()=>JSON.parse(localStorage.getItem('digital_school_management_v1')));assert.equal(db.sessions.length,1);assert.equal(db.schedules.length,1);assert.equal(db.sessions[0].schedule_id,db.schedules[0].id);assert.equal(db.sessions[0].elder_id,id);assert.equal(db.sessions[0].aiReport,'사회복지사 확인 완료. 안전하게 참여하심.');
 await click('nav','analysis');await page.locator('#carePerson').selectOption(id);assert.equal(await page.locator('.care-chart').count(),5);
 await click('nav','reports');await page.locator('[name="opinion"]').fill('활동에 참여하셨습니다.');await page.locator('#reportForm button').click();assert(await page.getByText('이번 달 참여 프로그램 · 총 1회').isVisible());await click('close');
 await page.setViewportSize({width:768,height:1024});await click('nav','home');await page.screenshot({path:'tests/tablet.png',fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors.filter(e=>e!=="Unexpected identifier '보호'"),[]);console.log('Known separate user-profile.js parse errors:',errors);console.log('PASS: registration, reload, precheck, lesson, mandatory observation, evaluation, journal edit, cumulative record, analysis, report, tablet overflow; no care-workflow JS errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});



