# Repositories

## Purpose

Data access layer abstracting all PostgreSQL operations via Drizzle ORM.

## Responsibilities

- Execute Drizzle queries against Neon PostgreSQL
- Join users for blog author data
- Return typed records — no business logic

## Components Involved

| Repository | File | Methods |
|------------|------|---------|
| User | `user.repository.ts` | findByEmail, findById, create, updateById |
| Blog | `blog.repository.ts` | findAll, findBySlug, create, updateById, deleteById, stats helpers |

## Best Practices

- Accept plain filter objects, not HTTP query params
- Always join author on blog queries
- Use PostgreSQL indexes defined in schema for performance

## Future Scalability

- Add aggregation queries for analytics dashboards
- Soft delete with `deleted_at` column
