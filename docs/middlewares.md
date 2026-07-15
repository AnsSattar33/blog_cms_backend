# Middlewares

## Purpose

Express middleware for cross-cutting concerns across all routes.

## Components

| Middleware | File | Purpose |
|------------|------|---------|
| Auth | `auth.middleware.ts` | Require valid JWT |
| Optional Auth | `optional-auth.middleware.ts` | Attach user if token present |
| Admin | `admin.middleware.ts` | Require admin role |
| Upload | `upload.middleware.ts` | Multer memory storage |
| Validate | `validate.middleware.ts` | Zod schema validation |
| Not Found | `not-found.middleware.ts` | 404 handler |
| Error | `error.middleware.ts` | Global error handler |

## Request Flow

Incoming request passes through: Morgan → Helmet → CORS → Body parsers → Sanitize → Rate limit → Route middleware → Controller → Error handler

## Best Practices

- Order matters: validation before controller, error handler last
- Use signed cookies for JWT storage
- Rate limit auth and write endpoints

## Future Scalability

- Request ID middleware for tracing
- Audit log middleware for admin actions
