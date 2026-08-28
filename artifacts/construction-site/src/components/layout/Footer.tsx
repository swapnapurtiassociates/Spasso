import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-white">
      {/* Top CTA band */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 md:px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
              Ready to build something remarkable?
            </h3>
            <p className="text-white/60 font-sans text-sm">
              Let's discuss your project — no commitment required.
            </p>
          </div>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="shrink-0 bg-[#2563EB] hover:bg-[#3b82f6] text-white font-sans font-medium text-sm uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-[#2563EB]/30 transition-colors duration-300"
            >
              Start a Conversation
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <img
                src="/images/logo.png"
               
                className="h-14 w-auto max-w-[190px] object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 brightness-0 invert"
              />
            </Link>
            <p className="text-white/55 font-sans text-sm leading-relaxed max-w-xs">
              Building India's most trusted construction brand — delivering premium residential, commercial, and infrastructure projects across 24 cities.
            </p>

            <div className="mt-8 flex gap-3">
              {["in", "fb", "tw", "ig"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#1E3A8A] border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all duration-300 text-xs uppercase font-bold"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              Company
            </h4>
            <ul className="space-y-3 font-sans text-sm text-white/65">
              {[
                { href: "/about", label: "About Us" },
                { href: "/projects", label: "Portfolio" },
                { href: "/services", label: "Services" },
                { href: "/careers", label: "Careers" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              Services
            </h4>
            <ul className="space-y-3 font-sans text-sm text-white/65">
              {[
                "Infrastructure Development",
                "Interior Design",
                "Exterior Design",
                "Project Management",
                "Sustainable Design",
                "Renovation & Restoration",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              Contact
            </h4>
            <ul className="space-y-4 font-sans text-sm text-white/65">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#2563EB] mt-0.5 shrink-0" />
                <span>
                  <strong className="block text-white/90 mb-0.5">Mumbai HQ</strong>
                  Level 42, Swapnapurti Tower<br />
                  Bandra Kurla Complex, 400051
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#2563EB] mt-0.5 shrink-0" />
                <span>
                  <strong className="block text-white/90 mb-0.5">Delhi NCR</strong>
                  Sector 62, Gurugram, 122018
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#2563EB] shrink-0" />
                <a href="tel:+918379007279" className="hover:text-white transition-colors">
                  +91 83790 07279
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#2563EB] shrink-0" />
                <a
                  href="mailto:infoswapnapurtiassociates@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  infoswapnapurtiassociates@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-sans text-xs text-white/35 uppercase tracking-widest">
            © {year} Swapnapurti Associates. All rights reserved.
          </p>
          <div className="flex gap-6 font-sans text-xs text-white/35 uppercase tracking-widest">
            {["Privacy", "Terms", "Legal"].map((t) => (
              <a key={t} href="#" className="hover:text-white/60 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
