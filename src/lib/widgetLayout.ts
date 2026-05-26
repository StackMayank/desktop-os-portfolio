import type { WidgetFrame } from "@/hooks/useLayoutFrame";

export const WIDGET_LAYOUT_VERSION = 9;

/** Minimum resize / frame size per widget (prevents calendar clipping) */
export const WIDGET_MINS: Record<WidgetId, { w: number; h: number }> = {
  clock: { w: 160, h: 108 },
  weather: { w: 168, h: 108 },
  todo: { w: 200, h: 180 },
  calendar: { w: 240, h: 286 },
};

export const WIDGET_LAYOUT_VERSION_KEY = "portfolio:widget-layout-version";

export type WidgetId = "clock" | "weather" | "todo" | "calendar";

/** Draggable desktop area (below menu bar, above dock) */
export const DESKTOP_PAD = { x: 8, top: 36, bottom: 100 } as const;

export function clampWidgetFrame(
  frame: WidgetFrame,
  viewportW = typeof window !== "undefined" ? window.innerWidth : 1280,
  viewportH = typeof window !== "undefined" ? window.innerHeight : 800
): WidgetFrame {
  const { x: padX, top: padTop, bottom: padBottom } = DESKTOP_PAD;
  const maxW = Math.max(80, viewportW - padX * 2);
  const maxH = Math.max(80, viewportH - padTop - padBottom);
  const w = Math.min(frame.w, maxW);
  const h = Math.min(frame.h, maxH);
  const maxX = Math.max(padX, viewportW - w - padX);
  const maxY = Math.max(padTop, viewportH - h - padBottom);
  return {
    w,
    h,
    x: Math.min(Math.max(padX, frame.x), maxX),
    y: Math.min(Math.max(padTop, frame.y), maxY),
  };
}

/** Canonical desktop layout — matches design (corners), stable on every fresh load */
export function getDefaultWidgetFrames(
  viewportW: number,
  viewportH: number
): Record<WidgetId, WidgetFrame> {
  const margin = 24;
  const menuBar = 36;
  const dockClearance = 100;
  const maxY = Math.max(menuBar + 8, viewportH - dockClearance);

  const clockH = 113;
  const weatherH = WIDGET_MINS.weather.h;
  const todoH = 300;
  const calendarH = WIDGET_MINS.calendar.h;
  const calendarW = 260;
  const weatherW = 176;
  const todoW = 260;
  const clockW = 200;

  const topY = menuBar + 20;
  const todoY = Math.max(topY + clockH + 24, maxY - todoH);
  const calendarY = Math.max(topY + weatherH + 24, maxY - calendarH);

  return {
    clock: { x: margin, y: topY, w: clockW, h: clockH },
    weather: {
      x: Math.max(margin, viewportW - margin - weatherW),
      y: topY,
      w: weatherW,
      h: weatherH,
    },
    todo: { x: margin, y: todoY, w: todoW, h: todoH },
    calendar: {
      x: Math.max(margin, viewportW - margin - calendarW),
      y: calendarY,
      w: calendarW,
      h: calendarH,
    },
  };
}

const DESKTOP_FOLDER_W = 88;
const DESKTOP_FOLDER_H = 96;

/** Center of desktop area (below menu bar, above dock) */
export function getDefaultDesktopFolderPosition(
  viewportW: number,
  viewportH: number
): { x: number; y: number } {
  const menuBar = 36;
  const dockClearance = 100;
  const desktopTop = menuBar;
  const desktopH = Math.max(200, viewportH - menuBar - dockClearance);
  const x = Math.round((viewportW - DESKTOP_FOLDER_W) / 2);
  const y = Math.round(desktopTop + (desktopH - DESKTOP_FOLDER_H) / 2);
  return { x, y };
}
