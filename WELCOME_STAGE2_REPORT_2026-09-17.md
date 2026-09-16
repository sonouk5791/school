# 2차 환영 인사 보완 결과

- 범위: 기존 환영 화면만 보완. 1차 구조 점검은 이전 커밋에서 완료. 3차 오전 프로그램 수정 및 운영 배포는 수행하지 않음.
- 기존 캐릭터 4종, 홈페이지 배경·메뉴·카드·폰트·관리자 기능 유지.
- 기존 홈페이지 표시 후 650ms 뒤, 홈이며 다른 모달/활동이 없을 때만 환영 화면 표시.
- 네 캐릭터별 지정 대사 표시. 기존 그림자·perspective·scale 유지, 4px 움직임과 바닥 그림자, 동작 줄이기 설정 지원.
- 표시 시 세션 키를 저장하여 반복 방지. 홈페이지의 인사 다시 듣기에서 언제든 다시 열 수 있음.
- 녹음 설정: js/welcome-recordings.js의 SchoolWelcomeRecordings.
- kongi/tori/nabi/bori에 실제 사람이 녹음한 MP3/WAV 경로만 설정. 파일이 없는 동안 null을 유지하면 파일 요청 자체를 하지 않음.
- 예: 실제 public/audio/welcome/kong.mp3를 제공한 뒤 kongi 값을 '/public/audio/welcome/kong.mp3'로 설정. 이 프로젝트는 public 자동 변환이 없는 정적 루트 배포이므로 현재 폴더 기준 경로를 사용.
- 누르면 등록된 녹음을 콩이→토리→나비→보리 순으로 재생. 자동재생 없음, AI TTS/SpeechSynthesis 호출 없음.
- 다시 듣기는 진행 중 재생을 취소하고 처음부터 재생. 닫기·프로그램 시작·탭 숨김에서 정지. 재생 거부·손상/누락 파일은 안내 후 중단, TTS 대체 없음.

## 검증

- 환영 UI: 1440/1024/768/390px, 네 이미지 정상, 가로 잘림 없음, 네 대사, 음성 부재 안내, 세션 반복 방지 및 다시 열기.
- 기존 오전 6단계, 수업 기록/관찰/일지/월간 흐름, 대상자 파일방, 8종 서류 회귀 통과.
- 모의 Audio 객체로 MP3/WAV 순서, 닫기 취소, 재생 거부 대응 검증. 실제 녹음은 없으므로 사람 음성의 청취 품질은 미검증.
- node --check, vercel build --prod --yes 통과. 새 라이브러리 없음.
- 1차 해시 기준 대비 기존 실행 파일 변경은 index.html, welcome-greeting.js, welcome-greeting.css뿐. 새 녹음 설정 파일만 추가.

## 관련 파일

- [환영 컴포넌트](file:///J:/sh/js/welcome-greeting.js)
- [녹음 설정](file:///J:/sh/js/welcome-recordings.js)
- [스타일](file:///J:/sh/css/welcome-greeting.css)
- [화면 검사](file:///J:/sh/tests/welcome-greeting.cjs)
- [재생 제어 검사](file:///J:/sh/tests/welcome-recordings.cjs)
