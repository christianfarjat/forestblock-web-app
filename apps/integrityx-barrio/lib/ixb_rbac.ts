/**
 * RBAC + row-level authz (handoff §2 y §8).
 *
 * En producción estos permisos viajan como custom claims (Firebase / Identity
 * Platform, SSO IntegrityX) y se refuerzan en la API/RLS. En el MVP demo la
 * matriz gobierna la UI y las acciones del store — misma semántica.
 *
 * Privacidad (§8): el consumo de una vivienda es dato sensible. Los roles de
 * gestión ven AGREGADOS; el detalle por vivienda con valores queda para
 * administración/desarrollador/técnicos. El residente solo ve su vivienda.
 */
import type { Persona, Rol } from './ixb_types';

export type Permiso =
  | 'cargar_registros' // portal residente (su vivienda)
  | 'ver_vivienda_propia'
  | 'ver_barrio_agregado' // dashboards agregados del barrio
  | 'ver_valores_viviendas' // valores individuales por vivienda (sensible)
  | 'ver_estado_viviendas' // completitud/estados sin valores
  | 'gestionar_viviendas'
  | 'gestionar_metas'
  | 'publicar_avisos'
  | 'responder_cuestionario'
  | 'ver_multibarrio'
  | 'cargar_areas_comunes'
  | 'revisar_registros' // bandeja técnica
  | 'cambiar_estado' // declarado→verificado→auditado / rechazar
  | 'gestionar_factores'
  | 'generar_expediente'
  | 'ver_auditoria';

const MATRIZ: Record<Rol, Permiso[]> = {
  resident: ['cargar_registros', 'ver_vivienda_propia', 'ver_barrio_agregado'],
  committee: [
    'ver_barrio_agregado',
    'ver_estado_viviendas',
    'gestionar_metas',
    'publicar_avisos',
    'responder_cuestionario',
  ],
  consortium: ['ver_barrio_agregado', 'ver_estado_viviendas', 'publicar_avisos', 'cargar_areas_comunes'],
  barrio_admin: [
    'ver_barrio_agregado',
    'ver_estado_viviendas',
    'ver_valores_viviendas',
    'gestionar_viviendas',
    'gestionar_metas',
    'publicar_avisos',
    'responder_cuestionario',
    'cargar_areas_comunes',
  ],
  developer: [
    'ver_multibarrio',
    'ver_barrio_agregado',
    'ver_estado_viviendas',
    'ver_valores_viviendas',
    'gestionar_metas',
  ],
  tech_admin: [
    'ver_multibarrio',
    'ver_barrio_agregado',
    'ver_estado_viviendas',
    'ver_valores_viviendas',
    'revisar_registros',
    'cambiar_estado',
    'gestionar_factores',
    'generar_expediente',
    'ver_auditoria',
  ],
  verifier: [
    'ver_multibarrio',
    'ver_barrio_agregado',
    'ver_estado_viviendas',
    'ver_valores_viviendas',
    'revisar_registros',
    'ver_auditoria',
  ],
  superadmin: [
    'ver_multibarrio',
    'ver_barrio_agregado',
    'ver_estado_viviendas',
    'ver_valores_viviendas',
    'gestionar_viviendas',
    'gestionar_metas',
    'publicar_avisos',
    'responder_cuestionario',
    'cargar_areas_comunes',
    'revisar_registros',
    'cambiar_estado',
    'gestionar_factores',
    'generar_expediente',
    'ver_auditoria',
    'cargar_registros',
    'ver_vivienda_propia',
  ],
};

export function can(rol: Rol, permiso: Permiso): boolean {
  return MATRIZ[rol]?.includes(permiso) ?? false;
}

/** Barrios visibles para una persona (scoping por barrio, §8). */
export function barriosVisibles<T extends { id: string }>(persona: Persona, barrios: T[]): T[] {
  if (can(persona.rol, 'ver_multibarrio') || persona.barrioId === null) return barrios;
  return barrios.filter((b) => b.id === persona.barrioId);
}

/** Superficies habilitadas por rol (las 3 UX del §2). */
export function superficiesDe(rol: Rol): ('residente' | 'gestion' | 'tecnico')[] {
  const out: ('residente' | 'gestion' | 'tecnico')[] = [];
  if (can(rol, 'cargar_registros')) out.push('residente');
  if (
    can(rol, 'gestionar_metas') ||
    can(rol, 'gestionar_viviendas') ||
    can(rol, 'publicar_avisos') ||
    (can(rol, 'ver_barrio_agregado') && rol !== 'resident')
  ) {
    out.push('gestion');
  }
  if (can(rol, 'revisar_registros')) out.push('tecnico');
  return out;
}
