import cors from "cors";
import express, { type Express } from "express";
import weatherRoute from "./services/weather/route.js";

export function createApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/weather", weatherRoute);
  return app;
}
