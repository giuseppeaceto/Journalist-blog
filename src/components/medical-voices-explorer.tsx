"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, TouchEvent as ReactTouchEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Compass,
  HeartPulse,
  Info,
  MapPin,
  MapPinned,
  Search,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { specialties } from "@/lib/specialties";
import { specialtyIcons } from "@/lib/site-content";
import {
  filterMedicalVoices,
  type MedicalVoice,
} from "@/lib/medical-voices";
import { formatDate } from "@/lib/format";

const MedicalVoicesMap = dynamic(
  () => import("@/components/medical-voices-map").then((mod) => mod.MedicalVoicesMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-card text-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm font-medium">Caricamento mappa editoriale…</p>
        </div>
      </div>
    ),
  },
);

/** Quanto del foglio resta a vista quando è "appoggiato" in basso, in px. */
const SHEET_PEEK_PX = 152;

const pillars = [
  {
    icon: Stethoscope,
    title: "Specialisti autorevoli",
    text: "Primari, docenti universitari e responsabili di dipartimento dei principali IRCCS e ospedali italiani.",
  },
  {
    icon: BookOpen,
    title: "Rigore e chiarezza",
    text: "La medicina complessa tradotta in un linguaggio accessibile, scientifico ed empatico per il grande pubblico.",
  },
  {
    icon: HeartPulse,
    title: "Trasparenza editoriale",
    text: "Ogni scheda collega direttamente all’articolo originale pubblicato, con data e affiliazione dell’epoca.",
  },
];

type MedicalVoicesExplorerProps = {
  voices: MedicalVoice[];
};

