# Apps Script — ENTE Dataroom Automation

Proyecto standalone de Google Apps Script que automatiza el dataroom Verra de ENTE:
setup/validación, y un webhook para congelar **snapshots** inmutables cuando un documento
pasa a `Approved for VVB` (disparado por el Bot de AppSheet Automation).

## Archivos

| Archivo | Rol |
|---|---|
| `Dataroom.gs` | Lógica: `setupDataroom()`, `doPost(e)` (webhook), `snapshotFile_()`, helpers. |
| `appsscript.json` | Manifest: timezone, runtime V8, scopes OAuth, config del web app. |
| `.clasp.json.example` | Plantilla de config de clasp. Copiar a `.clasp.json` (gitignored). |

## Antes de desplegar — completar en `Dataroom.gs`

1. `CONFIG.SHEET_ID` → el ID del backend ya convertido a Google Sheet (Fase 3 del runbook).
2. `CONFIG.WEBHOOK_TOKEN` → un secreto (p. ej. un UUID). El **mismo** valor va en el Bot de AppSheet.
3. `CONFIG.ROLES` → emails de VVB/BUYERS/AUDITOR cuando se designen (INTERNAL ya viene cargado).

## Push y deploy con clasp (desde tu Mac)

`clasp` NO está en este entorno remoto; estos pasos se corren en tu máquina.

```bash
npm i -g @google/clasp
clasp login                      # una sola vez (OAuth)

cd appsscript
cp .clasp.json.example .clasp.json
clasp create --type standalone --title "ENTE Dataroom Automation"
#   ^ pega el scriptId generado en .clasp.json (o lo escribe clasp)

clasp push
clasp deploy --description "web app v1"
```

`clasp deploy` imprime el **/exec URL** del web app: esa es la URL del webhook para el Bot de AppSheet.

## Pasos manuales (por diseño de las plataformas, no automatizables por CLI)

1. **Primera autorización**: abrí el proyecto en el editor de Apps Script y ejecutá
   `setupDataroom()` una vez para aceptar los scopes de Drive/Sheets.
2. **Bot de AppSheet Automation** (se crea en la UI de AppSheet):
   - Event: `Documents` con `stage = "Approved for VVB"`.
   - Action: *Call a webhook* → URL del deploy (`/exec`).
   - Body: `{"action":"snapshot","fileId":"<<[drive_file_id]>>","token":"<CONFIG.WEBHOOK_TOKEN>"}`

## Nota de seguridad

El web app queda con acceso `ANYONE_ANONYMOUS` (para que AppSheet pueda postear sin auth de Google),
pero `doPost` **rechaza** cualquier request sin el `token` correcto. No publiques el token.
