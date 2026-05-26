import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Folder } from "lucide-react";
import { useDrag } from "@/hooks/useDrag";
import { getDefaultDesktopFolderPosition } from "@/lib/widgetLayout";
import { useOS } from "@/store/osStore";

const FOLDER_W = 88;
const FOLDER_H = 96;
const DRAG_THRESHOLD = 6;

interface DesktopFolderProps {
  label: string;
  appId: "projects";
  /** Centered static folder — no drag (mobile home screen) */
  isMobile?: boolean;
}

function folderFrame(viewportW: number, viewportH: number) {
  const { x, y } = getDefaultDesktopFolderPosition(viewportW, viewportH);
  return { x, y, w: FOLDER_W, h: FOLDER_H };
}

function FolderIcon({ label, isOpen }: { label: string; isOpen: boolean }) {
  return (
    <>
      <Folder
        className={`w-14 h-14 shrink-0 transition pointer-events-none ${
          isOpen ? "text-sky-300 fill-sky-400/90" : "text-sky-400 fill-sky-500/80"
        } group-hover:scale-105`}
        strokeWidth={1.25}
      />
      <span className="text-xs text-center text-white/90 line-clamp-2 w-full leading-tight drop-shadow-sm pointer-events-none">
        {label}
      </span>
    </>
  );
}

export function DesktopFolder({ label, appId, isMobile = false }: DesktopFolderProps) {
  const openApp = useOS((s) => s.openApp);
  const focusApp = useOS((s) => s.focusApp);
  const isOpen = useOS((s) => s.windows[appId].isOpen);

  const open = useCallback(() => {
    const w = useOS.getState().windows[appId];
    if (w.isOpen && !w.isMinimized) focusApp(appId);
    else openApp(appId);
  }, [appId, focusApp, openApp]);

  const [frame, setFrame] = useState(() =>
    folderFrame(
      typeof window !== "undefined" ? window.innerWidth : 1280,
      typeof window !== "undefined" ? window.innerHeight : 800
    )
  );
  const frameRef = useRef(frame);
  frameRef.current = frame;
  const userMovedRef = useRef(false);

  const draggedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const drag = useDrag({
    getStart: () => ({ x: frameRef.current.x, y: frameRef.current.y }),
    onStart: () => {
      draggedRef.current = false;
      dragStartRef.current = { x: frameRef.current.x, y: frameRef.current.y };
    },
    onMove: (nx, ny) => {
      const dx = Math.abs(nx - dragStartRef.current.x);
      const dy = Math.abs(ny - dragStartRef.current.y);
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        draggedRef.current = true;
        userMovedRef.current = true;
      }
      const maxX = Math.max(8, window.innerWidth - FOLDER_W - 8);
      const maxY = Math.max(36, window.innerHeight - FOLDER_H - 100);
      setFrame((f) => ({
        ...f,
        x: Math.min(Math.max(8, nx), maxX),
        y: Math.min(Math.max(36, ny), maxY),
      }));
    },
  });

  useLayoutEffect(() => {
    const syncCenter = () => {
      if (userMovedRef.current) return;
      setFrame(folderFrame(window.innerWidth, window.innerHeight));
    };
    syncCenter();
    window.addEventListener("resize", syncCenter);
    return () => window.removeEventListener("resize", syncCenter);
  }, []);

  useEffect(() => {
    const clamp = () => {
      if (!userMovedRef.current) return;
      setFrame((f) => {
        const maxX = Math.max(8, window.innerWidth - FOLDER_W - 8);
        const maxY = Math.max(36, window.innerHeight - FOLDER_H - 100);
        const nx = Math.min(Math.max(8, f.x), maxX);
        const ny = Math.min(Math.max(36, f.y), maxY);
        if (nx === f.x && ny === f.y) return f;
        return { ...f, x: nx, y: ny };
      });
    };
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, []);

  const handleOpen = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    open();
  };

  const folderButtonClass =
    "flex flex-col items-center gap-1.5 w-[88px] p-2 rounded-lg hover:bg-white/10 transition text-left touch-manipulation group cursor-default select-none";

  if (isMobile) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        data-desktop-enter="widget"
        className={folderButtonClass}
        aria-label={`Open ${label}`}
      >
        <FolderIcon label={label} isOpen={isOpen} />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      onPointerDown={drag.onPointerDown}
      className={`absolute z-[6] ${folderButtonClass}`}
      style={{ left: frame.x, top: frame.y }}
      aria-label={`Open ${label}`}
    >
      <FolderIcon label={label} isOpen={isOpen} />
    </div>
  );
}
