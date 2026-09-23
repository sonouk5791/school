# 한복 캐릭터 절하기·입모양 수정

## 원인
- 기존 절하기는 상하체 클립은 있었지만 정면 PNG 상체에 원근 rotateX만 적용했다. 얼굴 방향과 머리 자세는 그대로라 평면이 까딱이는 인상이 남았다.
- 시즌 캐릭터 생성 경로는 PNG 한 장을 붙인 뒤 바로 반환했다. 말하기 상태의 data-mouth 값은 바뀌어도 입 레이어가 없어서 원본의 열린 입이 계속 보였다. 일반 캐릭터의 입 구현은 시즌 경로에서 사용되지 않았다.
- 음성 요청 시작(speaking)과 실제 오디오 재생 시작이 구분되지 않았다.

## 구현
- 원본 한복 PNG는 바꾸지 않았다. 사용자 이미지와 같은 외형의 숙인 자세 4장을 image_gen으로 추가했다. 생성된 하체는 사용하지 않고 원본 하체·발을 유지한다.
- SVG lower-body는 고정, upper-body는 머리·상체·모은 손을 포함한다. 허리 경계를 클리핑하고 접합부를 완만하게 혼합했다. 상체만 회전하며 숙인 자세 이미지로 바뀌어 눈·얼굴 방향이 아래로 향한다. 독립적인 손 흔들기 대신 모은 손이 상체를 따라 인사한다.
- transform-origin(1122×1402 좌표): 콩이 (561,1110), 토리 (561,1110), 나비 (561,1080), 보리 (561,1030).
- 각도: 콩이 14°, 토리 15°, 나비 12°, 보리 13.5°. 2.4초(보리 2.6초), 약 0.6~0.65초 유지 후 천천히 복귀. 외곽 SVG/하체 translate·scale·bounce 없음.
- 메인 최초 표시 4명 동시 1회. 이후 hover/focus 또는 실제 음성 시작에 해당 캐릭터만 인사. 10초 재실행 간격. 자동 반복 없음. 동작 줄이기 설정 존중.
- 입 5상태: mouthClosed / mouthA / mouthO / mouthE / mouthSmile. 캐릭터별 원본 입 주변 털을 덮는 마스크와 별도 SVG 입을 배치. 보리는 턱 안쪽의 털만 샘플링해 입 주변 갈색 흔적을 방지했다.
- 각 캐릭터가 독립적인 mouthStates/talkStarted를 가진다. 실제 Audio playing부터 약 180ms 간격으로 5상태 순환. 합성 대기 중 미소 유지, 종료/취소/오류/버퍼링 때 미소 복귀. 요청 토큰으로 이전 재생 이벤트가 새 캐릭터 상태를 바꾸지 못하도록 보호했다.
- 활동방의 작은 안내 캐릭터도 동일한 리그를 사용한다. Google/Gemini TTS API, 음성 ID, 저장 키, 활동 콘텐츠, URL은 유지했다.

## 검증
- hanbok-mouth.cjs: 4명 각각 5상태 관찰, 다른 친구 입 고정, 합성 대기 중 입 정지, 종료 미소, 빠른 취소/전환 정상. 20개 렌더 결과가 실제로 다른 픽셀인지 확인.
- 각 활동방 선택 후 작은 안내 캐릭터: 4명 모두 실제 브라우저 WAV 재생 중 5상태 관찰 및 종료 미소 확인.
- chuseok-bow.cjs: 첫 인사 동시 1회, 고정 하체 bounds/transform, 숙임 유지 구간, 반복 없음, reduced-motion 통과.
- chuseok-rooms.cjs: 4방 × 4폭, 활동 진입, 안내 캐릭터, 저장 데이터 보존, 가로 넘침/JS 오류 없음.
- 메인 1920×1080 / 1600×900 / 1366×768 / 768×1024 / 390×844 확인.
- vertex-tts-browser / qa6-functional / exercise-caption-sync 통과. 음성 최대 동시 재생 1개, 운동 자막/일시정지/재개 유지. 기존 음성 매니페스트 빌드 통과.
- 시각 검토: [다섯 입모양 비교](../tests/hanbok-five-mouths.png). 테스트 PNG는 로컬 검증 자료이며 Git/배포 제외.

## 범위와 한계
- 2D 상체 자세 합성과 허리 회전이다. 3D 골격 애니메이션이 아니다.
- 입은 오디오 재생 구간에 맞춘 순환이며 발음별 정밀 립싱크가 아니다.
- 브라우저 상태 전환 검증은 통제된 WAV 응답으로 진행했고, 배포 후 Google 서버 실호출도 4명 모두 확인했다. 음색의 주관적 청취 평가는 별도이다.
- 기존 비시즌 캐릭터/과거 자산/운동 동작 영상은 삭제하거나 교체하지 않았다.

## 관련 파일
- [시즌 리그](file:///J:/sh/js/hanbok-character.js)
- [입 상태 연결](file:///J:/sh/js/character-animation.js)
- [음성 재생 이벤트](file:///J:/sh/js/character-voice-system.js)
- [절하기 실행](file:///J:/sh/js/chuseok-bow.js), [CSS](file:///J:/sh/css/chuseok-bow.css)
- [자세 이미지 생성 프롬프트](./HANBOK_BOW_IMAGE_PROMPTS.md)

## 운영 배포 확인
- 코드 커밋: 57535f4, GitHub main 푸시 완료.
- Vercel: dpl_GrbwDHnDYY5eqvp5N4rP1DxNoDVU, READY, https://school-tau-pearl.vercel.app
- 운영 HTML 5개 / JS 4개 / CSS 1개 / 자세 PNG 4개: 로컬 소스와 SHA-256 일치(14개).
- 운영 Google TTS POST “반가워요.”: 콩이 Achird, 토리 Aoede, 나비 Gacrux, 보리 Charon 모두 HTTP 200, audio/wav 및 RIFF 확인.
