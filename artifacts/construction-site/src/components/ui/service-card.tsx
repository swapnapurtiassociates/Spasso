import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  delay?: number;
  actionLabel?: string;
  actionHref?: string;
}

export function ServiceCard({ title, description, image, delay = 0, actionLabel, actionHref }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "group overflow-hidden rounded-4xl border border-[#e8dcc6] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)]",
        "hover:-translate-y-1 hover:shadow-[0_35px_90px_rgba(0,0,0,0.12)] transition-transform duration-300"
      )}
    >
      <div className="relative overflow-hidden h-72">
        <img src={image} alt={title} className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="p-8">
        <h3 className="text-3xl font-serif font-bold text-[#1c1a16] mb-4">{title}</h3>
        <p className="text-[#4e473d] leading-relaxed mb-8">{description}</p>
        <Link
          href={actionHref ?? "/contact"}
          className="inline-flex items-center justify-center rounded-full bg-[#b88f34] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#a6792b]"
        >
          {actionLabel ?? "View more details"}
        </Link>
      </div>
    </motion.div>
  );
}
