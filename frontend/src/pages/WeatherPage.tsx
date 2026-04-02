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
import type { WeatherForecast } from "@robiscoding/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function geoLocationIsDenied(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 1
  );
}

type WeatherResult = { weather: WeatherForecast; locationName: string };

export default function WeatherPage() {
  const [locationQuery, setLocationQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showLanding, setShowLanding] = useState(false);

  const geoQuery = useQuery<WeatherResult | null>({
    queryKey: ["weather", "geo"],
    queryFn: async () => {
      let coords;
      try {
        coords = await getBrowserLocation();
      } catch (err) {
        if (geoLocationIsDenied(err)) return null;
        throw err;
      }
      const [location, data] = await Promise.all([
        reverseGeocode(coords),
        WeatherApi.fetchWeather(coords),
      ]);
      return { weather: data, locationName: location.display_name };
    },
    retry: false,
    staleTime: Infinity,
  });

  const searchQuery = useQuery<WeatherResult>({
    queryKey: ["weather", "search", submittedQuery],
    queryFn: async () => {
      const location = await fetchLocation(submittedQuery);
      const data = await WeatherApi.fetchWeather(location);
      return { weather: data, locationName: location.display_name };
    },
    enabled: !!submittedQuery,
    retry: false,
    staleTime: 5000,
  });

  const activeQuery = submittedQuery ? searchQuery : geoQuery;
  const result = showLanding ? null : (activeQuery.data ?? null);
  const isLoading = activeQuery.isFetching;
  const error = activeQuery.isError ? getErrorMessage(activeQuery.error) : null;

  function handleLocationSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    setShowLanding(false);
    setSubmittedQuery(locationQuery);
  }

  return (
    <div>
      <AppHeader />
      {result?.weather ? (
        <WeatherDisplay
          weather={result.weather}
          locationName={result.locationName}
          onChangeLocation={() => {
            setShowLanding(true);
            setSubmittedQuery("");
            setLocationQuery("");
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
