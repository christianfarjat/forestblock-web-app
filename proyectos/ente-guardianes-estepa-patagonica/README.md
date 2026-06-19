# Guardianes de la Estepa Patagónica — Landing (HTML autocontenido)

Página pública del proyecto **ENTE — Guardianes de la Estepa Patagónica**, lista para
alojarse en Hostinger en:

```
forestblock.tech/proyectos/ente-guardianes-estepa-patagonica/
```

Construida desde cero a partir del `HANDOFF.md` (no requiere build ni framework).

## Contenido del paquete

```
ente-guardianes-estepa-patagonica/
├── index.html        ← la página completa (HTML + CSS + JS embebidos)
├── fonts/            ← Aeonik (la tipografía del sitio), cargada vía @font-face local
│   ├── Aeonik-Light.otf
│   ├── Aeonik-Regular.otf
│   ├── Aeonik-Medium.otf
│   └── Aeonik-Bold.otf
├── images/           ← acá van las fotos (ver lista abajo). Si faltan, la página
│                       degrada a un placeholder con degradado, sin romperse.
└── README.md
```

## Cómo subirlo a Hostinger

1. En el File Manager (o por FTP), entrá a la raíz pública del dominio
   (`public_html/` o el subdominio correspondiente a `forestblock.tech`).
2. Creá la carpeta `proyectos/ente-guardianes-estepa-patagonica/` si no existe.
3. Subí **todo el contenido de esta carpeta** (`index.html`, `fonts/`, `images/`) ahí dentro.
4. Verificá en `https://forestblock.tech/proyectos/ente-guardianes-estepa-patagonica/`.

> Las rutas internas son **relativas** (`images/...`, `fonts/...`), así que la página
> funciona en cualquier subcarpeta sin tocar el código.

## Imágenes (poné estos nombres exactos en `images/`)

Recomendado: horizontales ~1600px, verticales ~1200px, `.jpg`, < 500 KB.

**Carrusel (8):**
- `carrusel-01-estepa-nubes.jpg`
- `carrusel-02-atardecer-meseta-luna.jpg`
- `carrusel-03-monitoreo-coiron.jpg`
- `carrusel-04-muestreo-suelo.jpg`
- `carrusel-05-majada-merino.jpg`
- `carrusel-06-mallin-agua.jpg`
- `carrusel-07-atardecer-rosa-cerro.jpg`
- `carrusel-08-equipo-campo.jpg`

**Fauna (4):**
- `fauna-ranita-somuncura.jpg`  *(★ destacada como especie endémica)*
- `fauna-piche.jpg`
- `fauna-cauquen.jpg`
- `fauna-insecto.jpg`

**Comunidad / OG:**
- `comunidad-nazario-chico.jpg`
- `og.jpg`  *(imagen para compartir en redes / Open Graph, ~1200×630)*

> La foto de la ranita (especie muy localizada) y la foto de comunidad están **pendientes de
> confirmación** (identificación de especie y consentimiento/FPIC). No bloquean la publicación:
> mientras no estén, se muestra el placeholder.

## Editar el copy

Todo el texto vive en `index.html`. Está organizado por secciones comentadas
(`HERO`, `QUÉ ES`, `CÓMO FUNCIONA`, `GALERÍA`, `HITOS`, `IMPACTO`, `CTA`,
`PARA EMPRESAS E INVERSORES`, `FOOTER`).

### Sección comercial "Para empresas e inversores"
Tres tarjetas (fondo verde, antes del footer) dirigidas a B2B:
1. **Financiadores** → "Hablemos de inversión"
2. **Compradores de créditos** → "Quiero comprar créditos"
3. **Offtake anticipado (forward / ERPA)** → "Conversemos un offtake"

Por compliance, **no** incluyen precios, volúmenes de VCUs ni proyecciones de retorno
(eso se conversa en privado). La equivalencia "1 VCU = 1 tCO₂e" es la definición estándar
del crédito, no una cifra del proyecto.

**Ruteo:** los tres botones (y el CTA general) apuntan a
`https://forestblock.tech/contact/contacto`. Si querés separar el canal comercial del de
prensa/productores, cambiá esos `href` por un mail dedicado, por ejemplo:
`mailto:comercial@forestblock.tech?subject=Guardianes%20de%20la%20Estepa%20—%20Inversión`.

### Restricciones de comunicación (cumplir siempre)
Es comunicación pública de un proyecto **en validación**. **No** agregar: cantidades de VCUs,
valores de SOC / tCO₂e sin validar, precios de créditos, proyecciones financieras, socios no
formalizados, ni nombres individuales de productores. Usar **61.346 ha** como superficie oficial.

### Roles institucionales (usar exactamente así)
| Rol | Entidad |
|---|---|
| Titular del proyecto | **ENTE — Ente de Desarrollo de la Región Sur** |
| Developer registrado ante Verra · Tecnología MRV | **ForestBlock** (marca de **Shale Synergy SA**) |
| Socio estratégico | **MJM Energía SA** |

## Notas de implementación

- **Tokens** de marca en `:root` (variables CSS `--eg-*`), tomados de forestblock.tech.
- Clases prefijadas `eg-` para no colisionar si se inyecta dentro de otro sitio.
- **Carrusel** accesible: flechas con `aria-label`, navegación por teclado (← →) sobre la
  región, `scroll-snap`, y respeto de `prefers-reduced-motion`.
- **Header/footer** mínimos incluidos para el alojamiento standalone. Si más adelante se
  integra al layout global de forestblock.tech, se pueden quitar el `<header class="eg-topbar">`
  y el `<footer class="eg-footer">`.
- Un solo `<h1>` (nombre del proyecto); headings jerárquicos; sin overflow horizontal.
- Responsive probado a 380 / 768 / 1440 px (grids 4→2→1, split 2col→1col, slides 44%→80%).
