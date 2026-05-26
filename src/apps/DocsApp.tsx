import { FinderBrowser } from "@/components/docs/FinderBrowser";
import { APP_TITLES } from "@/store/osStore";
import { DOC_ROOT } from "@/lib/docsFileSystem";

export function DocsApp() {
  return (
    <FinderBrowser
      windowId="docs"
      root={DOC_ROOT}
      defaultTitle={APP_TITLES.docs}
      sidebarLinks={[
        { label: "Home", path: [] },
        { label: "Resume", path: ["resume"] },
      ]}
      initialPath={["resume"]}
      openResumeOnMount
    />
  );
}
