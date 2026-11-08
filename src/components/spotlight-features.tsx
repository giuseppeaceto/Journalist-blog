import { award, book } from "@/lib/site-content";
import { HomeEditorialCard } from "@/components/home-editorial-card";

export function SpotlightFeatures() {
  return (
    <section id="pubblicazioni" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-10 sm:py-14">
      <div className="flex items-center gap-4">
        <h2 className="shrink-0 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Altre storie, altri percorsi
        </h2>
        <span aria-hidden className="h-px flex-1 bg-accent/50" />
      </div>
      <ul className="mt-5 grid gap-4 md:grid-cols-3">
        <li>
          <HomeEditorialCard
            title="Le mie pubblicazioni"
            description={book.description}
            href={book.href}
            action="Scopri di più"
            image={book.image}
            imageAlt={book.imageAlt}
            external
            layout="horizontal"
          />
        </li>
        <li>
          <HomeEditorialCard
            title="Diario"
            description="Pensieri, ricordi e storie personali raccolti nel tempo."
            href="/diario"
            action="Vai al Diario"
            image="/Cover/diario.jpg"
            imageAlt="Un quaderno aperto durante la scrittura"
            layout="horizontal"
          />
        </li>
        <li>
          <HomeEditorialCard
            title="Il mio percorso"
            description="Giornalismo, pubblicazioni e riconoscimenti: le tappe che hanno dato forma al mio lavoro."
            href="/chi-sono"
            action="Scopri il percorso"
            image={award.image}
            imageAlt={award.imageAlt}
            layout="horizontal"
          />
        </li>
      </ul>
    </section>
  );
}
