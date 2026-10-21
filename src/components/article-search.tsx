"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, X } from "lucide-react";

type Filters = { q?: string; cat?: string; tag?: string };

/** Costruisce l'URL dell'archivio preservando categoria e tag attivi. */
function buildHref(query: string, filters: Filters) {
  const params = new URLSearchParams();
  const trimmed = query.trim();
  if (trimmed) params.set("q", trimmed);
  if (filters.cat) params.set("cat", filters.cat);
  if (filters.tag) params.set("tag", filters.tag);
  const search = params.toString();
  return search ? `/articoli?${search}` : "/articoli";
}

export function ArticleSearch({ query, cat, tag }: { query?: string; cat?: string; tag?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query ?? "");
  const [isPending, startTransition] = useTransition();

  // Allinea il campo quando l'URL cambia dall'esterno (back/forward, reset):
  // pattern React di "adjusting state when a prop changes" durante il render.
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setValue(query ?? "");
  }

  useEffect(() => {
    if (value.trim() === (query ?? "").trim()) return;

    const timer = setTimeout(() => {
      startTransition(() => {
        router.replace(buildHref(value, { cat, tag }), { scroll: false });
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [value, query, cat, tag, router]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(() => {
      router.replace(buildHref(value, { cat, tag }), { scroll: false });
    });
  };

  return (
    <form onSubmit={submit} role="search" className="relative">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Cerca tra tutti gli articoli…"
        aria-label="Cerca articoli"
        autoComplete="off"
        className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Cancella ricerca"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition hover:text-ink"
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {isPending ? "Ricerca in corso" : ""}
      </span>
    </form>
  );
}
