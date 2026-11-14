@echo off
REM setup.bat - wrapper para Windows que corre setup.ps1 sin pelearse
REM con la política de ejecución por defecto de PowerShell.
REM
REM Uso:
REM   Doble clic en scripts\setup.bat
REM   o desde cmd:  scripts\setup.bat
REM   o desde PowerShell:  .\scripts\setup.bat

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1"
if errorlevel 1 (
  echo.
  echo Setup fallo. Revisa el output arriba.
  pause
  exit /b 1
)

echo.
pause
