import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  secondsLeft: number;
};

/**
 * Shows a fixed warning banner when the user is about to be auto-logged-out.
 * Counts down the remaining seconds.
 */
export function InactivityWarning({ visible, secondsLeft }: Props) {
  const [count, setCount] = useState(secondsLeft);

  useEffect(() => {
    if (!visible) { setCount(secondsLeft); return; }
    setCount(secondsLeft);
    const interval = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(interval);
  }, [visible, secondsLeft]);

  const mins = Math.floor(count / 60);
  const secs = count % 60;
  const display = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.4 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm"
        >
          <div className="mx-4 bg-[#1c1a16] border border-[#b88f34] rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3">
            <Clock size={20} className="text-[#b88f34] shrink-0" />
            <div>
              <p className="text-white text-sm font-semibold">Session expiring soon</p>
              <p className="text-[#a89f8f] text-xs mt-0.5">
                You'll be signed out in <span className="text-[#b88f34] font-bold">{display}</span> due to inactivity.
                Move your mouse or press any key to stay signed in.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
