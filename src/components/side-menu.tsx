"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  Compass,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Info,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Menu,
  Mountain,
  Phone,
  Radio,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Logo } from "./logo";

const groups = [
  {
    title: "Start here · open to all",
    links: [
      { href: "/start", label: "What do you want to do?", icon: Compass },
      { href: "/impact", label: "What nature can cause", icon: Mountain },
      { href: "/learn", label: "Know nature", icon: GraduationCap },
    ],
  },
  {
    title: "Live response · open to all",
    links: [
      { href: "/live", label: "Live tracking", icon: Radio },
      { href: "/disasters", label: "Disaster register", icon: LifeBuoy },
      { href: "/tenders", label: "Relief tenders", icon: HandCoins, lock: "claim needs sign-in" },
      { href: "/directory", label: "Verified directory", icon: Users },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, lock: "sign-in required" },
    ],
  },
  {
    title: "Act · sign-in required",
    links: [
      { href: "/account", label: "My account", icon: UserRound, lock: "sign-in required" },
      { href: "/donate", label: "Donate", icon: HeartHandshake, lock: "sign-in required" },
      { href: "/register", label: "Register organisation", icon: Building2, lock: "sign-in required" },
      { href: "/login", label: "Sign in", icon: ShieldCheck },
      { href: "/signup", label: "Create account", icon: Sparkles },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/government", label: "For governments", icon: Landmark },
      { href: "/about", label: "About us", icon: Info },
      { href: "/contact", label: "Contact", icon: Mail },
    ],
  },
];

/**
 * The 3-line menu: a labelled Menu button on the left opens a
 * full-height slide-in tab with every page, grouped by purpose.
 */
export function SideMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  // Close on route change and on Escape.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  // Lock background scroll while the tab is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open site menu"
        aria-expanded={open}
        aria-controls="site-menu-tab"
        className="grid size-12 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-slate-ink transition-all hover:-translate-y-0.5 hover:border-slate-ink sm:inline-flex sm:h-12 sm:w-auto sm:gap-2 sm:px-4 sm:font-ui sm:text-[11px] sm:font-semibold sm:uppercase sm:tracking-widest"
      >
        <Menu size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Menu</span>
      </button>

      {/* overlay */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-50 bg-espresso/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* left tab — always full height */}
      <aside
        id="site-menu-tab"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 left-0 top-0 z-50 flex h-dvh w-80 max-w-[86vw] flex-col border-r border-line bg-surface shadow-[24px_0_60px_rgba(27,11,7,0.25)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-line px-5 py-4">
          <span className="grid size-8 place-items-center rounded-full bg-slate-ink text-bone">
            <Logo className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-ink">
            ReliefChain
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close site menu"
            className="ml-auto grid size-9 place-items-center rounded-full border border-line-strong text-slate-ink transition-colors hover:bg-canvas"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="All pages" className="nice-scroll min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {groups.map((g) => (
            <div key={g.title} className="mb-5">
              <p className="px-2 font-ui text-[10px] font-semibold uppercase tracking-widest text-slate-body/70">
                {g.title}
              </p>
              <ul className="mt-2 space-y-1">
                {g.links.map((l) => {
                  const active =
                    pathname === l.href || pathname.startsWith(l.href + "/");
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        title={"lock" in l && l.lock ? `${l.label} — ${l.lock}` : l.label}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          active
                            ? "bg-slate-ink text-bone shadow-[0_6px_18px_rgba(27,11,7,0.25)]"
                            : "text-slate-body hover:translate-x-0.5 hover:bg-canvas hover:text-slate-ink"
                        }`}
                      >
                        <l.icon size={17} aria-hidden="true" className="shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{l.label}</span>
                        {"lock" in l && l.lock && (
                          <span className="shrink-0 rounded-full border border-line-strong px-1.5 py-0.5 font-ui text-[9px] font-semibold uppercase tracking-widest text-slate-body">
                            sign-in
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-line bg-canvas px-5 py-4">
          <p className="flex items-center gap-2 font-ui text-[10px] font-semibold uppercase tracking-widest text-alert">
            <Phone size={13} aria-hidden="true" /> Emergency
          </p>
          <p className="mt-1.5 font-mono text-sm font-semibold text-slate-ink">
            112 · NDMA 1078
          </p>
        </div>
      </aside>
    </>
  );
}
