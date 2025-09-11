# Importaciones para manejo de excepciones y respuestas HTTP
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError as PydanticValidationError
from datetime import datetime
import logging

# Configurar logger para registrar errores
logger = logging.getLogger(__name__)

# Excepción personalizada para recursos no encontrados (404)
class NotFoundError(HTTPException):
    """Excepción para cuando no se encuentra un recurso solicitado"""
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=404, detail=detail)

# Excepción personalizada para errores de validación (422)
class ValidationError(HTTPException):
    """Excepción para errores de validación de datos"""
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=422, detail=detail)

# Manejador para errores de recurso no encontrado (404)
async def not_found_handler(request: Request, exc: NotFoundError):
    """Manejar errores 404 y devolver respuesta JSON estandarizada"""
    return JSONResponse(
        status_code=404,
        content={
            "detail": exc.detail,
            "error_code": "NOT_FOUND",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Manejador para errores de validación personalizados (422)
async def validation_error_handler(request: Request, exc: ValidationError):
    """Manejar errores de validación personalizados y devolver respuesta JSON"""
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.detail,
            "error_code": "VALIDATION_ERROR",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Manejador para errores de validación de Pydantic (422)
async def pydantic_validation_error_handler(request: Request, exc: PydanticValidationError):
    """Manejar errores de validación de Pydantic con detalles específicos"""
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation failed",
            "error_code": "VALIDATION_ERROR",
            "errors": exc.errors(),  # Incluir detalles específicos de validación
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Manejador para errores de base de datos (500)
async def database_error_handler(request: Request, exc: SQLAlchemyError):
    """Manejar errores de base de datos y registrar en logs"""
    logger.error(f"Database error: {exc}")  # Registrar error para debugging
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error_code": "DATABASE_ERROR",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Manejador general para excepciones no controladas (500)
async def general_exception_handler(request: Request, exc: Exception):
    """Manejar excepciones generales no controladas"""
    logger.error(f"Unexpected error: {exc}")  # Registrar error inesperado
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error_code": "INTERNAL_ERROR",
            "timestamp": datetime.utcnow().isoformat()
        }
    )