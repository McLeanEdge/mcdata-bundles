# McData Bundles v4.0

Clean white UI · SVG network logos · Full multi-page routing

## Demo Credentials
| Role  | Phone        | PIN  |
|-------|-------------|------|
| Admin | 0200000000  | 1234 |
| Agent | 0241234567  | 2222 |
| Agent | 0501234567  | 3333 |

## Pages / Routes
- **Home** — Dashboard with hero card, stats, network cards, quick actions, recent orders
- **Buy Data** — Network logo selector → bundle grid → confirm → success
- **Orders** — Searchable & filterable orders table with network logos
- **Agents** (admin) — Agent cards with stats, networks used, top-up & orders buttons
- **Top-Up** (admin) — Agent selector cards + quick amount buttons

## Quick Start
```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build & Deploy
```bash
npm run build        # → dist/
# Netlify: drag dist/ to netlify.com/drop
# Vercel:  npx vercel
```
