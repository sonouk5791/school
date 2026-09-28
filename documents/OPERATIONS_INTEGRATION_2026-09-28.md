# 디지털 AI 학교 3차 통합 수정 결과

작성일: 2026-09-28. 기존 프로젝트에 점진적으로 추가했다. 사용자 선택: **기존 DB 없음 — PostgreSQL 연결 방식으로 준비**.

현재 결과는 **수업·기기 내 기록 기능 구현 및 서버 운영 기반 준비**이다. DB 연결, 예약 실행 활성화, 실제 AI 일지 호출까지 끝난 기관 운영 완제품이라고 표시하지 않는다.

## 1. 수정한 주요 파일

- `index.html`, `daily-course.html`, `daycare-class.html`: 메인 세 가지 선택, 간편 수업 이름, 정규 수업 화면 연결.
- `tori-play.html`, `nabi-learn.html`, `bori-hobby.html`, `senior-exercise.html`: 기존 방과 추가 활동·음성 연결.
- `js/daycare-home-ui.js`, `js/daycare-schedule.js`, `js/auto-scheduler.js`: 선생님 화면 연계, 실제 기록 기반 초안, 미승인 편성 적용 방지.
- `js/character-voice-system.js`, `js/character-animation.js`: Google 음성 유지, 임의 브라우저 음성 대체 차단, 재생 위치 기반 입모양 추정.
- `api/tts.js`: 기존 Google 인증 함수를 서버 일지 생성기에서 재사용하도록 내보내기만 추가. 기존 모델·음성·환경변수·합성 호출을 유지.
- `server.cjs`, `vercel.json`, `scripts/sync-release.cjs`, `.gitignore`, `.vercelignore`: 운영 API, 서버 함수 자산 포함, 릴리즈 동기화 및 개발 캐시 제외.

전체 변경 파일은 릴리즈 Git 커밋과 오늘 작업 일지에 기록한다. 파일을 임의로 삭제하지 않았고 기존 URL, 집 꾸미기, 기록, 운동·놀이·학습·취미 및 과거 데이터 키를 유지했다.

## 2. 새로 만든 파일

- `automation/domain.js`, `scheduler.js`, `jobs.js`, `engine.js`, `retryHandler.js`, `notification.js`: 상태·예약·작업·재시도·알림.
- `automation/database.js`, `schema.sql`, `auth.js`, `reportGenerator.js`, `library.json`: PostgreSQL, 인증, 선택적 Google AI 초안, 기존 활동 메타데이터.
- `api/operations.js`, `automation/school-automation.yml.example` (예약 설정 템플릿), `scripts/setup-operations-db.cjs`, `package.json`, `package-lock.json`.
- `js/operations-store.js`, `operations-sync.js`, `operations-home.js`, `operations-admin.js`, `admin-access.js`, `daycare-session.js`, `activity-routes.js`.
- `js/activity-bank.js`, `extended-activities.js`, `korean-visemes.js`, `css/operations.css`, `extended-activities.css`.
- `tests/operations-domain.cjs`, `operations-api.cjs`, `operations-browser.cjs`, `operations-pm.cjs`, `operations-auth-browser.cjs`, `korean-visemes.cjs` 및 검증 화면 PNG.

## 3. 구현한 기능

