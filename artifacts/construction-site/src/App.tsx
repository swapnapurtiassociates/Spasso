import { InactivityWarning } from "@/components/auth/InactivityWarning";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useInactivityLogout } from "@/hooks/use-inactivity-logout";
import About from "@/pages/about";
import Careers from "@/pages/careers";
import CeoPortal from "@/pages/ceo-portal";
import Contact from "@/pages/contact";
import AdminDashboard from "@/pages/dashboard/admin";
import AdminEnquiries from "@/pages/dashboard/admin-enquiries";
import CeoDashboard from "@/pages/dashboard/ceo";
import CustomerDashboard from "@/pages/dashboard/customer";
import EngineerDashboard from "@/pages/dashboard/engineer";
import ForgotPassword from "@/pages/forgot-password";
import Home from "@/pages/home";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import ProjectDetail from "@/pages/project-detail";
import Projects from "@/pages/projects";
import Services from "@/pages/services";
import Signup from "@/pages/signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";

// Mock useAuth hook - replace with actual auth implementation
const useAuth = () => ({
  isAuthenticated: false,
  logout: () => {},
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:id" component={ProjectDetail} />
        <Route path="/services" component={Services} />
        <Route path="/careers" component={Careers} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/portal-x9" component={CeoPortal} />
        <Route path="/dashboard/customer" component={CustomerDashboard} />
        <Route path="/dashboard/engineer" component={EngineerDashboard} />
        <Route path="/dashboard/admin" component={AdminDashboard} />
        <Route path="/dashboard/admin/enquiries" component={AdminEnquiries} />
        <Route path="/dashboard/ceo" component={CeoDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

/** Wraps the app with inactivity-logout logic. Must be inside WouterRouter. */
function AppWithSession() {
  const { isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [warnVisible, setWarnVisible] = useState(false);
  const [warnSeconds, setWarnSeconds] = useState(120);

  const handleLogout = useCallback(() => {
    setWarnVisible(false);
    logout();
    setLocation("/login?reason=inactive");
  }, [logout, setLocation]);

  const handleWarn = useCallback((secs: number) => {
    setWarnSeconds(secs);
    setWarnVisible(true);
  }, []);

  // Reset warning when user moves — the inactivity hook resets the timer
  // which means they're still active; hide the warning banner.
  useInactivityLogout({
    enabled: isAuthenticated,
    onLogout: handleLogout,
    onWarn: handleWarn,
  });

  // Hide warning when activity is detected (timer reset means user is back)
  // We do this by listening to the same events and clearing the banner.
  const resetWarn = useCallback(() => setWarnVisible(false), []);

  return (
    <>
      <InactivityWarning visible={warnVisible} secondsLeft={warnSeconds} />
      <div onMouseMove={resetWarn} onKeyDown={resetWarn} onClick={resetWarn}>
        <Router />
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppWithSession />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;