import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";

/** Glass + backdrop-filter: never scale — opacity + translate only (GPU-friendly). */
function primeForEnter(els: HTMLElement[]) {
  for (const el of els) {
    el.style.willChange = "transform, opacity";
  }
}

function clearEnter(els: HTMLElement[]) {
  for (const el of els) {
    el.style.willChange = "";
    gsap.set(el, { clearProps: "transform,opacity" });
  }
}

/**
 * One-shot macOS-style popup entrance. Optimized for smooth 60fps (no scale on glass).
 */
export function useDesktopEntrance(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: gsap.Context | null = null;

    const run = () => {
      if (cancelled || !rootRef.current) return;

      const introStillVisible = !!document.querySelector(".intro-loader");
      const delay = introStillVisible ? 0.52 : 0.04;

      ctx = gsap.context(() => {
        gsap.defaults({ force3D: true });

        const bg = root.querySelector<HTMLElement>('[data-desktop-enter="bg"]');
        const menubar = root.querySelector<HTMLElement>('[data-desktop-enter="menubar"]');
        const widgets = gsap.utils.toArray<HTMLElement>('[data-desktop-enter="widget"]', root);
        const dock = root.querySelector<HTMLElement>('[data-desktop-enter="dock"]');

        const glassPopups = [menubar, dock, ...widgets].filter(Boolean) as HTMLElement[];
        primeForEnter(glassPopups);

        if (bg) gsap.set(bg, { opacity: 0 });

        if (glassPopups.length > 0) {
          gsap.set(glassPopups, { opacity: 0, y: 20 });
        }

        const tl = gsap.timeline({
          delay,
          defaults: { ease: "power2.out", overwrite: "auto" },
          onComplete: () => {
            if (bg) gsap.set(bg, { clearProps: "opacity" });
            clearEnter(glassPopups);
          },
        });

        if (bg) {
          tl.to(bg, { opacity: 1, duration: 0.4, ease: "power1.out" });
        }

        if (glassPopups.length > 0) {
          tl.to(
            glassPopups,
            {
              opacity: 1,
              y: 0,
              duration: 0.38,
              stagger: 0.05,
            },
            bg ? "-=0.32" : 0
          );
        }
      }, root);
    };

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, [rootRef]);
}
