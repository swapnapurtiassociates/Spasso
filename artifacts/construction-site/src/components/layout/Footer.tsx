import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.5c0-.9.3-1.5 1.5-1.5H16V2.9c-.5-.1-1.3-.2-2.4-.2-2.5 0-4.2 1.4-4.2 4.2V9.9H7v3.1h2.4v8h4.1Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5A1.56 1.56 0 1 1 6.9 5.4a1.56 1.56 0 0 1 .04 3.1ZM5.3 9.9h3.3V18H5.3V9.9Zm5.3 0h3.2v1.1h.1c.4-.9 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.1V18h-3.3v-16c0-3.1-4.2-2.9-4.2 0V18H10.6V9.9Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.59 2 2.18 6.39 2.18 11.84c0 1.98.58 3.91 1.67 5.58L2 22l4.74-1.82A9.83 9.83 0 0 0 12.05 22c5.46 0 9.95-4.39 9.95-9.84S17.5 2 12.04 2Zm5.77 13.8-1.41.82c-.6.35-1.39.4-2.05.11a7.14 7.14 0 0 1-3.68-3.16 7.1 7.1 0 0 1-.93-3.23c-.12-.72.1-1.46.65-1.96l.7-.58a1.17 1.17 0 0 1 1.63 0l.6.6c.44.44.47 1.15.08 1.64l-.46.58a.63.63 0 0 0-.08.73c.36.7.9 1.31 1.57 1.79.42.29.93.5 1.04.97.12.5-.15.96-.52 1.3l-.57.52c-.44.4-1.08.45-1.58.15l-.76-.45a.94.94 0 0 0-.98-.07l-1 .52c-.45.26-.94.55-1.42.82.73.82 1.66 1.45 2.7 1.84.81.3 1.68.5 2.57.44.8-.05 1.58-.35 2.26-.82.68-.47 1.11-1.17 1.27-1.95.14-.69-.07-1.34-.57-1.8Z" />
    </svg>
  );
}

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
              {[
                { key: "ig", href: "https://www.instagram.com/", label: "Instagram", icon: <InstagramIcon /> },
                { key: "fb", href: "https://www.facebook.com/", label: "Facebook", icon: <FacebookIcon /> },
                { key: "in", href: "https://www.linkedin.com/", label: "LinkedIn", icon: <LinkedInIcon /> },
                { key: "wa", href: "https://wa.me/918379007279", label: "WhatsApp", icon: <WhatsAppIcon /> },
              ].map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#1E3A8A] border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all duration-300"
                >
                  {social.icon}
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
                  <strong className="block text-white/90 mb-0.5">Ambegoan</strong>
                 
                  Pune, Maharashtra 412115
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#2563EB] mt-0.5 shrink-0" />
                <span>
                  <strong className="block text-white/90 mb-0.5">Manchar</strong>
                  Manchar, Pune, Maharashtra 410503
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
