/* Official portal handoff only. No third-party credentials or submission API. */
document.addEventListener('DOMContentLoaded',()=>{
  'use strict';
  const PORTAL='https://www.longtermcare.or.kr/npbs/auth/login/loginForm.web?menuId=npe0000002840&tabType=nP&rtnUrl=/';
  const HOME='https://www.longtermcare.or.kr/';
  const bridge=window.CareAutomationBridge;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const button=(text,action,id='')=>`<button type="button" class="care-btn" data-ltc="${action}" data-id="${esc(id)}">${text}</button>`;
  const link=(text,url)=>`<a class="care-btn primary" href="${url.replace(/&/g,'&amp;')}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">${text} ↗</a>`;
  const dialog=document.createElement('dialog');dialog.id='longtermcareHandoff';dialog.className='care-dialog ltc-handoff';dialog.setAttribute('aria-labelledby','ltcTitle');document.body.append(dialog);
  let selected='',snapshot=null;
  function records(){const db=bridge.getData();return {db,list:db.sessions.filter(s=>typeof s.aiReport==='string'&&s.aiReport.trim()).sort((a,b)=>String(b.date).localeCompare(String(a.date)))};}
  function buildSnapshot(db,session){
    const person=db.elders.find(e=>e.elder_id===session.elder_id);
    if(!person)throw Error('연결된 대상자가 없습니다. 어르신 정보를 먼저 확인해주세요.');
    const body=session.aiReport;
    return {id:session.session_id,name:person.name,date:session.date||'날짜 미기록',program:session.program||'프로그램 미기록',body,
      text:`업무수행 일지 · 공단 입력 참고용\n대상자: ${person.name}\n일자: ${session.date||'미기록'}\n프로그램: ${session.program||'미기록'}\n\n${body}`,
      signature:JSON.stringify([session.elder_id,person.name,session.date,session.program,body])};
  }
  function message(text){const el=dialog.querySelector('#ltcStatus');if(el)el.textContent=text;}
  function fresh(){
    const {db,list}=records(),session=list.find(s=>s.session_id===selected);
    if(!session||!snapshot)throw Error('저장된 일지를 선택해주세요.');
    const current=buildSnapshot(db,session);
    if(current.signature!==snapshot.signature){render(selected);throw Error('일지가 변경되어 최신 내용을 불러왔습니다. 확인한 뒤 다시 눌러주세요.');}
    return snapshot;
  }
  function render(id=''){
    const {db,list}=records();
    selected=list.some(s=>s.session_id===id)?id:'';
    const current=list.find(s=>s.session_id===selected);
    snapshot=current?buildSnapshot(db,current):null;
    dialog.innerHTML=`<header><div><p>👨‍🏫 선생님 공간</p><h2 id="ltcTitle">공단 업무수행일지 등록 준비</h2></div>${button('닫기','close')}</header>
      <p class="ltc-state">현재 상태: 공단에 전송되지 않았습니다.</p>
      <p>이곳에서 저장한 일지 내용을 준비하고, 공단 홈페이지에 로그인하여 직접 입력·저장할 수 있도록 연결합니다.</p>
      <ol class="ltc-steps"><li>아래에서 대상자와 저장된 일지를 확인해요.</li><li>내용을 복사한 뒤 공단 로그인 화면을 열어요.</li><li>공단에서 해당 업무 메뉴와 필수 항목을 확인하고 입력·저장해요.</li><li>공단 화면에서 저장 결과와 필요한 서명·결재를 확인해요.</li></ol>
      <label class="care-field">저장된 업무수행 일지<select id="ltcSession"><option value="">일지를 선택해주세요</option>${list.map(s=>`<option value="${esc(s.session_id)}"${s.session_id===selected?' selected':''}>${esc(db.elders.find(e=>e.elder_id===s.elder_id)?.name||'대상자 없음')} · ${esc(s.date)} · ${esc(s.program)} · ${s.reviewed?'검토 완료':'검토 전'}</option>`).join('')}</select></label>
      ${list.length?'':'<p>저장된 일지가 없습니다. AI 수업일지 또는 업무수행 일지에서 내용을 먼저 저장해주세요.</p>'}
      ${snapshot?`<section class="ltc-preview"><h3>${esc(snapshot.name)} · ${esc(snapshot.date)}</h3><p>${esc(snapshot.program)} · ${current.reviewed?'이 사이트에서 검토 완료':'이 사이트에서 검토 전'}</p><label class="care-field">저장된 일지 내용<textarea id="ltcText" rows="12" readonly>${esc(snapshot.body)}</textarea></label><div class="care-actions">${button('📋 일지 내용 복사','copy')}${button('📄 일지 TXT 내려받기','download')}</div><p>복사와 다운로드는 자료 준비 단계이며 공단 저장이 아닙니다.</p></section>`:''}
      <section class="ltc-portal"><h3>공식 장기요양보험 사이트로 이동</h3><div class="care-actions">${link('공단 로그인 화면 열기',PORTAL)}${link('공단 홈페이지',HOME)}</div><p>로그인 화면에서 ‘장기요양 관련기관 로그인 → 급여제공기관 종사자’를 선택할 수 있습니다. 기관 권한에 맞는 방식으로 인증해주세요.</p><p>이 사이트는 공단 로그인 정보나 인증서를 받지 않습니다. 일지 내용도 링크에 담아 보내지 않습니다.</p></section>
      <details><summary>이 연결의 범위</summary><p>공단 자동 저장 연동은 연결되지 않았습니다. 공단에 실제 보관되는 시점은 공단 화면에서 저장을 마친 뒤입니다.</p><p>현재 일지는 공단 입력을 위한 참고 자료입니다. 기관 급여 유형과 공단 화면에 따라 필요한 항목·서식이 다를 수 있습니다. TXT 파일 직접 업로드 지원 여부는 확인되지 않았으므로 내용 복사·직접 입력을 이용해주세요.</p></details><p id="ltcStatus" role="status" aria-live="polite"></p>`;
  }
  function open(id){
    try{render(id);}catch(error){render();message(error.message);}
    if(!dialog.open)dialog.showModal();
  }
  function inject(){
    const root=document.querySelector('#careRoot');
    if(root){
      const active=document.querySelector('.care-nav [aria-current="page"]')?.dataset.value;
      if(['dashboard','journals','records'].includes(active)&&!root.querySelector('#ltcEntry')){
        const entry=document.createElement('section');entry.id='ltcEntry';entry.className='care-card ltc-entry';
        entry.innerHTML=`<div><h2>🏢 공단 업무수행일지 등록</h2><p>저장된 일지를 복사하고 공단에서 직접 등록하세요.</p></div>${button('공단 등록 준비','open')}`;
        root.querySelector('.care-heading')?.after(entry);
      }
      root.querySelectorAll('.record-row [data-action="detail"]').forEach(b=>{
        if(!b.parentElement.querySelector('[data-ltc]'))b.insertAdjacentHTML('afterend',button('공단 등록 준비','open',b.dataset.value));
      });
    }
    document.querySelectorAll('#journalForm,#autoJournal').forEach(form=>{
      if(form.querySelector('.ltc-form-entry'))return;
      form.insertAdjacentHTML('beforeend',`<div class="ltc-form-entry no-print">${button('저장된 일지로 공단 등록 준비','saved',form.dataset.id)}<p>수정한 내용은 일지를 먼저 저장한 뒤 준비해주세요.</p><p class="ltc-form-status" role="status"></p></div>`);
    });
  }
  new MutationObserver(inject).observe(document.querySelector('#careRoot'),{childList:true,subtree:true});
  new MutationObserver(inject).observe(document.querySelector('#careDialog'),{childList:true,subtree:true});inject();
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-ltc]');if(!b)return;
    try{
      const action=b.dataset.ltc;
      if(action==='open'){open(b.dataset.id);return;}
      if(action==='close'){dialog.close();return;}
      if(action==='saved'){
        const form=b.closest('form'),report=form.querySelector('[name="aiReport"],[name="report"]')?.value;
        const saved=records().list.find(s=>s.session_id===b.dataset.id);
        if(!saved||report!==saved.aiReport){form.querySelector('.ltc-form-status').textContent='수정한 일지를 먼저 저장해주세요. 공단 등록 준비에는 저장된 내용만 사용합니다.';return;}
        open(b.dataset.id);return;
      }
      const data=fresh();
      if(action==='copy'){
        try{await navigator.clipboard.writeText(data.body);message('일지 내용을 복사했습니다. 공단 화면의 해당 항목에 직접 입력해주세요. 공단에는 아직 저장되지 않았습니다.');}
        catch{const text=dialog.querySelector('#ltcText');text.focus();text.select();message('자동 복사가 허용되지 않아 내용을 선택했습니다. 복사 메뉴 또는 Ctrl+C를 사용해주세요.');}
      }
      if(action==='download'){
        const blob=new Blob(['\uFEFF'+data.text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=url;a.download=`${data.name}_${data.date}_업무수행일지.txt`.replace(/[\\/:*?"<>|]/g,'_');a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
        message('입력 참고용 TXT 다운로드를 시작했습니다. 공단에는 아직 저장되지 않았습니다.');
      }
    }catch(error){message(error.message||'일지를 불러오지 못했습니다.');}
  });
  dialog.addEventListener('change',e=>{if(e.target.id==='ltcSession'){try{render(e.target.value);}catch(error){message(error.message);}}});
});
