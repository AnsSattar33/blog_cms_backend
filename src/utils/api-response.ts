import { Response } from "express";
import { PaginationMeta } from "../types";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  pagination?: PaginationMeta
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination && { pagination }),
  });
};

export const sendPaginated = <T>(
  res: Response,
  message: string,
  data: T[],
  pagination: PaginationMeta
): Response => {
  return sendSuccess(res, 200, message, data, pagination);
};

export const sendFailure = (
  res: Response,
  statusCode: number,
  message: string,
  errors: string[] = []
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : [message],
  });
};
