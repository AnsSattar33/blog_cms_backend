import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { MESSAGES } from "../constants/messages";
import { verifyToken } from "../utils/jwt.util";
import { ApiError } from "../utils/api-error";
import { env } from "../config/env";

export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    const signedCookies = req.signedCookies as Record<string, string> | undefined;
    const cookies = req.cookies as Record<string, string> | undefined;

    token =
      cookies?.[env.COOKIE_NAME] ||
      signedCookies?.[env.COOKIE_NAME];

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      throw ApiError.unauthorized(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    next(ApiError.unauthorized(MESSAGES.AUTH.UNAUTHORIZED));
  }
};
