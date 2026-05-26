import { Skeleton } from "@/components/Skeleton";

export function WallpaperLoader() {
  return (
    <div
      className="absolute inset-0 bg-black"
      role="status"
      aria-live="polite"
      aria-label="Loading wallpaper"
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 85%, rgba(104, 33, 143, 0.35) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 30% 20%, rgba(45, 27, 78, 0.4) 0%, transparent 50%)",
        }}
      />
      <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-white/4" />
    </div>
  );
}
