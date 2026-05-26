import { useEffect, useRef, useState } from "react";
import { useOS, type AppId } from "@/store/osStore";

interface Line { kind: "in" | "out"; text: string }

const HELP = `Available commands:
  help        — show this message
  about       — open the About app
  docs    — open Resume
  skills      — open the Skills app
  contact     — open WhatsApp chat
  whoami      — about me
  ls          — list apps
  clear       — clear the screen
  echo <txt>  — print text`;

export function TerminalApp() {
  const openApp = useOS((s) => s.openApp);
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "Last login: today on console" },
    { kind: "out", text: "Welcome to Mayank-OS. Type 'help' to begin." },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const out: Line[] = [{ kind: "in", text: raw }];
    const [name, ...rest] = cmd.split(/\s+/);
    const appsMap: Record<string, AppId> = { about: "about", docs: "docs", skills: "skills", music: "music", game: "game" };
    switch (name) {
      case "":
        break;
      case "contact":
        window.open("https://wa.link/pf9ivh", "_blank", "noopener,noreferrer");
        out.push({ kind: "out", text: "Opening WhatsApp…" });
        break;
      case "help":
        out.push({ kind: "out", text: HELP });
        break;
      case "clear":
        setLines([]);
        return;
      case "whoami":
        out.push({ kind: "out", text: "mayank — frontend engineer building delightful interfaces." });
        break;
      case "ls":
        out.push({ kind: "out", text: "about  docs  skills  experience  contact  music  game" });
        break;
      case "echo":
        out.push({ kind: "out", text: rest.join(" ") });
        break;
      default:
        if (appsMap[name]) {
          openApp(appsMap[name]);
          out.push({ kind: "out", text: `Opening ${name}…` });
        } else {
          out.push({ kind: "out", text: `zsh: command not found: ${name}` });
        }
    }
    setLines((p) => [...p, ...out]);
  };

  return (
    <div
      className="h-full min-h-0 min-w-0 bg-black/70 font-mono text-[13px] p-3 text-emerald-200 overflow-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {l.kind === "in" ? <><span className="text-primary">mayank@portfolio</span> <span className="text-accent">~</span> $ {l.text}</> : l.text}
        </div>
      ))}
      <div className="flex">
        <span className="text-primary">mayank@portfolio</span>&nbsp;<span className="text-accent">~</span>&nbsp;${"\u00a0"}
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { run(input); setInput(""); } }}
          className="flex-1 bg-transparent outline-none text-emerald-100 caret-primary"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
