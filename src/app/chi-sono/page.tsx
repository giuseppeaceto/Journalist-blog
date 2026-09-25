import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleBody } from "@/components/article-body";
import { registry, workAreas } from "@/lib/site-content";
import { getPageBySlug } from "@/lib/wordpress";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Chi sono",
  description:
    "Nadia Clementi, giornalista pubblicista di Trento. Interviste, medicina, pensieri e storie.",
};

export const revalidate = 300;

export default async function AboutPage() {
  const page = await getPageBySlug("chi-sono");
  if (!page) notFound();

  return (
    <div>
      <section className="bg-accent-deep pt-24 text-white sm:pt-28">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-8 sm:pb-16 sm:pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-glow">La giornalista</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Trento. Scrivo per passione e curiosità: interviste, medicina, viaggi, cultura e la
            rubrica «Parliamone» su ladigetto.it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12">
        <ArticleBody html={page.content} />
      </section>

      <section className="border-y border-line/80">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden bg-accent px-5 py-12 text-white sm:px-8 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-10 size-64 rounded-full bg-glow/30 blur-3xl"
            />
            <p className="relative text-xs font-medium uppercase tracking-[0.22em] text-white/70">
              {registry.title}
            </p>
            <p className="relative mt-2 font-display text-6xl font-semibold tracking-tight">
              {registry.year}
            </p>
            <div className="relative mt-8 overflow-hidden bg-white/10 p-3 ring-1 ring-white/20">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={registry.image}
                  alt={registry.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                />
              </div>
            </div>
            <blockquote className="relative mt-8 font-display text-xl leading-snug">
              “{registry.quote}”
            </blockquote>
            <p className="relative mt-3 text-sm text-white/65">{registry.attribution}</p>
          </div>

          <div className="bg-white/50 px-5 py-12 sm:px-8 sm:py-14">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Di cosa mi occupo</h2>
            <ul className="mt-6 space-y-6">
              {workAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <li key={area.title} className="flex gap-4 border-t border-line pt-5 first:border-0 first:pt-0">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-glow/50 text-accent">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight">
                        {area.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{area.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/contatti"
              className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Contattami
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
