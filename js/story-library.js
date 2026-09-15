(()=>{
'use strict';
const stories=[
['sunflower','🌻','마당의 해바라기','꽃을 키우며 이웃과 마음을 나누는 이야기','story_courtyard_sunflower.jpg',[
['할머니는 봄날 마당에 해바라기 씨앗을 심었어요. 매일 작은 화분을 살펴보았지요.','씨앗에게 어떤 말을 해줄까요?','쑥쑥 자라렴','너를 기다리고 있어'],
['며칠 뒤 작은 싹이 올라왔어요. 이웃도 찾아와 함께 새싹을 바라보았어요.','새싹을 보니 어떤 마음이 드나요?','반갑고 기뻐요','신기하고 고마워요'],
['여름이 되어 노란 꽃이 피었어요. 할머니는 이웃과 꽃 옆에 앉아 이야기를 나누었어요.','이야기의 끝을 골라주세요.','함께 꽃을 보며 웃었어요','내년에도 꽃을 심기로 했어요']]],
['meal','🍚','함께 먹는 저녁밥','밥상에 둘러앉아 정을 나누는 이야기','story_courtyard_mealtime.jpg',[
['저녁이 되자 마당에 고소한 밥 냄새가 퍼졌어요. 가족들이 하나둘 모였어요.','누구와 밥을 먹고 싶으세요?','가족과 먹고 싶어요','친구와 먹고 싶어요'],
['서로 반찬을 건네며 오늘 있었던 일을 이야기했어요. 평범한 밥상이 더 정겨워졌어요.','어떤 말을 건네볼까요?','많이 드세요','오늘도 수고하셨어요'],
['식사를 마친 뒤 모두 함께 밥상을 정리했어요. 마당에는 웃음소리가 남았어요.','마지막 인사를 골라주세요.','함께 먹으니 더 맛있네요','내일도 함께해요']]],
['album','📷','오래된 사진 한 장','사진 속 소중한 기억을 꺼내는 이야기','story_hometown_album.jpg',[
['서랍을 정리하다 오래된 사진첩을 찾았어요. 한 장 한 장 넘기니 옛날 생각이 났어요.','어떤 사진을 찾아볼까요?','가족이 함께 찍은 사진','정다운 고향 사진'],
['사진을 보며 옆에 앉은 친구에게 옛이야기를 들려주었어요. 친구도 자신의 추억을 이야기했어요.','어떻게 이야기를 시작할까요?','그때 참 즐거웠지요','이곳이 생각나네요'],
['사진첩을 덮고 오늘의 모습도 남기기로 했어요. 오늘도 언젠가 따뜻한 추억이 되겠지요.','새 사진의 제목을 골라주세요.','함께 웃는 오늘','소중한 우리들의 하루']]],
['garden','🥬','작은 텃밭의 선물','채소를 기르고 함께 나누는 이야기','story_courtyard_vegetables.jpg',[
['작은 텃밭에 채소가 자라고 있었어요. 할아버지는 아침마다 잎을 살펴보았어요.','텃밭을 보며 무엇을 말할까요?','잎이 참 싱싱하네요','잘 자라서 기뻐요'],
['채소가 무럭무럭 자라 함께 거둘 때가 되었어요. 바구니에 담으며 서로 도왔어요.','어떤 일을 함께할까요?','바구니를 함께 들어요','수확한 채소를 나눠요'],
['이웃에게 채소를 건네니 환한 웃음이 돌아왔어요. 작은 텃밭이 큰 기쁨을 주었어요.','이야기의 끝을 골라주세요.','나누니 마음이 따뜻해졌어요','다음에도 함께 가꾸기로 했어요']]],
['harvest','🌾','가을 들판의 약속','수확의 기쁨과 고마움을 나누는 이야기','story_brothers_harvest.jpg',[
['두 사람은 가을 들판에서 익은 곡식을 바라보았어요. 함께 애쓴 날들이 떠올랐어요.','들판을 보니 어떤 마음인가요?','참 뿌듯해요','고마운 마음이 들어요'],
['추수를 하다 잠시 쉬었어요. 서로 수고했다며 다정한 말을 건넸어요.','어떤 말을 하고 싶으세요?','함께해서 힘이 났어요','정말 수고 많으셨어요'],
['수확을 마치고 내년에도 서로 돕기로 약속했어요. 집으로 돌아가는 발걸음이 가벼웠어요.','어떤 약속을 할까요?','힘든 일은 함께해요','기쁜 일도 함께 나눠요']]]
];
stories.forEach(([key,icon,title,summary,img,scenes])=>window.LESSON_CATALOG.push({id:'story_'+key,icon,title,summary,steps:scenes.map(([text,q,a,b],i)=>({stepNum:i+1,aiMessage:text,screenText:text,voiceScript:text+' '+q,helpScript:'정답은 없어요. 마음에 드는 말을 골라 이야기를 이어가세요.',prompt:q,imageSrc:'assets/images/'+img,imageAlt:title+' 이야기의 배경',imageCaption:icon+' '+title+' · '+(i+1)+'장',options:[a,b].map(text=>({text,emoji:'💬',isBest:true,feedback:'좋아요. “'+text+'” 하고 이야기를 이어가요.'}))}))}));
document.addEventListener('DOMContentLoaded',()=>{
 const card=document.querySelector('.lesson-card[data-lesson-id="story"]');if(!card)return;
 card.querySelector('.lesson-card-desc').textContent='의좋은 형제와 일상 이야기, 6편 중 골라요';
 const room=document.createElement('dialog');room.id='storyLibrary';room.className='solar-room';room.setAttribute('aria-labelledby','storyLibraryTitle');
 const choices=[['story','📖','의좋은 형제','서로를 아끼는 형과 아우 · 전래동화 8장'],...stories.map(s=>['story_'+s[0],s[1],s[2],s[3]+' · 창작 이야기 3장'])];
 room.innerHTML='<div class="solar-header"><h2 id="storyLibraryTitle">📚 어떤 이야기를 만나볼까요?</h2><button type="button" id="closeStoryLibrary">◀ 돌아가기</button></div><p>마음에 드는 이야기를 골라요. 이야기를 듣고 내 생각도 말해보세요.</p><div class="story-library-grid">'+choices.map(([id,icon,title,desc])=>`<button type="button" data-story-choice="${id}"><span aria-hidden="true" style="font-size:44px">${icon}</span><strong>${title}</strong><span>${desc}</span><span>이야기 시작 ▶</span></button>`).join('')+'</div>';
 document.body.append(room);
 const open=()=>{window.VoiceManager?.stopSpeaking();room.showModal()};
 card.addEventListener('click',e=>{e.stopImmediatePropagation();open()},true);
 card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===card){e.preventDefault();e.stopImmediatePropagation();open()}},true);
 room.querySelector('#closeStoryLibrary').onclick=()=>room.close();
 room.addEventListener('click',e=>{const b=e.target.closest('[data-story-choice]');if(!b)return;room.close();window.LessonEngine.startLesson(b.dataset.storyChoice)});
});
})();
