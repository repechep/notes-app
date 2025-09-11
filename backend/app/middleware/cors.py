# Importaciones para configuración de middleware CORS
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.core.config import settings
from app.core.logging import logger

# Función para configurar CORS con consideraciones de seguridad
def setup_cors(app: FastAPI) -> None:
    """Configure CORS middleware with security considerations
    
    CORS Decision: Allow specific origins for development/production
    - Development: localhost:3000 (React dev server)
    - Production: Should be configured with actual domain
    - Credentials: Enabled for potential future auth implementation
    - Methods: Limited to necessary HTTP methods
    - Headers: Allow common headers but not wildcard in production
    """
    
    # Registrar configuración de CORS en logs
    logger.info(f"Configuring CORS for origins: {settings.backend_cors_origins}")
    
    # Agregar middleware CORS con configuración específica
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.backend_cors_origins,  # Orígenes permitidos desde config
        allow_credentials=True,                       # Permitir cookies/credenciales
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Métodos HTTP permitidos
        allow_headers=[                               # Headers permitidos
            "Accept",
            "Accept-Language", 
            "Content-Language",
            "Content-Type",
            "Authorization"
        ],
        expose_headers=["X-Total-Count"],            # Headers expuestos al cliente
        max_age=600  # Cache preflight requests for 10 minutes
    )
    
    # Agregar middleware de hosts confiables para seguridad adicional en producción
    if not settings.debug:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["localhost", "127.0.0.1", "*.yourdomain.com"]
        )