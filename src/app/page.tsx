import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Theater, Users } from "lucide-react";
import { HomeEditorialCard } from "@/components/home-editorial-card";
import { HomeHero } from "@/components/home-hero";
import { HomeMedicineFocus } from "@/components/home-medicine-focus";
import { HomeSectionNav } from "@/components/home-section-nav";
import { SpotlightFeatures } from "@/components/spotlight-features";
import { encounter } from "@/lib/site-content";
import { getCategoryBySlug, getPosts, getPostsByCategorySlug } from "@/lib/wordpress";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Voci dal Mondo",
  description:
    "Dai progressi della medicina alle storie di vita quotidiana: incontri con specialisti, approfondimenti clinici e racconti sul nostro presente. Il rigore della divulgazione unito alla forza delle parole.",
};

export default async function HomePage() {
  const thoughtsCategory = await getCategoryBySlug("pensieri");
  const [latest, medicineResult] = await Promise.all([
    getPosts({ perPage: 6, categoriesExclude: thoughtsCategory?.id }),
    getPostsByCategorySlug("medicina", 1, 1),
  ]);

  const focusStory = medicineResult?.posts[0] ?? latest.posts[0];

  return (
    <div>
      <HomeHero />
      <HomeSectionNav />
      <HomeMedicineFocus />

      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
        <div className="flex items-center gap-4">
          <h2 className="shrink-0 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            In primo piano
          </h2>
          <span aria-hidden className="h-px flex-1 bg-accent/60" />
        </div>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {focusStory ? (
            <li>
              <HomeEditorialCard
                title={focusStory.title}
                description={focusStory.excerpt}
                href={`/articolo/${focusStory.slug}`}
                action="Leggi l'articolo"
                image={focusStory.image}
                imageAlt={focusStory.imageAlt}
                icon={Theater}
                layout="horizontal"
              />
            </li>
          ) : null}
          <li>
            <HomeEditorialCard
              title={encounter.title}
              description={encounter.text}
              href="/articoli?q=Piero%20Angela"
              action="Leggi l'incontro"
              image={encounter.image}
              imageAlt={encounter.imageAlt}
              icon={Users}
              layout="horizontal"
            />
          </li>
        </ul>
      </section>

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

      <section className="bg-accent-deep text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl font-display text-lg italic leading-snug text-white/85 sm:text-xl">
            Per collaborazioni, interviste, proposte editoriali e segnalazioni.
          </p>
          <Link
            href="/contatti"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-glow"
          >
            Contattami
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
