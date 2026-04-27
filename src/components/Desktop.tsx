import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CalendarDays, CloudSun, GripHorizontal, ListTodo, X } from "lucide-react";
import wallpaper from "@/assets/wallpaper.webp";
import { MenuBar } from "@/components/MenuBar";
import { Dock } from "@/components/Dock";
import { Window } from "@/components/Window";
import { Widget } from "@/components/Widget";
import { useDrag } from "@/hooks/useDrag";
import { usePersistedPosition } from "@/hooks/usePersistedPosition";
import { useWeather } from "@/hooks/useWeather";
import { ClockWidget } from "@/widgets/ClockWidget";
import { TodoWidget } from "@/widgets/TodoWidget";
import { CalendarWidget } from "@/widgets/CalendarWidget";
import { WeatherWidget } from "@/widgets/WeatherWidget";
import { AboutApp } from "@/apps/AboutApp";
import { ProjectsApp } from "@/apps/ProjectsApp";
import { SkillsApp } from "@/apps/SkillsApp";
import { ExperienceApp } from "@/apps/ExperienceApp";
import { ContactApp } from "@/apps/ContactApp";
import { MusicApp } from "@/apps/MusicApp";
import { GameApp } from "@/apps/GameApp";
import { TerminalApp } from "@/apps/TerminalApp";

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

function useTodoPreview() {
  const [tasks, setTasks] = useState<TodoItem[]>([]);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("todo:list");
        const next = raw ? (JSON.parse(raw) as TodoItem[]) : [];
        setTasks(Array.isArray(next) ? next : []);
      } catch {
        setTasks([]);
      }
    };

    read();
    const id = setInterval(read, 1500);
    window.addEventListener("storage", read);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", read);
    };
  }, []);

  const pending = tasks.filter((t) => !t.done);
  return {
    total: tasks.length,
    pendingCount: pending.length,
    nextTask: pending[0]?.text ?? "No pending task",
  };
}

type MobileWidgetId = "clock" | "weather" | "calendar" | "todo";
type MobileWidgetSize = "half" | "full";

function MobileMiniWidget({
  id,
  title,
  preview,
  onOpen,
  size,
  initial,
  viewport,
}: {
  id: MobileWidgetId;
  title: string;
  preview: ReactNode;
  onOpen: () => void;
  size: MobileWidgetSize;
  initial: { x: number; y: number };
  viewport: { w: number; h: number };
}) {
  const [pos, setPos] = usePersistedPosition(`mobile:widget:${id}`, initial);
  const posRef = useRef(pos);
  posRef.current = pos;

  const width = size === "half"
    ? Math.max(144, Math.floor((viewport.w - 36) / 2))
    : Math.max(290, viewport.w - 24);
  const height = size === "half" ? 96 : 126;

  const clamp = (x: number, y: number) => {
    const maxX = Math.max(8, viewport.w - width - 8);
    const maxY = Math.max(8, viewport.h - height - 8);
    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(8, y), maxY),
    };
  };

  const drag = useDrag({
    getStart: () => ({ x: posRef.current.x, y: posRef.current.y }),
    onMove: (x, y) => setPos(clamp(x, y)),
  });

  useEffect(() => {
    setPos((p) => clamp(p.x, p.y));
  }, [viewport.w, viewport.h, width, height, setPos]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
      className="absolute glass rounded-2xl text-left p-3 active:scale-[0.99] transition"
      style={{ left: pos.x, top: pos.y, width, height }}
    >
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{title}</div>
        <button
          aria-label={`Drag ${title}`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={drag.onPointerDown}
          className="w-6 h-6 rounded-md bg-black/25 flex items-center justify-center touch-none"
        >
          <GripHorizontal className="w-3.5 h-3.5 text-foreground/80" />
        </button>
      </div>
      <div className="mt-1.5">{preview}</div>
    </div>
  );
}

