# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Notes App! Esta guía te ayudará a empezar.

## 🚀 Configuración de Desarrollo

### 1. Fork y Clone
```bash
git clone https://github.com/TU_USUARIO/notes-app.git
cd notes-app
```

### 2. Configuración con Docker
```bash
docker-compose up --build
```

### 3. Configuración Manual
```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

## 📝 Proceso de Contribución

### 1. Crear Issue
- Describe el problema o feature
- Usa las plantillas disponibles
- Agrega labels apropiados

### 2. Crear Branch
```bash
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### 3. Desarrollo
- Sigue las convenciones de código
- Agrega tests si es necesario
- Actualiza documentación

### 4. Tests
```bash
# Backend
cd backend && pytest -v

# Frontend
cd frontend && npm test

# Linting
cd backend && flake8 . && black . && isort .
cd frontend && npm run lint
```

### 5. Commit
```bash
git add .
git commit -m "feat: descripción clara del cambio"
```

### 6. Pull Request
- Título descriptivo
- Descripción detallada
- Referencias a issues relacionados
- Screenshots si aplica

## 🎯 Convenciones

### Commits
Usa [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` formateo, sin cambios de código
- `refactor:` refactoring de código
- `test:` agregar o corregir tests
- `chore:` tareas de mantenimiento

### Código
- **Python**: PEP 8, type hints, docstrings
- **JavaScript**: ESLint, Prettier
- **Nombres**: descriptivos y en inglés
- **Comentarios**: en español para explicar lógica compleja

## 🐛 Reportar Bugs

### Información Necesaria
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots/videos si aplica
- Información del entorno:
  - OS
  - Versión de Node/Python
  - Versión de Docker

### Plantilla de Bug Report
```markdown
**Descripción**
Descripción clara del bug.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

**Comportamiento Esperado**
Lo que debería pasar.

**Screenshots**
Si aplica, agrega screenshots.

**Entorno**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Versión: [e.g. 1.0.0]
```

## ✨ Solicitar Features

### Información Necesaria
- Descripción clara del feature
- Justificación/caso de uso
- Mockups o ejemplos si aplica
- Consideraciones técnicas

### Plantilla de Feature Request
```markdown
**¿Tu feature request está relacionado con un problema?**
Descripción clara del problema.

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que pase.

**Describe alternativas que has considerado**
Otras soluciones o features consideradas.

**Contexto adicional**
Screenshots, mockups, etc.
```

## 🏗️ Arquitectura

### Backend (FastAPI)
```
app/
├── api/          # Endpoints REST
├── core/         # Configuración
├── services/     # Lógica de negocio
├── models.py     # Modelos SQLAlchemy
└── schemas.py    # Esquemas Pydantic
```

### Frontend (React)
```
src/
├── components/   # Componentes reutilizables
├── pages/        # Páginas/vistas
├── services/     # Servicios API
└── utils/        # Utilidades
```

## 🧪 Testing

### Backend
- **Unit tests**: pytest
- **Coverage**: pytest-cov
- **API tests**: TestClient de FastAPI

### Frontend
- **Unit tests**: Vitest
- **Component tests**: Testing Library
- **E2E**: Playwright (futuro)

## 📚 Recursos

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Preguntas

Si tienes preguntas:
1. Revisa la documentación
2. Busca en issues existentes
3. Crea un nuevo issue con la etiqueta `question`

¡Gracias por contribuir! 🎉