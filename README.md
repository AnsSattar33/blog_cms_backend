# Blog CMS Backend

Production-ready REST API for the Blog CMS, built with Express, TypeScript, and Neon PostgreSQL.

## Features

- JWT authentication with HttpOnly cookies
- Role-based authorization (admin/user)
- Blog CRUD with Cloudinary image uploads
- Public APIs: pagination, search, category/tag filters
- Featured, latest, and related blog endpoints
- Dashboard statistics for admins
- Standardized API responses and global error handling
- Zod validation on all inputs
- Security: Helmet, CORS, rate limiting

## Tech Stack

- Node.js + Express 5
- TypeScript
- Neon PostgreSQL + Drizzle ORM
- JWT + bcrypt
- Cloudinary + Multer
- Zod validation

## Installation

```bash
cd backend
npm install
cp .env.example .env   # edit with your Neon DATABASE_URL
```

## Database Setup

Apply the schema to your Neon PostgreSQL database:

```bash
npm run db:push
# or run migrations
npm run db:migrate
```

## Seed Database

```bash
npm run seed
```

Creates admin user (`admin@blog.com` / `password123`) and 15 sample blogs.

Use `npm run seed -- --force` to reset blogs.

## Running Locally

```bash
npm run dev      # development with hot reload
npm run build    # compile TypeScript
npm start        # production mode
npm run type-check
npm run lint
```

Server: `http://localhost:3001`
Health: `http://localhost:3001/api/health`

## Deploying to Vercel

This backend is configured for Vercel serverless:

- **`src/app.ts`** — builds the Express app and exports it as `default` (no `listen()`)
- **`src/server.ts`** — local dev only; calls `app.listen()`
- **`api/index.ts`** — Vercel entry; connects to Neon, then forwards requests to the Express app
- **`vercel.json`** — routes all traffic to `api/index.ts`

### Vercel project settings

1. Set the **Root Directory** to `backend` (if deploying from the monorepo)
2. Add environment variables from `.env.example` in the Vercel dashboard
3. Set `CLIENT_URL` to your deployed frontend URL (for CORS)
4. Deploy — do **not** point Vercel at `src/app.ts` or `src/server.ts` directly

### Required env vars on Vercel

`DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `CLIENT_URL`, and Cloudinary keys if using uploads.

### Database setup on production (important)

`/api/health` only checks uptime unless you redeploy with the latest code. **Login requires the database schema and users.**

From your machine, using the production `DATABASE_URL` from Vercel:

```bash
cd backend
# set DATABASE_URL to your Neon production connection string
npm run db:push
npm run seed
```

Default admin after seed: `admin@blog.com` / `password123`

Custom users like `user11@gmail.com` only work if they were registered or seeded in the **production** database. Wrong credentials return `401`; missing tables/DB issues return `500` or `503`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 3001) |
| `NODE_ENV` | development / production |
| `CLIENT_URL` | Frontend URL for CORS |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token expiry (e.g. 7d) |
| `COOKIE_SECRET` | Cookie signing secret |
| `COOKIE_NAME` | Auth cookie name |
| `CLOUDINARY_*` | Cloudinary credentials |
| `MAX_FILE_SIZE` | Max upload size in bytes |

## Database Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate migration from schema changes |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema directly (dev) |
| `npm run db:studio` | Open Drizzle Studio |

## API Endpoints

### Auth — `/api/auth`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register user |
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| GET | `/me` | Current user |

### Blogs — `/api/blogs`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Optional | List blogs |
| GET | `/latest` | Public | Latest blogs |
| GET | `/featured` | Public | Featured blogs |
| GET | `/dashboard/stats` | Admin | Dashboard stats |
| GET | `/:slug/related` | Public | Related blogs |
| GET | `/:slug` | Public | Single blog |
| POST | `/` | Admin | Create blog |
| PUT | `/:id` | Admin | Update blog |
| DELETE | `/:id` | Admin | Delete blog |

### Health — `/api/health`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |

## Folder Structure

```
src/
├── db/             Drizzle schema + client
├── config/         Environment, DB, Cloudinary
├── constants/      Roles, messages, HTTP codes
├── controllers/    HTTP handlers
├── services/       Business logic
├── repositories/   PostgreSQL access (Drizzle)
├── routes/         Express routers
├── middleware/     Auth, upload, errors
├── validators/     Zod schemas
├── types/          TypeScript types
├── interfaces/     Domain interfaces
├── utils/          Helpers
└── lib/            Seed script
drizzle/            SQL migrations
```

## Documentation

Full module documentation: [docs/](./docs/)

## Frontend Integration

The Next.js frontend expects API at `http://localhost:3001/api`. To connect:

1. Enable `withCredentials: true` on axios
2. Replace mock services with API calls
3. Map response shape: `{ success, message, data }`
4. Blog IDs are now UUIDs (not MongoDB ObjectIds)

## Best Practices

- Controllers stay thin — logic lives in services
- Repositories only touch PostgreSQL via Drizzle
- All responses use standardized format
- Validate every request with Zod
- Never commit `.env` to version control

## License

ISC
