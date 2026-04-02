import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { WeatherUnits } from "@robiscoding/shared";

const UNIT_OPTIONS: { value: WeatherUnits; label: string }[] = [
  { value: "metric", label: "Metric (°C)" },
  { value: "imperial", label: "Imperial (°F)" },
  { value: "standard", label: "Standard (K)" },
];

export function WeatherUnitsSelect({
  units,
  onUnitsChange,
  className,
}: {
  units: WeatherUnits;
  onUnitsChange: (u: WeatherUnits) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor="weather-units" className="text-white/80">
        Units
      </Label>
      <Select
        value={units}
        onValueChange={(v) => onUnitsChange(v as WeatherUnits)}
      >
        <SelectTrigger
          id="weather-units"
          className={cn(
            "w-full border-white/30 bg-white/15 text-white shadow-sm backdrop-blur-sm",
            "hover:bg-white/20 focus-visible:border-white/60 focus-visible:ring-white/35",
            "data-placeholder:text-white/60 [&_svg]:text-white/70",
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {UNIT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
