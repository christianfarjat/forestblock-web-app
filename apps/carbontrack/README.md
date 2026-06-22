# carbonTrack — Standalone ESG Platform

> **Enterprise-grade ESG tracking & disclosure platform**

This is the **standalone version** of carbonTrack. For the integrated version within ForestBlock, see `apps/forestblock-web-app`.

## Features

- **ESG Overview** — High-level KPIs, trend analysis, framework coverage
- **Environmental** — Emissions (Scope 1/2/3), energy, water, waste tracking
- **Social** — Workforce, diversity, health & safety, training, community metrics
- **Governance** — Board composition, ethics, compliance, risk assessment
- **Frameworks** — ESRS, GRI, SASB, GHG Protocol, CDP mapping (datapoint-level)
- **Evidence Vault** — Document repository with validation state tracking
- **Reports** — Disclosure status, change log, deadline tracking

## Development

```bash
# From monorepo root
pnpm install

# Start carbontrack dev server
cd apps/carbontrack
pnpm dev

# Open http://localhost:3000/esg/overview
```

## Build & Deploy

```bash
# Build standalone
pnpm build

# Start production server
pnpm start
```

## Architecture

- **Shared Components** — `packages/ui/esg/`
- **Mock Data** — `packages/data/`
- **Types** — `packages/types/`
- **Utilities** — `packages/utils/`

This app imports from shared packages; no code duplication.

## Testing

```bash
pnpm test              # Run tests
pnpm test:ui           # Interactive test UI
pnpm test:coverage     # Coverage report
```

## Type Checking

```bash
pnpm type-check
```

---

For full documentation, see [../../DEVELOPMENT_GUIDE.md](../../DEVELOPMENT_GUIDE.md)
