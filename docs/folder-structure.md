# Folder Structure

## Purpose

Documents the modular folder layout of the backend application.

## Structure

```
backend/
├── src/
│   ├── db/               # Drizzle schema + Neon client
│   ├── config/           # Env, database, Cloudinary
│   ├── constants/        # Roles, messages, HTTP status
│   ├── controllers/      # HTTP handlers
│   ├── services/         # Business logic
│   ├── repositories/     # PostgreSQL access (Drizzle)
│   ├── routes/           # Express routers
│   ├── middleware/       # Auth, upload, errors
│   ├── validators/       # Zod schemas
│   ├── types/            # Shared TypeScript types
│   ├── interfaces/       # Domain interfaces
│   ├── utils/            # Helpers
│   ├── lib/              # Seed script
│   ├── app.ts            # Express app setup
│   └── server.ts         # Entry point
├── drizzle/              # SQL migrations
├── docs/                 # Documentation
├── drizzle.config.ts     # Drizzle Kit config
├── .env                  # Local environment (gitignored)
└── .env.example          # Template
```

## Best Practices

- Schema lives in `src/db/schema.ts` (single source of truth)
- Repositories use Drizzle query builder — no raw SQL in services
- IDs are UUIDs throughout the API

## Future Scalability

- Add `src/modules/` for colocated feature modules as complexity grows
