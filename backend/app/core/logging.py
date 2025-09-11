# Importaciones para configuración de logging personalizado
import logging
import sys
from datetime import datetime
from typing import Any, Dict

# Formateador personalizado para logs estructurados
class CustomFormatter(logging.Formatter):
    """Custom formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        # Crear entrada de log estructurada con metadatos
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),  # Timestamp UTC
            "level": record.levelname,                   # Nivel de log (INFO, ERROR, etc.)
            "logger": record.name,                       # Nombre del logger
            "message": record.getMessage(),              # Mensaje del log
            "module": record.module,                     # Módulo donde se generó
            "function": record.funcName,                 # Función donde se generó
            "line": record.lineno                        # Línea de código
        }
        
        # Agregar campos adicionales si están presentes
        if hasattr(record, 'user_id'):
            log_entry['user_id'] = record.user_id
        if hasattr(record, 'request_id'):
            log_entry['request_id'] = record.request_id
        if hasattr(record, 'endpoint'):
            log_entry['endpoint'] = record.endpoint
            
        # Formatear como string legible para desarrollo
        formatted = f"[{log_entry['timestamp']}] {log_entry['level']} - {log_entry['message']}"
        if 'endpoint' in log_entry:
            formatted += f" | {log_entry['endpoint']}"
            
        return formatted

# Función para configurar el sistema de logging de la aplicación
def setup_logging():
    """Setup application logging configuration"""
    
    # Crear logger principal de la aplicación
    logger = logging.getLogger("notes_api")
    logger.setLevel(logging.INFO)
    
    # Remover handlers existentes para evitar duplicados
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
    
    # Configurar handler para consola con formateador personalizado
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(CustomFormatter())
    
    # Agregar handler al logger
    logger.addHandler(console_handler)
    
    # Configurar loggers de terceros para reducir ruido
    logging.getLogger("uvicorn").setLevel(logging.WARNING)     # Servidor web
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)  # ORM
    
    return logger

# Instancia global del logger para usar en toda la aplicación
logger = setup_logging()