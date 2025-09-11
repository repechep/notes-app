# Importaciones para configuración de la aplicación
import os
from typing import List

# Clase que contiene toda la configuración de la aplicación
class Settings:
    """Configuración centralizada de la aplicación"""
    
    # Nombre del proyecto (usado en documentación OpenAPI)
    project_name: str = "Notes API"
    
    # Modo debug (True para desarrollo, False para producción)
    debug: bool = True
    
    # Prefijo para todas las rutas de la API
    api_v1_str: str = "/api/v1"
    
    # URL de conexión a la base de datos SQLite
    database_url: str = "sqlite:///./notes.db"
    
    # Orígenes permitidos para CORS (frontend URLs)
    backend_cors_origins: List[str] = ["http://localhost:3000"]  # React dev server

# Instancia global de configuración
settings = Settings()