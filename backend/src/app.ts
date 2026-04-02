import cors from "cors";
import express, { type Express } from "express";
import type { LocationProvider } from "./services/location/LocationProvider.js";
import { createLocationRouter } from "./services/location/route.js";
import type { WeatherProvider } from "./services/weather/WeatherProvider.js";
import { createWeatherRouter } from "./services/weather/route.js";

export function createApp(
  weatherProvider: WeatherProvider,
  locationProvider: LocationProvider,
): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/weather", createWeatherRouter(weatherProvider));
  app.use("/api/location", createLocationRouter(locationProvider));
  return app;
}
