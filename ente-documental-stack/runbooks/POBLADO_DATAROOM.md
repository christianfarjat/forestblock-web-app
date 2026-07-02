# Poblado del Dataroom — Fase 2

> Ref: handoff **MJM-FB-TI-IT-003** / instructivo **MJM-FB-TI-IT-002**.
> Sube los binarios a las dos carpetas del expediente interno **sin convertir** a Google Docs.

## Carpetas destino (folder IDs)

| Carpeta | Folder ID | Esperado |
|---|---|---|
| `A_Expediente_Interno/01_PDD` | `1grdc9Vkmjw4-9aRWoNhxVvA9fKml-Qg8` | 10 archivos |
| `A_Expediente_Interno/00_Base_Habilitantes` | `1rS_0pki4wP6jFGFlupTPg_c7UvA8SAGc` | 7 archivos |

Parent del dataroom: `1ENWFAx0Arp_Gqj02Cx24jqQxyLYlroZE`.

## Mapeo de archivos → carpeta

### → 01_PDD (10)
```
MJM-FB-PR-INF-003-V0_Draft_PDD_ENTE.docx
MJM-FB-PR-INF-004-V0_PDD_Sprint1_Identidad.docx
MJM-FB-PR-INF-005-V0_PDD_Sprint2_Elegibilidad.docx
MJM-FB-PR-INF-006-V0_PDD_Sprint3_Baseline_Adicionalidad.docx
MJM-FB-PR-INF-007-V0_PDD_Sprint4_Cuantificacion_Andamiaje.docx
MJM-FB-PR-INF-008-V0_PDD_Sprint5_Monitoreo.docx
MJM-FB-PR-INF-009-V0_PDD_Sprint6_Safeguards_Stakeholders.docx
MJM-FB-PR-INF-010-V0_PDD_Sprint7_Compliance.docx
MJM-FB-PR-INF-011-V0_PDD_Sprint8_CCB.docx
MJM-FB-PR-INF-012-V0_PDD_QAQC_CrossCheck.docx
```

### → 00_Base_Habilitantes (7)
```
MJM-FB-TI-PLA-001-V0_Arquitectura_Stack_Documental_ENTE.docx
MJM-FB-PR-INF-002-V0_Matriz_Benchmarks_Documentacion_Verra.docx
MJM-FB-TI-PLA-002-V0_Dataroom_Gobernanza.docx
MJM-FB-TI-IT-001-V0_Dataroom_Deployment_Runbook.docx
MJM-FB-TI-IT-002-V0_ClaudeCode_Poblado_Dataroom.docx
MJM-FB-PR-FOR-011-V0_Checklist_Maestro_Documentacion_Verra.xlsx
00_INDICE_Stack_Documental_ENTE.docx
```

> El backend `MJM-FB-TI-FOR-001-V0_AppSheet_Schema_Backend.xlsx` **NO** va acá como binario:
> se convierte a Google Sheet nativo en la Fase 3.

## Subida

### Método A — Drive montado
```bash
DR="$HOME/Library/CloudStorage/GoogleDrive-*/Shared drives/ENTE — Dataroom Verra (MJM-FB)/A_Expediente_Interno"
cp MJM-FB-PR-INF-0*.docx "$DR/01_PDD/"
cp MJM-FB-TI-*.docx MJM-FB-PR-INF-002*.docx MJM-FB-PR-FOR-011*.xlsx 00_INDICE_*.docx "$DR/00_Base_Habilitantes/"
```

### Método B — gdrive / rclone
```bash
# gdrive:
gdrive files upload --parent 1grdc9Vkmjw4-9aRWoNhxVvA9fKml-Qg8 MJM-FB-PR-INF-004-V0_PDD_Sprint1_Identidad.docx
# rclone:
rclone copy MJM-FB-PR-INF-004-V0_PDD_Sprint1_Identidad.docx "gdrive:.../01_PDD/"
```

## Limpieza
Borrar el Google Doc de prueba mal convertido: `177EEbIhIpUaXBj8n0ABbgP9daSqgdCICgMEO1XRT8Lw`.

## Verificación
Listá ambas carpetas y confirmá **10** en `01_PDD` y **7** en `00_Base_Habilitantes`.
Reportá subidos OK / errores.
