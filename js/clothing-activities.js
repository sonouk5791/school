/* Three gentle, single-question activities using the existing wardrobe. */
(()=>{'use strict';
function mount(dialog,id,name){
 const wardrobe=dialog.querySelector('#characterWardrobe');if(!wardrobe||!window.CharacterWardrobe)return;
 const activities=[
 {id:'season',title:'🧥 계절 옷 고르기',prompt:`오늘은 추운 겨울이에요. ${name}에게 어떤 옷을 입혀줄까요?`,choices:['knit','cardigan','padded'],best:'padded',yes:'따뜻한 옷을 골라주셨네요!',again:'다른 옷도 한번 볼까요?'},
 {id:'color',title:'🎨 색깔 찾기',prompt:'빨간색 옷을 찾아볼까요?',choices:['stripe','cardigan','jacket'],best:'stripe',yes:'잘 찾으셨어요!',again:'천천히 다시 찾아볼까요?'},
 {id:'occasion',title:'🌞 상황에 맞는 옷',prompt:`오늘은 ${name}의 체조하는 날이에요. 어떤 옷이 편할까요?`,choices:['party','sport','jacket'],best:'sport',yes:'움직이기 편한 옷을 골라주셨네요!',again:'다른 옷도 함께 살펴볼까요?'}
 ];
 const section=document.createElement('section');section.id='clothingActivities';section.className='care-card';wardrobe.before(section);let current=null;
 const b=(text,action)=>`<button type="button" class="care-btn" data-clothing-activity="${action}">${text}</button>`;
 function focus(){dialog.scrollTop=0;const h=section.querySelector('h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}}
 function visibility(active){for(const el of [wardrobe,dialog.querySelector('.cr-scene'),dialog.querySelector('.cr-description')])el.hidden=active;}
 function closed(){visibility(false);current=null;section.innerHTML=b('👕 옷으로 생각 놀이','open');section.querySelector('button').focus({preventScroll:true});}
 function menu(){visibility(true);current=null;section.innerHTML='<h2>어떤 놀이를 해볼까요?</h2><p>천천히 골라보세요. 어떤 선택도 괜찮아요.</p><div class="ca-menu">'+activities.map(a=>b(a.title,a.id)).join('')+'</div>'+b('← 옷 입히기로','close');focus();}
 function question(key){current=activities.find(a=>a.id===key);if(!current)return;
 const options=window.CharacterWardrobe.options();
 section.innerHTML=`<h2>${current.title}</h2><p class="ca-question">${current.prompt}</p><div class="ca-preview">${window.CharacterWardrobe.preview(id)}</div><div class="ca-choices">${current.choices.map(value=>{const o=options.find(v=>v.id===value);return `<button type="button" class="care-btn" data-clothing-choice="${value}" aria-pressed="false"><svg viewBox="0 0 100 90" aria-hidden="true"><path d="M30 12L10 30l14 19 9-8v40h35V41l9 8 14-19-21-18Q50 32 30 12Z" fill="${o.color||'#edca70'}" stroke="#735e49" stroke-width="3"/>${value==='stripe'?'<path d="M34 48h32m-32 14h32" stroke="white" stroke-width="6"/>':''}</svg><span>${o.name}</span></button>`}).join('')}</div><p class="ca-feedback" role="status" aria-live="polite">마음에 드는 옷을 눌러주세요.</p><p class="ca-save"></p><div class="ca-actions">${b('함께 골라봤어요 · 마무리','finish')}${b('← 다른 놀이','open')}${b('← 옷 입히기로','close')}</div>`;
 section.querySelector('[data-clothing-activity="finish"]').hidden=true;focus();
 }
 section.addEventListener('click',e=>{const choice=e.target.closest('[data-clothing-choice]');if(choice&&current){const value=choice.dataset.clothingChoice;if(!current.choices.includes(value))return;wardrobe.dispatchEvent(new CustomEvent('wardrobe:choose',{detail:value}));section.querySelector('.ca-preview').innerHTML=window.CharacterWardrobe.preview(id);section.querySelectorAll('[data-clothing-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===choice)));section.querySelector('.ca-feedback').textContent=value===current.best?current.yes:current.again;section.querySelector('.ca-save').textContent=wardrobe.querySelector('.cw-status').textContent;section.querySelector('[data-clothing-activity="finish"]').hidden=false;return;}
 const action=e.target.closest('[data-clothing-activity]')?.dataset.clothingActivity;if(!action)return;
 if(action==='open')menu();else if(action==='close')closed();else if(action==='finish'){section.innerHTML='<h2>함께 골라주셔서 고마워요!</h2><p>오늘도 천천히 생각해보았어요.</p><div class="ca-actions">'+b('다른 놀이 해보기','open')+b('옷 입히기로 돌아가기','close')+'</div>';current=null;focus()}else question(action);
 });
 section.innerHTML=b('👕 옷으로 생각 놀이','open');
}
window.ClothingActivities={mount};
})();
