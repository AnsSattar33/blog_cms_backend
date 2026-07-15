import { env } from "../config/env";

const isProduction = env.NODE_ENV === "production";

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  // Production: None+Secure so cross-origin Vercel (frontend → backend) XHR sends the cookie.
  // Development: Lax+insecure so HTTP localhost (same-site, cross-port) keeps working.
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const COOKIE_NAME = () => env.COOKIE_NAME;
