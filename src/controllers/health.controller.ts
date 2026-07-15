import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { HTTP_STATUS } from "../constants/http-status";

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, HTTP_STATUS.OK, "Service is healthy", {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});
