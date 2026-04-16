const GROUPS = [
  { title: "Frontend", items: [["React", 95], ["TypeScript", 92], ["Tailwind", 95], ["Framer Motion", 88], ["GSAP", 80]] as [string, number][] },
  { title: "Backend", items: [["Node.js", 85], ["tRPC", 80], ["Postgres", 78], ["Edge Functions", 82]] as [string, number][] },
  { title: "Tooling", items: [["Vite", 92], ["Vitest", 80], ["Playwright", 75], ["Git", 90]] as [string, number][] },
  { title: "Design", items: [["Figma", 82], ["Motion", 85], ["Glassmorphism", 90]] as [string, number][] },
];

export function SkillsApp() {
  return (
    <div className="p-6 grid sm:grid-cols-2 gap-4">
      {GROUPS.map((g) => (
        <div key={g.title} className="glass-soft rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3 text-primary">{g.title}</h3>
          <div className="space-y-2.5">
            {g.items.map(([name, val]) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{name}</span>
                  <span className="text-muted-foreground tabular-nums">{val}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
