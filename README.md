# EnergyWhiz

Australian home energy rebate calculator, green loan finance platform, and lead management CRM.

## Features

- **Education Hub** — Product guides for solar panels, home batteries, heat pump hot water, air conditioning, LED lighting, and electric vehicles
- **Rebate Calculator** — Calculates all federal and state government energy rebates by postcode
- **Green Loan Calculator** — Finance calculator with eligible/ineligible product lists, deposit support, and energy savings offset
- **CRM** — Desktop-optimised lead management with dashboard, stage-based pipeline, timestamped notes, and lead tracking

## Tech Stack

- React 19
- Vite
- Deployed via Netlify

## Getting Started

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

Output goes to `dist/` — deploy this folder to Netlify or any static host.

## Deployment

### Netlify

1. Connect this GitHub repo in Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

## AI Search Optimisation

- `public/llms.txt` — Machine-readable site description for AI crawlers
- `public/robots.txt` — Explicitly allows all major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Schema.org markup (Article, FAQPage) built into product pages
- Definition-first content structure optimised for AI extraction

## CRM Access

The CRM is accessed via the "Admin" link in the Finance page disclaimer. It is not linked in the main customer navigation.

## License

Proprietary — EnergyWhiz © 2026
