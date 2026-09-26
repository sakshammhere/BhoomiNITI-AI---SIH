"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MoveHorizontal } from "lucide-react";
import type { Hotspot, LandClass } from "@/lib/api";

const classColors: Record<LandClass, string> = { Agriculture: "#B8791A", "Built-up": "#A95346", Forest: "#3E7A4C", "Water Body": "#2A5EA8", Other: "#87958C" };

function hashAngle(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 9) - 4; // -4..4 deg
}

interface Point { x: number; y: number }

const MapPhoto = dynamic(() => import("./SatelliteCompareMap"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-[#1c2420] text-xs text-white/60">Loading satellite basemap…</div>
});

export default function SatelliteCompare({ center, zoom, hotspots, yearFrom, yearTo }: { center: [number, number]; zoom: number; hotspots: Hotspot[]; yearFrom: number; yearTo: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [points, setPoints] = useState<Record<string, Point>>({});

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.min(96, Math.max(4, next)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [dragging, setFromClientX]);

  return (
    <div className="border-t border-[var(--line)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="mono flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--gis)]">Satellite comparison · drag to reveal change</div>
        <span className="mono text-[10px] text-[var(--muted)]">{yearFrom} vs {yearTo}</span>
      </div>

      <div
        ref={containerRef}
        onPointerDown={(e) => { setDragging(true); setFromClientX(e.clientX); }}
        className="relative isolate h-[420px] w-full select-none overflow-hidden border border-[var(--line)] bg-[#1c2420]"
        style={{ cursor: dragging ? "grabbing" : "ew-resize" }}
      >
        <MapPhoto center={center} zoom={zoom} onPoints={setPoints} hotspots={hotspots} />

        {/* before annotations — visible left of the handle */}
        <div className="pointer-events-none absolute inset-0 z-[1000]" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          {hotspots.map((h) => points[h.id] && (
            <div key={h.id} className="absolute flex items-center justify-center border-2" style={{ left: points[h.id].x - 65, top: points[h.id].y - 50, width: 130, height: 100, borderColor: classColors[h.classFrom], backgroundColor: `${classColors[h.classFrom]}33`, transform: `rotate(${hashAngle(h.id)}deg)` }} />
          ))}
        </div>

        {/* after annotations — visible right of the handle */}
        <div className="pointer-events-none absolute inset-0 z-[1000]" style={{ clipPath: `inset(0 0 0 ${pct}%)` }}>
          {hotspots.map((h) => points[h.id] && (
            <div key={h.id} className="absolute flex items-center justify-center border-2" style={{ left: points[h.id].x - 65, top: points[h.id].y - 50, width: 130, height: 100, borderColor: classColors[h.classTo], backgroundColor: `${classColors[h.classTo]}33`, transform: `rotate(${hashAngle(h.id)}deg)` }}>
              <span className="h-14 w-14 rounded-full border-2 border-dashed" style={{ borderColor: classColors[h.classTo] }} />
            </div>
          ))}
        </div>

        {/* fixed labels — never clipped */}
        <div className="pointer-events-none absolute inset-0 z-[1000]">
          <span className="absolute left-3 top-3 rounded bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">{yearFrom} · Baseline (estimated)</span>
          <span className="absolute right-3 top-3 rounded bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">{yearTo} · Current photo</span>
          {hotspots.map((h) => points[h.id] && (
            <span key={h.id} className="absolute -translate-x-1/2 rounded bg-black/70 px-2 py-0.5 text-[9px] font-medium text-white" style={{ left: points[h.id].x, top: points[h.id].y - 62 }}>{h.name}</span>
          ))}
        </div>

        {/* drag handle */}
        <div className="pointer-events-none absolute inset-y-0 z-[1000]" style={{ left: `${pct}%` }}>
          <div className="h-full w-[2px] bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,.35)]" />
          <div className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#12181a] text-white shadow-lg">
            <MoveHorizontal size={16} />
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">Live satellite basemap (current imagery, © Esri) with detected change zones overlaid from classified LULC data. The {yearFrom} side is an estimated composition, not an archival photograph — true historical satellite imagery for this exact date isn&apos;t wired to a free public source yet.</p>
    </div>
  );
}
