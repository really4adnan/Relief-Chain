"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "rc-consent";
const EVENT = "rc-consent-change";

type Consent = "granted" | "denied";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

function loadAnalytics(domain: string) {
  if (document.querySelector('script[data-rc-analytics="1"]')) return;
  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = domain;
  script.dataset.rcAnalytics = "1";
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const visible = consent === null;

  // Returning visitors who already granted consent: load analytics on mount.
  useEffect(() => {
    if (consent === "granted") {
      const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
      if (domain) loadAnalytics(domain);
    }
  }, [consent]);

  if (!visible) return null;

  function decide(next: Consent) {
    localStorage.setItem(STORAGE_KEY, next);
    if (next === "granted") {
      const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
      if (domain) loadAnalytics(domain);
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface shadow-[0_-4px_16px_rgba(15,23,42,0.08)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm leading-6">
          We use essential cookies to keep the site working. Optional analytics
          cookies (privacy-friendly, no ad tracking) only load if you accept.{" "}
          <a href="/privacy" className="font-medium text-teal-brand underline">
            Privacy policy
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="h-9 rounded border border-line px-4 text-sm font-medium text-slate-ink hover:bg-canvas"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="h-9 rounded bg-teal-brand px-4 text-sm font-semibold text-white hover:bg-teal-brand-hover"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
