"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Fingerprint } from "lucide-react";
import { authField, authLabel } from "@/components/auth-shell";

const CRED_KEY = "reliefchain-passkey-id";
const EMAIL_KEY = "reliefchain-demo-user";

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(s: string): Uint8Array<ArrayBuffer> {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(pad);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function challenge(): ArrayBuffer {
  const buf = new ArrayBuffer(32);
  crypto.getRandomValues(new Uint8Array(buf));
  return buf;
}

/**
 * Device passkey (WebAuthn) — demo-grade fast auth for field responders.
 * The credential never leaves the device; only the credential id is kept
 * in localStorage alongside the demo session email. If Supabase auth is
 * configured, prefer Google redirect or email — the passkey unlocks the
 * local demo session so gated flows stay tryable offline.
 */
export function PasskeyButton({ next = "/start" }: { next?: string }) {
  const router = useRouter();
  const [support, setSupport] = useState<"checking" | "yes" | "no">("checking");
  const [email, setEmail] = useState("");
  const [hasCred, setHasCred] = useState(false);
  const [busy, setBusy] = useState<"register" | "login" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupport(
      typeof window !== "undefined" && !!window.PublicKeyCredential ? "yes" : "no",
    );
    try {
      setHasCred(!!window.localStorage.getItem(CRED_KEY));
      setEmail(window.localStorage.getItem(EMAIL_KEY) ?? "");
    } catch {
      /* private mode */
    }
  }, []);

  if (support === "checking") return null;
  if (support === "no") {
    return (
      <p className="rounded-xl border border-line bg-canvas px-4 py-3 text-xs leading-5 text-slate-body">
        This device/browser doesn&apos;t support passkeys — Google redirect or
        email works instead.
      </p>
    );
  }

  async function register() {
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter your email first — the passkey is tied to it on this device.");
      return;
    }
    setBusy("register");
    try {
      const cred = (await navigator.credentials.create({
        publicKey: {
          challenge: challenge(),
          rp: { name: "ReliefChain", id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(email),
            name: email,
            displayName: email,
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 },
          ],
          authenticatorSelection: { userVerification: "preferred" },
          timeout: 60000,
          attestation: "none",
        },
      })) as PublicKeyCredential | null;
      if (!cred) throw new Error("No credential was created.");
      window.localStorage.setItem(CRED_KEY, b64url(cred.rawId));
      window.localStorage.setItem(EMAIL_KEY, email);
      setHasCred(true);
    } catch (err) {
      setError(
        err instanceof Error && err.name === "NotAllowedError"
          ? "Passkey setup was cancelled on the device."
          : "Couldn't create a passkey here — try Google redirect or email.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function login() {
    setError(null);
    let credId: string | null = null;
    let savedEmail = "";
    try {
      credId = window.localStorage.getItem(CRED_KEY);
      savedEmail = window.localStorage.getItem(EMAIL_KEY) ?? "";
    } catch {
      /* private mode */
    }
    if (!credId) {
      setError("No passkey on this device yet — create one first.");
      return;
    }
    setBusy("login");
    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge(),
          allowCredentials: [{ id: unb64url(credId), type: "public-key" }],
          userVerification: "preferred",
          timeout: 60000,
        },
      });
      if (!assertion) throw new Error("Authentication failed.");
      try {
        window.localStorage.setItem(EMAIL_KEY, savedEmail || "passkey@reliefchain.org");
      } catch {
        /* private mode */
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.name === "NotAllowedError"
          ? "Passkey check was cancelled on the device."
          : "Passkey didn't verify — try Google redirect or email.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-canvas p-4">
      <p className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-ink">
        <Fingerprint size={14} aria-hidden="true" className="text-teal-brand" />
        Passkey · this device
      </p>
      <div className="mt-3">
        <label htmlFor="passkey-email" className={authLabel}>
          Email for the passkey
        </label>
        <input
          id="passkey-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@org.in"
          className={authField}
        />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={login}
          disabled={busy !== null || !hasCred}
          className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-full bg-teal-brand px-5 font-ui text-[11px] font-semibold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-teal-brand-hover active:scale-[0.98] disabled:opacity-50"
        >
          {busy === "login" ? "Checking…" : "Sign in with passkey"}
        </button>
        <button
          type="button"
          onClick={register}
          disabled={busy !== null}
          className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-full border border-line-strong bg-surface px-5 font-ui text-[11px] font-semibold uppercase tracking-widest text-slate-ink transition-all hover:-translate-y-0.5 hover:border-slate-ink active:scale-[0.98] disabled:opacity-50"
        >
          {busy === "register" ? "Creating…" : hasCred ? "Replace passkey" : "Create passkey"}
        </button>
      </div>
      {error && (
        <p className="mt-2 border border-alert/40 bg-alert-tint px-3 py-2 text-xs text-alert">
          {error}
        </p>
      )}
      <p className="mt-2 text-[11px] leading-4 text-slate-body">
        Demo-grade: the key never leaves this device. For a verified team
        account, use Google redirect or email.
      </p>
    </div>
  );
}
