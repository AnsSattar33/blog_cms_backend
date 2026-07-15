# JWT

## Purpose

Documents JSON Web Token generation, verification, and cookie storage strategy.

## Responsibilities

- Sign tokens with user id, email, and role
- Verify tokens on protected routes
- Store tokens in signed HttpOnly cookies

## Payload Shape

```typescript
{ id: string; email: string; role: "admin" | "user" }
```

## Cookie Configuration

- Name: `blog-cms-session` (configurable via `COOKIE_NAME`)
- HttpOnly: true
- Signed: true (via `cookie-parser` + `COOKIE_SECRET`)
- Secure: true in production
- SameSite: `lax` (dev) / `none` (prod with HTTPS)

## Components Involved

- `utils/jwt.util.ts`
- `constants/cookie.ts`
- `middleware/auth.middleware.ts`

## Best Practices

- Use strong `JWT_SECRET` (min 16 chars, random in production)
- Set reasonable expiry (`JWT_EXPIRES_IN=7d`)
- Support Bearer token fallback for API clients

## Future Scalability

- Refresh tokens with rotation
- Token blacklist on logout
- Short-lived access + long-lived refresh pattern
