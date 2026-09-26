"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { Hotspot } from "@/lib/api";

interface Point { x: number; y: number }

/** MapContainer only applies center/zoom on first mount (react-leaflet quirk) — without this,
 *  switching district leaves the map (and every projected hotspot point) parked on whatever
 *  district loaded first. */
function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom, { animate: false }); }, [center, zoom, map]);
  return null;
}

function PointTracker({ hotspots, onPoints }: { hotspots: Hotspot[]; onPoints: (pts: Record<string, Point>) => void }) {
  const map = useMap();
  useEffect(() => {
    function recompute() {
      const pts: Record<string, Point> = {};
      hotspots.forEach((h) => {
        const p = map.latLngToContainerPoint([h.lat, h.lng]);
        pts[h.id] = { x: p.x, y: p.y };
      });
      onPoints(pts);
    }
    recompute();
    const t1 = setTimeout(recompute, 200);
    const t2 = setTimeout(recompute, 600);
    map.on("resize move zoom", recompute);
    const ro = new ResizeObserver(() => { map.invalidateSize(); recompute(); });
    ro.observe(map.getContainer());
    return () => {
      map.off("resize move zoom", recompute);
      ro.disconnect();
      clearTimeout(t1); clearTimeout(t2);
    };
  }, [hotspots, map, onPoints]);
  return null;
}

export default function SatelliteCompareMap({ center, zoom, hotspots, onPoints }: { center: [number, number]; zoom: number; hotspots: Hotspot[]; onPoints: (pts: Record<string, Point>) => void }) {
  return (
    <MapContainer center={center} zoom={zoom} zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false} boxZoom={false} keyboard={false} attributionControl className="h-full w-full">
      <TileLayer attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      <Recenter center={center} zoom={zoom} />
      <PointTracker hotspots={hotspots} onPoints={onPoints} />
    </MapContainer>
  );
}
