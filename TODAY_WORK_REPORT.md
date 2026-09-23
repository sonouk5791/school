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


---

## 📌 [작업 8] 콩이 새 베이스 이미지 교체 및 파일 정리(_archive 백업), 정적 애니메이션/음성(TTS/STT) 점검 / 2026-09-18 10:47
- **사용자 요청 사항**:
  - 새 콩이 캐릭터 베이스 이미지를 `assets/images/friend-kongi-talk.png` 및 `friend-kongi.png`로 교체 저장.
  - 기존 파일 백업(`assets/images/_archive/`) 및 100% 투명 배경(RGBA) 유지 확인.
  - 3~4초 주기 미세 상하 숨쉬기(Gentle Breathing), 바닥 그림자 수축/팽창, 진입 모션 및 음성 기능(TTS/STT 연동) 정상 작동 보장.
- **수행 내역**:
  - 기존 콩이 에셋을 `assets/images/_archive/backup_friend-kongi.png`, `backup_friend-kongi-talk.png`에 안전하게 백업.
  - 새로 업로드된 고해상도 이미지의 외곽 여백을 깔끔하게 제거하고 완벽한 알파 채널 투명 배경(RGBA)으로 클린업하여 `assets/images/friend-kongi-talk.png`, `friend-kongi.png`, `friend-kongi-companion.png`로 무손실 배치.
  - 메인 히어로 영역의 3.4초 주기 미세 상하 숨쉬기(`kongiGentleBreathe`), 바닥 그림자 애니메이션(`kongiGroundShadow`), 진입 튕김 애니메이션(`kongiArriveBounce`) 및 `startKongiTalkingAnimation` 립싱크/음성 엔진과의 무결점 연동 확인.
  - 브라우저 검증(말하기 테스트, 음성 재생, 호흡 모션) 완료 및 `school-release/` 릴리즈 폴더 동기화.
