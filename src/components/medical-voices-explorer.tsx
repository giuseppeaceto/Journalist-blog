"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPinned, Search } from "lucide-react";
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
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl bg-card text-sm text-muted ring-1 ring-line">
        Caricamento mappa…
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

  const filtered = useMemo(
    () => filterMedicalVoices(voices, { specialty, query }),
    [voices, specialty, query],
  );

  const selected = filtered.find((voice) => voice.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block min-w-0 flex-1">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Cerca</span>
          <span className="relative mt-2 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nome, città, struttura…"
              className="w-full rounded-xl bg-card py-3 pl-10 pr-4 text-ink ring-1 ring-line outline-none placeholder:text-muted/70 focus:ring-accent/50"
            />
          </span>
        </label>
        <label className="block sm:w-56">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Specialità</span>
          <select
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            className="mt-2 w-full rounded-xl bg-card px-4 py-3 text-ink ring-1 ring-line outline-none focus:ring-accent/50"
          >
            <option value="tutte">Tutte</option>
            {specialties.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-muted">
        {filtered.length === 1
          ? "1 voce in mappa"
          : `${filtered.length} voci in mappa`}
        {specialty !== "tutte" || query
          ? " · filtri attivi"
          : ` · ${voices.length} voci da interviste pubblicate`}
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-stretch">
        <div className="flex max-h-[34rem] flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-line lg:max-h-[40rem]">
          <ul className="divide-y divide-line overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="p-6 text-muted">Nessuna voce corrisponde ai filtri.</li>
            ) : (
              filtered.map((voice) => {
                const active = selected?.id === voice.id;
                return (
                  <li key={voice.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(voice.id)}
                      className={`w-full px-5 py-4 text-left transition ${
                        active ? "bg-glow/25" : "hover:bg-glow/10"
                      }`}
                    >
                      <p className="font-display text-xl font-semibold tracking-tight">{voice.name}</p>
                      <p className="mt-1 text-sm text-muted">
                        {voice.role} · {voice.institution}, {voice.city}
                      </p>
                      <p className="mt-2 line-clamp-1 text-sm text-ink/80">{voice.articleTitle}</p>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="flex min-h-[320px] flex-col gap-4 lg:min-h-[40rem]">
          <div className="min-h-0 flex-1">
            <MedicalVoicesMap
              voices={filtered}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
            />
          </div>

          {selected ? (
            <div className="rounded-2xl bg-card p-5 ring-1 ring-line">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Voce selezionata</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">{selected.name}</h2>
              <p className="mt-1 text-muted">
                {selected.role}
                <span className="mx-1.5 text-line">·</span>
                {selected.institution}, {selected.city}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/85">
                Intervista del {formatDate(selected.interviewedAt)} · «{selected.articleTitle}»
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.specialtySlugs.map((slug) => {
                  const label = specialties.find((item) => item.slug === slug)?.name ?? slug;
                  return (
                    <Link
                      key={slug}
                      href={`/medicina/${slug}`}
                      className="rounded-lg bg-glow/30 px-3 py-1 text-sm text-ink ring-1 ring-line hover:ring-accent/40"
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
              <Link
                href={`/articolo/${selected.articleSlug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                <MapPinned className="size-4" aria-hidden />
                Leggi l’intervista
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
