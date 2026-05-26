import { memo } from "react";
import { Apple, Wifi, BatteryFull, Search } from "lucide-react";
import { useNow } from "@/hooks/useNow";

function MenuBarComponent() {
  const now = useNow();

  const day = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <div
      data-desktop-enter="menubar"
      className="fixed top-0 inset-x-0 h-7 sm:h-7 z-[10000] glass flex items-center px-2.5 sm:px-3 text-[11px] sm:text-xs font-medium text-foreground/90 select-none pt-[env(safe-area-inset-top,0px)]"
    >
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <Apple className="w-4 h-4" />
        <span className="font-semibold">Mayank</span>
        <span className="opacity-80 hidden sm:inline">Finder</span>
        <span className="opacity-60 hidden sm:inline">File</span>
        <span className="opacity-60 hidden sm:inline">Edit</span>
        <span className="opacity-60 hidden md:inline">View</span>
        <span className="opacity-60 hidden md:inline">Window</span>
        <span className="opacity-60 hidden md:inline">Help</span>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-2.5 md:gap-3 shrink-0 tabular-nums">
        <BatteryFull className="w-4 h-4 shrink-0" aria-hidden />
        <Wifi className="w-4 h-4 shrink-0" aria-hidden />
        <Search className="w-4 h-4 shrink-0 hidden sm:block" aria-hidden />
        <span className="shrink-0">{day}</span>
        <span className="shrink-0">{time}</span>
      </div>
    </div>
  );
}

export const MenuBar = memo(MenuBarComponent);
