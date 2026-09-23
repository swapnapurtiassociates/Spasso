import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

export default function ResetPassword() {
  const [location, setLocation] = useLocation();
  const token = new URLSearchParams(location.split("?")[1] || "").get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!token) return setError("This reset link is missing or invalid.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) return setError(data?.message || "Unable to reset your password.");
      setMessage(data?.message || "Password updated successfully.");
      setTimeout(() => setLocation("/login"), 1200);
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-28 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <KeyRound size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Account security</p>
            <h1 className="text-3xl font-semibold">Create a new password</h1>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
          {message ? (
            <div className="space-y-4">
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>
              <Link href="/login" className="inline-block text-sm font-semibold text-primary hover:underline">Return to sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm leading-6 text-muted-foreground">Use at least 8 characters and include a symbol.</p>
              <div className="relative">
                <Input required minLength={8} maxLength={64} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="h-12 pr-11" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              <Input required minLength={8} maxLength={64} type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" className="h-12" />
              {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <Button type="submit" disabled={isLoading} className="h-12 w-full">{isLoading ? "Updating..." : "Update password"}</Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}