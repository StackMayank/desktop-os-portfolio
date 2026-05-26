import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePersistedFrame, type WidgetFrame } from "@/hooks/usePersistedFrame";
import { useDrag } from "@/hooks/useDrag";
import { useResize } from "@/hooks/useResize";

interface Props {
  id: string;
  initial: WidgetFrame;
  min?: { w: number; h: number };
  children: ReactNode;
  className?: string;
  isMobile: boolean;
}

export function Widget({
  id,
  initial,
  min = { w: 160, h: 100 },
  children,
  className = "",
  isMobile,
}: Props) {
  const [frame, setFrame, setFrameQuiet] = usePersistedFrame(`widget:${id}`, initial);
  const frameRef = useRef(frame);
  frameRef.current = frame;

  const drag = useDrag({
    disabled: isMobile,
    getStart: () => ({ x: frameRef.current.x, y: frameRef.current.y }),
    onMove: (x, y) =>
      setFrame((f) => ({
        ...f,
        x: Math.max(8, x),
        y: Math.max(36, y),
      })),
  });

  const resize = useResize({
    disabled: isMobile,
    getStart: () => ({ x: frameRef.current.x, y: frameRef.current.y, w: frameRef.current.w, h: frameRef.current.h }),
    onResize: ({ x, y, w, h }) => setFrame((f) => ({ ...f, x, y, w, h })),
    min,
  });

  useLayoutEffect(() => {
    if (isMobile) return;
    setFrameQuiet((f) => {
      const w = Math.max(f.w, min.w);
      const h = Math.max(f.h, min.h);
      if (w === f.w && h === f.h) return f;
      return { ...f, w, h };
    });
  }, [isMobile, min.w, min.h, setFrameQuiet]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (resize.tryPointerDown(e)) return;
      drag.onPointerDown(e);
    },
    [resize, drag]
  );

  useEffect(() => {
    if (isMobile) return;
    const clamp = () => {
      setFrameQuiet((f) => {
        const maxX = Math.max(8, window.innerWidth - f.w - 8);
        const maxY = Math.max(36, window.innerHeight - f.h - 100);
        const nx = Math.min(Math.max(8, f.x), maxX);
        const ny = Math.min(Math.max(36, f.y), maxY);
        if (nx === f.x && ny === f.y) return f;
        return { ...f, x: nx, y: ny };
      });
    };
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [setFrameQuiet, isMobile]);

  if (isMobile) {
    return <div className={`glass widget-panel p-4 ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`absolute glass widget-panel flex flex-col z-5 min-w-0 min-h-0 cursor-grab active:cursor-grabbing ${className}`}
      style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h, ...(resize.cursor ? { cursor: resize.cursor } : {}) }}
      onPointerDown={handlePointerDown}
      onPointerMove={resize.onPointerMove}
      onPointerLeave={resize.onPointerLeave}
    >
      <div
        className={`flex-1 min-h-0 min-w-0 flex flex-col justify-start items-stretch ${
          id === "calendar"
            ? "p-3 overflow-hidden scrollbar-hidden"
            : id === "weather"
              ? "p-3 overflow-hidden"
              : "p-3 overflow-auto"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
