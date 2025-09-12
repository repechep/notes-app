from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.sessions import SessionMiddleware
import secrets

def setup_security_middleware(app: FastAPI) -> None:
    """Setup security-related middleware"""
    
    # Add GZip compression
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # Add session middleware with secure secret
    # In production, this should come from environment variables
    secret_key = secrets.token_urlsafe(32)
    app.add_middleware(
        SessionMiddleware, 
        secret_key=secret_key,
        max_age=3600,  # 1 hour
        same_site="lax",
        https_only=False  # Set to True in production with HTTPS
    )

def add_security_headers(app: FastAPI) -> None:
    """Add security headers to responses"""
    
    @app.middleware("http")
    async def security_headers(request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Remove server header for security
        if "server" in response.headers:
            del response.headers["server"]
        
        return response