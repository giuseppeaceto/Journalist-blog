import {
  Award,
  Bone,
  BookOpen,
  Brain,
  Compass,
  Dna,
  HeartPulse,
  Mic2,
  NotebookPen,
  PenLine,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const workAreas: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Giornalismo e storytelling",
    description:
      "Racconto il mondo attraverso parole che informano, emozionano e fanno riflettere. Dai reportage agli editoriali, trasformo i fatti in storie con uno sguardo attento all’attualità.",
    icon: PenLine,
  },
  {
    title: "Interviste e approfondimenti",
    description:
      "Ogni storia ha una voce che merita di essere ascoltata. Do spazio a persone, idee ed esperienze che aprono prospettive inedite su medicina, società e cultura.",
    icon: Mic2,
  },
  {
    title: "Scrittura e narrativa",
    description:
      "Dalla narrativa alla saggistica: esploro emozioni, relazioni e temi universali, dando vita a storie che coinvolgono e lasciano il segno.",
    icon: NotebookPen,
  },
  {
    title: "Reportage e viaggi",
    description:
      "Viaggiare con occhi curiosi e taccuino alla mano. Racconto luoghi, culture e tradizioni attraverso reportage che catturano l’anima dei territori e l’autenticità delle persone che li abitano.",
    icon: Compass,
  },
];

export const book = {
  title: "Oltre l’Umano",
  subtitle: "Pubblicazioni",
  description:
    "L’Intelligenza Artificiale è solo uno strumento sofisticato o rappresenta una nuova forma di intelligenza con cui l’umanità dovrà confrontarsi? Un dialogo inedito con ChatGPT sul confine tra uomo e macchina, empatia e simulazione, realtà e finzione.",
  href: "https://www.nadiaclementi.it/",
  image: "/oltre-lumano.jpg",
  imageAlt: "Copertina del libro Oltre l’Umano di Nadia Clementi",
  icon: BookOpen,
};

export const award = {
  label: "Premi e riconoscimenti",
  title: "Premiata per Un amore in piazza",
  description:
    "Un amore in piazza di Nadia Clementi e Daniela Larentis ha vinto il Premio Antonio Semeria: un romanzo capace di emozionare e coinvolgere, tra sentimenti, passioni e destini intrecciati.",
  href: "/articolo/daniela-larentis-e-nadia-clementi-premiate-per-il-loro-un-amore-in-piazza",
  image: "/premio-semeria.jpg",
  imageAlt: "Premiazione del Premio Antonio Semeria per Un amore in piazza",
  icon: Award,
};

export const registry = {
  title: "Albo Giornalisti Pubblicisti",
  year: "2025",
  quote: "Nadia sa come trasformare le parole in emozioni, rendendo ogni storia unica e avvincente.",
  attribution: "Carla – Lettrice",
  image: "/tesserino-albo.jpg",
  imageAlt: "Tesserino dell’Albo dei Giornalisti Pubblicisti",
};

export const testimonials = [
  {
    quote:
      "Ogni intervista con Nadia è un viaggio, un’opportunità di scoprire nuove prospettive e approfondire temi con una visione fresca e coinvolgente.",
    attribution: "Davide – Lettore",
  },
  {
    quote:
      "Leggere i suoi articoli è come essere trasportati in un altro mondo: ricco di sfumature, verità e riflessioni.",
    attribution: "Rebecca – Lettrice",
  },
] as const;

export const encounter = {
  title: "Ispirazione e conoscenza: una lezione da Piero Angela",
  text: "Quella volta che incontrai Piero Angela ho capito quanto sia importante l’impegno nella diffusione della conoscenza. La sua curiosità e il rispetto per la scienza mi hanno ispirata a credere ancora di più nel potere delle parole. La verità, disse, è un bene prezioso che va custodito e condiviso: ogni domanda è il primo passo verso una comprensione più profonda.",
  image: "/piero-angela.jpg",
  imageAlt: "Nadia Clementi con Piero Angela",
};

export const sitePaths = [
  { href: "/rubrica/pensieri", label: "Pensieri", icon: Sparkles },
  { href: "/medicina", label: "Medicina", icon: Stethoscope },
  { href: "/chi-sono", label: "Chi sono", icon: Users },
  { href: "/contatti", label: "Contatti", icon: Mic2 },
] as const;

export const specialtyIcons: Record<string, LucideIcon> = {
  oncologia: HeartPulse,
  genetica: Dna,
  "malattie-rare": Sparkles,
  reumatologia: Bone,
  neurologia: Brain,
  "salute-mentale": Brain,
  prevenzione: HeartPulse,
  fisioterapia: Stethoscope,
};
