import type { Metadata } from "next";
import Link from "next/link";
import { MedicalVoicesExplorer } from "@/components/medical-voices-explorer";
import { medicalVoices } from "@/lib/medical-voices";

export const metadata: Metadata = {
  title: "Mappa delle voci mediche",
  description:
    "Geografia editoriale delle interviste ai medici di Nadia Clementi: specialisti e strutture citati negli articoli, non un elenco di raccomandazioni cliniche.",
};

export default function MedicinaMappaPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-28 sm:pb-14 sm:pt-32">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Medicina</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
        Mappa delle voci
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        Dove lavorano — o hanno lavorato al momento dell’intervista — le persone raccontate nella
        rubrica. Ogni pin porta all’articolo: è una geografia delle fonti, non una guida per
        scegliere il medico.
      </p>

      <aside className="mt-6 max-w-2xl rounded-2xl bg-glow/20 px-5 py-4 text-sm leading-relaxed text-ink/85 ring-1 ring-line">
        <p>
          Le schede raccolgono le voci estratte dalle interviste pubblicate (con revisione sulle più
          recenti). Affiliazioni e sedi possono cambiare nel tempo: verifica sempre presso la
          struttura.{" "}
          <Link href="/rubrica/interviste-ai-medici" className="font-medium text-accent hover:underline">
            Torna alle interviste
          </Link>
          {" · "}
          <Link href="/medicina" className="font-medium text-accent hover:underline">
            Archivio medicina
          </Link>
        </p>
      </aside>

      <MedicalVoicesExplorer voices={medicalVoices} />
    </div>
  );
}
