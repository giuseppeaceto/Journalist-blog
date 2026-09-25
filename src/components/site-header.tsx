"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { sitePaths } from "@/lib/site-content";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`pointer-events-auto mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 transition duration-300 sm:px-5 ${
          scrolled
            ? "border border-line/80 bg-white/90 shadow-[0_10px_40px_-18px_rgba(11,18,32,0.35)] backdrop-blur-xl"
            : "border border-black/5 bg-white/45 shadow-[0_8px_30px_-20px_rgba(11,18,32,0.4)] backdrop-blur-md"
        }`}
      >
        <Link href="/" className="group min-w-0">
          <p className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Nadia Clementi
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-ink/55">
            Giornalista
          </p>
        </Link>
        <nav className="flex flex-wrap gap-0.5 text-sm">
          {sitePaths.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-ink/75 transition hover:bg-white/80 hover:text-accent sm:px-3"
              >
                <Icon className="size-3.5 opacity-70" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
