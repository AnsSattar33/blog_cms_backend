import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Application } from "express";
import { createApp } from "../src/app";
import { connectDatabase } from "../src/config/database";

let app: Application | undefined;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    await connectDatabase();
    app = createApp();
  }

  return app(req, res);
}
