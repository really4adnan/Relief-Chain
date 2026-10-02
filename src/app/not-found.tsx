import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-4 py-16 sm:px-6">
      <Logo className="h-8 w-8 text-teal-brand" />
      <p className="mt-6 font-mono text-6xl font-semibold text-teal-brand">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-ink">
        This page went missing
      </h1>
      <p className="mt-2 text-sm leading-6">
        The link may be broken or the page was moved. Nothing to worry about —
        the live disaster feed is right where it should be.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded bg-teal-brand px-6 text-sm font-semibold text-white hover:bg-teal-brand-hover"
        >
          Back to home
        </Link>
        <Link
          href="/disasters"
          className="inline-flex h-11 items-center rounded border border-line bg-surface px-6 text-sm font-semibold text-slate-ink hover:bg-canvas"
        >
          Live disasters
        </Link>
      </div>
    </div>
  );
}
