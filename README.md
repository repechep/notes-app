# 📝 Notes App - Full Stack Application

Una aplicación completa de gestión de notas construida con **FastAPI** (backend) y **React** (frontend), con soporte para **Dark Mode** y integración con **GitHub API**.

![Notes App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed)

## ✨ Características

### 🔧 Backend (FastAPI)
- ✅ **API REST completa** con endpoints CRUD para notas
- ✅ **Modelo de datos** con UUID, timestamps y validaciones
- ✅ **Paginación y búsqueda** por texto
- ✅ **Base de datos SQLite** con auto-seed
- ✅ **Tests automatizados** con pytest
- ✅ **Documentación OpenAPI** automática

### 🎨 Frontend (React + Vite)
- ✅ **Interfaz moderna** para gestión de notas
- ✅ **Dark Mode** con persistencia
- ✅ **Búsqueda en tiempo real**
- ✅ **Integración con GitHub API** (issues de VS Code)
- ✅ **Diseño responsivo** y accesible
- ✅ **Estados de carga y error**

## 🚀 Ejecución Rápida con Docker

### Prerrequisitos
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Comando único
```bash
git clone https://github.com/repechep/notes-app.git
cd notes-app
docker-compose up --build
```

### URLs de la aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🛠️ Desarrollo Local

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📋 API Endpoints

### Notas (CRUD)
- `POST /api/v1/notes/` - Crear nota
- `GET /api/v1/notes/` - Listar notas (con paginación y búsqueda)
- `GET /api/v1/notes/{id}` - Obtener nota por ID
- `PUT /api/v1/notes/{id}` - Actualizar nota
- `DELETE /api/v1/notes/{id}` - Eliminar nota

### Modelo de Nota
```json
{
  "id": "uuid",
  "title": "string (1..120)",
  "content": "string (1..10000)",
  "tags": ["string"],
  "archived": false,
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601"
}
```

## 🧪 Tests

```bash
# Backend
cd backend
pytest test_api_complete.py -v

# Linting
flake8 .
black . && isort .
```

## 🏗️ Estructura del Proyecto

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # Endpoints de la API
│   │   ├── core/           # Configuración
│   │   ├── services/       # Lógica de negocio
│   │   ├── models.py       # Modelos SQLAlchemy
│   │   └── schemas.py      # Esquemas Pydantic
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Servicios API
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml      # Orquestación Docker
└── README.md
```

## 🌟 Funcionalidades Destacadas

### 🌙 Dark Mode
- Toggle visual con iconos
- Persistencia en localStorage
- Detección automática de preferencias del sistema
- Transiciones suaves

### 🔍 Búsqueda Inteligente
- Búsqueda en tiempo real
- Filtrado por título y contenido
- Paginación eficiente

### 🏷️ Sistema de Tags
- Tags visuales con chips coloridos
- Máximo 10 tags por nota
- Validación de longitud

### 🌐 Integración Externa
- PokéAPI para mostrar datos de Pokémon
- Información detallada de habilidades y tipos
- Interfaz visual atractiva

## 🔧 Configuración

### Variables de Entorno

**Backend** (`.env`):
```env
DATABASE_URL=sqlite:///./notes.db
DEBUG=true
```

**Frontend** (`.env`):
```env
REACT_APP_API_URL=http://localhost:8000
```

## 📦 Comandos Útiles

```bash
# Iniciar con Docker
docker-compose up -d

# Ver logs
docker-compose logs -f

# Reconstruir imágenes
docker-compose up --build

# Parar servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Reconocimientos

- **FastAPI** - Framework web moderno y rápido
- **React** - Biblioteca para interfaces de usuario
- **Vite** - Build tool ultrarrápido
- **Docker** - Containerización
- **PokéAPI** - Datos de Pokémon

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