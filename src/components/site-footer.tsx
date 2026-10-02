import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logo } from "./logo";

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="font-ui text-[11px] uppercase tracking-widest text-slate-body/70">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center font-ui text-[11px] uppercase tracking-widest text-slate-body transition-colors hover:text-slate-ink"
            >
              {l.label}
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
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        <div>
          <div className="flex items-center gap-2 text-slate-ink">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 font-ui text-[11px] uppercase tracking-widest text-slate-body sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} ReliefChain</p>
          <p className="inline-flex items-center gap-2 normal-case tracking-normal">
            <span className="uppercase tracking-widest text-slate-body/70">
              Designed & built by Adnan A. Laskar
            </span>
            <a
              href="https://www.linkedin.com/in/adnan-a-laskar-510661426/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Adnan A. Laskar on LinkedIn"
              className="grid size-7 place-items-center rounded-full border border-line-strong text-slate-body transition-all hover:-translate-y-0.5 hover:border-teal-brand hover:text-teal-brand"
            >
              <ExternalLink size={14} />
            </a>
          </p>
          <p>Emergency dial 112 · NDMA 1078</p>
        </div>
      </div>
    </footer>
  );
}
