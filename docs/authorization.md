# Authorization

## Purpose

Enforces role-based access control (RBAC) for protected endpoints.

## Responsibilities

- Restrict blog create/update/delete to `admin` role
- Allow public read access to published blogs
- Protect dashboard stats endpoint

## Roles

| Role | Permissions |
|------|-------------|
| `user` | Register, login, read published blogs |
| `admin` | All user permissions + blog CRUD + dashboard stats |

## Request Flow

1. `authMiddleware` verifies JWT and attaches `req.user`
2. `adminMiddleware` checks `req.user.role === "admin"`
3. Request proceeds or returns 403 Forbidden

## Components Involved

- `middleware/auth.middleware.ts`
- `middleware/admin.middleware.ts`
- `middleware/optional-auth.middleware.ts` (for blog list with admin context)
- `constants/roles.ts`

## Best Practices

- Always chain `authMiddleware` before `adminMiddleware`
- Use optional auth when public routes need elevated context
- Never trust client-sent role values

## Future Scalability

- Granular permissions (editor, moderator)
- Resource-level ownership checks
- Policy-based authorization (CASL, etc.)
