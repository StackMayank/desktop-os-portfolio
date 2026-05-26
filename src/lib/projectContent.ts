import bookingScreenshot from "@/assets/project-booking.png";
import portfolioOsScreenshot from "@/assets/project-portfolio-os.png";

export type ProjectId = "booking" | "portfolio-os";

export interface ProjectContent {
  id: ProjectId;
  title: string;
  shortName: string;
  image: string;
  highlights: string[];
  stack: string[];
  projectUrl?: string;
  /** Max display size (px) — smaller render = sharper on screen */
  imageSize?: { width: number; height: number };
}

export const PROJECTS: Record<ProjectId, ProjectContent> = {
  booking: {
    id: "booking",
    title: "Booking.com",
    shortName: "Booking.com",
    image: bookingScreenshot,
    highlights: [
      "Developed an Airbnb-inspired hotel booking SPA with dynamic search, hotel listings, checkout flow, and real-time payment status handling using React, Vite, and React Router.",
      "Built the React frontend and integrated REST APIs via Axios and reusable custom hooks to manage hotels, bookings, user profiles, authentication, and protected routes.",
      "Engineered an admin dashboard for managing hotels, rooms, reservations, and inventory with lazy-loaded routes, modular UI components, form validation, and scalable state management.",
      "Deployed the frontend on Vercel and managed backend deployment on Render, delivering a responsive and production-ready user experience.",
    ],
    stack: [
      "React 19",
      "React Router v7",
      "Tailwind CSS",
      "shadcn/ui",
      "React Hook Form",
      "Zod",
      "Axios",
      "Zustand",
      "Framer Motion",
    ],
    projectUrl: "https://staybookers.vercel.app/",
    imageSize: { width: 720, height: 400 },
  },
  "portfolio-os": {
    id: "portfolio-os",
    title: "Portfolio OS",
    shortName: "Portfolio OS",
    image: portfolioOsScreenshot,
    highlights: [
      "Built a macOS-inspired Portfolio OS with draggable windows, interactive dock, and Finder-style navigation.",
      "Developed a scalable window management system using Zustand for app state, focus, resize, and fullscreen handling.",
      "Optimized performance using lazy loading, Suspense, Vite chunk splitting, and WebP asset compression.",
      "Created reusable drag, resize, and layout hooks for smooth desktop-like interactions across devices.",
      "Integrated widgets, PDF resume preview, terminal app, and live project showcases with responsive mobile support.",
    ],
    stack: [
      "React 19",
      "TypeScript",
      "TanStack Start",
      "TanStack Router",
      "Vite 7",
      "Tailwind CSS 4",
      "Zustand",
      "Framer Motion",
      "GSAP",
    ],
    imageSize: { width: 680, height: 380 },
  },
};

export function getProject(id: ProjectId): ProjectContent {
  return PROJECTS[id];
}
