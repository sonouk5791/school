/* Display-only season: no changes to voices, activity state, questions or saved records. */
document.addEventListener('DOMContentLoaded',()=>{
 if(document.documentElement.dataset.season!=='chuseok')return;
 const greetings={kongi:'명절을 앞두고, 천천히 몸을 움직여볼까요?',tori:'명절을 앞두고, 토리와 즐겁게 놀아볼까요?',nabi:'나비와 함께 차분하게 생각해볼까요?',bori:'보리와 함께 따뜻한 시간을 보내볼까요?'};
 const id=document.body.dataset.activityRoom||(document.getElementById('viewReady')?'kongi':null);
 if(!id)return;
 document.body.dataset.seasonRoom=id;
 const greeting=document.querySelector('.tp-hero>p,.nl-hero>p,.bh-hero>p');
 if(greeting&&greetings[id])greeting.textContent=greetings[id];
 const title=document.querySelector('.se-ready-title');if(title)title.textContent=greetings.kongi;
 const speech=document.querySelector('.tp-speech,.nl-speech,.bh-speech');if(speech)speech.textContent=id==='bori'?'명절을 앞두고, 편안하게 함께해요.':'천천히 함께해요.';
 // Keep a small, non-interactive friend beside the current activity, outside questions/media.
 const host=document.querySelector('.room-flow-toolbar,.se-guide-name');
 if(host){const image=CharacterAnimation.create(id);image.classList.add('season-room-companion');image.setAttribute('aria-hidden','true');host.prepend(image);}
});
