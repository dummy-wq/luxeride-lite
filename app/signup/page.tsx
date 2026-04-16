"use client";

import { AuthForm } from "@/components/auth-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/template/config";
import Image from "next/image";

export default function SignupPage() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden">
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
        {/* Top Bar: Back + Logo */}
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl group transition-smooth">
            {siteConfig.brand.customLogo && (
              <div className="relative w-6 h-6 group-hover:scale-105 transition-smooth">
                <Image
                  src={siteConfig.brand.customLogo}
                  alt={`${siteConfig.brand.name} Logo`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <span className="text-foreground tracking-tight">{siteConfig.brand.name}</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join {siteConfig.brand.name} to book premium vehicles
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 shadow-lg">
          <AuthForm type="signup" />
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms-and-privacy" target="_blank" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/terms-and-privacy" target="_blank" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
