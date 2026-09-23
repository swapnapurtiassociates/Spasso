import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { dashboardPathForRole, useAuth, type UserRole } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { Briefcase, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

type Tab = "customer" | "admin";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "customer", label: "Customer", icon: User },
  { id: "admin", label: "Admin", icon: Briefcase },
];

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, loginWithEmail, verifyCode, resendCode, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("customer");
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [challenge, setChallenge] = useState<{ challenge: string; channel: "email" | "phone"; destination: string } | null>(null);
  const [code, setCode] = useState("");
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

    if (!formData.identifier || !formData.password) {
      setError("Email/mobile number and password are required");
      return;
    }

    setSubmitting(true);
    const result = await loginWithEmail(formData.identifier, formData.password, activeTab, channel);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message || "Invalid email or password");
      return;
    }

    if (result.verification) {
      setChallenge(result.verification);
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;
    const result = await verifyCode(challenge.challenge, code);
    if (!result.success) {
      setError(result.message || "Invalid verification code");
      return;
    }
    setLocation(dashboardPathForRole(result.user!.role));
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 bg-primary rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-primary-foreground font-serif font-bold text-2xl">S</span>
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
          className="bg-card/95 backdrop-blur-md border border-border p-8 md:p-12 rounded-2xl shadow-xl"
        >
          <div className="flex justify-center mb-8">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-serif font-bold text-3xl">S</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold tracking-tight mb-2 text-foreground">{challenge ? "Verify your sign in" : "Welcome Back"}</h2>
            <p className="text-muted-foreground">{challenge ? `Enter the code sent to ${challenge.destination}` : "Sign in to access the Swapnapurti Associates portal."}</p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-8 bg-muted p-1 rounded-xl">
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
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {challenge ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <Input inputMode="numeric" maxLength={6} value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }} placeholder="6-digit verification code" className="bg-background border-border text-foreground rounded-lg h-12 text-center tracking-[0.4em]" autoFocus />
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
              <Button type="submit" className="w-full h-12 rounded-lg text-base uppercase tracking-widest font-bold">Verify and Continue</Button>
              <button type="button" onClick={async () => { const result = await resendCode(challenge.challenge, challenge.channel); if (result.verification) setChallenge(result.verification); else setError(result.message || "Unable to resend code"); }} className="w-full text-sm text-[#b88f34] hover:underline">Resend verification code</button>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {sessionMsg && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 text-sm">
                {sessionMsg}
              </div>
            )}
              <Input
              type={channel === "email" ? "email" : "tel"}
              name="identifier"
              placeholder={channel === "email" ? "Email Address" : "Mobile number"}
              value={formData.identifier}
              onChange={handleChange}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12 focus:border-primary focus:ring-primary"
              data-testid="input-email"
            />

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
              {(["email", "phone"] as const).map((option) => (
                <button key={option} type="button" onClick={() => setChannel(option)} className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold uppercase tracking-wider ${channel === option ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {option === "email" ? <Mail size={14} /> : <Phone size={14} />}{option}
                </button>
              ))}
            </div>

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12 focus:border-primary focus:ring-primary"
              data-testid="input-password"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-lg text-base uppercase tracking-widest font-bold transition-colors"
              disabled={submitting}
              data-testid="button-signin"
            >
              {submitting ? "Signing In..." : `Sign In as ${TABS.find((t) => t.id === activeTab)?.label}`}
            </Button>

            <div className="text-center">
              <a href="/forgot-password" className="text-sm text-primary hover:underline transition-colors">
                Forgot password?
              </a>
            </div>
          </form>)}

          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              {activeTab === "customer" ? <>Don't have an account?{" "}<a href="/signup" className="font-semibold text-primary hover:underline transition-colors">Sign Up</a></> : "Admin accounts are provisioned securely."}
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
