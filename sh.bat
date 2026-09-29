@echo off
set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=preview"

set "COMMIT_MSG=%~2"
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Update digital AI school deployment"

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0deploy.ps1' -Target '%TARGET%' -CommitMsg '%COMMIT_MSG%'"
