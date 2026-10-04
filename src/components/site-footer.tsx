import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { Logo } from "./logo";

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="min-w-0">
      <h2 className="font-ui text-[11px] uppercase tracking-widest text-slate-body/70">
        {title}
      </h2>
      <ul className="mt-4 space-y-0.5">
        {links.map((l) => (
          <li key={l.href} className="min-w-0">
            <Link
              href={l.href}
              aria-label={`Footer — ${l.label}`}
              className="group inline-flex min-h-[48px] items-center font-ui text-[11px] uppercase tracking-widest text-slate-body transition-colors hover:text-slate-ink"
            >
              <span className="truncate">{l.label}</span>
              <span className="caret-blink hidden group-hover:inline">_</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 min-[380px]:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:gap-10">
        <div className="min-w-0 min-[380px]:col-span-2 lg:col-span-1">
          <BrandLogo className="h-20 w-auto max-w-full" />
          <div className="mt-3 flex items-center gap-2 text-slate-ink">
            <Logo className="h-5 w-5" />
            <span className="font-display text-lg font-semibold tracking-tight">
              ReliefChain
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6">
            One verified chain connecting NGOs, PWD companies and authorities —
            because response shouldn&apos;t wait.
          </p>
          <p className="mt-4 font-ui text-[11px] uppercase tracking-widest text-slate-body/70">
            EST. INDIA · 24/7
          </p>
          <p className="mt-2 text-[13px] leading-5 text-slate-body/80">
            Open-source relief infrastructure — built in the open, verified
            in the field.
          </p>
        </div>

        <FooterCol
          title="Journey"
          links={[
            { href: "/start", label: "Why are you here?" },
            { href: "/impact", label: "What nature can cause" },
            { href: "/learn", label: "Know nature" },
            { href: "/login", label: "Sign in with Google" },
            { href: "/account", label: "My account" },
            { href: "/live", label: "Live tracking" },
          ]}
        />

        <FooterCol
          title="Platform"
          links={[
            { href: "/live", label: "Live tracking" },
            { href: "/disasters", label: "Live disasters" },
            { href: "/tenders", label: "Open tenders" },
            { href: "/directory", label: "Directory" },
            { href: "/donate", label: "Donate funds" },
          ]}
        />

        <FooterCol
          title="Organisation"
          links={[
            { href: "/register", label: "Register" },
            { href: "/government", label: "For governments" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/admin", label: "Admin panel" },
            { href: "/about", label: "About us" },
            { href: "/contact", label: "Contact" },
          ]}
        />

        <FooterCol
          title="Legal"
          links={[
            { href: "/privacy", label: "Privacy policy" },
            { href: "/terms", label: "Terms & conditions" },
          ]}
        />
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 font-ui text-[11px] uppercase tracking-widest text-slate-body sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:px-6">
          <p>© {new Date().getFullYear()} ReliefChain</p>
          <p className="inline-flex min-h-[48px] flex-wrap items-center gap-2 normal-case tracking-normal">
            <span className="uppercase tracking-widest text-slate-body/70">
              Designed & built by Adnan A. Laskar
            </span>
            <a
              href="https://www.linkedin.com/in/adnan-a-laskar-510661426/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Adnan A. Laskar on LinkedIn (opens in a new tab)"
              className="inline-flex min-h-[48px] min-w-[48px] items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-slate-body transition-all hover:-translate-y-0.5 hover:border-teal-brand hover:text-teal-brand"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span className="font-ui text-[10px] font-semibold uppercase tracking-widest">
                LinkedIn
              </span>
            </a>
          </p>
          <p className="inline-flex min-h-[48px] flex-wrap items-center gap-x-2">Emergency dial{" "}
            <a href="tel:112" aria-label="Call emergency number 112" className="inline-flex min-h-[48px] items-center font-mono font-semibold normal-case text-slate-ink underline underline-offset-4">
              112
            </a>{" "}
            · NDMA{" "}
            <a href="tel:1078" aria-label="Call NDMA helpline 1078" className="inline-flex min-h-[48px] items-center font-mono font-semibold normal-case text-slate-ink underline underline-offset-4">
              1078
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
