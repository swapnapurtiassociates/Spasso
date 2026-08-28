import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { dashboardPathForRole, useAuth } from "@workspace/replit-auth-web";
import { validatePassword, validatePhone, COUNTRY_CODES } from "@/lib/validation";
import { motion } from "framer-motion";
import { Briefcase, HardHat, User, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const ROLES = [
  { id: "customer", label: "Customer", icon: User },
  { id: "engineer", label: "Engineer", icon: HardHat },
  { id: "admin", label: "Admin", icon: Briefcase },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

function PasswordStrengthHint({ password }: { password: string }) {
  const hasLength = password.length >= 8;
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password);

  if (!password) return null;
  return (
    <div className="space-y-1 mt-1">
      <div className={`flex items-center gap-1.5 text-xs ${hasLength ? "text-green-600" : "text-red-500"}`}>
        {hasLength ? <CheckCircle size={12} /> : <XCircle size={12} />}
        At least 8 characters
      </div>
      <div className={`flex items-center gap-1.5 text-xs ${hasSymbol ? "text-green-600" : "text-red-500"}`}>
        {hasSymbol ? <CheckCircle size={12} /> : <XCircle size={12} />}
        At least one symbol (# ! @ $ % &)
      </div>
    </div>
  );
}

export default function Signup() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, signup, isLoading } = useAuth();
  const [role, setRole] = useState<RoleId>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
    confirmPassword: "",
    staffAccessCode: "",
    specialization: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) setLocation("/");
  }, [isAuthenticated, user, setLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Phone: only allow digits, max 10
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((p) => ({ ...p, phone: digits }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }

    setErrors((p) => ({ ...p, [name]: "" }));
    setGlobalError("");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    if (!formData.confirmPassword) newErrors.confirmPassword = "Required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if ((role === "engineer" || role === "admin") && !formData.staffAccessCode)
      newErrors.staffAccessCode = "Staff access code is required for this role";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const result = await signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      countryCode: formData.countryCode,
      password: formData.password,
      role,
      staffAccessCode: formData.staffAccessCode || undefined,
      specialization: role === "engineer" ? formData.specialization : undefined,
    } as any);
    setSubmitting(false);

    if (!result.success) {
      setGlobalError(result.message || "Signup failed");
      return;
    }

    // After successful signup, go directly to home page
    setLocation("/");
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
          className="bg-white/90 backdrop-blur-md border border-[#e8dcc6] p-8 md:p-10 rounded-4xl shadow-[0_30px_80px_rgba(0,0,0,0.12)]"
        >
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-[#b88f34] rounded-sm flex items-center justify-center shadow-lg">
              <span className="text-white font-serif font-bold text-3xl">S</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif font-bold tracking-tight mb-1 text-[#1c1a16]">Create Account</h2>
            <p className="text-[#4e473d] text-sm">Join Swapnapurti Associates today</p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6 bg-[#f7f2e8] p-1 rounded-full">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <button key={r.id} type="button"
                  onClick={() => { setRole(r.id); setGlobalError(""); setErrors({}); }}
                  className={`flex flex-col items-center gap-1 py-2 px-2 rounded-full text-xs font-semibold transition-colors ${
                    role === r.id ? "bg-[#b88f34] text-white" : "text-[#4e473d] hover:text-[#1c1a16]"
                  }`}>
                  <Icon size={16} />
                  {r.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input name="firstName" placeholder="First Name" value={formData.firstName}
                  onChange={handleChange}
                  className={`bg-white border h-11 rounded-lg focus:border-[#b88f34] focus:ring-[#b88f34] ${errors.firstName ? "border-red-400" : "border-[#e8dcc6]"}`} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Input name="lastName" placeholder="Last Name" value={formData.lastName}
                  onChange={handleChange}
                  className={`bg-white border h-11 rounded-lg focus:border-[#b88f34] focus:ring-[#b88f34] ${errors.lastName ? "border-red-400" : "border-[#e8dcc6]"}`} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <Input type="email" name="email" placeholder="Email Address" value={formData.email}
                onChange={handleChange}
                className={`bg-white border h-11 rounded-lg focus:border-[#b88f34] ${errors.email ? "border-red-400" : "border-[#e8dcc6]"}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone with country code */}
            <div>
              <div className="flex gap-2">
                <select name="countryCode" value={formData.countryCode} onChange={handleChange}
                  className="bg-white border border-[#e8dcc6] rounded-lg h-11 px-2 text-sm text-[#1c1a16] focus:outline-none focus:border-[#b88f34] shrink-0 w-36">
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <div className="flex-1">
                  <Input name="phone" placeholder="10-digit number" value={formData.phone}
                    onChange={handleChange} inputMode="numeric" maxLength={10}
                    className={`bg-white border h-11 rounded-lg focus:border-[#b88f34] w-full ${errors.phone ? "border-red-400" : "border-[#e8dcc6]"}`} />
                </div>
              </div>
              {errors.phone
                ? <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                : <p className="text-[#a89f8f] text-xs mt-1">{formData.phone.length}/10 digits</p>}
            </div>

            {/* Specialization for engineer */}
            {role === "engineer" && (
              <Input name="specialization" placeholder="Specialization (e.g. Structural, MEP)"
                value={formData.specialization} onChange={handleChange}
                className="bg-white border border-[#e8dcc6] h-11 rounded-lg focus:border-[#b88f34]" />
            )}

            {/* Password */}
            <div>
              <div className="relative">
                <Input name="password" type={showPassword ? "text" : "password"}
                  placeholder="Password (min 8 chars + symbol)" value={formData.password}
                  onChange={handleChange}
                  className={`bg-white border h-11 rounded-lg pr-10 focus:border-[#b88f34] ${errors.password ? "border-red-400" : "border-[#e8dcc6]"}`} />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89f8f]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password
                ? <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                : <PasswordStrengthHint password={formData.password} />}
            </div>

            {/* Confirm password */}
            <div>
              <div className="relative">
                <Input name="confirmPassword" type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password" value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`bg-white border h-11 rounded-lg pr-10 focus:border-[#b88f34] ${errors.confirmPassword ? "border-red-400" : "border-[#e8dcc6]"}`} />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89f8f]">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Staff access code */}
            {(role === "engineer" || role === "admin") && (
              <div>
                <Input type="password" name="staffAccessCode" placeholder="Staff Access Code"
                  value={formData.staffAccessCode} onChange={handleChange}
                  className={`bg-white border h-11 rounded-lg focus:border-[#b88f34] ${errors.staffAccessCode ? "border-red-400" : "border-[#e8dcc6]"}`} />
                {errors.staffAccessCode && <p className="text-red-500 text-xs mt-1">{errors.staffAccessCode}</p>}
              </div>
            )}

            {globalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {globalError}
              </div>
            )}

            <Button type="submit" disabled={submitting}
              className="w-full h-12 rounded-full text-base uppercase tracking-widest font-bold bg-[#b88f34] hover:bg-[#a6792b] text-white transition-colors mt-2">
              {submitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-[#e8dcc6] pt-5">
            <p className="text-sm text-[#4e473d]">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-[#b88f34] hover:text-[#a6792b] transition-colors">
                Sign In
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
