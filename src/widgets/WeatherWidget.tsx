import { memo } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, CloudFog, Zap, CloudDrizzle } from "lucide-react";
import { useWeather } from "@/context/WeatherProvider";

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

function WeatherWidgetComponent() {
  const { data, error, loading, condition } = useWeather();
  const Icon = data ? iconFor(data.code) : Cloud;

  return (
    <div className="w-full min-w-0 flex flex-col justify-start">
      <div className="widget-header shrink-0">Weather</div>
      {loading && (
        <p className="text-xs text-white/70 mt-2 leading-snug">Loading…</p>
      )}
      {error && (
        <p className="text-xs text-destructive mt-2 leading-snug">Offline</p>
      )}
      {data && (
        <>
          <div className="flex items-center gap-2 mt-2 shrink-0">
            <Icon className="w-7 h-7 text-widget-accent shrink-0" strokeWidth={1.75} />
            <span className="font-light tabular-nums leading-none text-glow text-[clamp(1.5rem,5vmin,2.25rem)]">
              {data.temp}°
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1 min-w-0 leading-snug truncate">
            {condition} · {data.city}
          </p>
        </>
      )}
    </div>
  );
}

export const WeatherWidget = memo(WeatherWidgetComponent);
