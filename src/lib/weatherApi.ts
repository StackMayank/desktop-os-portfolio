export interface Weather {
  temp: number;
  code: number;
  city: string;
  isDay: boolean;
}

const OPEN_METEO =
  "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code,is_day&timezone=Asia%2FKolkata";

const FETCH_OPTS: RequestInit = {
  cache: "no-store",
  headers: { Accept: "application/json" },
};

/** Map WorldWeatherOnline / wttr codes → WMO-style codes for icons */
const WTTR_TO_WMO: Record<number, number> = {
  113: 0,
  116: 2,
  119: 3,
  122: 3,
  143: 45,
  248: 45,
  176: 61,
  263: 61,
  266: 61,
  281: 65,
  284: 65,
  293: 63,
  296: 63,
  299: 65,
  302: 65,
  305: 65,
  308: 65,
  311: 56,
  314: 57,
  317: 57,
  320: 57,
  323: 71,
  326: 71,
  329: 73,
  332: 73,
  335: 75,
  338: 75,
  350: 71,
  353: 80,
  356: 81,
  359: 82,
  362: 66,
  365: 67,
  368: 66,
  371: 67,
  374: 95,
  377: 96,
  386: 95,
  389: 99,
  392: 96,
  395: 99,
};

function mapWttrCode(code: number): number {
  return WTTR_TO_WMO[code] ?? 3;
}

function parseOpenMeteo(json: unknown, city: string): Weather {
  const j = json as {
    current?: {
      temperature_2m?: number;
      weather_code?: number;
      is_day?: number;
    };
  };
  const cur = j.current;
  if (cur?.temperature_2m == null || cur.weather_code == null) {
    throw new Error("Invalid Open-Meteo response");
  }
  return {
    temp: Math.round(cur.temperature_2m),
    code: cur.weather_code,
    city,
    isDay: cur.is_day === 1,
  };
}

function parseWttr(json: unknown, fallbackCity: string): Weather {
  const j = json as {
    current_condition?: Array<{
      temp_C?: string;
      weatherCode?: string;
      weatherDesc?: Array<{ value?: string }>;
    }>;
    nearest_area?: Array<{
      areaName?: Array<{ value?: string }>;
    }>;
  };
  const cur = j.current_condition?.[0];
  if (!cur?.temp_C) throw new Error("Invalid wttr.in response");
  const wttrCode = Number.parseInt(cur.weatherCode ?? "119", 10);
  const city =
    j.nearest_area?.[0]?.areaName?.[0]?.value?.trim() || fallbackCity;
  return {
    temp: Number.parseInt(cur.temp_C, 10),
    code: mapWttrCode(wttrCode),
    city,
    isDay: true,
  };
}

async function fetchOpenMeteo(lat: number, lon: number, city: string): Promise<Weather> {
  const url = OPEN_METEO.replace("{lat}", String(lat)).replace("{lon}", String(lon));
  const r = await fetch(url, FETCH_OPTS);
  if (!r.ok) throw new Error(`Open-Meteo HTTP ${r.status}`);
  const json = await r.json();
  return parseOpenMeteo(json, city);
}

async function fetchWttr(city: string): Promise<Weather> {
  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
  const r = await fetch(url, {
    ...FETCH_OPTS,
    headers: {
      ...FETCH_OPTS.headers,
      "User-Agent": "portfolio-os/1.0 (desktop weather widget)",
    },
  });
  if (!r.ok) throw new Error(`wttr.in HTTP ${r.status}`);
  const json = await r.json();
  return parseWttr(json, city);
}

export async function fetchWeatherData(
  lat: number,
  lon: number,
  city: string
): Promise<Weather> {
  try {
    return await fetchOpenMeteo(lat, lon, city);
  } catch {
    return await fetchWttr(city);
  }
}
