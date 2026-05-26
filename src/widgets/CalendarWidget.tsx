import { useMemo } from "react";

export function CalendarWidget() {
  const today = new Date();
  const { days, monthLabel } = useMemo(() => {
    const y = today.getFullYear();
    const m = today.getMonth();
    const first = new Date(y, m, 1).getDay();
    const last = new Date(y, m + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < first; i++) arr.push(null);
    for (let d = 1; d <= last; d++) arr.push(d);
    return {
      days: arr,
      monthLabel: today.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    };
  }, [today.getMonth(), today.getFullYear()]);

  return (
    <div className="w-60">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Calendar</div>
      <div className="text-sm font-medium mb-2">{monthLabel}</div>
      <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground mb-1">
        {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {days.map((d, i) => (
          <div
            key={i}
            className={`text-center py-1 rounded-md ${
              d === today.getDate()
                ? "bg-primary text-primary-foreground font-semibold"
                : d ? "hover:bg-white/5" : ""
            }`}
          >
            {d ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
}
