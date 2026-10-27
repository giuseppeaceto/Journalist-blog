"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map as MapLibreMap,
  NavigationControl,
  Popup,
  setWorkerUrl,
  type GeoJSONSource,
  type Map as MapLibreMapType,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection, Point } from "geojson";
import { Sparkles } from "lucide-react";
import { specialtyIcons } from "@/lib/site-content";
import type { MedicalVoice } from "@/lib/medical-voices";

// Basemap CARTO Positron: stile vettoriale leggero (55 layer, senza 3D né rilievo
// raster) invece di OpenFreeMap Liberty (111 layer). Resta MapLibre: cambia solo
// la sorgente dello stile.
const STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const SOURCE_ID = "medical-voices";
const CIRCLE_LAYER_ID = "medical-voices-circles";
const HALO_LAYER_ID = "medical-voices-halo";

type MedicalVoicesMapProps = {
  voices: MedicalVoice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  resetViewTrigger?: number;
};

type VoiceProperties = {
  id: string;
  name: string;
  institution: string;
  city: string;
};

/**
 * I ~110 pin sono disegnati come un unico layer vettoriale su GPU invece che come
 * altrettanti elementi DOM: MapLibre riscriveva il transform di ogni marker a ogni
 * frame di pan/zoom, causando gli scatti su mobile.
 */
function toFeatureCollection(voices: MedicalVoice[]): FeatureCollection<Point, VoiceProperties> {
  return {
    type: "FeatureCollection",
    features: voices.map((voice) => ({
      type: "Feature",
      id: voice.id,
      properties: {
        id: voice.id,
        name: voice.name,
        institution: voice.institution,
        city: voice.city,
      },
      geometry: { type: "Point", coordinates: [voice.lng, voice.lat] },
    })),
  };
}

