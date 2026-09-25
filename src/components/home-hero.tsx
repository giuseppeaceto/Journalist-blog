import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_18%_35%,rgba(255,255,255,0.35),transparent_60%),radial-gradient(ellipse_55%_70%_at_88%_70%,rgba(253,186,116,0.45),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent"
      />

      <div className="relative mx-auto grid max-w-6xl items-end gap-6 px-5 pb-0 pt-28 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-24">
        <div className="relative z-20 max-w-xl pb-10 sm:pb-12 lg:pb-16">
          <h1 className="animate-rise font-display text-4xl font-semibold leading-[0.92] tracking-tight text-ink sm:text-5xl xl:text-6xl">
            Voci dal Mondo
          </h1>
          <p className="animate-rise-delay mt-4 max-w-md text-base leading-relaxed text-ink/75 sm:text-lg">
            Racconti, interviste e sguardi curiosi sul mondo. Per chi ama le domande giuste, le
            storie autentiche e le prospettive che sorprendono.
          </p>
          <div className="animate-rise-delay mt-6 flex flex-wrap gap-3">
            <Link
              href="/rubrica/pensieri"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-deep"
            >
              Leggi i pensieri
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/chi-sono"
              className="inline-flex items-center gap-2 rounded-full border border-ink/25 bg-white/45 px-5 py-2.5 text-sm font-medium text-ink backdrop-blur transition hover:bg-white/75"
            >
              Chi sono
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-md pb-2 lg:max-w-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nadia-cutout.png?v=6"
            alt="Nadia Clementi, giornalista"
            width={1164}
            height={1104}
            className="relative mx-auto h-auto w-full max-w-[480px] lg:max-w-[520px]"
          />
        </div>
      </div>
    </section>
  );
}
