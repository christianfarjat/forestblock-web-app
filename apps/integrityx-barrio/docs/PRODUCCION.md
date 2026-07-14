# IntegrityX Barrio — Puesta en producción

Guía paso a paso para publicar el módulo, habilitar el acceso desde la suite y
conectar los servicios reales por etapas. Complementa a
[MEJORAS_Y_OPTIMIZACIONES.md](MEJORAS_Y_OPTIMIZACIONES.md) y a
[../integration/README.md](../integration/README.md).

## 0. Mapa de deploys del repo (no mezclar)

| App | Dónde se despliega | Config |
|---|---|---|
| ForestBlock (raíz, `src/`) | Netlify | `netlify.toml` raíz |
| Prisma ESG (`apps/prisma-esg-frontend`) | Vercel (proyecto existente) | `vercel.json` raíz — **rutea TODO a prisma-esg; no tocarlo** |
| **IntegrityX Barrio** (`apps/integrityx-barrio`) | **Proyecto NUEVO** (Vercel recomendado; alternativa Firebase Hosting) | ninguna config raíz — se configura por *Root Directory* |

> El `vercel.json` de la raíz pertenece al deploy de Prisma ESG. Barrio se
> publica como **proyecto separado** apuntando a su subcarpeta; así ninguno
> pisa al otro.

## 1. Checklist previo al primer deploy

- [ ] `npm run type-check && npm run lint && npm run smoke && npm run build`
      en `apps/integrityx-barrio` — todo verde (así quedó en el repo).
- [ ] Decidir el modo del piloto:
      **A. Piloto demo** (sin backend): válido para mostrar y capacitar — la UI
      ya rotula MODO DEMO y "anclaje simulado" en todos lados.
      **B. Producción real**: completar la Etapa B (§5) antes de invitar residentes.
- [ ] Dominio elegido: recomendado `barrio.integrityx.<tld>` (subdominio del
      mismo eTLD+1 que la app IntegrityX simplifica el SSO — ver §5.2).
- [ ] Íconos PWA en PNG 192×192 y 512×512 junto al SVG (algunos Android viejos
      no aceptan SVG en el manifest) y actualizar `public/manifest.webmanifest`.
- [ ] **Factores**: los marcados `calibrar: true` (red eléctrica, agua,
      residuos) deben reemplazarse por el factor oficial vigente con su cita
      (Secretaría de Energía/CAMMESA, prestador local, Climatiq) **antes de
      emitir cualquier expediente real** — se editan en Técnico → Factores y
      quedan auditados.

## 2. Deploy de la webapp — Vercel (recomendado)

