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
  const isInView = useInView(ref, { once: true, margin: "-60px" });
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
    <div ref={containerRef} className="min-h-screen bg-white text-[#0F172A] overflow-hidden">
      {/* ── High-End Full-Screen Light Parallax Hero ──────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 border-b border-slate-100">
        {/* Enlarged Parallax Hero Background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ 
            backgroundImage: `url(${baseUrl}images/big.jpeg)`,
            scale: bgScale
          }}
        />
        {/* Architectural light multi-stop gradient mask for maximum contrast */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" 
          style={{ opacity: bgOpacity }}
        />
        
        {/* Blueprint Layout Subtle Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.3) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
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
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#2563EB]">
                What We Offer
              </span>
              <div className="h-px w-10 bg-[#2563EB]" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-8xl font-bold text-[#f0f0f0] mb-8 leading-[1.15] tracking-tight max-w-5xl mx-auto">
              Built for Excellence, 
            </h1>
            <h1 className="font-serif text-5xl md:text-8xl font-bold text-[#0a4b9a] mb-8 leading-[1.15] tracking-tight max-w-5xl mx-auto">Designed for You </h1>

            
            <p className="font-sans text-[#475569] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-normal">
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
                className="rounded-xl h-14 px-10 border-[#0F172A]/20 bg-white/40 text-[#0F172A] hover:bg-slate-50 font-sans text-xs font-semibold uppercase tracking-widest backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link href="/projects">View Portfolio</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Smooth bottom light blending overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ── Premium Light Card Matrix Rows ───────────────────────── */}
      <section className="py-24 relative bg-[#F8FAFC] z-10">
        <div className="container mx-auto px-4 md:px-8 space-y-16">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.05}>
              <div
                className={`group grid md:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 ${
                  index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Image */}
                <div className="relative h-80 md:h-auto overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-60 transition-opacity duration-500" />
                  
                  {/* Premium Icon badge overlay */}
                  <div
                    className="absolute top-6 left-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/20"
                    style={{ backgroundColor: service.accent }}
                  >
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-14 flex flex-col justify-center bg-white">
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
                      <li key={b} className="flex items-center gap-3 font-sans text-sm text-[#334155]">
                        <CheckCircle className="h-4 w-4 text-[#2563EB] shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="self-start rounded-xl h-12 px-6 bg-[#0F172A] hover:bg-[#2563EB] text-white font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 group/btn"
                    asChild
                  >
                    <Link href="/contact">
                      Enquire Now
                      <ArrowRight size={14} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
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
                <div className="relative p-8 bg-[#F8FAFC] border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
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