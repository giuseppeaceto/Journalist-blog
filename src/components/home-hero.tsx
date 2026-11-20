import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* Sfondo video di Trento ben visibile con velo di protezione per il testo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/video/trento-poster.jpg"
          className="size-full object-cover object-center opacity-85 sm:opacity-90"
        >
          <source src="/video/trento-loop.mp4" type="video/mp4" />
        </video>

        {/* Velo sfumato: scuro a sinistra sul testo, trasparente a destra per mostrare Trento e le montagne */}
        <div className="absolute inset-0 bg-gradient-to-b from-hero/90 via-hero/70 to-hero/30 sm:bg-gradient-to-r sm:from-hero/95 sm:via-hero/75 sm:via-45% sm:to-black/20" />

        {/* Glow magenta/viola morbido a destra per armonizzare il video con la palette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_75%_at_85%_65%,rgba(219,39,119,0.22),transparent_65%)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-end gap-6 px-5 pb-0 pt-36 sm:pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-28">
        <div className="relative z-20 max-w-xl pb-10 sm:pb-14 lg:pb-16">
          <h1 className="animate-rise font-display text-4xl font-semibold leading-[0.92] tracking-tight text-white sm:text-5xl xl:text-6xl">
            Parliamone
          </h1>
          <p className="animate-rise-delay mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
            Racconto persone, idee e luoghi attraverso interviste e reportage. Dalla medicina alla
            cultura, dalla società ai viaggi, con curiosità, ascolto e rigore giornalistico.
          </p>
          <div className="animate-rise-delay mt-6 flex flex-wrap gap-3">
            <Link
              href="/articoli"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink shadow-sm transition hover:bg-white/90 hover:shadow-md"
            >
              Leggi tutti gli articoli
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/chi-sono"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              Chi sono
            </Link>
          </div>
        </div>

        {/* Ritratto a figura intera visibile su schermi desktop, nascosto su mobile */}
        <div className="relative z-10 hidden w-full justify-end pb-0 lg:flex lg:max-w-none">
          <Image
            src="/nadia-cutout.png"
            alt="Nadia Clementi, giornalista"
            width={1164}
            height={1104}
            preload
            sizes="(min-width: 1280px) 460px, 420px"
            className="relative mx-auto h-auto w-auto max-h-[440px] max-w-[420px] xl:max-w-[460px] object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>
    </section>
  );
}
