import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const DEFAULT_IMAGES = [
  "/images/exterior.jpg",
  "/images/interior.jpg",
  "/images/infrastructure.jpg",
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/rr.jpg",
];

type AuthBackgroundProps = {
  images?: string[];
  intervalMs?: number;
  variant?: "light" | "dark";
};

/**
 * Full-bleed rotating background carousel used behind auth pages.
 * Cross-fades to the next image on a timer (default every 2 seconds).
 */
export function AuthBackground({ images = DEFAULT_IMAGES, intervalMs = 2000, variant = "light" }: AuthBackgroundProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images, intervalMs]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={images[index]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${images[index]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Overlay so the form stays readable while images change */}
      <div className={`absolute inset-0 ${variant === "dark" ? "bg-[#1c1a16]/85" : "bg-[#f7f2e8]/85"}`} />
    </div>
  );
}
