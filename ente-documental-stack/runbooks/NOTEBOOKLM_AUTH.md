# NotebookLM — Renovación de auth (`nlm`)

> Aplica al CLI/MCP **notebooklm-mcp-cli** (comando `nlm`; tools MCP `notebook_list`, etc.).
> NotebookLM no tiene API oficial: la auth son **cookies de sesión de Google** capturadas
> de un navegador. Cuando expiran, `notebook_list` falla y hay que renovarlas.
> Doc oficial: <https://github.com/jacob-bd/notebooklm-mcp-cli/blob/main/docs/AUTHENTICATION.md>

## Síntoma

- `notebook_list` (MCP) o `nlm notebook list` falla con error de autenticación.
- `nlm login` en modo auto **no sirve en sesiones no interactivas** (Claude Code web/remoto,
  CI, contenedores): lanza un navegador Chromium vía CDP y hay que completar el login de
  Google a mano. No existe modo headless.

> **Copy-paste:** los bloques de este runbook van sin comentarios inline a propósito —
> zsh interactivo (default de macOS) no trata `#` como comentario y lo pasa como argumento.
> Copiá los comandos solos.

## Antes que nada: versión

El runbook asume **notebooklm-mcp-cli ≥ 0.8.x** (las 0.5.x difieren en comandos y flags).
Si ya lo tenés instalado, actualizá primero:

```bash
uv tool upgrade notebooklm-mcp-cli
```

## Diagnóstico rápido

Estado de las credenciales del perfil activo:

```bash
nlm login --check
```

Vía MCP: tool `server_info` → campo `auth_status`:
`configured` (OK) · `not_configured` (nunca se logueó) · `stale` (expiró → renovar) ·
`unverified` (problema de red, no de auth) · `error`.

## Renovación — Opción A: interactiva desde tu Mac (2 min)

Si el MCP/CLI corre en tu propia máquina:

```bash
nlm login
```

Abre un navegador dedicado → login de Google → extrae cookies/CSRF/email y actualiza
`~/.notebooklm-mcp-cli/profiles/<perfil>/auth.json`. Listo.

## Renovación — Opción B: no interactiva (captura manual + import)

Para entornos sin navegador (sesión remota, servidor, contenedor):

1. En tu Mac, Chrome → <https://notebooklm.google.com> (con sesión iniciada).
2. `Cmd+Option+I` (DevTools) → pestaña **Network** → filtrá: `batchexecute`.
3. Abrí cualquier notebook para disparar una request.
4. En la request, buscá el header `cookie:` → click derecho sobre el **valor** → **Copy value**.
5. Pegalo en un archivo temporal `cookies.txt` (una sola línea).
6. En la máquina donde corre `nlm`:

```bash
nlm login --manual --file /ruta/cookies.txt
```

7. Borrá `cookies.txt`.

Si el entorno remoto es **efímero** (p. ej. Claude Code web): guardá el valor como
secret/variable del entorno y corré el import en el setup script o en un hook de
`SessionStart`. Requiere `nlm` instalado (alternativa: `pipx install notebooklm-mcp-cli`):

```bash
uv tool install notebooklm-mcp-cli
```

## Ojo con `NOTEBOOKLM_COOKIES`

Si esa variable está seteada en la config (p. ej. `claude_desktop_config.json` o el env del
entorno), tiene **prioridad absoluta** sobre `auth.json`, perfiles y `nlm login`. Un valor
viejo ahí = auth vencida permanente que pisa cualquier renovación. Antes de renovar:

```bash
env | grep NOTEBOOKLM
```

Si aparece con cookies viejas: actualizala o borrala, y recién después renovà por A o B.

## Verificación

`nlm notebook list` es el equivalente CLI del tool MCP `notebook_list`:

```bash
nlm login --check
nlm notebook list
```

## Expiración y seguridad

- Las cookies duran **semanas** (algunas rotan por request); el CSRF/sesión se auto-refresca
  al inicializar el MCP. Cuando vuelva el error de auth → repetir este runbook.
- Cerrar sesión en Google o cambiar la contraseña las invalida al instante.
- Las cookies dan acceso a tu cuenta Google: **tratalas como credenciales**. No se versionan
  (ojo: `.env.local` de este repo está trackeado en git — ahí no van). Borrá el archivo
  temporal después del import.
