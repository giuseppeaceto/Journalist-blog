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
};

export function MedicalVoicesMap({ voices, selectedId, onSelect }: MedicalVoicesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMapType | null>(null);
  const markersRef = useRef<Map<string, { marker: Marker; element: HTMLButtonElement }>>(new Map());
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
      attributionControl: { compact: true },
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    const markers = markersRef.current;

    return () => {
      markers.forEach(({ marker }) => marker.remove());
      markers.clear();
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

      voices.forEach((voice) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "medical-map-pin";
        el.setAttribute("aria-label", `${voice.name}, ${voice.city}`);
        if (voice.id === selectedIdRef.current) {
          el.dataset.active = "true";
        }
        el.addEventListener("click", (event) => {
          event.stopPropagation();
          onSelectRef.current(voice.id);
        });

        const popup = new Popup({
          offset: 18,
          closeButton: false,
          maxWidth: "240px",
          className: "medical-map-popup",
        }).setHTML(
          `<strong>${escapeHtml(voice.name)}</strong><br/><span>${escapeHtml(voice.institution)} · ${escapeHtml(voice.city)}</span>`,
        );

        const marker = new Marker({ element: el, anchor: "bottom" })
          .setLngLat([voice.lng, voice.lat])
          .setPopup(popup)
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

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl ring-1 ring-line">
      <div ref={containerRef} className="h-full min-h-[320px] w-full" />
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
