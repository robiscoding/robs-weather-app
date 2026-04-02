import { fetchLocation, getBrowserLocation, reverseGeocode } from "@/api/location";
import * as WeatherApi from "@/api/weather";
import { WeatherDisplay } from "@/components/Weather/WeatherDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WeatherForecast } from "@palmetto/shared";
import { useEffect, useState } from "react";

const BACKGROUND =
  "min-h-svh bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-6";

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [needsLocationSearch, setNeedsLocationSearch] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationName, setLocationName] = useState<string | undefined>(
    undefined,
  );
  const [isSearching, setIsSearching] = useState(false);

  useEffect(function loadWeatherOnMount() {
    const getWeatherForLocation = async () => {
      try {
        const coords = await getBrowserLocation();
        const [location, data] = await Promise.all([
          reverseGeocode(coords),
          WeatherApi.fetchWeather(coords),
        ]);
        setLocationName(location.display_name);
        setWeather(data);
      } catch {
        setNeedsLocationSearch(true);
      }
    };
    getWeatherForLocation();
  }, []);

  async function handleLocationSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    setIsSearching(true);
    try {
      const location = await fetchLocation(locationQuery);
      const data = await WeatherApi.fetchWeather(location);
      setLocationName(location.display_name);
      setWeather(data);
      setNeedsLocationSearch(false);
    } finally {
      setIsSearching(false);
    }
  }

  if (needsLocationSearch) {
    return (
      <main className={BACKGROUND}>
        <div className="w-full max-w-sm flex flex-col gap-4">
          <div className="text-center">
            <p className="text-white text-xl font-semibold">
              Enter your location
            </p>
            <p className="text-white/60 text-sm mt-1">
              City, state or postal code
            </p>
          </div>
          <form onSubmit={handleLocationSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g. Charlotte, NC or 28201"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              disabled={isSearching}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/50"
            />
            <Button
              type="submit"
              disabled={isSearching || !locationQuery.trim()}
              className="bg-white text-blue-600 hover:bg-white/90 font-semibold shrink-0"
            >
              {isSearching ? "Loading..." : "Get Weather"}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  if (!weather) {
    return (
      <main className={BACKGROUND}>
        <div className="text-white text-2xl font-bold">Loading...</div>
      </main>
    );
  }

  return (
    <main className={BACKGROUND}>
      <WeatherDisplay weather={weather} locationName={locationName} />
    </main>
  );
}
