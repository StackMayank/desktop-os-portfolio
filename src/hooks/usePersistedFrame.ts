import { useEffect, useState } from "react";

export interface WidgetFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

function parseFrame(raw: string, initial: WidgetFrame): WidgetFrame {
  try {
    const p = JSON.parse(raw) as Partial<WidgetFrame>;
    return {
      x: typeof p.x === "number" ? p.x : initial.x,
      y: typeof p.y === "number" ? p.y : initial.y,
      w: typeof p.w === "number" ? p.w : initial.w,
      h: typeof p.h === "number" ? p.h : initial.h,
    };
  } catch {
    return initial;
  }
}

/** Persists widget position and size (localStorage). Migrates legacy `{x,y}` saves. */
export function usePersistedFrame(storageKey: string, initial: WidgetFrame) {
  const [frame, setFrame] = useState<WidgetFrame>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return parseFrame(raw, initial);
    } catch {
      /* noop */
    }
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(frame));
    } catch {
      /* noop */
    }
  }, [storageKey, frame]);

  return [frame, setFrame] as const;
}
