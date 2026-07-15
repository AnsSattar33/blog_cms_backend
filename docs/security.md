# Security

## Purpose

Documents security measures implemented in the backend.

## Measures

| Measure | Implementation |
|---------|----------------|
| Helmet | HTTP security headers |
| CORS | Restricted to `CLIENT_URL` with credentials |
| Rate limiting | Auth (20/15min) and write routes (50/15min) |
| Input sanitization | `express-mongo-sanitize` prevents NoSQL injection |
| Password hashing | bcrypt with cost factor 12 |
| JWT | Signed tokens in HttpOnly cookies |
| Cookie signing | `cookie-parser` with `COOKIE_SECRET` |
| File validation | MIME type and size limits on uploads |
| Env validation | Zod schema validates all env vars at startup |
| Error masking | Stack traces hidden in production |

## Best Practices

- Use strong secrets in production (32+ random chars)
- Enable HTTPS in production (required for secure cookies)
- Keep dependencies updated
- Never log passwords or tokens

## Future Scalability

- CSRF protection for cookie-based auth
- IP allowlisting for admin routes
- WAF integration
- Security audit logging
