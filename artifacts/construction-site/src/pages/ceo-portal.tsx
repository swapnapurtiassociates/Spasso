import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { dashboardPathForRole, useAuth } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

/**
 * Hidden executive login. Not linked anywhere in the public navigation.
 * Requires email + password + a secret CEO access code (set on the server
 * via the CEO_ACCESS_CODE environment variable).
 */
export default function CeoPortal() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, ceoLogin, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "", accessCode: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "ceo") {
      setLocation(dashboardPathForRole("ceo"));
    }
  }, [isAuthenticated, user, setLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.accessCode) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    const result = await ceoLogin(formData.email, formData.password, formData.accessCode);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message || "Invalid credentials");
      return;
    }

    setLocation(dashboardPathForRole("ceo"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1c1a16]">
        <div className="h-12 w-12 bg-[#b88f34] rounded-sm animate-pulse flex items-center justify-center">
          <span className="text-white font-serif font-bold text-2xl">S</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuthBackground variant="dark" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#27241d]/90 backdrop-blur-md border border-[#3a352b] p-8 md:p-12 rounded-4xl shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
        >
          <div className="flex justify-center mb-8">
            <div className="h-12 w-12 bg-[#b88f34] rounded-sm flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-white" size={26} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold tracking-tight mb-2 text-white">Executive Access</h2>
            <p className="text-[#a89f8f]">Restricted area. Authorized personnel only.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#1c1a16] border border-[#3a352b] text-white placeholder:text-[#7a7263] rounded-lg h-12 focus:border-[#b88f34] focus:ring-[#b88f34]"
              data-testid="input-ceo-email"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-[#1c1a16] border border-[#3a352b] text-white placeholder:text-[#7a7263] rounded-lg h-12 focus:border-[#b88f34] focus:ring-[#b88f34]"
              data-testid="input-ceo-password"
            />

            <Input
              type="password"
              name="accessCode"
              placeholder="Access Code"
              value={formData.accessCode}
              onChange={handleChange}
              className="bg-[#1c1a16] border border-[#3a352b] text-white placeholder:text-[#7a7263] rounded-lg h-12 focus:border-[#b88f34] focus:ring-[#b88f34]"
              data-testid="input-ceo-accesscode"
            />

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-full text-base uppercase tracking-widest font-bold bg-[#b88f34] hover:bg-[#a6792b] text-white transition-colors"
              disabled={submitting}
              data-testid="button-ceo-signin"
            >
              {submitting ? "Verifying..." : "Enter Portal"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
