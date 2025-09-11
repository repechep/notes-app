# API Validations Documentation

## Note Model Validations

### Field Constraints

| Field | Type | Min Length | Max Length | Required | Description |
|-------|------|------------|------------|----------|-------------|
| `id` | UUID | - | - | Auto-generated | UUID v4 format |
| `title` | String | 1 | 120 | Yes | Note title |
| `content` | String | 1 | 10,000 | Yes | Note content |
| `tags` | Array[String] | - | 10 items | No | Max 10 tags, each max 50 chars |
| `archived` | Boolean | - | - | No | Archive status (default: false) |
| `created_at` | DateTime | - | - | Auto-generated | ISO-8601 format |
| `updated_at` | DateTime | - | - | Auto-generated | ISO-8601 format |

### Query Parameters

| Parameter | Type | Min | Max | Default | Description |
|-----------|------|-----|-----|---------|-------------|
| `page` | Integer | 1 | - | 1 | Page number for pagination |
| `per_page` | Integer | 1 | 100 | 10 | Items per page |
| `search` | String | - | - | "" | Search in title and content |
| `archived` | Boolean | - | - | null | Filter by archive status |

## Error Response Format

All error responses follow this consistent format:

```json
{
  "detail": "Error description",
  "error_code": "ERROR_TYPE",
  "timestamp": "2024-01-01T12:00:00.000000"
}
```

### Error Codes

- `NOT_FOUND` - Resource not found (404)
- `VALIDATION_ERROR` - Input validation failed (422)
- `DATABASE_ERROR` - Database operation failed (500)
- `INTERNAL_ERROR` - Unexpected server error (500)

## HTTP Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## OpenAPI Documentation

The API documentation is automatically generated and available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`