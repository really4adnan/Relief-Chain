"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/verifications", label: "Verifications" },
  { href: "/admin/dispatch", label: "Dispatch" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/funds", label: "Funds" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 border-b border-line pb-3 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap gap-1" aria-label="Admin sections">
        {links.map((l) => {
          const active =
            l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 text-sm font-medium ${
                active
                  ? "bg-teal-brand text-white"
                  : "text-slate-body hover:text-slate-ink"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3">
        <span className="font-ui text-[11px] uppercase tracking-wide text-slate-body">
          control panel
        </span>
        <button
          type="button"
          onClick={logout}
          className="border border-line px-3 py-1.5 text-sm font-medium text-slate-ink hover:bg-canvas"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
