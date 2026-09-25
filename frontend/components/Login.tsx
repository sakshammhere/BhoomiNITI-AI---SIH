"use client";

import { useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, KeyRound, LockKeyhole, MapPinned, Network, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { createSession, type Role } from "@/lib/api";

const roles: Array<{ id: Role; label: string; description: string; email: string }> = [
  { id: "public", label: "Public access", description: "Explore published insights and evidence", email: "open.public" },
  { id: "researcher", label: "Researcher", description: "Compare trends and query the corpus", email: "researcher@bhoominiti.demo" },
  { id: "government", label: "Government official", description: "Review intelligence and generate reports", email: "official@bhoominiti.demo" }
];

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("researcher");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);

  async function enterWorkspace() {
    setLoading(true);
    const session = await createSession({ role, apiKey: apiKey.trim() || undefined });
    sessionStorage.setItem("bhoominiti-session", JSON.stringify(session));
    setTimeout(() => router.push("/land-intelligence"), 320);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--canvas)]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative flex flex-col justify-between overflow-hidden px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
          <div className="absolute -left-32 top-1/3 h-[520px] w-[520px] rounded-full border border-[var(--line)] opacity-50" />
          <div className="absolute -left-20 top-[38%] h-[340px] w-[340px] rounded-full border border-[var(--line)] opacity-60" />
          <div className="relative"><BrandMark /></div>
          <div className="relative max-w-[660px] py-16">
            <div className="mono mb-5 text-[11px] uppercase tracking-[0.2em] text-[var(--primary)]">Evidence → intelligence → action</div>
            <h1 className="display max-w-[640px] text-[clamp(3rem,6vw,6.1rem)] leading-[.98] tracking-[-0.055em]">
              See the land<br /><span className="text-[var(--primary)]">change.</span> Govern<br />with proof.
            </h1>
            <p className="mt-7 max-w-[510px] text-[17px] leading-7 text-[var(--muted)]">
              A secure decision-support workspace for land-use change, policy evidence, and tamper-evident records.
            </p>
            <div className="mt-11 flex flex-wrap gap-3">
              {[
                [MapPinned, "Geo-temporal change", "var(--gis)"],
                [Network, "Evidence-grounded AI", "var(--ai)"],
                [ShieldCheck, "Provenance verified", "var(--chain)"]
              ].map(([Icon, text, color]) => {
                const I = Icon as typeof MapPinned;
                return <div key={text as string} className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted)]"><I size={14} color={color as string} />{text as string}</div>;
              })}
            </div>
          </div>
          <div className="relative flex items-end justify-between gap-5 border-t border-[var(--line)] pt-5 text-[11px] text-[var(--muted)]">
            <span>MINISTRY OF RURAL DEVELOPMENT · DoLR</span>
            <span className="mono">v0.1 / demo</span>
          </div>
        </section>

        <section className="flex items-center border-l border-[var(--line)] bg-[var(--surface)] px-6 py-10 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-[470px]">
            <div className="mb-10">
              <div className="mono mb-3 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Session setup / 01</div>
              <h2 className="display text-4xl tracking-[-0.035em]">Enter the workspace</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Choose the view that matches your role. Demo accounts are seeded for the live walkthrough.</p>
            </div>

            <div className="space-y-3">
              {roles.map((item) => (
                <button key={item.id} onClick={() => setRole(item.id)} className={`flex w-full items-center gap-4 border p-4 text-left transition ${role === item.id ? "border-[var(--primary)] bg-[var(--surface-soft)]" : "border-[var(--line)] hover:border-[var(--muted)]"}`}>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full border ${role === item.id ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-[var(--line)] text-[var(--muted)]"}`}>
                    {role === item.id ? <Check size={17} /> : <span className="text-xs">{item.label.slice(0, 1)}</span>}
                  </span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.label}</span><span className="mt-1 block text-xs text-[var(--muted)]">{item.description}</span></span>
                  <span className="mono hidden text-[10px] text-[var(--muted)] sm:block">{item.email}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-[var(--line)] pt-7">
              <label className="mb-2 block text-sm font-semibold">Bring your own key <span className="font-normal text-[var(--muted)]">(optional)</span></label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 text-[var(--muted)]" size={16} />
                <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} type={showKey ? "text" : "password"} placeholder="sk-… or connect later" className="h-12 w-full border border-[var(--line)] bg-[var(--canvas)] pl-10 pr-11 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]" />
                <button onClick={() => setShowKey(!showKey)} aria-label={showKey ? "Hide key" : "Show key"} className="absolute right-3 top-3 text-[var(--muted)]">{showKey ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-[var(--muted)]"><LockKeyhole size={14} className="mt-0.5 shrink-0 text-[var(--primary)]" />Encrypted for this session only. Never logged, retained, or shown to other users.</div>
            </div>

            <button onClick={enterWorkspace} disabled={loading} className="mt-9 flex h-13 w-full items-center justify-between bg-[var(--primary)] px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70">
              <span>{loading ? "Opening secure session…" : "Enter BhoomiNITI AI"}</span><ArrowRight size={18} />
            </button>
            <p className="mt-4 text-center text-[11px] text-[var(--muted)]">By continuing, you acknowledge this is a demonstration environment.</p>
          </div>
        </section>
      </div>
    </main>
  );
}