import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description:
    "Terms of use for the ReliefChain platform, including verification, tenders, funds and acceptable use.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="font-ui text-xs font-semibold uppercase tracking-widest text-teal-brand">
        Legal
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-ink">
        Terms &amp; conditions
      </h1>
      <p className="mt-1 font-mono text-xs text-slate-body">Last updated: 10 October 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-7">
        <section>
          <h2 className="font-semibold text-slate-ink">1. Acceptance</h2>
          <p className="mt-2">
            By using ReliefChain you agree to these terms. If you register an
            organisation, you confirm you are authorized to act on its behalf.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">2. Verification</h2>
          <p className="mt-2">
            Listing in the directory, receiving dispatch alerts and claiming
            tenders require manual verification. We may refuse or revoke
            verification if documents are false, expired, or if an organisation
            misrepresents its capabilities.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">3. Tenders &amp; funds</h2>
          <p className="mt-2">
            Tender budgets are escrowed and released against milestone proof.
            Claiming bodies must deliver according to the scope or face
            deactivation. Donations are restricted to the disaster fund selected
            at checkout; unspent balances are refunded or redirected with public
            disclosure after event closure.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">4. No emergency guarantee</h2>
          <p className="mt-2">
            ReliefChain coordinates relief; it is not an emergency response
            service and does not replace official agencies (112 / NDMA 1078).
            Dispatch speed figures describe historical platform performance and
            are not a contractual guarantee.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">5. Acceptable use</h2>
          <p className="mt-2">
            You may not submit false disaster reports, impersonate another body,
            scrape personal data, attempt to bypass verification, or use the
            platform for political campaigning or solicitation unrelated to
            relief work.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">6. Liability</h2>
          <p className="mt-2">
            The platform is provided &ldquo;as is&rdquo;. To the maximum extent
            permitted by law, ReliefChain is not liable for indirect or
            consequential damages arising from use of the service. Nothing in
            these terms limits liability that cannot be limited by law.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">7. Changes</h2>
          <p className="mt-2">
            We may update these terms; material changes will be notified by email
            to registered organisations. Continued use after the effective date
            constitutes acceptance.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-ink">8. Governing law</h2>
          <p className="mt-2">
            These terms are governed by the laws of India, with courts of New
            Delhi having exclusive jurisdiction. Contact:
            <span className="font-mono"> legal@reliefchain.org</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
