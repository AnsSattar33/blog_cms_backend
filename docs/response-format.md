# Response Format

## Purpose

Defines the standardized JSON response structure for all API endpoints.

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "limit": 10
  }
}
```

`pagination` is included only on paginated list endpoints.

## Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["email: Invalid email address"]
}
```

## Frontend Integration Note

The Next.js frontend currently expects `{ data, message }`. When integrating, read the backend wrapper:

```typescript
const { success, message, data, pagination } = response.data;
```

Blog responses include frontend-friendly aliases: `shortDescription`, `thumbnail`, `status`, `readingTimeMinutes`.

## Components Involved

- `utils/api-response.ts`
- `utils/blog-mapper.util.ts`
- `types/index.ts`

## Best Practices

- Always use `sendSuccess` / `sendPaginated` / `sendFailure` helpers
- Never return inconsistent JSON structures
- Include meaningful messages for user feedback

## Future Scalability

- HATEOAS links in responses
- API versioning headers
- GraphQL layer as alternative interface