export function Desktop() {
  const isMobile = useIsMobile();
  const [openMobileWidget, setOpenMobileWidget] = useState<MobileWidgetId | null>(null);
  const now = useNow();
  const { data, condition, loading, error } = useWeather();
  const todo = useTodoPreview();
  const [mobileViewport, setMobileViewport] = useState({ w: 390, h: 620 });

  useEffect(() => {
    if (!isMobile) return;
    const read = () => {
      setMobileViewport({
        w: window.innerWidth,
        h: Math.max(280, window.innerHeight - 32 - 96),
      });
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [isMobile]);

  const month = now.toLocaleDateString(undefined, { month: "short" });
  const weekday = now.toLocaleDateString(undefined, { weekday: "short" });
  const dateNum = now.getDate();
  const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const mobileWidgetDefs = useMemo(
    () => [
      {
        id: "clock" as const,
        title: "Clock",
        size: "half" as const,
        initial: { x: 12, y: 14 },
        preview: (
          <div>
            <div className="text-2xl font-light leading-none tabular-nums text-glow">{time}</div>
            <div className="text-xs text-muted-foreground mt-1">{weekday}, {month} {dateNum}</div>
          </div>
        ),
        content: <ClockWidget />,
      },
      {
        id: "weather" as const,
        title: "Weather",
        size: "half" as const,
        initial: { x: Math.max(12, Math.floor((mobileViewport.w - 36) / 2) + 24), y: 14 },
        preview: (
          <div>
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-primary" />
              <div className="text-2xl font-light leading-none tabular-nums">{loading || error || !data ? "--" : `${data.temp}°`}</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">{loading ? "Loading..." : error ? "Offline" : condition}</div>
          </div>
        ),
        content: <WeatherWidget />,
      },
      {
        id: "calendar" as const,
        title: "Calendar",
        size: "full" as const,
        initial: { x: 12, y: 122 },
        preview: (
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xl font-semibold leading-none">{month} {dateNum}</div>
              <div className="text-xs text-muted-foreground mt-1">{now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</div>
            </div>
            <CalendarDays className="w-6 h-6 text-primary/90" />
          </div>
        ),
        content: <CalendarWidget />,
      },
      {
        id: "todo" as const,
        title: "To-Do",
        size: "full" as const,
        initial: { x: 12, y: 262 },
        preview: (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm text-foreground/85 truncate">{todo.nextTask}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {todo.pendingCount} pending task{todo.pendingCount === 1 ? "" : "s"}
              </div>
            </div>
            <ListTodo className="w-5 h-5 text-primary shrink-0" />
          </div>
        ),
        content: <TodoWidget />,
      },
    ],
    [time, weekday, month, dateNum, loading, error, data, condition, now, todo, mobileViewport.w]
  );

  return (
    <div className="fixed inset-0 overflow-hidden">
      <img
        src={wallpaper}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1280}
      />
      <div className="absolute inset-0 bg-black/30" />

      <MenuBar />

      {!isMobile && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
          <p
            className="text-sm md:text-base font-light tracking-[0.35em] uppercase text-white/70"
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            Hello, I'm
          </p>
          <h1
            className="glass-text text-7xl md:text-9xl font-black tracking-tight leading-none"
            style={{ fontFamily: "'Archivo Black', 'Inter', sans-serif", letterSpacing: "-0.04em" }}
          >
            Mayank
          </h1>
        </div>
      )}

      {/* Widgets */}
      {isMobile ? (
        <div className="absolute inset-x-0 top-8 bottom-24 overflow-hidden px-3 py-3">
          <div className="relative h-full min-h-0">
            {mobileWidgetDefs.map((w) => (
              <MobileMiniWidget
                key={w.id}
                id={w.id}
                title={w.title}
                size={w.size}
                preview={w.preview}
                onOpen={() => setOpenMobileWidget(w.id)}
                initial={w.initial}
                viewport={mobileViewport}
              />
            ))}
          </div>
          {openMobileWidget && (
            <div className="fixed inset-0 z-[10010]">
              <button
                aria-label="Close widget"
                className="absolute inset-0 bg-black/45"
                onClick={() => setOpenMobileWidget(null)}
              />
              <div className="absolute inset-x-3 top-16 bottom-24 glass rounded-2xl p-4 overflow-auto">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {mobileWidgetDefs.find((w) => w.id === openMobileWidget)?.title}
                  </div>
                  <button
                    aria-label="Close"
                    onClick={() => setOpenMobileWidget(null)}
                    className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {mobileWidgetDefs.find((w) => w.id === openMobileWidget)?.content}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <Widget id="clock" initial={{ x: 24, y: 56, w: 200, h: 140 }} min={{ w: 160, h: 108 }} isMobile={false}>
            <ClockWidget />
          </Widget>
          <Widget id="weather" initial={{ x: 24, y: 220, w: 200, h: 168 }} min={{ w: 160, h: 132 }} isMobile={false}>
            <WeatherWidget />
          </Widget>
          <Widget id="todo" initial={{ x: 24, y: 400, w: 260, h: 300 }} min={{ w: 200, h: 180 }} isMobile={false}>
            <TodoWidget />
          </Widget>
          <Widget
            id="calendar"
            initial={{
              x: (typeof window !== "undefined" ? window.innerWidth : 1200) - 280,
              y: 56,
              w: 260,
              h: 280,
            }}
            min={{ w: 220, h: 220 }}
            isMobile={false}
            dragAnywhere
          >
            <CalendarWidget />
          </Widget>
        </>
      )}

      {/* Windows */}
      <Window id="about" isMobile={isMobile}><AboutApp /></Window>
      <Window id="projects" isMobile={isMobile}><ProjectsApp /></Window>
      <Window id="skills" isMobile={isMobile}><SkillsApp /></Window>
      <Window id="experience" isMobile={isMobile}><ExperienceApp /></Window>
      <Window id="contact" isMobile={isMobile}><ContactApp /></Window>
      <Window id="music" isMobile={isMobile}><MusicApp /></Window>
      <Window id="game" isMobile={isMobile}><GameApp /></Window>
      <Window id="terminal" isMobile={isMobile}><TerminalApp /></Window>

      <Dock isMobile={isMobile} />
    </div>
  );
}
