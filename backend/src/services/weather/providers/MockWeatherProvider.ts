import type { Coordinates, WeatherForecast } from "@palmetto/shared";
import type { WeatherProvider } from "../WeatherProvider.js";

const DEFAULT_FORECAST: Omit<WeatherForecast, "timestamp" | "location"> = {
  units: "imperial",
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

  async getWeather(location: Coordinates): Promise<WeatherForecast> {
    return {
      ...DEFAULT_FORECAST,
      timestamp: new Date().toISOString(),
      location,
      ...this.overrides,
    };
  }
}
