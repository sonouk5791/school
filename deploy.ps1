# ==============================================================================
# Script: deploy.ps1 (PowerShell version for Windows)
# Purpose: Build and Deploy script for GitHub and Vercel
# Target: https://school-tau-pearl.vercel.app/
# ==============================================================================

param (
    [string]$Target = "preview",
    [string]$CommitMsg = "Update digital AI school deployment"
)

$ErrorActionPreference = "Stop"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   🚀 Digital AI School - Build & Deploy Script    " -ForegroundColor Cyan
Write-Host "   Target: https://school-tau-pearl.vercel.app/     " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. 요구사항 점검
Write-Host "`n[1/4] 필수 도구 점검 중..." -ForegroundColor Yellow
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "✓ Git 설치 확인 완료: $(git --version)" -ForegroundColor Green
} else {
    Write-Host "✗ Git이 설치되어 있지 않습니다. Git을 설치해 주세요." -ForegroundColor Red
    exit 1
}

# 2. GitHub 작업
function Deploy-GitHub {
    Write-Host "`n[2/4] Git 변경사항 커밋 및 GitHub 배포..." -ForegroundColor Yellow
    if (-not (Test-Path ".git")) {
        Write-Host "Git 저장소를 초기화합니다..."
        git init
        git branch -M main
    }

    $userName = git config user.name
    if (-not $userName) {
        git config user.name "AI School Deployer"
    }
    $userEmail = git config user.email
    if (-not $userEmail) {
        git config user.email "deploy@digital-ai-school.local"
    }

    git add .
    $status = git status --porcelain
    if ($status) {
        Write-Host "변경사항을 커밋합니다: '$CommitMsg'"
        git commit -m "$CommitMsg"
    } else {
        Write-Host "새로운 커밋 변경사항이 없습니다."
    }

    $remotes = git remote
    if ($remotes -contains "origin") {
        Write-Host "GitHub 원격 저장소(origin)로 푸시합니다..."
        git push origin main
    } else {
        Write-Host "주의: Git 원격 저장소(origin)가 설정되지 않았습니다." -ForegroundColor Yellow
        Write-Host "  git remote add origin <your-github-repo-url>"
        Write-Host "  git push -u origin main"
    }
}

# 3. Vercel 배포
function Deploy-Vercel ([string]$mode) {
    Write-Host "`n[3/4] Vercel 배포 진행 중 (모드: $mode)..." -ForegroundColor Yellow
    if ($mode -eq "prod" -or $mode -eq "production") {
        Write-Host "▶ 프로덕션(Production) 배포를 시작합니다..." -ForegroundColor Cyan
        npx.cmd -y vercel --prod
    } else {
        Write-Host "▶ 프리뷰(Preview) 배포를 시작합니다..." -ForegroundColor Cyan
        npx.cmd -y vercel
    }
}

switch ($Target) {
    "preview" {
        Deploy-Vercel "preview"
    }
    "prod" {
        Deploy-Vercel "prod"
    }
    "production" {
        Deploy-Vercel "prod"
    }
    "github" {
        Deploy-GitHub
    }
    "all" {
        Deploy-GitHub
        Deploy-Vercel "prod"
    }
    default {
        Write-Host "알 수 없는 옵션: $Target" -ForegroundColor Red
        Write-Host "사용법: .\deploy.ps1 [preview|prod|github|all] ['커밋 메시지']"
        exit 1
    }
}

Write-Host "`n===================================================" -ForegroundColor Green
Write-Host "   ✨ 배포 작업이 성공적으로 완료되었습니다!       " -ForegroundColor Green
Write-Host "   사이트: https://school-tau-pearl.vercel.app/    " -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
