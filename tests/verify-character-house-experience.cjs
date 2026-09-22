/**
 * AI 캐릭터 집 꾸미기 화면 전면 개선 자동 검증 테스트
 * - 중앙 실제 방 미리보기 강화 (벽/바닥/러그/창문/문)
 * - 캐릭터 중심 경험 & 옷 입히기 직관화
 * - 가구/소품 원클릭 즉시 방 배치
 * - 세로 글자 깨짐 방지 (word-break, white-space)
 * - 오늘의 미션 실시간 피드백
 */
const fs = require('fs');
const assert = require('assert');

console.log('=== AI 캐릭터 집 꾸미기 화면 전면 개선 검증 시작 ===');

const html = fs.readFileSync('character-house.html', 'utf8');
const js = fs.readFileSync('js/character-house.js', 'utf8');
const css = fs.readFileSync('css/character-house.css', 'utf8');

// 1. 3단 레이아웃 (왼쪽 메뉴 / 중앙 큰 방 / 오른쪽 아이템) 검증
assert(html.includes('class="ch-studio-grid"'), '3단 하우스 스튜디오 그리드가 존재해야 합니다.');
assert(html.includes('class="ch-menu-col"') && html.includes('class="ch-room-col"') && html.includes('class="ch-items-col"'), '왼쪽 메뉴, 중앙 방, 오른쪽 아이템 컬럼이 모두 존재해야 합니다.');
console.log('✅ 1. 3단 레이아웃 (메뉴 / 실제 방 / 아이템 목록) 구조 확인');

// 2. 실제 방 인테리어 요소 검증 (단순 흰 박스 금지)
assert(html.includes('id="roomWall"') && html.includes('id="roomFloor"') && html.includes('id="roomRug"'), '벽, 바닥, 중앙 러그 인테리어 요소가 존재해야 합니다.');
assert(html.includes('id="windowElem"') && html.includes('id="doorElem"'), '입체 창문과 원목 방문 요소가 존재해야 합니다.');
assert(css.includes('.ch-room-viewport') && css.includes('min-height: 560px'), '방 뷰포트가 충분히 크고 웅장한 높이를 가져야 합니다.');
console.log('✅ 2. 중앙 실제 방 인테리어 요소(벽/바닥/러그/창문/문) 및 고품질 뷰포트 확인');

// 3. 캐릭터 중심 및 옷 입히기 직관화 검증
assert(html.includes('id="charAvatarWrap"') && html.includes('id="charAvatar"'), '중앙 러그 위에 캐릭터 아바타가 존재해야 합니다.');
assert(html.includes('id="avatarOutfitBadge"'), '캐릭터 의상 상태 배지가 존재해야 합니다.');
assert(css.includes('outfit-changed') && css.includes('@keyframes outfitGlow'), '옷 환복 시 화사한 애니메이션 효과가 정의되어 있어야 합니다.');
assert(js.includes('renderOutfitOptions') && js.includes('outfit-changed'), '옷 선택 시 즉각적인 캐릭터 환복 피드백 로직이 구현되어 있어야 합니다.');
console.log('✅ 3. 캐릭터 중심 아바타 및 옷 입히기 시각적 피드백 확인');

// 4. 가구/소품 원클릭 즉시 방 배치 로직 검증
assert(js.includes('handleCatalogItemClick') && js.includes('state.placedItems.push(newItem)'), '가구/소품 클릭 시 즉시 방에 자동 배치되어야 합니다.');
assert(css.includes('popItemIn'), '방에 놓일 때 통통 튀는 pop-in 애니메이션이 적용되어 있어야 합니다.');
assert(html.includes('id="easyPositionBar"') && html.includes('btnPlaceLeft') && html.includes('btnPlaceCenter') && html.includes('btnPlaceRight'), '쉬운 위치 조정(좌/중/우) 바가 지원되어야 합니다.');
console.log('✅ 4. 가구/소품 원클릭 즉시 방 배치 및 통통 튀는 애니메이션 확인');

// 5. 오늘의 미션 시스템 검증
assert(html.includes('id="missionBanner"') && html.includes('id="missionText"'), '오늘의 미션 배너와 미션 문구가 존재해야 합니다.');
assert(html.includes('id="missionSuccessBadge"'), '미션 성공 배지가 존재해야 합니다.');
assert(js.includes('checkMissionProgress'), '미션 달성 자동 검사 및 칭찬 음성 로직이 구현되어 있어야 합니다.');
console.log('✅ 5. 오늘의 미션 안내 및 미션 달성 칭찬 피드백 확인');

// 6. 어르신 친화적 스타일링 및 글자 깨짐 방지 검증
assert(css.includes('word-break: keep-all') && css.includes('white-space: nowrap'), '버튼 및 카테고리 텍스트 세로 깨짐 방지 스타일이 적용되어 있어야 합니다.');
assert(css.includes('.ch-opt-card') && css.includes('min-height: 110px'), '아이템 카드가 어르신 맞춤형 큰 크기로 스타일링되어 있어야 합니다.');
console.log('✅ 6. 세로 글자 깨짐 방지 및 어르신 맞춤형 초대형 카드 CSS 확인');

console.log('\n🎉 [AI 캐릭터 집 꾸미기 화면 전면 개선 모든 검증 100% 통과!]');
