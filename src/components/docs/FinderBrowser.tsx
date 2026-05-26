import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, FileText, Folder, LayoutGrid } from "lucide-react";
import { ProjectDetailView } from "@/components/docs/ProjectDetailView";
import { APP_TITLES, useOS, type AppId } from "@/store/osStore";
import {
  getChildrenAtPath,
  getFolderNameAtPath,
  isProjectFile,
  pathKey,
  type DocNode,
} from "@/lib/finderTree";
import { getProject, type ProjectId } from "@/lib/projectContent";
import bookingThumb from "@/assets/project-booking.png";
import portfolioOsThumb from "@/assets/project-portfolio-os.png";

const DOCS_MIN_W = 540;
const DOCS_MIN_H = 260;
const DOCS_DETAIL_MIN_W = 640;
const DOCS_DETAIL_MIN_H = 420;
/** Home grid: 2 project thumbs + resume icon in one row */
const PROJECTS_HOME_MIN_W = 720;
const PROJECTS_HOME_MIN_H = 320;
const DOCS_TITLE_CHROME_H = 40;

const PROJECT_THUMBS: Partial<Record<ProjectId, string>> = {
  booking: bookingThumb,
  "portfolio-os": portfolioOsThumb,
};

export interface FinderSidebarLink {
  label: string;
  path: string[];
}

interface FinderBrowserProps {
  windowId: Extract<AppId, "docs" | "projects">;
  root: DocNode[];
  defaultTitle: string;
  sidebarLinks: FinderSidebarLink[];
  /** Open inside folder on mount (e.g. Resume) */
  initialPath?: string[];
  openResumeOnMount?: boolean;
  /** Shrink window to content (docs); projects opens maximized and fills the window */
  fitToContent?: boolean;
}

