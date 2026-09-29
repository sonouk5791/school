# 🚀 디지털 AI 학교 (Digital AI School) 배포 스크립트

대상 서비스: [https://school-tau-pearl.vercel.app/](https://school-tau-pearl.vercel.app/)

---

## 📁 생성된 파일 안내

- **`sh`**: 사용자가 요청하신 쉘 스크립트 파일 (`bash deploy.sh` 실행 래퍼)
- **`deploy.sh`**: Linux/macOS 및 Git Bash / WSL 환경용 배포 쉘 스크립트
- **`deploy.ps1`**: Windows PowerShell 환경에서 직접 실행 가능한 배포 스크립트
- **`vercel.json`**: Vercel 정적 웹 호스팅 환경 설정
- **`package.json`**: `npm run deploy` 등으로 실행 가능한 메타데이터

---

## 🛠️ 사용 방법

### 1. Bash / Git Bash / Linux 환경 (`sh` 또는 `deploy.sh`)

```bash
# 실행 권한 부여 (필요 시)
chmod +x sh deploy.sh

# 1) 프리뷰(Preview) 배포 (기본값)
./sh preview
# 또는
./deploy.sh preview

# 2) 프로덕션(Production / 실서버) 배포
./sh prod
# 또는
./deploy.sh prod

# 3) GitHub에만 커밋 및 푸시
./sh github "커밋 메시지"

# 4) GitHub 푸시와 Vercel 프로덕션 배포를 한 번에 실행
./sh all "배포 업데이트"
```

### 2. Windows PowerShell 환경 (`deploy.ps1`)

```powershell
# 1) 프리뷰 배포
.\deploy.ps1 preview

# 2) 프로덕션 배포
.\deploy.ps1 prod

# 3) GitHub 푸시 및 Vercel 배포 동시 실행
.\deploy.ps1 all "배포 업데이트"
```

### 3. npm 명령어를 통한 실행

```bash
npm run deploy         # preview 배포
npm run deploy:prod    # production 배포
npm run deploy:all     # git push + production 배포
```
