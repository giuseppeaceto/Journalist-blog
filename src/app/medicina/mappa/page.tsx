import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, HeartPulse, Sparkles, Stethoscope } from "lucide-react";
import { MedicalVoicesExplorer } from "@/components/medical-voices-explorer";
import { medicalVoices } from "@/lib/medical-voices";
import { specialties } from "@/lib/specialties";

export const metadata: Metadata = {
  title: "Mappa delle voci mediche",
  description:
    "Geografia editoriale interattiva delle interviste ai medici di Nadia Clementi: oltre 100 specialisti e strutture sanitarie raccontati nei suoi articoli.",
};

export default function MedicinaMappaPage() {
  return (
    <div className="w-full pb-16 pt-20 sm:pt-24">
      {/* Preconnect al provider di tile/stile: risparmia l'handshake prima che la mappa parta. */}
      <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://tiles.openfreemap.org" />
      {/* Top Banner / Breadcrumb */}
      <div className="mx-auto max-w-6xl px-3 sm:px-5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/medicina"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent transition"
          >
            <ArrowLeft className="size-3.5" />
            <span>Medicina</span>
          </Link>
          <span className="text-line">/</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Mappa delle voci
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-muted">
          <Link href="/rubrica/interviste-ai-medici" className="hover:text-accent transition">
            Tutte le interviste
          </Link>
          <span>·</span>
          <Link href="/medicina" className="hover:text-accent transition">
            Archivio medicina
          </Link>
        </div>
      </div>

      {/* Project intro */}
      <div className="mx-auto max-w-6xl px-3 sm:px-5 mb-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Il progetto
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Una geografia delle fonti, non un elenco clinico
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted">
            Da oltre quindici anni Nadia Clementi intervista specialisti, ricercatori e primari per
            dare risposte chiare ai dubbi dei lettori. Questa mappa raccoglie i luoghi della
            ricerca e della cura da cui sono nate le storie.
          </p>
        </div>
      </div>

      {/* Main Expansive Interactive Map Canvas */}
      <div className="mx-auto max-w-6xl px-3 sm:px-5">
        <MedicalVoicesExplorer voices={medicalVoices} />
      </div>

      {/* Editorial Context & Highlights below the map */}
      <div className="mx-auto max-w-5xl px-5 mt-16 sm:mt-20">
        {/* 3 Pillars */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-line/80 bg-card p-6 shadow-xs">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Stethoscope className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">
              Specialisti autorevoli
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Primari, docenti universitari e responsabili di dipartimento dei principali IRCCS e
              ospedali italiani.
            </p>
          </div>

          <div className="rounded-2xl border border-line/80 bg-card p-6 shadow-xs">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-glow/30 text-accent">
              <BookOpen className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">
              Rigore e chiarezza
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              La medicina complessa tradotta in un linguaggio accessibile, scientifico ed empatico
              per il grande pubblico.
            </p>
          </div>

          <div className="rounded-2xl border border-line/80 bg-card p-6 shadow-xs">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-hero/20 text-accent">
              <Sparkles className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">
              Trasparenza editoriale
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Ogni scheda collega direttamente all’articolo originale pubblicato, con data e
              affiliazione dell’epoca.
            </p>
          </div>
        </div>

        {/* Specialty Shortcuts */}
        <div className="mt-14 rounded-2xl border border-line/80 bg-card p-6 sm:p-8">
          <div className="flex items-center gap-2 text-accent">
            <HeartPulse className="size-5" />
            <h3 className="font-display text-xl font-semibold text-ink">
              Esplora per area clinica
            </h3>
          </div>
          <p className="mt-2 text-sm text-muted">
            Vuoi approfondire per argomento? Consulta gli archivi dedicati alle singole discipline:
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {specialties.map((item) => (
              <Link
                key={item.slug}
                href={`/medicina/${item.slug}`}
                className="rounded-xl border border-line/70 bg-paper/60 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-ink/85 hover:border-accent/40 hover:bg-white hover:text-accent transition"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
