import type { WeatherForecast } from "@robiscoding/shared";
import type { WeatherProvider, WeatherQuery } from "../WeatherProvider.js";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export class OpenWeatherMapWeatherProvider implements WeatherProvider {
  constructor(private readonly apiKey: string) {}

  async getWeather(query: WeatherQuery): Promise<WeatherForecast> {
    const location = { lat: query.lat, lon: query.lon };
    const url = `${BASE_URL}?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}&units=${query.units}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OpenWeatherMap request failed: ${response.statusText}`);
    }

    const raw = (await response.json()) as OpenWeatherMapResponse;
    return this.mapToWeatherForecast(raw, location, query.units);
  }

  private mapToWeatherForecast(
    raw: OpenWeatherMapResponse,
    location: { lat: number; lon: number },
    units: WeatherQuery["units"],
  ): WeatherForecast {
    return {
      timestamp: new Date(raw.dt * 1000).toISOString(),
      location,
      units,
      condition: {
        code: raw.weather[0].id,
        label: raw.weather[0].description,
        icon: raw.weather[0].icon,
      },
      temp: raw.main.temp,
      feels_like: raw.main.feels_like,
      temp_min: raw.main.temp_min,
      temp_max: raw.main.temp_max,
      humidity: raw.main.humidity,
      visibility: raw.visibility,
      wind: {
        speed: raw.wind.speed,
        deg: raw.wind.deg,
        gust: raw.wind.gust,
      },
    };
  }
}

interface OpenWeatherMapResponse {
  dt: number;
  weather: { id: number; description: string; icon: string }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
}
