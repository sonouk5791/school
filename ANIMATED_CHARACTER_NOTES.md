# 첨부 원본 기반 안내 캐릭터

- 원본: `assets/images/animated-kongi/reference.png` (사용자가 첨부한 이미지 그대로, 재생성 이미지 미사용).
- 배경: SVG 외곽 클립으로 원본 주변 흰색/베이지색을 화면에서 제외. 원본 PNG 자체의 픽셀과 배경은 보존.
- 구성: `js/animated-character.js`의 `AnimatedCharacter`, `css/animated-character.css`. 기존 홈페이지 히어로 캐릭터만 교체.
- 동작: 3~5초 눈 깜빡임, 미세 호흡/회전 및 귀 움직임, 진입 시 2.5초 손 인사. 모션 감소 설정에서는 애니메이션 생략.
- 음성: HeyGen 한국어 여성 공개 음성 `fe3fbd12d84c41b5a791e6ea544f774d`, 속도 0.9, WAV 6.4초. 기기별 브라우저 TTS 대신 로컬 파일 재생. 목소리 연령감과 선호도는 청취 평가 필요.
- 문장: “안녕하세요! 만나서 반가워요. 오늘도 저와 함께 즐겁게 시작해 볼까요?”
- 립싱크: 생성 음성의 단어별 타임스탬프에 맞춘 한국어 음절/모음 기반 5개 입모양. 단어 안의 음절은 균등 시간 보간하며, 정밀한 음소 단위 forced alignment는 아님.
- 음성은 클릭 후에만 시작. 다시 듣기는 이전 재생을 중단하고 처음부터 재생. 일시정지/재개 및 음소거 지원.
- 화면 이동/탭 숨김/pagehide 시 음성과 예약 작업 중지. bfcache 복귀 시 대기 모션만 복원. DOM 제거 시 이벤트 AbortController와 MutationObserver 해제.
- 검증: Edge headless에서 실제 WAV 재생, 일시정지/재개, 다시 듣기, 음소거, 기존 음성과의 배타성, 화면 이동, 모바일, 모션 감소, 이벤트 정리. 기존 캐릭터 음성 테스트 390/768/1024/1440px 통과.
- 배포: 원격 배포는 수행하지 않음. `school-release/`에 해당 변경 파일 동기화.

## 2026-09-21 얼굴 수정
베이지색 원형 두 부분만 imagegen 수정본에서 가져와 face-clean.svg에 부분 마스크 합성. 원본 reference.png 보존. 얼굴 나머지 영역은 원본 사용. 홈페이지 이미지 참조를 face-clean.svg로 변경.

## 공식 기준 교체 (2026-09-21)
이전 원본 강아지 및 face-clean.svg 설명은 과거 작업 기록입니다. 현재 공식 기준과 적용 방식은 characters/README.md 및 characters/manifest.json을 따릅니다. 네 캐릭터의 새 기준에 맞춰 예전 얼굴 SVG 오버레이는 사용하지 않습니다.
