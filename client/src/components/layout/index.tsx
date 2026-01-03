import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, BarChart3, CheckCircle, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/status", label: "Check Status" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <a className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
              <BarChart3 className="h-6 w-6" />
              <span>SubmitMyURL</span>
            </a>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
          <Link href="/submit">
            <Button size="sm" className="font-semibold">
              Submit Website
            </Button>
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="flex items-center justify-center p-2 text-muted-foreground md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="border-b bg-background md:hidden">
          <div className="container flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <Link href="/submit">
              <Button className="w-full font-semibold" onClick={() => setIsOpen(false)}>
                Submit Website
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
              <BarChart3 className="h-6 w-6" />
              <span>SubmitMyURL</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India's #1 Website Promotion Platform. Get discovered, increase traffic, and grow your business globally.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/"><a className="hover:text-primary">Home</a></Link></li>
              <li><Link href="/submit"><a className="hover:text-primary">Submit Website</a></Link></li>
              <li><Link href="/status"><a className="hover:text-primary">Check Status</a></Link></li>
              <li><Link href="/dashboard"><a className="hover:text-primary">Dashboard</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>submitmyurlapp@gmail.com</li>
              <li>+91-8168303202</li>
              <li>(10AM-6PM IST)</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          © 2024 SubmitMyURL.com. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
