# Importaciones para configuración de base de datos SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Crear motor de base de datos SQLite con configuración para threading
engine = create_engine(
    settings.database_url, 
    connect_args={"check_same_thread": False}  # Permitir acceso desde múltiples threads
)

# Configurar fábrica de sesiones de base de datos
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Clase base para todos los modelos de SQLAlchemy
Base = declarative_base()

# Función generadora para obtener sesiones de base de datos
def get_db():
    """Crear y gestionar sesión de base de datos con cleanup automático"""
    db = SessionLocal()  # Crear nueva sesión
    try:
        yield db         # Proporcionar sesión al endpoint
    finally:
        db.close()       # Cerrar sesión al finalizar