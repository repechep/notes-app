# Architecture Documentation

## System Overview

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    SQLAlchemy    ┌─────────────────┐
│   React Frontend│ ──────────────► │  FastAPI Backend│ ──────────────► │   SQLite DB     │
│   (Port 3000)   │                 │   (Port 8000)   │                 │                 │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
         │                                   │
         │          External APIs            │
         └─────────────────────────────────► │
           (JSONPlaceholder)                 │
```

## Backend Architecture (FastAPI)

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (FastAPI)                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Routes    │ │ Middleware  │ │   Exception         │   │
│  │             │ │             │ │   Handlers          │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   Business Layer                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  Services   │ │  Schemas    │ │    Validation       │   │
│  │             │ │ (Pydantic)  │ │                     │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Models    │ │  Database   │ │    SQLAlchemy       │   │
│  │ (SQLAlchemy)│ │   Config    │ │    Session          │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Components

- **API Layer**: FastAPI routes, middleware, exception handling
- **Business Layer**: Services, validation, business logic
- **Data Layer**: SQLAlchemy models, database operations

## Frontend Architecture (React)

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── NoteModal.jsx   # Create/Edit modal
│   ├── LoadingSpinner.jsx
│   └── ErrorMessage.jsx
├── pages/              # Page components
│   └── External.jsx    # External API integration
├── services/           # API communication
│   └── api.jsx        # HTTP client & API calls
└── App.jsx            # Main application component
```

## API Contracts

### OpenAPI Specification
- **Endpoint**: `/openapi.json`
- **Documentation**: `/docs` (Swagger UI), `/redoc`

### Core Endpoints
```
POST   /api/v1/notes/           # Create note
GET    /api/v1/notes/           # List notes (paginated, searchable)
GET    /api/v1/notes/{id}       # Get note by ID
PUT    /api/v1/notes/{id}       # Update note
DELETE /api/v1/notes/{id}       # Delete note
```

### Data Schema (JSON)
```json
{
  "id": "uuid-string",
  "title": "string (1-120 chars)",
  "content": "string (1-10000 chars)",
  "tags": ["string"],
  "archived": "boolean",
  "created_at": "ISO-8601 datetime",
  "updated_at": "ISO-8601 datetime"
}
```

## Data Flow

### Create Note Flow
1. User fills form in NoteModal
2. Frontend validates input
3. POST request to `/api/v1/notes/`
4. Backend validates with Pydantic schemas
5. NoteService creates Note model
6. SQLAlchemy persists to SQLite
7. Response with created note data
8. Frontend updates UI state

### Search Flow
1. User types in search input
2. Debounced API call to `/api/v1/notes/?search=query`
3. Backend filters by title/content using SQL LIKE
4. Paginated results returned
5. Frontend renders filtered notes

## External Integrations

### JSONPlaceholder API
- **Purpose**: Demonstrate external API consumption
- **Endpoint**: `https://jsonplaceholder.typicode.com/posts`
- **Features**: Sorting, filtering
- **Error Handling**: Graceful fallback on failure

## Security Considerations

### CORS Configuration
- **Development**: `localhost:3000` allowed
- **Production**: Specific domain whitelist required
- **Credentials**: Enabled for future auth support

### Input Validation
- **Backend**: Pydantic schemas with length limits
- **Frontend**: HTML5 validation + custom checks
- **SQL Injection**: Prevented by SQLAlchemy ORM

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Trade-offs & Decisions

### Database Choice: SQLite
- **Pros**: Zero configuration, file-based, good for development
- **Cons**: Limited concurrency, not suitable for high-load production
- **Alternative**: PostgreSQL for production deployment

### State Management: React useState
- **Pros**: Simple, built-in, sufficient for app size
- **Cons**: No persistence, limited sharing between components
- **Alternative**: Redux/Zustand for complex state needs

### Styling: Inline Styles
- **Pros**: Component-scoped, no build step, fast development
- **Cons**: No CSS features (variables, mixins), larger bundle
- **Alternative**: Styled-components or CSS modules

### Authentication: Not Implemented
- **Current**: No authentication required
- **Future**: JWT tokens with FastAPI security utilities
- **Impact**: All data is public, no user isolation