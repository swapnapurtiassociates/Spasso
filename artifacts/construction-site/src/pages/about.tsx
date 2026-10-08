import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  Building2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Quote,
  Shield,
  Users,
  Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useListProjects } from "@workspace/api-client-react";

/* ─── Data ───────────────────────────────────────────────────────────── */
const STATS = [
  { value: "150+", label: "Projects Delivered", icon: Building2 },
  { value: "₹15+ Cr", label: "Construction Value", icon: Layers },
  { value: "15+", label: "Years of Excellence", icon: Award },
  { value: "98%", label: "On-Time Delivery", icon: Zap },
];

const MILESTONES = [
  {
    year: "2009",
    title: "Foundation",
    desc: "Swapnapurti Associates incorporated in Pune by Saurabh Rajguru with a vision to build India's most trusted construction brand.",
  },
  {
    year: "2012",
    title: "First Landmark",
    desc: "Delivered Orion Phase I in Hinjewadi — a 200,000 sq ft commercial campus that became the reference project for Grade-A office infrastructure in Pune.",
  },
  {
    year: "2015",
    title: "Pan-India Expansion",
    desc: "Opened regional offices in Mumbai, Bengaluru, and Chennai. Crossed ₹1,000 Cr in annual project value for the first time.",
  },
  {
    year: "2018",
    title: "ISO & LEED Certification",
    desc: "Achieved ISO 9001:2015 quality certification and delivered India's first net-zero-energy commercial tower — Zenith Corporate Office, Bengaluru.",
  },
  {
    year: "2021",
    title: "Infrastructure Division",
    desc: "Launched dedicated infrastructure division, winning the ₹4,800 Cr Western Corridor project — the largest contract in firm history.",
  },
  {
    year: "2024",
    title: "120 Projects & Beyond",
    desc: "Crossed 120 completed projects spanning residential, commercial, industrial, and infrastructure verticals across 24 Indian cities.",
  },
];

const LEADERSHIP = [
  {
    name: "Saurabh Rajguru",
    role: "Founder & CEO",
    image: "/images/CEO.png",
    quote: "We don't build structures. We engineer futures — one meticulously placed beam at a time.",
    credentials: ["B.E Civil, Sinhgad Institute", "5+ years in construction leadership"],
  },
  {
    name: "Shreyas Borse",
    role: "Chief Operating Officer",
    image: "/images/coo.png",
    quote: "Operational excellence is not a department — it's the DNA of every project we undertake.",
    credentials: ["Aspiring Computer Engineer, MMCOE"],
  },
];

const VALUES = [
  {
    icon: Shield,
    title: "Zero Compromise on Safety",
    desc: "10 million+ man-hours without a single fatality. Our HSE framework is audited quarterly against international OHSAS standards.",
  },
  {
    icon: Users,
    title: "Partnership Over Transaction",
    desc: "83% of our revenue comes from repeat clients. We treat every brief as a long-term relationship, not a single contract.",
  },
  {
    icon: Zap,
    title: "Technology-Driven Delivery",
    desc: "BIM-enabled design, drone surveys, IoT-based site monitoring, and ERP-integrated project management across all active sites.",
  },
];