- 메인: 오전 수업 / 오후 수업 / AI 친구방. 기존 네 캐릭터와 간편 20분 수업은 친구방에 유지.
- 정규 수업: 대상자 선택 → 인사 → 첫 활동 → 휴식 → 두 번째 활동 → 회상 → 평가·저장. 총 60분이며 **5 + 18 + 휴식 2 + 25 + 10분**이다. 첫 활동의 20분에 휴식 2분을 포함한다.
- 기존 캐릭터 방을 실제 수업에 연결했다. 자동 단계 전환, 이전·다음·멈춤·다시하기·천천히 듣기, 진행률, 30초 간격 및 상태 변경 저장, 재접속 복구를 지원한다. 탭을 떠나면 일시정지한다.
- 참여 시간은 실제 실행 시간으로 기록한다. 수동 건너뛰기를 60분 참여로 부풀리지 않는다. 미입력 평가는 미입력으로 남긴다.
- 월~토 편성 초안, 최근 14일 중복 회피, 계절·등록 특별일 반영, 수정·재생성·승인 및 적용 상태를 분리했다. 후보가 부족하면 반복 여부를 표시한다. 현재 편성은 기존 활동 목록을 사용하는 **규칙 기반 생성**이며 LLM 편성이라고 주장하지 않는다.
- 개인별 참여·도움·기분·표정·메모 기록, 사실 기반 일지 초안, 선생님 검토·수정·확정, 실제 기록 집계 주간·월간 보고서를 추가했다.
- 토리 추가 문제 풀은 분류별 30개 이상 조합을 제공한다. 기존 그림·이모지·선택지를 재사용한 조합이며 30개 이상의 새 원화 제작은 아니다. 3단계 선택지 난이도, 최근 문항 회피, 나비 13개 회상 주제, 보리 추가 취미를 연결했다.
- 음악은 사용 권리를 확인한 HTTPS 음원 URL을 등록해 재생한다. 무단 음원이나 실제로 없는 음악 파일을 추가하지 않았다.
- 서버 인증은 scrypt 비밀번호, HttpOnly/Secure/SameSite 쿠키, 첫 비밀번호 변경, 5회 실패 15분 잠금, 20분 비활성 만료를 사용한다. DB 미연결 시 기기의 PBKDF2 비밀번호는 **로컬 화면 잠금**이며 서버 인증을 대체하지 않는다.

## 4. 자동화 구조

GitHub 예약 호출(기본 5분 간격) → `/api/operations?action=run` → Bearer 인증 → PostgreSQL 트랜잭션 잠금 → 한국 시간 예약 확인 → 작업 실행 → 결과·재시도·알림 저장.

기본 시간: 토요일 15시 다음 주 초안, 오전 9:30/오후 13:30 수업 준비, 매일 18시 미작성 확인, 토요일 17시 주간 보고서, 월말 18시 월간 보고서·다음 달 후보. 승인이 완료된 프로그램만 해당 날짜에 활성화한다.

작업 ID로 재실행을 중복 처리하지 않는다. 실패 후 5분·15분 재시도, 세 번째 실패 시 실패 상태·관리자 알림을 남긴다. 토글을 끄면 대기 중인 해당 종류의 작업도 실행하지 않는다. 작업별 실패는 변경 내용을 롤백한다. 서버 실행 시간 제한에 맞춰 남은 작업은 다음 호출에 처리한다.

