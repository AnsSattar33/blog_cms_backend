# Controllers

## Purpose

HTTP request handlers that delegate to services and format responses.

## Responsibilities

- Receive validated request data
- Call appropriate service methods
- Return standardized success/error responses via helpers
- Set/clear cookies for auth endpoints

## Components Involved

| Controller | File | Endpoints |
|------------|------|-----------|
| Auth | `auth.controller.ts` | register, login, logout, getMe |
| Blog | `blog.controller.ts` | CRUD + latest, featured, related, stats |
| Health | `health.controller.ts` | health check |

## Request Flow

Route → Validation → Middleware → Controller → Service → Response

## Best Practices

- Wrap all handlers with `asyncHandler`
- No database queries in controllers
- No business logic — only orchestration

## Future Scalability

- Split into sub-controllers per feature area
- Add request/response DTO classes for OpenAPI generation
