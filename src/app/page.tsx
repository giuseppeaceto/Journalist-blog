import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote, Sparkles } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { formatDate } from "@/lib/format";
import {
  award,
  book,
  encounter,
  registry,
  specialtyIcons,
  testimonials,
  workAreas,
} from "@/lib/site-content";
import { specialties } from "@/lib/specialties";
import { getCategoryBySlug, getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Voci dal Mondo",
  description:
    "Racconti, interviste e sguardi curiosi sul mondo. Per chi ama le domande giuste, le storie autentiche e le prospettive che sorprendono.",
};

export default async function HomePage() {
  const [latest, thoughtsCategory] = await Promise.all([
    getPosts({ perPage: 6 }),
    getCategoryBySlug("pensieri"),
  ]);

  const thoughts = thoughtsCategory
    ? await getPosts({ categories: thoughtsCategory.id, perPage: 4 })
    : { posts: [] };

  const [featured, ...more] = latest.posts;
  const moreStories = more.slice(0, 5);
  const BookIcon = book.icon;
  const AwardIcon = award.icon;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line/80">
        <div className="pointer-events-none absolute -right-16 top-8 size-64 rounded-full bg-glow/40 blur-3xl animate-float" />
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p className="animate-rise text-sm font-medium uppercase tracking-[0.22em] text-accent">
            Blog personale
          </p>
          <h1 className="animate-rise mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-tight text-[#0b1220] sm:text-7xl">
            Voci dal Mondo
          </h1>
          <p className="animate-rise-delay mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            Racconti, interviste e sguardi curiosi sul mondo. Per chi ama le domande giuste, le
            storie autentiche e le prospettive che sorprendono.
          </p>
        </div>
      </section>

      {featured ? (
        <section className="mx-auto max-w-6xl px-5 py-10 sm:py-12">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">In evidenza</p>
          <div className="mt-5">
            <PostCard post={featured} featured />
          </div>
        </section>
      ) : null}

      {moreStories.length > 0 ? (
        <section className="border-y border-line/80 bg-white/50">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:py-12">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Ultimi articoli</h2>
            <ul className="mt-6 divide-y divide-line">
              {moreStories.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/articolo/${post.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-4"
                  >
                    <span>
                      <span className="font-display text-xl font-semibold tracking-tight group-hover:text-accent">
                        {post.title}
                      </span>
                      <span className="mt-1 block text-xs font-medium uppercase tracking-[0.14em] text-muted">
                        {post.categories[0]?.name ?? "Articolo"}
                      </span>
                    </span>
                    <time className="shrink-0 text-sm text-muted">{formatDate(post.date)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {thoughts.posts.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Rubrica</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Pensieri
              </h2>
              <p className="mt-2 max-w-xl text-muted">
                Riflessioni personali, incontri, viaggi e ciò che resta dopo una giornata di storie.
              </p>
            </div>
            <Link
              href="/rubrica/pensieri"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Tutti i pensieri
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {thoughts.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-accent-deep text-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-glow">Di cosa mi occupo</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Racconto il mondo con le parole, do voce alle storie che meritano di essere ascoltate.
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {workAreas.map((area) => {
              const Icon = area.icon;
              return (
                <li
                  key={area.title}
                  className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/20 text-glow">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{area.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Approfondimenti</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Medicina</h2>
            <p className="mt-2 max-w-xl text-muted">
              Interviste ai medici, ricerca e specialità: una parte importante del lavoro, non l’unica.
            </p>
          </div>
          <Link
            href="/medicina"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Esplora
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.slice(0, 4).map((item) => {
            const Icon = specialtyIcons[item.slug] ?? Sparkles;
            return (
              <li key={item.slug}>
                <Link
                  href={`/medicina/${item.slug}`}
                  className="block h-full rounded-2xl bg-card p-4 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-accent/50"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-glow/50 text-accent">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <p className="mt-3 font-display text-xl font-semibold tracking-tight">{item.name}</p>
                  <p className="mt-1 text-sm leading-snug text-muted">{item.description}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-5">
          <Link
            href="/rubrica/interviste-ai-medici"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Interviste ai medici
            <ArrowRight className="size-4" />
          </Link>
        </p>
      </section>

      <section className="border-y border-line/80 bg-white/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:py-16 lg:grid-cols-2">
          <div className="rounded-3xl bg-card p-6 ring-1 ring-line sm:p-8">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-glow/60 text-accent">
              <BookIcon className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-accent">
              {book.subtitle}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {book.title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{book.description}</p>
            <a
              href={book.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Scopri di più
              <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="rounded-3xl bg-card p-6 ring-1 ring-line sm:p-8">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-glow/60 text-accent">
              <AwardIcon className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-accent">
              {award.label}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">{award.title}</h2>
            <p className="mt-4 leading-relaxed text-muted">{award.description}</p>
            <a
              href={award.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Leggi l’articolo
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-accent-deep p-6 text-white sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-glow">
              {registry.title}
            </p>
            <p className="mt-2 font-display text-5xl font-semibold tracking-tight">{registry.year}</p>
            <blockquote className="mt-6 font-display text-xl leading-snug">
              <Quote className="mb-2 size-5 text-glow" aria-hidden />
              “{registry.quote}”
            </blockquote>
            <p className="mt-3 text-sm text-white/60">{registry.attribution}</p>
          </div>
          <div className="rounded-3xl bg-card p-6 ring-1 ring-line sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              Incontri e persone
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {encounter.title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{encounter.text}</p>
            <ul className="mt-8 space-y-5">
              {testimonials.map((item) => (
                <li key={item.attribution} className="border-t border-line pt-5">
                  <blockquote className="font-display text-lg leading-snug text-ink">
                    “{item.quote}”
                  </blockquote>
                  <p className="mt-2 text-sm text-muted">{item.attribution}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line/80 bg-accent text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:py-14">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/70">Contattami</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Scrivimi
            </h2>
            <p className="mt-3 max-w-lg text-white/80">
              Idee, domande, collaborazioni o semplicemente un saluto: ogni conversazione è
              un’opportunità per scoprire qualcosa di nuovo.
            </p>
          </div>
          <Link
            href="/contatti"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-accent-deep transition hover:bg-glow"
          >
            Vai ai contatti
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
