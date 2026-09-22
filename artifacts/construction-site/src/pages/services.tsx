import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle,
  Layers,
  Leaf,
  Settings,
  Wrench,
} from "lucide-react";
import { useRef } from "react";
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
  },
  {
    step: "02",
    title: "Design & Planning",
    desc: "Our architects and designers create detailed plans, 3D renders, and a phased schedule.",
  },
  {
    step: "03",
    title: "Execution",
    desc: "Skilled teams with cutting-edge equipment bring the design to life on schedule.",
  },
  {
    step: "04",
    title: "Handover",
    desc: "Quality-checked delivery, documentation, and post-handover support included.",
  },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Modern scroll parallax hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.12]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 0.15]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, 50]);

  return (
    <div ref={containerRef} className="services-page min-h-screen bg-white text-[#0F172A] overflow-hidden">
      {/* ── High-End Full-Screen Light Parallax Hero ──────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 border-b border-slate-100">
        {/* Uploaded construction video with a static image fallback. */}
        <motion.div
          className="absolute inset-0 overflow-hidden will-change-transform"
          style={{ scale: bgScale }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={`${baseUrl}images/big.jpeg`}
            className="h-full w-full object-cover"
          >
            <source src={`${baseUrl}images/services.mp4`} type="video/mp4" />
          </video>
        </motion.div>
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-950/75 via-slate-900/45 to-slate-950/60"
          aria-hidden="true"
        />
        {/* Architectural light multi-stop gradient mask for maximum contrast */}
        <motion.div 
          className="absolute inset-0 bg-linear-to-b from-slate-950/55 via-transparent to-slate-950/65" 
          style={{ opacity: bgOpacity }}
        />
        
        <motion.div 
          className="container relative z-10 mx-auto px-4 md:px-8 text-center"
          style={{ y: contentY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#2563EB]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#93C5FD]">
                What We Offer
              </span>
              <div className="h-px w-10 bg-[#2563EB]" />
            </div>
            
            <h1 className="services-hero-title font-serif text-5xl md:text-8xl font-bold text-[#f0f0f0] mb-8 leading-[1.15] tracking-tight max-w-5xl mx-auto">
              Built for Excellence, 
            </h1>
            <h1 className="services-hero-title font-serif text-5xl md:text-8xl font-bold text-[#93C5FD] mb-8 leading-[1.15] tracking-tight max-w-5xl mx-auto">Designed for You </h1>

            
            <p className="font-sans text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-normal">
              We deliver premium construction and design solutions that combine technical precision with elegant aesthetics — across every stage of the build.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                className="rounded-xl h-14 px-10 bg-[#0F172A] hover:bg-[#2563EB] text-white font-sans text-xs font-semibold uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5"
                asChild
              >
                <Link href="/contact">Get a Free Quote</Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-xl h-14 px-10 border-white/40 bg-white/10 text-white hover:bg-white/20 font-sans text-xs font-semibold uppercase tracking-widest backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link href="/projects">View Portfolio</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Smooth bottom light blending overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ── Premium Light Card Matrix Rows ───────────────────────── */}
      <section className="services-list relative z-10 bg-[#F8FAFC] py-24">
        <div className="services-blueprint-scan pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />
        <div className="services-blueprint-beam pointer-events-none absolute inset-y-0" aria-hidden="true" />
        <div className="services-blueprint-measure services-blueprint-measure-top pointer-events-none absolute" aria-hidden="true" />
        <div className="services-blueprint-measure services-blueprint-measure-bottom pointer-events-none absolute" aria-hidden="true" />
        <div className="services-blueprint-crosshair services-blueprint-crosshair-one pointer-events-none absolute" aria-hidden="true" />
        <div className="services-blueprint-crosshair services-blueprint-crosshair-two pointer-events-none absolute" aria-hidden="true" />
        <div className="services-blueprint-corner services-blueprint-corner-left pointer-events-none absolute" aria-hidden="true" />
        <div className="services-blueprint-corner services-blueprint-corner-right pointer-events-none absolute" aria-hidden="true" />

        <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-8 space-y-20">
          {services.map((service, index) => (
            <FadeIn
              key={service.title}
              delay={0.04}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <div
                className={`service-card group relative grid min-h-170 md:min-h-140 md:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(37,99,235,0.16)] hover:border-blue-500/30 transition-all duration-500 ${
                  index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Image */}
                <div className="service-image relative min-h-80 md:h-full md:min-h-0 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/10 via-transparent to-transparent opacity-60 transition-opacity duration-500" />
                  
                  {/* Premium Icon badge overlay */}
                  <div
                    className="absolute top-6 left-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                    style={{ backgroundColor: service.accent }}
                  >
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex h-full flex-col justify-center p-8 md:p-14 bg-white">
                  <div className="absolute left-0 top-8 bottom-8 w-1 origin-top scale-y-0 bg-linear-to-b from-[#2563EB] to-[#60A5FA] transition-transform duration-500 group-hover:scale-y-100" />
                  <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#2563EB] font-semibold mb-3">
                    {service.subtitle}
                  </span>
                  <h2 className="font-serif text-2xl md:text-4xl font-bold text-[#0F172A] mb-4 group-hover:text-[#2563EB] transition-colors duration-300">
                    {service.title}
                  </h2>
                  <p className="font-sans text-[#64748B] leading-relaxed mb-6 text-sm font-normal">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-3 font-sans text-sm text-[#334155] transition-transform duration-300 group-hover:translate-x-1">
                        <CheckCircle className="h-4 w-4 text-[#2563EB] shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="group/btn relative self-start h-12 overflow-hidden rounded-xl border border-blue-400/30 bg-linear-to-r from-[#0F172A] via-[#1E3A8A] to-[#2563EB] px-6 text-white font-sans text-xs font-semibold uppercase tracking-wider shadow-[0_10px_25px_rgba(30,58,138,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(37,99,235,0.35)]"
                    asChild
                  >
                    <Link href="/contact">
                      <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover/btn:translate-x-[420%]" aria-hidden="true" />
                      <span className="relative">Enquire Now</span>
                      <ArrowRight size={14} className="relative ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Process Grid (Light Style) ──────────────────────────── */}
      <section className="py-24 bg-white border-t border-slate-100 relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#2563EB]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#2563EB]">
                  How We Work
                </span>
                <div className="h-px w-8 bg-[#2563EB]" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
                Our Process
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <FadeIn key={p.step} delay={i * 0.1}>
                <div className="process-card relative p-8 bg-[#F8FAFC] border border-slate-200/60 rounded-2xl shadow-sm hover:-translate-y-1 hover:border-blue-300/70 hover:shadow-[0_16px_35px_rgba(37,99,235,0.12)] transition-all duration-300 group">
                  {/* Architectural linking lines */}
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2 w-6 h-px bg-slate-200 z-10" />
                  )}
                  <div className="font-serif text-5xl font-bold text-slate-200 group-hover:text-blue-500/10 mb-4 transition-colors duration-300">
                    {p.step}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#0F172A] mb-3">
                    {p.title}
                  </h3>
                  <p className="font-sans text-sm text-[#64748B] leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
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