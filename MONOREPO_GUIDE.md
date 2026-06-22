# ForestBlock Monorepo — Structure & Setup

## Overview

This is a **pnpm monorepo** containing:
- **Apps**: ForestBlock Web App + standalone carbonTrack
- **Packages**: Shared UI, types, data, utilities

## Structure

```
forestblock-web-app/
├── apps/
│   ├── forestblock-web-app/          # Main ForestBlock app (ESG integrated)
│   │   ├── src/                      # App-specific code (dashboard, profiles, etc.)
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   └── carbontrack/                  # Standalone ESG app
│       ├── src/app/esg/              # ESG pages (overview, environmental, etc.)
│       ├── package.json
│       └── next.config.ts
│
├── packages/
│   ├── ui/                           # Shared React components
│   │   ├── esg/                      # ESG components (KPIWidget, IndicatorsTable, etc.)
│   │   └── package.json
│   │
│   ├── types/                        # TypeScript types
│   │   ├── esg.ts                    # ESG domain types
│   │   └── package.json
│   │
│   ├── data/                         # Mock data
│   │   ├── esg-mock.ts               # ESG mock data
│   │   └── package.json
│   │
│   └── utils/                        # Utilities
│       ├── format.ts                 # Formatting helpers
│       └── package.json
│
├── turbo.json                        # Turborepo configuration
├── pnpm-workspace.yaml               # pnpm workspace config
└── package.json                      # Monorepo root (scripts, workspaces)
```

## Setup

### Prerequisites

- Node.js 18+
- pnpm 9+

```bash
npm install -g pnpm
```

### Installation

```bash
# Install dependencies for all packages
pnpm install

# Or from specific app
cd apps/carbontrack
pnpm install
```

## Development

### Run Both Apps

```bash
# Start all dev servers (from monorepo root)
pnpm dev

# Or run specific app
pnpm dev:fb   # ForestBlock Web App
pnpm dev:ct   # carbonTrack standalone
```

### Available Commands

```bash
# Build all packages & apps
pnpm build

# Run tests (all workspaces)
pnpm test
pnpm test:ui
pnpm test:coverage

# Type checking
pnpm type-check

# Linting
pnpm lint

# Clean everything
pnpm clean
```

## Package Publishing & Dependencies

### Internal Dependencies

Apps can import from packages using workspace protocol:

```typescript
// In apps/carbontrack/src/app/esg/overview/page.tsx
import { esgOverviewData } from '@forestblock/data';
import { KPIWidget } from '@forestblock/ui/esg';
import type { Indicator } from '@forestblock/types/esg';
```

### External Dependencies

If all apps use the same dep version, add to **monorepo root**:
```json
// package.json (root)
"dependencies": { "react": "^19" }
```

If version differs per app, add to **app-specific** package.json.

## Adding New Shared Code

### New Component

```typescript
// packages/ui/esg/MyNewComponent.tsx
export function MyNewComponent(props: Props) { ... }

// packages/ui/esg/index.ts
export { MyNewComponent } from './MyNewComponent';

// Then import in apps
import { MyNewComponent } from '@forestblock/ui/esg';
```

### New Type

```typescript
// packages/types/esg.ts
export interface MyNewType { ... }

// Then import in apps
import type { MyNewType } from '@forestblock/types/esg';
```

### New Mock Data

```typescript
// packages/data/esg-mock.ts
export const myNewData = { ... };

// Then import in apps
import { myNewData } from '@forestblock/data';
```

## Deployment

### ForestBlock Web App

Deploy `apps/forestblock-web-app`:
```bash
# From app directory
pnpm build
pnpm start
```

### carbonTrack Standalone

Deploy `apps/carbontrack` independently:
```bash
# From app directory
cd apps/carbontrack
pnpm build
pnpm start
```

Both apps use shared packages from the monorepo, so ensure packages are built first.

## Turborepo Benefits

- **Parallel builds** — Apps & packages build simultaneously
- **Caching** — Turbo caches build outputs, tests
- **Task running** — `turbo dev` starts all dev servers at once
- **Smart dependencies** — Automatically figures out build order

See `turbo.json` for configuration.

## Troubleshooting

### Dependencies not found

Ensure packages are listed in `package.json`:
```json
{
  "dependencies": {
    "@forestblock/ui": "workspace:*",
    "@forestblock/types": "workspace:*"
  }
}
```

### Dev server won't start

```bash
# Clear cache
pnpm clean

# Reinstall
pnpm install

# Start again
pnpm dev
```

### Type errors in shared packages

Ensure `packages/*/package.json` has correct exports:
```json
{
  "exports": {
    ".": "./index.ts",
    "./esg": "./esg/index.ts"
  }
}
```

## Git & Version Control

- **Single repo** — All code in one git repo
- **Commit to root** — Changes affect all apps/packages
- **Independent deploys** — Each app can deploy independently

---

For development philosophy, see [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)

For carbonTrack features, see [apps/carbontrack/README.md](apps/carbontrack/README.md)

For ForestBlock integration, see [apps/forestblock-web-app/README.md](apps/forestblock-web-app/README.md)
