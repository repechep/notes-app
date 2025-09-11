# Importaciones para poblar la base de datos con datos de ejemplo
from app.database import SessionLocal
from app.services.note_service import NoteService
from app.schemas import NoteCreate

# Función para poblar la base de datos con notas de ejemplo
def seed_database():
    """Seed the database with example notes"""
    # Crear sesión de base de datos y servicio
    db = SessionLocal()
    service = NoteService(db)
    
    # Definir notas de ejemplo con diferentes categorías y estados
    sample_notes = [
        {
            "title": "Welcome to Notes App",
            "content": "This is your first note! You can create, edit, and delete notes using this application. Try searching for notes or using the pagination controls.",
            "tags": ["welcome", "tutorial"],
            "archived": False
        },
        {
            "title": "Meeting Notes - Project Kickoff",
            "content": "Discussed project timeline, assigned team roles, and set up initial milestones. Next meeting scheduled for Friday at 2 PM.",
            "tags": ["meeting", "project", "work"],
            "archived": False
        },
        {
            "title": "Shopping List",
            "content": "Groceries needed: milk, bread, eggs, apples, chicken breast, rice, vegetables for the week.",
            "tags": ["shopping", "groceries", "personal"],
            "archived": False
        },
        {
            "title": "Book Recommendations",
            "content": "1. The Clean Coder by Robert Martin\n2. Design Patterns by Gang of Four\n3. Refactoring by Martin Fowler",
            "tags": ["books", "programming", "learning"],
            "archived": False
        },
        {
            "title": "Workout Plan",
            "content": "Monday: Chest and Triceps\nTuesday: Back and Biceps\nWednesday: Legs\nThursday: Shoulders\nFriday: Cardio",
            "tags": ["fitness", "health", "personal"],
            "archived": False
        },
        {
            "title": "Old Project Ideas",
            "content": "Some old project ideas that might be worth revisiting in the future. Archived for reference.",
            "tags": ["projects", "ideas", "archive"],
            "archived": True  # Nota archivada para probar filtros
        }
    ]
    
    try:
        # Crear cada nota de ejemplo usando el servicio
        for note_data in sample_notes:
            note = NoteCreate(**note_data)  # Crear esquema de validación
            service.create_note(note)       # Guardar en base de datos
        
        print(f"Successfully seeded database with {len(sample_notes)} notes!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()  # Cerrar sesión de base de datos

# Ejecutar seed si se ejecuta directamente
if __name__ == "__main__":
    seed_database()