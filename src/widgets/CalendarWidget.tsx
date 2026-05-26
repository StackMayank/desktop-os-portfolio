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
  const todayNum = today.getDate();

  return (
    <div className="w-full min-w-0 min-h-[248px] flex flex-col justify-start">
      <div className="text-xs uppercase tracking-widest text-white/80 mb-1 shrink-0">Calendar</div>
      <div className="text-sm font-medium mb-2 truncate shrink-0 text-white" title={monthLabel}>
        {monthLabel}
      </div>
      <div className="grid grid-cols-7 gap-x-1.5 gap-y-1 text-[10px] text-white/60 mb-2 shrink-0">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center leading-none">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-x-1.5 gap-y-1.5 text-[11px] min-w-0 shrink-0">
        {days.map((d, i) => (
          <div
            key={i}
            className={`flex items-center justify-center min-h-[26px] ${
              d ? "text-white/85 hover:bg-white/5 rounded-md" : ""
            }`}
          >
            {d === todayNum ? (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-black font-semibold">
                {d}
              </span>
            ) : (
              d ?? ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
