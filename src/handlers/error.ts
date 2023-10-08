/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

/**
 * Express Error Handler
 */

export class CustomError extends Error {
  constructor(message: string, status?: 400 | 401 | 403 | 422 | 500, errors?: unknown[], isOperational?: boolean) {
    super(message);
    this.status = status || 500;
    this.errors = errors || [];
    this.isOperational = isOperational || true;
  }
  status?: 400 | 401 | 403 | 422 | 500;
  errors?: unknown[];
  isOperational?: boolean;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    errors: err.errors || [],
  });
};

/**
 * Internal Server Error Handler
 */

const isTrustedError = (error: unknown) => {
  if (error instanceof CustomError) {
    return error.isOperational;
  }
  return false;
};

export const serverErrorHandler = () => {
  // get the unhandled rejection and throw it to another fallback handler we already have.
  process.on("unhandledRejection", (error: Error) => {
    throw error;
  });

  process.on("uncaughtException", (error: unknown) => {
    // user LOGGERS to log your error
    // send events to sentry or whatever
    if (!isTrustedError(error)) {
      process.exit(1);
    }
  });
};
