# Routes

## Purpose

Complete API endpoint reference for the Blog CMS backend.

## Base URL

`http://localhost:3001/api`

## Auth Routes — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, sets JWT cookie |
| POST | `/logout` | Auth | Clear JWT cookie |
| GET | `/me` | Auth | Get current user |

## Blog Routes — `/api/blogs`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Optional | List blogs (paginated) |
| GET | `/latest` | Public | Latest published blogs |
| GET | `/featured` | Public | Featured published blogs |
| GET | `/dashboard/stats` | Admin | Dashboard statistics |
| GET | `/:slug/related` | Public | Related blogs |
| GET | `/:slug` | Public | Single blog by slug |
| POST | `/` | Admin | Create blog (multipart) |
| PUT | `/:id` | Admin | Update blog (multipart optional) |
| DELETE | `/:id` | Admin | Delete blog |

### Query Parameters (GET `/`)

- `page`, `limit`, `search`, `category`, `tag`, `sort`, `isPublished`

## Health — `/api/health`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |

## Best Practices

- Register specific routes before parameterized routes
- Use optional auth on list endpoint for admin dashboard access

## Future Scalability

- API versioning (`/api/v1/`)
- OpenAPI/Swagger documentation generation
