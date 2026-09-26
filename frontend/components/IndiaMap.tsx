"use client";

import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { Hotspot } from "@/lib/api";

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom, { animate: true }); }, [center, map, zoom]);
  return null;
}

function hotspotIcon() {
  return L.divIcon({ className: "custom-hotspot", html: '<span style="display:block;width:14px;height:14px;border-radius:50%;background:#A95346;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.28)"></span>', iconSize: [14, 14], iconAnchor: [7, 7] });
}

export default function IndiaMap({ center, zoom, hotspots }: { center: [number, number]; zoom: number; hotspots: Hotspot[] }) {
  return <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full min-h-[380px] w-full">
    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Recenter center={center} zoom={zoom} />
    {hotspots.map((hotspot, index) => <span key={hotspot.id}>
      <Marker position={[hotspot.lat, hotspot.lng]} icon={hotspotIcon()}><Popup><div className="min-w-[180px]"><div className="mono text-[9px] uppercase tracking-[.12em] text-[#A95346]">Detected hotspot / 0{index + 1}</div><div className="mt-1 font-semibold">{hotspot.name}</div><div className="mt-1 text-xs text-[#4E5C55]">{hotspot.change}</div><div className="mt-2 flex justify-between border-t border-[#d8e1db] pt-2 text-[10px]"><span>{hotspot.areaHa.toLocaleString()} ha</span><span>{hotspot.confidence}% confidence</span></div></div></Popup></Marker>
      <Circle center={[hotspot.lat, hotspot.lng]} radius={hotspot.areaHa > 1000 ? 1200 : 550} pathOptions={{ color: "#A95346", fillColor: "#A95346", fillOpacity: .11, weight: 1.5, dashArray: "4 5" }} />
    </span>)}
  </MapContainer>;
}