# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start Vite dev server (localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the dist/ build locally
```

There is no test suite. No linter is configured beyond Vite defaults.

## Architecture

The entire front-end lives in **`src/App.jsx`** (~3,000 lines). It is a single-file React 19 app with no routing library — the active view is controlled by a `currentView` state variable. Views include: `home`, `education`, `rebates`, `finance`, and `crm`.

### Views

| View | Description |
|------|-------------|
| `home` | Marketing landing page |
| `education` | Product guides (solar, battery, heat pump, AC, LED, EV) |
| `rebates` | Postcode-based rebate calculator — produces a lead on form submit |
| `finance` | Green loan calculator — produces a lead on form submit |
| `crm` | Internal lead management dashboard (not linked in public nav) |

### Lead capture flow

When a customer completes the Rebate or Finance calculators, the view calls `onCaptureLead(lead)` which is wired up in App to prepend a new lead to the `leads` array. The CRM is accessed via a hidden "Admin" link in the Finance page disclaimer.

### CRM pipeline stages

Leads progress through 7 numbered stages (stored as `stage: 1–7`):

1. New Lead
2. Assessment Sent
3. Finance Booked
4. Finance Applied
5. Approved
6. Installer Matched
7. Complete

### Lead data shape (in-app)

```js
{
  id, name, email, phone, postcode, state,
  products,      // string[] e.g. ['solar', 'battery']
  totalRebate,   // number
  stage,         // 1–7
  financeStatus, // free-form string
  source,        // 'website' | 'referral' | etc.
  created,       // ISO date string
  notes,         // [{ text, timestamp }]  newest-first in UI
}
```

### Supabase

Backend integration is in **`src/lib/supabase.js`**. If `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not set, it falls back to local-only mode so the app still runs without a database.

Database schema is in **`supabase/migrations/20260512_init.sql`** — run this against your Supabase project to create the `leads`, `lead_notes`, and `profiles` tables with RLS policies.

Copy `.env.local.example` → `.env.local` and add your Supabase project credentials before wiring up persistence.

### Deployment

Deployed on **Netlify**. `netlify.toml` sets the SPA catch-all redirect. Build command: `npm run build`, publish directory: `dist`.

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Netlify dashboard (Site → Environment variables).
