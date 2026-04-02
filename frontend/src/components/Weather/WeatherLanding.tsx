import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WeatherLandingProps {
  locationQuery: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function WeatherLanding({
  locationQuery,
  isLoading,
  onChange,
  onSubmit,
}: WeatherLandingProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 w-full max-w-sm">
      <Input
        type="text"
        placeholder="e.g. Charlotte, NC"
        value={locationQuery}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/50"
      />
      <Button
        type="submit"
        disabled={isLoading || !locationQuery.trim()}
        className="bg-white text-blue-600 hover:bg-white/90 font-semibold shrink-0"
      >
        {isLoading ? "Loading..." : "Get Weather"}
      </Button>
    </form>
  );
}
