# carbonTrack — ESG Tracking & Disclosure Platform

> **Enterprise-grade ESG performance tracking, evidence management, and audit-ready reporting for ForestBlock.**

carbonTrack is a comprehensive ESG (Environmental, Social, Governance) tracking and disclosure platform built with modern React, TypeScript, and a rigorous design system. It provides organizations with centralized visibility over ESG metrics, framework compliance, evidence management, and regulatory disclosures.

---

## Features

### Core Modules

- **ESG Overview** — Dashboard with high-level KPIs across all three pillars, trend analysis, framework coverage, and upcoming deadlines
- **Environmental** — Detailed tracking of emissions (Scope 1/2/3), energy mix, water consumption, waste management, and biodiversity metrics
- **Social** — Workforce composition, diversity metrics, health & safety performance, training hours, and community engagement
- **Governance** — Board independence, ethics training, compliance rates, risk assessment coverage, and whistleblower cases
- **Frameworks** — Detailed disclosure mapping (ESRS, GRI, SASB, GHG Protocol, CDP) at the datapoint level with coverage tracking
- **Evidence Vault** — Centralized document repository with validation state, version history, and source tracking for audit trails
- **Reports & Disclosures** — Status tracking for regulatory disclosures, temporal coverage, framework alignment, and change logs

### Key Capabilities

- **Audit-ready tables** — All indicators display evidence state (verified/partial/missing), completeness %, and linked frameworks
- **Data-driven charts** — Emissions trends, H&S performance, energy mix, board composition (Recharts with theme integration)
- **Framework mapping** — Precise disclosure-level documentation; ESRS E1-6, GRI 305-1, SASB GHG, etc., linked to actual indicators
- **Dark mode support** — Full light/dark theme via CSS variables and Tailwind, no hardcoded colors
- **Design consistency** — Evergrid-derived system with restrained color (strong only for deltas/status/badges), medium-high density
- **Comprehensive testing** — 69 unit tests covering all shared components (Vitest + Testing Library)

---

## Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 + CSS Variables (tokens) |
| **Charts** | Recharts 2 |
| **UI Icons** | lucide-react (via Tailwind SVG icons) |
| **Testing** | Vitest 4 + @testing-library/react |
| **Environment** | Node.js 18+, npm 9+ |

---

## Project Structure

```
src/
├── app/
│   ├── esg/
│   │   ├── layout.tsx              # ESG app shell (sidebar + topbar)
│   │   ├── overview/page.tsx       # ESG Overview dashboard
│   │   ├── environmental/page.tsx  # Environmental detail
│   │   ├── social/page.tsx         # Social detail
│   │   ├── governance/page.tsx     # Governance detail
│   │   ├── frameworks/page.tsx     # Framework mapping
│   │   ├── evidence/page.tsx       # Evidence Vault
│   │   └── reports/page.tsx        # Reports & Disclosures
│   ├── globals.css                 # Design tokens (CSS vars, light/dark)
│   └── layout.tsx                  # Root layout
│
├── components/
│   ├── esg/
│   │   ├── AppShell.tsx            # Sidebar + Topbar navigation
│   │   ├── KPIWidget.tsx           # Metric card (value, trend, status, target)
│   │   ├── PillarCard.tsx          # E/S/G pillar summary with completeness
│   │   ├── IndicatorsTable.tsx     # Audit table: indicators with evidence state
│   │   ├── EvidenceTable.tsx       # Document table: name, type, version, source, validation
│   │   ├── DisclosuresTable.tsx    # Datapoint mapping: disclosure ID, topic, linked indicator
│   │   ├── ReportStatusCard.tsx    # Report card: framework, coverage, pillars, deadline
│   │   ├── TrendChart.tsx          # Line chart (Recharts) with theme integration
│   │   ├── BarChart.tsx            # Bar chart (Recharts) with horizontal/vertical layout
│   │   ├── PieChart.tsx            # Pie chart (Recharts) for emissions breakdown
│   │   ├── ProgressBar.tsx         # Goal tracking bar with status colors
│   │   └── __tests__/              # 69 unit tests for all components
│   │
│   └── [existing components for main app]
│
├── data/
│   └── esg-mock.ts                 # Demo data: overview, E/S/G detail, evidence, reports, frameworks
│
├── types/
│   └── [type definitions]
│
└── utils/
    └── [utilities]

tailwind.config.ts                  # Evergrid token integration
vitest.config.ts                    # Test environment config
vitest.setup.ts                     # Jest-DOM, cleanup, mocks
```

