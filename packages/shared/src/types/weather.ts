import { z } from "zod";

export const weatherUnitsSchema = z.enum(["metric", "imperial", "standard"]);

export const coordinatesSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export const weatherConditionSchema = z.object({
  code: z.number(),
  label: z.string(),
  icon: z.string().optional(),
});

export const weatherForecastSchema = z.object({
  timestamp: z.string(), // ISO string
  location: coordinatesSchema,
  units: weatherUnitsSchema,
  condition: weatherConditionSchema,
  temp: z.number(),
  feels_like: z.number(),
  temp_min: z.number(),
  temp_max: z.number(),
  humidity: z.number(),
  visibility: z.number().optional(),
  wind: z
    .object({
      speed: z.number(),
      deg: z.number(),
      gust: z.number().optional(),
    })
    .optional(),
});

export const getWeatherRequestSchema = z.object({
  lat: z.string(),
  lon: z.string(),
  units: weatherUnitsSchema.optional(),
});

export const getWeatherResponseSchema = z.object({
  data: weatherForecastSchema,
});

export type GetWeatherRequest = z.infer<typeof getWeatherRequestSchema>;
export type GetWeatherResponse = z.infer<typeof getWeatherResponseSchema>;
export type WeatherUnits = z.infer<typeof weatherUnitsSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type WeatherCondition = z.infer<typeof weatherConditionSchema>;
export type WeatherForecast = z.infer<typeof weatherForecastSchema>;
