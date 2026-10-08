import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isDashboard = location.startsWith("/dashboard/");
  const isAuthPage = location === "/login" || location === "/signup";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark">
      {!isDashboard && !isAuthPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isDashboard && !isAuthPage && <Footer />}
    </div>
  );
}