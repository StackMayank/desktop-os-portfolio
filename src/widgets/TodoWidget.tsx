import { useEffect, useRef, useState } from "react";
import { Plus, Check, Pencil, X } from "lucide-react";

interface Task { id: string; text: string; done: boolean }
const KEY = "todo:list";
type Filter = "all" | "todo" | "completed";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!editingId) return;
    editInputRef.current?.focus();
    editInputRef.current?.select();
  }, [editingId]);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setTasks((p) => [...p, { id: crypto.randomUUID(), text: t, done: false }]);
    setText("");
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = () => {
    const next = editingText.trim();
    if (!editingId) return;
    if (!next) {
      setTasks((p) => p.filter((task) => task.id !== editingId));
    } else {
      setTasks((p) => p.map((task) => (task.id === editingId ? { ...task, text: next } : task)));
    }
    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "todo") return !task.done;
    if (filter === "completed") return task.done;
    return true;
  });

  return (
    <div className="w-full min-w-0 h-full min-h-0 flex flex-col">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 shrink-0">To-Do</div>
      <div className="flex gap-1 mb-2 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
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
      <div className="flex gap-1 mb-2 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
        {[
          { key: "all", label: "All" },
          { key: "todo", label: "To-Do" },
          { key: "completed", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as Filter)}
            className={`rounded-full px-2.5 py-1 text-[11px] transition-colors ${
              filter === tab.key
                ? "bg-primary/80 text-primary-foreground"
                : "bg-black/20 text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ul
        className="space-y-1 flex-1 min-h-0 overflow-auto scrollbar-hidden"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {filteredTasks.map((t) => (
          <li key={t.id} className="flex items-center gap-2 group text-xs">
            <button
              onClick={() => setTasks((p) => p.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}
              className={`w-4 h-4 rounded-full border ${t.done ? "bg-mac-green border-mac-green" : "border-foreground/40"} flex items-center justify-center`}
            >
              {t.done && <Check className="w-3 h-3 text-black" />}
            </button>
            {editingId === t.id ? (
              <>
                <input
                  ref={editInputRef}
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  className="flex-1 bg-black/30 rounded-md px-2 py-1 text-xs outline-none border border-primary/60"
                />
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={saveEdit}
                  className="text-primary hover:text-primary/80"
                  aria-label="Save task"
                >
                  <Check className="w-3 h-3" />
                </button>
              </>
            ) : (
              <>
                <span
                  className={`flex-1 truncate ${t.done ? "line-through text-muted-foreground" : ""}`}
                  onDoubleClick={() => startEditing(t)}
                  title="Double-click to edit"
                >
                  {t.text}
                </span>
                <button
                  onClick={() => startEditing(t)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                  aria-label="Edit task"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setTasks((p) => p.filter((x) => x.id !== t.id))}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  aria-label="Delete task"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            )}
          </li>
        ))}
        {filteredTasks.length === 0 && (
          <li className="rounded-md border border-dashed border-glass-border px-3 py-2 text-xs text-muted-foreground">
            No tasks in this tab.
          </li>
        )}
      </ul>
    </div>
  );
}
