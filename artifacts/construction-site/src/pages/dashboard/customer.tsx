import { DashboardShell, StatCard, useDashboardGuard } from "@/components/dashboard/DashboardShell";
import { useNotifications } from "@/hooks/use-notifications";
import { useProjects } from "@/hooks/use-projects";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Bell, MapPin } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";

export default function CustomerDashboard() {
  const { user, ready } = useDashboardGuard("customer");
  const { notifications, unreadCount } = useNotifications(user);
  const { projects, loading } = useProjects(user);
  const middleSectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress: middleProgress } = useScroll({
    target: middleSectionRef,
    offset: ["start end", "end start"],
  });
  const roomScale = useTransform(middleProgress, [0, 0.5, 1], [1.08, 1, 1.08]);
  const lightGlow = useTransform(middleProgress, [0, 0.35, 0.7, 1], [0.12, 0.4, 0.85, 0.3]);

  if (!ready || !user) return null;

  const ongoing = projects.filter((project) => project.status === "Ongoing").length;
  const completed = projects.filter((project) => project.status === "Completed").length;
  const firstName = user.firstName?.trim() || "there";

  return (
    <DashboardShell
      title="Customer Portal"
      subtitle="Swapnapurti Associates"
      user={user}
      notificationCount={unreadCount}
      fullWidth
    >
      <div className="overflow-hidden bg-[#f7f3ed] text-[#171511]">
        <section
          aria-labelledby="customer-welcome"
          className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden px-6 py-20 text-center"
        >
          <img
            src="/images/int.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#100e0b]/55" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#100e0b]/30 to-transparent" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.16, delayChildren: 0.18 } },
            }}
            className="relative z-10 mx-auto max-w-4xl text-white"
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7 }}
              className="mb-5 text-xs font-semibold uppercase tracking-[0.38em] text-[#e9c878]"
            >
              A heartfelt welcome from Swapnapurti
            </motion.p>
            <motion.h1
              id="customer-welcome"
              variants={{
                hidden: { opacity: 0, y: 34 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-7xl md:text-8xl"
            >
              Hello, {firstName}
            </motion.h1>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7 }}
              className="mx-auto mt-7 max-w-xl text-base text-white/85 sm:text-xl"
            >
              Let’s make your vision feel like home.
            </motion.p>
            <motion.a
              href="#customer-projects"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7 }}
              className="mt-12 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-[#e9c878]"
            >
              Let’s track your progress
              <ArrowDown size={15} />
            </motion.a>
          </motion.div>
        </section>

        <section
          ref={middleSectionRef}
          aria-labelledby="luxury-living"
          className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden px-6 py-24 text-center"
        >
          <motion.img
            src="/images/h2.png"
            alt="A warm, refined bedroom interior"
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{ scale: reducedMotion ? 1 : roomScale }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#16110f]/70 via-[#16110f]/45 to-[#16110f]/65" />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ opacity: reducedMotion ? 0.45 : lightGlow }}
          >
            <div className="absolute left-[16%] top-[22%] h-32 w-32 rounded-full bg-[#ffd58a]/35 blur-3xl" />
            <div className="absolute right-[17%] top-[18%] h-36 w-36 rounded-full bg-[#ffe3a1]/35 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#f6c16e]/15 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-4xl text-white"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-[#e9c878]">
              Thoughtful design. Timeless comfort.
            </p>
            <h2
              id="luxury-living"
              className="font-sans text-4xl font-extrabold uppercase leading-[1.08] tracking-[0.04em] sm:text-6xl md:text-7xl"
            >
              We provide
              <span className="mt-2 block text-[#f1d7ad]">luxury living</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
              Considered spaces, crafted with care, and made for the way you want to live.
            </p>
            <Link
              href="/projects"
              className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#171511] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              Know More
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </section>

        <section aria-label="Your comfort is our priority" className="relative min-h-[calc(100svh-5rem)] bg-[#d7cbc0]">
          <div className="relative flex min-h-[calc(100svh-5rem)] items-end justify-center overflow-hidden px-5 pb-10">
            <img
              src="/images/3s1.png"
              alt="Your comfort is our priority, featuring a completed luxury home"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10" />
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55 }}
              className="relative z-10"
            >
              <Link
                href="/contact"
                aria-label="Contact us to get a quote"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#171511] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#fff9ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#775c27]"
              >
                Contact Us
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="customer-projects" className="scroll-mt-24 bg-[#f7f3ed] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
            >
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#a57d31]">Your portal</p>
                <h2 className="font-serif text-3xl font-bold text-[#1c1a16] sm:text-4xl">Your project journey</h2>
                <p className="mt-2 text-sm text-[#62594e]">Hello, {firstName}. Your updates are all in one place.</p>
              </div>
              <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#775c27] hover:text-[#1c1a16]">
                Start a new project <ArrowRight size={15} />
              </Link>
            </motion.div>

            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Your Projects" value={projects.length} />
              <StatCard label="Ongoing" value={ongoing} />
              <StatCard label="Completed" value={completed} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-3xl border border-[#e8dcc6] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-[#1c1a16]">Project updates</h3>
                  <MapPin size={18} className="text-[#b88f34]" />
                </div>
                {loading ? (
                  <p className="text-sm text-[#62594e]">Loading your projects…</p>
                ) : projects.length === 0 ? (
                  <div className="rounded-2xl bg-[#faf6f0] p-6">
                    <p className="text-sm leading-relaxed text-[#62594e]">
                      No projects are linked to your account yet. Contact our team to discuss your plans and get started.
                    </p>
                    <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#775c27] hover:text-[#1c1a16]">
                      Get a quote <ArrowRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <article key={project._id} className="rounded-2xl border border-[#eee6d9] p-5" data-testid={`project-${project._id}`}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-serif text-xl font-bold text-[#1c1a16]">{project.title}</h4>
                          <span className="rounded-full bg-[#f7f2e8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#775c27]">{project.status}</span>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-[#62594e]">{project.description}</p>
                        <div className="h-2 overflow-hidden rounded-full bg-[#f0e9da]">
                          <div
                            className="h-full rounded-full bg-[#b88f34] transition-all duration-700"
                            style={{ width: `${Math.max(0, Math.min(100, project.progress))}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs font-medium text-[#62594e]">{project.progress}% complete</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <aside className="rounded-3xl border border-[#e8dcc6] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:p-8">
                <div className="mb-5 flex items-center gap-2">
                  <Bell size={17} className="text-[#b88f34]" />
                  <h3 className="font-serif text-2xl font-bold text-[#1c1a16]">Recent updates</h3>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-sm leading-relaxed text-[#62594e]">Project messages and progress updates will appear here.</p>
                ) : (
                  <div className="space-y-4">
                    {notifications.slice(0, 6).map((notification) => (
                      <div key={notification._id} className="border-b border-[#f0e9da] pb-4 last:border-0 last:pb-0">
                        <p className="text-sm font-semibold text-[#1c1a16]">{notification.title}</p>
                        {notification.body && <p className="mt-1 text-xs leading-relaxed text-[#62594e]">{notification.body}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
