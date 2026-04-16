import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS, type AppId } from "@/store/osStore";
import { useDrag } from "@/hooks/useDrag";
import { useResize } from "@/hooks/useResize";

interface Props {
  id: AppId;
  children: ReactNode;
  isMobile: boolean;
}

export function Window({ id, children, isMobile }: Props) {
  const win = useOS((s) => s.windows[id]);
  const focusApp = useOS((s) => s.focusApp);
  const closeApp = useOS((s) => s.closeApp);
  const minimizeApp = useOS((s) => s.minimizeApp);
  const toggleMaximize = useOS((s) => s.toggleMaximize);
  const moveWindow = useOS((s) => s.moveWindow);
  const resizeWindow = useOS((s) => s.resizeWindow);
  const winRef = useRef(win);
  winRef.current = win;

  const drag = useDrag({
    disabled: isMobile || win.isMaximized,
    getStart: () => ({ x: winRef.current.x, y: winRef.current.y }),
    onMove: (x, y) => moveWindow(id, Math.max(0, x), Math.max(28, y)),
    onStart: () => focusApp(id),
  });

  const resize = useResize({
    getStart: () => ({ w: winRef.current.width, h: winRef.current.height }),
    onResize: (w, h) => resizeWindow(id, w, h),
  });

  useEffect(() => {
    if (!win.isOpen) return;
  }, [win.isOpen]);

  if (!win.isOpen) return null;

  const style = isMobile
    ? { left: 0, top: 28, width: "100vw", height: "calc(100vh - 28px - 92px)", zIndex: win.zIndex }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <AnimatePresence>
      {!win.isMinimized && (
        <motion.div
          key={id}
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="absolute glass-strong rounded-xl overflow-hidden flex flex-col"
          style={style}
          onPointerDown={() => focusApp(id)}
        >
          <div
            className="h-9 flex items-center px-3 select-none cursor-grab active:cursor-grabbing border-b border-glass-border"
            onPointerDown={drag.onPointerDown}
            onPointerMove={drag.onPointerMove}
            onPointerUp={drag.onPointerUp}
            onDoubleClick={() => !isMobile && toggleMaximize(id, { w: window.innerWidth, h: window.innerHeight })}
          >
            <div className="flex items-center gap-2 group">
              <button
                aria-label="Close"
                onClick={(e) => { e.stopPropagation(); closeApp(id); }}
                className="w-3 h-3 rounded-full bg-mac-red flex items-center justify-center text-[8px] text-black/70 font-bold"
              >
                <span className="opacity-0 group-hover:opacity-100">×</span>
              </button>
              <button
                aria-label="Minimize"
                onClick={(e) => { e.stopPropagation(); minimizeApp(id); }}
                className="w-3 h-3 rounded-full bg-mac-yellow flex items-center justify-center text-[8px] text-black/70 font-bold"
              >
                <span className="opacity-0 group-hover:opacity-100">−</span>
              </button>
              <button
                aria-label="Maximize"
                onClick={(e) => { e.stopPropagation(); !isMobile && toggleMaximize(id, { w: window.innerWidth, h: window.innerHeight }); }}
                className="w-3 h-3 rounded-full bg-mac-green flex items-center justify-center text-[8px] text-black/70 font-bold"
              >
                <span className="opacity-0 group-hover:opacity-100">+</span>
              </button>
            </div>
            <div className="flex-1 text-center text-xs text-foreground/80 font-medium truncate px-4">
              {win.title}
            </div>
            <div className="w-12" />
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
          {!isMobile && !win.isMaximized && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
              onPointerDown={resize.onPointerDown}
              onPointerMove={resize.onPointerMove}
              onPointerUp={resize.onPointerUp}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