Vercel Hobby cron의 빈도 제한 때문에 고빈도 Vercel cron을 임의로 추가하지 않았다. GitHub 예약 호출은 지연될 수 있으므로 엄격한 정시 운영이 필요하면 별도의 관리형 스케줄러를 같은 API에 연결해야 한다. [Vercel 제한](https://vercel.com/docs/cron-jobs/usage-and-pricing), [GitHub 예약 실행](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

## 5. 서버와 브라우저 기능의 차이

| 위치 | 담당 | 현재 상태 |
|---|---|---|
| 서버 | 주간 초안, 승인 적용, 수업 준비, 일지 작업, 주·월 보고서, 재시도 | 코드·API 검증 완료. **DB 및 호출 설정 전에는 실행 안 됨** |
| 브라우저 | 수업 화면·타이머·활동·평가·복구·음성 | 사용자 수업 중 실행 |
| 기기 저장 | 진행 상태·오프라인 평가·미동기화 자료 | localStorage에 저장 |
| 서버 동기화 | 완료 수업과 평가의 중복 방지 전송 | DB 및 선생님 서버 로그인 필요 |

자동 예약으로 어르신 브라우저를 강제로 열거나 수업을 자동 시작하지 않는다. 긴 수업 종료 시 서버 로그인 세션이 만료됐으면 선생님 재로그인 후 기록 동기화를 수행한다. 기존 저장 키를 삭제하거나 초기화하지 않는다.

## 6. 추가 환경변수와 연결 순서

Vercel 기존 **school** 프로젝트에 비밀값을 직접 설정한다. 채팅·MD·Git에는 값을 넣지 않는다.

| 이름 | 용도 |
|---|---|
| `DATABASE_URL` | 기관 전용 PostgreSQL 접속 문자열. 공급자 TLS 지침 적용 |
| `ADMIN_INITIAL_PASSWORD` | 12자 이상 초기 관리자 비밀번호. 최초 로그인 후 변경 필수 |
| `CRON_SECRET` | 예약 API용 충분히 긴 무작위 토큰 |
| `JOURNAL_MODEL` | 선택 사항. 기관 Google 프로젝트에서 사용 가능한 Gemini 텍스트 모델 ID |
| `JOURNAL_LOCATION` | 선택 사항. 해당 모델 지원 지역. 미지정 시 기존 Google 지역 설정 사용 |

기존 Google Cloud/Gemini TTS 환경변수는 유지한다.

1. PostgreSQL 생성 및 접근 권한 설정 후 배포 환경에 `DATABASE_URL`을 등록한다.
2. 신뢰할 수 있는 환경에서 `npm ci` 후 `node scripts/setup-operations-db.cjs`를 실행한다. 해당 프로세스 환경에만 DB 비밀값을 주입한다. 이 스크립트는 기존 데이터를 삭제하지 않는다.
3. 관리자 초기 비밀번호와 `CRON_SECRET`을 설정하고 재배포한다. 최초 로그인·새 비밀번호·가상 대상자 기록으로 검증한다.
4. 현재 GitHub OAuth 인증에는 workflow 권한이 없어 실행용 workflow 등록은 보류했다. 권한이 있는 관리자가 템플릿을 검토하여 `.github/workflows/school-automation.yml`로 등록해야 한다. 그 후 GitHub Actions secret `SCHOOL_AUTOMATION_URL`에 `https://school-tau-pearl.vercel.app/api/operations?action=run`, `SCHOOL_CRON_SECRET`에 동일 예약 토큰을 설정한다.
5. **연결 검증 후** repository variable `SCHOOL_AUTOMATION_ENABLED=true`를 설정한다. 기본은 비활성이다. 수동 workflow 실행 후 서버 최근 실행·작업 로그를 확인한다.
6. 다음 주 초안을 검토·승인한다. AI 일지가 필요하면 모델 권한·지역·실제 호출을 별도로 검증한다.

## 7. 데이터베이스 설정 여부

**실제 DB는 아직 없다. 접속·스키마 생성·실DB 통합 테스트는 미실행이다.** 연결 전 UI는 ‘서버 연결 필요’를 표시한다. `/api/operations?action=status`의 configured는 환경변수 존재 여부이며 실제 연결 성공 보증이 아니다.

현재 스키마는 기관 단위 JSONB 상태 행과 트랜잭션 잠금으로 시작한다. 다기관·여러 권한 역할·대량 기록에 적합한 정규화 테이블과 별도 마이그레이션은 아직 없다. 기존 로컬 자료를 자동으로 서버에 모두 올리지 않는다. 로컬 자료는 기존대로 보존되므로 기관 개인정보 운영 정책에 맞춘 이관·단말 관리가 필요하다.

## 8. 검증 결과와 배포 후 확인

- 통과: 60분 도메인 시계, 일시정지, 승인 전 적용 방지, 평가 중복 방지, 사실 기반 초안, 오전/오후 준비, 작업 중복 방지, 5/15분 재시도·롤백, 월말 후보·보고서, 비활성 토글.
- 통과: API 로그인·비밀번호 변경·출처 검사·승인·수정 보호·평가 동기화·인증 정보 제외. **트랜잭션 대역 테스트이며 실PostgreSQL 검증은 아니다.**
- 통과: 1920×1080, 1366×768, 768×1024, 390×844 메인; 오전·오후 수업/복구/평가/선생님 일지 화면; 모바일 추가 활동; 관리자 실패 잠금 및 20분 로그아웃. 브라우저 E2E는 음성을 음소거하고 진행을 단축해 검증했다.
- 통과: 기존 자동 편성 단위 검사, 캐릭터 방 상태 검사, 운동 자막 동기화, Google TTS 브라우저 모의 응답 4개 캐릭터 검사. 실제 모든 수업을 60분씩 사람이 진행하거나 모든 Google 음성을 실청취한 것은 아니다.
- 통과: 기존 음원 파일을 사용하는 환영 음원 manifest 빌드. 새 유료 음원 생성은 하지 않았다.
- 배포 후 필수: 실제 DB 트랜잭션·서버 재시작·동시 저장, 예약 로그, 승인 후 다음 주 적용, 실제 Google 음성·AI 호출, 기관용 대상자 권한·오프라인 재연결·장시간 수업·터치 기기 확인.

운영 배포 완료: 코드 커밋 `e8e2365`, Vercel `dpl_ufHAyybTk6ZdpdThWF4iXXXqf6kp` READY. [운영 사이트](https://school-tau-pearl.vercel.app).

배포 후 읽기 전용 검사도 통과했다: 1920×1080 / 1600×900 / 1366×768 / 768×1024 / 390×844 메인, 네 캐릭터 선택, 수업·기존 방 URL 7개 HTTP 200, pageerror 없음. 주요 배포 파일과 보존한 원화 총 10개 SHA256 일치. 운영 API는 `configured:false`, `authConfigured:false`, `schedulerConfigured:false`, ‘서버 연결 필요’를 반환했다. `tests/operations-production-smoke.cjs`, `tests/operations-deployment-files.cjs`에 재검증 코드를 남겼다. 실제 DB·예약·AI 일지 검증은 여전히 미실행이다.

## 9. 아직 완성하지 못한 기능

- 실제 DB 연결, 예약 실행 활성화, 운영 AI 일지 호출은 설정 대기이다. 현재 일지 초안은 기록 요약이며 선생님 검토 전 확정하지 않는다.
- 캐릭터 관절별 실제 체조·손동작 애니메이션 자산과 **서로 다른 7종 입 원화**는 없다. 기존 외형을 임의로 바꾸지 않았다. 현재 7개 모음 신호는 기존 5개 표현으로 매핑하며 재생 시간 기반 추정이다. 정밀 음소 정렬이나 완전한 립싱크가 아니다.
- 기관별 사용자 계정/역할, 정규화 DB, 보존기간 자동 삭제·암호화 백업·백업 복원 검증은 후속 작업이다. 보존기간 기본값만으로 자동 삭제가 실행되지 않는다.
- 전체 미디어의 오프라인 캐시·사전 음성 합성은 없다. 현재 준비 작업은 기본 이미지와 Google 설정을 점검하며 모든 활동 영상·음성을 다운로드 완료하는 기능이 아니다.
- 일요일/휴무일에 승인 편성이 없을 때 수동 기본 수업을 열 수 있다. 자동 기관 운영과 수동 체험을 구분해야 한다.
- 외부 문자·이메일 알림은 보내지 않는다. 알림은 선생님 공간에만 표시한다.

## 10. 다음 우선순위

1. PostgreSQL 연결 → 실DB·인증·동기화 검증 → 서버 예약 활성화 및 가상 자료로 한 주 검증.
2. 실제 Google 모델로 사실 기반 AI 초안 검증, 기관의 선생님 확인 절차 적용.
3. 개인정보 이관·보존·백업·역할 권한 및 다기관 데이터 구조 확정.
4. 동일 캐릭터의 관절 분리 동작/7종 입 자산 제작 후 동작·립싱크 실기기 검증.
5. 전체 미디어 캐시와 실제 60분 수업을 PC·태블릿에서 현장 검증.
