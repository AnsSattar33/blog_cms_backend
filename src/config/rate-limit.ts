import type { Options } from "express-rate-limit";

const rateLimitMessage = {
  success: false,
  message: "Too many requests, please try again later",
  errors: ["Rate limit exceeded"],
};

export function createRateLimitOptions(max: number): Partial<Options> {
  return {
    windowMs: 15 * 60 * 1000,
    max,
    message: rateLimitMessage,
    standardHeaders: true,
    legacyHeaders: false,
    // Required on Vercel: trust proxy is enabled for cookies, but express-rate-limit
    // throws ERR_ERL_PERMISSIVE_TRUST_PROXY without this.
    validate: {
      trustProxy: false,
      xForwardedForHeader: false,
    },
  };
}
