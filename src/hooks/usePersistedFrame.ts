import { useEffect, useRef, useState, type SetStateAction } from "react";
import {
  WIDGET_LAYOUT_VERSION,
  WIDGET_LAYOUT_VERSION_KEY,
} from "@/lib/widgetLayout";

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

function readStoredFrame(storageKey: string, initial: WidgetFrame): WidgetFrame {
  if (typeof window === "undefined") return initial;
  try {
    const layoutVersion = localStorage.getItem(WIDGET_LAYOUT_VERSION_KEY);
    if (layoutVersion !== String(WIDGET_LAYOUT_VERSION)) {
      return initial;
    }
    const raw = localStorage.getItem(storageKey);
    if (raw) return parseFrame(raw, initial);
  } catch {
    /* noop */
  }
  return initial;
}

/** Persists widget position/size after user drag/resize only. */
export function usePersistedFrame(storageKey: string, initial: WidgetFrame) {
  const [frame, setFrameState] = useState<WidgetFrame>(() =>
    readStoredFrame(storageKey, initial)
  );
  const userMovedRef = useRef(false);

  const setFrame = (action: SetStateAction<WidgetFrame>) => {
    userMovedRef.current = true;
    setFrameState(action);
  };

  const setFrameQuiet = (action: SetStateAction<WidgetFrame>) => {
    setFrameState(action);
  };

  useEffect(() => {
    if (!userMovedRef.current) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(frame));
      localStorage.setItem(WIDGET_LAYOUT_VERSION_KEY, String(WIDGET_LAYOUT_VERSION));
    } catch {
      /* noop */
    }
  }, [storageKey, frame]);

  return [frame, setFrame, setFrameQuiet] as const;
}
