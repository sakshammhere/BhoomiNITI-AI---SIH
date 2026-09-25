"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookOpen, ChevronDown, FileText, Hash, Landmark, Link2, LogOut, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, ShieldCheck, Sun, X } from "lucide-react";
import { BrandMark } from "./BrandMark";
import type { Role } from "@/lib/api";

const navigation = [
  { href: "/land-intelligence", label: "Land Intelligence", short: "GIS", icon: Landmark, roles: ["public", "researcher", "government"] },
  { href: "/evidence-search", label: "Evidence Search", short: "RAG", icon: Search, roles: ["public", "researcher", "government"] },
  { href: "/policy-scenarios", label: "Policy Scenarios", short: "SIM", icon: BarChart3, roles: ["researcher", "government"] },
  { href: "/provenance-ledger", label: "Provenance Ledger", short: "CHAIN", icon: Hash, roles: ["public", "researcher", "government"] },
  { href: "/reports", label: "Reports & Downloads", short: "REPORTS", icon: FileText, roles: ["researcher", "government"] },
  { href: "/data-sources", label: "Data & Sources", short: "SOURCES", icon: Link2, roles: ["public", "researcher", "government"] }
];

const roleLabels: Record<Role, string> = { public: "Public access", researcher: "Researcher", government: "Government official" };

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<Role>("researcher");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("bhoominiti-session");
      if (saved) setRole(JSON.parse(saved).role as Role);
      const theme = localStorage.getItem("bhoominiti-theme");
      if (theme === "dark") { setDark(true); document.documentElement.dataset.theme = "dark"; }
    } catch {}
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("bhoominiti-theme", next ? "dark" : "light");
  }

  function signOut() {
    sessionStorage.removeItem("bhoominiti-session");
    router.push("/");
  }

  const visibleNavigation = navigation.filter((item) => item.roles.includes(role));
  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <aside className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-[var(--line)] bg-[var(--surface)] transition-all lg:flex ${collapsed ? "w-[76px]" : "w-[260px]"}`}>
        <div className={`flex h-[84px] items-center border-b border-[var(--line)] ${collapsed ? "justify-center" : "px-6"}`}><BrandMark compact={collapsed} /></div>
        <div className={`px-4 pt-7 ${collapsed ? "px-3" : ""}`}>
          {!collapsed && <div className="mono mb-3 px-2 text-[10px] uppercase tracking-[0.17em] text-[var(--muted)]">Operational views</div>}
          <nav className="space-y-1">
            {visibleNavigation.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} className={`group flex items-center gap-3 px-3 py-3 text-sm transition ${active ? "bg-[var(--surface-soft)] font-semibold text-[var(--primary)]" : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"} ${collapsed ? "justify-center" : ""}`}><Icon size={18} strokeWidth={active ? 2.2 : 1.8} />{!collapsed && <><span className="flex-1">{item.label}</span>{active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />}</>}</Link>;
            })}
          </nav>
        </div>
        <div className="mt-auto border-t border-[var(--line)] p-4">
          {!collapsed && <div className="mb-3 flex items-center gap-2 text-[11px] text-[var(--muted)]"><span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_0_3px_rgba(47,110,82,.12)]" />SESSION ACTIVE</div>}
          <button onClick={signOut} title={collapsed ? "End session" : undefined} className={`flex w-full items-center gap-3 px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--ink)] ${collapsed ? "justify-center" : ""}`}><LogOut size={16} />{!collapsed && "End session"}</button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[var(--line)] bg-[var(--surface)] transition-transform lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[84px] items-center justify-between border-b border-[var(--line)] px-6"><BrandMark /><button onClick={() => setMobileOpen(false)}><X size={19} /></button></div>
        <nav className="space-y-1 p-4 pt-7">{visibleNavigation.map((item) => { const Icon = item.icon; return <Link onClick={() => setMobileOpen(false)} key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-3 text-sm ${pathname === item.href ? "bg-[var(--surface-soft)] font-semibold text-[var(--primary)]" : "text-[var(--muted)]"}`}><Icon size={18} />{item.label}</Link>; })}</nav>
      </aside>

      <div className={`min-h-screen transition-all ${collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]"}`}>
        <header className="sticky top-0 z-30 flex h-[84px] items-center justify-between border-b border-[var(--line)] bg-[var(--canvas)]/95 px-5 backdrop-blur sm:px-8 lg:px-10">
          <div className="flex items-center gap-3"><button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><button className="hidden text-[var(--muted)] lg:block" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">{collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}</button><div className="mono hidden text-[11px] uppercase tracking-[0.15em] text-[var(--muted)] sm:block">BhoomiNITI / <span className="text-[var(--ink)]">{navigation.find((item) => item.href === pathname)?.short || "WORKSPACE"}</span></div></div>
          <div className="flex items-center gap-3 sm:gap-5">
            <button onClick={toggleTheme} className="text-[var(--muted)] hover:text-[var(--ink)]" aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <div className="hidden h-5 w-px bg-[var(--line)] sm:block" />
            <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><div className="text-xs font-semibold">{roleLabels[role]}</div><div className="mono mt-0.5 text-[9px] text-[var(--muted)]">RBAC / ACTIVE</div></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">{role === "government" ? "G" : role === "researcher" ? "R" : "P"}</div><ChevronDown size={14} className="text-[var(--muted)]" /></div>
          </div>
        </header>
        <main className="mx-auto max-w-[1640px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">{children}</main>
      </div>
    </div>
  );
}