import * as WeatherApi from "@/api/weather";
import { WeatherDisplay } from "@/components/Weather/WeatherDisplay";
import { getLocation } from "@/lib/geolocation";
import type { WeatherForecast } from "@palmetto/shared";
import { useEffect, useState } from "react";

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);

  useEffect(function loadWeatherOnMount() {
    const getWeatherForLocation = async () => {
      const coords = await getLocation();
      const weather = await WeatherApi.fetchWeather(coords);
      setWeather(weather);
    };
    getWeatherForLocation();
  }, []);

  if (!weather) {
    return (
      <main className="min-h-svh bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-6">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-6">
      <WeatherDisplay weather={weather} locationName="Charlotte, NC" />
    </main>
  );
}
