import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotebookPen } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { getPostsByCategorySlug } from "@/lib/wordpress";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 300;

const description =
  "Appunti, incontri e riflessioni personali: il lato più intimo delle storie e del lavoro di Nadia Clementi.";

export const metadata: Metadata = {
  title: "Diario",
  description,
};

export default async function DiarioPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const result = await getPostsByCategorySlug("pensieri", page, 12);
  if (!result) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-28 sm:pb-14 sm:pt-32">
      <BackButton href="/" label="Indietro" />
      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-glow/60 text-accent">
        <NotebookPen className="size-5" aria-hidden />
      </span>
      <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-accent">
        Riflessioni e incontri
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
        Diario
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
      <p className="mt-4 text-sm text-muted">
        {result.total} {result.total === 1 ? "storia" : "storie"}
      </p>

      {result.posts.length > 0 ? (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {result.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-3xl border border-line/80 bg-card/60 p-8 text-center text-muted">
          Non ci sono ancora storie da mostrare.
        </p>
      )}

      <Pagination
        page={page}
        totalPages={result.totalPages}
        hrefFor={(nextPage) =>
          nextPage <= 1 ? "/diario" : `/diario?page=${nextPage}`
        }
      />
    </div>
  );
}
