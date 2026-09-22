const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage();
  const program=JSON.parse(fs.readFileSync('assets/senior-exercise/program.json','utf8'));
  program.scenes.forEach(scene=>{scene.speechSteps.forEach((step,i)=>step.at=.1+i*.2);scene.duration=5;});
  await page.route('**/assets/senior-exercise/program.json',r=>r.fulfill({json:program}));
  await page.goto('http://127.0.0.1:8085/senior-exercise.html');
  await page.waitForFunction(()=>document.getElementById('statusMsg')?.textContent.includes('준비됐어요'));
  await page.evaluate(()=>{
   window.calls=[];window.pending=[];
   window.speakAsCharacter=(id,text)=>{calls.push({id,text});return new Promise(resolve=>pending.push(resolve));};
   window.CharacterVoice.stop=()=>{};
  });
  await page.locator('#btnStart').click();
  await page.waitForFunction(()=>calls.length===1);
  const first=await page.evaluate(()=>calls[0].text);
  assert.equal(await page.locator('#captionText').textContent(),first);
  assert.equal(await page.locator('.se-speech-lead').textContent(),first);
  await page.waitForTimeout(900);
  assert.equal(await page.evaluate(()=>calls.length),1,'next caption must wait for speech, including network delay');
  await page.evaluate(()=>pending.shift()({status:'ended'}));
  await page.waitForFunction(()=>calls.length===2);
  assert.equal(await page.locator('#captionText').textContent(),await page.evaluate(()=>calls[1].text));
  await page.locator('#btnNext').click();
  await page.waitForFunction(()=>calls.length===3);
  const next=await page.locator('#captionText').textContent();
  await page.evaluate(()=>pending.shift()({status:'cancelled'}));
  await page.waitForTimeout(700);
  assert.equal(await page.evaluate(()=>calls.length),3,'old cancellation cannot unlock new narration');
  assert.equal(await page.locator('#captionText').textContent(),next);
  await page.locator('#btnPause').click();
  await page.evaluate(()=>pending.shift()({status:'cancelled'}));
  await page.locator('#btnPause').click();
  await page.waitForFunction(()=>calls.length===4);
  assert.equal(await page.locator('#captionText').textContent(),next,'resume replays interrupted caption');
  console.log('PASS: exact spoken captions/bubble, delayed speech holds timeline, scene cancellation isolation, pause/resume');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
