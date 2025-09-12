# Makefile para comandos comunes del proyecto

.PHONY: help install dev build test clean docker-build docker-up docker-down

help: ## Mostrar ayuda
	@echo "Comandos disponibles:"
	@echo "  install     - Instalar dependencias"
	@echo "  dev         - Ejecutar en modo desarrollo"
	@echo "  build       - Construir para producción"
	@echo "  test        - Ejecutar tests"
	@echo "  clean       - Limpiar archivos temporales"
	@echo "  docker-up   - Iniciar con Docker Compose"
	@echo "  docker-down - Parar Docker Compose"

install: ## Instalar dependencias
	@echo "Instalando dependencias del backend..."
	cd backend && pip install -r requirements.txt
	@echo "Instalando dependencias del frontend..."
	cd frontend && npm install

dev: ## Ejecutar en modo desarrollo
	@echo "Iniciando backend en segundo plano..."
	cd backend && python main.py &
	@echo "Iniciando frontend..."
	cd frontend && npm run dev

build: ## Construir para producción
	@echo "Construyendo frontend..."
	cd frontend && npm run build

test: ## Ejecutar tests
	@echo "Ejecutando tests del backend..."
	cd backend && pytest -v

clean: ## Limpiar archivos temporales
	@echo "Limpiando archivos temporales..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	cd frontend && rm -rf node_modules/.cache

docker-build: ## Construir imágenes Docker
	docker-compose build

docker-up: ## Iniciar con Docker Compose
	docker-compose up --build

docker-down: ## Parar Docker Compose
	docker-compose down