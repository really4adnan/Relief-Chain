"use client";

import { useState } from "react";
import { contactSchema } from "@/lib/validation";

const field =
  "h-11 w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink placeholder:text-slate-body/70 focus:border-teal-brand";

export default function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "busy" | "done">("idle");
  const [mountedAt] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("submittedAt", String(mountedAt));
    const parsed = contactSchema.safeParse(
      Object.fromEntries(fd.entries())
    );

    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[issue.path.join(".")] = issue.message;
      }
      setErrors(map);
      return;
    }

    setErrors({});
    setStatus("busy");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Message failed");
      setStatus("done");
      form.reset();
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Message failed",
      });
      setStatus("idle");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-line pb-4">
        <p className="font-ui text-xs font-semibold uppercase tracking-widest text-teal-brand">
          Contact
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-ink">
          Talk to the ReliefChain team
        </h1>
        <p className="mt-1 max-w-2xl text-sm">
          Partnership, verification issues, government integration or press —
          we respond within one working day.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-ink">
                Name *
              </label>
              <input id="name" name="name" className={field} />
              {errors.name && <p className="mt-1 text-sm text-alert">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-ink">
                Email *
              </label>
              <input id="email" name="email" type="email" className={field} />
              {errors.email && <p className="mt-1 text-sm text-alert">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-ink">
                Subject *
              </label>
              <input id="subject" name="subject" className={field} />
              {errors.subject && (
                <p className="mt-1 text-sm text-alert">{errors.subject}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-ink">
                Message * (min 20 characters)
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full rounded border border-line bg-surface px-3 py-2.5 text-sm text-slate-ink focus:border-teal-brand"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-alert">{errors.message}</p>
              )}
            </div>
          </div>

          {errors.form && <p className="text-sm text-alert">{errors.form}</p>}

          <button
            type="submit"
            disabled={status === "busy"}
            className="inline-flex h-11 items-center rounded bg-teal-brand px-6 text-sm font-semibold text-white hover:bg-teal-brand-hover disabled:opacity-60"
          >
            {status === "busy" ? "Sending…" : "Send message"}
          </button>

          {status === "done" && (
            <p className="border border-ok/40 bg-ok-tint px-4 py-3 text-sm text-slate-ink">
              Message received — we&apos;ll reply within one working day.
            </p>
          )}
        </form>

        <aside className="space-y-4 text-sm">
          <div className="border border-line bg-surface p-5">
            <h2 className="font-semibold text-slate-ink">Direct lines</h2>
            <ul className="mt-3 space-y-2">
              <li className="font-mono">partnerships@reliefchain.org</li>
              <li className="font-mono">verification@reliefchain.org</li>
              <li className="font-mono">press@reliefchain.org</li>
            </ul>
          </div>
          <div className="border border-line bg-canvas p-5 leading-6">
            <h2 className="font-semibold text-slate-ink">Emergency?</h2>
            <p className="mt-2">
              This platform is not an emergency response line. In an emergency
              dial <span className="font-mono font-semibold">112</span> (India)
              or <span className="font-mono font-semibold">1078</span> (NDMA).
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
