# Prisma ESG — Frontend

Next.js 15 frontend for **Prisma ESG**, a production-ready ESG tracking and disclosure platform.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Auth | Firebase Authentication |
| API Client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

## Architecture

```
User (Browser)
   │ Firebase ID token + X-Organization-Id header
   ▼
Next.js (Vercel)
   │ API requests (axios)
   ▼
FastAPI Backend (Cloud Run)
```

## Local Development

### 1. Install dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Update `.env.local` with your Firebase and backend API configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Authentication
- Google Sign-in via Firebase
- Automatic user provisioning (JIT)
- Organization membership resolution
- Token refresh & persistence

### Dashboard
- Real-time ESG metrics (KPI widgets)
- Pillar-based progress tracking (Environmental, Social, Governance)
- Indicator status visualization (charts)
- Framework coverage analysis

### Indicators
- Create, read, update, delete indicators
- Filter by pillar
- Status tracking (on_track, attention, at_risk, not_started)
- Completeness percentage
- RBAC-aware UI (disabled for read-only roles)

### Evidence
- Drag-and-drop file upload
- Multiple file format support (PDF, DOC, XLS, images)
- Linked to indicators
- Private GCS access via signed URLs

### Organizations
- Multi-organization support
- Organization switcher in header
- Role-based access control (owner, admin, editor, viewer, auditor)

## Project Structure

```
app/
  layout.tsx         Root layout with metadata
  page.tsx           Main entry point (Login or Dashboard)
components/
  auth/
    login.tsx        Google Sign-in UI
    org-switcher.tsx Organization selection modal
  dashboard/
    dashboard.tsx    Main ESG dashboard
    kpi-widget.tsx   KPI cards
    pillar-overview.tsx ESG pillar summaries
  indicators/
    indicator-card.tsx Indicator card component
  evidence/
    evidence-uploader.tsx Drag-drop file upload
  common/
    button.tsx       Button component
    card.tsx         Card layouts
    modal.tsx        Modal dialog
    input.tsx        Form inputs
    alert.tsx        Alert notifications
    header.tsx       Top navigation
    layout.tsx       Page layout wrapper
hooks/
  use-auth.ts        Authentication state & lifecycle
  use-indicators.ts  Indicator CRUD & state
  use-evidence.ts    Evidence upload & download
lib/
  api-client.ts      Axios wrapper with auth/org headers
  firebase.ts        Firebase initialization
  auth-store.ts      Zustand auth state
  indicators-store.ts Zustand indicators state
  permissions.ts     RBAC permission matrix
  utils.ts           Date, color, formatting utilities
types/
  index.ts           TypeScript type definitions
styles/
  globals.css        Tailwind base styles
```

## API Integration

The frontend connects to the FastAPI backend at `NEXT_PUBLIC_API_URL`.

### Request Headers
- `Authorization: Bearer <firebase-id-token>` (all requests except /health)
- `X-Organization-Id: <uuid>` (org-scoped endpoints)

### Authentication Flow
1. User signs in with Google (Firebase)
2. Frontend obtains Firebase ID token
3. Frontend calls `/auth/me` to fetch user data
4. Frontend calls `/auth/me/organizations` to list memberships
5. User selects organization, context set for subsequent requests
6. All requests include ID token + organization ID headers
7. Backend verifies token, sets RLS context, enforces RBAC

## RBAC Permissions

Roles and permissions:
- **owner**: Full access (manage org, members, all CRUD)
- **admin**: All except org management
- **editor**: Read org, create/edit indicators & evidence
- **viewer**: Read-only across all entities
- **auditor**: Read-only audit logs

UI components check permissions and disable actions accordingly:
```typescript
{canEditIndicators(currentRole) && <Button>Create</Button>}
```

## Deployment (Vercel)

### Prerequisites
- Git repository on GitHub
- Vercel account (free tier sufficient)
- Firebase project configured

### One-click deploy
1. Push code to GitHub
2. Import repository on Vercel (vercel.com/new)
3. Set environment variables (`.env.local` → Vercel env vars)
4. Deploy
5. Vercel auto-redeployed on git push

### Environment Variables
Set these in Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://api.prisma-esg.example.com/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Testing

Run type checking:
```bash
npm run type-check
```

Linting:
```bash
npm run lint
```

## Building

```bash
npm run build
npm run start
```

## Common Issues

**"Unauthorized" errors**: Check Firebase credentials in `.env.local` and backend API URL.

**"Organization not found"**: Ensure you have a membership for the selected organization.

**"CORS errors"**: Backend must have frontend origin in `CORS_ORIGINS` env var.

**File upload fails**: Check GCS bucket permissions and signed URL generation in backend.

## Contributing

- Use TypeScript for type safety
- Follow existing component patterns
- Test in browser before committing
- Check permissions before enabling UI actions
