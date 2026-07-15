import { RequestHandler } from "express";
import { MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/http-status";
import { sendFailure } from "../utils/api-response";

export const notFoundMiddleware: RequestHandler = (req, res) => {
  return sendFailure(
    res,
    HTTP_STATUS.NOT_FOUND,
    `${MESSAGES.SERVER.NOT_FOUND}: ${req.method} ${req.originalUrl}`
  );
};
