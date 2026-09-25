import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import { PostCard } from "@/components/post-card";
import { formatDate, readingMinutes } from "@/lib/format";
import { getPostBySlug, getPosts } from "@/lib/wordpress";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Articolo" };
  return {
    title: post.title,
    description: post.description || post.excerpt,
    openGraph: post.image ? { images: [{ url: post.image, alt: post.imageAlt }] } : undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const category = post.categories[0];
  const related = category
    ? (await getPosts({ categories: category.id, perPage: 4, exclude: post.id })).posts
        .filter((item) => item.id !== post.id)
        .slice(0, 3)
    : [];

  return (
    <article className="mx-auto max-w-3xl px-5 pb-10 pt-28 sm:pb-14 sm:pt-32">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">
        {category ? (
          <Link href={`/rubrica/${category.slug}`} className="hover:underline">
            {category.name}
          </Link>
        ) : (
          "Articolo"
        )}
        <span className="text-muted">
          {" "}
          · {formatDate(post.date)} · {readingMinutes(post.content)} min
        </span>
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{post.title}</h1>

      {post.image ? (
        <Image
          src={post.image}
          alt={post.imageAlt}
          width={1200}
          height={800}
          priority
          className="mt-8 w-full bg-line object-cover"
        />
      ) : null}

      <div className="mt-8">
        <ArticleBody html={post.content} />
      </div>

      {post.tags.length > 0 ? (
        <ul className="mt-10 flex flex-wrap gap-2">
          {post.tags.slice(0, 8).map((tag) => (
            <li key={tag.id} className="border border-line px-2.5 py-1 text-xs text-muted">
              {tag.name}
            </li>
          ))}
        </ul>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Nella stessa rubrica</h2>
          <div className="mt-6 grid gap-8">
            {related.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
