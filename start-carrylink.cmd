@echo off
setlocal
set "ROOT=%~dp0"

echo Starting CarryLink backend and frontend...
start "CarryLink Backend" /D "%ROOT%backend" cmd /k "call mvnw.cmd spring-boot:run"
start "CarryLink Frontend" /D "%ROOT%frontend" cmd /k "npm run dev"

timeout /t 8 /nobreak >nul
start "" http://localhost:5173
endlocal
