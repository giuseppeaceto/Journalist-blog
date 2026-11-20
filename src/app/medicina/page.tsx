import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Dna,
  HeartHandshake,
  MapPinned,
  Microscope,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { PostCard } from "@/components/post-card";
import { specialtyIcons } from "@/lib/site-content";
import { medicineRubrics, specialties } from "@/lib/specialties";
import { getPostsByCategorySlug } from "@/lib/wordpress";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Medicina e ricerca",
  description:
    "Interviste a medici, ricercatori e specialisti: prevenzione, cura e innovazione raccontate da Nadia Clementi.",
};

const rubricIcons: Record<string, typeof Stethoscope> = {
  "interviste-ai-medici": Stethoscope,
  ricerca: Microscope,
  "storie-di-malati": HeartHandshake,
  biotecnologie: Dna,
};

export default async function MedicinaPage() {
  const medicalData = await getPostsByCategorySlug("interviste-ai-medici", 1, 4);
  const medicalPosts = medicalData?.posts ?? [];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:pb-20 sm:pt-32">
      {/* Testata editoriale */}
      <BackButton href="/" label="Indietro" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        Divulgazione e ricerca scientifica
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
        Medicina e ricerca
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        La sanità raccontata attraverso le persone: conversazioni con primari, ricercatori e
        specialisti che ogni giorno lavorano per la cura, l’innovazione e la prevenzione.
      </p>

      {/* Banner in primo piano: La Mappa delle voci */}
      <section className="mt-10 overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-br from-card via-card to-paper shadow-sm lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="p-6 sm:p-8 lg:p-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <MapPinned className="size-3.5" aria-hidden />
            Geografia editoriale interattiva
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            La Mappa delle voci mediche
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Oltre 100 specialisti, primari e centri di ricerca in tutta Italia raccontati nelle
            interviste di Nadia Clementi. Esplora le voci per struttura sanitaria, regione e disciplina.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/medicina/mappa"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent/90"
            >
              Apri la Mappa delle voci
              <ArrowRight className="size-4" />
            </Link>
            <span className="text-xs font-medium text-muted">
              100+ specialisti censiti in Italia
            </span>
          </div>
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-line lg:aspect-auto lg:h-full lg:min-h-[290px]">
          <Image
            src="/medicina-sala-operatoria.jpg"
            alt="Due medici in sala operatoria durante un intervento"
            fill
            sizes="(max-width: 1024px) 100vw, 440px"
            className="object-cover transition duration-500 hover:scale-[1.03]"
          />
        </div>
      </section>

      {/* Ultime interviste ai medici */}
      {medicalPosts.length > 0 ? (
        <section className="mt-14 sm:mt-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                In primo piano
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Ultime interviste ai medici
              </h2>
            </div>
            <Link
              href="/rubrica/interviste-ai-medici"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Tutte le interviste
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {medicalPosts.map((post) => (
              <div key={post.id} className="h-full">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Aree cliniche e specialità */}
      <section className="mt-14 sm:mt-16 border-t border-line/80 pt-10 sm:pt-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Aree cliniche
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Specialità mediche
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Esplora gli articoli e le interviste suddivisi per ambito specialistico.
          </p>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((item) => {
            const Icon = specialtyIcons[item.slug] ?? Sparkles;
            return (
              <li key={item.slug}>
                <Link
                  href={`/medicina/${item.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line/80 bg-card/90 p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-card"
                >
                  <div>
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent transition group-hover:scale-110">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-3.5 font-display text-xl font-semibold tracking-tight text-ink group-hover:text-accent">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent">
                    Esplora articoli
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Percorsi tematici (Rubriche) */}
      <section className="mt-14 sm:mt-16 border-t border-line/80 pt-10 sm:pt-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Percorsi tematici
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Le rubriche di medicina
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            I diversi formati narrativi con cui raccontiamo la ricerca, i reparti e le storie dei pazienti.
          </p>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {medicineRubrics.map((item) => {
            const Icon = rubricIcons[item.slug] ?? Stethoscope;
            return (
              <li key={item.slug}>
                <Link
                  href={`/rubrica/${item.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line/80 bg-card/90 p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-card"
                >
                  <div>
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent transition group-hover:scale-110">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-3.5 font-display text-xl font-semibold tracking-tight text-ink group-hover:text-accent">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent">
                    Vai alla rubrica
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
