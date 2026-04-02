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

export {
  locationResultSchema,
  searchLocationRequestSchema,
  searchLocationResponseSchema,
  reverseGeocodeRequestSchema,
  reverseGeocodeResponseSchema,
} from "./location.js";

export type {
  LocationResult,
  SearchLocationRequest,
  SearchLocationResponse,
  ReverseGeocodeRequest,
  ReverseGeocodeResponse,
} from "./location.js";
