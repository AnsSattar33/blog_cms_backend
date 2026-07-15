import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import { connectDatabase } from "../src/config/database";

let isReady = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isReady) {
    await connectDatabase();
    isReady = true;
  }

  return app(req, res);
}
