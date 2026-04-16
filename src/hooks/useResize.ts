import { useCallback, useRef } from "react";

interface ResizeOpts {
  onResize: (w: number, h: number) => void;
  getStart: () => { w: number; h: number };
  min?: { w: number; h: number };
}

export function useResize({ onResize, getStart, min = { w: 360, h: 260 } }: ResizeOpts) {
  const stateRef = useRef({ active: false, sx: 0, sy: 0, ow: 0, oh: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      const s = getStart();
      stateRef.current = { active: true, sx: e.clientX, sy: e.clientY, ow: s.w, oh: s.h };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getStart]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const s = stateRef.current;
      if (!s.active) return;
      onResize(Math.max(min.w, s.ow + e.clientX - s.sx), Math.max(min.h, s.oh + e.clientY - s.sy));
    },
    [onResize, min.w, min.h]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    stateRef.current.active = false;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