const TESTIMONIALS = [
  {
    text: "Swapnapurti delivered Skyline Heights 3 months ahead of schedule — and the quality of finish exceeded every specification in the contract. Truly a world-class partner.",
    author: "Vikram Mehta",
    role: "MD, Skyline Developers Pvt Ltd",
    project: "Skyline Heights, Pune",
  },
  {
    text: "The infrastructure team's execution on the Western Corridor was nothing short of extraordinary. Transparent communication, zero surprises, flawless engineering.",
    author: "R. Krishnaswamy",
    role: "Project Director, TNRDC",
    project: "Western Corridor, Chennai",
  },
  {
    text: "Aurelia Residences is a testament to what happens when an architect's vision meets a contractor who genuinely cares about craft. Every corner is perfect.",
    author: "Anita Joshi",
    role: "Principal Architect, Studio J+A",
    project: "Aurelia Residences, Mumbai",
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────── */

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FounderHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0F172A]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#2563EB]/15 blur-3xl" />
      <div className="container relative mx-auto grid min-h-[78svh] max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-14 pt-28 sm:px-10 md:gap-14 md:pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#60A5FA]" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#93C5FD]">About Saurabh</span>
          </div>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Saurabh Rajguru
          </h1>
          <p className="mt-4 text-lg font-medium text-white/90 sm:text-xl">Founder &amp; CEO, Swapnapurti Associates</p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            With a civil-engineering background and a focus on thoughtful execution, Saurabh leads a team bringing
            residential, commercial and infrastructure visions to life. His approach puts people, quality and
            long-term trust at the heart of every build.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            That commitment is reflected in the range of work showcased by Swapnapurti, from residential landmarks
            such as Skyline Heights and Aurelia Luxury Residences to commercial developments like Orion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
              150+ projects delivered
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
              Civil engineering leadership
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[430px] lg:justify-self-end">
          <div aria-hidden="true" className="absolute inset-5 rounded-[2rem] bg-[#60A5FA]/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#090D18] shadow-[0_32px_90px_rgba(0,0,0,0.4)]">
            <img
              src="/images/CEO.png"
              alt="Saurabh Rajguru, Founder and CEO of Swapnapurti Associates"
              className="block aspect-[4/5] w-full object-cover object-top"
              fetchPriority="high"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#090D18]/75 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { data: projects = [] } = useListProjects();

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-project-card]");
    const distance = card ? card.offsetWidth + 24 : track.clientWidth;
    const nextPosition = Math.max(
      0,
      Math.min(track.scrollLeft + distance * direction, track.scrollWidth - track.clientWidth),
    );
    track.scrollTo({ left: nextPosition, behavior: "auto" });
  };

  return (
    <div>
      <div className="mb-7 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Show previous projects"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0F172A] shadow-sm transition hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Show next projects"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0F172A] shadow-sm transition hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            data-project-card
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: Math.min(index % 3, 2) * 0.08 }}
            className="group relative min-w-[86%] snap-start overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:min-w-[47%] xl:min-w-[32%]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <img
                src={project.imageUrl}
                alt={project.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                {project.category}
              </span>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB]">{project.city}</p>
              <h3 className="mt-2 font-serif text-2xl font-bold text-[#0F172A]">{project.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{project.shortDescription}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const len = TESTIMONIALS.length;

  const go = (next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx((next + len) % len);
  };

  return (
    <div className="relative overflow-hidden p-8 md:p-16">
      <AnimatePresence custom={dir} mode="wait">
        <motion.div
          key={idx}
          custom={dir}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          <Quote className="text-[#2563EB]/20 mx-auto mb-6" size={56} strokeWidth={1} />
          <p className="text-2xl md:text-3xl text-[#0F172A] font-serif font-medium leading-relaxed mb-8">
            "{TESTIMONIALS[idx].text}"
          </p>
          <div>
            <p className="font-sans font-bold text-[#0F172A] text-lg">{TESTIMONIALS[idx].author}</p>
            <p className="text-slate-500 font-sans text-sm mt-0.5">{TESTIMONIALS[idx].role}</p>
            <div className="inline-block mt-3 px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-bold uppercase tracking-wider rounded-md">
              {TESTIMONIALS[idx].project}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-6 mt-12">
        <button
          onClick={() => go(idx - 1)}
          className="w-11 h-11 rounded-full border border-slate-200 text-[#0F172A] hover:bg-[#0F172A] hover:text-white flex items-center justify-center transition-all duration-300"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-400 ${i === idx ? "w-6 bg-[#2563EB]" : "w-1.5 bg-slate-200"}`}
            />
          ))}
        </div>
        <button
          onClick={() => go(idx + 1)}
          className="w-11 h-11 rounded-full border border-slate-200 text-[#0F172A] hover:bg-[#0F172A] hover:text-white flex items-center justify-center transition-all duration-300"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function ParallaxBand({ src }: { src: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={ref} className="relative h-[450px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-20%]">
        <img src={src} alt="" className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/80" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <div className="w-12 h-px bg-[#2563EB] mx-auto mb-6" />
          <p className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight tracking-tight">
            "Building trust, one precision-engineered project at a time."
          </p>
        </div>
      </div>
    </div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const totalFrames = 60;
    const frameDuration = duration / totalFrames;
    const step = Math.ceil(to / totalFrames);
    
    const t = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(t);
      } else {
        setCount(start);
      }
    }, frameDuration);
    
    return () => clearInterval(t);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Main page ──────────────────────────────────────────────────────── */
export default function About() {
  const timelineRef = useRef<HTMLElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"],
  });
  const timelineLineScale = useSpring(timelineProgress, { stiffness: 90, damping: 24, mass: 0.35 });

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden antialiased font-sans">
      {/* ── 1. FOUNDER ───────────────────────────────────────────────── */}
      <FounderHero />

      {/* ── 2. BRAND STATEMENT ──────────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-white relative">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <FadeUp>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-[#2563EB]" />
                  <span className="text-[#2563EB] font-sans text-xs font-bold uppercase tracking-[0.2em]">Who We Are</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif font-bold leading-[1.15] text-[#0F172A] mb-8 tracking-tight">
                  India's most trusted construction partner since 2009.
                </h2>
                <div className="space-y-6 text-slate-600 text-base md:text-lg leading-relaxed font-light">
                  <p>
                    Swapnapurti Associates is a full-spectrum construction enterprise headquartered in Pune, operating comprehensively across premium residential, corporate commercial, heavy industrial, and critical urban infrastructure verticals.
                  </p>
                  <p>
                    Over 15 years of engineering commitment, we have handed over <strong className="font-semibold text-[#0F172A]">150+ landmark projects</strong> across residential, commercial, industrial, and infrastructure sectors.
                  </p>
                </div>
              </FadeUp>
            </div>

            <div className="lg:col-span-5">
              <FadeUp delay={0.15}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Projects Delivered", num: 150, suffix: "+" },
                    { label: "Cities Covered", num: 24, suffix: "" },
                    { label: "Professionals", num: 350, suffix: "+" },
                    { label: "On-Time Rate", num: 98, suffix: "%" },
                  ].map((s) => (
                    <div key={s.label}
                      className="bg-[#F8FAFC] border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500/10 transition-all duration-400 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-0 bg-[#2563EB] group-hover:h-full transition-all duration-400" />
                      <p className="text-4xl font-serif font-bold text-[#0F172A] mb-2">
                        <Counter to={s.num} suffix={s.suffix} />
                      </p>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FULL STATS BAND ──────────────────────────────────────── */}
      <section className="py-20 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
        <div className="container mx-auto max-w-5xl px-6 md:px-8">
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-8">
            {STATS.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.05}>
                <div className="group flex h-full flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-[#2563EB] group-hover:bg-[#2563EB]">
                    <s.icon className="text-[#60A5FA] transition-colors group-hover:text-white" size={23} strokeWidth={1.8} />
                  </div>
                  <p className="mb-1.5 whitespace-nowrap font-serif text-3xl font-bold text-white sm:text-4xl">{s.value}</p>
                  <p className="text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-[11px] sm:tracking-[0.16em]">{s.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PHOTO GALLERY ─────────────────────────────────────────── */}
      <section id="projects-gallery" className="scroll-mt-24 py-24 md:py-32 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <FadeUp className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#2563EB]" />
              <span className="text-[#2563EB] font-sans text-xs font-bold uppercase tracking-[0.2em]">Our Work</span>
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] tracking-tight">Projects built with purpose</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Explore a selection of residential and commercial work. Use the arrows or swipe to discover more.
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-slate-500">150+ projects delivered</span>
            </div>
          </FadeUp>
          <ProjectCarousel />
        </div>
      </section>

      {/* ── 5. PARALLAX DIVIDER ──────────────────────────────────────── */}
      <ParallaxBand src="/images/infrastructure.jpg" />

      {/* ── 6. OUR STORY / TIMELINE ──────────────────────────────────── */}
      <section ref={timelineRef} className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-5xl">
          <FadeUp className="mb-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-6 bg-[#2563EB]" />
              <span className="text-[#2563EB] font-sans text-xs font-bold uppercase tracking-[0.2em]">Our Journey</span>
              <div className="h-px w-6 bg-[#2563EB]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] tracking-tight">Timeline of Architectural Impact</h2>
          </FadeUp>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-100 md:-translate-x-px" />
            <motion.div
              aria-hidden="true"
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px origin-top bg-[#2563EB] md:-translate-x-px"
              style={{ scaleY: timelineLineScale }}
            />

            <div className="space-y-16">
              {MILESTONES.map((m, i) => (
                <FadeUp key={m.year} delay={0}>
                  <div className={`relative flex flex-col md:flex-row items-start gap-8 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                    <motion.div
                      className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#2563EB] shadow-sm mt-1.5 z-10"
                      initial={{ scale: 0.65, opacity: 0.45 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.7 }}
                      transition={{ duration: 0.35 }}
                    />

                    <div className={`w-24 shrink-0 pl-12 md:pl-0 ${i % 2 === 0 ? "md:text-right md:w-[calc(50%-2rem)]" : "md:w-[calc(50%-2rem)]"}`}>
                      <span className="inline-block bg-[#2563EB] text-white text-xs font-bold font-sans px-3 py-1 rounded-md tracking-wider shadow-sm">
                        {m.year}
                      </span>
                    </div>

                    <div className={`flex-1 pl-12 md:pl-0 ${i % 2 === 0 ? "md:pl-8" : "md:pr-8 md:text-right"}`}>
                      <h3 className="font-serif font-bold text-xl text-[#0F172A] mb-2">{m.title}</h3>
                      <p className="text-slate-600 font-sans text-sm leading-relaxed font-light">{m.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. VALUES ─────────────────────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-[#F8FAFC] border-y border-slate-100">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <FadeUp className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#2563EB]" />
              <span className="text-[#2563EB] font-sans text-xs font-bold uppercase tracking-[0.2em]">Core Principles</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] max-w-3xl tracking-tight">
              Operational pillars driving our execution.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.05}>
                <div className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-450 hover:-translate-y-1.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-[#2563EB] transition-colors duration-300">
                    <v.icon className="text-[#2563EB] group-hover:text-white transition-colors" size={22} />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#0F172A] mb-3">{v.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-light">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

     

      {/* ── 9. SECOND PARALLAX DIVIDER ──────────────────────────────── */}
      <ParallaxBand src="/images/exterior.jpg" />

      {/* ── 10. TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

 

      {/* ── 12. BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 70%)" }} />

        <div className="container mx-auto px-6 md:px-8 relative z-10 text-center max-w-4xl">
          <FadeUp>
            <p className="text-[#2563EB] text-xs font-bold uppercase tracking-[0.4em] mb-4">
              Start a Conversation
            </p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
              Ready to build your next landmark?
            </h2>
            <p className="text-slate-400 font-sans text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed">
              Our enterprise asset cluster interfaces within 24 operational hours. Let's design your framework.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="rounded-xl h-14 px-10 bg-[#2563EB] text-white hover:bg-blue-600 uppercase tracking-wider font-bold text-xs shadow-xl shadow-blue-600/10 transition-all duration-300 hover:-translate-y-0.5 group"
                asChild
              >
                <Link href="/login">
                  Start Your Project
                  <ArrowRight size={14} className="ml-2.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl h-14 px-10 border-white/10 text-white bg-white/5 hover:bg-white hover:text-[#0F172A] uppercase tracking-wider font-bold text-xs transition-all duration-300"
                asChild
              >
                <Link href="#projects-gallery">View Portfolio</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl h-14 px-10 border-white/10 text-white bg-white/5 hover:bg-white hover:text-[#0F172A] uppercase tracking-wider font-bold text-xs transition-all duration-300"
                asChild
              >
                <a href="https://wa.me/918379007279" target="_blank" rel="noreferrer">
                  Start a Conversation
                  <ArrowRight size={14} className="ml-2.5" />
                </a>
              </Button>
            </div>
          </FadeUp>
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