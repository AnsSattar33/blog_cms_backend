# Cloudinary

## Purpose

Manages image upload, replacement, and deletion via Cloudinary cloud storage.

## Responsibilities

- Upload blog cover images from Multer memory buffers
- Return secure URL and public ID stored in PostgreSQL (`cover_image_url`, `cover_image_public_id`)
- Delete images when blogs are updated or removed

## Best Practices

- Store only URL + publicId in PostgreSQL, never binary data
- Use folder prefix `blog-cms/covers` for organization