export function MedicalVoicesExplorer({ voices }: MedicalVoicesExplorerProps) {
  const [specialty, setSpecialty] = useState("tutte");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(voices[0]?.id ?? null);
  const [showInfo, setShowInfo] = useState(false);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);
  const [cardDismissed, setCardDismissed] = useState(false);
  // Vero solo dopo che l'utente ha scelto una voce: su mobile la scheda prende
  // il posto del pannello di ricerca invece di aprirsi sopra di esso.
  const [mobileDetail, setMobileDetail] = useState(false);

  // Bottom sheet: attivo solo su mobile, dove la pagina non scrolla.
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [dragY, setDragY] = useState<number | null>(null);
  const [peekOffset, setPeekOffset] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startY: 0, base: 0, current: 0 });

  const filtered = useMemo(
    () => filterMedicalVoices(voices, { specialty, query }),
    [voices, specialty, query],
  );

  const selected = useMemo(() => {
    if (!selectedId) return filtered[0] ?? null;
    return filtered.find((v) => v.id === selectedId) ?? filtered[0] ?? null;
  }, [filtered, selectedId]);

  // Su mobile la scheda di una voce prende il posto del pannello di ricerca/elenco,
  // così non si sovrappongono due pannelli dentro lo stesso foglio.
  const detailOpen = mobileDetail && selected !== null && !cardDismissed;

  // Quanto scostare il foglio per lasciare a vista solo la testa del pannello.
  // Si ricalcola anche quando cambia l'altezza del foglio (es. modalità dettaglio).
  useEffect(() => {
    const measure = () => {
      const height = sheetRef.current?.offsetHeight ?? 0;
      setPeekOffset(Math.max(height - SHEET_PEEK_PX, 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [detailOpen]);

  const sheetOffset = dragY ?? (sheetExpanded ? 0 : peekOffset);

  const onHandleTouchStart = (event: ReactTouchEvent) => {
    dragRef.current = {
      startY: event.touches[0].clientY,
      base: sheetExpanded ? 0 : peekOffset,
      current: sheetOffset,
    };
  };

  const onHandleTouchMove = (event: ReactTouchEvent) => {
    const delta = event.touches[0].clientY - dragRef.current.startY;
    const next = Math.min(Math.max(dragRef.current.base + delta, 0), peekOffset);
    dragRef.current.current = next;
    setDragY(next);
  };

  const onHandleTouchEnd = () => {
    setSheetExpanded(dragRef.current.current < peekOffset * 0.55);
    setDragY(null);
  };

  const handleSelectVoice = (id: string) => {
    setSelectedId(id);
    setCardDismissed(false);
    setMobileDetail(true);
    // Su mobile apriamo il foglio così la scheda della voce è subito visibile.
    setSheetExpanded(true);
  };

  const resetFilters = () => {
    setSpecialty("tutte");
    setCardDismissed(false);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-card">
      {/* MAPPA a tutta pagina */}
      <div className="absolute inset-0 z-0">
        <MedicalVoicesMap
          voices={filtered}
          selectedId={selected?.id ?? null}
          onSelect={handleSelectVoice}
          resetViewTrigger={resetViewTrigger}
        />
      </div>

      {/* PANNELLO: bottom sheet su mobile, sidebar floating su desktop */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 sm:absolute sm:inset-y-0 sm:bottom-0 sm:left-0 sm:right-auto sm:w-full sm:max-w-md sm:pb-10 sm:pl-5 sm:pt-32">
        <div
          ref={sheetRef}
          data-dragging={dragY !== null ? "true" : "false"}
          style={{ "--sheet-y": `${sheetOffset}px` } as CSSProperties}
          className={`medical-sheet pointer-events-auto flex flex-col overflow-hidden rounded-t-3xl border border-line/80 bg-white/95 shadow-2xl sm:h-full sm:max-h-none sm:rounded-2xl sm:shadow-xl ${
            detailOpen ? "h-auto max-h-[84dvh]" : "h-[84dvh]"
          }`}
        >
          {/* Maniglia del foglio (solo mobile) */}
          <button
            type="button"
            onClick={() => setSheetExpanded((prev) => !prev)}
            onTouchStart={onHandleTouchStart}
            onTouchMove={onHandleTouchMove}
            onTouchEnd={onHandleTouchEnd}
            aria-expanded={sheetExpanded}
            aria-label={sheetExpanded ? "Riduci il pannello" : "Espandi il pannello"}
            className="flex shrink-0 touch-none flex-col items-center pb-1.5 pt-2.5 sm:hidden"
          >
            <span className="h-1.5 w-10 rounded-full bg-line" />
          </button>

          <div
            className={`min-h-0 overflow-y-auto overscroll-contain sm:flex sm:flex-1 sm:flex-col sm:overflow-hidden ${
              detailOpen ? "grow" : "flex-1"
            }`}
          >
            {/* MOBILE — modalità dettaglio: la scheda della voce sostituisce il pannello di ricerca */}
            {detailOpen && selected && (
              <div className="p-3.5 pt-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => setMobileDetail(false)}
                  className="mb-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted transition hover:text-accent"
                >
                  <ChevronLeft className="size-3.5" aria-hidden />
                  Torna all’elenco
                </button>
                <VoiceCard voice={selected} onClose={() => setMobileDetail(false)} />
              </div>
            )}

            {/* Pannello di ricerca ed elenco: su mobile lascia il posto alla scheda */}
            {/* Intestazione del pannello */}
            <div
              className={`${detailOpen ? "hidden sm:flex" : "flex"} shrink-0 items-center justify-between gap-2 px-3.5 pb-2 pt-2 sm:px-4 sm:pb-2.5 sm:pt-4`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <MapPinned className="size-4" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
                    Mappa delle voci
                  </h2>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                    {filtered.length === 1
                      ? "1 medico in mappa"
                      : `${filtered.length} medici in mappa`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowInfo(true)}
                  aria-label="Informazioni sulla mappa"
                  className="inline-flex size-8 items-center justify-center rounded-xl border border-line/80 bg-white/80 text-ink/70 transition hover:bg-white hover:text-accent"
                >
                  <Info className="size-4" />
                </button>
              </div>
            </div>

            {/* Ricerca */}
            <div className={`${detailOpen ? "hidden sm:block" : ""} shrink-0 px-3.5 sm:px-4`}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCardDismissed(false);
                  }}
                  placeholder="Cerca medico, città, clinica o parola chiave…"
                  className="w-full rounded-xl bg-paper/60 py-2.5 pl-9 pr-8 text-sm text-ink ring-1 ring-line/80 outline-none transition placeholder:text-muted/70 focus:bg-white focus:ring-accent/50"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Cancella ricerca"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtri per specialità */}
            <div className={`${detailOpen ? "hidden sm:block" : ""} shrink-0 px-3.5 pb-3 pt-3 sm:px-4`}>
              <div className="flex items-center justify-between gap-2 border-t border-line/60 pt-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Specialità
                </span>
                {specialty !== "tutte" && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent transition hover:underline"
                  >
                    Azzera
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={resetFilters}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    specialty === "tutte"
                      ? "bg-accent text-white shadow-xs"
                      : "border border-line/60 bg-paper/80 text-ink/80 hover:bg-white"
                  }`}
                >
                  Tutte
                </button>
                {specialties.map((item) => {
                  const Icon = specialtyIcons[item.slug] ?? Sparkles;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => {
                        setSpecialty(item.slug);
                        setCardDismissed(false);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition ${
                        specialty === item.slug
                          ? "bg-accent text-white shadow-xs"
                          : "border border-line/60 bg-paper/80 text-ink/80 hover:bg-white"
                      }`}
                    >
                      <Icon className="size-3.5" aria-hidden />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Elenco voci mediche: sempre visibile, scorre dentro il pannello */}
            <div
              className={`${detailOpen ? "hidden sm:block" : ""} border-t border-line/60 px-3.5 pb-4 sm:min-h-0 sm:flex-1 sm:overflow-y-auto sm:px-4`}
            >
              {filtered.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted">
                  Nessuna voce corrisponde alla ricerca.
                </p>
              ) : (
                <ul className="divide-y divide-line/30 pt-1.5 sm:pb-1">
                  {filtered.map((voice) => {
                    const isActive = selected?.id === voice.id;
                    return (
                      <li key={voice.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectVoice(voice.id)}
                          className={`w-full rounded-xl p-2.5 text-left transition ${
                            isActive ? "bg-accent/10 ring-1 ring-accent/30" : "hover:bg-black/5"
                          }`}
                        >
                          <p className="font-display text-sm font-semibold tracking-tight text-ink">
                            {voice.name}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-accent">{voice.role}</p>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
                            <MapPin className="size-3 shrink-0" />
                            {voice.institution}, {voice.city}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AZIONI FLOTTANTI (in alto a destra, sotto l'header flottante e allineate
          al bordo superiore della sidebar di ricerca su desktop) */}
      <div className="pointer-events-none absolute right-3 top-20 z-20 flex items-center gap-2 sm:right-5 sm:top-32">
        <button
          type="button"
          onClick={() => setResetViewTrigger((prev) => prev + 1)}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-line/80 bg-white/95 px-3.5 py-2 text-xs font-semibold text-ink shadow-lg transition hover:bg-white hover:text-accent active:scale-95"
        >
          <Compass className="size-4 text-accent" />
          Vista Italia
        </button>
      </div>

      {/* SCHEDA DETTAGLIO (desktop, in basso a destra) — lascia libero l'angolo
          per i controlli zoom di MapLibre */}
      {selected && !cardDismissed && (
        <div className="pointer-events-none absolute bottom-5 right-16 z-20 hidden justify-end sm:flex">
          <div className="pointer-events-auto w-full max-w-md">
            <VoiceCard voice={selected} onClose={() => setCardDismissed(true)} />
          </div>
        </div>
      )}

      {/* MODALE INFORMATIVA */}
      {showInfo && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[86dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line/70 p-5">
              <div className="flex items-center gap-2 text-accent">
                <Info className="size-5" />
                <h3 className="font-display text-xl font-semibold text-ink">
                  Sulla Mappa delle Voci
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                aria-label="Chiudi"
                className="rounded-lg p-1 text-muted hover:bg-black/5 hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-5 text-sm leading-relaxed text-muted">
              <p>
                Questa mappa è una <strong>geografia editoriale</strong> delle oltre 100 interviste a
                medici e specialisti realizzate da Nadia Clementi per il suo blog e le sue rubriche.
              </p>
              <p>
                Ogni pin rappresenta una sede o struttura citata in un articolo al momento
                dell’intervista. Non costituisce un elenco di raccomandazioni cliniche né un servizio
                di prenotazione.
              </p>

              <ul className="space-y-3 pt-1">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <li key={pillar.title} className="flex gap-3 rounded-xl bg-white/70 p-3 ring-1 ring-line/60">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div>
                        <p className="font-display text-sm font-semibold text-ink">{pillar.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed">{pillar.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p>
                Per verificare affiliazioni attuali e disponibilità, consulta sempre direttamente i
                canali ufficiali delle strutture sanitarie indicate.
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line/70 p-4">
              <Link
                href="/medicina"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Archivio medicina
                <ArrowRight className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
              >
                Ho capito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Scheda di una voce medica, condivisa tra foglio mobile e card desktop. */
function VoiceCard({
  voice,
  onClose,
  className = "",
}: {
  voice: MedicalVoice;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line/80 bg-white/95 p-4 sm:p-5 shadow-2xl ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="size-3" />
            Voce in evidenza
          </span>
          <span className="text-xs text-muted">{formatDate(voice.interviewedAt)}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi scheda"
          className="rounded-lg p-1 text-muted transition hover:bg-black/5 hover:text-ink"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3">
        <h3 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {voice.name}
        </h3>
        <p className="mt-0.5 text-sm font-medium text-accent">{voice.role}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted sm:text-sm">
          <MapPin className="size-3.5 shrink-0 text-accent/80" />
          <span>
            {voice.institution} · <strong>{voice.city}</strong>
          </span>
        </p>
      </div>

      <div className="mt-3.5 rounded-xl bg-paper/60 p-3 ring-1 ring-line/60">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted/80">
          Intervista pubblicata
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-ink sm:text-sm">
          «{voice.articleTitle}»
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {voice.specialtySlugs.map((slug) => {
          const label = specialties.find((s) => s.slug === slug)?.name ?? slug;
          return (
            <span
              key={slug}
              className="rounded-md bg-black/5 px-2 py-0.5 text-[11px] font-medium text-ink/75"
            >
              {label}
            </span>
          );
        })}
      </div>

      <Link
        href={`/articolo/${voice.articleSlug}`}
        className="group mt-4 flex w-full items-center justify-between rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-accent/90 active:scale-[0.99]"
      >
        <span>Leggi l’intervista completa</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
