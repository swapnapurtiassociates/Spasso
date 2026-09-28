import { useLocation } from "wouter";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark">
      {!isHome && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isHome && <Footer />}
    </div>
  );
}