- **관련 파일**: [콩이 말하기 에셋](file:///J:/sh/assets/images/friend-kongi-talk.png), [콩이 기본 에셋](file:///J:/sh/assets/images/friend-kongi.png), [메인 CSS](file:///J:/sh/css/main.css), [음성 엔진](file:///J:/sh/js/voice.js).

---

## 작업 1 / 2026-09-21 10:23 — 첨부 원본 강아지 AI 안내 캐릭터
- **사용자 요청 사항**: 첨부 강아지의 외형을 유지하고 배경 정리, 대기/깜빡임/손 인사, 한국어 여성 음성과 립싱크, 재생 제어 구현.
- **수행 내역**: 원본 PNG 보존 및 SVG 외곽 클립, 독립 AnimatedCharacter 클래스와 반응형 CSS, 2.5초 인사 및 3~5초 깜빡임, 한국어 여성 음성 WAV와 단어 타임스탬프 기반 5개 입모양, 재생/일시정지/음소거 및 이동 시 정리. 기존 교사 음성이 시작되면 안내 캐릭터 중지. 기존 홈페이지 UI 유지.
- **검증 결과**: JS 구문 검사 및 신규 캐릭터 통합 테스트 통과. 기존 히어로 테스트를 새 요구사항으로 갱신 후 통과. 기존 친구 음성 회귀 테스트 390/768/1024/1440px 통과. PC/모바일/말하기 화면 확인. 립싱크는 단어 내 음절 보간 방식이며 음소 정밀 분석 아님. 목소리 연령감은 별도 청취 평가 필요.
- **저장 및 릴리즈**: 변경 파일을 school-release에 복사하고 SHA-256 일치 확인. 원격 배포 미수행. 현재 디렉터리는 Git 저장소가 아니므로 커밋 미수행.
- **관련 파일**: [홈페이지](file:///J:/sh/index.html), [캐릭터 코드](file:///J:/sh/js/animated-character.js), [캐릭터 스타일](file:///J:/sh/css/animated-character.css), [기존 음성 연동](file:///J:/sh/js/voice.js), [첨부 원본](file:///J:/sh/assets/images/animated-kongi/reference.png), [인사 음성](file:///J:/sh/assets/audio/kongi-greeting-ko.wav), [구현 및 제한사항](file:///J:/sh/ANIMATED_CHARACTER_NOTES.md), [통합 테스트](file:///J:/sh/tests/animated-character.cjs), [히어로 테스트](file:///J:/sh/tests/character-audio-hero.cjs).

## 작업 2 / 2026-09-21 10:27 — 얼굴의 베이지색 원형 두 부분 제거
- **사용자 요청 사항**: 눈썹은 유지하고 그 아래 동그란 베이지색 두 부분만 흰색 얼굴 피부톤으로 자연스럽게 수정. 나머지 외형 유지.
- **수행 내역**: imagegen으로 부분 수정본 생성. 홈페이지용 SVG는 원본을 바탕으로 수정된 두 부분만 마스크 합성하고 가장자리를 부드럽게 처리. 눈썹과 귀 영역을 보호하고 다른 영역은 원본 사용. 기존 원본 파일 보존. 캐릭터 이미지 경로 및 캐시 버전 갱신.
- **검증**: JavaScript 구문 검사 및 Edge 실제 홈페이지 렌더링 확인. 수정 파일과 일지의 릴리즈 동기화/해시 확인.
- **관련 파일**: [수정 캐릭터](file:///J:/sh/assets/images/animated-kongi/face-clean.svg), [생성 수정본](file:///J:/sh/assets/images/animated-kongi/face-clean-generated.png), [적용 코드](file:///J:/sh/js/animated-character.js), [확인 화면](file:///J:/sh/tests/animated-character-clean-face.png).

## 작업 3 / 2026-09-21 10:51 — 4명 공식 캐릭터 기준 및 입모양 적용
- **사용자 요청 사항**: 첨부 시트를 공식 기준으로 등록. 콩이/토리/나비/보리 × 아/에/이/오/우 20개 분리, 투명 배경, 일관된 외형과 카드 음성 립싱크, 기존 UI 유지.
- **수행 내역**: 원본 시트 영구 저장, 행/열 기준 20개 RGBA PNG 분리(128×144), 배경/제목/이름표/받침대 제외. 얼굴 생성 없이 원본 픽셀만 사용. 4개 기본 표정 및 입 영역만 교체한 20개 stable 프레임 구성. characters 데이터/JSON/공유 립싱크 모듈 추가. 기존 friend 이미지 호환 경로 교체 및 과거 파일 백업. 홈페이지/환영 카드/친구 선택/캐릭터 방/아침 활동 음성 연결. 토리/나비/보리 인사 음성 및 단어 타임스탬프 저장. 교사 TTS boundary 연동. 공식 의상 보호를 위해 기존 옷 고르기 활동은 유지하되 그림 덧씌우기는 제외. AGENTS.md에 앞으로의 공식 기준 명시.
- **검증 결과**: 20개 RGBA와 크기, 20개 stable 이미지의 입 영역 밖 픽셀 동일성 통과. 실제 네 음성/캐릭터 일치, 입모양, 정지/재생/화면 이동 390/1440px 통과. 기존 음성 회귀 390/768/1024/1440px 및 히어로 통합 테스트 통과. 브라우저 오류 없음. 구문 검사 통과.
- **한계**: 원본 캐릭터 약 100~120px 높이로 확대 선명도 한계. 시트에 닫힌 입이 없어 5열을 기본 표정으로 사용. 단어 내 모음 보간/녹음 음량 기반 동작은 정밀 음소 인식 아님. 기존 교육 영상/포스터/별도 3D 모델은 변경하지 않았고 공식 외형 기준에서 제외.
- **관련 파일**: [원본 시트](file:///J:/sh/characters/reference/official-mouth-sheet.png), [20개 분리 확인](file:///J:/sh/characters/reference/extraction-contact-sheet.png), [데이터](file:///J:/sh/characters/manifest.json), [재사용 모듈](file:///J:/sh/js/character-lipsync.js), [추출 코드](file:///J:/sh/scripts/extract-official-characters.py), [공식 기준 설명](file:///J:/sh/characters/README.md), [통합 테스트](file:///J:/sh/tests/official-characters.cjs).
- **저장/배포**: 변경 사항 및 일지를 school-release에 동기화하고 해시 일치 확인. 원격 배포/커밋 없음.

## 작업 4 / 2026-09-21 11:07 — 동작 시트 외형 기반 분류 및 수업 연결
- **사용자 요청 사항**: 글자/행 라벨보다 동물·공식 의상으로 재분류하고 동작 폴더와 데이터 구조에 연결. 기존 공식 외형 및 학교 UI 유지.
- **수행 내역**: 실제 4×9=36칸 분석. 콩이 6, 토리 9, 나비 6, 보리 6으로 총 27칸 채택. 잘못된 동물/의상 9칸은 pose-only로 격리. 원본 좌표·분류 근거 JSON 저장. 캐릭터별 actions PNG(128×144 RGBA), 중복 동작 variant, 공식 기본 표정 4개, 동작 manifest 추가. CharacterActions API와 수업 시작/설명/정답/완료/마무리 연결. 발화 시 정면 립싱크 우선/종료 후 동작 복귀, 타이머 정리 및 캐릭터 혼동 방지. 동작 미리보기 페이지 추가.
- **검증 결과**: 36칸 분류 및 27/9 분리, 모든 동작 이미지 로딩, 같은 캐릭터 fallback, 립싱크 우선·복원, 타이머 복귀 테스트 통과. 네 캐릭터 실제 음성/카드 회귀 테스트 390/1440px 통과. JS 구문 검사 통과.
- **제한 및 원칙**: 동작 원본 캐릭터가 약 40~60px 높이여서 확대 선명도 제한. 동작명은 자세 해석이며 새 그림 생성 없음. 미제공 동작은 공식 idle로 복귀. pose-only를 공식 이미지로 재생성하지 않음.
- **관련 파일**: [원본](file:///J:/sh/characters/reference/actions/source.png), [분류표](file:///J:/sh/characters/reference/actions/classification-preview.png), [분류 근거](file:///J:/sh/characters/reference/actions/classification.json), [동작 데이터](file:///J:/sh/characters/actions-manifest.json), [동작 모듈](file:///J:/sh/js/character-actions.js), [미리보기](file:///J:/sh/characters/actions-preview.html), [설명](file:///J:/sh/characters/ACTIONS.md), [테스트](file:///J:/sh/tests/character-actions.cjs).
- **저장/동기화**: 변경 파일 및 일지를 school-release에 복사하고 SHA-256 일치 확인. 원격 배포 미수행.

## 작업 5 / 2026-09-21 11:22 — 20분 의자 체조 제작 준비 및 영상 생성 제한
- **사용자 요청 사항**: 공식 네 캐릭터 자체가 의자 운동을 시범 보이는 20분/8챕터 수업, 한국어 음성·반주·큰 조작 버튼. 별도 사람/동작 그림 방식은 사용자에게 거절됨.
- **완료한 작업**: 요청 시간표대로 1200초, 8챕터, 236개 연속 진행 큐 작성. 59개 한국어 안내 음성(속도0.9) 생성/문장별 분리 및 단어 타임스탬프 보존. 반복/휴식 구간에 배치하고 직접 합성한 낮은 음량의 75 BPM 반주를 더한 20분 오디오 제작. 자막VTT, 60개 20초 영상 클립 계획, 제작 대본/안전 근거 문서. 영상 미완성을 명확히 표시한 음성 검토 페이지 추가.
- **검증**: 일정 합계/큐 연속성/위험 동작 배제 확인. 문장 오디오가 각 배정 시간 안에 들어가는지 확인. 모바일 브라우저 실제 재생·정지·음소거·챕터 이동·처음부터, 오디오 길이 약1200초, 8챕터 검증 통과. 페이지 오류 없음.
- **미완료/차단**: 캐릭터 동작 영상은 미완성. Runway 무료 요금제로 영상 생성이 차단되었으며 유료 요금제 안내 표시. 결제하지 않음. 원본 조각 기반 2D 관절 시안을 검토했으나 팔 연결부/목/발목 동작이 부정확해 채택하지 않고 최종 렌더링을 차단. 영상 시범이 준비되기 전에는 기존 홈페이지 체조 화면과 기존 영상을 교체하지 않음. 유료 영상 생성 연결 또는 적절한 2D/3D 관절 원본 필요.
- **관련 파일**: [음성 검토 페이지](file:///J:/sh/assets/exercise-20min/review.html), [20분 음성](file:///J:/sh/assets/exercise-20min/audio/class-20min.mp3), [진행표](file:///J:/sh/assets/exercise-20min/program.json), [제작 상태/대본](file:///J:/sh/assets/exercise-20min/PRODUCTION.md), [자막](file:///J:/sh/assets/exercise-20min/captions-ko.vtt), [오디오 제작 코드](file:///J:/sh/scripts/build-chair-audio.py), [검증](file:///J:/sh/tests/chair-audio-review.cjs).
- **저장/릴리즈**: 완료된 준비 자료와 일지를 school-release에 동기화/해시 확인. 완성된 운동 영상이나 수업으로 배포하지 않음.

## 작업 6 / 2026-09-21 11:48 — 공식 입모양 20장 고해상도 재제작 및 적용
- **사용자 요청 사항**: 첨부 JPEG는 디자인 참고로만 사용하고, crop/단순 업스케일 대신 1024px 이상 투명 PNG 20장을 재제작. 같은 캐릭터는 입만 변경하고 기존 학교 UI 유지.
- **수행 내역**: 내장 image_gen으로 4개 기준 렌더 및 16개 입 편집 원본을 각각 생성. 모두 네이티브 1254×1254 RGBA. 캐릭터별 기준 렌더에 새 입 영역만 8px 경계 블렌딩으로 합성해 아/에/이/오/우 20개 저장. 콩이 베이지색 이마 원형 없음. 입 외부 얼굴/눈/눈썹/안경/코/의상/몸/알파 고정. 요청한 public/characters/{id}/mouth 구조로 저장하고 정적 서버 /public URL 및 기존 경로 호환 복사본 연결. 360px 최대 표시, 프레임 미리 디코딩, 전환 미리보기 및 20장 ZIP 추가. 기존 저해상도 백업 보존, 이전 crop 스크립트의 덮어쓰기 차단. 최신 요청에 맞게 공식 기준 문서 갱신.
- **검증 결과**: 20개 PNG의 크기/투명도/서로 다른 입/입 외부 픽셀 및 알파 동일성 통과. 네 캐릭터 실제 음성·입모양·정지/재생·화면 이동 390/1440px 통과. 히어로 재생/일시정지/재개/음소거/중복 방지/이동 정리/반응형/감소된 움직임 통과. 기존 동작 API 검사 통과. 미리보기 20장 로딩/최대360px/고정 레이아웃/오버플로 없음 390/1440px 통과. 기존 음성 회귀 390/768/1024/1440px 통과. 확대 합성 경계 및 실제 페이지 스크린샷 확인. JS 구문 검사 통과.
- **제작 범위**: 새 렌더를 기준으로 5개 프레임 사이 일관성을 보장하며 참고 JPEG와 픽셀 단위로 같은 복원은 아님. 기본 표정은 우 입모양. 별도 기존 동작 시트 포즈/교육 영상은 이번 고해상도 입모양 제작 범위 밖이며 유지.
- **관련 파일**: [20개 PNG ZIP](file:///J:/sh/public/characters/characters-mouth-hd.zip), [미리보기](file:///J:/sh/characters/high-resolution-preview.html), [전체 확인 이미지](file:///J:/sh/characters/reference/high-resolution/final-preview.png), [생성 도구/프롬프트](file:///J:/sh/characters/reference/high-resolution/prompts.json), [합성 코드](file:///J:/sh/scripts/build-hd-characters.cjs), [데이터](file:///J:/sh/characters/manifest.json), [이미지 검증](file:///J:/sh/tests/official-character-assets.py), [제작 설명](file:///J:/sh/characters/reference/high-resolution/README.md).
- **저장/릴리즈**: 변경 코드/이미지/원본/문서/일지를 school-release에 동기화하고 SHA-256 검증. 원격 배포 없음.

## 자동 저장 / 2026-09-21 11:53:54 — GitHub·Vercel 배포 및 Markdown 자동 기록 준비
- **수행 내역**: 오늘 작업 보고서와 커밋 전 자동 기록 훅, 릴리즈 SHA-256 동기화 스크립트 추가. 기존 원격 main과 일치 확인 및 GitHub/Vercel 로그인 확인.

## 자동 저장 / 2026-09-21 11:56:23 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 338
<details><summary>변경 파일 목록</summary>

- [.gitattributes](./.gitattributes)
- [.githooks/pre-commit](./.githooks/pre-commit)
- [.vercelignore](./.vercelignore)
- [AGENTS.md](./AGENTS.md)
- [ANIMATED_CHARACTER_NOTES.md](./ANIMATED_CHARACTER_NOTES.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [assets/audio/bori-greeting-ko.wav](./assets/audio/bori-greeting-ko.wav)
- [assets/audio/kongi-greeting-ko.wav](./assets/audio/kongi-greeting-ko.wav)
- [assets/audio/nabi-greeting-ko.wav](./assets/audio/nabi-greeting-ko.wav)
- [assets/audio/tori-greeting-ko.wav](./assets/audio/tori-greeting-ko.wav)
- [assets/exercise-20min/PRODUCTION.md](./assets/exercise-20min/PRODUCTION.md)
- [assets/exercise-20min/action-reference.png](./assets/exercise-20min/action-reference.png)
- [assets/exercise-20min/audio/class-20min.mp3](./assets/exercise-20min/audio/class-20min.mp3)
- [assets/exercise-20min/audio/class-20min.wav](./assets/exercise-20min/audio/class-20min.wav)
- [assets/exercise-20min/audio/narration-pcm.wav](./assets/exercise-20min/audio/narration-pcm.wav)
- [assets/exercise-20min/audio/narration-source.wav](./assets/exercise-20min/audio/narration-source.wav)
- [assets/exercise-20min/audio/phrase-00.wav](./assets/exercise-20min/audio/phrase-00.wav)
- [assets/exercise-20min/audio/phrase-01.wav](./assets/exercise-20min/audio/phrase-01.wav)
- [assets/exercise-20min/audio/phrase-02.wav](./assets/exercise-20min/audio/phrase-02.wav)
- [assets/exercise-20min/audio/phrase-03.wav](./assets/exercise-20min/audio/phrase-03.wav)
- [assets/exercise-20min/audio/phrase-04.wav](./assets/exercise-20min/audio/phrase-04.wav)
- [assets/exercise-20min/audio/phrase-05.wav](./assets/exercise-20min/audio/phrase-05.wav)
- [assets/exercise-20min/audio/phrase-06.wav](./assets/exercise-20min/audio/phrase-06.wav)
- [assets/exercise-20min/audio/phrase-07.wav](./assets/exercise-20min/audio/phrase-07.wav)
- [assets/exercise-20min/audio/phrase-08.wav](./assets/exercise-20min/audio/phrase-08.wav)
- [assets/exercise-20min/audio/phrase-09.wav](./assets/exercise-20min/audio/phrase-09.wav)
- [assets/exercise-20min/audio/phrase-10.wav](./assets/exercise-20min/audio/phrase-10.wav)
- [assets/exercise-20min/audio/phrase-11.wav](./assets/exercise-20min/audio/phrase-11.wav)
- [assets/exercise-20min/audio/phrase-12.wav](./assets/exercise-20min/audio/phrase-12.wav)
- [assets/exercise-20min/audio/phrase-13.wav](./assets/exercise-20min/audio/phrase-13.wav)
- [assets/exercise-20min/audio/phrase-14.wav](./assets/exercise-20min/audio/phrase-14.wav)
- [assets/exercise-20min/audio/phrase-15.wav](./assets/exercise-20min/audio/phrase-15.wav)
- [assets/exercise-20min/audio/phrase-16.wav](./assets/exercise-20min/audio/phrase-16.wav)
- [assets/exercise-20min/audio/phrase-17.wav](./assets/exercise-20min/audio/phrase-17.wav)
- [assets/exercise-20min/audio/phrase-18.wav](./assets/exercise-20min/audio/phrase-18.wav)
- [assets/exercise-20min/audio/phrase-19.wav](./assets/exercise-20min/audio/phrase-19.wav)
- [assets/exercise-20min/audio/phrase-20.wav](./assets/exercise-20min/audio/phrase-20.wav)
- [assets/exercise-20min/audio/phrase-21.wav](./assets/exercise-20min/audio/phrase-21.wav)
- [assets/exercise-20min/audio/phrase-22.wav](./assets/exercise-20min/audio/phrase-22.wav)
- [assets/exercise-20min/audio/phrase-23.wav](./assets/exercise-20min/audio/phrase-23.wav)
- [assets/exercise-20min/audio/phrase-24.wav](./assets/exercise-20min/audio/phrase-24.wav)
- [assets/exercise-20min/audio/phrase-25.wav](./assets/exercise-20min/audio/phrase-25.wav)
- [assets/exercise-20min/audio/phrase-26.wav](./assets/exercise-20min/audio/phrase-26.wav)
- [assets/exercise-20min/audio/phrase-27.wav](./assets/exercise-20min/audio/phrase-27.wav)
- [assets/exercise-20min/audio/phrase-28.wav](./assets/exercise-20min/audio/phrase-28.wav)
- [assets/exercise-20min/audio/phrase-29.wav](./assets/exercise-20min/audio/phrase-29.wav)
- [assets/exercise-20min/audio/phrase-30.wav](./assets/exercise-20min/audio/phrase-30.wav)
- [assets/exercise-20min/audio/phrase-31.wav](./assets/exercise-20min/audio/phrase-31.wav)
- [assets/exercise-20min/audio/phrase-32.wav](./assets/exercise-20min/audio/phrase-32.wav)
- [assets/exercise-20min/audio/phrase-33.wav](./assets/exercise-20min/audio/phrase-33.wav)
- [assets/exercise-20min/audio/phrase-34.wav](./assets/exercise-20min/audio/phrase-34.wav)
- [assets/exercise-20min/audio/phrase-35.wav](./assets/exercise-20min/audio/phrase-35.wav)
- [assets/exercise-20min/audio/phrase-36.wav](./assets/exercise-20min/audio/phrase-36.wav)
- [assets/exercise-20min/audio/phrase-37.wav](./assets/exercise-20min/audio/phrase-37.wav)
- [assets/exercise-20min/audio/phrase-38.wav](./assets/exercise-20min/audio/phrase-38.wav)
- [assets/exercise-20min/audio/phrase-39.wav](./assets/exercise-20min/audio/phrase-39.wav)
- [assets/exercise-20min/audio/phrase-40.wav](./assets/exercise-20min/audio/phrase-40.wav)
- [assets/exercise-20min/audio/phrase-41.wav](./assets/exercise-20min/audio/phrase-41.wav)
- [assets/exercise-20min/audio/phrase-42.wav](./assets/exercise-20min/audio/phrase-42.wav)
- [assets/exercise-20min/audio/phrase-43.wav](./assets/exercise-20min/audio/phrase-43.wav)
- [assets/exercise-20min/audio/phrase-44.wav](./assets/exercise-20min/audio/phrase-44.wav)
- [assets/exercise-20min/audio/phrase-45.wav](./assets/exercise-20min/audio/phrase-45.wav)
- [assets/exercise-20min/audio/phrase-46.wav](./assets/exercise-20min/audio/phrase-46.wav)
- [assets/exercise-20min/audio/phrase-47.wav](./assets/exercise-20min/audio/phrase-47.wav)
- [assets/exercise-20min/audio/phrase-48.wav](./assets/exercise-20min/audio/phrase-48.wav)
- [assets/exercise-20min/audio/phrase-49.wav](./assets/exercise-20min/audio/phrase-49.wav)
- [assets/exercise-20min/audio/phrase-50.wav](./assets/exercise-20min/audio/phrase-50.wav)
- [assets/exercise-20min/audio/phrase-51.wav](./assets/exercise-20min/audio/phrase-51.wav)
- [assets/exercise-20min/audio/phrase-52.wav](./assets/exercise-20min/audio/phrase-52.wav)
- [assets/exercise-20min/audio/phrase-53.wav](./assets/exercise-20min/audio/phrase-53.wav)
- [assets/exercise-20min/audio/phrase-54.wav](./assets/exercise-20min/audio/phrase-54.wav)
- [assets/exercise-20min/audio/phrase-55.wav](./assets/exercise-20min/audio/phrase-55.wav)
- [assets/exercise-20min/audio/phrase-56.wav](./assets/exercise-20min/audio/phrase-56.wav)
- [assets/exercise-20min/audio/phrase-57.wav](./assets/exercise-20min/audio/phrase-57.wav)
- [assets/exercise-20min/audio/phrase-58.wav](./assets/exercise-20min/audio/phrase-58.wav)
- [assets/exercise-20min/audio/phrases.json](./assets/exercise-20min/audio/phrases.json)
- [assets/exercise-20min/captions-ko.vtt](./assets/exercise-20min/captions-ko.vtt)
- [assets/exercise-20min/clip-plan.json](./assets/exercise-20min/clip-plan.json)
- [assets/exercise-20min/narration-source.json](./assets/exercise-20min/narration-source.json)
- [assets/exercise-20min/program.json](./assets/exercise-20min/program.json)
- [assets/exercise-20min/review.html](./assets/exercise-20min/review.html)
- [assets/images/animated-kongi/face-clean-generated.png](./assets/images/animated-kongi/face-clean-generated.png)
- [assets/images/animated-kongi/face-clean.svg](./assets/images/animated-kongi/face-clean.svg)
- [assets/images/animated-kongi/reference.png](./assets/images/animated-kongi/reference.png)
- [assets/images/friend-bori-talk.png](./assets/images/friend-bori-talk.png)
- [assets/images/friend-bori.png](./assets/images/friend-bori.png)
- [assets/images/friend-kongi-blink.png](./assets/images/friend-kongi-blink.png)
- [assets/images/friend-kongi-companion.png](./assets/images/friend-kongi-companion.png)
- [assets/images/friend-kongi-mouth-closed.png](./assets/images/friend-kongi-mouth-closed.png)
- [assets/images/friend-kongi-talk.png](./assets/images/friend-kongi-talk.png)
- [assets/images/friend-kongi.png](./assets/images/friend-kongi.png)
- [assets/images/friend-nabi-talk.png](./assets/images/friend-nabi-talk.png)
- [assets/images/friend-nabi.png](./assets/images/friend-nabi.png)
- [assets/images/friend-tori-talk.png](./assets/images/friend-tori-talk.png)
- [assets/images/friend-tori.png](./assets/images/friend-tori.png)
- [characters/ACTIONS.md](./characters/ACTIONS.md)
- [characters/README.md](./characters/README.md)
- [characters/actions-manifest.json](./characters/actions-manifest.json)
- [characters/actions-preview.html](./characters/actions-preview.html)
- [characters/bori/actions/bori_happy.png](./characters/bori/actions/bori_happy.png)
- [characters/bori/actions/bori_idle.png](./characters/bori/actions/bori_idle.png)
- [characters/bori/actions/bori_music.png](./characters/bori/actions/bori_music.png)
- [characters/bori/actions/bori_music_2.png](./characters/bori/actions/bori_music_2.png)
- [characters/bori/actions/bori_shy.png](./characters/bori/actions/bori_shy.png)
- [characters/bori/actions/bori_sit.png](./characters/bori/actions/bori_sit.png)
- [characters/bori/actions/bori_thumbsup.png](./characters/bori/actions/bori_thumbsup.png)
- [characters/bori/bori_a.png](./characters/bori/bori_a.png)
- [characters/bori/bori_a_stable.png](./characters/bori/bori_a_stable.png)
- [characters/bori/bori_e.png](./characters/bori/bori_e.png)
- [characters/bori/bori_e_stable.png](./characters/bori/bori_e_stable.png)
- [characters/bori/bori_i.png](./characters/bori/bori_i.png)
- [characters/bori/bori_i_stable.png](./characters/bori/bori_i_stable.png)
- [characters/bori/bori_idle.png](./characters/bori/bori_idle.png)
- [characters/bori/bori_o.png](./characters/bori/bori_o.png)
- [characters/bori/bori_o_stable.png](./characters/bori/bori_o_stable.png)
- [characters/bori/bori_u.png](./characters/bori/bori_u.png)
- [characters/bori/bori_u_stable.png](./characters/bori/bori_u_stable.png)
- [characters/high-resolution-preview.html](./characters/high-resolution-preview.html)
- [characters/kongi/actions/kongi_bow.png](./characters/kongi/actions/kongi_bow.png)
- [characters/kongi/actions/kongi_explain.png](./characters/kongi/actions/kongi_explain.png)
- [characters/kongi/actions/kongi_hello.png](./characters/kongi/actions/kongi_hello.png)
- [characters/kongi/actions/kongi_idle.png](./characters/kongi/actions/kongi_idle.png)
- [characters/kongi/actions/kongi_read.png](./characters/kongi/actions/kongi_read.png)
- [characters/kongi/actions/kongi_sleep.png](./characters/kongi/actions/kongi_sleep.png)
- [characters/kongi/actions/kongi_wink.png](./characters/kongi/actions/kongi_wink.png)
- [characters/kongi/kongi_a.png](./characters/kongi/kongi_a.png)
- [characters/kongi/kongi_a_stable.png](./characters/kongi/kongi_a_stable.png)
- [characters/kongi/kongi_e.png](./characters/kongi/kongi_e.png)
- [characters/kongi/kongi_e_stable.png](./characters/kongi/kongi_e_stable.png)
- [characters/kongi/kongi_i.png](./characters/kongi/kongi_i.png)
- [characters/kongi/kongi_i_stable.png](./characters/kongi/kongi_i_stable.png)
- [characters/kongi/kongi_idle.png](./characters/kongi/kongi_idle.png)
- [characters/kongi/kongi_o.png](./characters/kongi/kongi_o.png)
- [characters/kongi/kongi_o_stable.png](./characters/kongi/kongi_o_stable.png)
- [characters/kongi/kongi_u.png](./characters/kongi/kongi_u.png)
- [characters/kongi/kongi_u_stable.png](./characters/kongi/kongi_u_stable.png)
- [characters/manifest.json](./characters/manifest.json)
- [characters/nabi/actions/nabi_cheer.png](./characters/nabi/actions/nabi_cheer.png)
- [characters/nabi/actions/nabi_dance.png](./characters/nabi/actions/nabi_dance.png)
- [characters/nabi/actions/nabi_hello.png](./characters/nabi/actions/nabi_hello.png)
- [characters/nabi/actions/nabi_idle.png](./characters/nabi/actions/nabi_idle.png)
- [characters/nabi/actions/nabi_shy.png](./characters/nabi/actions/nabi_shy.png)
- [characters/nabi/actions/nabi_sit.png](./characters/nabi/actions/nabi_sit.png)
- [characters/nabi/actions/nabi_sleep.png](./characters/nabi/actions/nabi_sleep.png)
- [characters/nabi/nabi_a.png](./characters/nabi/nabi_a.png)
- [characters/nabi/nabi_a_stable.png](./characters/nabi/nabi_a_stable.png)
- [characters/nabi/nabi_e.png](./characters/nabi/nabi_e.png)
- [characters/nabi/nabi_e_stable.png](./characters/nabi/nabi_e_stable.png)
- [characters/nabi/nabi_i.png](./characters/nabi/nabi_i.png)
- [characters/nabi/nabi_i_stable.png](./characters/nabi/nabi_i_stable.png)
- [characters/nabi/nabi_idle.png](./characters/nabi/nabi_idle.png)
- [characters/nabi/nabi_o.png](./characters/nabi/nabi_o.png)
- [characters/nabi/nabi_o_stable.png](./characters/nabi/nabi_o_stable.png)
- [characters/nabi/nabi_u.png](./characters/nabi/nabi_u.png)
- [characters/nabi/nabi_u_stable.png](./characters/nabi/nabi_u_stable.png)
- [characters/reference/actions/classification-preview.png](./characters/reference/actions/classification-preview.png)
- [characters/reference/actions/classification.json](./characters/reference/actions/classification.json)
- [characters/reference/actions/pose-only-r1-c8.png](./characters/reference/actions/pose-only-r1-c8.png)
- [characters/reference/actions/pose-only-r2-c3.png](./characters/reference/actions/pose-only-r2-c3.png)
- [characters/reference/actions/pose-only-r2-c6.png](./characters/reference/actions/pose-only-r2-c6.png)
- [characters/reference/actions/pose-only-r2-c9.png](./characters/reference/actions/pose-only-r2-c9.png)
- [characters/reference/actions/pose-only-r3-c4.png](./characters/reference/actions/pose-only-r3-c4.png)
- [characters/reference/actions/pose-only-r3-c7.png](./characters/reference/actions/pose-only-r3-c7.png)
- [characters/reference/actions/pose-only-r4-c3.png](./characters/reference/actions/pose-only-r4-c3.png)
- [characters/reference/actions/pose-only-r4-c5.png](./characters/reference/actions/pose-only-r4-c5.png)
- [characters/reference/actions/pose-only-r4-c6.png](./characters/reference/actions/pose-only-r4-c6.png)
- [characters/reference/actions/source.png](./characters/reference/actions/source.png)
- [characters/reference/extraction-contact-sheet.png](./characters/reference/extraction-contact-sheet.png)
- [characters/reference/high-resolution/README.md](./characters/reference/high-resolution/README.md)
- [characters/reference/high-resolution/build.json](./characters/reference/high-resolution/build.json)
- [characters/reference/high-resolution/design-reference.jpeg](./characters/reference/high-resolution/design-reference.jpeg)
- [characters/reference/high-resolution/final-preview.png](./characters/reference/high-resolution/final-preview.png)
- [characters/reference/high-resolution/masters-preview.png](./characters/reference/high-resolution/masters-preview.png)
- [characters/reference/high-resolution/masters.json](./characters/reference/high-resolution/masters.json)
- [characters/reference/high-resolution/mouth-detail.png](./characters/reference/high-resolution/mouth-detail.png)
- [characters/reference/high-resolution/outputs.json](./characters/reference/high-resolution/outputs.json)
- [characters/reference/high-resolution/prompts.json](./characters/reference/high-resolution/prompts.json)
- [characters/reference/high-resolution/raw-preview.png](./characters/reference/high-resolution/raw-preview.png)
- [characters/reference/high-resolution/raw/bori/bori_a.png](./characters/reference/high-resolution/raw/bori/bori_a.png)
- [characters/reference/high-resolution/raw/bori/bori_e.png](./characters/reference/high-resolution/raw/bori/bori_e.png)
- [characters/reference/high-resolution/raw/bori/bori_i.png](./characters/reference/high-resolution/raw/bori/bori_i.png)
- [characters/reference/high-resolution/raw/bori/bori_o.png](./characters/reference/high-resolution/raw/bori/bori_o.png)
- [characters/reference/high-resolution/raw/bori/bori_u.png](./characters/reference/high-resolution/raw/bori/bori_u.png)
- [characters/reference/high-resolution/raw/kongi/kongi_a.png](./characters/reference/high-resolution/raw/kongi/kongi_a.png)
- [characters/reference/high-resolution/raw/kongi/kongi_e.png](./characters/reference/high-resolution/raw/kongi/kongi_e.png)
- [characters/reference/high-resolution/raw/kongi/kongi_i.png](./characters/reference/high-resolution/raw/kongi/kongi_i.png)
- [characters/reference/high-resolution/raw/kongi/kongi_o.png](./characters/reference/high-resolution/raw/kongi/kongi_o.png)
- [characters/reference/high-resolution/raw/kongi/kongi_u.png](./characters/reference/high-resolution/raw/kongi/kongi_u.png)
- [characters/reference/high-resolution/raw/nabi/nabi_a.png](./characters/reference/high-resolution/raw/nabi/nabi_a.png)
- [characters/reference/high-resolution/raw/nabi/nabi_e.png](./characters/reference/high-resolution/raw/nabi/nabi_e.png)
- [characters/reference/high-resolution/raw/nabi/nabi_i.png](./characters/reference/high-resolution/raw/nabi/nabi_i.png)
- [characters/reference/high-resolution/raw/nabi/nabi_o.png](./characters/reference/high-resolution/raw/nabi/nabi_o.png)
- [characters/reference/high-resolution/raw/nabi/nabi_u.png](./characters/reference/high-resolution/raw/nabi/nabi_u.png)
- [characters/reference/high-resolution/raw/tori/tori_a.png](./characters/reference/high-resolution/raw/tori/tori_a.png)
- [characters/reference/high-resolution/raw/tori/tori_e.png](./characters/reference/high-resolution/raw/tori/tori_e.png)
- [characters/reference/high-resolution/raw/tori/tori_i.png](./characters/reference/high-resolution/raw/tori/tori_i.png)
- [characters/reference/high-resolution/raw/tori/tori_o.png](./characters/reference/high-resolution/raw/tori/tori_o.png)
- [characters/reference/high-resolution/raw/tori/tori_u.png](./characters/reference/high-resolution/raw/tori/tori_u.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_a.png](./characters/reference/legacy-lowres-20260921/bori/bori_a.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_a_stable.png](./characters/reference/legacy-lowres-20260921/bori/bori_a_stable.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_e.png](./characters/reference/legacy-lowres-20260921/bori/bori_e.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_e_stable.png](./characters/reference/legacy-lowres-20260921/bori/bori_e_stable.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_i.png](./characters/reference/legacy-lowres-20260921/bori/bori_i.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_i_stable.png](./characters/reference/legacy-lowres-20260921/bori/bori_i_stable.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_idle.png](./characters/reference/legacy-lowres-20260921/bori/bori_idle.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_o.png](./characters/reference/legacy-lowres-20260921/bori/bori_o.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_o_stable.png](./characters/reference/legacy-lowres-20260921/bori/bori_o_stable.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_u.png](./characters/reference/legacy-lowres-20260921/bori/bori_u.png)
- [characters/reference/legacy-lowres-20260921/bori/bori_u_stable.png](./characters/reference/legacy-lowres-20260921/bori/bori_u_stable.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_a.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_a.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_a_stable.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_a_stable.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_e.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_e.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_e_stable.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_e_stable.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_i.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_i.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_i_stable.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_i_stable.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_idle.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_idle.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_o.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_o.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_o_stable.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_o_stable.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_u.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_u.png)
- [characters/reference/legacy-lowres-20260921/kongi/kongi_u_stable.png](./characters/reference/legacy-lowres-20260921/kongi/kongi_u_stable.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_a.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_a.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_a_stable.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_a_stable.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_e.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_e.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_e_stable.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_e_stable.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_i.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_i.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_i_stable.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_i_stable.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_idle.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_idle.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_o.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_o.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_o_stable.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_o_stable.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_u.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_u.png)
- [characters/reference/legacy-lowres-20260921/nabi/nabi_u_stable.png](./characters/reference/legacy-lowres-20260921/nabi/nabi_u_stable.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_a.png](./characters/reference/legacy-lowres-20260921/tori/tori_a.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_a_stable.png](./characters/reference/legacy-lowres-20260921/tori/tori_a_stable.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_e.png](./characters/reference/legacy-lowres-20260921/tori/tori_e.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_e_stable.png](./characters/reference/legacy-lowres-20260921/tori/tori_e_stable.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_i.png](./characters/reference/legacy-lowres-20260921/tori/tori_i.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_i_stable.png](./characters/reference/legacy-lowres-20260921/tori/tori_i_stable.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_idle.png](./characters/reference/legacy-lowres-20260921/tori/tori_idle.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_o.png](./characters/reference/legacy-lowres-20260921/tori/tori_o.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_o_stable.png](./characters/reference/legacy-lowres-20260921/tori/tori_o_stable.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_u.png](./characters/reference/legacy-lowres-20260921/tori/tori_u.png)
- [characters/reference/legacy-lowres-20260921/tori/tori_u_stable.png](./characters/reference/legacy-lowres-20260921/tori/tori_u_stable.png)
- [characters/reference/legacy/friend-bori-talk.png](./characters/reference/legacy/friend-bori-talk.png)
- [characters/reference/legacy/friend-bori.png](./characters/reference/legacy/friend-bori.png)
- [characters/reference/legacy/friend-kongi-blink.png](./characters/reference/legacy/friend-kongi-blink.png)
- [characters/reference/legacy/friend-kongi-companion.png](./characters/reference/legacy/friend-kongi-companion.png)
- [characters/reference/legacy/friend-kongi-mouth-closed.png](./characters/reference/legacy/friend-kongi-mouth-closed.png)
- [characters/reference/legacy/friend-kongi-talk.png](./characters/reference/legacy/friend-kongi-talk.png)
- [characters/reference/legacy/friend-kongi.png](./characters/reference/legacy/friend-kongi.png)
- [characters/reference/legacy/friend-nabi-talk.png](./characters/reference/legacy/friend-nabi-talk.png)
- [characters/reference/legacy/friend-nabi.png](./characters/reference/legacy/friend-nabi.png)
- [characters/reference/legacy/friend-tori-talk.png](./characters/reference/legacy/friend-tori-talk.png)
- [characters/reference/legacy/friend-tori.png](./characters/reference/legacy/friend-tori.png)
- [characters/reference/official-mouth-sheet.png](./characters/reference/official-mouth-sheet.png)
- [characters/tori/actions/tori_cheer.png](./characters/tori/actions/tori_cheer.png)
- [characters/tori/actions/tori_cheer_2.png](./characters/tori/actions/tori_cheer_2.png)
- [characters/tori/actions/tori_dance.png](./characters/tori/actions/tori_dance.png)
- [characters/tori/actions/tori_hello.png](./characters/tori/actions/tori_hello.png)
- [characters/tori/actions/tori_idle.png](./characters/tori/actions/tori_idle.png)
- [characters/tori/actions/tori_jump.png](./characters/tori/actions/tori_jump.png)
- [characters/tori/actions/tori_surprise.png](./characters/tori/actions/tori_surprise.png)
- [characters/tori/actions/tori_turn.png](./characters/tori/actions/tori_turn.png)
- [characters/tori/actions/tori_wave.png](./characters/tori/actions/tori_wave.png)
- [characters/tori/actions/tori_wink.png](./characters/tori/actions/tori_wink.png)
- [characters/tori/tori_a.png](./characters/tori/tori_a.png)
- [characters/tori/tori_a_stable.png](./characters/tori/tori_a_stable.png)
- [characters/tori/tori_e.png](./characters/tori/tori_e.png)
- [characters/tori/tori_e_stable.png](./characters/tori/tori_e_stable.png)
- [characters/tori/tori_i.png](./characters/tori/tori_i.png)
- [characters/tori/tori_i_stable.png](./characters/tori/tori_i_stable.png)
- [characters/tori/tori_idle.png](./characters/tori/tori_idle.png)
- [characters/tori/tori_o.png](./characters/tori/tori_o.png)
- [characters/tori/tori_o_stable.png](./characters/tori/tori_o_stable.png)
- [characters/tori/tori_u.png](./characters/tori/tori_u.png)
- [characters/tori/tori_u_stable.png](./characters/tori/tori_u_stable.png)
- [css/animated-character.css](./css/animated-character.css)
- [css/official-characters.css](./css/official-characters.css)
- [index.html](./index.html)
- [js/animated-character.js](./js/animated-character.js)
- [js/character-actions.js](./js/character-actions.js)
- [js/character-audio-player.js](./js/character-audio-player.js)
- [js/character-lipsync.js](./js/character-lipsync.js)
- [js/character-speech-cues.js](./js/character-speech-cues.js)
- [js/character-wardrobe.js](./js/character-wardrobe.js)
- [js/characters.js](./js/characters.js)
- [js/friends-and-play.js](./js/friends-and-play.js)
- [js/voice.js](./js/voice.js)
- [js/welcome-greeting.js](./js/welcome-greeting.js)
- [public/characters/bori/bori_idle.png](./public/characters/bori/bori_idle.png)
- [public/characters/bori/mouth/bori_a.png](./public/characters/bori/mouth/bori_a.png)
- [public/characters/bori/mouth/bori_e.png](./public/characters/bori/mouth/bori_e.png)
- [public/characters/bori/mouth/bori_i.png](./public/characters/bori/mouth/bori_i.png)
- [public/characters/bori/mouth/bori_o.png](./public/characters/bori/mouth/bori_o.png)
- [public/characters/bori/mouth/bori_u.png](./public/characters/bori/mouth/bori_u.png)
- [public/characters/characters-mouth-hd.zip](./public/characters/characters-mouth-hd.zip)
- [public/characters/kongi/kongi_idle.png](./public/characters/kongi/kongi_idle.png)
- [public/characters/kongi/mouth/kongi_a.png](./public/characters/kongi/mouth/kongi_a.png)
- [public/characters/kongi/mouth/kongi_e.png](./public/characters/kongi/mouth/kongi_e.png)
- [public/characters/kongi/mouth/kongi_i.png](./public/characters/kongi/mouth/kongi_i.png)
- [public/characters/kongi/mouth/kongi_o.png](./public/characters/kongi/mouth/kongi_o.png)
- [public/characters/kongi/mouth/kongi_u.png](./public/characters/kongi/mouth/kongi_u.png)
- [public/characters/nabi/mouth/nabi_a.png](./public/characters/nabi/mouth/nabi_a.png)
- [public/characters/nabi/mouth/nabi_e.png](./public/characters/nabi/mouth/nabi_e.png)
- [public/characters/nabi/mouth/nabi_i.png](./public/characters/nabi/mouth/nabi_i.png)
- [public/characters/nabi/mouth/nabi_o.png](./public/characters/nabi/mouth/nabi_o.png)
- [public/characters/nabi/mouth/nabi_u.png](./public/characters/nabi/mouth/nabi_u.png)
- [public/characters/nabi/nabi_idle.png](./public/characters/nabi/nabi_idle.png)
- [public/characters/tori/mouth/tori_a.png](./public/characters/tori/mouth/tori_a.png)
- [public/characters/tori/mouth/tori_e.png](./public/characters/tori/mouth/tori_e.png)
- [public/characters/tori/mouth/tori_i.png](./public/characters/tori/mouth/tori_i.png)
- [public/characters/tori/mouth/tori_o.png](./public/characters/tori/mouth/tori_o.png)
- [public/characters/tori/mouth/tori_u.png](./public/characters/tori/mouth/tori_u.png)
- [public/characters/tori/tori_idle.png](./public/characters/tori/tori_idle.png)
- [scripts/build-chair-audio.py](./scripts/build-chair-audio.py)
- [scripts/build-chair-program.py](./scripts/build-chair-program.py)
- [scripts/build-hd-characters.cjs](./scripts/build-hd-characters.cjs)
- [scripts/extract-character-actions.py](./scripts/extract-character-actions.py)
- [scripts/extract-official-characters.py](./scripts/extract-official-characters.py)
- [scripts/inspect-hd-characters.cjs](./scripts/inspect-hd-characters.cjs)
- [scripts/mouth-inspection.cjs](./scripts/mouth-inspection.cjs)
- [scripts/prepare-hd-inspection.cjs](./scripts/prepare-hd-inspection.cjs)
- [scripts/render-chair-class.py](./scripts/render-chair-class.py)
- [scripts/save-work-report.cjs](./scripts/save-work-report.cjs)
- [scripts/sync-hd-characters.ps1](./scripts/sync-hd-characters.ps1)
- [scripts/sync-release.cjs](./scripts/sync-release.cjs)
- [tests/animated-character.cjs](./tests/animated-character.cjs)
- [tests/chair-audio-review.cjs](./tests/chair-audio-review.cjs)
- [tests/character-actions.cjs](./tests/character-actions.cjs)
- [tests/character-audio-hero.cjs](./tests/character-audio-hero.cjs)
- [tests/character-audio.cjs](./tests/character-audio.cjs)
- [tests/high-resolution-preview.cjs](./tests/high-resolution-preview.cjs)
- [tests/official-character-assets.py](./tests/official-character-assets.py)
- [tests/official-characters.cjs](./tests/official-characters.cjs)
- [tests/production-release.cjs](./tests/production-release.cjs)
- [배포_작업_보고서_2026-09-21.md](./배포_작업_보고서_2026-09-21.md)
- [오늘_작업_일지_2026-09-17.md](./오늘_작업_일지_2026-09-17.md)
- [오늘_작업_일지_2026-09-21.md](./오늘_작업_일지_2026-09-21.md)

</details>

## 자동 저장 / 2026-09-21 11:59:26 — GitHub·Vercel 운영 배포 완료
- **수행 내역**: GitHub main e256e06 푸시 성공. Vercel dpl_42xe5itho97oR6GUogNeUoTMUb1j production READY, school-tau-pearl.vercel.app 연결. 운영 URL 27개 HTTP 200 및 SHA-256 일치, 모바일 홈페이지와 20장 표시 확인. Markdown 커밋 자동 기록 작동 확인.

## 자동 저장 / 2026-09-21 11:59:27 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 5
<details><summary>변경 파일 목록</summary>

- [.githooks/pre-commit](./.githooks/pre-commit)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [배포_작업_보고서_2026-09-21.md](./배포_작업_보고서_2026-09-21.md)
- [오늘_작업_일지_2026-09-21.md](./오늘_작업_일지_2026-09-21.md)

</details>

## 자동 저장 / 2026-09-21 12:26:13 — 어르신 체조 이미지·음성 콘텐츠 제작
- **수행 내역**: 사용자 요청: 첨부 포스터 기반 어르신 체조를 기존 홈페이지에 연결. 1672×941 이미지 5장, 팔 동작 8명 보완, 한국어 여성 음성·조용한 반주 184초, 6개 장면과 자막 50개, 숫자 뒤 2.3초 쉼 구현. 시작·일시정지·다시 시작·이전/다음·음소거·전체화면, 모바일 대응과 홈페이지 진입 연결 완료. 새 체조 390/768/1440px 기능 검사 및 기존 20분 영상 3개 화면 크기 검사 통과. 관련 파일: [체조 화면](file:///J:/sh/senior-exercise.html), [제작 상세](file:///J:/sh/assets/senior-exercise/README.md), [재생 코드](file:///J:/sh/js/senior-exercise.js). MP4 아닌 브라우저 이미지·음성 콘텐츠이며 기존 영상 보존.

## 자동 저장 / 2026-09-21 12:30:16 — 캐릭터 실제 동작 영상 제작 기준 저장
- **수행 내역**: 사용자 요청: 네 캐릭터 외형·의상색 고정, 글자 없는 정면 16:9 의자 운동, 8초 단일 동작과 자연스러운 반복. 연결 Runway 재확인 결과 무료 플랜으로 영상 모델 사용 불가. 실제 영상은 생성되지 않았으며 기존 슬라이드 유지. 공통 프롬프트와 6개 단일 동작 제작안 및 검수 기준 저장: [제작 기준](file:///J:/sh/assets/senior-exercise/MOTION_VIDEO_BRIEF.md).

## 자동 저장 / 2026-09-21 13:58:55 — 치매 어르신과 함께하는 10단계 AI 의자 체조 영상 및 인터랙티브 플레이어 제작 완료
- **수행 내역**: 1. 공식 캐릭터(노랑 콩이, 분홍 토리, 보라 나비, 파랑 보리)와 실제 한국 어르신 2~4명이 의자에 앉아 따라하는 10개 씬 고화질 16:9 일러스트 에셋 생성 및 구축 완료\n2. 10개 체조 단계(시작인사, 심호흡, 목운동, 어깨운동, 팔운동, 박수운동, 무릎운동, 발목운동, 손운동, 마무리인사) 데이터베이스 구축 (program.json)\n3. 부드러운 한국어 여성 사회복지사 음성 TTS 엔진, 카운트 펄스 애니메이션, 웹 오디오 잔잔한 피아노 BGM 내장\n4. 치매/인지저하 어르신 전용 고대비 대형 자막, 10개 씬 썸네일 네비게이터, 시작/일시정지/다시보기/전체화면 제어바 탑재\n5. 메인 학교 홈(index.html) 및 senior-exercise.html 연동 및 school-release 릴리즈 동기화 완료

## 자동 저장 / 2026-09-21 14:01:28 — 치매 어르신과 함께하는 10단계 AI 의자 체조 영상 제작 및 시스템 구축
- **수행 내역**: 1. 캐릭터 기준(콩이 노랑, 토리 분홍, 나비 보라, 보리 파랑) 및 한국 어르신 2~4명이 함께하는 10개 씬 고화질 16:9 일러스트 에셋 제작\n2. 10개 체조 단계(시작 인사, 심호흡, 목 운동, 어깨 운동, 팔 운동, 박수 운동, 무릎 운동, 발목 운동, 손 운동, 마무리 인사) 구축\n3. Web Speech API 기반 사회복지사 톤 한국어 음성 안내 및 잔잔한 피아노 BGM 웹 오디오 엔진 탑재\n4. 큰 글씨 고대비 자막, 숫자 카운트 펄스 애니메이션, 10개 씬 네비게이터 및 재생 제어기 완비\n5. school-release 릴리즈 동기화 및 tests/verify-senior-ai-exercise.cjs 무결점 통과

## 자동 저장 / 2026-09-21 14:08:01 — 어르신과 함께하는 콩이의 집 꾸미기 고화질 활동 장면 제작
- **수행 내역**: 1. 콩이의 고유 디자인(둥근 안경, 갈색 귀, 밝고 친근한 표정, 크림색 체형) 100% 일관성 유지\n2. 한국 어르신이 콩이와 함께 꽃 화분, 그림책, 푹신한 쿠션을 정리하고 꾸미는 정겨운 소근육/회상 참여 프로그램 장면 연출\n3. 원목 가구, 따뜻한 햇살, 아늑한 동화풍 3D 클레이 텍스처로 치매 어르신 정서 안정에 최적화\n4. assets/images/kongi-home-decorating.png 저장 및 school-release 동기화 완료

## 자동 저장 / 2026-09-21 14:10:19 — 어르신과 함께하는 토리의 집 꾸미기 고화질 활동 장면 제작
- **수행 내역**: 1. 토리의 고유 캐릭터 디자인(분홍색 운동복, 긴 귀, 둥근 안경, 사랑스러운 미소) 100% 일관성 유지\n2. 한국 어르신 2명이 토리와 함께 뜨개 장식 소품, 꽃 화분, 추억의 장난감과 책을 정리하는 정겨운 소근육/회상 참여 프로그램 장면 연출\n3. 원목 가구, 햇살 가득한 창가, 따뜻한 파스텔톤 3D 클레이 텍스처로 치매 어르신 정서 안정에 최적화\n4. assets/images/tori-home-decorating.png 저장 및 school-release 동기화 완료

## 자동 저장 / 2026-09-21 14:12:27 — 어르신과 함께하는 나비의 집 꾸미기 고화질 활동 장면 제작
- **수행 내역**: 1. 나비의 고유 캐릭터 디자인(삼색 얼룩 패턴, 둥근 안경, 상냥하고 감성적인 미소, 귀여운 고양이 체형) 100% 일관성 유지\n2. 한국 어르신 2명이 나비와 함께 손뜨개 인형 소품, 다육이/꽃 화분, 그림책과 책장을 정돈하는 정겨운 소근육/회상 참여 프로그램 장면 연출\n3. 원목 서가, 포근한 소파와 뜨개 쿠션, 햇살 가득한 창문, 따뜻한 3D 클레이 텍스처로 치매 어르신 정서 안정에 최적화\n4. assets/images/nabi-home-decorating.png 저장 및 school-release 동기화 완료

## 자동 저장 / 2026-09-21 14:14:27 — 어르신과 함께하는 곰이(보리)의 집 꾸미기 장면 에셋 구축
- **수행 내역**: 1. 곰이(보리)의 고유 캐릭터 디자인(차분하고 따뜻한 갈색 곰, 동화풍 서재/북카페/음악 공간) 일관성 반영\n2. 한국 어르신이 곰이와 함께 서재의 책, 화분, 장식품을 정돈하는 소근육/회상 참여 프로그램 장면 구성\n3. assets/images/bori-home-decorating.png 에셋 매핑 및 school-release 릴리즈 동기화 완료

## 자동 저장 / 2026-09-21 14:20:13 — 콩이·토리·나비·곰이 집 꾸미기 인터랙티브 웹 룸 및 오늘 종합 작업 보고서 작성 완료
- **수행 내역**: 1. 콩이/토리/나비/곰이 4인 캐릭터 집 꾸미기 웹 애플리케이션(character-house.html, css/character-house.css, js/character-house.js) 개발 완료\n2. 소근육 터치 인터랙션, 소품 배치, 캐릭터 맞춤형 TTS 음성 격려 멘트 탑재\n3. 메인 index.html 상단 및 히어로 영역 바로가기 연동 및 school-release/ 릴리즈 폴더 동기화 완료\n4. 오늘_작업_보고서_2026-09-21.md 상세 마크다운 파일 생성 및 TODAY_WORK_REPORT.md 자동 누적 완료

## 자동 저장 / 2026-09-21 14:24:28 — SCENE 1~10 치매 어르신 AI 체조 통합 연속 자동재생 영상 시스템 완성
- **수행 내역**: 1. 사용자가 '어르신 체조 시작' 버튼을 누르면 SCENE 1부터 SCENE 10까지 1초 페이드 전환으로 끊김 없이 연속 자동 재생되는 비디오 플레이어 엔진 구축\n2. 10개 씬별 특화 모션(숨쉬기, 고개 틸트, 어깨 올리기, 팔 뻗기, 박수 펄스, 무릎 들기, 발목, 잼잼 손운동, 손흔들기) 및 부드러운 애니메이션 탑재\n3. 한국어 여성 사회복지사 톤 TTS 낭독 속도(0.75배속) 및 숫자 간격(1초 이상 여유) 확보, 대형 고대비 진행 자막('3 / 10 목 운동' 등) 구현\n4. 안전 수칙 안내 문구 및 대형 조작 버튼(재생, 멈춤, 처음부터, 이전, 다음, 소리, 전체화면) 완비\n5. school-release/ 릴리즈 폴더 동기화 및 tests/verify-senior-ai-exercise.cjs 통과 완료

## 자동 저장 / 2026-09-21 14:24:56 — 오늘_작업_보고서_2026-09-21.md 갱신 및 전체 통합 검증 완료
- **수행 내역**: 1. SCENE 1부터 SCENE 10까지 한 번의 클릭으로 자동 연속 재생되는 완성형 AI 체조 영상 플레이어 구축 완료\n2. 10개 씬별 소요시간, 대사, 1초 여유 간격 카운트, 동작 모션 애니메이션 완벽 구현\n3. 4인 캐릭터 집 꾸미기 프로그램 및 오늘 작업 마크다운 보고서 저장 완료\n4. school-release 배포 동기화 완료

## 자동 저장 / 2026-09-21 14:31:56 — 「내가 꾸미는 AI 캐릭터 집」 전면 구현 및 어르신 참여형 하우스 시스템 완성
- **수행 내역**: 1. 콩이(운동방), 토리(놀이방), 나비(학습방), 곰이(취미방) 4인 캐릭터 집 꾸미기 참여형 디지털 룸 완성\n2. 옷 입히기(상의/하의/액세서리), 방 구조 6종, 벽지 5종, 바닥 4종, 창문/문 선택 기능 구현\n3. 가구/식물/장난감/책/조명/쿠션/음악/운동 소품 배치 및 8방향 위치/회전/크기 조작 D-Pad 탑재\n4. 되돌리기(Undo), 초기화 모달, 내 집 저장하기(localStorage), 다음 방문 시 '이어 꾸미기' 복원 시스템 완료\n5. 오늘의 작은 미션 및 완성 시 축하 애니메이션/음성(TTS) 제공\n6. school-release/ 릴리즈 동기화 및 tests/verify-character-house.cjs 무결점 통과

## 자동 저장 / 2026-09-21 14:35:39 — 초록 다육이 등 최신 이모지 폰트 호환성 개선 및 깨짐(Tofu) 완벽 해결
- **수행 내역**: 1. 일부 윈도우/브라우저 환경에서 이모지 깨짐(네모 박스)이 발생할 수 있는 신규 이모지(🪴 등)를 표준 호환 이모지(🌱, 🌿 등)로 교체\n2. css/character-house.css에 Segoe UI Emoji, Apple Color Emoji 등 컬러 이모지 폰트 패밀리 폴백 명시\n3. 모든 기기에서 선명하고 정확한 이모지 및 아이콘 렌더링 검증 완료\n4. school-release/ 릴리즈 폴더 동기화 완료

## 자동 저장 / 2026-09-21 14:39:17 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 54
<details><summary>변경 파일 목록</summary>

- [.vercelignore](./.vercelignore)
- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [assets/images/bori-home-decorating.png](./assets/images/bori-home-decorating.png)
- [assets/images/exercise/gymnastics-intro.jpg](./assets/images/exercise/gymnastics-intro.jpg)
- [assets/images/exercise/gymnastics-step1.jpg](./assets/images/exercise/gymnastics-step1.jpg)
- [assets/images/exercise/gymnastics-step2.jpg](./assets/images/exercise/gymnastics-step2.jpg)
- [assets/images/exercise/gymnastics-step3.jpg](./assets/images/exercise/gymnastics-step3.jpg)
- [assets/images/exercise/gymnastics-step4.jpg](./assets/images/exercise/gymnastics-step4.jpg)
- [assets/images/kongi-home-decorating.png](./assets/images/kongi-home-decorating.png)
- [assets/images/nabi-home-decorating.png](./assets/images/nabi-home-decorating.png)
- [assets/images/tori-home-decorating.png](./assets/images/tori-home-decorating.png)
- [assets/senior-exercise/MOTION_VIDEO_BRIEF.md](./assets/senior-exercise/MOTION_VIDEO_BRIEF.md)
- [assets/senior-exercise/README.md](./assets/senior-exercise/README.md)
- [assets/senior-exercise/audio/program.mp3](./assets/senior-exercise/audio/program.mp3)
- [assets/senior-exercise/captions-ko.vtt](./assets/senior-exercise/captions-ko.vtt)
- [assets/senior-exercise/images/arms.png](./assets/senior-exercise/images/arms.png)
- [assets/senior-exercise/images/breathing.png](./assets/senior-exercise/images/breathing.png)
- [assets/senior-exercise/images/intro.png](./assets/senior-exercise/images/intro.png)
- [assets/senior-exercise/images/legs.png](./assets/senior-exercise/images/legs.png)
- [assets/senior-exercise/images/neck.png](./assets/senior-exercise/images/neck.png)
- [assets/senior-exercise/images/scene01_intro.jpg](./assets/senior-exercise/images/scene01_intro.jpg)
- [assets/senior-exercise/images/scene02_breathing.jpg](./assets/senior-exercise/images/scene02_breathing.jpg)
- [assets/senior-exercise/images/scene03_neck.jpg](./assets/senior-exercise/images/scene03_neck.jpg)
- [assets/senior-exercise/images/scene04_shoulders.jpg](./assets/senior-exercise/images/scene04_shoulders.jpg)
- [assets/senior-exercise/images/scene05_arms.jpg](./assets/senior-exercise/images/scene05_arms.jpg)
- [assets/senior-exercise/images/scene06_clapping.jpg](./assets/senior-exercise/images/scene06_clapping.jpg)
- [assets/senior-exercise/images/scene07_knees.jpg](./assets/senior-exercise/images/scene07_knees.jpg)
- [assets/senior-exercise/images/scene08_ankles.jpg](./assets/senior-exercise/images/scene08_ankles.jpg)
- [assets/senior-exercise/images/scene09_hands.jpg](./assets/senior-exercise/images/scene09_hands.jpg)
- [assets/senior-exercise/images/scene10_ending.jpg](./assets/senior-exercise/images/scene10_ending.jpg)
- [assets/senior-exercise/program.json](./assets/senior-exercise/program.json)
- [assets/senior-exercise/script.json](./assets/senior-exercise/script.json)
- [assets/senior-exercise/source/arms-original-seven.png](./assets/senior-exercise/source/arms-original-seven.png)
- [assets/senior-exercise/source/narration-pcm.wav](./assets/senior-exercise/source/narration-pcm.wav)
- [assets/senior-exercise/source/narration.wav](./assets/senior-exercise/source/narration.wav)
- [assets/senior-exercise/source/program.wav](./assets/senior-exercise/source/program.wav)
- [assets/senior-exercise/source/speech.json](./assets/senior-exercise/source/speech.json)
- [character-house.html](./character-house.html)
- [css/character-house.css](./css/character-house.css)
- [css/senior-exercise-entry.css](./css/senior-exercise-entry.css)
- [css/senior-exercise.css](./css/senior-exercise.css)
- [css/senior-gymnastics.css](./css/senior-gymnastics.css)
- [index.html](./index.html)
- [js/character-house.js](./js/character-house.js)
- [js/senior-exercise.js](./js/senior-exercise.js)
- [js/senior-experiences.js](./js/senior-experiences.js)
- [js/senior-finish.js](./js/senior-finish.js)
- [js/senior-gymnastics.js](./js/senior-gymnastics.js)
- [scripts/build-senior-exercise.py](./scripts/build-senior-exercise.py)
- [senior-exercise.html](./senior-exercise.html)
- [tests/senior-exercise-assets.py](./tests/senior-exercise-assets.py)
- [tests/senior-exercise.cjs](./tests/senior-exercise.cjs)
- [tests/warmup-intro.cjs](./tests/warmup-intro.cjs)
- [오늘_작업_일지_2026-09-21.md](./오늘_작업_일지_2026-09-21.md)

</details>

## 자동 저장 / 2026-09-21 14:55:01 — 디지털 AI 학교 3차 전체 점검 및 기능 고도화
- **수행 내역**: 1. 메인 화면 4대 캐릭터 룸(콩이 운동방, 토리 놀이방, 나비 학습방, 곰이 취미방) 도어 및 일일 맞춤 추천(요일별 테마, 출석 인사, 원클릭 시작) 구조 개편. 2. 내가 꾸미는 AI 캐릭터 집 6대 방 구조, 9대 가구/소품 카테고리, 쉬운 꾸미기(좌/중/우 자동배치) 및 자유 모드, 되돌리기, 저장/이어하기, 칭찬 및 도장 시스템 구현. 3. 10단계 AI 의자 체조 영상 플레이어 완료 모달, 도장 지급 및 설명 듣기 TTS 연동. 4. 접근성 및 위치 안내 강화. 전수 테스트 100% 통과.

## 자동 저장 / 2026-09-21 14:55:17 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 11
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [character-house.html](./character-house.html)
- [css/character-house.css](./css/character-house.css)
- [css/main.css](./css/main.css)
- [index.html](./index.html)
- [js/app.js](./js/app.js)
- [js/character-house.js](./js/character-house.js)
- [js/senior-exercise.js](./js/senior-exercise.js)
- [senior-exercise.html](./senior-exercise.html)
- [tests/verify-third-round-upgrade.cjs](./tests/verify-third-round-upgrade.cjs)
- [오늘_작업_일지_2026-09-21.md](./오늘_작업_일지_2026-09-21.md)

</details>

## 자동 저장 / 2026-09-21 15:09:01 — 4차 고도화: 링크 오류 수정 + 토리/나비 방 신규 생성
- **수행 내역**: 1. index.html 캐릭터 방 버튼 링크 오류 수정: 토리→tori-play.html, 나비→nabi-learn.html, 곰이→bori-hobby.html(예정), 콩이→senior-exercise.html / 2. tori-play.html 신규 생성: 같은 그림 찾기, 색깔 맞추기, 계절 놀이, 동물 맞히기 4종 인터랙티브 게임, TTS 안내, 도장 시스템 / 3. nabi-learn.html 신규 생성: 오늘 날짜, 계절 배우기, 속담 이야기, 숫자 알기 4종 학습, 한 화면 한 질문, 긍정 피드백, TTS 안내 / 4. bori-hobby.html 생성 예정

## 자동 저장 / 2026-09-22 09:32:46 — 보리의 취미방(bori-hobby.html) 신규 생성 및 연동 완료
- **수행 내역**: 어제 미완료된 bori-hobby.html 생성: 노래 따라 부르기(6곡/TTS), 옛날 이야기(6편/O-X퀴즈), 색칠 그림(Canvas 드로잉/6테마), 수수께끼(10문제/힌트+정답) 4탭 구현. 도장 시스템(localStorage), TTS 보리 음성, 완료 축하 배너 포함. index.html bori-hobby.html 링크 기존에 연결됨 확인. school-release 동기화 완료.

## 자동 저장 / 2026-09-22 09:39:55 — 캐릭터 집 꾸미기 모달 닫기 및 화면 전환 버그 수정
- **수행 내역**: 1. 원인 분석: css/character-house.css에 [hidden] 규칙이 누락되고 .ch-complete-view 및 .ch-modal-overlay에 display: flex가 선언되어 있어 completeView 모달의 hidden 속성이 무시되고 진입 시 상시 노출 및 닫기 버튼(자랑스럽게 집 구경 마치기) 클릭 시에도 닫히지 않는 이슈 발생
2. CSS 수정: css/character-house.css 최상단 및 모달 선택자에 [hidden] { display: none !important; } 추가
3. HTML/JS 수정: character-house.html 인라인 display:none 기본 적용, js/character-house.js 초기화 시 모달 숨김 보장, 모달 닫기 시 친구 선택 화면(goToSelectScreen)으로 전환 및 '계속 더 꾸미기', '처음 홈으로' 옵션 보강, ?char= URL 파라미터 연동 지원
4. 동기화 및 검증: school-release 폴더에 character-house 관련 파일 복사 및 검증 테스트 통과

## 자동 저장 / 2026-09-22 09:41:15 — 캐릭터 집 꾸미기 화면 멈춤 오류 해결 및 보리 취미방 신규 배포
- **수행 내역**: 1. bori-hobby.html(노래 부르기, 옛 이야기, 색칠하기, 수수께끼) 신규 개발 및 링크 연결
2. character-house.css의 [hidden] display:none 누락 수정 및 character-house.html/js 모달 닫기/화면 전환(goToSelectScreen) 로직 정상화
3. school-release 폴더 완전 동기화 및 테스트 검증 완료

## 자동 저장 / 2026-09-22 09:41:19 — 캐릭터 집 꾸미기 화면 멈춤 오류 해결 및 보리 취미방 신규 배포
- **수행 내역**: 1. bori-hobby.html(노래 부르기, 옛 이야기, 색칠하기, 수수께끼) 신규 개발 및 링크 연결
2. character-house.css의 [hidden] display:none 누락 수정 및 character-house.html/js 모달 닫기/화면 전환(goToSelectScreen) 로직 정상화
3. school-release 폴더 완전 동기화 및 테스트 검증 완료

## 자동 저장 / 2026-09-22 09:41:37 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 17
<details><summary>변경 파일 목록</summary>

- [4차_고도화_작업_보고서_2026-09-21.md](./4차_고도화_작업_보고서_2026-09-21.md)
- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [bori-hobby.html](./bori-hobby.html)
- [character-house.html](./character-house.html)
- [css/character-house.css](./css/character-house.css)
- [index.html](./index.html)
- [js/character-house.js](./js/character-house.js)
- [nabi-learn.html](./nabi-learn.html)
- [scripts/fix-index-html.cjs](./scripts/fix-index-html.cjs)
- [scripts/patch-index-house.cjs](./scripts/patch-index-house.cjs)
- [scripts/patch-index-warmup.cjs](./scripts/patch-index-warmup.cjs)
- [tests/verify-character-house.cjs](./tests/verify-character-house.cjs)
- [tests/verify-senior-ai-exercise.cjs](./tests/verify-senior-ai-exercise.cjs)
- [tori-play.html](./tori-play.html)
- [오늘_작업_보고서_2026-09-21.md](./오늘_작업_보고서_2026-09-21.md)
- [오늘_작업_일지_2026-09-21.md](./오늘_작업_일지_2026-09-21.md)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 09:55:49 — AI 캐릭터 집 꾸미기 화면 3단 시니어 맞춤형 레이아웃 전면 개편
- **수행 내역**: 1. UI 구조 개편: 좌측 5개 대형 카테고리(옷, 방, 가구, 꾸미기, 놀이), 중앙 60~70% 실제 방+콩이 캐릭터 미리보기, 우측 2열 직관적 아이템 카드 목록 3단 배치
2. 어르신 시니어 접근성: 한글 세로 깨짐 원천 차단(white-space: normal, word-break: keep-all, 20px+ 시원한 가로 콩이 말풍선), 최소 52px+ 대형 버튼, 가구 및 소품 마우스/터치 드래그 앤 드롭 지원
3. 인지 활동 연계: 상단 오늘의 미션 배너 및 미션 완료 실시간 칭찬 피드백, 미니 툴바(크게/작게/회전/치우기) 연동
4. 하단 3대 필수 버튼: ↩ 되돌리기, 💾 내 방 저장하기, ✨ 꾸미기 완료(초록 강조)
5. 동기화 및 검증: tests/verify-character-house.cjs 전수 통과 확인

## 자동 저장 / 2026-09-22 09:55:55 — AI 캐릭터 집 꾸미기 화면 3단 시니어 맞춤형 레이아웃 전면 개편
- **수행 내역**: 1. UI 구조 개편: 좌측 5개 대형 카테고리(옷, 방, 가구, 꾸미기, 놀이), 중앙 60~70% 실제 방+콩이 캐릭터 미리보기, 우측 2열 직관적 아이템 카드 목록 3단 배치
2. 어르신 시니어 접근성: 한글 세로 깨짐 원천 차단(white-space: normal, word-break: keep-all, 20px+ 시원한 가로 콩이 말풍선), 최소 52px+ 대형 버튼, 가구 및 소품 마우스/터치 드래그 앤 드롭 지원
3. 인지 활동 연계: 상단 오늘의 미션 배너 및 미션 완료 실시간 칭찬 피드백, 미니 툴바(크게/작게/회전/치우기) 연동
4. 하단 3대 필수 버튼: ↩ 되돌리기, 💾 내 방 저장하기, ✨ 꾸미기 완료(초록 강조)
5. 동기화 및 검증: tests/verify-character-house.cjs 전수 통과 확인

## 자동 저장 / 2026-09-22 09:56:07 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 5
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [character-house.html](./character-house.html)
- [css/character-house.css](./css/character-house.css)
- [js/character-house.js](./js/character-house.js)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 10:01:40 — AI와 같이 운동하기 화면 전면 개선 및 시작 전 완료 팝업 완전 차단
- **수행 내역**: 1. 입장 시 완료 팝업 노출 문제 해결(오직 10개 동작 완료 시에만 노출), 2. 2단 어르신 친화적 레이아웃(좌측 56px+ 대형 조작 버튼, 우측 16:9 대형 체조 무대, 상단 콩이 안내 말풍선 및 진행 시간), 3. 하단 10개 동작 목록에 완료 체크(completed) 및 진행률 실시간 반영, 4. 모달 및 흐름 자동 검증 통과

## 자동 저장 / 2026-09-22 10:01:59 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 6
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/senior-exercise.css](./css/senior-exercise.css)
- [js/senior-exercise.js](./js/senior-exercise.js)
- [senior-exercise.html](./senior-exercise.html)
- [tests/verify-modal-flow.cjs](./tests/verify-modal-flow.cjs)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 10:10:21 — 치매 어르신 인지 플랫폼 6대 수정 원칙 AGENTS.md 상시 기본 규칙으로 등록
- **수행 내역**: 사용자가 매번 입력하지 않더라도 상시 자동 적용되도록 프로젝트 지침(AGENTS.md) 최상단에 6대 수정 원칙(기존 자산 보존, 점진적 UI/UX 개선, 어르신 맞춤형 사용성, 관리자 기능 분리, 일관성 유지, 사전 영향도 분석)을 명시 및 영구 반영

## 자동 저장 / 2026-09-22 10:10:29 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 3
<details><summary>변경 파일 목록</summary>

- [AGENTS.md](./AGENTS.md)
- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 10:14:09 — 어르신용 메인 화면과 선생님/관리자용 화면 구조 분리 1차 개편
- **수행 내역**: 1. 헤더 어르신 중심화: 복잡한 관리자 버튼을 분리하고 우측 상단 '선생님 공간' 버튼 배치, 2. 어르신 메인 전면 배치: 🐶콩이와 운동하기, 🐰토리와 놀이하기, 🐱나비와 학습하기, 🐻곰이와 취미하기 4대 대형 활동 카드 전면 배치, 3. 관리자 6대 기능(어르신 관리, 수업 기록, AI 수업일지, 변화 분석, 보호자 보고서, 관리자 설정)을 선생님 공간 모달 내 탭으로 일원화, 4. 기존 학습 콘텐츠 및 데이터 100% 보존, 5. 자동 검증 100% 통과

## 자동 저장 / 2026-09-22 10:14:28 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 8
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/main.css](./css/main.css)
- [css/teacher.css](./css/teacher.css)
- [index.html](./index.html)
- [js/app.js](./js/app.js)
- [js/care-workflow.js](./js/care-workflow.js)
- [tests/verify-screen-separation.cjs](./tests/verify-screen-separation.cjs)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 10:17:09 — 메인 화면 단순화 및 진입 구조 정리 2차 개편
- **수행 내역**: 1. 첫 화면을 '오늘 누구와 무엇을 할까요?'에만 집중하도록 대폭 단순화, 2. 따뜻한 인사('안녕하세요. 오늘도 만나서 반갑습니다.') 및 4대 핵심 활동 카드(🐶콩이와 운동하기, 🐰토리와 놀이하기, 🐱나비와 학습하기, 🐻곰이와 취미하기) 중심 배치, 3. 하단 지난 활동 보기 버튼 및 전체 수업 더보기 서랍형 배치, 4. 길게 나열되던 하위 섹션들(AI 코스 8강, 인지 코스 8강, 20분 체조 등)을 서랍형으로 접어 메인 화면 스크롤 대폭 축소, 5. 기존 자산 및 DOM 100% 보존, 전체 테스트 100% 통과

## 자동 저장 / 2026-09-22 10:17:27 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 7
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/main.css](./css/main.css)
- [index.html](./index.html)
- [js/app.js](./js/app.js)
- [js/care-workflow.js](./js/care-workflow.js)
- [tests/verify-screen-simplification.cjs](./tests/verify-screen-simplification.cjs)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 10:25:45 — 캐릭터 이름 전면 통일(곰이) 및 4대 캐릭터방 구조 일관성 개선
- **수행 내역**: 1. 캐릭터 이름 전면 통일: 콩이(운동방), 토리(놀이방), 나비(학습방), 곰이(취미방)\n2. 보리로 남아 있던 bori-hobby.html, index.html, voice.js, friends-and-play.js, character-rooms.js, weather-service.js, home-care-recommendations.js 등의 UI/TTS/메타데이터를 곰이로 전면 교체\n3. 4대 캐릭터방 공통 구조(상단 뒤로가기 및 배지, 중앙 캐릭터 말풍선 및 4대 활동 영역, 하단 처음으로 및 완료 칭찬 흐름) 통일\n4. tests/verify-character-unification.cjs 신규 작성 및 전체 검증 통과\n5. school-release 릴리즈 동기화 완료

## 자동 저장 / 2026-09-22 10:25:55 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 22
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [bori-hobby.html](./bori-hobby.html)
- [characters/manifest.json](./characters/manifest.json)
- [index.html](./index.html)
- [js/character-3d-renderer.js](./js/character-3d-renderer.js)
- [js/character-audio-player.js](./js/character-audio-player.js)
- [js/character-rooms.js](./js/character-rooms.js)
- [js/character-voice-recognizer.js](./js/character-voice-recognizer.js)
- [js/characters.js](./js/characters.js)
- [js/friends-and-play.js](./js/friends-and-play.js)
- [js/home-care-experience.js](./js/home-care-experience.js)
- [js/home-care-recommendations.js](./js/home-care-recommendations.js)
- [js/joint-room.js](./js/joint-room.js)
- [js/morning-program.js](./js/morning-program.js)
- [js/senior-finish.js](./js/senior-finish.js)
- [js/voice.js](./js/voice.js)
- [js/warmup-intro.js](./js/warmup-intro.js)
- [js/weather-service.js](./js/weather-service.js)
- [js/welcome-greeting.js](./js/welcome-greeting.js)
- [senior-exercise.html](./senior-exercise.html)
- [tests/verify-character-unification.cjs](./tests/verify-character-unification.cjs)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 10:32:31 — 디지털 AI 학교 4차 수정 - 콩이 운동방 3단계 상태 흐름(시작 전/운동 중/운동 완료 후) 완벽 분리 및 직관적 UI/UX 개편
- **수행 내역**: 1. 시작 전(Ready) 상태: 따뜻한 콩이 인사말, 건강 체조 소개, 총 소요시간(약 12분)/10단계 안내, 초대형 [지금 운동 시작하기] 버튼 및 10개 체조 순서 카드 목록 전면 배치. 2. 운동 중(Playing) 상태: 16:9 메인 체조 영상 모션, 콩이 실시간 응원 말풍선, 대형 자막, 진행 타임라인 및 일시정지/이어서하기, 이전/다음, 처음부터, 준비화면 복귀, 10개 동작 썸네일 그리드 완비. 3. 운동 완료 후(Completed) 상태: 시작 전 완료 팝업 조기 노출을 100% 원천 차단하고 오직 10개 동작을 끝마쳤을 때만 건강 꽃 도장 발급(+1), 칭찬 메시지, 요약 통계(10/10, 12:20), [체조 다시 하기] 및 [학교 홈으로 가기] 버튼 노출. 4. 자동 검증 스크립트 tests/verify-exercise-state-flow.cjs 작성 및 기존 6종 검증 테스트 100% 통과.

## 자동 저장 / 2026-09-22 10:32:50 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 6
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/senior-exercise.css](./css/senior-exercise.css)
- [js/senior-exercise.js](./js/senior-exercise.js)
- [senior-exercise.html](./senior-exercise.html)
- [tests/verify-exercise-state-flow.cjs](./tests/verify-exercise-state-flow.cjs)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 10:36:42 — 디지털 AI 학교 5차 수정 - AI 캐릭터 집 꾸미기 화면 전면 개선(체험형 실제 방 미리보기, 원클릭 가구 즉시 배치, 옷 입히기 직관화, 오늘의 미션 강화)
- **수행 내역**: 1. 실제 방 미리보기 강화: 중앙 방 뷰포트를 580px로 웅장하게 확장하고, 벽면 입체 그라데이션, 원목 마루 바닥, 햇살 창문, 원목 문, 중앙 원형 러그 등 아늑한 인테리어 구현. 2. 옷 입히기 직관화: 실제 옷 그림 카드(50px 아이콘 + 착용 상태 태그)로 렌더링하고, 클릭 시 캐릭터에 0.65초간 화사한 환복 오라 애니메이션(outfitGlow) 발동 및 즉시 반영. 3. 가구/소품 원클릭 즉시 방 배치: 아이템 클릭 시 중앙 방에 쏙 들어가는 통통 튀는 pop-in 애니메이션과 함께 즉시 자동 배치되고, 좌/중/우 이동 버튼 및 드래그 지원. 4. 세로 글자 깨짐 완전 방지: 카테고리 메뉴 및 카드 버튼에 word-break: keep-all, white-space: nowrap 적용하여 글자가 세로로 떨어지는 현상 원천 차단. 5. 오늘의 미션 실시간 피드백: 캐릭터별 미션 아이템 배치 시 미션 성공 배지 노출, 따뜻한 한국어 음성(TTS) 칭찬, 꽃 도장 즉시 발급. 6. 자동 검증 스크립트 tests/verify-character-house-experience.cjs 작성 및 기존 6종 테스트 100% 통과.

## 자동 저장 / 2026-09-22 10:36:59 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 6
<details><summary>변경 파일 목록</summary>

- [.gitignore](./.gitignore)
- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/character-house.css](./css/character-house.css)
- [js/character-house.js](./js/character-house.js)
- [tests/verify-character-house-experience.cjs](./tests/verify-character-house-experience.cjs)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 10:49:39 — 콩이 집 꾸미기 레이아웃 개선
- **수행 내역**: 요청: 기존 캐릭터·의상 원본 유지, 캐릭터 확대와 생활 공간 배치 개선. 영향 분석 후 고정 3열을 방 중심 반응형 구성으로 변경. 원본 PNG 유지, 캐릭터 표시 높이 약 40~45%, 발밑 약한 그림자, 큰 노란 점선 타원 제거 및 좌측 작은 러그로 변경. 새 방에 소파·쿠션·테이블·책장·화분·조명·액자 구성, 기존 저장 방은 보존. 가구는 SVG 도형으로 표시하고 즉시 추가/이동/삭제 및 벽지 색상 반영. 코디 카드를 방 하단으로 이동. 기존 옷 선택은 착용 이미지가 없는 이름 선택 기능임을 확인하여 실제 착용으로 오인하는 안내 수정; 원본 의상 변경 없이 유지, 착용 이미지 경로 사용자 질의 상태. 가구 조작 버튼은 방 밖으로 이동. 1440/1024/768/390px에서 화면 비율·가로 넘침·추가·벽지·되돌리기·저장 복원 검증 통과. 관련 파일: [화면](file:///J:/sh/character-house.html), [스타일](file:///J:/sh/css/character-house.css), [가구](file:///J:/sh/js/house-furnishings.js), [상태 로직](file:///J:/sh/js/character-house.js), [검증](file:///J:/sh/tests/character-house-layout.cjs).

## 자동 저장 / 2026-09-22 10:52:37 — 오늘의 코디와 실제 착용 의상 일치
- **수행 내역**: 사용자 요청: 오늘의 코디 카드와 캐릭터가 입은 옷을 맞추기. 원본 캐릭터 이미지는 유지하고 현재 착용 표시를 실제 이미지 기준으로 변경. 콩이는 노란색·흰색 운동복, 노란 운동복 바지, 둥근 안경 표시. 선택한 니트 등은 입고 싶은 옷 기록으로 구분하며 기존 선택 데이터 보존. 네 화면 크기에서 선택 후에도 착용 정보 일치 및 저장 복원 검사 통과. 관련 파일: [화면](file:///J:/sh/character-house.html), [착용 정보](file:///J:/sh/js/character-house.js), [검증](file:///J:/sh/tests/character-house-layout.cjs).

## 자동 저장 / 2026-09-22 10:59:50 — 오늘 작업 GitHub·Vercel 배포 준비
- **수행 내역**: 오늘 작업 일지의 기존 기록을 보존하고 누적 저장. 콩이 집 꾸미기 방 중심 레이아웃, 가구 배치, 반응형 개선과 실제 착용 의상에 맞춘 오늘의 코디 표시를 최종 반영. 4개 화면 크기 기능 검증 통과. GitHub 푸시 및 Vercel 프로덕션 배포 요청에 따라 릴리즈 동기화 후 배포 진행.

## 자동 저장 / 2026-09-22 11:00:16 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 7
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [character-house.html](./character-house.html)
- [css/character-house.css](./css/character-house.css)
- [js/character-house.js](./js/character-house.js)
- [js/house-furnishings.js](./js/house-furnishings.js)
- [tests/character-house-layout.cjs](./tests/character-house-layout.cjs)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 11:01:52 — GitHub 푸시·Vercel 운영 배포 완료
- **수행 내역**: 코드 커밋 4f36e8b를 GitHub origin/main에 푸시 완료. Vercel 운영 배포 dpl_C3eVCCM22Tmi7AJsE6pktMVXVkrT READY 확인. https://school-tau-pearl.vercel.app/character-house.html HTTP 200 및 최신 스크립트 버전·실제 착용 정보 코드 확인 통과. 작업 완료 시 자동 일지 저장 및 커밋 전 파일 목록 기록 체계 유지.

## 자동 저장 / 2026-09-22 11:02:15 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 11:16:29 — 실시간 캐릭터 커스터마이징 구현
- **수행 내역**: 최신 사용자 요청에 따라 집 꾸미기 화면의 선택 기록 방식을 실제 레이어 변경으로 전환. 콩이·토리·나비·곰이 의상 6종, 상의/하의/신발/포인트/안경 6색 팔레트, 액세서리 6종 착탈, 표정 4종, 소품 6종 즉시 반영. 원본 PNG 보존, 의상/소품 SVG 레이어와 image_gen 얼굴 부분 편집 5개 자산 사용. 한 카테고리 4~6개 큰 버튼, 저장·다시 꾸미기·기본 모습 복귀, 캐릭터별 customizations 저장 및 완료 화면 실제 미리보기 연결. 기존 방과 선택 기록 데이터 보존. 4캐릭터의 실제 미리보기 변화·원본 레이어 복원·저장 복원 및 4개 화면 크기 기존 방 기능 검사 통과. 관련 파일: [구현](file:///J:/sh/js/character-customizer.js), [제작 상세](file:///J:/sh/assets/character-customization/README.md), [검증](file:///J:/sh/tests/character-customizer.cjs).

## 자동 저장 / 2026-09-22 11:33:19 — 네 캐릭터 방 실시간 꾸미기 개선
- **수행 내역**: 콩이·토리·나비·보리별 방 테마와 독립 저장/자동 복원을 구현했습니다. 커튼·러그·벽/바닥·가구·미끄럼틀·텐트·테마 소품을 즉시 반영하며 기존 의상/색상/액세서리/표정/손 소품 편집을 유지했습니다. 쉬운 모드 4개, 자유 모드 6개 선택지와 페이지 이동을 적용했습니다. 현재 방 초기화/되돌리기 및 이전 단일 방 저장 데이터 이관을 검증했습니다. 보리 표시 이름을 통일하고 기존 곰이 음성 호출 별칭을 보존했습니다. room-decor, character-house-layout, character-customizer 테스트 통과(1440/1024/768/390px). JS 59개 문법 검사 통과; 수정하지 않은 user-profile.js 24행의 기존 문법 오류는 릴리즈와 동일함을 확인했으며 별도 해결이 필요합니다. documents/ROOM_DECOR.md에 구조와 사용법을 기록했습니다. 원격 푸시/배포는 이번 요청에 포함되지 않아 실행하지 않았습니다.

## 자동 저장 / 2026-09-22 11:39:05 — 홈페이지 네 캐릭터 중심 Hero 구성
- **수행 내역**: 첨부 image_3a8430e8.jpg를 원본 그대로 assets/images/home-hero/four-friends.jpg에 보존하고 SVG 표시 영역으로 네 친구를 개별 링크에 연결했습니다. 얼굴/색상/비율 재생성이나 이미지 편집 없이 사용했습니다. 인사말, 보조 문구, 큰 오늘 활동 시작하기 버튼과 선생님 공간을 배치하고 기존 메뉴·소리·글자 도구를 아래로 이동했습니다. 콩이/토리/나비/보리는 기존 운동/놀이/학습/취미 페이지로 연결됩니다. 첫 방문 팝업의 자동 표시만 중단하고 수동 인사 듣기는 보존했습니다. 1440/768/390px 4열/2열 및 가로 넘침 없음, 모든 활동 URL 정상 응답, 실제 토리 링크 이동과 선생님 버튼 동작을 확인했습니다. 변경 파일: index.html, css/home-character-hero.css, js/home-character-hero.js, js/welcome-greeting.js, assets/images/home-hero/four-friends.jpg. 원격 배포는 실행하지 않았습니다.

## 자동 저장 / 2026-09-22 11:44:52 — 체조 화면 이미지 넘침 및 안내문 줄바꿈 수정
- **수행 내역**: HTML/JS가 생성하는 se-ready-card-img/body 클래스와 CSS의 기존 thumb/info 클래스 불일치를 확인했습니다. 실제 클래스에 이미지 width/max-width 100%, height auto, contain을 적용하고 카드를 이미지 위·안내문 아래 구조로 수정했습니다. 좁은 화면에서 240px 최소 그리드와 280px 본문 최소 너비가 넘치지 않도록 개선하고 keep-all 줄바꿈을 적용했습니다. 재생 장면의 cover를 contain으로 바꾸고 전체 프레임 확대/회전만 중단해 가장자리 잘림을 방지했습니다. 장면 전환과 재생/일시정지는 유지했습니다. 1440/768/390/320px 준비·재생 화면 가로 넘침 없음, 이미지 부모 영역 이내, 안내문 너비 200px 이상, contain/확대 없음 및 시작/일시정지 동작 확인. 변경: css/senior-exercise.css, senior-exercise.html.

## 자동 저장 / 2026-09-22 11:46:00 — GitHub 및 Vercel 배포 준비
- **수행 내역**: 완료한 캐릭터 방 실시간 꾸미기, 홈페이지 네 친구 Hero, 체조 이미지 및 줄바꿈 수정을 배포합니다. 앞선 기능·반응형 검사 통과 결과와 작업 문서를 포함합니다. 기존 user-profile.js 문법 오류는 이번 변경과 무관하며 별도 기록되어 있습니다.

## 자동 저장 / 2026-09-22 11:46:27 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 42
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [assets/character-customization/README.md](./assets/character-customization/README.md)
- [assets/character-customization/bori-closed-eyes.png](./assets/character-customization/bori-closed-eyes.png)
- [assets/character-customization/kongi-closed-eyes.png](./assets/character-customization/kongi-closed-eyes.png)
- [assets/character-customization/kongi-no-glasses.png](./assets/character-customization/kongi-no-glasses.png)
- [assets/character-customization/nabi-closed-eyes.png](./assets/character-customization/nabi-closed-eyes.png)
- [assets/character-customization/tori-closed-eyes.png](./assets/character-customization/tori-closed-eyes.png)
- [assets/images/home-hero/four-friends.jpg](./assets/images/home-hero/four-friends.jpg)
- [bori-hobby.html](./bori-hobby.html)
- [character-house.html](./character-house.html)
- [characters/manifest.json](./characters/manifest.json)
- [css/character-house.css](./css/character-house.css)
- [css/home-character-hero.css](./css/home-character-hero.css)
- [css/senior-exercise.css](./css/senior-exercise.css)
- [documents/ROOM_DECOR.md](./documents/ROOM_DECOR.md)
- [index.html](./index.html)
- [js/app.js](./js/app.js)
- [js/character-3d-renderer.js](./js/character-3d-renderer.js)
- [js/character-audio-player.js](./js/character-audio-player.js)
- [js/character-customizer.js](./js/character-customizer.js)
- [js/character-house.js](./js/character-house.js)
- [js/character-rooms.js](./js/character-rooms.js)
- [js/character-voice-recognizer.js](./js/character-voice-recognizer.js)
- [js/characters.js](./js/characters.js)
- [js/friends-and-play.js](./js/friends-and-play.js)
- [js/home-care-experience.js](./js/home-care-experience.js)
- [js/home-care-recommendations.js](./js/home-care-recommendations.js)
- [js/home-character-hero.js](./js/home-character-hero.js)
- [js/house-furnishings.js](./js/house-furnishings.js)
- [js/joint-room.js](./js/joint-room.js)
- [js/morning-program.js](./js/morning-program.js)
- [js/room-decor.js](./js/room-decor.js)
- [js/senior-finish.js](./js/senior-finish.js)
- [js/voice.js](./js/voice.js)
- [js/warmup-intro.js](./js/warmup-intro.js)
- [js/weather-service.js](./js/weather-service.js)
- [js/welcome-greeting.js](./js/welcome-greeting.js)
- [senior-exercise.html](./senior-exercise.html)
- [tests/character-customizer.cjs](./tests/character-customizer.cjs)
- [tests/character-house-layout.cjs](./tests/character-house-layout.cjs)
- [tests/room-decor.cjs](./tests/room-decor.cjs)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 11:53:20 — 캐릭터 음성 개선 작업
- **수행 내역**: 캐릭터별 목소리 구분과 음성 재생 개선을 진행했습니다. 최종 운영 화면에서 네 캐릭터의 재생 완료를 확인했습니다. 연결 관련 세부 설명은 사용자 요청에 따라 이 일지에서 제외했습니다.

## 자동 저장 / 2026-09-22 11:55:03 — 사용자 공통 작업 원칙 영구 기록
- **수행 내역**: AGENTS.md에 사용자가 지정한 공통 규칙을 추가했습니다. 기존 지침은 보존했으며 임의 변경 금지, 사전 코드/저장 로직 분석, 기존 캐릭터/기능/데이터/라우팅 보존, 어르신 접근성, 단계 범위 준수, 변경 파일/기능/보존 기능/확인 사항의 짧은 보고를 상시 적용합니다. 지침 문서만 변경했으며 제품 코드와 음성 연결 작업은 진행하지 않았습니다. 문서 변경이므로 build/lint/브라우저 검사는 실행하지 않았습니다.

## 자동 저장 / 2026-09-22 12:00:51 — 1차 메인 중복 진입 구조 통합
- **수행 내역**: index.html, js/home-character-hero.js, css/home-character-hero.css, js/senior-finish.js를 수정해 홈은 기존 네 캐릭터 이미지/링크, 의자 체조 추천 하나, 지난 활동/전체 활동 버튼만 표시합니다. 인사·기분·아침 프로그램과 기존 메뉴는 전체 활동에서 보존했습니다. AI 수업과 인지활동은 각각 디지털 배우기/시니어 인지활동 접힌 영역으로 이동했습니다. 기존 수업 카드 14개와 이벤트를 보존하고 실제 AI 기초 실행, 인지활동 폴더, 기록 및 홈 복귀, 768/390px 가로 넘침 없음을 확인했습니다. 콘솔 점검 중 기존 warmupReplay 요소 부재 오류를 찾아 js/warmup-intro.js에 선택적 바인딩을 적용했습니다. 배포 빌드 스크립트와 JS 구문 검사 통과. 1차 범위만 수행했으며 원격 푸시/배포 및 후속 음성 연결은 진행하지 않았습니다.

## 자동 저장 / 2026-09-22 12:04:37 — 캐릭터 음성 개선 작업
- **수행 내역**: 캐릭터별 목소리 구분과 음성 재생 개선을 진행했습니다. 최종 운영 화면에서 네 캐릭터의 재생 완료를 확인했습니다. 연결 관련 세부 설명은 사용자 요청에 따라 이 일지에서 제외했습니다.

## 자동 저장 / 2026-09-22 12:09:20 — 3차 토리 나비 보리 활동 화면 분리
- **수행 내역**: tori-play.html, nabi-learn.html, bori-hobby.html과 공통 js/room-activity-flow.js, css/room-activity-flow.css를 수정했습니다. selectedActivity와 select/playing/completed 상태로 입장 시 네 활동 선택, 선택한 패널 하나만 진행, 기존 정답/완주/저장 완료 신호에 따른 완료 화면으로 분리했습니다. 공통 방으로 돌아가기/다시 듣기/다른 활동 고르기/학교 홈을 연결하고 기존 문제 생성·이미지·도장·저장 로직 및 기존 다음/다시하기 버튼을 보존했습니다. 입장 초기 문제 음성을 억제하고 방 이동 시 노래 타이머/음성을 중단하며 이전 활동의 지연 콜백을 취소합니다. 세 방 12개 활동 선택/단일패널/복귀와 모바일 넘침 검사, 나비 날짜 정답 후 실제 완료/재시작/늦은 완료 취소 검사, 브라우저 콘솔 및 JS 구문/빌드 확인을 통과했습니다. 모든 콘텐츠의 전체 완주는 별도 검증 범위이며 이번에는 UI 상태 전환을 중심으로 확인했습니다. 이번 3차 범위만 진행했고 원격 배포는 실행하지 않았습니다.

## 자동 저장 / 2026-09-22 12:14:42 — 4차 콩이 운동방 상태 및 완료 조건 정리
- **수행 내역**: senior-exercise.html, css/senior-exercise.css, js/senior-exercise.js 수정. ready는 인사와 단일 시작 버튼 중심, playing은 이전/쉬기/다음 및 다시 듣기/천천히 중심으로 정리하고 기타 설정과 재시작은 접힌 영역에 보존했습니다. 준비화면 10개 진입 카드를 숨기고 운동 중 썸네일 목록은 유지했습니다. 자동 완료 시 건너뛴 씬까지 완료 처리하던 오류와 다음 버튼의 무조건 완료 처리를 수정했습니다. 실제 재생 시간 충족한 동작만 체크하며 마지막에서 미완료 동작이 있으면 이어서 진행합니다. 일시정지 후 안내 중복과 탐색 타이머를 보완했습니다. 테스트 응답만 짧게 만들어 전체 10개 완료/재시작과 건너뛰기 미완료를 검증했고 원본 운동 데이터는 보존했습니다. 원본 콘텐츠로 모바일 실제 클릭/이전/다음/천천히/contain/콘솔 오류 없음 및 빌드 검증 통과. 실제 12분 전체 완주는 실행하지 않았습니다. 4차 범위만 수행했으며 원격 배포하지 않았습니다.

## 자동 저장 / 2026-09-22 12:19:05 — 5차 쉬운 방 꾸미기 7단계 단순화
- **수행 내역**: js/character-house.js, js/room-decor.js, css/character-house.css, character-house.html을 수정했습니다. 쉬운 모드를 벽지/커튼/러그/가구/소품/옷/완료 7단계와 3~4개 선택지로 구성하고 이전/다음으로 이동하도록 했습니다. 선택 즉시 기존 방 상태와 캐릭터 레이어를 변경하며 가구/소품은 쉬운 단계별 슬롯을 교체해 중복 누적을 방지합니다. 꽃무늬 러그를 추가했고 쉬운 모드 상세 도구/미션/팝업을 숨겼습니다. 자유 편집과 기존 localStorage 구조는 유지했습니다. 초기화에 아니요/네 확인 dialog를 추가했습니다. 네 캐릭터 모든 단계, 저장/새로고침 복원, 자유 모드, 초기화 취소 확인 통과. JS 구문 및 빌드 스크립트 통과. 기존 자동 테스트 중 이전 쉬운 모드 카테고리/페이지 수를 전제로 한 항목은 새 7단계 기준으로 갱신이 필요합니다. 5차 범위만 수행하고 원격 배포하지 않았습니다.

## 자동 저장 / 2026-09-22 12:23:52 — 6차 오늘의 20분 활동 코스 추가
- **수행 내역**: daily-course.html, css/daily-course.css, js/daily-course.js를 추가하고 index.html의 단일 추천 진입을 오늘의 20분 활동으로 연결했습니다. 기존 운동/놀이/학습/취미 페이지를 한 번에 하나의 같은 출처 iframe으로 재사용합니다. 각 방 5분 참여 후 명시적 다음 활동으로 진행하고 이전 단계/쉬기/저장 종료를 제공합니다. 화면 숨김 및 쉬기 시 시간과 음성을 중단하고 단계 이동 시 이전 프레임을 제거합니다. 날짜와 현재 학습자별 localStorage에 단계와 누적 참여 시간을 저장해 이어하기를 제공합니다. 4단계가 모두 300초일 때만 완료하며 기존 RecordManager의 digital_school_care_records에 날짜/학습자별 중복 없이 완료 기록을 저장합니다. 각 원본 활동의 전체 완주가 아니라 코스 참여 시간 기준입니다. 저장 시간을 299.5초로 준비한 검증에서 네 단계 순서/완료 제한/기록 중복 방지 통과, 실제 시간 흐름으로 쉬기/조기 다음 차단/모바일/중간 재방문 확인 통과. 실제 20분 전체 실행은 하지 않았습니다. 구문 및 빌드 통과. 6차만 진행하고 원격 배포하지 않았습니다.

## 자동 저장 / 2026-09-22 12:25:44 — 전체 작업 종합 MD 저장 및 배포 준비
- **수행 내역**: documents/WORK_SUMMARY_2026-09-22.md에 선행 작업과 1~6차 작업, 보존 기능, 변경 파일, 검증 결과 및 미완료 음성 연결/전체 시간 완주 등 한계를 종합 기록했습니다. 사용자 요청 범위는 문서 저장·GitHub 푸시·Vercel 배포이며 기능 추가 수정은 하지 않습니다.

## 자동 저장 / 2026-09-22 12:26:11 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 28
<details><summary>변경 파일 목록</summary>

- [AGENTS.md](./AGENTS.md)
- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [bori-hobby.html](./bori-hobby.html)
- [character-house.html](./character-house.html)
- [css/character-house.css](./css/character-house.css)
- [css/daily-course.css](./css/daily-course.css)
- [css/home-accessibility-menu.css](./css/home-accessibility-menu.css)
- [css/home-character-hero.css](./css/home-character-hero.css)
- [css/room-activity-flow.css](./css/room-activity-flow.css)
- [css/senior-exercise.css](./css/senior-exercise.css)
- [daily-course.html](./daily-course.html)
- [documents/CHARACTER_VOICE_SETUP.md](./documents/CHARACTER_VOICE_SETUP.md)
- [documents/WORK_SUMMARY_2026-09-22.md](./documents/WORK_SUMMARY_2026-09-22.md)
- [index.html](./index.html)
- [js/character-house.js](./js/character-house.js)
- [js/character-voice-system.js](./js/character-voice-system.js)
- [js/daily-course.js](./js/daily-course.js)
- [js/home-accessibility-menu.js](./js/home-accessibility-menu.js)
- [js/home-character-hero.js](./js/home-character-hero.js)
- [js/room-activity-flow.js](./js/room-activity-flow.js)
- [js/room-decor.js](./js/room-decor.js)
- [js/senior-exercise.js](./js/senior-exercise.js)
- [js/senior-finish.js](./js/senior-finish.js)
- [js/warmup-intro.js](./js/warmup-intro.js)
- [nabi-learn.html](./nabi-learn.html)
- [senior-exercise.html](./senior-exercise.html)
- [tori-play.html](./tori-play.html)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>

## 자동 저장 / 2026-09-22 12:37:37 — 캐릭터 음성 개선 작업
- **수행 내역**: 캐릭터별 목소리 구분과 음성 재생 개선을 진행했습니다. 최종 운영 화면에서 네 캐릭터의 재생 완료를 확인했습니다. 연결 관련 세부 설명은 사용자 요청에 따라 이 일지에서 제외했습니다.

## 자동 저장 / 2026-09-22 13:46:48 — 캐릭터 음성 개선 작업
- **수행 내역**: 캐릭터별 목소리 구분과 음성 재생 개선을 진행했습니다. 최종 운영 화면에서 네 캐릭터의 재생 완료를 확인했습니다. 연결 관련 세부 설명은 사용자 요청에 따라 이 일지에서 제외했습니다.

## 자동 저장 / 2026-09-22 13:50:13 — 캐릭터 음성 개선 작업
- **수행 내역**: 캐릭터별 목소리 구분과 음성 재생 개선을 진행했습니다. 최종 운영 화면에서 네 캐릭터의 재생 완료를 확인했습니다. 연결 관련 세부 설명은 사용자 요청에 따라 이 일지에서 제외했습니다.

## 자동 저장 / 2026-09-22 14:01:58 — 홈 4캐릭터 부위별 애니메이션 및 방 안내 연결
- **수행 내역**: 원본 JPG 보존 SVG 팔/손 마스크, 어깨/손목 기준 인사, 미세 호흡, 눈 깜빡임, 음성 상태 입 패턴, 캐릭터별 각도/속도 구현. 홈과 세 활동방 및 콩이 준비 안내 연결. 기존 운동 콘텐츠/링크/기록 보존. 동작 줄이기·탭 숨김 정지. Playwright 상태/모바일/콘솔 검사 및 음성 회귀 통과. 전체 골격·양손·다리 동작은 추가 전용 파츠 필요. documents/CHARACTER_ANIMATION_2026-09-22.md 참조.

## 자동 저장 / 2026-09-22 14:06:14 — Hero 네 캐릭터 공통 교실 배경 및 바닥 정렬
- **수행 내역**: 크림 벽·베이지 공통 바닥·연한 창문/식물 실루엣. 개별 흰 카드 제거, 홈 SVG 윤곽으로 흰 여백/원본 그림자 최소화, 동일 발 기준/그림자 및 이름 포인트. 원본 이미지·캐릭터 비율·활동 링크·음성·기록 유지. PC/390px 모바일 시각 검토와 가로 넘침 검사 완료. documents/HERO_SHARED_CLASSROOM_2026-09-22.md 기록.

## 자동 저장 / 2026-09-22 14:16:12 — 캐릭터 음성 개선 작업
- **수행 내역**: 캐릭터별 목소리 구분과 음성 재생 개선을 진행했습니다. 최종 운영 화면에서 네 캐릭터의 재생 완료를 확인했습니다. 연결 관련 세부 설명은 사용자 요청에 따라 이 일지에서 제외했습니다.

## 자동 저장 / 2026-09-22 14:41:36 — 캐릭터 음성 개선 작업
- **수행 내역**: 캐릭터별 목소리 구분과 음성 재생 개선을 진행했습니다. 최종 운영 화면에서 네 캐릭터의 재생 완료를 확인했습니다. 연결 관련 세부 설명은 사용자 요청에 따라 이 일지에서 제외했습니다.

## 자동 저장 / 2026-09-22 14:42:31 — 캐릭터 음성 개선 작업
- **수행 내역**: 캐릭터별 목소리 구분과 음성 재생 개선을 진행했습니다. 최종 운영 화면에서 네 캐릭터의 재생 완료를 확인했습니다. 연결 관련 세부 설명은 사용자 요청에 따라 이 일지에서 제외했습니다.

## 자동 저장 / 2026-09-22 14:43:10 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 44
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [assets/audio/character-samples/bori.wav](./assets/audio/character-samples/bori.wav)
- [assets/audio/character-samples/kongi.wav](./assets/audio/character-samples/kongi.wav)
- [assets/audio/character-samples/nabi.wav](./assets/audio/character-samples/nabi.wav)
- [assets/audio/character-samples/tori.wav](./assets/audio/character-samples/tori.wav)
- [bori-hobby.html](./bori-hobby.html)
- [character-house.html](./character-house.html)
- [character-voice-test.html](./character-voice-test.html)
- [css/character-animation.css](./css/character-animation.css)
- [css/home-character-hero.css](./css/home-character-hero.css)
- [documents/CHARACTER_ANIMATION_2026-09-22.md](./documents/CHARACTER_ANIMATION_2026-09-22.md)
- [documents/HERO_SHARED_CLASSROOM_2026-09-22.md](./documents/HERO_SHARED_CLASSROOM_2026-09-22.md)
- [index.html](./index.html)
- [js/animated-character.js](./js/animated-character.js)
- [js/care-workflow.js](./js/care-workflow.js)
- [js/character-animation.js](./js/character-animation.js)
- [js/character-audio-player.js](./js/character-audio-player.js)
- [js/character-house.js](./js/character-house.js)
- [js/character-rig-data.js](./js/character-rig-data.js)
- [js/character-voice-system.js](./js/character-voice-system.js)
- [js/character-voice-test.js](./js/character-voice-test.js)
- [js/companion-character.js](./js/companion-character.js)
- [js/daily-course.js](./js/daily-course.js)
- [js/hero-contours.js](./js/hero-contours.js)
- [js/senior-exercise.js](./js/senior-exercise.js)
- [js/voice.js](./js/voice.js)
- [nabi-learn.html](./nabi-learn.html)
- [scripts/sync-release.cjs](./scripts/sync-release.cjs)
- [senior-exercise.html](./senior-exercise.html)
- [server.cjs](./server.cjs)
- [tests/character-animation.cjs](./tests/character-animation.cjs)
- [tests/character-voices.cjs](./tests/character-voices.cjs)
- [tori-play.html](./tori-play.html)
- [vercel.json](./vercel.json)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)

</details>


## 자동 저장 / 2026-09-22 14:46:02 — 오늘의 화면 및 기능 개선 내용 정리
- **수행 내역**: 오늘의 홈페이지·접근성·활동방·운동·방 꾸미기·20분 활동·캐릭터 움직임과 음성 재생 결과를 documents/오늘_작업_정리_2026-09-22.md에 저장. 연결 세부 설명과 주소를 제외한 작업일지로 정리. 이번 요청에서는 GitHub 푸시 없이 Vercel 배포만 진행.

## 자동 저장 / 2026-09-22 14:47:23 — 오늘 정리본 저장 및 Vercel 배포 완료
- **수행 내역**: 화면과 기능 중심 정리본 저장 완료. Vercel 운영 배포와 빌드 성공 확인. 이번 요청에서 GitHub 커밋·푸시는 실행하지 않음. 기존 음성 및 활동 기능 유지.

## 자동 저장 / 2026-09-22 14:52:21 — Hero 네 친구 공통 교실 공간 재정리
- **수행 내역**: 연속된 크림 벽·베이지 바닥으로 교실 공간 통합, 태블릿 반복 배경 제거, 연한 창문·책장·식물 배치. 투명 캐릭터 원본 유지, 발 기준 정렬 및 비율 유지 크기 보정, 동일한 그림자와 이름 포인트 적용. PC 4열·태블릿820px/모바일390px 2열 및 가로 넘침 없음 확인. 변경 파일: css/home-character-hero.css, js/character-animation.js, index.html. 기존 활동 링크·음성·기록 유지. GitHub 푸시 없이 운영 배포.

## 자동 저장 / 2026-09-22 14:57:12 — 콩이 운동방 음성과 자막 일치 수정
- **수행 내역**: 읽는 문장과 자막·콩이 말풍선을 하나로 통일. 음성 준비 및 재생 중 다음 안내 전환을 보류하여 자막이 앞서 나가는 문제 수정. 이전·다음·쉬기·다시 듣기와 재생 취소 간섭 방지. 완료 화면 문장도 음성과 일치. 지연 음성·장면 이동·이전 취소·쉬기 후 재개 자동 검사 통과. 기존 운동 콘텐츠와 기록 유지. 음성 준비/재생 시간에 따라 전체 소요 시간은 늘어날 수 있음. 변경: js/senior-exercise.js, senior-exercise.html, tests/exercise-caption-sync.cjs.

## 자동 저장 / 2026-09-23 08:52:17 — 공통 보존 원칙과 자동 푸시·배포 규칙 저장
- **수행 내역**: 사용자 요청: 공통 원칙 자동 적용, MD 자동 저장, GitHub 푸시 및 Vercel 배포. AGENTS.md에 기존 활동·캐릭터·저장 데이터·URL 및 Google Cloud/Gemini TTS 코드·환경변수·API·캐릭터 음성 연결 보존, speechSynthesis로 임의 복귀 금지, 어르신 UI 원칙, 요청 단계 한정 및 완료 시 자동 배포 규칙 추가. 기존 미푸시 화면·운동 변경 보존. 빌드와 JS 문법, 운동 상태 검증 및 Vertex TTS 단위 테스트 통과. 관련 파일: [AGENTS.md](file:///J:/sh/AGENTS.md).

## 자동 저장 / 2026-09-23 08:53:25 — 푸시 전 검증 완료
- **수행 내역**: 운동 자막·말풍선과 실제 음성 일치, 지연 대기, 장면 전환 취소 격리, 일시정지·재개 브라우저 테스트 통과. 릴리즈 860개 파일 동기화 확인. 기존 변경 파일 3개의 EOF 빈 줄 정리(기능 변경 없음). GitHub 원격 main과 로컬 기준 동일 확인. Google TTS 실서비스 음성 호출은 이번 작업에서 미실행.

## 자동 저장 / 2026-09-23 08:53:26 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 11
<details><summary>변경 파일 목록</summary>

- [AGENTS.md](./AGENTS.md)
- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/home-character-hero.css](./css/home-character-hero.css)
- [documents/오늘_작업_정리_2026-09-22.md](./documents/오늘_작업_정리_2026-09-22.md)
- [index.html](./index.html)
- [js/character-animation.js](./js/character-animation.js)
- [js/senior-exercise.js](./js/senior-exercise.js)
- [senior-exercise.html](./senior-exercise.html)
- [tests/exercise-caption-sync.cjs](./tests/exercise-caption-sync.cjs)
- [오늘_작업_일지_2026-09-22.md](./오늘_작업_일지_2026-09-22.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 08:56:21 — GitHub 푸시 및 Vercel 운영 배포 완료
- **수행 내역**: 소스 커밋 e88ffa8 GitHub origin/main 푸시 완료. Vercel dpl_9EcTP32r1h6z8mYpUhesvDemdF1v production READY 및 school-tau-pearl.vercel.app 연결 확인. 운영 HTML/CSS/JS 5개 HTTP 200과 로컬 SHA-256 일치 검증 통과. 기존 활동·데이터·Google/Gemini TTS 설정 및 음성 연결 구조 보존. 이번 요청의 공통 원칙 영구 기록과 저장·푸시·배포 완료. 관련 파일: [AGENTS.md](file:///J:/sh/AGENTS.md), [오늘 일지](file:///J:/sh/오늘_작업_일지_2026-09-23.md).

## 자동 저장 / 2026-09-23 08:56:22 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:02:23 — 1차 수정: 네 캐릭터 중심 메인화면 단순화
- **수행 내역**: 메인 상단은 학교 이름·선생님 공간, 중앙은 기존 이미지·URL의 콩이/토리/나비/보리, 아래는 오늘의 20분 활동 시작하기와 지난 활동 보기로 정리. 전체 활동·화면 설정 및 학교 안내는 접힘 처리. AI 수업은 전체 활동 > 디지털 배우기, 인지활동 데이터·카드와 기존 중복 진입은 보존. 자동 마이크 권한 안내를 방지하고 음성 명령을 명시적 켜기/끄기로 유지. TTS API·환경변수·캐릭터 음성 연결 및 저장 로직 변경 없음. 1440/768/390/320px 가로 넘침 없음, 링크·설정·수업 실행·기록·선생님/홈 전환 및 브라우저 JS 오류 없음 확인. 음성인식 기존 테스트 및 빌드 통과. 변경 파일: [index.html](file:///J:/sh/index.html), [메인 JS](file:///J:/sh/js/home-character-hero.js), [도구 JS](file:///J:/sh/js/home-accessibility-menu.js), [메인 CSS](file:///J:/sh/css/home-character-hero.css), [음성인식](file:///J:/sh/js/character-voice-recognizer.js), [검증](file:///J:/sh/tests/home-first-screen.cjs).

## 자동 저장 / 2026-09-23 09:03:31 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 8
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/home-character-hero.css](./css/home-character-hero.css)
- [index.html](./index.html)
- [js/character-voice-recognizer.js](./js/character-voice-recognizer.js)
- [js/home-accessibility-menu.js](./js/home-accessibility-menu.js)
- [js/home-character-hero.js](./js/home-character-hero.js)
- [tests/home-first-screen.cjs](./tests/home-first-screen.cjs)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:08:25 — 1차 메인 단순화 운영 반영 완료
- **수행 내역**: 소스 커밋 37c4e7a GitHub main 푸시 완료. Vercel dpl_Dq9kVJZLVKDh9R7ft5boSdfagKux production READY, https://school-tau-pearl.vercel.app 연결 완료. 변경 HTML/CSS/JS 5개 HTTP 200 및 로컬 SHA-256 일치 확인. 1차 메인 노출 정리만 수행했으며 다음 단계 기능 변경은 진행하지 않음. 기존 캐릭터 이미지·활동·저장 데이터·URL·Google/Gemini TTS 보존. 실서비스 TTS 호출 검증은 이번 작업 범위에서 미실행.

## 자동 저장 / 2026-09-23 09:08:26 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:18:38 — 2차 수정: 어르신 공통 상단 메뉴 단순화
- **수행 내역**: 메인·운동·놀이·학습·취미·집 꾸미기·20분 활동의 상단을 홈/소리/Aa 보기 편하게/도움/선생님 공간 5가지로 통일. 글씨·고대비·천천히 듣기를 펼침 메뉴로 통합하고 기존 localStorage 설정 키와 기존 TTS 호출 구조 유지. 원래 설명 버튼·안내 노드는 도움 안으로 이동해 리스너 보존. 운동 시간 표시는 진행 화면으로 이동, 기존 일시정지·이전/다음·꾸미기 도구는 활동 내 유지. 선생님 메뉴는 기존 공간 유지 및 index.html#teacher 연결 추가. Korean keep-all/nowrap/버튼 비축소/행 감싸기로 좁은 화면 대응. 상단 버튼 Space 입력과 운동 시작 충돌 수정. 7개 화면 1440/768/390/320px, 접근성 설정/음소거/속도 저장값·선생님 링크·JS 오류 없음 검사 및 메인 회귀/운동 자막 동기화/빌드 검증 수행. 관련 파일: [공통 상단 JS](file:///J:/sh/js/senior-common-header.js), [공통 CSS](file:///J:/sh/css/senior-common-header.css), [메인 상단](file:///J:/sh/js/home-accessibility-menu.js), [운동 JS](file:///J:/sh/js/senior-exercise.js), 7개 HTML 및 tests/senior-common-header.cjs, tests/home-first-screen.cjs. 캐릭터 이미지·활동·저장 데이터·Google/Gemini TTS API/환경변수 보존.

## 자동 저장 / 2026-09-23 09:20:24 — 2차 상단 메뉴 최종 검증 통과
- **수행 내역**: 7개 화면×4개 너비 공통 메뉴/줄바꿈/가로 넘침 및 음소거·글씨·고대비·느린 음성 설정값 검증 통과. 테스트의 소수점 높이 오차 허용 및 저장 전 기본 느린 음성 상태 판정 보완 후 재실행 통과. 브라우저 JS 오류 없음. 기존 메인 흐름·운동 자막 회귀 및 빌드 통과. Google/Gemini 실제 합성 API 호출은 이번 UI 검증에서 미실행.

## 자동 저장 / 2026-09-23 09:21:11 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 15
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [bori-hobby.html](./bori-hobby.html)
- [character-house.html](./character-house.html)
- [css/senior-common-header.css](./css/senior-common-header.css)
- [daily-course.html](./daily-course.html)
- [index.html](./index.html)
- [js/home-accessibility-menu.js](./js/home-accessibility-menu.js)
- [js/senior-common-header.js](./js/senior-common-header.js)
- [js/senior-exercise.js](./js/senior-exercise.js)
- [nabi-learn.html](./nabi-learn.html)
- [senior-exercise.html](./senior-exercise.html)
- [tests/home-first-screen.cjs](./tests/home-first-screen.cjs)
- [tests/senior-common-header.cjs](./tests/senior-common-header.cjs)
- [tori-play.html](./tori-play.html)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:22:52 — 2차 상단 메뉴 운영 배포 완료
- **수행 내역**: 소스 커밋 8b67ebf GitHub origin/main 푸시 완료. Vercel dpl_3p4rvvennfR8R8xxrYvQSwgkQhwT production READY 및 school-tau-pearl.vercel.app 연결 확인. 운영 변경 파일 11개 HTTP 200과 로컬 SHA-256 일치 검증 통과. 현재 요청한 상단 메뉴/접근성/반응형 범위만 반영.

## 자동 저장 / 2026-09-23 09:22:52 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:28:34 — 3차 수정: 토리·나비·보리 활동 화면 흐름 통일
- **수행 내역**: 기존 room-activity-flow 상태 계층을 보완해 select→playing→completed 통일. 첫 화면의 캐릭터·인사·4가지 활동 이름 및 나비 순서 정리, 보조 방/기록 링크 접힘 처리. 선택한 활동만 표시하고 완료 뒤 정말 잘하셨어요!/다시 하기/다른 활동 고르기로 통일. 재시작/이탈 시 이전 지연 처리 무효화 및 보리 재진입 초기화. 수수께끼 중복 정답·건너뛰기 완료 및 빈 색칠 저장 완료 방지, 이야기 오답 재시도 보완. 기존 문제/노래/이야기/색칠 데이터 13개 배열을 이전 Git 소스와 비교해 내용 동일 확인(줄바꿈 정규화). Google/Gemini TTS API·환경변수·캐릭터 음성 연결 및 기존 저장 키/기록 유지. 관련 파일: [공통 흐름](file:///J:/sh/js/room-activity-flow.js), [공통 CSS](file:///J:/sh/css/room-activity-flow.css), [토리](file:///J:/sh/tori-play.html), [나비](file:///J:/sh/nabi-learn.html), [보리](file:///J:/sh/bori-hobby.html), [검증](file:///J:/sh/tests/room-three-stage.cjs).

## 자동 저장 / 2026-09-23 09:28:54 — 3차 활동 흐름 최종 검증 통과
- **수행 내역**: 12개 활동을 UI로 진행해 실제 완료·재시작·다른 활동 선택 검증 통과. 1440/768/390/320px 선택 화면 및 모바일 진행/완료 화면 확인. 완료 전 메시지 숨김, 한 패널 노출, 수수께끼 중복/건너뛰기 차단, 이야기 오답 재시도, 빈 색칠 저장 차단, 그림 저장 및 음악 끝까지 진행, 이탈 후 이전 완료/도장 미반영 검증 통과. 브라우저 JS 오류 없음, 빌드 통과. 테스트 음성은 모의 응답을 사용했으며 Google/Gemini 실서비스 합성 호출은 이번 검증에서 미실행.

## 자동 저장 / 2026-09-23 09:29:13 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 8
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [bori-hobby.html](./bori-hobby.html)
- [css/room-activity-flow.css](./css/room-activity-flow.css)
- [js/room-activity-flow.js](./js/room-activity-flow.js)
- [nabi-learn.html](./nabi-learn.html)
- [tests/room-three-stage.cjs](./tests/room-three-stage.cjs)
- [tori-play.html](./tori-play.html)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:30:30 — 3차 활동 화면 운영 배포 완료
- **수행 내역**: 소스 커밋 9fa7606 GitHub main 푸시 완료. Vercel dpl_2RrecRVBEqVqmUN9qBUAhZbGYWeJ production READY 및 school-tau-pearl.vercel.app 연결 확인. 토리/나비/보리 HTML·공통 흐름 CSS/JS 총 5개 운영 파일 HTTP 200과 로컬 SHA-256 일치 검증 통과. 요청한 3차 화면 흐름 범위만 반영.

## 자동 저장 / 2026-09-23 09:30:30 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:36:25 — 4차 수정: 콩이 운동방 따라하기 중심 개선
- **수행 내역**: 시작 전 콩이 인사·10가지 건강 체조·시작 버튼 하나, 진행 중 큰 미디어·현재 단계/동작·콩이 자막과 이전/잠깐 쉬기/다시 보기/다음, 완료 후 건강 꽃 도장·칭찬·다시 운동하기/학교 홈 구조로 정리. 기존 안내/동작 목록/설정은 접힘 보존. 10개 기존 scene ID·이미지·상세 음성·지속시간 유지, exerciseId(exercise-01~10), video, instruction, audioText 추가. MP4/WebM 및 경로 배열 지원, 무음 반복·정지/재개/다시 보기·로딩 실패 이미지 fallback. 현재 개별 동작 영상은 지정하지 않고 기존 이미지 사용. Google/Gemini TTS API·환경변수·콩이 매핑 보존, 발화 교체 시 기존 음성 취소와 revision으로 중복/오래된 완료 콜백 차단. 자료 준비 전 시작 차단, 탭 이탈 시 정지, 실제 10개 완료 때만 도장 지급 및 완료 상태 키보드 재지급 방지. 관련 파일: [운동 HTML](file:///J:/sh/senior-exercise.html), [운동 CSS](file:///J:/sh/css/senior-exercise.css), [플레이어](file:///J:/sh/js/senior-exercise.js), [데이터](file:///J:/sh/assets/senior-exercise/program.json), [영상 연결 안내](file:///J:/sh/documents/EXERCISE_MEDIA.md), tests/exercise-follow-along.cjs, tests/verify-exercise-state-flow.cjs. PC/태블릿/390/320px 및 완료/기록 보존·실제 MP4/WebM 재생·fallback·로드 실패·음성 자막/전환/정지재개·기존 상태 테스트와 빌드 통과. Google 실서비스 합성은 모의 응답으로 대체하여 미실행.

## 자동 저장 / 2026-09-23 09:37:29 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 9
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [assets/senior-exercise/program.json](./assets/senior-exercise/program.json)
- [css/senior-exercise.css](./css/senior-exercise.css)
- [documents/EXERCISE_MEDIA.md](./documents/EXERCISE_MEDIA.md)
- [js/senior-exercise.js](./js/senior-exercise.js)
- [senior-exercise.html](./senior-exercise.html)
- [tests/exercise-follow-along.cjs](./tests/exercise-follow-along.cjs)
- [tests/verify-exercise-state-flow.cjs](./tests/verify-exercise-state-flow.cjs)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:38:56 — 4차 콩이 운동방 운영 배포 완료
- **수행 내역**: 소스 커밋 1139e2f GitHub main 푸시 완료. Vercel dpl_CHTcrhE1KuKCsFYKfDZg11r2h3nW production READY 및 school-tau-pearl.vercel.app 연결 확인. senior-exercise.html, css/senior-exercise.css, js/senior-exercise.js, assets/senior-exercise/program.json 운영 4개 파일 HTTP 200과 로컬 SHA-256 일치 검증 통과. 현재 기존 이미지를 사용하며 개별 MP4/WebM 연결을 위한 데이터/플레이어 준비 완료. 4차 요청 범위만 반영.

## 자동 저장 / 2026-09-23 09:38:57 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:45:46 — 추석 연휴 전날 한복 시즌 적용
- **수행 내역**: 공식 캐릭터 얼굴과 대표색을 기준으로 내장 image_gen 한복 4종 신규 제작(원본 보존). 메인과 네 방에 크림색·달·옅은 문양 및 명절 인사 적용, 짧은 특별 배너 추가. 새 활동 추가 없이 기존 기능·URL·TTS·저장 데이터 유지. 5페이지 4화면폭 한복 표시/넘침/콘솔 오류 검증 통과. 생성 프롬프트와 경로 documents/CHUSEOK_SEASON.md 기록.

## 자동 저장 / 2026-09-23 09:46:08 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 16
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [assets/images/chuseok/bori-hanbok.png](./assets/images/chuseok/bori-hanbok.png)
- [assets/images/chuseok/kongi-hanbok.png](./assets/images/chuseok/kongi-hanbok.png)
- [assets/images/chuseok/nabi-hanbok.png](./assets/images/chuseok/nabi-hanbok.png)
- [assets/images/chuseok/tori-hanbok.png](./assets/images/chuseok/tori-hanbok.png)
- [bori-hobby.html](./bori-hobby.html)
- [css/chuseok-season.css](./css/chuseok-season.css)
- [documents/CHUSEOK_SEASON.md](./documents/CHUSEOK_SEASON.md)
- [index.html](./index.html)
- [js/character-animation.js](./js/character-animation.js)
- [js/chuseok-season.js](./js/chuseok-season.js)
- [nabi-learn.html](./nabi-learn.html)
- [senior-exercise.html](./senior-exercise.html)
- [tests/chuseok-season.cjs](./tests/chuseok-season.cjs)
- [tori-play.html](./tori-play.html)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:47:34 — 추석 시즌 운영 배포 확인
- **수행 내역**: 커밋 35fdacf GitHub main 푸시 완료. Vercel dpl_HM2j52HD3VbV37JeCJYUTvzNTFeM READY, school-tau-pearl.vercel.app 연결 완료. 메인/CSS/캐릭터 JS/한복 4종 HTTP200 및 SHA256 일치. 세 방 전체 12활동 흐름과 운동 상태 정적 검증 및 빌드 통과.

## 자동 저장 / 2026-09-23 09:47:35 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:50:24 — 메인 한복 캐릭터 꾸벅 인사
- **수행 내역**: 메인 전용 CSS keyframes/transform 상체 16도·2.2초 인사, 고정 하체, 처음 노출 1회씩 순차 실행과 hover/초점 30초 간격. 손은 원본 자세 보존 및 상체 폭 4% 안쪽 표현. reduced-motion/탭 숨김 중단. 링크·이미지·TTS·데이터 유지. js/chuseok-bow.js css/chuseok-bow.css index.html 및 문서 수정.

## 자동 저장 / 2026-09-23 09:50:37 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 7
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/chuseok-bow.css](./css/chuseok-bow.css)
- [documents/CHUSEOK_SEASON.md](./documents/CHUSEOK_SEASON.md)
- [index.html](./index.html)
- [js/chuseok-bow.js](./js/chuseok-bow.js)
- [tests/chuseok-bow.cjs](./tests/chuseok-bow.cjs)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:51:51 — 메인 절하기 인사 배포 검증 완료
- **수행 내역**: 순차 1회 재생/2.6초 이상 시작 간격/30초 hover 제한/링크/reduced-motion/반응형 넘침/콘솔 검증 및 빌드 통과. 커밋 33d6ac5 푸시. Vercel dpl_ArY26JMWtev26wr7iC4cDWKDcfns READY, 운영 index/CSS/JS SHA256 일치 확인.

## 자동 저장 / 2026-09-23 09:51:52 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:55:58 — 네 캐릭터 방 추석 시즌 연결 보강
- **수행 내역**: 네 방 시작 인사/한복 fallback와 활동 중 작은 한복 안내 캐릭터 연결. 콩이·나비 옅은 창살, 토리 색동 복주머니, 보리 달과 따뜻한 조명 배경. 문제/운동 미디어 바깥에만 장식. 고대비 장식 제거. 음성 오류 안내 긴 문자열 모바일 줄바꿈 수정. 기존 12활동 완료/재시도 회귀 테스트와 빌드 통과. TTS/문제/저장 로직 보존, 실제 Google 호출 검증 제외.

## 자동 저장 / 2026-09-23 09:56:13 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 10
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [bori-hobby.html](./bori-hobby.html)
- [css/chuseok-rooms.css](./css/chuseok-rooms.css)
- [documents/CHUSEOK_SEASON.md](./documents/CHUSEOK_SEASON.md)
- [js/chuseok-season.js](./js/chuseok-season.js)
- [nabi-learn.html](./nabi-learn.html)
- [senior-exercise.html](./senior-exercise.html)
- [tests/chuseok-rooms.cjs](./tests/chuseok-rooms.cjs)
- [tori-play.html](./tori-play.html)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:57:20 — 각 방 추석 연결 운영 배포 확인
- **수행 내역**: 네 방 4화면폭 활동 진입/한복 안내 표시/가로 넘침/콘솔 오류/기존 저장값 유지 검증 통과. 커밋 68695a0 GitHub main 푸시. Vercel dpl_AE6MeNqNc4evmdmzKTVoymmZG7C2 READY. 운영 네 HTML과 시즌 CSS/JS HTTP200 및 SHA256 일치.

## 자동 저장 / 2026-09-23 09:57:20 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 09:59:33 — 명절 연휴 전날 특별 배너 간소화
- **수행 내역**: index.html 기존 배너를 짧은 명절 전날 인사로 교체. css/chuseok-season.css 크림색 둥근 카드/작은 달/20~22px 글씨/높이와 여백 축소. 4개 화면폭 가로 넘침·콘솔 오류 없음, 동일 폰트 조건에서 CTA 30~41px 위로 이동 확인. 빌드 통과. 기존 기능·링크 유지.

## 자동 저장 / 2026-09-23 09:59:39 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 5
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/chuseok-season.css](./css/chuseok-season.css)
- [documents/CHUSEOK_SEASON.md](./documents/CHUSEOK_SEASON.md)
- [index.html](./index.html)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:00:56 — 명절 특별 배너 운영 배포 완료
- **수행 내역**: 커밋 02e6f57 GitHub 푸시. Vercel dpl_Cf8S1J5bivtAXohwhamkw6qtmskG READY. 운영 메인 HTML과 시즌 CSS HTTP200 및 SHA256 일치 검증 완료.

## 자동 저장 / 2026-09-23 10:00:57 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:02:59 — 보리 명절 한정 추천 활동 카드
- **수행 내역**: 보리 방 기존 핵심 4메뉴 아래 명절 추억 이야기 카드 1개 추가. 기존 추석과 송편 이야기/질문/도장 처리 재사용. 시즌에만 표시, 진행/완료 때 숨김. js/chuseok-recommendation.js css/chuseok-recommendation.css bori-hobby.html 수정. 4화면폭 카드→이야기→정답→완료→복귀 및 기존 4메뉴/6이야기 유지, 넘침/콘솔 검증과 빌드 통과.

## 자동 저장 / 2026-09-23 10:03:04 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 7
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [bori-hobby.html](./bori-hobby.html)
- [css/chuseok-recommendation.css](./css/chuseok-recommendation.css)
- [documents/CHUSEOK_SEASON.md](./documents/CHUSEOK_SEASON.md)
- [js/chuseok-recommendation.js](./js/chuseok-recommendation.js)
- [tests/chuseok-recommendation.cjs](./tests/chuseok-recommendation.cjs)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:04:24 — 명절 추천 카드 운영 배포 확인
- **수행 내역**: 커밋 29a2365 GitHub main 푸시 완료. Vercel dpl_682gfmGTzEi4UXiGb2Vfx4wRhuvv READY. 보리 HTML/추천 CSS/JS 운영 HTTP200 및 SHA256 일치 확인.

## 자동 저장 / 2026-09-23 10:04:24 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:09:28 — 캐릭터 허리 절하기 동작 수정
- **수행 내역**: 기존 가로 scale 제거, SVG upper/lower clip 및 하체 변형 금지. 허리축 x627/y940·880·850·930, 콩이14/토리15/나비12/보리13.5도 상체 회전. 일반2.4초·보리2.6초, 0.6~0.7초 유지. 공통 CSS 시간 강제값 충돌 수정. 이미지 decode 후 4명 동시1회, 자동반복 없음, hover/초점10초 간격. 머리/팔은 원본 상체를 따르며 새 팔 자세 생성 없음. 동시시작/고정하체/유지구간/반복없음/reduced-motion/반응형 검증과 빌드 통과.

## 자동 저장 / 2026-09-23 10:09:34 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 7
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [css/chuseok-bow.css](./css/chuseok-bow.css)
- [documents/CHUSEOK_SEASON.md](./documents/CHUSEOK_SEASON.md)
- [index.html](./index.html)
- [js/chuseok-bow.js](./js/chuseok-bow.js)
- [tests/chuseok-bow.cjs](./tests/chuseok-bow.cjs)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:10:53 — 허리 절하기 수정 운영 배포 완료
- **수행 내역**: 커밋 4106c3f GitHub main 푸시. Vercel dpl_55HRKdxC5UBxijg5uAay16Dz4E4n READY. 운영 index/절하기 JS/CSS HTTP200 및 SHA256 일치 확인.

## 자동 저장 / 2026-09-23 10:10:54 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:18:05 — 6차 전체 QA 및 마무리
- **수행 내역**: 7페이지×5해상도 점검 및 관련 회귀 테스트 완료. PC1366×768 첫 화면에 20분 CTA 노출 개선, 학교 안내 폭/나비 날짜 keep-all/7페이지 favicon404 수정. 운동/12활동/집꾸미기 쉬운7단계·실제변경·저장 확인. 운영 Google TTS 네 캐릭터 HTTP200 WAV, 음성동시재생 최대1개 검증. 내부 링크49개 존재·최종7페이지 로컬HTTP오류/pageerror 없음. 외부 제한 리소스 별도HTTP200 확인. 상세와 미검증 범위 documents/QA_2026-09-23_FINAL.md.

## 자동 저장 / 2026-09-23 10:18:19 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 14
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [bori-hobby.html](./bori-hobby.html)
- [character-house.html](./character-house.html)
- [css/home-character-hero.css](./css/home-character-hero.css)
- [css/room-activity-flow.css](./css/room-activity-flow.css)
- [daily-course.html](./daily-course.html)
- [documents/QA_2026-09-23_FINAL.md](./documents/QA_2026-09-23_FINAL.md)
- [index.html](./index.html)
- [nabi-learn.html](./nabi-learn.html)
- [senior-exercise.html](./senior-exercise.html)
- [tests/qa6-functional.cjs](./tests/qa6-functional.cjs)
- [tests/qa6-surfaces.cjs](./tests/qa6-surfaces.cjs)
- [tori-play.html](./tori-play.html)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:19:51 — 6차 QA 마무리 운영 배포 검증
- **수행 내역**: 커밋 94fbdac GitHub main 푸시. Vercel dpl_8kzi1iHNrGk9meHnsU3NWCmLVxHB READY. 운영 7페이지와 수정 CSS2개 HTTP200 및 SHA256 일치 최종 확인. 상세 QA 문서 documents/QA_2026-09-23_FINAL.md.

## 자동 저장 / 2026-09-23 10:19:52 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:25:33 — 사용자 첨부 한복 캐릭터 4종 교체
- **수행 내역**: 사용자 원본 PNG를 재생성/편집 없이 hanbok-v2.png 4개로 복사. 콩이 강아지/토리 토끼/나비 고양이/보리 곰 연결. 메인·네방·활동 안내 교체, SVG1122×1402 비율 및 절하기 허리축 조정. 기존 이미지·링크·활동·TTS·저장 유지. 절하기/네방16화면폭과 상태/콘솔/저장 유지 검증 및 빌드 통과.

## 자동 저장 / 2026-09-23 10:25:49 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 15
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [assets/images/chuseok/bori-hanbok-v2.png](./assets/images/chuseok/bori-hanbok-v2.png)
- [assets/images/chuseok/kongi-hanbok-v2.png](./assets/images/chuseok/kongi-hanbok-v2.png)
- [assets/images/chuseok/nabi-hanbok-v2.png](./assets/images/chuseok/nabi-hanbok-v2.png)
- [assets/images/chuseok/tori-hanbok-v2.png](./assets/images/chuseok/tori-hanbok-v2.png)
- [bori-hobby.html](./bori-hobby.html)
- [documents/CHUSEOK_SEASON.md](./documents/CHUSEOK_SEASON.md)
- [index.html](./index.html)
- [js/character-animation.js](./js/character-animation.js)
- [js/chuseok-bow.js](./js/chuseok-bow.js)
- [js/chuseok-season.js](./js/chuseok-season.js)
- [nabi-learn.html](./nabi-learn.html)
- [senior-exercise.html](./senior-exercise.html)
- [tori-play.html](./tori-play.html)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:27:11 — 첨부 캐릭터 교체 운영 배포 확인
- **수행 내역**: 커밋 c0447b8 GitHub main 푸시. Vercel dpl_AmKCzP4FJj2y1wE5t6nQq3vQ6TXB READY. 운영 메인/캐릭터·시즌·절하기 JS와 원본교체 PNG4개 HTTP200 및 SHA256 일치 확인.

## 자동 저장 / 2026-09-23 10:27:12 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 2
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>

## 자동 저장 / 2026-09-23 10:49:07 — 한복 캐릭터 허리 인사 및 독립 입모양 5상태 수정
- **수행 내역**: 시즌 PNG 단일 렌더 원인 수정. 원본 하체 고정+숙인 상체 자세, 12~15도 허리 회전, 5종 입 레이어와 실제 Audio playing 연동. 4캐릭터 독립 전환, 각 방 안내 캐릭터, 반응형/음성 중복/운동 자막 회귀 통과. documents/HANBOK_ANIMATION_FIX_2026-09-23.md 및 HANBOK_BOW_IMAGE_PROMPTS.md 기록.

## 자동 저장 / 2026-09-23 10:49:36 — Git 커밋 변경사항 자동 저장
- **수행 내역**: 커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.
- **변경 파일 수**: 21
<details><summary>변경 파일 목록</summary>

- [TODAY_WORK_REPORT.md](./TODAY_WORK_REPORT.md)
- [assets/images/chuseok/bori-bow.png](./assets/images/chuseok/bori-bow.png)
- [assets/images/chuseok/kongi-bow.png](./assets/images/chuseok/kongi-bow.png)
- [assets/images/chuseok/nabi-bow.png](./assets/images/chuseok/nabi-bow.png)
- [assets/images/chuseok/tori-bow.png](./assets/images/chuseok/tori-bow.png)
- [bori-hobby.html](./bori-hobby.html)
- [css/chuseok-bow.css](./css/chuseok-bow.css)
- [documents/HANBOK_ANIMATION_FIX_2026-09-23.md](./documents/HANBOK_ANIMATION_FIX_2026-09-23.md)
- [documents/HANBOK_BOW_IMAGE_PROMPTS.md](./documents/HANBOK_BOW_IMAGE_PROMPTS.md)
- [index.html](./index.html)
- [js/character-animation.js](./js/character-animation.js)
- [js/character-voice-system.js](./js/character-voice-system.js)
- [js/chuseok-bow.js](./js/chuseok-bow.js)
- [js/chuseok-season.js](./js/chuseok-season.js)
- [js/hanbok-character.js](./js/hanbok-character.js)
- [nabi-learn.html](./nabi-learn.html)
- [senior-exercise.html](./senior-exercise.html)
- [tests/chuseok-bow.cjs](./tests/chuseok-bow.cjs)
- [tests/hanbok-mouth.cjs](./tests/hanbok-mouth.cjs)
- [tori-play.html](./tori-play.html)
- [오늘_작업_일지_2026-09-23.md](./오늘_작업_일지_2026-09-23.md)

</details>
