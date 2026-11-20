import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

export function HomeMedicineFocus() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-4 sm:py-6">
      <div className="grid overflow-hidden rounded-3xl border border-line/80 bg-card/80 shadow-sm lg:grid-cols-[230px_minmax(0,1fr)_300px]">
        <div className="relative aspect-[16/9] bg-glow/30 lg:aspect-auto lg:min-h-36">
          <Image
            src="/medicina-sala-operatoria.jpg"
            alt="Due medici in sala operatoria durante un intervento"
            fill
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 230px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-5 py-5 sm:px-7 lg:border-r lg:border-line">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Focus</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Medicina e ricerca
          </h2>
          <p className="mt-1 font-display text-lg italic leading-snug text-ink/80">
            La sanità raccontata dai suoi protagonisti
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Interviste a medici, ricercatori e specialisti: prevenzione, cura e innovazione viste
            attraverso le persone.
          </p>
        </div>

        <Link
          href="/medicina/mappa"
          className="group flex items-center gap-4 border-t border-line px-5 py-5 transition hover:bg-white/70 sm:px-7 lg:border-l-0 lg:border-t-0"
        >
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <MapPinned className="size-7" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-xl font-semibold leading-tight tracking-tight">
              La Mappa delle voci
            </span>
            <span className="mt-1 block text-sm leading-snug text-muted">
              Scopri medici, specialisti e istituti in Italia
            </span>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent">
              Esplora la mappa
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
