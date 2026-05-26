import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { preloadWallpaper } from "@/lib/wallpaper";
import {
  IntroLoader,
  EXIT_MS,
  INTRO_DURATION_MS,
  INTRO_MINIMAL_MS,
  type IntroLoaderPhase,
} from "./IntroLoader";

const INTRO_MS = INTRO_DURATION_MS;
const INTRO_MAX_WAIT_MS = 12_000;
const INTRO_SEEN_KEY = "portfolio-os:intro-seen";

type GatePhase = "intro" | "exit" | "done";

function readIntroSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* noop */
  }
}

interface IntroGateProps {
  children: ReactNode;
}

function IntroGateComponent({ children }: IntroGateProps) {
  const [isSessionReturn] = useState(() => readIntroSeen());
  const minDurationMs = isSessionReturn ? INTRO_MINIMAL_MS : INTRO_DURATION_MS;

  const [phase, setPhase] = useState<GatePhase>("intro");
  const [minTimeMet, setMinTimeMet] = useState(false);
  const [wallpaperReady, setWallpaperReady] = useState(false);

  const loaderPhase: IntroLoaderPhase = phase === "exit" ? "exit" : "visible";

  useEffect(() => {
    preloadWallpaper()
      .then(() => setWallpaperReady(true))
      .catch(() => setWallpaperReady(true));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeMet(true), minDurationMs);
    return () => clearTimeout(t);
  }, [minDurationMs]);

  useEffect(() => {
    const cap = setTimeout(() => {
      setWallpaperReady(true);
      setMinTimeMet(true);
    }, INTRO_MAX_WAIT_MS);
    return () => clearTimeout(cap);
  }, []);

  useEffect(() => {
    if (phase !== "intro") return;
    if (minTimeMet && wallpaperReady) {
      setPhase("exit");
    }
  }, [phase, minTimeMet, wallpaperReady]);

  const handleExitComplete = useCallback(() => {
    markIntroSeen();
    setPhase("done");
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;
    const fallback = setTimeout(handleExitComplete, EXIT_MS + 80);
    return () => clearTimeout(fallback);
  }, [phase, handleExitComplete]);

  const showLoader = phase === "intro" || phase === "exit";
  const mountApp = phase === "exit" || phase === "done";
  const revealApp = phase === "exit" || phase === "done";

  return (
    <>
      <div
        className={
          phase === "done" ? undefined : revealApp ? "intro-site intro-site--reveal" : "intro-site"
        }
      >
        {mountApp ? children : null}
      </div>
      {showLoader && (
        <IntroLoader
          phase={loaderPhase}
          onExitComplete={handleExitComplete}
          durationMs={minDurationMs}
        />
      )}
    </>
  );
}

export const IntroGate = memo(IntroGateComponent);
export { INTRO_MS, EXIT_MS };

/** Lazy desktop shell — mounts when intro begins exit. */
export const LazyDesktop = lazy(() =>
  import("@/components/Desktop").then((m) => ({ default: m.Desktop }))
);

export function DesktopWithIntro() {
  return (
    <IntroGate>
      <Suspense fallback={null}>
        <LazyDesktop />
      </Suspense>
    </IntroGate>
  );
}
