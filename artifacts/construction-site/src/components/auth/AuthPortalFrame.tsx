import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";

type AuthPortalFrameProps = {
  mode: "login" | "signup";
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthPortalFrame({ mode, title, subtitle, children }: AuthPortalFrameProps) {
  const reducedMotion = useReducedMotion();
  const isLogin = mode === "login";
  const destination = isLogin ? "/signup" : "/login";
  const transitionLabel = isLogin ? "Create a new account" : "Back to sign in";
  const TransitionIcon = isLogin ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-[100svh] overflow-hidden bg-white font-sans text-[#111827]">
      <div className="grid min-h-[100svh] grid-cols-1 md:grid-cols-2">
        <section className="auth-portal-panel relative flex min-h-[250px] items-center overflow-hidden bg-[#617df4] px-8 py-12 text-white sm:px-14 md:min-h-[100svh]">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-[18%] h-72 w-72 rounded-full bg-white/10"
            animate={reducedMotion ? undefined : { x: [0, 24, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-[38%] h-56 w-56 rounded-full bg-gradient-to-br from-[#43c8df] to-[#b4eff1]"
            animate={reducedMotion ? undefined : { y: [0, -20, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-[18%] top-[-74px] h-40 w-12 rounded-full bg-gradient-to-b from-white/45 to-white/10"
            animate={reducedMotion ? undefined : { y: [0, 28, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-[28%] top-[18%] h-5 w-5 rounded-full border-2 border-white/80"
            animate={reducedMotion ? undefined : { scale: [1, 1.3, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-[16%] left-[13%] grid grid-cols-4 gap-2 opacity-90">
            {Array.from({ length: 12 }, (_, index) => (
              <motion.span
                key={index}
                className="h-1 w-1 rounded-full bg-white"
                animate={reducedMotion ? undefined : { opacity: [0.35, 1, 0.35], y: [0, index % 2 ? -3 : 3, 0] }}
                transition={{ duration: 2.2, delay: index * 0.08, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-lg pb-6 md:pb-0">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-white/75">
              Swapnapurti Associates
            </p>
            <h1 className="font-sans text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {isLogin ? "Let’s Connect" : "A new beginning"}
              <span className="mt-2 block font-normal">{isLogin ? "Plan Dreams" : "starts here"}</span>
            </h1>
            <div className="mt-9 h-[2px] w-40 bg-white/80" />
          </div>

          <Link
            href={destination}
            aria-label={transitionLabel}
            title={transitionLabel}
            className="auth-portal-transition absolute bottom-[-30px] right-8 z-20 flex h-[76px] w-[76px] items-center justify-center rounded-full border-[10px] border-white bg-gradient-to-br from-[#46c7df] to-[#c4f1f3] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#617df4] sm:right-12 md:bottom-auto md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-1/2 md:hover:scale-105"
          >
            <TransitionIcon size={29} strokeWidth={1.7} />
          </Link>
        </section>

        <section className="relative flex min-h-[calc(100svh-250px)] items-center justify-center overflow-y-auto bg-white px-6 py-12 sm:px-12 md:min-h-[100svh] md:px-10 lg:px-16">
          <main className="w-full max-w-md">
            <header className="mb-8 text-center">
              <img
                src="/images/logo.png"
                alt="Swapnapurti Associates"
                className="mx-auto mb-5 h-12 w-auto max-w-[200px] object-contain"
              />
              <h2 className="text-3xl font-bold tracking-tight text-[#617df4] sm:text-4xl">{title}</h2>
              <p className="mt-2 text-sm text-[#647084]">{subtitle}</p>
            </header>
            {children}
          </main>
        </section>
      </div>
    </div>
  );
}
