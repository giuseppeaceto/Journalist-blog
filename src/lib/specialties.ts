export type Specialty = {
  slug: string;
  name: string;
  description: string;
  categorySlug?: string;
  search?: string;
};

export const specialties: Specialty[] = [
  {
    slug: "oncologia",
    name: "Oncologia",
    description: "Tumori, terapie e prevenzione, raccontati da chi li studia e li cura.",
    categorySlug: "oncologia",
  },
  {
    slug: "genetica",
    name: "Genetica",
    description: "DNA, test e malattie ereditarie spiegati senza formule inutili.",
    categorySlug: "genetica",
  },
  {
    slug: "malattie-rare",
    name: "Malattie rare",
    description: "Diagnosi difficili, famiglie e ricerca sulle patologie meno conosciute.",
    categorySlug: "malattie-rare",
  },
  {
    slug: "reumatologia",
    name: "Reumatologia",
    description: "Articolazioni, ossa e malattie infiammatorie che non vanno sottovalutate.",
    search: "reumat",
  },
  {
    slug: "neurologia",
    name: "Neurologia",
    description: "Memoria, Alzheimer e le malattie del sistema nervoso.",
    search: "Alzheimer",
  },
  {
    slug: "salute-mentale",
    name: "Salute mentale",
    description: "Ansia, depressione e il peso dello stress nella vita di tutti i giorni.",
    search: "depressione",
  },
  {
    slug: "prevenzione",
    name: "Prevenzione",
    description: "Come proteggere la salute prima che la malattia si faccia vedere.",
    categorySlug: "prevenzione",
  },
  {
    slug: "fisioterapia",
    name: "Fisioterapia",
    description: "Riabilitazione e movimento, dopo un intervento o una diagnosi.",
    categorySlug: "fisioterapia",
  },
];

export const medicineRubrics = [
  {
    slug: "interviste-ai-medici",
    name: "Interviste ai medici",
    description: "Le conversazioni con chi cura, ricerca e dirige i reparti.",
  },
  {
    slug: "ricerca",
    name: "Ricerca",
    description: "Laboratori, studi e scoperte che cambiano il modo di curare.",
  },
  {
    slug: "storie-di-malati",
    name: "Storie di malati",
    description: "Le voci di chi convive con una diagnosi.",
  },
  {
    slug: "biotecnologie",
    name: "Biotecnologie",
    description: "Scienza applicata alla salute, dai laboratori alle persone.",
  },
] as const;

export const beyondRubrics = [
  { slug: "pensieri", name: "Pensieri" },
  { slug: "societa", name: "Società" },
  { slug: "cultura", name: "Cultura" },
  { slug: "eventi", name: "Eventi" },
  { slug: "viaggi", name: "Viaggi" },
  { slug: "libri", name: "Libri" },
] as const;

export function getSpecialty(slug: string) {
  return specialties.find((item) => item.slug === slug);
}
