import { env } from "../config/env";

const isProduction = env.NODE_ENV === "production";

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  // Cross-origin frontend → API on Vercel requires SameSite=None + Secure.
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  signed: true,
});

export const COOKIE_NAME = () => env.COOKIE_NAME;
