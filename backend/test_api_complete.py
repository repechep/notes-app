import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from main import app

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_complete.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

class TestNotesAPI:
    
    def test_create_note_success(self):
        response = client.post(
            "/api/v1/notes/",
            json={
                "title": "Test Note",
                "content": "Test content",
                "tags": ["test", "api"],
                "archived": False
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Note"
        assert data["content"] == "Test content"
        assert data["tags"] == ["test", "api"]
        assert data["archived"] == False
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data

    def test_create_note_validation_errors(self):
        # Title too long
        response = client.post(
            "/api/v1/notes/",
            json={"title": "x" * 121, "content": "Test content"}
        )
        assert response.status_code == 422
        
        # Content too long
        response = client.post(
            "/api/v1/notes/",
            json={"title": "Test", "content": "x" * 10001}
        )
        assert response.status_code == 422
        
        # Too many tags
        response = client.post(
            "/api/v1/notes/",
            json={"title": "Test", "content": "Test", "tags": ["tag"] * 11}
        )
        assert response.status_code == 422

    def test_get_notes_pagination(self):
        # Create multiple notes
        for i in range(15):
            client.post(
                "/api/v1/notes/",
                json={"title": f"Note {i}", "content": f"Content {i}"}
            )
        
        # Test pagination
        response = client.get("/api/v1/notes/?page=1&per_page=10")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 10

    def test_search_functionality(self):
        # Create searchable note
        client.post(
            "/api/v1/notes/",
            json={"title": "Searchable Title", "content": "Unique content here"}
        )
        
        # Search by title
        response = client.get("/api/v1/notes/?search=Searchable")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert any("Searchable" in note["title"] for note in data)

    def test_archive_filter(self):
        # Create archived and non-archived notes
        client.post("/api/v1/notes/", json={"title": "Active", "content": "Active note", "archived": False})
        client.post("/api/v1/notes/", json={"title": "Archived", "content": "Archived note", "archived": True})
        
        # Filter by archived status
        response = client.get("/api/v1/notes/?archived=false")
        assert response.status_code == 200
        data = response.json()
        assert all(not note["archived"] for note in data)

    def test_update_note(self):
        # Create note
        create_response = client.post(
            "/api/v1/notes/",
            json={"title": "Original", "content": "Original content"}
        )
        note_id = create_response.json()["id"]
        
        # Update note
        response = client.put(
            f"/api/v1/notes/{note_id}",
            json={"title": "Updated", "archived": True}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated"
        assert data["archived"] == True

    def test_delete_note(self):
        # Create note
        create_response = client.post(
            "/api/v1/notes/",
            json={"title": "To Delete", "content": "Will be deleted"}
        )
        note_id = create_response.json()["id"]
        
        # Delete note
        response = client.delete(f"/api/v1/notes/{note_id}")
        assert response.status_code == 204
        
        # Verify deletion
        get_response = client.get(f"/api/v1/notes/{note_id}")
        assert get_response.status_code == 404

    def test_error_responses_format(self):
        # Test 404 error format
        response = client.get("/api/v1/notes/nonexistent-id")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert "error_code" in data
        assert "timestamp" in data

    def test_openapi_docs_accessible(self):
        response = client.get("/docs")
        assert response.status_code == 200
        
        response = client.get("/openapi.json")
        assert response.status_code == 200
        openapi_data = response.json()
        assert "openapi" in openapi_data
        assert "paths" in openapi_data