---

## Getting Started

### Installation

```bash
# Clone and navigate
git clone <repo>
cd forestblock-web-app

# Install dependencies
npm install

# (Optional) Install test-specific deps if not already done
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

### Development

```bash
# Start dev server (Next.js Turbopack)
npm run dev

# Open http://localhost:3000/esg/overview
```

### Build & Production

```bash
# Type-check and build
npm run build

# Start production server
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

---

## Design System

### Color Tokens

Colors are defined as CSS variables in `src/app/globals.css` (light and dark modes) and exposed to Tailwind via `tailwind.config.ts`.

**Never hardcode hex colors in components.** Use Tailwind utilities instead:

```tsx
// ✅ Good
<div className="bg-surface text-text border-border">

// ❌ Bad
<div style={{ backgroundColor: "#FFFFFF", color: "#122018" }}>
```

#### Light Mode (`:root`)
- **Surfaces**: `--c-bg`, `--c-surface`, `--c-surface-alt`, `--c-surface-strong`
- **Text**: `--c-text`, `--c-text-muted`, `--c-text-faint`
- **Pillars**: `--c-primary` (E=green), `--c-secondary` (S=blue), `--c-accent` (G=gold)
- **Status**: `--c-success`, `--c-warning`, `--c-danger`, `--c-info`

#### Dark Mode (`@media (prefers-color-scheme: dark)`)
- Same tokens, inverted luminosity
- Automatic via browser preference or user override

### Pillar Colors

