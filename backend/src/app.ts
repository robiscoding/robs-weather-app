import cors from "cors";
import express, { type Express } from "express";
import type { WeatherProvider } from "./services/weather/WeatherProvider.js";
import { createWeatherRouter } from "./services/weather/route.js";

export function createApp(weatherProvider: WeatherProvider): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/weather", createWeatherRouter(weatherProvider));
  return app;
}
