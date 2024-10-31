@echo off
setlocal enabledelayedexpansion

echo === Starting Deployment ===

REM Check if running with administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with administrator privileges
) else (
    echo Warning: Not running with administrator privileges
)

echo === Checking Docker ===
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo === Stopping running containers ===
docker compose down -v

echo === Cleaning up old containers and images ===
docker compose rm -f
docker container prune -f
docker image prune -f

echo === Building new Docker images ===
docker compose build --no-cache

echo === Starting services ===
docker compose up -d

echo === Waiting for MySQL to be healthy ===
:MYSQL_WAIT_LOOP
docker compose ps db | findstr "healthy" >nul
if errorlevel 1 (
    echo Waiting for MySQL to be ready...
    ping -n 2 127.0.0.1 >nul
    goto MYSQL_WAIT_LOOP
)
echo MySQL is healthy

echo === Checking service status ===
docker compose ps

echo === Verifying Application Health ===
:APP_HEALTH_CHECK
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001' -UseBasicParsing; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if errorlevel 1 (
    echo Waiting for application to be ready...
    ping -n 2 127.0.0.1 >nul
    goto APP_HEALTH_CHECK
)
echo Application is responding

echo === Container logs ===
docker compose logs --tail=50

echo === Testing Database Connection ===
docker compose exec -T db mysql -uroot -pSummer@2020 -e "SELECT 1;" router_monitoring
if errorlevel 1 (
    echo Warning: Database connection test failed
) else (
    echo Database connection test successful
)

echo === Deployment Status ===
echo.
echo Application URL: http://localhost:3001
echo Database Port: 3306
echo.
docker compose ps
echo.

echo === Verify Routes ===
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/routers' -UseBasicParsing; Write-Host 'API test successful' } catch { Write-Host 'API test failed' }"

echo === Press any key to exit ===
pause >nul