export function FinderBrowser({
  windowId,
  root,
  defaultTitle,
  sidebarLinks,
  initialPath = [],
  openResumeOnMount = false,
  fitToContent = true,
}: FinderBrowserProps) {
  const browseRef = useRef<HTMLDivElement>(null);
  const openApp = useOS((s) => s.openApp);
  const focusApp = useOS((s) => s.focusApp);
  const resizeWindow = useOS((s) => s.resizeWindow);
  const setWindowTitle = useOS((s) => s.setWindowTitle);
  const win = useOS((s) => s.windows[windowId]);

  const [path, setPath] = useState<string[]>(initialPath);
  const [openProjectId, setOpenProjectId] = useState<ProjectId | null>(null);

  const items = getChildrenAtPath(root, path);
  const pathLabel = path.length === 0 ? "Home" : (getFolderNameAtPath(root, path) ?? defaultTitle);
  const activeProject = openProjectId ? getProject(openProjectId) : null;

  const openResumePreview = () => {
    openApp("preview");
    focusApp("preview");
  };

  useEffect(() => {
    if (!openResumeOnMount) return;
    openResumePreview();
  }, [openResumeOnMount]);

  useEffect(() => {
    if (openProjectId) {
      setWindowTitle(windowId, activeProject?.title ?? defaultTitle);
      return;
    }
    const title =
      path.length === 0 ? defaultTitle : (getFolderNameAtPath(root, path) ?? defaultTitle);
    setWindowTitle(windowId, title);
    return () => setWindowTitle(windowId, defaultTitle);
  }, [path, openProjectId, activeProject?.title, setWindowTitle, windowId, defaultTitle, root]);

  useLayoutEffect(() => {
    if (!fitToContent) return;
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    if (!win.isOpen || win.isMaximized) return;
    const el = browseRef.current;
    if (!el) return;

    const isProjectsHomeView = windowId === "projects" && !openProjectId;
    const minW = openProjectId
      ? DOCS_DETAIL_MIN_W
      : isProjectsHomeView
        ? PROJECTS_HOME_MIN_W
        : DOCS_MIN_W;
    const minH = openProjectId
      ? DOCS_DETAIL_MIN_H
      : isProjectsHomeView
        ? PROJECTS_HOME_MIN_H
        : DOCS_MIN_H;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const maxW = openProjectId
      ? Math.min(viewportW - 48, 980)
      : isProjectsHomeView
        ? Math.min(viewportW - 48, 820)
        : 640;
    const maxH = openProjectId ? Math.min(viewportH - 80, 920) : isProjectsHomeView ? 420 : 360;

    const w = Math.min(maxW, Math.max(minW, el.offsetWidth + 4));
    const h = Math.min(maxH, Math.max(minH, el.offsetHeight + DOCS_TITLE_CHROME_H));
    resizeWindow(windowId, w, h);
  }, [
    resizeWindow,
    win.isOpen,
    win.isMaximized,
    pathKey(path),
    items.length,
    openProjectId,
    windowId,
    fitToContent,
  ]);

  const goToPath = (next: string[]) => {
    setOpenProjectId(null);
    setPath(next);
  };

  const openItem = (node: DocNode) => {
    if (node.type === "folder") {
      setOpenProjectId(null);
      setPath((p) => [...p, node.id]);
      return;
    }
    if (node.fileKind === "resume-pdf") {
      openResumePreview();
      return;
    }
    if (isProjectFile(node)) {
      setOpenProjectId(node.projectId);
    }
  };

  const goBack = () => {
    if (openProjectId) {
      setOpenProjectId(null);
      return;
    }
    setPath((p) => p.slice(0, -1));
  };

  const isSidebarActive = (linkPath: string[]) => pathKey(linkPath) === pathKey(path);

  const isProjectsHome = windowId === "projects" && !openProjectId;
  /** Full-width shell when maximized or when viewing a project detail */
  const fillsWindow =
    !fitToContent ||
    (windowId === "projects" && (win.isMaximized || !!openProjectId));

  const renderFileIcon = (node: DocNode, large = false) => {
    const iconClass = large ? "w-16 h-16" : "w-14 h-14";
    const thumbClass = large ? "w-[5.5rem] h-[5.5rem] sm:w-24 sm:h-24" : "w-14 h-14";

    if (node.type === "folder") {
      return <Folder className={`${iconClass} text-sky-400 fill-sky-500/80 shrink-0`} strokeWidth={1.25} />;
    }
    if (node.fileKind === "resume-pdf") {
      return <FileText className={`${iconClass} text-sky-300 shrink-0`} strokeWidth={1.25} />;
    }
    if (isProjectFile(node)) {
      const thumb = PROJECT_THUMBS[node.projectId];
      if (thumb) {
        return (
          <div
            className={`${thumbClass} rounded-xl overflow-hidden border border-glass-border shrink-0 bg-black/30 shadow-md`}
          >
            <img src={thumb} alt="" className="w-full h-full object-cover object-top" draggable={false} />
          </div>
        );
      }
      return <LayoutGrid className={`${iconClass} text-violet-300 shrink-0`} strokeWidth={1.25} />;
    }
    return <FileText className={`${iconClass} text-sky-300 shrink-0`} strokeWidth={1.25} />;
  };

  const shellClass = fillsWindow
    ? "flex w-full h-full min-h-full overflow-hidden rounded-b-2xl bg-[var(--window-content)]"
    : "flex w-max max-w-full overflow-hidden rounded-b-2xl";

  return (
    <div ref={browseRef} className={shellClass}>
      <aside
        className={`w-36 sm:w-40 shrink-0 border-r border-glass-border p-3 hidden md:block text-sm ${
          fillsWindow ? "min-h-full" : "self-stretch"
        }`}
      >
        <p className="text-xs uppercase text-white/70 mb-2">Favourites</p>
        <div className="space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => goToPath([...link.path])}
              className={`w-full text-left px-2 py-1 rounded-lg transition ${
                isSidebarActive(link.path)
                  ? "bg-primary/20 text-primary"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </aside>
      <div
        className={`flex flex-col min-w-0 min-h-0 ${fillsWindow ? "flex-1 h-full overflow-hidden" : ""}`}
      >
        <div className="px-4 py-2 border-b border-glass-border shrink-0 rounded-tr-2xl flex items-center gap-2 min-h-9">
          {path.length > 0 || openProjectId ? (
            <button
              type="button"
              onClick={goBack}
              className="p-1 rounded-md hover:bg-white/10 text-white/80 shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : null}
          <p className="text-sm text-white/70 truncate">
            {openProjectId ? activeProject?.title : `${pathLabel} · ${items.length} items`}
          </p>
        </div>

        {activeProject ? (
          <div
            className={
              fillsWindow
                ? "flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden overscroll-contain"
                : "w-full max-h-[min(70vh,32rem)] overflow-y-auto overflow-x-hidden overscroll-contain"
            }
          >
            <ProjectDetailView project={activeProject} />
          </div>
        ) : (
          <div
            className={
              isProjectsHome
                ? fillsWindow
                  ? "p-6 flex-1 flex flex-col min-h-0 h-full"
                  : "p-4 flex flex-col min-h-0"
                : fitToContent
                  ? "p-4"
                  : "p-6 flex-1"
            }
          >
            {items.length === 0 ? (
              <p className="text-sm text-white/50 px-2">This folder is empty.</p>
            ) : isProjectsHome ? (
              <div className="flex-1 min-h-0 w-full overflow-auto">
                <div className="flex flex-wrap items-start justify-start content-start gap-x-6 gap-y-5 sm:gap-x-8 sm:gap-y-6 w-full">
                  {items.map((node) => {
                    const isProject = isProjectFile(node);
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => openItem(node)}
                        onDoubleClick={() => openItem(node)}
                        className={`flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition ${
                          isProject ? "w-[7.5rem] sm:w-[8.5rem]" : "w-[6.5rem] sm:w-28"
                        }`}
                      >
                        {renderFileIcon(node, isProject)}
                        <span className="text-[11px] sm:text-xs text-center w-full text-white leading-snug break-words [overflow-wrap:anywhere]">
                          {node.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className={
                  fitToContent
                    ? "grid grid-cols-3 sm:grid-cols-4 gap-3"
                    : "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
                }
              >
                {items.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => openItem(node)}
                    onDoubleClick={() => openItem(node)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition min-w-[104px] max-w-[128px]"
                  >
                    {renderFileIcon(node)}
                    <span className="text-xs text-center w-full text-white leading-snug break-words [overflow-wrap:anywhere]">
                      {node.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
