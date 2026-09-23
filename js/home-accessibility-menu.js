/* Reuse existing controls and persisted settings; no second voice state. */
document.addEventListener('DOMContentLoaded',()=>{
  const header=document.querySelector('.header-container'),actions=header?.querySelector('.header-actions');
  if(!actions)return;
  document.body.classList.add('simple-header');
  const panel=document.createElement('section');panel.id='viewSettingsPanel';panel.hidden=true;panel.setAttribute('aria-label','보기 편하게');
  panel.innerHTML='<h2>보기 편하게</h2><div class="view-settings-buttons"></div><button type="button" class="view-close">닫기</button>';
  document.querySelector('.site-header').append(panel);
  const options=panel.querySelector('.view-settings-buttons');
  const view=document.createElement('button');view.id='btnViewSettings';view.type='button';view.textContent='Aa 보기 편하게';view.setAttribute('aria-controls',panel.id);view.setAttribute('aria-expanded','false');
  const toggle=open=>{panel.hidden=!open;view.setAttribute('aria-expanded',String(open));if(open)options.querySelector('button')?.focus();else view.focus();};
  view.onclick=()=>toggle(panel.hidden);panel.querySelector('.view-close').onclick=()=>toggle(false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)toggle(false);});
  const basic=document.createElement('button');basic.type='button';basic.textContent='A 기본 글씨';basic.onclick=()=>{applyFontSize('normal');paint();};options.append(basic);
  ['btnFontSize','btnVoiceSpeed','btnHighContrast'].forEach(id=>{const b=document.getElementById(id);if(b)options.append(b);});
  const sound=document.getElementById('btnTtsToggle'),help=document.getElementById('btnVoiceHelp'),teacher=document.getElementById('btnTeacherSpace');
  help.textContent='❓ 도움';
  const helpPanel=document.createElement('p');helpPanel.id='headerHelpText';helpPanel.hidden=true;helpPanel.textContent='친구를 누르면 활동방으로 이동해요. 보기에서 글씨와 소리를 조절할 수 있어요. 어려우면 선생님께 도움을 요청해주세요.';helpPanel.setAttribute('role','status');document.querySelector('.site-header').append(helpPanel);
  help.setAttribute('aria-controls',helpPanel.id);help.setAttribute('aria-expanded','false');help.addEventListener('click',()=>{helpPanel.hidden=!helpPanel.hidden;help.setAttribute('aria-expanded',String(!helpPanel.hidden));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!helpPanel.hidden){helpPanel.hidden=true;help.setAttribute('aria-expanded','false');help.focus();}});
  const home=document.createElement('button');home.type='button';home.textContent='🏠 홈';home.dataset.seniorPage='home';
  actions.classList.add('senior-common-nav');actions.setAttribute('role','navigation');actions.setAttribute('aria-label','어르신 공통 메뉴');
  actions.append(home,sound,view,help,teacher);
  const moreSummary=document.querySelector('#homeMoreOptions>summary');if(moreSummary)moreSummary.textContent='전체 활동';
  const logo=header.querySelector('.brand-logo');logo.setAttribute('aria-label','홈 · 디지털 AI 학교');logo.title='홈으로';
  // Existing activity toolbars already provide pause/replay. Keep legacy IDs available.
  document.getElementById('teacherVoiceControls').hidden=true;
  document.getElementById('btnHeaderCharHouse').hidden=true;
  document.querySelectorAll('.main-nav [href="character-house.html"]').forEach(a=>a.hidden=true);
  function paint(){const muted=!!window.VoiceManager?.isMuted;document.getElementById('textVoiceToggle').textContent=muted?'소리 꺼짐':'소리 켜짐';sound.setAttribute('aria-pressed',String(!muted));sound.setAttribute('aria-label',muted?'소리 켜기':'소리 끄기');basic.setAttribute('aria-pressed',String(!document.body.classList.contains('font-scale-large')&&!document.body.classList.contains('font-scale-xlarge')));document.getElementById('btnVoiceSpeed').setAttribute('aria-pressed',String(window.VoiceManager?.speedMode==='slow'));document.getElementById('btnHighContrast').setAttribute('aria-pressed',String(document.body.classList.contains('high-contrast-mode')));}
  const original=window.updateGlobalVoiceUI;window.updateGlobalVoiceUI=(...args)=>{original?.(...args);paint();};
  const previousPaint=paint;
  const labels=()=>{previousPaint();document.getElementById('textVoiceToggle').textContent='소리';document.getElementById('textFontSize').textContent='큰 글씨';document.getElementById('textVoiceSpeed').textContent='천천히 듣기';};
  const update=window.updateGlobalVoiceUI;window.updateGlobalVoiceUI=(...args)=>{update?.(...args);labels();};
  actions.addEventListener('click',()=>queueMicrotask(labels));options.addEventListener('click',()=>queueMicrotask(labels));labels();
  if(location.hash==='#teacher')queueMicrotask(()=>teacher.click());
});
