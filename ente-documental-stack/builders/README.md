# Builders — entregables estructurados (.xlsx)

Scripts Python que generan los `.xlsx` del stack a partir de la config central
(`config/dataroom.config.json`). Los binarios generados **no se versionan**
(caen en `output/`, que está gitignored); se regeneran con estos scripts.

| Script | Genera |
|---|---|
| `build_appsheet_schema.py` | `MJM-FB-TI-FOR-001-V0_AppSheet_Schema_Backend.xlsx` — backend (7 pestañas: Documents, Roles, Stages, Access_Matrix, Snapshots, Shares, Audit_Log) que en Fase 3 se convierte a Google Sheet. |
| `build_checklist.py` | `MJM-FB-PR-FOR-011-V0_Checklist_Maestro_Documentacion_Verra.xlsx` — checklist Verra VCS+CCB por sprint (+ hoja `Metodologia`). |
| `build_docs.py` | `.docx`: índice (derivado del config) + esqueletos de arquitectura/gobernanza/runbook + **esqueletos de PDD por sprint** (derivados del checklist). Estilo MJM-FB. |
| `validate_config.py` | Valida `config/dataroom.config.json` (IDs con forma válida, conteos 10+7, roles, códigos/archivos duplicados). Exit 1 si hay errores. |
| `diagram.py` | Renderiza el diagrama de arquitectura (PNG, Pillow); `build_docs.py` lo embebe en el `.docx` de arquitectura. |

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

### Validación y tests

```bash
python3 validate_config.py                 # sanity de la config (exit 1 si hay errores)
pip install -r requirements-dev.txt
python3 -m pytest -q                        # corre desde builders/
```

Los tests **blindan la sincronía** backend ↔ `CONFIG.TABS` de `appsscript/Dataroom.gs`
(parsean las pestañas del `.gs` y las comparan con el workbook), además de conteos (17 docs,
50 requisitos) y los nombres de los `.docx` de PDD. Si cambiás el schema en un lado, el test falla.
