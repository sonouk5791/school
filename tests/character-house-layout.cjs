const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const width of [1440,1024,768,390]){
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8085/character-house.html');
  await page.locator('.ch-char-card').first().click();
  const source=await page.locator('#charAvatar').getAttribute('src');
  await page.locator('#charAvatar').evaluate(i=>i.decode());
  assert.equal(await page.locator('#itemsLayer .ch-placed-item').count(),6);
  assert.equal(await page.locator('#itemsLayer svg').count(),6);
  const room=await page.locator('#roomViewport').boundingBox(),avatar=await page.locator('#charAvatar').boundingBox();
  assert(avatar.height/room.height>=.43&&avatar.height/room.height<=.49);
  assert.equal(await page.locator('#charAvatar').evaluate(e=>getComputedStyle(e).objectFit),'contain');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.equal(await page.locator('#roomRug').evaluate(e=>getComputedStyle(e).borderTopStyle),'none');
  assert.equal(await page.locator('#charAvatarWrap #avatarOutfitBadge').count(),0);
  await page.getByRole('button',{name:'따뜻한 니트 코디 선택',exact:true}).click();
  assert.match(await page.locator('#avatarOutfitBadge').innerText(),/노란색·흰색 운동복/); assert.doesNotMatch(await page.locator('#avatarOutfitBadge').innerText(),/니트/);
  assert.equal(await page.locator('#charAvatar').getAttribute('src'),source);
  await page.locator('[data-cat=furniture]').click();
  await page.getByRole('button',{name:'폭신한 소파 방에 놓기',exact:true}).click();
  assert.equal(await page.locator('[data-item-id=f_sofa]').count(),2);
  await page.locator('#btnBottomUndo').click();
  assert.equal(await page.locator('[data-item-id=f_sofa]').count(),1);
  await page.locator('[data-cat=room]').click();
  await page.getByRole('button',{name:/연한 분홍 벽/}).click();
  await page.waitForFunction(()=>getComputedStyle(document.getElementById('roomWall')).backgroundColor==='rgb(253, 240, 244)');
  await page.locator('#btnBottomSave').click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('senior_character_house_data_v1')));
  assert.equal(saved.placedItems.length,6);assert.equal(saved.outfit.top,'top_knit');
  await page.locator('#roomViewport').screenshot({path:`tests/house-room-${width}.png`});
  await page.reload();
  await page.locator('#btnResumeWork').click();
  assert.equal(await page.locator('#itemsLayer .ch-placed-item').count(),6);
  assert.match(await page.locator('#avatarOutfitBadge').innerText(),/노란색·흰색 운동복/); assert.doesNotMatch(await page.locator('#avatarOutfitBadge').innerText(),/니트/);
  assert.deepEqual(errors,[]);
  await page.close();console.log('PASS room composition, selection, wallpaper, undo and saved room at '+width);
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});




