# 디지털 AI 학교 상용화 사전 진단 및 1차 안정화

작성일: 2026-09-29. 분석 기준 커밋: `eaae44d` (이번 수정 전). 비밀값과 실제 이용자 데이터는 보고서에 포함하지 않았습니다.

## 판단 및 작업 범위

현재 서비스는 **체험·단일 기관 로컬 운영 기반**입니다. 외부 기관의 실제 개인정보를 받는 다기관 유료 서비스로 전환 완료한 상태가 아닙니다. 이번 단계는 요청 59·60항의 선행 구조 분석, 위험 보고, 영향 범위가 작은 보안·로딩 안정화입니다. DB 교체, 실제 데이터 이관·삭제, 계정 생성, 유료 결제 도입은 하지 않습니다.

핵심 차단 요인은 운영 DB/서버 인증 미설정, 기관·직원별 권한 부재, 로컬 민감정보 잔존, 공개 코드의 인증값 후보, 체조 동작과 영상의 불일치입니다. 실제 침해나 개인정보 유출이 있었다고 확인한 것은 아닙니다.

## 1. 프로젝트 구조·기술 스택

- 프런트엔드: 루트 HTML 15개, `js/` JavaScript 106개, `css/` CSS 59개. 프레임워크 없는 DOM/전역 객체 방식.
- 홈은 외부 script 태그 80개를 로드합니다. 여러 기능이 DOMContentLoaded, 전역 함수, 같은 localStorage를 공유합니다.
- 서버: Node.js 로컬 `server.cjs`, Vercel 함수 `api/operations.js`, `api/garden.js`, `api/tts.js`.
- 저장소: PostgreSQL 드라이버 `pg`, 브라우저 localStorage 및 IndexedDB 병존.
- 빌드: Vercel `framework:null`, `outputDirectory:"."`, `node scripts/build-welcome-recordings.cjs`. 번들러·lint·일괄 테스트 명령은 package.json에 없습니다.
- Git/운영 배포 기준은 `school-release/`. 작업 시작 시 Git 작업 트리는 깨끗했습니다.
- 파일 단위 목록·페이지별 스크립트·SEO 항목은 `inventory.json`에 기록했습니다.

## 2. 주요 페이지와 기능 목록

| 페이지/영역 | 기능 및 관련 코드 | 현재 확인 범위 |
|---|---|---|
| index.html | 인사 MP4, 4캐릭터 마을, 선생님 공간 / home-welcome-flow, village-landscape | 마을 표시 및 4해상도 초기 표시 |
| senior-exercise.html | 기존 체조·운동 연결 | 초기 표시 |
| exercise-20min.html | 단일 화면 20분 체조, 음성, GIF, 시크, 카운트 | 시작·일시정지 및 음원 실패 재현 |
| tori-play.html | 그림·색깔·동물·계절 놀이 | 초기 표시; 전 게임 완주 미검증 |
| nabi-learn.html | 날짜·계절·숫자·속담 | 초기 표시; 전 활동 완주 미검증 |
| bori-hobby.html | 음악·이야기·색칠·수수께끼 | 초기 표시 |
| bori-song-class / bori-memory-theater | 권한 확인 콘텐츠 등록, 자막·회상·기록 | 도메인/API 모의 테스트 |
| our-home.html | 집·텃밭·이웃 방문 | 초기 표시, 소유자/방문 권한 모의 테스트 |
| character-house.html | 캐릭터 집과 꾸미기 | 소스 목록 분석 |
| daily-course / daycare-class | 간편 20분 및 오전·오후 수업 | 코드·도메인, daycare 초기 표시 |
| 선생님 모달 | 대상자·일지·보고서·자동화·백업 | 로컬 비밀번호 설정/잠금 테스트 |
| service-info.html | 서비스/개인정보/콘텐츠/문의 안내 | 준비 중 문구 확인 |
| avatar-3d / character-voice-test | 개발·실험·음성 확인 화면 | 운영 노출 검토 대상 |

## 3. 변경 전 문제·우선순위

