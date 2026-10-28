# 🌸 기억정원 디지털 AI 학교 — STEP 1 기존 시스템 정밀 분석 보고서

- **프로젝트명**: 기억정원 디지털 AI 학교
- **운영 사이트**: [https://school-mu-ashen.vercel.app/](https://school-mu-ashen.vercel.app/)
- **분석 일자**: 2026년 10월 28일
- **분석자**: 시니어 접근성 전문 UX / React·Next.js 풀스택 개발자
- **목표**: 기존 시스템 기능과 캐릭터 에셋을 100% 보존하면서 단계적 고도화를 위한 기술 분석 및 안전 백업 완료

---

## 1. 프로젝트 구조 및 브랜치 상태 정밀 분석

### 1.1 저장소 및 브랜치 상태
현재 Git 원격 저장소(`https://github.com/sonouk5791/school.git`)와 로컬 작업 공간의 이력을 대조한 결과, 매우 중요한 브랜치 구조가 확인되었습니다.

| 브랜치명 | 최신 커밋 | 대상 및 상태 설명 |
| :--- | :--- | :--- |
| **`origin/main`** (원격 메인) | `f058f7a` | **실제 운영 사이트(school-mu-ashen.vercel.app)의 배포 원본 소스** (299개 파일, 52,659줄). 콩이/토리/나비/보리 4대 캐릭터, 관절 리그 애니메이션, 음성/영상/오디오 에셋 전체 포함. |
| **`master`** (로컬) | `be0c32b` | 2026-10-21에 진행되었던 보안 감사 및 경량 정적 프로토타입 브랜치. |
| **`backup/master-before-step1-20261028`** | `be0c32b` | **금일 생성된 안전 백업 브랜치 1**. 기존 로컬 작업 상태 완벽 보존. |
| **`backup/main-production-20261028`** | `f058f7a` | **금일 생성된 안전 백업 브랜치 2**. 운영 사이트 원본의 로컬 보존 백업. |

### 1.2 전체 파일 및 폴더 맵 (운영 사이트 원본 기준)
```
school/ (digital-ai-school)
├── assets/
│   ├── audio/
│   │   └── kongi-3min/            # 콩이 3분 체조 실제 한국어 음성 28개 (c01_start.mp3 ~ c28_finish3.mp3), BGM 덕킹 음원
│   ├── images/
│   │   ├── friend-kongi.png       # 🐶 운동 친구 콩이 원본 3D 캐릭터 (고해상도 투명 PNG)
│   │   ├── friend-tori.png        # 🐰 놀이 친구 토리 원본 3D 캐릭터 (고해상도 투명 PNG)
│   │   ├── friend-nabi.png        # 🐱 학습 친구 나비 원본 3D 캐릭터 (고해상도 투명 PNG)
│   │   ├── friend-bori.png        # 🐻 취미 친구 보리 원본 3D 캐릭터 (고해상도 투명 PNG)
│   │   ├── lilac-village-illustration.jpg # 기억정원 마을 전경 일러스트
│   │   ├── chair-exercise/        # 의자 체조 가이드 이미지 & GIF
│   │   └── kongi-parts/           # 콩이 SVG 리그 관절 분리 파츠 (머리, 몸통, 팔, 다리, 립싱크 입 4종, 눈 깜빡임)
│   └── videos/
│       ├── kongi-3min-exercise.mp4 # 콩이 3분 체조 비디오
│       ├── friends-exercise-20min.mp4 # 4인 친구 20분 종합 체조 비디오
│       └── kongi-greeting.mp4     # 콩이 인사 비디오
├── css/
│   ├── memory-garden.css          # 기본 레이아웃, 컬러 토큰, 고대비 스타일
│   ├── senior-garden-app.css      # 홈 대시보드 및 시니어 친화 UI 컴포넌트
│   ├── senior-exercise.css        # 운동방 관절 애니메이션 및 타이머 스타일
│   └── ... (총 38개 모듈형 CSS)
├── js/
│   ├── senior-garden-app.js       # 홈 대시보드 코어 (TTS 음성, 소리/확대 토글, 뷰 전환)
│   ├── kongi-exercise-room.js     # 운동방 관절 애니메이션 엔진 & 타이머 & 기록 산출
│   ├── record-manager.js          # 돌봄 기록 관리자 (localStorage 기반 참여/기분 기록)
│   ├── admin-access.js            # 관리자 접근 제어 (PBKDF2 로컬 보안 및 API 목업)
│   ├── lesson-engine.js           # 학습방 인터랙션 엔진
│   ├── karaoke-synth.js           # 취미방 노래방 Web Audio 신시사이저
│   └── ... (총 40여개 모듈형 JS)
├── index.html                     # 메인 홈 대시보드 (4대 캐릭터 방, 오늘의 활동, 정원 산책, 내 기록, 관리자)
├── senior-exercise.html           # 🐶 콩이의 운동방 (10분/20분 의자체조, 실시간 관절 동작)
├── tori-play.html                 # 🐰 토리의 놀이방 (그림맞추기, 색깔맞히기, 계절놀이, 동물맞히기)
├── nabi-learn.html                # 🐱 나비의 학습방 (오늘 날짜, 계절, 옛 속담, 숫자 셈하기)
├── bori-hobby.html                # 🐻 보리의 취미방 (옛 노래 감상, 옛 이야기, 수채화 컬러링, 수수께끼)
├── package.json                   # 배포 메타데이터
└── vercel.json                    # Vercel 클린 URL 설정
```

---

## 2. 기술 스택 및 아키텍처 점검

### 2.1 프레임워크 & 렌더링
- **현재 구현**: 프레임워크 없는 **Pure Vanilla HTML5 / CSS3 / ES6+ JavaScript**.
- **평가**: 가볍고 브라우저 로딩 속도가 극도로 빠르며, 복잡한 번들러 없이도 즉각 작동. 향후 점진적 모듈화 및 React/Next.js 컴포넌트화가 가능하도록 각 화면별 책임이 분리되어 있음.

### 2.2 라우팅 (Routing)
- **메인 홈 뷰 전환**: `index.html` 내에서 `SeniorGardenApp.switchView(viewName)` 함수를 통해 SPA(Single Page Application) 형태로 메인과 4개 서브뷰(`today-activities`, `garden-tour`, `my-records`, `care-dashboard`)를 부드럽게 전환.
- **방 이동**: `senior-exercise.html`, `tori-play.html`, `nabi-learn.html`, `bori-hobby.html`로의 멀티페이지(MPA) 정적 라우팅. 모든 서브 페이지에 **[🏠 처음으로]** 고정 복귀 버튼 구비.

### 2.3 상태 관리 (State Management)
- 인메모리 싱글톤 객체 패턴: `SeniorGardenApp` (홈), `KongiExerciseRoom` (운동방), `RecordManager` (기록).
- 세션/로컬 스토리지: 브라우저 `localStorage` 기반 키(`digital_school_care_records`, `digital_school_current_learner`, `digital_school_local_admin_v3`).

### 2.4 데이터베이스 (Database)
- **현재 상태**: 백엔드 RDBMS/NoSQL 데이터베이스가 연결되어 있지 않은 **Client-side Local Storage** 구조.
- `js/record-manager.js`에 초기 시드 5건(김영자, 박순옥, 이종수, 정태호 어르신)이 `localStorage`에 자동 적재되는 로직이 구현되어 있음.

### 2.5 인증 시스템 (Authentication)
- 현재 배포본은 어르신들이 로그인 스트레스 없이 즉시 이용할 수 있도록 **원클릭 공개 접근(Zero-Friction Access)** 설계.
- 관리자 패널(`js/admin-access.js`): Web Crypto API(PBKDF2 210,000회 해시)를 이용한 클라이언트 로컬 PIN 보호 구조 및 `/api/operations` 연결 대기 로직 구현.

### 2.6 이미지, 음성, 영상 시스템
- **이미지**: 고해상도 투명 PNG 캐릭터 일러스트 및 SVG 관절 파츠 벡터 그래픽. 반응형 100% 레이아웃.
- **음성 시스템 (듀얼 구조)**:
  1. **Web Speech API**: 한국어 음성합성(`speechSynthesis`, `ko-KR`, 차분한 속도 0.85, 따뜻한 피치 1.05)으로 화면 진입, 버튼 선택 시 실시간 안내.
  2. **오디오 파일(mp3)**: 콩이 3분 체조 28개 멘트 및 BGM 덕킹(BGM Ducking) 음원.
- **영상 시스템**: HTML5 Video 태그를 통한 3분/20분 의자체조 비디오 스트리밍.

---

## 3. 캐릭터 에셋 및 시니어 접근성 평가

### 3.1 4대 캐릭터 에셋 보존 현황 (절대 임의 변경 금지 준수)
1. **🐶 콩이 (Kongi) — 운동방 안내자**
   - 시인성 높은 주황/갈색 톤의 강아지 캐릭터.
   - SVG 관절 분리 파츠 13종(머리, 안경, 몸통, 엉덩이, 양팔, 양다리, 립싱크 입모양 4종 `a, o, i, exhale`, 눈 깜빡임) 완벽 보존.
2. **🐰 토리 (Tori) — 놀이방 안내자**
   - 다정한 분홍빛 귀와 미소를 지닌 토끼 캐릭터. `assets/images/friend-tori.png` 완벽 보존.
3. **🐱 나비 (Nabi) — 학습방 안내자**
   - 지적인 안경과 초록 스카프를 두른 고양이 캐릭터. `assets/images/friend-nabi.png` 완벽 보존.
4. **🐻 보리 (Bori) — 취미방 안내자**
   - 코발트 블루 후드티와 새싹 로고를 입은 든든한 곰돌이 캐릭터. `assets/images/friend-bori.png`, `assets/images/lilac-village-illustration.jpg` 완벽 보존.

### 3.2 시니어 UX 접근성 점검 (WCAG 2.1 AAA 준수 수준)
- **타깃 크기**: 모든 주요 클릭 영역이 100px 이상으로 시니어 손떨림에도 오터치 방지.
- **명도 대비**: 배경 아이보리(`#FDFCFA`) 대비 텍스트 컬러(`#1E293B`, `#166534`) 명도 대비 7:1 이상 확보.
- **인지 부하 최소화**: 한 화면 한 가지 주요 태스크 원칙 준수, 복귀 버튼 상시 노출.
- **접근성 컨트롤**: 상단 바에 '🔊 소리 켜짐/꺼짐' 토글 및 '🔤 글자 크게' 토글 완벽 작동.

---

## 4. 4대 활동방 심층 점검 결과

| 방 구분 | 주요 제공 기능 | 실제 작동 및 기술 구현 상태 |
| :--- | :--- | :--- |
| **🏃 기운찬 운동방** (`senior-exercise.html`) | • 5분/10분/20분 의자 체조 코스<br>• 호흡/목/팔/박수 단계별 안내<br>• 실시간 SVG 관절 애니메이션<br>• 4대 컨트롤: 이전/쉬기/다음/그만하기<br>• 참여 완료 리포트 산출 | **정상 작동 (완성도 높음)**<br>SVG 관절 애니메이션과 음성 립싱크 오버레이 정상 렌더링. 타이머 및 단계 전환 원활. |
| **🧩 오순도순 놀이방** (`tori-play.html`) | • 그림 카드 짝 맞추기<br>• 알록달록 색깔 맞히기<br>• 사계절 추억 놀이<br>• 정겨운 동물 맞히기<br>• 칭찬 별/꽃 도장 수여 | **정상 작동**<br>무실패(No-Fail) 원칙 적용되어 오답 시에도 감점 없이 부드러운 재시도 유도 및 TTS 격려 발화. |
| **📚 또박또박 학습방** (`nabi-learn.html`) | • 오늘 날짜와 요일 인지 훈련<br>• 계절 풍경 알아보기<br>• 정겨운 옛 속담 빈칸 채우기<br>• 과일/별 개수 셈하기 | **정상 작동**<br>정답 선택 시 뜻풀이 카드 활성화 및 음성 가이드 제공. |
| **🎨 꽃피는 취미방** (`bori-hobby.html`) | • 옛 노래 감상 ('고향의 봄', '과수원 길')<br>• 옛날 이야기 회상<br>• 수채화 캔버스 컬러링(그리기/되돌리기/PNG 다운로드)<br>• 두뇌 자극 수수께끼 놀이 | **정상 작동**<br>Canvas 컬러링 저장 기능 정상 작동하며 다운로드 파일명 생성 정상. |

---

## 5. 활동 기록 및 관리자 기능 실제 작동 검사

### 5.1 하드코딩된 데이터와 실제 저장 데이터 비교 분석
정밀 코드 추적 결과, **프론트엔드 UI 화면과 데이터 스토어 간의 단절(Disconnect)**이 발견되었습니다.

| 구분 | 화면 항목 | 현재 구현 방식 | 실제 저장 여부 및 문제점 |
| :--- | :--- | :--- | :--- |
| **내 활동 기록** (`view-my-records`) | • 상단 칭찬 배너<br>• 주간 출석 꽃 도장판 (월~금) | **정적 HTML 마크업 하드코딩** | 월/화/수는 '출석 완료', 목/금은 '예정'으로 마크업에 고정되어 있음. 실제 어르신이 체조나 놀이를 완료해도 도장판이 갱신되지 않음. |
| **관리자 대시보드** (`view-care-dashboard`) | • 오늘 수업 관리 탭 통계<br>(출석 18/20명, 2개 완료, 2건 일지) | **정적 HTML 마크업 하드코딩** | 숫자 데이터가 고정되어 있어 실제 현황을 반영하지 못함. |
| **어르신 목록** | • 김순자, 박영수, 이정애 어르신 3인 | **정적 HTML 마크업 하드코딩** | `js/record-manager.js`의 `LEARNERS`(김영자, 박순옥, 이종수 등)와 불일치. |
| **수업 일지 작성** | • 대상 선택 select, 관찰 내용 textarea, 저장 버튼 | **`alert()` 단발 호출** | `alert('일지가 안전하게 저장되었습니다.')`만 띄우고 `localStorage`나 변수에 저장되지 않고 사라짐. |
| **준비된 스토어** (`js/record-manager.js`) | • `RecordManager.saveRecord()`<br>• `RecordManager.getAllRecords()`<br>• `RecordManager.getCareStats()` | **완벽한 로컬 스토리지 엔진 구현됨** | `localStorage` 저장 로직이 완벽히 코딩되어 있으나, 정작 `index.html`에서 연동 호출하지 않고 있었음. |

---

## 6. 라이브 사이트 무결성 검사 (Console / Image / Link)

브라우저 서브에이전트 실측 및 HTTP HEAD 검증 결과:
- **HTTP 응답 상태**: 메인 및 4대 활동방, 에셋 12종 전수 조사 결과 **모두 200 OK**.
- **브라우저 콘솔 에러**: JavaScript 오류 및 경고 **0건 (Clean Console)**.
- **깨진 이미지 (Broken Image)**: 4대 캐릭터 및 정원 일러스트 전수 렌더링 확인 **0건**.
- **링크 무결성**: 하단 네비게이션 4종, 상단 바 액션, 활동방 진입 및 '처음으로' 복귀 링크 100% 정상 작동.

---

## 7. 문제점 파일 경로 및 수정 우선순위

| 우선순위 | 항목 및 파일 경로 | 문제 현상 | 개선 방향 (향후 STEP 과제) |
| :---: | :--- | :--- | :--- |
| **P1 (최우선)** | `index.html`, `js/senior-garden-app.js`, `js/record-manager.js` | 수업 일지 저장 시 `alert()`만 발생하고 실제 데이터가 저장되지 않음. | `RecordManager.saveRecord()`와 연결하여 `localStorage`에 일지를 영구 보관하고 목록에 실시간 반영. |
| **P2 (높음)** | `index.html` (`#view-my-records`), `js/kongi-exercise-room.js` | 운동방 및 놀이방 활동을 완료해도 메인 홈의 '내 활동 기록' 주간 도장판이 동적으로 갱신되지 않음. | 활동 완료 시 CustomEvent 또는 `RecordManager`를 통해 해당 요일 도장 활성화 연동. |
| **P3 (보통)** | `index.html` (`#admin-tab-today`, `#admin-tab-seniors`) | 관리자 화면의 출석 통계(18명/20명) 및 어르신 명단이 하드코딩되어 있음. | `RecordManager.getCareStats()`의 실제 통계 수치와 등록 어르신 목록을 동적 렌더링으로 치환. |
| **P4 (중장기)** | 전체 구조 점진적 컴포넌트화 | 순수 바닐라 HTML 5개 페이지로 분리되어 있어 공통 헤더/푸터 수정 시 중복 유지보수 필요. | 기존 외형/기능 100% 보존 하에 React/Next.js 기반 시니어 컴포넌트 라이브러리로 점진적 마이그레이션. |

---

## 8. 안전한 백업 및 복구 절차

현재 시스템의 원본 상태를 완벽하게 보존하기 위한 백업 현황과 복구 방법입니다.

### 8.1 생성된 백업 브랜치
1. `backup/master-before-step1-20261028`: 이전 로컬 `master` 상태 보존.
2. `backup/main-production-20261028`: 운영 원본(`origin/main`, `f058f7a`) 기준 안전 백업.

### 8.2 비상 시 1초 복구 명령어
작업 중 문제가 발생할 경우 언제든지 아래 명령어를 통해 분석 이전 시점으로 원상 복구할 수 있습니다.
```bash
# 운영 원본 상태로 복구할 때
git checkout backup/main-production-20261028

# 이전 로컬 master 상태로 복구할 때
git checkout backup/master-before-step1-20261028
```

---

## 9. 1단계 결론 및 다음 단계 제안
- **1단계 분석 완료**: 기억정원 디지털 AI 학교의 모든 원본 캐릭터, 음성/영상, 4대 활동방이 결함 없이 완벽히 보존되어 있음을 검증했습니다.
- **핵심 발견**: `js/record-manager.js`라는 훌륭한 기록 관리 엔진이 이미 준비되어 있으므로, 2단계에서는 **기존 UI를 전혀 건드리지 않고** 하드코딩된 '수업 일지 작성'과 '주간 출석 도장판'을 실제 `RecordManager`와 실시간 연동하는 고도화 작업을 추천합니다.
