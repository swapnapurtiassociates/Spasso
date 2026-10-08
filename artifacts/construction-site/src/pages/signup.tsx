import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthPortalFrame } from "@/components/auth/AuthPortalFrame";
import { dashboardPathForRole, useAuth } from "@workspace/replit-auth-web";
import { validatePassword, validatePhone, COUNTRY_CODES } from "@/lib/validation";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) setLocation(dashboardPathForRole(user.role));
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
      role: "customer",
    });
    setSubmitting(false);

    if (!result.success) {
      setGlobalError(result.message || "Signup failed");
      return;
    }

    if (result.user) setLocation(dashboardPathForRole(result.user.role));
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
      mode="signup"
      title="Create Account"
      subtitle="Join Swapnapurti Associates as a customer."
    >
      <div className="mb-5 rounded-full bg-[#f0f3ff] px-4 py-2 text-center text-sm font-semibold text-[#536bd7]">
        Customer account
      </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input name="firstName" placeholder="First Name" value={formData.firstName}
                  onChange={handleChange}
                  className={`bg-white border h-11 rounded-full px-4 text-sm text-[#111827] placeholder:text-[#8790a0] focus-visible:ring-[#617df4] ${errors.firstName ? "border-red-400" : "border-[#c9ccd3]"}`} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Input name="lastName" placeholder="Last Name" value={formData.lastName}
                  onChange={handleChange}
                  className={`bg-white border h-11 rounded-full px-4 text-sm text-[#111827] placeholder:text-[#8790a0] focus-visible:ring-[#617df4] ${errors.lastName ? "border-red-400" : "border-[#c9ccd3]"}`} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <Input type="email" name="email" placeholder="Email Address" value={formData.email}
                onChange={handleChange}
                className={`bg-white border h-11 rounded-full px-4 text-sm text-[#111827] placeholder:text-[#8790a0] focus-visible:ring-[#617df4] ${errors.email ? "border-red-400" : "border-[#c9ccd3]"}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone with country code */}
            <div>
              <div className="flex gap-2">
                <select name="countryCode" value={formData.countryCode} onChange={handleChange}
                  className="w-36 shrink-0 rounded-full border border-[#c9ccd3] bg-white px-3 text-sm text-[#111827] focus:outline-none focus:border-[#617df4]">
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <div className="flex-1">
                  <Input name="phone" placeholder="10-digit number" value={formData.phone}
                    onChange={handleChange} inputMode="numeric" maxLength={10}
                    className={`bg-white border h-11 rounded-full px-4 text-sm text-[#111827] placeholder:text-[#8790a0] focus-visible:ring-[#617df4] w-full ${errors.phone ? "border-red-400" : "border-[#c9ccd3]"}`} />
                </div>
              </div>
              {errors.phone
                ? <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                : <p className="text-[#a89f8f] text-xs mt-1">{formData.phone.length}/10 digits</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Input name="password" type={showPassword ? "text" : "password"}
                  placeholder="Password (min 8 chars + symbol)" value={formData.password}
                  onChange={handleChange}
                  className={`bg-white border h-11 rounded-full px-4 pr-10 text-sm text-[#111827] placeholder:text-[#8790a0] focus-visible:ring-[#617df4] ${errors.password ? "border-red-400" : "border-[#c9ccd3]"}`} />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#647084]">
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
                  className={`bg-white border h-11 rounded-full px-4 pr-10 text-sm text-[#111827] placeholder:text-[#8790a0] focus-visible:ring-[#617df4] ${errors.confirmPassword ? "border-red-400" : "border-[#c9ccd3]"}`} />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#647084]">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {globalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {globalError}
              </div>
            )}

            <Button type="submit" disabled={submitting}
              className="mt-2 h-11 w-full rounded-full bg-[#617df4] text-base font-semibold text-white hover:bg-[#4f68d9]">
              {submitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 border-t border-[#e7e9ef] pt-5 text-center">
            <p className="text-sm text-[#647084]">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-[#617df4] hover:underline">
                Sign In
              </a>
            </p>
          </div>
    </AuthPortalFrame>
  );
}
