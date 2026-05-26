import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useOS, type AppId } from "@/store/osStore";
import { DockAppIcon, getDockAppLabel } from "@/components/dock/DockAppIcon";

const APP_IDS: AppId[] = [
  "about",
  "docs",
  "skills",
  "experience",
  "contact",
  "music",
  "game",
  "terminal",
];

/** Mobile dock viewport: ~4 icons visible, wider pill centered on screen */
const MOBILE_DOCK_STYLE = {
  width: "min(calc(100vw - 1.5rem), 22rem)",
} as const;

const PEAK_RADIUS = 34;
const NEIGHBOR_RADIUS = 76;
const MAX_SCALE = 1.55;
const NEIGHBOR_SCALE = 1.14;
const MAX_LIFT = -14;
const NEIGHBOR_LIFT = -5;

function magnificationAt(distance: number) {
  if (distance >= NEIGHBOR_RADIUS) return { scale: 1, lift: 0 };
  if (distance < PEAK_RADIUS) {
    const t = 1 - distance / PEAK_RADIUS;
    const eased = t * t;
    return {
      scale: 1 + eased * (MAX_SCALE - 1),
      lift: eased * MAX_LIFT,
    };
  }
  const t = 1 - (distance - PEAK_RADIUS) / (NEIGHBOR_RADIUS - PEAK_RADIUS);
  const eased = t * t;
  return {
    scale: 1 + eased * (NEIGHBOR_SCALE - 1),
    lift: eased * NEIGHBOR_LIFT,
  };
}

function DockButton({
  id,
  isMobile,
  isOpen,
  showTooltip,
  onClick,
  setMagnifyRef,
}: {
  id: AppId;
  isMobile: boolean;
  isOpen: boolean;
  showTooltip?: boolean;
  onClick: () => void;
  setMagnifyRef: (el: HTMLDivElement | null) => void;
}) {
  const label = getDockAppLabel(id);
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative shrink-0 touch-manipulation active:opacity-80 flex flex-col items-center justify-end"
      aria-label={label}
    >
      {!isMobile && (
        <span
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 text-[11px] font-medium px-2 py-0.5 rounded-lg glass-soft whitespace-nowrap pointer-events-none text-foreground/95 transition-opacity duration-150 ${
            showTooltip ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </span>
      )}
      <div ref={isMobile ? undefined : setMagnifyRef} className="dock-magnify-root">
        <DockAppIcon id={id} size={isMobile ? "sm" : "md"} />
      </div>
      {isOpen && (
        <span className="mt-0.5 w-1 h-1 rounded-full bg-white/90 shrink-0" aria-hidden />
      )}
    </button>
  );
}

export function Dock({ isMobile }: { isMobile: boolean }) {
  const openApp = useOS((s) => s.openApp);
  const focusApp = useOS((s) => s.focusApp);
  const windows = useOS((s) => s.windows);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const centersRef = useRef<number[]>([]);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const isAppOpen = (id: AppId) =>
    id === "docs" ? windows.docs.isOpen || windows.preview.isOpen : windows[id].isOpen;

  const measureCenters = useCallback(() => {
    centersRef.current = itemsRef.current.map((el) => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return r.left + r.width / 2;
    });
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    const raf = requestAnimationFrame(measureCenters);
    window.addEventListener("resize", measureCenters);

    const onMove = (e: PointerEvent) => {
      const mouseX = e.clientX;
      let peakIndex: number | null = null;
      let peakDist = PEAK_RADIUS;

      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        const center = centersRef.current[i] ?? 0;
        const dist = Math.abs(mouseX - center);
        const { scale, lift } = magnificationAt(dist);
        gsap.to(el, {
          scale,
          y: lift,
          duration: 0.2,
          ease: "power3.out",
          overwrite: "auto",
          force3D: true,
        });
        if (dist < peakDist) {
          peakDist = dist;
          peakIndex = i;
        }
      });

      setTooltipIndex(peakIndex);
    };

    const onLeave = () => {
      setTooltipIndex(null);
      itemsRef.current.forEach((el) =>
        el &&
          gsap.to(el, { scale: 1, y: 0, duration: 0.3, ease: "power3.out", overwrite: "auto", force3D: true })
      );
      requestAnimationFrame(measureCenters);
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measureCenters);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [isMobile, measureCenters]);

  const handleClick = (id: AppId) => {
    if (id === "contact") {
      window.open("https://wa.link/pf9ivh", "_blank", "noopener,noreferrer");
      return;
    }

    if (id === "docs") {
      const docsWin = windows.docs;
      const previewWin = windows.preview;
      if (previewWin.isOpen && !previewWin.isMinimized) {
        focusApp("preview");
        if (!docsWin.isOpen) openApp("docs");
        return;
      }
      if (docsWin.isOpen && !docsWin.isMinimized) {
        openApp("preview");
        return;
      }
      openApp("docs");
      return;
    }

    const w = windows[id];
    if (w.isOpen && !w.isMinimized) focusApp(id);
    else openApp(id);
  };

  const renderIcon = (id: AppId, index: number) => (
    <DockButton
      key={id}
      id={id}
      isMobile={isMobile}
      isOpen={isAppOpen(id)}
      showTooltip={!isMobile && tooltipIndex === index}
      onClick={() => handleClick(id)}
      setMagnifyRef={(el) => {
        itemsRef.current[index] = el;
      }}
    />
  );

  return (
    <div
      className={`fixed z-40 pointer-events-none overflow-visible ${
        isMobile
          ? "bottom-0 left-0 right-0 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-center items-end px-3"
          : "bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center justify-end pt-5"
      }`}
    >
      <div
        ref={containerRef}
        className={`pointer-events-auto glass ${
          isMobile
            ? "rounded-[24px] py-2.5 overflow-hidden mx-auto flex items-center justify-center"
            : "rounded-[24px] px-3 py-2.5 flex items-end gap-2 overflow-visible"
        }`}
        style={isMobile ? MOBILE_DOCK_STYLE : undefined}
      >
        {isMobile ? (
          <div
            ref={scrollRef}
            className="dock-scroll flex items-center justify-start gap-2.5 overflow-x-auto scrollbar-hidden px-3 py-1 w-full"
          >
            {APP_IDS.map((id, i) => renderIcon(id, i))}
          </div>
        ) : (
          APP_IDS.map((id, i) => renderIcon(id, i))
        )}
      </div>
    </div>
  );
}
