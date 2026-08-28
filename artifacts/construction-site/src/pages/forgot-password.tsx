import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f2e8] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background architectural pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] z-0 pointer-events-none"></div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-[#e8dcc6] p-8 md:p-12 rounded-4xl shadow-[0_30px_80px_rgba(0,0,0,0.08)]"
        >
          <div className="flex justify-center mb-8">
            <div className="h-12 w-12 bg-[#b88f34] rounded-sm flex items-center justify-center shadow-lg">
              <span className="text-white font-serif font-bold text-3xl">S</span>
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold tracking-tight mb-2 text-[#1c1a16]">
              {isSubmitted ? "Check Your Email" : "Reset Password"}
            </h2>
            <p className="text-[#4e473d]">
              {isSubmitted 
                ? "We've sent you a link to reset your password" 
                : "Enter your email address and we'll send you a link to reset your password"}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="bg-white border border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#4e473d] rounded-lg h-12 focus:border-[#b88f34] focus:ring-[#b88f34]"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit"
                className="w-full h-12 rounded-full text-base uppercase tracking-widest font-bold bg-[#b88f34] hover:bg-[#a6792b] text-white transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
                Please check your email for the password reset link. It may take a few minutes to arrive.
              </div>
              <Button 
                onClick={() => window.location.href = "/login"}
                className="w-full h-12 rounded-full text-base uppercase tracking-widest font-bold bg-[#b88f34] hover:bg-[#a6792b] text-white transition-colors"
              >
                Back to Login
              </Button>
            </div>
          )}

          <div className="mt-8 text-center border-t border-[#e8dcc6] pt-6">
            <p className="text-sm text-[#4e473d]">
              Remember your password?{" "}
              <a 
                href="/login" 
                className="font-semibold text-[#b88f34] hover:text-[#a6792b] transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
