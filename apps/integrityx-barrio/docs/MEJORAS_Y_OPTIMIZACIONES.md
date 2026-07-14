# IntegrityX Barrio — Mejoras y optimizaciones propuestas sobre el handoff v1

Respuesta al pedido "proponé mejoras y optimización" sobre
`Handoff_ClaudeCode_IntegrityX_Barrio_v1`. Se divide en (A) mejoras **ya
implementadas** en este MVP — con su racional — y (B) propuestas para
Fase 2/3, priorizadas por impacto en costo, integridad y velocidad de entrega.

---

## A. Implementadas en este MVP

### A1. Motor de carbono como librería pura, no como servicio
El handoff (§3/§4.3) plantea desde el día 1 un BFF + servicio Python (Cloud Run)
+ servicio chain. Para Fase 1 eso son 3 deploys, 3 superficies IAM y latencia
extra para multiplicar `actividad × factor`. El motor quedó como **librería
TypeScript pura y determinista** (`lib/ixb_carbon.ts`) con **golden tests**
(`scripts/smoke.ts`). Cuando el OCR/ML justifique el servicio Python, esos mismos
golden tests garantizan paridad TS↔Python. **Ahorro estimado: 2 servicios menos
en Fase 1, cero drift de cálculo.**

### A2. Snapshot del factor en cada sello y expediente (reproducibilidad)
Los factores cambian (recalibración, nuevo dataset Climatiq). Si el cálculo solo
guarda `factor_id`, un recálculo posterior rompe la trazabilidad de lo auditado.
Regla implementada: **el cálculo vivo se deriva siempre del factor vigente, pero
al sellar (verificar/auditar) o generar expediente se congela un snapshot del
factor (valor + fuente + vigencia)** dentro del payload hasheado. Auditoría
reproducible años después, aunque el factor haya cambiado.

### A3. Estado del dato como máquina explícita + segregación de funciones
`declarado → verificado → auditado` (+ `rechazado` con nota obligatoria al
residente) con transiciones válidas codificadas, y una regla que el handoff no
pedía pero toda verificación seria exige: **quien audita debe ser distinto de
quien verificó** (doble control). Registros sellados = inmutables; la corrección
es un ciclo nuevo (rechazo → recarga → declarado).

### A4. "Sin fuente no hay factor" como invariante de código, no como consigna
La acción de crear/editar factores **rechaza** cualquier factor sin cita de
fuente (§13). Los valores de referencia del demo llevan `calibrar: true` y ese
flag se **propaga hasta cada número de la UI** (⚠ en residente, banners en
gestión/técnico, columna en el CSV del expediente). Nadie puede leer un total
sin saber si hay factores pendientes de calibración.

### A5. Privacidad por diseño en los dashboards de gestión (§8)
El consumo por vivienda es dato sensible. La matriz RBAC distingue
`ver_estado_viviendas` (completitud, sin valores — comité/consorcio) de
`ver_valores_viviendas` (administración/desarrollador/técnicos). El residente
solo ve su vivienda. Y a la cadena va **solo el hash**, nunca el payload.