| 번호 | 수준 | 확인 사실 | 필요한 조치 |
|---|---|---|---|
| SEC-01 | P0 | 공개 `js/companion-character.js:293`에 인증키 형태의 문자열. HTTP 200 및 로컬 해시 일치 확인. `server.cjs:21`에도 같은 형태 기본값. 키 유효성은 호출해 보지 않음 | 클라이언트 값 제거, 환경변수만 사용, 운영자가 기존 값 폐기·재발급 및 Git 이력 검토 |
| AUTH-01 | P0 | 운영 status에서 DB·관리자 초기 인증 설정 false. 프런트 인증은 초기 cloud=false 후 상태 조회 실패를 무시하여 로컬 잠금으로 동작 | 실제 기관 모드는 서버 확인 실패 시 잠금 유지. 체험/기관 모드를 명시적으로 분리 |
| DATA-01 | P0 | 대상자 생년·등급·인지상태·보호자·관찰기록이 로컬 JSON/IndexedDB에 저장 가능. 로그아웃은 이를 지우거나 암호화하지 않음 | 기존 자료 백업·이관, 기기 공용 사용 모델 확정, 최소 저장·로그아웃 캐시 정리 설계 |
| TENANT-01 | P0(다기관) | DB는 `school_operations`의 `institution` 단일 JSON 행. organizationId, 사용자별 역할·membership 없음 | 기관별 스코프와 서버 권한 적용 후에만 다기관 계정 허용 |
| TTS-01 | P0(공개 비용 통제) | `/api/tts`는 POST 텍스트 길이를 제한하지만 앱 레벨 인증/지속 rate limit/예산 제한 없음 | 공개 인사는 미리 생성한 음성 우선, 요청량·동시성·기관별 예산 제한; Vercel WAF 별도 설정 유무 확인 |
| OPS-01 | P0(기관 운영) | 운영 DB·cron 미설정; 상태 API는 DB 실제 연결을 검증하지 않음 | 별도 staging DB·백업 복구·권한 테스트 후 운영 연결 |
| CONTENT-01 | P0(운동 수업) | 목 돌리기·어깨·앞으로 뻗기를 팔 올리기 GIF에, 발목/발끝을 무릎 GIF에 연결 | 동작과 시범을 1:1 검수하기 전 실제 수업용 완성 판정 금지 |
| UI-01 | P1 | 음원 요청을 보류하자 13초 후에도 준비 중/시작 불가. canplay/error 대기에 deadline 없음 | 유한 대기, 오류 안내, 재시도, 마을 복귀 |
| UI-02 | P1 | program은 9챕터, 표시 이름은 5개 배열로 인덱스 대응. 현재 안내 단계가 데이터와 다름 | 데이터의 제목 직접 사용 |
| SYNC-01 | P1 | 운영·돌봄·기록·daycare 저장소가 별개. 서버 결과를 로컬에 합치며 일부 필드만 가림 | 데이터 사전/단일 source of truth/충돌·삭제 전파 정책 |
| LOG-01 | P1 | 감사 로그 일부 구현, 수행자 ID 없음. retentionDays는 기본값만 발견됨 | actor/organization/correlationId, 마스킹, 보관기한 실제 처리 |
| DEV-01 | P1 | `user-profile.js:24` 구문 오류 및 U+FFFD. 현재 HTML에서 제외된 보존 파일이며 공개 URL은 200 | 무작정 삭제하지 말고 배포 제외 또는 복구 후 회귀 테스트 |
| DEV-02 | P1 | RecordManager.init이 빈 저장소에 예시 기록을 생성. 기본 PIN helper도 보존됨 | 데모 자료를 명시적으로 구분, 실운영 자동 생성 중단, 현재 로그인 경로와 구형 helper 호출 분리 확인 |
| WEB-01 | P1 | 운영 루트에 CSP/X-Frame-Options/nosniff/Referrer-Policy 없음. robots/sitemap 404. DB schema·setup 스크립트 공개 200 | 정적 배포 allowlist, 보안 헤더·외부 embed 영향 검수, SEO/관리자 noindex |
| A11Y-01 | P1 | 가로 넘침 없음과 별개로 390px 체조 화면이 길고 안내 문장 줄바꿈 과다. 일부 버튼 글씨 16/17px | 단일 화면·큰 본문·버튼, 키보드·화면읽기 및 실기기 점검 |
| CLEAN-01 | P2 | 미디어 동일 해시 그룹 54개, CSS/JS·캐릭터 설정의 중복 | 호환 경로 보존하며 참조 통합; 자산 삭제하지 않음 |
| EXTRA-01 | P2 | PWA, 결제, 추가 꾸미기·애니메이션 | 기본 인증·데이터·운영 검증 이후 |

## 4. P0 수정 범위

