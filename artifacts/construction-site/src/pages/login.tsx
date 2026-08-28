import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { dashboardPathForRole, useAuth, type UserRole } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { Briefcase, HardHat, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

type Tab = Exclude<UserRole, "ceo">;

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "customer", label: "Customer", icon: User },
  { id: "engineer", label: "Engineer", icon: HardHat },
  { id: "admin", label: "Admin", icon: Briefcase },
];

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, loginWithEmail, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("customer");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Show a session-expired banner when redirected from inactivity logout
  const params = new URLSearchParams(window.location.search);
  const sessionMsg = params.get("reason") === "inactive"
    ? "Your session expired due to inactivity. Please sign in again."
    : params.get("reason") === "elsewhere"
    ? "Your account was signed in from another device."
    : "";

  useEffect(() => {
    if (isAuthenticated && user) {
      // Always go to home page after login
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setSubmitting(true);
    const result = await loginWithEmail(formData.email, formData.password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message || "Invalid email or password");
      return;
    }

    if (result.user && result.user.role !== activeTab) {
      setError(
        `This account is registered as "${result.user.role}". Please use the correct tab to sign in.`
      );
      return;
    }

    setLocation(dashboardPathForRole(result.user!.role));
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f2e8]">
        <div className="h-12 w-12 bg-[#b88f34] rounded-sm animate-pulse flex items-center justify-center">
          <span className="text-white font-serif font-bold text-2xl">S</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuthBackground />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md border border-[#e8dcc6] p-8 md:p-12 rounded-4xl shadow-[0_30px_80px_rgba(0,0,0,0.12)]"
        >
          <div className="flex justify-center mb-8">
            <div className="h-12 w-12 bg-[#b88f34] rounded-sm flex items-center justify-center shadow-lg">
              <span className="text-white font-serif font-bold text-3xl">S</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold tracking-tight mb-2 text-[#1c1a16]">Welcome Back</h2>
            <p className="text-[#4e473d]">Sign in to access the Swapnapurti Associates portal.</p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-8 bg-[#f7f2e8] p-1 rounded-full">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setError("");
                  }}
                  className={`flex flex-col items-center gap-1 py-2 px-2 rounded-full text-xs font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#b88f34] text-white"
                      : "text-[#4e473d] hover:text-[#1c1a16]"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {sessionMsg && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 text-sm">
                {sessionMsg}
              </div>
            )}
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="bg-white border border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#4e473d] rounded-lg h-12 focus:border-[#b88f34] focus:ring-[#b88f34]"
              data-testid="input-email"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-white border border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#4e473d] rounded-lg h-12 focus:border-[#b88f34] focus:ring-[#b88f34]"
              data-testid="input-password"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-full text-base uppercase tracking-widest font-bold bg-[#b88f34] hover:bg-[#a6792b] text-white transition-colors"
              disabled={submitting}
              data-testid="button-signin"
            >
              {submitting ? "Signing In..." : `Sign In as ${TABS.find((t) => t.id === activeTab)?.label}`}
            </Button>

            <div className="text-center">
              <a href="/forgot-password" className="text-sm text-[#b88f34] hover:text-[#a6792b] transition-colors">
                Forgot password?
              </a>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-[#e8dcc6] pt-6">
            <p className="text-sm text-[#4e473d]">
              Don't have an account?{" "}
              <a href="/signup" className="font-semibold text-[#b88f34] hover:text-[#a6792b] transition-colors">
                Sign Up
              </a>
            </p>
          </div>
        </motion.div>

        {/* Subtle, unbranded hint - real entry point is the hidden /portal-x9 route */}
        <div className="flex justify-center opacity-40 hover:opacity-100 transition-opacity">
          <a href="/portal-x9" aria-label="Executive access" className="p-2" data-testid="link-hidden-ceo">
            <ShieldCheck size={14} className="text-[#4e473d]" />
          </a>
        </div>
      </div>
    </div>
  );
}
