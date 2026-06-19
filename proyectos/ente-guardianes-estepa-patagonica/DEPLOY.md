# Deploy en Vercel — Guardianes de la Estepa (y plantilla para futuros proyectos)

> El **login de Vercel, la autorización de Git y la edición de DNS los hacés vos**. Acá están
> los pasos exactos. La landing es 100 % estática (sin build).

---

## Objetivo 1 — Publicar esta landing en Vercel

La carpeta `proyectos/ente-guardianes-estepa-patagonica/` ya es un sitio estático completo
(archivos en su raíz, rutas relativas, `vercel.json` incluido).

### Opción A — Dashboard (recomendada, sin compartir credenciales)

1. Entrá a **vercel.com → Add New… → Project**.
2. Importá el repo **`christianfarjat/forestblock-web-app`** y elegí la rama
   **`claude/laughing-noether-nhbk74`**.
3. En **Root Directory**, hacé clic en **Edit** y seleccioná la carpeta
   **`proyectos/ente-guardianes-estepa-patagonica`**.
4. **Framework Preset: `Other`**. Dejá **Build Command vacío** y **Output Directory** en `.`
   (la raíz de esa carpeta). No hace falta Install Command.
5. **Deploy.** En ~segundos tenés la URL `https://<algo>.vercel.app`.

> El `vercel.json` de la carpeta aplica `cleanUrls` (la versión EN queda como `/index.en`,
> el one-pager como `/one-pager`). Si preferís conservar las extensiones `.html`, borrá ese
> archivo o poné `"cleanUrls": false`.

### Opción B — CLI (si preferís hacerlo desde tu terminal)

```bash
npm i -g vercel
cd proyectos/ente-guardianes-estepa-patagonica
vercel          # deploy de preview (la 1ª vez pide login y vincular proyecto)
vercel --prod   # publicación a producción
```

### Verificación post-deploy

- Carga la home `/` (ES), `/index.en`, `/one-pager`, `/one-pager.en`.
- Mirá la consola del navegador: que **no haya 404** de `fonts/` ni `images/`.
- Probá responsive (380 / 768 / 1440) y el carrusel.

---

## Subdominio de marca (opcional) — `guardianes.forestblock.tech`

`forestblock.tech` se sirve desde **Webflow**, por eso **no** se puede usar la subruta
`forestblock.tech/proyectos/...` (esa ruta la controla Webflow). La vía correcta es un
**subdominio** apuntado a Vercel:

1. En **Vercel → Project → Settings → Domains**, agregá `guardianes.forestblock.tech`.
2. En el **panel DNS de `forestblock.tech`**, creá el registro que te indique Vercel —
   normalmente un **CNAME**: `guardianes` → `cname.vercel-dns.com`.
3. Esperá la propagación; Vercel emite el certificado TLS solo.

> La edición de DNS es una acción sensible: **la hacés vos**. Yo solo te indico el registro.

---

## Objetivo 2 — Usar esta landing como plantilla para futuros proyectos

Convención: **un deploy de Vercel por proyecto**, nombrado con el *slug* del proyecto
(`ente-guardianes-estepa-patagonica`, `siguiente-proyecto`, …), usado también para el
subdominio (`<slug-corto>.forestblock.tech`).

### Flujo "nuevo proyecto"

1. **Copiar** la carpeta `proyectos/ente-guardianes-estepa-patagonica/` a
   `proyectos/<nuevo-slug>/`.
2. **Reemplazar el contenido variable**: título, descripciones, imágenes (`images/`),
   links, estado/fase, metadata/OG. Todo el copy vive en `index.html` / `index.en.html`
   (no hay framework; es edición directa) más los `one-pager*.html`.
3. **Verificar** assets y enlaces relativos (consola sin 404).
4. **Desplegar** como un proyecto Vercel nuevo (Opción A o B), con su Root Directory.
5. (Opcional) **Subdominio** propio (CNAME → `cname.vercel-dns.com`).
6. Entregar la URL final.

> Mejora futura sugerida (no implementada aún): extraer los textos/imágenes variables a un
> `content.json` + un pequeño script de generación, para que crear un proyecto sea editar un
> JSON en lugar del HTML. Puedo armarlo si querés dar ese paso.

---

## Notas

- **Sin credenciales por mi parte:** login de Vercel/Git y DNS los hacés vos.
- **Rutas relativas:** el mismo paquete funciona en cualquier subdominio sin reescrituras.
- La copia en Hostinger (`public_html/proyectos/...`) **no se sirve** y puede ignorarse/borrarse.
