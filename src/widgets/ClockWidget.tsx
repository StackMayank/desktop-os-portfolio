import { useEffect, useRef, useState } from "react";

export function ClockWidget() {
  const [now, setNow] = useState(new Date());
  const [isLarge, setIsLarge] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setIsLarge(width >= 190 || height >= 160);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const time = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    ...(isLarge ? { second: "2-digit" } : {}),
  });
  const date = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone?.replace("_", " ") ?? "Local Time";

  return (
    <div ref={rootRef} className="w-full min-w-0 flex flex-col justify-start">
      <div className="text-xs uppercase tracking-widest text-white/80 shrink-0">New Delhi</div>
      <div
        className={`font-light tabular-nums mt-2 leading-none shrink-0 transition-all duration-200 ${
          isLarge ? "text-[clamp(1.65rem,5.6vmin,2.6rem)] text-glow" : "text-[clamp(1.5rem,5vmin,2.25rem)] text-glow"
        }`}
      >
        {time}
      </div>
      <div className="text-xs text-white/70 mt-1 min-w-0 shrink-0 wrap-break-word">{date}</div>
      {isLarge && (
        <div className="text-[11px] text-white/60 mt-2 tracking-wide uppercase">{zone}</div>
      )}
    </div>
  );
}
