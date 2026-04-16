import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  User, FolderKanban, Sparkles, Briefcase, Mail, Music as MusicIcon, Gamepad2, TerminalSquare,
} from "lucide-react";
import { useOS, type AppId } from "@/store/osStore";

const APPS: { id: AppId; label: string; Icon: React.ComponentType<{ className?: string }>; tint: string }[] = [
  { id: "about", label: "About", Icon: User, tint: "from-sky-400 to-blue-600" },
  { id: "projects", label: "Projects", Icon: FolderKanban, tint: "from-blue-400 to-indigo-600" },
  { id: "skills", label: "Skills", Icon: Sparkles, tint: "from-violet-400 to-fuchsia-600" },
  { id: "experience", label: "Experience", Icon: Briefcase, tint: "from-amber-400 to-orange-600" },
  { id: "contact", label: "Contact", Icon: Mail, tint: "from-emerald-400 to-teal-600" },
  { id: "music", label: "Music", Icon: MusicIcon, tint: "from-pink-400 to-rose-600" },
  { id: "game", label: "Game", Icon: Gamepad2, tint: "from-lime-400 to-green-600" },
  { id: "terminal", label: "Terminal", Icon: TerminalSquare, tint: "from-zinc-400 to-zinc-700" },
];

export function Dock({ isMobile }: { isMobile: boolean }) {
  const openApp = useOS((s) => s.openApp);
  const focusApp = useOS((s) => s.focusApp);
  const windows = useOS((s) => s.windows);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX;
      itemsRef.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const center = r.left + r.width / 2;
        const dist = Math.abs(mouseX - center);
        const max = 120;
        const scale = dist > max ? 1 : 1 + (1 - dist / max) * 0.55;
        const lift = dist > max ? 0 : (1 - dist / max) * -10;
        gsap.to(el, { scale, y: lift, duration: 0.25, ease: "power3.out" });
      });
      void rect;
    };
    const onLeave = () => {
      itemsRef.current.forEach((el) => el && gsap.to(el, { scale: 1, y: 0, duration: 0.35, ease: "power3.out" }));
    };
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [isMobile]);

  const handleClick = (id: AppId) => {
    const w = windows[id];
    if (w.isOpen && !w.isMinimized) focusApp(id);
    else openApp(id);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <div
        ref={containerRef}
        className="glass rounded-2xl px-3 py-2 flex items-end gap-2 pointer-events-auto"
        style={{ boxShadow: "0 20px 60px -10px rgb(0 0 0 / 0.6)" }}
      >
        {APPS.map((a, i) => {
          const w = windows[a.id];
          return (
            <button
              key={a.id}
              ref={(el) => { itemsRef.current[i] = el; }}
              onClick={() => handleClick(a.id)}
              className="relative group"
              aria-label={a.label}
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${a.tint} shadow-lg flex items-center justify-center text-white`}
                style={{ boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.25), 0 6px 14px rgb(0 0 0 / 0.4)" }}
              >
                <a.Icon className="w-6 h-6 md:w-7 md:h-7 drop-shadow" />
              </div>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded glass opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                {a.label}
              </span>
              {w.isOpen && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground/80" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
