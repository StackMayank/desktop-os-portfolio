import { createFileRoute } from "@tanstack/react-router";
import { DesktopWithIntro } from "@/components/intro/IntroGate";
import { WALLPAPER_URL } from "@/lib/wallpaper";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    links: [
      {
        rel: "preload",
        href: WALLPAPER_URL,
        as: "image",
        fetchPriority: "high",
      },
    ],
    meta: [
      { title: "Mayank — Portfolio OS" },
      {
        name: "description",
        content:
          "An interactive macOS-style portfolio by Mayank. Explore apps, widgets, and projects in a real OS-like experience.",
      },
      { property: "og:title", content: "Mayank — Portfolio OS" },
      {
        property: "og:description",
        content:
          "Interactive macOS-style portfolio. Draggable windows, dock, widgets — built with React, Framer Motion and GSAP.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <DesktopWithIntro />;
}
