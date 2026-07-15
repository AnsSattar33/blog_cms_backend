import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { env } from "./config/env";
import { configureCloudinary } from "./config/cloudinary";
import routes from "./routes";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { getAllowedOrigins } from "./utils/cors.util";

configureCloudinary();

export const createApp = (): Application => {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.set("trust proxy", 1);

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser(env.COOKIE_SECRET));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
      success: false,
      message: "Too many requests, please try again later",
      errors: ["Rate limit exceeded"],
    },
  });

  const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
      success: false,
      message: "Too many requests, please try again later",
      errors: ["Rate limit exceeded"],
    },
  });

  app.use("/api/auth", authLimiter);
  app.use("/api/blogs", (req, res, next) => {
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      writeLimiter(req, res, next);
      return;
    }
    next();
  });

  app.use("/api", routes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};

const app = createApp();

export default app;
