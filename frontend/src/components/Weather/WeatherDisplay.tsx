import { Button } from "@/components/ui/button";
import type { WeatherForecast } from "@palmetto/shared";
import {
  ArrowDown,
  ArrowUp,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Compass,
  Droplets,
  Eye,
  MapPin,
  Search,
  Sun,
  Wind,
} from "lucide-react";
import { WeatherMetric } from "./WeatherMetric";

function WeatherConditionIcon({ code }: { code: number }) {
  const className = "h-28 w-28 text-white drop-shadow-lg animate-float";
  const strokeWidth = 1.2;

  if (code >= 200 && code < 300)
    return <CloudLightning className={className} strokeWidth={strokeWidth} />;
  if (code >= 300 && code < 400)
    return <CloudDrizzle className={className} strokeWidth={strokeWidth} />;
  if (code >= 500 && code < 600)
    return <CloudRain className={className} strokeWidth={strokeWidth} />;
  if (code >= 600 && code < 700)
    return <CloudSnow className={className} strokeWidth={strokeWidth} />;
  if (code >= 700 && code < 800)
    return <CloudFog className={className} strokeWidth={strokeWidth} />;
  if (code === 800)
    return <Sun className={className} strokeWidth={strokeWidth} />;
  if (code === 801)
    return <CloudSun className={className} strokeWidth={strokeWidth} />;
  return <Cloud className={className} strokeWidth={strokeWidth} />;
}

function getWindDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function unitLabels(units: string) {
  switch (units) {
    case "imperial":
      return { temp: "°", speed: "mph", dist: "mi" };
    case "metric":
      return { temp: "°", speed: "m/s", dist: "km" };
    default:
      return { temp: "K", speed: "m/s", dist: "m" };
  }
}

type WeatherDisplayProps = {
  weather: WeatherForecast;
  locationName?: string;
  onChangeLocation: () => void;
};

export function WeatherDisplay({
  weather,
  locationName,
  onChangeLocation,
}: WeatherDisplayProps) {
  const u = unitLabels(weather.units);

  const visibility =
    weather.visibility != null
      ? weather.units === "imperial"
        ? `${(weather.visibility / 1609).toFixed(0)} ${u.dist}`
        : `${(weather.visibility / 1000).toFixed(0)} ${u.dist}`
      : null;

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-8">
      <div className="w-full flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 text-white/70">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium tracking-wide">
            {locationName ??
              `${weather.location.lat.toFixed(2)}, ${weather.location.lon.toFixed(2)}`}
          </span>
        </div>
        <Button
          type="button"
          onClick={onChangeLocation}
          variant="outline"
          size="sm"
          className="border-white/45 bg-white/15 text-white shadow-sm backdrop-blur-sm hover:bg-white/25 hover:text-white hover:border-white/60 focus-visible:border-white/70 focus-visible:ring-white/35"
        >
          <Search className="opacity-90" aria-hidden />
          Change location
        </Button>
      </div>

      <div className="flex flex-col items-center gap-1">
        <WeatherConditionIcon code={weather.condition.code} />
        <p className="text-7xl sm:text-[7rem] leading-none font-extralight text-white tracking-tighter">
          {Math.round(weather.temp)}
          {u.temp}
        </p>
        <p className="text-lg font-medium text-white/90">
          {weather.condition.label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1 text-sm text-white/60">
          <span>
            Feels like {Math.round(weather.feels_like)}
            {u.temp}
          </span>
          <span className="text-white/30">·</span>
          <span className="inline-flex items-center gap-0.5">
            <ArrowUp className="h-3 w-3" />
            {Math.round(weather.temp_max)}
            {u.temp}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <ArrowDown className="h-3 w-3" />
            {Math.round(weather.temp_min)}
            {u.temp}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <WeatherMetric
          icon={Droplets}
          label="Humidity"
          value={`${weather.humidity}%`}
        />
        {weather.wind && (
          <WeatherMetric
            icon={Wind}
            label="Wind"
            value={`${weather.wind.speed} ${u.speed}`}
            subValue={getWindDirection(weather.wind.deg)}
          />
        )}
        {visibility && (
          <WeatherMetric icon={Eye} label="Visibility" value={visibility} />
        )}
        {weather.wind?.gust != null && (
          <WeatherMetric
            icon={Compass}
            label="Gusts"
            value={`${weather.wind.gust} ${u.speed}`}
          />
        )}
      </div>

      <p className="text-xs text-white/40">
        Updated{" "}
        {new Date(weather.timestamp).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
