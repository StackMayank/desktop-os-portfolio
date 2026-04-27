import { useState } from "react";
import { Send, Github, Linkedin, Mail } from "lucide-react";

export function ContactApp() {
  const [sent, setSent] = useState(false);
  return (
    <div className="p-6 space-y-5 min-h-0 min-w-0 max-w-full">
      <div>
        <h2 className="text-xl font-semibold">Get in touch</h2>
        <p className="text-sm text-muted-foreground">Always open to interesting work and conversations.</p>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000); }}
        className="space-y-3"
      >
        <input className="w-full bg-black/30 rounded-lg px-3 py-2 text-sm border border-glass-border focus:border-primary outline-none" placeholder="Your name" required />
        <input type="email" className="w-full bg-black/30 rounded-lg px-3 py-2 text-sm border border-glass-border focus:border-primary outline-none" placeholder="you@example.com" required />
        <textarea rows={4} className="w-full bg-black/30 rounded-lg px-3 py-2 text-sm border border-glass-border focus:border-primary outline-none resize-none" placeholder="Tell me about your project…" required />
        <button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg py-2 flex items-center justify-center gap-2 hover:opacity-90 transition">
          {sent ? "Message sent ✓" : (<><Send className="w-4 h-4" /> Send message</>)}
        </button>
      </form>
      <div className="flex justify-center gap-4 pt-2">
        <a className="p-2 rounded-lg glass-soft hover:text-primary"><Github className="w-4 h-4" /></a>
        <a className="p-2 rounded-lg glass-soft hover:text-primary"><Linkedin className="w-4 h-4" /></a>
        <a className="p-2 rounded-lg glass-soft hover:text-primary"><Mail className="w-4 h-4" /></a>
      </div>
    </div>
  );
}
