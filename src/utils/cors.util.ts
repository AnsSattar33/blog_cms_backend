import { env } from "../config/env";

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
