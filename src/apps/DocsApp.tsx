import { useEffect, useLayoutEffect, useRef } from "react";
import { FileText } from "lucide-react";
import { useOS } from "@/store/osStore";

/** Min width fits sidebar + traffic lights + title (never clip window chrome). */
const DOCS_MIN_W = 540;
const DOCS_MIN_H = 260;
const DOCS_TITLE_CHROME_H = 40;

export function DocsApp() {
  const browseRef = useRef<HTMLDivElement>(null);
  const openApp = useOS((s) => s.openApp);
  const resizeWindow = useOS((s) => s.resizeWindow);
  const docsWin = useOS((s) => s.windows.docs);

  const openResume = () => openApp("preview");

  useEffect(() => {
    openResume();
  }, [openApp]);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    if (!docsWin.isOpen || docsWin.isMaximized) return;
    const el = browseRef.current;
    if (!el) return;
    const w = Math.min(640, Math.max(DOCS_MIN_W, el.offsetWidth + 4));
    const h = Math.min(360, Math.max(DOCS_MIN_H, el.offsetHeight + DOCS_TITLE_CHROME_H));
    resizeWindow("docs", w, h);
  }, [resizeWindow, docsWin.isOpen, docsWin.isMaximized]);

  return (
    <div ref={browseRef} className="flex w-max max-w-full overflow-hidden rounded-b-2xl">
      <aside className="w-36 sm:w-40 shrink-0 border-r border-glass-border p-3 hidden md:block text-sm self-stretch">
        <p className="text-xs uppercase text-white/70 mb-2">Favourites</p>
        <div className="px-2 py-1 rounded-lg bg-primary/20 text-primary">Resume</div>
      </aside>
      <div className="flex flex-col min-w-0">
        <div className="px-4 py-2 border-b border-glass-border shrink-0 rounded-tr-2xl">
          <p className="text-sm text-white/70">1 item</p>
        </div>
        <div className="p-4">
          <button
            type="button"
            onClick={openResume}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition w-[88px]"
          >
            <FileText className="w-14 h-14 text-sky-300 shrink-0" strokeWidth={1.25} />
            <span className="text-xs text-center truncate w-full text-white">Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}
