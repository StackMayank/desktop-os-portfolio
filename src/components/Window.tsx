import { memo, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS, type AppId } from "@/store/osStore";
import { useDrag } from "@/hooks/useDrag";
import { useResize } from "@/hooks/useResize";

interface Props {
  id: AppId;
  children: ReactNode;
  isMobile: boolean;
  fitContent?: boolean;
}

const WINDOW_MOTION = {
  initial: { opacity: 0, scale: 0.92, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
};

const WINDOW_MOTION_MOBILE = {
  initial: { opacity: 0, scale: 1, y: 0 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

function WindowComponent({ id, children, isMobile, fitContent = false }: Props) {
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
    disabled: isMobile || win.isMaximized,
    getStart: () => ({
      x: winRef.current.x,
      y: winRef.current.y,
      w: winRef.current.width,
      h: winRef.current.height,
    }),
    onResize: ({ x, y, w, h }) => resizeWindow(id, w, h, x, y),
  });

  if (!win.isOpen) return null;

  const windowMotion = isMobile ? WINDOW_MOTION_MOBILE : WINDOW_MOTION;
  const style = isMobile
    ? { zIndex: win.zIndex }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <AnimatePresence>
      {!win.isMinimized && (
        <motion.div
          key={id}
          initial={windowMotion.initial}
          animate={windowMotion.animate}
          exit={windowMotion.exit}
          transition={windowMotion.transition}
          className={
            isMobile
              ? "fixed inset-x-0 top-[calc(1.75rem+env(safe-area-inset-top,0px))] bottom-0 z-[200] glass-strong rounded-none overflow-hidden flex flex-col min-h-0 min-w-0 touch-pan-y"
              : "absolute glass-strong rounded-xl overflow-hidden flex flex-col min-h-0 min-w-0"
          }
          style={{ ...style, ...(resize.cursor && !isMobile ? { cursor: resize.cursor } : {}) }}
          onPointerDown={() => focusApp(id)}
          onPointerDownCapture={(e) => !isMobile && resize.tryPointerDown(e)}
          onPointerMove={!isMobile ? resize.onPointerMove : undefined}
          onPointerLeave={!isMobile ? resize.onPointerLeave : undefined}
        >
          <div
            className="h-10 sm:h-9 shrink-0 flex items-center px-3 select-none border-b border-glass-border touch-none"
            onPointerDown={!isMobile ? drag.onPointerDown : undefined}
            onDoubleClick={() =>
              !isMobile && toggleMaximize(id, { w: window.innerWidth, h: window.innerHeight })
            }
          >
            <div
              className="traffic-lights flex items-center gap-2 shrink-0 z-10"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeApp(id);
                }}
                className="traffic-light bg-mac-red touch-manipulation"
              >
                <span className="traffic-light__glyph" aria-hidden>
                  ×
                </span>
              </button>
              {!isMobile && (
                <>
                  <button
                    type="button"
                    aria-label="Minimize"
                    onClick={(e) => {
                      e.stopPropagation();
                      minimizeApp(id);
                    }}
                    className="traffic-light bg-mac-yellow touch-manipulation"
                  >
                    <span className="traffic-light__glyph" aria-hidden>
                      −
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={win.isMaximized ? "Restore" : "Maximize"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMaximize(id, {
                        w: window.innerWidth,
                        h: window.innerHeight,
                      });
                    }}
                    className="traffic-light bg-mac-green touch-manipulation"
                  >
                    <span className="traffic-light__glyph" aria-hidden>
                      {win.isMaximized ? "↙" : "+"}
                    </span>
                  </button>
                </>
              )}
            </div>
            <div className="flex-1 min-w-0 text-center text-xs text-foreground/80 font-medium truncate px-2 pointer-events-none">
              {win.title}
            </div>
            <div className={`shrink-0 ${isMobile ? "w-3.5" : "w-[52px]"}`} aria-hidden />
          </div>
          <div
            className={
              fitContent && !isMobile
                ? "min-h-0 min-w-0 overflow-auto overscroll-contain scrollbar-hidden"
                : "flex-1 min-h-0 min-w-0 overflow-auto overscroll-contain scrollbar-hidden"
            }
          >
            <div
              className={
                fitContent && !isMobile ? "min-h-0 min-w-0" : "h-full min-h-0 min-w-0"
              }
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Window = memo(WindowComponent);
