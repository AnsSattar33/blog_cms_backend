# Blog CMS Backend Documentation

Documentation for the Blog CMS REST API backend.

## Quick Start

```bash
cd backend
npm install
npm run db:push    # apply schema to Neon PostgreSQL
npm run seed
npm run dev
```

API base URL: `http://localhost:3001/api`

## Documentation Index

| Document | Description |
|----------|-------------|
| [architecture.md](./architecture.md) | System design and layers |
| [folder-structure.md](./folder-structure.md) | Project layout |
| [authentication.md](./authentication.md) | Register, login, logout |
| [authorization.md](./authorization.md) | Role-based access control |
| [jwt.md](./jwt.md) | JWT and cookie strategy |
| [cloudinary.md](./cloudinary.md) | Image upload service |
| [multer.md](./multer.md) | File upload middleware |
| [blog-module.md](./blog-module.md) | Blog domain overview |
| [routes.md](./routes.md) | API endpoint reference |
| [controllers.md](./controllers.md) | Controller layer |
| [services.md](./services.md) | Business logic layer |
| [repositories.md](./repositories.md) | Data access layer |
| [middlewares.md](./middlewares.md) | Express middleware |
| [validators.md](./validators.md) | Zod validation schemas |
| [database.md](./database.md) | Drizzle schema and Neon PostgreSQL |
| [error-handling.md](./error-handling.md) | Error classes and handler |
| [response-format.md](./response-format.md) | Standard API responses |
| [security.md](./security.md) | Security measures |
| [deployment.md](./deployment.md) | Production deployment |
| [future-improvements.md](./future-improvements.md) | Roadmap |

## Demo Admin (after seed)

- Email: `admin@blog.com`
- Password: `password123`
