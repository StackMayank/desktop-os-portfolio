import { useEffect, useRef, type ReactNode } from "react";
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
  dragAnywhere?: boolean;
}

export function Widget({
  id,
  initial,
  min = { w: 160, h: 100 },
  children,
  className = "",
  isMobile,
  dragAnywhere = false,
}: Props) {
  const [frame, setFrame] = usePersistedFrame(`widget:${id}`, initial);
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

  useEffect(() => {
    if (isMobile) return;
    const clamp = () => {
      setFrame((f) => {
        const maxX = Math.max(8, window.innerWidth - f.w - 8);
        const maxY = Math.max(36, window.innerHeight - f.h - 100);
        return {
          ...f,
          x: Math.min(Math.max(8, f.x), maxX),
          y: Math.min(Math.max(36, f.y), maxY),
        };
      });
    };
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [setFrame, isMobile]);

  if (isMobile) {
    return <div className={`glass rounded-2xl p-4 ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`absolute glass rounded-2xl overflow-hidden flex flex-col z-5 min-w-0 min-h-0 cursor-grab active:cursor-grabbing ${className}`}
      style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h, ...(resize.cursor ? { cursor: resize.cursor } : {}) }}
      onPointerDown={resize.onPointerDown}
      onPointerMove={resize.onPointerMove}
      onPointerLeave={resize.onPointerLeave}
    >
      {!dragAnywhere && (
        <div
          className="absolute inset-x-0 top-0 h-7 z-10 touch-none select-none cursor-grab active:cursor-grabbing"
          onPointerDown={drag.onPointerDown}
        />
      )}
      <div
        className={`flex-1 min-h-0 min-w-0 p-3 overflow-auto ${dragAnywhere ? "touch-none select-none cursor-grab active:cursor-grabbing" : ""}`}
        onPointerDown={dragAnywhere ? drag.onPointerDown : undefined}
      >
        {children}
      </div>
    </div>
  );
}
