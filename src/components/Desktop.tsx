import { useEffect, useMemo, useState } from "react";
import { CloudSun, X } from "lucide-react";
import { DesktopBackground } from "@/components/DesktopBackground";
import { MenuBar } from "@/components/MenuBar";
import { Dock } from "@/components/Dock";
import { Window } from "@/components/Window";
import { Widget } from "@/components/Widget";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWeather } from "@/hooks/useWeather";
import { ClockWidget } from "@/widgets/ClockWidget";
import { TodoWidget } from "@/widgets/TodoWidget";
import { CalendarWidget } from "@/widgets/CalendarWidget";
import { WeatherWidget } from "@/widgets/WeatherWidget";
import { AboutApp } from "@/apps/AboutApp";
import { DocsApp } from "@/apps/DocsApp";
import { PreviewApp } from "@/apps/PreviewApp";
import { SkillsApp } from "@/apps/SkillsApp";
import { ExperienceApp } from "@/apps/ExperienceApp";
import { ContactApp } from "@/apps/ContactApp";
import { MusicApp } from "@/apps/MusicApp";
import { GameApp } from "@/apps/GameApp";
import { TerminalApp } from "@/apps/TerminalApp";
import { useOS } from "@/store/osStore";
import { getDefaultWidgetFrames, WIDGET_MINS } from "@/lib/widgetLayout";

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

type MobileWidgetId = "clock" | "weather";

export function Desktop() {
  const isMobile = useIsMobile();
  const [widgetFrames] = useState(() =>
    getDefaultWidgetFrames(
      typeof window !== "undefined" ? window.innerWidth : 1280,
      typeof window !== "undefined" ? window.innerHeight : 800
    )
  );
  const [openMobileWidget, setOpenMobileWidget] = useState<MobileWidgetId | null>(null);
  const now = useNow();
  const { data, condition, loading, error } = useWeather();
  const windows = useOS((s) => s.windows);

  const anyAppWindowOpen = useMemo(
    () => Object.values(windows).some((w) => w.isOpen && !w.isMinimized),
    [windows]
  );

  const month = now.toLocaleDateString(undefined, { month: "short" });
  const weekday = now.toLocaleDateString(undefined, { weekday: "short" });
  const dateNum = now.getDate();
  const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const mobileWidgetDefs = useMemo(
    () => [
      {
        id: "clock" as const,
        title: "Clock",
        preview: (
          <div>
            <div className="text-2xl font-light leading-none tabular-nums text-glow">{time}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {weekday}, {month} {dateNum}
            </div>
          </div>
        ),
        content: <ClockWidget />,
      },
      {
        id: "weather" as const,
        title: "Weather",
        preview: (
          <div>
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-primary" />
              <div className="text-2xl font-light leading-none tabular-nums">
                {loading || error || !data ? "--" : `${data.temp}°`}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {loading ? "Loading..." : error ? "Offline" : condition}
            </div>
          </div>
        ),
        content: <WeatherWidget />,
      },
    ],
    [time, weekday, month, dateNum, loading, error, data, condition]
  );

  return (
    <div className="fixed inset-0 overflow-x-hidden overflow-y-visible">
      <DesktopBackground />

      <MenuBar />

      {isMobile ? (
        !anyAppWindowOpen && (
          <div className="absolute inset-x-0 top-8 bottom-[5.5rem] px-4 pt-3 pb-4 flex items-start justify-center pointer-events-none">
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto pointer-events-auto">
              {mobileWidgetDefs.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setOpenMobileWidget(w.id)}
                  className="glass widget-panel p-4 text-left touch-manipulation active:scale-[0.98] transition-transform min-h-[100px]"
                >
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    {w.title}
                  </div>
                  {w.preview}
                </button>
              ))}
            </div>
          </div>
        )
      ) : (
        <>
          <Widget id="clock" initial={widgetFrames.clock} min={WIDGET_MINS.clock} isMobile={false}>
            <ClockWidget />
          </Widget>
          <Widget id="weather" initial={widgetFrames.weather} min={WIDGET_MINS.weather} isMobile={false}>
            <WeatherWidget />
          </Widget>
          <Widget id="todo" initial={widgetFrames.todo} min={WIDGET_MINS.todo} isMobile={false}>
            <TodoWidget />
          </Widget>
          <Widget id="calendar" initial={widgetFrames.calendar} min={WIDGET_MINS.calendar} isMobile={false}>
            <CalendarWidget />
          </Widget>
        </>
      )}

      {isMobile && openMobileWidget && (
        <div className="fixed inset-0 z-[150]">
          <button
            aria-label="Close widget"
            className="absolute inset-0 bg-black/50 touch-manipulation"
            onClick={() => setOpenMobileWidget(null)}
          />
      <div className="absolute inset-x-0 top-[calc(1.75rem+env(safe-area-inset-top,0px))] bottom-0 glass-strong flex flex-col min-h-0">
            <div className="h-10 shrink-0 flex items-center justify-between px-4 border-b border-glass-border">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {mobileWidgetDefs.find((w) => w.id === openMobileWidget)?.title}
              </span>
              <button
                aria-label="Close"
                onClick={() => setOpenMobileWidget(null)}
                className="w-8 h-8 rounded-full glass-soft flex items-center justify-center touch-manipulation active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-4 overscroll-contain">
              {mobileWidgetDefs.find((w) => w.id === openMobileWidget)?.content}
            </div>
          </div>
        </div>
      )}

      <Window id="about" isMobile={isMobile}>
        <AboutApp />
      </Window>
      <Window id="docs" isMobile={isMobile} fitContent={!isMobile}>
        <DocsApp />
      </Window>
      <Window id="preview" isMobile={isMobile}>
        <PreviewApp />
      </Window>
      <Window id="skills" isMobile={isMobile}>
        <SkillsApp />
      </Window>
      <Window id="experience" isMobile={isMobile}>
        <ExperienceApp />
      </Window>
      <Window id="contact" isMobile={isMobile}>
        <ContactApp />
      </Window>
      <Window id="music" isMobile={isMobile}>
        <MusicApp />
      </Window>
      <Window id="game" isMobile={isMobile}>
        <GameApp />
      </Window>
      <Window id="terminal" isMobile={isMobile}>
        <TerminalApp />
      </Window>

      <Dock isMobile={isMobile} />
    </div>
  );
}
