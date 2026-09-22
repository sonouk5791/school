/* Character rooms reuse existing assets and styling; no care data or selected friend changes. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const host=document.querySelector('.friend-selection');if(!host)return;
 const friends=[
  {id:'kongi',name:'콩이',emoji:'🐶',note:'햇살처럼 밝은 방에서 편하게 쉬어가요.',items:['운동매트','작은 공','화분','옷장']},
  {id:'tori',name:'토리',emoji:'🐰',note:'포근한 소파에 앉아 마음을 나눠요.',items:['작은 소파','쿠션','꽃','거울','옷장']},
  {id:'nabi',name:'나비',emoji:'🐱',note:'책과 앨범을 보며 추억을 떠올려요.',items:['책장','앨범','그림카드','책상','옷장']},
  {id:'bori',name:'곰이',emoji:'🐻',note:'편안한 의자에서 좋아하는 음악과 취미를 즐겨봐요.',items:['스피커','작은 악기','편안한 의자','옷장']}
 ];
 const drawings={
 '옷장':'<rect x="24" y="8" width="72" height="80" rx="6"/><path d="M60 8v80M30 88v7M90 88v7"/><circle cx="51" cy="50" r="2"/><circle cx="69" cy="50" r="2"/>',
 '운동매트':'<path d="M13 60h82l15 25H25z"/><path d="M30 67h62M34 74h63"/>',
 '작은 공':'<circle cx="60" cy="52" r="32"/><path d="M32 37q29 27 52 36M60 20q-15 33 0 64M29 61q35-26 60-22"/>',
 '화분':'<path d="M41 58h38l-7 30H48zM60 58V28"/><ellipse cx="45" cy="34" rx="15" ry="9"/><ellipse cx="75" cy="23" rx="15" ry="9"/>',
 '꽃':'<path d="M46 59h28l-4 31H50zM60 59V30"/><circle cx="60" cy="19" r="10"/><circle cx="48" cy="31" r="10"/><circle cx="72" cy="31" r="10"/><circle cx="60" cy="42" r="10"/><circle cx="60" cy="31" r="7"/>',
 '작은 소파':'<rect x="24" y="23" width="72" height="48" rx="12"/><rect x="14" y="47" width="17" height="32" rx="7"/><rect x="89" y="47" width="17" height="32" rx="7"/><path d="M31 62h58M25 79v9M96 79v9M60 26v32"/>',
 '쿠션':'<path d="M31 25q29 8 58 0q-8 28 0 53q-29-7-58 0q8-27 0-53z"/><path d="M47 43q13-15 19 0q17-11 13 7L60 65 43 51z"/>',
 '거울':'<ellipse cx="60" cy="41" rx="28" ry="33"/><path d="M60 74v15M43 91h34M46 34l15-14M49 49l26-25"/>',
 '책장':'<rect x="24" y="8" width="72" height="82" rx="4"/><path d="M24 46h72M24 79h72M34 17v24M44 18v23M56 14v27M71 20l8 21M36 53v20M47 56v17M61 52v21M74 55v18"/>',
 '앨범':'<rect x="28" y="17" width="65" height="69" rx="4"/><path d="M38 17v69"/><rect x="49" y="32" width="33" height="27" rx="3"/><path d="M51 56l12-13 9 8 8-5M50 70h30"/>',
 '그림카드':'<rect x="20" y="20" width="44" height="60" rx="5"/><rect x="57" y="29" width="44" height="60" rx="5"/><circle cx="42" cy="43" r="10"/><path d="M63 71l12-18 18 25H65"/>',
 '책상':'<rect x="13" y="40" width="94" height="10" rx="3"/><path d="M25 50v40M95 50v40M30 25h29v15M37 19h29v21"/><rect x="70" y="51" width="25" height="18"/><path d="M80 59h5"/>',
 '스피커':'<rect x="34" y="12" width="52" height="78" rx="8"/><circle cx="60" cy="34" r="10"/><circle cx="60" cy="66" r="17"/><circle cx="60" cy="66" r="6"/>',
 '작은 악기':'<path d="M61 41V12h13v35q15 10 12 27q-4 20-26 15q-19-5-16-23q1-14 17-25z"/><circle cx="66" cy="64" r="9"/><path d="M66 17v39M60 79h17"/>',
 '편안한 의자':'<rect x="36" y="13" width="49" height="49" rx="15"/><rect x="26" y="52" width="67" height="22" rx="8"/><path d="M35 74l-5 17M84 74l5 17M27 43v18M93 43v18"/>'
 };
 const prop=name=>`<figure class="cr-prop"><svg viewBox="0 0 120 100" aria-hidden="true" focusable="false">${drawings[name]}</svg><figcaption>${name}</figcaption></figure>`;
 const entry=document.createElement('button');entry.type='button';entry.className='care-btn';entry.id='characterRoomsEntry';entry.textContent='🏠 친구들 방';host.querySelector('h2')?.after(entry);if(!entry.isConnected)host.prepend(entry);
 const dialog=document.createElement('dialog');dialog.id='characterRooms';dialog.className='care-dialog';dialog.setAttribute('aria-labelledby','characterRoomsTitle');document.body.append(dialog);
 const button=(label,action,extra='')=>`<button type="button" class="care-btn ${extra}" data-character-room="${action}">${label}</button>`;
 function display(id){const friend=friends.find(f=>f.id===id);
  dialog.innerHTML=`<nav class="senior-return cr-nav" aria-label="친구들 방 이동"><button type="button" class="care-btn primary" data-senior-page="home">🏠 처음으로</button>${button('← 친구들 방','list')}</nav><h1 id="characterRoomsTitle" tabindex="-1">${friend?friend.emoji+' '+friend.name+'의 방':'🏠 친구들 방'}</h1>${friend?`<p class="cr-description">${friend.note}</p><section class="cr-scene" data-room-theme="${friend.id}" aria-label="${friend.name}의 생활 공간"><div class="cr-window" aria-hidden="true"></div><div class="cr-room-layout"><div class="cr-furnishings">${friend.items.slice(0,2).map(prop).join('')}</div><img class="cr-character" src="assets/images/friend-${friend.id}.png" alt="${friend.name}"><div class="cr-furnishings">${friend.items.slice(2).map(prop).join('')}</div></div></section>`:`<p class="cr-description">어느 친구의 방에 놀러 갈까요?</p><div class="cr-room-cards">${friends.map(f=>`<button type="button" class="care-card cr-room-card" data-character-room="${f.id}"><img src="assets/images/friend-${f.id}.png" alt=""><strong>${f.emoji} ${f.name}의 방</strong></button>`).join('')}</div>`}`;
  if(friend){window.CharacterWardrobe?.mount(dialog,friend.id);window.ClothingActivities?.mount(dialog,friend.id,friend.name);}
  if(!dialog.open)dialog.showModal();dialog.scrollTop=0;dialog.querySelector('h1').focus();
 }
 entry.addEventListener('click',()=>display());dialog.addEventListener('click',e=>{const b=e.target.closest('[data-character-room]');if(b)display(b.dataset.characterRoom)});
 dialog.addEventListener('cancel',e=>{e.preventDefault();dialog.close();entry.focus()});
});
