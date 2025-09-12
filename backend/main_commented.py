# Importaciones principales para la aplicación FastAPI
# FastAPI: Framework web moderno y rápido para construir APIs con Python
from fastapi import FastAPI
# SQLAlchemy: ORM para manejo de base de datos
from sqlalchemy.exc import SQLAlchemyError
# Configuración centralizada de la aplicación
from app.core.config import settings
# Componentes de base de datos: modelos, motor y sesiones
from app.database import Base, engine, SessionLocal
# Router principal que agrupa todas las rutas de la API
from app.api.v1.api import api_router
# Middleware para configurar CORS (Cross-Origin Resource Sharing)
from app.middleware.cors import setup_cors
# Manejadores de excepciones personalizados para errores comunes
from app.exceptions.handlers import (
    NotFoundError,
    ValidationError,
    not_found_handler,
    validation_error_handler,
    database_error_handler
)
# Modelo de datos y servicios para notas
from app.models import Note
from app.services.note_service import NoteService
from app.schemas import NoteCreate
# Middleware adicionales para logging y seguridad
from app.middleware.logging import LoggingMiddleware
from app.middleware.security import setup_security_middleware, add_security_headers

# Crear todas las tablas en la base de datos al iniciar la aplicación
# Esto asegura que la estructura de la base de datos esté lista antes de recibir peticiones
Base.metadata.create_all(bind=engine)

# Función para poblar la base de datos con datos de ejemplo si está vacía
# Esto mejora la experiencia del usuario al tener contenido inicial
def auto_seed_database():
    """Poblar automáticamente la base de datos con notas de ejemplo si está vacía"""
    db = SessionLocal()  # Crear sesión de base de datos
    try:
        # Verificar si la base de datos ya tiene notas
        note_count = db.query(Note).count()
        if note_count == 0:  # Solo poblar si está vacía
            # Crear instancia del servicio de notas
            service = NoteService(db)
            # Definir notas de ejemplo con diferentes categorías
            sample_notes = [
                {
                    "title": "Welcome to Notes App", 
                    "content": "This is your first note! You can create, edit, and delete notes using this application.", 
                    "tags": ["welcome"], 
                    "archived": False
                },
                {
                    "title": "Meeting Notes", 
                    "content": "Project kickoff meeting scheduled for next week.", 
                    "tags": ["meeting", "work"], 
                    "archived": False
                },
                {
                    "title": "Shopping List", 
                    "content": "Milk, bread, eggs, apples", 
                    "tags": ["shopping"], 
                    "archived": False
                }
            ]
            # Crear cada nota de ejemplo usando el servicio
            for note_data in sample_notes:
                service.create_note(NoteCreate(**note_data))
            print("Database auto-seeded with sample notes")
    except Exception as e:
        print(f"Auto-seed error: {e}")
    finally:
        db.close()  # Asegurar que la sesión se cierre correctamente

# Ejecutar el auto-seed al iniciar la aplicación
# Esto se ejecuta una sola vez cuando el servidor se inicia
auto_seed_database()

# Función para crear y configurar la aplicación FastAPI
# Patrón Factory para crear la instancia de la aplicación con toda su configuración
def create_application() -> FastAPI:
    """Crear y configurar la instancia principal de FastAPI con middleware y rutas"""
    # Crear aplicación FastAPI con metadatos para la documentación automática
    application = FastAPI(
        title=settings.project_name,  # Título que aparece en la documentación
        debug=settings.debug,  # Modo debug para desarrollo
        version="1.0.0",  # Versión de la API
        description="API para gestión de notas"  # Descripción en la documentación
    )
    
    # Configurar CORS para permitir peticiones desde el frontend
    # Esto es esencial para que el frontend pueda comunicarse con el backend
    setup_cors(application)
    
    # Agregar middleware de logging para registrar todas las peticiones
    application.add_middleware(LoggingMiddleware)
    
    # Configurar middleware de seguridad para protección adicional
    setup_security_middleware(application)  # Compresión y sesiones
    add_security_headers(application)  # Headers de seguridad HTTP
    
    # Registrar manejadores de excepciones personalizados
    # Esto permite respuestas de error consistentes y amigables
    application.add_exception_handler(NotFoundError, not_found_handler)
    application.add_exception_handler(ValidationError, validation_error_handler)
    application.add_exception_handler(SQLAlchemyError, database_error_handler)
    
    # Incluir todas las rutas de la API con el prefijo configurado
    # Todas las rutas estarán bajo /api/v1
    application.include_router(api_router, prefix=settings.api_v1_str)
    
    return application

# Crear la instancia principal de la aplicación
# Esta es la instancia que usará el servidor ASGI (uvicorn)
app = create_application()

# Endpoint raíz para información básica de la API
# Proporciona información básica cuando se accede a la raíz del servidor
@app.get("/")
def root():
    """Endpoint raíz que devuelve información básica de la API"""
    return {
        "message": "Notes API", 
        "version": "1.0.0",
        "docs": "/docs",  # Enlace a la documentación interactiva
        "redoc": "/redoc"  # Enlace a la documentación alternativa
    }

# Endpoint de health check para monitoreo
# Útil para sistemas de monitoreo y balanceadores de carga
@app.get("/health")
def health_check():
    """Endpoint para verificar el estado de salud de la API"""
    return {
        "status": "healthy",
        "version": "1.0.0"
    }

# Ejecutar servidor de desarrollo si se ejecuta directamente
# Esto permite ejecutar el servidor con: python main.py
if __name__ == "__main__":
    import uvicorn
    # Iniciar servidor Uvicorn con configuración de desarrollo
    # host="0.0.0.0" permite conexiones desde cualquier IP
    # port=8000 es el puerto estándar para desarrollo
    # reload=True reinicia el servidor cuando hay cambios en el código
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)