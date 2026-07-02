# Builders — entregables estructurados (.xlsx)

Scripts Python que generan los `.xlsx` del stack a partir de la config central
(`config/dataroom.config.json`). Los binarios generados **no se versionan**
(caen en `output/`, que está gitignored); se regeneran con estos scripts.

| Script | Genera |
|---|---|
| `build_appsheet_schema.py` | `MJM-FB-TI-FOR-001-V0_AppSheet_Schema_Backend.xlsx` — backend (5 pestañas) que en Fase 3 se convierte a Google Sheet. |
| `build_checklist.py` | `MJM-FB-PR-FOR-011-V0_Checklist_Maestro_Documentacion_Verra.xlsx` — checklist Verra VCS+CCB por sprint. |

## Uso

```bash
cd builders
python3 -m venv .venv && source .venv/bin/activate   # opcional
pip install -r requirements.txt
python3 build_appsheet_schema.py
python3 build_checklist.py
# -> builders/output/*.xlsx
```

El schema de `build_appsheet_schema.py` (nombres de pestañas y columnas) está sincronizado
con `CONFIG.TABS` de `appsscript/Dataroom.gs`. Si cambiás uno, actualizá el otro.
