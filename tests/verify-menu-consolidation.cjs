const fs = require('fs');
const assert = require('assert');

function runTest() {
  console.log('--- Starting Menu Consolidation & Duplicate Removal Verification ---');

  const indexHtml = fs.readFileSync('index.html', 'utf8');

  // 1. 어르신 상단 메인 네비게이션 검증
  assert(indexHtml.includes('🏠 친구들 마을'), '어르신 네비에 친구들 마을 존재');
  assert(indexHtml.includes('🏃 콩이집 (운동)'), '어르신 네비에 콩이집(운동) 존재');
  assert(indexHtml.includes('🧩 토리집 (놀이)'), '어르신 네비에 토리집(놀이) 존재');
  assert(indexHtml.includes('📚 나비집 (학습)'), '어르신 네비에 나비집(학습) 존재');
  assert(indexHtml.includes('🎵 보리집 (취미)'), '어르신 네비에 보리집(취미) 존재');
  assert(indexHtml.includes('🏡 우리 집 (텃밭)'), '어르신 네비에 우리 집(텃밭) 존재');

  // 2. 선생님 공간 8대 표준 메뉴 검증
  const expectedTabs = [
    'data-tab="operations"',
    'data-tab="users"',
    'data-tab="schedule"',
    'data-tab="records"',
    'data-tab="report"',
    'data-tab="content"',
    'data-tab="auto-scheduler"',
    'data-tab="settings"'
  ];
  for (const tab of expectedTabs) {
    assert(indexHtml.includes(tab), `선생님 모달 탭에 ${tab} 존재`);
  }

  const expectedSubnavs = [
    'data-subnav="operations"',
    'data-subnav="users"',
    'data-subnav="schedule"',
    'data-subnav="records"',
    'data-subnav="report"',
    'data-subnav="content"',
    'data-subnav="auto-scheduler"',
    'data-subnav="settings"'
  ];
  for (const sub of expectedSubnavs) {
    assert(indexHtml.includes(sub), `선생님 서브네비에 ${sub} 존재`);
  }

  // 3. home-welcome-flow.js 검증
  const flowJs = fs.readFileSync('js/home-welcome-flow.js', 'utf8');
  assert(flowJs.includes('our-home.html'), '우리 집 링크 존재');
  assert(flowJs.includes('our-home.html#garden'), '내 텃밭 가꾸기 링크 존재');
  assert(!flowJs.includes('hw-course-links'), '어르신 마을 화면에서 복잡한 수업 드롭다운 제거됨');

  // 4. daycare-home-ui.js 8대 탭 렌더링 검증
  const daycareJs = fs.readFileSync('js/daycare-home-ui.js', 'utf8');
  assert(daycareJs.includes('renderReportTab'), '보고서 탭 렌더러 존재');
  assert(daycareJs.includes('renderContentTab'), '콘텐츠 탭 렌더러 존재');
  assert(daycareJs.includes('initTeacherSubnav'), '선생님 서브네비 제어 함수 존재');

  console.log('✅ ALL MENU CONSOLIDATION CHECKS PASSED!');
}

runTest();
