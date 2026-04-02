import type { Coordinates, WeatherForecast } from "@robiscoding/shared";

export interface WeatherProvider {
  getWeather(location: Coordinates): Promise<WeatherForecast>;
}
