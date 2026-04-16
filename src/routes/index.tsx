import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "@/components/Desktop";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Mayank — Portfolio OS" },
      { name: "description", content: "An interactive macOS-style portfolio by Mayank. Explore apps, widgets, and projects in a real OS-like experience." },
      { property: "og:title", content: "Mayank — Portfolio OS" },
      { property: "og:description", content: "Interactive macOS-style portfolio. Draggable windows, dock, widgets — built with React, Framer Motion and GSAP." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Desktop />;
}
