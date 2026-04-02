import {
  reverseGeocodeRequestSchema,
  searchLocationRequestSchema,
  type ReverseGeocodeResponse,
  type SearchLocationResponse,
} from "@palmetto/shared";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { sendNotFound } from "../../lib/errors.js";
import type { LocationProvider } from "./LocationProvider.js";

function validateRequest(schema: {
  safeParse: (v: unknown) => { error?: unknown };
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(req.query);
    if (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
    next();
  };
}

function isNoResultsError(err: unknown): boolean {
  return err instanceof Error && err.message.startsWith("No results found");
}

export function createLocationRouter(provider: LocationProvider): Router {
  const router = Router();

  router.get(
    "/search",
    validateRequest(searchLocationRequestSchema),
    async (
      req: Request,
      res: Response<SearchLocationResponse>,
      next: NextFunction,
    ) => {
      try {
        const q = req.query.q as string;
        const result = await provider.searchLocation(q);
        return res.json({ data: result });
      } catch (err) {
        if (isNoResultsError(err)) {
          return sendNotFound(
            res,
            "No locations found for that query, please try a different one.",
          );
        }
        next(err);
      }
    },
  );

  router.get(
    "/reverse",
    validateRequest(reverseGeocodeRequestSchema),
    async (
      req: Request,
      res: Response<ReverseGeocodeResponse>,
      next: NextFunction,
    ) => {
      try {
        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);
        const result = await provider.reverseGeocode({ lat, lon });
        return res.json({ data: result });
      } catch (err) {
        if (isNoResultsError(err)) {
          return sendNotFound(
            res,
            "No locations found for those coordinates, please try searching manually.",
          );
        }
        next(err);
      }
    },
  );

  return router;
}
