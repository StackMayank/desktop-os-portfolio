import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

interface Puzzle { buggy: string; options: string[]; answer: number; hint: string }
const PUZZLES: Puzzle[] = [
  {
    buggy: "for (let i = 0; i < arr.lenght; i++) { sum += arr[i] }",
    options: ["arr.length", "arr.size", "arr.count", "arr.len"],
    answer: 0,
    hint: "Typo in property name.",
  },
  {
    buggy: "const user = { name: 'Mayank' }; console.log(user.Name)",
    options: ["user.name", "user['Name']", "user.NAME", "User.name"],
    answer: 0,
    hint: "JS keys are case-sensitive.",
  },
  {
    buggy: "useEffect(() => { fetch(url) })",
    options: ["Add deps array", "Add async", "Wrap in try", "Use useMemo"],
    answer: 0,
    hint: "Effect runs every render without deps.",
  },
  {
    buggy: "if (x = 5) { … }",
    options: ["x === 5", "x := 5", "x equals 5", "x <> 5"],
    answer: 0,
    hint: "= is assignment, not comparison.",
  },
];

export function GameApp() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const puzzle = useMemo(() => PUZZLES[idx % PUZZLES.length], [idx]);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === puzzle.answer) setScore((s) => s + 1);
    setTimeout(() => { setIdx((p) => p + 1); setPicked(null); }, 900);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Debug the Code</h2>
          <p className="text-xs text-muted-foreground">{puzzle.hint}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm">Score: <span className="font-bold text-primary">{score}</span></div>
          <button onClick={() => { setScore(0); setIdx(0); }} className="p-1.5 rounded glass-soft"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>
      <pre className="font-mono text-sm bg-black/50 rounded-lg p-4 border border-glass-border overflow-x-auto">
        <code className="text-amber-300">{puzzle.buggy}</code>
      </pre>
      <div className="grid grid-cols-2 gap-2">
        {puzzle.options.map((o, i) => {
          const isAnswer = picked !== null && i === puzzle.answer;
          const isWrong = picked === i && i !== puzzle.answer;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className={`text-sm font-mono py-2.5 rounded-lg border transition ${
                isAnswer ? "bg-mac-green/30 border-mac-green" :
                isWrong ? "bg-destructive/30 border-destructive" :
                "glass-soft hover:border-primary"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
