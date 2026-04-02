import type { Coordinates, WeatherForecast } from "@palmetto/shared";

export async function getWeather({
  lat,
  lon,
}: Coordinates): Promise<WeatherForecast> {
  return {
    timestamp: new Date().toISOString(),
    location: { lat, lon },
    condition: { code: 802, label: "Partly Cloudy" },
    units: "imperial",
    temp: 78,
    feels_like: 81,
    temp_min: 72,
    temp_max: 84,
    humidity: 65,
    visibility: 16093,
    wind: { speed: 12, deg: 210, gust: 18 },
  };
}
