# 7~9차 최종 점검 및 배포

- 7차: 어르신 홈은 오늘 프로그램 및 체조·기억 놀이·음악·친구들 방·AI 친구를 강조. 기존 선생님 관리 route와 저장 데이터 유지.
- 8차: 제목·버튼·설명 가독성, 버튼 높이와 간격, 초점 표시, 작은 화면 줄바꿈과 느린 모션 보완.
- 9차: 정적 HTML/CSS/JS 프로젝트로 package manager 및 TypeScript/lint 설정 없음. 모든 HTML 참조 로컬 자산 및 JS 문법 검사. `vercel build --prod --yes` 성공.
- 테스트: 환영·음원 없음·오전 6단계·기존 체조/인지·네 방·옷 저장/복원·3종 옷 인지활동·기존 관리자 기록/파일방/서류 검사 통과.
- 화면 크기: 390, 768, 1024, 1440, 1920px 홈과 관리자 진입 검사 통과. 기존 방/옷/프로그램은 모바일 및 태블릿/PC 검사 통과.
- Vercel API에서 GitHub `school`, production branch `main` 확인.
- production 배포 후 URL에서 별도 검증 예정.

관련 파일: [메뉴](file:///J:/sh/js/senior-experiences.js), [가독성](file:///J:/sh/css/senior-accessibility.css), [기능 검사](file:///J:/sh/tests/senior-experiences.cjs).
