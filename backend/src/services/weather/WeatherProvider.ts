import type { Coordinates, WeatherForecast, WeatherUnits } from "@robiscoding/shared";

export type WeatherQuery = Coordinates & { units: WeatherUnits };

export interface WeatherProvider {
  getWeather(query: WeatherQuery): Promise<WeatherForecast>;
}
