#!/usr/bin/env bash
# ==============================================================================
# Script: deploy.sh
# Purpose: Build and Deploy script for GitHub and Vercel
# Target: https://school-tau-pearl.vercel.app/
# ==============================================================================

set -e

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================================${NC}"
echo -e "${BLUE}   🚀 Digital AI School - Build & Deploy Script    ${NC}"
echo -e "${BLUE}   Target: https://school-tau-pearl.vercel.app/     ${NC}"
echo -e "${BLUE}===================================================${NC}"

# 명령행 인자 확인
TARGET="${1:-preview}" # 기본값: preview (옵션: preview, prod, github, all)
COMMIT_MSG="${2:-Update digital AI school deployment}"

# Node.js 및 npm 설치 확인
check_requirements() {
  echo -e "\n${YELLOW}[1/4] 필수 도구 점검 중...${NC}"
  
  if command -v git >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Git 설치 확인 완료: $(git --version)${NC}"
  else
    echo -e "${RED}✗ Git이 설치되어 있지 않습니다. Git을 설치해 주세요.${NC}"
    exit 1
  fi

  if command -v node >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Node.js 설치 확인 완료: $(node -v)${NC}"
  else
    echo -e "${YELLOW}! Node.js가 감지되지 않았습니다. Vercel CLI 배포 시 필요할 수 있습니다.${NC}"
  fi
}

# Git 커밋 및 GitHub 푸시
deploy_github() {
  echo -e "\n${YELLOW}[2/4] Git 변경사항 커밋 및 GitHub 배포...${NC}"

  # Git 저장소가 아니면 초기화
  if [ ! -d ".git" ]; then
    echo "Git 저장소를 초기화합니다..."
    git init
    git branch -M main
  fi

  # Git 사용자 설정 확인 및 로컬 기본값 적용
  if ! git config user.name >/dev/null 2>&1; then
    git config user.name "AI School Deployer"
  fi
  if ! git config user.email >/dev/null 2>&1; then
    git config user.email "deploy@digital-ai-school.local"
  fi

  # 변경사항 스테이징
  git add .
  
  # 변경사항이 있는지 확인
  if git status --porcelain | grep -q .; then
    echo "변경사항을 커밋합니다: '$COMMIT_MSG'"
    git commit -m "$COMMIT_MSG"
  else
    echo "새로운 커밋 변경사항이 없습니다."
  fi

  # 원격 저장소 확인
  if git remote | grep -q "origin"; then
    echo "GitHub 원격 저장소(origin)로 푸시합니다..."
    git push origin main || echo -e "${YELLOW}원격 브랜치 푸시 실패 - 원격지 권한 또는 URL을 확인하세요.${NC}"
  else
    echo -e "${YELLOW}주의: Git 원격 저장소(origin)가 설정되지 않았습니다.${NC}"
    echo "아래 명령어로 GitHub 저장소를 연결할 수 있습니다:"
    echo "  git remote add origin <your-github-repo-url>"
    echo "  git push -u origin main"
  fi
}

# Vercel 배포
deploy_vercel() {
  local MODE="$1"
  echo -e "\n${YELLOW}[3/4] Vercel 배포 진행 중 (모드: ${MODE})...${NC}"

  # npx vercel 사용
  if [ "$MODE" = "prod" ] || [ "$MODE" = "production" ]; then
    echo -e "${BLUE}▶ 프로덕션(Production) 배포를 시작합니다...${NC}"
    npx -y vercel --prod
  else
    echo -e "${BLUE}▶ 프리뷰(Preview) 배포를 시작합니다...${NC}"
    npx -y vercel
  fi
}

# 완료 안내
finish_summary() {
  echo -e "\n${GREEN}===================================================${NC}"
  echo -e "${GREEN}   ✨ 배포 작업이 성공적으로 완료되었습니다!       ${NC}"
  echo -e "${GREEN}   사이트: https://school-tau-pearl.vercel.app/    ${NC}"
  echo -e "${GREEN}===================================================${NC}"
}

# 실행 모드 분기
check_requirements

case "$TARGET" in
  preview)
    deploy_vercel "preview"
    ;;
  prod|production)
    deploy_vercel "prod"
    ;;
  github)
    deploy_github
    ;;
  all)
    deploy_github
    deploy_vercel "prod"
    ;;
  *)
    echo -e "${RED}알 수 없는 옵션: $TARGET${NC}"
    echo "사용법:"
    echo "  ./deploy.sh [preview|prod|github|all] [\"커밋 메시지\"]"
    echo "예시:"
    echo "  ./deploy.sh preview          # Vercel 테스트/프리뷰 배포"
    echo "  ./deploy.sh prod             # Vercel 실제 운영(Production) 배포"
    echo "  ./deploy.sh github \"메시지\"  # GitHub 커밋 및 푸시만 수행"
    echo "  ./deploy.sh all \"메시지\"     # GitHub 푸시 및 Vercel 운영 배포 동시 수행"
    exit 1
    ;;
esac

finish_summary
