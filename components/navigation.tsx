"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useAuth } from "@/lib/context/auth-context";
import { siteConfig } from "@/template/config";

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const hideNav = () => {
      setIsVisible(false);
    };

    const resetIdleTimer = () => {
      clearTimeout(timeoutId);
      if (isVisible) {
        timeoutId = setTimeout(hideNav, 10000);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 100) {
        if (!isVisible) setIsVisible(true);
      }
      if (isVisible) {
        resetIdleTimer();
      }
    };

    const handleScroll = () => {
      if (!isVisible) {
        setIsVisible(true);
      }
      resetIdleTimer();
    };

    timeoutId = setTimeout(hideNav, 10000);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isVisible]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border transition-all duration-300 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-black text-2xl group transition-all duration-150">
            {siteConfig.brand.customLogo && (
              <div className="relative w-7 h-7 group-hover:scale-110 transition-transform duration-150">
                <Image
                  src={siteConfig.brand.customLogo}
                  alt={`${siteConfig.brand.name} Logo`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <span className="text-foreground font-heading tracking-tight">
              {siteConfig.brand.name}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {siteConfig.navigation.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors duration-100 ease-out"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-primary font-bold hover:text-primary/80 transition-colors duration-100 ease-out"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                  title="Profile"
                  asChild
                >
                  <Link href="/profile">
                    <User className="w-5 h-5" />
                  </Link>
                </Button>
                {pathname !== "/profile" && (
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-foreground"
                  >
                    Logout
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-primary hover:bg-primary/90" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border space-y-3 animate-in fade-in slide-in-from-top-2">
            {siteConfig.navigation.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-2 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors duration-100 ease-out"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-2 py-2 text-primary font-bold hover:bg-primary/10 rounded transition-colors duration-100 ease-out"
              >
                ⚡ Admin Panel
              </Link>
            )}
            <div className="pt-2 space-y-2">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 bg-primary/5 text-primary hover:!bg-primary/15"
                    asChild
                  >
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full text-foreground hover:!text-primary hover:!bg-primary/10"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}