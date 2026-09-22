const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 for(const [index,id] of ['kongi','tori','nabi','bori'].entries()){
 const p=await b.newPage({viewport:{width:1440,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8085/character-house.html');await p.locator('.ch-char-card').nth(index).click();await p.locator('#btnModeFree').click();await p.locator('[data-cat=outfit]').click();await p.waitForTimeout(350);
 const character=p.locator('#customCharacterPreview');const original=(await character.innerHTML()).replace(/custom\d+/g,"customID");
 for(const outfit of ['knit','cardigan','vest','pajamas','outing','sportswear']){await p.locator('[data-choice='+outfit+']').click();assert.match(await p.locator('#avatarOutfitBadge').innerText(),/니트|가디건|조끼|잠옷|외출복|운동복/);if(outfit!=='sportswear')assert.equal(await character.locator('[data-layer=outfit]').count(),1);}
 await p.locator('[data-cat=colors]').click();
 for(const part of ['topColor','bottomColor','shoeColor','accentColor','glassesColor']){await p.getByLabel('색을 바꿀 곳',{exact:true}).selectOption(part);const before=await character.screenshot();await p.locator('[data-choice=pink]').click();await p.waitForTimeout(100);assert(!before.equals(await character.screenshot()),id+' '+part+' must visibly change');}
 await p.locator('[data-cat=accessories]').click();
 for(const acc of ['glasses','hat','ribbon','scarf','bag','hair']){const before=await character.screenshot();await p.locator('[data-choice='+acc+']').click();await p.waitForTimeout(100);assert(!before.equals(await character.screenshot()),id+' '+acc+' must visibly change');}
 await p.locator('[data-cat=expression]').click();
 for(const expression of ['smile','wink','surprised','calm']){const before=await character.screenshot();await p.locator('[data-choice='+expression+']').click();await p.waitForTimeout(250);assert(!before.equals(await character.screenshot()),id+' '+expression+' must visibly change');}
 await p.locator('[data-cat=heldprops]').click();
 for(const prop of ['ball','book','flower','cushion','cup','toy']){await p.locator('[data-choice='+prop+']').click();assert.equal(await character.locator('[data-layer=prop]').count(),1);}
 await p.getByRole('button',{name:'소품 내려놓기',exact:true}).click();assert.equal(await character.locator('[data-layer=prop]').count(),0);
 await p.getByRole('button',{name:'기본 모습으로 되돌리기',exact:true}).click();await p.waitForTimeout(100);assert.equal((await character.innerHTML()).replace(/custom\d+/g,"customID"),original,id+" reset must restore the original image with no modifying layers");
 await p.locator('[data-cat=outfit]').click();await p.locator('[data-choice=cardigan]').click();await p.locator('[data-cat=colors]').click();await p.getByLabel('색을 바꿀 곳',{exact:true}).selectOption('topColor');await p.locator('[data-choice=green]').click();await p.locator('[data-cat=expression]').click();await p.locator('[data-choice=wink]').click();await p.locator('[data-cat=heldprops]').click();await p.locator('[data-choice=book]').click();await p.waitForTimeout(300);
 await character.screenshot({path:'tests/live-custom-'+id+'.png'});
 await p.getByRole('button',{name:'저장하기',exact:true}).click();const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('senior_character_house_data_v1')));assert.equal(saved.customizations[id].topColor,'green');assert.equal(saved.customizations[id].prop,'book');
 await p.reload();assert.match(await p.locator('#avatarOutfitBadge').innerText(),/가디건/);assert.equal(await p.locator('#customCharacterPreview [data-layer=prop]').count(),1);
 await p.locator('#btnBottomUndo').click(); // Existing room undo remains usable.
 assert.deepEqual(errors,[]);await p.close();console.log('PASS '+id+' clothing, 5 color parts, 6 accessories, 4 expressions, 6 props, exact reset and save/restore');
 }
 for(const width of [1024,768,390]){const p=await b.newPage({viewport:{width,height:1000}});await p.goto('http://127.0.0.1:8085/character-house.html');await p.locator('.ch-char-card').first().click();await p.locator('#btnModeFree').click();await p.locator('[data-cat=outfit]').click();assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.equal(await p.locator('.cc-choices button').count(),6);await p.locator('[data-choice=knit]').click();await p.screenshot({path:'tests/live-custom-layout-'+width+'.png',fullPage:true});await p.close();console.log('PASS responsive '+width);}
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
