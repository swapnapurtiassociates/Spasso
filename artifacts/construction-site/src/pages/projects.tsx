import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  ALL_PROJECTS,
  STATUS_COLOR,
  type ProjectData,
} from "../data/projects";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [, navigate] = useLocation();
  const [imgError, setImgError] = useState(false);

  const handleViewProject = () => {
    const params = new URLSearchParams({
      project: project.title,
      type: project.category,
      message: `I am interested in a project similar to "${project.title}" (${project.category}) located in ${project.location}. Please share more details about your construction services and how you can help bring my project to life.`,
    });
    navigate(`/contact?${params.toString()}`);
    setTimeout(() => {
      const el = document.getElementById("enquiry-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.75, delay: index * 0.05, ease: [0.25, 1, 0.5, 1] }}
      className="group relative bg-white rounded-2xl overflow-hidden flex flex-col border border-gray-100 hover:border-[#1E3A8A]/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-md"
    >
      {/* Blue left border reveal */}
      <div className="absolute top-0 left-0 w-1 h-0 bg-[#1E3A8A] group-hover:h-full transition-all duration-500 z-10" />

      {/* Image */}
      <div className="relative h-72 overflow-hidden bg-gray-100 shrink-0">
        {!imgError ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <span className="font-serif text-[#1E3A8A] font-bold text-3xl opacity-20">
              {project.title[0]}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm font-sans ${STATUS_COLOR[project.status]}`}>
            {project.status}
          </span>
        </div>

        {/* Progress bar */}
        {project.status !== "Completed" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
            <div
              className="h-full bg-[#2563EB] transition-all duration-1000"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 bg-white">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-[#EFF6FF] text-[#1E3A8A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-sans">
            {project.category}
          </span>
          <span className="font-sans text-[#6B7280] text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#2563EB]" /> {project.city}, {project.state}
          </span>
        </div>

        <h3 className="font-serif font-bold text-[#0F172A] text-xl mb-2 group-hover:text-[#2563EB] transition-colors duration-300 leading-tight">
          {project.title}
        </h3>

        <p className="font-sans text-[#4B5563] text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.shortDescription}
        </p>

        {/* Meta */}
        {(project.projectValue || project.areaCovered || project.completionYear) && (
          <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 mb-4">
            {project.projectValue && (
              <div>
                <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#2563EB] mb-0.5">
                  Value
                </p>
                <p className="font-sans font-semibold text-[#374151] text-xs truncate">
                  {project.projectValue}
                </p>
              </div>
            )}
            {project.areaCovered && (
              <div>
                <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#2563EB] mb-0.5">
                  Area
                </p>
                <p className="font-sans font-semibold text-[#374151] text-xs truncate">
                  {project.areaCovered}
                </p>
              </div>
            )}
            {project.completionYear && (
              <div>
                <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#2563EB] mb-0.5">
                  Year
                </p>
                <p className="font-sans font-semibold text-[#374151] text-xs truncate">
                  {project.completionYear}
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          className="w-full rounded-xl h-11 bg-[#0F172A] hover:bg-[#1E3A8A] text-white font-sans font-medium text-xs uppercase tracking-wider transition-all duration-300 group/btn"
          onClick={handleViewProject}
        >
          Enquire About This Project
          <ArrowRight size={14} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const filtered = ALL_PROJECTS;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 0.9]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, 40]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
      {/* ── Hero Section ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ 
            backgroundImage: "url(/images/big.jpeg)",
            scale: bgScale
          }}
        />
        {/* Crisp light overlay gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/70 to-[#F8FAFC]" 
          style={{ opacity: bgOpacity }}
        />
        {/* Architecture Grid Mesh Blueprint Texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
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
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#2563EB]" />
              <span className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-[#60A5FA]">
                Our Work
              </span>
              <div className="h-px w-10 bg-[#2563EB]" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-8xl font-bold text-white mb-6 leading-[1.15] tracking-tight max-w-5xl mx-auto">
              Project Portfolio 
            </h1>
            
            <p className="font-sans text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-light">
              120+ completed projects across multiple cities, ranging from luxury residences to premium commercial developments.
            </p>
          </motion.div>

          {/* Premium Floating White Stats Block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="inline-flex flex-wrap justify-center items-center bg-white rounded-2xl md:rounded-full p-2 border border-gray-100 shadow-xl max-w-4xl mx-auto"
          >
            {[
              { value: "120+", label: "Projects" },
              { value: "₹12 Cr", label: "Total Value" },
              { value: "13", label: "Cities" },
              { value: "98%", label: "On-Time" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`text-center px-8 py-4 md:py-3 min-w-[140px] ${
                  i > 0 ? "md:border-l border-gray-100" : ""
                }`}
              >
                <div className="font-serif text-3xl md:text-4xl font-bold text-[#0F172A]">
                  {s.value}
                </div>
                <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Cinematic bottom layout blend */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />
      </section>

      {/* ── Project Grid Section ────────────────────────────────── */}
      <section className="py-24 relative bg-[#F8FAFC] z-10">
        <div className="container mx-auto px-4 md:px-8">
          {/* Results count indicator */}
          <FadeIn className="mb-10 pb-4 border-b border-gray-200">
            <p className="font-sans text-sm text-[#4B5563]">
              Showing{" "}
              <span className="font-semibold text-[#2563EB]">{filtered.length}</span>{" "}
              project{filtered.length !== 1 ? "s" : ""}
            </p>
          </FadeIn>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Call To Action Section ──────────────────────────────── */}
      <section className="py-28 bg-white text-center relative border-t border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <FadeIn>
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">
              Want a similar project?
            </h2>
            <p className="font-sans text-[#4B5563] mb-10 max-w-md mx-auto leading-relaxed">
              Share your vision and our team will get back to you with a tailored construction plan and comprehensive quote.
            </p>
            <Button
              className="rounded-xl h-14 px-10 bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-sans text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-blue-600/10 hover:shadow-blue-600/20"
              asChild
            >
              <a href="/contact">Start Your Project</a>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}