진단 이후 이번 단계에서 하드코딩 인증값 제거만 우선 적용합니다. 실제 기존 키 폐기, TTS 비용 제어, 기관별 권한, 데이터 이관은 미완료이며 상용 공개를 승인하는 의미가 아닙니다. 최종 적용·검증 결과는 아래 후속 기록에 남깁니다.

## 5. P1 수정 범위

체조 준비 요청에 timeout과 실패 안내·재시도를 추가하고, 9챕터 실제 제목을 표시합니다. GIF를 새로 생성하거나 다른 동작을 시범 영상으로 확정하지 않습니다. 영상·동작 일치, 실제 음악 박자 동기화, 실기기 접근성은 별도 작업입니다.

## 6. 데이터 저장·DB 변경 및 이관 계획

현재 주요 저장소:

| 저장 위치 | 내용 | 보호 한계 |
|---|---|---|
| digital_school_management_v1 | 대상자·보호자·관찰·수업·보고서·일정 | 브라우저 평문 JSON |
| digital_school_daycare_elders_v1 및 ai_journals_v1 | 대상자 명단·일지 | 기관 스코프 없는 브라우저 키 |
| digital_school_operations_v3 | 프로그램·수업·평가·보고서·작업·로그 | 서버 조회 결과도 로컬 캐시 |
| participant IndexedDB rooms | 서류/사진/파일·확인표 | 같은 origin 접근, 장치 소실·로그아웃 잔존 |
| school_operations / institution | 관리자 해시·세션 해시와 전체 운영 JSON | 단일 기관, 전체 행 FOR UPDATE 잠금 |

이번에 실제 DB는 변경하지 않습니다. 기존 PostgreSQL을 유지하는 다음 이관 계획을 권고합니다.

1. 운영 주체·기관 수·담당자·데이터 보관 정책 결정. 개발/staging/production DB를 분리.
2. 기존 로컬 JSON/IndexedDB 파일과 DB 스냅샷을 별도 암호화 보관하고 복원 리허설.
3. additive migration으로 organizations, users, memberships, seniors, sessions, participation_records, reports, audit_events 및 파일 메타데이터 준비. 모든 관계에 organization_id 및 FK/unique 제약.
4. 기관 스코프는 클라이언트 값이 아니라 서버 세션 membership에서 결정. DB 역할/RLS를 방어 계층으로 검토.
5. 기존 institution을 하나의 명시적 기관에 매핑. 로컬 출처 키·기존 ID를 보존하고 충돌 목록 작성. idempotent import/dry-run/건수·내용 checksum 확인.
6. 동일 기관 여러 직원, 두 기관 같은 senior ID, 접근 거부, 복구·롤백을 가상 자료로 검사. 이관 확인 전 원본 삭제 금지.
7. 서버 기록을 기준으로 전환하고 필요한 최소 비식별 offline outbox만 유지. 기관 변경·로그아웃 시 캐시 분리. 보관기간 만료와 사용자 삭제는 복구·법적 정책 확정 후 적용.

## 7. 인증 구조·관리자 권한

서버 auth는 scrypt salt/hash, timing-safe 비교, 임의 토큰의 SHA-256 저장, HttpOnly/Secure/SameSite=Strict cookie, 초기 비밀번호 변경, 5회 실패 잠금, 20분 idle/8시간 최대 세션을 구현합니다. 로컬 잠금은 PBKDF2이며 보안 경계가 아닙니다. 서버 테스트에서 비로그인·초기 비밀번호·출처 검증·로그아웃 차단을 확인했습니다.

현재 `admins.primary` 하나뿐이며 이메일 계정·직원별 권한·사용자 초대/비활성화·역할 변경은 없습니다. 선생님 UI 표시를 제어하는 sessionStorage 플래그를 서버 권한처럼 사용하면 안 됩니다. 개인별 행 권한 및 역할은 아직 검증할 구조 자체가 없습니다.

## 8. 개인정보·삭제·백업·운영정책

최소 이름 대신 기관 내부 가명/식별번호를 기본으로 하고, 생년·연락처·등급·인지상태 등의 필수 여부는 운영자가 결정해야 합니다. 서식 편의를 이유로 모두 필수화하지 않습니다. 현재 JSON export와 서류 백업/복원은 있지만 서버 자동 백업·복구 보장·기관 전체 삭제·보관기한 집행은 확인되지 않았습니다.

