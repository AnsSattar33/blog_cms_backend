import { env } from "../config/env";

function isVercelPreviewOrigin(origin: string): boolean {
  return /^https:\/\/[\w-]+\.vercel\.app$/.test(origin);
}

export function getAllowedOrigins(): string[] {
  const origins = new Set<string>([env.CLIENT_URL]);

  if (env.CLIENT_URLS) {
    for (const origin of env.CLIENT_URLS.split(",")) {
      const trimmed = origin.trim();
      if (trimmed) origins.add(trimmed);
    }
  }

  return [...origins];
}

export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;

  const allowed = getAllowedOrigins();
  if (allowed.includes(origin)) return true;

  if (env.ALLOW_VERCEL_PREVIEWS && isVercelPreviewOrigin(origin)) {
    return true;
  }

  return false;
}
