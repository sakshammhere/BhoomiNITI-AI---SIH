import { ArrowUpRight, Check, CircleAlert, Clock3, ExternalLink, ShieldCheck } from "lucide-react";

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mono mb-2 text-[10px] uppercase tracking-[0.18em] text-[var(--primary)]">{eyebrow}</div><h1 className="display text-4xl tracking-[-0.04em] sm:text-[46px]">{title}</h1><p className="mt-2 max-w-[720px] text-sm leading-6 text-[var(--muted)]">{description}</p></div>{action}</div>;
}

export function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow)] ${className}`}>{children}</section>;
}

export function SectionLabel({ children, color = "var(--muted)" }: { children: React.ReactNode; color?: string }) {
  return <div className="mono flex items-center gap-2 text-[10px] uppercase tracking-[0.16em]" style={{ color }}>{children}</div>;
}

export function StatusBadge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "blue" | "purple" | "amber" | "red" | "gray" }) {
  const tones = { green: "border-[#afd0bb] bg-[#edf7ef] text-[var(--gis)]", blue: "border-[#b5c9e8] bg-[#eef4fc] text-[var(--ai)]", purple: "border-[#cfc1e3] bg-[#f4effa] text-[var(--chain)]", amber: "border-[#e5cea5] bg-[#fbf5e8] text-[var(--input)]", red: "border-[#e4b8b0] bg-[#fcf0ee] text-[var(--danger)]", gray: "border-[var(--line)] bg-[var(--surface-soft)] text-[var(--muted)]" };
  return <span className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${tones[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}

export function VerifiedMark({ label = "Verified" }: { label?: string }) {
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--gis)]"><Check size={14} strokeWidth={2.5} />{label}</span>;
}

export function Metric({ label, value, detail, accent = "var(--primary)", icon }: { label: string; value: string; detail?: string; accent?: string; icon?: React.ReactNode }) {
  return <div className="border-l-2 bg-[var(--surface)] px-4 py-4" style={{ borderColor: accent }}><div className="flex items-start justify-between gap-2"><div className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">{label}</div>{icon}</div><div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{value}</div>{detail && <div className="mt-1 text-xs text-[var(--muted)]">{detail}</div>}</div>;
}

export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="flex min-h-[180px] flex-col items-center justify-center border border-dashed border-[var(--line)] p-6 text-center"><CircleAlert size={23} className="mb-3 text-[var(--muted)]" /><div className="font-semibold">{title}</div><p className="mt-1 max-w-sm text-xs leading-5 text-[var(--muted)]">{children}</p></div>;
}

export function SourcePill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 border border-[var(--line)] bg-[var(--surface-soft)] px-2 py-1 text-[10px] text-[var(--muted)]"><ExternalLink size={11} />{children}</span>;
}

export function MiniLink({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">{children}<ArrowUpRight size={13} /></span>;
}