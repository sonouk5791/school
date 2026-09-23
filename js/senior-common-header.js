/* Shared navigation for standalone activities. Keep original nodes and handlers. */
document.addEventListener('DOMContentLoaded', () => {
  const header=document.querySelector('.se-header,.tp-header,.nl-header,.bh-header,.ch-header,body>header');
  if(!header || document.querySelector('.site-header'))return;
  document.body.classList.add('senior-common-page');
  const original=[...header.childNodes];
  const nav=document.createElement('nav');nav.className='senior-common-nav';nav.setAttribute('aria-label','어르신 공통 메뉴');
  nav.innerHTML='<a href="index.html">🏠 홈</a><button type="button" data-common-sound>🔊 소리</button><button type="button" data-common-view aria-controls="commonView" aria-expanded="false">Aa 보기 편하게</button><button type="button" data-common-help aria-controls="commonHelp" aria-expanded="false">❓ 도움</button><a href="index.html#teacher">👨‍🏫 선생님 공간</a>';
  const view=document.createElement('section');view.id='commonView';view.className='common-settings';view.hidden=true;
  view.innerHTML='<h2>보기 편하게</h2><div class="common-settings-options"><button type="button" data-common-font="normal">기본 글씨</button><button type="button" data-common-font="large">큰 글씨</button><button type="button" data-common-contrast>고대비</button><button type="button" data-common-slow>천천히 듣기</button></div><button type="button" data-common-close>닫기</button>';
  const help=document.createElement('section');help.id='commonHelp';help.className='common-settings';help.hidden=true;
  help.innerHTML='<h2>도움</h2><p>하고 싶은 활동을 눌러주세요. 처음 화면은 홈을 눌러요.</p><div class="common-original-help"></div><button type="button" data-common-close>닫기</button>';
  const preserved=help.querySelector('.common-original-help');original.forEach(node=>preserved.append(node));
  preserved.querySelectorAll('a[href="index.html"]').forEach(a=>a.hidden=true);
  const timer=preserved.querySelector('.se-top-time-box');
  if(timer)document.getElementById('viewPlaying')?.prepend(timer);
  // The daily activity heading remains visible; its controls keep their original state.
  const heading=preserved.querySelector('h1');
  if(heading && !document.querySelector('.se-header'))header.after(heading);
  header.classList.add('senior-common-header');header.append(nav,view,help);
  const read=(key,fallback)=>{try{return localStorage.getItem(key)??fallback;}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
  const sound=nav.querySelector('[data-common-sound]'),viewButton=nav.querySelector('[data-common-view]'),helpButton=nav.querySelector('[data-common-help]');
  function eachVoice(fn){fn(window);const child=document.getElementById('courseFrameHost')?.querySelector('iframe')?.contentWindow;if(child)fn(child);}
  function paint(){
    const font=read('digital_school_font_scale','normal'),contrast=read('digital_school_high_contrast','false')==='true',muted=read('digital_school_muted','false')==='true',slow=read('digital_school_voice_speed','normal')==='slow';
    document.body.classList.toggle('common-large',font==='large');document.body.classList.toggle('common-xlarge',font==='xlarge');document.body.classList.toggle('common-contrast',contrast);
    sound.textContent=muted?'🔇 소리':'🔊 소리';sound.setAttribute('aria-pressed',String(!muted));sound.setAttribute('aria-label',muted?'소리 켜기':'소리 끄기');
    view.querySelectorAll('[data-common-font]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.commonFont===font)));
    view.querySelector('[data-common-contrast]').setAttribute('aria-pressed',String(contrast));view.querySelector('[data-common-slow]').setAttribute('aria-pressed',String(slow));
  }
  function toggle(panel,button,open){
    view.hidden=true;help.hidden=true;viewButton.setAttribute('aria-expanded','false');helpButton.setAttribute('aria-expanded','false');
    panel.hidden=!open;button.setAttribute('aria-expanded',String(open));
    if(open){const h=panel.querySelector('h2');h.tabIndex=-1;h.focus();}else button.focus();
  }
  viewButton.onclick=()=>toggle(view,viewButton,view.hidden);helpButton.onclick=()=>toggle(help,helpButton,help.hidden);
  view.querySelector('[data-common-close]').onclick=()=>toggle(view,viewButton,false);help.querySelector('[data-common-close]').onclick=()=>toggle(help,helpButton,false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!view.hidden)toggle(view,viewButton,false);else if(!help.hidden)toggle(help,helpButton,false);}});
  sound.onclick=()=>{const muted=read('digital_school_muted','false')!=='true';write('digital_school_muted',String(muted));write('digital_school_voice_enabled',String(!muted));if(muted)eachVoice(w=>{w.CharacterVoice?.stop();w.CharacterAudioPlayer?.stop();});paint();};
  view.querySelectorAll('[data-common-font]').forEach(b=>b.onclick=()=>{write('digital_school_font_scale',b.dataset.commonFont);paint();});
  view.querySelector('[data-common-contrast]').onclick=()=>{write('digital_school_high_contrast',String(read('digital_school_high_contrast','false')!=='true'));paint();};
  view.querySelector('[data-common-slow]').onclick=()=>{write('digital_school_voice_speed',read('digital_school_voice_speed','normal')==='slow'?'normal':'slow');paint();};
  window.addEventListener('storage',paint);paint();
});
