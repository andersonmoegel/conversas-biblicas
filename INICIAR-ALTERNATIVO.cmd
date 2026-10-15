@echo off
cd /d "%~dp0"
set PORT=3001
node --env-file-if-exists=.env server.mjs
pause
