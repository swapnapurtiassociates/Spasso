import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateApplication } from "@workspace/api-client-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Building2, ChevronRight, TrendingUp, Users } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  role: z.string().min(2, "Role is required"),
  experience: z.coerce.number().min(0, "Experience must be a positive number"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverLetter: z.string().optional(),
});

const perks = [
  { icon: TrendingUp, title: "Career Growth", desc: "Accelerated advancement across 24 city offices" },
  { icon: Award, title: "Award-Winning Projects", desc: "Work on India's most prestigious builds" },
  { icon: Users, title: "Expert Mentorship", desc: "Learn from 350+ seasoned engineers" },
  { icon: Building2, title: "Landmark Impact", desc: "Leave your mark on India's skyline" },
];

export default function Careers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const createApplication = useCreateApplication();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 0.9]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.4], [0, 30]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      role: "",
      experience: 0,
      city: "",
      state: "",
      resumeUrl: "",
      coverLetter: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createApplication.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "Application Submitted",
            description: "We will review your profile and get back to you soon.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "There was an error submitting your application. Please try again.",
          });
        },
      }
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-slate-100 overflow-hidden transition-colors duration-350">
      {/* ── Hero Section ───────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: "url(/images/big.jpeg)",
            scale: bgScale,
          }}
        />
        <motion.div
          className="absolute inset-0 bg-linear-to-b from-[#0F172A]/85 via-[#0F172A]/70 to-[#F8FAFC] dark:to-[#0B0F19]"
          style={{ opacity: bgOpacity }}
        />
        
        {/* Architecture Grid Blueprint Mesh */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <motion.div
          className="container relative z-10 mx-auto px-4 md:px-8 text-center"
          style={{ y: heroContentY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#2563EB]" />
              <span className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-[#60A5FA]">
                Join Our Team
              </span>
              <div className="h-px w-10 bg-[#2563EB]" />
            </div>

            <h1 className="font-serif text-5xl md:text-8xl font-bold text-white mb-6 leading-[1.15] tracking-tight max-w-5xl mx-auto">
              Build With Us
            </h1>

            <p className="font-sans text-white/80 dark:text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              We are looking for driven engineers, architects, and managers to shape modern cityscapes and scale career limits.
            </p>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[#F8FAFC] dark:from-[#0B0F19] to-transparent pointer-events-none" />
      </section>

      {/* ── Perks Strip ───────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-[#0F172A] relative z-10 border-b border-gray-100 dark:border-slate-800/60 shadow-sm transition-colors duration-350">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
                className="group relative p-6 bg-[#F8FAFC] dark:bg-[#151D30] rounded-2xl border border-gray-100 dark:border-slate-800/40 hover:border-[#1E3A8A]/20 dark:hover:border-blue-500/30 hover:shadow-2xl dark:hover:shadow-blue-950/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-[#1E3A8A] dark:bg-blue-500 group-hover:h-full transition-all duration-500 rounded-l-2xl" />
                
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0F172A] group-hover:bg-[#1E3A8A] dark:group-hover:bg-blue-600 flex items-center justify-center mb-5 transition-colors duration-300 shadow-sm border border-gray-100 dark:border-slate-800/60">
                  <perk.icon className="h-5 w-5 text-[#2563EB] dark:text-blue-400 group-hover:text-white dark:group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white mb-2 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors duration-300">
                  {perk.title}
                </h3>
                <p className="font-sans text-xs text-[#4B5563] dark:text-slate-400 leading-relaxed">
                  {perk.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content: Info + Form ─────────────────────────── */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* ── Left Side: Brand Narrative & Visuals ───────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="lg:col-span-5 lg:sticky lg:top-28"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-[#2563EB]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#2563EB] dark:text-blue-400">
                  Why Swapnapurti
                </span>
              </div>
              
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-slate-100 leading-[1.15] mb-6 tracking-tight">
                Shape India's Future <br />
                <span className="text-[#1E3A8A] dark:text-blue-400 inline-flex items-center gap-2">
                  One Build at a Time <ChevronRight className="h-6 w-6 text-[#2563EB] dark:text-blue-400" />
                </span>
              </h2>
              
              <p className="font-sans text-[#4B5563] dark:text-slate-300 text-base leading-relaxed mb-6">
                At Swapnapurti Associates, your workflows contribute to structural icons. Submit your qualifications to instantly interface with active project operations nationwide.
              </p>
              
              <p className="font-sans text-[#6B7280] dark:text-slate-400 text-sm leading-relaxed mb-10">
                We engineer standards with rigid precision. If you align with absolute architectural excellence, our engineering clusters await your expertise.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { value: "350+", label: "Engineers" },
                  { value: "24", label: "City Offices" },
                  { value: "5+", label: "Years Growing" },
                ].map((s) => (
                  <div key={s.label} className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-gray-100 dark:border-slate-800/60 shadow-sm text-center transition-colors">
                    <div className="font-serif text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white">{s.value}</div>
                    <div className="font-sans text-[9px] text-[#6B7280] dark:text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative Frame Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800/40 group relative aspect-4/3">
                <div className="absolute inset-0 bg-[#0F172A]/10 dark:bg-[#0B0F19]/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop"
                  alt="Construction engineering project management"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.div>

            {/* ── Right Side: Application Portal Form ───────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="lg:col-span-7"
            >
              <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-slate-800/60 shadow-2xl p-8 md:p-12 relative overflow-hidden transition-colors duration-350">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EFF6FF] dark:bg-blue-950/30 rounded-full filter blur-3xl opacity-70 -mr-16 -mt-16 pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="h-px w-6 bg-[#2563EB]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#2563EB] dark:text-blue-400">
                    Apply Now
                  </span>
                </div>
                
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-8 relative z-10 tracking-tight">
                  Application Portal
                </h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-sans text-[11px] uppercase tracking-wider text-[#374151] dark:text-slate-300 font-bold">
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="rounded-xl bg-[#F8FAFC] dark:bg-[#151D30] border-gray-200 dark:border-slate-800/80 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-0 text-[#0F172A] dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 h-12 transition-all"
                                placeholder="Your full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-sans text-[11px] uppercase tracking-wider text-[#374151] dark:text-slate-300 font-bold">
                              Email Address *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                className="rounded-xl bg-[#F8FAFC] dark:bg-[#151D30] border-gray-200 dark:border-slate-800/80 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-0 text-[#0F172A] dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 h-12 transition-all"
                                placeholder="name@domain.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-sans text-[11px] uppercase tracking-wider text-[#374151] dark:text-slate-300 font-bold">
                              Phone Number *
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="rounded-xl bg-[#F8FAFC] dark:bg-[#151D30] border-gray-200 dark:border-slate-800/80 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-0 text-[#0F172A] dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 h-12 transition-all"
                                placeholder="+91 00000 00000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-sans text-[11px] uppercase tracking-wider text-[#374151] dark:text-slate-300 font-bold">
                              Position Target *
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="rounded-xl bg-[#F8FAFC] dark:bg-[#151D30] border-gray-200 dark:border-slate-800/80 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-0 text-[#0F172A] dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 h-12 transition-all"
                                placeholder="e.g. Lead Architect"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-sans text-[11px] uppercase tracking-wider text-[#374151] dark:text-slate-300 font-bold">
                              Years Experience *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                className="rounded-xl bg-[#F8FAFC] dark:bg-[#151D30] border-gray-200 dark:border-slate-800/80 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-0 text-[#0F172A] dark:text-slate-100 h-12 transition-all"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-sans text-[11px] uppercase tracking-wider text-[#374151] dark:text-slate-300 font-bold">
                              City *
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="rounded-xl bg-[#F8FAFC] dark:bg-[#151D30] border-gray-200 dark:border-slate-800/80 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-0 text-[#0F172A] dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 h-12 transition-all"
                                placeholder="Pune"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-sans text-[11px] uppercase tracking-wider text-[#374151] dark:text-slate-300 font-bold">
                              State *
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="rounded-xl bg-[#F8FAFC] dark:bg-[#151D30] border-gray-200 dark:border-slate-800/80 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-0 text-[#0F172A] dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 h-12 transition-all"
                                placeholder="Maharashtra"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="resumeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-[11px] uppercase tracking-wider text-[#374151] dark:text-slate-300 font-bold">
                            Resume Link / Portfolio Link{" "}
                            <span className="text-[#9CA3AF] dark:text-slate-500 normal-case font-normal ml-1">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xl bg-[#F8FAFC] dark:bg-[#151D30] border-gray-200 dark:border-slate-800/80 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-0 text-[#0F172A] dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 h-12 transition-all"
                              placeholder="https://linkedin.com/in/yourprofile"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverLetter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-[11px] uppercase tracking-wider text-[#374151] dark:text-slate-300 font-bold">
                            Professional Summary / Bio
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="rounded-xl bg-[#F8FAFC] dark:bg-[#151D30] border-gray-200 dark:border-slate-800/80 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-0 text-[#0F172A] dark:text-slate-100 min-h-[130px] placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-all resize-none p-4"
                              placeholder="Detail your experience navigating structural milestones..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] dark:hover:bg-blue-600 text-white font-sans font-semibold text-xs uppercase tracking-widest shadow-xl shadow-blue-600/10 dark:shadow-none transition-all duration-300 hover:-translate-y-0.5"
                      disabled={createApplication.isPending}
                    >
                      {createApplication.isPending ? "Transmitting Profile…" : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}