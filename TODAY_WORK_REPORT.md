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
