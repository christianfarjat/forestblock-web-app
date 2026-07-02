# ente-documental-stack

Stack documental del **Proyecto Carbono ENTE — Río Negro (Ganadería Regenerativa)**,
estándar **Verra VCS + CCB**. Automatiza el dataroom: registro documental, generación de
entregables estructurados, y snapshots inmutables cuando un documento se aprueba para la VVB.

> Ref: handoff **MJM-FB-TI-IT-003**. Scaffold generado en la rama
> `claude/ente-carbon-data-room-5k74jw`. Los pasos que dependen de Drive/credenciales se
> corren desde tu Mac con el runbook.

## Estructura

```
ente-documental-stack/
├── config/dataroom.config.json     # fuente única: folder IDs, mapeo de archivos, roles
├── appsscript/                     # Google Apps Script (webhook de snapshots)
│   ├── Dataroom.gs
│   ├── appsscript.json
│   ├── .clasp.json.example
│   └── README.md
├── builders/                       # generadores de entregables (Python)
│   ├── build_appsheet_schema.py    # -> backend AppSheet (5 pestañas) · openpyxl
│   ├── build_checklist.py          # -> checklist Verra por sprint (--metodologia) · openpyxl
│   ├── build_docs.py               # -> .docx: índice + esqueletos · python-docx
│   ├── requirements.txt
│   └── output/                     # .xlsx/.docx generados (gitignored)
├── runbooks/
│   ├── DEPLOYMENT_RUNBOOK.md        # corrida completa (repo → Drive → Sheet → deploy)
│   └── POBLADO_DATAROOM.md          # Fase 2: subir binarios a las carpetas
└── .gitignore                       # bloquea binarios y credenciales
```

## Cómo encaja

1. **`builders/`** generan el backend `.xlsx` y el checklist a partir de `config/`.
2. **Fase 3** convierte el backend a **Google Sheet** nativo → se obtiene el `SHEET_ID`.
3. **`appsscript/Dataroom.gs`** lee ese Sheet y expone un **webhook** con acciones
   `snapshot` (copia inmutable al aprobar para VVB), `share` (comparte por rol) y
   `register` (upsert en `Documents`), disparadas por el Bot de AppSheet.

## Quickstart (local)

```bash
pip install -r builders/requirements.txt
python3 builders/build_appsheet_schema.py
python3 builders/build_checklist.py          # o: --metodologia VM0032
python3 builders/build_docs.py               # índice + esqueletos .docx
# luego seguí runbooks/DEPLOYMENT_RUNBOOK.md
```

## Convención de códigos

`MJM-FB-<AREA>-<TIPO>-<NNN>-V<n>` · p. ej. `MJM-FB-TI-FOR-001-V0` (backend AppSheet),
`MJM-FB-PR-FOR-011-V0` (checklist maestro).

## Seguridad

- El repo va **privado**. Los folder IDs y el `SHEET_ID` no son secretos, pero igual.
- `.gitignore` bloquea `*.docx/*.xlsx`, credenciales (`.clasp.json`, `client_secret*.json`,
  `service-account*.json`, `token.json`), `.env` y `*.pem/*.key`.
- El `WEBHOOK_TOKEN` del Apps Script **no** se versiona (se carga a mano en el editor).

## Pendientes manuales (por diseño de las plataformas)

- Autorizar la 1ª ejecución de `setupDataroom()` en el editor de Apps Script.
- Crear el Bot de AppSheet Automation (no tiene CLI).
- Cargar emails de VVB/compradores en `CONFIG.ROLES` cuando se designen.
