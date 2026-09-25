import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const category = post.categories[0];

  return (
    <article
      className={
        featured
          ? "group grid gap-6 md:grid-cols-2 md:items-center"
          : "group rounded-2xl bg-card/70 p-3 ring-1 ring-line/80 transition hover:-translate-y-0.5 hover:ring-accent/40"
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
            className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${featured ? "aspect-[4/3] md:aspect-[5/4]" : "aspect-[16/10]"}`}
          />
        ) : (
          <div className={`bg-accent-deep ${featured ? "aspect-[4/3]" : "aspect-[16/10]"}`} />
        )}
      </Link>
      <div className={featured ? "" : "px-1 pb-2 pt-3"}>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          {category?.name ?? "Articolo"}
          <span className="text-muted"> · {formatDate(post.date)}</span>
        </p>
        <h2
          className={`mt-2 font-display font-semibold leading-[1.15] tracking-tight text-ink ${featured ? "text-3xl sm:text-4xl" : "text-xl"}`}
        >
          <Link href={`/articolo/${post.slug}`} className="inline-flex items-start gap-2 hover:text-accent">
            <span>{post.title}</span>
            <ArrowUpRight
              className={`mt-1 shrink-0 opacity-0 transition group-hover:opacity-100 ${featured ? "size-6" : "size-4"}`}
              aria-hidden
            />
          </Link>
        </h2>
        {post.excerpt ? (
          <p className={`mt-3 leading-relaxed text-muted ${featured ? "text-lg" : "text-sm line-clamp-3"}`}>
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  );
}
