# 프로젝트 자동 저장 및 작업 관리 지침 (Project Automation Rules)

## 📌 핵심 원칙: 모든 작업의 자동 저장 및 기록 보장

이 프로젝트에서는 사용자의 요청에 따른 모든 개발/수정 작업이 완료될 때마다 **자동으로 작업 내용을 저장하고, 작업 일지에 기록하며, 배포용 릴리즈 폴더를 동기화**해야 합니다.

---

### 1. 작업 완료 시 자동 수행 체크리스트

모든 기능 추가, 버그 수정, 디자인/에셋 변경 작업이 끝난 직후 다음 절차를 **누락 없이 자동으로 수행**합니다:

1. **파일 변경사항 저장**:
   - 편집한 모든 소스 코드(HTML, CSS, JS) 및 이미지/미디어 자산이 디스크에 정상 저장되었는지 확인.
2. **오늘의 작업 일지 자동 업데이트**:
   - `오늘_작업_일지_YYYY-MM-DD.md` 및 `TODAY_WORK_REPORT.md` 파일에 새로 수행한 작업 항목(시간, 요청 내용, 작업 세부 내역, 변경된 파일 링크)을 누적 기록.
3. **릴리즈 디렉터리(`school-release/`) 자동 동기화**:
   - 루트의 변경 사항(`assets/`, `css/`, `js/`, `index.html`, `server.cjs`, `vercel.json` 등)을 `school-release/`에 즉시 복사하여 동기화 유지.
4. **Git 및 배포 상태 유지**:
   - 사용자가 원격 동기화나 배포를 원할 때 언제든지 즉시 배포될 수 있도록 빌드 및 테스트 상태를 무결점으로 유지.

---

### 2. 작업 일지 기록 표준 서식

작업 일지에 새 항목을 추가할 때는 다음 형식을 준수합니다:
- **작업 번호 / 시간**: 현재 시간 기준
- **사용자 요청 사항**: 요청의 핵심 내용
- **수행 내역**: 변경된 사항, 추가된 기능, 해결된 이슈
- **관련 파일**: clickable `file:///` 마크다운 링크 포함

### 자동 기록 실행 (2026-09-21)
- 작업 완료 시 `node scripts/save-work-report.cjs --title "작업 제목" --details "수행 내용 및 검증 결과"`를 실행해 오늘 일지와 TODAY_WORK_REPORT.md를 저장한다.
- Git 저장소는 `school-release/`이다. 저장소의 `core.hooksPath=.githooks` 설정으로 커밋 직전에 변경 파일 목록이 두 Markdown 일지에 자동 저장/스테이징된다.
- 새로 복제한 저장소에서는 `git config core.hooksPath .githooks`로 동일한 자동 기록을 켠다. 백그라운드 상시 감시나 예약 실행이 아니라 작업 완료/커밋 시 저장한다.

## 공식 캐릭터 기준 (2026-09-21 고해상도 요청으로 갱신)
- 최신 사용자 요청은 저해상도 시트 crop/확대를 중단하고 고해상도 재제작하는 것이다. 디자인 참고는 `characters/reference/high-resolution/design-reference.jpeg`이다.
- 행은 콩이/토리/나비/보리, 열은 아/에/이/오/우이다. 시트 내부 이름표 오기는 분류에 사용하지 않는다.
- 공식 고해상도 입모양은 `public/characters/{id}/mouth/{id}_{a,e,i,o,u}.png`이다. 캐릭터별 5장 사이에서는 입 밖의 얼굴/눈/안경/귀/머리/의상/몸 픽셀과 위치를 고정한다.
- 데이터는 `characters/manifest.json` 및 `js/characters.js`를 사용한다. mouth와 stable은 같은 고해상도 파일을 가리킨다. `_stable.png`는 이전 경로 호환용 복사본이다.
- 새 렌더는 내장 image_gen으로 제작하고 `scripts/build-hd-characters.cjs`로 입만 합성한다. 이전 `scripts/extract-official-characters.py`로 공식 파일을 덮어쓰지 않는다. 저해상도 시트 crop/업스케일을 최종 에셋으로 사용하지 않는다.
- 과거 이미지/영상/3D 자산은 기존 자료이며 공식 외형을 정의하지 않는다. 새 안내 캐릭터에는 공식 PNG 데이터만 사용한다.

- 동작 시트는 characters/reference/actions/source.png이며 공식 외형보다 우선하지 않는다. classification.json의 accepted만 사용하고 pose-only는 배포 캐릭터에 연결하지 않는다. 없는 동작은 같은 캐릭터 idle로 복귀한다.
