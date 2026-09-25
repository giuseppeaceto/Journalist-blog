import Link from "next/link";
import { sitePaths } from "@/lib/site-content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="group">
          <p className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Nadia Clementi
          </p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.24em] text-muted">
            Giornalista
          </p>
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {sitePaths.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-ink/75 transition hover:bg-white hover:text-accent"
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
