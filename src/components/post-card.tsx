import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({
  post,
  featured = false,
  layout = "card",
  aspectRatio = "square",
}: {
  post: Post;
  featured?: boolean;
  layout?: "card" | "row";
  aspectRatio?: "square" | "wide";
}) {
  const category = post.categories[0];
  const categoryName = category?.slug === "pensieri" ? "Diario" : category?.name;

  if (layout === "row") {
    return (
      <article className="group flex gap-4 rounded-2xl bg-card/70 p-2.5 ring-1 ring-line/80 transition hover:ring-accent/40 sm:gap-5 sm:p-3">
        <Link
          href={`/articolo/${post.slug}`}
          className="relative block w-24 shrink-0 overflow-hidden rounded-xl bg-line sm:w-36 lg:w-44"
        >
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt}
              width={400}
              height={300}
              className={`w-full object-cover object-top transition duration-500 group-hover:scale-[1.03] ${aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]"}`}
            />
          ) : (
            <div className={`w-full bg-accent-deep ${aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]"}`} />
          )}
        </Link>
        <div className="min-w-0 flex-1 py-0.5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            {categoryName ?? "Articolo"}
            <span className="text-muted"> · {formatDate(post.date)}</span>
          </p>
          <h2 className="mt-1.5 font-display text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">
            <Link href={`/articolo/${post.slug}`} className="hover:text-accent">
              {post.title}
            </Link>
          </h2>
          {post.excerpt ? (
            <p className="mt-1.5 hidden text-sm leading-relaxed text-muted sm:line-clamp-2">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article
      className={
        featured
          ? "group grid gap-6 md:grid-cols-2 md:items-center"
          : `group flex h-full flex-col rounded-2xl bg-card/70 ring-1 ring-line/80 transition hover:-translate-y-0.5 hover:ring-accent/40 ${
              aspectRatio === "square" ? "p-2.5 sm:p-3" : "p-3"
            }`
      }
    >
      <Link
        href={`/articolo/${post.slug}`}
        className={`relative block overflow-hidden bg-line ${featured ? "rounded-3xl" : "rounded-xl"}`}
      >
        {post.image ? (
          <Image
            src={post.image}
            alt={post.imageAlt}
            width={featured ? 960 : 640}
            height={featured ? 640 : 420}
            className={`w-full object-cover object-top transition duration-500 group-hover:scale-[1.03] ${
              featured
                ? "aspect-[4/3] md:aspect-[5/4]"
                : aspectRatio === "square"
                ? "aspect-square"
                : "aspect-[16/10]"
            }`}
          />
        ) : (
          <div
            className={`bg-accent-deep ${
              featured
                ? "aspect-[4/3]"
                : aspectRatio === "square"
                ? "aspect-square"
                : "aspect-[16/10]"
            }`}
          />
        )}
      </Link>
      <div className={featured ? "" : "flex flex-1 flex-col px-1 pb-2 pt-3"}>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          {categoryName ?? "Articolo"}
          <span className="text-muted"> · {formatDate(post.date)}</span>
        </p>
        <h2
          className={`mt-2 font-display font-semibold leading-[1.2] tracking-tight text-ink ${
            featured
              ? "text-3xl sm:text-4xl"
              : aspectRatio === "square"
              ? "text-base sm:text-lg"
              : "text-lg"
          }`}
        >
          <Link href={`/articolo/${post.slug}`} className="inline-flex items-start gap-2 hover:text-accent">
            <span className="line-clamp-2">{post.title}</span>
            <ArrowUpRight
              className={`mt-1 shrink-0 opacity-0 transition group-hover:opacity-100 ${featured ? "size-6" : "size-4"}`}
              aria-hidden
            />
          </Link>
        </h2>
        {post.excerpt ? (
          <p
            className={`mt-2.5 leading-relaxed text-muted ${
              featured
                ? "text-lg"
                : aspectRatio === "square"
                ? "text-xs leading-normal line-clamp-2 sm:text-sm"
                : "text-sm line-clamp-3"
            }`}
          >
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  );
}
