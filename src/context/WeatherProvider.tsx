import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchWeatherData, type Weather } from "@/lib/weatherApi";

export type { Weather };

const codeToText = (c: number): string => {
  if (c === 0) return "Clear";
  if ([1, 2].includes(c)) return "Partly cloudy";
  if (c === 3) return "Overcast";
  if ([45, 48].includes(c)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(c)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(c)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(c)) return "Snow";
  if ([95, 96, 99].includes(c)) return "Thunder";
  return "Unknown";
};

interface WeatherValue {
  data: Weather | null;
  error: string | null;
  loading: boolean;
  condition: string;
}

const WeatherContext = createContext<WeatherValue | null>(null);

const HYDERABAD = { lat: 17.385, lon: 78.4867, city: "Hyderabad" };

function useWeatherFetch(): WeatherValue {
  const [data, setData] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async (showLoading: boolean) => {
      if (showLoading) setLoading(true);
      try {
        const result = await fetchWeatherData(
          HYDERABAD.lat,
          HYDERABAD.lon,
          HYDERABAD.city
        );
        if (cancelled) return;
        setData(result);
        setError(null);
      } catch {
        if (cancelled) return;
        setError("unavailable");
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load(true);
    const id = setInterval(() => void load(false), 10 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return useMemo(
    () => ({
      data,
      error,
      loading,
      condition: data ? codeToText(data.code) : "",
    }),
    [data, error, loading]
  );
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const value = useWeatherFetch();
  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) {
    throw new Error("useWeather must be used within WeatherProvider");
  }
  return ctx;
}
