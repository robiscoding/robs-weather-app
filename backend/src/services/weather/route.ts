import {
  getWeatherRequestSchema,
  type GetWeatherResponse,
} from "@palmetto/shared";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
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
      const lat = Number(req.query.lat);
      const lon = Number(req.query.lon);
      const forecast = await provider.getWeather({ lat, lon });
      return res.json({ data: forecast });
    },
  );

  return router;
}
