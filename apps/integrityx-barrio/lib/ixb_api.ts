/**
 * Contrato de API (handoff §3/§4.3) — misma API para web y móvil (Expo, Fase 3).
 *
 * MODO DEMO (default, sin NEXT_PUBLIC_IXB_API_URL): la UI usa ixb_store
 * directamente; nada sale del navegador. Con URL configurada, estas rutas son
 * el contrato que expone el BFF (Next.js Route Handlers o NestJS) delante de
 * Cloud SQL + servicio Carbono (FastAPI/Climatiq) + servicio de sellado.
 *
 * Autenticación (producción): Authorization: Bearer <Firebase ID token>
 * (SSO IntegrityX, roles como custom claims) — mismo esquema que Prisma ESG.
 */

export const API_BASE = process.env.NEXT_PUBLIC_IXB_API_URL ?? '';

export type ModoDatos = 'demo' | 'remoto';

export function modoDatos(): ModoDatos {
  return API_BASE ? 'remoto' : 'demo';
}

/** Catálogo de endpoints v1 — se materializa con OpenAPI en Fase 2. */
export const ENDPOINTS = {
  barrios: 'GET /api/v1/barrios',
  viviendas: 'GET|POST /api/v1/barrios/:barrioId/viviendas',
  registros: 'GET|POST /api/v1/registros',
  registroEstado: 'POST /api/v1/registros/:id/estado  { a: verificado|auditado|rechazado, nota? }',
  evidencia: 'POST /api/v1/registros/:id/evidencia  (signed URL a Cloud Storage)',
  factores: 'GET|POST|PATCH /api/v1/factores',
  factorAsignacion: 'PUT /api/v1/variables/:variable/factor  { factorId | null }',
  inventario: 'GET /api/v1/barrios/:barrioId/inventario?desde&hasta&estados',
  reportes: 'GET|POST /api/v1/reportes',
  sellarReporte: 'POST /api/v1/reportes/:id/sello',
  verificarSello: 'GET /api/v1/sellos/:sha256  (público, sin auth)',
  cuestionario: 'GET|PUT /api/v1/barrios/:barrioId/cuestionario',
  metas: 'GET|POST /api/v1/barrios/:barrioId/metas',
  avisos: 'GET|POST /api/v1/barrios/:barrioId/avisos',
  auditoria: 'GET /api/v1/auditoria?target=…  (append-only)',
} as const;

export async function apiFetch<T>(ruta: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) {
    throw new Error(
      'IXB en modo demo: no hay NEXT_PUBLIC_IXB_API_URL configurada. La UI usa ixb_store.'
    );
  }
  const res = await fetch(`${API_BASE}${ruta}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}
