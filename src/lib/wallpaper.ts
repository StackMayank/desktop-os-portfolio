import wallpaperWebp from "@/assets/12-Dark.webp";

export const WALLPAPER_URL = wallpaperWebp;

const PRELOAD_ID = "portfolio-os-wallpaper-preload";

let preloadPromise: Promise<void> | null = null;
let preloaded = false;

function injectPreloadLink() {
  if (typeof document === "undefined") return;
  if (document.getElementById(PRELOAD_ID)) return;
  const link = document.createElement("link");
  link.id = PRELOAD_ID;
  link.rel = "preload";
  link.as = "image";
  link.href = WALLPAPER_URL;
  link.setAttribute("fetchpriority", "high");
  document.head.appendChild(link);
}

/** True after preloadWallpaper() has resolved successfully. */
export function isWallpaperPreloaded() {
  return preloaded;
}

/**
 * Decode wallpaper once; safe to call multiple times (singleton).
 * Injects a document preload link on first call for earliest fetch.
 */
export function preloadWallpaper(): Promise<void> {
  if (preloaded) return Promise.resolve();
  if (preloadPromise) return preloadPromise;

  injectPreloadLink();

  preloadPromise = new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";

    const finish = () => {
      preloaded = true;
      resolve();
    };

    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(finish).catch(finish);
      } else {
        finish();
      }
    };

    img.onerror = () => {
      preloadPromise = null;
      reject(new Error("Wallpaper failed to load"));
    };

    img.src = WALLPAPER_URL;
  });

  return preloadPromise;
}
