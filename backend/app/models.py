# Importaciones necesarias para definir modelos de SQLAlchemy
from sqlalchemy import Column, String, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from .database import Base

# Modelo de base de datos para las notas
class Note(Base):
    """Modelo que representa una nota en la base de datos"""
    __tablename__ = "notes"  # Nombre de la tabla en la base de datos

    # ID único como clave primaria (UUID convertido a string)
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Título de la nota (máximo 120 caracteres, obligatorio)
    title = Column(String(120), nullable=False)
    
    # Contenido de la nota (texto largo, obligatorio)
    content = Column(Text, nullable=False)
    
    # Tags almacenados como string separado por comas (opcional)
    tags = Column(String, default="")
    
    # Estado de archivado (por defecto False, obligatorio)
    archived = Column(Boolean, default=False, nullable=False)
    
    # Fecha de creación (se establece automáticamente)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Fecha de última actualización (se actualiza automáticamente)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)