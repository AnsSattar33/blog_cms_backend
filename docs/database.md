# Database

## Purpose

Documents Neon PostgreSQL setup, Drizzle schema, and data access patterns.

## Responsibilities

- Define User and Blog tables with UUID primary keys
- Enforce data integrity via PostgreSQL constraints and Drizzle schema
- Optimize queries with indexes

## Schema

Defined in [`src/db/schema.ts`](../src/db/schema.ts):

### users
- `id` (UUID, PK), `name`, `email` (unique), `password`, `role` (enum), `avatar`, timestamps

### blogs
- `id` (UUID, PK), `title`, `slug` (unique), `excerpt`, `content`
- `cover_image_url`, `cover_image_public_id`
- `category`, `tags` (text array), `author_id` (FK → users)
- `is_published`, `is_featured`, `reading_time`, `published_at`, timestamps

## Migrations

- SQL migrations live in [`drizzle/`](../drizzle/)
- Initial migration: `drizzle/0000_initial.sql`
- Apply with `npm run db:push` or `npm run db:migrate`

## Components Involved

- `src/db/schema.ts` — Drizzle table definitions
- `src/db/index.ts` — Neon client + Drizzle instance
- `src/config/database.ts` — Connection helpers
- `drizzle.config.ts` — Drizzle Kit configuration

## Best Practices

- Use `DATABASE_URL` from environment (Neon connection string)
- Run migrations before seeding or starting the server
- Password hashing happens in the repository layer, not the database

## Future Scalability

- Neon branching for preview environments
- Read replicas for analytics queries
- Full-text search with PostgreSQL `tsvector` or external search engine
