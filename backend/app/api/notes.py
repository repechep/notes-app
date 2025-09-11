# Importaciones necesarias para la API de notas
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.database import get_db
from app.services.note_service import NoteService

# Crear router para agrupar todas las rutas de notas
router = APIRouter()

# Endpoint para crear una nueva nota
@router.post("/", response_model=schemas.NoteOut, status_code=201,
            summary="Create a new note",
            description="Create a new note with title, content, tags and archive status",
            responses={
                201: {"description": "Note created successfully"},
                422: {"description": "Validation error", "model": schemas.ErrorResponse}
            })
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    """Crear una nueva nota en la base de datos"""
    # Crear instancia del servicio con la sesión de base de datos
    service = NoteService(db)
    # Llamar al servicio para crear la nota y retornar el resultado
    return service.create_note(note)

# Endpoint para listar notas con paginación y búsqueda
@router.get("/", response_model=List[schemas.NoteOut],
           summary="List notes with pagination and search",
           description="Get a paginated list of notes with optional search functionality",
           responses={
               200: {"description": "List of notes"},
               422: {"description": "Invalid query parameters", "model": schemas.ErrorResponse}
           })
def list_notes(
    page: int = Query(1, ge=1, description="Page number (minimum 1)"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page (1-100)"),
    search: str = Query("", description="Search in title and content"),
    archived: bool = Query(None, description="Filter by archive status"),
    db: Session = Depends(get_db)
):
    """Obtener lista de notas con paginación, búsqueda y filtros"""
    # Calcular cuántos registros saltar para la paginación
    skip = (page - 1) * per_page
    # Crear servicio y obtener notas con los parámetros especificados
    service = NoteService(db)
    return service.get_notes(skip=skip, limit=per_page, search=search, archived=archived)

# Endpoint para obtener una nota específica por su ID
@router.get("/{note_id}", response_model=schemas.NoteOut,
           summary="Get note by ID",
           description="Retrieve a specific note by its UUID",
           responses={
               200: {"description": "Note found"},
               404: {"description": "Note not found", "model": schemas.ErrorResponse}
           })
def get_note(note_id: str, db: Session = Depends(get_db)):
    """Obtener una nota por su ID único"""
    service = NoteService(db)
    return service.get_note_by_id(note_id)

# Endpoint para actualizar una nota existente
@router.put("/{note_id}", response_model=schemas.NoteOut,
           summary="Update note",
           description="Update an existing note by its UUID",
           responses={
               200: {"description": "Note updated successfully"},
               404: {"description": "Note not found", "model": schemas.ErrorResponse},
               422: {"description": "Validation error", "model": schemas.ErrorResponse}
           })
def update_note(note_id: str, note: schemas.NoteUpdate, db: Session = Depends(get_db)):
    """Actualizar una nota existente con nuevos datos"""
    service = NoteService(db)
    return service.update_note(note_id, note)

# Endpoint para eliminar una nota
@router.delete("/{note_id}", status_code=204,
              summary="Delete note",
              description="Delete a note by its UUID",
              responses={
                  204: {"description": "Note deleted successfully"},
                  404: {"description": "Note not found", "model": schemas.ErrorResponse}
              })
def delete_note(note_id: str, db: Session = Depends(get_db)):
    """Eliminar una nota de la base de datos"""
    service = NoteService(db)
    service.delete_note(note_id)
    return None  # Retorna None para status 204 (No Content)