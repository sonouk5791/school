# 디지털 AI학교 1차 구조 점검 및 보호 기준

작성일: 2026-09-17 (Asia/Seoul)
범위: 마스터 프롬프트의 1차 단계. 운영 UI·기능·이미지·데이터·라우팅 변경 없음.

## 1. 기술 스택 및 실행

| 항목 | 확인 결과 |
| --- | --- |
| 프레임워크 | 정적 HTML + CSS + 브라우저 JavaScript. React/Next/Vue 및 SSR 없음 |
| 패키지 관리 | 루트·릴리즈에 package.json 및 lockfile 없음. npm run build 대상 아님 |
| 홈페이지 | index.html, js/app.js 초기화, js/senior-finish.js 화면 분류 |
| 컴포넌트 방식 | 별도 js/*.js IIFE 또는 DOMContentLoaded, 별도 css/*.css, index.html에서 순서대로 로드 |
| CSS | 기본 main.css/lesson.css/teacher.css, 기능별 스타일, CSS 변수와 미디어쿼리 |
| 라우팅 | 단일 홈페이지에서 DOM 표시/숨김·dialog·lessonViewport 사용. URL 라우터 없음 |
| 로컬 서버 | node server.cjs → http://127.0.0.1:8085 (정적 파일·영상 Range 요청 지원) |
| 배포 | school-release 폴더의 정적 파일을 Vercel에 배포 |
| 설정 | vercel.json의 framework:null, buildCommand:null, outputDirectory:'.' |
| 주의 | 내려받은 Vercel 프로젝트 설정에는 framework:vite가 남아 있으나, 로컬 vercel.json의 명시적 정적 설정을 사용한 production build는 성공. 이번 단계에서 설정 변경 없음 |

새 라이브러리·프레임워크·빌드 도구를 설치하지 않았습니다.

## 2. 폴더와 책임

- assets/images: 기존 캐릭터 및 활동 이미지.
- assets/videos: 기존 20분 체조 영상.
- css: 기본 화면 및 기능별 스타일.
- js: 활동·관리·파일방·환영·오전 프로그램 스크립트.
- documents: 8종 인쇄용 서류 HTML.
- tests: 격리된 브라우저 기능 검사, 생성 스크립트, 검증 자료.
- scripts: 기존 개발 보조 스크립트.
- school-release: 실제 Git 저장소이자 Vercel 배포 루트.
- .vercel 및 .env*: 로컬 연결·환경 정보. Git/배포 제외 규칙 유지, 내용 문서화 금지.

## 3. 현재 사용 중인 캐릭터

| 캐릭터 | 환영/오전 프로그램 | 홈·친구 선택 |
| --- | --- | --- |
| 콩이 | assets/images/friend-kongi.png | assets/images/friend-kongi-talk.png |
| 토리 | assets/images/friend-tori.png | 같은 파일 |
| 나비 | assets/images/friend-nabi.png | 같은 파일 |
| 보리 | assets/images/friend-bori.png | 같은 파일 |

-talk.png 변형도 존재합니다. 다음 기능은 현재 표시 맥락에 맞는 기존 이미지를 재사용하며 얼굴·색상을 변경하지 않습니다. 기존 운동복이 이미지에 합쳐져 있으므로 옷 입히기는 단순 색상 필터로 얼굴까지 바꾸는 방식으로 구현하면 안 됩니다. 실제 의상 표현 방법과 기존 얼굴 보존을 5차에서 별도로 확인해야 합니다.

## 4. 저장 상태와 보호 대상

- digital_school_management_v1: 대상자·수업·보고서·프로그램·일정 및 consentDocuments. care-workflow.js의 load/commit 및 CareAutomationBridge 사용.
- digital_school_active_elder_id: 선택 대상자.
- digital_school_care_records / digital_school_current_learner: 기존 RecordManager 기록/선택.
- school_workflow_progress_v1 / school_workflow_settings_v1 / school_workflow_drafts_v1: 수업 임시 진행·설정·초안.
- digital_school_friend: 선택 친구.
- daily_games_v1 / digital_school_hobby_works: 기존 활동 자료.
- digital_school_muted / digital_school_voice_enabled / digital_school_voice_speed: 기존 음성 설정.
- IndexedDB digital_school_participant_files_v1: 대상자별 첨부 파일·체크 목록.
- sessionStorage school_character_welcome_v1: 환영 화면 반복 방지.
- 오전 프로그램의 기분 선택은 메모리와 기존 홈 선택을 연동하며 새 DB에 저장하지 않습니다.

실제 사용자 브라우저 저장소를 읽거나 초기화하지 않았습니다. 검사는 별도의 브라우저 컨텍스트에서 가상 대상자로 수행합니다. localStorage와 IndexedDB 자료는 Git 커밋으로 백업되지 않습니다.

## 5. 관리자와 오늘 프로그램

- 선생님 공간 버튼 → 기존 care-workflow.js의 관리 화면.
- 기존 어르신 관리·수업·일지·분석·보고서·설정 기능 유지.
- workflow-automation.js가 기존 수업 기록·초안·월간 흐름에 연결되어 있으므로 함수 재정의 순서에 주의.
- morning-program.js는 인사→날짜→기분→체조→기억→마무리 6단계.
- 체조는 기존 #warmupVideo를 잠시 이동하여 재사용하고 종료 시 원위치 복귀·정지.
- 인지활동은 LessonEngine.startLesson('memory') 재사용. 새 게임 없음.
- senior-finish.js의 공통 이동 및 dialog 관찰자와 충돌하지 않도록 연결 필요.

## 6. 환영·음성 현황과 다음 단계 차이

- welcome-greeting.js / welcome-greeting.css에 네 캐릭터, 세 문구, 반응형, 부드러운 CSS 움직임, 오늘 프로그램 연결이 이미 구현되어 있습니다.
- 현재 환영 MP3 없음. recordings 배열이 비어 있으며 버튼은 자연스럽게 안내합니다. 실제 녹음의 부재를 TTS로 대체하지 않습니다.
- 다음 2차에서 캐릭터별 대사, 4개 녹음의 명시적 매핑/재생 순서, 다시 듣기와 재진입 동작을 기존 구현에 보완할 수 있습니다.
- 기존 voice.js는 SpeechSynthesis를 사용하고, morning-program.js에도 인사 speak 호출이 있습니다. 환영 화면 자체는 TTS를 사용하지 않습니다. 마스터의 TTS 금지와 기존 기능 보존을 함께 지키기 위해 신규 기능에는 TTS를 추가하지 않고, 기존 오전 인사 등 수정 범위는 해당 단계에서 점검합니다.
- 신규 날씨 API·로그인·DB는 추가하지 않습니다.

## 7. 새 기능 추가 위치

- 환영: 기존 js/welcome-greeting.js와 css/welcome-greeting.css를 확장. 중복 환영 화면 생성 금지.
- 오전 프로그램: 기존 js/morning-program.js와 css/morning-program.css를 확장. 중복 흐름 생성 금지.
- 4차 친구들 방: js/character-rooms.js / css/character-rooms.css 같은 기존 명명 방식의 별도 파일, 기존 AI 친구 영역에 작은 진입 버튼만 연결.
- 5차 옷 입히기: js/character-wardrobe.js / css/character-wardrobe.css 등 별도 구현, 기존 관리 저장 키와 겹치지 않는 전용 키 사용.
- 새 DOM ID·CSS는 기능별로 한정하고, 기존 전역 버튼·카드 스타일을 덮어쓰지 않습니다.
- index.html은 필요한 파일 참조만 추가하고 기존 스크립트 의존 순서를 유지합니다.

## 8. Git·보호 기준

- J:/sh 자체는 Git 저장소가 아닙니다. 실제 저장소는 J:/sh/school-release입니다.
- origin: https://github.com/sonouk5791/school.git
- 현재 브랜치 main, 점검 시작 HEAD bf9c49e. 기존 origin/main 추적 상태 확인.
- 기존 배포 기록은 main 기반입니다. 최종 9차 배포 시 원격 및 Vercel production branch 설정을 다시 확인합니다.
- 시작 시 전날 작업 정리 문서와 일지 변경이 미커밋 상태였습니다. 사용자가 요청해 저장한 문서로 확인했으며 보존합니다.
- tests/stage-one-source-baseline.json: 실행 파일 151개의 SHA-256 및 기준 커밋. 루트와 릴리즈의 151개 파일이 모두 일치했습니다.
- 이번 단계는 문서와 검사 도구만 커밋합니다. 운영 사이트를 변경·재배포하지 않습니다.

## 9. 단계별 진행 원칙

이번 작업은 1차만 수행합니다. 다음 단계는 1차 검사 통과 후 시작하며, 각 단계마다 테스트·실제 빌드·오류 확인·별도 커밋을 완료합니다. 이미 구현된 요구사항은 검증 후 재사용하고, 친구들 방·의상·인지활동은 각각 해당 단계에서 추가합니다.

## 10. 1차 완료 검사 결과

- [x] 현재 구조·홈·관리자·상태 저장·배포 구조 확인.
- [x] 실제 사용 캐릭터 이미지 및 음성 파일 부재 확인.
- [x] 안전한 기능별 파일 추가 위치 결정.
- [x] 실행 JavaScript 33개 node --check 통과.
- [x] vercel build --prod --yes 성공 (운영 배포 아님).
- [x] 환영 화면: 1440/1024/768/390px, 캐릭터·음성 없음 안내·TTS 미사용·프로그램 연결·세션 반복 방지.
- [x] 오전 프로그램: 여섯 단계, 기분 선택, 기존 영상 재사용·정지, 기억 놀이 종료·이전, 홈/다른 활동.
- [x] 기존 관리자: 수업 시작·재개·결과·관찰·최종 일지·월간 기록·연속 수업.
- [x] 대상자 파일방: 동명이인 격리·파일 바이트·새로고침 유지·체크 목록·백업·복원·반응형.
- [x] 서류: 8종 빈 양식과 인쇄 모드, 공단 원본 구분, 모바일 가로 넘침 없음.
- [x] 검사 후 실행 파일 151개 보호 기준 유지 확인.

검사 명령: Node 런타임에서 tests/stage-one-baseline.cjs 실행. Playwright는 기존 제공 런타임을 사용하며 새 패키지를 설치하지 않았습니다. 환영 테스트 이외의 기존 회귀 검사에서는 격리된 테스트 탭의 세션 키만 설정해 첫 진입 다이얼로그를 건너뜁니다. 해당 설정은 실제 사용자 데이터와 무관합니다.
