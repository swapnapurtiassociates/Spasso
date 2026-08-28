import { getGetProjectQueryKey, useGetProject } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, Building, Building2, Calendar, MapPin, Tag } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const id = params?.id ?? "";

  const { data: project, isLoading } = useGetProject(id, {
    query: { enabled: !!id, queryKey: getGetProjectQueryKey(id) },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 animate-pulse bg-white">
        <div className="h-[70vh] bg-gray-100 w-full" />
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="h-10 bg-gray-100 rounded-xl w-2/3 mb-6" />
          <div className="h-4 bg-gray-100 rounded-lg w-full mb-3" />
          <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-40 text-center bg-white">
        <h1 className="font-serif text-4xl font-bold text-[#0F172A]">Project Not Found</h1>
        <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-[#2563EB] font-sans text-sm hover:underline">
          <ArrowLeft size={14} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={project.imageUrl || "/images/1.jpeg"}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent" />

        {/* Back button */}
        <div className="absolute top-28 left-0 right-0">
          <div className="container mx-auto px-4 md:px-8">
            <Link href="/projects" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 font-sans text-sm text-white hover:bg-white/20 transition-colors">
              <ArrowLeft size={14} />
              All Projects
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-8 pb-16">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-[#1E3A8A] text-white px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider rounded-full">
                  {project.category}
                </span>
                <span className="bg-white/15 backdrop-blur text-white px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider rounded-full border border-white/20">
                  {project.status}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 max-w-4xl leading-tight">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 font-sans text-white/70 text-base">
                <MapPin size={16} />
                {project.location}, {project.city}, {project.state}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#2563EB]" />
                <span className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-[#2563EB]">Overview</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Project Overview</h2>
              <div className="space-y-5 font-sans text-[#6B7280] leading-relaxed text-base">
                <p>{project.description}</p>
                <p>
                  Our engineering team employed advanced structural techniques to ensure the highest standards of safety and durability. The project stands as a testament to our commitment to excellence in {project.category.toLowerCase()} construction.
                </p>
              </div>

              {/* Key features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="mt-12">
                  <h3 className="font-serif text-xl font-bold text-[#0F172A] mb-5">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.keyFeatures.map((f: string) => (
                      <li key={f} className="flex items-start gap-3 font-sans text-sm text-[#374151]">
                        <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="flex items-center gap-1.5 bg-[#F8FAFC] border border-gray-100 px-4 py-1.5 font-sans text-xs uppercase tracking-wider text-[#6B7280] rounded-full">
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
              className="bg-[#F8FAFC] rounded-2xl border border-gray-100 p-8 lg:sticky lg:top-28"
            >
              <h3 className="font-serif text-xl font-bold text-[#0F172A] mb-7">Key Facts</h3>

              <dl className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0">
                    <Building size={14} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <dt className="font-sans text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-0.5">Client</dt>
                    <dd className="font-sans font-semibold text-[#0F172A] text-sm">{project.clientName}</dd>
                  </div>
                </div>

                {project.projectValue && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0">
                      <Building2 size={14} className="text-[#2563EB]" />
                    </div>
                    <div>
                      <dt className="font-sans text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-0.5">Project Value</dt>
                      <dd className="font-sans font-semibold text-[#0F172A] text-sm">{project.projectValue}</dd>
                    </div>
                  </div>
                )}

                {project.areaCovered && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-[#2563EB]" />
                    </div>
                    <div>
                      <dt className="font-sans text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-0.5">Area Covered</dt>
                      <dd className="font-sans font-semibold text-[#0F172A] text-sm">{project.areaCovered}</dd>
                    </div>
                  </div>
                )}

                {project.completionYear && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0">
                      <Calendar size={14} className="text-[#2563EB]" />
                    </div>
                    <div>
                      <dt className="font-sans text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-0.5">Completion Year</dt>
                      <dd className="font-sans font-semibold text-[#0F172A] text-sm">{project.completionYear}</dd>
                    </div>
                  </div>
                )}

                {/* Status / Progress */}
                {project.status !== "Completed" && (
                  <div className="pt-2">
                    <dt className="font-sans text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-2">Progress</dt>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1E3A8A] rounded-full transition-all duration-1000"
                        style={{ width: `${(project as any).progress ?? 0}%` }}
                      />
                    </div>
                    <p className="font-sans text-xs text-[#6B7280] mt-1">
                      {(project as any).progress ?? 0}% complete
                    </p>
                  </div>
                )}
              </dl>

              <div className="pt-6 mt-6 border-t border-gray-200">
                <p className="font-sans text-sm text-[#6B7280] mb-4">Interested in a similar project?</p>
                <Link
                  href={`/contact?project=${encodeURIComponent(project.title)}&type=${encodeURIComponent(project.category)}`}
                  className="block w-full bg-[#0F172A] hover:bg-[#1E3A8A] text-white text-center py-3.5 font-sans text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors duration-300"
                >
                  Start a Project
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
