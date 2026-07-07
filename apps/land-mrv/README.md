# Land_MRV (ForestTrack) — módulo `Land_Stratify`

App de la **ForestBlock Suite** para el ciclo **MRV** (Monitoreo, Reporte y Verificación).
Primer módulo: **Land_Stratify** — *Diseño de Muestreo / Estratificación T0* según la spec
**MJM-FB-MRV-IT-001-V0** (handoff 06-07-2026).

> Un KML (perímetro de un **campo** o de una **QU**) → mapa de estratos + puntos de diseño
> de muestreo (Neyman), para **Era 1 (K-Means legacy)** y **Era 2 (DI armonizado)**,
> con exports listos para campo y para la VVB.

## Estado — Beta · Phase 1

| Pieza | Estado |
|---|---|
| Modelo de datos §2.4 (`StratAOI`, `StratRun`, `Stratum`, `SamplingDesign`, `SamplingPoint`) | ✅ espejo TypeScript en `lib/strat_types.ts` |
| `degradation_rank` canónico (1 = más degradado = rojo … 5 = mejor = verde oscuro) | ✅ `lib/strat_palette.ts` (`assignDegradationRanks`) — la paleta se ata al rank, nunca al `stratum_id` crudo |
| Ingesta KML/KMZ (schema unificado m14: 1 perímetro + N potreros) | ✅ `lib/strat_kml.ts` (vista previa client-side; el parse canónico lo hace el backend con `m14_landscan`) |
| Asignación Neyman + HalfCI% por estrato (objetivo ≤ 10%) | ✅ `lib/strat_neyman.ts` |
| Corrida Era 1 / Era 2, puntos primarios + reemplazos + alternativos + flags | ✅ engine demo `lib/strat_mock.ts` (determinístico por AOI) |
| Exports nomenclatura ENTE (`00_Estratos.*`, `00_Puntos.*`, stats CSV, KMZ, bundle ZIP) | ✅ `lib/strat_export.ts` (client-side) |
| Cliente API §2.6 (`/api/v2/stratify/*`) con background-job polling | ✅ `lib/strat_api.ts` — activa modo real al setear `NEXT_PUBLIC_STRATIFY_API_URL` |
| UI §2.7 (`Land_Stratify_Designer`, `Land_Stratify_MapView`, `Land_Stratify_ResultsPanel`, `LandStratifyCard`) | ✅ `components/mrv/stratify/` |
| Backend FastAPI + GEE + PostGIS (PRs 1–5, 7 de la spec) | ⏳ vive en la plataforma ForestScan (fuera de este repo) — esta app consume su contrato |

### Modo demo vs modo real

- **Sin `NEXT_PUBLIC_STRATIFY_API_URL`** → *modo demo*: el KML se parsea client-side y la
  estratificación corre con un engine simulado y determinístico (misma AOI ⇒ mismo resultado).
  El flujo, el modelo de datos, el re-ranking canónico, el muestreo Neyman y los exports son
  los reales; los valores espectrales no (no hay GEE).
- **Con `NEXT_PUBLIC_STRATIFY_API_URL`** → la UI consume el `strat_router` real
  (FastAPI/Cloud Run, motor espectral de Land_Screening, parser m14, bucket
  `gs://forestscan-stratify/`), posteando la corrida y polleando el background job.

## Desarrollo

```bash
cd apps/land-mrv
npm install
cp .env.example .env.local   # opcional: setear la URL del backend
npm run dev                  # http://localhost:3000
```

Rutas:

- `/` — dashboard **ForestTrack (Land_MRV)** con la card de Land_Stratify (+ módulos futuros).
- `/stratify` — módulo completo: ingesta KML → params (eras, estratos objetivo, HalfCI%,
  spacing, min_distance) → corrida → mapa Leaflet (estratos por `degradation_rank`, capa DI,
  puntos por tipo) → tablas (estratos, umbrales DI, matriz QU×Estrato, puntos con flags y
  reemplazo) → exports.

## Diseño

Tokens y lenguaje visual ForestBlock/ForestScan (mismos de Land_Screening / Land_Planning):
crema `#FCFFF6`, verde bosque `#182D1F`, limas `#BFF179` / `#DAFAA1`, tipografía **Aeonik**,
radios 18/28 px, pills. Ver `tailwind.config.ts` y `components/common/ui.tsx`.

## Criterios de aceptación (§2.9) — trazabilidad

- `degradation_rank` canónico verificado en ambas eras: el engine demo de Era 2 genera a
  propósito `stratum_id` crudos con E1 = "DI bajo (mejor)" (caso busnadiego) y el re-ranking
  los corrige (E1 visual siempre = rojo = peor).
- Puntos con primarios + reemplazos + alternativos, flags (`near_aoi_boundary`,
  `near_strata_boundary`, `on_road`) y HalfCI% por estrato reportado contra el objetivo.
- KML de QU → potreros/campos miembros detectados y matriz QU×Estrato (Era 2).
- Export KMZ abre en Google Earth / GuruMaps con estratos coloreados + puntos.
- Los golden tests contra los exports ENTE QU2 (Corvalán) `01_Est` / `12_DI` / `00_Puntos`
  corresponden al backend (PRs 3–5 de la spec, `test_strat_*.py`) — fuera de esta app.

## No deployar

Regla del handoff §2.2: merge a `main`; el deploy lo decide Christian.
