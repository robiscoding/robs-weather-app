export {
  coordinatesSchema,
  getWeatherRequestSchema,
  getWeatherResponseSchema,
  weatherConditionSchema,
  weatherForecastSchema,
  weatherUnitsSchema,
} from "./weather.js";

export type {
  Coordinates,
  GetWeatherRequest,
  GetWeatherResponse,
  WeatherCondition,
  WeatherForecast,
  WeatherUnits,
} from "./weather.js";

export { errorResponseSchema } from "./errors.js";
export type { ErrorResponse } from "./errors.js";

export {
  locationResultSchema,
  reverseGeocodeRequestSchema,
  reverseGeocodeResponseSchema,
  searchLocationRequestSchema,
  searchLocationResponseSchema,
} from "./location.js";

export type {
  LocationResult,
  ReverseGeocodeRequest,
  ReverseGeocodeResponse,
  SearchLocationRequest,
  SearchLocationResponse,
} from "./location.js";
