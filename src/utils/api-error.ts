import { HTTP_STATUS } from "../constants/http-status";

export class ApiError extends Error {
  statusCode: number;
  errors: string[];
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: string[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors.length > 0 ? errors : [message];
    this.isOperational = true;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, errors?: string[]): ApiError {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  static unauthorized(message: string): ApiError {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message: string): ApiError {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message: string): ApiError {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  static internal(message: string): ApiError {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }
}
