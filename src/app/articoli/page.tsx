import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArticleSearch } from "@/components/article-search";
import { BackButton } from "@/components/back-button";
import { FiltersDisclosure } from "@/components/filters-disclosure";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { TermCloud } from "@/components/term-cloud";
import { getCategories, getCategoryBySlug, getPosts } from "@/lib/wordpress";

export const revalidate = 300;

type SearchParams = { q?: string; cat?: string; page?: string };
type Props = { searchParams: Promise<SearchParams> };

const PER_PAGE = 12;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  return {
    title: query ? `Articoli: ${query}` : "Articoli",
    description:
      "Esplora tutti gli articoli di Nadia Clementi: cerca per parola chiave o filtra per categoria e tag.",
  };
}

/** URL dell'elenco preservando i filtri attivi e impostando la pagina. */
function listHref(filters: { q?: string; cat?: string }, page: number) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.cat) params.set("cat", filters.cat);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/articoli?${search}` : "/articoli";
}

function FilterChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-xs text-ink">
      {children}
    </span>
  );
}

export default async function ArticoliPage({ searchParams }: Props) {
  const { q, cat, page: pageParam } = await searchParams;
  const query = q?.trim() || undefined;
  const page = Math.max(1, Number(pageParam) || 1);

  const [category, categories] = await Promise.all([
    cat ? getCategoryBySlug(cat) : Promise.resolve(null),
    getCategories(),
  ]);

  const result = await getPosts({
    search: query,
    categories: category?.id,
    page,
    perPage: PER_PAGE,
  });

  const filters = { q: query, cat: category?.slug };
  const hasFilters = Boolean(query || category);
  const activeCount = [query, category].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-[96rem] px-3 pb-10 pt-28 sm:px-5 sm:pb-14 sm:pt-32">
      <div className="lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[22rem_minmax(0,1fr)] xl:gap-12">
        <div className="lg:col-start-2 lg:row-start-1">
          <BackButton href="/" label="Indietro" />
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Archivio</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">Articoli</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Tutti gli articoli, senza filtri fissi: cerca per parola chiave oppure esplora per categoria e tag.
          </p>
        </div>

        {/* Box filtri flottante: agganciato in alto a sinistra, segue lo scroll */}
        <aside className="mt-8 lg:sticky lg:top-24 lg:col-start-1 lg:[grid-row:1/3] lg:mt-0 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
          <div className="space-y-5 rounded-3xl border border-line/80 bg-white p-5 shadow-[0_24px_60px_-32px_rgba(11,18,32,0.45)] sm:p-6">
            <ArticleSearch query={query} cat={category?.slug} />
            <FiltersDisclosure activeCount={activeCount}>
              <TermCloud
                label="Categorie"
                items={categories}
                filters={filters}
                cloudLimit={12}
                showList
                sizeRange={[1, 1.7]}
              />
            </FiltersDisclosure>
          </div>
        </aside>

        <div className="mt-6 lg:col-start-2 lg:row-start-2 lg:mt-12">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted">
              {result.total} {result.total === 1 ? "articolo" : "articoli"}
            </span>
            {category ? <FilterChip>Categoria: {category.name}</FilterChip> : null}
            {query ? <FilterChip>“{query}”</FilterChip> : null}
            {hasFilters ? (
              <Link href="/articoli" className="text-accent hover:underline">
                Azzera filtri
              </Link>
            ) : null}
          </div>

          {result.posts.length > 0 ? (
            <div className="mt-8 grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(17rem,1fr))]">
              {result.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-3xl border border-line/80 bg-card/60 p-8 text-center text-muted">
              Nessun articolo trovato. Prova a modificare la ricerca o i filtri.
            </p>
          )}

          <Pagination
            page={page}
            totalPages={result.totalPages}
            hrefFor={(nextPage) => listHref(filters, nextPage)}
          />
        </div>
      </div>
    </div>
  );
}
