import { useEffect, useState } from "react";

export interface Weather {
  temp: number;
  code: number;
  city: string;
  isDay: boolean;
}

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

export function useWeather(lat = 28.6139, lon = 77.209, city = "New Delhi") {
  const [data, setData] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchIt = async () => {
      try {
        setLoading(true);
        const r = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`
        );
        if (!r.ok) throw new Error("Network");
        const j = await r.json();
        if (cancelled) return;
        setData({
          temp: Math.round(j.current.temperature_2m),
          code: j.current.weather_code,
          city,
          isDay: j.current.is_day === 1,
        });
        setError(null);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchIt();
    const id = setInterval(fetchIt, 10 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [lat, lon, city]);

  return { data, error, loading, condition: data ? codeToText(data.code) : "" };
}
