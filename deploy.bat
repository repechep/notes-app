@echo off
REM Script para actualizar el repositorio en GitHub

echo 🚀 Actualizando repositorio en GitHub...

REM Verificar si estamos en un repositorio git
if not exist .git (
    echo ❌ No es un repositorio git. Inicializando...
    git init
    git remote add origin https://github.com/TU_USUARIO/notes-app.git
)

REM Agregar todos los archivos
echo 📁 Agregando archivos...
git add .

REM Crear commit con mensaje descriptivo
echo 💾 Creando commit...
git commit -m "feat: complete notes app with pokemon api, dark mode, and security middlewares - ✅ Full CRUD notes functionality with pagination - ✅ Dark mode with localStorage persistence - ✅ Pokemon API integration with smart search - ✅ Delete confirmation modal - ✅ Security middlewares (compression, headers, sessions) - ✅ Logging middleware for request tracking - ✅ Docker setup with compose - ✅ Automated setup scripts for cross-platform - ✅ Complete documentation and installation guide"

REM Subir cambios a GitHub
echo ⬆️ Subiendo a GitHub...
git push -u origin main

echo ✅ Repositorio actualizado exitosamente!
echo 🌐 Ver en: https://github.com/TU_USUARIO/notes-app
pause