### A6. Unicidad (vivienda, variable, período) + corrección controlada
El modelo §7 no fijaba clave de unicidad; sin ella aparecen dobles cargas del
mismo mes (la fuente #1 de basura en datos MRV). Implementado: clave única, el
wizard **pre-carga lo existente**, corrige declarados/rechazados y bloquea (con
explicación) lo sellado.

### A7. Comunicación amigable pero verificable
Las comparaciones del residente ("equivale a X km en auto") usan **constantes con
fuente y supuestos explícitos** (`ixb_format.ts`), no texto generado por IA. En el
MVP las explicaciones son plantillas deterministas: costo cero, cero alucinación;
Gemini entra en Fase 2 solo donde agrega valor (OCR, asistente conversacional).

### A8. Variables informativas separadas (no netear, §6)
Solar autoconsumida y compost se registran y se celebran (logros/tips) pero
**nunca restan** del inventario. `efluentes_tratados` nace sin factor a
propósito: ejercita el flujo real "dato registrado → sin factor → técnico asigna
factor calibrado (IPCC 2019 cap. 6) → recálculo automático".

### A9. Seeds y demo determinísticos
PRNG con semilla fija + anclaje demo derivado del hash: la demo es idéntica en
cualquier máquina, los sellos son reproducibles y el smoke E2E puede afirmar
resultados exactos. Misma técnica que land-mrv (PR #8).

---

## B. Propuestas para Fase 2/3 (priorizadas)

### B1. Sellado por lotes con árbol de Merkle (alta — costo y escala)
§10 sella 1 tx por registro. Con 30 viviendas × ~6 variables/mes ya son ~200
tx/mes por barrio; con 10 barrios y IoT (Fase 3), miles. Propuesta: acumular
sellos del día, anclar **solo la raíz de Merkle** (1 tx/día) y guardar el
proof-path por registro; la página de verificación valida hash + proof + raíz.
OpenTimestamps ya funciona así (gratis, sobre Bitcoin) — ideal como segundo
anclaje redundante. La interfaz `AnclajeChain` ya está abstraída para esto.
**Impacto: costo de gas ~99% menor, throughput ilimitado.**

### B2. Un solo backend en Fase 1.5, servicios cuando duelan (alta — foco)
Orden sugerido: (1) BFF Next.js Route Handlers + Postgres gestionado (Supabase si
se mantiene el stack ForestBlock actual, Cloud SQL si manda GCP) con el motor como
paquete compartido; (2) servicio `carbon` en Python **recién** cuando llegue
OCR/Document AI y jobs de anomalías; (3) servicio `chain` como Cloud Function
mínima (una responsabilidad: firmar y anclar). Decidir **un** proveedor de
identidad antes de Fase 2 (si el SSO IntegrityX ya es Firebase → Firebase +
custom claims y autorización en API; si no, Supabase Auth + RLS nativa) — mantener
los dos duplica la matriz de seguridad.

### B3. Cache de factores con versión de dataset (alta — costo Climatiq + reproducibilidad)
No llamar a Climatiq por cálculo: sincronizar factores usados a una tabla local
(`Factor` + `data_version` del dataset) con refresh programado (Cloud Scheduler /
n8n) y diff-report al técnico ("el factor de red 2026 cambió +4%: ¿recalibrar?").
Los cálculos siempre contra la tabla local → deterministas, auditables, gratis.

### B4. Outbox offline para la carga del residente (media — UX de campo)
El SW ya cachea el shell, y en demo la carga es local. Con API real: cola
**outbox en IndexedDB** (carga → cola → sync al reconectar), idempotente gracias
a la clave única A6 (upsert por (vivienda, variable, período)). Crítico en
barrios con señal pobre; es también la base del móvil Expo (Fase 3) sin cambiar
la API.

### B5. Gate de anomalías antes de verificar (media — calidad del dato)
Antes de BigQuery ML, reglas simples ya filtran el 90%: z-score contra el
histórico de la vivienda + rango físico por variable (kWh/m², m³/persona).
Mostrar el score en la bandeja técnica ("+310% vs. su promedio") y exigir
evidencia para verificar valores atípicos. Colab Enterprise/BQ ML después, con
los mismos umbrales como baseline.

### B6. Normalización e intensidades (media — comparabilidad)
El modelo ya guarda superficie y ocupantes: exponer **kg CO₂e/m² y por persona**
en dashboards y metas (hoy la meta es absoluta por vivienda). Evita castigar
familias numerosas y hace comparables tipologías distintas — y es lo que piden
EDGE/ISO para línea base.

### B7. IA con costo acotado y grounding (media)
- OCR: Gemini Flash multimodal con salida estructurada (JSON schema) → el wizard
  solo **pre-llena**, el residente confirma (el dato sigue siendo declarado por
  humano). Document AI si el volumen de facturas lo justifica.
- Asistente residente: Flash + grounding en los datos propios y el catálogo de
  variables; nunca inventa factores ni números — responde con los del store.
- Borradores de expediente: Gemini Pro grounded en el snapshot del reporte.
- Prototipar prompts en AI Studio antes de productivizar en Vertex (§4.5). 

### B8. Expediente firmado además de sellado (baja — confianza institucional)
El hash prueba integridad; una **firma** (KMS asimétrica de ForestBlock sobre el
sha256) prueba autoría. Agregar `signature` al sello del reporte y publicar la
clave pública en la página de verificación.

### B9. Re-secuenciar el plan de build (proceso)
Lo hecho acá adelanta los puntos 6–7 de Fase 2 (estados + hash-stamp) porque son
el **diferenciador IntegrityX** y condicionan el modelo de datos desde el día 1
(payloads canónicos, snapshots, append-only). Sugerencia para lo que sigue:
`API+DB (B2) → migrar store → OCR (B7) → Merkle (B1) → satelital → móvil`.
La capa satelital (§ fase 2, punto 9) puede ir después del móvil si el
presupuesto aprieta: los proxies de verde no bloquean la certificación GEI.

### B10. Métricas de éxito del MVP (proceso)
Instrumentar desde el día 1: % participación mensual (objetivo >80%), tiempo
mediano de carga (<5 min), % registros verificados en <30 días, % registros con
evidencia, y factores `calibrar` restantes (objetivo 0 antes del primer
expediente real).

---

*ForestBlock / IntegrityX · jul-2026 · acompaña al MVP `apps/integrityx-barrio`.*
