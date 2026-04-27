import { Cloud, CloudRain, Sun, CloudSnow, CloudFog, Zap, CloudDrizzle } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";

const iconFor = (code: number) => {
  if (code === 0) return Sun;
  if ([1, 2, 3].includes(code)) return Cloud;
  if ([45, 48].includes(code)) return CloudFog;
  if ([51, 53, 55, 56, 57].includes(code)) return CloudDrizzle;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return CloudRain;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return CloudSnow;
  if ([95, 96, 99].includes(code)) return Zap;
  return Cloud;
};

export function WeatherWidget() {
  const { data, error, loading, condition } = useWeather();
  const Icon = data ? iconFor(data.code) : Cloud;

  return (
    <div className="w-full min-w-0 h-full min-h-0 flex flex-col">
      <div className="text-xs uppercase tracking-widest text-muted-foreground shrink-0">Weather</div>
      {loading && <div className="text-sm mt-3 text-muted-foreground">Loading…</div>}
      {error && <div className="text-sm mt-3 text-destructive">Offline</div>}
      {data && (
        <>
          <div className="flex items-center gap-2 sm:gap-3 mt-2 min-w-0 shrink-0">
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary shrink-0" />
            <div className="text-[clamp(1.25rem,4vmin,1.875rem)] font-light tabular-nums min-w-0">{data.temp}°</div>
          </div>
          <div className="text-xs text-muted-foreground mt-1 min-w-0 break-words">{condition} · {data.city}</div>
        </>
      )}
    </div>
  );
}
