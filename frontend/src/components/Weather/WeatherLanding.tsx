import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface WeatherLandingProps {
  locationQuery: string;
  isLoading: boolean;
  error?: string | null;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function WeatherLanding({
  locationQuery,
  isLoading,
  error,
  onChange,
  onSubmit,
}: WeatherLandingProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      {error && (
        <Alert variant="destructive" className="bg-white/10 border-red-300/60 text-white *:data-[slot=alert-description]:text-white/90">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={onSubmit} className="flex gap-2">
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
    </div>
  );
}
