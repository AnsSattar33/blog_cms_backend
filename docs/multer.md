# Multer

## Purpose

Handles multipart/form-data file uploads for blog cover images.

## Responsibilities

- Parse `coverImage` field from multipart requests
- Store files in memory (not disk) for Cloudinary streaming
- Enforce file size and MIME type limits

## Configuration

- Storage: `memoryStorage()`
- Max size: `MAX_FILE_SIZE` env var (default 5MB)
- Allowed types: JPEG, PNG, WebP
- Field name: `coverImage`

## Components Involved

- `middleware/upload.middleware.ts`
- `constants/cloudinary.ts`

## Best Practices

- Required on blog create, optional on update
- Validate file type in Multer filter before upload
- Combine with Zod body validation for other fields

## Future Scalability

- Support multiple file fields (gallery)
- Virus scanning integration
- Direct client-to-Cloudinary signed uploads
