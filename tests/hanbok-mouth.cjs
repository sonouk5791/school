const {chromium}=require('playwright'),assert=require('node:assert/strict'),{wav}=require('../api/tts.js')._test;
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=no-user-gesture-required']});try{
 const p=await b.newPage({viewport:{width:1440,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/api/tts',async r=>{await new Promise(ok=>setTimeout(ok,350));return r.fulfill({contentType:'audio/wav',body:wav(Buffer.alloc(96000))}).catch(()=>{});});
 await p.goto('http://localhost:8085/index.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(4000);
 for(const id of ['kongi','tori','nabi','bori']){
  const result=await p.evaluate(async id=>{
   const observed=new Set(),otherChanges=[],pending=[];
   const observer=new MutationObserver(()=>document.querySelectorAll('.home-friend .hanbok-character').forEach(s=>{if(s.dataset.character===id)observed.add(s.dataset.mouth);else if(s.dataset.mouth!=='mouthSmile')otherChanges.push(s.dataset.character);}));
   observer.observe(document.querySelector('.home-friends-grid'),{subtree:true,attributes:true,attributeFilter:['data-mouth']});
   const job=speakAsCharacter(id,'천천히 함께 인사해요.');await new Promise(r=>setTimeout(r,120));pending.push(CharacterAnimation.state[id],CharacterAnimation.mouthStates[id]);
   const response=await job;await new Promise(r=>setTimeout(r,100));observer.disconnect();
   return {response,observed:[...observed],otherChanges,pending,final:CharacterAnimation.mouthStates[id]};
  },id);
  assert.equal(result.response.status,'ended');assert.deepEqual(new Set(result.observed),new Set(['mouthClosed','mouthA','mouthO','mouthE','mouthSmile']));assert.deepEqual(result.otherChanges,[]);assert.deepEqual(result.pending,['preparing','mouthSmile']);assert.equal(result.final,'mouthSmile');console.log('PASS',id,'five independent mouths; wait for actual playback; return to smile');
 }
 const stop=await p.evaluate(async()=>{const a=speakAsCharacter('kongi','처음 인사');await new Promise(r=>setTimeout(r,600));const c=speakAsCharacter('tori','다음 인사');await new Promise(r=>setTimeout(r,600));CharacterVoice.stop();return {a:await a,c:await c,states:{...CharacterAnimation.mouthStates}};});
 assert.equal(stop.a.status,'cancelled');assert.equal(stop.c.status,'cancelled');assert(Object.values(stop.states).every(s=>s==='mouthSmile'));
 for(const [width,height] of [[1920,1080],[1600,900],[1366,768],[768,1024],[390,844]]){await p.setViewportSize({width,height});assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));assert.equal(await p.locator('.home-friend .hanbok-character').count(),4);}
 await p.setViewportSize({width:1100,height:1200});
 await p.evaluate(()=>{CharacterVoice.stop();const sheet=document.createElement('div');sheet.id='mouthSheet';sheet.style.cssText='position:absolute;left:0;top:0;z-index:10000;background:#fff9ed;display:grid;grid-template-columns:repeat(5,210px);padding:10px';for(const id of ['kongi','tori','nabi','bori'])for(const mouth of HanbokCharacter.states){const cell=document.createElement('div'),rig=HanbokCharacter.create(id);cell.style.cssText='text-align:center;font:16px sans-serif';rig.dataset.mouth=mouth;rig.style.cssText='width:210px;height:262px;background:transparent';cell.append(rig,document.createTextNode(id+' '+mouth));sheet.append(cell);}document.body.append(sheet);});
 await p.locator('#mouthSheet').screenshot({path:'tests/hanbok-five-mouths.png'});
 // Each mouth state actually changes rendered pixels, not merely a dataset value.
 const cells=p.locator('#mouthSheet > div');for(let row=0;row<4;row++){const hashes=new Set();for(let col=0;col<5;col++){const png=await cells.nth(row*5+col).locator('svg.hanbok-character').screenshot();hashes.add(require('crypto').createHash('sha256').update(png).digest('hex'));}assert.equal(hashes.size,5);}
 assert.deepEqual(errors,[]);console.log('PASS rapid interruption, idle recovery, five responsive sizes and 20 distinct rendered mouth states');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
