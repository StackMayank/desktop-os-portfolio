import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  User, FolderKanban, Sparkles, Briefcase, Mail, Music as MusicIcon, Gamepad2, TerminalSquare,
} from "lucide-react";
import { useOS, type AppId } from "@/store/osStore";

type AppDef = {
  id: AppId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  gradient: string; // CSS gradient for icon face
  glow: string;     // rgba glow color
};

const APPS: AppDef[] = [
  { id: "about",      label: "About",      Icon: User,           gradient: "linear-gradient(135deg,#7DD3FC 0%,#3B82F6 55%,#1D4ED8 100%)", glow: "59,130,246" },
  { id: "projects",   label: "Projects",   Icon: FolderKanban,   gradient: "linear-gradient(135deg,#A5B4FC 0%,#6366F1 55%,#3730A3 100%)", glow: "99,102,241" },
  { id: "skills",     label: "Skills",     Icon: Sparkles,       gradient: "linear-gradient(135deg,#F0ABFC 0%,#C026D3 55%,#7E22CE 100%)", glow: "192,38,211" },
  { id: "experience", label: "Experience", Icon: Briefcase,      gradient: "linear-gradient(135deg,#FCD34D 0%,#F97316 55%,#B45309 100%)", glow: "249,115,22" },
  { id: "contact",    label: "Contact",    Icon: Mail,           gradient: "linear-gradient(135deg,#6EE7B7 0%,#10B981 55%,#047857 100%)", glow: "16,185,129" },
  { id: "music",      label: "Music",      Icon: MusicIcon,      gradient: "linear-gradient(135deg,#FDA4AF 0%,#F43F5E 55%,#9F1239 100%)", glow: "244,63,94" },
  { id: "game",       label: "Game",       Icon: Gamepad2,       gradient: "linear-gradient(135deg,#BEF264 0%,#22C55E 55%,#15803D 100%)", glow: "34,197,94" },
  { id: "terminal",   label: "Terminal",   Icon: TerminalSquare, gradient: "linear-gradient(135deg,#3F3F46 0%,#18181B 60%,#000000 100%)", glow: "82,82,91" },
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
