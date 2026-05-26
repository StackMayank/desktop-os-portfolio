import type { DocNode } from "@/lib/finderTree";

/** Dock Resume — Finder with Resume folder only */
export const DOC_ROOT: DocNode[] = [
  {
    type: "folder",
    id: "resume",
    name: "Resume",
    children: [
      {
        type: "file",
        id: "resume-pdf",
        name: "Mayank React Resume.pdf",
        fileKind: "resume-pdf",
      },
    ],
  },
];
