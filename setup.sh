#!/bin/bash

# Script de configuración inicial para Notes App

echo "🚀 Configurando Notes App..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado desde .env.example"
fi

# Crear directorios necesarios
echo "📁 Creando directorios necesarios..."
mkdir -p backend/data
mkdir -p frontend/dist

# Dar permisos de ejecución
chmod +x setup.sh

echo "✅ Configuración completada!"
echo ""
echo "Para ejecutar la aplicación:"
echo "  🐳 Con Docker: docker-compose up --build"
echo "  💻 Manual: make install && make dev"
echo ""
echo "URLs de la aplicación:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"