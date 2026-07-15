# Validators

## Purpose

Request validation using Zod schemas for type-safe input checking.

## Schemas

| File | Validates |
|------|-----------|
| `auth.validator.ts` | Register and login bodies |
| `blog.validator.ts` | Create and update blog bodies |
| `common.validator.ts` | Pagination query, UUID params, slug params |

## ID Format

Blog and user IDs are **UUIDs** (not MongoDB ObjectIds). Param validation uses:

```typescript
z.string().uuid("Invalid ID format")
```

## Best Practices

- Export inferred TypeScript types from schemas
- Validate params separately from body
