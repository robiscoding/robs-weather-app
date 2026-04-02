import cors from "cors";
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { errorHandlerMiddleware } from "./middleware/errorHandler.js";
import { openApiDocument } from "./openapi.js";
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

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use(errorHandlerMiddleware);

  return app;
}
