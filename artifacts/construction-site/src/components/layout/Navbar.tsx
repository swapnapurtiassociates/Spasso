import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { dashboardPathForRole, useAuth } from "@workspace/replit-auth-web";

export function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
    { href: "/careers", label: "Careers" },
    { href: "/about", label: "About" },
  ];

  const isHome = location === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 pt-3 md:px-8">
        <div className="relative flex h-14 items-center justify-between">
          {/* Logo stays separate from the glass navigation panel */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo.png"
              alt="Swapnapurti Associates Logo"
              className="h-10 w-auto max-w-[180px] object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop navigation panel */}
          <div
            className={`hidden md:flex absolute left-1/2 -translate-x-1/2 items-center rounded-xl border px-5 py-3 shadow-xl backdrop-blur-xl transition-all duration-300 ${
              scrolled || !isHome || isMobileMenuOpen
                ? "glass-nav"
                : "glass-nav-dark"
            }`}
          >
            <div className="flex items-center gap-4 lg:gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs font-medium tracking-wide uppercase transition-colors duration-300 group lg:text-sm ${
                    location.startsWith(link.href)
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
                      location.startsWith(link.href) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden rounded-xl border p-3 shadow-lg backdrop-blur-xl ${
              scrolled || !isHome || isMobileMenuOpen
                ? "glass-nav text-[#0F172A]"
                : "glass-nav-dark text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop actions stay outside the glass navigation panel */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-lg border border-white/20">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                    <AvatarFallback className="rounded-lg bg-[#1E3A8A] text-white text-xs">
                      {user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      scrolled || !isHome ? "text-[#0F172A]" : "text-white"
                    }`}
                  >
                    {user?.firstName}
                  </span>
                </div>
                <Link href={dashboardPathForRole(user?.role ?? "customer")}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-xs uppercase tracking-wider border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className={`text-xs uppercase tracking-wider ${
                    scrolled || !isHome ? "text-[#374151]" : "text-white/80 hover:text-white"
                  }`}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-lg text-xs uppercase tracking-wider ${
                    scrolled || !isHome
                      ? "border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
                      : "border-white/70 text-white hover:bg-white hover:text-[#1E3A8A]"
                  }`}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="sm"
                  className="rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs uppercase tracking-wider px-5 shadow-lg shadow-[#1E3A8A]/20 transition-all duration-300"
                >
                  Get a Quote
                </Button>
              </Link>
              </div>
            )}
          </div>
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
                    location.startsWith(link.href)
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
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                        <AvatarFallback className="rounded-lg bg-[#3c66da] text-white">
                          {user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-[#0F172A]">{user?.firstName}</span>
                    </div>
                    <Link
                      href={dashboardPathForRole(user?.role ?? "customer")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white rounded-lg uppercase tracking-wider">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full rounded-lg uppercase tracking-wider"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-lg uppercase tracking-wider">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white rounded-lg uppercase tracking-wider">
                      Get a Quote
                    </Button>
                  </Link>
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
