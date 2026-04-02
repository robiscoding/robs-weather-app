import type { ErrorResponse } from "@palmetto/shared";
import type { Response } from "express";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function sendBadRequest(
  res: Response<ErrorResponse>,
  error: unknown,
): Response<ErrorResponse> {
  console.error("[400] Request validation failed:", error);
  return res.status(400).json({
    ok: false,
    error: toErrorMessage(error),
  });
}

export function sendNotFound(
  res: Response,
  message: string,
): Response {
  return res.status(404).json({
    ok: false,
    error: message,
  } satisfies ErrorResponse);
}

export function sendInternalServerError(
  res: Response<ErrorResponse>,
  error: unknown,
): Response<ErrorResponse> {
  console.error("[500] Unhandled request error:", error);
  return res.status(500).json({
    ok: false,
    error: "An unexpected error occurred",
  });
}
