/* Binary files live in IndexedDB, separate from the existing care JSON records. */
(() => {
  'use strict';
  const LIMIT = 20 * 1024 * 1024, ROOM_LIMIT = 100 * 1024 * 1024, MAX_FILES = 100;
  const extensions = /\.(pdf|png|jpe?g|webp|docx?|xlsx?|pptx?|hwp|hwpx|txt|csv)$/i;
  const states = ['미확인', '보완 필요', '확인 완료', '해당 없음'];
  let opening;
  function connect() {
    if (!opening) opening = new Promise((resolve, reject) => {
      const request = indexedDB.open('digital_school_participant_files_v1', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('rooms', {keyPath:'elderId'});
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); opening = null; };
        resolve(db);
      };
      request.onerror = () => { opening = null; reject(Error('파일 보관함을 열지 못했습니다. 브라우저 저장 설정을 확인해주세요.')); };
      request.onblocked = () => { opening = null; reject(Error('다른 창의 파일 보관함을 닫고 다시 열어주세요.')); };
    });
    return opening;
  }
  const blank = elderId => ({elderId, files:[], checks:[], custom:[]});
  async function read(elderId) {
    const db = await connect();
    return new Promise((resolve,reject) => {
      const req = db.transaction('rooms').objectStore('rooms').get(elderId);
      req.onsuccess = () => resolve(req.result || blank(elderId));
      req.onerror = () => reject(Error('보관 자료를 읽지 못했습니다. 다시 열어주세요.'));
    });
  }
  async function update(elderId, change) {
    if (!elderId) throw Error('대상자를 먼저 선택해주세요.');
    const db = await connect();
    return new Promise((resolve,reject) => {
      const tx = db.transaction('rooms','readwrite'), store = tx.objectStore('rooms');
      let error, result;
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(error || Error('저장하지 못했습니다. 저장 공간을 확인해주세요. 기존 자료는 그대로 유지됩니다.'));
      tx.onerror = () => {};
      const request = store.get(elderId);
      request.onsuccess = () => {
        try {
          result = request.result || blank(elderId);
          change(result);
          if (result.files.length > MAX_FILES || result.files.reduce((sum,f)=>sum+f.size,0) > ROOM_LIMIT) throw Error('대상자별 최대 100개, 합계 100MB까지 보관할 수 있습니다.');
          store.put(result);
        } catch(e) { error=e; tx.abort(); }
      };
    });
  }
  function validateFile(file) {
    if (!file.name || file.name.length>255 || !extensions.test(file.name)) throw Error('PDF, 사진, 한글, 워드, 엑셀, 파워포인트, TXT, CSV 파일을 선택해주세요.');
    if (!Number.isSafeInteger(file.size) || file.size<1 || file.size>LIMIT) throw Error('빈 파일은 보관할 수 없으며 파일 한 개는 20MB 이하여야 합니다.');
  }
  async function addFiles(elderId, files, documentKey) {
    if (!files.length) return;
    files.forEach(validateFile);
    const added = files.map(file=>({id:crypto.randomUUID(), name:file.name, type:file.type || 'application/octet-stream', size:file.size, uploadedAt:new Date().toISOString(), documentKey:documentKey||'', blob:file.slice()}));
    return update(elderId,room=>room.files.push(...added));
  }
  function asData(blob) {
    return new Promise((resolve,reject)=>{
      const reader=new FileReader(); reader.onload=()=>resolve(reader.result.split(',')[1]);
      reader.onerror=()=>reject(Error('백업 파일을 만들지 못했습니다.')); reader.readAsDataURL(blob);
    });
  }
  async function backup(elderId, name) {
    const room=await read(elderId), files=[];
    for(const file of room.files) { const {blob,...meta}=file; files.push({...meta,data:await asData(blob)}); }
    return {format:'digital-school-participant-room',version:1,elderId,name,exportedAt:new Date().toISOString(),files,checks:room.checks,custom:room.custom};
  }
  function short(value, max) { if(typeof value!=='string'||value.length>max) throw Error('백업의 항목 형식이 올바르지 않습니다.'); return value; }
  function validateBackup(data, elderId) {
    if(data?.format!=='digital-school-participant-room'||data.version!==1||data.elderId!==elderId) throw Error('선택한 대상자의 파일 보관방 백업이 아닙니다. 대상자를 다시 확인해주세요.');
    if(!Array.isArray(data.files)||!Array.isArray(data.checks)||!Array.isArray(data.custom)||data.files.length>MAX_FILES||data.checks.length>100||data.custom.length>50) throw Error('백업의 항목 수 또는 형식이 올바르지 않습니다.');
    const custom=data.custom.map(c=>({id:short(c.id,100),title:short(c.title,100)}));
    if(custom.some(c=>!/^custom-[a-zA-Z0-9-]+$/.test(c.id)||!c.title.trim())||new Set(custom.map(c=>c.id)).size!==custom.length)throw Error('서류 목록 형식이 올바르지 않습니다.');
    const checks=data.checks.map(c=>({key:short(c.key,100),state:short(c.state,20),note:short(c.note,1000),date:short(c.date,10),updatedAt:short(c.updatedAt,40)}));
    if(checks.some(c=>!states.includes(c.state)||(c.date&&!/^\d{4}-\d{2}-\d{2}$/.test(c.date)))||new Set(checks.map(c=>c.key)).size!==checks.length) throw Error('서류 확인 상태 형식이 올바르지 않습니다.');
    let total=0;
    const files=data.files.map(f=>{
      validateFile(f); total+=f.size;
      if(total>ROOM_LIMIT)throw Error('대상자별 백업은 100MB 이하만 복원할 수 있습니다.');
      const id=short(f.id,100),name=short(f.name,255),type=short(f.type,150),uploadedAt=short(f.uploadedAt,40),documentKey=short(f.documentKey,100);
      if(!id||typeof f.data!=='string'||f.data.length!==4*Math.ceil(f.size/3)||! /^[A-Za-z0-9+/]*={0,2}$/.test(f.data))throw Error('백업 파일 내용이 올바르지 않습니다.');
      const raw=atob(f.data); if(raw.length!==f.size)throw Error('백업 파일 크기가 일치하지 않습니다.');
      const bytes=Uint8Array.from(raw,ch=>ch.charCodeAt(0));
      return {id,name,type,uploadedAt,documentKey,size:f.size,blob:new Blob([bytes],{type:'application/octet-stream'})};
    });
    if(new Set(files.map(f=>f.id)).size!==files.length)throw Error('백업에 중복 파일 번호가 있습니다.');
    return {files,checks,custom};
  }
  async function restore(elderId,data) {
    const imported=validateBackup(data,elderId);
    return update(elderId,room=>{
      room.files.push(...imported.files.filter(f=>!room.files.some(old=>old.id===f.id)));
      room.custom.push(...imported.custom.filter(c=>!room.custom.some(old=>old.id===c.id)));
      room.checks.push(...imported.checks.filter(c=>!room.checks.some(old=>old.key===c.key)));
      if(room.custom.length>50||room.checks.length>100)throw Error('서류 확인 목록이 너무 많습니다.');
    });
  }
  window.ParticipantArchiveStore={read,update,addFiles,backup,restore,states};
})();
