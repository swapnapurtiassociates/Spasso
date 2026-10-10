import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle,
  Compass,
  Layers,
  Leaf,
  Route,
  Settings,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";

const baseUrl = import.meta.env.BASE_URL ?? "/";

function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-40px 0px -80px" });
  const initial =
    direction === "up"
      ? { opacity: 0, y: 28 }
      : direction === "left"
      ? { opacity: 0, x: -28 }
      : { opacity: 0, x: 28 };

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

const services = [
  {
    icon: Building2,
    title: "Infrastructure Development",
    subtitle: "Foundations for the future",
    description:
      "Designing and building durable roads, bridges, industrial facilities, and urban infrastructure with the highest standards of structural integrity and safety.",
    image: `${baseUrl}images/1.jpeg`,
    benefits: [
      "ISO 9001:2015 certified processes",
      "International structural standards",
      "End-to-end project delivery",
      "Dedicated site engineering team",
    ],
    accent: "#1E3A8A",
  },
  {
    icon: Layers,
    title: "Interior Design",
    subtitle: "Where craft meets luxury",
    description:
      "Transforming interior environments with luxurious finishes, functional layouts, and bespoke detailing that reflect premium living and commercial excellence.",
    image: `${baseUrl}images/inte.jpg`,
    benefits: [
      "Imported materials and fixtures",
      "3D visualization before build",
      "Custom furniture and cabinetry",
      "Smart home integration",
    ],
    accent: "#2563EB",
  },
  {
    icon: Award,
    title: "Exterior Design",
    subtitle: "First impressions that last",
    description:
      "Creating striking façades, landscaped exteriors, and architectural detailing that elevate the character and curb appeal of every project.",
    image: `${baseUrl}images/exte.jpg`,
    benefits: [
      "Custom façade engineering",
      "Landscape architecture",
      "Lighting design",
      "Weather-resistant materials",
    ],
    accent: "#1E3A8A",
  },
  {
    icon: Settings,
    title: "Project Management",
    subtitle: "On time, on budget — always",
    description:
      "Coordinating every phase with clear communication, strict scheduling, and cost control so your project completes on time and within budget.",
    image: `${baseUrl}images/PM.png`,
    benefits: [
      "Real-time project dashboards",
      "Dedicated project manager",
      "Weekly client reporting",
      "Risk mitigation planning",
    ],
    accent: "#2563EB",
  },
  {
    icon: Leaf,
    title: "Sustainable Design",
    subtitle: "Building for tomorrow",
    description:
      "Delivering energy-efficient buildings and green materials that reduce operating costs while enhancing long-term value and environmental responsibility.",
    image: `${baseUrl}images/SD.png`,
    benefits: [
      "LEED certification support",
      "Net-zero energy planning",
      "Rainwater harvesting systems",
      "Solar integration",
    ],
    accent: "#1E3A8A",
  },
  {
    icon: Wrench,
    title: "Renovation & Restoration",
    subtitle: "New life for existing spaces",
    description:
      "Reimagining existing spaces with premium finishes, structural upgrades, and thoughtful detailing — bringing heritage and modern elegance together.",
    image: `${baseUrl}images/rr.jpg`,
    benefits: [
      "Structural assessment first",
      "Heritage preservation expertise",
      "Minimal disruption timeline",
      "Premium material upgrades",
    ],
    accent: "#2563EB",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    desc: "We understand your vision, requirements, and constraints in an in-depth consultation.",
    icon: Compass,
    accent: "from-[#0F172A] to-[#2563EB]",
  },
  {
    step: "02",
    title: "Design & Planning",
    desc: "Our architects and designers create detailed plans, 3D renders, and a phased schedule.",
    icon: Sparkles,
    accent: "from-[#1D4ED8] to-[#60A5FA]",
  },
  {
    step: "03",
    title: "Execution",
    desc: "Skilled teams with cutting-edge equipment bring the design to life on schedule.",
    icon: Route,
    accent: "from-[#1E3A8A] to-[#3B82F6]",
  },
  {
    step: "04",
    title: "Handover",
    desc: "Quality-checked delivery, documentation, and post-handover support included.",
    icon: CheckCircle,
    accent: "from-[#2563EB] to-[#93C5FD]",
  },
];

