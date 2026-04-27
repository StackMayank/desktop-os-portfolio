const JOBS = [
  { role: "Senior Frontend Engineer", co: "Aurora Labs", years: "2023 — Now", body: "Leading the design system and motion guild. Shipped a realtime collaboration canvas." },
  { role: "Frontend Engineer", co: "Northwind", years: "2021 — 2023", body: "Built the analytics dashboard used by 12k orgs. Reduced TTI by 38%." },
  { role: "Web Developer", co: "Freelance", years: "2019 — 2021", body: "Delivered 20+ marketing sites for startups across India and SEA." },
];

export function ExperienceApp() {
  return (
    <div className="p-6 min-h-0 min-w-0 max-w-full overflow-auto">
      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
        {JOBS.map((j) => (
          <div key={j.role} className="relative mb-6">
            <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
            <div className="glass-soft rounded-xl p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="font-semibold">{j.role}</h3>
                <span className="text-primary text-sm">@ {j.co}</span>
                <span className="text-xs text-muted-foreground ml-auto">{j.years}</span>
              </div>
              <p className="text-sm mt-2 text-foreground/85">{j.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
