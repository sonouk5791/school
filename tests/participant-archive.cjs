const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
 const page=await context.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));
 try {
  await page.goto('http://127.0.0.1:8085');
  await page.evaluate(()=>{
   const key='digital_school_management_v1',data=JSON.parse(localStorage.getItem(key));
   data.elders=[{elder_id:'archive-test-a',name:'김영자',birth:'1945-03-15',gender:'여성',consentDocuments:[{id:'existing',type:'consent0',date:'2026-09-16',subject:'김영자',confirmed:false,attachments:[]}]},{elder_id:'archive-test-b',name:'김영자',birth:'1950-04-16',gender:'여성'}];
   localStorage.setItem(key,JSON.stringify(data));
  });
  await page.reload();
  const before=await page.evaluate(()=>localStorage.getItem('digital_school_management_v1'));
  await page.locator('#btnTeacherSpace').click();
  await page.locator('#participantArchiveEntry [data-archive="open"]').click();
  const room=page.locator('#participantArchive');
  assert.equal(await room.locator('[data-archive="person"]').count(),2);
  await room.locator('[data-archive="person"][data-id="archive-test-a"]').click();
  await room.locator('#archiveUpload').waitFor();
  const content=Buffer.from('target A private document\n');
  await room.locator('#archiveUpload [name="documentKey"]').selectOption('consent0');
  await room.locator('#archiveUpload [name="files"]').setInputFiles({name:'개인정보_확인.txt',mimeType:'text/plain',buffer:content});
  await room.locator('#archiveUpload button').click();
  await room.getByText('1개 파일을 보관했습니다.',{exact:true}).waitFor();
  await room.locator('[data-archive="checks"]').first().click();
  const first=room.locator('[data-document="consent0"]');
  assert.equal(await first.locator('[name="state"]').inputValue(),'미확인');
  assert.match(await first.innerText(),/보관 파일 1개 · 작성한 서류 1건/);
  await first.locator('[name="state"]').selectOption('확인 완료');
  await first.locator('[name="date"]').fill('2026-09-16');
  await first.locator('[name="note"]').fill('담당자가 원본 확인 · 사무실 2번 서랍');
  page.once('dialog',d=>d.dismiss());await room.locator('[data-archive="files"]').click();
  assert(await room.locator('#archiveChecks').isVisible(),'canceling must retain unsaved checklist');
  page.once('dialog',d=>d.dismiss());await room.locator('[data-senior-page="home"]').click();
  assert(await room.isVisible(),'home must respect unsaved checklist cancellation');
  assert.equal(await first.locator('[name="note"]').inputValue(),'담당자가 원본 확인 · 사무실 2번 서랍');
  await room.locator('#archiveChecks button[type="submit"]').click();
  await room.getByText('서류 확인 내용을 저장했습니다.',{exact:true}).waitFor();
  await room.locator('details summary').click();
  await room.locator('#archiveAddDocument [name="title"]').fill('<img src=x onerror=alert(1)> 초기상담');
  await room.locator('#archiveAddDocument button').click();
  await room.getByText('확인할 서류를 추가했습니다.',{exact:true}).waitFor();
  assert.equal(await room.locator('img[src="x"]').count(),0);
  assert.equal(await room.locator('[data-document]').count(),9);
  await room.screenshot({path:'tests/participant-checklist-desktop.png',animations:'disabled'});
  await room.locator('[data-archive="files"]').click();
  const dl=page.waitForEvent('download');await room.locator('[data-archive="download"]').click();
  const download=await dl;assert.equal(download.suggestedFilename(),'개인정보_확인.txt');
  const chunks=[];for await(const chunk of await download.createReadStream())chunks.push(chunk);
  assert.deepEqual(Buffer.concat(chunks),content);
  await room.locator('.archive-backup summary').click();
  const exportEvent=page.waitForEvent('download');await room.locator('[data-archive="backup"]').click();
  const exported=await exportEvent,exportChunks=[];for await(const chunk of await exported.createReadStream())exportChunks.push(chunk);
  const backup=Buffer.concat(exportChunks),data=JSON.parse(backup.toString());
  assert.equal(data.elderId,'archive-test-a');assert.equal(data.files.length,1);assert.equal(data.checks.find(c=>c.key==='consent0').state,'확인 완료');
  await page.reload();await page.locator('#btnTeacherSpace').click();await page.locator('#participantArchiveEntry [data-archive="open"]').click();
  await room.locator('[data-archive="person"][data-id="archive-test-a"]').click();
  await room.locator('[data-archive="download"]').waitFor();
  await room.screenshot({path:'tests/participant-files-desktop.png',animations:'disabled'});
  await room.locator('[data-archive="people"]').click();
  await room.locator('[data-archive="person"][data-id="archive-test-b"]').click();
  await room.locator('#archiveUpload').waitFor();assert.equal(await room.locator('[data-archive="download"]').count(),0);
  await room.locator('.archive-backup summary').click();
  await room.locator('#archiveRestore').setInputFiles({name:'wrong-person.json',mimeType:'application/json',buffer:backup});
  await room.getByText('선택한 대상자의 파일 보관방 백업이 아닙니다. 대상자를 다시 확인해주세요.',{exact:true}).waitFor();
  assert.equal(await page.evaluate(async()=> (await ParticipantArchiveStore.read('archive-test-b')).files.length),0);
  await room.locator('[data-archive="people"]').click();await room.locator('[data-archive="person"][data-id="archive-test-a"]').click();
  await room.locator('[data-archive="remove"]').waitFor();
  page.once('dialog',d=>d.dismiss());await room.locator('[data-archive="remove"]').click();
  await room.getByText('파일을 그대로 보관합니다.',{exact:true}).waitFor();assert.equal(await room.locator('[data-archive="download"]').count(),1);
  page.once('dialog',d=>d.accept());await room.locator('[data-archive="remove"]').click();
  await room.getByText('파일을 삭제했습니다.',{exact:true}).waitFor();
  await room.locator('.archive-backup summary').click();
  await room.locator('#archiveRestore').setInputFiles({name:'restore.json',mimeType:'application/json',buffer:backup});
  await room.getByText('백업을 복원했습니다. 기존 자료는 유지했습니다.',{exact:true}).waitFor();
  await room.locator('.archive-backup summary').click();
  await room.locator('#archiveRestore').setInputFiles({name:'restore-again.json',mimeType:'application/json',buffer:backup});
  await room.getByText('백업을 복원했습니다. 기존 자료는 유지했습니다.',{exact:true}).waitFor();
  assert.equal(await room.locator('[data-archive="download"]').count(),1);
  const invalid=await page.evaluate(async()=>{
   const original=await ParticipantArchiveStore.read('archive-test-a');
   let rejected=false;try{await ParticipantArchiveStore.addFiles('archive-test-a',[new File(['x'],'bad.html',{type:'text/html'})],'');}catch{rejected=true;}
   return {rejected,count:(await ParticipantArchiveStore.read('archive-test-a')).files.length,original:original.files.length};
  });assert(invalid.rejected);assert.equal(invalid.count,invalid.original);
  const limits=await page.evaluate(async backup=>{
   const before=await ParticipantArchiveStore.read('archive-test-a');
   let oversized=false,corrupt=false;
   try{await ParticipantArchiveStore.addFiles('archive-test-a',[new File([new Uint8Array(20*1024*1024+1)],'large.pdf')],'');}catch{oversized=true;}
   backup.files[0].data='broken';
   try{await ParticipantArchiveStore.restore('archive-test-a',backup);}catch{corrupt=true;}
   const after=await ParticipantArchiveStore.read('archive-test-a');
   return {oversized,corrupt,unchanged:before.files.length===after.files.length&&before.checks.length===after.checks.length};
  },data);
  assert(limits.oversized&&limits.corrupt&&limits.unchanged);
  for(const width of [768,390]){
   await page.setViewportSize({width,height:900});
   assert(await room.evaluate(e=>e.scrollWidth<=e.clientWidth+1),`room overflows ${width}`);
   await room.screenshot({path:`tests/participant-files-${width}.png`,animations:'disabled'});
  }
  await room.locator('[data-archive="checks"]').first().click();
  assert.equal(await first.locator('[name="state"]').inputValue(),'확인 완료');
  assert.equal(await first.locator('[name="note"]').inputValue(),'담당자가 원본 확인 · 사무실 2번 서랍');
  assert(await room.evaluate(e=>e.scrollWidth<=e.clientWidth+1),'checklist overflows mobile');
  await room.screenshot({path:'tests/participant-checklist-mobile.png',animations:'disabled'});
  await first.locator('[data-archive="consent"]').click();
  await page.locator('#consentPerson').waitFor();assert.equal(await page.locator('#consentPerson').inputValue(),'archive-test-a');
  assert.match(await page.locator('#careDialog').innerText(),/기존|보관된 서류 1건/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('digital_school_management_v1')),before,'archive must not mutate care records');
  assert.deepEqual(errors,[]);
  console.log('PASS: person isolation (same names), file bytes/download, persistence, checklist/custom text escaping, consent links, cancel/delete, backup/restore/idempotency, wrong-person rejection, responsive layouts, existing records unchanged.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
