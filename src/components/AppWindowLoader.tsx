import { Skeleton } from "@/components/Skeleton";

export function AppWindowLoader() {
  return (
    <div
      className="flex min-h-[200px] flex-col gap-3 p-5 sm:p-6"
      role="status"
      aria-live="polite"
      aria-label="Loading application"
    >
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-[42%]" />
          <Skeleton className="h-2.5 w-[28%]" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-[92%]" />
      <Skeleton className="h-3 w-[78%]" />
      <div className="mt-1 grid grid-cols-2 gap-2">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
      </div>
      <Skeleton className="mt-auto h-9 w-full rounded-md" />
    </div>
  );
}
