# 📋 AI 디지털 학교 — 오늘의 작업 일지 (2026-09-16)

**작성 일자**: 2026년 9월 16일 (수)  
**배포 주소**: https://school-tau-pearl.vercel.app  
**GitHub 저장소**: https://github.com/sonouk5791/school (main)  
**로컬 서버**: `http://localhost:8085` / `http://127.0.0.1:8085`  

---

## 🌟 오늘 주요 작업 요약
1. **🎨 3D 동물 친구 캐릭터 4종(콩이, 토리, 나비, 보리) 고화질 전면 개편**:
   - 🐶 **콩이**: 노란색 트레이닝복 / 주황 하트 패치 / 1024×1024 아바타
   - 🐰 **토리**: 핑크 트레이닝복 / 윙크 포즈 / 상반신 비율 정규화
   - 🐱 **나비**: 연보라색 트레이닝복 / 삼색 털 패턴 / 하트 윙크 포즈
   - 🐻 **보리**: 스카이블루 트레이닝복 / 파랑 하트 / 든든한 엄지척 포즈
2. **🧘 체조 및 활동 가이드 단체 그래픽 갱신**:
   - `friends-exercise-guide.png`, `kongi-exercise-guide.png` 교체
3. **🧹 홈페이지 메인 & 상단 중복 내용 정돈**:
   - 상단 2중 네비게이션 중복 제거 (메인 홈 1줄 GNB 유지, 관리 메뉴는 선생님 공간 진입 시 분리 노출)
   - 홈 화면 최상단 관리자 대시보드 중복 노출 제거 및 학습 동선(히어로 ➔ 체조 ➔ 친구선택 ➔ 수업) 일원화
4. **⚙️ 프로젝트 자동 저장 및 작업 관리 지침 수립 완료**:
   - `AGENTS.md` 및 `.agents/rules/auto-save-and-report.md` 영구 등록
5. **🌤️ 기상청 날씨누리 연동 실시간 지역별 날씨 브리핑 시스템 구축**:
   - 기상청 날씨누리(`https://www.weather.go.kr/w/index.do`) 표준 지표 반영 전국 16개 지역 실시간 기상/미세먼지/생활지수 연동
   - 콩이(🐶), 토리(🐰), 나비(🐱), 보리(🐻) 4인 4색 고유 음성(TTS) 및 맞춤형 건강 팁 브리핑
   - 시니어 친화적 고대비 대형 카드 UI 및 권역별 탭/지역 칩 버튼 탑재
6. **🚀 GitHub 메인 브랜치 푸시 및 Vercel 프로덕션 배포 완료**.



