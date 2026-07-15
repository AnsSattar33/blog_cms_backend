import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { ROLES } from "../constants/roles";
import { MESSAGES } from "../constants/messages";
import { ApiError } from "../utils/api-error";

export const adminMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    next(ApiError.unauthorized(MESSAGES.AUTH.UNAUTHORIZED));
    return;
  }

  if (req.user.role !== ROLES.ADMIN) {
    next(ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN));
    return;
  }

  next();
};
