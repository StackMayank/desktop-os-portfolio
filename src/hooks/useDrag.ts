import { useCallback, useRef } from "react";

interface DragOpts {
  onMove: (x: number, y: number) => void;
  onStart?: () => void;
  getStart: () => { x: number; y: number };
  disabled?: boolean;
}

export function useDrag({ onMove, onStart, getStart, disabled }: DragOpts) {
  const stateRef = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      const start = getStart();
      stateRef.current = { active: true, sx: e.clientX, sy: e.clientY, ox: start.x, oy: start.y };
      onStart?.();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [disabled, getStart, onStart]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const s = stateRef.current;
      if (!s.active) return;
      onMove(s.ox + e.clientX - s.sx, s.oy + e.clientY - s.sy);
    },
    [onMove]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    stateRef.current.active = false;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
