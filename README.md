# 🚀 디지털 AI 학교 (Digital AI School) 프로젝트 및 배포 도구

- **원격 배포 대상 사이트**: [https://school-tau-pearl.vercel.app/](https://school-tau-pearl.vercel.app/)
- **작업 디렉토리**: `C:\Users\windows\OneDrive\Desktop\sh`

---

## 📁 주요 구성 파일 안내

- **[sh](file:///c:/Users/windows/OneDrive/Desktop/sh/sh)**: 요청하신 쉘 스크립트 실행 파일 (`bash deploy.sh` 호출 래퍼)
- **[sh.bat](file:///c:/Users/windows/OneDrive/Desktop/sh/sh.bat)**: Windows 환경에서 커맨드 프롬프트(CMD) 또는 더블클릭으로 바로 실행 가능한 배치 파일
- **[deploy.sh](file:///c:/Users/windows/OneDrive/Desktop/sh/deploy.sh)**: Git 커밋/푸시 및 Vercel 배포 자동화 전체 로직이 담긴 Bash 스크립트
- **[deploy.ps1](file:///c:/Users/windows/OneDrive/Desktop/sh/deploy.ps1)**: Windows PowerShell 전용 배포 스크립트
- **[vercel.json](file:///c:/Users/windows/OneDrive/Desktop/sh/vercel.json)**: Vercel 정적 웹 호스팅 환경 설정
- **[package.json](file:///c:/Users/windows/OneDrive/Desktop/sh/package.json)**: `npm run deploy` 실행용 메타데이터
- **[index.html](file:///c:/Users/windows/OneDrive/Desktop/sh/index.html)** 등 웹사이트 전체 소스: HTML, CSS, JS, Assets 미러링 완료

---

## 🛠️ 사용 방법

### 1. Windows CMD / PowerShell / 더블클릭 (`sh.bat` 또는 `deploy.ps1`)

```cmd
:: 기본 Vercel 프리뷰 배포
sh.bat

:: Vercel 실제 운영(Production) 배포
sh.bat prod

:: GitHub 커밋 & 푸시
sh.bat github "수정 사항 커밋 메시지"

:: GitHub 푸시 + Vercel 운영 배포 동시 실행
sh.bat all "업데이트 배포"
```

### 2. Git Bash / WSL / Linux 환경 (`sh` 또는 `deploy.sh`)

```bash
# 실행 권한 부여 (필요 시)
chmod +x sh deploy.sh

# 1) 프리뷰(Preview) 배포
./sh preview
# 또는 ./deploy.sh preview

# 2) 프로덕션(Production) 실서버 배포
./sh prod

# 3) GitHub에만 커밋 및 푸시
./sh github "커밋 메시지"

# 4) GitHub 푸시와 Vercel 배포 동시 수행
./sh all "배포 메시지"
```

### 3. npm 명령어를 통한 실행

```bash
npm run deploy         # preview 배포
npm run deploy:prod    # production 배포
npm run deploy:all     # git push + production 배포
```
