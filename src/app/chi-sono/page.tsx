import type { Metadata } from "next";
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
      <section className="bg-accent-deep text-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
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

      <section className="border-y border-line/80 bg-white/50">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="rounded-3xl bg-accent-deep p-6 text-white sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-glow">
                {registry.title}
              </p>
              <p className="mt-2 font-display text-5xl font-semibold tracking-tight">
                {registry.year}
              </p>
              <blockquote className="mt-6 font-display text-xl leading-snug">
                “{registry.quote}”
              </blockquote>
              <p className="mt-3 text-sm text-white/60">{registry.attribution}</p>
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">Di cosa mi occupo</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {workAreas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <li key={area.title} className="rounded-2xl bg-card p-4 ring-1 ring-line">
                      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-glow/50 text-accent">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                        {area.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{area.description}</p>
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
        </div>
      </section>
    </div>
  );
}
