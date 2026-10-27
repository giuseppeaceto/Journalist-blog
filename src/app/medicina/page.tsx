import type { Metadata } from "next";
import Link from "next/link";
import { specialtyIcons } from "@/lib/site-content";
import { medicineRubrics, specialties } from "@/lib/specialties";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Medicina",
  description: "Specialità e rubriche di medicina del blog di Nadia Clementi.",
};

export default function MedicinaPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-28 sm:pb-14 sm:pt-32">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Archivio</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
        Medicina
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Le specialità raccolgono i pezzi per area clinica. Le rubriche seguono il modo in cui gli
        articoli nascono: interviste, ricerca, storie.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Specialità</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((item) => {
            const Icon = specialtyIcons[item.slug] ?? Sparkles;
            return (
              <li key={item.slug}>
                <Link
                  href={`/medicina/${item.slug}`}
                  className="block h-full rounded-2xl bg-card p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-accent/50"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-glow/50 text-accent">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <p className="mt-3 font-display text-2xl font-semibold tracking-tight">{item.name}</p>
                  <p className="mt-2 text-muted">{item.description}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Rubriche</h2>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {medicineRubrics.map((item) => (
            <li key={item.slug}>
              <Link href={`/rubrica/${item.slug}`} className="block py-4 hover:text-accent">
                <span className="font-display text-2xl font-semibold tracking-tight">{item.name}</span>
                <span className="mt-1 block text-sm text-muted">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
