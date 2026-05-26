import { FinderBrowser } from "@/components/docs/FinderBrowser";
import { PROJECTS_ROOT } from "@/lib/projectsFileSystem";

const PROJECTS_TITLE = "Project and resume";

export function ProjectsApp() {
  return (
    <FinderBrowser
      windowId="projects"
      root={PROJECTS_ROOT}
      defaultTitle={PROJECTS_TITLE}
      sidebarLinks={[{ label: "Home", path: [] }]}
      fitToContent
    />
  );
}
