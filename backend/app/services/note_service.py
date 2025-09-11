# Importaciones necesarias para el servicio de notas
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models import Note
from app.schemas import NoteCreate, NoteUpdate, NoteOut
from app.exceptions.handlers import NotFoundError

# Servicio que contiene la lógica de negocio para las notas
class NoteService:
    """Servicio que maneja todas las operaciones CRUD de notas"""
    
    def __init__(self, db: Session):
        """Inicializar el servicio con una sesión de base de datos"""
        self.db = db  # Sesión de SQLAlchemy para operaciones de BD
    
    def create_note(self, note_data: NoteCreate) -> NoteOut:
        """Crear una nueva nota en la base de datos"""
        # Crear instancia del modelo Note con los datos proporcionados
        db_note = Note(
            title=note_data.title,
            content=note_data.content,
            # Convertir lista de tags a string separado por comas
            tags=",".join(note_data.tags) if note_data.tags else "",
            archived=note_data.archived or False  # Por defecto False si no se especifica
        )
        # Agregar la nota a la sesión y confirmar cambios
        self.db.add(db_note)
        self.db.commit()
        self.db.refresh(db_note)  # Actualizar el objeto con datos de la BD (ID, timestamps)
        return self._to_note_out(db_note)  # Convertir a esquema de salida
    
    def get_notes(self, skip: int = 0, limit: int = 10, search: str = "", archived: Optional[bool] = None) -> List[NoteOut]:
        """Obtener lista de notas con paginación, búsqueda y filtros"""
        # Crear query base para obtener notas
        query = self.db.query(Note)
        
        # Aplicar filtro de búsqueda si se proporciona
        if search:
            # Buscar en título O contenido (operador |)
            query = query.filter(Note.title.contains(search) | Note.content.contains(search))
        
        # Aplicar filtro por estado de archivado si se especifica
        if archived is not None:
            query = query.filter(Note.archived == archived)
        
        # Aplicar paginación y ejecutar query
        notes = query.offset(skip).limit(limit).all()
        
        # Convertir cada nota del modelo a esquema de salida
        return [self._to_note_out(note) for note in notes]
    
    def get_note_by_id(self, note_id: str) -> NoteOut:
        """Obtener una nota específica por su ID único"""
        # Buscar nota por ID en la base de datos
        note = self.db.query(Note).filter(Note.id == note_id).first()
        if not note:
            # Lanzar excepción si no se encuentra la nota
            raise NotFoundError("Note not found")
        return self._to_note_out(note)
    
    def update_note(self, note_id: str, note_data: NoteUpdate) -> NoteOut:
        """Actualizar una nota existente con nuevos datos"""
        # Buscar la nota a actualizar
        db_note = self.db.query(Note).filter(Note.id == note_id).first()
        if not db_note:
            raise NotFoundError("Note not found")
        
        # Obtener solo los campos que se van a actualizar (exclude_unset=True)
        update_data = note_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            # Convertir tags de lista a string si es necesario
            if key == "tags":
                value = ",".join(value) if value else ""
            # Actualizar el atributo en el modelo
            setattr(db_note, key, value)
        
        # Actualizar timestamp de modificación
        db_note.updated_at = datetime.utcnow()
        self.db.commit()  # Confirmar cambios
        self.db.refresh(db_note)  # Refrescar objeto con datos actualizados
        return self._to_note_out(db_note)
    
    def delete_note(self, note_id: str) -> dict:
        """Eliminar una nota de la base de datos"""
        # Buscar la nota a eliminar
        db_note = self.db.query(Note).filter(Note.id == note_id).first()
        if not db_note:
            raise NotFoundError("Note not found")
        # Eliminar nota de la base de datos
        self.db.delete(db_note)
        self.db.commit()  # Confirmar eliminación
        return {"message": "Note deleted successfully"}
    
    def _to_note_out(self, note: Note) -> NoteOut:
        """Convertir modelo de Note a esquema de salida NoteOut"""
        return NoteOut(
            id=note.id,
            title=note.title,
            content=note.content,
            # Convertir string de tags separado por comas a lista
            tags=note.tags.split(",") if note.tags else [],
            archived=note.archived,
            created_at=note.created_at,
            updated_at=note.updated_at
        )