- **Environmental (E)**: `primary` (green #1E6B4C) — emissions, energy, water, waste, biodiversity
- **Social (S)**: `secondary` (blue #0E4E5A) — workforce, diversity, H&S, training, community
- **Governance (G)**: `accent` (gold #B8892D) — board, ethics, compliance, risk

### Typography

- **Display/Headings**: `font-display` (General Sans/Inter)
- **Body text**: `font-sans` (Inter)
- **Monospace (IDs, codes)**: `font-mono` (JetBrains Mono)
- **Numbers**: `tabular-nums` class for alignment

### Motion

- **Reveal animation**: `.reveal` class (fade + translate 8px over 300ms)
- **Hover states**: Subtle background/border transitions, no exuberant effects
- **No glassmorphism**, gradients, or 3D effects — maintain professional audit-ready look

---

## Code Conventions

### Components

```tsx
// ✅ Functional, exported with `export function`
'use client';  // Client component marker (if interactive)

import React from 'react';

interface Props {
  label: string;
  value: number;
  status?: 'on_track' | 'attention' | 'at_risk';
}

export function MyComponent({ label, value, status }: Props) {
  return (
    <div className="bg-surface text-text">
      <h3>{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
```

### Data & Types

- Use **type-safe status/evidence enums** from `src/data/esg-mock.ts`:
  - `status`: `'on_track' | 'attention' | 'at_risk'`
  - `evidence`: `'verified' | 'partial' | 'missing'`
  - `pillar`: `'environmental' | 'social' | 'governance'`
- **Reuse** `statusMeta`, `evidenceMeta`, `frameworkMeta` objects — don't invent new ones
- **Demo data** clearly marked in `esg-mock.ts` with comment `// DEMO ONLY`
- **No real project data** fabricated; all real data loads from API

### Comments

- **Default**: No comments. Well-named identifiers are self-documenting.
- **Use when**: Hidden constraint, subtle invariant, non-obvious workaround, or framework-specific behavior.
- **Never**: Comment the obvious ("sets the title"), reference callers ("used by Overview"), or mention issue numbers (belongs in PR).

### Imports

- Use **path alias** `@/` (configured in `tsconfig.json` and `vitest.config.ts`):
  ```tsx
  import { KPIWidget } from '@/components/esg/KPIWidget';
  import { esgOverviewData } from '@/data/esg-mock';
  ```

### Build & Type-Check

```bash
# Before committing, run:
npm run build     # Compiles, lints, type-checks

# Should exit 0 (no errors in ESG components)
npx tsc --noEmit

# Should pass all tests
npm test
```

---

## Testing

### Test Philosophy

- **Unit tests** for shared components (KPIWidget, tables, charts)
- **Props → output**: Verify correct rendering of values, labels, units, status indicators
- **Edge cases**: Empty arrays, missing props, overflow values, dark mode
- **Accessibility**: Semantic Testing Library queries (getByText, getByRole, getByTestId)

### Running Tests

```bash
# Run all tests (watch mode by default)
npm test

# Run specific test file
npm test -- src/components/esg/__tests__/KPIWidget.test.tsx

# UI dashboard (interactive)
npm run test:ui

# Coverage report
npm run test:coverage
```

### Example Test

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPIWidget } from '../KPIWidget';

describe('KPIWidget', () => {
  it('renders label and value', () => {
    render(
      <KPIWidget
        label="Emissions"
        value={1240}
        unit="tCO2e"
      />
    );

    expect(screen.getByText('Emissions')).toBeInTheDocument();
    expect(screen.getByText(/1,?240/)).toBeInTheDocument();
  });
});
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Design tokens (CSS vars for light/dark) |
| `tailwind.config.ts` | Tailwind color extensions, spacing, shadow, radius |
| `src/data/esg-mock.ts` | Demo data: overview, E/S/G, evidence, reports, frameworks |
| `src/components/esg/AppShell.tsx` | Sidebar nav + topbar (all ESG pages inherit) |
| `vitest.config.ts` | Test environment (jsdom, alias resolution) |
| `vitest.setup.ts` | Jest-DOM matchers, cleanup, Next.js mocks |

---

## Data Model

### Indicator Status

```typescript
status: 'on_track' | 'attention' | 'at_risk'
// Color: success | warning | danger
// Used in KPIWidget, status badges, trend indicators
```

### Evidence State

```typescript
evidence: 'verified' | 'partial' | 'missing'
// Icon: ✓ | ◐ | ✕
// Color: success | warning | danger
// Used in IndicatorsTable, EvidenceTable
```

### Pillar Type

```typescript
pillar: 'environmental' | 'social' | 'governance'
// Color: primary (green) | secondary (blue) | accent (gold)
// Icon: 🌱 | 👥 | ⚖️
```

### Framework IDs (Precise Versions)

- `ESRS` — Delegated Regulation 2023/2772 (EU-wide)
- `GRI` — GRI Standards 2021
- `SASB` — ISSB / SASB 2023
- `GHG Protocol` — Corporate Standard (revised 2015)
- `CDP` — Climate Change 2024

Datapoint examples: `ESRS E1-6`, `GRI 305-1`, `SASB GHG`, `GHG S1`, `CDP C6`

---

## Performance & Optimization

- **Lazy loading**: Routes use Next.js App Router automatic code splitting
- **CSS**: Tailwind JIT (just-in-time) compiles only used classes
- **Charts**: Recharts re-renders on data change; memoization available if needed
- **Images**: Next.js Image component (not yet used; available for future logos/assets)

---

## Dark Mode

Dark mode is automatic via `@media (prefers-color-scheme: dark)` CSS media query.

To test:
1. Open DevTools (F12)
2. Cmd+Shift+P → "Render with dark mode" → toggle
3. All colors update via CSS variables; no component changes needed

---

## Accessibility

- **Semantic HTML**: Use `<h1>`, `<h2>`, `<table>`, etc.
- **ARIA labels**: For custom components without semantic equivalents
- **Contrast**: All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- **Keyboard navigation**: All interactive elements accessible via Tab/Enter

---

## Known Limitations & Future Work

### Current (Demo Mode)

- **Data**: All data in `src/data/esg-mock.ts` is demo/placeholder
- **Real data**: Requires API integration (ForestTrack/ForestScan backend)
- **Routing**: ESG module uses Next.js routing; main app uses internal state-based navigation (should unify)
- **ESLint**: Legacy errors in `NewFeature/`, `Sidebar/Menu.tsx` (pre-ESG code)

### Roadmap

1. **Real data layer** — Replace mock.ts with API contracts + types
2. **Authentication** — Route guards, user context, org switcher
3. **Form submission** — Save indicator updates, evidence uploads
4. **Real-time sync** — WebSocket or polling for live metric updates
5. **Export/Print** — PDF generation for reports, XLSX for data
6. **User roles** — Org admin, ESG lead, auditor, viewer
7. **Audit log** — Track all changes with user/timestamp for compliance
8. **Notifications** — Alerts for missing evidence, upcoming deadlines

---

## Troubleshooting

### Dev Server Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Type Errors on Build

```bash
# Check all files
npx tsc --noEmit

# ESG files should be clean; errors likely in pre-ESG code
```

### Tests Failing

```bash
# Ensure setup is correct
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Run with verbose output
npm test -- --reporter=verbose
```

### Dark Mode Not Working

- Browser may cache light preference; hard-refresh (Cmd+Shift+R)
- Check DevTools: Elements → `<html>` should inherit `prefers-color-scheme` from OS

---

## Contributing

### Before Submitting a PR

1. **Type-check**: `npx tsc --noEmit` (must exit 0)
2. **Tests**: `npm test` (all passing)
3. **Build**: `npm run build` (should succeed)
4. **Design system**: No hardcoded colors, use Tailwind utilities only
5. **Naming**: Use clear, domain-specific identifiers (e.g., `GHGEmissions`, not `data1`)
6. **Conventions**: Follow patterns in existing components (no new abstractions without reason)

### Commit Message Format

```
Type: Brief description

- Bullet list of changes
- Reference to feature/issue if applicable

Co-Authored-By: Your Name <email>
```

Example:
```
Build: Add Environmental detail screen

- Create environmental/page.tsx with KPIs, trend charts, indicator table
- Add environmentalDetailData to esg-mock.ts (emissions, energy, water, waste, biodiversity)
- Extend EvidenceTable for audit trail display
- Type-check and tests pass

Fixes #42
```

---

## License & Attribution

ForestBlock ESG Suite. © 2026.

**Design System**: Derived from Evergrid reference (not a literal copy). Original architecture and tokens adapted for ForestBlock's climate-tech domain.

**Tech Stack**: Next.js, TypeScript, Tailwind CSS, Recharts, Vitest, Testing Library.

---

## Support & Documentation

- **Design Tokens**: See `src/app/globals.css` and `tailwind.config.ts`
- **Component Inventory**: All components in `src/components/esg/`
- **Data Layer**: Mock structure in `src/data/esg-mock.ts`; real API TBD
- **Framework Specs**:
  - [ESRS](https://eur-lex.europa.eu/eli/reg/2023/2772/oj) — EU Corporate Sustainability Reporting
  - [GRI](https://www.globalreporting.org/standards/) — Global standards for sustainability reporting
  - [SASB/ISSB](https://www.issb.org/) — Industry-specific and IFRS standards
  - [GHG Protocol](https://ghgprotocol.org/) — Greenhouse Gas emissions accounting
  - [CDP](https://www.cdp.net/) — Environmental disclosure platform

---

**Questions?** Review the code comments, check test files for usage examples, or consult the design token reference in `src/app/globals.css`.

**Ready to extend?** Pick a new feature (e.g., real data integration, export, user roles) and follow the existing component patterns.

---

*Last updated: June 2026 | Built with Claude Code*
