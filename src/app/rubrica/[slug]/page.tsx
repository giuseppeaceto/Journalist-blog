import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { getPostsByCategorySlug } from "@/lib/wordpress";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostsByCategorySlug(slug, 1, 1);
  if (!result) return { title: "Rubrica" };
  return {
    title: result.category.name,
    description: result.category.description || `Articoli di ${result.category.name}`,
  };
}

export default async function RubricaPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const result = await getPostsByCategorySlug(slug, page, 12);
  if (!result) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">Rubrica</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{result.category.name}</h1>
      {result.category.description ? (
        <p className="mt-4 max-w-2xl text-lg text-muted">{result.category.description}</p>
      ) : (
        <p className="mt-4 text-muted">{result.total} articoli</p>
      )}

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {result.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={result.totalPages}
        hrefFor={(nextPage) =>
          nextPage <= 1 ? `/rubrica/${slug}` : `/rubrica/${slug}?page=${nextPage}`
        }
      />
    </div>
  );
}
