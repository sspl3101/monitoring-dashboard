@echo off
setlocal enabledelayedexpansion

echo === Verification Script ===

echo.
echo === Checking Docker Status ===
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running!
) else (
    echo Docker is running
)

echo.
echo === Container Status ===
docker compose ps

echo.
echo === Container Logs ===
echo --- Application Logs ---
docker compose logs app --tail=20
echo.
echo --- Database Logs ---
docker compose logs db --tail=20

echo.
echo === Network Status ===
docker network ls | findstr "monitoring-dashboard"
docker network inspect monitoring-dashboard_app-network

echo.
echo === Database Connection Test ===
docker compose exec -T db mysql -uroot -pSummer@2020 router_monitoring -e "SELECT VERSION();"

echo.
echo === API Health Check ===
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/routers' -UseBasicParsing; Write-Host 'API Response:'; Write-Host $response.Content } catch { Write-Host 'API test failed: ' $_.Exception.Message }"

echo.
echo === Resource Usage ===
docker stats --no-stream

echo === Press any key to exit ===
pause >nul