import { Sparkles } from "lucide-react";
import profile from "@/assets/profile.png";

export function AboutApp() {
  const timeline = [
    { year: "2026", text: "Completed my frontend development journey and built projects focused on modern web experiences. Now looking to build impactful products with real teams." },
    { year: "2025", text: "Started an e-commerce business and failed because of the limitations of no-code platforms. That experience pushed me to learn development and build products without limits." },
    { year: "2024", text: "Joined a startup as a Digital Marketing Specialist and learned end-to-end growth, branding, and product strategy." },
    { year: "2023", text: "Worked as a Digital Marketing Intern, running ads and building landing pages for high-value clients" },
    { year: "2022", text: "Learned performance marketing and how digital products scale through strategy and user understanding." },
    { year: "2021", text: "Started college and built my first client website as a Web Design Intern using no-code tools." },
  ];
  return (
    <div className="p-6 sm:p-8 space-y-6 min-h-0 min-w-0 max-w-full">
      <div className="flex items-center gap-4">
        <img
          src={profile}
          alt="Mayank"
          className="w-20 h-20 rounded-full object-cover object-center border border-glass-border"
          draggable={false}
          decoding="async"
        />
        <div>
          <h1 className="text-2xl font-semibold">Mayank</h1>
          <p className="text-muted-foreground">Frontend Engineer · Creative Developer</p>
        </div>
      </div>
      <div className="glass-soft rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm text-primary mb-2"><Sparkles className="w-4 h-4" /> Philosophy</div>
        <p className="text-sm leading-relaxed text-foreground">
        I started by building landing pages and conversion funnels, focused on performance and user behavior.
But while marketing products, I became obsessed with how great digital experiences were actually built.

That curiosity pulled me into code, interaction design, and frontend development.
Now, I build the experiences I once only marketed.
        </p>
      </div>
      <div>
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Timeline</h2>
        <ul className="space-y-3">
          {timeline.map((t) => (
            <li key={t.year} className="flex gap-4">
              <span className="w-14 text-primary font-mono text-sm pt-0.5">{t.year}</span>
              <span className="text-sm text-foreground/95 flex-1">{t.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
