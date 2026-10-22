import type { Metadata } from "next";
import { MedicalVoicesExplorer } from "@/components/medical-voices-explorer";
import { medicalVoices } from "@/lib/medical-voices";

export const metadata: Metadata = {
  title: "Mappa delle voci mediche",
  description:
    "Geografia editoriale interattiva delle interviste ai medici di Nadia Clementi: oltre 100 specialisti e strutture sanitarie raccontati nei suoi articoli.",
};

export default function MedicinaMappaPage() {
  return (
    <>
      {/* Preconnect al provider di tile/stile: risparmia l'handshake prima che la mappa parta. */}
      <link rel="preconnect" href="https://basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://basemaps.cartocdn.com" />

      {/* Layout "mappa-app": la mappa occupa l'intera viewport, l'header flotta
          sopra e i pannelli di ricerca/elenco sono floating. */}
      <div className="h-dvh w-full">
        <MedicalVoicesExplorer voices={medicalVoices} />
      </div>
    </>
  );
}
