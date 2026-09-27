"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { getReferences, type ReferenceEntry } from "@/lib/api";
import { PageIntro, SectionLabel, StatusBadge, Surface } from "./ui";

const demoCorpus = [
  { title: "DILRMP: Digital India Land Records Modernization Programme", type: "Policy", date: "2023" },
  { title: "National Remote Sensing Policy 2023", type: "Guideline", date: "2023" },
  { title: "Urban and Regional Development Plans Formulation and Implementation Guidelines", type: "Policy", date: "2014" },
  { title: "Wetlands (Conservation and Management) Rules", type: "Guideline", date: "2017" }
];

export default function DataSources() {
  const [references, setReferences] = useState<ReferenceEntry[] | null>(null);

  useEffect(() => { void getReferences().then(setReferences); }, []);

  return <div>
    <PageIntro eyebrow="Provenance · public references" title="Data & sources" description="Every dataset, standard, and piece of research this MVP is built on — linked where we can verify a live public page." />

    <Surface className="mb-6 p-5">
      <SectionLabel color="var(--gis)">Verified public sources</SectionLabel>
      <div className="mt-4 divide-y divide-[var(--line)]">
        {references === null && <div className="py-8 text-center text-sm text-[var(--muted)]">Loading references…</div>}
        {references?.map((ref) => (
          <a key={ref.title} href={ref.url} target="_blank" rel="noreferrer" className="group flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mono text-[9px] uppercase tracking-[.12em] text-[var(--muted)]">{ref.category}</div>
              <div className="mt-1 flex items-center gap-2 text-sm font-semibold group-hover:text-[var(--primary)]">{ref.title}<ExternalLink size={13} className="shrink-0 text-[var(--muted)] group-hover:text-[var(--primary)]" /></div>
              <div className="mt-1 text-xs text-[var(--muted)]">{ref.publisher} · {ref.usage}</div>
            </div>
            <span className="mono shrink-0 text-[11px] text-[var(--primary)] underline underline-offset-2">{ref.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
          </a>
        ))}
      </div>
    </Surface>

    <Surface className="p-5">
      <div className="flex items-center justify-between"><SectionLabel color="var(--ai)">Demo evidence corpus</SectionLabel><StatusBadge tone="gray">Indicative citations</StatusBadge></div>
      <div className="mt-4 divide-y divide-[var(--line)]">
        {demoCorpus.map((doc) => (
          <div key={doc.title} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold">{doc.title}</div>
            <div className="mono text-[10px] text-[var(--muted)]">{doc.type} · {doc.date}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-start gap-2 border-t border-[var(--line)] pt-4 text-[11px] leading-5 text-[var(--muted)]">
        <ShieldAlert size={14} className="mt-0.5 shrink-0 text-[var(--input)]" />
        These are the documents indexed for the Evidence Search demo corpus. Titles reflect real, named government policy instruments, but we have not linked a specific page for each — treat as indicative citations rather than verified live links until confirmed.
      </div>
    </Surface>
  </div>;
}
