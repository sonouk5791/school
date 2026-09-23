# 캐릭터 애니메이션 차분한 동작으로 수정

## 수정 전 진단
| 항목 | 실제 구현 / 어색함의 원인 |
|---|---|
| 전체 PNG 이동 | 한복 리그 전체의 무한 translate/scale/bounce는 없었음. 기존 비시즌 rig-breath에 translateY(-2px), selected에도 -2px 이동이 있었음. 정적 배치용 scale/translate는 애니메이션과 구분함. |
| 절하기 | chuseok-waist-bow의 perspective(1800px) rotateX와 upright-out/greeting-in opacity 전환이 함께 실행됨. 서로 다른 PNG의 얼굴·의상 윤곽이 전환 중 겹치고 평면 투영 느낌이 남았음. 첫 진입 4명 동시/hover/focus/음성 시작에 실행됐음. |
| 입 | 한복 PNG의 원래 입 위에 털을 복제한 패치와 2D SVG ellipse/path를 올렸음. 3D 캐릭터와 질감이 다르고 모든 캐릭터가 같은 도형을 사용했음. data-mouth는 이미 5상태였으므로 단일 O 스프라이트 고정은 아니었음. |
| 타이밍 | 180ms 고정 순환. 실제 playing부터 시작했지만 음량/무음 분석은 없었음. |
| 눈 | 비시즌은 피부색 ellipse와 선으로 눈을 가렸고 3~5초/220ms. 한복은 nextBlink=Infinity로 깜빡임이 비활성화됨. |
| 상태 | idle/talking/preparing/waving/exercising/selected 및 별도 is-bowing 클래스가 분산 관리됨. |
| 이미지 | hanbok-v2 원본, bow.png 보조 자세를 사용. assets/images/kongi-parts/extracted/mouth_talk_overlay.png는 존재하지만 현재 한복 메인에 연결되지 않음. |

## 제거·유지
- 화면에서 제거: PNG 상체 원근 회전, 두 자세 crossfade, 첫 진입 동시 절, hover/focus 절, 음성 시작마다 절, 평면 SVG 입/복제 털 패치, 고정 180ms 입 루프.
- 기본 몸 이미지는 완전 고정. 미세 호흡/scale도 추가하지 않음. 메인 rig-breath도 명시적으로 정지.
- 유지: 사용자 원본 PNG/대표색/링크, 활동 콘텐츠와 저장 데이터, Google/Gemini TTS 및 지정 음성 ID, 기존 오류·중단 처리. 과거 bow/overlay/캐릭터 자료는 삭제하지 않고 비활성 상태로 보존.

## 입 구현과 anchor
새 image_gen 표정 atlas에서 작은 3D 입 영역만 SVG viewport/mask로 표시한다. 얼굴 전체는 교체하지 않는다. 눈 파츠와 입 파츠는 서로 독립이다. 아래 크기는 입 파츠 표시 영역이며 입 자체는 그 안에서 작게 표현된다.

1122×1402 원본 좌표:

| 캐릭터 | mouth 중심 x,y | 파츠 폭×높이 |
|---|---:|---:|
| 콩이 | 561,674 | 120×84 |
| 토리 | 572,712 | 104×74 |
| 나비 | 560,583 | 110×74 |
| 보리 | 561,569 | 130×82 |

- mouthClosed / mouthA / mouthO / mouthE / mouthSmile 5개.
- closed → A → closed → O → E → closed → smile 순환. 전환 예약은 120~200ms 랜덤, 20ms 렌더 tick으로 실제 약 120~220ms.
- Google TTS 응답을 Web Audio OfflineAudioContext로 디코딩하여 40ms 단위 RMS 음량표를 만든다. 현재 HTMLAudioElement.currentTime에 대응하는 값을 사용한다. AnalyserNode를 출력 경로에 끼워 넣지 않아 기존 오디오 출력이나 사용자 활성화 정책에 영향을 주지 않는다.
- 무음/아주 작은 소리는 closed. 중간 소리에서 O 대신 작은 A를 사용하고 일반 구간에서 A/O/E와 closed를 순환한다. 디코딩 미지원/실패 시 실제 playing 구간에서만 시간 순환으로 대체한다.
- 말하기 요청 시 해당 친구만 talking, 합성/오디오 로드 동안 smile. 실제 playing부터 입 시작. waiting/paused는 closed, ended/error/cancelled/stopped는 smile+idle.
- 정밀 발음별 phoneme 립싱크는 아니다.

