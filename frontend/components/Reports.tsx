"use client";

import { useState } from "react";
import { CheckCircle2, Download, FileSpreadsheet, FileText, LoaderCircle, MapPin, ShieldCheck } from "lucide-react";
import { generateReport } from "@/lib/api";
import { PageIntro, SectionLabel, StatusBadge, Surface } from "./ui";

const sessionSummary = {
  district: "Gurugram · Haryana",
  period: "2005 → 2022 · 17 years",
  detectedChange: "18,320 ha changed · 14.6% of district",
  evidence: "4 corpus sources · 91% answer confidence",
  scenario: "Restrict built-up expansion near forest buffer by 20%",
  topSignal: "Agriculture → Built-up"
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/** jsPDF's built-in Helvetica font has no glyph for "→" (renders as a broken box) — swap for an ASCII-safe arrow in PDF output only. */
function pdfSafe(text: string) {
  return text.replace(/→/g, "->");
}

async function buildPdf(reportId: string) {
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold"); doc.setFontSize(16);
  doc.text("BhoomiNITI AI — Decision Support Report", 14, 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(90);
  doc.text(`Report ${reportId} · Generated ${new Date().toLocaleString("en-IN")} · SIH26019 · PlotArmor`, 14, 24);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 32,
    head: [["Field", "Value"]],
    body: [
      ["District under review", sessionSummary.district],
      ["Observed period", pdfSafe(sessionSummary.period)],
      ["Detected land change", sessionSummary.detectedChange],
      ["Top transition signal", pdfSafe(sessionSummary.topSignal)],
      ["Evidence cited", sessionSummary.evidence],
      ["Scenario compared", sessionSummary.scenario]
    ],
    theme: "grid",
    headStyles: { fillColor: [47, 110, 82] },
    styles: { fontSize: 10, cellPadding: 3 }
  });

  const afterTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
  doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("Output boundary", 14, afterTableY);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  const disclaimer = "Reports are decision-support artifacts. Detection signals and modelled futures require review by the responsible district authority before administrative action. Provenance for the underlying datasets is recorded on the tamper-evident hash-chain ledger.";
  doc.text(doc.splitTextToSize(disclaimer, 180), 14, afterTableY + 6);

  return doc.output("blob");
}

function buildCsv(reportId: string) {
  const rows = [
    ["Report ID", reportId],
    ["Generated", new Date().toLocaleString("en-IN")],
    [],
    ["Field", "Value"],
    ["District under review", sessionSummary.district],
    ["Observed period", sessionSummary.period],
    ["Detected land change", sessionSummary.detectedChange],
    ["Top transition signal", sessionSummary.topSignal],
    ["Evidence cited", sessionSummary.evidence],
    ["Scenario compared", sessionSummary.scenario]
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8" });
}

export default function Reports() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [reportId, setReportId] = useState("");
  async function createReport() { setStatus("loading"); const result = await generateReport({ district: sessionSummary.district, years: sessionSummary.period, detectedChange: sessionSummary.detectedChange, evidence: sessionSummary.evidence, scenario: sessionSummary.scenario }); setReportId(result.reportId); setStatus("success"); }
  async function downloadPdf() { const blob = await buildPdf(reportId); triggerDownload(blob, `BhoomiNITI_${reportId}.pdf`); }
  function downloadCsv() { triggerDownload(buildCsv(reportId), `BhoomiNITI_${reportId}.csv`); }

  return <div>
    <PageIntro eyebrow="Output layer / decision report" title="Reports & downloads" description="Package the current session's land signal, evidence trail, scenario comparison, and provenance status for review." />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]">
      <Surface className="p-5 sm:p-7"><div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-5"><div><SectionLabel color="var(--output)">Current session summary</SectionLabel><div className="mt-1 text-xs text-[var(--muted)]">Prepared from the active workspace selections</div></div><StatusBadge tone="green"><ShieldCheck size={12} />Source trail intact</StatusBadge></div><div className="mt-6 space-y-4">{[["District under review", "Gurugram · Haryana", MapPin, "var(--gis)"], ["Observed period", "2005 → 2022 · 17 years", FileText, "var(--input)"], ["Detected land change", "18,320 ha · 14.6% of district", FileSpreadsheet, "var(--danger)"], ["Evidence cited", "4 corpus sources · 91% answer confidence", ShieldCheck, "var(--ai)"]].map(([label, value, Icon, color]) => { const I = Icon as typeof MapPin; return <div key={label as string} className="flex items-center gap-4 border-b border-[var(--line)] pb-4 last:border-0"><div className="flex h-9 w-9 items-center justify-center border border-[var(--line)] bg-[var(--surface-soft)]"><I size={16} color={color as string} /></div><div><div className="mono text-[9px] uppercase tracking-[.12em] text-[var(--muted)]">{label as string}</div><div className="mt-1 text-sm font-semibold">{value as string}</div></div></div>; })}</div><div className="mt-6 border-t border-[var(--line)] pt-5"><div className="mb-3 text-xs font-semibold">Report contents</div><div className="grid gap-2 text-xs text-[var(--muted)] sm:grid-cols-2"><div className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--gis)]" />Land change map & matrix</div><div className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--gis)]" />Cited evidence excerpts</div><div className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--gis)]" />Scenario chart & narrative</div><div className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--gis)]" />Provenance chain status</div></div></div></Surface>
      <div className="space-y-5"><Surface className="p-5"><SectionLabel color="var(--output)">Generate decision report</SectionLabel><p className="mt-4 text-sm leading-6 text-[var(--muted)]">Create a judge-ready, source-cited report from this session — downloads as a real PDF or CSV right now; a connected FastAPI service will generate the richer version later.</p><button disabled={status === "loading"} onClick={() => void createReport()} className="mt-6 flex w-full items-center justify-center gap-2 bg-[var(--output)] px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-60">{status === "loading" ? <><LoaderCircle size={17} className="animate-spin" />Assembling evidence trail…</> : status === "success" ? <><CheckCircle2 size={17} />Report generated</> : <><Download size={17} />Generate Decision Report</>}</button>{status === "success" && <div className="mt-4 border border-[#afd0bb] bg-[#edf7ef] p-3 text-xs leading-5 text-[var(--gis)]"><div className="font-semibold">Ready for download · {reportId}</div><div className="mt-1">Generated client-side from this session's summary for the demo; the backend handoff is wired through <span className="mono">POST /api/reports/generate</span>.</div><div className="mt-2 flex gap-4 font-semibold underline"><button onClick={() => void downloadPdf()}>Download PDF</button><button onClick={downloadCsv}>Download CSV</button></div></div>}</Surface><Surface className="p-5"><SectionLabel color="var(--muted)">Recent exports</SectionLabel><div className="mt-4 border border-dashed border-[var(--line)] p-4"><div className="flex items-center gap-3"><FileText size={19} className="text-[var(--output)]" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">Gurugram_land-governance_brief</div><div className="mono mt-1 text-[10px] text-[var(--muted)]">Not generated in this session</div></div><span className="text-[10px] text-[var(--muted)]">—</span></div></div></Surface></div>
    </div>
    <div className="mt-5 border border-[var(--line)] bg-[var(--surface-soft)] p-4 text-xs leading-5 text-[var(--muted)]"><strong className="text-[var(--ink)]">Output boundary:</strong> reports are decision-support artifacts. Detection signals and modelled futures require review by the responsible district authority before administrative action.</div>
  </div>;
}