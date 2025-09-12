@echo off
REM Script de configuración inicial para Notes App en Windows

echo 🚀 Configurando Notes App...

REM Verificar si Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está instalado. Por favor instala Docker primero.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose no está instalado. Por favor instala Docker Compose primero.
    pause
    exit /b 1
)

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env...
    copy .env.example .env
    echo ✅ Archivo .env creado desde .env.example
)

REM Crear directorios necesarios
echo 📁 Creando directorios necesarios...
if not exist backend\data mkdir backend\data
if not exist frontend\dist mkdir frontend\dist

echo ✅ Configuración completada!
echo.
echo Para ejecutar la aplicación:
echo   🐳 Con Docker: docker-compose up --build
echo   💻 Manual: Instalar dependencias y ejecutar
echo.
echo URLs de la aplicación:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
pause