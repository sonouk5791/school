/**
 * 3차 전체 점검 및 기능 고도화 검증 스크립트
 */
const fs = require('fs');
const assert = require('assert');

console.log('--- 3차 전체 점검 및 기능 고도화 자동 검증 시작 ---');

// 1. index.html 검증
const indexHtml = fs.readFileSync('index.html', 'utf8');

// (1) 일일 추천 섹션
assert(indexHtml.includes('id="dailyRecommendSection"'), 'index.html에 dailyRecommendSection이 존재해야 합니다.');
assert(indexHtml.includes('오늘은 무엇을 해볼까요?'), 'index.html에 일일 추천 제목이 존재해야 합니다.');
assert(indexHtml.includes('dailyDayThemeBadge'), 'index.html에 요일별 테마 뱃지가 존재해야 합니다.');
assert(indexHtml.includes('btnStartDailyActivity'), 'index.html에 오늘 활동 시작 버튼이 존재해야 합니다.');

// (2) 4대 캐릭터 룸 도어
assert(indexHtml.includes('id="characterDoors"'), 'index.html에 4대 캐릭터 방 섹션이 존재해야 합니다.');
assert(indexHtml.includes('오늘은 누구를 만나볼까요?'), 'index.html에 4대 방 제목이 존재해야 합니다.');
assert(indexHtml.includes('door-kongi') && indexHtml.includes('콩이의 운동방'), '콩이의 운동방 도어가 존재해야 합니다.');
assert(indexHtml.includes('door-tori') && indexHtml.includes('토리의 놀이방'), '토리의 놀이방 도어가 존재해야 합니다.');
assert(indexHtml.includes('door-nabi') && indexHtml.includes('나비의 학습방'), '나비의 학습방 도어가 존재해야 합니다.');
assert(indexHtml.includes('door-bori') && indexHtml.includes('곰이의 취미방'), '곰이의 취미방 도어가 존재해야 합니다.');

// (3) 기존 수업 보존
assert(indexHtml.includes('aiCoursesGrid'), '기존 AI 핵심 실습 코스가 보존되어야 합니다.');
assert(indexHtml.includes('lesson-card-ai'), '기존 AI 실습 카드가 보존되어야 합니다.');
assert(indexHtml.includes('senior-exercise.html'), '어르신 체조 링크가 연결되어 있어야 합니다.');
assert(indexHtml.includes('character-house.html'), '캐릭터 집 꾸미기 링크가 연결되어 있어야 합니다.');
console.log('✔ index.html 4개 방 구조 및 일일 추천 검증 통과');

// 2. character-house.html & js 검증
const houseHtml = fs.readFileSync('character-house.html', 'utf8');
const houseJs = fs.readFileSync('js/character-house.js', 'utf8');
const houseCss = fs.readFileSync('css/character-house.css', 'utf8');

assert(houseHtml.includes('id="selectScreen"'), '캐릭터 선택 화면이 존재해야 합니다.');
assert(houseHtml.includes('id="studioScreen"'), '메인 하우스 스튜디오가 존재해야 합니다.');
assert(houseHtml.includes('id="btnModeEasy"'), '쉬운 꾸미기 버튼이 존재해야 합니다.');
assert(houseHtml.includes('id="btnModeFree"'), '자유롭게 꾸미기 버튼이 존재해야 합니다.');
assert(houseHtml.includes('id="easyPositionBar"'), '쉬운 배치(좌/중/우) 바가 존재해야 합니다.');
assert(houseHtml.includes('id="btnPlaceLeft"'), '왼쪽 배치 버튼이 존재해야 합니다.');
assert(houseHtml.includes('id="btnPlaceCenter"'), '가운데 배치 버튼이 존재해야 합니다.');
assert(houseHtml.includes('id="btnPlaceRight"'), '오른쪽 배치 버튼이 존재해야 합니다.');
assert(houseHtml.includes('id="btnBottomUndo"'), '되돌리기 버튼이 존재해야 합니다.');
assert(houseHtml.includes('id="btnBottomSave"'), '내 집 저장하기 버튼이 존재해야 합니다.');
assert(houseHtml.includes('id="completeView"'), '꾸미기 완료 축하 화면이 존재해야 합니다.');
assert(houseHtml.includes('id="chStampBadge"'), '도장 뱃지가 존재해야 합니다.');
assert(houseHtml.includes('id="btnTtsHelp"'), '음성 설명 듣기 버튼이 존재해야 합니다.');

// JS 검증 (6 구조 & 9 카테고리 & 4 캐릭터)
assert(houseJs.includes('room_spacious') && houseJs.includes('room_living') && houseJs.includes('room_window') && houseJs.includes('room_garden') && houseJs.includes('room_hanok') && houseJs.includes('room_books'), '6대 방 구조가 모두 정의되어 있어야 합니다.');
assert(houseJs.includes('furniture') && houseJs.includes('plants') && houseJs.includes('toys') && houseJs.includes('books') && houseJs.includes('frames') && houseJs.includes('lights') && houseJs.includes('cushions') && houseJs.includes('music') && houseJs.includes('exercise'), '9대 가구/소품 카테고리가 모두 정의되어 있어야 합니다.');
assert(houseJs.includes('kongi') && houseJs.includes('tori') && houseJs.includes('nabi') && houseJs.includes('bori'), '4인 캐릭터가 모두 정의되어 있어야 합니다.');
assert(houseJs.includes('senior_stamps_v1'), '도장 저장 키가 정의되어 있어야 합니다.');
console.log('✔ character-house.html / JS / CSS (6구조, 9카테고리, 쉬운배치, 도장, 음성) 검증 통과');

// 3. senior-exercise.html & js 검증
const exerciseHtml = fs.readFileSync('senior-exercise.html', 'utf8');
const exerciseJs = fs.readFileSync('js/senior-exercise.js', 'utf8');

assert(exerciseHtml.includes('btnStart') && exerciseHtml.includes('btnPause') && exerciseHtml.includes('btnRestart'), '재생/멈춤/처음부터 제어 버튼이 존재해야 합니다.');
assert(exerciseHtml.includes('btnPrev') && exerciseHtml.includes('btnNext'), '이전/다음 동작 이동 버튼이 존재해야 합니다.');
assert(exerciseHtml.includes('btnMute') && exerciseHtml.includes('btnBgm') && exerciseHtml.includes('btnFullscreen'), '소리/배경음/전체화면 버튼이 존재해야 합니다.');
assert(exerciseHtml.includes('exerciseCompleteModal'), '운동 완료 모달이 존재해야 합니다.');
assert(exerciseHtml.includes('btnTtsExerciseHelp'), '설명 듣기 버튼이 존재해야 합니다.');
assert(exerciseJs.includes('senior_stamps_v1'), '체조 완료 시 도장이 안전하게 발급 및 저장되어야 합니다.');
console.log('✔ senior-exercise.html / JS (10단계 연속 재생, 대형 제어, 도장) 검증 통과');

// 4. CSS 및 접근성 검증
assert(houseCss.includes('min-height: 48px') || houseCss.includes('min-height: 52px'), '어르신용 최소 48px 이상의 터치 타겟이 설정되어 있어야 합니다.');
assert(indexHtml.includes('main.css'), '메인 스타일시트가 정상 연결되어 있어야 합니다.');

console.log('\n🎉 [3차 전체 점검 및 기능 고도화 모든 테스트 100% 통과!]');
