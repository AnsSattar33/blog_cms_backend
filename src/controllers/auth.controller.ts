import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { HTTP_STATUS } from "../constants/http-status";
import { MESSAGES } from "../constants/messages";
import { getCookieOptions, COOKIE_NAME } from "../constants/cookie";

export const register = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await authService.register(req.body);
  const cookieName = COOKIE_NAME();

  res.cookie(cookieName, result.token, getCookieOptions());

  return sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.AUTH.REGISTER_SUCCESS, {
    user: result.user,
    token: result.token,
  });
});

export const login = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await authService.login(req.body);
  const cookieName = COOKIE_NAME();

  res.cookie(cookieName, result.token, getCookieOptions());

  return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.AUTH.LOGIN_SUCCESS, {
    user: result.user,
    token: result.token,
  });
});

export const logout = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const cookieName = COOKIE_NAME();
  res.clearCookie(cookieName, getCookieOptions());

  return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.AUTH.LOGOUT_SUCCESS, null);
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);
  return sendSuccess(res, HTTP_STATUS.OK, "User retrieved successfully", user);
});
