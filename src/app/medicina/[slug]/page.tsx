import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { getSpecialty } from "@/lib/specialties";
import { getCategoryBySlug, getPosts } from "@/lib/wordpress";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const specialty = getSpecialty(slug);
  if (!specialty) return { title: "Specialità" };
  return { title: specialty.name, description: specialty.description };
}

export default async function SpecialtyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const specialty = getSpecialty(slug);
  if (!specialty) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  let categoryId: number | undefined;

  if (specialty.categorySlug) {
    const category = await getCategoryBySlug(specialty.categorySlug);
    if (!category) notFound();
    categoryId = category.id;
  }

  const { posts, totalPages } = await getPosts({
    page,
    perPage: specialty.search ? 20 : 12,
    categories: categoryId,
    search: specialty.search,
  });

  const needle = specialty.search?.toLowerCase();
  const visible = needle
    ? posts.filter((post) =>
        [post.title, post.excerpt, ...post.tags.map((tag) => tag.name)]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
    : posts;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-28 sm:pb-14 sm:pt-32">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">Specialità</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{specialty.name}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{specialty.description}</p>

      {visible.length === 0 ? (
        <p className="mt-10 text-muted">Non ci sono ancora articoli in questa specialità.</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {needle ? null : (
        <Pagination
          page={page}
          totalPages={totalPages}
          hrefFor={(nextPage) =>
            nextPage <= 1 ? `/medicina/${slug}` : `/medicina/${slug}?page=${nextPage}`
          }
        />
      )}
    </div>
  );
}
