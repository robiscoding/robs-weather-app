import { apiRequest } from "@/lib/apiRequest";
import type {
  Coordinates,
  GetWeatherResponse,
  WeatherForecast,
  WeatherUnits,
} from "@robiscoding/shared";

export async function fetchWeather({
  lat,
  lon,
  units,
}: Coordinates & { units: WeatherUnits }): Promise<WeatherForecast> {
  const q = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    units,
  });
  const response = await apiRequest<GetWeatherResponse>(
    `/api/weather?${q.toString()}`,
    {
      method: "GET",
    },
  );
  if (!response.success) {
    console.error(response.error);
    throw response.error;
  }
  return response.value.data;
}
