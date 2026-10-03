"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { HeaderAuth } from "./header-auth";
import { SideMenu } from "./side-menu";

/* Slim top bar: Menu tab + brand + Join are always visible.
   The 3 quick links and auth cluster appear only on wide (xl)
   screens, where measured widths guarantee zero overlap.
   Everything else lives in the 3-line menu tab on the left. */
const quickNav = [
  { href: "/disasters", label: "Disasters" },
  { href: "/learn", label: "Know nature" },
  { href: "/donate", label: "Donate" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "border-line bg-canvas/90 shadow-[0_8px_30px_rgba(27,11,7,0.08)]"
          : "border-transparent bg-canvas/70"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <SideMenu />

        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-2 text-slate-ink"
          aria-label="ReliefChain home"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-ink text-bone transition-transform duration-300 group-hover:rotate-12">
            <Logo className="h-4 w-4" />
          </span>
          <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">
            ReliefChain
          </span>
        </Link>

        <nav
          className="ml-1 hidden min-w-0 items-center gap-1 xl:flex"
          aria-label="Quick links"
        >
          {quickNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-all ${
                  active
                    ? "bg-slate-ink text-bone shadow-[0_6px_18px_rgba(27,11,7,0.25)]"
                    : "text-slate-body hover:bg-surface hover:text-slate-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <HeaderAuth />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href="tel:112"
            aria-label="Emergency dial 112"
            className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2 font-mono text-[11px] font-semibold tracking-wide text-slate-ink shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-alert active:scale-[0.98] md:inline-flex"
          >
            <span className="inline-block size-1.5 rounded-full bg-alert" />
            112
          </a>
          <a
            href="tel:1078"
            aria-label="NDMA helpline 1078"
            className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2 font-mono text-[11px] font-semibold tracking-wide text-slate-ink shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-alert active:scale-[0.98] lg:inline-flex"
          >
            NDMA 1078
          </a>
          <Link
            href="/register"
            aria-label="Join the chain — register your organisation"
            className="relative z-10 inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-teal-brand px-4 py-2.5 font-ui text-[11px] font-semibold uppercase tracking-widest text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:bg-teal-brand-hover active:scale-[0.98] sm:px-5"
          >
            Join<span className="hidden sm:inline">&nbsp;the chain</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
