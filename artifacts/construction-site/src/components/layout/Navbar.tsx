import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { dashboardPathForRole, useAuth, type AuthUser } from "@workspace/replit-auth-web";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
    { href: "/careers", label: "Careers" },
    { href: "/about", label: "About" },
  ];

  const isHome = location === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome || isMobileMenuOpen
          ? "glass-nav shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Swapnapurti Associates Logo"
                className="h-14 w-auto max-w-[200px] md:h-16 md:max-w-[220px] object-contain drop-shadow-md saturate-150 brightness-125 contrast-110 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 group ${
                  (link.href === "/" ? location === "/" : location.startsWith(link.href))
                    ? scrolled || !isHome
                      ? "text-[#1E3A8A]"
                      : "text-white"
                    : scrolled || !isHome
                    ? "text-[#374151] hover:text-[#1E3A8A]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#2563EB] transition-all duration-300 ${
                    (link.href === "/" ? location === "/" : location.startsWith(link.href)) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative flex items-center gap-3">
                <Link href={dashboardPathForRole(user?.role ?? "customer")}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-xs uppercase tracking-wider border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
                <button type="button" onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-black/5" aria-expanded={profileOpen} aria-label="Open profile menu">
                  <Avatar className="h-9 w-9 rounded-lg border border-white/20">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                    <AvatarFallback className="rounded-lg bg-[#1E3A8A] text-white text-xs">{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className={`hidden lg:block text-sm font-medium ${scrolled || !isHome ? "text-[#0F172A]" : "text-white"}`}>{user?.firstName}</span>
                  <ChevronDown size={15} className={scrolled || !isHome ? "text-[#374151]" : "text-white"} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl">
                    <div className="border-b border-border px-3 py-2">
                      <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs capitalize text-muted-foreground">{user?.role}</p>
                    </div>
                    <Link href="/dashboard/notifications" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"><Bell size={16} /> Notifications</Link>
                    <button type="button" onClick={() => { setProfileOpen(false); logout(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-muted"><LogOut size={16} /> Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login"><Button variant="outline" size="sm" className="rounded-lg border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white text-xs uppercase tracking-wider">Sign In</Button></Link>
                <Link href="/signup"><Button size="sm" className="rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs uppercase tracking-wider px-5 shadow-lg shadow-[#1E3A8A]/20 transition-all duration-300">Sign Up</Button></Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled || !isHome || isMobileMenuOpen
                ? "text-[#0F172A]"
                : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden overflow-hidden glass-nav border-t border-gray-100"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium uppercase tracking-widest transition-colors ${
                    (link.href === "/" ? location === "/" : location.startsWith(link.href))
                      ? "text-[#1E3A8A]"
                      : "text-[#374151]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <button type="button" onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-3 text-left">
                      <Avatar className="h-10 w-10 rounded-lg"><AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} /><AvatarFallback className="rounded-lg bg-[#1E3A8A] text-white">{user?.firstName?.charAt(0) || "U"}</AvatarFallback></Avatar>
                      <span className="font-medium text-[#0F172A]">{user?.firstName}</span><ChevronDown size={15} />
                    </button>
                    {profileOpen && <div className="rounded-xl border border-border bg-popover p-2 shadow-lg"><Link href="/dashboard/notifications" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"><Bell size={16} /> Notifications</Link><button type="button" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive"><LogOut size={16} /> Sign Out</button></div>}
                    <Link
                      href={dashboardPathForRole(user?.role ?? "customer")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white rounded-lg uppercase tracking-wider">
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}><Button variant="outline" className="w-full rounded-lg border-[#1E3A8A] text-[#1E3A8A] uppercase tracking-wider">Sign In</Button></Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}><Button className="w-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white rounded-lg uppercase tracking-wider">Sign Up</Button></Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
