import type { Metadata } from "next";
import Image from "next/image";
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
  const isFirstPage = page === 1;
  const perPage = isFirstPage ? 13 : 12;
  const result = await getPostsByCategorySlug("pensieri", page, perPage);
  if (!result) notFound();

  const featuredPost = isFirstPage && result.posts.length > 0 ? result.posts[0] : null;
  const remainingPosts = isFirstPage ? result.posts.slice(1) : result.posts;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:pb-20 sm:pt-32">
      <BackButton href="/" label="Indietro" />

      {/* Intestazione editoriale calda d'autore */}
      <header className="mt-3 grid items-center gap-8 pb-12 sm:pb-16 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <NotebookPen className="size-3.5" aria-hidden />
            I taccuini di Nadia
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
            Diario
          </h1>
          <blockquote className="mt-5 border-l-2 border-accent pl-5 font-display text-xl italic leading-snug text-ink/85 sm:text-2xl">
            «Non tutto ciò che conta diventa una notizia. Alcune storie appartengono
            semplicemente all’anima e meritano di essere custodite attraverso le parole.»
          </blockquote>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>
          <div className="mt-5 flex items-center gap-2 text-xs font-medium text-muted">
            <span className="inline-block size-2 rounded-full bg-accent" />
            <span>
              {result.total}{" "}
              {result.total === 1 ? "racconto custodito" : "pensieri e racconti custoditi"}
            </span>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-[380px] overflow-hidden rounded-3xl border border-line/80 bg-card shadow-sm lg:mx-0 lg:ml-auto">
          <Image
            src="/Cover/diario.jpg"
            alt="Un taccuino aperto con penna stilografica durante la scrittura"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 380px"
            className="object-cover transition duration-500 hover:scale-[1.03]"
          />
        </div>
      </header>

      {/* Storia più recente in evidenza (solo a pagina 1) */}
      {featuredPost ? (
        <section className="border-t border-line/80 pt-10 sm:pt-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              L'ultima pagina del taccuino
            </p>
          </div>
          <div className="rounded-3xl border border-line/80 bg-card/90 p-5 shadow-sm transition hover:border-accent/40 sm:p-8">
            <PostCard post={featuredPost} featured />
          </div>
        </section>
      ) : null}

      {/* Le altre pagine del diario */}
      {remainingPosts.length > 0 ? (
        <section className="mt-12 border-t border-line/80 pt-10 sm:mt-14 sm:pt-12">
          {isFirstPage ? (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Archivio dei pensieri
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Altre storie e ricordi
              </h2>
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5">
            {remainingPosts.map((post) => (
              <div key={post.id} className="h-full">
                <PostCard post={post} aspectRatio="square" />
              </div>
            ))}
          </div>
        </section>
      ) : !featuredPost ? (
        <p className="mt-8 rounded-3xl border border-line/80 bg-card/60 p-8 text-center text-muted">
          Non ci sono ancora storie da mostrare.
        </p>
      ) : null}

      <div className="mt-12 sm:mt-14">
        <Pagination
          page={page}
          totalPages={result.totalPages}
          hrefFor={(nextPage) =>
            nextPage <= 1 ? "/diario" : `/diario?page=${nextPage}`
          }
        />
      </div>
    </div>
  );
}
