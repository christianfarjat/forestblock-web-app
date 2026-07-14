# Integración del módulo Barrio en la app IntegrityX

Cómo dar acceso al módulo desde IntegrityX (y desde cualquier otra superficie
de la suite). El módulo corre como app propia; el host solo necesita un punto
de entrada + el feature flag por organización.

## 1. Host React (la app IntegrityX)

Copiá `IntegrityXBarrioTab.tsx` (autocontenido, solo React, estilos inline con
tokens ForestBlock) y usalo en la navegación o en el launcher de módulos:

```tsx
import { IntegrityXBarrioTab, IntegrityXBarrioCard, buildBarrioUrl } from './IntegrityXBarrioTab';

// En el sidebar/tab bar:
<IntegrityXBarrioTab
  href={buildBarrioUrl(process.env.NEXT_PUBLIC_IXB_URL!, { orgId: org.id })}
  habilitado={org.features?.barrio === true}     // módulo habilitable (handoff §1.6)
  activo={pathname.startsWith('/barrio')}
/>

// En la home de módulos:
<IntegrityXBarrioCard href={process.env.NEXT_PUBLIC_IXB_URL!} habilitado={org.features?.barrio} />
```

`habilitado={false}` muestra el tab apagado con badge "próximamente" — el
módulo se vende/activa por organización sin tocar código.

## 2. Host sin React (Webflow, WordPress, HTML)

Usar `embed-snippet.html`: dos snippets autocontenidos (tab y card) con la
misma identidad visual. Reemplazar la URL de ejemplo por la real.

## 3. App ForestBlock de este repo (ya integrado)

La app raíz ya trae el tab: sección **INTEGRITYX → "IntegrityX Barrio"** en el
sidebar, que abre la página de acceso `/integrityx-barrio`. El botón "Abrir"
se habilita configurando `NEXT_PUBLIC_IXB_URL` en el deploy de la app raíz.

## 4. SSO — cómo compartir la sesión (sin tokens en URLs)

Recomendado (handoff §4.4): **mismo proyecto Firebase Auth / Identity Platform**
para IntegrityX y Barrio.

- Ambas apps inicializan Firebase con el mismo `authDomain`; si viven bajo el
  mismo eTLD+1 (p. ej. `app.integrityx.com` y `barrio.integrityx.com`), la
  sesión se comparte y el usuario entra ya logueado.
- El **rol y el alcance** viajan como *custom claims* del ID token
  (`{ role: 'resident', barrioId, viviendaId, features: { barrio: true } }`);
  la API los verifica en cada request (misma matriz que `lib/ixb_rbac.ts`).
- `buildBarrioUrl()` solo agrega metadatos NO sensibles (`?org=`, superficie
  sugerida). **Nunca** pasar ID tokens/refresh tokens por querystring: quedan
  en historial, logs y referrers.
- Si las apps no comparten dominio: usar un endpoint de handoff que emita un
  *custom token* de un solo uso (TTL ≤ 60 s) y canjearlo server-side en Barrio.

## 5. Checklist de habilitación por organización

1. Deploy del módulo hecho (ver `../docs/PRODUCCION.md`) y URL estable.
2. Flag `features.barrio = true` en la organización (custom claim / tabla).
3. `NEXT_PUBLIC_IXB_URL` configurada en la app host.
4. Alta de barrios y viviendas en el Backoffice Gestión; invitaciones a
   residentes (vinculación vivienda ↔ usuario).
5. Verificar el circuito completo con una cuenta por rol (residente carga →
   técnico verifica/sella → verificación pública).
