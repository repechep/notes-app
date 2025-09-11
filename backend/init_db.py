# Importaciones para inicialización de base de datos
from app.database import Base, engine
from app.models import Note

def init_database():
    """Initialize the database with all tables"""
    # Eliminar todas las tablas existentes (cuidado en producción)
    Base.metadata.drop_all(bind=engine)
    # Crear todas las tablas definidas en los modelos
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")

# Ejecutar inicialización si se ejecuta directamente
if __name__ == "__main__":
    init_database()