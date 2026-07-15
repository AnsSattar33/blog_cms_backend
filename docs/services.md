# Services

## Purpose

Business logic layer between controllers and repositories.

## Responsibilities

- Enforce business rules (slug uniqueness, publish logic)
- Orchestrate repository and Cloudinary operations
- Map database documents to API response DTOs

## Components Involved

| Service | File | Key Methods |
|---------|------|-------------|
| Auth | `auth.service.ts` | register, login, getCurrentUser |
| Blog | `blog.service.ts` | getBlogs, createBlog, updateBlog, deleteBlog, stats |
| Cloudinary | `cloudinary.service.ts` | uploadImage, deleteImage, replaceImage |

## Best Practices

- Throw `ApiError` for expected failures (404, 409, etc.)
- Keep services testable by injecting repositories
- Use utility functions for slug, reading time, pagination

## Future Scalability

- Event emission on blog publish/delete
- Caching layer for read-heavy operations
- Transaction support for multi-document operations
