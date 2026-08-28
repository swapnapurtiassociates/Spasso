import { getGetEngineerQueryKey, useGetEngineer } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { useRoute } from "wouter";

export default function EngineerDetail() {
  const [, params] = useRoute("/engineers/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data: engineer, isLoading } = useGetEngineer(id, { 
    query: { enabled: !!id, queryKey: getGetEngineerQueryKey(id) } 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 container mx-auto px-4 animate-pulse">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/3 aspect-3/4 bg-muted"></div>
          <div className="w-full md:w-2/3 space-y-6">
            <div className="h-12 bg-muted w-1/2"></div>
            <div className="h-6 bg-muted w-1/4"></div>
            <div className="h-32 bg-muted w-full"></div>
          </div>
        </div>
      </div>
    );  
  }

  if (!engineer) {
    return (
      <div className="min-h-screen pt-40 text-center">
        <h1 className="text-4xl font-serif font-bold">Profile Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Photo Sidebar */}
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-28"
            >
              <div className="aspect-3/4 relative overflow-hidden bg-muted mb-6 border border-border">
                <img
                  src={engineer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(engineer.fullName)}&background=random&size=1024`}
                  alt={engineer.fullName}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              
              <div className="bg-card border border-border p-6 space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin size={20} className="text-primary" />
                  <span>{engineer.city}, {engineer.state}, {engineer.country}</span>
                </div>
                {engineer.email && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail size={20} className="text-primary" />
                    <span>{engineer.email}</span>
                  </div>
                )}
                {engineer.phone && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone size={20} className="text-primary" />
                    <span>{engineer.phone}</span>
                  </div>
                )}
                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                  {engineer.available ? (
                    <span className="text-green-500 font-bold text-sm uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 size={16} /> Available
                    </span>
                  ) : (
                    <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">
                      On Project
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-2/3 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4">{engineer.fullName}</h1>
              <p className="text-2xl text-primary font-serif italic mb-10">{engineer.role}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 py-8 border-y border-border">
                <div>
                  <div className="text-4xl font-serif font-bold mb-2">{engineer.experience}+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="text-4xl font-serif font-bold mb-2">{engineer.projectsCompleted}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Projects Completed</div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="text-4xl font-serif font-bold mb-2 flex items-center gap-1">
                    {engineer.rating} <Award className="text-primary h-8 w-8" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Average Rating</div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-serif font-bold mb-6">Biography</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <p>{engineer.bio}</p>
                  <p className="mt-4">
                    Specializing in {engineer.specialization}, {engineer.fullName.split(' ')[0]} brings a rigorous analytical approach combined with deep practical knowledge of construction methodologies to every project undertaken by Swapnapurti Associates.
                  </p>
                </div>
              </div>

              {engineer.skills && engineer.skills.length > 0 && (
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-6">Core Competencies</h2>
                  <div className="flex flex-wrap gap-3">
                    {engineer.skills.map((skill) => (
                      <span key={skill} className="bg-card border border-border px-4 py-2 text-sm font-medium uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}