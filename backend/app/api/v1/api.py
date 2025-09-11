# Importaciones para configurar el router principal de la API
from fastapi import APIRouter
from app.api.notes import router as notes_router

# Crear router principal que agrupa todas las rutas de la API v1
api_router = APIRouter()

# Incluir router de notas con prefijo y etiquetas para documentación
api_router.include_router(notes_router, prefix="/notes", tags=["notes"])