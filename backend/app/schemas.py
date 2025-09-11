# Importaciones para validación y esquemas de datos con Pydantic
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

# Esquema para crear una nueva nota
class NoteCreate(BaseModel):
    """Esquema de datos para crear una nueva nota"""
    # Título de la nota (obligatorio, entre 1 y 120 caracteres)
    title: str = Field(..., min_length=1, max_length=120, description="Note title (1-120 characters)")
    # Contenido de la nota (obligatorio, entre 1 y 10000 caracteres)
    content: str = Field(..., min_length=1, max_length=10000, description="Note content (1-10000 characters)")
    # Lista opcional de etiquetas
    tags: Optional[List[str]] = Field(default=None, description="List of tags")
    # Estado de archivado (opcional, por defecto False)
    archived: Optional[bool] = Field(default=False, description="Archive status")
    
    @validator('tags')
    def validate_tags(cls, v):
        """Validar que las etiquetas cumplan con las restricciones"""
        if v is not None:
            # Máximo 10 etiquetas permitidas
            if len(v) > 10:
                raise ValueError('Maximum 10 tags allowed')
            # Cada etiqueta máximo 50 caracteres
            for tag in v:
                if len(tag) > 50:
                    raise ValueError('Tag length cannot exceed 50 characters')
        return v

# Esquema para actualizar una nota existente
class NoteUpdate(BaseModel):
    """Esquema de datos para actualizar una nota existente (todos los campos opcionales)"""
    # Título opcional para actualización
    title: Optional[str] = Field(None, min_length=1, max_length=120, description="Note title (1-120 characters)")
    # Contenido opcional para actualización
    content: Optional[str] = Field(None, min_length=1, max_length=10000, description="Note content (1-10000 characters)")
    # Lista opcional de etiquetas para actualización
    tags: Optional[List[str]] = Field(None, description="List of tags")
    # Estado de archivado opcional para actualización
    archived: Optional[bool] = Field(None, description="Archive status")
    
    @validator('tags')
    def validate_tags(cls, v):
        """Validar que las etiquetas cumplan con las restricciones"""
        if v is not None:
            # Máximo 10 etiquetas permitidas
            if len(v) > 10:
                raise ValueError('Maximum 10 tags allowed')
            # Cada etiqueta máximo 50 caracteres
            for tag in v:
                if len(tag) > 50:
                    raise ValueError('Tag length cannot exceed 50 characters')
        return v

# Esquema de respuesta para devolver datos de una nota
class NoteOut(BaseModel):
    """Esquema de salida que define cómo se devuelven los datos de una nota"""
    id: str                    # ID único de la nota
    title: str                 # Título de la nota
    content: str               # Contenido de la nota
    tags: List[str]            # Lista de etiquetas
    archived: bool             # Estado de archivado
    created_at: datetime       # Fecha de creación
    updated_at: datetime       # Fecha de última actualización

    class Config:
        # Permitir crear el esquema desde atributos de modelo SQLAlchemy
        from_attributes = True

# Esquema para respuestas de error estandarizadas
class ErrorResponse(BaseModel):
    """Esquema estándar para respuestas de error de la API"""
    detail: str                                           # Mensaje de error detallado
    error_code: Optional[str] = None                      # Código de error opcional
    timestamp: datetime = Field(default_factory=datetime.utcnow)  # Timestamp del error