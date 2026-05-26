import { Sparkles } from "lucide-react";

export function AboutApp() {
  const timeline = [
    { year: "2024", text: "Building Portfolio OS — an interactive macOS-style portfolio." },
    { year: "2023", text: "Shipped 3 production React apps with millions of interactions." },
    { year: "2022", text: "Started exploring 3D, motion design, and creative engineering." },
    { year: "2021", text: "Wrote my first line of TypeScript. Never looked back." },
  ];
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">M</div>
        <div>
          <h1 className="text-2xl font-semibold">Mayank</h1>
          <p className="text-muted-foreground">Frontend Engineer · Creative Developer</p>
        </div>
      </div>
      <div className="glass-soft rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm text-primary mb-2"><Sparkles className="w-4 h-4" /> Philosophy</div>
        <p className="text-sm leading-relaxed text-foreground/90">
          I believe interfaces should feel <em>alive</em> — every transition, every micro-interaction
          is an opportunity to delight. I obsess over performance, type-safety, and the small details
          that turn a website into an experience.
        </p>
      </div>
      <div>
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Timeline</h2>
        <ul className="space-y-3">
          {timeline.map((t) => (
            <li key={t.year} className="flex gap-4">
              <span className="w-14 text-primary font-mono text-sm pt-0.5">{t.year}</span>
              <span className="text-sm text-foreground/85 flex-1">{t.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
