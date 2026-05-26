const JOBS = [
  { role: "Digital Marketing Specialist", co: "J2l Technologies", years: "july 2024 — December 2024", body: "Managed ₹12L+ in ad spend while leading end-to-end marketing strategy, execution, and marketing teams." },
  { role: "Digital Marketing Intern", co: "Edify Media", years: "january 2023 — April 2023", body: "Built 3 no-code websites, created 7+ landing pages, and managed ad campaigns worth ₹13,000+ for real clients." },
  { role: "Web Designer Intern", co: "Ambilimon Digital", years: "September 2021 — December 2021", body: "Delivered 6+ websites using no-code platforms for real clients and managed ad campaigns worth ₹45,000+." },
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
