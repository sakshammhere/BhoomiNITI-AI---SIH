import { ShieldCheck } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm">
        <ShieldCheck size={21} strokeWidth={1.8} />
        <span className="absolute bottom-[7px] h-[3px] w-4 rounded-full bg-[#b8791a]" />
      </div>
      {!compact && (
        <div>
          <div className="display text-[22px] leading-none tracking-[-0.02em]">BhoomiNITI <span className="text-[var(--primary)]">AI</span></div>
          <div className="mono mt-1 text-[9px] uppercase tracking-[0.22em] text-[var(--muted)]">PlotArmor · SIH26019</div>
        </div>
      )}
    </div>
  );
}