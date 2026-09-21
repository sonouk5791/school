const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
for(const width of [390,1440]){
 const p=await b.newPage({viewport:{width,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8085/');await p.locator('#welcomeGreeting[open]').waitFor();await p.evaluate(()=>CharacterAudioPlayer.refresh());
 assert.equal(await p.evaluate(()=>Object.keys(characters).length),4);
 for(const id of ['kongi','tori','nabi','bori']){
  const card=p.locator(`[data-welcome-friend="${id}"]`),img=card.locator('img');
  const box=await img.boundingBox();await img.click({force:true});
  await p.waitForFunction(id=>CharacterAudioPlayer.getState().character===id&&CharacterAudioPlayer.getState().isPlaying,id);
  await p.waitForFunction(id=>document.querySelector(`[data-welcome-friend="${id}"] img`).dataset.viseme==='a',id);
  assert.equal(await img.getAttribute('src'),await p.evaluate(id=>characters[id].mouth.a,id));
  await img.evaluate(img=>img.decode());assert.equal(await img.evaluate(img=>img.naturalWidth),1254);
  const during=await img.boundingBox();assert.equal(during.width,box.width);assert.equal(during.height,box.height);
  await card.getByRole('button',{name:'⏸ 잠시 멈춤',exact:true}).click({force:true});
  await p.waitForFunction(id=>document.querySelector(`[data-welcome-friend="${id}"] img`).getAttribute('src').endsWith(`${id}_idle.png`),id);
  await card.getByRole('button',{name:'🔊 다시 듣기',exact:true}).click({force:true});await p.waitForFunction(()=>CharacterAudioPlayer.getState().isPlaying);
 }
 await p.evaluate(()=>CharacterAudioPlayer.stop());
 await p.locator('.welcome-close').click();
 await p.locator('.animated-character-trigger').click();await p.waitForFunction(()=>animatedCharacter.audio.currentTime>.4);
 assert((await p.locator('.official-character-sprite').getAttribute('src')).includes('/characters/kongi/'));
 await p.locator('[data-ac=pause]').click();assert(await p.evaluate(()=>animatedCharacter.audio.paused));
 await p.locator('[data-ac=pause]').click();await p.waitForFunction(()=>!animatedCharacter.audio.paused);
 await p.locator('[data-ac=mute]').click();assert(await p.evaluate(()=>animatedCharacter.audio.muted));
 await p.locator('[data-senior-page="friends"]').first().click();await p.waitForFunction(()=>animatedCharacter.audio.paused);
 for(const id of ['kongi','tori','nabi','bori']){await p.locator(`[data-friend="${id}"]`).click();await p.waitForFunction(id=>CharacterAudioPlayer.getState().character===id,id);}
 await p.locator('.friend-grid').screenshot({path:`tests/official-characters-${width}.png`});
 await p.evaluate(()=>CharacterAudioPlayer.stop());assert.deepEqual(errors,[]);await p.close();console.log('PASS official identities, actual four voices, stable mouth frames, pause/replay, hero and navigation at '+width);
}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
