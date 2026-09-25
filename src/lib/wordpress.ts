import { cache } from "react";
import sanitizeHtml from "sanitize-html";
import { decodeEntities, excerptText, plainText } from "@/lib/format";
import type { Category, Page, Post, Term } from "@/lib/types";

const API =
  process.env.WORDPRESS_API_URL ??
  "https://www.nadiaclementi.it/wp-json/wp/v2";

type WpRendered = { rendered: string };

type WpTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  count?: number;
  description?: string;
  parent?: number;
};

type WpPost = {
  id: number;
  slug: string;
  date: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  jetpack_featured_media_url?: string;
  yoast_head_json?: { description?: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string; alt_text?: string }[];
    "wp:term"?: WpTerm[][];
  };
};

type WpPage = {
  id: number;
  slug: string;
  title: WpRendered;
  content: WpRendered;
};

type WpList<T> = {
  data: T;
  total: number;
  totalPages: number;
};

async function wpFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<WpList<T>> {
  const url = new URL(`${API}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`WordPress ha risposto ${response.status}`);
  }

  return {
    data: (await response.json()) as T,
    total: Number(response.headers.get("X-WP-Total") ?? 0),
    totalPages: Number(response.headers.get("X-WP-TotalPages") ?? 1),
  };
}

function termsOf(post: WpPost, taxonomy: string): Term[] {
  const groups = post._embedded?.["wp:term"] ?? [];
  return groups
    .flat()
    .filter((term) => term.taxonomy === taxonomy)
    .map((term) => ({
      id: term.id,
      name: decodeEntities(term.name),
      slug: term.slug,
    }));
}

export function cleanContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "a",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "img",
      "figure",
      "figcaption",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          href: attribs.href ?? "",
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}

function mapPost(post: WpPost): Post {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const image = post.jetpack_featured_media_url || media?.source_url || undefined;
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    title: plainText(post.title.rendered),
    excerpt: excerptText(post.excerpt.rendered),
    content: cleanContent(post.content.rendered),
    image,
    imageAlt: media?.alt_text || plainText(post.title.rendered),
    categories: termsOf(post, "category"),
    tags: termsOf(post, "post_tag"),
    description: post.yoast_head_json?.description,
  };
}

export type PostQuery = {
  page?: number;
  perPage?: number;
  categories?: number;
  search?: string;
  exclude?: number;
};

export async function getPosts(query: PostQuery = {}) {
  const result = await wpFetch<WpPost[]>("/posts", {
    _embed: 1,
    page: query.page ?? 1,
    per_page: query.perPage ?? 10,
    categories: query.categories,
    search: query.search,
    exclude: query.exclude,
  });

  return {
    posts: result.data.map(mapPost),
    total: result.total,
    totalPages: result.totalPages,
  };
}

export const getPostBySlug = cache(async (slug: string) => {
  const result = await wpFetch<WpPost[]>("/posts", { slug, _embed: 1 });
  const post = result.data[0];
  return post ? mapPost(post) : null;
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const result = await wpFetch<WpTerm[]>("/categories", { slug });
  const category = result.data[0];
  if (!category) return null;
  return {
    id: category.id,
    name: decodeEntities(category.name),
    slug: category.slug,
    count: category.count ?? 0,
    description: plainText(category.description ?? ""),
    parent: category.parent ?? 0,
  } satisfies Category;
});

export async function getPostsByCategorySlug(slug: string, page = 1, perPage = 12) {
  const category = await getCategoryBySlug(slug);
  if (!category) return null;
  const list = await getPosts({ categories: category.id, page, perPage });
  return { category, ...list };
}

export const getPageBySlug = cache(async (slug: string) => {
  const result = await wpFetch<WpPage[]>("/pages", { slug });
  const page = result.data[0];
  if (!page) return null;
  return {
    id: page.id,
    slug: page.slug,
    title: plainText(page.title.rendered),
    content: cleanContent(page.content.rendered),
  } satisfies Page;
});
