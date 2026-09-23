/* Reuse existing controls and persisted settings; no second voice state. */
document.addEventListener('DOMContentLoaded',()=>{
  const header=document.querySelector('.header-container'),actions=header?.querySelector('.header-actions');
  if(!actions)return;
  document.body.classList.add('simple-header');
  const panel=document.createElement('section');panel.id='viewSettingsPanel';panel.hidden=true;panel.setAttribute('aria-label','보기 편하게');
  panel.innerHTML='<h2>보기 편하게</h2><div class="view-settings-buttons"></div><button type="button" class="view-close">닫기</button>';
  document.querySelector('.site-header').append(panel);
  const options=panel.querySelector('.view-settings-buttons');
  const view=document.createElement('button');view.id='btnViewSettings';view.type='button';view.textContent='Aa 보기';view.setAttribute('aria-controls',panel.id);view.setAttribute('aria-expanded','false');
  const toggle=open=>{panel.hidden=!open;view.setAttribute('aria-expanded',String(open));if(open)options.querySelector('button')?.focus();else view.focus();};
  view.onclick=()=>toggle(panel.hidden);panel.querySelector('.view-close').onclick=()=>toggle(false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)toggle(false);});
  const basic=document.createElement('button');basic.type='button';basic.textContent='A 기본 글씨';basic.onclick=()=>{applyFontSize('normal');paint();};options.append(basic);
  ['btnFontSize','btnVoiceSpeed','btnHighContrast'].forEach(id=>{const b=document.getElementById(id);if(b)options.append(b);});
  const sound=document.getElementById('btnTtsToggle'),help=document.getElementById('btnVoiceHelp'),teacher=document.getElementById('btnTeacherSpace');
  help.textContent='❓ 도움';
  const helpPanel=document.createElement('p');helpPanel.id='headerHelpText';helpPanel.hidden=true;helpPanel.textContent='친구를 누르면 활동방으로 이동해요. 보기에서 글씨와 소리를 조절할 수 있어요. 어려우면 선생님께 도움을 요청해주세요.';helpPanel.setAttribute('role','status');document.querySelector('.site-header').append(helpPanel);
  help.setAttribute('aria-controls',helpPanel.id);help.setAttribute('aria-expanded','false');help.addEventListener('click',()=>{helpPanel.hidden=!helpPanel.hidden;help.setAttribute('aria-expanded',String(!helpPanel.hidden));});
  const more = document.querySelector('#homeMoreOptions .home-more-actions');
  if (more) {
    const placeTools = () => {
      const onHome = document.body.dataset.seniorPage === 'home';
      (onHome ? more : actions).append(sound,view,help);
      if (onHome) more.after(panel,helpPanel);
      else document.querySelector('.site-header').append(panel,helpPanel);
      actions.append(teacher);
      panel.hidden = true; helpPanel.hidden = true;
      view.setAttribute('aria-expanded','false'); help.setAttribute('aria-expanded','false');
    };
    placeTools();
    new MutationObserver(placeTools).observe(document.body,{attributes:true,attributeFilter:['data-senior-page']});
  } else actions.append(sound,view,help,teacher);
  const logo=header.querySelector('.brand-logo');logo.setAttribute('aria-label','홈 · 디지털 AI 학교');logo.title='홈으로';
  // Existing activity toolbars already provide pause/replay. Keep legacy IDs available.
  document.getElementById('teacherVoiceControls').hidden=true;
  document.getElementById('btnHeaderCharHouse').hidden=true;
  document.querySelectorAll('.main-nav [href="character-house.html"]').forEach(a=>a.hidden=true);
  function paint(){const muted=!!window.VoiceManager?.isMuted;document.getElementById('textVoiceToggle').textContent=muted?'소리 꺼짐':'소리 켜짐';sound.setAttribute('aria-pressed',String(!muted));sound.setAttribute('aria-label',muted?'소리 켜기':'소리 끄기');basic.setAttribute('aria-pressed',String(!document.body.classList.contains('font-scale-large')&&!document.body.classList.contains('font-scale-xlarge')));document.getElementById('btnVoiceSpeed').setAttribute('aria-pressed',String(window.VoiceManager?.speedMode==='slow'));document.getElementById('btnHighContrast').setAttribute('aria-pressed',String(document.body.classList.contains('high-contrast-mode')));}
  const original=window.updateGlobalVoiceUI;window.updateGlobalVoiceUI=(...args)=>{original?.(...args);paint();};
  actions.addEventListener('click',()=>queueMicrotask(paint));options.addEventListener('click',()=>queueMicrotask(paint));paint();
});
