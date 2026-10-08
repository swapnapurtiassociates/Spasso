import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthPortalFrame } from "@/components/auth/AuthPortalFrame";
import { dashboardPathForRole, useAuth, type UserRole } from "@workspace/replit-auth-web";
import { Briefcase, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

type Tab = Extract<UserRole, "customer" | "admin">;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: {
            theme: "outline";
            size: "large";
            shape: "pill";
            text: "continue_with";
            width: number;
            logo_alignment: "left";
          }) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "customer", label: "Customer", icon: User },
  { id: "admin", label: "Admin", icon: Briefcase },
];

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, loginWithEmail, loginWithGoogle, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("customer");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab !== "customer" || !GOOGLE_CLIENT_ID || !googleButtonRef.current) return;

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          setSubmitting(true);
          setError("");
          const result = await loginWithGoogle(credential);
          setSubmitting(false);

          if (!result.success || !result.user) {
            setError(result.message || "Google sign-in failed");
            return;
          }

          setLocation(dashboardPathForRole(result.user.role));
        },
      });
      googleButtonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: Math.min(360, Math.floor(googleButtonRef.current.getBoundingClientRect().width)),
        logo_alignment: "left",
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.getElementById("google-identity-services");
    const script = existingScript instanceof HTMLScriptElement ? existingScript : document.createElement("script");
    if (!existingScript) {
      script.id = "google-identity-services";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", renderGoogleButton);
    return () => script.removeEventListener("load", renderGoogleButton);
  }, [activeTab, loginWithGoogle, setLocation]);

  // Show a session-expired banner when redirected from inactivity logout
  const params = new URLSearchParams(window.location.search);
  const sessionMsg = params.get("reason") === "inactive"
    ? "Your session expired due to inactivity. Please sign in again."
    : params.get("reason") === "elsewhere"
    ? "Your account was signed in from another device."
    : "";

  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation(dashboardPathForRole(user.role));
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
    const result = await loginWithEmail(formData.email, formData.password, activeTab);
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-pulse rounded-full bg-[#617df4]" />
      </div>
    );
  }

  return (
    <AuthPortalFrame
      mode="login"
      title="Welcome Back!"
      subtitle="Sign in to continue to your account."
    >
      <div className="mb-7 grid grid-cols-2 rounded-full bg-[#f0f3ff] p-1">
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
              className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-[#617df4] text-white shadow-sm"
                  : "text-[#4c5871] hover:bg-white"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <Icon size={17} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {sessionMsg && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            {sessionMsg}
          </div>
        )}
        <label className="block space-y-2 text-sm font-semibold text-[#111827]">
          Email Address
          <Input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="h-11 rounded-full border-[#c9ccd3] bg-white px-4 text-sm text-[#111827] placeholder:text-[#8790a0] focus-visible:ring-[#617df4]"
            data-testid="input-email"
          />
        </label>

        <label className="block space-y-2 text-sm font-semibold text-[#111827]">
          Password
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="h-11 rounded-full border-[#c9ccd3] bg-white px-4 text-sm text-[#111827] placeholder:text-[#8790a0] focus-visible:ring-[#617df4]"
            data-testid="input-password"
          />
        </label>

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <a href="/forgot-password" className="text-sm text-[#617df4] hover:underline">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-full bg-[#617df4] text-base font-semibold text-white hover:bg-[#4f68d9]"
          disabled={submitting}
          data-testid="button-signin"
        >
          {submitting ? "Signing In..." : `Sign In as ${TABS.find((tab) => tab.id === activeTab)?.label}`}
        </Button>
      </form>

      {activeTab === "customer" && (
        <div className="mt-6">
          <div className="mb-5 flex items-center gap-3 text-xs text-[#8790a0]">
            <span className="h-px flex-1 bg-[#e7e9ef]" />
            OR CONTINUE WITH
            <span className="h-px flex-1 bg-[#e7e9ef]" />
          </div>
          {GOOGLE_CLIENT_ID ? (
            <div ref={googleButtonRef} className="flex min-h-10 justify-center" />
          ) : (
            <p className="text-center text-xs text-[#8790a0]">Google sign-in is not configured yet.</p>
          )}
        </div>
      )}

      <p className="mt-8 border-t border-[#e7e9ef] pt-6 text-center text-sm text-[#647084]">
        New to Swapnapurti?{" "}
        <a href="/signup" className="font-semibold text-[#617df4] hover:underline">
          Create a customer account
        </a>
      </p>
    </AuthPortalFrame>
  );
}
