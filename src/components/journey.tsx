"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  Compass,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  LifeBuoy,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/motion";

/* ------------------------------------------------------------------ */
/* Shared intent data — single source of truth for / , /start          */
/* ------------------------------------------------------------------ */

export const intents = [
  {
    slug: "explore",
    icon: Compass,
    title: "Explore disasters",
    desc: "See live emergencies across India on the map and register.",
    href: "/disasters",
    tint: "bg-teal-tint text-teal-brand",
  },
  {
    slug: "help",
    icon: LifeBuoy,
    title: "I need help",
    desc: "Find who responds near you + live tracking of relief.",
    href: "/live",
    tint: "bg-alert-tint text-alert",
  },
  {
    slug: "tender",
    icon: HandCoins,
    title: "Get a tender",
    desc: "Claim open relief work — food, boats, shelters, logistics.",
    href: "/tenders",
    tint: "bg-ok-tint text-ok",
  },
  {
    slug: "register",
    icon: Building2,
    title: "Register organisation",
    desc: "NGO / PWD / authority — get verified in ~48 hours.",
    href: "/register",
    tint: "bg-warn-tint text-warn",
  },
  {
    slug: "donate",
    icon: HeartHandshake,
    title: "Donate",
    desc: "Every rupee on a public ledger. ₹0 commission.",
    href: "/donate",
    tint: "bg-teal-tint text-teal-brand",
  },
  {
    slug: "study",
    icon: GraduationCap,
    title: "Know nature",
    desc: "Know why disasters happen & how to resist them.",
    href: "/learn",
    tint: "bg-warn-tint text-warn",
  },
  {
    slug: "other",
    icon: Sparkles,
    title: "Just looking around",
    desc: "See what nature can cause + how ReliefChain helps.",
    href: "/impact",
    tint: "bg-canvas text-slate-ink",
  },
];

/* ------------------------------------------------------------------ */
/* Typewriter — cycles through phrases with a blinking caret           */
/* ------------------------------------------------------------------ */

export function Typewriter({
  phrases,
  className = "",
}: {
  phrases: string[];
  className?: string;
}) {
  const [text, setText] = useState("");
  const [pi, setPi] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = phrases[pi % phrases.length];
    const speed = deleting ? 28 : 55;
    const t = setTimeout(() => {
      if (!deleting && text === full) {
        setTimeout(() => setDeleting(true), 1400);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setPi((v) => (v + 1) % phrases.length);
        return;
      }
      setText(full.slice(0, text.length + (deleting ? -1 : 1)));
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, pi, phrases]);

  return (
    <span className={className}>
      {text}
      <span className="caret-blink ml-0.5 inline-block h-[1em] w-[2px] translate-y-[3px] bg-current" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* StormField — pure-CSS animated weather behind the gate. Restrained
   professional treatment: drifting cloud banks, rain streaks and a
   distant lightning pulse. No novelty glyphs.                    */
/* ------------------------------------------------------------------ */

export function StormField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* drifting clouds */}
      <div className="cloud-drift absolute left-[-10%] top-[8%] h-16 w-64 rounded-full bg-white/[0.07] blur-xl" />
      <div className="cloud-drift-slow absolute left-[30%] top-[22%] h-12 w-48 rounded-full bg-white/[0.05] blur-xl" />
      <div className="cloud-drift absolute right-[-8%] top-[55%] h-20 w-72 rounded-full bg-white/[0.06] blur-xl" />
      {/* rain streaks */}
      <div className="rain-layer absolute inset-0 opacity-40" />
      {/* slow orbital rings — quiet depth, no distraction */}
      {[14, 42, 70].map((left, i) => (
        <span
          key={left}
          className="float-glyph absolute rounded-full border border-white/15"
          style={{
            left: `${left}%`,
            top: `${18 + i * 20}%`,
            width: `${90 + i * 40}px`,
            height: `${90 + i * 40}px`,
            animationDelay: `${i * 1.1}s`,
            animationDuration: `${8 + i * 2}s`,
          }}
        />
      ))}
      {/* lightning flashes */}
      <div className="lightning absolute inset-0 bg-white" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tilt — subtle 3D tilt on hover for intent / study cards             */
/* ------------------------------------------------------------------ */

export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Intent grid — reused on home + /start                               */
/* ------------------------------------------------------------------ */

export function IntentGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
      {intents.map((it, i) => (
        <Reveal key={it.slug} delay={(i % 4) * 90}>
          <Tilt className="h-full">
            <Link
              href={it.href}
              className="lift group flex h-full flex-col rounded-2xl border border-line bg-surface p-6"
            >
              <span className={`grid size-12 place-items-center rounded-full ${it.tint} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                <it.icon size={21} />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-slate-ink">
                {it.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-body">{it.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-ui text-[11px] font-semibold uppercase tracking-widest text-teal-brand">
                Go
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Tilt>
        </Reveal>
      ))}
    </div>
  );
}
