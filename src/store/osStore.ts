import { create } from "zustand";

export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact"
  | "music"
  | "game"
  | "terminal";

export interface WindowState {
  id: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  prev?: { x: number; y: number; width: number; height: number };
}

interface OSState {
  windows: Record<AppId, WindowState>;
  topZ: number;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  toggleMaximize: (id: AppId, viewport: { w: number; h: number }) => void;
  focusApp: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  resizeWindow: (id: AppId, w: number, h: number, x?: number, y?: number) => void;
}

const defaults = (id: AppId, title: string, x: number, y: number, w = 760, h = 520): WindowState => ({
  id,
  title,
  x,
  y,
  width: w,
  height: h,
  zIndex: 1,
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
});

export const APP_TITLES: Record<AppId, string> = {
  about: "About Me",
  projects: "Projects — Finder",
  skills: "Skills",
  experience: "Experience",
  contact: "Contact",
  music: "Music",
  game: "Debug the Code",
  terminal: "Terminal — zsh",
};

export const useOS = create<OSState>((set) => ({
  topZ: 10,
  windows: {
    about: defaults("about", APP_TITLES.about, 140, 90, 720, 470),
    projects: defaults("projects", APP_TITLES.projects, 200, 110, 880, 520),
    skills: defaults("skills", APP_TITLES.skills, 180, 130, 760, 440),
    experience: defaults("experience", APP_TITLES.experience, 220, 100, 760, 500),
    contact: defaults("contact", APP_TITLES.contact, 240, 140, 620, 430),
    music: defaults("music", APP_TITLES.music, 260, 120, 720, 500),
    game: defaults("game", APP_TITLES.game, 280, 150, 700, 470),
    terminal: defaults("terminal", APP_TITLES.terminal, 160, 160, 720, 420),
  },
  openApp: (id) =>
    set((s) => {
      const z = s.topZ + 1;
      return {
        topZ: z,
        windows: {
          ...s.windows,
          [id]: { ...s.windows[id], isOpen: true, isMinimized: false, zIndex: z },
        },
      };
    }),
  closeApp: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], isOpen: false, isMinimized: false, isMaximized: false } },
    })),
  minimizeApp: (id) =>
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], isMinimized: true } } })),
  toggleMaximize: (id, viewport) =>
    set((s) => {
      const w = s.windows[id];
      if (w.isMaximized && w.prev) {
        return { windows: { ...s.windows, [id]: { ...w, ...w.prev, isMaximized: false, prev: undefined } } };
      }
      return {
        windows: {
          ...s.windows,
          [id]: {
            ...w,
            prev: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: 28,
            width: viewport.w,
            height: viewport.h - 28 - 92,
            isMaximized: true,
          },
        },
      };
    }),
  focusApp: (id) =>
    set((s) => {
      const z = s.topZ + 1;
      return { topZ: z, windows: { ...s.windows, [id]: { ...s.windows[id], zIndex: z, isMinimized: false } } };
    }),
  moveWindow: (id, x, y) =>
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], x, y } } })),
  resizeWindow: (id, width, height, x, y) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: {
          ...s.windows[id],
          width,
          height,
          ...(typeof x === "number" ? { x } : {}),
          ...(typeof y === "number" ? { y } : {}),
        },
      },
    })),
}));
