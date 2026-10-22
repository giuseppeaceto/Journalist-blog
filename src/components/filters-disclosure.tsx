"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

type FiltersDisclosureProps = {
  /** Numero di filtri attivi, mostrato come badge sul pulsante mobile. */
  activeCount?: number;
  children: ReactNode;
};

/**
 * Racchiude il pannello dei filtri: su mobile resta chiuso dietro un pulsante
 * (i filtri occupano troppo spazio verticale), su desktop è sempre visibile.
 */
export function FiltersDisclosure({ activeCount = 0, children }: FiltersDisclosureProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-accent/40 lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted" aria-hidden />
          Filtri
          {activeCount > 0 ? (
            <span className="rounded-full bg-accent/10 px-1.5 text-xs font-semibold text-accent">
              {activeCount}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`size-4 text-muted transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <div className={`${open ? "mt-5 block" : "hidden"} space-y-5 lg:mt-0 lg:block`}>
        {children}
      </div>
    </div>
  );
}