export function MedicalVoicesMap({ voices, selectedId, onSelect, resetViewTrigger }: MedicalVoicesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMapType | null>(null);
  const readyRef = useRef(false);
  const popupRef = useRef<Popup | null>(null);
  const openPopupIdRef = useRef<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const onSelectRef = useRef(onSelect);
  const voicesRef = useRef(voices);
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    voicesRef.current = voices;
  }, [voices]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  // Icona della specialità mostrata solo sul pin attivo: un unico elemento DOM
  // proiettato sulla mappa, quindi nessun impatto sulle performance dei pin GPU.
  const selectedVoice = voices.find((voice) => voice.id === selectedId) ?? null;
  const ActiveIcon = selectedVoice
    ? specialtyIcons[selectedVoice.specialtySlugs[0]] ?? Sparkles
    : null;
  const activeIconRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const map = mapRef.current;
    const element = activeIconRef.current;
    if (!map || !element || !selectedVoice) return;

    const place = () => {
      const point = map.project([selectedVoice.lng, selectedVoice.lat]);
      element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
    };

    place();
    map.on("move", place);
    return () => {
      map.off("move", place);
    };
  }, [selectedVoice, mapReady]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLE_URL,
      center: [11.5, 43.8],
      zoom: 5.2,
      // Solo l'Italia: niente copie del mondo e nessun crossfade dei tile -> meno lavoro per frame.
      renderWorldCopies: false,
      fadeDuration: 0,
      attributionControl: { compact: true },
    });

    // In basso a destra: in alto finirebbero sotto l'header fisso del sito durante lo scroll.
    map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;
    setMapReady(true);

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(containerRef.current);

    // Popup condivisa e creata solo al primo click: evita di costruire 100+ nodi
    // che spesso non vengono mai aperti.
    const openPopup = (voice: MedicalVoice) => {
      if (!popupRef.current) {
        popupRef.current = new Popup({
          offset: 30,
          closeButton: false,
          maxWidth: "240px",
          className: "medical-map-popup",
        });
      }

      // Click sullo stesso pin = chiude (come il comportamento nativo di MapLibre).
      if (openPopupIdRef.current === voice.id) {
        popupRef.current.remove();
        openPopupIdRef.current = null;
        return;
      }

      popupRef.current
        .setLngLat([voice.lng, voice.lat])
        .setHTML(
          `<strong>${escapeHtml(voice.name)}</strong><br/><span>${escapeHtml(voice.institution)} · ${escapeHtml(voice.city)}</span>`,
        )
        .addTo(map);
      openPopupIdRef.current = voice.id;
    };

    const clearHover = () => {
      const id = hoveredIdRef.current;
      if (id !== null) {
        map.setFeatureState({ source: SOURCE_ID, id }, { hover: false });
        hoveredIdRef.current = null;
      }
    };

    const handleLoad = () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: toFeatureCollection(voicesRef.current),
        // Rende `feature.id` uguale a `properties.id`, requisito per il feature-state.
        promoteId: "id",
      });

      // Alone del pin attivo: raggio 0 quando nessun pin è selezionato.
      map.addLayer({
        id: HALO_LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": ["case", ["boolean", ["feature-state", "active"], false], 34, 0],
          "circle-color": "rgba(194, 65, 12, 0.22)",
          "circle-blur": 0.5,
        },
      });

      // Pin base (non selezionati): il pin attivo è disegnato come badge DOM sopra
      // la mappa, così non viene mai coperto dagli altri pin.
      map.addLayer({
        id: CIRCLE_LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            8,
            6,
          ],
          "circle-color": "#c2410c",
          "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 3, 2.4],
          "circle-stroke-color": "#fffcf8",
        },
      });

      readyRef.current = true;

      // Un unico handler: se il click cade su un pin lo gestiamo qui, altrimenti
      // chiudiamo la popup. Così non serve coordinare due listener concorrenti.
      map.on("click", (event) => {
        const hit = map.queryRenderedFeatures(event.point, { layers: [CIRCLE_LAYER_ID] })[0];
        if (hit) {
          const id = hit.properties?.id as string | undefined;
          const voice = id ? voicesRef.current.find((item) => item.id === id) : undefined;
          if (voice) {
            onSelectRef.current(voice.id);
            openPopup(voice);
          }
          return;
        }

        popupRef.current?.remove();
        openPopupIdRef.current = null;
      });

      map.on("mousemove", CIRCLE_LAYER_ID, (event) => {
        if (!event.features?.length) return;
        map.getCanvas().style.cursor = "pointer";

        const id = event.features[0].properties?.id as string | undefined;
        if (!id || hoveredIdRef.current === id) return;

        clearHover();
        hoveredIdRef.current = id;
        map.setFeatureState({ source: SOURCE_ID, id }, { hover: true });
      });

      map.on("mouseleave", CIRCLE_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
        clearHover();
      });

      if (selectedIdRef.current) {
        activeIdRef.current = selectedIdRef.current;
        map.setFeatureState({ source: SOURCE_ID, id: selectedIdRef.current }, { active: true });
      }
    };

    if (map.isStyleLoaded()) {
      handleLoad();
    } else {
      map.once("load", handleLoad);
    }

    return () => {
      resizeObserver.disconnect();
      popupRef.current?.remove();
      popupRef.current = null;
      readyRef.current = false;
      hoveredIdRef.current = null;
      activeIdRef.current = null;
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
      // setData conserva il feature-state delle feature con lo stesso id: spegniamo
      // l'hover prima di sostituire i dati per non lasciare pin "accesi" a vuoto.
      if (hoveredIdRef.current !== null) {
        map.setFeatureState({ source: SOURCE_ID, id: hoveredIdRef.current }, { hover: false });
        hoveredIdRef.current = null;
      }
      map.getCanvas().style.cursor = "";
      source?.setData(toFeatureCollection(voices));

      if (voices.length === 0) return;

      if (voices.length === 1) {
        map.easeTo({ center: [voices[0].lng, voices[0].lat], zoom: 10, duration: 500 });
        return;
      }

      const lngs = voices.map((v) => v.lng);
      const lats = voices.map((v) => v.lat);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 56, maxZoom: 11, duration: 600 },
      );
    };

    if (readyRef.current) {
      apply();
    } else {
      map.once("load", apply);
    }
  }, [voices]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyActive = () => {
      const previous = activeIdRef.current;
      if (previous && previous !== selectedId) {
        map.setFeatureState({ source: SOURCE_ID, id: previous }, { active: false });
      }
      activeIdRef.current = selectedId;
      if (selectedId) {
        map.setFeatureState({ source: SOURCE_ID, id: selectedId }, { active: true });
      }
    };

    if (readyRef.current) {
      applyActive();
    } else {
      map.once("load", applyActive);
    }

    if (!selectedId) return;
    const voice = voices.find((item) => item.id === selectedId);
    if (!voice) return;
    map.easeTo({
      center: [voice.lng, voice.lat],
      zoom: Math.max(map.getZoom(), 8.5),
      duration: 500,
    });
  }, [selectedId, voices]);

  useEffect(() => {
    if (!resetViewTrigger) return;
    const map = mapRef.current;
    if (!map || voices.length === 0) return;

    if (voices.length === 1) {
      map.easeTo({ center: [voices[0].lng, voices[0].lat], zoom: 10, duration: 500 });
      return;
    }

    const lngs = voices.map((v) => v.lng);
    const lats = voices.map((v) => v.lat);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 70, maxZoom: 11, duration: 600 },
    );
  }, [resetViewTrigger, voices]);

  return (
    <div className="medical-map relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* Pin attivo: badge sopra la mappa, sempre in primo piano */}
      {selectedVoice && ActiveIcon && (
        <div
          ref={activeIconRef}
          style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
          className="pointer-events-none absolute left-0 top-0 z-10"
        >
          <span className="flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white ring-4 ring-white shadow-lg">
            <ActiveIcon className="size-6" aria-hidden />
          </span>
        </div>
      )}
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
