/* Monthly companion activities: transparent curated recommendations, not clinical prescriptions. */
window.MonthlySchool = (() => {
  const topics = [
    ['고향의 아침','마을과 고향','nostalgic_village.jpg','살던 동네에서 가장 먼저 떠오르는 곳은 어디인가요?','고향집 주변에서 들리던 소리를 이야기해보세요.'],
    ['추억의 밥상','음식과 가족','korean_stew_table.jpg','즐겨 드셨던 음식은 무엇인가요?','함께 밥을 먹던 사람과 기억나는 맛을 이야기해보세요.'],
    ['꽃과 색 이야기','꽃과 색깔','korean_sunflower.jpg','어떤 색의 꽃이 마음에 드시나요?','꽃을 누구에게 선물하고 싶은지 이야기해보세요.'],
    ['과일 가게 나들이','과일과 생활','fruits_basket.jpg','좋아하는 과일을 하나 골라볼까요?','과일의 색과 모양, 먹던 계절을 이야기해보세요.'],
    ['노래가 있는 하루','음악과 기분','ai_puppy_friend.jpg','생각나는 노래 제목이나 한 소절이 있나요?','함께 흥얼거리거나 편안하게 듣고 감상을 나눠보세요.'],
    ['학교 가는 길','배움과 친구','nostalgic_village.jpg','어린 시절 친구와 즐기던 놀이는 무엇인가요?','학교 가던 길이나 기억나는 선생님을 이야기해보세요.'],
    ['따뜻한 차 한 잔','향기와 휴식','warm_jujube_tea.jpg','좋아하는 차나 따뜻한 음료가 있나요?','차를 마시며 나누고 싶은 이야기를 들려주세요.'],
    ['봄날의 산책','계절과 자연','spring_flowers.jpg','산책하며 보고 싶은 풍경을 골라볼까요?','계절마다 달라지는 옷차림이나 나무를 이야기해보세요.'],
    ['우리 집 살림살이','추억의 물건','nostalgic_village.jpg','오래 쓰던 물건 중 기억나는 것이 있나요?','그 물건을 어떻게 사용했는지 천천히 설명해보세요.'],
    ['마음을 전하는 인사','언어와 감정','ai_puppy_heart.jpg','오늘 누구에게 인사를 전하고 싶으신가요?','반가움이나 고마움을 짧은 말로 표현해보세요.'],
    ['시장 구경','생활과 선택','fruits_basket.jpg','시장에 가면 먼저 찾는 곳은 어디인가요?','사고 싶은 물건 두 가지를 골라 이야기해보세요.'],
    ['우리 가족 이야기','가족과 추억','korean_stew_table.jpg','편하게 이야기할 수 있는 소중한 사람이 있나요?','함께 보낸 즐거운 순간만 골라 나눠보세요.'],
    ['햇살과 그림','미술과 표현','korean_sunflower.jpg','오늘 마음에 드는 색을 골라볼까요?','색연필로 선이나 원을 자유롭게 그려보세요.'],
    ['동네 한 바퀴','공간과 생활','nostalgic_village.jpg','집 가까이에 어떤 가게가 있었나요?','가보고 싶은 장소와 가는 길을 이야기해보세요.'],
    ['추억의 박수 리듬','음악과 리듬','ai_puppy_friend.jpg','편안한 속도로 손뼉 두 번을 함께 쳐볼까요?','손이 불편하면 듣거나 고개로 박자를 느껴보세요.'],
    ['좋아하는 계절','계절과 회상','spring_flowers.jpg','가장 좋아하는 계절은 언제인가요?','그 계절의 음식이나 풍경을 이야기해보세요.'],
    ['과일 색깔 찾기','인지와 색','fruits_basket.jpg','사진에서 노란색을 찾아볼까요?','비슷한 색의 다른 물건을 떠올려보세요.'],
    ['함께 만드는 이야기','언어와 상상','story_brothers.jpg','이야기 속 두 사람은 어떤 사이일까요?','행복한 결말을 한 문장씩 이어 만들어보세요.'],
    ['나의 소중한 일','경험과 자부심','nostalgic_village.jpg','예전에 잘하시던 일이나 취미가 있나요?','그 일을 처음 배우던 때나 보람 있었던 순간을 이야기해보세요.'],
    ['고마운 마음','감정과 관계','ai_puppy_heart.jpg','요즘 고마웠던 일이 있나요?','말이나 그림으로 고마운 마음을 전해보세요.'],
    ['한 달의 추억','회상과 선택','ai_friend_classroom.jpg','이번 달 함께한 활동 중 무엇이 기억나시나요?','다시 하고 싶은 활동을 골라주세요.'],
    ['다음 달의 기대','계획과 기분','ai_puppy_heart.jpg','다음에 함께 해보고 싶은 활동이 있나요?','좋아하는 주제로 다음 만남을 약속해보세요.'],
    ['음식 이름 이어 말하기','언어와 음식','korean_stew_table.jpg','좋아하는 음식 이름을 천천히 말해볼까요?','같은 재료로 만들 수 있는 음식을 떠올려보세요.']
  ];
  const phases=[{name:'인사와 마음 열기',minutes:5},{name:'사진 보며 회상',minutes:15},{name:'주제 활동',minutes:20},{name:'표현하고 함께 나누기',minutes:15},{name:'마무리와 기분 확인',minutes:5}];
  function lessons(){return topics.map(([title,category,img,q,more],index)=>({id:'monthly-'+index,title:'60분 · '+title,icon:'🐶',monthly:true,plannedMinutes:60,steps:phases.map((phase,i)=>({
    phaseName:phase.name,plannedMinutes:phase.minutes,
    aiMessage:[`안녕하세요. 오늘은 '${title}' 이야기를 함께 해봐요. 서두르지 않아도 괜찮아요.`,q,more,'이번 활동에서 떠오른 생각을 말이나 그림으로 자유롭게 표현해보세요.','함께해주셔서 고마워요. 오늘 즐거웠던 순간과 다음에 하고 싶은 것을 나눠볼까요?'][i],
    prompt:[`오늘 기분을 알려주세요. (${phase.minutes}분 권장)`,q,more,'마음에 드는 표현 방법을 골라주세요.','오늘 함께한 시간은 어떠셨나요?'][i],
    imageSrc:'assets/images/'+img,imageAlt:category+' 활동 사진',
    imageCaption:[`진행 안내 · 이름을 부르고 안부를 나눠요. 답을 재촉하지 않아요.`,`사진 관찰 → 떠오르는 기억 → 함께 이야기하기. 설명만 듣거나 넘어가도 괜찮아요.`,`질문을 하나씩 천천히 나눠요. 경험 이야기 → 관련 물건·색 고르기 → 좋아하는 점 나누기.`,`종이·색연필 선택 활동. 그리기 7분, 보여주거나 설명하기 8분. 말로 표현해도 괜찮아요.`,`좋았던 활동을 고르고 다음 만남을 이야기해요. 담당자는 관찰과 평가를 남겨요.`][i],
    options:(i===3?['말로 표현할래요','그림으로 표현할래요','듣고 싶어요']:['이야기하고 싶어요','함께 생각해볼래요','듣고 싶어요']).map(text=>({text,emoji:'😊',feedback:text==='듣고 싶어요'?'듣는 것만으로도 함께하고 계세요. 편하게 참여해주세요.':'좋아요. 천천히 함께 나눠보아요.'}))
  }))}));}
  function install(){for(const p of lessons()){const idx=window.LESSON_CATALOG.findIndex(x=>x.id===p.id);if(idx<0)window.LESSON_CATALOG.push(p);else window.LESSON_CATALOG[idx]=p;}}
  function build(month, morningTime = '10:00', afternoonTime = '14:00'){
    const [y,m] = month.split('-').map(Number), days = new Date(y, m, 0).getDate();
    let n = 0;
    const schedules = [];
    for(let day = 1; day <= days; day++){
      const d = new Date(y, m - 1, day);
      if([0, 6].includes(d.getDay())) continue;

      const dayStr = month + '-' + String(day).padStart(2, '0');

      // 1. 오전 수업 (1회차)
      const morningIdx = n++ % topics.length;
      schedules.push({
        id: 'monthplan-' + dayStr + '-am',
        date: dayStr,
        time: morningTime,
        endTime: '11:00',
        elder_id: '',
        group: true,
        programId: 'monthly-' + morningIdx,
        title: '60분 · [오전] ' + topics[morningIdx][0],
        durationMinutes: 60,
        reviewMinutes: 10,
        notes: '콩이 음성 안내 · 오전 ' + topics[morningIdx][1] + ' / 준비물: 사진 화면, 선택 시 종이·색연필. 어르신의 상태에 따라 시간을 조절하세요.',
        recommendationSource: '주제 순환 기본 추천 (오전)',
        phases: phases.map(p => ({ ...p }))
      });

      // 2. 오후 수업 (2회차)
      const afternoonIdx = n++ % topics.length;
      schedules.push({
        id: 'monthplan-' + dayStr + '-pm',
        date: dayStr,
        time: afternoonTime,
        endTime: '15:00',
        elder_id: '',
        group: true,
        programId: 'monthly-' + afternoonIdx,
        title: '60분 · [오후] ' + topics[afternoonIdx][0],
        durationMinutes: 60,
        reviewMinutes: 10,
        notes: '콩이 음성 안내 · 오후 ' + topics[afternoonIdx][1] + ' / 준비물: 사진 화면, 선택 시 종이·색연필. 어르신의 상태에 따라 시간을 조절하세요.',
        recommendationSource: '주제 순환 기본 추천 (오후)',
        phases: phases.map(p => ({ ...p }))
      });
    }
    return schedules;
  }
  let tracking=null,paused=false,phaseStart=0,pausedAt=0,phaseSpent=0,currentIndex=-1,timer;
  function stop(){clearInterval(timer);timer=null;document.getElementById('monthlyPacer')?.remove();tracking=null;currentIndex=-1;}
  function tick(){const out=document.getElementById('monthlyClock');if(!out||!tracking)return;const elapsed=phaseSpent+(paused?0:Math.max(0,Date.now()-phaseStart)),step=LessonEngine.currentLesson.steps[LessonEngine.currentStepIndex],total=step?.plannedMinutes*60||0,left=Math.max(0,total-Math.floor(elapsed/1000));out.textContent=(paused?'일시정지 · ':'')+`${Math.floor(left/60)}분 ${String(left%60).padStart(2,'0')}초`+(left===0?' · 준비되면 다음 활동으로 이동하세요.':'');}
  function mount(){if(!LessonEngine.currentLesson?.monthly){stop();return;}if(!tracking){tracking={plannedMinutes:60,phases:[],startedAt:Date.now()};timer=setInterval(tick,1000);}if(currentIndex!==LessonEngine.currentStepIndex){if(currentIndex>=0)tracking.phases.push({index:currentIndex,seconds:Math.round((phaseSpent+(paused?0:Date.now()-phaseStart))/1000)});currentIndex=LessonEngine.currentStepIndex;phaseStart=Date.now();phaseSpent=0;paused=false;}
    document.getElementById('monthlyPacer')?.remove();const step=LessonEngine.currentLesson.steps[currentIndex];if(!step)return;const bar=document.createElement('section');bar.id='monthlyPacer';bar.className='monthly-pacer';bar.innerHTML=`<strong>${step.phaseName} · 권장 ${step.plannedMinutes}분</strong><span id="monthlyClock" role="timer"></span><div><button type="button" class="care-btn" id="monthlyPause">잠시 멈춤</button><button type="button" class="care-btn" id="monthlyFinish">일찍 마치기 · 평가</button></div><small>총 60분(1시간) 계획 · 휴식시간 없이 60분 활동 진행. 어르신의 상태와 의사에 맞춰 진행하세요.</small>`;document.getElementById('lessonStageContainer').prepend(bar);document.getElementById('monthlyPause').onclick=()=>{if(paused){phaseStart=Date.now();paused=false;}else{phaseSpent+=Date.now()-phaseStart;paused=true;VoiceManager.stopSpeaking();window.KaraokeEngine?.stopKaraoke();}document.getElementById('monthlyPause').textContent=paused?'계속하기':'잠시 멈춤';tick();};document.getElementById('monthlyFinish').onclick=()=>LessonEngine.finishLessonAndSave();tick();
  }
  document.addEventListener('DOMContentLoaded',()=>{const render=LessonEngine.renderCurrentStep.bind(LessonEngine);LessonEngine.renderCurrentStep=()=>{render();mount();};new MutationObserver(()=>{if(!document.getElementById('lessonViewport').classList.contains('active'))stop();}).observe(document.getElementById('lessonViewport'),{attributes:true,attributeFilter:['class']});});
  return {install,build,phases,stop,getTracking:()=>tracking?structuredClone({...tracking,elapsedSeconds:Math.round((Date.now()-tracking.startedAt)/1000)}):null};
})();
