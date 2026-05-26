import type { LucideIcon } from "lucide-react";
import {
  User,
  FileText,
  BarChart3,
  Briefcase,
  Mail,
  Music,
  Gamepad2,
  Terminal,
} from "lucide-react";
import type { AppId } from "@/store/osStore";

const SQUIRCLE = "rounded-[22.37%]";

const APP_CONFIG: Record<
  AppId,
  { label: string; Icon: LucideIcon; accent: string }
> = {
  about: { label: "About", Icon: User, accent: "text-sky-300" },
  docs: { label: "Resume", Icon: FileText, accent: "text-blue-300" },
  projects: { label: "Projects", Icon: FileText, accent: "text-sky-300" },
  skills: { label: "Skills", Icon: BarChart3, accent: "text-violet-300" },
  experience: { label: "Experience", Icon: Briefcase, accent: "text-amber-300" },
  contact: { label: "Contact", Icon: Mail, accent: "text-cyan-300" },
  music: { label: "Music", Icon: Music, accent: "text-rose-300" },
  game: { label: "Game", Icon: Gamepad2, accent: "text-emerald-300" },
  terminal: { label: "Terminal", Icon: Terminal, accent: "text-green-400" },
  preview: { label: "Resume", Icon: FileText, accent: "text-blue-300" },
};

interface DockAppIconProps {
  id: AppId;
  size?: "sm" | "md";
}

export function DockAppIcon({ id, size = "md" }: DockAppIconProps) {
  const { Icon, accent } = APP_CONFIG[id];
  const tile =
    size === "sm" ? "w-11 h-11" : "w-12 h-12 md:w-[52px] md:h-[52px]";
  const iconSize = size === "sm" ? "w-5 h-5" : "w-5 h-5 md:w-[22px] md:h-[22px]";

  return (
    <div className={`dock-icon-tile relative ${tile} shrink-0 overflow-hidden ${SQUIRCLE}`}>
      <div
        className={`absolute inset-0 ${SQUIRCLE} glass-soft flex items-center justify-center overflow-hidden`}
      >
        <Icon
          className={`${iconSize} ${accent} opacity-95`}
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
    </div>
  );
}

export function getDockAppLabel(id: AppId) {
  return APP_CONFIG[id].label;
}
