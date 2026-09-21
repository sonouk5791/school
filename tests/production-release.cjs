const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const origin=process.argv[2]||'https://school-tau-pearl.vercel.app',root=path.resolve(__dirname,'..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const files=['index.html','js/characters.js','js/character-lipsync.js','js/animated-character.js','css/official-characters.css','characters/high-resolution-preview.html','assets/exercise-20min/review.html'];
 for(const id of ['kongi','tori','nabi','bori'])for(const v of 'aeiou')files.push(`public/characters/${id}/mouth/${id}_${v}.png`);
 for(let i=0;i<files.length;i+=4)await Promise.all(files.slice(i,i+4).map(async file=>{const response=await fetch(`${origin}/${file}?release=20260921`,{signal:AbortSignal.timeout(60000)});assert.equal(response.status,200,file);const bytes=Buffer.from(await response.arrayBuffer());assert.equal(sha(bytes),sha(fs.readFileSync(path.join(root,file))),file+' differs from local release');}));
 const {chromium}=require('playwright'),browser=await chromium.launch({channel:'msedge',headless:true});
 try{const page=await browser.newPage({viewport:{width:390,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(origin,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.CharacterLipSync&&window.characters);assert.equal(await page.evaluate(()=>characters.kongi.size[0]),1254);await page.goto(origin+'/characters/high-resolution-preview.html');await page.locator('.frames img').last().waitFor();await page.locator('.frames img').evaluateAll(async imgs=>Promise.all(imgs.map(img=>img.decode())));assert.equal(await page.locator('.frames img').count(),20);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);}finally{await browser.close();}
 console.log(`PASS production: ${files.length} HTTP 200 responses and exact SHA-256 matches; mobile main page and 20 high-resolution assets, no browser errors.`);
})().catch(e=>{console.error(e);process.exitCode=1});
