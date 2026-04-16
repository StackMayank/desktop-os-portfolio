import { useEffect, useRef, type ReactNode } from "react";
import { usePersistedPosition } from "@/hooks/usePersistedPosition";
import { useDrag } from "@/hooks/useDrag";

interface Props {
  id: string;
  initial: { x: number; y: number };
  children: ReactNode;
  className?: string;
  isMobile: boolean;
}

export function Widget({ id, initial, children, className = "", isMobile }: Props) {
  const [pos, setPos] = usePersistedPosition(`widget:${id}`, initial);
  const posRef = useRef(pos);
  posRef.current = pos;

  const drag = useDrag({
    disabled: isMobile,
    getStart: () => posRef.current,
    onMove: (x, y) => setPos({ x: Math.max(8, x), y: Math.max(36, y) }),
  });

  useEffect(() => {
    if (isMobile) return;
    const onResize = () => {
      setPos((p) => ({
        x: Math.min(p.x, window.innerWidth - 220),
        y: Math.min(p.y, window.innerHeight - 200),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setPos, isMobile]);

  if (isMobile) {
    return <div className={`glass rounded-2xl p-4 ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`absolute glass rounded-2xl p-4 cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ left: pos.x, top: pos.y, zIndex: 5 }}
      onPointerDown={drag.onPointerDown}
      onPointerMove={drag.onPointerMove}
      onPointerUp={drag.onPointerUp}
    >
      {children}
    </div>
  );
}
