import { useEffect, useState } from "react";
import { Apple, Wifi, BatteryFull, Search } from "lucide-react";

export function MenuBar() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const day = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <div className="fixed top-0 inset-x-0 h-7 z-[10000] glass flex items-center px-3 text-xs font-medium text-foreground/90 select-none">
      <div className="flex items-center gap-4">
        <Apple className="w-4 h-4" />
        <span className="font-semibold">Mayank</span>
        <span className="opacity-80">Finder</span>
        <span className="opacity-60 hidden sm:inline">File</span>
        <span className="opacity-60 hidden sm:inline">Edit</span>
        <span className="opacity-60 hidden md:inline">View</span>
        <span className="opacity-60 hidden md:inline">Window</span>
        <span className="opacity-60 hidden md:inline">Help</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <BatteryFull className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">{day}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
