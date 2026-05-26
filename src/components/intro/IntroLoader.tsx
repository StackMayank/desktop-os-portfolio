import { memo, type CSSProperties } from "react";
import portfolioOsLogo from "@/assets/portfolio-os-logo.png";
import "./intro.css";

const EXIT_MS = 650;
const INTRO_DURATION_MS = 3000;
/** Session return: shorter intro, but long enough for logo fade-in (~1.1s). */
const INTRO_MINIMAL_MS = 2000;
const LOGO_ANIM_MS = 1100;

export type IntroLoaderPhase = "visible" | "exit";

interface IntroLoaderProps {
  phase: IntroLoaderPhase;
  onExitComplete: () => void;
  /** Progress bar animation length (ms) */
  durationMs?: number;
}

function IntroLoaderComponent({
  phase,
  onExitComplete,
  durationMs = INTRO_DURATION_MS,
}: IntroLoaderProps) {
  return (
    <div
      className={`intro-loader${phase === "exit" ? " intro-loader--exit" : ""}`}
      style={
        {
          "--intro-duration": `${durationMs}ms`,
          "--intro-logo-duration": `${Math.min(LOGO_ANIM_MS, durationMs)}ms`,
        } as CSSProperties
      }
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      onAnimationEnd={(e) => {
        if (phase === "exit" && e.animationName === "intro-loader-fade-out") {
          onExitComplete();
        }
      }}
    >
      <div className="intro-loader__stack">
        <img
          src={portfolioOsLogo}
          alt="portfolio os"
          className="intro-loader__logo"
          width={320}
          height={80}
          decoding="async"
          fetchPriority="high"
          draggable={false}
        />
        <div className="intro-loader__bar" aria-hidden>
          <div className="intro-loader__bar-glow" />
          <div className="intro-loader__bar-fill" />
        </div>
      </div>
    </div>
  );
}

export const IntroLoader = memo(IntroLoaderComponent);
export { EXIT_MS, INTRO_DURATION_MS, INTRO_MINIMAL_MS };
