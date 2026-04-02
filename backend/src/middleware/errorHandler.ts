import type { NextFunction, Request, Response } from "express";
import { sendInternalServerError } from "../lib/errors.js";

export function errorHandlerMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (res.headersSent) {
    return;
  }
  sendInternalServerError(res, err);
}
