import Link from "next/link";
import { beyondRubrics, specialties } from "@/lib/specialties";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-accent-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight">Nadia Clementi</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            Giornalista pubblicista. Racconti, interviste e sguardi curiosi sul mondo.
          </p>
          <p className="mt-5 text-xs text-white/40">© {new Date().getFullYear()} NadiaClementi.it</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Rubriche</p>
          <ul className="mt-3 space-y-1.5 text-sm text-white/75">
            <li>
              <Link href="/rubrica/pensieri" className="hover:text-glow">
                Pensieri
              </Link>
            </li>
            <li>
              <Link href="/rubrica/interviste-ai-medici" className="hover:text-glow">
                Interviste ai medici
              </Link>
            </li>
            <li>
              <Link href="/medicina" className="hover:text-glow">
                Medicina
              </Link>
            </li>
            {beyondRubrics
              .filter((item) => item.slug !== "pensieri")
              .slice(0, 4)
              .map((item) => (
                <li key={item.slug}>
                  <Link href={`/rubrica/${item.slug}`} className="hover:text-glow">
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Il sito</p>
          <ul className="mt-3 space-y-1.5 text-sm text-white/75">
            <li>
              <Link href="/chi-sono" className="hover:text-glow">
                Chi sono
              </Link>
            </li>
            <li>
              <Link href="/contatti" className="hover:text-glow">
                Contatti
              </Link>
            </li>
            {specialties.slice(0, 4).map((item) => (
              <li key={item.slug}>
                <Link href={`/medicina/${item.slug}`} className="hover:text-glow">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
