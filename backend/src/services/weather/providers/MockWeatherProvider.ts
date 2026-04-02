import type { WeatherForecast } from "@robiscoding/shared";
import type { WeatherProvider, WeatherQuery } from "../WeatherProvider.js";

const DEFAULT_FORECAST: Omit<WeatherForecast, "timestamp" | "location" | "units"> = {
  condition: { code: 802, label: "Partly Cloudy" },
  temp: 78,
  feels_like: 81,
  temp_min: 72,
  temp_max: 84,
  humidity: 65,
  visibility: 16093,
  wind: { speed: 12, deg: 210, gust: 18 },
};

export class MockWeatherProvider implements WeatherProvider {
  constructor(private readonly overrides?: Partial<WeatherForecast>) {}

  async getWeather(query: WeatherQuery): Promise<WeatherForecast> {
    return {
      ...DEFAULT_FORECAST,
      units: query.units,
      timestamp: new Date().toISOString(),
      location: { lat: query.lat, lon: query.lon },
      ...this.overrides,
    };
  }
}
