import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { isWallpaperPreloaded, preloadWallpaper, WALLPAPER_URL } from "@/lib/wallpaper";
import { WallpaperLoader } from "@/components/WallpaperLoader";

export function DesktopBackground() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(isWallpaperPreloaded);

  useEffect(() => {
    if (isWallpaperPreloaded()) {
      setLoaded(true);
      return;
    }
    let cancelled = false;
    preloadWallpaper()
      .then(() => {
        if (!cancelled) setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const showSkeleton = !loaded;

  return (
    <div data-desktop-enter="bg" className="absolute inset-0 z-0 overflow-hidden bg-black">
      {showSkeleton && <WallpaperLoader />}
      <img
        ref={imgRef}
        src={WALLPAPER_URL}
        alt=""
        aria-hidden
        draggable={false}
        fetchPriority="high"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full max-w-none object-cover object-center pointer-events-none select-none",
          loaded ? "opacity-100" : "opacity-0",
          isWallpaperPreloaded() ? "" : "transition-opacity duration-500 ease-out"
        )}
      />
    </div>
  );
}
