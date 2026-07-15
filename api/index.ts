import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import { connectDatabase } from "../src/config/database";

let isReady = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!isReady) {
      await connectDatabase();
      isReady = true;
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    return res.status(503).json({
      success: false,
      message: "Database connection failed",
      errors: ["Database connection failed"],
    });
  }

  return app(req, res);
}
