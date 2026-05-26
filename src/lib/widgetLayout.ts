import type { WidgetFrame } from "@/hooks/usePersistedFrame";

export const WIDGET_LAYOUT_VERSION = 6;

/** Minimum resize / frame size per widget (prevents calendar clipping) */
export const WIDGET_MINS: Record<WidgetId, { w: number; h: number }> = {
  clock: { w: 160, h: 108 },
  weather: { w: 168, h: 108 },
  todo: { w: 200, h: 180 },
  calendar: { w: 240, h: 286 },
};

export const WIDGET_LAYOUT_VERSION_KEY = "portfolio:widget-layout-version";

export type WidgetId = "clock" | "weather" | "todo" | "calendar";

/** Canonical desktop layout — matches design (corners), stable on every fresh load */
export function getDefaultWidgetFrames(
  viewportW: number,
  viewportH: number
): Record<WidgetId, WidgetFrame> {
  const margin = 24;
  const menuBar = 36;
  const dockClearance = 100;
  const maxY = Math.max(menuBar + 8, viewportH - dockClearance);

  const clockH = 118;
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
