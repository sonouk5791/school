# 배포 준비

현재 프로그램은 정적 HTML/CSS/JS 앱입니다. Vercel의 Other 프레임워크, 빌드 명령 없음, 출력 디렉터리 `.` 설정을 사용합니다.

- `vercel.json`: 정적 배포 설정
- `.vercelignore`: 테스트 결과, 작업 보고서, 개발 도구 파일 배포 제외
- `.gitignore`: 인증정보, Vercel 로컬 연결 정보, 테스트 화면 결과 제외
- 로컬 실행: `node server.cjs`
- 기록은 브라우저 localStorage에 저장됩니다. 배포 주소에서는 localhost 기록이 자동으로 옮겨지지 않습니다.
- 실제 어르신 관리 자료는 서버에 동기화되지 않으며 브라우저별로 분리됩니다.

배포 완료: https://school-tau-pearl.vercel.app

GitHub: https://github.com/sonouk5791/school (main)

교체 전 버전: backup-before-static-school-20260915 태그.

프로덕션 검증: 새 공부방 5개 열기/닫기, 새 이미지 HTTP 200, 자산 오류 및 JS 오류 없음.


## 2026-09-16 누적 수정 운영 배포

- **배포 완료 확인 / 2026-09-16 14:29**: GitHub main 소스 커밋 `11f1c562a7d5667fbaf2c85b1c57221a980e2964` 푸시 성공. Vercel 운영 배포 `dpl_4CTSDyt2yZHP4ESvaqTvp3Hzgis8` READY 확인.
- **운영 주소**: https://school-tau-pearl.vercel.app/
- **운영 검증**: HTML 및 신규 JS/CSS 8개 HTTP 200과 로컬 소스 SHA-256 일치, 20분 체조 영상 HTTP 200 및 23,005,436바이트 확인. 공단 자동 저장은 여전히 미연동이며 등록 준비 기능이 배포됨.

대상자 자료는 브라우저별 저장 방식입니다. 공단 연결은 공식 로그인 및 수동 등록 준비를 지원하며 자동 저장 연동을 의미하지 않습니다.
