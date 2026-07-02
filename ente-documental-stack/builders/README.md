# Builders — entregables estructurados (.xlsx)

Scripts Python que generan los `.xlsx` del stack a partir de la config central
(`config/dataroom.config.json`). Los binarios generados **no se versionan**
(caen en `output/`, que está gitignored); se regeneran con estos scripts.

| Script | Genera |
|---|---|
| `build_appsheet_schema.py` | `MJM-FB-TI-FOR-001-V0_AppSheet_Schema_Backend.xlsx` — backend (7 pestañas: Documents, Roles, Stages, Access_Matrix, Snapshots, Shares, Audit_Log) que en Fase 3 se convierte a Google Sheet. |
| `build_checklist.py` | `MJM-FB-PR-FOR-011-V0_Checklist_Maestro_Documentacion_Verra.xlsx` — checklist Verra VCS+CCB por sprint (+ hoja `Metodologia`). |
| `build_docs.py` | `.docx`: índice (derivado del config) + esqueletos de arquitectura/gobernanza/runbook + **esqueletos de PDD por sprint** (derivados del checklist). Estilo MJM-FB. |

## Uso

```bash
cd builders
python3 -m venv .venv && source .venv/bin/activate   # opcional
pip install -r requirements.txt
python3 build_appsheet_schema.py
python3 build_checklist.py                 # o: --metodologia VM0032
python3 build_docs.py                      # o: --incluir estructurales|pdd  ·  --fecha 2026-07-02
# -> builders/output/*.xlsx  y  builders/output/*.docx
```

### `build_checklist.py --metodologia`
Default `VM0042` (Improved Agricultural Land Management, cubre pastoreo + SOC). `VM0032`
para Sustainable Grasslands. **Ojo estepa nativa**: los pastizales nativos podrían quedar
excluidos de VM0042; confirmar con el equipo técnico (ver hoja `Metodologia` del .xlsx).

### `build_docs.py --incluir`
`estructurales` (índice + arquitectura/gobernanza/runbook), `pdd` (Draft PDD + Sprints 1–8 +
QA/QC, derivados del checklist), o `todos` (default). **No** genera el contenido sustantivo del
PDD: cada requisito del checklist se vuelca como una **sección a completar** (andamiaje).

El schema de `build_appsheet_schema.py` (nombres de pestañas y columnas) está sincronizado
con `CONFIG.TABS` de `appsscript/Dataroom.gs`. Si cambiás uno, actualizá el otro.
