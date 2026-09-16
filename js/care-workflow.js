/* Care management extension: preserves original classroom and legacy records. */
(() => {
'use strict';
const KEY='digital_school_management_v1', ACTIVE_PERSON_KEY='digital_school_active_elder_id', $=s=>document.querySelector(s);
const esc=v=>String(v!=null?v:'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>crypto.randomUUID(),today=()=>new Date().toLocaleDateString('en-CA');
let db,active=null,pending=null,page='home',person='',period=1;

const DEFAULT_ELDERS = [
  { elder_id: 'elder-001', name: '김영자', gender: '여성', birth: '1945-03-15', grade: '3등급', cognition: '경도인지장애', guardian: '010-1234-5678', consent0: true, consent1: true, consent2: true, consent3: true },
  { elder_id: 'elder-002', name: '박순옥', gender: '여성', birth: '1948-07-20', grade: '4등급', cognition: '인지 정상', guardian: '010-2345-6789', consent0: true, consent1: true, consent2: true, consent3: true },
  { elder_id: 'elder-003', name: '이종수', gender: '남성', birth: '1942-11-05', grade: '2등급', cognition: '중등도 치매', guardian: '010-3456-7890', consent0: true, consent1: true, consent2: true, consent3: true },
  { elder_id: 'elder-004', name: '정태호', gender: '남성', birth: '1950-01-10', grade: '5등급', cognition: '경도인지장애', guardian: '010-4567-8901', consent0: true, consent1: true, consent2: true, consent3: true },
  { elder_id: 'elder-005', name: '최말순', gender: '여성', birth: '1943-09-28', grade: '3등급', cognition: '경도인지장애', guardian: '010-5678-9012', consent0: true, consent1: true, consent2: true, consent3: true }
];

const empty=()=>({elders:[],sessions:[],reports:[],programs:[],schedules:[]});
function load(){
  const raw=localStorage.getItem(KEY);
  if(!raw)return empty();
  const d=JSON.parse(raw);
  if(!d||!Array.isArray(d.elders)||!Array.isArray(d.sessions))throw Error('저장 데이터 형식 오류: 원본은 보존됩니다.');
  return {...empty(),...d};
}
function commit(change){try{const next=load();change(next);localStorage.setItem(KEY,JSON.stringify(next));db=next;return true;}catch(e){alert('저장하지 못했습니다. 저장 공간을 확인해주세요. '+e.message);return false;}}
function getActivePerson(eldersList){
  const saved = localStorage.getItem(ACTIVE_PERSON_KEY);
  if(saved && eldersList.some(e=>e.elder_id===saved)) return saved;
  return eldersList[0]?.elder_id || '';
}
function setActivePerson(id){
  person = id;
  if(id) localStorage.setItem(ACTIVE_PERSON_KEY, id);
  const el = elder(id);
  if(window.RecordManager && el){
    window.RecordManager.setCurrentLearner(el.name + ' 어르신');
  }
}
const elder=id=>db.elders.find(e=>e.elder_id===id);
const records=id=>db.sessions.filter(s=>!id||s.elder_id===id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
const btn=(text,action,value='',cls='')=>`<button type="button" class="care-btn ${cls}" data-action="${action}" data-value="${esc(value)}">${text}</button>`;
const field=(label,name,value='',type='text',required=false)=>`<label class="care-field">${label}${required?' *':''}<input name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''}></label>`;
const area=(label,name,value='')=>`<label class="care-field full">${label}<textarea name="${name}" rows="5">${esc(value)}</textarea></label>`;
function choices(label,name,options,value='',multi=false){return `<fieldset class="care-choices"><legend>${label}</legend>${options.map(o=>`<label><input type="${multi?'checkbox':'radio'}" name="${name}" value="${esc(o)}" ${(multi?(value||[]).includes(o):o===value)?'checked':''} ${multi?'':'required'}><span>${o}</span></label>`).join('')}</fieldset>`;}
function modal(title,html){const d=$('#careDialog');d.innerHTML=`<header><h2>${title}</h2>${btn('✕ 닫기','close')}</header>${html}`;if(!d.open)d.showModal();d.querySelector('button')?.focus();}
const close=()=>{ const d=$('#careDialog'); if(d && typeof d.close === 'function' && d.open) d.close(); };
const printButtons=()=>`<div class="care-actions no-print">${btn('PDF 저장','print')}${btn('인쇄','print')}</div>`;
const heading=(title,sub='',actions='')=>`<div class="care-heading"><div><p class="care-eyebrow">콩이와 함께하는 디지털 AI학교</p><h1>${title}</h1><p>${sub}</p></div><div class="care-actions">${actions}</div></div>`;
const selectPerson=()=>`<label class="care-field">어르신 선택<select id="carePerson"><option value="">대상자를 선택해주세요</option>${db.elders.map(e=>`<option value="${e.elder_id}" ${person===e.elder_id?'selected':''}>${esc(e.name)}</option>`).join('')}</select></label>`;
function getProgramPurpose(programTitle) {
  const t = String(programTitle || '');
  if (t.includes('사진') || t.includes('추억') || t.includes('회상')) {
    return '과거 회상을 통한 장기기억 자극 및 정서적 안정감 도모';
  } else if (t.includes('음악') || t.includes('노래')) {
    return '익숙한 멜로디와 리듬을 통한 청각 자극 및 정서적 활력 증진';
  } else if (t.includes('그림') || t.includes('미술') || t.includes('아트')) {
    return '시각적 표현과 소근육 협응 자극을 통한 창작 성취감 고취';
  } else if (t.includes('기억') || t.includes('인지') || t.includes('퍼즐')) {
    return '주의집중력 및 단기 작업기억 유지·강화를 위한 인지 훈련';
  } else if (t.includes('스마트폰') || t.includes('디지털') || t.includes('생활')) {
    return '디지털 기기 활용 친숙도 향상 및 일상생활 자립감 증진';
  } else if (t.includes('이야기') || t.includes('동화') || t.includes('언어')) {
    return '언어적 상호작용 촉진 및 서사적 사고력 자극';
  } else if (t.includes('인사') || t.includes('친구') || t.includes('감정')) {
    return '친밀한 라포 형성 및 일상 정서 교류를 통한 고립감 해소';
  }
  return '잔존 인지기능 유지 및 사회적 상호작용 촉진';
}

function draftParts(s, format = '5w1h_standard') {
  const el = elder(s.elder_id) || {};
  const name = el.name || '어르신';
  const gender = el.gender || '성별 미기록';
  const grade = el.grade || '등급 미입력';
  const cognition = el.cognition || '인지상태 미기록';
  const birth = el.birth ? ` (${el.birth}생)` : '';
  const date = s.date || today();
  const durationMin = (Number.isFinite(s.durationSeconds) ? Math.max(1, Math.round(s.durationSeconds / 60)) : (s.duration || 20));
  const program = s.program || 'AI 인지활동';
  const purpose = getProgramPurpose(program);

  const preMood = s.pre?.mood || '미기록';
  const preHealth = s.pre?.health || '미기록';
  const preWillingness = s.pre?.willingness || '미기록';
  const preNotes = s.pre?.notes ? `[수업 전 메모: ${s.pre.notes}]` : '';

  const participation = s.observation?.participation || '미기록';
  const focus = s.evaluation?.focus || s.observation?.focus || '미기록';
  const performance = s.evaluation?.performance || s.observation?.performance || '미기록';
  const emotions = (s.observation?.emotion && s.observation.emotion.length > 0) ? s.observation.emotion.join(', ') : '미기록';
  const communication = s.observation?.communication || '미기록';
  const behaviors = (s.observation?.behavior && s.observation.behavior.length > 0 && !s.observation.behavior.includes('없음')) ? s.observation.behavior.join(', ') : (s.observation?.behavior?.includes('없음') ? '없음으로 기록' : '미기록');
  const obsNotes = s.observation?.notes ? `[관찰 메모: ${s.observation.notes}]` : '';
  
  const notesTotal = [preNotes, obsNotes].filter(Boolean).join(' ') || '추가 관찰 메모 미기록';
  const satisfaction = s.evaluation?.satisfaction || '미기록';
  const nextPlan = s.evaluation?.next || '미기록';

  if (format === '5w1h_narrative') {
    return {
      who: `${name} 어르신(${gender}, ${grade}, ${cognition}${birth}) / 담당 사회복지사 및 AI 튜터 콩이`,
      when: `${date} (약 ${durationMin}분간 진행)`,
      where: `AI 디지털 교실 / 스마트 인지케어 활동실`,
      what: `'${program}' 프로그램을 진행하여 ${purpose}을(를) 도모함.`,
      how: `사전 상태(기분: ${preMood}, 건강: ${preHealth}, 참여의사: ${preWillingness}) 점검 후 착수함. 참여도 '${participation}', 집중도 '${focus}', 과제 수행도 '${performance}' 수준으로 나타남. 정서적으로는 '${emotions}' 반응을 보였으며 의사소통은 '${communication}' 양상을 띰. (${notesTotal})`,
      why: `어르신의 잔존 인지기능 유지 및 정서 안정을 목적으로 하였으며, 만족도는 '${satisfaction}'으로 기록됨. 차기 수업은 '${nextPlan}' 방향으로 연계하여 지속적인 인지 자극과 긍정적 라포를 형성하고자 함.`
    };
  }

  return {
    who: `• 대상자: ${name} 어르신 (${gender} / ${grade} / 인지상태: ${cognition}${birth})\n• 서비스 제공자: 담당 사회복지사 및 AI 보조튜터 콩이`,
    when: `• 일시: ${date} (활동 시간: 약 ${durationMin}분)`,
    where: `• 장소: AI 디지털 교실 / 스마트 인지케어 활동실`,
    what: `• 프로그램명: ${program}\n• 활동 영역 및 목표: ${purpose}`,
    how: `• 사전 상태 점검: 기분 [${preMood}], 건강상태 [${preHealth}], 참여의사 [${preWillingness}]\n• 참여 및 집중도: 참여도 [${participation}], 집중도 [${focus}], 과제 수행도 [${performance}]\n• 정서 및 의사소통: 정서 반응 [${emotions}], 의사소통 [${communication}]\n• 관찰 및 특이사항: 특이행동 [${behaviors}] / ${notesTotal}`,
    why: `• 추진 목적: ${purpose}\n• 종합 만족도: ${satisfaction}\n• 차기 지도 계획: '${nextPlan}' 방향으로 진행하여 인지 안정과 성취감을 지속적으로 격려함.`
  };
}

function assemble5W1HText(parts, format = '5w1h_standard') {
  if (format === '5w1h_narrative') {
    return `[업무수행 일지 — 육하원칙 서술형]\n• [누가(Who) / 언제(When) / 어디서(Where)] ${parts.when || ''}, ${parts.where || ''}에서 ${parts.who || ''}을 대상으로 활동을 진행함.\n• [무엇을(What)] ${parts.what || ''}\n• [어떻게(How)] ${parts.how || ''}\n• [왜 & 향후계획(Why & Next)] ${parts.why || ''}`;
  }
  return `[업무수행 일지 — 육하원칙(5W1H) 표준 서식]\n\n1. 누가 (Who)\n${parts.who || ''}\n\n2. 언제 (When)\n${parts.when || ''}\n\n3. 어디서 (Where)\n${parts.where || ''}\n\n4. 무엇을 (What)\n${parts.what || ''}\n\n5. 어떻게 (How)\n${parts.how || ''}\n\n6. 왜 & 향후 계획 (Why & Next)\n${parts.why || ''}`;
}

function draft(s, format = '5w1h_standard') {
  if (format === 'simple') {
    const el = elder(s.elder_id) || {};
    const name = el.name || '어르신';
    const date = s.date || today();
    const durationMin = (Number.isFinite(s.durationSeconds) ? Math.max(1, Math.round(s.durationSeconds / 60)) : '미기록');
    const program = s.program || 'AI 인지활동';
    return `${name} 어르신은 ${date} '${program}' 활동에 약 ${durationMin}분간 참여하셨음. 참여도 ${s.observation?.participation || '보통'}, 집중도 ${s.evaluation?.focus || '보통'}, 수행도 ${s.evaluation?.performance || '보통'}으로 관찰됨. 만족도는 ${s.evaluation?.satisfaction || '좋음'}이며 차기 계획은 '${s.evaluation?.next || '유지'}'으로 수립함.`;
  }
  return assemble5W1HText(draftParts(s, format), format);
}

function render5W1HBoxesHtml(prefix = 'quick') {
  return `
<div class="journal-5w1h-wrapper">
  <div class="journal-5w1h-top-label">
    <label style="font-size: 15px; font-weight: 800; color: #1E1E1E; display:flex; align-items:center; gap:6px;">
      <span>📑</span> 육하원칙(5W1H) 항목별 체크 및 직접 수정
    </label>
    <span style="font-size: 12.5px; color: #666;">* 항목별 체크 옵션을 누르거나 각 칸을 직접 수정하실 수 있습니다.</span>
  </div>

  <div class="journal-5w1h-grid">
    <!-- 1. 누가 (Who) -->
    <div class="journal-5w1h-box">
      <div class="journal-5w1h-header">
        <span class="journal-5w1h-title"><span>👤</span> 1. 누가 (Who)</span>
        <span class="journal-5w1h-badge">제공자 선택</span>
      </div>
      <div class="journal-check-group" id="${prefix}WhoChecks">
        <label class="journal-chip"><input type="checkbox" name="${prefix}WhoOpt" value="담당 사회복지사" checked>복지사</label>
        <label class="journal-chip"><input type="checkbox" name="${prefix}WhoOpt" value="AI 보조튜터 콩이" checked>AI 콩이</label>
        <label class="journal-chip"><input type="checkbox" name="${prefix}WhoOpt" value="자원봉사자">자원봉사자</label>
        <label class="journal-chip"><input type="checkbox" name="${prefix}WhoOpt" value="생활지원사">생활지원사</label>
      </div>
      <textarea name="who5w" id="${prefix}Who5w" rows="3" class="journal-5w1h-textarea" placeholder="대상자 및 서비스 제공자 정보"></textarea>
    </div>

    <!-- 2. 언제 (When) -->
    <div class="journal-5w1h-box">
      <div class="journal-5w1h-header">
        <span class="journal-5w1h-title"><span>⏰</span> 2. 언제 (When)</span>
        <span class="journal-5w1h-badge">시간대 선택</span>
      </div>
      <div class="journal-check-group" id="${prefix}WhenChecks">
        <label class="journal-chip"><input type="radio" name="${prefix}WhenOpt" value="오전 10:00~10:20 (약 20분)" checked>오전 10시</label>
        <label class="journal-chip"><input type="radio" name="${prefix}WhenOpt" value="오후 14:00~14:20 (약 20분)">오후 14시</label>
        <label class="journal-chip"><input type="radio" name="${prefix}WhenOpt" value="집중 시간 (약 30분)">30분 집중</label>
        <label class="journal-chip"><input type="radio" name="${prefix}WhenOpt" value="심층 1:1 활동 (약 40분)">40분 심층</label>
      </div>
      <textarea name="when5w" id="${prefix}When5w" rows="3" class="journal-5w1h-textarea" placeholder="활동 일시 및 소요 시간"></textarea>
    </div>

    <!-- 3. 어디서 (Where) -->
    <div class="journal-5w1h-box">
      <div class="journal-5w1h-header">
        <span class="journal-5w1h-title"><span>📍</span> 3. 어디서 (Where)</span>
        <span class="journal-5w1h-badge">장소 선택</span>
      </div>
      <div class="journal-check-group" id="${prefix}WhereChecks">
        <label class="journal-chip"><input type="radio" name="${prefix}WhereOpt" value="AI 디지털 교실 / 스마트 인지케어 활동실" checked>AI 디지털 교실</label>
        <label class="journal-chip"><input type="radio" name="${prefix}WhereOpt" value="어르신 생활실 / 편안한 휴게공간">생활실/휴게실</label>
        <label class="journal-chip"><input type="radio" name="${prefix}WhereOpt" value="주간보호센터 단체 활동실">주간보호실</label>
        <label class="journal-chip"><input type="radio" name="${prefix}WhereOpt" value="1:1 맞춤 돌봄 상담실">1:1 상담실</label>
      </div>
      <textarea name="where5w" id="${prefix}Where5w" rows="3" class="journal-5w1h-textarea" placeholder="활동 장소"></textarea>
    </div>

    <!-- 4. 무엇을 (What) -->
    <div class="journal-5w1h-box">
      <div class="journal-5w1h-header">
        <span class="journal-5w1h-title"><span>🎯</span> 4. 무엇을 (What)</span>
        <span class="journal-5w1h-badge">활동목표 선택</span>
      </div>
      <div class="journal-check-group" id="${prefix}WhatChecks">
        <label class="journal-chip"><input type="checkbox" name="${prefix}WhatOpt" value="친밀한 라포 형성 및 일상 정서 교류" checked>정서 교류</label>
        <label class="journal-chip"><input type="checkbox" name="${prefix}WhatOpt" value="과거 회상을 통한 장기기억 자극" checked>장기기억 자극</label>
        <label class="journal-chip"><input type="checkbox" name="${prefix}WhatOpt" value="주의집중력 및 인지기능 유지">집중력 유지</label>
        <label class="journal-chip"><input type="checkbox" name="${prefix}WhatOpt" value="시각·청각 감각 반응 및 성취감 고취">성취감 고취</label>
      </div>
      <textarea name="what5w" id="${prefix}What5w" rows="3" class="journal-5w1h-textarea" placeholder="프로그램명 및 활동 목표"></textarea>
    </div>
  </div>

  <!-- 5. 어떻게 (How) -->
  <div class="journal-5w1h-box full-width">
    <div class="journal-5w1h-header">
      <span class="journal-5w1h-title"><span>⚙️</span> 5. 어떻게 (How)</span>
      <span class="journal-5w1h-badge">상태 · 관찰 체크</span>
    </div>
    <div class="journal-check-group" id="${prefix}HowChecks">
      <label class="journal-chip"><input type="checkbox" name="${prefix}HowOpt" value="기분 [😊좋음], 건강 [양호], 참여의사 [적극적]" checked>사전상태 양호</label>
      <label class="journal-chip"><input type="checkbox" name="${prefix}HowOpt" value="참여도 [적극적], 집중도 [높음], 수행도 [독립 수행]" checked>자발적 독립수행</label>
      <label class="journal-chip"><input type="checkbox" name="${prefix}HowOpt" value="정서반응 [밝은 웃음], 의사소통 [자발적 대화]" checked>밝은 웃음/소통</label>
      <label class="journal-chip"><input type="checkbox" name="${prefix}HowOpt" value="특이행동 [없음], 안정적인 수업 태도 유지" checked>특이행동 없음</label>
      <label class="journal-chip"><input type="checkbox" name="${prefix}HowOpt" value="수업 중 복지사의 따뜻한 말벗 및 조작 보조 제공">말벗/조작 보조</label>
    </div>
    <textarea name="how5w" id="${prefix}How5w" rows="4" class="journal-5w1h-textarea" placeholder="사전 점검, 수행도, 정서/의사소통 및 관찰 특이사항"></textarea>
  </div>

  <!-- 6. 왜 & 향후 계획 (Why & Next) -->
  <div class="journal-5w1h-box full-width">
    <div class="journal-5w1h-header">
      <span class="journal-5w1h-title"><span>💡</span> 6. 왜 & 향후 계획 (Why & Next)</span>
      <span class="journal-5w1h-badge">목적 · 평가 체크</span>
    </div>
    <div class="journal-check-group" id="${prefix}WhyChecks">
      <label class="journal-chip"><input type="checkbox" name="${prefix}WhyOpt" value="잔존 인지기능 유지 및 정서적 안정 도모" checked>인지기능 유지</label>
      <label class="journal-chip"><input type="checkbox" name="${prefix}WhyOpt" value="활동 종합 만족도 [😊 매우 높음]" checked>만족도 높음</label>
      <label class="journal-chip"><input type="checkbox" name="${prefix}WhyOpt" value="차기 수업 지속 연계를 통한 긍정적 라포 강화" checked>차기 지속 연계</label>
      <label class="journal-chip"><input type="checkbox" name="${prefix}WhyOpt" value="흥미와 반응을 반영한 맞춤형 인지 자극 제공">맞춤 인지 자극</label>
    </div>
    <textarea name="why5w" id="${prefix}Why5w" rows="3" class="journal-5w1h-textarea" placeholder="추진 목적, 활동 만족도 및 차기 지도 계획"></textarea>
  </div>

  <textarea name="aiReport" id="${prefix}AiReport" style="display:none;"></textarea>
</div>`;
}

function setup5W1HFormEvents(formId, prefix) {
  const f = $(`#${formId}`);
  if (!f) return;

  const getFormParts = () => ({
    who: f.elements.who5w?.value || '',
    when: f.elements.when5w?.value || '',
    where: f.elements.where5w?.value || '',
    what: f.elements.what5w?.value || '',
    how: f.elements.how5w?.value || '',
    why: f.elements.why5w?.value || ''
  });

  const syncToReport = (fmt = '5w1h_standard') => {
    const parts = getFormParts();
    if (f.elements.aiReport) {
      f.elements.aiReport.value = assemble5W1HText(parts, fmt);
    }
  };

  ['who5w', 'when5w', 'where5w', 'what5w', 'how5w', 'why5w'].forEach(k => {
    const el = f.elements[k];
    if (el) {
      el.addEventListener('input', () => syncToReport('5w1h_standard'));
    }
  });

  // Checkbox / Radio change handlers for each section
  const updateSectionFromChips = () => {
    const elId = f.elements.elder_id?.value;
    const el = elder(elId) || db.elders[0] || {};
    const name = el.name || '어르신';
    const gender = el.gender || '성별 미기록';
    const grade = el.grade || '등급 미입력';
    const cognition = el.cognition || '인지상태 미기록';
    const birth = el.birth ? ` (${el.birth}생)` : '';
    const prg = f.elements.program?.value || 'AI 인지활동';
    const dt = f.elements.date?.value || today();
    const dur = Number(f.elements.duration?.value) || 20;

    // 1. Who
    const whoChecked = Array.from(f.querySelectorAll(`input[name="${prefix}WhoOpt"]:checked`)).map(c => c.value);
    const providers = whoChecked.length > 0 ? whoChecked.join(', ') : '담당 사회복지사 및 AI 보조튜터 콩이';
    if (f.elements.who5w) {
      f.elements.who5w.value = `• 대상자: ${name} 어르신 (${gender} / ${grade} / 인지상태: ${cognition}${birth})\n• 서비스 제공자: ${providers}`;
    }

    // 2. When
    const whenSelected = f.querySelector(`input[name="${prefix}WhenOpt"]:checked`)?.value;
    const whenText = whenSelected ? `• 일시: ${dt} [${whenSelected}]` : `• 일시: ${dt} (활동 시간: 약 ${dur}분)`;
    if (f.elements.when5w) {
      f.elements.when5w.value = whenText;
    }

    // 3. Where
    const whereSelected = f.querySelector(`input[name="${prefix}WhereOpt"]:checked`)?.value || 'AI 디지털 교실 / 스마트 인지케어 활동실';
    if (f.elements.where5w) {
      f.elements.where5w.value = `• 장소: ${whereSelected}`;
    }

    // 4. What
    const whatChecked = Array.from(f.querySelectorAll(`input[name="${prefix}WhatOpt"]:checked`)).map(c => c.value);
    const whatPurposes = whatChecked.length > 0 ? whatChecked.join(' 및 ') : getProgramPurpose(prg);
    if (f.elements.what5w) {
      f.elements.what5w.value = `• 프로그램명: ${prg}\n• 활동 영역 및 목표: ${whatPurposes}`;
    }

    // 5. How
    const howChecked = Array.from(f.querySelectorAll(`input[name="${prefix}HowOpt"]:checked`)).map(c => c.value);
    if (f.elements.how5w && howChecked.length > 0) {
      f.elements.how5w.value = howChecked.map(h => `• ${h}`).join('\n');
    }

    // 6. Why
    const whyChecked = Array.from(f.querySelectorAll(`input[name="${prefix}WhyOpt"]:checked`)).map(c => c.value);
    if (f.elements.why5w && whyChecked.length > 0) {
      f.elements.why5w.value = whyChecked.map(w => `• ${w}`).join('\n');
    }

    syncToReport('5w1h_standard');
  };

  f.querySelectorAll(`input[name^="${prefix}"]`).forEach(inp => {
    inp.addEventListener('change', updateSectionFromChips);
  });

  const gen = (fmt = '5w1h_standard') => {
    const elId = f.elements.elder_id?.value;
    const el = elder(elId) || db.elders[0] || {};
    const prg = f.elements.program?.value || 'AI 인지활동';
    const dt = f.elements.date?.value || today();
    const dur = Number(f.elements.duration?.value) || 20;

    const dummySession = {
      elder_id: el.elder_id,
      date: dt,
      program: prg,
      durationSeconds: dur * 60,
      pre: { mood: '😊 보통', health: '양호', willingness: '적극적', notes: '' },
      observation: { participation: '미기록', focus: '미기록', performance: '미기록', emotion: [], communication: '미기록', behavior: [], notes: '' },
      evaluation: { satisfaction: '😊 매우 좋음', focus: '높음', performance: '독립 수행', next: '같은 활동 유지' }
    };

    const parts = draftParts(dummySession, fmt);
    if (f.elements.who5w) f.elements.who5w.value = parts.who;
    if (f.elements.when5w) f.elements.when5w.value = parts.when;
    if (f.elements.where5w) f.elements.where5w.value = parts.where;
    if (f.elements.what5w) f.elements.what5w.value = parts.what;
    if (f.elements.how5w) f.elements.how5w.value = parts.how;
    if (f.elements.why5w) f.elements.why5w.value = parts.why;

    syncToReport(fmt);
    const toast = $('#careToast');
    if (toast) { toast.textContent = `✨ ${fmt==='5w1h_narrative'?'서술형':fmt==='simple'?'간편 요약':'표준 5W1H'} 항목별 일지가 자동 완성되었습니다.`; setTimeout(() => toast.textContent = '', 3000); }
  };

  ['elder_id', 'program', 'date', 'duration'].forEach(fieldName => {
    f.elements[fieldName]?.addEventListener('change', () => {
      updateSectionFromChips();
    });
  });

  const capPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  $(`#btn${capPrefix}5w1h`)?.addEventListener('click', () => gen('5w1h_standard'));
  $(`#btn${capPrefix}Narrative`)?.addEventListener('click', () => gen('5w1h_narrative'));
  $(`#btn${capPrefix}Copy`)?.addEventListener('click', () => {
    syncToReport('5w1h_standard');
    const val = f.elements.aiReport?.value;
    if (!val) { alert('복사할 일지 내용이 없습니다.'); return; }
    navigator.clipboard.writeText(val).then(() => {
      const toast = $('#careToast');
      if (toast) { toast.textContent = '📋 육하원칙 일지가 클립보드에 복사되었습니다. (Ctrl+V로 붙여넣기 가능)'; setTimeout(() => toast.textContent = '', 3500); }
    }).catch(() => {
      alert('📋 일지가 복사되었습니다.');
    });
  });

  gen('5w1h_standard');
}

function initQuickJournalEvents() {
  setup5W1HFormEvents('quickJournalForm', 'quick');
}


function go(target){
  document.dispatchEvent(new CustomEvent('care:navigate',{detail:target}));
  page = target;
  const isHome = target === 'home';
  const hero = document.querySelector('.hero-classroom');
  const lessons = document.querySelector('.section-lessons');
  const warmup = document.querySelector('.warmup-intro');
  const friends = document.querySelector('.friend-selection');
  const careNav = document.querySelector('.care-nav');
  const careRoot = document.getElementById('careRoot');

  if (hero) hero.hidden = !isHome;
  if (lessons) lessons.hidden = !isHome;
  if (warmup) warmup.hidden = !isHome;
  if (friends) friends.hidden = !isHome;

  if (careNav) {
    careNav.style.display = isHome ? 'none' : 'flex';
    careNav.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', b.dataset.value === target ? 'page' : 'false'));
  }

  if (isHome) {
    if (careRoot) {
      careRoot.style.display = 'none';
      careRoot.innerHTML = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target === 'lessons') { begin(); return; }

  const views = { home, elders, records: () => recordPage(false), journals: () => recordPage(true), analysis, reports, admin };
  if (careRoot) {
    careRoot.style.display = 'block';
    careRoot.innerHTML = (views[target] || home)();
    if (target === 'journals') { setTimeout(initQuickJournalEvents, 50); }
    careRoot.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
}

function home(){
  const scheduled = db.elders.filter(e => e.scheduleDate === today() || (db.schedules || []).some(s => s.elder_id === e.elder_id && s.date === today())),
        done = new Set(records().filter(s => s.date === today()).map(s => s.elder_id));
  return heading(
    '오늘도 어르신과 즐거운 시간을 만들어보세요.',
    '작은 참여와 변화를 소중히 기록합니다.',
    btn('＋ 어르신 등록', 'register') + btn('✍️ 업무수행 일지 작성', 'new-journal') + btn('오늘 수업 시작 →', 'begin', '', 'primary')
  ) + `${calendar()}<div class="care-grid stats">${[['오늘 수업 예정', scheduled.length + '명'], ['오늘 수업 완료', done.size + '명'], ['예정자 중 미진행', scheduled.filter(e => !done.has(e.elder_id)).length + '명']].map(([k, v]) => `<article class="care-card"><p>${k}</p><strong>${v}</strong></article>`).join('')}</div><div class="care-grid"><article class="care-card"><h2>최근 작성된 수업일지</h2>${records().filter(s => s.aiReport).slice(0, 3).map(s => `<p>${btn(esc(elder(s.elder_id)?.name) + ' · ' + esc(s.program), 'detail', s.session_id)}<small>${esc(s.date)}</small></p>`).join('') || '<p>첫 수업을 마치고 일지를 작성해보세요.</p>'}</article><article class="care-card"><h2>최근 특이사항</h2>${records().filter(s => s.pre.notes || s.observation.notes).slice(0, 3).map(s => `<p><b>${esc(elder(s.elder_id)?.name)}</b> · ${esc(s.date)}<br>${esc(s.observation.notes || s.pre.notes)}</p>`).join('') || '<p>기록된 특이사항이 없습니다.</p>'}</article><article class="care-card"><h2>오늘 추천 프로그램</h2><p>📷 추억의 사진 이야기</p><p>익숙한 사진으로 편안하게 대화를 시작해보세요.</p>${btn('추천 수업 시작', 'begin', 'photo')}</article></div>`;
}
function elders(){return heading('어르신 관리','관심사와 일상의 정보를 함께 기록하세요.',btn('＋ 어르신 등록','register'))+`<label class="care-field">이름 검색<input id="elderSearch" placeholder="어르신 이름을 입력하세요"></label><div class="care-grid" id="elderCards">${elderCards('')}</div>`;}
function elderCards(q){return db.elders.filter(e=>e.name.includes(q)).map(e=>{const last=records(e.elder_id)[0];return `<article class="care-card"><div class="care-avatar">${e.gender==='남성'?'👴':'👵'}</div><h2>${esc(e.name)}</h2><p>장기요양 ${esc(e.grade||'미입력')}</p><p>최근 활동: ${esc(last?.program||'아직 없음')}</p><p>최근 상태: ${esc(last?.pre.mood||'확인 전')}</p><label class="care-check"><input type="checkbox" data-schedule="${e.elder_id}" ${e.scheduleDate===today()?'checked':''}> 오늘 수업 예정</label><div class="care-actions">${btn('프로필 수정','register',e.elder_id)}${btn('활동 기록','elder-records',e.elder_id)}</div></article>`;}).join('')||'<div class="care-card">등록된 대상자가 없습니다. 어르신을 등록해주세요.</div>';}
function register(id){const e=elder(id)||{},groups=[['기본정보',[['이름','name'],['성별','gender'],['생년월일','birth','date'],['보호자 연락처','guardian','tel'],['장기요양등급','grade'],['입소일 / 이용 시작일','admitted','date']]],['인지 및 생활정보',[['인지 상태','cognition'],['의사소통 가능 정도','communication'],['시력 상태','vision'],['청력 상태','hearing'],['거동 상태','mobility']]],['관심정보',[['좋아하는 음악','music'],['좋아하는 음식','food'],['고향','hometown'],['과거 직업','job'],['관심 있는 주제','topics'],['좋아하는 활동','activities']]],['프로그램 정보',[['집중 가능 시간 (분)','attention','number'],['선호 활동','preferred'],['어려워하는 활동','difficult'],['프로그램 목표','goal'],['사회복지사 주의사항','caution']]]];modal(id?'어르신 프로필 수정':'어르신 등록',`<form id="elderForm" data-id="${esc(id)}">${groups.map(([title,fs])=>`<h3>${title}</h3><div class="care-form-grid">${fs.map(([l,k,t])=>field(l,k,e[k],t,k==='name')).join('')}</div>`).join('')}<h3>개인정보 및 기록관리</h3><p>확인한 동의만 선택해주세요.</p>${['개인정보 동의','보호자 동의','프로그램 참여 동의','사진 활용 동의'].map((l,i)=>`<label class="care-check"><input type="checkbox" name="consent${i}" ${e['consent'+i]?'checked':''}>${l}</label>`).join('')}<button class="care-btn primary" type="submit">프로필 저장</button></form>`);}
function begin(lesson){if(active){modal('진행 중인 수업',`<p>현재 수업을 계속하거나 종료 평가를 작성해주세요.</p>${btn('수업으로 돌아가기','close')}${btn('종료 평가','evaluate')}`);return;}scheduleContext=null;pending=lesson||null;if(!person)setActivePerson(getActivePerson(db.elders));const current=elder(person)||db.elders[0];const highlightCurrent=current?`<div class="care-card primary-highlight" style="border:2px solid #ff7e36;background:#fff8f5;padding:14px;margin-bottom:16px;border-radius:12px;"><p style="margin:0 0 8px 0;font-weight:bold;color:#d9534f;">⭐ 선택된 어르신: ${esc(current.name)}</p>${btn('👤 '+esc(current.name)+' 어르신으로 바로 수업 시작 →','pre',current.elder_id,'primary')}</div>`:'';modal('1. 오늘 수업 대상자 선택',`<p>수업을 진행할 어르신을 선택해주세요. 등록된 어르신 정보는 연속하여 안전하게 보존됩니다.</p>${highlightCurrent}<h3>전체 등록 어르신 목록 (${db.elders.length}명)</h3><div class="care-grid">${db.elders.map(e=>btn((e.elder_id===person?'⭐ ':'👤 ')+esc(e.name),'pre',e.elder_id,e.elder_id===person?'primary':'')).join('')}</div>${btn('＋ 어르신 신규 등록','register')}`);}
function pre(id){
  setActivePerson(id);
  const el = elder(id);
  // 손자/손녀처럼 친근하고 자연스러운 구어체 인사 (랜덤 선택)
  const name = el ? el.name : '';
  const gender = el ? el.gender : '';
  const grandparent = gender === '남성' ? '할아버지' : '할머니';
  const friendlyGreetings = el ? [
    `${name} ${grandparent}! 저 콩이에요! 오늘 만나서 너무 반가워요!`,
    `${name} ${grandparent}~ 안녕하세요? 콩이가 왔어요!`,
    `${grandparent}! 저 콩이에요! 오늘도 같이 놀아요!`,
    `${name} ${grandparent}! 오늘 기분이 어때요? 콩이에요!`
  ] : ['안녕하세요! 저 콩이에요! 오늘 만나서 반가워요!'];
  const greetingText = friendlyGreetings[Math.floor(Math.random() * friendlyGreetings.length)];

  // 모달 HTML - 콩이 캐릭터 이미지 + 입 애니메이션 포함
  const kongiBlock = `
    <div style="display:flex;align-items:center;gap:16px;background:#fff8f5;border:2px solid #ff7e36;padding:16px;border-radius:14px;margin-bottom:16px;">
      <!-- 콩이 캐릭터 (말할 때 입 움직임) -->
      <div id="preKongiWrap" style="position:relative;flex-shrink:0;width:90px;height:90px;">
        <img src="assets/images/ai_puppy_friend.jpg" alt="콩이"
             id="preKongiImg"
             style="width:90px;height:90px;border-radius:50%;object-fit:cover;
                    border:3px solid #ff7e36;
                    animation:kongiFloat 2.5s ease-in-out infinite;
                    transition:box-shadow 0.2s ease;">
        <!-- 입 움직임 오버레이 -->
        <div id="preKongiMouth"
             style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);
                    width:18px;height:6px;z-index:5;pointer-events:none;opacity:0;transition:opacity 0.1s;">
          <div style="width:100%;height:100%;background:rgba(80,40,20,0.75);border-radius:10px;
                      animation:kongiMouthTalk 0.2s ease-in-out infinite alternate;"></div>
        </div>
      </div>
      <!-- 말풍선 -->
      <div style="flex:1;">
        <p style="margin:0 0 4px 0;font-size:1rem;font-weight:800;color:#ff7e36;">🐶 콩이</p>
        <p style="margin:0 0 6px 0;font-size:1.15rem;font-weight:700;color:#222;line-height:1.4;">"${esc(greetingText)}"</p>
        <p style="margin:0 0 8px 0;color:#666;font-size:0.95rem;">오늘 기분이랑 몸 상태 어때요?</p>
        <button type="button"
                onclick="window.VoiceManager && window.VoiceManager.speak('${esc(greetingText).replace(/'/g,'&#39;')}')"
                style="background:#fff3e8;border:1.5px solid #ff7e36;color:#c2440b;
                       padding:6px 14px;border-radius:20px;font-size:0.9rem;font-weight:700;cursor:pointer;">
          🔊 다시 말해줘요
        </button>
      </div>
    </div>`;

  modal('2. 수업 전 상태 확인',
    kongiBlock +
    `<form id="preForm" data-id="${id}">${choices('오늘 기분','mood',['😊 좋음','😐 보통','😟 좋지 않음'])}${choices('오늘 건강상태','health',['좋음','보통','피곤함','통증 있음','기타'])}${choices('참여 의사','willingness',['적극적','보통','소극적','거부'])}${area('오늘 특이사항','notes')}<button class="care-btn primary">AI 수업 선택 →</button></form>`
  );

  // 모달이 열린 후 300ms 뒤에 음성 실행 (dialog 렌더 완료 대기)
  setTimeout(() => {
    if (window.VoiceManager) {
      window.VoiceManager.speak(greetingText, null);
      // 말하는 동안 입 움직임 활성화
      const mouth = document.getElementById('preKongiMouth');
      const img = document.getElementById('preKongiImg');
      if (mouth) mouth.style.opacity = '1';
      if (img) img.style.boxShadow = '0 0 0 4px rgba(255,126,54,0.35)';
      // 말 끝나면 입 닫기
      const checkSpeaking = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(checkSpeaking);
          if (mouth) mouth.style.opacity = '0';
          if (img) img.style.boxShadow = '';
        }
      }, 200);
    }
  }, 300);
}
const categories=[['🧠','인지훈련','memory'],['📷','회상활동','photo'],['🎵','음악활동','music'],['💬','언어활동','story'],['🔢','숫자활동','numbers'],['🎨','미술활동','art'],['😊','감정활동','emotions'],['🏠','생활인지','daily'],['🏡','생활 습관','school_habits']];
const aiCourses=[['🤖','AI 기초','ai_basic'],['💡','내가 알고 싶은 것 질문하기','prompt_basic'],['✍️','글쓰기','ai_writing'],['🎨','이미지 만들기','ai_image'],['🏡','생활 활용','ai_life'],['❓','퀴즈','ai_quiz']];
function programs(){modal('3. AI 프로그램 선택',`<p>${esc(elder(active.elder_id).name)} 어르신 · ${esc(active.pre.mood)} · ${esc(active.pre.health)}</p><h3>🤖 AI 핵심 실습 코스</h3><div class="care-grid">${aiCourses.map(([icon,name,id])=>btn(`${icon}<br>${name}<small>${esc(window.LESSON_CATALOG.find(l=>l.id===id)?.summary||name)}</small>`,'launch',id,'category')).join('')}</div><h3>🧡 시니어 인지 돌봄 활동</h3><div class="care-grid">${categories.map(([icon,name,id])=>btn(`${icon}<br>${name}<small>${esc(window.LESSON_CATALOG.find(l=>l.id===id)?.title||name)}</small>`,'launch',id,'category')).join('')}</div><h3>기존 디지털 수업</h3><div class="care-actions">${['greeting','smartphone','ask'].map(id=>btn(esc(window.LESSON_CATALOG.find(l=>l.id===id)?.title||id),'launch',id)).join('')}${db.programs.map(p=>btn(esc(p.title),'launch',p.id)).join('')}</div>${pending?`<p>선택하신 수업</p>${btn(esc(window.LESSON_CATALOG.find(l=>l.id===pending)?.title||''),'launch',pending,'primary')}`:''}`);}
function observation(){if(!active?.program)return;const o=active.observation||{};modal('사회복지사 관찰 기록',`<form id="observationForm">${choices('집중도','focus',['높음','보통','낮음'],o.focus)}${choices('참여도','participation',['적극적','보통','소극적','거부'],o.participation)}${choices('수행 정도','performance',['도움 없이 수행','약간의 도움','많은 도움','수행 어려움'],o.performance)}${choices('정서 반응','emotion',['웃음','즐거움','관심','무표정','불안','짜증','거부'],o.emotion,true)}${choices('의사소통','communication',['자발적으로 대화함','질문에 대답함','단답형 반응','반응이 거의 없음'],o.communication)}${choices('특이 행동','behavior',['반복 질문','자리 이탈','활동 거부','졸음','없음'],o.behavior,true)}${area('추가 관찰 메모','notes',o.notes)}<button class="care-btn primary">관찰 저장 · 수업 계속</button></form>`);}
function evaluate(){if(!active?.program)return;if(!active.observation?.focus){observation();return;}VoiceManager.stopSpeaking();window.KaraokeEngine?.stopKaraoke();modal('수업 종료 평가',`<form id="evaluationForm">${choices('오늘 활동 만족도','satisfaction',['😊 매우 좋음','🙂 좋음','😐 보통','🙁 어려움'])}${choices('오늘 집중도','focus',['높음','보통','낮음'])}${choices('활동 수행도','performance',['독립 수행','부분 도움','많은 도움'])}${choices('다음 수업 추천','next',['같은 활동 유지','난이도 낮추기','난이도 높이기','다른 활동 추천'])}<p>관찰 기록과 평가가 대상자별로 누적 저장됩니다.</p><button class="care-btn primary">수업 기록 저장</button></form>`);}
function newJournalModal() {
  const defaultElder = elder(person) || db.elders[0] || {};
  const todayDate = today();
  const programs = window.LESSON_CATALOG || [];

  modal('✍️ 새 업무수행 일지 작성 (5W1H)', `
<div style="border: 2px solid #FF7E36; border-radius: 18px; background: #FFFFFF; padding: 24px 26px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 12px;">
  <div style="margin-bottom: 18px;">
    <h2 style="margin:0; font-size: 19px; font-weight: 800; color: #1E1E1E; display:flex; align-items:center; gap: 8px;">
      <span>✍️</span> 업무수행 일지 즉시 작성 및 자동생성 (5W1H)
    </h2>
    <p style="margin: 4px 0 0 0; font-size: 13.5px; color: #555555;">어르신과 프로그램을 선택하면 육하원칙에 맞춘 공문서 규격 업무일지가 각 칸별로 즉시 완성됩니다.</p>
  </div>

  <form id="directJournalForm">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; margin-bottom: 16px;">
      <div>
        <label style="display:block; font-size: 14px; font-weight: 700; color: #222; margin-bottom: 6px;">대상 어르신 *</label>
        <select name="elder_id" id="newJournalElder" required style="width: 100%; height: 44px; border: 1.5px solid #A0A0A0; border-radius: 8px; padding: 8px 12px; font-size: 15px; color: #222; background: #FFF; box-sizing: border-box;">
          ${db.elders.map(e => `<option value="${e.elder_id}" ${(person===e.elder_id||defaultElder.elder_id===e.elder_id)?'selected':''}>${esc(e.name)} (${esc(e.grade||'등급미입력')})</option>`).join('')}
        </select>
      </div>
      <div>
        <label style="display:block; font-size: 14px; font-weight: 700; color: #222; margin-bottom: 6px;">수업 일자 *</label>
        <input name="date" type="date" value="${todayDate}" required style="width: 100%; height: 44px; border: 1.5px solid #A0A0A0; border-radius: 8px; padding: 8px 12px; font-size: 15px; color: #222; background: #FFF; box-sizing: border-box;">
      </div>
      <div>
        <label style="display:block; font-size: 14px; font-weight: 700; color: #222; margin-bottom: 6px;">수업 프로그램 *</label>
        <select name="program" id="newJournalProgram" required style="width: 100%; height: 44px; border: 1.5px solid #A0A0A0; border-radius: 8px; padding: 8px 12px; font-size: 15px; color: #222; background: #FFF; box-sizing: border-box;">
          ${programs.map(p => `<option value="${esc(p.title)}">${esc(p.title)}</option>`).join('')}
          <option value="자유 인지대화 및 회상">자유 인지대화 및 회상</option>
          <option value="맞춤형 일상생활 인지활동">맞춤형 일상생활 인지활동</option>
        </select>
      </div>
      <div>
        <label style="display:block; font-size: 14px; font-weight: 700; color: #222; margin-bottom: 6px;">활동 소요 시간(분) *</label>
        <input name="duration" type="number" value="20" required style="width: 100%; height: 44px; border: 1.5px solid #A0A0A0; border-radius: 8px; padding: 8px 12px; font-size: 15px; color: #222; background: #FFF; box-sizing: border-box;">
      </div>
    </div>

    ${render5W1HBoxesHtml('direct')}

    <div class="care-actions" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 14px; padding-top: 10px; border-top: 1px solid #EEEEEE;">
      <div style="display:flex; gap:6px;">
        <button type="button" class="care-btn-sm" id="btnDirect5w1h" style="padding:6px 10px; font-size:13px;">📋 표준 5W1H</button>
        <button type="button" class="care-btn-sm" id="btnDirectNarrative" style="padding:6px 10px; font-size:13px;">📝 서술형</button>
        <button type="button" class="care-btn-sm copy-btn" id="btnDirectCopy" style="padding:6px 10px; font-size:13px;">📋 복사하기</button>
      </div>
      <div style="display:flex; gap:6px;">
        ${btn('닫기', 'close')}
        <button type="submit" class="care-btn primary" style="padding:8px 18px; font-size:14px; font-weight:bold;">💾 일지 저장</button>
      </div>
    </div>
  </form>
</div>`);

  setTimeout(() => {
    setup5W1HFormEvents('directJournalForm', 'direct');
  }, 100);
}

function recordPage(journal){
  const defaultElder = elder(person) || db.elders[0] || {};
  const editorBlock = journal ? `
<div class="clean-journal-card-wrapper" style="max-width: 820px; margin: 0 auto 30px auto;">
  <div class="clean-journal-card" style="border: 2px solid #FF7E36; border-radius: 18px; background: #FFFFFF; padding: 26px 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    <div style="margin-bottom: 20px;">
      <h2 style="margin:0; font-size: 20px; font-weight: 800; color: #1E1E1E; display:flex; align-items:center; gap: 8px;">
        <span>✍️</span> 업무수행 일지 즉시 작성 및 자동생성 (5W1H)
      </h2>
      <p style="margin: 6px 0 0 0; font-size: 13.5px; color: #555555; line-height: 1.4;">어르신과 프로그램을 선택하면 육하원칙에 맞춘 공문서 규격 업무일지가 각 항목별로 즉시 완성됩니다.</p>
    </div>

    <form id="quickJournalForm">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; margin-bottom: 18px;">
        <div>
          <label style="display:block; font-size: 14px; font-weight: 700; color: #222; margin-bottom: 6px;">대상 어르신 *</label>
          <select name="elder_id" id="quickJournalElder" required style="width: 100%; height: 44px; border: 1.5px solid #A0A0A0; border-radius: 8px; padding: 8px 12px; font-size: 15px; color: #222; background: #FFF; box-sizing: border-box;">
            ${db.elders.map(e => `<option value="${e.elder_id}" ${(person===e.elder_id||defaultElder.elder_id===e.elder_id)?'selected':''}>${esc(e.name)} (${esc(e.grade||'등급미입력')})</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="display:block; font-size: 14px; font-weight: 700; color: #222; margin-bottom: 6px;">수업 일자 *</label>
          <input name="date" type="date" value="${today()}" required style="width: 100%; height: 44px; border: 1.5px solid #A0A0A0; border-radius: 8px; padding: 8px 12px; font-size: 15px; color: #222; background: #FFF; box-sizing: border-box;">
        </div>
        <div>
          <label style="display:block; font-size: 14px; font-weight: 700; color: #222; margin-bottom: 6px;">수업 프로그램 *</label>
          <select name="program" id="quickJournalProgram" required style="width: 100%; height: 44px; border: 1.5px solid #A0A0A0; border-radius: 8px; padding: 8px 12px; font-size: 15px; color: #222; background: #FFF; box-sizing: border-box;">
            ${(window.LESSON_CATALOG||[]).map(p => `<option value="${esc(p.title)}">${esc(p.title)}</option>`).join('')}
            <option value="자유 인지대화 및 회상">자유 인지대화 및 회상</option>
            <option value="맞춤형 일상생활 인지활동">맞춤형 일상생활 인지활동</option>
          </select>
        </div>
        <div>
          <label style="display:block; font-size: 14px; font-weight: 700; color: #222; margin-bottom: 6px;">활동 소요 시간(분) *</label>
          <input name="duration" type="number" value="20" required style="width: 100%; height: 44px; border: 1.5px solid #A0A0A0; border-radius: 8px; padding: 8px 12px; font-size: 15px; color: #222; background: #FFF; box-sizing: border-box;">
        </div>
      </div>

      ${render5W1HBoxesHtml('quick')}

      <div class="care-actions no-print" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 14px; padding-top: 10px; border-top: 1px solid #EEEEEE;">
        <div style="display:flex; gap:6px;">
          <button type="button" class="care-btn-sm" id="btnQuick5w1h" style="padding:6px 10px; font-size:13px;">📋 표준 5W1H</button>
          <button type="button" class="care-btn-sm" id="btnQuickNarrative" style="padding:6px 10px; font-size:13px;">📝 서술형</button>
          <button type="button" class="care-btn-sm copy-btn" id="btnQuickCopy" style="padding:6px 10px; font-size:13px;">📋 복사하기</button>
        </div>
        <div style="display:flex; gap:6px;">
          <button type="button" class="care-btn-sm" onclick="window.print()" style="padding:6px 12px; font-size:13px;">🖨️ 인쇄 / PDF</button>
          <button type="submit" class="care-btn primary" style="padding:8px 18px; font-size:14px; font-weight:bold;">💾 일지 저장</button>
        </div>
      </div>
    </form>
  </div>
</div>
` : '';

  return heading(
    journal ? 'AI 수업일지 및 업무수행 기록' : '수업 기록',
    '육하원칙(5W1H)에 기반한 업무일지를 작성하고 과거 기록을 체계적으로 관리합니다.',
    btn('✍️ 새 일지 작성', 'new-journal', '', 'primary') + printButtons()
  ) + editorBlock + `
<div class="care-filters no-print">
  ${selectPerson()}
  ${field('날짜 검색', 'recordDate', '', 'date')}
  <label class="care-field">프로그램 검색
    <input id="recordSearch" placeholder="프로그램 이름">
  </label>
</div>
<h3 style="margin:20px 0 12px 0; font-size:20px; color:#2B241F;">📂 저장된 수업 기록 및 업무일지 목록</h3>
<div id="careRecordList">${recordList(records(person))}</div>
<details class="no-print" style="margin-top:20px;"><summary>기존 사이트 기록 (대상자 미연결)</summary>${btn('기존 기록 열기', 'legacy')}</details>`;
}

function recordList(list){
  return list.map(s => {
    const el = elder(s.elder_id);
    const hasReport = !!s.aiReport;
    return `
<article class="care-card record-row">
  <div>
    <small>${esc(s.date)} · 활동 ${Math.max(1, Math.round((s.durationSeconds || 180)/60))}분</small>
    <h2>${esc(el?.name || '어르신')} · ${esc(s.program)}</h2>
    <p>참여 <b>${esc(s.observation?.participation || '보통')}</b> · 집중 <b>${esc(s.evaluation?.focus || s.observation?.focus || '보통')}</b> · 수행 <b>${esc(s.evaluation?.performance || s.observation?.performance || '독립')}</b></p>
    <p style="margin-top:6px;">
      ${hasReport ? '<span class="badge-status-completed">📋 5W1H 일지 작성완료</span>' : '<span class="badge-help-needed">⚠️ 일지 작성 전</span>'}
      ${s.reviewed ? '<span style="font-size:13px; color:#2E7D32; margin-left:6px;">(검토 완료)</span>' : ''}
    </p>
  </div>
  <div class="care-actions">
    ${btn('📋 일지 작성 / 확인', 'detail', s.session_id, 'primary')}
  </div>
</article>`;
  }).join('') || '<div class="care-card">해당 조건의 수업 기록이 없습니다. 상단에서 [✍️ 새 일지 작성]을 진행해보세요.</div>';
}
function getProgramPurpose(programTitle) {
  const t = String(programTitle || '');
  if (t.includes('사진') || t.includes('추억') || t.includes('회상')) {
    return '과거 회상을 통한 장기기억 자극 및 정서적 안정감 도모';
  } else if (t.includes('음악') || t.includes('노래')) {
    return '익숙한 멜로디와 리듬을 통한 청각 자극 및 정서적 활력 증진';
  } else if (t.includes('그림') || t.includes('미술') || t.includes('아트')) {
    return '시각적 표현과 소근육 협응 자극을 통한 창작 성취감 고취';
  } else if (t.includes('기억') || t.includes('인지') || t.includes('퍼즐')) {
    return '주의집중력 및 단기 작업기억 유지·강화를 위한 인지 훈련';
  } else if (t.includes('스마트폰') || t.includes('디지털') || t.includes('생활')) {
    return '디지털 기기 활용 친숙도 향상 및 일상생활 자립감 증진';
  } else if (t.includes('이야기') || t.includes('동화') || t.includes('언어')) {
    return '언어적 상호작용 촉진 및 서사적 사고력 자극';
  } else if (t.includes('인사') || t.includes('친구') || t.includes('감정')) {
    return '친밀한 라포 형성 및 일상 정서 교류를 통한 고립감 해소';
  }
  return '잔존 인지기능 유지 및 사회적 상호작용 촉진';
}

function draft(s, format = '5w1h_standard') {
  const el = elder(s.elder_id) || {};
  const name = el.name || '어르신';
  const gender = el.gender || '성별 미기록';
  const grade = el.grade || '등급 미입력';
  const cognition = el.cognition || '인지상태 미기록';
  const birth = el.birth ? ` (${el.birth}생)` : '';
  const date = s.date || today();
  const durationMin = (Number.isFinite(s.durationSeconds) ? Math.round(s.durationSeconds / 60) : '미기록');
  const program = s.program || 'AI 인지활동';
  const purpose = getProgramPurpose(program);

  const preMood = s.pre?.mood || '미기록';
  const preHealth = s.pre?.health || '미기록';
  const preWillingness = s.pre?.willingness || '미기록';
  const preNotes = s.pre?.notes ? `[수업 전 메모: ${s.pre.notes}]` : '';

  const participation = s.observation?.participation || '미기록';
  const focus = s.evaluation?.focus || s.observation?.focus || '미기록';
  const performance = s.evaluation?.performance || s.observation?.performance || '미기록';
  const emotions = (s.observation?.emotion && s.observation.emotion.length > 0) ? s.observation.emotion.join(', ') : '미기록';
  const communication = s.observation?.communication || '미기록';
  const behaviors = (s.observation?.behavior && s.observation.behavior.length > 0 && !s.observation.behavior.includes('없음')) ? s.observation.behavior.join(', ') : (s.observation?.behavior?.includes('없음') ? '없음으로 기록' : '미기록');
  const obsNotes = s.observation?.notes ? `[관찰 메모: ${s.observation.notes}]` : '';
  
  const notesTotal = [preNotes, obsNotes].filter(Boolean).join(' ') || '추가 관찰 메모 미기록';
  const satisfaction = s.evaluation?.satisfaction || '미기록';
  const nextPlan = s.evaluation?.next || '미기록';

  if (format === '5w1h_narrative') {
    return `[업무수행 일지 — 육하원칙 서술형]
• [누가(Who) / 언제(When) / 어디서(Where)] ${date}, AI 디지털 교실에서 담당 사회복지사와 AI 튜터 콩이의 안내로 ${name} 어르신(${gender}, ${grade}, ${cognition}${birth})을 대상으로 약 ${durationMin}분간 인지 돌봄 활동을 진행함.
• [무엇을(What)] '${program}' 프로그램을 진행하여 ${purpose}을(를) 도모함.
• [어떻게(How)] 활동 시작 전 기분(${preMood}), 건강상태(${preHealth}), 참여의사(${preWillingness})를 확인 후 착수함. 활동 중 참여도는 '${participation}', 집중도는 '${focus}', 활동 수행도는 '${performance}' 수준으로 나타남. 정서적으로는 '${emotions}' 반응을 보였으며 의사소통은 '${communication}' 양상을 띰. (${notesTotal})
• [왜 & 향후계획(Why & Next)] 어르신의 잔존 인지기능 유지 및 정서 안정을 목적으로 하였으며, 활동 만족도는 '${satisfaction}'으로 기록됨. 차기 수업은 '${nextPlan}' 방향으로 연계하여 지속적인 인지 자극과 긍정적 라포를 형성하고자 함.`;
  }

  if (format === 'simple') {
    return `${name} 어르신은 ${date} '${program}' 활동에 약 ${durationMin}분간 참여하셨음. 활동 전 상태는 기분 ${preMood}, 건강 ${preHealth}이었으며, 참여도 ${participation}, 집중도 ${focus}, 수행도 ${performance}으로 관찰됨. 정서 반응은 ${emotions}, 의사소통은 ${communication}이었음. (${notesTotal}) 만족도는 ${satisfaction}이며 차기 계획은 '${nextPlan}'으로 수립함.`;
  }

  // 5w1h_standard (기본 표준 공문서 양식)
  return `[업무수행 일지 — 육하원칙(5W1H) 표준 서식]

1. 누가 (Who)
• 대상자: ${name} 어르신 (${gender} / ${grade} / 인지상태: ${cognition}${birth})
• 서비스 제공자: 담당 사회복지사 및 AI 보조튜터 콩이

2. 언제 (When)
• 일시: ${date} (활동 시간: 약 ${durationMin}분)

3. 어디서 (Where)
• 장소: AI 디지털 교실 / 스마트 인지케어 활동실

4. 무엇을 (What)
• 프로그램명: ${program}
• 활동 영역 및 목표: ${purpose}

5. 어떻게 (How)
• 사전 상태 점검: 기분 [${preMood}], 건강상태 [${preHealth}], 참여의사 [${preWillingness}]
• 참여 및 집중도: 참여도 [${participation}], 집중도 [${focus}], 과제 수행도 [${performance}]
• 정서 및 의사소통: 정서 반응 [${emotions}], 의사소통 [${communication}]
• 관찰 및 특이사항: 특이행동 [${behaviors}] / ${notesTotal}

6. 왜 & 향후 계획 (Why & Next)
• 추진 목적: ${purpose}
• 종합 만족도: ${satisfaction}
• 차기 지도 계획: '${nextPlan}' 방향으로 진행하여 인지 안정과 성취감을 지속적으로 격려함.`;
}

function detail(id){
  const s = db.sessions.find(s => s.session_id === id);
  if (!s) return;
  const el = elder(s.elder_id) || {};
  const currentReport = s.aiReport || draft(s, '5w1h_standard');
  const durMin = Math.max(1, Math.round((s.durationSeconds || 180)/60));

  modal('수업 기록 · 업무수행 일지 (5W1H)', `
<div class="print-document one-page-journal">
  <!-- 인쇄 전용 공식 결재란 & 헤더 -->
  <div class="print-official-header">
    <div class="print-title-area">
      <p class="print-doc-sub">노인복지 및 인지돌봄 업무수행 관리대장</p>
      <h1 class="print-doc-title">AI 인지활동 업무수행일지</h1>
    </div>
    <table class="print-sign-table">
      <thead>
        <tr>
          <th rowspan="2" class="sign-th-side">결<br>재</th>
          <th>담당자</th>
          <th>팀 장</th>
          <th>시설장</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="sign-cell"></td>
          <td class="sign-cell"></td>
          <td class="sign-cell"></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 1. 기본 인적사항 및 활동 개요 표 -->
  <table class="print-meta-table">
    <tbody>
      <tr>
        <th style="width:14%;">대상자명</th>
        <td style="width:20%;"><b>${esc(el.name || '어르신')}</b> (${esc(el.gender || '미입력')})</td>
        <th style="width:14%;">요양등급</th>
        <td style="width:18%;">${esc(el.grade || '등급미입력')}</td>
        <th style="width:14%;">인지상태</th>
        <td style="width:20%;">${esc(el.cognition || '경도인지장애')}</td>
      </tr>
      <tr>
        <th>활동일시</th>
        <td>${esc(s.date)}</td>
        <th>소요시간</th>
        <td>약 ${durMin}분간 진행</td>
        <th>장 소</th>
        <td>스마트 인지케어실</td>
      </tr>
      <tr>
        <th>프로그램명</th>
        <td colspan="3"><b>${esc(s.program)}</b></td>
        <th>진행방식</th>
        <td>AI 튜터 콩이 & 복지사</td>
      </tr>
    </tbody>
  </table>

  <!-- 2. 관찰 및 평가 요약 표 -->
  <table class="print-obs-table">
    <tbody>
      <tr>
        <th style="width:14%;">사전 상태</th>
        <td style="width:36%;">기분 [${esc(s.pre.mood || '보통')}], 건강 [${esc(s.pre.health || '양호')}], 참여의사 [${esc(s.pre.willingness || '확인')}]</td>
        <th style="width:14%;">수행 태도</th>
        <td style="width:36%;">참여도 [${esc(s.observation.participation || '보통')}], 집중도 [${esc(s.evaluation.focus || s.observation.focus || '보통')}]</td>
      </tr>
      <tr>
        <th>정서/소통</th>
        <td>정서: ${esc((s.observation.emotion || []).join(', ') || '안정')} / 소통: ${esc(s.observation.communication || '자발적')}</td>
        <th>과제 수행도</th>
        <td>${esc(s.observation.performance || s.evaluation.performance || '독립 수행')} (만족도: ${esc(s.evaluation.satisfaction || '😊 좋음')})</td>
      </tr>
      ${(s.pre.notes || s.observation.notes) ? `
      <tr>
        <th>관찰 메모</th>
        <td colspan="3">${esc([s.pre.notes ? '사전: ' + s.pre.notes : '', s.observation.notes ? '관찰: ' + s.observation.notes : ''].filter(Boolean).join(' / '))}</td>
      </tr>` : ''}
    </tbody>
  </table>

  <div class="record-edit-bar no-print" style="margin:8px 0;">
    ${btn('✏️ 관찰·평가 항목 수정', 'edit-record', id, 'care-btn-outline')}
  </div>

  <form id="journalForm" data-id="${id}">
    <div class="journal-toolbar no-print">
      <span class="journal-label">🤖 육하원칙 5W1H 일지 양식 선택</span>
      <div class="journal-format-buttons">
        <button type="button" class="care-btn-sm" data-action="generate-format" data-format="5w1h_standard" data-session="${id}">📋 표준 5W1H</button>
        <button type="button" class="care-btn-sm" data-action="generate-format" data-format="5w1h_narrative" data-session="${id}">📝 서술형 5W1H</button>
        <button type="button" class="care-btn-sm" data-action="generate-format" data-format="simple" data-session="${id}">⚡ 간편 요약</button>
        <button type="button" class="care-btn-sm copy-btn" data-action="copy-journal" title="클립보드에 일지 복사">📋 일지 복사</button>
      </div>
    </div>

    <!-- 일지 본문 영역 -->
    <div class="journal-body-box">
      <label class="care-field full" style="margin-bottom:0;">
        <span class="no-print" style="font-weight:700; color:#4E3629; margin-bottom:4px; display:inline-block;">3. 육하원칙(5W1H) 업무수행 일지 상세 내용:</span>
        <textarea name="aiReport" rows="11" class="journal-textarea">${esc(currentReport)}</textarea>
      </label>
    </div>
    
    <div class="print-official-footer">
      <p>위와 같이 AI 디지털 학교 인지돌봄 활동 업무를 성실히 수행하였음을 확인합니다.</p>
      <div class="print-sign-row">
        <span>작성일자: ${esc(s.date)}</span>
        <span>작성자(사회복지사): _______________ (인/서명)</span>
      </div>
    </div>

    <div class="care-actions no-print" style="margin-top:12px;">
      ${btn('🔄 5W1H 일지 다시 생성', 'generate', id)}
      ${btn('✏️ 본문 수정', 'edit-journal')}
      <button type="submit" class="care-btn primary">💾 검토 완료 · 일지 저장</button>
    </div>
  </form>
  ${printButtons()}
</div>`);
}

function editRecord(id){const s=db.sessions.find(s=>s.session_id===id);modal('관찰 · 평가 수정',`<form id="recordEditForm" data-id="${id}">${choices('참여도','participation',['적극적','보통','소극적','거부'],s.observation.participation)}${choices('집중도','focus',['높음','보통','낮음'],s.evaluation.focus)}${choices('활동 수행도','performance',['독립 수행','부분 도움','많은 도움'],s.evaluation.performance)}${area('사회복지사 관찰 메모','notes',s.observation.notes)}<p>수정 후 기존 일지는 재검토가 필요합니다.</p><button class="care-btn primary">수정 저장</button></form>`);}
function scoped(){const cutoff=new Date();cutoff.setMonth(cutoff.getMonth()-Number(period));return records(person).filter(s=>new Date(s.createdAt)>=cutoff);}
function analysis(){const list=person?scoped().reverse():[],metrics=[['집중도',s=>({높음:3,보통:2,낮음:1}[s.evaluation.focus])],['수행능력',s=>({'독립 수행':3,'부분 도움':2,'많은 도움':1}[s.evaluation.performance])],['참여도',s=>({'적극적':3,'보통':2,'소극적':1,'거부':0}[s.observation.participation])],['정서 반응',s=>s.observation.emotion?.some(e=>['웃음','즐거움','관심'].includes(e))?1:0],['의사소통',s=>({'자발적으로 대화함':3,'질문에 대답함':2,'단답형 반응':1,'반응이 거의 없음':0}[s.observation.communication])]];return heading('변화 분석','관찰값의 흐름을 확인합니다. 진단이나 임상 평가 점수가 아닙니다.',printButtons())+`<div class="care-filters no-print">${selectPerson()}<label class="care-field">분석 기간<select id="carePeriod">${[1,3,6].map(n=>`<option ${period==n?'selected':''} value="${n}">최근 ${n}개월</option>`).join('')}</select></label></div>${list.length?`<p>총 ${list.length}회 참여 · 출석일 ${new Set(list.map(s=>s.date)).size}일</p><p class="care-note">과거 수업 일정 데이터가 없어 참여율은 계산하지 않습니다. 활동 시간과 집중 시간은 구분합니다.</p><div class="care-grid">${metrics.map(([name,get])=>`<article class="care-card"><h2>${name} 변화</h2><div class="care-chart" role="img" aria-label="${name} 날짜별 추이">${list.map(s=>`<div><span style="height:${12+(get(s)||0)*27}px" title="${esc(s.date)}: ${get(s)}"></span><small>${esc(s.date.slice(5))}<br>${get(s)}</small></div>`).join('')}</div><small>${name==='정서 반응'?'1 = 긍정 반응 관찰 / 0 = 긍정 반응 미기록':'0~3 단계 · 높을수록 적극적 / 독립적 반응'}</small></article>`).join('')}</div><article class="care-card"><h2>다음 수업 추천</h2>${recommend(list)}</article>`:'<div class="care-card">대상자를 선택해주세요. 저장된 수업이 있으면 변화가 표시됩니다.</div>'}`;}
function recommend(list){const best=[...list].sort((a,b)=>({높음:3,보통:2,낮음:1}[b.evaluation.focus])-({높음:3,보통:2,낮음:1}[a.evaluation.focus]))[0];return `<p>기록 기반 추천: ${esc(best.program)} 활동에서 집중도 '${esc(best.evaluation.focus)}'이 기록되었습니다. 최근 평가의 '${esc(list.at(-1).evaluation.next)}' 의견을 함께 확인해주세요.</p>${btn('추천 수업 시작','begin',best.programId)}`;}

function syncPrograms(){window.LESSON_CATALOG=window.LESSON_CATALOG.filter(p=>!p.managed);for(const p of db.programs)window.LESSON_CATALOG.push({id:p.id,title:esc(p.title),icon:'🌱',managed:true,steps:[{aiMessage:esc(p.prompt),prompt:esc(p.prompt),options:[{text:'함께 해봤어요',emoji:'😊',feedback:'함께해주셔서 감사합니다.'}]}]});}
function admin(){return heading('관리자 설정','개인정보 및 기록관리',btn('어르신 등록','register'))+`<section class="care-card consent-dashboard-room"><h2>개인정보 및 동의 현황</h2>${db.elders.map(e=>`<p><b>${esc(e.name)}</b> · ${[0,1,2,3].map(i=>['개인정보','보호자','프로그램','사진'][i]+': '+(e['consent'+i]?'동의':'미동의')).join(' / ')} ${btn('동의 수정','register',e.elder_id)}</p>`).join('')||'<p>등록된 어르신이 없습니다.</p>'}</section><article class="care-card"><h2>기록 백업 및 복원</h2><p>이 브라우저에 저장됩니다. 기기 간 공유·서버 로그인·실시간 AI 연결은 아직 구성되지 않았습니다.</p>${btn('전체 기록 백업 (JSON)','backup')}<label class="care-field">JSON 백업 복원<input id="restoreFile" type="file" accept="application/json"></label></article><article class="care-card"><h2>프로그램 관리</h2><form id="programForm">${field('프로그램 이름','title','','text',true)}${field('난이도','difficulty','쉬움','text',true)}${area('활동 안내','prompt')}<button class="care-btn primary">프로그램 추가</button></form>${db.programs.map(p=>`<p>${esc(p.title)} ${btn('수정','program-edit',p.id)} ${btn('삭제','program-delete',p.id)}</p>`).join('')}</article>`;}
function reports(){return heading('보호자 보고서','월별 활동을 정리하고 담당자의 의견을 기록하세요.')+`<form id="reportForm"><div class="care-filters">${selectPerson()}${field('보고서 월','month',today().slice(0,7),'month',true)}</div>${area('사회복지사 종합 의견','opinion')}${area('다음 달 프로그램 계획','plan')}<label class="care-field">활동 사진 (사진 활용 동의 필요, 1MB 이하)<input type="file" name="photo" accept="image/png,image/jpeg"></label><button class="care-btn primary">보호자 보고서 생성 · 저장</button></form><h2>저장된 보고서</h2>${db.reports.filter(r=>!person||r.elder_id===person).map(r=>`<article class="care-card">${btn(esc(elder(r.elder_id)?.name)+' · '+esc(r.month),'report-detail',r.id)}</article>`).join('')}`;}
function reportDetail(id){const r=db.reports.find(x=>x.id===id);if(!r)return;const list=r.sessions||db.sessions.filter(s=>s.elder_id===r.elder_id&&s.date.startsWith(r.month));modal('보호자 보고서',`<article class="print-document"><h2>${esc(elder(r.elder_id)?.name)} · ${esc(r.month)}</h2><h3>이번 달 참여 프로그램 · 총 ${list.length}회</h3><p>${esc([...new Set(list.map(s=>s.program))].join(', '))||'참여 기록 없음'}</p><h3>즐거워했던 활동</h3><p>${esc([...new Set(list.filter(s=>s.observation?.emotion?.some(v=>['즐거움','웃음'].includes(v))).map(s=>s.program))].join(', '))||'관찰 기록 없음'}</p><h3>사회복지사 종합 의견</h3><p>${esc(r.opinion)}</p><h3>다음 달 계획</h3><p>${esc(r.plan)}</p>${r.photo&&/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(r.photo)?`<img class="report-photo" src="${r.photo}" alt="활동 사진">`:''}${printButtons()}</article>`);}

/* Requested monthly timetable: 2026-10 weekdays, 하루 2회 (오전 10:00~11:00, 오후 14:00~15:00) */
const REQUESTED_MONTH={month:'2026-10',morningTime:'10:00',afternoonTime:'14:00',key:'requested-2026-10-daily2-v1'};
function installRequestedMonth(force=false){
  const entries=MonthlySchool.build(REQUESTED_MONTH.month,REQUESTED_MONTH.morningTime,REQUESTED_MONTH.afternoonTime);
  commit(d=>{
    d.schedules||=[];
    d.appliedMonthPlans||=[];
    const hasPm = d.schedules.some(s=>s.id&&s.id.startsWith('monthplan-2026-10-')&&s.id.includes('-pm'));
    const needsUpdate = !d.appliedMonthPlans.includes(REQUESTED_MONTH.key);
    if(needsUpdate){
      d.schedules = d.schedules.filter(s=>{
        if(!s.id || !s.id.startsWith('monthplan-2026-10-')) return true;
        if(!s.id.includes('-am') && !s.id.includes('-pm')){
          return (d.sessions||[]).some(r=>r.schedule_id===s.id);
        }
        return true;
      });
      for(const s of entries){
        const idx=d.schedules.findIndex(x=>x.id===s.id);
        if(idx<0) d.schedules.push(s);
        // Existing schedules (including user edits and recorded lessons) retain their values.
      }
      if(!d.appliedMonthPlans.includes(REQUESTED_MONTH.key)){
        d.appliedMonthPlans.push(REQUESTED_MONTH.key);
      }
    }
  });
}
function monthPlanDetails(id){const s=(db.schedules||[]).find(x=>x.id===id);if(!s)return;let minutes=Number(s.time.slice(0,2))*60+Number(s.time.slice(3));const time=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');modal(esc(s.title),`<p>${esc(s.date)} · ${esc(s.time)}~${esc(s.endTime||'')} · 60분(1시간) 활동 + 10분 관찰·평가</p><p>${esc(s.notes)}</p><ol class="monthly-plan-list">${MonthlySchool.phases.map(p=>{const start=minutes;minutes+=p.minutes;return `<li><b>${time(start)}~${time(minutes)}</b> ${p.name} (${p.minutes}분)</li>`;}).join('')}<li><b>${time(minutes)}~${time(minutes+10)}</b> 사회복지사 관찰·평가 및 일지 확인 (10분)</li></ol><p class="care-note">주제를 순환하는 기본 추천 일정입니다. 실제 자유 대화 AI 연결 없이 콩이 음성 안내와 활동 질문으로 진행합니다. 참여와 진행 속도는 어르신의 상태에 맞춰 조절하세요.</p>${btn('수업 시작 · 대상자 선택','schedule-start',s.id,'primary')}`);}
function groupParticipant(s){scheduleContext=s;pending=s.programId;modal('오늘 함께할 어르신 선택',`<p>${esc(s.title)} · ${esc(s.time)}~${esc(s.endTime)}</p><p>수업 전 상태를 확인한 뒤 60분(1시간) 활동을 시작합니다. 참여 기록은 어르신별로 저장됩니다.</p><div class="care-grid">${db.elders.map(e=>btn(esc(e.name)+(db.sessions.some(r=>r.schedule_id===s.id&&r.elder_id===e.elder_id)?' · 참여 기록 있음':''),'pre',e.elder_id)).join('')||'<p>먼저 어르신을 등록해주세요.</p>'}</div>${btn('어르신 등록','register')}`);}

let calendarMonth=today().startsWith('2026-10')?today().slice(0,7):'2026-10',calendarDay=today().startsWith('2026-10')?today():'2026-10-01',scheduleContext=null;
function scheduleDone(s){return !s.group&&db.sessions.some(r=>r.schedule_id===s.id);}
function calendar(){const [y,m]=calendarMonth.split('-').map(Number),offset=new Date(y,m-1,1).getDay(),count=new Date(y,m,0).getDate(),items=db.schedules||[],daily=items.filter(s=>s.date===calendarDay).sort((a,b)=>a.time.localeCompare(b.time));return `<section class="care-card school-calendar"><div class="care-heading"><div><h2>📅 수업 캘린더</h2><p>10월 평일 하루 2회 (오전 10:00~11:00 · 오후 14:00~15:00) · 콩이와 60분 활동 + 10분 관찰·평가</p></div>${btn('＋ 일정 등록','schedule-add',calendarDay)}</div><div class="care-actions">${btn('◀ 이전 달','calendar-month','-1')}<strong>${y}년 ${m}월</strong>${btn('다음 달 ▶','calendar-month','1')}${btn('오늘','calendar-today')}${btn('10월 추천 일정','requested-month')}</div><div class="calendar-grid">${['일','월','화','수','목','금','토'].map(d=>`<div class="calendar-weekday">${d}</div>`).join('')}${'<div></div>'.repeat(offset)}${Array.from({length:count},(_,i)=>{const date=calendarMonth+'-'+String(i+1).padStart(2,'0'),list=items.filter(s=>s.date===date).sort((a,b)=>a.time.localeCompare(b.time)),remaining=list.filter(s=>!scheduleDone(s)).length;return `<button class="calendar-day ${date===today()?'is-today':''} ${date===calendarDay?'is-selected':''}" data-action="calendar-day" data-value="${date}" aria-label="${date}, 수업 ${list.length}건"><b>${i+1}</b>${list.length?`<small class="calendar-day-info"><span class="calendar-count-badge">${list.length}건</span>${list.map(s=>{const isAm=s.time<'12:00',label=isAm?'오전':'오후',rawTitle=esc(s.title.replace(/60분 · |50분 · /g,'').replace(/\[(오전|오후)\]\s*/g,''));return `<span class="monthly-day-topic ${isAm?'is-am':'is-pm'}" title="${label} ${s.time}: ${rawTitle}"><b>${label}</b> ${rawTitle}</span>`;}).join('')}<span class="calendar-remaining-tag">${remaining?'예정 '+remaining:'모두 완료'}</span></small>`:''}</button>`;}).join('')}</div><h3 class="agenda-section-title"><span class="agenda-title-text">${calendarDay===today()?'오늘':esc(calendarDay)}의 수업</span><span class="agenda-badge-count">${daily.length}건</span></h3><div class="calendar-agenda">${daily.map(s=>`<article class="agenda-card"><div class="agenda-card-body"><div class="agenda-header-line"><span class="agenda-badge-time">🕒 ${esc(s.time)}${s.endTime?' ~ '+esc(s.endTime):''}</span><span class="agenda-badge-target ${s.group?'is-group':''}">${s.group?'👥 공통 프로그램 · 대상자 선택':(elder(s.elder_id)?.name||'대상자 없음')}</span><span class="agenda-badge-status ${scheduleDone(s)?'done':''}">${s.group?'참여 기록 '+db.sessions.filter(r=>r.schedule_id===s.id).length+'건':scheduleDone(s)?'✓ 수업 완료':s.date<today()?'미진행':s.date===today()&&s.time<new Date().toTimeString().slice(0,5)?'예정 시간 지남 · 미진행':'수업 예정'}</span></div><div class="agenda-card-title">${esc(s.title)}</div>${s.notes?`<div class="agenda-card-notes">💬 ${esc(s.notes)}</div>`:''}</div><div class="care-actions agenda-actions-bar">${scheduleDone(s)?btn('기록 보기','detail',db.sessions.find(r=>r.schedule_id===s.id).session_id):btn('수업 시작','schedule-start',s.id,'primary')}${s.group?btn('60분 구성 보기','month-plan-details',s.id):''}${btn('수정','schedule-edit',s.id)}${btn('삭제','schedule-delete',s.id,'care-btn-danger')}</div></article>`).join('')||'<div class="agenda-empty-state"><p>등록된 수업이 없습니다. 날짜를 선택하고 일정을 추가해주세요.</p></div>'}</div><div class="agenda-footer-info"><span class="info-icon">💡</span><span>10월 추천 일정(하루 2회: 오전 10:00 / 오후 14:00)이 등록되어 있습니다. <b>오늘</b> 버튼으로 당일 일정을 확인하세요. (앱 종료 후 푸시 알림은 제공하지 않습니다.)</span></div></section>`;}
function scheduleForm(id,date){const s=(db.schedules||[]).find(s=>s.id===id)||{};modal(id?'수업 일정 수정':'수업 일정 등록',`<form id="scheduleForm" data-id="${esc(id||'')}"><div class="care-form-grid">${field('수업 날짜','date',s.date||date||today(),'date',true)}${field('수업 시간','time',s.time||'10:00','time',true)}<label class="care-field">어르신 *<select name="elder_id" ${s.group?'': 'required'}><option value="">${s.group?'공통 프로그램 · 시작 시 대상자 선택':'선택해주세요'}</option>${db.elders.map(e=>`<option value="${e.elder_id}" ${e.elder_id===s.elder_id?'selected':''}>${esc(e.name)}</option>`).join('')}</select></label><label class="care-field">프로그램 *<select name="programId" required>${window.LESSON_CATALOG.map(p=>`<option value="${p.id}" ${p.id===s.programId?'selected':''}>${esc(db.programs.find(x=>x.id===p.id)?.title||p.title)}</option>`).join('')}</select></label></div>${area('준비물 · 전달사항','notes',s.notes)}<button class="care-btn primary">일정 저장</button></form>`);}
function refreshCalendar(){const node=document.querySelector('.school-calendar');if(node)node.outerHTML=calendar();}

const originalStart=LessonEngine.startLesson.bind(LessonEngine),originalExit=LessonEngine.exitLesson.bind(LessonEngine);
let previewLessonId=null;
LessonEngine.startLesson=id=>{
  if(!window.LESSON_CATALOG.some(p=>p.id===id))return;
  if(active){alert('진행 중인 기록 수업을 먼저 마치거나 나가기를 눌러주세요.');return;}
  // Home cards are unassigned learning previews: never invent a person or health observations.
  previewLessonId=id;
  scheduleContext=null;
  close();
  originalStart(id);
};
LessonEngine.finishLessonAndSave=()=>{
  if(active){evaluate();return;}
  if(!previewLessonId)return;
  const id=previewLessonId;
  originalExit();
  modal('함께해주셔서 감사합니다.', '<p>자유 체험을 마쳤습니다. 어르신별 돌봄 기록에는 저장하지 않았습니다.</p><p>기록을 남기려면 대상자와 수업 전 상태를 확인하고 시작해주세요.</p>'+btn('대상자 선택 후 기록 수업 시작','begin',id,'primary')+btn('닫기','close'));
  previewLessonId=null;
};
LessonEngine.exitLesson=()=>{if(active&&!confirm('진행 중인 수업을 종료할까요? 저장하지 않은 관찰과 평가는 사라집니다.'))return;active=null;previewLessonId=null;originalExit();};

window.CareAutomationBridge={
 getActive:()=>active?structuredClone(active):null,
 getData:()=>load(), getPerson:()=>person, begin,
 save:commit, draft, show:modal, close, detail, go,
 updateActive:patch=>{if(active)Object.assign(active,patch)},
 resume:s=>{if(active)return false;active=structuredClone(s.active);setActivePerson(active.elder_id);previewLessonId=null;close();originalStart(active.programId);LessonEngine.startTime=Date.now();LessonEngine.currentStepIndex=s.step;LessonEngine.selectedAnswers=s.answers||{};LessonEngine.renderCurrentStep();return true},
 finish:()=>{active=null;previewLessonId=null;originalExit();close();go('records')}
};
document.addEventListener('DOMContentLoaded',()=>{
try{db=load(); setActivePerson(getActivePerson(db.elders));}catch(e){alert('관리 데이터를 읽지 못했습니다. 데이터를 지우지 않고 중단합니다. '+e.message);return;}
syncPrograms();MonthlySchool.install();installRequestedMonth();$('main.main-wrapper').insertAdjacentHTML('afterbegin','<section id="careRoot" class="care-root" style="display:none;"></section>');document.body.insertAdjacentHTML('beforeend','<dialog id="careDialog" class="care-dialog"></dialog><div id="careToast" role="status" aria-live="polite"></div>');
$('#careDialog').addEventListener('close',()=>{if(active&&!active.program)active=null;});
$('.site-header').insertAdjacentHTML('beforeend',`<nav class="care-nav" aria-label="프로그램 관리" style="display:none;">${[['home','어르신 홈'],['dashboard','대시보드'],['elders','어르신 관리'],['lessons','오늘의 AI 수업'],['records','수업 기록'],['journals','AI 수업일지'],['analysis','변화 분석'],['reports','보호자 보고서'],['admin','관리자 설정']].map(([id,label])=>btn(label,'nav',id)).join('')}</nav>`);
$('.lesson-bottom-nav').insertAdjacentHTML('afterbegin',`${btn('관찰 기록','observe')}${btn('다시 보기','replay')}${btn('도움 받기','help')}`);
document.querySelectorAll('.lesson-card').forEach(c=>c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();LessonEngine.startLesson(c.dataset.lessonId);}}));
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{if(['home','lessons'].includes(a.dataset.target))go('home');}));
$('#btnTeacherSpace')?.addEventListener('click',()=>{go('dashboard');});
$('#btnHeaderJournal')?.addEventListener('click',()=>{go('journals');});
$('#btnHeroHistory')?.addEventListener('click',()=>{go('records');});
$('#btnFloatingAdmin')?.addEventListener('click',()=>{go('admin');});
document.addEventListener('click',event=>{const b=event.target.closest('[data-action]');if(!b)return;const id=b.dataset.value;
const actions={
  nav:()=>go(id),
  'new-journal':()=>newJournalModal(),
  register:()=>register(id),
  begin:()=>begin(id),
  pre:()=>pre(id),
  close,
  launch:()=>{if(!active)return;const p=window.LESSON_CATALOG.find(l=>l.id===id);if(!p)return;active.program=db.programs.find(x=>x.id===id)?.title||p.title;active.programId=id;if(scheduleContext&&id!==scheduleContext.programId)active.schedule_id=null;active.startedAt=Date.now();close();originalStart(id);active.difficulty=window.SchoolDifficulty?.apply(id)||'콘텐츠 기본';},
  observe:observation,
  evaluate,
  replay:()=>LessonEngine.renderCurrentStep(),
  help:()=>{LessonEngine.needsAssistance='도움 요청';VoiceManager.speak('괜찮아요. 선생님과 함께 천천히 해보아요.');$('#careToast').textContent='선생님과 함께 천천히 해보아요.';setTimeout(()=>$('#careToast').textContent='',5000);},
  detail:()=>detail(id),
  'edit-record':()=>editRecord(id),
  'elder-records':()=>{setActivePerson(id);close();go('records');},
  generate:()=>{const s=db.sessions.find(s=>s.session_id===id),f=$('#journalForm');if(!s||!f)return;if(f.elements.aiReport.value&&!confirm('현재 일지 내용을 육하원칙(5W1H) 기본 초안으로 다시 생성할까요?'))return;f.elements.aiReport.value=draft(s,'5w1h_standard');$('#careToast').textContent='✨ 육하원칙(5W1H) 표준 일지가 자동 생성되었습니다.';setTimeout(()=>$('#careToast').textContent='',3500);},
  'generate-format':()=>{const fmt=b.dataset.format||'5w1h_standard',sessId=b.dataset.session,s=db.sessions.find(s=>s.session_id===sessId),f=$('#journalForm');if(!s||!f)return;if(f.elements.aiReport.value&&!confirm('선택하신 양식('+ (fmt==='5w1h_narrative'?'서술형':fmt==='simple'?'간편형':'표준 5W1H') +')으로 내용을 바꿀까요?'))return;f.elements.aiReport.value=draft(s,fmt);$('#careToast').textContent=`✨ ${fmt==='5w1h_narrative'?'서술형':fmt==='simple'?'간편 요약':'표준 5W1H'} 양식으로 변경되었습니다.`;setTimeout(()=>$('#careToast').textContent='',3500);},
  'copy-journal':()=>{const f=$('#journalForm'),val=f?.elements?.aiReport?.value||'';if(!val.trim()){alert('복사할 일지 내용이 없습니다.');return;}navigator.clipboard.writeText(val).then(()=>{const toast=$('#careToast');if(toast){toast.textContent='📋 육하원칙 일지가 클립보드에 복사되었습니다. (Ctrl+V로 붙여넣기 가능)';setTimeout(()=>toast.textContent='',4000);}}).catch(()=>{f.elements.aiReport.select();document.execCommand('copy');alert('📋 일지 내용이 복사되었습니다.');});},
  'edit-journal':()=>$('[name="aiReport"]').focus(),
  print:()=>window.print(),
  legacy:()=>openTeacherModal(),
  'report-detail':()=>reportDetail(id),
  backup:()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(db,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='digital-school-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
  'program-delete':()=>{if(confirm('이 프로그램을 삭제할까요? 기존 수업 기록은 보존됩니다.')&&commit(d=>{d.programs=d.programs.filter(p=>p.id!==id);})){syncPrograms();go('admin');}},
  'program-edit':()=>{const p=db.programs.find(p=>p.id===id);modal('프로그램 수정',`<form id="programForm" data-id="${id}">${field('프로그램 이름','title',p.title,'text',true)}${field('난이도','difficulty',p.difficulty,'text',true)}${area('활동 안내','prompt',p.prompt)}<button class="care-btn primary">수정 저장</button></form>`);},
  'month-plan-details':()=>monthPlanDetails(b.dataset.value),
  'requested-month':()=>{installRequestedMonth();calendarMonth=REQUESTED_MONTH.month;calendarDay=calendarMonth+'-01';refreshCalendar();},
  'calendar-month':()=>{const [y,m]=calendarMonth.split('-').map(Number),d=new Date(y,m-1+Number(id),1);calendarMonth=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');calendarDay=calendarMonth+'-01';refreshCalendar();},
  'calendar-today':()=>{calendarDay=today();calendarMonth=calendarDay.slice(0,7);refreshCalendar();},
  'calendar-day':()=>{calendarDay=id;refreshCalendar();},
  'schedule-add':()=>scheduleForm('',id),
  'schedule-edit':()=>{if(scheduleDone((db.schedules||[]).find(s=>s.id===id))){alert('완료된 일정은 연결 기록을 보존하기 위해 수정할 수 없습니다.');return;}scheduleForm(id);},
  'schedule-delete':()=>{if(confirm('이 수업 일정을 삭제할까요? 이미 저장된 수업 기록은 유지됩니다.')&&commit(d=>{d.schedules=(d.schedules||[]).filter(s=>s.id!==id);})){go(page);}},
  'schedule-start':()=>{const s=(db.schedules||[]).find(s=>s.id===id);if(active){alert('진행 중인 수업을 먼저 마쳐주세요.');return;}if((!s.group&&!elder(s.elder_id))||!window.LESSON_CATALOG.some(p=>p.id===s.programId)){alert('대상자 또는 프로그램을 확인하고 일정을 수정해주세요.');return;}if(s.date!==today()){alert('해당 날짜의 수업입니다. 오늘 진행하려면 일정 날짜를 수정해주세요.');return;}if(s.group){groupParticipant(s);return;}scheduleContext=s;pending=s.programId;pre(s.elder_id);}
};
actions[b.dataset.action]?.();
});

document.addEventListener('submit',async event=>{
const f=event.target;if(!['elderForm','preForm','observationForm','evaluationForm','journalForm','reportForm','programForm','recordEditForm','quickJournalForm','directJournalForm','scheduleForm'].includes(f.id))return;event.preventDefault();const data=Object.fromEntries(new FormData(f));
if(f.id==='scheduleForm'){
  const p=window.LESSON_CATALOG.find(p=>p.id===data.programId);
  const existing=(db.schedules||[]).find(x=>x.id===f.dataset.id);
  if(!p||(!existing?.group&&!elder(data.elder_id)))return;
  const s={...existing,...data,group:existing?.group&&!data.elder_id,id:f.dataset.id||uid(),title:db.programs.find(x=>x.id===p.id)?.title||p.title};
  if(s.group){const n=Number(s.time.slice(0,2))*60+Number(s.time.slice(3))+60;s.endTime=String(Math.floor(n/60)%24).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
  if((db.schedules||[]).some(x=>x.id!==s.id&&x.date===s.date&&x.time===s.time&&x.elder_id===s.elder_id)){alert('같은 어르신의 같은 시간에 이미 수업이 등록되어 있습니다.');return;}
  if(commit(d=>{d.schedules||=[];const i=d.schedules.findIndex(x=>x.id===s.id);if(i<0)d.schedules.push(s);else d.schedules[i]=s;})){calendarDay=s.date;calendarMonth=s.date.slice(0,7);close();go('home');}
}
else if(f.id==='quickJournalForm'||f.id==='directJournalForm'){
  if(!data.elder_id){alert('대상 어르신을 선택해주세요.');return;}
  if(!data.aiReport?.trim()){alert('일지 내용을 입력하거나 자동 생성을 실행해주세요.');return;}
  const durationSec = (Number(data.duration) || 20) * 60;
  const newSession = {
    session_id: uid(),
    elder_id: data.elder_id,
    date: data.date || today(),
    program: data.program || 'AI 인지활동',
    durationSeconds: durationSec,
    pre: { mood: '미기록', health: '미기록', willingness: '미기록', notes: '' },
    observation: { participation: '미기록', focus: '미기록', performance: '미기록', emotion: [], communication: '미기록', behavior: [], notes: '' },
    evaluation: { satisfaction: '미기록', focus: '미기록', performance: '미기록', next: '미기록' },
    answers: {},
    aiReport: data.aiReport,
    reviewed: true,
    createdAt: new Date().toISOString()
  };
  if(commit(d=>{ d.sessions.unshift(newSession); })){
    if(f.id==='directJournalForm') close();
    const toast = $('#careToast');
    if(toast){ toast.textContent = '💾 업무수행 일지가 성공적으로 저장되었습니다!'; setTimeout(()=>toast.textContent='', 4000); }
    go('journals');
  }
}
else if(f.id==='elderForm'){if(!data.name.trim()){f.elements.name.focus();return;}if(data.birth&&data.birth>today()){alert('생년월일은 오늘 이후일 수 없습니다.');return;}if(Number(data.attention)<0){alert('집중 가능 시간은 0 이상이어야 합니다.');return;}const id=f.dataset.id||uid(),item={...elder(id),...data,name:data.name.trim(),elder_id:id};for(let i=0;i<4;i++)item['consent'+i]=!!data['consent'+i];if(commit(d=>{const index=d.elders.findIndex(e=>e.elder_id===id);if(index<0)d.elders.push(item);else d.elders[index]=item;})){setActivePerson(id);close();go('elders');}}
else if(f.id==='preForm'){if(data.willingness==='거부'){alert('참여를 거부하셨습니다. 수업을 시작하지 않고 쉬실 수 있도록 도와주세요.');return;}active={schedule_id:scheduleContext?.id||null,session_id:uid(),elder_id:f.dataset.id,pre:data,observation:{},createdAt:new Date().toISOString(),date:today()};if(scheduleContext?.group){modal('60분 활동 준비',`<h3>${esc(scheduleContext.title)}</h3><p>인사 5분 → 회상 15분 → 주제 활동 20분 → 표현 15분 → 마무리 5분</p>${btn('콩이와 60분 활동 시작','launch',scheduleContext.programId,'primary')}`);}else if(pending){const targetId=pending;pending=null;const p=window.LESSON_CATALOG.find(l=>l.id===targetId);if(p){active.program=db.programs.find(x=>x.id===targetId)?.title||p.title;active.programId=targetId;active.startedAt=Date.now();close();originalStart(targetId);active.difficulty=window.SchoolDifficulty?.apply(targetId)||'콘텐츠 기본';}else{programs();}}else programs();}
else if(f.id==='observationForm'){const fd=new FormData(f),behavior=fd.getAll('behavior');if(behavior.includes('없음')&&behavior.length>1){alert('특이 행동의 없음은 단독으로 선택해주세요.');return;}active.observation={...data,emotion:fd.getAll('emotion'),behavior};close();}
else if(f.id==='evaluationForm'){if(!active)return;const session={...active,monthlyTracking:MonthlySchool.getTracking(),plannedMinutes:LessonEngine.currentLesson?.plannedMinutes||null,evaluation:data,durationSeconds:Math.round((Date.now()-active.startedAt)/1000),answers:{...LessonEngine.selectedAnswers},aiReport:'',reviewed:false};session.aiReport=draft(session,'5w1h_standard');if(commit(d=>{if(!d.sessions.some(s=>s.session_id===session.session_id))d.sessions.push(session);})){active=null;originalExit();close();go('records');detail(session.session_id);}}
else if(f.id==='journalForm'){if(!data.aiReport.trim()){alert('초안을 작성하거나 수업일지를 입력해주세요.');return;}if(commit(d=>{const s=d.sessions.find(s=>s.session_id===f.dataset.id);s.aiReport=data.aiReport;s.reviewed=true;s.updatedAt=new Date().toISOString();})){close();go('journals');}}
else if(f.id==='recordEditForm'){const id=f.dataset.id;if(commit(d=>{const s=d.sessions.find(s=>s.session_id===id);s.observation.participation=data.participation;s.observation.notes=data.notes;s.evaluation.focus=data.focus;s.evaluation.performance=data.performance;s.reviewed=false;s.updatedAt=new Date().toISOString();})){detail(id);}}
else if(f.id==='programForm'){const p={...data,id:f.dataset.id||uid()};if(!p.prompt.trim()||!p.title.trim()){alert('프로그램 이름과 활동 안내를 입력해주세요.');return;}if(commit(d=>{const i=d.programs.findIndex(x=>x.id===p.id);if(i<0)d.programs.push(p);else d.programs[i]=p;})){syncPrograms();close();go('admin');}}
else if(f.id==='reportForm'){if(!person){alert('어르신을 선택해주세요.');return;}const r={id:uid(),elder_id:person,month:data.month,opinion:data.opinion,plan:data.plan,photo:'',sessions:db.sessions.filter(s=>s.elder_id===person&&s.date.startsWith(data.month))},file=f.elements.photo.files[0];if(file){if(!elder(person).consent3){alert('사진 활용 동의를 먼저 확인해주세요.');return;}if(file.size>1024*1024||!['image/png','image/jpeg'].includes(file.type)){alert('1MB 이하의 PNG 또는 JPEG 사진을 선택해주세요.');return;}try{r.photo=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}catch{alert('사진을 읽지 못했습니다.');return;}}if(commit(d=>d.reports.push(r))){go('reports');reportDetail(r.id);}}
});
document.addEventListener('input',e=>{if(e.target.id==='elderSearch')$('#elderCards').innerHTML=elderCards(e.target.value);if(e.target.id==='recordSearch'||e.target.name==='recordDate')filterRecords();});
document.addEventListener('change',async e=>{if(e.target.id==='carePerson'){setActivePerson(e.target.value);go(page);}if(e.target.id==='carePeriod'){period=Number(e.target.value);go('analysis');}if(e.target.dataset.schedule){const id=e.target.dataset.schedule;if(!commit(d=>{d.elders.find(x=>x.elder_id===id).scheduleDate=e.target.checked?today():'';}))e.target.checked=!e.target.checked;}if(e.target.id==='restoreFile'){try{const file=e.target.files[0];if(!file)return;const imported=JSON.parse(await file.text());validateImport(imported);if(!confirm('백업의 새 기록을 현재 기록에 추가할까요?'))return;if(commit(d=>{for(const [key,id] of [['elders','elder_id'],['sessions','session_id'],['reports','id'],['programs','id'],['schedules','id']])for(const item of imported[key]||[])if(!d[key].some(x=>x[id]===item[id]))d[key].push(item);})){syncPrograms();go('admin');alert('백업을 복원했습니다.');}}catch(err){alert('복원 실패: '+err.message);}}});
window.addEventListener('storage',e=>{if(e.key===KEY){try{db=load();if(!$('#careDialog').open)go(page);}catch{}}});window.addEventListener('beforeunload',e=>{if(active){e.preventDefault();e.returnValue='';}});
window.addEventListener('beforeprint',()=>{document.querySelectorAll('textarea').forEach(t=>{const p=document.createElement('p');p.className='printed-text';p.textContent=t.value;t.after(p);});});window.addEventListener('afterprint',()=>document.querySelectorAll('.printed-text').forEach(p=>p.remove()));go('home');
});
function filterRecords(){const date=$('[name="recordDate"]').value,q=$('#recordSearch').value;$('#careRecordList').innerHTML=recordList(records(person).filter(s=>(!date||s.date===date)&&s.program.includes(q)));}
function validateImport(data){data.schedules ||= [];if(data.schedules.some(s=>typeof s.date!=="string"||typeof s.time!=="string"||typeof s.title!=="string"||typeof s.elder_id!=="string"))throw Error("일정 형식 오류");for(const [key,id]of [['elders','elder_id'],['sessions','session_id'],['reports','id'],['programs','id'],['schedules','id']]){if(!Array.isArray(data[key]))throw Error('백업 형식 오류: '+key);for(const item of data[key])if(typeof item[id]!=='string'||!/^[a-zA-Z0-9_-]+$/.test(item[id]))throw Error('고유 ID 형식 오류');}if(data.elders.some(e=>typeof e.name!=='string'))throw Error('이름 형식 오류');if(data.programs.some(p=>typeof p.title!=='string'||typeof p.prompt!=='string'))throw Error('프로그램 형식 오류');if(data.sessions.some(s=>!s.pre||!s.observation||!s.evaluation||typeof s.createdAt!=='string'||typeof s.date!=='string'||typeof s.program!=='string'||!Array.isArray(s.observation.emotion)||!Array.isArray(s.observation.behavior)||![...db.elders,...data.elders].some(e=>e.elder_id===s.elder_id)))throw Error('수업 기록 관계 오류');if(data.reports.some(r=>(r.photo&&!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(r.photo))||typeof r.month!=='string'))throw Error('보고서 형식 오류');}
})();






