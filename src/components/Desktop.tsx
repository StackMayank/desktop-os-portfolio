import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { CloudSun, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useDesktopEntrance } from "@/hooks/useDesktopEntrance";
import { useNow } from "@/hooks/useNow";
import { WeatherProvider, useWeather } from "@/context/WeatherProvider";
import { DesktopBackground } from "@/components/DesktopBackground";
import { MenuBar } from "@/components/MenuBar";
import { Dock } from "@/components/Dock";
import { DesktopFolder } from "@/components/DesktopFolder";
import { WindowSlot } from "@/components/WindowSlot";
import { Widget } from "@/components/Widget";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClockWidget } from "@/widgets/ClockWidget";
import { TodoWidget } from "@/widgets/TodoWidget";
import { CalendarWidget } from "@/widgets/CalendarWidget";
import { WeatherWidget } from "@/widgets/WeatherWidget";
import { useOS } from "@/store/osStore";
import { getDefaultWidgetFrames, WIDGET_MINS } from "@/lib/widgetLayout";

type MobileWidgetId = "clock" | "weather";


function MobileWeatherPreview() {
  const { data, condition, loading, error } = useWeather();
  return (
    <div>
      <div className="flex items-center gap-2">
        <CloudSun className="w-5 h-5 text-widget-accent" />
        <div className="text-2xl font-light leading-none tabular-nums">
          {loading || error || !data ? "--" : `${data.temp}°`}
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1 truncate">
        {loading ? "Loading..." : error ? "Offline" : condition}
      </div>
    </div>
  );
}

function MobileClockPreview() {
  const now = useNow();
  const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const weekday = now.toLocaleDateString(undefined, { weekday: "short" });
  const month = now.toLocaleDateString(undefined, { month: "short" });
  const dateNum = now.getDate();
  return (
    <div>
      <div className="text-2xl font-light leading-none tabular-nums text-glow">{time}</div>
      <div className="text-xs text-muted-foreground mt-1">
        {weekday}, {month} {dateNum}
      </div>
    </div>
  );
}

function DesktopShell() {
  const rootRef = useRef<HTMLDivElement>(null);
  useDesktopEntrance(rootRef);

  const isMobile = useIsMobile();
  const [widgetFrames, setWidgetFrames] = useState(() =>
    getDefaultWidgetFrames(
      typeof window !== "undefined" ? window.innerWidth : 1280,
      typeof window !== "undefined" ? window.innerHeight : 800
    )
  );

  /** Canonical corners on first paint; do not reset on window resize (keeps user drag positions). */
  useLayoutEffect(() => {
    if (isMobile) return;
    setWidgetFrames(getDefaultWidgetFrames(window.innerWidth, window.innerHeight));
  }, [isMobile]);
  const [openMobileWidget, setOpenMobileWidget] = useState<MobileWidgetId | null>(null);

  const anyAppWindowOpen = useOS(
    useShallow((s) => Object.values(s.windows).some((w) => w.isOpen && !w.isMinimized))
  );

  const mobileWidgetDefs = useMemo(
    () => [
      {
        id: "clock" as const,
        title: "Clock",
        preview: <MobileClockPreview />,
        content: <ClockWidget />,
      },
      {
        id: "weather" as const,
        title: "Weather",
        preview: <MobileWeatherPreview />,
        content: <WeatherWidget />,
      },
    ],
    []
  );

  const activeMobileWidget = openMobileWidget
    ? mobileWidgetDefs.find((w) => w.id === openMobileWidget)
    : undefined;

  return (
    <div ref={rootRef} className="fixed inset-0 overflow-x-hidden overflow-y-visible">
      <DesktopBackground />
      <MenuBar />

      {isMobile ? (
        !anyAppWindowOpen && (
          <div className="absolute inset-x-0 top-8 bottom-[5.5rem] px-4 pt-3 pb-4 flex flex-col pointer-events-none">
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto shrink-0 pointer-events-auto">
              {mobileWidgetDefs.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setOpenMobileWidget(w.id)}
                  data-desktop-enter="widget"
                  className="glass widget-panel p-4 text-left touch-manipulation active:scale-[0.98] transition-transform min-h-[100px]"
                >
                  <div className="widget-header mb-2 text-muted-foreground">{w.title}</div>
                  {w.preview}
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center min-h-0 pointer-events-auto">
              <DesktopFolder label="Project and resume" appId="projects" isMobile />
            </div>
          </div>
        )
      ) : (
        <>
          <Widget id="clock" initial={widgetFrames.clock} min={WIDGET_MINS.clock} isMobile={false} resizable={false}>
            <ClockWidget />
          </Widget>
          <Widget id="weather" initial={widgetFrames.weather} min={WIDGET_MINS.weather} isMobile={false} resizable={false}>
            <WeatherWidget />
          </Widget>
          <Widget id="todo" initial={widgetFrames.todo} min={WIDGET_MINS.todo} isMobile={false}>
            <TodoWidget />
          </Widget>
          <Widget id="calendar" initial={widgetFrames.calendar} min={WIDGET_MINS.calendar} isMobile={false} resizable={false}>
            <CalendarWidget />
          </Widget>
          <DesktopFolder label="Project and resume" appId="projects" />
        </>
      )}

      {isMobile && openMobileWidget && activeMobileWidget && (
        <div className="fixed inset-0 z-[150]">
          <button
            aria-label="Close widget"
            className="absolute inset-0 bg-black/50 touch-manipulation"
            onClick={() => setOpenMobileWidget(null)}
          />
          <div className="absolute inset-x-0 top-[calc(1.75rem+env(safe-area-inset-top,0px))] bottom-0 glass-strong flex flex-col min-h-0">
            <div className="h-10 shrink-0 flex items-center justify-between px-4 border-b border-glass-border">
              <span className="widget-header text-muted-foreground">{activeMobileWidget.title}</span>
              <button
                aria-label="Close"
                onClick={() => setOpenMobileWidget(null)}
                className="w-8 h-8 rounded-full glass-soft flex items-center justify-center touch-manipulation active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-4 overscroll-contain scrollbar-hidden">
              {activeMobileWidget.content}
            </div>
          </div>
        </div>
      )}

      <WindowSlot id="about" isMobile={isMobile} />
      <WindowSlot id="docs" isMobile={isMobile} fitContent={!isMobile} />
      <WindowSlot id="projects" isMobile={isMobile} fitContent={!isMobile} />
      <WindowSlot id="preview" isMobile={isMobile} />
      <WindowSlot id="skills" isMobile={isMobile} />
      <WindowSlot id="experience" isMobile={isMobile} />
      <WindowSlot id="contact" isMobile={isMobile} />
      <WindowSlot id="music" isMobile={isMobile} />
      <WindowSlot id="game" isMobile={isMobile} />
      <WindowSlot id="terminal" isMobile={isMobile} />

      <Dock isMobile={isMobile} />
    </div>
  );
}

export function Desktop() {
  return (
    <WeatherProvider>
      <DesktopShell />
    </WeatherProvider>
  );
}
