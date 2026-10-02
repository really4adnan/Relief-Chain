# ReliefChain

**When disaster strikes, response shouldn't wait.**

ReliefChain is a verified network connecting NGOs, PWD companies, government bodies and volunteers — the moment a natural or man-made disaster is reported. Document-backed verification, public relief tenders, and an auditable funds ledger.

## Stack

- **Next.js 16** (App Router, RSC, TypeScript)
- **Tailwind CSS v4** — Trust Teal + Slate design tokens in `src/app/globals.css`
- **Supabase** (Postgres + Auth + RLS) — schema in `supabase/schema.sql`
- **Zod** for form validation, in-memory rate limiting + honeypot for spam protection
- Human font pack via `next/font` (self-hosted, zero third-party requests): Archivo (alerts) · Plus Jakarta Sans (headings) · Open Sans (body) · Inter (UI) · IBM Plex Mono (data)

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — demo store works with an empty .env.local
npm run dev
```

Open http://localhost:3000

**Admin panel:** http://localhost:3000/admin — passcode `reliefchain-dev` until you set
`ADMIN_PASSCODE` in `.env.local`. Verify organisations, broadcast disaster alerts,
read messages and audit funds. Without Supabase everything persists to a local
`.data/store.json`; with Supabase configured, data moves to the database.

**Live disaster feed:** `/disasters` pulls real events (floods, cyclones,
earthquakes) for India &amp; neighbourhood from NASA EONET, refreshed hourly —
no API key needed.

## Environment

See `.env.example`. Rules:

- Only `NEXT_PUBLIC_SUPABASE_*` values reach the browser (anon key, protected by RLS).
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — never prefix with `NEXT_PUBLIC_`.
- HTTPS is enforced in production by the host + HSTS header in `next.config.ts`.

## 5-minute demo script (for presentations & buyer meetings)

Follow this exact click-path. Times are cumulative.

| Min | Screen | Say |
|---|---|---|
| 0:00 | `/` — the question gate | "Do you know what nature can do to us? Sign in to see." |
| 0:30 | `/login` — Google one-tap | "One tap, no passwords in the field." Click **Explore without signing in** to skip. |
| 1:00 | `/start` — intent picker | "Everyone is routed by intent — nobody gets lost." Click **Just looking around**. |
| 1:30 | `/impact` — Assam feature | "Live picture story: Dibrugarh, 41,200 affected, tenders open now." Scroll past the 2004–2023 reports to **How ReliefChain helps**. |
| 2:30 | `/live` — command map | "Click a state. Every emergency, tender and satellite event in one view." |
| 3:15 | `/tenders?disaster=d1` — claim flow | "Verified bodies claim scoped, budgeted work — in public." |
| 3:45 | `/donate` — escrow story | "Money sits in escrow, releases on milestones, dual approval above ₹5L. 0% commission." |
| 4:15 | `/learn` — Know Nature | "The public also learns: why disasters happen, how to resist, 60-second quiz." |
| 4:45 | `/government` — the close | "And for institutions: audit-ready controls, a 30-day district pilot, evidence before procurement." |

**If asked about…**
- *Data ownership* → isolated data, full export anytime, audit log included.
- *Offline areas* → SMS + voice dispatch in parallel; 2G-light pages.
- *Cost* → verified NGOs always free; fixed-fee pilot; annual state deployments.

## Routes

| Route | Purpose |
|---|---|
| `/` | Question gate, intent doors, impact + Know Nature teasers |
| `/start` | "What do you want to do?" — 7 intent cards, direct routing |
| `/impact` | Past reports (2004–2023) + featured Assam story + how we help |
| `/learn` | Know Nature student zone: 6 lessons, flip cards, drills, quiz |
| `/government` | Buyer page: capabilities, controls, 30-day pilot, procurement FAQ |
| `/account` | User profile, sign-out, quick-action cards |
| `/disasters` | Live register + NASA EONET regional feed (filter by status) |
| `/directory` | Verified organisations (search + type filter) |
| `/tenders` | Relief tenders with budgets and claim flow |
| `/admin` | **Admin panel** — verifications, dispatch, messages, funds (passcode-protected) |
| `/donate` | Donation pledge form (validated, honeypot, rate-limited) |
| `/register` | Organisation onboarding → `/api/register` |
| `/login` | Supabase auth (falls back to demo without config) |
| `/dashboard` | Role-based ops view: dispatch queue + funds ledger |
| `/about`, `/contact`, `/privacy`, `/terms` | Static content |
| `/sitemap.xml`, `/robots.txt` | SEO via file conventions |
| 404 | Custom `not-found.tsx` |

## Security & checklist coverage

- ✅ Privacy policy + Terms pages, cookie consent banner (analytics load only after consent)
- ✅ No frontend secrets; security headers + HSTS in `next.config.ts`
- ✅ Per-page metadata titles/descriptions, OG image generated at `src/app/opengraph-image.tsx`, dynamic favicon at `src/app/icon.tsx`
- ✅ Sitemap + robots generated from file conventions
- ✅ Honeypot fields + Zod validation + rate limiting on all API routes
- ✅ Single CTA across pages: **Register your organisation**
- ✅ WCAG focus states, skip-link, `prefers-reduced-motion` on the alert ticker

## Deploy

```bash
npm run build
```

Deploy to Vercel/Render/Fly — HTTPS is automatic. Run `supabase/schema.sql` in your Supabase SQL editor before wiring env vars.
