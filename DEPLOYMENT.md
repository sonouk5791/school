# 배포 준비

현재 프로그램은 정적 HTML/CSS/JS 앱입니다. Vercel의 Other 프레임워크, 빌드 명령 없음, 출력 디렉터리 `.` 설정을 사용합니다.

- `vercel.json`: 정적 배포 설정
- `.vercelignore`: 테스트 결과, 작업 보고서, 개발 도구 파일 배포 제외
- `.gitignore`: 인증정보, Vercel 로컬 연결 정보, 테스트 화면 결과 제외
- 로컬 실행: `node server.cjs`
- 기록은 브라우저 localStorage에 저장됩니다. 배포 주소에서는 localhost 기록이 자동으로 옮겨지지 않습니다.
- 실제 어르신 관리 자료는 서버에 동기화되지 않으며 브라우저별로 분리됩니다.

GitHub/Vercel 로그인 확인 완료. 배포 대상은 사용자 선택 대기 중입니다.
