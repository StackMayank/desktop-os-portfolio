import wallpaper from "@/assets/11-0-Color-Day.jpg";

/**
 * macOS Big Sur 11.0 Color (Day) — full-bleed, no overlays.
 * Replace src/assets/11-0-Color-Day.jpg to change.
 */
export function DesktopBackground() {
  return (
    <img
      src={wallpaper}
      alt=""
      aria-hidden
      draggable={false}
      fetchPriority="high"
      decoding="async"
      className="absolute inset-0 z-0 h-full w-full max-w-none object-cover object-center pointer-events-none select-none"
    />
  );
}
