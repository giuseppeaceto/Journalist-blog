"use client";

import { useEffect, useRef } from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
  type Map as MapLibreMapType,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MedicalVoice } from "@/lib/medical-voices";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

type MedicalVoicesMapProps = {
  voices: MedicalVoice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  resetViewTrigger?: number;
};

export function MedicalVoicesMap({ voices, selectedId, onSelect, resetViewTrigger }: MedicalVoicesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMapType | null>(null);
  const markersRef = useRef<Map<string, { marker: Marker; element: HTMLButtonElement }>>(new Map());
  const popupRef = useRef<Popup | null>(null);
  const openPopupIdRef = useRef<string | null>(null);
  const onSelectRef = useRef(onSelect);
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

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
    const markers = markersRef.current;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      markers.forEach(({ marker }) => marker.remove());
      markers.clear();
      popupRef.current?.remove();
      popupRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const renderMarkers = () => {
      const markers = markersRef.current;
      markers.forEach(({ marker }) => marker.remove());
      markers.clear();
      popupRef.current?.remove();
      openPopupIdRef.current = null;

      voices.forEach((voice) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "medical-map-pin";
        el.setAttribute("aria-label", `${voice.name}, ${voice.city}`);
        if (voice.id === selectedIdRef.current) {
          el.dataset.active = "true";
        }
        // Il pallino è un figlio: MapLibre scrive il transform sul wrapper per
        // posizionare il marker, così lo scaling di hover/attivo resta indipendente.
        const dot = document.createElement("span");
        dot.className = "medical-map-pin-dot";
        dot.setAttribute("aria-hidden", "true");
        el.appendChild(dot);
        el.addEventListener("click", (event) => {
          event.stopPropagation();
          onSelectRef.current(voice.id);

          // La popup è condivisa e creata solo al primo click: evita di costruire
          // 100+ popup DOM (e relativi nodi) che spesso non vengono mai aperti.
          if (!popupRef.current) {
            popupRef.current = new Popup({
              offset: 18,
              closeButton: false,
              maxWidth: "240px",
              className: "medical-map-popup",
            });
            map.on("click", () => {
              popupRef.current?.remove();
              openPopupIdRef.current = null;
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
        });

        const marker = new Marker({ element: el, anchor: "bottom" })
          .setLngLat([voice.lng, voice.lat])
          .addTo(map);

        markers.set(voice.id, { marker, element: el });
      });

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

    if (map.isStyleLoaded()) {
      renderMarkers();
    } else {
      map.once("load", renderMarkers);
    }
  }, [voices]);

  useEffect(() => {
    markersRef.current.forEach(({ element }, id) => {
      if (id === selectedId) {
        element.dataset.active = "true";
      } else {
        delete element.dataset.active;
      }
    });

    const map = mapRef.current;
    if (!map || !selectedId) return;
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
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
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