1. [vercel.com/new](https://vercel.com/new) → importar `christianfarjat/forestblock-web-app`.
2. **Root Directory: `apps/integrityx-barrio`** (clave). Framework: Next.js
   (autodetectado). Build: `npm run build` (default).
3. Variables de entorno: en modo demo no hace falta ninguna. Para producción
   real, cargar las de §4 (Production/Preview según corresponda).
4. Deploy → asignar dominio custom (`barrio.integrityx.<tld>`) — HTTPS
   automático.
5. Con esto, cada push a la rama conectada redeploya solo cuando cambia la
   subcarpeta (Vercel hace *scope* por Root Directory).

CLI equivalente: `cd apps/integrityx-barrio && npx vercel --prod` (elegir
"Link to existing project" la segunda vez).

### Alternativa — Firebase Hosting + Cloud Run (stack del handoff §4.4)

```bash
npm i -g firebase-tools
firebase login
firebase experiments:enable webframeworks
cd apps/integrityx-barrio
firebase init hosting        # elegir el proyecto GCP, framework Next.js
firebase deploy              # SSR sale a Cloud Run, estáticos a Hosting CDN
```

Usarla si se quiere todo dentro de GCP desde el día 1 (misma consola que
Cloud SQL/BigQuery/Vertex). Vercel es más simple para el piloto.

## 3. Smoke de producción (runbook post-deploy)

1. Abrir la URL → la home carga y muestra los 3 barrios (seed demo) o el login
   (modo API).
2. Circuito completo: Residente carga un mes → Técnico verifica y sella →
   `/verificar` da ✅ con el hash recalculado.
3. `/verificar` responde **sin sesión** (es pública por diseño).
4. Lighthouse → PWA instalable, sin errores de consola.
5. "Reiniciar demo" restaura los seeds (solo modo demo).

## 4. Variables de entorno por etapa

| Variable | Dónde | Etapa | Nota |
|---|---|---|---|
| `NEXT_PUBLIC_IXB_API_URL` | Vercel env | B1 | apunta la UI al BFF real; sin ella, modo demo |
| `FIREBASE_CONFIG` / claves web Firebase | Vercel env | B2 | SSO IntegrityX (custom claims de rol) |
| `CLIMATIQ_API_KEY` | **server-side** (BFF/Cloud Run) | B3 | jamás `NEXT_PUBLIC` |
| `POLYGON_RPC_URL` | servicio chain | B4 | |
| `CHAIN_PRIVATE_KEY` | **Secret Manager** | B4 | la wallet firma solo server-side |
| `GOOGLE_GENAI_API_KEY` / `GOOGLE_APPLICATION_CREDENTIALS` | servicio IA | B5 | OCR/asistente |

Regla: **nada sensible lleva prefijo `NEXT_PUBLIC_`** (todo lo `NEXT_PUBLIC_`
termina en el bundle del navegador).

## 5. Etapa B — conectar servicios reales (orden recomendado)

**B1. Base de datos + API (BFF).** Implementar el contrato de
`lib/ixb_api.ts` (los endpoints están listados y el store demo es la
especificación de comportamiento: RBAC, estados, unicidad
(vivienda, variable, período), auditoría append-only). Postgres gestionado:
Supabase (stack ForestBlock actual, RLS nativa) o Cloud SQL (§4.4). El modelo
es el de `lib/ixb_types.ts`.

**B2. SSO IntegrityX.** Mismo proyecto Firebase que IntegrityX; roles y alcance
como custom claims (`role`, `barrioId`, `viviendaId`, `features.barrio`).
Reemplazar el selector de personas: el único punto de acoplamiento es
`personaActual()` en `lib/ixb_store.ts`. Detalles y patrón de handoff seguro en
[../integration/README.md](../integration/README.md) §4.

**B3. Factores Climatiq.** Sincronización programada a la tabla local de
factores (snapshot + versión de dataset), no llamadas por cálculo — ver
MEJORAS B3. Los factores locales oficiales se cargan como *private factors*.

**B4. Sellado real.** Servicio mínimo (Cloud Function/Run) que recibe el
`sha256` y ejecuta `store(bytes32)` en Polygon PoS (contrato de 3 líneas
documentado en `lib/ixb_chain.ts`) o genera la prueba OpenTimestamps. La UI ya
consume la interfaz `AnclajeChain`; cambiar `getAnclaje()` para llamar al
servicio cuando `NEXT_PUBLIC_IXB_API_URL` esté configurada. Para volumen,
implementar el lote Merkle (1 tx/día) — MEJORAS B1.

**B5. IA (Fase 2).** OCR de facturas (Gemini Flash multimodal / Document AI)
que **pre-llena** el wizard (el residente confirma), asistente con grounding y
anomalías. Prototipar en AI Studio, productivizar en Vertex.

## 6. Seguridad antes de abrir a residentes (§8 del handoff)

- Autorización **server-side** con la misma matriz de `lib/ixb_rbac.ts`
  (RLS si Supabase; guards en el BFF si Cloud SQL). El front nunca es la
  única barrera.
- Consentimiento explícito para datos de consumo + política de privacidad
  publicada en la landing y el onboarding.
- Backups automáticos de la DB; log de auditoría en tabla append-only
  (sin UPDATE/DELETE grants).
- Rate limiting en `/verificar` y en la API pública de sellos.
- Rotación de secretos en Secret Manager; ninguna clave en el repo.
- On-chain va **solo el hash** (ya es así) — mantenerlo como invariante.

## 7. Habilitar el acceso desde la suite

**a) App ForestBlock (este repo — ya integrado).** El sidebar tiene la sección
**INTEGRITYX → "IntegrityX Barrio"** que abre `/integrityx-barrio` (página de
acceso). En Netlify (deploy de la raíz) setear:

```
NEXT_PUBLIC_IXB_URL=https://barrio.integrityx.<tld>
```

y el botón "Abrir IntegrityX Barrio" queda activo (sin la variable, la página
muestra el módulo "en habilitación").

**b) App IntegrityX (repo externo).** Usar el kit portable
`integration/IntegrityXBarrioTab.tsx` (React) o `integration/embed-snippet.html`
(no-React), con feature flag por organización — instrucciones completas en
`integration/README.md`.

## 8. Publicar la landing en la web de IntegrityX

`landing/index.html` es **autocontenida** (sin requests externos):

1. Reemplazar los dos `href` marcados `CTA_MODULO` por la URL real del módulo.
2. Publicarla como página del sitio (p. ej. `integrityx.com/barrio`):
   - Hosting propio/estático: subir el archivo tal cual.
   - Vercel/Netlify: carpeta con ese único archivo, deploy directo.
   - CMS (Webflow/WordPress): copiar secciones — los estilos van inline/en un
     único bloque `<style>`, sin dependencias.
3. El CTA de contacto apunta al WhatsApp que ya usa la app ForestBlock;
   ajustar si el canal comercial es otro.

## 9. CI recomendado (opcional)

Snippet para `.github/workflows/integrityx-barrio.yml` cuando quieran CI:

```yaml
name: integrityx-barrio
on:
  pull_request:
    paths: ['apps/integrityx-barrio/**']
jobs:
  verify:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: apps/integrityx-barrio } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm, cache-dependency-path: apps/integrityx-barrio/package-lock.json }
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run smoke
      - run: npm run build
```

## 10. Criterio de "listo para residentes reales"

1. Etapas B1 + B2 completas (datos en Postgres, SSO real).
2. Factores sin flag `calibrar` pendiente.
3. Sellado real (B4) o comunicación explícita de que aún es simulado.
4. Checklist de seguridad §6 completo.
5. Runbook §3 verde en el dominio productivo.
