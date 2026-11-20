import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeEditorialCard } from "@/components/home-editorial-card";
import { HomeHero } from "@/components/home-hero";
import { HomeMedicineFocus } from "@/components/home-medicine-focus";
import { HomeSectionNav } from "@/components/home-section-nav";
import { PostCard } from "@/components/post-card";
import { SpotlightFeatures } from "@/components/spotlight-features";
import { encounter } from "@/lib/site-content";
import { getCategoryBySlug, getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Voci dal Mondo",
  description:
    "Dai progressi della medicina alle storie di vita quotidiana: incontri con specialisti, approfondimenti clinici e racconti sul nostro presente. Il rigore della divulgazione unito alla forza delle parole.",
};

export default async function HomePage() {
  const thoughtsCategory = await getCategoryBySlug("pensieri");
  // 6 articoli distinti: i primi 2 in primo piano, i successivi 4 nella riga "Altre interviste"
  const latest = await getPosts({ perPage: 6, categoriesExclude: thoughtsCategory?.id });

  const focusStory = latest.posts[0];
  const secondStory = latest.posts[1];
  const otherInterviews = latest.posts.slice(2, 6);

  return (
    <div>
      <HomeHero />
      <HomeSectionNav />

      {/* In primo piano: asimmetrico (sinistra più largo, destra penultimo articolo) */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
        <div className="flex items-center gap-4">
          <h2 className="shrink-0 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            In primo piano
          </h2>
          <span aria-hidden className="h-px flex-1 bg-accent/60" />
        </div>
        <div className={`mt-5 grid gap-5 ${secondStory ? "lg:grid-cols-[1.45fr_1fr]" : "grid-cols-1"} items-stretch`}>
          {focusStory ? (
            <div className="h-full">
              <HomeEditorialCard
                title={focusStory.title}
                description={focusStory.excerpt}
                href={`/articolo/${focusStory.slug}`}
                action="Leggi l'articolo"
                image={focusStory.image}
                imageAlt={focusStory.imageAlt}
                layout="horizontal"
              />
            </div>
          ) : null}
          {secondStory ? (
            <div className="h-full">
              <HomeEditorialCard
                title={secondStory.title}
                description={secondStory.excerpt}
                href={`/articolo/${secondStory.slug}`}
                action="Leggi l'articolo"
                image={secondStory.image}
                imageAlt={secondStory.imageAlt}
                layout="horizontal"
              />
            </div>
          ) : null}
        </div>
      </section>

      <HomeMedicineFocus />

      {/* Altre interviste: 4 card su una riga per desktop, senza doppioni */}
      {otherInterviews.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 pb-8 pt-4 sm:pb-10 sm:pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <h2 className="shrink-0 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Altre interviste
              </h2>
              <span aria-hidden className="h-px flex-1 bg-accent/60 hidden sm:block" />
            </div>
            <Link
              href="/articoli"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Tutte le interviste
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherInterviews.map((post) => (
              <li key={post.id} className="h-full">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Temi da esplorare */}
      <section className="border-y border-line/80 bg-white/50">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
          <div className="flex items-center gap-4">
            <h2 className="shrink-0 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Temi da esplorare
            </h2>
            <Link
              href="/articoli"
              className="ml-auto inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Tutti gli articoli
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <li>
              <HomeEditorialCard
                title="Cultura e società"
                description="Teatro, libri, arte e attualità: storie e idee che raccontano la cultura e la società."
                href="/rubrica/cultura"
                action="Leggi gli articoli"
                image="/Cover/teatro.jpg"
                imageAlt="La platea e i palchi rossi di un teatro storico"
              />
            </li>
            <li>
              <HomeEditorialCard
                title="Storie e protagonisti"
                description="Incontri con persone, associazioni e comunità che fanno la differenza ogni giorno."
                href="/articoli"
                action="Esplora gli articoli"
                image="/Cover/persone.jpg"
                imageAlt="Due persone si tendono la mano in un gesto di vicinanza"
              />
            </li>
            <li>
              <HomeEditorialCard
                title="Viaggi"
                description="Luoghi, tradizioni e incontri per scoprire il mondo attraverso le storie di chi lo vive."
                href="/rubrica/viaggi"
                action="Leggi i reportage"
                image="/Cover/viaggi.jpg"
                imageAlt="Una figura con un copricapo decorato durante una festa tradizionale"
              />
            </li>
          </ul>
        </div>
      </section>

      <SpotlightFeatures />

      {/* Sezione Chi sono & L'incontro con Piero Angela */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <div className="overflow-hidden rounded-3xl border border-line/80 bg-card/90 shadow-sm">
          <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Chi sono · La mia ispirazione
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                {encounter.title}
              </h2>
              <blockquote className="mt-4 border-l-2 border-accent/60 pl-4 font-display text-lg italic leading-relaxed text-ink/85 sm:text-xl">
                «La verità è un bene prezioso che va custodito e condiviso: ogni domanda è il primo passo verso una comprensione più profonda.»
              </blockquote>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                {encounter.text}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/chi-sono"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent/90"
                >
                  Scopri la mia storia
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/articoli?q=Piero%20Angela"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  Leggi l'articolo sull'incontro
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-line lg:aspect-auto lg:h-full lg:min-h-[380px]">
              <Image
                src={encounter.image}
                alt={encounter.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-center transition duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent-deep text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl font-display text-lg italic leading-snug text-white/85 sm:text-xl">
            Per collaborazioni, interviste, proposte editoriali e segnalazioni.
          </p>
          <Link
            href="/contatti"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-white hover:text-accent-deep"
          >
            Contattami
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
