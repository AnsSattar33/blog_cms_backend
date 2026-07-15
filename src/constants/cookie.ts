import { env } from "../config/env";

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  signed: true,
});

export const COOKIE_NAME = () => env.COOKIE_NAME;