## 작업 20260916-최종정리 / 2026-09-16 14:03
- **사용자 요청 사항**: 기존 디지털 AI학교 디자인과 기능을 유지한 기관 사용 전 최종 정리.
- **수행 내역**: 홈 3대 기능 및 날짜·기분 안내, 선생님 공간 분리, 네 캐릭터 역할, 수업/활동 공통 이동, 체조 남은 시간, 느린 여성 음성 우선, 모바일 가독성 및 기존 기록 회귀검증. 새 캐릭터는 선택 사항이므로 생략. 운영 배포는 미실행.
- **검증**: 반응형/체조/이동 테스트, 자동 기록/일지/월간 요약, 기록·일정 무결성, 수업 연속성, 음성 단위검증, 로드 스크립트 문법검사. 상세 결과와 제한은 최종 보고서 참조.
- **관련 파일**: [최종 보고서](file:///J:/sh/FINAL_USABILITY_REPORT.md), [HTML](file:///J:/sh/index.html), [화면 동선](file:///J:/sh/js/senior-finish.js), [화면 스타일](file:///J:/sh/css/senior-finish.css), [캐릭터](file:///J:/sh/js/friends-and-play.js), [음성](file:///J:/sh/js/voice.js), [체조](file:///J:/sh/js/warmup-intro.js), [관리](file:///J:/sh/js/care-workflow.js), [UI 테스트](file:///J:/sh/tests/senior-finish.cjs), [기록 테스트](file:///J:/sh/tests/senior-care-regression.cjs), [일정 테스트](file:///J:/sh/tests/senior-record-integrity.cjs).

- **릴리즈 동기화 확인**: assets/css/js 및 실행·보고서 파일 137개 SHA-256 일치 확인. scripts/tests도 복사 완료.



## 작업 20260916-대상자서류방 / 2026-09-16 14:15
- **사용자 요청 사항**: 대상자별 파일을 보관하는 큰 방과 대상자 서류를 체크하는 작은 방 추가.
- **수행 내역**: 선생님 공간 및 어르신 카드에 보관방 연결, 대상자 고유번호별 파일 분리, 업로드/다운로드/삭제, 서류 상태·확인일·메모·추가 항목 저장, 기존 동의서 방 연결, 대상자별 백업/복원, 미저장 입력 보호. 파일은 IndexedDB에 저장하며 기존 돌봄 JSON 구조는 유지.
- **검증**: 동명이인 격리, 파일 바이트 일치, 재접속 보존, 잘못된 대상자/손상 백업 거부, 중복 복원 방지, 초과 용량 거부, 미저장 이동 취소, PC/태블릿/모바일, 기존 수업 및 자동 기록 회귀검증 통과.
- **저장 및 배포**: 이 브라우저 저장 방식·별도 파일 백업 안내 반영. 로컬 저장 및 school-release 동기화, 원격 배포 미수행.
- **관련 파일**: [결과 보고서](file:///J:/sh/PARTICIPANT_ARCHIVE_REPORT.md), [화면](file:///J:/sh/js/participant-archive.js), [파일 저장](file:///J:/sh/js/participant-archive-store.js), [스타일](file:///J:/sh/css/participant-archive.css), [동의서 연결](file:///J:/sh/js/consent-rooms.js), [이동 보호](file:///J:/sh/js/senior-finish.js), [HTML](file:///J:/sh/index.html), [검증](file:///J:/sh/tests/participant-archive.cjs).


## 작업 20260916-공단연결 / 2026-09-16 14:24
- **사용자 요청 사항**: 장기요양보험 사이트를 연결해 사회복지사 업무수행 일지를 보관하도록 지원.
- **확인 사항**: 사용자에게 기관 제공 연동 자료가 없음을 확인. 공단의 공식 기관/종사자 로그인 화면을 확인했으나 자동 저장 연동 명세는 확보하지 못함.
- **수행 내역**: 선생님 공간·일지 목록·저장 일지에 공단 등록 준비 버튼, 본문 복사/TXT 다운로드, 공식 로그인 새 창 연결, 미저장 편집 보호, 공단 미전송 상태 명시.
- **제한**: 실제 공단 자동 저장 및 계정 내 보관 성공 확인은 미완료. 공단 화면에서 인증 후 직접 입력·저장 필요. 운영 배포 미수행.
- **검증**: 가상자료 브라우저 UI, 편집 전후 저장본 구분, 빈 일지 안내, 모바일 가로 넘침, 공식 링크 및 참조정보 차단, 실제 학교 진입 카드, 로드 스크립트 31개 문법 통과.
- **관련 파일**: [결과 및 제한](file:///J:/sh/LONGTERMCARE_HANDOFF_REPORT.md), [등록 준비 기능](file:///J:/sh/js/longtermcare-handoff.js), [스타일](file:///J:/sh/css/longtermcare-handoff.css), [HTML](file:///J:/sh/index.html), [가상자료 테스트](file:///J:/sh/tests/longtermcare-handoff-fixture.html).


## 작업 20260916-GitHub-Vercel배포 / 2026-09-16 14:26
- **사용자 요청 사항**: 누적 수정 사항을 GitHub에 푸시하고 Vercel 운영 배포.
- **수행 내역**: school-release의 기존 GitHub sonouk5791/school main 연결 및 Vercel school 프로젝트 확인, 원격 최신 변경 확인, 배포 대상 소스 검증. 기존 인증정보와 환경 파일은 커밋·배포에서 제외.
- **배포 대상**: 어르신 화면 정리, 대상자 파일/서류 확인방, 공단 로그인·등록 준비 연결. 공단 자동 저장은 포함되지 않음.
- **관련 파일**: [실행 HTML](file:///J:/sh/school-release/index.html), [배포 설정](file:///J:/sh/school-release/vercel.json), [작업 보고서](file:///J:/sh/TODAY_WORK_REPORT.md).

- **배포 완료 확인 / 2026-09-16 14:29**: GitHub main 소스 커밋 `11f1c562a7d5667fbaf2c85b1c57221a980e2964` 푸시 성공. Vercel 운영 배포 `dpl_4CTSDyt2yZHP4ESvaqTvp3Hzgis8` READY 확인.
- **운영 주소**: https://school-tau-pearl.vercel.app/
- **운영 검증**: HTML 및 신규 JS/CSS 8개 HTTP 200과 로컬 소스 SHA-256 일치, 20분 체조 영상 HTTP 200 및 23,005,436바이트 확인. 공단 자동 저장은 여전히 미연동이며 등록 준비 기능이 배포됨.


## 작업 20260916-서류양식8종 / 2026-09-16 14:38
- **사용자 요청 사항**: 동의서 등 8종 제작, GitHub 푸시 및 Vercel 배포.
- **수행 내역**: 기존 4종 동의서 유지, 공단 발급 서류 2종 원본 제출·확인 양식, 기관 이용 계약서 및 욕구사정 기록 추가. 대상자별 작성·첨부·저장·인쇄·빈 양식 다운로드와 작은 방 연결. 체크 목록은 중복 없이 8종 유지.
- **검증**: 8종 저장·새로고침·첨부, 동의 상태 유지, 390/1040px 양식 화면과 인쇄 스타일, 대상자 파일방 회귀 테스트 통과.
- **관련 파일**: [양식 정의](file:///J:/sh/js/consent-forms.js), [서류 작성방](file:///J:/sh/js/consent-rooms.js), [대상자 방](file:///J:/sh/js/participant-archive.js), [계약서](file:///J:/sh/documents/contract.html), [상세 보고](file:///J:/sh/DOCUMENT_FORMS_REPORT.md).

- **배포 완료 / 2026-09-16 14:40**: 소스 커밋 `3d15ee5` GitHub main 푸시 성공. Vercel `dpl_D5FXbGLM3DJ8WxeWfkx6qABjNvAb` READY. https://school-tau-pearl.vercel.app/ 에서 8종 HTML 양식 및 실행 파일 4개 HTTP 200·SHA-256 일치 확인.


## 작업 20260916-인사배경제거 / 2026-09-16 14:41
- **사용자 요청 사항**: 인사 화면 뒤에 연하게 보이는 교실 배경 삭제.
- **수행 내역**: hero-classroom 배경 사진과 사진 위 그라데이션 제거, 기존 크림색 단색 배경 유지. 캐릭터·말풍선·음성 버튼 유지. 스타일 캐시 버전 갱신.
- **관련 파일**: [스타일](file:///J:/sh/css/main.css), [화면](file:///J:/sh/index.html).


## 작업 20260916-오전프로그램 / 2026-09-16 14:51
- **사용자 요청 사항**: 30분 범위 내 기존 화면을 유지하면서 버튼 하나로 시작하는 6단계 오전 프로그램 추가.
- **수행 내역**: 상단 대형 노란 시작 버튼, 인사·서울 기준 날짜·기분·기존 20분 체조·기존 기억 놀이·마무리 안내. 단계마다 한 캐릭터, 큰 글씨·버튼, 좌측 상단 처음으로/이전, 느린 인사 음성. 기분은 기존 화면 선택과 연동하며 새 DB 저장 없이 유지. 영상 재사용 후 원래 위치 복귀·정지. 기억 놀이 종료 후 마무리, 이전으로 안내 복귀.
- **기존 기능 유지**: 관리자·어르신 데이터·기록 저장 로직 변경 없음. 교실 배경 제거 상태 유지. 기존 회귀 테스트의 저장 버튼 선택자만 현재 버튼 구성에 맞게 구체화.
- **관련 파일**: [오전 프로그램](file:///J:/sh/js/morning-program.js), [스타일](file:///J:/sh/css/morning-program.css), [화면](file:///J:/sh/index.html), [기존 화면 분류](file:///J:/sh/js/senior-finish.js), [검증](file:///J:/sh/tests/morning-program.cjs).

- **검증·배포 완료 / 2026-09-16 14:53**: 6단계·기분 유지·체조 복귀/정지·기억 놀이 이전/종료·모바일/태블릿/데스크톱 검증 통과. 기존 수업 시작/재개/자동결과/관찰/최종 일지/월간 기록 회귀 통과. 소스 `625505a` 푸시, Vercel `dpl_FiBg5UUAFQw8nBuX12CVzzEFzHea` READY. 운영 파일 4개 일치 확인.


## 작업 20260916-첫진입환영 / 2026-09-16 14:57
- **사용자 요청 사항**: 10분 범위로 기존 UI를 변경하지 않고 네 캐릭터 환영 컴포넌트 추가 및 push/배포.
- **수행 내역**: 기존 콩이·토리·나비·보리 이미지 그대로 사용, 별도 welcome-greeting.js/css 환영 다이얼로그, 느린 등장과 4px 상하 움직임·그림자·perspective·scale 적용. reduced-motion 존중. 세션 중 닫은 뒤 재표시 없음. 오늘 프로그램 버튼에 연결.
- **음성**: 프로젝트 MP3 없음 확인. 실제 녹음이 없는 상태에서 네트워크 요청/자동재생/TTS 없이 듣기 버튼에 안내 제공. 기존 app.js 첫 진입 TTS 타이머만 제거; 다른 활동 기능 유지.
- **빌드**: package.json/build 스크립트가 없는 정적 프로젝트로 Node 문법 검사 및 Vercel 배포의 vercel build 사용.
- **관련 파일**: [환영 컴포넌트](file:///J:/sh/js/welcome-greeting.js), [환영 스타일](file:///J:/sh/css/welcome-greeting.css), [진입 코드](file:///J:/sh/js/app.js), [연결](file:///J:/sh/index.html), [검증](file:///J:/sh/tests/welcome-greeting.cjs).

- **검증·배포 완료 / 2026-09-16 14:59**: `b00b8f1` (Add character welcome greeting) main 푸시 성공. Vercel 정적 build 통과, `dpl_F8aR1mZDFpu8ZbL4h9CcZf6smfer` READY. 운영 URL https://school-tau-pearl.vercel.app/ 에서 PC 1440 / 태블릿 768 / 모바일 390px, 네 캐릭터·가로 잘림 없음·첫 진입 TTS 없음·음성 없음 안내·오늘 프로그램 연결·기존 메뉴/선생님 공간 검사 통과. 작업 트리 깨끗함 확인.


## 작업 20260916-당일정리문서 / 2026-09-16 15:03
- **사용자 요청 사항**: 오늘 작업 내용을 Markdown 파일에 저장.
- **수행 내역**: 화면 개선·대상자 방·공단 연결·8종 서류·배경 제거·오전 프로그램·환영 기능·검증·배포 및 제한사항을 별도 문서로 정리. 기존 누적 일지 보존, 릴리즈 폴더 동기화.
- **관련 파일**: [오늘 작업 정리](file:///J:/sh/오늘_작업_정리_2026-09-16.md).


## 작업 20260917-1차구조점검 / 2026-09-17 08:49
- **사용자 요청 사항**: 30분 단계 개발 마스터의 1차 프로젝트 보호·구조 점검.
- **수행 내역**: 기술 스택·라우팅·홈·캐릭터·음성·상태관리·관리자·오전 프로그램·배포·브랜치 문서화. 151개 실행 파일 보호 해시 저장, 루트/릴리즈 일치 확인. 기존 UI·기능·데이터 변경 없음. 전날 미커밋 문서 보존.
- **검증**: 33개 JS 문법, Vercel production 로컬 build, 환영 4개 화면 크기·오전 프로그램·관리자 기록·파일방·서류 양식 회귀 통과.
- **단계 범위**: 1차만 완료, 2~9차 신규 기능 및 운영 배포는 이번 단계에서 미수행.
- **관련 파일**: [구조 점검 보고서](file:///J:/sh/PROJECT_STRUCTURE_AUDIT_2026-09-17.md), [회귀 검사](file:///J:/sh/tests/stage-one-baseline.cjs), [보호 기준](file:///J:/sh/tests/stage-one-source-baseline.json).


## 작업 20260917-2차환영보완 / 2026-09-17 08:57
- **사용자 요청 사항**: 기존 UI를 유지한 캐릭터 환영 인사 및 실제 음원 연결 구조, 다시 듣기.
- **수행 내역**: 첫 홈 표시 후 환영 안내, 캐릭터별 대사, 세션 반복 방지, 홈페이지 다시 듣기, MP3/WAV 순차 재생 설정과 취소·실패 처리. 실제 음원 없음은 안내로 처리, 신규 TTS 없음.
- **검증**: 4개 화면 크기, 기존 프로그램·기록·파일방·서류 회귀, 모의 재생 순서·닫기·재생 거부, Vercel build 통과.
- **범위**: 2차 커밋까지. 운영 push/배포와 3차 수정 미수행.
- **관련 파일**: [2차 보고서](file:///J:/sh/WELCOME_STAGE2_REPORT_2026-09-17.md), [환영](file:///J:/sh/js/welcome-greeting.js), [녹음 설정](file:///J:/sh/js/welcome-recordings.js).


## 작업 20260917-3차오전흐름 / 2026-09-17 09:01
- **사용자 요청 사항**: 기존 콘텐츠를 재사용한 인사·날짜·기분·체조·인지활동·마무리 및 큰 버튼/공통 이동.
- **수행 내역**: 기존 6단계 유지, 지정 문구/마무리 활동 버튼 반영, 이전 버튼 최소 높이 64px, 오전 인사의 자동 TTS 호출 제거. 새 콘텐츠·DB·API 없음.
- **검증**: 390/768/1024/1440px 모든 단계 홈 이동·글자/버튼 크기·서울 날짜·캐릭터 역할, 기존 체조/기억 놀이·선생님 기록·파일방·서류 회귀 통과. 로드 JS 34개 문법 및 Vercel production build 통과.
- **관련 파일**: [3차 보고서](file:///J:/sh/MORNING_STAGE3_REPORT_2026-09-17.md), [프로그램](file:///J:/sh/js/morning-program.js), [스타일](file:///J:/sh/css/morning-program.css), [검사](file:///J:/sh/tests/morning-stage3.cjs).
- **범위**: 3차 커밋에서 종료. push/운영 배포 미수행.


## 작업 20260917-4차친구들방 / 2026-09-17 09:09
- **사용자 요청 사항**: 기존 UI를 유지한 콩이·토리·나비·보리 방 4개 및 공통 이동.
- **수행 내역**: 기존 AI 친구 영역 진입 버튼, 네 개의 큰 선택 카드, 캐릭터별 색상/소품과 원본 이미지, 홈/목록 복귀. 새 라이브러리·음성·저장 데이터 변경 없음.
- **검증**: 390/768/1024/1440px 네 방·소품·원본 이미지·넘침·공통 이동·저장 불변 검사, 전체 기존 회귀 검사 및 35개 JS 문법·Vercel build 통과.
- **관련 파일**: [4차 보고서](file:///J:/sh/CHARACTER_ROOMS_STAGE4_REPORT_2026-09-17.md), [방](file:///J:/sh/js/character-rooms.js), [스타일](file:///J:/sh/css/character-rooms.css), [검사](file:///J:/sh/tests/character-rooms.cjs).
- **범위**: 4차 커밋에서 종료. 5차 옷 입히기·6차 인지활동 및 push/운영 배포 미수행.


## 작업 20260917-5차옷입히기 / 2026-09-17 09:20
- **사용자 요청 사항**: 캐릭터 방에서 한 번 눌러 옷 변경, 5개 카테고리·7벌, 반응·저장·기본 복원.
- **수행 내역**: 별도 wardrobe 스크립트/스타일, 기존 이미지 옷 부분에만 SVG 색상·무늬·칼라·단추·리본 적용. 원본 얼굴·손·신발 유지, 캐릭터별 localStorage 저장, 실패 안내 및 기본 운동복 완전 복원. 새 TTS 없음.
- **검증**: 네 캐릭터 7벌·새로고침·복원·모바일, 저장 오류/손상 JSON, 얼굴 픽셀 동일성, 기존 방·환영·오전·관리 기록·파일방·서류 회귀 통과. Vercel build 성공.
- **관련 파일**: [5차 보고서](file:///J:/sh/WARDROBE_STAGE5_REPORT_2026-09-17.md), [옷 입히기](file:///J:/sh/js/character-wardrobe.js), [스타일](file:///J:/sh/css/character-wardrobe.css), [기능 검사](file:///J:/sh/tests/character-wardrobe.cjs).
- **범위**: 기존 옷 형태를 활용한 MVP. 5차 커밋에서 종료, 6차 인지활동·push·운영 배포 미수행.

## 작업 20260917-6차옷인지활동 / 2026-09-17 09:28
- **사용자 요청 사항**: 기존 옷 입히기를 유지한 계절·색깔·상황별 인지활동과 완료 후 미리보기.
- **수행 내역**: 별도 활동 컴포넌트, 세 가지 한 문항 활동과 큰 선택 버튼, 실패를 강조하지 않는 반응·마무리. 기존 옷 선택·캐릭터별 저장 연동, 옷 입히기로 복귀. 새 TTS 없음.
- **검증**: 활동 선택·반응·저장·복귀, 390/768/1024/1440px 화면, 기존 옷 입히기 및 전체 기존 기능 회귀 검사 통과. Vercel production 로컬 build 성공.
- **미리보기**: http://127.0.0.1:8085/ 의 콩이 방 계절 옷 고르기 화면을 앱 브라우저에 표시함.
- **관련 파일**: [6차 보고서](file:///J:/sh/CLOTHING_STAGE6_REPORT_2026-09-17.md), [인지활동](file:///J:/sh/js/clothing-activities.js), [스타일](file:///J:/sh/css/clothing-activities.css), [검사](file:///J:/sh/tests/clothing-activities.cjs).
- **범위**: 4~6차 기능 완료 및 로컬 미리보기. 커밋 후 종료, 원격 push·운영 배포 미수행.

## 7차 어르신·선생님 공간 분리 / 2026-09-17 09:31
- 요청 및 수행: 홈 주요 활동 바로가기 정리, 기존 선생님 공간·관리 기능 유지, 기존 UI 스타일 재사용.
- 관련 파일: [메뉴](file:///J:/sh/js/senior-experiences.js), [스타일](file:///J:/sh/css/senior-experiences.css).
- 검증: JS 문법 확인. 전체 기능 및 반응형 검사는 8~9차에서 수행.


## 8차 치매 친화 UI 점검 / 2026-09-17 09:35
- 요청 및 수행: 기존 색상·카드 유지, 64px 이상 버튼·큰 제목과 설명, 간격·키보드 초점·반응형 보완, 반짝임 제거 및 느린 모션.
- 검증: 390/768/1024/1440/1920px 홈·선생님 공간 이동, 기존 환영·오전·기록·서류·옷입히기·인지활동 검사 통과, Vercel 로컬 production build 성공.
- 관련 파일: [접근성](file:///J:/sh/css/senior-accessibility.css), [검사](file:///J:/sh/tests/senior-experiences.cjs).


## 9차 전체 점검 / 2026-09-17 09:36
- 요청 및 수행: 전체 기능 검사·정적 자산과 문법 검사·Vercel build 성공. production branch main 확인. GitHub push 및 자동 배포 진행.
- 관련 파일: [최종 보고서](file:///J:/sh/FINAL_STAGE9_REPORT_2026-09-17.md).


## 9차 운영 배포 검증 완료 / 2026-09-17 09:38
- 수행: GitHub main push 성공, Vercel 자동 production READY. 운영 주소에서 A/B/C 흐름·옷 저장·반응형 검사 모두 통과. 주요 실행 오류 없음.
- 관련 파일: [배포 검증 보고서](file:///J:/sh/FINAL_STAGE9_REPORT_2026-09-17.md).
- 운영 주소: https://school-tau-pearl.vercel.app/


## 재가요양 추천 MVP 1차 / 2026-09-17 09:55
- **사용자 요청 사항**: 직원 입력 선호·활동 가능 형태·주제·시간·주의사항 기반 규칙 추천. 기존 UI·데이터 유지.
- **수행 내역**: 직원 전용 메뉴, 대상자별 프로필, 3~4개 추천·이유·직원 확인·다른 추천·직접 선택·기존 콘텐츠 순차 진행, 최근 3회 이력. 의료 추론·새 AI API 없음.
- **검증**: 가상 A/B/C, 시간·조건·주의사항, 대상자별 저장·시작/완료/중단·직접 선택, 저장 실패·손상 보존, 모바일/태블릿 및 기존 기능 회귀 통과. 로컬 Vercel build 성공.
- **관련 파일**: [상세 보고서](file:///J:/sh/HOME_CARE_MVP_REPORT_2026-09-17.md), [추천 규칙](file:///J:/sh/js/home-care-recommendations.js), [추천 화면](file:///J:/sh/js/home-care-experience.js).
- **범위**: 로컬 MVP·커밋까지. 운영 push·배포 미수행.


## 회상활동 이미지 승인 규칙 / 2026-09-17 10:06
- **요청 사항**: 질문과 정확히 일치하는 승인 이미지만 표시, 임의 대체 금지.
- **수행 내역**: 11개 기존 이미지 메타데이터·59개 질문 연결표, 승인·경로·질문·주제 일치 검사. 승인 기록 없는 사진은 숨기고 준비된 사진이 없습니다 표시. 선택 후 이미지 및 추천 복사 장면도 보호.
- **관련 파일**: [운영 규칙](file:///J:/sh/REMINISCENCE_IMAGE_RULES.md), [메타데이터](file:///J:/sh/js/reminiscence-image-manifest.js), [승인 검사](file:///J:/sh/js/reminiscence-image-policy.js), [수업 엔진](file:///J:/sh/js/lesson-engine.js).
- **검증**: 규칙 단위 검사 및 로컬 Vercel build 성공. 브라우저와 기존 기능 회귀 검사 결과는 아래 최종 기록에 추가.
- **범위**: 로컬 수정·릴리즈 동기화. 운영 배포 미수행.


- **최종 검증 완료 / 10:07**: 회상 이미지 브라우저 검사(사진·선택지·복사 장면·모바일), 재가요양 추천 흐름, 기존 전체 회귀 검사 통과. 로드 JS 42개 문법 및 Vercel 로컬 build 성공. 기존 테스트의 비동기 화면 표시 대기를 보완함.


## 홈 기분 확인 영역 토리 사진 제거 / 2026-09-17 10:08
- **사용자 요청 사항**: 기존 UI를 유지하고 첨부한 기분 확인 영역의 토리 사진만 제거.
- **수행 내역**: 해당 이미지 태그 1개 제거, 문구·기분 버튼·CSS 유지. 스크립트 캐시 버전 갱신.
- **검증**: 정확히 해당 이미지 1개 제거 확인 및 JS 문법 검사 통과.
- **관련 파일**: [홈 화면](file:///J:/sh/js/senior-finish.js), [페이지](file:///J:/sh/index.html).
- **범위**: 로컬 저장 및 릴리즈 동기화. 운영 배포 미수행.


## 흘러가는 옛 노래 오디오 수정 / 2026-09-17 10:15
- **요청 사항**: 기존 UI 유지, 원인 확인 후 노래 미재생 문제만 수정.
- **원인**: 실제 음원 및 audio src 없음. 기존 버튼은 음성 음소거 설정에 영향받는 다른 곡의 합성 반주를 호출하고 실제 재생과 무관하게 재생 표시함.
- **수행 내역**: 실제 파일용 audio·클릭 재생·정지/완료 이벤트·promise 오류 처리·없는 파일 안내. 실제 음원 미추가, 가짜 경로 없음.
- **검증**: 테스트 전용 메모리 WAV로 재생/일시정지/재시작·음량·음소거·404·차단 오류 검사 통과.
- **관련 파일**: [점검 보고서](file:///J:/sh/OLD_SONG_AUDIO_REPORT_2026-09-17.md), [재생 처리](file:///J:/sh/js/old-song-player.js).
- **범위**: 파일 부재로 실제 노래 청취는 불가. 로컬 저장·릴리즈 동기화, 운영 배포 미수행.


- **최종 검증**: 오디오 오류/상태 테스트, 기존 오전 프로그램·체조·기억활동 연결 검사, Vercel 로컬 production build 모두 통과. 실음원 파일은 없음.


## 환영 음성 버튼 조건부 표시 / 2026-09-17 10:26
- **사용자 요청 사항**: 실제 환영 음원이 없으면 인사 다시 듣기와 미등록 안내를 숨기고 기존 UI 유지.
- **수행 내역**: 실제 파일 목록 자동 생성·갱신, 음원 존재 시에만 버튼 표시, 없는 파일 요청 방지. 캐릭터·스타일·오늘 프로그램 및 환영 문구 유지, TTS 미사용.
- **검증**: 음원 없음/추가/삭제, 테스트 오디오 재생, 모바일·태블릿·PC 환영 흐름 및 Vercel 로컬 production build 통과. 실제 사람 음성은 미등록.
- **관련 파일**: [상세 보고서](file:///J:/sh/WELCOME_AUDIO_VISIBILITY_REPORT_2026-09-17.md), [환영 화면](file:///J:/sh/js/welcome-greeting.js), [음원 목록](file:///J:/sh/js/welcome-recordings.js), [파일 검사](file:///J:/sh/scripts/welcome-recordings.cjs).
- **범위**: 로컬 저장·릴리즈 동기화 완료. 운영 push·배포 미수행.

## 옛 노래 YouTube 바로 연결 / 2026-09-17 10:28
- **사용자 요청 사항**: 노래 듣기 버튼에서 바로 YouTube 영상으로 이동.
- **수행 내역**: 기존 원본 영상 링크를 큰 노래 듣기 버튼에 연결. 새 탭으로 열며 음원 미등록 안내 숨김. 기존 색상·카드·배치 유지.
- **검증**: JS 문법 검사, 기존 URL 새 탭 이동 브라우저 검사. 외부 영상 응답은 테스트에서 대체했으므로 YouTube 영상 자체의 재생 가능 여부는 검사하지 않음.
- **관련 파일**: [재생 처리](file:///J:/sh/js/old-song-player.js), [수업 화면](file:///J:/sh/js/lesson-engine.js), [이동 검사](file:///J:/sh/tests/old-song-youtube.cjs).
- **범위**: 로컬 반영·릴리즈 동기화. 운영 배포 미수행.

## 캐릭터별 실제 음성 재생 / 2026-09-17 10:42
- **사용자 요청 사항**: 기존 UI·이미지를 유지하며 콩이/토리/나비/보리 개별 음성, 상황별 파일, 단일 재생, 일시정지·다시 듣기 추가.
- **수행 내역**: public/audio/characters/ 아래 4개 폴더 생성. welcome/activity/goodjob MP3·WAV 실파일 목록 검사, 로컬 실시간 목록·빌드 자동 생성. 별도 CharacterAudioPlayer와 전용 CSS 추가. 환영 화면·오늘 프로그램·친구들 방·AI 친구 선택·홈 음성 버튼 연결. 기본 음량 0.7, 재생 시 해당 캐릭터만 scale 1.03과 그림자 강조. 종료·일시정지·화면 이탈 시 복원.
- **음성 정책**: 사용자 클릭 시에만 재생. 실제 파일 없으면 새 컨트롤 숨김, 기존 홈 듣기 버튼 비활성화. 캐릭터 인사에서 기존 합성 음성 호출 제거. 녹음 파일이나 AI 대체 음성을 생성하지 않음.
- **검증**: 390/768/1024/1440px에서 4명 개별 재생·캐릭터 전환·단일 재생·일시정지·다시 듣기·종료 복원·방 연결·활동 파일 선택·파일 삭제 검사 통과. 음원 없음·잘못된 헤더 제외, 기존 환영 화면/오늘 프로그램/선생님 공간 회귀 통과. 재생 검사는 테스트 메모리 WAV 사용, 실제 녹음 미등록.
- **관련 파일**: [등록 안내 및 대사](file:///J:/sh/public/audio/characters/README.md), [재생 컨트롤러](file:///J:/sh/js/character-audio-player.js), [파일 검사](file:///J:/sh/scripts/character-recordings.cjs), [브라우저 검사](file:///J:/sh/tests/character-audio.cjs).
- **범위**: 로컬 저장, 릴리즈 폴더 동기화, GitHub 원격 저장소(`origin/main`) 푸시 및 Vercel 프로덕션 배포 완료 (`https://school-tau-pearl.vercel.app`).
- **최종 빌드**: Vercel 프로덕션 빌드 성공 및 실서버 배포 완료.



## 사회복지사 대시보드 통계·돌봄 일지 실데이터 연동 및 접근성 강화 / 2026-09-17 11:40
- **사용자 요청 사항**:
  1. 사회복지사 대시보드의 통계(총 참여 수업, 완료율, 긍정 기분 지수, 이용자 수) 및 "돌봄 일지" 표 실제 사용 기록과 연동.
  2. 이용자가 수업 완료 시 총 참여 수업 +1 증가 및 돌봄 일지(일시, 이용자명, 수업명, 완료 여부, 선택한 기분, 도움 필요 여부, 활동 시간) 실제 행 추가.
  3. 이용자 선택 드롭다운에 등록된 어르신 목록을 채우고, 특정 어르신 선택 시 필터링 연동.
  4. 긍정 기분 지수 실제 기분 응답 비율로 계산.
  5. 접근성: 글자 크기 조절(보통/크게/아주크게), 고대비 모드, 최소 44px 터치 타깃, 천천히 속도 조절 실제 음성/화면 감속 연동.
- **수행 내역**:
  - `js/record-manager.js`: 초기 시드 데이터 안전 로드, `getCareStats` 실시간 계산 로직 개선(긍정 키워드 10종 판별), `getRegisteredLearners()` 등록 어르신 목록 반환, `saveRecord()` 시 `care-record-updated` 이벤트 발송.
  - `js/app.js`: 드롭다운 필터링 및 통계/일지 테이블 실시간 렌더링, 글자 크기(보통/크게/아주크게) 및 고대비 모드 토글/저장, 천천히 모드 화면 애니메이션 감속(`slow-motion-mode`) 연동.
  - `index.html`: 상단 접근성 컨트롤 바에 글자 크기(`btnFontSize`) 및 고대비(`btnHighContrast`) 버튼 추가.
  - `css/senior-accessibility.css`: 모든 인터랙티브 요소 최소 44px 터치 타깃 보장, 글자 크기 스케일링 클래스(`font-scale-large`, `font-scale-xlarge`), 고대비 테마 스타일(`high-contrast-mode`), 천천히 모드 감속 스타일(`slow-motion-mode`) 구현.
- **검증**:
  - `tests/care-dashboard-test.cjs` 단위/통합 테스트 통과 (초기 시드 5건 로드, 학습자 목록, 필터링, 수업 완료 시 통계 +1 증가, 긍정 기분 지수 계산 검증).
  - 브라우저 서브에이전트 실환경 검증 완료.
- **관련 파일**: [기록 관리자](file:///J:/sh/js/record-manager.js), [메인 앱 스크립트](file:///J:/sh/js/app.js), [수업 엔진](file:///J:/sh/js/lesson-engine.js), [접근성 스타일](file:///J:/sh/css/senior-accessibility.css), [헤더 및 마크업](file:///J:/sh/index.html), [통합 테스트](file:///J:/sh/tests/care-dashboard-test.cjs).

## 7대 핵심 기능 종합 점검·개인정보처리방침·SNS 메타태그 구현 / 2026-09-17 12:05
- **사용자 요청 사항**:
  1. 음성/속도 컨트롤 점검 및 Web Speech API 연동 ("천천히" 0.7 배속, 일시정지/다시 듣기 제어).
  2. 체조 영상(20분 MP4) 재생 점검, 포스터 표출 및 모바일/저속 네트워크 최적화.
  3. 8대 수업 카드 콘텐츠 성격 점검 (정적 큐레이션 vs 생성형 AI) 및 하이브리드 전략 정리.
  4. 접근성(글자 크기 3단계, 고대비 모드, 최소 44px 터치 타깃, alt/aria-label) 점검.
  5. 보호자 보고서 및 관리자 설정 점검.
  6. 개인정보처리방침 공지/모달(수집항목, 이용목적, 5년 법정보관, 열람/삭제권) 추가.
  7. SNS 공유용 Open Graph 및 Twitter 카드 메타태그 추가.
- **수행 내역**:
  - `index.html`: Open Graph (`og:type`, `og:title`, `og:description`, `og:image`, `og:url`) 및 Twitter 카드 메타태그 추가, 사이트 푸터 및 `<dialog id="privacyModal">` 개인정보처리방침 모달 다이얼로그 추가.
  - `js/app.js`: `initPrivacyModal()` 함수 구현 및 열기/닫기/확인 이벤트 바인딩.
  - `js/voice.js`: 천천히 모드 rate `0.70`, 보통 모드 rate `0.98` 동기화 및 일시정지/재개/다시듣기 Web Speech API 제어 확인.
  - `css/senior-accessibility.css`: 최소 44px 터치 타깃, 글자 크기 스케일링, 고대비 및 슬로우 모션 스타일 보장.
- **검증**:
  - 브라우저 서브에이전트 실환경 검증 (음성 속도 토글, 글자 크기 순환, 고대비 모드 토글, 20분 체조 영상 재생 및 타이머 작동, 개인정보처리방침 모달 열기/닫기, 선생님/케어 대시보드 통계 및 일지 확인 완료).
- **관련 파일**: [메인 마크업](file:///J:/sh/index.html), [앱 컨트롤러](file:///J:/sh/js/app.js), [음성 엔진](file:///J:/sh/js/voice.js), [접근성 스타일](file:///J:/sh/css/senior-accessibility.css).


## Three.js 3D 캐릭터 렌더러 히어로 통합 및 배포 완료 / 2026-09-17 12:17
- **사용자 요청 사항**: 이전 세션 미완료 작업 이어서 완료.
- **수행 내역**:
  - `index.html` 히어로 영역 3D 캔버스 컨테이너(`hero3DContainer`) 삽입, 2D Fallback 이미지 공존.
  - `js/vendor/three.min.js` + `js/character-3d-renderer.js` 스크립트 연결 및 초기화.
  - `school-release/` 동기화 (4개 신규 파일 + 8개 수정 파일).
- **3D 렌더러**: 콩이·토리·나비·보리 로우폴리 3D, 손인사/Idle 애니메이션, WebGL Fallback.
- **배포**: GitHub `99db793` 푸시, Vercel `dpl_HAsWyzvTGZydpaY7fgVLXS1gAyCa` READY.
- **운영 주소**: https://school-tau-pearl.vercel.app/

## 3D 캐릭터 관절/피벗 꺾임 현상 수정 및 자연스러운 인사 모션 개선 / 2026-09-17 13:30
- **사용자 요청 사항**: 콩이/토리/나비/보리 3D 캐릭터의 인사 애니메이션에서 팔다리/관절이 이상한 각도로 꺾이는 현상 디버깅 및 수정.
- **수행 내역**:
  - `js/character-3d-renderer.js`: 어깨, 팔꿈치, 손, 골반 및 무릎 관절의 피벗 오프셋 정밀 재조정 (부모-자식 계층 그룹 기반 피벗 분리). 오일러 각 짐벌락 방지 및 쿼터니언/삼각함수 스무딩(Cubic ease) 적용.
  - `school-release/` 동기화 완료.
- **관련 파일**: [3D 렌더러](file:///J:/sh/js/character-3d-renderer.js), [3D CSS](file:///J:/sh/css/character-3d.css).

## Live2D 음성 인터랙티브 가상 에이전트 웹 애플리케이션 구축 (`live2d-agent/`) / 2026-09-17 14:00
- **사용자 요청 사항**: Live2D Cubism Web SDK 및 WebGL 기반 2.5D 캐릭터 렌더링 프론트엔드 프로젝트 구조 및 음성 상호작용(STT+TTS) 에이전트 구축.
- **수행 내역**:
  - `live2d-agent/index.html`: WebGL Live2D 캔버스, 헤더 상태 뱃지, 채팅 오버레이, interim 음성 텍스트 표시기, 마이크 펄스 버튼, 다국어 메뉴, 토스트 알림.
  - `live2d-agent/css/style.css`: 글래스모피즘(`backdrop-filter`), 네온 글로우, 오디오 비주얼라이저 물결 애니메이션, 반응형 레이아웃.
  - `live2d-agent/js/live2d-manager.js`: PixiJS v6 + `pixi-live2d-display` Cubism 4 로더 및 Canvas 2D 고해상도 캐릭터 Fallback 렌더러.
  - `live2d-agent/js/speech-agent.js`: Web Speech API (`SpeechRecognition` + `SpeechSynthesis`) 엔진, 다국어 처리, 지능형 컨텍스트 응답.
  - `live2d-agent/js/app.js`: Live2DManager + SpeechAgent 상태 머신 코디네이터, 별빛 파티클 배경, 키보드 단축키(Space/Esc).
  - `live2d-agent/models/README.md`: 실제 Cubism 4 모델 파일 배치 가이드.
- **검증**: 로컬 HTTP 서버(`http://127.0.0.1:3001`) 구동 및 UI 무결성 검증 완료.
- **관련 파일**: [에이전트 마크업](file:///J:/sh/live2d-agent/index.html), [에이전트 스타일](file:///J:/sh/live2d-agent/css/style.css), [Live2D 매니저](file:///J:/sh/live2d-agent/js/live2d-manager.js), [음성 엔진](file:///J:/sh/live2d-agent/js/speech-agent.js), [메인 앱 코디네이터](file:///J:/sh/live2d-agent/js/app.js), [모델 가이드](file:///J:/sh/live2d-agent/models/README.md).

## 캐릭터 웨이크워드(호출어) & 단문 명령어 음성인식 엔진 구축 / 2026-09-17 14:10
- **사용자 요청 사항**: 기존 UI/스타일 100% 보존 전제 하에 캐릭터 호출어("콩이야/토리야/나비야/보리야"), VOICE READY ↔ LISTEN 상태 머신, 정해진 단문 명령어("네", "아니오", "다음", "다시 할래요") 분기 및 3회 실패 시 대체 입력 유도 구현.
- **수행 내역**:
  - `js/character-voice-recognizer.js`: STT 추상화 프로바이더, 웨이크워드 감지 엔진, 단문 명령어 패턴 매칭 및 화면 인터랙션 연동.
  - `index.html`: 스크립트 연결.
  - `school-release/` 동기화 완료.
- **검증**: `tests/character-voice-recognizer-test.cjs` 테스트 전 항목 통과.
- **배포 완료**: GitHub main `dce4811` 푸시 완료, Vercel Production `dpl_54nUJQWWkHZbNJyXiWi1tQbSwVVV` READY.
- **운영 사이트**: https://school-tau-pearl.vercel.app/
- **관련 파일**: [음성인식 엔진](file:///J:/sh/js/character-voice-recognizer.js), [메인 마크업](file:///J:/sh/index.html).

## 홈 화면 AI 친구 콩이 CSS 미세 애니메이션(숨쉬기·그림자 동기화·진입 튕김) 구현 / 2026-09-17 14:17
- **사용자 요청 사항**: 단일 이미지 `friend-kongi-talk.png`에 CSS만으로 3~4초 주기 미세 상하 숨쉬기(2~4px), 바닥 그림자 수축/팽창 연동, 페이지 로드 시 진입 통통 튕김 애니메이션 적용.
- **수행 내역**:
  - `css/main.css` & `css/character-3d.css`: `@keyframes kongiArriveBounce`, `@keyframes kongiGentleBreathe` (3.4s ease-in-out), `@keyframes kongiGroundShadow` (바닥 타원 그림자 가상 요소) 구현.
  - `school-release/` 동기화 완료.
- **검증**: 브라우저 실환경 점검 완료.
- **관련 파일**: [메인 CSS](file:///J:/sh/css/main.css), [3D 캐릭터 CSS](file:///J:/sh/css/character-3d.css).

## [2단계] 4인 AI 캐릭터(콩이·토리·나비·보리) 2.5D 호흡 및 그림자 동기화 애니메이션 구현 / 2026-09-17 14:24
- **사용자 요청 사항**: 단일 이미지 기준 4인 캐릭터에 3.4초 주기 미세 상하 숨쉬기(2~4px), 바닥 그림자 수축/팽창 연동, 진입 튕김 모션 적용.
- **수행 내역**:
  - `css/welcome-greeting.css`, `css/main.css`, `css/character-3d.css`: 4인 캐릭터 공통 호흡 및 그림자 동기화 스타일 적용.
  - `school-release/` 동기화 완료.
- **검증**: 브라우저 실환경 점검 및 스크린샷 캡처 완료.
- **관련 파일**: [환영 스타일](file:///J:/sh/css/welcome-greeting.css), [메인 CSS](file:///J:/sh/css/main.css).

## 메인 안내자 AI 친구 콩이(안경·노란 트레이닝복) 플로팅 캐릭터 & 상황별 AI 음성 가이드 시스템 구현 / 2026-09-17 14:50
- **사용자 요청 사항**:
  - 첨부된 안경 쓴 콩이 PNG 이미지를 원본 비율/색상 유지 투명 배경으로 화면 우측 하단 상주 안내자로 적용.
  - 10개 상황별 음성 대화(첫인사, 수업시작, 활동선택, 격려, 칭찬, 회상, 음악, 체조, 종료) 및 시니어 친화적 음성 톤/미세 모션 구현.
  - Typecast API Key (`tc_681059782dc4759327e3d302`) 연동 및 호빈이/콩이 AI 보이스 스트리밍 및 Web Speech API 폴백 구현.
- **수행 내역**:
  - `assets/images/friend-kongi-companion.png`: 투명 배경 PNG 캐릭터 에셋 생성.
  - `css/companion-character.css`: 우측 하단 플로팅 독, 글래스모피즘 말풍선, 3.6s 호흡/그림자/손흔들기/박수/음악스웨이 모션.
  - `js/companion-character.js`: `CompanionCharacter` 모듈, Typecast AI 보이스 API (`tc_681059782dc4759327e3d302`) 연동 및 오디오 재생, 10대 시나리오 음성 대화(0.83배속 따뜻한 톤, 쉼, 격려), 자동 첫인사(1.5초 후), 무반응 40초 격려 트리거.
  - `server.cjs` & `.env`: Typecast TTS Proxy 엔드포인트 (`/api/tts/typecast`) 추가 및 환경변수 안전 관리.
  - `index.html`: 연결 및 `school-release/` 동기화 완료.
- **검증**: 브라우저 실환경 점검 및 스크린샷 캡처 완료 (Typecast API 및 Web Speech Fallback 정상 작동 확인).
- **배포 완료**: GitHub main `ba8acec` 푸시 완료, Vercel Production `dpl_7aQcP7NJ7tt8omtJY5Zyjd4QXRkX` READY.
- **운영 사이트**: https://school-tau-pearl.vercel.app/
- **관련 파일**: [동반자 캐릭터 CSS](file:///J:/sh/css/companion-character.css), [동반자 캐릭터 JS](file:///J:/sh/js/companion-character.js), [캐릭터 에셋](file:///J:/sh/assets/images/friend-kongi-companion.png), [서버 프록시](file:///J:/sh/server.cjs).

## [작업 13] 첫 화면 플로팅 '콩이와 대화하기' 위젯 제거 / 2026-09-17 14:58
- **사용자 요청 사항**: 첫 화면에 표시되는 플로팅 '콩이와 대화하기' 위젯 삭제.
- **수행 내역**:
  - `index.html`: `companion-character.css` 및 `companion-character.js` 링크/스크립트 태그 제거하여 화면 우측 하단 플로팅 독 및 말풍선 삭제.
  - `school-release/index.html` 동기화 완료.
  - GitHub `origin/main` 커밋 (`9b5c6fa`) 푸시 및 Vercel Production 배포 (`dpl_2NSNtWB5h8hDxScLYi1A8XHoUQ2n`) 완료.
- **검증**: 브라우저 실환경 확인 (플로팅 위젯 제거 및 기존 상단 히어로/메인 콘텐츠 정상 유지 확인).
- **관련 파일**: [메인 마크업](file:///J:/sh/index.html).

## [작업 14] 콩이 캐릭터 이미지 assets/images/friend-kongi.png로 교체 / 2026-09-17 15:10
- **사용자 요청 사항**: 첨부된 콩이(노란 곰/강아지 방울 캐릭터) 이미지를 `assets/images/friend-kongi.png`로 수정 및 프로젝트 전반 적용.
- **수행 내역**:
  - `assets/images/friend-kongi.png` 및 `assets/images/friend-kongi-talk.png`: 첨부된 새 콩이 이미지로 교체 저장.
  - `index.html`: 히어로 영역 fallback 2D 이미지 경로를 `assets/images/friend-kongi.png`로 수정.
  - `js/friends-and-play.js`, `js/weather-service.js`, `js/school-shell.js`, `js/lesson-engine.js`: 콩이 아바타 이미지 경로 일괄 동기화.
  - `school-release/` 릴리즈 폴더 동기화 완료.
  - GitHub `origin/main` 커밋 (`1fc5931`) 푸시 및 Vercel Production 배포 완료.
- **검증**: 파일 무결성 및 경로 참조 일치 확인.
- **관련 파일**: [콩이 이미지](file:///J:/sh/assets/images/friend-kongi.png), [메인 마크업](file:///J:/sh/index.html), [친구 선택 스크립트](file:///J:/sh/js/friends-and-play.js).

## [작업 15] 콩이 캐릭터 이미지 교체 (안경·노란 트레이닝복 캐릭터) / 2026-09-18 09:10
- **사용자 요청 사항**: 첨부된 안경 쓴 노란 트레이닝복 콩이 캐릭터로 프로젝트 내 콩이 이미지 전역 교체.
- **수행 내역**:
  - 사용자 첨부 고해상도 투명 배경 PNG 이미지를 `assets/images/friend-kongi.png`, `assets/images/friend-kongi-talk.png`, `assets/images/friend-kongi-companion.png`, `original_kongi.png`로 무손실 교체 저장.
  - 메인 히어로 2D 폴백, 오늘의 수업 아바타, AI 친구 선택(`js/friends-and-play.js`), 날씨 위젯(`js/weather-service.js`), 셸 화면(`js/school-shell.js`), 수업 엔진(`js/lesson-engine.js`) 등 모든 경로에 최신 콩이 에셋 동기화.
  - `school-release/` 릴리즈 폴더 동기화 완료.
- **검증**:
  - 이미지 해상도(655x661), RGBA 알파 투명 채널 및 파일 크기(455,872 bytes) 무결성 확인.
  - 단위 테스트 통과.
- **관련 파일**: [콩이 이미지](file:///J:/sh/assets/images/friend-kongi.png), [메인 마크업](file:///J:/sh/index.html), [친구 선택 스크립트](file:///J:/sh/js/friends-and-play.js).

## [작업 16] 홈 화면 히어로 콩이 캐릭터 노란 곰 3D 대신 최신 콩이 2D 전신 캐릭터로 전환 / 2026-09-18 09:20
- **사용자 요청 사항**: "친구 목소리 듣기" 버튼 위의 노란 곰 3D 캐릭터도 방금 첨부한 안경 쓴 노란 트레이닝복 콩이 캐릭터로 변경.
- **수행 내역**:
  - `index.html`: Three.js 3D 렌더러 자동 마운트 스크립트 및 3D 캔버스 컨테이너를 제거하고, 최신 고화질 콩이 2D 전신 캐릭터(`.kongi-character-wrap` > `#kongiHeroImg`)를 기본 표시하도록 전환.
  - `css/main.css`: `.hero-robot-img`의 원형 크롭 테두리를 제거하고 투명 배경 전신 캐릭터에 맞춰 `object-fit: contain`, 부드러운 드롭 섀도우 및 3.4초 주기 미세 호흡(`kongiGentleBreathe`) + 바닥 그림자 동기화 적용.
  - `school-release/` 릴리즈 폴더 동기화 완료.
- **검증**:
  - 홈 화면 메인 히어로 영역에 첨부된 최신 콩이 캐릭터가 투명 배경과 함께 선명하게 렌더링됨을 확인.
- **관련 파일**: [메인 마크업](file:///J:/sh/index.html), [메인 CSS](file:///J:/sh/css/main.css), [콩이 이미지](file:///J:/sh/assets/images/friend-kongi.png).

## [작업 17] 콩이 환영 음성 및 실시간 립싱크(입모양 연동) 발화 시스템 구현 / 2026-09-18 09:28
- **사용자 요청 사항**: 첨부된 콩이 캐릭터를 이용하여 *"안녕하세요, 여러분! 디지털 AI학교에 오신 것을 환영합니다."* 라는 음성을 입모양(립싱크)에 맞추어 발화.
- **수행 내역**:
  - `assets/images/friend-kongi.png`: 평상시 대기 상태의 다문 미소 표정 에셋 배치.
  - `assets/images/friend-kongi-talk.png`: 발화 시 열린 입 표정 에셋 배치.
  - `js/voice.js`: 콩이 공식 greeting 문구 업데이트.
  - `js/friends-and-play.js`: 180ms 최적 주기 립싱크 타이머 구현, 발화 시 몸통 바운스 및 입모양 실시간 전환, `window.speakKongiGreeting()` 바인딩 완료.
  - `school-release/` 릴리즈 폴더 동기화 완료.
- **관련 파일**: [음성 엔진](file:///J:/sh/js/voice.js), [친구 스크립트](file:///J:/sh/js/friends-and-play.js), [콩이 기본 이미지](file:///J:/sh/assets/images/friend-kongi.png).

## [작업 18] 콩이 배경 투명화 일체화 및 말할 때 팔 내리기 모션 에셋 적용 / 2026-09-18 09:37
- **사용자 요청 사항**: 캐릭터 배경을 홈페이지 상단 배경과 자연스럽게 맞추고, 말할 때 안경을 잡던 손(보는 사람 기준 왼쪽 팔)을 내린 포즈로 변경.
- **수행 내역**:
  - `assets/images/friend-kongi-talk.png`: 안경 잡던 팔을 자연스럽게 내리고 활짝 웃으며 말하는 포즈의 2.5D 캐릭터를 100% 투명 배경(RGBA)으로 정밀 누끼 및 클린업하여 제작/교체.
  - 대기 시(`friend-kongi.png`): 안경을 만지며 은은하게 미소 짓는 포즈.
  - 말할 때(`friend-kongi-talk.png`): 양 팔을 가지런히 내리고 입을 열어 활기차게 말하는 포즈.
  - 상단 히어로 배너 배경과 100% 투명 일체화 완료.
  - `school-release/` 릴리즈 폴더 동기화 완료.
- **관련 파일**: [콩이 말하기 에셋](file:///J:/sh/assets/images/friend-kongi-talk.png), [콩이 대기 에셋](file:///J:/sh/assets/images/friend-kongi.png), [메인 CSS](file:///J:/sh/css/main.css).

## [작업 19] 콩이 정밀 눈 깜빡임(2~3초 주기) & 실시간 립싱크 애니메이션 엔진 및 말하기 테스트 구축 / 2026-09-18 09:55
- **사용자 요청 사항**: 승인된 오버레이 파츠를 기반으로 2~3초 주기 눈 깜빡임, 말하기 애니메이션 함수(`startKongiTalkingAnimation`), 테스트용 버튼(`💬 말하기 테스트`), 부드러운 대기 숨쉬기 모션 구현 및 브라우저 실환경 검증.
- **수행 내역**:
  - `assets/images/kongi-parts/extracted/eyes_closed_overlay.png` (눈 감음 오버레이), `mouth_talk_overlay.png` (입 오버레이) 정밀 배치.
  - `js/friends-and-play.js`: 2.2~3.5초 주기 눈 깜빡임 타이머, `window.startKongiTalkingAnimation()` 립싱크 엔진, `💬 말하기 테스트` 버튼 추가.
  - `index.html` & `css/main.css`: 오버레이 마크업 및 애니메이션 스타일 반영.
  - `school-release/` 릴리즈 폴더 동기화 완료.
- **관련 파일**: [친구 스크립트](file:///J:/sh/js/friends-and-play.js), [메인 CSS](file:///J:/sh/css/main.css), [눈 감은 파츠](file:///J:/sh/assets/images/kongi-parts/extracted/eyes_closed_overlay.png).

## [작업 20] 콩이 눈 깜빡임 좌우 속도/높이 불일치 완벽 수정 (100% 거울 대칭 동시 하강) / 2026-09-18 10:07
- **사용자 요청 사항**: 기존 UI 유지 전제 하에, 눈 깜빡일 때 좌우 눈꺼풀이 내려오는 속도와 위치가 서로 다른 현상 완벽 수정.
- **수행 내역**:
  - `assets/images/kongi-parts/extracted/eyes_closed_overlay.png`: 좌안 기준 정밀 눈웃음 곡선을 수평 반전 미러링하여 좌우 눈꺼풀의 y좌표(208px), 곡률, 속눈썹 라인을 100% 완전 거울 대칭으로 재조정.
  - `css/main.css`: `.kongi-eyes-overlay`의 전환을 `0.02s linear`로 조정하여 양쪽 눈이 시차 없이 동시에 부드럽게 깜빡이도록 최적화.
  - `school-release/` 릴리즈 폴더 동기화 완료.
- **관련 파일**: [눈 감은 대칭 파츠](file:///J:/sh/assets/images/kongi-parts/extracted/eyes_closed_overlay.png), [메인 CSS](file:///J:/sh/css/main.css).

















---

## 📌 [작업 7] 실시간 3D 콩이 아바타 플랫폼 구현 및 Meshy AI 3D GLB 모델 연동 / 2026-09-18 10:23
- **사용자 요청 사항**: Three.js와 GLTFLoader, Web Audio API 주파수 분석기(Analyser), 모프 타겟/오디오 리액티브 모션, 환영 음성 발화가 포함된 실시간 3D 아바타 플랫폼 페이지 구축 및 3D 모델 연동.
- **수행 내역**:
  - `assets/models/kongi_3d.glb`: 사용자 다운로드 3D 캐릭터 모델(`Meshy_AI_Cute_Puppy_Character_0918011705_image-to-3d-texture.glb`)을 프로젝트 에셋 경로로 무손실 임포트.
  - `avatar-3d.html`:
    - Three.js, GLTFLoader, OrbitControls CDN 로드 및 자동 씬/스튜디오 조명(Ambient + Key + Fill + 38bdf8 림라이트 + 사이버 원형 스테이지) 구성.
    - 바운딩 박스 기반 3D 캐릭터 자동 센터링 및 높이/스케일 최적화.
    - Web Audio API `createAnalyser()` 및 Web Speech API TTS, 실시간 마이크 립싱크 모드(`navigator.mediaDevices.getUserMedia`) 연동.
    - 발화 및 오디오 볼륨 진폭에 연동되는 3D 콩이 모션(미세 호흡, 바운스, 헤드 끄덕임, 볼륨 반응형 스케일 펄스, BlendShape 지원) 및 HUD 오디오 미터 구현.
    - 입장 오버레이 모달 및 '입장하기 & 음성 듣기' 원클릭 시작 인터랙션 구현.
  - `school-release/` 릴리즈 폴더 동기화 완료.
- **관련 파일**: [3D 아바타 플랫폼](file:///J:/sh/avatar-3d.html), [3D GLB 모델](file:///J:/sh/assets/models/kongi_3d.glb).
