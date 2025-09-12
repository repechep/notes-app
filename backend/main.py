# Importaciones principales para la aplicación FastAPI
from fastapi import FastAPI
from sqlalchemy.exc import SQLAlchemyError
from app.core.config import settings
from app.database import Base, engine, SessionLocal
from app.api.v1.api import api_router
from app.middleware.cors import setup_cors
from app.exceptions.handlers import (
    NotFoundError,
    ValidationError,
    not_found_handler,
    validation_error_handler,
    database_error_handler
)
from app.models import Note
from app.services.note_service import NoteService
from app.schemas import NoteCreate
from app.middleware.logging import LoggingMiddleware
from app.middleware.security import setup_security_middleware, add_security_headers

# Crear todas las tablas en la base de datos al iniciar la aplicación
Base.metadata.create_all(bind=engine)

# Función para poblar la base de datos con datos de ejemplo si está vacía
def auto_seed_database():
    """Poblar automáticamente la base de datos con notas de ejemplo si está vacía"""
    db = SessionLocal()
    try:
        # Verificar si la base de datos está vacía
        note_count = db.query(Note).count()
        if note_count == 0:
            # Crear servicio y notas de ejemplo
            service = NoteService(db)
            sample_notes = [
                {"title": "Welcome to Notes App", "content": "This is your first note! You can create, edit, and delete notes using this application.", "tags": ["welcome"], "archived": False},
                {"title": "Meeting Notes", "content": "Project kickoff meeting scheduled for next week.", "tags": ["meeting", "work"], "archived": False},
                {"title": "Shopping List", "content": "Milk, bread, eggs, apples", "tags": ["shopping"], "archived": False}
            ]
            # Crear cada nota de ejemplo
            for note_data in sample_notes:
                service.create_note(NoteCreate(**note_data))
            print("Database auto-seeded with sample notes")
    except Exception as e:
        print(f"Auto-seed error: {e}")
    finally:
        db.close()

# Ejecutar el auto-seed al iniciar la aplicación
auto_seed_database()

# Función para crear y configurar la aplicación FastAPI
def create_application() -> FastAPI:
    """Crear y configurar la instancia principal de FastAPI con middleware y rutas"""
    # Crear aplicación con metadatos
    application = FastAPI(
        title=settings.project_name,
        debug=settings.debug,
        version="1.0.0",
        description="API para gestión de notas"
    )
    
    # Configurar CORS para permitir peticiones desde el frontend
    setup_cors(application)
    
    # Agregar middleware de logging
    application.add_middleware(LoggingMiddleware)
    
    # Configurar middleware de seguridad
    setup_security_middleware(application)
    add_security_headers(application)
    
    # Registrar manejadores de excepciones personalizados
    application.add_exception_handler(NotFoundError, not_found_handler)
    application.add_exception_handler(ValidationError, validation_error_handler)
    application.add_exception_handler(SQLAlchemyError, database_error_handler)
    
    # Incluir todas las rutas de la API con prefijo
    application.include_router(api_router, prefix=settings.api_v1_str)
    
    return application

# Crear la instancia principal de la aplicación
app = create_application()

# Endpoint raíz para información básica de la API
@app.get("/")
def root():
    """Endpoint raíz que devuelve información básica de la API"""
    return {"message": "Notes API", "version": "1.0.0"}

# Endpoint de health check para monitoreo
@app.get("/health")
def health_check():
    """Endpoint para verificar el estado de salud de la API"""
    return {"status": "healthy"}

# Ejecutar servidor de desarrollo si se ejecuta directamente
if __name__ == "__main__":
    import uvicorn
    # Iniciar servidor Uvicorn con recarga automática en desarrollo
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)