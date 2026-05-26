import { useEffect, useState } from "react";
import { Plus, Check, X } from "lucide-react";

interface Task { id: string; text: string; done: boolean }
const KEY = "todo:list";

export function TodoWidget() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const r = localStorage.getItem(KEY);
      return r ? JSON.parse(r) : [
        { id: "1", text: "Review portfolio", done: false },
        { id: "2", text: "Reply to recruiter", done: true },
      ];
    } catch { return []; }
  });
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks]);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setTasks((p) => [...p, { id: crypto.randomUUID(), text: t, done: false }]);
    setText("");
  };

  return (
    <div className="w-60">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">To-Do</div>
      <div className="flex gap-1 mb-2" onPointerDown={(e) => e.stopPropagation()}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="New task…"
          className="flex-1 bg-black/30 rounded-md px-2 py-1 text-xs outline-none border border-glass-border focus:border-primary/60"
        />
        <button onClick={add} className="px-2 rounded-md bg-primary/80 hover:bg-primary text-primary-foreground">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <ul className="space-y-1 max-h-44 overflow-auto scrollbar-hidden" onPointerDown={(e) => e.stopPropagation()}>
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-2 group text-xs">
            <button
              onClick={() => setTasks((p) => p.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}
              className={`w-4 h-4 rounded-full border ${t.done ? "bg-mac-green border-mac-green" : "border-foreground/40"} flex items-center justify-center`}
            >
              {t.done && <Check className="w-3 h-3 text-black" />}
            </button>
            <span className={`flex-1 truncate ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.text}</span>
            <button
              onClick={() => setTasks((p) => p.filter((x) => x.id !== t.id))}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
