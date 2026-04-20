"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/config/icons";
import { cn } from "@/lib/cn";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/#features", label: "Features" },
];

export function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled || isMobileOpen
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs">
            {siteConfig.logoText[0]}
          </div>
          {siteConfig.name}
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground",
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/contact">
            <Button size="sm" className="rounded-full px-5">
              Get Started <Icons.chevronRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? (
            <Icons.close className="h-5 w-5" />
          ) : (
            <Icons.menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md animate-fade-in-up">
          <nav className="container mx-auto flex flex-col px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-3 mt-2 flex flex-col gap-2">
              <Link href="/login">
                <Button variant="outline" className="w-full justify-center">Sign In</Button>
              </Link>
              <Link href="/contact">
                <Button className="w-full justify-center">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
