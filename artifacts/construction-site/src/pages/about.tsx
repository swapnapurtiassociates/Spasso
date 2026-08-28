import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  Building2,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Layers,
  MapPin,
  Quote,
  Shield,
  Users,
  Zap
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Slide {
  src: string;
  label: string;
  sub: string;
}

/* ─── Data ───────────────────────────────────────────────────────────── */
const HERO_SLIDES: Slide[] = [
  {
    src: "/images/exterior.jpg",
    label: "Engineering Iconic Facades",
    sub: "Bespoke facades built to endure generations",
  },
  {
    src: "/images/interior.jpg",
    label: "Crafting Refined Interiors",
    sub: "Where every detail speaks fluent craftsmanship",
  },
  {
    src: "/images/infrastructure.jpg",
    label: "Shaping Critical Infrastructure",
    sub: "Corridors that move 4 lakh commuters daily",
  },
  {
    src: "/images/1.jpeg",
    label: "Building Residential Landmarks",
    sub: "Luxury residences that redefine the skyline",
  },
  {
    src: "/images/2.jpeg",
    label: "Delivering World-Class Quality",
    sub: "ISO-certified processes, zero-compromise execution",
  },
  {
    src: "/images/rr.jpg",
    label: "Transforming Urban Spaces",
    sub: "Mixed-use developments for the cities of tomorrow",
  },
];

const GALLERY_IMAGES = [
  { src: "/images/exterior.jpg", caption: "Exterior Engineering" },
  { src: "/images/interior.jpg", caption: "Refined Interiors" },
  { src: "/images/infrastructure.jpg", caption: "Infrastructure Projects" },
  { src: "/images/1.jpeg", caption: "Residential Excellence" },
  { src: "/images/2.jpeg", caption: "Construction Quality" },
  { src: "/images/rr.jpg", caption: "Urban Development" },
];

const STATS = [
  { value: "120+", label: "Projects Delivered", icon: Building2 },
  { value: "₹12,000 Cr", label: "Construction Value", icon: Layers },
  { value: "350+", label: "Expert Professionals", icon: HardHat },
  { value: "15+", label: "Years of Excellence", icon: Award },
  { value: "24", label: "Cities Across India", icon: MapPin },
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
    image: "/images/ceo.png",
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

function HeroSlider() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const len = HERO_SLIDES.length;

  const go = useCallback(
    (next: number) => {
      setDir(next > active ? 1 : -1);
      setActive((next + len) % len);
    },
    [active, len]
  );

  useEffect(() => {
    const t = setInterval(() => go(active + 1), 6000);
    return () => clearInterval(t);
  }, [active, go]);

  const variants = {
    enter: (d: number) => ({ opacity: 0, scale: 1.05 }),
    center: { opacity: 1, scale: 1 },
    exit: (d: number) => ({ opacity: 0 }),
  };

  return (
    <div className="relative w-full h-[90vh] min-h-[650px] overflow-hidden bg-[#0F172A]">
      <AnimatePresence custom={dir} mode="popLayout">
        <motion.div
          key={active}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0"
        >
          <img
            src={HERO_SLIDES[active].src}
            alt={HERO_SLIDES[active].label}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-end pb-32 px-6 md:px-16 lg:px-24 z-10 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={active + "txt"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#2563EB] font-sans text-xs font-bold uppercase tracking-[0.4em]">
                {String(active + 1).padStart(2, "0")} / {String(len).padStart(2, "0")}
              </span>
              <div className="h-px w-8 bg-[#2563EB]/40" />
            </div>
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-white leading-[1.15] mb-4 max-w-4xl tracking-tight">
              {HERO_SLIDES[active].label}
            </h2>
            <p className="text-slate-300 font-sans text-lg md:text-xl max-w-2xl font-light leading-relaxed">
              {HERO_SLIDES[active].sub}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 right-6 md:right-16 lg:right-24 flex items-center gap-6 z-10">
        <button
          onClick={() => go(active - 1)}
          className="w-12 h-12 rounded-full border border-white/20 text-white hover:bg-white hover:text-[#0F172A] flex items-center justify-center transition-all duration-300"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-[#2563EB]" : "w-2 bg-white/30"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => go(active + 1)}
          className="w-12 h-12 rounded-full border border-white/20 text-white hover:bg-white hover:text-[#0F172A] flex items-center justify-center transition-all duration-300"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function GalleryStrip() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const len = GALLERY_IMAGES.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GALLERY_IMAGES.map((img, i) => (
          <motion.div
            key={i}
            className={`relative overflow-hidden cursor-zoom-in rounded-2xl border border-slate-100 group ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-[16/10]" : "aspect-[4/3]"}`}
            onClick={() => setLightbox(i)}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <img
              src={img.src}
              alt={img.caption}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <p className="text-white text-xs font-sans font-bold uppercase tracking-widest bg-[#2563EB] px-3 py-1.5 rounded-md inline-block">
                {img.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F172A]/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_IMAGES[lightbox].src}
                alt={GALLERY_IMAGES[lightbox].caption}
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
              <p className="text-slate-300 font-serif text-lg text-center mt-4 tracking-wide">
                {GALLERY_IMAGES[lightbox].caption}
              </p>
              <button
                onClick={() => setLightbox((lightbox - 1 + len) % len)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-[#0F172A] transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={() => setLightbox((lightbox + 1) % len)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-[#0F172A] transition-colors"
              >
                <ChevronRight size={22} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden antialiased font-sans">
      {/* ── 1. HERO SLIDER ───────────────────────────────────────────── */}
      <HeroSlider />

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
                    Over 15 years of absolute engineering commitment, we have handed over <strong className="font-semibold text-[#0F172A]">120+ landmark frameworks</strong> valued at over ₹12,000 Cr across 24 cities—delivered with architectural precision, strictly on deadline.
                  </p>
                </div>
              </FadeUp>
            </div>

            <div className="lg:col-span-5">
              <FadeUp delay={0.15}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Projects Delivered", num: 120, suffix: "+" },
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
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {STATS.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.05}>
                <div className="text-center group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2563EB] group-hover:border-[#2563EB] transition-all duration-300">
                    <s.icon className="text-[#2563EB] group-hover:text-white transition-colors" size={20} />
                  </div>
                  <p className="text-3xl font-serif font-bold text-white mb-1.5">{s.value}</p>
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PHOTO GALLERY ─────────────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <FadeUp className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#2563EB]" />
              <span className="text-[#2563EB] font-sans text-xs font-bold uppercase tracking-[0.2em]">Our Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] tracking-tight">Project Registry</h2>
          </FadeUp>
          <GalleryStrip />
        </div>
      </section>

      {/* ── 5. PARALLAX DIVIDER ──────────────────────────────────────── */}
      <ParallaxBand src="/images/infrastructure.jpg" />

      {/* ── 6. OUR STORY / TIMELINE ──────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-white">
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

            <div className="space-y-16">
              {MILESTONES.map((m, i) => (
                <FadeUp key={m.year} delay={i * 0.05}>
                  <div className={`relative flex flex-col md:flex-row items-start gap-8 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#2563EB] shadow-sm mt-1.5 z-10" />

                    <div className={`w-24 shrink-0 pl-12 md:pl-0 ${i % 2 === 0 ? "md:text-right md:w-[calc(50%-2rem)]" : "md:w-[calc(50%-2rem)]"}`}>
                      <span className="inline-block bg-[#2563EB] text-white text-xs font-bold font-sans px-3 py-1 rounded-md tracking-wider">
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
                <Link href="/contact">
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
                <Link href="/projects">View Portfolio</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}