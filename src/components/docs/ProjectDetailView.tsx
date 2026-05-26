import { ExternalLink } from "lucide-react";
import type { ProjectContent } from "@/lib/projectContent";

interface ProjectDetailViewProps {
  project: ProjectContent;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const imageMax = project.imageSize ?? { width: 720, height: 400 };

  return (
    <div className="w-full max-w-full px-5 py-5 sm:px-8 sm:py-6 space-y-6 box-border">
      <figure className="w-full flex justify-center m-0">
        <div className="inline-flex max-w-full items-center justify-center rounded-xl border border-glass-border glass-soft bg-black/30 p-2 sm:p-2.5 shadow-lg leading-none">
          <img
            src={project.image}
            alt={project.title}
            className="block max-w-full w-auto h-auto object-contain object-center"
            style={{
              maxWidth: `${imageMax.width}px`,
              maxHeight: `${imageMax.height}px`,
            }}
            loading="lazy"
            draggable={false}
          />
        </div>
      </figure>

      <div className="w-full">
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

      <div className="w-full">
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
