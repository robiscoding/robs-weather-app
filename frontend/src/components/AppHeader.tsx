import { CloudSun } from "lucide-react";

export function AppHeader() {
  return (
    <div className="text-center mb-4 flex flex-col items-center gap-3">
      <div className="bg-white/20 rounded-full p-4">
        <CloudSun className="w-10 h-10 text-white" />
      </div>
      <div>
        <h1 className="text-white text-3xl font-bold tracking-tight">
          Rob's Weather App
        </h1>
        <p className="text-white/70 text-sm mt-2 leading-relaxed">
          Provides weather information and forecasts for your location
        </p>
      </div>
    </div>
  );
}
