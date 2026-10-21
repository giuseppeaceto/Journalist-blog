import Link from "next/link";
import type { TermWithCount } from "@/lib/wordpress";

type CloudFilters = {
  q?: string;
  cat?: string;
  tag?: string;
};

type TermCloudProps = {
  label: string;
  items: TermWithCount[];
  /** Chiave del query param su cui agisce la nuvola: categoria o tag. */
  paramKey: "cat" | "tag";
  filters: CloudFilters;
  /** Intervallo di dimensione dei termini, in rem. */
  sizeRange?: [number, number];
};

/** Costruisce il link preservando gli altri filtri attivi e togglando quello cliccato. */
function buildHref(paramKey: "cat" | "tag", slug: string, filters: CloudFilters, isActive: boolean) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  const otherKey = paramKey === "cat" ? "tag" : "cat";
  const otherValue = filters[otherKey];
  if (otherValue) params.set(otherKey, otherValue);
  if (!isActive) params.set(paramKey, slug);

  const search = params.toString();
  return search ? `/articoli?${search}` : "/articoli";
}

export function TermCloud({ label, items, paramKey, filters, sizeRange = [0.95, 2] }: TermCloudProps) {
  if (items.length === 0) return null;

  const counts = items.map((item) => item.count);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const span = Math.max(max - min, 1);
  const [minSize, maxSize] = sizeRange;
  const active = filters[paramKey];

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <ul className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        {items.map((item) => {
          const isActive = active === item.slug;
          // Radice quadrata: comprime la testa della distribuzione, così la nuvola
          // resta leggibile anche con conteggi molto sbilanciati (361 vs 22).
          const weight = Math.sqrt((item.count - min) / span);

          return (
            <li key={item.slug}>
              <Link
                href={buildHref(paramKey, item.slug, filters, isActive)}
                title={`${item.name} · ${item.count} articoli`}
                aria-current={isActive ? "true" : undefined}
                style={{
                  fontSize: `${(minSize + weight * (maxSize - minSize)).toFixed(2)}rem`,
                  opacity: isActive ? 1 : 0.72 + weight * 0.28,
                }}
                className={`font-display leading-tight tracking-tight transition hover:text-accent ${
                  isActive ? "font-semibold text-accent underline decoration-accent/40 underline-offset-4" : "text-ink"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
