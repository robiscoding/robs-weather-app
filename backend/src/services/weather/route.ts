import {
  getWeatherRequestSchema,
  type GetWeatherResponse,
} from "@robiscoding/shared";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import type { WeatherProvider } from "./WeatherProvider.js";

function validateGetWeatherRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { error } = getWeatherRequestSchema.safeParse(req.query);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
}

export function createWeatherRouter(provider: WeatherProvider): Router {
  const router = Router();

  router.get(
    "/",
    validateGetWeatherRequest,
    async (req: Request, res: Response<GetWeatherResponse>) => {
      const q = getWeatherRequestSchema.parse(req.query);
      const forecast = await provider.getWeather({
        lat: Number(q.lat),
        lon: Number(q.lon),
        units: q.units ?? "metric",
      });
      return res.json({ data: forecast });
    },
  );

  return router;
}
