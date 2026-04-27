import { useCallback, useRef } from "react";

interface DragOpts {
  onMove: (x: number, y: number) => void;
  onStart?: () => void;
  getStart: () => { x: number; y: number };
  disabled?: boolean;
}

export function useDrag({ onMove, onStart, getStart, disabled }: DragOpts) {
  const optsRef = useRef({ onMove, getStart, onStart, disabled });
  optsRef.current = { onMove, getStart, onStart, disabled };

  const dragging = useRef(false);
  const startRef = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 });
  const capRef = useRef<{ el: HTMLElement; id: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const { disabled: d, getStart: gs, onMove: om, onStart: os } = optsRef.current;
    if (d) return;
    e.stopPropagation();
    const start = gs();
    dragging.current = true;
    startRef.current = { sx: e.clientX, sy: e.clientY, ox: start.x, oy: start.y };
    os?.();
    const el = e.currentTarget as HTMLElement;
    capRef.current = { el, id: e.pointerId };
    el.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) => {
      if (!dragging.current) return;
      const st = startRef.current;
      optsRef.current.onMove(st.ox + ev.clientX - st.sx, st.oy + ev.clientY - st.sy);
    };

    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      const c = capRef.current;
      capRef.current = null;
      if (c) {
        try {
          c.el.releasePointerCapture(c.id);
        } catch {
          /* noop */
        }
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }, []);

  return { onPointerDown };
}
