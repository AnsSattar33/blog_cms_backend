# Deployment

## Purpose

Guide for deploying the Blog CMS backend to production.

## Prerequisites

- Node.js 18+
- Neon PostgreSQL project with connection string
- Cloudinary account
- Domain with HTTPS

## Build Steps

```bash
npm install
npm run build
npm run db:migrate
npm start
```

## Environment Variables

Set all variables from `.env.example` with production values:

- Strong `JWT_SECRET` and `COOKIE_SECRET`
- Production `DATABASE_URL` (Neon pooled connection string recommended)
- Real Cloudinary credentials
- `NODE_ENV=production`
- `CLIENT_URL` set to production frontend URL

## Production Checklist

- [ ] Run `npm run db:migrate` against production Neon database
- [ ] Cloudinary configured and tested
- [ ] HTTPS enabled (required for secure cookies)
- [ ] CORS origin set to production frontend
- [ ] Health check monitoring on `/api/health`

## Best Practices

- Use Neon's connection pooling for serverless/production workloads
- Never commit `.env` to version control
- Run seed only in development/staging
