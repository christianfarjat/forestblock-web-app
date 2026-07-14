# IntegrityX Barrio — MRV de barrios de viviendas sustentables

Webapp (PWA) **multi-barrio, multi-vivienda, multi-rol** para **medir, monitorear y
preparar certificación** de sustentabilidad de barrios — módulo habilitable dentro
de **IntegrityX** (ForestBlock / MJM Inversiones). Fase 1 (MVP) del handoff
`Handoff_ClaudeCode_IntegrityX_Barrio_v1`, más verificación + hash-stamp de Fase 2.

> Regla de producto (§13): la app **no certifica** — mide, monitorea y prepara.
> Todo dato tiene estado **Declarado → Verificado → Auditado** y ningún factor
> de emisión existe sin fuente.

## Correr

```bash
cd apps/integrityx-barrio
npm install
npm run dev        # http://localhost:3000
npm run smoke      # golden tests del motor de carbono + hash + seed (24 checks)
npm run type-check # tsc --noEmit
npm run build      # build de producción (rutas 100% estáticas)
```

Sin configuración corre en **MODO DEMO**: seeds determinísticos (3 barrios MJM:
Tres Pinos, Laguna de las Pampas, Chacras de San Andrés; 30 viviendas; 6 meses de
registros), estado en `localStorage`, anclaje blockchain **simulado** y claramente
rotulado. Con `NEXT_PUBLIC_IXB_API_URL` el cliente apunta al backend real
(contrato en `lib/ixb_api.ts`). Variables: ver `.env.example`.

## Las 3 superficies (§2)

| Ruta | Superficie | Roles |
|------|-----------|-------|
| `/residente` (+ `/residente/cargar`) | Portal Residente: wizard de carga guiada, evidencia con SHA-256, "mi huella explicada", tips, logros, avisos, mejoras | `resident` |
| `/gestion` | Backoffice Gestión: KPIs y series por barrio y multi-barrio, viviendas (privacidad por rol), metas con avance, cuestionario de estándares (EDGE/ISO/SITES), comunicación | `committee`, `consortium`, `barrio_admin`, `developer` |
| `/tecnico` | Backoffice Técnico: bandeja de revisión, estados con segregación de funciones, inventario ISO 14064-1 + Scopes GHG, factores (fuente obligatoria, asignación variable→factor), expediente exportable (JSON/CSV), sellado, log de auditoría append-only | `tech_admin`, `verifier` (read-only) |
| `/verificar` | **Pública**: recalcula el SHA-256 del contenido sellado y lo compara con el hash anclado | cualquiera |

El selector de personas del header simula el **SSO IntegrityX** (producción:
Firebase/Identity Platform, roles como custom claims). El RBAC (`lib/ixb_rbac.ts`)
gobierna superficies, acciones del store y visibilidad de datos sensibles.

## Arquitectura del código

```
lib/
  ixb_types.ts      modelo de datos §7 + catálogo de variables (lenguaje simple)
  ixb_factors.ts    factores locales con fuente/vigencia/método; flag `calibrar`
  ixb_carbon.ts     motor §6: kgCO₂e = actividad × factor · ISO 14064 + Scopes
  ixb_standards.ts  estándares y cuestionario §5.2 (score ponderado)
  ixb_hash.ts       JSON canónico + SHA-256 (payloads sellados)
  ixb_chain.ts      anclaje §10: demo determinístico + diseño Polygon/OTS real
  ixb_rbac.ts       matriz de permisos §2/§8 (privacidad por rol)
  ixb_seed.ts       seeds determinísticos (PRNG con semilla fija)
  ixb_store.ts      store demo: acciones con RBAC, máquina de estados,
                    segregación verificador≠auditor, auditoría append-only
  ixb_export.ts     expediente JSON/CSV con snapshot de factores
  ixb_api.ts        contrato de la API real (misma semántica que el store)
scripts/smoke.ts    golden tests (paridad futura con el servicio Python)
```

Decisiones clave:

- **El motor de carbono es una librería pura** sin dependencias: portable tal cual
  al servicio FastAPI de Fase 2; `scripts/smoke.ts` son los golden tests de paridad.
- **Los cálculos se derivan** (registro × factor vigente) y se **materializan con
  snapshot del factor** al sellar o generar expediente → reproducibilidad de
  auditoría aunque el factor se recalibre después.
- **Factores sin fuente no existen** (la acción lo rechaza); los valores de
  referencia del demo llevan `calibrar: true` y la UI los señala en cada número.
- **Verificado/auditado ⇒ inmutable**: el residente no puede pisar un dato sellado
  (el wizard lo bloquea y lo explica); rechazo → corrección → vuelve a declarado.
- Variables **informativas** (solar, compost) se muestran **aparte, sin netear** (§6);
  `efluentes_tratados` nace sin factor a propósito para ejercitar el flujo
  "asignación de factor por el técnico" (IPCC 2019 cap. 6).

## Qué es demo (rotulado en la UI) y qué falta para producción

- Anclaje blockchain **simulado** (tx determinística del hash). Producción: contrato
  `store(bytes32)` en Polygon PoS u OpenTimestamps — interfaz ya definida en
  `ixb_chain.ts`, claves solo server-side (Secret Manager).
- Autenticación por selector de personas. Producción: SSO IntegrityX + custom claims.
- Persistencia en `localStorage`. Producción: Cloud SQL/Supabase Postgres + RLS.
- Factores eléctricos/agua/residuos: valores de referencia marcados `calibrar` —
  reemplazar por el factor oficial vigente o Climatiq (`CLIMATIQ_API_KEY`).
- OCR de facturas, asistente Gemini, anomalías (BigQuery), capa satelital: Fase 2
  (los puntos de integración están señalados en UI y código).

Más documentación:

- **[docs/PRODUCCION.md](docs/PRODUCCION.md)** — puesta en producción paso a paso
  (deploy, env vars, etapas de conexión de servicios reales, seguridad).
- **[docs/MEJORAS_Y_OPTIMIZACIONES.md](docs/MEJORAS_Y_OPTIMIZACIONES.md)** — mejoras
  implementadas y propuestas sobre el handoff.
- **[integration/README.md](integration/README.md)** — tab de acceso para la app
  IntegrityX (componente React portable + snippet HTML + patrón SSO).
- **[landing/index.html](landing/index.html)** — landing autocontenida para la web
  de IntegrityX.
