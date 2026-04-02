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

export const weatherRoute = Router();

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

weatherRoute.get(
  "/",
  validateGetWeatherRequest,
  (req: Request, res: Response<GetWeatherResponse>) => {
    return res.json({
      data: {
        timestamp: new Date().toISOString(),
        location: {
          lat: Number(req.query.lat),
          lon: Number(req.query.lon),
        },
        condition: { code: 802, label: "Partly Cloudy" },
        units: "imperial",
        temp: 78,
        feels_like: 81,
        temp_min: 72,
        temp_max: 84,
        humidity: 65,
        visibility: 16093,
        wind: { speed: 12, deg: 210, gust: 18 },
      },
    });
  },
);

export default weatherRoute;
