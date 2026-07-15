import { RequestHandler } from "express";
import { ZodSchema } from "zod";
import { MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/http-status";
import { sendFailure } from "../utils/api-response";

type ValidationSource = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, source: ValidationSource = "body"): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      return sendFailure(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        MESSAGES.VALIDATION.FAILED,
        errors
      );
    }

    if (source === "query") {
      Object.assign(req.query as Record<string, unknown>, result.data);
      return next();
    }

    req[source] = result.data;
    return next();
  };
