"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";

import { AuthResponse } from "@/lib/types";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit?: (data: AuthResponse) => void;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    // Only allow relative paths to prevent open redirect vulnerabilities
    if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
      setRedirectPath(redirect);
    }
  }, []);
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const finalValue = name === "email" ? value.trim() : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint =
        type === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload =
        type === "login"
          ? { email: formData.email.trim(), password: formData.password }
          : {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `${type} failed`);
      }

      // ── Persist credentials ─────────────────────────────────────────────
      if (!data.token) throw new Error("No token received from server.");

      // Always pull a clean user object — never store the raw API response
      const cleanUser = data.user ?? { email: data.email };
      authLogin(cleanUser, data.token);
      if (data.userId) localStorage.setItem("userId", data.userId);
      // ────────────────────────────────────────────────────────────────────

      setSuccess(
        data.message || `${type === "login" ? "Login" : "Sign up"} successful!`,
      );

      // Pure notification callback — caller must NOT mutate localStorage
      onSubmit?.(data);

      // Redirect
      setTimeout(() => {
        const role = data?.user?.role;
        let dest = type === "login" ? "/" : "/onboarding";
        if (role === "admin") dest = "/admin";
        else if (redirectPath) dest = redirectPath;
        // Use router.push for SPA navigation; fall back to hard redirect if it hangs
        router.push(dest);
        // Hard fallback – fires after 600 ms if router.push didn't navigate
        setTimeout(() => { window.location.href = dest; }, 600);
      }, 400);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : `${type} failed. Please try again.`;
      setError(errorMessage);
      console.error(`${type} error:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignup = type === "signup";
  const isFormValid = isSignup
    ? formData.fullName.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword
    : formData.email.trim() && formData.password;

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignup && (
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type={isSignup ? "email" : "text"}
              placeholder={isSignup ? "you@example.com" : "Email or username"}
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isSignup && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
          </div>
        )}

        {!isSignup && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border cursor-pointer"
              />
              <span className="text-foreground">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : isSignup ? "Create Account" : "Sign In"}
        </Button>

      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link
              href={redirectPath ? `/login?redirect=${redirectPath}` : "/login"}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link
              href={redirectPath ? `/signup?redirect=${redirectPath}` : "/signup"}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
