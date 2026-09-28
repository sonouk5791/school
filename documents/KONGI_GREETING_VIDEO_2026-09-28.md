# 콩이 인사 MP4 연결 — 2026-09-28

- 요청 파일 `gemini_generated_video_9f1b3be9.mp4`를 변환 없이 `assets/videos/kongi-greeting.mp4`로 복사.
- 원본과 복사본 SHA256: `2110432908BC1ECEC755F1BE98B4B3B848A52CB3DEB394C77FB17BCF3B544DEF`.
- 약 10초, 1280×720, H.264 영상 + AAC 스테레오 음성. 사용자의 영상 속 얼굴·복장·음성을 그대로 사용.
- 적용 위치: 기존 메인 `전체 활동 → 콩이의 인사 듣기` 영역. 기존 네 친구 카드의 이동 링크와 운동 시작 화면은 유지.
- 재생 버튼이나 영상 터치로 재생, 기본 autoplay/loop/controls OFF, `playsinline`, `object-fit:contain`.
- 재생 중 버튼은 잠깐 멈추기, 정지/종료 후 다시 인사해요로 변경.
- 종료 시 영상에서 추출한 2초 프레임 poster로 복귀하여 검은 화면 방지. 오류 시 기존 `friend-kongi.png` 대체. 이름·문구는 항상 표시.
- 소리 버튼은 독립 음소거를 지원하고 상단 전체 음소거도 존중. 상단 음소거 상태에서 소리 켜기 선택 시 기존 상단 소리 버튼을 통해 해제.
- 인사 영역 닫기, 화면 밖 이동, 탭 숨김, 다른 캐릭터/환영 음성 시작 시 영상 일시정지.
- 기존 단순 애니메이션 초기화와 TTS 인사 버튼 중복 생성을 이 영역에서만 건너뜀. Google TTS API/설정·수업/활동/기록/localStorage 데이터 보존.

## 변경 파일
- [메인](file:///J:/sh/index.html)
- [영상 제어](file:///J:/sh/js/kongi-greeting-video.js)
- [영상 스타일](file:///J:/sh/css/kongi-greeting-video.css)
- [기존 애니메이션 호환](file:///J:/sh/js/animated-character.js)
- [중복 인사 버튼 방지](file:///J:/sh/js/friends-and-play.js)
- [원본 MP4](file:///J:/sh/assets/videos/kongi-greeting.mp4)
- [정지 화면](file:///J:/sh/assets/images/kongi-greeting-poster.png)
- [검증](file:///J:/sh/tests/kongi-greeting-video.cjs)

검증과 배포 결과는 아래에 추가한다.

## 검증
- `tests/kongi-greeting-video.cjs` 로컬 통과: 1920×1080, 1366×768, 768×1024, 390×844, 320×900.
- 실제 MP4 재생 시간 증가, 음소거/해제, 종료 후 poster, 다시 재생, 새로고침 시 자동재생 OFF, 영역 닫을 때 정지, 가로 넘침/JS 오류 없음 확인.
- MP4 404를 주입해 대체 이미지와 안내 유지 확인. `<source>` 오류 이벤트도 처리하며 12초 로딩 제한을 두어 준비 중 화면에 고정되지 않도록 함.
- 기존 녹음 manifest 빌드와 새 JS 문법 검사 통과. 새 Google TTS 합성 없이 첨부 MP4의 음성 사용.
