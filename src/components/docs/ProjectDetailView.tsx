import { ExternalLink } from "lucide-react";
import type { ProjectContent } from "@/lib/projectContent";

interface ProjectDetailViewProps {
  project: ProjectContent;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const imageMax = project.imageSize;
  const shellMaxW = imageMax ? imageMax.width + 32 : undefined;

  return (
    <div
      className="p-4 space-y-4 mx-auto w-full"
      style={{
        maxWidth: shellMaxW
          ? `min(96vw, ${shellMaxW}px)`
          : "min(96vw, 56rem)",
      }}
    >
      <div className="rounded-xl overflow-hidden border border-glass-border glass-soft bg-black/20 flex justify-center items-center p-1">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-auto block object-contain mx-auto"
          style={
            imageMax
              ? { maxWidth: imageMax.width, maxHeight: imageMax.height, width: "100%" }
              : undefined
          }
          loading="lazy"
          draggable={false}
        />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="text-base font-semibold text-white">{project.title}</h2>
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition"
            >
              Open project
              <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>
          ) : null}
        </div>
        <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Highlights</p>
        <ul className="space-y-2 text-sm text-white/85 leading-relaxed list-disc pl-4 marker:text-primary">
          {project.highlights.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Tech stack</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2.5 py-1 rounded-md glass-soft text-foreground/90 border border-glass-border"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
