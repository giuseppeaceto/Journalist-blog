import Link from "next/link";
import type { TermWithCount } from "@/lib/wordpress";

type CloudFilters = {
  q?: string;
  cat?: string;
};

type TermCloudProps = {
  label: string;
  items: TermWithCount[];
  filters: CloudFilters;
  /** Intervallo di dimensione dei termini, in rem. */
  sizeRange?: [number, number];
  /** Numero massimo di termini nella nuvola: la testa della distribuzione, per la scoperta. */
  cloudLimit?: number;
  /** Mostra sotto la nuvola l'elenco completo in ordine alfabetico, con i conteggi. */
  showList?: boolean;
};

/** Costruisce il link preservando la ricerca attiva e togglando la categoria cliccata. */
function buildHref(slug: string, filters: CloudFilters, isActive: boolean) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (!isActive) params.set("cat", slug);

  const search = params.toString();
  return search ? `/articoli?${search}` : "/articoli";
}

export function TermCloud({
  label,
  items,
  filters,
  sizeRange = [0.95, 2],
  cloudLimit,
  showList = false,
}: TermCloudProps) {
  if (items.length === 0) return null;

  const cloudItems = cloudLimit ? items.slice(0, cloudLimit) : items;
  const listItems = showList ? [...items].sort((a, b) => a.name.localeCompare(b.name, "it")) : [];
  const counts = cloudItems.map((item) => item.count);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const span = Math.max(max - min, 1);
  const [minSize, maxSize] = sizeRange;
  const active = filters.cat;

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <ul className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        {cloudItems.map((item) => {
          const isActive = active === item.slug;
          // Radice quadrata: comprime la testa della distribuzione, così la nuvola
          // resta leggibile anche con conteggi molto sbilanciati (361 vs 22).
          const weight = Math.sqrt((item.count - min) / span);

          return (
            <li key={item.slug}>
              <Link
                href={buildHref(item.slug, filters, isActive)}
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

      {showList && listItems.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {listItems.map((item) => {
            const isActive = active === item.slug;
            return (
              <li key={item.slug}>
                <Link
                  href={buildHref(item.slug, filters, isActive)}
                  title={`${item.name} · ${item.count} articoli`}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition ${
                    isActive
                      ? "border-accent/50 bg-accent/10 font-medium text-accent"
                      : "border-line bg-white text-ink hover:border-accent/40"
                  }`}
                >
                  {item.name}
                  <span className={isActive ? "text-accent/70" : "text-muted"}>{item.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
