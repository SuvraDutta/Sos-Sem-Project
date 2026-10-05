import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { GeoFix } from "../types";

/** Real interactive OpenStreetMap via Leaflet. Leaflet is loaded only in the browser. */
export function LocationMap({ fix }: { fix: GeoFix }) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(el.current, { scrollWheelZoom: false });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }
      const ll: [number, number] = [fix.latitude, fix.longitude];
      layerRef.current!.clearLayers();
      L.circle(ll, {
        radius: fix.accuracy,
        color: "#b91c1c",
        weight: 1,
        fillOpacity: 0.08,
      }).addTo(layerRef.current!);
      L.circleMarker(ll, {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#b91c1c",
        fillOpacity: 1,
      })
        .bindTooltip("You are here")
        .addTo(layerRef.current!);
      mapRef.current.setView(ll, 16);
    })();
    return () => {
      cancelled = true;
    };
  }, [fix]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    [],
  );

  return (
    <div
      ref={el}
      role="region"
      aria-label="Map showing your detected location"
      className="h-64 w-full border border-border sm:h-80"
    />
  );
}
