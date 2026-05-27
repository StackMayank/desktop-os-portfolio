import type { DocNode } from "@/lib/finderTree";

/** Desktop “Project and resume” folder — projects + resume PDF */
export const PROJECTS_ROOT: DocNode[] = [
  {
    type: "file",
    id: "booking",
    name: "Booking.com",
    fileKind: "project",
    projectId: "booking",
  },
  {
    type: "file",
    id: "portfolio-os",
    name: "Portfolio OS",
    fileKind: "project",
    projectId: "portfolio-os",
  },
  {
    type: "file",
    id: "resume-pdf",
    name: "Mayank Resume.pdf",
    fileKind: "resume-pdf",
  },
];