## blink
- 원본과 같은 위치의 전용 blink-v3 이미지를 제작하고 눈 영역만 표시. 피부색 원/평면 눈꺼풀 도형은 사용하지 않는다.
- 콩이 안경 보존. 토리는 이미 감은 눈을 그대로 두고 원래 열린 눈만 깜빡인다.
- 표정 리소스 준비 후 약 1.1초 정지, 캐릭터별 320ms 차이를 두고 첫 blink. 이후 약 4~7초 랜덤, 닫힌 상태 약 150ms.
- 전역 blink 슬롯으로 네 캐릭터가 동시에 깜빡이지 않도록 한다. 말하는 동안에도 blink 유지.
- prefers-reduced-motion에서는 자동 blink와 반복 입 전환을 정지하고 정적인 표정 유지.

## 상태와 선택 흐름
- idle / talking / greeting / bowing을 분리. 기본은 정지+가끔 blink. 말하는 친구 외에는 idle.
- 메인 캐릭터 클릭은 기존 링크로 바로 이동한다. 이동을 기다리게 하지 않는다. sessionStorage의 일회성 선택 정보로 해당 방에서 짧은 Google 인사를 재생한다. 빠르게 활동을 시작했으면 인사 요청이 활동 음성을 덮어쓰지 않는다.
- greeting의 현재 대체 표현은 미소와 한 번의 눈인사이다. 원본의 모은 손을 억지로 회전시키지 않는다.

## 절하기와 필요한 리소스
- 현재 bowing은 실행하지 않는다. 검증된 실제 절 애니메이션이 없으므로 가짜 절로 대체하지 않는다.
- motionAssets[id].greeting/bowing 슬롯과 검증된 WebM/animated WebP 단발 재생 어댑터를 마련했다. 기본값은 모두 null이다. 향후 src/format/duration/validated를 등록하면 사용 가능하다.
- 자연스러운 손 흔들기에는 어깨·팔·손이 분리된 파츠 또는 전용 투명 영상이 필요하다.
- 실제 허리 절에는 상하체·관절 파츠 또는 전용 투명 WebM/WebP가 필요하다. 이번에 제작한 것은 입과 눈의 정적 표정 파츠이며 손/절 전용 모션 파일은 제작하지 않았다.

## 검증
- character-calm.cjs: 15.5초 idle 관찰 중 몸 좌표·크기·transform 고정, CSS animation 0, 첫 지연 및 blink 150ms/랜덤 간격, 동시 blink 최대 1명.
- 4캐릭터 각각 유음/무음 WAV로 5입 상태·합성 대기 중 입 정지·무음 닫기·타 캐릭터 idle·종료/취소/오류 복귀 통과. reduced-motion 및 5개 화면 크기 통과.
- hanbok-mouth.cjs: 20개의 실제 렌더 픽셀 구분, 평면 입 도형 0. 얼굴 확대 비교와 4명×6표정 시각 검토 완료. atlas 눈 파츠의 잔상이 발견되어 별도 정렬 blink 이미지로 교체하고 재검토했다.
- chuseok-bow.cjs: 가짜 절/몸 keyframe 0, 기존 운동방 URL 유지.
- chuseok-rooms: 4방×4폭 활동 진입, 안내 캐릭터, localStorage 보존, 넘침/JS 오류 없음.
- exercise-caption-sync / vertex-tts-browser / qa6-functional: 운동 자막·중단·재개, Google 요청 구조, 음성 최대 동시 1개, 집 꾸미기 저장 회귀 통과.
- PC 1920×1080 / 1600×900 / 1366×768 / 태블릿 768×1024 / 모바일 390×844.
- 실제 사용자 체감 평가는 자동 테스트로 보장할 수 없으며 실제 iPad/Safari 기기 검증은 미실시.

## 파일
- [표정/anchor](file:///J:/sh/js/hanbok-character.js), [상태/타이밍](file:///J:/sh/js/character-animation.js)
- [음성 RMS 연동](file:///J:/sh/js/character-voice-system.js), [정지 스타일](file:///J:/sh/css/chuseok-bow.css)
- [생성 프롬프트 및 자산 기록](./CALM_CHARACTER_ASSET_PROMPTS_2026-09-23.md)
- 로컬 비교: [표정](../tests/calm-expression-sheet.png), [확대](../tests/calm-face-detail.png). 테스트 PNG는 Git/배포 제외.
