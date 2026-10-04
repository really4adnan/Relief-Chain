"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { INDIA_STATES, orgRegistrationSchema } from "@/lib/validation";
import { RequireAuth } from "@/components/require-auth";
import { LowBandwidthNote } from "@/components/ui";

const kinds = ["NGO", "PWD Company", "Government Body", "Volunteer Group"] as const;

const field =
  "h-12 min-h-[48px] w-full rounded border border-line bg-surface px-3 text-sm text-slate-ink placeholder:text-slate-body/70 focus:border-teal-brand";

export default function RegisterPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [ref, setRef] = useState<string | null>(null);
  const [mountedAt] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("submittedAt", String(mountedAt));
    const parsed = orgRegistrationSchema.safeParse(
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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Registration failed");
      setRef(json.ref);
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrors({
        form: err instanceof Error ? err.message : "Registration failed",
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-line pb-4">
        <p className="font-ui text-xs font-semibold uppercase tracking-widest text-teal-brand">
          Onboarding
        </p>
        <h1 className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight text-slate-ink">
          Register your organisation
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-ink px-2 py-0.5 font-ui text-[10px] font-semibold uppercase tracking-widest text-white">
            <Lock size={11} /> Sign-in required
          </span>
        </h1>
        <p className="mt-1 max-w-2xl text-sm">
          Sign in first — registration needs a verified identity. A human then
          verifies your registration certificate (usually within 48 hours)
          before you appear in the public directory and receive dispatch alerts.
        </p>
      </div>

      <RequireAuth next="/register" action="register your organisation">
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {/* honeypot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="orgName" className="mb-1 block text-sm font-medium text-slate-ink">
                Organisation name *
              </label>
              <input id="orgName" name="orgName" className={field} placeholder="Aarohan Relief Trust" />
              {errors.orgName && <p className="mt-1 text-sm text-alert">{errors.orgName}</p>}
            </div>

            <div>
              <label htmlFor="kind" className="mb-1 block text-sm font-medium text-slate-ink">
                Organisation type *
              </label>
              <select id="kind" name="kind" defaultValue="" className={field}>
                <option value="" disabled>
                  Select type…
                </option>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              {errors.kind && <p className="mt-1 text-sm text-alert">{errors.kind}</p>}
            </div>

            <div>
              <label htmlFor="regNumber" className="mb-1 block text-sm font-medium text-slate-ink">
                Registration number *
              </label>
              <input
                id="regNumber"
                name="regNumber"
                className={field}
                placeholder="NGO/2019/123456"
              />
              {errors.regNumber && <p className="mt-1 text-sm text-alert">{errors.regNumber}</p>}
            </div>

            <div>
              <label htmlFor="contactName" className="mb-1 block text-sm font-medium text-slate-ink">
                Contact person *
              </label>
              <input id="contactName" name="contactName" className={field} placeholder="Full name" />
              {errors.contactName && (
                <p className="mt-1 text-sm text-alert">{errors.contactName}</p>
              )}
            </div>

            <div>
              <label htmlFor="region" className="mb-1 block text-sm font-medium text-slate-ink">
                Primary state / UT *
              </label>
              <select id="region" name="region" defaultValue="" className={field}>
                <option value="" disabled>
                  Select state…
                </option>
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.region && <p className="mt-1 text-sm text-alert">{errors.region}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-ink">
                Work email *
              </label>
              <input id="email" name="email" type="email" className={field} placeholder="contact@org.org" />
              {errors.email && <p className="mt-1 text-sm text-alert">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-ink">
                Phone *
              </label>
              <input id="phone" name="phone" className={field} placeholder="+91 98765 43210" />
              {errors.phone && <p className="mt-1 text-sm text-alert">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="focus" className="mb-1 block text-sm font-medium text-slate-ink">
                Focus areas *
              </label>
              <textarea
                id="focus"
                name="focus"
                rows={4}
                className="w-full rounded border border-line bg-surface px-3 py-2.5 text-sm text-slate-ink placeholder:text-slate-body/70 focus:border-teal-brand"
                placeholder="e.g. Flood rescue, mass kitchens, temporary shelters…"
              />
              {errors.focus && <p className="mt-1 text-sm text-alert">{errors.focus}</p>}
            </div>

            <div className="sm:col-span-2 border-t border-line pt-5">
              <h2 className="text-sm font-semibold text-slate-ink">
                Verification documents
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-body">
                Paste links to your registration certificate, PAN and signatory
                ID (Drive / DigiLocker / website). A human reviewer checks them
                before approval.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="certUrl" className="mb-1 block text-sm font-medium text-slate-ink">
                Registration certificate link
              </label>
              <input id="certUrl" name="certUrl" type="url" className={field} placeholder="https://…" />
              {errors.certUrl && <p className="mt-1 text-sm text-alert">{errors.certUrl}</p>}
            </div>

            <div>
              <label htmlFor="pan" className="mb-1 block text-sm font-medium text-slate-ink">
                Organisation PAN
              </label>
              <input id="pan" name="pan" className={field} placeholder="ABCDE1234F" />
              {errors.pan && <p className="mt-1 text-sm text-alert">{errors.pan}</p>}
            </div>

            <div>
              <label htmlFor="idProof" className="mb-1 block text-sm font-medium text-slate-ink">
                Signatory ID reference
              </label>
              <input id="idProof" name="idProof" className={field} placeholder="e.g. Aadhaar last 4 / Passport no." />
              {errors.idProof && <p className="mt-1 text-sm text-alert">{errors.idProof}</p>}
            </div>
          </div>

          {errors.form && <p className="text-sm text-alert">{errors.form}</p>}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "busy"}
              className="inline-flex h-11 items-center rounded bg-teal-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-brand-hover disabled:opacity-60"
            >
              {status === "busy" ? "Submitting…" : "Submit for verification"}
            </button>
            <p className="text-xs text-slate-body">
              By submitting you agree to the{" "}
              <a href="/terms" className="text-teal-brand underline">
                terms
              </a>
              .
            </p>
          </div>

          {status === "done" && ref && (
            <div className="border border-ok/40 bg-ok-tint px-4 py-3 text-sm text-slate-ink">
              Submitted. Your tracking reference is{" "}
              <span className="font-mono font-semibold">{ref}</span>. We&apos;ll
              email you once verification is complete.
            </div>
          )}
          <LowBandwidthNote />
        </form>

        <aside className="space-y-4">
          <div className="border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold text-slate-ink">
              What you&apos;ll need
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6">
              <li>Registration certificate (Trust / Society / Sec. 8 / Company)</li>
              <li>PAN of the organisation</li>
              <li>Authorized signatory ID proof</li>
              <li>Bank account for fund receipts</li>
            </ul>
          </div>
          <div className="border border-line bg-canvas p-5">
            <h2 className="text-sm font-semibold text-slate-ink">After you apply</h2>
            <ol className="mt-3 space-y-2 text-sm leading-6">
              <li>
                <span className="font-mono text-teal-brand">01</span> Document check
                (48h)
              </li>
              <li>
                <span className="font-mono text-teal-brand">02</span> Directory listing
                goes live
              </li>
              <li>
                <span className="font-mono text-teal-brand">03</span> Dispatch alerts
                enabled
              </li>
              <li>
                <span className="font-mono text-teal-brand">04</span> You can claim
                tenders
              </li>
            </ol>
          </div>
        </aside>
      </div>
      </RequireAuth>
    </div>
  );
}
