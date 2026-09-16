/* Teacher-only participant archive: a large file room and its checklist room. */
document.addEventListener('DOMContentLoaded',()=>{
  'use strict';
  const store=window.ParticipantArchiveStore;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const elders=()=>window.CareAutomationBridge.getData().elders;
  const defaults=[...window.CONSENT_FORMS.map(d=>({id:d.key,title:d.title})),{id:'recognition',title:'장기요양인정서'},{id:'careplan',title:'개인별장기요양이용계획서'},{id:'contract',title:'기관 이용 계약서'},{id:'assessment',title:'욕구사정 기록'}];
  const button=(label,action,id='',cls='')=>`<button type="button" class="care-btn ${cls}" data-archive="${action}" data-id="${esc(id)}">${label}</button>`;
  const size=n=>n<1024?`${n}B`:n<1024*1024?`${(n/1024).toFixed(1)}KB`:`${(n/1024/1024).toFixed(1)}MB`;
  const day=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date());
  const dialog=document.createElement('dialog');dialog.id='participantArchive';dialog.className='care-dialog participant-archive';dialog.setAttribute('aria-labelledby','archiveTitle');document.body.append(dialog);
  let personId='',view='people',query='',revision=0,busy=false,dirty=false;
  const documents=room=>[...defaults,...room.custom];
  function notify(message,error=false) {const el=dialog.querySelector('#archiveStatus');if(el){el.textContent=message;el.dataset.error=String(error);}}
  function shell(content,title='대상자 파일 보관방') {
    dialog.innerHTML=`<header><div><p class="archive-eyebrow">👨‍🏫 선생님 공간 · 대상자 서류</p><h2 id="archiveTitle">${esc(title)}</h2></div>${button('닫기','close')}</header><div id="archiveContent">${content}</div><p id="archiveStatus" role="status" aria-live="polite"></p>`;
  }
  async function render(message='') {
    const current=++revision,id=personId;
    if(!dialog.open)return;
    const people=elders();
    if(view==='people'){
      dirty=false;
      shell(`<p>대상자의 큰 방을 열면 파일 보관방과 작은 서류 확인방이 나와요.</p><label class="care-field">대상자 이름 찾기<input id="archiveSearch" type="search" placeholder="이름을 입력하세요" value="${esc(query)}"></label><div id="archivePeople" class="archive-people"></div><p class="care-note">자료는 현재 브라우저에 저장됩니다. 다른 기기에서는 백업 파일을 복원해주세요.</p>`);
      paintPeople(people);notify(message);return;
    }
    const person=people.find(e=>e.elder_id===id);
    if(!person){personId='';view='people';return render('대상자를 먼저 등록하거나 선택해주세요.');}
    shell('<p>보관 자료를 불러오고 있어요.</p>',person.name+'님의 큰 방');
    const room=await store.read(id);
    if(current!==revision||!dialog.open)return;
    dirty=false;
    const docs=documents(room), done=docs.filter(d=>room.checks.some(c=>c.key===d.id&&c.state==='확인 완료')).length;
    const common=`<div class="care-actions">${button('← 대상자 목록','people')}${button('📁 큰 방 · 파일 보관','files','',view==='files'?'primary':'')}${button('☑ 작은 방 · 서류 확인','checks','',view==='checks'?'primary':'')}</div><p class="archive-person">${esc(person.name)} · ${esc(person.birth||'생년월일 미등록')}</p>`;
    if(view==='checks') {
      shell(common+`<p>기관에서 확인할 서류 목록입니다. 파일을 넣어도 확인 상태는 자동으로 바뀌지 않습니다.</p><p class="archive-summary">확인 완료 <b>${done} / ${docs.length}</b> · 담당자가 직접 확인해주세요.</p><form id="archiveChecks">${docs.map(d=>{
        const c=room.checks.find(c=>c.key===d.id)||{}, count=room.files.filter(f=>f.documentKey===d.id).length;
        const legacy=(person.consentDocuments||[]).filter(c=>c.type===d.id);
        return `<fieldset class="archive-check" data-document="${esc(d.id)}"><legend>${esc(d.title)}</legend><p>보관 파일 ${count}개${legacy.length?` · 기존 동의서 ${legacy.length}건`:''}</p><div class="archive-check-fields"><label class="care-field">확인 상태<select name="state">${store.states.map(state=>`<option${state===(c.state||'미확인')?' selected':''}>${state}</option>`).join('')}</select></label><label class="care-field">확인일<input name="date" type="date" value="${esc(c.date||'')}"></label></div><label class="care-field">보완 사항 · 원본 위치<input name="note" maxlength="1000" value="${esc(c.note||'')}" placeholder="예: 서명 원본은 사무실 2번 파일에 보관"></label>${defaults.some(x=>x.id===d.id&&d.id.startsWith('consent'))?button('기존 동의서 방 열기','consent',d.id):''}</fieldset>`;
      }).join('')}<button type="submit" class="care-btn primary">서류 확인 내용 저장</button></form><details><summary>확인할 서류 추가</summary><form id="archiveAddDocument"><label class="care-field">서류 이름<input name="title" maxlength="100" required placeholder="예: 초기 상담 기록"></label><button type="submit" class="care-btn">확인 목록에 추가</button></form></details>`,person.name+'님의 작은 방 · 서류 확인');
    }else{
      const legacy=(person.consentDocuments||[]).length;
      shell(common+`<div class="archive-overview"><article><span>📁 보관 파일</span><strong>${room.files.length}개</strong><small>${size(room.files.reduce((n,f)=>n+f.size,0))} / 100MB</small></article><article><span>☑ 서류 확인</span><strong>${done} / ${docs.length}</strong>${button('작은 방 들어가기','checks')}</article></div><p class="archive-storage-note">이 브라우저에 보관됩니다. 브라우저 데이터를 지우면 사라지므로 아래에서 백업해주세요. 기존 ‘전체 기록 백업’에는 이 방의 파일이 포함되지 않습니다.</p><form id="archiveUpload"><h3>이 방에 파일 넣기</h3><div class="archive-check-fields"><label class="care-field">서류 구분<select name="documentKey"><option value="">기타 서류</option>${docs.map(d=>`<option value="${esc(d.id)}">${esc(d.title)}</option>`).join('')}</select></label><label class="care-field">파일 선택<input name="files" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.hwpx,.txt,.csv" multiple required></label></div><p>PDF · 사진 · 한글 · 워드 · 엑셀 · 파워포인트 · TXT · CSV<br>파일당 20MB, 대상자별 100개·100MB까지 보관할 수 있어요.</p><button class="care-btn primary" type="submit">선택한 파일 보관하기</button></form><h3>보관된 파일</h3><div class="archive-files">${room.files.map(f=>`<article class="archive-file"><div><strong>${esc(f.name)}</strong><p>${esc(docs.find(d=>d.id===f.documentKey)?.title||'기타 서류')} · ${size(f.size)} · ${esc(f.uploadedAt.slice(0,10))}</p></div><div class="care-actions">${button('다운로드','download',f.id)}${button('삭제','remove',f.id)}</div></article>`).join('')||'<p class="archive-empty">아직 보관한 파일이 없어요. 위에서 파일을 선택해주세요.</p>'}</div><details><summary>기존 동의서 ${legacy}건 보기</summary><p>기존 동의서와 첨부 자료는 원래 동의서 방에서 그대로 확인할 수 있어요.</p><div class="care-actions">${window.CONSENT_FORMS.map(d=>button(esc(d.title),'consent',d.key)).join('')}</div></details><details class="archive-backup"><summary>이 대상자 방 백업 · 복원</summary><p>파일과 서류 확인 목록을 함께 백업합니다. 대상자 등록 정보와 기존 동의서는 선생님 공간의 전체 기록 백업을 이용해주세요.</p>${button('이 방 백업 다운로드','backup')}<label class="care-field">이 대상자 방 백업 복원<input id="archiveRestore" type="file" accept="application/json,.json"></label><p>같은 대상자 번호의 백업만 복원됩니다. 현재 자료를 유지하면서 없는 파일과 확인 항목만 추가합니다.</p></details>`,person.name+'님의 큰 방 · 파일 보관');
    }
    notify(message);
  }
  function paintPeople(people=elders()) {
    const filtered=people.filter(p=>p.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
    dialog.querySelector('#archivePeople').innerHTML=filtered.map(p=>`<article class="care-card"><h3>📁 ${esc(p.name)}님의 큰 방</h3><p>${esc(p.birth||'생년월일 미등록')} · ${esc(p.gender||'')}</p>${button('파일 보관방 열기','person',p.elder_id,'primary')}</article>`).join('')||`<p>${people.length?'찾는 대상자가 없습니다.':'등록된 대상자가 없습니다. 선생님 공간의 어르신 관리에서 먼저 등록해주세요.'}</p>`;
  }
  async function run(action) {
    if(busy)return;
    busy=true;
    const content=dialog.querySelector('#archiveContent'); if(content)content.inert=true;
    notify('처리 중입니다. 잠시 기다려주세요.');
    try {await action();}catch(e){notify(e.message||'처리하지 못했습니다. 다시 시도해주세요.',true);}
    finally {busy=false;const next=dialog.querySelector('#archiveContent');if(next)next.inert=false;}
  }
  function open(id='') {personId=id;view=id?'files':'people';query='';if(!dialog.open)dialog.showModal();return render();}
  function download(blob,name) {
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  function inject() {
    const root=document.querySelector('#careRoot');if(!root)return;
    const active=document.querySelector('.care-nav [aria-current="page"]')?.dataset.value;
    if(['dashboard','elders','admin'].includes(active)&&!root.querySelector('#participantArchiveEntry')) {
      const entry=document.createElement('section');entry.id='participantArchiveEntry';entry.className='care-card archive-entry';
      entry.innerHTML=`<div><h2>📁 대상자별 서류 보관방</h2><p>큰 방에는 파일을 보관하고, 작은 방에서는 준비된 서류를 확인해요.</p></div>${button('대상자 보관방 열기','open','','primary')}`;
      root.querySelector('.care-heading')?.after(entry);
    }
    root.querySelectorAll('[data-action="register"][data-value]').forEach(b=>{
      if(!b.dataset.value||b.parentElement.querySelector('[data-archive="person"]'))return;
      b.insertAdjacentHTML('afterend',button('📁 서류 보관방','person',b.dataset.value));
    });
    const backup=root.querySelector('[data-action="backup"]');
    if(backup&&!root.querySelector('.archive-backup-reminder'))backup.insertAdjacentHTML('afterend','<p class="archive-backup-reminder">대상자 파일 보관방의 파일·서류 확인 목록은 이 JSON에 포함되지 않습니다. 대상자 보관방에서도 별도로 백업해주세요.</p>');
  }
  document.querySelector('.care-nav')?.insertAdjacentHTML('beforeend',button('📁 대상자 서류','open'));
  new MutationObserver(inject).observe(document.querySelector('#careRoot'),{childList:true,subtree:true});inject();
  function canLeave() {
    if(busy){notify('저장이 끝날 때까지 잠시 기다려주세요.');return false;}
    return !dirty||confirm('저장하지 않은 서류 확인 내용이 있습니다. 저장하지 않고 나갈까요?');
  }
  dialog.addEventListener('close',()=>{revision++;dirty=false;});
  dialog.addEventListener('cancel',e=>{if(!canLeave())e.preventDefault();});
  dialog.addEventListener('before-room-leave',e=>{if(!canLeave())e.preventDefault();});
  window.addEventListener('beforeunload',e=>{if(dirty||busy){e.preventDefault();e.returnValue='';}});
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-archive]');if(!b)return;
    if(busy){e.preventDefault();return;}
    const action=b.dataset.archive,id=b.dataset.id;
    if(['close','open','person','people','files','checks','consent'].includes(action)&&!canLeave())return;
    if(action==='close'){dialog.close();return;}
    if(action==='open'||action==='person'){run(()=>open(action==='person'?id:''));return;}
    if(action==='people'||action==='files'||action==='checks'){view=action;run(()=>render());return;}
    const target=personId;
    if(!elders().some(p=>p.elder_id===target)){run(()=>open());return;}
    if(action==='consent'){dialog.close();window.ConsentRooms.open(id,target);return;}
    run(async()=>{
      if(action==='download'){
        const file=(await store.read(target)).files.find(f=>f.id===id);if(!file)throw Error('파일을 찾지 못했습니다. 방을 다시 열어주세요.');
        download(new Blob([file.blob],{type:'application/octet-stream'}),file.name);notify('다운로드를 시작했습니다.');
      }
      if(action==='remove'){
        const file=(await store.read(target)).files.find(f=>f.id===id);if(!file)return;
        if(!confirm(`이 대상자의 “${file.name}” 파일을 삭제할까요?`)){notify('파일을 그대로 보관합니다.');return;}
        await store.update(target,room=>{room.files=room.files.filter(f=>f.id!==id);});await render('파일을 삭제했습니다.');
      }
      if(action==='backup'){
        const name=elders().find(p=>p.elder_id===target).name;
        const data=await store.backup(target,name);download(new Blob([JSON.stringify(data)],{type:'application/json'}),`${name.replace(/[\\/:*?"<>|]/g,'_')}_서류보관방_${day()}.json`);notify('백업 다운로드를 시작했습니다.');
      }
    });
  });
  dialog.addEventListener('input',e=>{if(e.target.id==='archiveSearch'){query=e.target.value;paintPeople();}if(e.target.closest('#archiveChecks'))dirty=true;});
  dialog.addEventListener('change',e=>{
    if(e.target.closest('#archiveChecks')){
      dirty=true;
      if(e.target.name==='state'&&e.target.value==='확인 완료'){
        const date=e.target.closest('fieldset').querySelector('[name="date"]');if(!date.value)date.value=day();
      }
    }
    if(e.target.id!=='archiveRestore')return;
    const file=e.target.files[0],target=personId;if(!file)return;
    run(async()=>{
      if(file.size>150*1024*1024)throw Error('백업 파일은 150MB 이하여야 합니다.');
      let data;try{data=JSON.parse(await file.text());}catch{throw Error('읽을 수 있는 JSON 백업 파일을 선택해주세요.');}
      await store.restore(target,data);await render('백업을 복원했습니다. 기존 자료는 유지했습니다.');
    });
  });
  dialog.addEventListener('submit',e=>{
    const form=e.target; if(!['archiveUpload','archiveChecks','archiveAddDocument'].includes(form.id))return;e.preventDefault();
    const target=personId;
    if(!elders().some(p=>p.elder_id===target)){notify('대상자를 다시 선택해주세요.',true);return;}
    if(form.id==='archiveUpload'){
      const files=[...form.elements.files.files],key=form.elements.documentKey.value;
      run(async()=>{await store.addFiles(target,files,key);await render(`${files.length}개 파일을 보관했습니다.`);});
    }
    if(form.id==='archiveChecks'){
      const checks=[...form.querySelectorAll('[data-document]')].map(el=>({key:el.dataset.document,state:el.querySelector('[name="state"]').value,date:el.querySelector('[name="date"]').value,note:el.querySelector('[name="note"]').value,updatedAt:new Date().toISOString()}));
      run(async()=>{await store.update(target,room=>{checks.forEach(c=>{const i=room.checks.findIndex(x=>x.key===c.key);if(i<0)room.checks.push(c);else room.checks[i]=c;});});await render('서류 확인 내용을 저장했습니다.');});
    }
    if(form.id==='archiveAddDocument'){
      if(dirty&&!confirm('현재 서류 확인 내용을 먼저 저장해주세요. 저장하지 않고 새 서류를 추가할까요?'))return;
      const title=form.elements.title.value.trim();if(!title){notify('서류 이름을 입력해주세요.',true);return;}
      run(async()=>{await store.update(target,room=>{if(room.custom.length>=50)throw Error('추가 서류는 대상자별 50개까지 만들 수 있습니다.');if(documents(room).some(d=>d.title===title))throw Error('같은 이름의 서류가 이미 있습니다.');room.custom.push({id:'custom-'+crypto.randomUUID(),title});});await render('확인할 서류를 추가했습니다.');});
    }
  });
});
