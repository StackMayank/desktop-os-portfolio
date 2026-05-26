import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { AppId } from "@/store/osStore";

const lazyNamed = <T extends ComponentType<object>>(
  loader: () => Promise<{ [key: string]: T }>,
  name: string
): LazyExoticComponent<T> =>
  lazy(() => loader().then((m) => ({ default: m[name] as T })));

export const LAZY_APPS: Record<AppId, LazyExoticComponent<ComponentType<object>>> = {
  about: lazyNamed(() => import("@/apps/AboutApp"), "AboutApp"),
  docs: lazyNamed(() => import("@/apps/DocsApp"), "DocsApp"),
  projects: lazyNamed(() => import("@/apps/ProjectsApp"), "ProjectsApp"),
  preview: lazyNamed(() => import("@/apps/PreviewApp"), "PreviewApp"),
  skills: lazyNamed(() => import("@/apps/SkillsApp"), "SkillsApp"),
  experience: lazyNamed(() => import("@/apps/ExperienceApp"), "ExperienceApp"),
  contact: lazyNamed(() => import("@/apps/ContactApp"), "ContactApp"),
  music: lazyNamed(() => import("@/apps/MusicApp"), "MusicApp"),
  game: lazyNamed(() => import("@/apps/GameApp"), "GameApp"),
  terminal: lazyNamed(() => import("@/apps/TerminalApp"), "TerminalApp"),
};
