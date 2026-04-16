import { useEffect, useState } from "react";

export function usePersistedPosition(key: string, initial: { x: number; y: number }) {
  const [pos, setPos] = useState(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as { x: number; y: number };
    } catch { /* noop */ }
    return initial;
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(pos)); } catch { /* noop */ }
  }, [key, pos]);
  return [pos, setPos] as const;
}