service-info는 미정 기관·연락처·준비 중 정책을 정직하게 표시합니다. 확정 법적 문구로 바꾸지 않았습니다. 운영 주체/문의처/수집 목적/보관 기간/외부 처리 경로를 확정하고 검토한 뒤 게시해야 합니다. 정책을 관리자에서 편집·승인·버전 관리하는 기능은 아직 없습니다.

## 9. 자동화와 기록·보고서

automation/domain, scheduler, engine, jobs에 프로그램 초안→승인→적용, 날짜별 중복 방지, 재시도, 주간·월간 집계가 있습니다. `automation/school-automation.yml.example`는 예제이며 `.github/workflows` 활성 파일과 vercel cron은 없습니다. 외부 스케줄러 별도 연결 여부는 계정에서 추가 확인해야 합니다. 운영 status에서는 CRON_SECRET 미설정입니다.

AI 일지는 기존 Google 인증으로 Vertex 모델을 호출하며 실제 기록만 전송하도록 필드 추출, 25초 timeout, pending 상태를 사용합니다. notes에는 민감정보가 입력될 수 있어 이름 필드 제외만으로 익명화가 완료되는 것은 아닙니다. 외부 전송 정책·최소화 필요. 감사 로그에 이전 보고서 내용이 복사되므로 이력의 보관·삭제도 함께 설계해야 합니다.

DB transaction 안에서 외부 AI 호출과 전체 JSON 쓰기를 실행합니다. 단일 행 잠금이 길어질 수 있으므로 작업 claim→외부 처리→짧은 결과 commit으로 분리하고 실패 복구를 검증해야 합니다.

## 10. 캐릭터·콘텐츠 자산

공식 캐릭터는 characters/manifest.json 및 js/characters.js, 고해상도 PNG와 입모양을 보존합니다. SchoolServiceConfig도 이미 있으나 exercise의 CHARACTER_MAP 등 별도 정의가 남아 보리 이모지가 강아지로 표시됩니다. 중앙 설정으로 점진 통합하되 이전 자산과 호환 URL은 유지해야 합니다.

콘텐츠 관리에는 HTTPS/YouTube host 제한, 활성/비활성·보관 처리, 권리 확인 체크·가사 권리 체크가 있습니다. 체크박스는 실제 라이선스 증거가 아니므로 출처/이용 범위/만료일/증빙을 운영자가 관리해야 합니다. 자동 수집을 새로 추가하지 않았습니다. 이번 감사에서는 실제 권리 계약을 검증하지 않았습니다.

## 11. 체조·영상·음악 구조

현재 exercise program은 1,200초·9챕터·33이벤트·18종 move입니다. 4개 GIF에 동작을 모아 연결합니다. 고정 BPM=120의 독립 타이머, performance.now 기반 수업시계, narrationAudio의 오차 교정 방식입니다. GIF는 일시정지/음악 박자/시크와 동기화되지 않습니다. slow mode는 수업·음성 0.7배, BGM 0.85배여서 서로 다릅니다.

프로그램 musicFile은 bgm-trot.mp3입니다. 이전 사용자가 지정한 음악과 동일한지 해시 비교 전에는 같은 곡이라고 판단할 수 없습니다. 한국어 음성 파일과 수정된 이벤트의 의미·시각 동기화, 전체 20분 실시간 완주 검수는 미수행입니다. 기존 MP4/GIF/음성/새 제작 자료는 모두 유지합니다.

## 12. 에러 처리·로딩

홈 인사 영상은 timeout·자동재생 거부·오류 안내·마을 이동이 있습니다. 운영 API는 DB 누락 오류를 반환합니다. 텃밭 API는 세션·소유권·방문 허용 상태를 검증합니다. 반면 exercise 음원과 운영 프런트 fetch 일부는 유한 대기 또는 사용자 오류 표시가 부족합니다. 전체 페이지에 blanket window.onerror만 붙이는 대신 각 작업의 취소·재시도·중복 저장 방지를 개선해야 합니다.

## 13. PC·태블릿·모바일·브라우저 검증

