import { memo, Suspense } from "react";
import { AppWindowLoader } from "@/components/AppWindowLoader";
import { Window } from "@/components/Window";
import { LAZY_APPS } from "@/lib/lazyApps";
import { useOS, type AppId } from "@/store/osStore";

interface WindowSlotProps {
  id: AppId;
  isMobile: boolean;
  fitContent?: boolean;
}

export const WindowSlot = memo(function WindowSlot({ id, isMobile, fitContent }: WindowSlotProps) {
  const isOpen = useOS((s) => s.windows[id].isOpen);
  if (!isOpen) return null;

  const App = LAZY_APPS[id];

  return (
    <Window id={id} isMobile={isMobile} fitContent={fitContent}>
      <Suspense fallback={<AppWindowLoader />}>
        <App />
      </Suspense>
    </Window>
  );
});
