@echo off
REM Windows batch wrapper for sh / deploy
if exist "%ProgramFiles%\Git\bin\bash.exe" (
    "%ProgramFiles%\Git\bin\bash.exe" "%~dp0sh" %*
) else (
    powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" %*
)