- Windows 설치 Edge + Playwright 격리 컨텍스트, 1920×1080 / 1366×768 / 768×1024 / 390×844.
- 9개 주요 페이지 × 4해상도 = 36개 초기 화면: JS pageerror 0, 가로 넘침 0, 수집된 비-API HTTP 실패 0. 일부 숨겨진 UI나 나중에 요청할 자산까지 통과를 뜻하지 않습니다.
- 20분 화면은 각 크기에서 시작·일시정지 성공. 390px 스크린샷에서 세로 길이와 과도한 줄바꿈 확인. 완전한 레이아웃/접근성 통과라고 보고하지 않습니다.
- API는 미설정 응답으로 모의 처리하여 실제 기록·유료 TTS를 호출하지 않았습니다.
- Edge에서 로컬 비밀번호 설정/5회 잠금/만료/idle logout 기존 테스트 통과.
- Chrome 별도 설치 실행, 실제 Android Chrome, 실제 iPhone/Safari, 보조공학, 전 활동 완주, 실제 DB 실패 복구는 미검증.
- 테스트 자료: browser-checks.json. 스크린샷은 `.video-build/commercial-audit/`에 로컬 보존.

## 14. 테스트·빌드 결과

- 기존 테스트 10개 통과: operations-domain, operations-api, garden-domain, garden-api, bori-media-domain, bori-media-api, bori-media-outbox, vertex-tts, vertex-oidc, journal-missing-data. DB·Google은 test double/mock이므로 운영 연결 통과가 아닙니다.
- JS/CJS 141개 구문 점검: 140개 통과, 보존된 user-profile.js 1개 실패. 운영 홈은 해당 파일을 로드하지 않습니다.
- production build 명령 성공. 두 녹음 manifest의 해시가 실행 전후 동일.
- record-integrity 및 senior-record-integrity는 처음 Playwright 의존성 부재로 실행 실패. 번들 경로 지정 후 senior-record-integrity는 기존 `.nav-link[data-target="lessons"]` 선택자 대기에서 실패. 제품 데이터 손실로 판정하지 않았으며 테스트를 최신 UI에 맞춰 갱신해야 합니다.
- 기존 테스트가 많지만 package.json scripts/devDependencies에 실행 환경이 고정되지 않았습니다. CI에서 재현 가능하도록 정리 필요.

## 15. Vercel 배포·외부 연결 확인

사용자가 제공한 개별 deployment URL은 익명 요청 시 vercel.com/login으로 리다이렉트됩니다. 최종 로그인 HTML의 200을 앱 정상 응답으로 계산하지 않았습니다. 보호 설정을 임의 해제하지 않았습니다.

공개 운영 도메인 `https://school-tau-pearl.vercel.app/`의 index 및 주요 점검 JS/program은 로컬 소스와 SHA-256이 일치했습니다. operations status: configured=false/authConfigured=false/schedulerConfigured=false. state 요청은 503. garden status configured=false. TTS는 configured=true, connection=not-tested로 실제 합성은 미검증. 환경변수 값은 조회하지 않았습니다.

robots/sitemap은 404, 개발용 voice test와 schema/setup script는 200. server.cjs는 배포 제외되어 404입니다. 과거 배포의 공개 파일은 새 배포만으로 사라지지 않을 수 있으므로 노출 인증값은 별도 폐기가 필요합니다.

## 16. 변경 파일·신규 파일·보존

이 문서 작성 시점까지 소스 수정 전입니다. 신규 보고서/검증 JSON은 documents/commercial-audit-2026-09-29에, 임시 점검 스크립트와 스크린샷은 .video-build에 저장했습니다. 이후 최소 수정의 정확한 파일·결과는 아래 완료 기록에 추가합니다. 기존 캐릭터·수업·게임·URL·음성 연결·사용자 기록을 삭제하거나 마이그레이션하지 않습니다.

## 17. 실제 기관 테스트 전

1. 노출 후보 인증값 폐기/교체와 유료 TTS 호출 보호.
2. 실제 데이터 없이 가상 기관·직원·대상자로 staging 구축.
3. 기관/직원 로그인·권한·로그아웃·다른 기관 접근 차단을 서버에서 검증.
4. 백업 복원 성공 후 기존 자료의 이관 dry-run, 보관·삭제 정책 합의.
5. 체조 시범·음성·자막·음악 의미 일치와 안전성 현장 검수.
6. 실제 태블릿/스마트폰에서 교사·어르신 전체 흐름 및 네트워크 장애 시험.

## 18. 유료 서비스 전

운영 주체·약관·개인정보 정책·문의/장애 대응, 라이선스 증빙, 직원 초대·퇴사 처리, 결제/해지 정책, 모니터링·알림, 백업 RPO/RTO, 기관 분리 회귀 테스트, 비밀정보 이력 정리, 접근성 검수를 완료해야 합니다. 정책·외부 서비스 가입·실제 개인정보 이관을 임의 확정하지 않습니다.

