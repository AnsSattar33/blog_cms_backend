import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { verifyToken } from "../utils/jwt.util";
import { env } from "../config/env";

export const optionalAuthMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    const signedCookies = req.signedCookies as Record<string, string> | undefined;
    const cookies = req.cookies as Record<string, string> | undefined;

    token =
      signedCookies?.[env.COOKIE_NAME] ||
      cookies?.[env.COOKIE_NAME];

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }

  next();
};
