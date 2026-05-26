export const MOBILE_BREAKPOINT = 768;

export function getIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}