## 19. 다음 단계 구현 순서

이번 최소 안정화 → 운영 모드/인증 정책 확정 → PostgreSQL additive migration·membership → 로컬 자료 import/권한 테스트 → 개인정보·로그·백업 → 기록·보고서 단일화 → 서버 스케줄 연결 → 체조 미디어 검수·모바일 접근성 → 기관 테스트 → 유료 베타. 결제/PWA/부가 콘텐츠는 후순위입니다.

## 후속 적용·검증 기록

아래에 이번 최소 수정 및 배포 결과를 추가합니다. **전체 상용화 완료 판정은 보류합니다.**

### 최소 수정 적용

- `js/companion-character.js`: 브라우저의 하드코딩 Typecast 인증 헤더 제거. 기존 Google 캐릭터 음성과 legacy 요청 경로는 유지.
- `server.cjs`: Typecast는 서버 환경변수만 사용, 브라우저 전달 key 무시, 설정 없으면 503 반환. 기존 provider 코드/환경변수 이름은 유지.
- `exercise-20min.html`, `js/exercise-20min.js`: 프로그램/음원 준비 12초 deadline, 실패 시 재시도·마을 링크, 안내 음성 실패 시 수업 시작 차단, 중복 시작 및 시작 전 일시정지 방지, 런타임 음성/그림 오류 처리. 음악만 실패하면 그 사실을 알리고 음성 수업 허용. 챕터 데이터 제목 직접 사용, 보리 이모지 곰으로 수정. 기존 이미지/GIF/음성·수업 데이터는 그대로 보존.
- `.vercelignore`: 이번 내부 보안 진단 디렉터리의 JSON 등 전체를 정적 공개 배포에서 제외. Git 기록에는 비밀값 없이 보존.
- 신규 `tests/commercial-security-source.cjs`: 비밀값 리터럴 부재, 환경변수 미설정 시 503, 클라이언트 key 무시, 설정된 legacy 경로 보존을 외부 요청 없는 VM으로 검증.
- 신규 `tests/exercise-production-readiness.cjs`: 시작/일시정지/복귀, 실제 챕터 제목, 음성 404 후 재시도, 응답 지연 deadline, 배경음악 실패 안내, 재생 거부 시 복구 화면 검증.

위 신규 2개 테스트는 통과했습니다. 기존 10개 도메인/API/음성 mock 테스트와 로컬 인증 브라우저 검사도 통과했습니다. 노출 후보 값 폐기, 실제 DB·기관별 권한·TTS 호출량 통제·전체 운동 시범 일치 문제는 이번 수정으로 해결되지 않았습니다.

### 최종 검증 및 배포

- 변경 후에도 Edge 9페이지 × 4해상도, 총 36 초기 화면에서 pageerror/가로 넘침/수집된 비-API HTTP 실패 없음. 체조 시작·일시정지도 4크기에서 성공. 이것은 실제 Safari/Android 또는 전 기능 완주 검증이 아닙니다.
- GitHub origin/main에 소스 커밋 `b69510f` 푸시 완료.
- 기존 school 프로젝트 운영 배포 `dpl_3h27uBjUZz9fgvNiNKNkiqPW94GC` READY, 기존 `https://school-tau-pearl.vercel.app` 별칭 연결 확인.
- 운영 index/체조 HTML/체조 JS/legacy 캐릭터 JS의 HTTP 200 및 로컬 SHA-256 일치 확인. 공개 legacy JS에서 인증키 패턴 없음. 내부 audit JSON/Markdown URL은 404 확인.
- 운영 주소에서도 exercise-production-readiness 테스트 통과: 정상 시작·일시정지·복귀, 챕터명, 음성 404와 재시도, 12초 지연 종료, 음악 실패 안내, 재생 거부 처리. 테스트의 새로고침 도중 DOM이 없는 경우를 기다리도록 검사 코드만 보완한 후 재실행했습니다. 실제 DB/TTS API는 격리·모의 처리했습니다.
- 운영 DB/관리자 초기 인증/cron 설정은 여전히 false. 노출 후보 인증값의 실제 폐기·재발급은 수행하지 않았습니다. 다기관 운영/실제 개인정보 수집/유료 서비스 개시를 승인하지 않습니다.
- 최종 배포 기록 및 보완된 테스트의 후속 커밋은 문서·테스트만 변경하며 운영 애플리케이션 내용은 위 배포와 동일합니다.
