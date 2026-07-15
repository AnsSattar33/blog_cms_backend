import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { HTTP_STATUS } from "../constants/http-status";
import { connectDatabase } from "../config/database";

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  let database: "connected" | "error" = "connected";

  try {
    await connectDatabase();
  } catch (error) {
    console.error("Health check database error:", error);
    database = "error";
  }

  return sendSuccess(res, HTTP_STATUS.OK, "Service is healthy", {
    status: database === "connected" ? "ok" : "degraded",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database,
  });
});
