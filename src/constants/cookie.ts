import { env } from "../config/env";

const isProduction = env.NODE_ENV === "production";

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  // Lax works when the frontend proxies /api (first-party cookie on the app host).
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const COOKIE_NAME = () => env.COOKIE_NAME;
