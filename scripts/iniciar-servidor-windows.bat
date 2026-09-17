@echo off
setlocal
cd /d "%~dp0.."

echo === A Jornada do Aprender ===
echo Servidor: http://localhost:3000

echo Para os outros computadores, use o IPv4 deste PC com a porta 3000.
echo Nao feche esta janela enquanto o jogo estiver em uso.
echo.

call pnpm.cmd run diagnose
if errorlevel 1 (
  echo.
  echo O diagnostico encontrou um problema. Corrija-o antes de iniciar.
  pause
  exit /b 1
)

call pnpm.cmd run dev
pause
