import { useCallback, useRef, useState } from "react";

interface ResizeOpts {
  onResize: (next: { x: number; y: number; w: number; h: number }) => void;
  getStart: () => { x: number; y: number; w: number; h: number };
  min?: { w: number; h: number };
  disabled?: boolean;
  edgeThreshold?: number;
}

export function useResize({
  onResize,
  getStart,
  min = { w: 360, h: 260 },
  disabled,
  edgeThreshold = 10,
}: ResizeOpts) {
  const optsRef = useRef({ onResize, getStart, min, disabled, edgeThreshold });
  optsRef.current = { onResize, getStart, min, disabled, edgeThreshold };
  const [cursor, setCursor] = useState<string | null>(null);

  const dragging = useRef(false);
  const startRef = useRef({
    sx: 0,
    sy: 0,
    ox: 0,
    oy: 0,
    ow: 0,
    oh: 0,
    left: false,
    right: false,
    top: false,
    bottom: false,
  });
  const capRef = useRef<{ el: HTMLElement; id: number } | null>(null);

  const getResizeCursor = useCallback((left: boolean, right: boolean, top: boolean, bottom: boolean) => {
    if ((left && top) || (right && bottom)) return "nwse-resize";
    if ((right && top) || (left && bottom)) return "nesw-resize";
    if (left || right) return "ew-resize";
    if (top || bottom) return "ns-resize";
    return null;
  }, []);

  const getEdges = useCallback((target: HTMLElement, clientX: number, clientY: number) => {
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const t = optsRef.current.edgeThreshold;

    return {
      left: x <= t,
      right: x >= rect.width - t,
      top: y <= t,
      bottom: y >= rect.height - t,
    };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const o = optsRef.current;
    if (o.disabled || dragging.current) {
      setCursor(null);
      return;
    }

    const { left, right, top, bottom } = getEdges(e.currentTarget as HTMLElement, e.clientX, e.clientY);
    setCursor(getResizeCursor(left, right, top, bottom));
  }, [getEdges, getResizeCursor]);

  const onPointerLeave = useCallback(() => {
    if (!dragging.current) setCursor(null);
  }, []);

  const tryPointerDown = useCallback((e: React.PointerEvent): boolean => {
    const o = optsRef.current;
    if (o.disabled) return false;
    const { left, right, top, bottom } = getEdges(e.currentTarget as HTMLElement, e.clientX, e.clientY);
    if (!left && !right && !top && !bottom) return false;

    e.stopPropagation();
    e.preventDefault();
    const s = o.getStart();
    dragging.current = true;
    startRef.current = {
      sx: e.clientX,
      sy: e.clientY,
      ox: s.x,
      oy: s.y,
      ow: s.w,
      oh: s.h,
      left,
      right,
      top,
      bottom,
    };
    setCursor(getResizeCursor(left, right, top, bottom));
    const el = e.currentTarget as HTMLElement;
    capRef.current = { el, id: e.pointerId };
    el.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) => {
      if (!dragging.current) return;
      const { min: m, onResize: onR } = optsRef.current;
      const st = startRef.current;
      const dx = ev.clientX - st.sx;
      const dy = ev.clientY - st.sy;
      let nextW = st.ow;
      let nextH = st.oh;
      let nextX = st.ox;
      let nextY = st.oy;

      if (st.right) {
        nextW = Math.max(m.w, st.ow + dx);
      }
      if (st.bottom) {
        nextH = Math.max(m.h, st.oh + dy);
      }
      if (st.left) {
        nextW = Math.max(m.w, st.ow - dx);
        nextX = st.ox + (st.ow - nextW);
      }
      if (st.top) {
        nextH = Math.max(m.h, st.oh - dy);
        nextY = st.oy + (st.oh - nextH);
      }

      onR({ x: nextX, y: nextY, w: nextW, h: nextH });
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
      setCursor(null);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return true;
  }, [getEdges, getResizeCursor]);

  return { tryPointerDown, onPointerMove, onPointerLeave, cursor };
}
