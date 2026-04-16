import { useEffect, useState } from "react";

export function ClockWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  return (
    <div className="w-44">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">New Delhi</div>
      <div className="text-4xl font-light tabular-nums mt-2 text-glow">{time}</div>
      <div className="text-xs text-muted-foreground mt-1">{date}</div>
    </div>
  );
}
