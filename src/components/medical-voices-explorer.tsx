"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Info,
  Layers,
  MapPin,
  MapPinned,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { specialties } from "@/lib/specialties";
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

type MedicalVoicesExplorerProps = {
  voices: MedicalVoice[];
};

export function MedicalVoicesExplorer({ voices }: MedicalVoicesExplorerProps) {
  const [specialty, setSpecialty] = useState("tutte");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(voices[0]?.id ?? null);
  const [isListOpen, setIsListOpen] = useState(false);
  // Su mobile il pannello ricerca+filtri è richiudibile per liberare spazio sulla mappa.
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);
  const [cardDismissed, setCardDismissed] = useState(false);

  const filtered = useMemo(
    () => filterMedicalVoices(voices, { specialty, query }),
    [voices, specialty, query],
  );

  const selected = useMemo(() => {
    if (!selectedId) return filtered[0] ?? null;
    return filtered.find((v) => v.id === selectedId) ?? filtered[0] ?? null;
  }, [filtered, selectedId]);

  const handleSelectVoice = (id: string) => {
    setSelectedId(id);
    setCardDismissed(false);
  };

  const handleResetView = () => {
    setResetViewTrigger((prev) => prev + 1);
  };

  const hasActiveFilters = query.trim() !== "" || specialty !== "tutte";

  return (
    <div className="relative h-[calc(100dvh-5.5rem)] min-h-[600px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-line/80 shadow-2xl bg-card">
      {/* MAP LAYER (Full Canvas) */}
      <div className="absolute inset-0 z-0">
        <MedicalVoicesMap
          voices={filtered}
          selectedId={selected?.id ?? null}
          onSelect={handleSelectVoice}
          resetViewTrigger={resetViewTrigger}
        />
      </div>

      {/* FLOATING LEFT COLUMN: control panel + doctor list */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex w-full max-w-xl flex-col gap-3 p-3 sm:p-5">
        <div className="pointer-events-auto w-full rounded-2xl border border-line/80 bg-white/95 p-3.5 sm:p-4 shadow-xl">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <MapPinned className="size-4" aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-base sm:text-lg font-semibold tracking-tight text-ink">
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
                onClick={() => {
                  setIsListOpen((prev) => !prev);
                  // Con l'elenco aperto liberiamo spazio: il pannello ricerca si richiude.
                  setPanelExpanded(false);
                }}
                aria-label="Mostra elenco medici"
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                  isListOpen
                    ? "border-accent/40 bg-accent text-white shadow-xs"
                    : "border-line/80 bg-white/80 text-ink hover:bg-white"
                }`}
              >
                <Layers className="size-3.5" />
                <span className="hidden sm:inline">Elenco</span> ({filtered.length})
              </button>

              <button
                type="button"
                onClick={() => setShowInfo(true)}
                aria-label="Informazioni sulla mappa"
                className="inline-flex size-8 items-center justify-center rounded-xl border border-line/80 bg-white/80 text-ink/70 hover:bg-white hover:text-accent transition"
              >
                <Info className="size-4" />
              </button>

              {/* Solo su mobile: richiude/espande ricerca e specialità */}
              <button
                type="button"
                onClick={() => setPanelExpanded((prev) => !prev)}
                aria-expanded={panelExpanded}
                aria-controls="medical-map-search-panel"
                aria-label={panelExpanded ? "Nascondi ricerca e filtri" : "Mostra ricerca e filtri"}
                className="relative inline-flex size-8 items-center justify-center rounded-xl border border-line/80 bg-white/80 text-ink/70 hover:bg-white hover:text-accent transition sm:hidden"
              >
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${panelExpanded ? "rotate-180" : ""}`}
                  aria-hidden
                />
                {hasActiveFilters && !panelExpanded && (
                  <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent ring-2 ring-white" />
                )}
              </button>
            </div>
          </div>

          <div id="medical-map-search-panel" className={`${panelExpanded ? "block" : "hidden"} sm:block`}>
            {/* Search Bar */}
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCardDismissed(false);
                }}
                placeholder="Cerca medico, città, clinica o parola chiave…"
                className="w-full rounded-xl bg-paper/60 py-2.5 pl-9 pr-8 text-sm text-ink placeholder:text-muted/70 ring-1 ring-line/80 outline-none focus:bg-white focus:ring-accent/50 transition"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Specialty Filters */}
            <div className="mt-3 border-t border-line/60 pt-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Specialità
                </span>
                {specialty !== "tutte" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSpecialty("tutte");
                      setCardDismissed(false);
                    }}
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent transition hover:underline"
                  >
                    Azzera
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSpecialty("tutte");
                    setCardDismissed(false);
                  }}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    specialty === "tutte"
                      ? "bg-accent text-white shadow-xs"
                      : "bg-paper/80 text-ink/80 hover:bg-white border border-line/60"
                  }`}
                >
                  Tutte
                </button>
                {specialties.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => {
                      setSpecialty(item.slug);
                      setCardDismissed(false);
                    }}
                    className={`rounded-full px-3 py-1 font-medium transition ${
                      specialty === item.slug
                        ? "bg-accent text-white shadow-xs"
                        : "bg-paper/80 text-ink/80 hover:bg-white border border-line/60"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING DRAWER: LIST OF DOCTORS (Left Side) */}
        {isListOpen && (
          <aside className="pointer-events-auto flex min-h-0 w-full flex-1 flex-col rounded-2xl border border-line/80 bg-white/95 p-3.5 shadow-2xl animate-rise">
            <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
              <p className="font-display text-sm font-semibold text-ink">
                Elenco voci mediche ({filtered.length})
              </p>
              <button
                type="button"
                onClick={() => setIsListOpen(false)}
                className="rounded-lg p-1 text-muted hover:bg-black/5 hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-2 flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-line/30">
              {filtered.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted">
                  Nessuna voce corrisponde alla ricerca.
                </p>
              ) : (
                filtered.map((voice) => {
                  const isActive = selected?.id === voice.id;
                  return (
                    <button
                      key={voice.id}
                      type="button"
                      onClick={() => handleSelectVoice(voice.id)}
                      className={`w-full rounded-xl p-2.5 text-left transition ${
                        isActive
                          ? "bg-accent/10 ring-1 ring-accent/30"
                          : "hover:bg-black/5"
                      }`}
                    >
                      <p className="font-display text-sm font-semibold tracking-tight text-ink">
                        {voice.name}
                      </p>
                      <p className="text-xs text-accent font-medium mt-0.5">{voice.role}</p>
                      <p className="text-xs text-muted flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="size-3 shrink-0" />
                        {voice.institution}, {voice.city}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </aside>
        )}
      </div>

      {/* FLOATING ACTION BUTTONS (Bottom Left) */}
      {!isListOpen && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetView}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-line/80 bg-white/95 px-3.5 py-2 text-xs font-semibold text-ink shadow-lg hover:bg-white hover:text-accent transition active:scale-95"
          >
            <Compass className="size-4 text-accent" />
            Vista Italia
          </button>
        </div>
      )}

      {/* FLOATING DETAIL CARD (Bottom Right / Mobile Bottom) — lascia libero l'angolo
          in basso a destra per i controlli zoom di MapLibre */}
      {selected && !cardDismissed && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-16 sm:left-auto sm:right-16 sm:bottom-5 z-20 flex justify-end">
          <div className="pointer-events-auto w-full sm:max-w-md rounded-2xl border border-line/80 bg-white/95 p-4 sm:p-5 shadow-2xl animate-rise">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  <Sparkles className="size-3" />
                  Voce in evidenza
                </span>
                <span className="text-xs text-muted">
                  {formatDate(selected.interviewedAt)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCardDismissed(true)}
                aria-label="Chiudi scheda"
                className="rounded-lg p-1 text-muted hover:bg-black/5 hover:text-ink transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Doctor Info */}
            <div className="mt-3">
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
                {selected.name}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-accent">
                {selected.role}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-muted">
                <MapPin className="size-3.5 shrink-0 text-accent/80" />
                <span>{selected.institution} · <strong>{selected.city}</strong></span>
              </p>
            </div>

            {/* Article quote / context */}
            <div className="mt-3.5 rounded-xl bg-paper/60 p-3 ring-1 ring-line/60">
              <p className="text-[11px] uppercase font-semibold tracking-wider text-muted/80">
                Intervista pubblicata
              </p>
              <p className="mt-0.5 text-xs sm:text-sm font-medium text-ink leading-snug line-clamp-2">
                «{selected.articleTitle}»
              </p>
            </div>

            {/* Specialties tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selected.specialtySlugs.map((slug) => {
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

            {/* CTA Button */}
            <Link
              href={`/articolo/${selected.articleSlug}`}
              className="mt-4 flex w-full items-center justify-between rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-accent/90 transition active:scale-[0.99] group"
            >
              <span>Leggi l’intervista completa</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}

      {/* FLOATING INFO MODAL / POPUP */}
      {showInfo && (
        <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-black/30 p-4 backdrop-blur-xs animate-rise">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-accent">
                <Info className="size-5" />
                <h3 className="font-display text-xl font-semibold text-ink">
                  Sulla Mappa delle Voci
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="rounded-lg p-1 text-muted hover:bg-black/5 hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              <p>
                Questa mappa è una <strong>geografia editoriale</strong> delle oltre 100 interviste a
                medici e specialisti realizzate da Nadia Clementi per il suo blog e le sue rubriche.
              </p>
              <p>
                Ogni pin rappresenta una sede o struttura citata in un articolo al momento
                dell’intervista. Non costituisce un elenco di raccomandazioni cliniche né un servizio
                di prenotazione.
              </p>
              <p>
                Per verificare affiliazioni attuali e disponibilità, consulta sempre direttamente i
                canali ufficiali delle strutture sanitarie indicate.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition"
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
