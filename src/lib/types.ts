export type Term = {
  id: number;
  name: string;
  slug: string;
};

export type Post = {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  imageAlt: string;
  categories: Term[];
  tags: Term[];
  description?: string;
};

export type Category = Term & {
  count: number;
  description: string;
  parent: number;
};

export type Page = {
  id: number;
  slug: string;
  title: string;
  content: string;
};
