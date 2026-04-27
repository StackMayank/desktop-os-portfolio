import { useState } from "react";
import { LayoutGrid, List, Folder, ArrowLeft, ExternalLink } from "lucide-react";

interface Project { id: string; name: string; tag: string; desc: string; tech: string[] }
const PROJECTS: Project[] = [
  { id: "opusforge", name: "OpusForge", tag: "AI", desc: "Realtime collaborative AI music studio with WebAudio + WebRTC.", tech: ["React", "WebAudio", "Rust"] },
  { id: "aora", name: "Aora Media", tag: "SaaS", desc: "Headless video CMS with edge transcoding.", tech: ["Next.js", "Cloudflare", "Postgres"] },
  { id: "doccures", name: "DocCures", tag: "Health", desc: "Telemedicine platform serving 50k patients.", tech: ["React Native", "FHIR"] },
  { id: "skillog", name: "Skillog", tag: "EdTech", desc: "Spaced-repetition learning OS for engineers.", tech: ["TypeScript", "tRPC"] },
  { id: "ludo", name: "Ludo Loophole", tag: "Game", desc: "Multiplayer board-game with deterministic rollback.", tech: ["WebSockets", "Canvas"] },
  { id: "scrapple", name: "Scrapple", tag: "Tool", desc: "Visual web-scraper with no-code selectors.", tech: ["Playwright", "React"] },
];

export function ProjectsApp() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <div className="flex flex-col h-full min-h-0 min-w-0">
        <div className="px-5 py-3 border-b border-glass-border flex items-center gap-3 shrink-0">
          <button onClick={() => setSelected(null)} className="hover:text-primary"><ArrowLeft className="w-4 h-4" /></button>
          <div className="font-medium">{selected.name}</div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{selected.tag}</span>
        </div>
        <div className="p-6 space-y-4 flex-1 min-h-0 overflow-auto">
          <p className="text-sm leading-relaxed text-foreground/90">{selected.desc}</p>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tech</div>
            <div className="flex flex-wrap gap-2">
              {selected.tech.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded glass-soft">{t}</span>
              ))}
            </div>
          </div>
          <button className="text-sm flex items-center gap-2 text-primary hover:underline">
            Live preview <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 min-w-0">
      <aside className="w-36 sm:w-44 shrink-0 border-r border-glass-border p-3 hidden md:block text-sm">
        <div className="text-xs uppercase text-muted-foreground mb-2">Favourites</div>
        <div className="space-y-1">
          <div className="px-2 py-1 rounded bg-primary/20 text-primary">Projects</div>
          <div className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground">Recents</div>
          <div className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground">Archive</div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <div className="px-4 py-2 flex items-center justify-between border-b border-glass-border shrink-0">
          <div className="text-sm text-muted-foreground">{PROJECTS.length} items</div>
          <div className="flex gap-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-white/10" : ""}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-white/10" : ""}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {PROJECTS.map((p) => (
                <button
                  key={p.id}
                  onDoubleClick={() => setSelected(p)}
                  onClick={() => setSelected(p)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition"
                >
                  <Folder className="w-14 h-14 text-sky-400 fill-sky-500/80" />
                  <span className="text-xs text-center truncate w-full">{p.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-glass-border">
              {PROJECTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-white/5 text-left"
                >
                  <Folder className="w-5 h-5 text-sky-400" />
                  <span className="text-sm flex-1">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
