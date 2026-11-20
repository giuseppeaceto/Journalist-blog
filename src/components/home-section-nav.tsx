import Link from "next/link";
import {
  BookOpen,
  Compass,
  MapPinned,
  NotebookPen,
  Plane,
  Stethoscope,
  Theater,
  Users,
} from "lucide-react";

const destinations = [
  { label: "Medicina e ricerca", href: "/medicina", icon: Stethoscope },
  { label: "Cultura e società", href: "/rubrica/cultura", icon: Theater },
  { label: "Storie e protagonisti", href: "/articoli", icon: Users },
  { label: "Viaggi", href: "/rubrica/viaggi", icon: Plane },
  { label: "Mappa delle voci", href: "/medicina/mappa", icon: MapPinned },
  { label: "Diario", href: "/diario", icon: NotebookPen },
  { label: "Pubblicazioni", href: "#pubblicazioni", icon: BookOpen },
  { label: "Il mio percorso", href: "/chi-sono", icon: Compass },
];

export function HomeSectionNav() {
  return (
    <nav
      aria-label="Esplora le sezioni"
      className="hidden sm:block mx-auto max-w-6xl px-5 pt-5 sm:pt-7"
    >
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {destinations.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="group flex h-full min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-line/80 bg-card/80 px-2 py-3 text-center transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-card"
            >
              <Icon
                className="size-5 text-accent transition-transform group-hover:scale-110"
                aria-hidden
              />
              <span className="text-xs font-medium leading-tight text-ink sm:text-sm">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
