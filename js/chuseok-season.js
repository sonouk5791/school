/* Display-only season: no changes to voices, activity state, questions or saved records. */
document.addEventListener('DOMContentLoaded',()=>{
 if(document.documentElement.dataset.season!=='chuseok')return;
 const greetings={tori:'추석을 기다리며, 토리와 즐겁게 놀아요.',nabi:'추석을 기다리며, 나비와 천천히 생각해봐요.',bori:'추석을 기다리며, 보리와 따뜻한 추억을 나눠요.'};
 const id=document.body.dataset.activityRoom;
 const greeting=document.querySelector('.tp-hero>p,.nl-hero>p,.bh-hero>p');
 if(greeting&&greetings[id])greeting.textContent=greetings[id];
});
