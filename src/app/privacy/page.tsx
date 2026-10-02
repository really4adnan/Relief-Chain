import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How ReliefChain collects, uses and protects personal and organisational data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="font-ui text-xs font-semibold uppercase tracking-widest text-teal-brand">
        Legal
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-ink">
        Privacy policy
      </h1>
      <p className="mt-1 font-mono text-xs text-slate-body">Last updated: 10 October 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-7">
        <section>
          <h2 className="font-semibold text-slate-ink">1. What we collect</h2>
          <p className="mt-2">
            Account details you provide (name, email, phone, organisation name,
            registration number), messages you send us, donation pledges (amount,
            email, chosen fund) and standard technical logs (IP address, browser,
            pages visited) required to secure the service.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">2. Why we collect it</h2>
          <p className="mt-2">
            To verify organisations before granting dispatch access, to notify you
            of emergencies relevant to your region, to issue donation receipts, to
            prevent fraud and abuse, and to meet legal obligations. We do not sell
            data, ever.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">3. Verification documents</h2>
          <p className="mt-2">
            Registration certificates and IDs submitted during onboarding are
            reviewed by authorised staff, stored encrypted, and published only in
            the form of a verification badge — the documents themselves are never
            shown publicly.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">4. Cookies &amp; analytics</h2>
          <p className="mt-2">
            Essential cookies keep you signed in. Optional, privacy-friendly
            analytics (no ad tracking) only load after you press &ldquo;Accept
            analytics&rdquo; in the consent banner. You can decline without losing
            any functionality.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">5. Sharing</h2>
          <p className="mt-2">
            Verified organisations in the directory publish their name, type,
            region, focus and responder count. Disaster-sensitive data and fund
            ledgers are shared only with the parties involved and, where legally
            required, with government disaster management authorities.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">6. Retention &amp; deletion</h2>
          <p className="mt-2">
            Operational records are retained for audit purposes for 5 years.
            Financial records follow statutory requirements. You may request
            deletion of your account data at any time by writing to
            <span className="font-mono"> privacy@reliefchain.org</span>.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">7. Security</h2>
          <p className="mt-2">
            HTTPS is enforced site-wide, database access uses row-level security,
            service credentials never reach the browser, and withdrawal flows
            require dual approval. Report vulnerabilities to
            <span className="font-mono"> security@reliefchain.org</span>.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">8. Contact</h2>
          <p className="mt-2">
            Data protection questions: <span className="font-mono">privacy@reliefchain.org</span>
          </p>
        </section>
      </div>
    </div>
  );
}
