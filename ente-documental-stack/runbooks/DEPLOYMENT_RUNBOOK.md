# Deployment Runbook — Stack documental ENTE

> Ref: handoff **MJM-FB-TI-IT-003**. Versión corregida para correr **desde tu Mac**
> (con la cuenta Google `christian.farjat@mjmenergia.com` activa). Este scaffold de
> código ya está en la rama `claude/ente-carbon-data-room-5k74jw`; lo que sigue son
> las fases que dependen de tu máquina, Drive y credenciales.

## Diferencia con el handoff original

El handoff asumía una corrida en tu Mac con `gh`, Drive montado y `clasp` disponibles.
El scaffold (Apps Script + builders + runbooks) se generó en un entorno remoto que
**no** puede crear el repo `ente-documental-stack` aparte ni tocar tu Drive local, así
que quedó como carpeta versionada dentro de `forestblock-web-app`. Si querés el repo
propio, ver "Opción B" en Fase 1.

---

## Fase 0 · Entorno (Mac)

```bash
git --version
python3 --version
python3 -c "import openpyxl" 2>/dev/null || pip3 install -r builders/requirements.txt
```

Método de subida a Drive — elegí uno:
- **(A) Google Drive para escritorio montado**: buscá bajo
  `~/Library/CloudStorage/GoogleDrive-*/Shared drives/` la carpeta
  `ENTE — Dataroom Verra (MJM-FB)`. Si está, subís con `cp`.
- **(B) Sin mount**: instalá `rclone` (`brew install rclone`) o `gdrive` y hacé el login OAuth una vez.

## Fase 0.5 · Regenerar los .xlsx

```bash
cd builders
python3 build_appsheet_schema.py   # -> output/MJM-FB-TI-FOR-001-V0_AppSheet_Schema_Backend.xlsx
python3 build_checklist.py         # -> output/MJM-FB-PR-FOR-011-V0_Checklist_Maestro_Documentacion_Verra.xlsx
cd ..
```

Los `.docx` (PDD y demás) se editan aparte; este scaffold no los genera.

## Fase 1 · Repo GitHub (privado)

- **Opción A (recomendada para ya)**: ya vivís en `forestblock-web-app` bajo
  `ente-documental-stack/`. Sólo commit + push a la rama de trabajo.
- **Opción B (repo propio)**: desde tu Mac, con `gh` autenticado:
  ```bash
  gh auth status
  cp -R ente-documental-stack /ruta/nueva/ente-documental-stack && cd $_
  git init && git add . && git commit -m "scaffold inicial: apps script + builders + runbooks"
  gh repo create ente-documental-stack --private --source=. --push
  ```
  Verificá que **no** se stagee ningún `.docx/.xlsx/credencial` (lo bloquea `.gitignore`).

## Fase 2 · Poblar el dataroom

Ver [`POBLADO_DATAROOM.md`](./POBLADO_DATAROOM.md). Resumen: subir los 17 binarios a sus
carpetas por folder ID **sin convertir** a Google Docs, borrar el Google Doc de prueba
(`177EEbIhIpUaXBj8n0ABbgP9daSqgdCICgMEO1XRT8Lw`), y verificar 10 en `01_PDD` + 7 en
`00_Base_Habilitantes`.

## Fase 3 · Backend Sheet + Apps Script

1. Subí el backend **convirtiéndolo** a Google Sheet nativo:
   ```bash
   # rclone (import de xlsx a Google Sheet):
   rclone copy builders/output/MJM-FB-TI-FOR-001-V0_AppSheet_Schema_Backend.xlsx \
     "gdrive:ENTE — Dataroom Verra (MJM-FB)/A_Expediente_Interno/00_Base_Habilitantes" \
     --drive-import-formats xlsx
   ```
   (o Drive API con `mimeType application/vnd.google-apps.spreadsheet`, o import de `gdrive`).
   Capturá el **SHEET_ID** resultante.
2. En `appsscript/Dataroom.gs` completá:
   - `CONFIG.SHEET_ID` = ese ID.
   - `CONFIG.WEBHOOK_TOKEN` = un secreto (p. ej. un UUID).
   - `CONFIG.ROLES.INTERNAL` ya trae `["christian.farjat@mjmenergia.com"]`.
   Actualizá también `config/dataroom.config.json → backend.sheetId`.
3. Push + deploy con clasp (ver [`../appsscript/README.md`](../appsscript/README.md)):
   ```bash
   npm i -g @google/clasp && clasp login
   cd appsscript && cp .clasp.json.example .clasp.json
   clasp create --type standalone --title "ENTE Dataroom Automation"
   clasp push
   clasp deploy --description "web app v1"   # imprime el /exec URL del webhook
   ```

## Cierre · Resumen a reportar

- URL del repo (o rama), archivos en el dataroom (10 + 7), **SHEET_ID**, **web app /exec URL**.

## Queda MANUAL (no automatizable por CLI)

1. **Autorizar** la 1ª ejecución de `setupDataroom()` en el editor de Apps Script
   (consentimiento de scopes Drive/Sheets) y correrla una vez.
2. **Bot de AppSheet Automation** (UI de AppSheet):
   Event `Documents.stage = "Approved for VVB"` → *Call a webhook* al `/exec`,
   body `{"action":"snapshot","fileId":"<<[drive_file_id]>>","token":"<CONFIG.WEBHOOK_TOKEN>"}`.
3. Cargar emails de VVB/compradores en `CONFIG.ROLES` (y en la pestaña `Roles`) cuando se designen.
