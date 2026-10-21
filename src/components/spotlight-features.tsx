import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { award, book, encounter, registry, testimonials } from "@/lib/site-content";

export function SpotlightFeatures() {
  return (
    <>
      {/* Premio: immagine a sinistra, testo a destra */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            {award.label}
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            {/* Foto */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={award.image}
                alt={award.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover object-[center_28%]"
              />
            </div>
            {/* Testo */}
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {award.title}
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-muted">
                {award.description}
              </p>
              <Link
                href={award.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-deep"
              >
                Leggi l&apos;articolo
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pubblicazioni: stage con copertina come oggetto */}
      <section className="relative overflow-hidden bg-accent-deep text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(248,151,9,0.35),transparent_68%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="relative mx-auto w-full max-w-[260px] lg:mx-0 lg:max-w-[300px]">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hero/30 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-6 left-[8%] right-[8%] h-8 rounded-[100%] bg-black/50 blur-xl"
            />
            <div className="relative aspect-[2/3] origin-bottom rotate-[-4deg] overflow-hidden shadow-[12px_28px_60px_-12px_rgba(0,0,0,0.65)] transition duration-500 hover:rotate-[-1deg]">
              <Image
                src={book.image}
                alt={book.imageAlt}
                fill
                sizes="300px"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-glow">
              {book.subtitle}
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {book.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
              {book.description}
            </p>
            <a
              href={book.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-accent-deep transition hover:bg-glow"
            >
              Scopri di più
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Albo + incontro: due blocchi con foto integrate */}
      <section className="border-t border-line/80">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="relative overflow-hidden bg-accent px-5 py-12 text-white sm:px-8 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-10 size-64 rounded-full bg-glow/30 blur-3xl"
            />
            <p className="relative text-xs font-medium uppercase tracking-[0.22em] text-white/70">
              {registry.title}
            </p>
            <p className="relative mt-2 font-display text-6xl font-semibold tracking-tight sm:text-7xl">
              {registry.year}
            </p>
            <div className="relative mt-8 overflow-hidden bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={registry.image}
                  alt={registry.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </div>
            <blockquote className="relative mt-8 font-display text-xl leading-snug">
              <Quote className="mb-2 size-5 text-glow" aria-hidden />
              “{registry.quote}”
            </blockquote>
            <p className="relative mt-3 text-sm text-white/65">{registry.attribution}</p>
          </div>

          <div className="bg-white/50 px-5 py-12 sm:px-8 sm:py-14">
            <div className="relative aspect-[5/4] w-full overflow-hidden">
              <Image
                src={encounter.image}
                alt={encounter.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover object-top"
              />
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-accent">
              Incontri e persone
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {encounter.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {encounter.text}
            </p>
            <ul className="mt-8 space-y-4">
              {testimonials.map((item) => (
                <li key={item.attribution} className="border-t border-line pt-4">
                  <blockquote className="font-display text-base leading-snug text-ink sm:text-lg">
                    “{item.quote}”
                  </blockquote>
                  <p className="mt-2 text-sm text-muted">{item.attribution}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
