"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  /** Pagina di destinazione se non c'è cronologia interna su cui tornare. */
  href?: string;
  label?: string;
};

export function BackButton({ href = "/", label = "Indietro" }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // Se l'utente è arrivato navigando dentro il sito torna alla pagina precedente,
    // altrimenti (link diretto/condiviso) va alla pagina padre indicata.
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(href);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:text-accent"
    >
      <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
      {label}
    </button>
  );
}
