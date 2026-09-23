import { useGetOverviewStats } from "@workspace/api-client-react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { FEATURED_PROJECTS } from "../data/projects";

const displayProjects = FEATURED_PROJECTS.filter((project) => project && project.title);

/* ── Animation helper ─────────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const initial =
    direction === "up"
      ? { opacity: 0, y: 32 }
      : direction === "left"
      ? { opacity: 0, x: -32 }
      : direction === "right"
      ? { opacity: 0, x: 32 }
      : { opacity: 0 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: 0.75, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Counter ──────────────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EFF6FF] mb-4">
        <Icon className="h-5 w-5 text-[#2563EB]" />
      </div>
      <div className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] mb-1">
        {value}
      </div>
      <div className="font-sans text-xs uppercase tracking-widest text-[#6B7280] font-medium">
        {label}
      </div>
    </FadeIn>
  );
}

export default function Home() {
  const { data: stats } = useGetOverviewStats();
  const [, navigate] = useLocation();

  // Carousel state uses only the real featured projects from the project data.
  const N = displayProjects.length;
  const SPACING = 340;
  const DEPTH = 240;

  const [pos, setPos] = useState(0);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const pointerStart = useRef({ x: 0, pos: 0 });
  const hasMoved = useRef(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const currentIdx = N > 0 ? ((Math.round(pos) % N) + N) % N : 0;
  const currentProject = N > 0 ? displayProjects[currentIdx] : undefined;

  const getProjectImage = (project: (typeof displayProjects)[number]) =>
    project?.images?.[0] || project?.imageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80";

  const handleViewProject = (projectTitle: string, projectCategory: string) => {
    const params = new URLSearchParams({
      project: projectTitle,
      type: projectCategory,
      message: `I am interested in a project similar to "${projectTitle}". Please share more details about your capabilities in ${projectCategory} construction.`,
    });
    navigate(`/contact?${params.toString()}`);
    setTimeout(() => {
      const el = document.getElementById("enquiry-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  /* ── Carousel Mechanics ────────────────────────────────────────── */
  const step = (dir: number) => {
    if (N <= 1) return;
    setPos((prev) => {
      const next = Math.round(prev) + dir;
      if (next >= N) return next - N;
      if (next < 0) return next + N;
      return next;
    });
  };

  const jumpTo = (targetIdx: number) => {
    if (N <= 1) return;
    setPos((prev) => {
      const current = Math.round(prev);
      let off = targetIdx - current;
      if (off > N / 2) off -= N;
      if (off < -N / 2) off += N;
      const next = current + off;
      if (next >= N) return next - N;
      if (next < 0) return next + N;
      return next;
    });
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer.current = setInterval(() => {
      step(1);
    }, 2000);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
      autoPlayTimer.current = null;
    }
  };

  useEffect(() => {
    if (N <= 1) {
      stopAutoPlay();
      return;
    }

    startAutoPlay();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      stopAutoPlay();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [N, currentIdx]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsGrabbing(true);
    hasMoved.current = false;
    pointerStart.current = { x: e.clientX, pos: pos };
    stopAutoPlay();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isGrabbing) return;
    const dx = e.clientX - pointerStart.current.x;
    if (Math.abs(dx) > 4) hasMoved.current = true;
    setPos(pointerStart.current.pos - dx / SPACING);
  };

  const handlePointerUp = () => {
    if (!isGrabbing) return;
    setIsGrabbing(false);
    setPos((prev) => Math.round(prev));
    startAutoPlay();
  };

  return (
    <div className="w-full bg-white text-[#111827]">
      <style>{`
        .car-stage {
          position: relative;
          height: 520px;
          margin: 0 auto;
          max-width: 100%;
          overflow: hidden;
          perspective: 1700px;
          touch-action: pan-y;
          user-select: none;
        }
        .car-track-layout {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }
        .car-3d-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 340px;
          height: 470px;
          margin: -235px 0 0 -170px;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @media (max-width: 640px) {
          .car-stage { height: 490px; }
          .car-3d-card { width: 290px; height: 440px; margin: -220px 0 0 -145px; }
        }
      `}</style>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          // poster="/images/main.jpeg"
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-90"
        >
          <source src="/images/vidmain.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/30 z-10" aria-hidden="true" />

        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,.15), rgba(0,0,0,.35))",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/10 z-10" aria-hidden="true" />

        <div className="container relative z-20 mx-auto px-4 md:px-8 pt-24 pb-16 flex justify-center items-center">
          <div className="text-center">
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 1,
                    delay: .3
                }}
                className="font-serif text-5xl md:text-7xl xl:text-8xl font-bold text-white leading-tight"
            >

            Building India's
            <span className="block text-blue-400">
            Luxury Spaces
            </span>

            </motion.h1>

            <motion.p
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:.6}}
            className="text-white/80 text-lg md:text-xl mt-8 max-w-3xl mx-auto"
            >

            From iconic residential towers to landmark commercial complexes, we craft spaces that define lifestyles and elevate experiences.

            </motion.p>

                        <motion.p
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:.6}}
            className="text-white/80 text-lg md:text-xl mt-8 max-w-3xl mx-auto"
            >


            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-14 justify-center"
            >
              <Button
                size="lg"
                className="rounded-xl h-14 px-8 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-sans font-medium text-sm uppercase tracking-wider shadow-xl shadow-[#1E3A8A]/40 transition-all duration-300"
                asChild
              >
                <Link href="/projects">View Portfolio</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl h-14 px-8 border-white/30 text-white hover:bg-white/10 font-sans font-medium text-sm uppercase tracking-wider backdrop-blur-sm"
                asChild
              >
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────── */}
      {/* <section className="py-20 bg-[#F8FAFC] border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            {[
              { label: "Completed Projects", value: stats?.completedProjects || "200+", icon: CheckCircle2 },
              { label: "Expert Engineers", value: stats?.engineersAvailable || "350+", icon: Users },
              { label: "Cities Covered", value: stats?.citiesCovered || "24", icon: MapPin },
              { label: "Years Experience", value: stats?.yearsExperience || "15+", icon: TrendingUp },
            ].map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Featured Projects ───────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-gray-200 via-white to-gray-250 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-[#2563EB]" />
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-[#2563EB]">
                    Our Portfolio
                  </span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
                  Featured Projects
                </h2>
                <p className="mt-4 font-sans text-[#6B7280] text-lg max-w-xl leading-relaxed">
                  Landmark builds that define skylines, transform communities,
                  and stand as testaments to precision engineering.
                </p>
              </div>
              <Button
                variant="outline"
                className="shrink-0 rounded-xl border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white font-sans text-xs uppercase tracking-widest h-11 px-6 group transition-all duration-300"
                asChild
              >
                <Link href="/projects">
                  View All
                  <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </FadeIn>

          {N > 0 && (
            <div className="relative">
              <button
                type="button"
                aria-label="Previous project"
                onClick={() => step(-1)}
                className="absolute left-2 md:left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#D1D5DB] bg-white/90 text-[#0F172A] shadow-lg shadow-slate-200/70 transition hover:scale-105 hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                aria-label="Next project"
                onClick={() => step(1)}
                className="absolute right-2 md:right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#D1D5DB] bg-white/90 text-[#0F172A] shadow-lg shadow-slate-200/70 transition hover:scale-105 hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>

              <div
                className={`car-stage ${isGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={() => {
                  if (!isGrabbing) startAutoPlay();
                }}
                onPointerEnter={stopAutoPlay}
              >
                <div className="car-track-layout">
                  {displayProjects.map((project, i) => {
                    let off = i - pos;
                    if (off > N / 2) off -= N;
                    if (off < -N / 2) off += N;
                    const abs = Math.abs(off);

                    if (abs > 3.15) {
                      return (
                        <div
                          key={project.id}
                          className="car-3d-card pointer-events-none opacity-0"
                          style={{ transform: `translate3d(${off * 150}px, 0px, -1050px) scale(0.5)` }}
                        />
                      );
                    }

                    const x = off * SPACING;
                    const z = -abs * DEPTH;
                    const rot = Math.max(-44, Math.min(44, off * -26));
                    const scale = Math.max(0.56, 1 - abs * 0.15);
                    const op = Math.max(0, 1 - abs * 0.4);
                    const isActive = abs < 0.5;

                    return (
                      <div
                        key={project.id}
                        className="car-3d-card transition-all duration-500 ease-out"
                        style={{
                          transform: `translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                          opacity: op.toFixed(3),
                          zIndex: Math.round(120 - abs * 10),
                          pointerEvents: isActive ? "auto" : "none",
                        }}
                      >
                        <div
                          className={`group h-full flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-white/70 bg-white/25 shadow-[0_20px_45px_rgba(15,23,42,0.22)] backdrop-blur-xl transition-all duration-300 hover:border-white/90 ${
                            isActive ? "shadow-[0_24px_60px_rgba(37,99,235,0.3)] ring-2 ring-inset ring-white/45" : ""
                          }`}
                          onClick={() => {
                            if (!hasMoved.current) jumpTo(i);
                          }}
                        >
                          <div className="flex flex-col h-full">
                            <div className="relative h-[390px] overflow-hidden rounded-2xl border-2 border-white/45 bg-white/10 shadow-[0_12px_30px_rgba(15,23,42,0.18)] sm:h-[400px]">
                              <img src={getProjectImage(project)} alt={project.title} loading={i === currentIdx ? "eager" : "lazy"} decoding="async" className="w-full h-full object-cover" />
                              <div
                                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A]/55 via-[#0F172A]/5 to-transparent"
                                aria-hidden="true"
                              />
                            </div>
                          </div>

                          <div className="border-t border-white/25 px-5 pb-5 pt-2 md:px-6 md:pb-6 md:pt-3">
                            <Button
                              className="group relative w-full overflow-hidden rounded-xl h-11 px-4 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] hover:from-[#172554] hover:via-[#1D4ED8] hover:to-[#3B82F6] text-white border-2 border-white/70 font-sans font-semibold text-xs uppercase tracking-wider shadow-[0_10px_24px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(37,99,235,0.5)] transition-all duration-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProject(project.title, project.category);
                              }}
                            >
                              <span
                                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[420%]"
                                aria-hidden="true"
                              />
                              <span className="relative">Enquire About Project</span>
                              <ArrowRight size={14} className="relative ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {N > 0 && (
            <>
              <div className="font-display font-bold text-sm text-[#6B7280] mt-8 text-center tracking-wide">
                <b className="text-[#2563EB]">{String(currentIdx + 1).padStart(2, "0")}</b> / {String(N).padStart(2, "0")} · <span>{currentProject?.title}</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center max-w-125 mx-auto mt-4">
                {displayProjects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => jumpTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIdx ? "w-6 bg-[#1E3A8A]" : "w-2 bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={`Go to feature ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <FadeIn delay={0.3}>
            <div className="mt-16 text-center">
              <Button
                size="lg"
                className="rounded-xl h-14 px-12 bg-[#0F172A] hover:bg-[#1E3A8A] text-white font-sans font-medium text-sm uppercase tracking-wider shadow-xl transition-all duration-300 group"
                asChild
              >
                <Link href="/projects">
                  Explore All Projects
                  <ArrowRight size={16} className="ml-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── About / CEO Spotlight ────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn direction="left">
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-2xl aspect-4/5">
                  <img
                    src="/images/CEO.png"
                    alt="Saurabh Rajguru – CEO"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/600x750?text=CEO";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#1E3A8A] text-white rounded-2xl p-6 shadow-xl">
                  <div className="font-serif text-4xl font-bold">5+</div>
                  <div className="font-sans text-xs uppercase tracking-widest text-[#93C5FD] mt-1">
                    Years Leading
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#EFF6FF] rounded-2xl -z-10" />
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-[#2563EB]" />
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-[#2563EB]">
                    Leadership
                  </span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
                  Built on Vision.
                  <br />
                  Delivered with Precision.
                </h2>
                <p className="font-sans text-[#6B7280] text-lg leading-relaxed">
                  Under the leadership of <strong className="text-[#0F172A]">Saurabh Rajguru</strong>,
                  Swapnapurti Associates has grown from a one project firm to a
                  crossing 200 constructions, delivering iconic luxury
                  estates, premium hospitality design. And On-site presence with a 98% on-time delivery record.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                    { label: "Signature Projects", value: "200+" },
                    { label: "Construction Value", value: "₹15+ Cr" },
                    { label: "On-Time Delivery", value: "98%" },
                    { label: "Founded In", value: "1997" },
                  ].map((m) => (
                    <div key={m.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="font-serif text-2xl font-bold text-[#0F172A]">{m.value}</div>
                      <div className="font-sans text-xs text-[#9CA3AF] uppercase tracking-wider mt-1">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="rounded-xl h-12 px-7 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-sans font-medium text-xs uppercase tracking-wider mt-2"
                  asChild
                >
                  <Link href="/about">Our Full Story</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Services Strip ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#2563EB]" />
                <span className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-[#2563EB]">
                  What We Build
                </span>
                <div className="h-px w-8 bg-[#2563EB]" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A]">
                End-to-End Services
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: "Infrastructure", desc: "Roads, bridges, industrial facilities, and urban infrastructure built to the highest standards.", bg: "/images/infra.jpg" },
              { icon: Award, title: "Interior Design", desc: "Luxurious finishes, functional layouts, and bespoke detailing for premium spaces.", bg: "/images/int.jpg" },
              { icon: TrendingUp, title: "Exterior Design", desc: "Striking façades and landscaped exteriors that elevate the character of every project.", bg: "/images/ext.png" },
              { icon: Users, title: "Project Management", desc: "Clear communication, strict scheduling, and cost control from start to completion.", bg: "/images/Project-management.jpg" },
              { icon: CheckCircle2, title: "Sustainable Design", desc: "Energy-efficient buildings and green materials that reduce costs and enhance long-term value.", bg: "/images/SD.png" },
              { icon: MapPin, title: "Renovation & Restoration", desc: "Reimagining existing spaces with premium finishes and structural upgrades.", bg: "/images/rr.jpg" },
            ].map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.07}>
                <div className="group relative overflow-hidden rounded-2xl h-72 cursor-pointer shadow-md hover:shadow-2xl hover:shadow-[#1E3A8A]/20 transition-all duration-500" style={{ minHeight: "18rem" }}>
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110" style={{ backgroundImage: `url(${s.bg})` }} />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/90 via-[#0F172A]/50 to-[#0F172A]/20 group-hover:from-[#1E3A8A]/90 group-hover:via-[#1E3A8A]/50 group-hover:to-[#1E3A8A]/20 transition-all duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-7">
                    <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors duration-300">
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-white mb-2 leading-tight">
                      {s.title}
                    </h3>
                    <p className="font-sans text-sm text-white/75 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-400 max-h-0 group-hover:max-h-20 overflow-hidden">
                      {s.desc}
                    </p>
                  </div>
                  <div className="absolute top-0 left-0 h-1 w-0 bg-[#2563EB] group-hover:w-full transition-all duration-500 rounded-t-2xl" />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                className="rounded-xl border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white h-12 px-8 font-sans text-xs uppercase tracking-wider transition-all duration-300"
                asChild
              >
                <Link href="/services">All Services</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Contact CTA ─────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url(/images/big.jpeg)" }} />
        <div className="absolute inset-0 bg-[#0F172A]/80" />
        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#60A5FA]" />
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#60A5FA]">
                Let's Build Together
              </span>
              <div className="h-px w-8 bg-[#60A5FA]" />
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
              For clients who expect distinction at every level.
            </h2>
            <p className="font-sans text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Let our expert team create the next signature address for your
              brand, private lifestyle, or hospitality vision — with flawless
              execution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="rounded-xl h-14 px-10 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-sans font-medium text-sm uppercase tracking-wider shadow-xl shadow-[#1E3A8A]/50 transition-all duration-300"
                asChild
              >
                <Link href="/contact">Begin Your Project</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl h-14 px-10 border-white/30 text-white hover:bg-white/10 font-sans font-medium text-sm uppercase tracking-wider backdrop-blur-sm"
                asChild
              >
                <Link href="/projects">View Portfolio</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}