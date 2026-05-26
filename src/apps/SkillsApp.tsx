const GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["JavaScript", "TypeScript", "CSS", "HTML"],
  },
  {
    title: "Frameworks",
    items: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    title: "State Management",
    items: ["Redux Toolkit", "Zustand"],
  },
  {
    title: "Platforms",
    items: ["Vercel", "Netlify", "Firebase", "Supabase", "MongoDB Atlas", "Render"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Postman", "Clerk", "Docker", "Figma"],
  },
  {
    title: "Analytics & Product Scaling",
    items: ["PostHog", "Google Analytics", "Microsoft Clarity", "Google Ads", "Meta Ads"],
  },
];

export function SkillsApp() {
  return (
    <div className="p-6 grid sm:grid-cols-2 gap-4 min-h-0 min-w-0 max-w-full">
      {GROUPS.map((g) => (
        <div key={g.title} className="glass-soft rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3 text-primary">{g.title}</h3>
          <div className="flex flex-wrap gap-2">
            {g.items.map((name) => (
              <span
                key={name}
                className="text-xs px-2.5 py-1 rounded-md glass-soft text-foreground/90"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
