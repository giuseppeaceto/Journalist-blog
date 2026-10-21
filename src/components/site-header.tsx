"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { sitePaths } from "@/lib/site-content";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on page navigation
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Close mobile menu on escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`pointer-events-auto mx-auto max-w-6xl rounded-2xl transition duration-300 ${
          scrolled || mobileOpen
            ? "border border-line/80 bg-white/95 shadow-[0_12px_40px_-18px_rgba(11,18,32,0.35)] backdrop-blur-xl"
            : "border border-black/5 bg-white/70 shadow-[0_8px_30px_-20px_rgba(11,18,32,0.4)] backdrop-blur-md"
        } px-4 py-2.5 sm:px-5 sm:py-3`}
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="group min-w-0"
          >
            <p className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Nadia Clementi
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-ink/55">
              Giornalista
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {sitePaths.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
                    isActive
                      ? "bg-white font-medium text-accent shadow-xs"
                      : "text-ink/75 hover:bg-white/80 hover:text-accent"
                  }`}
                >
                  <Icon className="size-3.5 opacity-70" aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            className="inline-flex md:hidden size-9 items-center justify-center rounded-xl border border-black/5 bg-white/60 text-ink transition hover:bg-white active:scale-95"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileOpen && (
          <nav className="mt-3 divide-y divide-line/60 border-t border-line/60 pt-2 md:hidden">
            {sitePaths.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-base transition ${
                    isActive
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-ink/80 hover:bg-black/5 hover:text-accent"
                  }`}
                >
                  <span
                    className={`inline-flex size-8 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-accent text-white"
                        : "bg-black/5 text-ink/70"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
