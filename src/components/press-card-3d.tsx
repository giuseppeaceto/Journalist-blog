"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RotateCw, Maximize2, X, ShieldCheck, Award, Calendar, Hash } from "lucide-react";

export function PressCard3D() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Chiudi lightbox con tasto ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsZoomOpen(false);
      }
    }
    if (isZoomOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen]);

  return (
    <div className="my-10 overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-b from-card to-paper/60 p-6 shadow-sm sm:p-8">
      {/* Intestazione del box */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/70 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <ShieldCheck className="size-3.5" />
            Documento Ufficiale
          </span>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Tessera dell’Ordine dei Giornalisti
          </h3>
          <p className="mt-1 text-sm text-muted">
            Iscrizione all’Albo Nazionale dei Giornalisti · Consiglio Regionale Trentino-Alto Adige / Südtirol
          </p>
        </div>

        {/* Pulsanti di navigazione rapida Fronte/Retro */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-line bg-paper/80 p-1 shadow-inner text-xs font-medium text-muted">
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className={`rounded-full px-3 py-1.5 transition ${
                !isFlipped
                  ? "bg-accent text-white shadow-sm"
                  : "text-ink/80 hover:text-ink"
              }`}
            >
              Copertina
            </button>
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className={`rounded-full px-3 py-1.5 transition ${
                isFlipped
                  ? "bg-accent text-white shadow-sm"
                  : "text-ink/80 hover:text-ink"
              }`}
            >
              Interno con timbro
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            aria-label="Ingrandisci documento"
            title="Ingrandisci a schermo intero"
            className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-paper/80 text-muted transition hover:border-accent hover:text-accent hover:shadow-sm"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Area 3D Flip Card */}
      <div className="mt-8 flex flex-col items-center">
        <div
          className="relative w-full max-w-[620px] select-none"
          style={{ perspective: "1400px" }}
        >
          {/* Card Interattiva con rotazione 3D */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsFlipped((prev) => !prev);
              }
            }}
            aria-label={
              isFlipped
                ? "Tesserino girato: interno con foto e timbro. Clicca per vedere la copertina"
                : "Tesserino: copertina in pelle. Clicca per vedere l'interno"
            }
            className="group relative aspect-[1200/820] w-full cursor-pointer rounded-2xl shadow-xl transition-shadow duration-500 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.75s cubic-bezier(0.35, 1, 0.35, 1)",
            }}
          >
            {/* FACCIA 1: Copertina esterna in pelle con dorature */}
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl border border-black/30 bg-[#1e130f] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <Image
                src="/tesserino/tesserino-copertina.webp"
                alt="Copertina tesserino Ordine Nazionale dei Giornalisti Roma"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 620px"
                className="size-full object-cover"
              />
              {/* Etichetta fluttuante sul fronte */}
              <div className="pointer-events-none absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md transition group-hover:bg-accent">
                <RotateCw className="size-3 transition-transform duration-500 group-hover:rotate-180" />
                <span>Clicca per aprire</span>
              </div>
            </div>

            {/* FACCIA 2: Interno con foto, firma e timbro ufficiale */}
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl border border-black/30 bg-[#281b16] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <Image
                src="/tesserino/tesserino-interno.webp"
                alt="Interno tesserino Albo dei Giornalisti Pubblicisti con foto di Nadia Clementi e timbro Ordine di Trento"
                fill
                sizes="(max-width: 768px) 100vw, 620px"
                className="size-full object-cover"
              />
              {/* Etichetta fluttuante sul retro */}
              <div className="pointer-events-none absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md transition group-hover:bg-accent">
                <RotateCw className="size-3 transition-transform duration-500 group-hover:-rotate-180" />
                <span>Clicca per chiudere</span>
              </div>
            </div>
          </div>
        </div>

        {/* Istruzione d'interazione visiva */}
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
          <RotateCw className="size-3.5 text-accent animate-pulse" />
          <span>Fai click o tocca la tessera per girarla in 3D</span>
        </p>
      </div>

      {/* Griglia dati sintetici ufficiali */}
      <div className="mt-8 grid grid-cols-2 gap-3 border-t border-line/70 pt-6 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-line/60 bg-paper/50 p-3.5 transition hover:border-accent/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
            <Award className="size-3.5 text-accent" />
            Albo
          </div>
          <p className="mt-1 font-display text-base font-semibold text-ink">
            Pubblicisti
          </p>
        </div>

        <div className="rounded-xl border border-line/60 bg-paper/50 p-3.5 transition hover:border-accent/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
            <Calendar className="size-3.5 text-accent" />
            Iscrizione
          </div>
          <p className="mt-1 font-display text-base font-semibold text-ink">
            26 Agosto 2014
          </p>
        </div>

        <div className="rounded-xl border border-line/60 bg-paper/50 p-3.5 transition hover:border-accent/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
            <ShieldCheck className="size-3.5 text-accent" />
            Ordine Regionale
          </div>
          <p className="mt-1 font-display text-base font-semibold text-ink">
            Trentino-Alto Adige
          </p>
        </div>

        <div className="rounded-xl border border-line/60 bg-paper/50 p-3.5 transition hover:border-accent/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
            <Hash className="size-3.5 text-accent" />
            Tessera
          </div>
          <p className="mt-1 font-display text-base font-semibold text-ink">
            N. 142450
          </p>
        </div>
      </div>

      {/* Modal Lightbox per ingrandire */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-card p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del lightbox */}
            <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Visualizzazione dettagliata
                </p>
                <h4 className="font-display text-lg font-semibold text-ink">
                  {isFlipped
                    ? "Interno tesserino con foto e timbro ufficiale"
                    : "Copertina ufficiale Ordine Nazionale dei Giornalisti"}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-medium text-ink transition hover:border-accent hover:text-accent"
                >
                  <RotateCw className="size-3" />
                  {isFlipped ? "Mostra copertina" : "Mostra interno"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  aria-label="Chiudi finestra"
                  className="rounded-full p-1.5 text-muted transition hover:bg-paper hover:text-ink"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Immagine ingrandita */}
            <div className="relative aspect-[1200/820] w-full overflow-hidden rounded-xl border border-line bg-black/5">
              <Image
                src={
                  isFlipped
                    ? "/tesserino/tesserino-interno.webp"
                    : "/tesserino/tesserino-copertina.webp"
                }
                alt={
                  isFlipped
                    ? "Interno tesserino Albo dei Giornalisti"
                    : "Copertina tesserino Ordine dei Giornalisti"
                }
                fill
                className="size-full object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>

            <p className="mt-3 text-center text-xs text-muted">
              Premi ESC o fai clic all’esterno per chiudere
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

