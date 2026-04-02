import {
  fetchLocation,
  getBrowserLocation,
  reverseGeocode,
} from "@/api/location";
import * as WeatherApi from "@/api/weather";
import { AppHeader } from "@/components/AppHeader";
import { WeatherDisplay } from "@/components/Weather/WeatherDisplay";
import { WeatherLanding } from "@/components/Weather/WeatherLanding";
import { getErrorMessage } from "@/lib/errorMessages";
import type { WeatherForecast } from "@palmetto/shared";
import { useEffect, useState } from "react";

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationName, setLocationName] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(function attemptBrowserGeolocation() {
    const tryGeoLocation = async () => {
      try {
        const coords = await getBrowserLocation();
        setIsLoading(true);
        const [location, data] = await Promise.all([
          reverseGeocode(coords),
          WeatherApi.fetchWeather(coords),
        ]);
        setLocationName(location.display_name);
        setWeather(data);
      } catch (err) {
        const denied =
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code: number }).code === 1;
        if (denied) {
          return;
        }
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    tryGeoLocation();
  }, []);

  async function handleLocationSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const location = await fetchLocation(locationQuery);
      const data = await WeatherApi.fetchWeather(location);
      setLocationName(location.display_name);
      setWeather(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <AppHeader />
      {weather ? (
        <WeatherDisplay
          weather={weather}
          locationName={locationName}
          onChangeLocation={() => {
            setWeather(null);
            setLocationName(undefined);
            setError(null);
          }}
        />
      ) : (
        <WeatherLanding
          locationQuery={locationQuery}
          isLoading={isLoading}
          error={error}
          onChange={setLocationQuery}
          onSubmit={handleLocationSearch}
        />
      )}
    </div>
  );
}
