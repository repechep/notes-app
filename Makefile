# Notes App Makefile

.PHONY: help install setup up down clean test lint format seed

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

setup: install ## Setup the project (install deps + init db + seed)
	@echo "Initializing database..."
	cd backend && python init_db.py
	@echo "Seeding database with example data..."
	cd backend && python seed_data.py

up: ## Start both backend and frontend servers
	@echo "Starting backend server..."
	start cmd /k "cd backend && python main.py"
	@echo "Starting frontend server..."
	start cmd /k "cd frontend && npm run dev"
	@echo "Servers started! Backend: http://localhost:8000, Frontend: http://localhost:3000"

backend: ## Start only backend server
	cd backend && python main.py

frontend: ## Start only frontend server
	cd frontend && npm run dev

test: ## Run all tests
	@echo "Running backend tests..."
	cd backend && pytest test_api_complete.py -v
	@echo "Running frontend tests..."
	cd frontend && npm run test:run

lint: ## Run linters
	@echo "Linting backend..."
	cd backend && flake8 .
	@echo "Linting frontend..."
	cd frontend && npm run lint

test-frontend: ## Run only frontend tests
	cd frontend && npm run test:run

test-backend: ## Run only backend tests
	cd backend && pytest test_api_complete.py -v

format: ## Format code
	@echo "Formatting backend code..."
	cd backend && black . && isort .
	@echo "Formatting frontend code..."
	cd frontend && npm run format

seed: ## Seed database with example data
	cd backend && python seed_data.py

clean: ## Clean up generated files
	@echo "Cleaning up..."
	cd backend && del /f notes.db test_complete.db 2>nul || true
	cd frontend && rmdir /s /q dist node_modules 2>nul || true
	cd backend && rmdir /s /q __pycache__ .pytest_cache 2>nul || true

docs: ## Open API documentation
	start http://localhost:8000/docs