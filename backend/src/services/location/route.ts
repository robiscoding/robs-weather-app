import {
  reverseGeocodeRequestSchema,
  searchLocationRequestSchema,
  type ReverseGeocodeResponse,
  type SearchLocationResponse,
} from "@palmetto/shared";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
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

export function createLocationRouter(provider: LocationProvider): Router {
  const router = Router();

  router.get(
    "/search",
    validateRequest(searchLocationRequestSchema),
    async (req: Request, res: Response<SearchLocationResponse>) => {
      const q = req.query.q as string;
      const result = await provider.searchLocation(q);
      return res.json({ data: result });
    },
  );

  router.get(
    "/reverse",
    validateRequest(reverseGeocodeRequestSchema),
    async (req: Request, res: Response<ReverseGeocodeResponse>) => {
      const lat = Number(req.query.lat);
      const lon = Number(req.query.lon);
      const result = await provider.reverseGeocode({ lat, lon });
      return res.json({ data: result });
    },
  );

  return router;
}
