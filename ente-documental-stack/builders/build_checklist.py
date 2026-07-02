#!/usr/bin/env python3
"""
Builder: MJM-FB-PR-FOR-011-V0_Checklist_Maestro_Documentacion_Verra.xlsx

Checklist maestro de documentación Verra (VCS + CCB) para el PDD de ENTE,
organizado por los 8 sprints del PDD + QA/QC, con la referencia al documento
del stack que cubre cada requisito.

Uso:
    python3 build_checklist.py
Salida:
    builders/output/MJM-FB-PR-FOR-011-V0_Checklist_Maestro_Documentacion_Verra.xlsx
"""

import os

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "output")
OUT_NAME = "MJM-FB-PR-FOR-011-V0_Checklist_Maestro_Documentacion_Verra.xlsx"

HEADER_FILL = PatternFill("solid", fgColor="1F4E3D")
HEADER_FONT = Font(bold=True, color="FFFFFF")
CAT_FILL = PatternFill("solid", fgColor="E7F0EB")

# (categoria/sprint, documento_ref, [(requisito, referencia_verra, obligatorio), ...])
SECTIONS = [
    ("Sprint 1 — Identidad", "MJM-FB-PR-INF-004", [
        ("Título, proponente y datos de contacto del proyecto", "VCS Std §3.1", "Sí"),
        ("Ubicación geográfica y límites (coordenadas / KML)", "VCS Std §3.8", "Sí"),
        ("Descripción de la actividad y tecnología/práctica", "VCS Std §3.1", "Sí"),
        ("Fecha de inicio y período de acreditación (crediting period)", "VCS Std §3.5", "Sí"),
    ]),
    ("Sprint 2 — Elegibilidad", "MJM-FB-PR-INF-005", [
        ("Metodología aplicable seleccionada y justificada", "VCS Std §3.2", "Sí"),
        ("Cumplimiento de condiciones de aplicabilidad de la metodología", "Methodology applicability", "Sí"),
        ("Elegibilidad de tierras (land eligibility) y evidencia de uso previo", "AFOLU req.", "Sí"),
        ("Titularidad / derecho sobre los créditos (project ownership)", "VCS Std §3.14", "Sí"),
    ]),
    ("Sprint 3 — Baseline y Adicionalidad", "MJM-FB-PR-INF-006", [
        ("Escenario de línea base identificado y justificado", "VCS Std §3.4", "Sí"),
        ("Demostración de adicionalidad (barreras / prácticas comunes)", "VCS Std §3.4", "Sí"),
        ("Análisis de inversión si aplica", "Additionality tool", "No"),
        ("Regulatory surplus", "VCS Std §3.4", "Sí"),
    ]),
    ("Sprint 4 — Cuantificación y Andamiaje", "MJM-FB-PR-INF-007", [
        ("Ecuaciones de cuantificación de reducciones/remociones", "Methodology", "Sí"),
        ("Parámetros fijos ex-ante y fuentes", "Methodology", "Sí"),
        ("Estimación ex-ante de GHG benefits del período de acreditación", "VCS Std §3.4", "Sí"),
        ("Tratamiento de incertidumbre y buffer de no-permanencia (AFOLU)", "AFOLU Non-Permanence Risk Tool", "Sí"),
    ]),
    ("Sprint 5 — Monitoreo", "MJM-FB-PR-INF-008", [
        ("Plan de monitoreo: parámetros a monitorear ex-post", "VCS Std §3.6", "Sí"),
        ("Procedimientos de medición, QA/QC y frecuencia", "VCS Std §3.6", "Sí"),
        ("Estructura organizativa y roles de monitoreo", "VCS Std §3.6", "Sí"),
        ("Gestión de datos y trazabilidad (data management)", "VCS Std §3.6", "Sí"),
    ]),
    ("Sprint 6 — Safeguards y Stakeholders", "MJM-FB-PR-INF-009", [
        ("Consulta a stakeholders y mecanismo de feedback/grievance", "VCS Std §3.9", "Sí"),
        ("Evaluación de impactos ambientales y sociales", "VCS Std §3.10", "Sí"),
        ("Salvaguardas (no net harm) y respeto de derechos", "AFOLU / CCB", "Sí"),
        ("Public comment period documentado", "VCS Std §3.9", "Sí"),
    ]),
    ("Sprint 7 — Compliance", "MJM-FB-PR-INF-010", [
        ("Cumplimiento de leyes y regulaciones aplicables", "VCS Std §3.11", "Sí"),
        ("No doble conteo / doble emisión (double counting)", "VCS Std §3.12", "Sí"),
        ("Consideraciones AFOLU específicas (leakage, permanencia)", "VCS AFOLU Req.", "Sí"),
        ("Comercialización y registro de créditos", "VCS Registration", "No"),
    ]),
    ("Sprint 8 — CCB", "MJM-FB-PR-INF-011", [
        ("Beneficios netos de clima (Climate)", "CCB Standard G/CL", "Sí"),
        ("Beneficios netos para comunidades (Community)", "CCB Standard CM", "Sí"),
        ("Beneficios netos de biodiversidad (Biodiversity)", "CCB Standard B", "Sí"),
        ("Gold Level opcional (si aplica)", "CCB GL", "No"),
    ]),
    ("QA/QC — Cross-check", "MJM-FB-PR-INF-012", [
        ("Consistencia cruzada entre secciones del PDD", "Interno", "Sí"),
        ("Trazabilidad de números (cuantificación ↔ monitoreo)", "Interno", "Sí"),
        ("Completitud vs. plantilla VCS PD y checklist de validación", "VVB readiness", "Sí"),
        ("Versionado y control de cambios de todos los entregables", "Interno", "Sí"),
    ]),
]

HEADERS = ["item_id", "categoria", "requisito", "referencia_verra", "documento_ref", "obligatorio", "estado", "evidencia", "notas"]
ESTADOS = ["Pendiente", "En progreso", "Listo", "N/A"]


def main():
    wb = Workbook()
    ws = wb.active
    ws.title = "Checklist"
    ws.append(HEADERS)

    n = 0
    for categoria, doc_ref, items in SECTIONS:
        for requisito, ref, obligatorio in items:
            n += 1
            ws.append([f"CHK-{n:03d}", categoria, requisito, ref, doc_ref, obligatorio, "Pendiente", "", ""])

    # Estilo header.
    for col in range(1, len(HEADERS) + 1):
        c = ws.cell(row=1, column=col)
        c.fill = HEADER_FILL
        c.font = HEADER_FONT
        c.alignment = Alignment(vertical="center")
    ws.freeze_panes = "A2"

    # Sombreado por categoría (banda suave cuando cambia el sprint).
    prev = None
    shade = False
    for r in range(2, ws.max_row + 1):
        cat = ws.cell(row=r, column=2).value
        if cat != prev:
            shade = not shade
            prev = cat
        if shade:
            for col in range(1, len(HEADERS) + 1):
                ws.cell(row=r, column=col).fill = CAT_FILL

    widths = [10, 30, 52, 26, 20, 12, 14, 30, 30]
    for idx, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(idx)].width = w
    for r in range(2, ws.max_row + 1):
        ws.cell(row=r, column=3).alignment = Alignment(wrap_text=True, vertical="top")

    dv = DataValidation(type="list", formula1='"' + ",".join(ESTADOS) + '"', allow_blank=True)
    ws.add_data_validation(dv)
    dv.add(f"G2:G{ws.max_row}")

    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, OUT_NAME)
    wb.save(out_path)
    print(f"OK  {out_path}")
    print(f"    {n} requisitos en {len(SECTIONS)} secciones.")


if __name__ == "__main__":
    main()
