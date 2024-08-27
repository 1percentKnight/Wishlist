@echo off

echo Starting Node.js server...
cd /d "%~dp0backend"
start "" "C:\Program Files\nodejs\node.exe" server.js

echo Starting Angular development server...
cd /d "%~dp0frontend"
start "" ng serve

echo Waiting for Angular server to be available...

:waitForAngular
timeout /t 3 >nul
echo Checking if Angular server is up...
powershell -Command "(Invoke-WebRequest -Uri http://localhost:4200 -UseBasicP) -ne $null"

if %errorlevel% neq 0 (
    echo Angular server is not up yet. Retrying...
    goto waitForAngular
)

echo Angular server is running. Opening in the browser...
start "" "http://localhost:4200"
