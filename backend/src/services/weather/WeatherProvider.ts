import type { Coordinates, WeatherForecast } from "@palmetto/shared";

export interface WeatherProvider {
  getWeather(location: Coordinates): Promise<WeatherForecast>;
}
