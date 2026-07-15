# Error Handling

## Purpose

Centralized error handling with meaningful API error responses.

## Error Types Handled

| Type | HTTP Status | Source |
|------|-------------|--------|
| ApiError | Custom | Services/controllers |
| ZodError | 422 | Validation middleware |
| PostgreSQL 23505 | 409 | Unique constraint violation |
| JsonWebTokenError | 401 | JWT verification |
| TokenExpiredError | 401 | Expired JWT |
| MulterError | 400 | File upload |
| Unknown | 500 | Unhandled exceptions |

## Best Practices

- Throw `ApiError` for expected failures
- PostgreSQL duplicate key errors (code `23505`) return 409 Conflict
- Never expose internal details in production responses
