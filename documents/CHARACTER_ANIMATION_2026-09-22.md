# 캐릭터 부위별 애니메이션 — 2026-09-22

## 리소스 분석
홈 대표 이미지는 assets/images/home-hero/four-friends.jpg 한 장이며 원본 PSD/SVG 레이어·관절 뒤 그림은 없다. 기존 3D 입모양 에셋은 이번 2D 교복 캐릭터와 외형이 달라 섞지 않았다.

## 구현
- 원본 JPG는 수정하지 않았다. SVG image + clipPath/mask로 손을 든 팔과 손을 분리한다.
- 어깨/손목 좌표를 각각 transform-origin으로 사용하고 3~9도 이내의 작은 회전만 허용한다.
- 2px 호흡, 3~5초 간격 약 0.2초 눈 깜빡임, 닫힘/A/O/원본 웃는 입 순환 오버레이.
- 캐릭터마다 호흡 주기와 인사 각도/속도를 다르게 사용한다. 보리는 2.4초, 다른 친구는 1.8초의 짧은 인사이다. 자동 인사는 약 12초마다 한 명씩 순서대로 실행한다.
- pointer hover/focus 인사, pointerdown 선택 반응. 기존 클릭 링크는 유지한다.
- idle/waving/talking/exercising/selected/completed 상태를 받을 수 있는 CharacterAnimation 제어기. exercising은 작은 팔 안내 동작이며 실제 체조 시범 대체가 아니다.
- CharacterVoice 녹음/브라우저 TTS/외부 provider 상태 이벤트 연결. 종료·오류·미배정·취소 시 입은 원본으로 복귀한다.
- 세 방의 상단 안내 캐릭터와 콩이 시작 안내에는 동일 대표 이미지 rig를 연결한다. 이전 이미지 DOM/파일은 보존한다. 운동 본문 영상·이미지 및 기록 로직은 그대로다.
- prefers-reduced-motion, 숨겨진 탭 정지, 페이지 종료 타이머 정리. 전역 0.7초 transition이 눈/입을 겹쳐 보이게 하던 문제는 rig 안에서 해제한다.

## 변경 파일
- js/character-rig-data.js: 원본 좌표/팔·손 경계/어깨·손목/눈·입/동작 설정
- js/character-animation.js: SVG 생성, 상태, 음성 이벤트, 정리
- css/character-animation.css: 부위별 동작과 접근성
- index.html, tori-play.html, nabi-learn.html, bori-hobby.html, senior-exercise.html: 공통 컴포넌트 로드
- js/character-voice-system.js: 브라우저 발화 종료 상태 알림
- tests/character-animation.cjs: 브라우저 회귀 검사

추가 raster 이미지/PNG는 없다. 파츠는 원본 이미지를 참조하는 SVG 마스크로 구성한다.

## 검증
node tests/character-voices.cjs 통과.
Playwright Edge: 네 캐릭터/손 레이어/기존 URL, 녹음 시작·끝·중단 상태, reduced motion, 390px 가로 넘침 없음, 네 방 안내 컴포넌트, 콘솔 오류 없음 통과.
홈 idle/인사/말하기 스크린샷 확인. 입모양은 음소 정밀 분석이 아닌 약 300ms 패턴이며 음질/발음 타이밍의 정밀 동기화는 아니다.

## 다음 개선 범위
전체 골격 rig는 아직 아니다. 머리·몸통·양팔·양다리를 완전히 독립시키거나 양손 모으기/발 움직임을 하려면 원본과 동일한 관절 뒤쪽·가려진 손/옷 파츠가 필요하다. 현재 손을 든 한쪽 팔/손만 원본에서 분리하며 반대 팔·다리는 원본 자세를 유지한다. 눈/입 단색 오버레이 경계도 전용 투명 파츠로 개선 가능하다. 이번에는 별도 디자인 생성 없이 작은 동작만 적용했다.
