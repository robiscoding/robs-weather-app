import type { LucideIcon } from "lucide-react";

type WeatherMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
};

export function WeatherMetric({ icon: Icon, label, value, subValue }: WeatherMetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 transition-colors hover:bg-white/15">
      <div className="shrink-0 rounded-xl bg-white/15 p-2.5">
        <Icon className="h-5 w-5 text-white/90" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold text-white/50 uppercase tracking-widest">{label}</p>
        <p className="text-lg font-semibold text-white leading-tight">{value}</p>
        {subValue && <p className="text-xs text-white/50">{subValue}</p>}
      </div>
    </div>
  );
}
