import {
  fetchLocation,
  getBrowserLocation,
  reverseGeocode,
} from "@/api/location";
import * as WeatherApi from "@/api/weather";
import { AppHeader } from "@/components/AppHeader";
import { WeatherDisplay } from "@/components/Weather/WeatherDisplay";
import { WeatherLanding } from "@/components/Weather/WeatherLanding";
import { WeatherUnitsSelect } from "@/components/Weather/WeatherUnitsSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/errorMessages";
import type { WeatherForecast, WeatherUnits } from "@robiscoding/shared";
import { useQuery } from "@tanstack/react-query";
import { MapPin, RotateCcw } from "lucide-react";
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
  const [units, setUnits] = useState<WeatherUnits>("imperial");

  const geoQuery = useQuery<WeatherResult | null>({
    queryKey: ["weather", "geo", units],
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
        WeatherApi.fetchWeather({ ...coords, units }),
      ]);
      return { weather: data, locationName: location.display_name };
    },
    refetchInterval: 1 * 60 * 1000, // automatically refetch every minute
    retry: false,
    staleTime: 2 * 60 * 1000,
  });

  const searchQuery = useQuery<WeatherResult>({
    queryKey: ["weather", "search", submittedQuery, units],
    queryFn: async () => {
      const location = await fetchLocation(submittedQuery);
      const data = await WeatherApi.fetchWeather({
        lat: location.lat,
        lon: location.lon,
        units,
      });
      return { weather: data, locationName: location.display_name };
    },
    enabled: !!submittedQuery,
    retry: false,
    refetchInterval: 1 * 60 * 1000, // automatically refetch every minute
    staleTime: 5 * 60 * 1000,
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

  const hasWeather = Boolean(result?.weather);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
      <AppHeader />
      <Card className="border-white/20 bg-white/10 py-4 text-white shadow-none backdrop-blur-md">
        <CardContent className="px-4 sm:px-6">
          {!hasWeather ? (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-white/55">
                  Location
                </p>
                <WeatherLanding
                  locationQuery={locationQuery}
                  isLoading={isLoading}
                  error={error}
                  onChange={setLocationQuery}
                  onSubmit={handleLocationSearch}
                />
              </div>
              <WeatherUnitsSelect
                units={units}
                onUnitsChange={setUnits}
                className="w-full shrink-0 lg:w-48"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium uppercase tracking-wider text-white/55">
                  Location
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-white/60" />
                  <span className="text-sm font-medium text-white/90">
                    {result?.locationName ??
                      `${result?.weather.location.lat.toFixed(2)}, ${result?.weather.location.lon.toFixed(2)}`}
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setShowLanding(true);
                    setSubmittedQuery("");
                    setLocationQuery("");
                  }}
                  variant="outline"
                  size="sm"
                  className="w-fit border-white/45 bg-white/15 text-white shadow-sm backdrop-blur-sm hover:bg-white/25 hover:text-white hover:border-white/60 focus-visible:border-white/70 focus-visible:ring-white/35"
                >
                  <RotateCcw className="opacity-90" aria-hidden />
                  Change location
                </Button>
              </div>
              <WeatherUnitsSelect
                units={units}
                onUnitsChange={setUnits}
                className="w-full sm:max-w-52 sm:shrink-0"
              />
            </div>
          )}
        </CardContent>
      </Card>
      {hasWeather && result ? (
        <WeatherDisplay weather={result.weather} />
      ) : null}
    </div>
  );
}