const processArrows = [
  { path: "M 276 150 C 292 112 308 112 324 150" },
  { path: "M 576 150 C 592 188 608 188 624 150" },
  { path: "M 876 150 C 892 112 908 112 924 130" },
];

export default function Services() {
  const prefersReducedMotion = useReducedMotion();
  const processSectionRef = useRef<HTMLElement>(null);
  const [visibleArrowCount, setVisibleArrowCount] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const activeService = services[activeServiceIndex];
  const nextServiceIndex = (activeServiceIndex + 1) % services.length;
  const secondNextServiceIndex = (activeServiceIndex + 2) % services.length;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveServiceIndex((index) => (index + 1) % services.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const updateArrowProgress = () => {
      const section = processSectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollRange));
      const nextCount = progress >= 0.72 ? 3 : progress >= 0.42 ? 2 : progress >= 0.12 ? 1 : 0;
      setVisibleArrowCount((currentCount) => currentCount === nextCount ? currentCount : nextCount);
    };

    updateArrowProgress();
    window.addEventListener("scroll", updateArrowProgress, { passive: true });
    window.addEventListener("resize", updateArrowProgress);
    return () => {
      window.removeEventListener("scroll", updateArrowProgress);
      window.removeEventListener("resize", updateArrowProgress);
    };
  }, []);

  return (
    <div className="services-page min-h-screen overflow-x-clip bg-white text-[#0F172A]">
      <section className="relative bg-white pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="container mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-px w-10 bg-[#2563EB]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#2563EB]">
              What We Offer
            </span>
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#2563EB]">
                    {activeService.subtitle}
                  </p>
                  <h1 className="max-w-xl font-serif text-4xl font-bold leading-tight text-[#0F172A] sm:text-5xl">
                    {activeService.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                    {activeService.description}
                  </p>
                  <ul className="mt-7 space-y-3">
                    {activeService.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle className="h-4 w-4 shrink-0 text-[#2563EB]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button
                      className="h-12 rounded-lg bg-[#0F172A] px-6 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#2563EB]"
                      asChild
                    >
                      <Link href="/contact">
                        Enquire Now <ArrowRight size={14} className="ml-2" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-lg border-slate-300 bg-white px-6 text-xs font-semibold uppercase tracking-wider text-[#0F172A] hover:bg-slate-50"
                      asChild
                    >
                      <Link href="/projects">View Portfolio</Link>
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 flex items-center gap-2" aria-label="Choose a service">
                {services.map((service, index) => (
                  <button
                    key={service.title}
                    type="button"
                    onClick={() => setActiveServiceIndex(index)}
                    aria-label={`Show ${service.title}`}
                    aria-current={index === activeServiceIndex ? "true" : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeServiceIndex ? "w-10 bg-[#2563EB]" : "w-4 bg-slate-300 hover:bg-slate-500"
                    }`}
                  />
                ))}
                <span className="ml-3 text-xs font-medium tabular-nums text-slate-500">
                  {String(activeServiceIndex + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="relative mx-auto h-[350px] w-full max-w-[620px] sm:h-[440px] lg:h-[500px]" aria-label="Service images">
              {[secondNextServiceIndex, nextServiceIndex].map((index, layer) => (
                <button
                  key={services[index].title}
                  type="button"
                  onClick={() => setActiveServiceIndex(index)}
                  aria-label={`View ${services[index].title}`}
                  className={`absolute top-1/2 h-[64%] w-[62%] -translate-y-1/2 overflow-hidden rounded-2xl bg-slate-100 shadow-xl transition-all duration-500 hover:z-30 hover:scale-[1.03] focus-visible:z-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] ${
                    layer === 0 ? "right-0 rotate-[8deg] opacity-65" : "right-[7%] -rotate-[6deg] opacity-85"
                  }`}
                  style={{ zIndex: layer + 1 }}
                >
                  <img src={services[index].image} alt={services[index].title} className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent px-4 pb-4 pt-10 text-left text-xs font-semibold uppercase tracking-wider text-white">
                    {services[index].title}
                  </span>
                </button>
              ))}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, x: -12 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.97, x: 12 }}
                  transition={{ duration: 0.4 }}
                  className="absolute left-0 top-1/2 z-10 h-[82%] w-[76%] -translate-y-1/2 overflow-hidden rounded-2xl bg-slate-100 shadow-[0_28px_70px_rgba(15,23,42,0.18)]"
                >
                  <img src={activeService.image} alt={activeService.title} className="h-full w-full object-cover" fetchPriority="high" />
                  <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-lg">
                    <activeService.icon className="h-5 w-5" />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent px-5 pb-5 pt-16 text-left font-serif text-xl font-semibold text-white">
                    {activeService.title}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {services.map((service, index) => (
              <button
                key={service.title}
                type="button"
                onClick={() => setActiveServiceIndex(index)}
                aria-label={`Select ${service.title}`}
                aria-pressed={index === activeServiceIndex}
                className={`group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 transition-opacity ${
                  index === activeServiceIndex ? "ring-2 ring-[#2563EB] ring-offset-2" : "opacity-65 hover:opacity-100"
                }`}
              >
                <img src={service.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-slate-950/80 to-transparent px-2 pb-2 pt-5 text-left text-[10px] font-semibold text-white sm:text-xs">
                  {service.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Grid (Light Style) ──────────────────────────── */}
      <section
        ref={processSectionRef}
        data-visible-process-arrows={visibleArrowCount}
        className="relative z-10 h-[400svh] border-t border-slate-100 bg-white"
      >
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.07),transparent_55%)]" aria-hidden="true" />
          <div className="container relative mx-auto w-full px-4 py-5 md:px-8 md:py-8">
            <FadeIn>
              <div className="mb-7 text-center md:mb-12">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-[#2563EB]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#2563EB]">
                  How We Work
                </span>
                <div className="h-px w-8 bg-[#2563EB]" />
              </div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-[#0F172A] md:text-5xl">
                Our Process
              </h2>
              </div>
            </FadeIn>

          <div className="relative py-2 md:py-8">
            <svg
              aria-hidden="true"
              viewBox="0 0 1200 300"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 top-1/2 z-20 hidden h-40 w-full -translate-y-1/2 overflow-visible lg:block"
            >
              <defs>
                <linearGradient id="process-arrow-gradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="50%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <marker id="process-arrowhead" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                  <path d="M 2 2 L 10 6 L 2 10" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              {processArrows.map(({ path }, index) => {
                const isVisible = index < visibleArrowCount;
                return (
                  <g key={path}>
                    <motion.path
                      d={path}
                      fill="none"
                      stroke="url(#process-arrow-gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      markerEnd="url(#process-arrowhead)"
                      initial={false}
                      animate={{ pathLength: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {isVisible && !prefersReducedMotion && (
                      <motion.circle
                        r="5"
                        cx="0"
                        cy="0"
                        fill="#60A5FA"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 0.8, 0], scale: [0.5, 1.2, 1, 0.6], offsetDistance: ["0%", "100%"] }}
                        transition={{ duration: 1.15, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${path}")`, filter: "drop-shadow(0 0 5px #60A5FA)" }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="relative z-10 grid grid-cols-1 gap-0 lg:grid-cols-4 lg:gap-6">
              {process.map((p, i) => {
                const Icon = p.icon;

                return (
                  <div key={p.step} className="relative">
                    <FadeIn delay={i * 0.1}>
                      <motion.div
                        whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="process-card group relative flex h-full flex-row items-center gap-3 overflow-hidden rounded-2xl border border-white/50 bg-white/30 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-all duration-300 hover:border-blue-200/80 hover:shadow-[0_25px_60px_rgba(59,130,246,0.15)] sm:rounded-[22px] sm:p-4 lg:flex-col lg:items-stretch lg:gap-0 lg:rounded-[28px] lg:p-6"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.54),rgba(191,219,254,0.12),rgba(255,255,255,0.08))]" aria-hidden="true" />

                        <div className="relative flex shrink-0 items-center justify-between gap-2 lg:mb-5">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${p.accent} text-white shadow-lg shadow-blue-500/20 sm:h-10 sm:w-10 lg:h-12 lg:w-12 lg:rounded-2xl`}>
                            <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                          </div>
                          <span className="font-serif text-3xl font-bold tracking-tight text-slate-200/90 transition-colors duration-300 group-hover:text-blue-100/80 sm:text-4xl lg:text-5xl">
                            {p.step}
                          </span>
                        </div>

                        <div className="relative mb-4 hidden h-1 w-16 rounded-full bg-gradient-to-r from-[#0F172A] via-[#2563EB] to-[#93C5FD] lg:block" />

                        <div className="relative min-w-0 flex-1 lg:flex-none">
                        <h3 className="mb-1 font-serif text-base font-semibold leading-tight text-[#0F172A] sm:text-lg lg:mb-3 lg:text-2xl">
                          {p.title}
                        </h3>
                        <p className="line-clamp-2 font-sans text-[11px] font-normal leading-snug text-slate-700 sm:text-xs lg:text-sm lg:leading-relaxed">
                          {p.desc}
                        </p>
                        </div>

                        <div className="relative mt-6 hidden h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent lg:block" />
                      </motion.div>
                    </FadeIn>
                    {i < process.length - 1 && (
                      <div className="flex h-6 items-center justify-center lg:hidden" aria-hidden="true">
                        <motion.svg
                          viewBox="0 0 80 24"
                          className="h-6 w-12 overflow-visible"
                          initial={false}
                          animate={{ opacity: i < visibleArrowCount ? 1 : 0.14 }}
                        >
                          <defs>
                            <linearGradient id={`mobile-arrow-${i}`} x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#93C5FD" />
                              <stop offset="100%" stopColor="#2563EB" />
                            </linearGradient>
                            <marker id={`mobile-arrowhead-${i}`} markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                              <path d="M 2 2 L 10 6 L 2 10" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </marker>
                          </defs>
                          <motion.path
                            d="M 40 1 C 40 9 40 15 40 21"
                            fill="none"
                            stroke={`url(#mobile-arrow-${i})`}
                            strokeWidth="3"
                            strokeLinecap="round"
                            markerEnd={`url(#mobile-arrowhead-${i})`}
                            initial={false}
                            animate={{ pathLength: i < visibleArrowCount ? 1 : 0 }}
                            transition={{ duration: prefersReducedMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
                          />
                          {i < visibleArrowCount && !prefersReducedMotion && (
                            <motion.circle
                              r="4"
                              cy="1"
                              fill="#60A5FA"
                              animate={{ y: [0, 18], opacity: [0, 1, 0] }}
                              transition={{ duration: 0.7, ease: "easeInOut" }}
                              cx="40"
                              style={{ filter: "drop-shadow(0 0 4px #60A5FA)" }}
                            />
                          )}
                        </motion.svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ── Luxury Call-To-Action (Light Layout) ───────────────── */}
      <section className="relative py-32 overflow-hidden bg-slate-50 border-t border-slate-200/60">
        {/* Subtle background light-bleed effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#2563EB]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#2563EB]">
                Let's Get Started
              </span>
              <div className="h-px w-8 bg-[#2563EB]" />
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#0F172A] mb-6 leading-tight max-w-3xl mx-auto tracking-tight">
              Ready to Start Your Project?
            </h2>
            <p className="font-sans text-[#475569] text-lg max-w-xl mx-auto mb-12 leading-relaxed font-normal">
              Our team is ready to turn your vision into a landmark. Let's start with a free consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="rounded-xl h-14 px-10 bg-[#2563EB] hover:bg-blue-600 text-white font-sans text-xs font-semibold uppercase tracking-widest shadow-xl shadow-blue-600/10 transition-all duration-300 hover:-translate-y-0.5"
                asChild
              >
                <Link href="/contact">Get a Free Quote</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl h-14 px-10 border-slate-300 bg-white text-[#0F172A] hover:bg-slate-50 font-sans text-xs font-semibold uppercase tracking-widest shadow-sm transition-all duration-300"
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


// export default function About() {
//   return (
//     <div className="min-h-[calc(100vh-160px)] w-full bg-[#f4f4f0] px-3 py-4 md:px-6 md:py-6">
//       <div className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
//         <img
//           src="/images/ST.png"
//           alt="Swapnapurti Associates luxury villa exterior"
//           className="block h-[calc(100vh-200px)] min-h-[520px] w-full object-cover"
//         />
//       </div>
//     </div>
//   );
// }