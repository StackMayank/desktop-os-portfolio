import { memo, useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useLayoutFrame, type WidgetFrame } from "@/hooks/useLayoutFrame";
import { useDrag } from "@/hooks/useDrag";
import { useResize } from "@/hooks/useResize";
import { clampWidgetFrame } from "@/lib/widgetLayout";

interface Props {
  id: string;
  initial: WidgetFrame;
  min?: { w: number; h: number };
  children: ReactNode;
  className?: string;
  isMobile: boolean;
  /** Desktop only — when false, widget can be dragged but not resized */
  resizable?: boolean;
  /** When false, layout resets to `initial` on every visit (canonical desktop for all visitors) */
  persistLayout?: boolean;
}

function WidgetComponent({
  id,
  initial,
  min = { w: 160, h: 100 },
  children,
  className = "",
  isMobile,
  resizable = true,
  persistLayout = false,
}: Props) {
  const [frame, setFrame, setFrameQuiet] = useLayoutFrame(
    initial,
    persistLayout ? `widget:${id}` : undefined
  );
  const frameRef = useRef(frame);
  frameRef.current = frame;

  useLayoutEffect(() => {
    if (persistLayout || isMobile) return;
    setFrameQuiet(initial);
  }, [initial.x, initial.y, initial.w, initial.h, persistLayout, isMobile, setFrameQuiet, initial]);

  const drag = useDrag({
    disabled: isMobile,
    getStart: () => ({ x: frameRef.current.x, y: frameRef.current.y }),
    onMove: (x, y) =>
      setFrame((f) => clampWidgetFrame({ ...f, x, y })),
  });

  const resize = useResize({
    disabled: isMobile || !resizable,
    getStart: () => ({ x: frameRef.current.x, y: frameRef.current.y, w: frameRef.current.w, h: frameRef.current.h }),
    onResize: ({ x, y, w, h }) => setFrame((f) => clampWidgetFrame({ ...f, x, y, w, h })),
    min,
  });

  useLayoutEffect(() => {
    if (isMobile) return;
    if (!resizable) {
      setFrameQuiet((f) => {
        if (f.w === initial.w && f.h === initial.h) return f;
        return { ...f, w: initial.w, h: initial.h };
      });
      return;
    }
    setFrameQuiet((f) => {
      const w = Math.max(f.w, min.w);
      const h = Math.max(f.h, min.h);
      if (w === f.w && h === f.h) return f;
      return { ...f, w, h };
    });
  }, [isMobile, resizable, initial.w, initial.h, min.w, min.h, setFrameQuiet]);

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
        const next = clampWidgetFrame(f);
        if (next.x === f.x && next.y === f.y && next.w === f.w && next.h === f.h) return f;
        return next;
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
      data-desktop-enter="widget"
      className={`absolute glass widget-panel flex flex-col z-5 min-w-0 min-h-0 cursor-grab active:cursor-grabbing ${className}`}
      style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h, ...(resize.cursor ? { cursor: resize.cursor } : {}) }}
      onPointerDown={handlePointerDown}
      onPointerMove={resizable ? resize.onPointerMove : undefined}
      onPointerLeave={resizable ? resize.onPointerLeave : undefined}
    >
      <div
        className={`flex-1 min-h-0 min-w-0 flex flex-col justify-start items-stretch ${
          id === "calendar"
            ? "p-3 overflow-hidden scrollbar-hidden"
            : id === "weather"
              ? "p-3 overflow-hidden"
              : id === "clock"
                ? "px-3 pt-3 pb-[7px] overflow-hidden"
                : "p-3 overflow-auto"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export const Widget = memo(WidgetComponent);
