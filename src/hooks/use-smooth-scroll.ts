import { useEffect } from "react";

/**
 * Custom hook that overrides default wheel scrolling to provide a premium,
 * inertia-based smooth scroll experience similar to Apple.com.
 * Only active on non-touch (desktop) devices.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect touch devices (mobile, tablet, etc.) to keep native touch momentum
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia("(any-pointer: coarse)").matches);
    
    if (isTouchDevice) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isRunning = false;
    
    // Apple-like inertia multiplier (lower = smoother/more inertia, e.g. 0.075)
    const inertiaFactor = 0.08; 

    const onWheel = (e: WheelEvent) => {
      // Do not intercept pinch-to-zoom gestures (which pass as ctrlKey + wheel)
      if (e.ctrlKey) return;

      e.preventDefault();

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate target scroll location
      targetY += e.deltaY;
      targetY = Math.max(0, Math.min(targetY, maxScroll));

      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(updateScroll);
      }
    };

    const updateScroll = () => {
      const diff = targetY - currentY;
      
      // Interpolate current scroll position toward target
      currentY += diff * inertiaFactor;
      
      window.scrollTo(0, currentY);

      // Continue the loop if there is a noticeable gap
      if (Math.abs(diff) > 0.5) {
        requestAnimationFrame(updateScroll);
      } else {
        currentY = targetY;
        isRunning = false;
      }
    };

    // If the user scrolls by other means (keyboard arrows, space, scrollbar click, etc.),
    // sync our target state to keep it seamless.
    const onScroll = () => {
      if (!isRunning) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}
