import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArticleSearch } from "@/components/article-search";
import { BackButton } from "@/components/back-button";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { TermCloud } from "@/components/term-cloud";
import {
  getCategories,
  getCategoryBySlug,
  getPosts,
  getTagBySlug,
  getTags,
} from "@/lib/wordpress";

export const revalidate = 300;

type SearchParams = { q?: string; cat?: string; tag?: string; page?: string };
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
function listHref(filters: { q?: string; cat?: string; tag?: string }, page: number) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.cat) params.set("cat", filters.cat);
  if (filters.tag) params.set("tag", filters.tag);
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
  const { q, cat, tag, page: pageParam } = await searchParams;
  const query = q?.trim() || undefined;
  const page = Math.max(1, Number(pageParam) || 1);

  const [category, selectedTag, categories, tags] = await Promise.all([
    cat ? getCategoryBySlug(cat) : Promise.resolve(null),
    tag ? getTagBySlug(tag) : Promise.resolve(null),
    getCategories(),
    getTags(),
  ]);

  const result = await getPosts({
    search: query,
    categories: category?.id,
    tags: selectedTag?.id,
    page,
    perPage: PER_PAGE,
  });

  const filters = { q: query, cat: category?.slug, tag: selectedTag?.slug };
  const hasFilters = Boolean(query || category || selectedTag);

  return (
    <div className="mx-auto max-w-6xl px-3 pb-10 pt-28 sm:px-5 sm:pb-14 sm:pt-32">
      <BackButton href="/" label="Indietro" />
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Archivio</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">Articoli</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Tutti gli articoli, senza filtri fissi: cerca per parola chiave oppure esplora per categoria e tag.
      </p>

      <div className="mt-8 space-y-6 rounded-2xl border border-line/80 bg-card/60 p-4 sm:p-5">
        <ArticleSearch query={query} cat={category?.slug} tag={selectedTag?.slug} />
        <TermCloud label="Categorie" items={categories} paramKey="cat" filters={filters} />
        <TermCloud
          label="Tag più usati"
          items={tags}
          paramKey="tag"
          filters={filters}
          sizeRange={[0.8, 1.4]}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted">
          {result.total} {result.total === 1 ? "articolo" : "articoli"}
        </span>
        {category ? <FilterChip>Categoria: {category.name}</FilterChip> : null}
        {selectedTag ? <FilterChip>Tag: {selectedTag.name}</FilterChip> : null}
        {query ? <FilterChip>“{query}”</FilterChip> : null}
        {hasFilters ? (
          <Link href="/articoli" className="text-accent hover:underline">
            Azzera filtri
          </Link>
        ) : null}
      </div>

      {result.posts.length > 0 ? (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {result.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-line/80 bg-card/60 p-8 text-center text-muted">
          Nessun articolo trovato. Prova a modificare la ricerca o i filtri.
        </p>
      )}

      <Pagination
        page={page}
        totalPages={result.totalPages}
        hrefFor={(nextPage) => listHref(filters, nextPage)}
      />
    </div>
  );
}
