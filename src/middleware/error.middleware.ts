import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/http-status";
import { ApiError } from "../utils/api-error";
import { sendFailure } from "../utils/api-response";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof ApiError) {
    return sendFailure(res, err.statusCode, err.message, err.errors);
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    return sendFailure(
      res,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      MESSAGES.VALIDATION.FAILED,
      errors
    );
  }

  if ((err as { code?: string }).code === "23505") {
    return sendFailure(
      res,
      HTTP_STATUS.CONFLICT,
      "Duplicate field value entered",
      ["A record with this value already exists"]
    );
  }

  const pgCode = (err as { code?: string }).code;
  if (pgCode?.startsWith("42") || pgCode === "ECONNREFUSED" || pgCode === "ENOTFOUND") {
    console.error("Database error:", err);
    return sendFailure(
      res,
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      "Database unavailable",
      ["Database unavailable"]
    );
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return sendFailure(res, HTTP_STATUS.UNAUTHORIZED, "Invalid token", [err.message]);
  }

  if (err instanceof jwt.TokenExpiredError) {
    return sendFailure(res, HTTP_STATUS.UNAUTHORIZED, "Token expired", [err.message]);
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return sendFailure(res, HTTP_STATUS.BAD_REQUEST, MESSAGES.UPLOAD.TOO_LARGE, [err.message]);
    }
    return sendFailure(res, HTTP_STATUS.BAD_REQUEST, MESSAGES.UPLOAD.UPLOAD_FAILED, [err.message]);
  }

  const bodyParserError = err as { type?: string; statusCode?: number };
  if (bodyParserError.type === "entity.parse.failed") {
    return sendFailure(
      res,
      HTTP_STATUS.BAD_REQUEST,
      "Invalid JSON body",
      ["Invalid JSON body"]
    );
  }

  const rateLimitCode = (err as { code?: string }).code;
  if (rateLimitCode?.startsWith("ERR_ERL_")) {
    console.error("Rate limit configuration error:", err);
    return sendFailure(
      res,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      "Too many requests, please try again later",
      ["Rate limit exceeded"]
    );
  }

  console.error("Unhandled error:", err);

  const message =
    env.NODE_ENV === "production"
      ? MESSAGES.SERVER.INTERNAL_ERROR
      : err.message || MESSAGES.SERVER.INTERNAL_ERROR;

  return sendFailure(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message, [message]);
};
