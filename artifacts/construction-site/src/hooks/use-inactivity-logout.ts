import { useEffect, useRef } from "react";

const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_MS = 2 * 60 * 1000; // warn 2 mins before expiry

type Options = {
  enabled: boolean;
  onLogout: () => void;
  onWarn?: (secondsLeft: number) => void;
};

/**
 * Listens to user activity (mouse move, keydown, click, scroll, touch).
 * If no activity is detected for INACTIVITY_MS, calls `onLogout`.
 * Optionally calls `onWarn` 2 minutes before expiry.
 */
export function useInactivityLogout({ enabled, onLogout, onWarn }: Options) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warnTimerRef.current) clearTimeout(warnTimerRef.current);

      // Warning timer
      if (onWarn) {
        warnTimerRef.current = setTimeout(() => {
          onWarn(Math.round(WARNING_BEFORE_MS / 1000));
        }, INACTIVITY_MS - WARNING_BEFORE_MS);
      }

      // Logout timer
      timerRef.current = setTimeout(() => {
        onLogout();
      }, INACTIVITY_MS);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    // Start immediately
    reset();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [enabled, onLogout, onWarn]);
}
